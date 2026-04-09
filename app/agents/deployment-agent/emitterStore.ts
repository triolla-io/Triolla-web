import { EventEmitter } from "events";
import { RUNNING_TTL_MS } from "./constants";

// ─── Types ────────────────────────────────────────────────────────────────────

export type RunEvent =
  | { type: "phase"; phase: string; updatedAt: string }
  | { type: "log";   level: string; tool?: string; message: string }
  | { type: "done";  result: unknown; updatedAt: string };

// ─── Store ────────────────────────────────────────────────────────────────────

declare global {
  var _deploymentEmitters:       Map<string, EventEmitter>                      | undefined;
  var _deploymentEmitterTimers:  Map<string, ReturnType<typeof setTimeout>>     | undefined;
}
const emitters: Map<string, EventEmitter>                  = (globalThis._deploymentEmitters      ??= new Map());
const timers:   Map<string, ReturnType<typeof setTimeout>> = (globalThis._deploymentEmitterTimers ??= new Map());

export function createEmitter(runId: string): EventEmitter {
  const emitter = new EventEmitter();
  emitters.set(runId, emitter);
  // Safety-net: clean up if agent crashes before emitting "done"
  const t = setTimeout(() => { emitter.removeAllListeners(); emitters.delete(runId); timers.delete(runId); }, RUNNING_TTL_MS);
  timers.set(runId, t);
  return emitter;
}

export function getEmitter(runId: string): EventEmitter | undefined {
  return emitters.get(runId);
}

export function deleteEmitter(runId: string): void {
  const t = timers.get(runId);
  if (t) { clearTimeout(t); timers.delete(runId); }
  emitters.get(runId)?.removeAllListeners();
  emitters.delete(runId);
}
