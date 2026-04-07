import { type Tool, fetchWithTimeout, isRetryableStatus } from "../utils/tools";
import type { CoolifyDeploymentStatus } from "./types";

function headers(): HeadersInit {
  return { Authorization: `Bearer ${process.env.COOLIFY_API_TOKEN}`, "Content-Type": "application/json" };
}

const API_URL  = process.env.COOLIFY_API_URL;
const APP_UUID = process.env.COOLIFY_APP_UUID;

export const TERMINAL_STATUSES = new Set<CoolifyDeploymentStatus>(["finished", "failed", "cancelled", "error"]);

// ─── Tools ────────────────────────────────────────────────────────────────────

export const checkCoolifyHealthTool: Tool<void, void> = {
  name: "coolify_health",
  maxAttempts: 2,
  async execute() {
    try {
      const res = await fetchWithTimeout(`${API_URL}/api/v1/version`, { headers: headers() });
      if (!res.ok) return { ok: false, retryable: isRetryableStatus(res.status), error: `Coolify unreachable: ${res.status}` };
      return { ok: true, data: undefined };
    } catch (e) {
      return { ok: false, retryable: true, error: `Coolify unreachable: ${String(e)}` };
    }
  },
};

export const checkDeploymentRunningTool: Tool<void, boolean> = {
  name: "coolify_check_running",
  maxAttempts: 3,
  async execute() {
    try {
      const res = await fetchWithTimeout(`${API_URL}/api/v1/deployments/applications/${APP_UUID}?take=1`, { headers: headers() });
      if (!res.ok) return { ok: false, retryable: isRetryableStatus(res.status), error: `Coolify ${res.status}` };
      const data = await res.json();
      const status: CoolifyDeploymentStatus = data?.deployments?.[0]?.status;
      return { ok: true, data: status === "in_progress" || status === "queued" };
    } catch (e) {
      return { ok: false, retryable: true, error: String(e) };
    }
  },
};

export const triggerDeployTool: Tool<void, string> = {
  name: "coolify_trigger_deploy",
  maxAttempts: 2,
  async execute() {
    try {
      const res = await fetchWithTimeout(
        `${API_URL}/api/v1/deploy?uuid=${APP_UUID}&force=false`,
        { method: "POST", headers: headers() }
      );
      if (!res.ok) return { ok: false, retryable: isRetryableStatus(res.status), error: `Coolify deploy ${res.status}` };
      const data = await res.json();
      const deploymentId = data?.deployments?.[0]?.deployment_uuid;
      if (!deploymentId) return { ok: false, retryable: false, error: "No deployment UUID returned from Coolify" };
      return { ok: true, data: deploymentId as string };
    } catch (e) {
      return { ok: false, retryable: true, error: String(e) };
    }
  },
};

// ─── Status + polling (used by client poller API route) ───────────────────────

export async function getDeploymentStatus(deploymentId: string): Promise<CoolifyDeploymentStatus> {
  const res = await fetchWithTimeout(`${API_URL}/api/v1/deployments/${deploymentId}`, { headers: headers() });
  if (!res.ok) throw new Error(`Coolify API error: ${res.status} ${res.statusText}`);
  const data = await res.json();
  return data.status as CoolifyDeploymentStatus;
}

export async function pollUntilDone(
  deploymentId: string,
  logs: string[],
  options: { intervalMs?: number; timeoutMs?: number } = {}
): Promise<CoolifyDeploymentStatus> {
  const { intervalMs = 5_000, timeoutMs = 10 * 60 * 1_000 } = options;
  const start = Date.now();

  while (true) {
    if (Date.now() - start > timeoutMs) {
      logs.push("Timed out");
      return "error";
    }
    const status = await getDeploymentStatus(deploymentId);
    logs.push(`Status: ${status}`);
    if (TERMINAL_STATUSES.has(status)) return status;
    await new Promise<void>((r) => setTimeout(r, intervalMs));
  }
}
