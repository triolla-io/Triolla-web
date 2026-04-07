"use server";

import { runDeploymentPipeline as runV1 } from "../deployment-agent/deploymentService";
import { runDeploymentPipeline as runV2 } from "../deployment-agent/deploymentServiceV2";
import type { DeploymentPipelineResult } from "../deployment-agent/types";

export async function publishAction(message?: string): Promise<DeploymentPipelineResult> {
  const run = process.env.GITHUB_TOKEN ? runV2 : runV1;
  console.log(`[publishAction] run: ${process.env.GITHUB_TOKEN ? 'V2' : 'V1'}`)
  const result = await run(message ?? "chore: manual publish");
  console.log("[publishAction] result:", JSON.stringify(result));
  return result;
}
