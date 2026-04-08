import { EventEmitter } from "events";

// ─── Types ────────────────────────────────────────────────────────────────────

export type RunEvent =
  | { type: "phase"; phase: string; updatedAt: string }
  | { type: "log";   level: string; tool?: string; message: string }
  | { type: "done";  result: unknown; updatedAt: string };

// ─── Store ────────────────────────────────────────────────────────────────────

const CLEANUP_AFTER_MS = 20 * 60 * 1_000;

declare global { var _deploymentEmitters: Map<string, EventEmitter> | undefined; }
const emitters: Map<string, EventEmitter> = (globalThis._deploymentEmitters ??= new Map());

export function createEmitter(runId: string): EventEmitter {
  const emitter = new EventEmitter();
  emitters.set(runId, emitter);
  setTimeout(() => emitters.delete(runId), CLEANUP_AFTER_MS);
  return emitter;
}

export function getEmitter(runId: string): EventEmitter | undefined {
  return emitters.get(runId);
}

export function deleteEmitter(runId: string): void {
  emitters.get(runId)?.removeAllListeners();
  emitters.delete(runId);
}
