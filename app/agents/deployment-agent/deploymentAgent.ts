import { readFile, writeFile, unlink } from "fs/promises";
import { validateContentTool } from "../utils/contentValidator";
import { createGitProviderTools } from "./gitProviderTools";
import { createDeploymentProviderTools } from "./deploymentProviderTools";
import { type AgentLog, fetchWithTimeout, makeLogger, runWithRetry } from "../utils/tools";
import { diffObjects, formatDiff } from "../utils/diff";
import { readReceipt, writeReceipt } from "./receipt";
import { PATHS, getGitProviderConfig, getDeploymentProviderConfig } from "./config";
import { SITE_VERIFY_TIMEOUT_MS } from "./constants";
import type { DeploymentPipelineResult } from "./types";

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
  siteUrl?: string;        // if provided, HTTP-verify the site after a successful deploy
  dryRun?: boolean;        // simulate the full pipeline without committing or deploying
  onPhaseChange?: (phase: string) => void;
  onLog?: (entry: AgentLog) => void;
};

type Tools = {
  git:        ReturnType<typeof createGitProviderTools>;
  deployment: ReturnType<typeof createDeploymentProviderTools>;
};

// ─── Step ─────────────────────────────────────────────────────────────────────

async function step(state: AgentState, commitMessage: string, logs: AgentLog[], options: AgentOptions, tools: Tools): Promise<AgentState> {
  const { git, deployment } = tools;
  const { onLog } = options;
  const log = makeLogger(logs, onLog);

  switch (state.phase) {
    case "preflight": {
      const [github, coolify, receipt] = await Promise.all([
        runWithRetry(git.checkHealth, undefined, logs, onLog),
        runWithRetry(deployment.checkHealth, undefined, logs, onLog),
        readReceipt(),
      ]);
      if (!github.ok) return { phase: "done", result: { ok: false, reason: "failed", error: github.error } };
      if (!coolify.ok) return { phase: "done", result: { ok: false, reason: "failed", error: coolify.error } };
      if (receipt?.status === "failed") log.warn("preflight", `last deployment ${receipt.deploymentId} failed — proceeding anyway`);
      log.info("preflight", "GitHub and Coolify reachable");
      return { phase: "checking_guard" };
    }

    case "checking_guard": {
      const result = await runWithRetry(deployment.checkDeploymentRunning, undefined, logs, onLog);
      if (!result.ok) return { phase: "done", result: { ok: false, reason: "failed", error: result.error } };
      if (result.data) {
        log.info("deployment_guard", "deployment already running");
        return { phase: "done", result: { ok: false, reason: "already_running" } };
      }
      log.info("deployment_guard", "ready to deploy");
      return { phase: "reading_content" };
    }

    case "reading_content": {
      let raw: string;
      let parsed: Record<string, unknown>;
      try {
        raw = await readFile(PATHS.contentLocal, "utf8");
        parsed = JSON.parse(raw) as Record<string, unknown>;
      } catch (e) {
        return { phase: "done", result: { ok: false, reason: "failed", error: `Failed to read content file: ${String(e)}` } };
      }
      log.info("read_content", `read ${PATHS.contentLocal}`);
      return { phase: "validating", local: { raw, parsed } };
    }

    case "validating": {
      const result = await runWithRetry(validateContentTool, state.local.parsed, logs, onLog);
      if (!result.ok) {
        log.error("validate_content", result.error);
        return { phase: "done", result: { ok: false, reason: "security_violation", error: result.error } };
      }
      log.info("validate_content", "content passed security check");
      return { phase: "committing", local: state.local, commitMessage };
    }

    case "committing": {
      await writeFile(PATHS.contentBkp, state.local.raw);

      // Fetch remote to get SHA + diff
      const fetchTool = git.makeFetchRemoteFile(PATHS.contentGithub);
      const fetchResult = await runWithRetry(fetchTool, undefined, logs, onLog);
      if (!fetchResult.ok) return { phase: "done", result: { ok: false, reason: "failed", error: fetchResult.error } };

      // Diff — bail out if nothing actually changed
      const diffLines = diffObjects(fetchResult.data.content, state.local.parsed);
      // if (diffLines.length === 0) {
      //   log.info("content_diff", "no content changes, skipping commit");
      //   return { phase: "done", result: { ok: false, reason: "nothing_to_commit" } };
      // }
      for (const line of formatDiff(diffLines)) log.info("content_diff", line);

      // Bump metadata
      const remoteMeta = fetchResult.data.content.metadata as { version: number; updatedAt: string } | undefined;
      const newMeta = { version: (remoteMeta?.version ?? 0) + 1, updatedAt: new Date().toISOString() };
      const updated = { ...state.local.parsed, metadata: newMeta };
      const updatedRaw = JSON.stringify(updated, null, 2) + "\n";
      await writeFile(PATHS.contentLocal, updatedRaw);

      if (options.dryRun) {
        log.info("dry_run", `would commit version ${newMeta.version} with message: "${commitMessage}"`);
        return { phase: "done", result: { ok: true, deploymentId: "dry-run", commitHash: "dry-run", version: newMeta.version, updatedAt: newMeta.updatedAt } };
      }

      const commitResult = await runWithRetry(git.commitFile, {
        filePath: PATHS.contentGithub,
        content: updatedRaw,
        remoteFileSha: fetchResult.data.sha,
        message: commitMessage,
      }, logs, onLog);

      if (!commitResult.ok) {
        await writeFile(PATHS.contentLocal, state.local.raw); // restore before any retry
        return { phase: "done", result: { ok: false, reason: "failed", error: commitResult.error } };
      }

      log.info("git_commit", `committed ${commitResult.data.commitSha}, version ${newMeta.version}`);
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
      const result = await runWithRetry(deployment.triggerDeploy, undefined, logs, onLog);
      if (!result.ok) {
        log.error("deployment_trigger", result.error);
        return { phase: "rolling_back", commit: state.commit, reason: result.error };
      }
      log.info("deployment_trigger", `deployment started: ${result.data}`);
      await writeReceipt({
        deploymentId:  result.data,
        commitSha:     state.commit.commitSha,
        version:       state.commit.version,
        deployedAt:    new Date().toISOString(),
        commitMessage,
        status:        "triggered",
      }).catch((e) => log.warn("receipt", `failed to write receipt: ${String(e)}`));
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
      const finalStatus = await deployment.pollUntilDone(state.deploymentId, (msg) => log.info("polling", msg));
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
        const res = await fetchWithTimeout(options.siteUrl!, { timeoutMs: SITE_VERIFY_TIMEOUT_MS });
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
      const result = await runWithRetry(git.revertCommit, {
        filePath: PATHS.contentGithub,
        originalContent: state.commit.originalRaw,
        currentFileSha:  state.commit.fileSha,
      }, logs, onLog);
      if (!result.ok) log.error("git_revert", `rollback failed: ${result.error}`);
      else {
        await writeFile(PATHS.contentLocal, state.commit.originalRaw);
        log.info("git_revert", "rolled back successfully");
      }
      await writeReceipt({
        deploymentId:  "none",
        commitSha:     state.commit.commitSha,
        version:       state.commit.version,
        deployedAt:    new Date().toISOString(),
        commitMessage,
        status:        "failed",
      }).catch((e) => log.warn("receipt", `failed to write receipt: ${String(e)}`));
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
  const tools: Tools = {
    git:        createGitProviderTools(getGitProviderConfig()),
    deployment: createDeploymentProviderTools(getDeploymentProviderConfig()),
  };
  let state: AgentState = { phase: "preflight" };

  while (state.phase !== "done") {
    options.onPhaseChange?.(state.phase);
    state = await step(state, commitMessage, logs, options, tools);
  }

  // Clean up backup file regardless of outcome — no longer needed after the run
  await unlink(PATHS.contentBkp).catch(() => {}); // may not exist on first run

  return { result: state.result, logs };
}
