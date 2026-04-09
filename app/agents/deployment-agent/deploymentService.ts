import { runAgent, type AgentOptions } from "./deploymentAgent";
import { setPhase, setDone, appendLog } from "./statusStore";
import { createEmitter, deleteEmitter } from "./emitterStore";
import type { AgentLog } from "../utils/tools";

function printLog(entry: AgentLog): void {
  const prefix = `[deployment-agent][${entry.tool ?? "-"}]`;
  if      (entry.level === "error") console.error(prefix, entry.message);
  else if (entry.level === "warn")  console.warn(prefix, entry.message);
  else                              console.log(prefix, entry.message);
}

export function startDeployment(
  commitMessage: string,
  options: Omit<AgentOptions, "onPhaseChange" | "onLog" | "waitForDeploy"> = {}
): string {
  const runId  = crypto.randomUUID();
  const emitter = createEmitter(runId);
  const now    = new Date().toISOString();

  setPhase(runId, "preflight");
  emitter.emit("event", { type: "phase", phase: "preflight", updatedAt: now });

  runAgent(commitMessage, {
    ...options,
    waitForDeploy: true,
    dryRun: true,
    onPhaseChange: (phase) => {
      const updatedAt = new Date().toISOString();
      setPhase(runId, phase);
      emitter.emit("event", { type: "phase", phase, updatedAt });
    },
    onLog: (entry) => {
      appendLog(runId, entry);
      printLog(entry);
      emitter.emit("event", { type: "log", ...entry });
    },
  })
    .then(({ result }) => {
      const updatedAt = new Date().toISOString();
      setDone(runId, result);
      emitter.emit("event", { type: "done", result, updatedAt });
    })
    .catch((err) => {
      const result = { ok: false, reason: "failed", error: String(err) } as const;
      setDone(runId, result);
      emitter.emit("event", { type: "done", result, updatedAt: new Date().toISOString() });
    })
    .finally(() => deleteEmitter(runId));

  return runId;
}
