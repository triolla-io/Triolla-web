import { readFile, writeFile } from "fs/promises";
import { join } from "path";
import type { CoolifyDeploymentStatus, DeploymentPipelineResult } from "./types";
import { validateContent, ContentSecurityError } from "./contentValidator";

// Uses GitHub API instead of local git — no git binary or SSH keys needed.
// Required env vars: GITHUB_TOKEN, GITHUB_REPO, GITHUB_BRANCH,
//                    COOLIFY_API_TOKEN, COOLIFY_API_URL, COOLIFY_APP_UUID
//                    PUBLISH_SECRET (for the /api/publish HTTP endpoint)

function coolifyHeaders(): HeadersInit {
  return {
    Authorization: `Bearer ${process.env.COOLIFY_API_TOKEN}`,
    "Content-Type": "application/json",
  };
}

function githubHeaders(): HeadersInit {
  return {
    Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
    "Content-Type": "application/json",
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
  };
}

// ─── GitHub API ───────────────────────────────────────────────────────────────

const GITHUB_REPO = process.env.GITHUB_REPO;
const GITHUB_BRANCH = process.env.GITHUB_BRANCH ?? "main";
const CONTENT_FILE_PATH = "app/deployment-agent/mock-data.json";
const CONTENT_FILE_LOCAL = join(process.cwd(), CONTENT_FILE_PATH);
const CONTENT_FILE_BKP = join(process.cwd(), "app/deployment-agent/mock-data.json.bkp");

class NothingToCommitError extends Error {}

type CommitResult = { commitHash: string; version: number; updatedAt: string };

type CommitResultWithRollback = {
  result: CommitResult;
  rollback: () => Promise<void>;
};

async function commitContentFile(commitMessage: string): Promise<CommitResultWithRollback> {
  // Read current local content
  const originalRaw = await readFile(CONTENT_FILE_LOCAL, "utf8");
  const local = JSON.parse(originalRaw) as Record<string, unknown>;

  // Security check before touching anything
  validateContent(local);

  // Save one backup
  await writeFile(CONTENT_FILE_BKP, originalRaw);

  // Get current file from GitHub to obtain SHA and compare content
  const getRes = await fetch(
    `https://api.github.com/repos/${GITHUB_REPO}/contents/${CONTENT_FILE_PATH}?ref=${GITHUB_BRANCH}`,
    { headers: githubHeaders() }
  );
  if (!getRes.ok) throw new Error(`GitHub GET failed: ${getRes.status} ${getRes.statusText}`);
  const remote = await getRes.json();
  const remoteContent = JSON.parse(Buffer.from(remote.content, "base64").toString("utf8")) as Record<string, unknown>;

  // TODO: restore nothing-to-commit check once admin panel can edit content  
  // if (JSON.stringify(local) === JSON.stringify(remoteContent)) {
  //   throw new NothingToCommitError();
  // }

  // Bump version and timestamp based on remote version (source of truth)
  const remoteMeta = remoteContent.metadata as { version: number; updatedAt: string };
  const newMeta = { version: (remoteMeta?.version ?? 0) + 1, updatedAt: new Date().toISOString() };
  (local.metadata as Record<string, unknown>) = newMeta;
  const updatedRaw = JSON.stringify(local, null, 2) + "\n";

  // Persist bumped metadata back to local file
  await writeFile(CONTENT_FILE_LOCAL, updatedRaw);

  // Push to GitHub — on failure, restore local from backup
  let putData: Record<string, unknown>;
  try {
    const putRes = await fetch(
      `https://api.github.com/repos/${GITHUB_REPO}/contents/${CONTENT_FILE_PATH}`,
      {
        method: "PUT",
        headers: githubHeaders(),
        body: JSON.stringify({
          message: commitMessage,
          content: Buffer.from(updatedRaw).toString("base64"),
          sha: remote.sha,
          branch: GITHUB_BRANCH,
        }),
      }
    );
    if (!putRes.ok) {
      const err = await putRes.json();
      throw new Error(`GitHub PUT failed: ${putRes.status} ${JSON.stringify(err)}`);
    }
    putData = await putRes.json();
  } catch (err) {
    await writeFile(CONTENT_FILE_LOCAL, originalRaw);
    throw err;
  }

  // SHA of the file after our commit — needed to revert if deploy fails
  const newFileSha = (putData.content as Record<string, unknown>).sha as string;
  const commitHash = (putData.commit as Record<string, unknown>).sha as string;

  // Rollback: revert the GitHub commit and restore local file
  const rollback = async () => {
    await fetch(
      `https://api.github.com/repos/${GITHUB_REPO}/contents/${CONTENT_FILE_PATH}`,
      {
        method: "PUT",
        headers: githubHeaders(),
        body: JSON.stringify({
          message: "revert: rollback failed deployment",
          content: Buffer.from(originalRaw).toString("base64"),
          sha: newFileSha,
          branch: GITHUB_BRANCH,
        }),
      }
    );
    await writeFile(CONTENT_FILE_LOCAL, originalRaw);
  };

  return {
    result: { commitHash, version: newMeta.version, updatedAt: newMeta.updatedAt },
    rollback,
  };
}

// ─── Coolify ──────────────────────────────────────────────────────────────────

async function fetchLatestDeployment() {
  const url = `${process.env.COOLIFY_API_URL}/api/v1/deployments/applications/${process.env.COOLIFY_APP_UUID}?take=1`;
  const res = await fetch(url, { headers: coolifyHeaders() });
  if (!res.ok) return null;
  const data = await res.json();
  return data?.deployments?.[0] ?? null;
}

async function isDeploymentAlreadyRunning(): Promise<boolean> {
  const latest = await fetchLatestDeployment();
  if (!latest) return false;
  const status: CoolifyDeploymentStatus = latest.status;
  return status === "in_progress" || status === "queued";
}

export async function getDeploymentStatus(
  deploymentId: string
): Promise<CoolifyDeploymentStatus> {
  const url = `${process.env.COOLIFY_API_URL}/api/v1/deployments/${deploymentId}`;
  const res = await fetch(url, { headers: coolifyHeaders() });
  if (!res.ok) {
    const latest = await fetchLatestDeployment();
    if (latest?.deployment_uuid === deploymentId) return latest.status as CoolifyDeploymentStatus;
    throw new Error(`Coolify API error: ${res.status} ${res.statusText}`);
  }
  const data = await res.json();
  return data.status as CoolifyDeploymentStatus;
}

async function triggerCoolifyDeploy(): Promise<string> {
  const url = `${process.env.COOLIFY_API_URL}/api/v1/deploy?uuid=${process.env.COOLIFY_APP_UUID}&force=false`;
  const res = await fetch(url, { method: "POST", headers: coolifyHeaders() });
  if (!res.ok) throw new Error(`Coolify deploy trigger failed: ${res.status} ${res.statusText}`);
  const data = await res.json();
  const deploymentId = data?.deployments?.[0]?.deployment_uuid;
  if (!deploymentId) throw new Error("No deployment UUID returned from Coolify");
  return deploymentId;
}

// ─── Pipeline ─────────────────────────────────────────────────────────────────

export async function runDeploymentPipeline(commitMessage: string): Promise<DeploymentPipelineResult> {
  const alreadyRunning = await isDeploymentAlreadyRunning();
  console.log("deployment already running?", alreadyRunning);
  if (alreadyRunning) return { ok: false, reason: "already_running" };

  let commit: CommitResult;
  let rollback: () => Promise<void>;
  try {
    ({ result: commit, rollback } = await commitContentFile(commitMessage));
    console.log("commit result", commit);
  } catch (err) {
    console.log("failed to commit", err);
    if (err instanceof NothingToCommitError) return { ok: false, reason: "nothing_to_commit" };
    if (err instanceof ContentSecurityError) return { ok: false, reason: "security_violation", error: err.message };
    return { ok: false, reason: "failed", error: err instanceof Error ? err.message : String(err) };
  }

  let deploymentId: string;
  try {
    deploymentId = await triggerCoolifyDeploy();
    console.log("coolify deploy triggered", deploymentId);
  } catch (err) {
    console.log("failed to trigger coolify deploy", err);
    await rollback().catch(() => {
      console.log("rollback failed");
    });
    console.log("rollback done");
    return { ok: false, reason: "failed", error: err instanceof Error ? err.message : String(err) };
  }

  return { ok: true, deploymentId, commitHash: commit.commitHash, version: commit.version, updatedAt: commit.updatedAt };
}
