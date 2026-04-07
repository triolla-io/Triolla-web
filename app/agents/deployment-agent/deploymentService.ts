import { runAgent, type AgentOptions } from "./agent";
import { setPhase, setDone } from "./statusStore";

export function startDeployment(
  commitMessage: string,
  options: Omit<AgentOptions, "onPhaseChange" | "waitForDeploy"> = {}
): string {
  const runId = crypto.randomUUID();
  setPhase(runId, "preflight");

  runAgent(commitMessage, {
    ...options,
    waitForDeploy: true,
    onPhaseChange: (phase) => setPhase(runId, phase),
  })
    .then(({ result, logs }) => {
      for (const entry of logs) {
        const prefix = `[deployment-agent][${entry.tool ?? "-"}]`;
        if      (entry.level === "error") console.error(prefix, entry.message);
        else if (entry.level === "warn")  console.warn(prefix, entry.message);
        else                              console.log(prefix, entry.message);
      }
      setDone(runId, result);
    })
    .catch((err) => {
      setDone(runId, { ok: false, reason: "failed", error: String(err) });
    });

  return runId;
}
