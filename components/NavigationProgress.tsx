"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

/**
 * Thin progress bar at the top of the page that fires on internal link clicks
 * and completes when the route changes. Gives instant visual feedback so the
 * site feels responsive even before the next page renders.
 */
export default function NavigationProgress() {
  const pathname = usePathname();
  const prevPathnameRef = useRef(pathname);
  const [width, setWidth] = useState(0);
  const [visible, setVisible] = useState(false);
  const tickRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Start the bar when the user clicks an internal link.
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const a = (e.target as Element).closest("a[href]") as HTMLAnchorElement | null;
      if (!a) return;
      const href = a.getAttribute("href") ?? "";
      // Only same-origin relative paths — skip external, hash-only, mailto, tel.
      if (!href.startsWith("/") || href.startsWith("//")) return;
      if (href.split("?")[0].split("#")[0] === pathname) return;

      if (tickRef.current) clearInterval(tickRef.current);
      setVisible(true);
      setWidth(10);

      // Fake progress: eases toward 85% but never reaches it until route lands.
      tickRef.current = setInterval(() => {
        setWidth((prev) => {
          const next = prev + (85 - prev) * 0.1;
          return Math.min(next, 85);
        });
      }, 100);
    };

    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, [pathname]);

  // Complete bar when the route resolves.
  useEffect(() => {
    if (prevPathnameRef.current === pathname) return;
    prevPathnameRef.current = pathname;

    if (tickRef.current) {
      clearInterval(tickRef.current);
      tickRef.current = null;
    }
    setWidth(100);

    const t = setTimeout(() => {
      setVisible(false);
      setWidth(0);
    }, 350);
    return () => clearTimeout(t);
  }, [pathname]);

  if (!visible) return null;

  return (
    <div
      aria-hidden="true"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        height: "3px",
        width: `${width}%`,
        background: "linear-gradient(90deg,#3088ef,#54a8ff)",
        boxShadow: "0 0 8px rgba(48,136,239,0.5)",
        zIndex: 99999,
        pointerEvents: "none",
        transition:
          width === 100
            ? "width 0.15s ease-out, opacity 0.25s ease 0.15s"
            : "width 0.15s ease-out",
        opacity: width >= 100 ? 0 : 1,
      }}
    />
  );
}
