import { readFile, writeFile } from "fs/promises";
import { join } from "path";
import { validateContentTool } from "../utils/contentValidator";
import { checkGitHubHealthTool, makeFetchRemoteFileTool, commitFileTool, revertCommitTool } from "./github";
import { checkCoolifyHealthTool, checkDeploymentRunningTool, triggerDeployTool, pollUntilDone } from "./coolify";
import { type AgentLog, fetchWithTimeout, makeLogger, runWithRetry } from "../utils/tools";
import { diffObjects, formatDiff } from "../utils/diff";
import { readReceipt, writeReceipt } from "./receipt";
import type { DeploymentPipelineResult } from "./types";

// ─── File paths ───────────────────────────────────────────────────────────────

const CONTENT_FILE_GITHUB = "content/mock-data.json";
const CONTENT_FILE_LOCAL  = join(process.cwd(), "content/mock-data.json");
const CONTENT_FILE_BKP    = join(process.cwd(), "content/mock-data.json.bkp");

// ─── State ────────────────────────────────────────────────────────────────────

type LocalContent = { raw: string; parsed: Record<string, unknown> };

type CommitResult = {
  commitSha: string;
  fileSha: string;
  originalRaw: string;
  version: number;
  updatedAt: string;
};

type AgentState =
  | { phase: "preflight" }
  | { phase: "checking_guard" }
  | { phase: "reading_content" }
  | { phase: "validating";   local: LocalContent }
  | { phase: "committing";   local: LocalContent; commitMessage: string }
  | { phase: "triggering";   commit: CommitResult }
  | { phase: "polling";      commit: CommitResult; deploymentId: string }
  | { phase: "verifying";    commit: CommitResult; deploymentId: string }
  | { phase: "rolling_back"; commit: CommitResult; reason: string }
  | { phase: "done";         result: DeploymentPipelineResult };

export type AgentOptions = {
  waitForDeploy?: boolean;
  siteUrl?: string;  // if provided, HTTP-verify the site after a successful deploy
  dryRun?: boolean;  // simulate the full pipeline without committing or deploying
};

// ─── Step ─────────────────────────────────────────────────────────────────────

async function step(state: AgentState, commitMessage: string, logs: AgentLog[], options: AgentOptions): Promise<AgentState> {
  const log = makeLogger(logs);

  switch (state.phase) {
    case "preflight": {
      const [github, coolify, receipt] = await Promise.all([
        runWithRetry(checkGitHubHealthTool, undefined, logs),
        runWithRetry(checkCoolifyHealthTool, undefined, logs),
        readReceipt(),
      ]);
      if (!github.ok) return { phase: "done", result: { ok: false, reason: "failed", error: github.error } };
      if (!coolify.ok) return { phase: "done", result: { ok: false, reason: "failed", error: coolify.error } };
      if (receipt?.status === "failed") log.warn("preflight", `last deployment ${receipt.deploymentId} failed — proceeding anyway`);
      log.info("preflight", "GitHub and Coolify reachable");
      return { phase: "checking_guard" };
    }

    case "checking_guard": {
      const result = await runWithRetry(checkDeploymentRunningTool, undefined, logs);
      if (!result.ok) return { phase: "done", result: { ok: false, reason: "failed", error: result.error } };
      if (result.data) {
        log.info("coolify_check_running", "deployment already running");
        return { phase: "done", result: { ok: false, reason: "already_running" } };
      }
      log.info("coolify_check_running", "ready to deploy");
      return { phase: "reading_content" };
    }

    case "reading_content": {
      const raw = await readFile(CONTENT_FILE_LOCAL, "utf8");
      const parsed = JSON.parse(raw) as Record<string, unknown>;
      log.info("read_content", `read ${CONTENT_FILE_LOCAL}`);
      return { phase: "validating", local: { raw, parsed } };
    }

    case "validating": {
      const result = await runWithRetry(validateContentTool, state.local.parsed, logs);
      if (!result.ok) {
        log.error("validate_content", result.error);
        return { phase: "done", result: { ok: false, reason: "security_violation", error: result.error } };
      }
      log.info("validate_content", "content passed security check");
      return { phase: "committing", local: state.local, commitMessage };
    }

    case "committing": {
      await writeFile(CONTENT_FILE_BKP, state.local.raw);

      // Fetch remote to get SHA + check for nothing-to-commit (TODO: restore once admin panel exists)
      const fetchTool = makeFetchRemoteFileTool(CONTENT_FILE_GITHUB);
      const fetchResult = await runWithRetry(fetchTool, undefined, logs);
      if (!fetchResult.ok) return { phase: "done", result: { ok: false, reason: "failed", error: fetchResult.error } };

      // Diff — bail out if nothing actually changed
      const diffLines = diffObjects(fetchResult.data.content, state.local.parsed);
      if (diffLines.length === 0) {
        log.info("content_diff", "no content changes, skipping commit");
        return { phase: "done", result: { ok: false, reason: "nothing_to_commit" } };
      }
      for (const line of formatDiff(diffLines)) log.info("content_diff", line);

      // Bump metadata
      const remoteMeta = fetchResult.data.content.metadata as { version: number; updatedAt: string } | undefined;
      const newMeta = { version: (remoteMeta?.version ?? 0) + 1, updatedAt: new Date().toISOString() };
      const updated = { ...state.local.parsed, metadata: newMeta };
      const updatedRaw = JSON.stringify(updated, null, 2) + "\n";
      await writeFile(CONTENT_FILE_LOCAL, updatedRaw);

      if (options.dryRun) {
        log.info("dry_run", `would commit version ${newMeta.version} with message: "${commitMessage}"`);
        return { phase: "done", result: { ok: true, deploymentId: "dry-run", commitHash: "dry-run", version: newMeta.version, updatedAt: newMeta.updatedAt } };
      }

      const commitResult = await runWithRetry(commitFileTool, {
        filePath: CONTENT_FILE_GITHUB,
        content: updatedRaw,
        remoteFileSha: fetchResult.data.sha,
        message: commitMessage,
      }, logs);

      if (!commitResult.ok) {
        await writeFile(CONTENT_FILE_LOCAL, state.local.raw); // restore before any retry
        return { phase: "done", result: { ok: false, reason: "failed", error: commitResult.error } };
      }

      log.info("github_commit_file", `committed ${commitResult.data.commitSha}, version ${newMeta.version}`);
      return {
        phase: "triggering",
        commit: {
          commitSha:   commitResult.data.commitSha,
          fileSha:     commitResult.data.fileSha,
          originalRaw: state.local.raw,
          version:     newMeta.version,
          updatedAt:   newMeta.updatedAt,
        },
      };
    }

    case "triggering": {
      const result = await runWithRetry(triggerDeployTool, undefined, logs);
      if (!result.ok) {
        log.error("coolify_trigger_deploy", result.error);
        return { phase: "rolling_back", commit: state.commit, reason: result.error };
      }
      log.info("coolify_trigger_deploy", `deployment started: ${result.data}`);
      await writeReceipt({
        deploymentId:  result.data,
        commitSha:     state.commit.commitSha,
        version:       state.commit.version,
        deployedAt:    new Date().toISOString(),
        commitMessage,
        status:        "triggered",
      }).catch(() => {}); // receipt is best-effort
      if (options.waitForDeploy) {
        return { phase: "polling", commit: state.commit, deploymentId: result.data };
      }
      return {
        phase: "done",
        result: {
          ok: true,
          deploymentId: result.data,
          commitHash:   state.commit.commitSha,
          version:      state.commit.version,
          updatedAt:    state.commit.updatedAt,
        },
      };
    }

    case "polling": {
      const pollLogs: string[] = [];
      const finalStatus = await pollUntilDone(state.deploymentId, pollLogs);
      for (const msg of pollLogs) log.info("polling", msg);
      if (finalStatus === "finished") {
        if (options.siteUrl) {
          return { phase: "verifying", commit: state.commit, deploymentId: state.deploymentId };
        }
        return {
          phase: "done",
          result: {
            ok: true,
            deploymentId: state.deploymentId,
            commitHash:   state.commit.commitSha,
            version:      state.commit.version,
            updatedAt:    state.commit.updatedAt,
          },
        };
      }
      log.error("polling", `deployment ended with status: ${finalStatus}`);
      return { phase: "rolling_back", commit: state.commit, reason: `deployment ${finalStatus}` };
    }

    case "verifying": {
      try {
        const res = await fetchWithTimeout(options.siteUrl!, { timeoutMs: 10_000 });
        if (!res.ok) {
          log.warn("verify_site", `site returned ${res.status} — deployment may have issues`);
        } else {
          log.info("verify_site", `site is up (${res.status})`);
        }
      } catch (e) {
        log.warn("verify_site", `could not reach site: ${String(e)}`);
      }
      return {
        phase: "done",
        result: {
          ok: true,
          deploymentId: state.deploymentId,
          commitHash:   state.commit.commitSha,
          version:      state.commit.version,
          updatedAt:    state.commit.updatedAt,
        },
      };
    }

    case "rolling_back": {
      const result = await runWithRetry(revertCommitTool, {
        filePath: CONTENT_FILE_GITHUB,
        originalContent: state.commit.originalRaw,
        currentFileSha:  state.commit.fileSha,
      }, logs);
      if (!result.ok) log.error("github_revert_commit", `rollback failed: ${result.error}`);
      else {
        await writeFile(CONTENT_FILE_LOCAL, state.commit.originalRaw);
        log.info("github_revert_commit", "rolled back successfully");
      }
      await writeReceipt({
        deploymentId:  "none",
        commitSha:     state.commit.commitSha,
        version:       state.commit.version,
        deployedAt:    new Date().toISOString(),
        commitMessage,
        status:        "failed",
      }).catch(() => {});
      return { phase: "done", result: { ok: false, reason: "failed", error: state.reason } };
    }

    case "done":
      return state;
  }
}

// ─── Agent loop ───────────────────────────────────────────────────────────────

export async function runAgent(
  commitMessage: string,
  options: AgentOptions = {}
): Promise<{ result: DeploymentPipelineResult; logs: AgentLog[] }> {
  const logs: AgentLog[] = [];
  let state: AgentState = { phase: "preflight" };

  while (state.phase !== "done") {
    state = await step(state, commitMessage, logs, options);
  }

  return { result: state.result, logs };
}
