import { NextResponse } from "next/server";
import { getAllRuns, type RunStatus } from "../../../agents/deployment-agent/statusStore";

function summarise(status: RunStatus): string {
  if (status.state === "running") {
    return `Running — phase: ${status.phase}`;
  }
  const { result } = status;
  if (result.ok) return `Succeeded — v${result.version} · deployment ${result.deploymentId}`;
  const reasons: Record<string, string> = {
    already_running:   "Skipped — deployment already in progress",
    nothing_to_commit: "Skipped — no content changes",
    security_violation: "Blocked — security violation",
    failed:            `Failed — ${result.error ?? "unknown error"}`,
  };
  return reasons[result.reason] ?? "Failed";
}

function timeAgo(iso: string): string {
  const seconds = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
  if (seconds < 60)  return `${seconds}s ago`;
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  return `${Math.floor(seconds / 3600)}h ago`;
}

export async function GET() {
  const runs = getAllRuns();
  return NextResponse.json({
    count: runs.length,
    runs: runs.map(({ runId, status, logs }) => ({
      runId,
      state:     status.state,
      summary:   summarise(status),
      updatedAt: status.updatedAt,
      age:       timeAgo(status.updatedAt),
      logs,
    })),
  });
}
