"use client";

import { useEffect, useState } from "react";

// GDPR: stores only a server-generated UUID identifying a deployment run, not personal data.
// Cleared automatically when the run finishes or expires.
const STORAGE_KEY = "deployment_run_id";

export function useRunIdPersistence() {
  const [runId, setRunIdState] = useState<string | null>(null);

  // On mount: restore runId from localStorage and verify it's still active
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return;

    fetch(`/api/admin/publish/status?id=${stored}`)
      .then((res) => {
        if (!res.ok) {
          // Run expired or not found — clear stale entry
          localStorage.removeItem(STORAGE_KEY);
        } else {
          res.json().then((data) => {
            if (data.state === "done") {
              localStorage.removeItem(STORAGE_KEY);
            } else {
              setRunIdState(stored);
            }
          });
        }
      })
      .catch(() => localStorage.removeItem(STORAGE_KEY));
  }, []);

  function setRunId(id: string | null) {
    setRunIdState(id);
    if (id) {
      localStorage.setItem(STORAGE_KEY, id);
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  }

  function clearRunId() {
    setRunIdState(null);
    localStorage.removeItem(STORAGE_KEY);
  }

  return { runId, setRunId, clearRunId };
}
