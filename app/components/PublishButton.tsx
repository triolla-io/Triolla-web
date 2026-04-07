"use client";

import { useEffect, useState } from "react";
import { useDeploymentPoller } from "../hooks/useDeploymentPoller";
import type { DeploymentPipelineResult } from "../deployment-agent/types";

type StartPhase = "idle" | "starting" | "nothing_to_commit" | "already_running" | "start_failed";

const COLORS = {
  idle: "#6366f1",
  polling: "#f59e0b",
  finished: "#22c55e",
  failed: "#ef4444",
  muted: "#6b7280",
};

type Props = {
  initialVersion: number;
  initialUpdatedAt: string;
};

export function PublishButton({ initialVersion, initialUpdatedAt }: Props) {
  const [phase, setPhase] = useState<StartPhase>("idle");
  const [deploymentId, setDeploymentId] = useState<string | null>(null);
  const [content, setContent] = useState({ version: initialVersion, updatedAt: initialUpdatedAt });

  const { status, timedOut } = useDeploymentPoller(deploymentId);

  const isPolling = deploymentId !== null && !timedOut && status !== "finished" && status !== "failed" && status !== "cancelled" && status !== "error";
  const isFinished = status === "finished";
  const isFailed = timedOut || status === "failed" || status === "cancelled" || status === "error";

  useEffect(() => {
    if ((isFinished || isFailed) && deploymentId) {
      const t = setTimeout(() => { setPhase("idle"); setDeploymentId(null); }, 4000);
      return () => clearTimeout(t);
    }
  }, [isFinished, isFailed, deploymentId]);

  async function handlePublish() {
    setPhase("starting");
    setDeploymentId(null);

    let result: DeploymentPipelineResult;
    try {
      const res = await fetch("/api/publish", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: `chore: manual publish - ${new Date().toISOString()}` }),
      });
      result = await res.json();
    } catch {
      setPhase("start_failed");
      setTimeout(() => setPhase("idle"), 4000);
      return;
    }

    if (!result.ok) {
      setPhase(
        result.reason === "nothing_to_commit" ? "nothing_to_commit" :
        result.reason === "already_running" ? "already_running" : "start_failed"
      );
      setTimeout(() => setPhase("idle"), 4000);
      return;
    }

    setContent({ version: result.version, updatedAt: result.updatedAt });
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
      <span style={{ display: "block" }}>{label}</span>
      <span style={{ display: "block", fontSize: 10, opacity: 0.75, fontWeight: 400 }}>
        v{content.version}{content.updatedAt ? ` · ${new Date(content.updatedAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}` : ""}
      </span>
    </button>
  );
}
