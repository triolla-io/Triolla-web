import { exec } from "child_process";
import { readFile, writeFile } from "fs/promises";
import { join } from "path";
import { promisify } from "util";
import type { CoolifyDeploymentStatus, DeploymentPipelineResult } from "./types";

const execAsync = promisify(exec);

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

async function run(cmd: string): Promise<{ stdout: string; stderr: string }> {
  const { stdout, stderr } = await execAsync(cmd, { cwd: process.cwd() });
  return { stdout: stdout.trim(), stderr: stderr.trim() };
}

function coolifyHeaders(): HeadersInit {
  return {
    Authorization: `Bearer ${process.env.COOLIFY_API_TOKEN}`,
    "Content-Type": "application/json",
  };
}

// ─── Git ─────────────────────────────────────────────────────────────────────

export async function checkGitStatus(): Promise<boolean> {
  const { stdout } = await run("git status --porcelain");
  console.log("git status --porcelain done", stdout);
  return stdout.length > 0;
}

export async function gitCommitAndPush(
  message: string
): Promise<{ commitHash: string }> {
  const safeMessage = message.replace(/"/g, "'");
  await run("git add -A");
  await run(`git commit -m "${safeMessage}"`);
  await run("git push --set-upstream origin HEAD");
  const { stdout: commitHash } = await run("git rev-parse HEAD");
  console.log("abctest!!!!commit hash done", commitHash);
  return { commitHash };
}

// ─── Coolify ──────────────────────────────────────────────────────────────────

async function fetchLatestDeployment() {
  const url = `${process.env.COOLIFY_API_URL}/api/v1/deployments/applications/${process.env.COOLIFY_APP_UUID}?take=1`;
  const res = await fetch(url, { headers: coolifyHeaders() });
  if (!res.ok) return null;
  const data = await res.json();
  return data?.deployments?.[0] ?? null;
}

export async function isDeploymentAlreadyRunning(): Promise<boolean> {
  const latest = await fetchLatestDeployment();
  if (!latest) return false;
  const status: CoolifyDeploymentStatus = latest.status;
  return status === "in_progress" || status === "queued";
}

export async function getLatestDeploymentId(): Promise<string> {
  const latest = await fetchLatestDeployment();
  if (!latest?.deployment_uuid) {
    throw new Error("No deployments found for this application");
  }
  return latest.deployment_uuid;
}

export async function getDeploymentStatus(
  deploymentId: string
): Promise<CoolifyDeploymentStatus> {
  const url = `${process.env.COOLIFY_API_URL}/api/v1/deployments/${deploymentId}`;
  const res = await fetch(url, { headers: coolifyHeaders() });
  if (!res.ok) {
    // Coolify sometimes 500s on individual deployment lookup — fall back to latest
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

export async function runHealthCheck(url: string): Promise<boolean> {
  try {
    const res = await fetch(url, { method: "GET" });
    return res.ok;
  } catch {
    return false;
  }
}

// ─── Mock Data ───────────────────────────────────────────────────────────────

const MOCK_DATA_PATH = join(process.cwd(), "app/deployment-agent/mock-data.json");

async function updateMockData(): Promise<void> {
  let data: { version: number; updatedAt: string } = { version: 0, updatedAt: "" };
  try {
    data = JSON.parse(await readFile(MOCK_DATA_PATH, "utf8"));
  } catch {
    // start fresh if missing
  }
  data.version = (data.version ?? 0) + 1;
  data.updatedAt = new Date().toISOString();
  await writeFile(MOCK_DATA_PATH, JSON.stringify(data, null, 2));
}

// ─── Pipeline ─────────────────────────────────────────────────────────────────


async function triggerCoolifyDeploy(): Promise<string> {
  const url = `${process.env.COOLIFY_API_URL}/api/v1/deploy?uuid=${process.env.COOLIFY_APP_UUID}&force=false`;
  const res = await fetch(url, { method: "POST", headers: coolifyHeaders() });
  if (!res.ok) throw new Error(`Coolify deploy trigger failed: ${res.status} ${res.statusText}`);
  const data = await res.json();
  const deploymentId = data?.deployments?.[0]?.deployment_uuid;
  if (!deploymentId) throw new Error("No deployment UUID returned from Coolify");
  return deploymentId;
}

export async function runDeploymentPipeline(commitMessage: string): Promise<DeploymentPipelineResult> {
  const alreadyRunning = await isDeploymentAlreadyRunning();
  if (alreadyRunning) return { ok: false, reason: "already_running" };

  const hasChanges = await checkGitStatus();
  if (!hasChanges) return { ok: false, reason: "nothing_to_commit" };

  await updateMockData();

  let commitHash: string;
  try {
    ({ commitHash } = await gitCommitAndPush(commitMessage));
  } catch (err) {
    return { ok: false, reason: "failed", error: err instanceof Error ? err.message : String(err) };
  }

  let deploymentId: string;
  try {
    deploymentId = await triggerCoolifyDeploy();
    console.log("deployment id", deploymentId);
  } catch (err) {
    console.log("error in deployment", err);
    return { ok: false, reason: "failed", error: err instanceof Error ? err.message : String(err) };
  }

  return { ok: true, deploymentId, commitHash };
}
