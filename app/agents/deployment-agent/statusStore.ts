import type { DeploymentPipelineResult } from "./types";

// ─── Types ────────────────────────────────────────────────────────────────────

export type RunStatus =
  | { state: "running"; phase: string; message: string; updatedAt: string }
  | { state: "done";    result: DeploymentPipelineResult; updatedAt: string };

// ─── Phase labels ─────────────────────────────────────────────────────────────

const PHASE_MESSAGES: Record<string, string> = {
  preflight:       "Checking services…",
  checking_guard:  "Checking for active deployments…",
  reading_content: "Reading content…",
  validating:      "Validating content…",
  committing:      "Committing to GitHub…",
  triggering:      "Triggering deployment…",
  polling:         "Waiting for Coolify…",
  verifying:       "Verifying site…",
  rolling_back:    "Rolling back…",
};

export function phaseMessage(phase: string): string {
  return PHASE_MESSAGES[phase] ?? phase;
}

// ─── Store ────────────────────────────────────────────────────────────────────

const CLEANUP_AFTER_MS = 10 * 60 * 1_000;

const store = new Map<string, RunStatus>();

export function setPhase(runId: string, phase: string): void {
  store.set(runId, {
    state:     "running",
    phase,
    message:   phaseMessage(phase),
    updatedAt: new Date().toISOString(),
  });
}

export function setDone(runId: string, result: DeploymentPipelineResult): void {
  store.set(runId, { state: "done", result, updatedAt: new Date().toISOString() });
  setTimeout(() => store.delete(runId), CLEANUP_AFTER_MS);
}

export function getRunStatus(runId: string): RunStatus | undefined {
  return store.get(runId);
}
