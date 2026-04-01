"use client";

import { useState, type ReactNode } from "react";

function ChevronDown() {
  return (
    <svg width="16" height="9" viewBox="0 0 16 9" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <path
        d="M7.25749 8.24168L1.25749 2.24168C0.847439 1.83163 0.847439 1.16681 1.25749 0.756757C1.66754 0.346706 2.33236 0.346706 2.74241 0.756757L7.99995 6.01429L13.2575 0.756757C13.6675 0.346706 14.3324 0.346706 14.7424 0.756757C15.1525 1.16681 15.1525 1.83163 14.7424 2.24168L8.74241 8.24168C8.33236 8.65173 7.66754 8.65173 7.25749 8.24168Z"
        fill="black"
      />
    </svg>
  );
}

function ChevronUp() {
  return (
    <svg width="16" height="9" viewBox="0 0 16 9" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <path
        d="M8.74251 0.758319L14.7425 6.75832C15.1526 7.16837 15.1526 7.83319 14.7425 8.24324C14.3325 8.65329 13.6676 8.65329 13.2576 8.24324L8.00005 2.98571L2.74252 8.24324C2.33247 8.65329 1.66764 8.65329 1.25759 8.24324C0.847541 7.83319 0.847541 7.16837 1.25759 6.75832L7.25759 0.758319C7.66764 0.348268 8.33246 0.348268 8.74251 0.758319Z"
        fill="black"
      />
    </svg>
  );
}

export type ExpandableHeroTextProps = {
  /** First line(s) shown before expand; “…” and expand control are appended when collapsed. */
  preview: ReactNode;
  /** Extra paragraphs when expanded; collapse control is appended after the last one. */
  moreParagraphs: ReactNode[];
  className?: string;
};

export default function ExpandableHeroText({
  preview,
  moreParagraphs,
  className = "",
}: ExpandableHeroTextProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div
      className={`font-light text-[16px] md:text-[24px] lg:text-[32px] leading-[1.15] tracking-[-0.96px] text-center text-black mt-4 max-w-[900px] mx-auto ${className}`.trim()}
    >
      <p className="m-0">
        {preview}
        {!expanded && (
          <>
            <span>...</span>
            <button
              type="button"
              onClick={() => setExpanded(true)}
              className="inline-flex items-center justify-center ml-2 bg-transparent border-0 cursor-pointer p-0 align-middle"
              aria-label="Show more"
              aria-expanded={expanded}
            >
              <ChevronDown />
            </button>
          </>
        )}
      </p>
      {expanded &&
        moreParagraphs.map((content, i) => (
          <p key={i} className="m-0 mt-4">
            {content}
            {i === moreParagraphs.length - 1 && (
              <button
                type="button"
                onClick={() => setExpanded(false)}
                className="inline-flex items-center justify-center ml-2 bg-transparent border-0 cursor-pointer p-0 align-middle"
                aria-label="Show less"
                aria-expanded={expanded}
              >
                <ChevronUp />
              </button>
            )}
          </p>
        ))}
    </div>
  );
}
