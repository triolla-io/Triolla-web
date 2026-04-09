import type { DeploymentPipelineResult } from "./types";
import type { AgentLog } from "../utils/tools";

// ─── Types ────────────────────────────────────────────────────────────────────

export type RunStatus =
  | { state: "running"; phase: string; updatedAt: string }
  | { state: "done";    result: DeploymentPipelineResult; updatedAt: string };

// ─── Store ────────────────────────────────────────────────────────────────────

import { DONE_TTL_MS, RUNNING_TTL_MS } from "./constants";

// Next.js can re-evaluate modules during dev (hot reload), which would reset a plain Map.
// Attaching to globalThis survives re-evaluation and keeps the store consistent across route handlers.
declare global {
  var _deploymentStatusStore:   Map<string, RunStatus>                        | undefined;
  var _deploymentLogsStore:     Map<string, AgentLog[]>                       | undefined;
  var _deploymentCleanupTimers: Map<string, ReturnType<typeof setTimeout>>    | undefined;
}
const store:   Map<string, RunStatus>                     = (globalThis._deploymentStatusStore   ??= new Map());
const logStore: Map<string, AgentLog[]>                   = (globalThis._deploymentLogsStore     ??= new Map());
const timers:  Map<string, ReturnType<typeof setTimeout>> = (globalThis._deploymentCleanupTimers ??= new Map());

function scheduleCleanup(runId: string, delayMs: number): void {
  const existing = timers.get(runId);
  if (existing) clearTimeout(existing);
  const t = setTimeout(() => { store.delete(runId); logStore.delete(runId); timers.delete(runId); }, delayMs);
  timers.set(runId, t);
}

export function setPhase(runId: string, phase: string): void {
  store.set(runId, {
    state:     "running",
    phase,
    updatedAt: new Date().toISOString(),
  });
  if (phase === "preflight") {
    logStore.set(runId, []);
    scheduleCleanup(runId, RUNNING_TTL_MS);
  }
}

export function setDone(runId: string, result: DeploymentPipelineResult): void {
  store.set(runId, { state: "done", result, updatedAt: new Date().toISOString() });
  scheduleCleanup(runId, DONE_TTL_MS); // replaces the running-TTL timer
}

export function appendLog(runId: string, entry: AgentLog): void {
  logStore.get(runId)?.push(entry);
}

export function getRunStatus(runId: string): RunStatus | undefined {
  return store.get(runId);
}

export function getRunLogs(runId: string): AgentLog[] {
  return logStore.get(runId) ?? [];
}

export function getAllRuns(): Array<{ runId: string; status: RunStatus; logs: AgentLog[] }> {
  return Array.from(store.entries()).map(([runId, status]) => ({
    runId,
    status,
    logs: logStore.get(runId) ?? [],
  }));
}
