"use client";

import { useReducedMotion } from "framer-motion";
import { useState } from "react";

type CompanyTickerProps = {
  names: string[];
  /** CSS animation duration in seconds (default 40, matches existing `ticker` keyframes). */
  durationSec?: number;
  /** Extra classes on the outer strip container (e.g. `ticker-wrap`). */
  className?: string;
};

const itemText =
  "inline-block font-medium text-black text-[18px] leading-[1.4] sm:text-[22px] lg:text-[28px] lg:leading-[1.4] px-[14px] sm:px-[20px] lg:px-[26px]";

export default function CompanyTicker({
  names,
  durationSec = 40,
  className = "",
}: CompanyTickerProps) {
  const [paused, setPaused] = useState(false);
  const prefersReducedMotion = useReducedMotion();
  const items = [...names, ...names];

  return (
    <div
      className={`h-[70px] sm:h-[111px] overflow-hidden flex items-center ${className}`.trim()}
    >
      {prefersReducedMotion ? (
        <div
          className="flex w-full flex-wrap items-center justify-center gap-x-2 gap-y-1 px-3 py-2 sm:gap-x-3 sm:px-4 md:px-6"
          role="region"
          aria-label="Partner list"
        >
          {names.map((name, i) => (
            <span key={`${name}-${i}`} className={itemText}>
              {name}
            </span>
          ))}
        </div>
      ) : (
        <div
          className="flex w-max items-center whitespace-nowrap outline-none"
          style={{
            animation: `ticker ${durationSec}s linear infinite`,
            animationPlayState: paused ? "paused" : "running",
          }}
          onPointerEnter={() => setPaused(true)}
          onPointerLeave={() => setPaused(false)}
          onFocus={() => setPaused(true)}
          onBlur={() => setPaused(false)}
          tabIndex={0}
          role="region"
          aria-label="Scrolling partner list"
        >
          {items.map((name, i) => (
            <span key={i} className={itemText}>
              {name}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
