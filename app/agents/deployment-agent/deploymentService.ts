import { runAgent, type AgentOptions } from "./agent";
import { setPhase, setDone, appendLog } from "./statusStore";
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
  const runId = crypto.randomUUID();
  setPhase(runId, "preflight");

  runAgent(commitMessage, {
    ...options,
    waitForDeploy: true,
    onPhaseChange: (phase) => setPhase(runId, phase),
    onLog: (entry) => {
      appendLog(runId, entry);
      printLog(entry);
    },
  })
    .then(({ result }) => setDone(runId, result))
    .catch((err)       => setDone(runId, { ok: false, reason: "failed", error: String(err) }));

  return runId;
}
