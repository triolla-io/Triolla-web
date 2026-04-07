"use server";

import { runDeploymentPipeline } from "../deployment/deploymentService";
import type { DeploymentPipelineResult } from "../deployment/deploymentService";

export async function publishAction(message?: string): Promise<DeploymentPipelineResult> {
  const result = await runDeploymentPipeline(message ?? "chore: manual publish");
  console.log("[publishAction] result:", JSON.stringify(result));
  return result;
}
