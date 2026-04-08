import { type Tool, fetchWithTimeout, isRetryableStatus } from "../utils/tools";
import type { DeploymentProviderConfig } from "./config";
import type { CoolifyDeploymentStatus } from "./types";

export const TERMINAL_STATUSES = new Set<CoolifyDeploymentStatus>(["finished", "failed", "cancelled", "error"]);

// ─── Factory ──────────────────────────────────────────────────────────────────

export function createDeploymentProviderTools(cfg: DeploymentProviderConfig) {
  const headers = (): HeadersInit => ({
    Authorization: `Bearer ${cfg.token}`,
    "Content-Type": "application/json",
  });

  const checkHealth: Tool<void, void> = {
    name: "deployment_provider_health",
    maxAttempts: 2,
    async execute() {
      try {
        const res = await fetchWithTimeout(`${cfg.apiUrl}/api/v1/version`, { headers: headers() });
        if (!res.ok) return { ok: false, retryable: isRetryableStatus(res.status), error: `Deployment provider unreachable: ${res.status}` };
        return { ok: true, data: undefined };
      } catch (e) {
        return { ok: false, retryable: true, error: `Deployment provider unreachable: ${String(e)}` };
      }
    },
  };

  const checkDeploymentRunning: Tool<void, boolean> = {
    name: "deployment_provider_check_running",
    maxAttempts: 3,
    async execute() {
      try {
        const res = await fetchWithTimeout(
          `${cfg.apiUrl}/api/v1/deployments/applications/${cfg.appUuid}?take=1`,
          { headers: headers() }
        );
        if (!res.ok) return { ok: false, retryable: isRetryableStatus(res.status), error: `Deployment provider ${res.status}` };
        const data = await res.json();
        const status: CoolifyDeploymentStatus = data?.deployments?.[0]?.status;
        return { ok: true, data: status === "in_progress" || status === "queued" };
      } catch (e) {
        return { ok: false, retryable: true, error: String(e) };
      }
    },
  };

  const triggerDeploy: Tool<void, string> = {
    name: "deployment_provider_trigger",
    maxAttempts: 2,
    async execute() {
      try {
        const res = await fetchWithTimeout(
          `${cfg.apiUrl}/api/v1/deploy?uuid=${cfg.appUuid}&force=false`,
          { method: "POST", headers: headers() }
        );
        if (!res.ok) return { ok: false, retryable: isRetryableStatus(res.status), error: `Deployment provider trigger ${res.status}` };
        const data = await res.json();
        const deploymentId = data?.deployments?.[0]?.deployment_uuid;
        if (!deploymentId) return { ok: false, retryable: false, error: "No deployment ID returned from deployment provider" };
        return { ok: true, data: deploymentId as string };
      } catch (e) {
        return { ok: false, retryable: true, error: String(e) };
      }
    },
  };

  async function getDeploymentStatus(deploymentId: string): Promise<CoolifyDeploymentStatus> {
    const res = await fetchWithTimeout(
      `${cfg.apiUrl}/api/v1/deployments/${deploymentId}`,
      { headers: headers() }
    );
    if (!res.ok) throw new Error(`Deployment provider API error: ${res.status} ${res.statusText}`);
    const data = await res.json();
    return data.status as CoolifyDeploymentStatus;
  }

  async function pollUntilDone(
    deploymentId: string,
    onLog: (msg: string) => void,
    options: { intervalMs?: number; timeoutMs?: number } = {}
  ): Promise<CoolifyDeploymentStatus> {
    const { intervalMs = 10_000, timeoutMs = 10 * 60 * 1_000 } = options;
    const start = Date.now();
    while (true) {
      if (Date.now() - start > timeoutMs) { onLog("Timed out"); return "error"; }
      const status = await getDeploymentStatus(deploymentId);
      onLog(`Status: ${status}`);
      if (TERMINAL_STATUSES.has(status)) return status;
      await new Promise<void>((r) => setTimeout(r, intervalMs));
    }
  }

  return { checkHealth, checkDeploymentRunning, triggerDeploy, getDeploymentStatus, pollUntilDone };
}
