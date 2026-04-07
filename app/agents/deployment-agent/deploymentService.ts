import { runAgent, type AgentOptions } from "./agent";
import { getDeploymentStatus, pollUntilDone } from "./coolify";
import type { DeploymentPipelineResult } from "./types";

export { getDeploymentStatus, pollUntilDone };

export async function runDeploymentPipeline(commitMessage: string, options: AgentOptions = {}): Promise<DeploymentPipelineResult> {
  const { result, logs } = await runAgent(commitMessage, options);

  for (const entry of logs) {
    const prefix = `[deployment-agent][${entry.tool ?? "-"}]`;
    if      (entry.level === "error") console.error(prefix, entry.message);
    else if (entry.level === "warn")  console.warn(prefix, entry.message);
    else                              console.log(prefix, entry.message);
  }

  return result;
}
