"use server";

import { runDeploymentPipeline } from "../deployment/deploymentService";
import type { DeploymentPipelineResult } from "../deployment/deploymentService";

export async function publishAction(message?: string): Promise<DeploymentPipelineResult> {
  return runDeploymentPipeline(message ?? "chore: manual publish");
}
