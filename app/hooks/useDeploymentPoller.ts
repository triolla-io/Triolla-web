"use client";

import { useEffect, useRef, useState } from "react";
import type { CoolifyDeploymentStatus } from "../deployment/types";

const POLL_INTERVAL_MS = 5_000;
const TIMEOUT_MS = 10 * 60 * 1_000;
const TERMINAL: CoolifyDeploymentStatus[] = ["finished", "failed", "cancelled", "error"];

type PollerResult = {
  status: CoolifyDeploymentStatus | null;
  timedOut: boolean;
};

export function useDeploymentPoller(deploymentId: string | null): PollerResult {
  const [status, setStatus] = useState<CoolifyDeploymentStatus | null>(null);
  const [timedOut, setTimedOut] = useState(false);
  const startedAt = useRef<number>(0);

  useEffect(() => {
    if (!deploymentId) {
      setStatus(null);
      setTimedOut(false);
      return;
    }

    startedAt.current = Date.now();

    const interval = setInterval(async () => {
      if (Date.now() - startedAt.current >= TIMEOUT_MS) {
        clearInterval(interval);
        setTimedOut(true);
        return;
      }

      try {
        const res = await fetch(`/api/publish/status?id=${deploymentId}`);
        const { status: next }: { status: CoolifyDeploymentStatus } = await res.json();
        setStatus(next);
        if (TERMINAL.includes(next)) clearInterval(interval);
      } catch {
        clearInterval(interval);
        setStatus("error");
      }
    }, POLL_INTERVAL_MS);

    return () => clearInterval(interval);
  }, [deploymentId]);

  return { status, timedOut };
}
