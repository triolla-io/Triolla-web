"use client";

import { useEffect, useRef } from "react";

/**
 * Footer Component
 * Single footer for all pages - loaded from shared template
 * Content managed via metadata editor at /admin/metadata (footer-metadata)
 */
export function Footer() {
  const footerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loadFooter = async () => {
      try {
        const response = await fetch("/assets/_shared/footer-template.html");
        if (!response.ok) throw new Error("Failed to load footer");
        const html = await response.text();

        if (footerRef.current) {
          footerRef.current.innerHTML = html;
        }
      } catch (error) {
        console.error("Error loading footer:", error);
      }
    };

    loadFooter();
  }, []);

  return <div ref={footerRef} />;
}
