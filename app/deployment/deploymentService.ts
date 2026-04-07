import { exec } from "child_process";
import { promisify } from "util";
import type { CoolifyDeploymentStatus } from "./types";

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
  console.log("git add -A done");
  await run(`git commit -m "${safeMessage}"`);
  console.log("git push --set-upstream origin HEAD done");
  await run("git push --set-upstream origin HEAD");
  console.log("git rev-parse HEAD done");
  const { stdout: commitHash } = await run("git rev-parse HEAD");
  console.log("!!!commit hash done", commitHash);
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

// ─── Pipeline ─────────────────────────────────────────────────────────────────

export type DeploymentPipelineResult =
  | { ok: true; deploymentId: string; commitHash: string }
  | { ok: false; reason: "already_running" | "nothing_to_commit" | "failed"; error?: string };

export async function runDeploymentPipeline(commitMessage: string): Promise<DeploymentPipelineResult> {
  const alreadyRunning = await isDeploymentAlreadyRunning();
  console.log("already running?", alreadyRunning);
  if (alreadyRunning) return { ok: false, reason: "already_running" };

  const hasChanges = await checkGitStatus();
  console.log("has changes?", hasChanges);
  if (!hasChanges) return { ok: false, reason: "nothing_to_commit" };

  let commitHash: string;
  try {
    ({ commitHash } = await gitCommitAndPush(commitMessage));
    console.log("commit hash", commitHash);
  } catch (err) {
    console.log("error", err);
    return { ok: false, reason: "failed", error: err instanceof Error ? err.message : String(err) };
  }

  await sleep(3000);

  let deploymentId: string;
  try {
    deploymentId = await getLatestDeploymentId();
  } catch (err) {
    return { ok: false, reason: "failed", error: err instanceof Error ? err.message : String(err) };
  }

  return { ok: true, deploymentId, commitHash };
}
