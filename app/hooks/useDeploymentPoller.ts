"use client";

import { useEffect, useRef, useState } from "react";
import type { RunStatus } from "../agents/deployment-agent/statusStore";

const POLL_INTERVAL_MS = 5_000;
const TIMEOUT_MS = 6 * 60 * 1_000;

type PollerResult = {
  runStatus: RunStatus | null;
  timedOut: boolean;
};

export function useDeploymentPoller(runId: string | null): PollerResult {
  const [runStatus, setRunStatus] = useState<RunStatus | null>(null);
  const [timedOut, setTimedOut]   = useState(false);
  const startedAt = useRef<number>(0);

  useEffect(() => {
    if (!runId) {
      setRunStatus(null);
      setTimedOut(false);
      return;
    }

    startedAt.current = Date.now();

    async function poll(intervalRef?: ReturnType<typeof setInterval>) {
      if (Date.now() - startedAt.current >= TIMEOUT_MS) {
        if (intervalRef) clearInterval(intervalRef);
        setTimedOut(true);
        return;
      }
      try {
        const res = await fetch(`/api/admin/publish/status?id=${runId}`);
        if (!res.ok) return; // transient — keep polling
        const data: RunStatus = await res.json();
        setRunStatus(data);
        if (data.state === "done" && intervalRef) clearInterval(intervalRef);
      } catch {
        // network error — keep polling until timeout
      }
    }

    poll();
    const interval = setInterval(() => poll(interval), POLL_INTERVAL_MS);
    return () => clearInterval(interval);
  }, [runId]);

  return { runStatus, timedOut };
}
