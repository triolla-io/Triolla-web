"use server";

import { runDeploymentPipeline } from "../deployment-agent/deploymentService";
import type { DeploymentPipelineResult } from "../deployment-agent/deploymentService";

export async function publishAction(message?: string): Promise<DeploymentPipelineResult> {
  const result = await runDeploymentPipeline(message ?? "chore: manual publish");
  console.log("[publishAction] result:", JSON.stringify(result));
  return result;
}
