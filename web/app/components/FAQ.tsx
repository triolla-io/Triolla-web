"use client";

import { useEffect, useRef } from "react";

/**
 * FAQ Component
 * Single FAQ section for all pages - loaded from shared template
 * Content managed via metadata editor at /admin/metadata (faq-metadata)
 */
export function FAQ() {
  const faqRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loadFAQ = async () => {
      try {
        const response = await fetch("/assets/_shared/faq-template.html");
        if (!response.ok) throw new Error("Failed to load FAQ");
        const html = await response.text();

        if (faqRef.current) {
          faqRef.current.innerHTML = html;
          
          // Re-initialize FAQ interactions after HTML is injected
          initFAQInteractions();
        }
      } catch (error) {
        console.error("Error loading FAQ:", error);
      }
    };

    const initFAQInteractions = () => {
      // Add click handlers for FAQ expand/collapse
      const faqTitles = faqRef.current?.querySelectorAll('.faqtitle a');
      faqTitles?.forEach((title) => {
        title.addEventListener('click', (e) => {
          e.preventDefault();
          const box = (title as HTMLElement).closest('.port_faq_box');
          box?.classList.toggle('active');
        });
      });
    };

    loadFAQ();
  }, []);

  return <div ref={faqRef} />;
}
