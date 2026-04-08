"use client";

import { useEffect, useState } from "react";
import type { RunStatus } from "../agents/deployment-agent/statusStore";

type PollerResult = {
  runStatus: RunStatus | null;
  timedOut: boolean;
};

const TIMEOUT_MS = 6 * 60 * 1_000;

export function useDeploymentPoller(runId: string | null): PollerResult {
  const [runStatus, setRunStatus] = useState<RunStatus | null>(null);
  const [timedOut, setTimedOut]   = useState(false);

  useEffect(() => {
    if (!runId) {
      setRunStatus(null);
      setTimedOut(false);
      return;
    }

    const source  = new EventSource(`/api/admin/publish/stream?id=${runId}`);
    const timeout = setTimeout(() => { source.close(); setTimedOut(true); }, TIMEOUT_MS);
    const done    = { received: false };

    source.onmessage = (e) => {
      const event = JSON.parse(e.data) as { type: string } & Record<string, unknown>;
      if (event.type === "phase") {
        setRunStatus({ state: "running", phase: event.phase as string, updatedAt: event.updatedAt as string });
      } else if (event.type === "done") {
        done.received = true;
        setRunStatus({ state: "done", result: event.result as (RunStatus & { state: "done" })["result"], updatedAt: event.updatedAt as string });
        source.close();
        clearTimeout(timeout);
      }
    };

    source.onerror = () => {
      source.close();
      clearTimeout(timeout);
      if (!done.received) setTimedOut(true); // ignore close-after-done
    };

    return () => {
      source.close();
      clearTimeout(timeout);
    };
  }, [runId]);

  return { runStatus, timedOut };
}
