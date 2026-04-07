import type { CoolifyDeploymentStatus, DeploymentPipelineResult } from "./types";

// Uses GitHub API instead of local git — no git binary or SSH keys needed.
// Required env vars: GITHUB_TOKEN, GITHUB_REPO, GITHUB_BRANCH,
//                    COOLIFY_API_TOKEN, COOLIFY_API_URL, COOLIFY_APP_UUID

const POLL_INTERVAL_MS = 5_000;
const TIMEOUT_MS = 10 * 60 * 1_000;
const TERMINAL_STATUSES = new Set<CoolifyDeploymentStatus>([
  "finished",
  "failed",
  "cancelled",
  "error",
]);

function timestamp(): string {
  return new Date().toTimeString().slice(0, 8);
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

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
const MOCK_DATA_FILE = "app/deployment-agent/mock-data.json";

async function commitMockDataUpdate(commitMessage: string): Promise<string> {
  const getRes = await fetch(
    `https://api.github.com/repos/${GITHUB_REPO}/contents/${MOCK_DATA_FILE}?ref=${GITHUB_BRANCH}`,
    { headers: githubHeaders() }
  );
  if (!getRes.ok) throw new Error(`GitHub GET failed: ${getRes.status} ${getRes.statusText}`);
  const existing = await getRes.json();

  const current = JSON.parse(Buffer.from(existing.content, "base64").toString("utf8"));
  current.version = (current.version ?? 0) + 1;
  current.updatedAt = new Date().toISOString();

  const putRes = await fetch(
    `https://api.github.com/repos/${GITHUB_REPO}/contents/${MOCK_DATA_FILE}`,
    {
      method: "PUT",
      headers: githubHeaders(),
      body: JSON.stringify({
        message: commitMessage,
        content: Buffer.from(JSON.stringify(current, null, 2) + "\n").toString("base64"),
        sha: existing.sha,
        branch: GITHUB_BRANCH,
      }),
    }
  );
  if (!putRes.ok) {
    const err = await putRes.json();
    throw new Error(`GitHub PUT failed: ${putRes.status} ${JSON.stringify(err)}`);
  }
  const data = await putRes.json();
  return data.commit.sha as string;
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

export async function pollUntilDone(
  deploymentId: string,
  logs: string[]
): Promise<CoolifyDeploymentStatus> {
  const start = Date.now();
  while (true) {
    if (Date.now() - start > TIMEOUT_MS) {
      logs.push(`[${timestamp()}] Timed out after 10 minutes`);
      return "error";
    }
    const status = await getDeploymentStatus(deploymentId);
    logs.push(`[${timestamp()}] Status: ${status}`);
    if (TERMINAL_STATUSES.has(status)) return status;
    await sleep(POLL_INTERVAL_MS);
  }
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
  console.log('Version 2!!!')
  const alreadyRunning = await isDeploymentAlreadyRunning();
  if (alreadyRunning) return { ok: false, reason: "already_running" };

  let commitHash: string;
  try {
    commitHash = await commitMockDataUpdate(commitMessage);
  } catch (err) {
    return { ok: false, reason: "failed", error: err instanceof Error ? err.message : String(err) };
  }

  let deploymentId: string;
  try {
    deploymentId = await triggerCoolifyDeploy();
  } catch (err) {
    return { ok: false, reason: "failed", error: err instanceof Error ? err.message : String(err) };
  }

  return { ok: true, deploymentId, commitHash };
}
