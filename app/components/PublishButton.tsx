"use client";

import { useState } from "react";
import { publishAction } from "../actions/publish";
import { useDeploymentPoller } from "../hooks/useDeploymentPoller";

type StartPhase = "idle" | "starting" | "nothing_to_commit" | "already_running" | "start_failed";

const COLORS = {
  idle: "#6366f1",
  polling: "#f59e0b",
  finished: "#22c55e",
  failed: "#ef4444",
  muted: "#6b7280",
};

export function PublishButton() {
  const [phase, setPhase] = useState<StartPhase>("idle");
  const [deploymentId, setDeploymentId] = useState<string | null>(null);
  const { status, timedOut } = useDeploymentPoller(deploymentId);

  const isPolling = deploymentId !== null && !timedOut && status !== "finished" && status !== "failed" && status !== "cancelled" && status !== "error";
  const isFinished = status === "finished";
  const isFailed = timedOut || status === "failed" || status === "cancelled" || status === "error";

  if ((isFinished || isFailed) && deploymentId) {
    setTimeout(() => { setPhase("idle"); setDeploymentId(null); }, 4000);
  }

  async function handlePublish() {
    setPhase("starting");
    setDeploymentId(null);

    const result = await publishAction("chore: manual publish");

    if (!result.ok) {
      setPhase(
        result.reason === "nothing_to_commit" ? "nothing_to_commit" :
        result.reason === "already_running" ? "already_running" : "start_failed"
      );
      setTimeout(() => setPhase("idle"), 4000);
      return;
    }

    setPhase("idle");
    setDeploymentId(result.deploymentId);
  }

  const label =
    isFailed ? (timedOut ? "Timed out" : "Failed") :
    isFinished ? "Published!" :
    isPolling ? `Deploying${status ? ` (${status})` : "…"}` :
    phase === "starting" ? "Starting…" :
    phase === "nothing_to_commit" ? "Nothing to commit" :
    phase === "already_running" ? "Already deploying" :
    phase === "start_failed" ? "Failed" :
    "Publish";

  const bg =
    isFailed || phase === "start_failed" ? COLORS.failed :
    isFinished ? COLORS.finished :
    isPolling ? COLORS.polling :
    phase === "nothing_to_commit" || phase === "already_running" ? COLORS.muted :
    COLORS.idle;

  return (
    <button
      onClick={handlePublish}
      disabled={phase === "starting" || isPolling}
      aria-label="Publish site"
      style={{
        position: "fixed",
        top: 16,
        right: 16,
        zIndex: 9999,
        padding: "8px 18px",
        background: bg,
        color: "#fff",
        border: "none",
        borderRadius: 8,
        cursor: phase === "starting" || isPolling ? "default" : "pointer",
        fontWeight: 600,
        fontSize: 14,
        transition: "background 0.2s",
        fontFamily: "inherit",
      }}
    >
      {label}
    </button>
  );
}
