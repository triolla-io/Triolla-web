"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

/**
 * Key for snapshot `useEffect` dependency lists. Changes when:
 * - the App Router pathname changes (client navigations), and
 * - the browser restores the page from the back/forward cache (`pageshow` + `persisted`).
 *
 * Without the bfcache branch, React can still have `phase === "ready"` while the injected
 * HTML and theme observers are invalid after a history navigation, so nothing paints until a full reload.
 */
export function useSnapshotHistoryRestoreKey(): string {
  const pathname = usePathname() ?? "";
  const [bfcacheTick, setBfcacheTick] = useState(0);

  useEffect(() => {
    const onPageShow = (e: PageTransitionEvent) => {
      if (e.persisted) setBfcacheTick((n) => n + 1);
    };
    window.addEventListener("pageshow", onPageShow);
    return () => window.removeEventListener("pageshow", onPageShow);
  }, []);

  return `${pathname}\0${bfcacheTick}`;
}
