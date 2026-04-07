export type DeploymentStatus =
  | "success"
  | "failed"
  | "timeout"
  | "nothing_to_commit"
  | "already_running";

export type DeploymentResult = {
  status: DeploymentStatus;
  commitHash?: string;
  deploymentId?: string;
  duration: number;
  logs: string[];
  error?: string;
};

export type CoolifyDeploymentStatus =
  | "queued"
  | "in_progress"
  | "finished"
  | "failed"
  | "cancelled"
  | "error";

export type DeploymentPipelineResult =
  | { ok: true; deploymentId: string; commitHash: string }
  | { ok: false; reason: "already_running" | "nothing_to_commit" | "failed"; error?: string };
