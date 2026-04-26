"use client";

import { useLayoutEffect, useState } from "react";
import { forbiddenTooltip, isForbiddenElement } from "./forbiddenZones";

type Props = {
  root: HTMLElement | null;
  active: boolean;
};

export function HoverOverlay({ root, active }: Props) {
  const [box, setBox] = useState<{ top: number; left: number; width: number; height: number } | null>(null);
  const [forbidden, setForbidden] = useState(false);

  useLayoutEffect(() => {
    if (!root || !active) {
      setBox(null);
      return;
    }
    const onMove = (e: MouseEvent) => {
      const t = e.target as Element | null;
      if (!t || !root.contains(t)) {
        setBox(null);
        return;
      }
      setForbidden(isForbiddenElement(t));
      const r = (t as HTMLElement).getBoundingClientRect();
      setBox({ top: r.top, left: r.left, width: r.width, height: r.height });
    };
    const onLeave = () => setBox(null);
    root.addEventListener("mousemove", onMove, { passive: true });
    root.addEventListener("mouseleave", onLeave, { passive: true });
    return () => {
      root.removeEventListener("mousemove", onMove);
      root.removeEventListener("mouseleave", onLeave);
    };
  }, [root, active]);

  if (!active || !box) return null;

  return (
    <>
      <div
        style={{
          position: "fixed",
          top: box.top,
          left: box.left,
          width: box.width,
          height: box.height,
          border: forbidden ? "2px solid #c62828" : "1px solid #1a73e8",
          pointerEvents: "none",
          zIndex: 999990,
          borderRadius: 2,
        }}
      />
      {forbidden && (
        <div
          style={{
            position: "fixed",
            top: box.top + box.height + 4,
            left: box.left,
            background: "#c62828",
            color: "#fff",
            fontSize: 12,
            padding: "4px 8px",
            borderRadius: 4,
            zIndex: 999991,
            pointerEvents: "none",
            maxWidth: 280,
          }}
        >
          {forbiddenTooltip()}
        </div>
      )}
    </>
  );
}
