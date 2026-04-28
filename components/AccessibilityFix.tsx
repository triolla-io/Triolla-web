"use client";

import { useEffect } from "react";

/**
 * Post-render accessibility fixes for snapshot fragments.
 * Applies WCAG improvements that can't be done during static generation:
 * - Generates alt text for images missing descriptions
 * - Ensures heading hierarchy is correct
 * - Adds ARIA labels to interactive elements
 */
export default function AccessibilityFix() {
  useEffect(() => {
    // Fix missing image alt text based on context + class names
    document.querySelectorAll("img[alt='']").forEach((img) => {
      const root = img.closest("[data-snapshot-client]");
      if (!root) return;

      // Skip explicitly decorative icons (very small, or in icon sets)
      const w = img.getAttribute("width");
      const h = img.getAttribute("height");
      if (w && h && parseInt(w) < 100 && parseInt(h) < 100) {
        const cls = img.getAttribute("class") || "";
        // These are decorative: icons, logos, badges, stars
        if (/logo|icon|badge|avatar|star|spinner|loader/i.test(cls)) {
          img.setAttribute("aria-hidden", "true");
          return;
        }
      }

      // For content images, generate alt from:
      // 1. Nearby heading or label text
      // 2. Parent section heading
      // 3. Image filename
      let altText = generateAltFromContext(img as HTMLImageElement);
      if (altText) img.setAttribute("alt", altText);
    });

    // Ensure proper heading hierarchy — convert skipped heading levels
    // e.g., <h1><h3> → <h1><h2>
    const headings = Array.from(
      document.querySelectorAll("[data-snapshot-client] h1, [data-snapshot-client] h2, [data-snapshot-client] h3, [data-snapshot-client] h4, [data-snapshot-client] h5, [data-snapshot-client] h6")
    );
    let lastLevel = 0;
    for (const h of headings) {
      const level = parseInt(h.tagName[1]);
      if (level - lastLevel > 1) {
        const corrected = lastLevel + 1;
        h.setAttribute("role", "heading");
        h.setAttribute("aria-level", String(corrected));
        lastLevel = corrected;
      } else {
        lastLevel = level;
      }
    }

    // Label any role="button" elements still missing an accessible name
    document.querySelectorAll('[data-snapshot-client] [role="button"]').forEach((btn) => {
      if (btn.getAttribute("aria-label")) return;

      // FAQ toggles: extract question text from .faq_quest
      const questSpan = btn.querySelector(".faq_quest");
      if (questSpan?.textContent?.trim()) {
        btn.setAttribute("aria-label", questSpan.textContent.trim());
        return;
      }

      // Hover-swap CTAs: use .default-text (the non-animated copy)
      const defaultText = btn.querySelector(".default-text");
      if (defaultText?.textContent?.trim()) {
        btn.setAttribute("aria-label", defaultText.textContent.trim());
        return;
      }

      const text = btn.textContent?.trim();
      if (!text || text === "test") {
        btn.setAttribute("aria-label", "Toggle submenu");
      }
    });

    // Fix owl carousel navigation buttons — injected by owl.js with no text content.
    // They exist in the pre-rendered HTML fragment so useEffect finds them at mount time.
    document.querySelectorAll<HTMLElement>(
      "[data-snapshot-client] button.owl-prev:not([aria-label]), [data-snapshot-client] button.owl-next:not([aria-label])"
    ).forEach((btn) => {
      btn.setAttribute("aria-label", btn.classList.contains("owl-prev") ? "Previous slide" : "Next slide");
    });

    // Add labels to form inputs that are missing them
    document.querySelectorAll("[data-snapshot-client] input, [data-snapshot-client] textarea, [data-snapshot-client] select").forEach((field) => {
      if (field.getAttribute("aria-label") || field.closest("label")) return;

      // Try to find adjacent label text
      const parent = field.closest("form") || field.closest(".gform");
      let label = "";
      if (parent) {
        const preceding = field.previousElementSibling;
        if (preceding?.tagName === "LABEL") {
          label = preceding.textContent || "";
        }
      }

      if (label) {
        field.setAttribute("aria-label", label.trim());
      }
    });
  }, []);

  return null;
}

function generateAltFromContext(img: HTMLImageElement): string {
  const cls = img.getAttribute("class") || "";
  const src = img.getAttribute("src") || "";
  const parent = img.parentElement as HTMLElement | null;

  // 1. Check for nearby figcaption or caption
  const figure = img.closest("figure");
  if (figure) {
    const caption = figure.querySelector("figcaption");
    if (caption?.textContent) return caption.textContent.trim();
  }

  // 2. Check parent link text
  if (parent?.tagName === "A") {
    const text = parent.textContent?.trim() || "";
    if (text && text.length > 0 && text.length < 100) return text;
  }

  // 3. Check for nearby heading in the same container
  const container = img.closest("div[class*='section'], div[class*='box'], article, div[class*='card']") as HTMLElement | null;
  if (container) {
    const heading = container.querySelector("h1, h2, h3, h4");
    if (heading?.textContent) return heading.textContent.trim().slice(0, 60);
  }

  // 4. Derive from class names
  const clsTokens = cls.split(/\s+/);
  for (const token of clsTokens) {
    if (/^(banner|hero|thumbnail|avatar|profile|featured|showcase|gallery|portfolio)/i.test(token)) {
      return token.replace(/[-_]/g, " ");
    }
  }

  // 5. Last resort: extract filename (remove hash)
  const filename = src.split("/").pop() || "";
  if (!/^[a-f0-9]{64}\.(png|jpg|webp|svg|gif)$/.test(filename)) {
    return filename.replace(/[-_]/g, " ").replace(/\.(png|jpg|webp|svg|gif)$/i, "");
  }

  return "";
}
