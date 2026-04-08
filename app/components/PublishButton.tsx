"use client";

import { useEffect, useRef, useState } from "react";
import { useDeploymentPoller } from "../hooks/useDeploymentPoller";

const PHASE_LABELS: Record<string, string> = {
  preflight:       "Checking services…",
  checking_guard:  "Checking services…",
  reading_content: "Validating content…",
  validating:      "Validating content…",
  committing:      "Deploying…",
  triggering:      "Deploying…",
  polling:         "Deploying…",
  verifying:       "Verifying site…",
  rolling_back:    "Rolling back…",
};

const COLORS = {
  idle:     "#6366f1",
  running:  "#f59e0b",
  finished: "#22c55e",
  failed:   "#ef4444",
  muted:    "#6b7280",
};

type Props = {
  initialVersion: number;
  initialUpdatedAt: string;
};

export function PublishButton({ initialVersion, initialUpdatedAt }: Props) {
  const [isStarting, setIsStarting] = useState(false);
  const [runId, setRunId]           = useState<string | null>(null);
  const [content, setContent]       = useState({ version: initialVersion, updatedAt: initialUpdatedAt });
  const [startError, setStartError] = useState<string | null>(null);

  const { runStatus, timedOut } = useDeploymentPoller(runId);

  const isRunning  = runId !== null && !timedOut && runStatus?.state !== "done";
  const isDone     = runStatus?.state === "done";
  const doneResult = isDone ? runStatus.result : null;
  const isFinished = isDone && doneResult?.ok === true;
  const isFailed   = timedOut || (isDone && doneResult?.ok === false && doneResult.reason === "failed");
  const isMuted    = isDone && doneResult?.ok === false &&
    (doneResult.reason === "nothing_to_commit" || doneResult.reason === "already_running");

  // Reset after terminal state (not on timeout — user must retry manually)
  useEffect(() => {
    if (isDone && runId) {
      const t = setTimeout(() => { setRunId(null); setStartError(null); }, 4000);
      return () => clearTimeout(t);
    }
  }, [isDone, runId]);

  // Update version display on success
  useEffect(() => {
    if (isFinished && doneResult?.ok) {
      setContent({ version: doneResult.version, updatedAt: doneResult.updatedAt });
    }
  }, [isFinished, doneResult]);

  async function handlePublish() {
    setIsStarting(true);
    setStartError(null);
    try {
      const res = await fetch("/api/admin/publish", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: `chore: manual publish - ${new Date().toISOString()}` }),
      });
      if (!res.ok) { setStartError("Failed to start"); setTimeout(() => setStartError(null), 4000); return; }
      const { runId: id } = await res.json();
      setRunId(id);
    } catch {
      setStartError("Failed to start");
      setTimeout(() => setStartError(null), 4000);
    } finally {
      setIsStarting(false);
    }
  }

  const label =
    timedOut                                                        ? "Timed out" :
    isFinished                                                      ? "Published!" :
    isFailed                                                        ? "Failed" :
    isMuted && doneResult?.reason === "nothing_to_commit"           ? "Nothing to commit" :
    isMuted && doneResult?.reason === "already_running"             ? "Already deploying" :
    isRunning ? (runStatus?.state === "running" ? (PHASE_LABELS[runStatus.phase] ?? runStatus.phase) : "Starting…") :
    isStarting                                                      ? "Starting…" :
    startError                                                      ? "Failed" :
    "Publish";

  const bg =
    isFailed || startError          ? COLORS.failed :
    isFinished                      ? COLORS.finished :
    isRunning || isStarting         ? COLORS.running :
    isMuted                         ? COLORS.muted :
    COLORS.idle;

  // Fade label + color smoothly, with a minimum display time so fast transitions don't flash
  const MIN_LABEL_MS = 2000;
  const FADE_MS = 120;

  const [displayLabel, setDisplayLabel] = useState(label);
  const [displayBg,    setDisplayBg]    = useState(bg);
  const [labelOpacity, setLabelOpacity] = useState(1);
  const labelShownAt = useRef<number>(Date.now());
  const fadeTimer    = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (label === displayLabel && bg === displayBg) return;
    if (fadeTimer.current) clearTimeout(fadeTimer.current);
    const elapsed = Date.now() - labelShownAt.current;
    const waitMs  = Math.max(0, MIN_LABEL_MS - elapsed);
    fadeTimer.current = setTimeout(() => {
      setLabelOpacity(0);
      fadeTimer.current = setTimeout(() => {
        setDisplayLabel(label);
        setDisplayBg(bg);
        setLabelOpacity(1);
        labelShownAt.current = Date.now();
      }, FADE_MS);
    }, waitMs);
    return () => { if (fadeTimer.current) clearTimeout(fadeTimer.current); };
  }, [label, bg]); // eslint-disable-line react-hooks/exhaustive-deps

  const subtitle =
    isFailed && doneResult?.ok === false && doneResult.error
      ? doneResult.error
      : `v${content.version}${content.updatedAt ? ` · ${new Date(content.updatedAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}` : ""}`;

  return (
    <button
      onClick={handlePublish}
      disabled={isStarting || isRunning}
      aria-label="Publish site"
      style={{
        position:     "fixed",
        top:          16,
        right:        16,
        zIndex:       9999,
        width:        220,
        padding:      "8px 18px",
        background:   displayBg,
        color:        "#fff",
        border:       "none",
        borderRadius: 8,
        cursor:       isStarting || isRunning ? "default" : "pointer",
        fontWeight:   600,
        fontSize:     14,
        textAlign:    "center",
        transition:   "background 0.2s",
        fontFamily:   "inherit",
      }}
    >
      <span style={{ display: "block", opacity: labelOpacity, transition: "opacity 0.12s" }}>{displayLabel}</span>
      <span style={{ display: "block", fontSize: 10, opacity: 0.75, fontWeight: 400 }}>
        {subtitle}
      </span>
    </button>
  );
}
