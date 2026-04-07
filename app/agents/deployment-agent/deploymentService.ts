import { runAgent, type AgentOptions } from "./agent";
import { createCoolifyTools } from "./coolify";
import { getCoolifyConfig } from "./config";
import type { DeploymentPipelineResult } from "./types";

export function getDeploymentStatus(deploymentId: string) {
  return createCoolifyTools(getCoolifyConfig()).getDeploymentStatus(deploymentId);
}

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
