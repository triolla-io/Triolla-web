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

    // Mark images redundant when their alt text duplicates adjacent visible text.
    // Screen readers would read the text twice — make the image decorative instead.
    document.querySelectorAll<HTMLImageElement>("[data-snapshot-client] img[alt]").forEach((img) => {
      const alt = img.getAttribute("alt")?.trim();
      if (!alt) return;
      // Check parent link text (image inside <a> with same visible text)
      const parentLink = img.closest("a");
      if (parentLink) {
        const linkText = Array.from(parentLink.childNodes)
          .filter((n) => n.nodeType === Node.TEXT_NODE)
          .map((n) => n.textContent?.trim())
          .join(" ")
          .trim();
        if (linkText && linkText.toLowerCase() === alt.toLowerCase()) {
          img.setAttribute("alt", "");
          img.setAttribute("aria-hidden", "true");
          return;
        }
      }
      // Check sibling heading/span text in same container
      const container = img.parentElement;
      if (container) {
        const siblingText = Array.from(container.querySelectorAll("h1,h2,h3,h4,h5,h6,span,p"))
          .map((el) => el.textContent?.trim())
          .find((t) => t && t.toLowerCase() === alt.toLowerCase());
        if (siblingText) {
          img.setAttribute("alt", "");
          img.setAttribute("aria-hidden", "true");
        }
      }
    });

    // Fix heading hierarchy by replacing skipped-level heading elements with correct-level tags.
    // aria-level attribute alone is insufficient — axe-core's heading-order rule checks the native
    // tag level. Actual DOM element replacement is required for Lighthouse to pass.
    const headings = Array.from(
      document.querySelectorAll("[data-snapshot-client] h1, [data-snapshot-client] h2, [data-snapshot-client] h3, [data-snapshot-client] h4, [data-snapshot-client] h5, [data-snapshot-client] h6")
    );
    let lastLevel = 0;
    for (const h of headings) {
      const level = parseInt(h.tagName[1]);
      if (level - lastLevel > 1) {
        const corrected = Math.min(lastLevel + 1, 6);
        const replacement = document.createElement(`h${corrected}`);
        for (const attr of Array.from(h.attributes)) {
          replacement.setAttribute(attr.name, attr.value);
        }
        while (h.firstChild) replacement.appendChild(h.firstChild);
        h.parentNode?.replaceChild(replacement, h);
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

    // Fix native <button> elements missing accessible text (not covered by role="button" loop above)
    document.querySelectorAll<HTMLElement>(
      "[data-snapshot-client] button:not([aria-label]):not([aria-labelledby])"
    ).forEach((btn) => {
      if (btn.textContent?.trim()) return;
      const questSpan = btn.querySelector(".faq_quest");
      if (questSpan?.textContent?.trim()) {
        btn.setAttribute("aria-label", questSpan.textContent.trim());
      }
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

  // Second pass: runs as soon as owl.js initializes any carousel (adds 'owl-loaded' class).
  // owl.js injects <div> children directly into <ul class="owl-carousel"> and wraps <li> items in
  // <div class="owl-item">, making them invalid list structure. Suppress with role="presentation".
  // Also labels owl dot/prev/next buttons which owl.js injects with no accessible text.
  // Uses owl-loaded class as the trigger — fires much earlier than body.loaded (~800ms).
  useEffect(() => {
    const applyPostOwlFixes = () => {
      // Suppress invalid list structure: <ul> with <div> children injected by owl.js
      document.querySelectorAll<HTMLElement>(
        "[data-snapshot-client] ul.owl-carousel"
      ).forEach((ul) => {
        ul.setAttribute("role", "presentation");
      });

      // Suppress "li not in ul": owl.js wraps each <li> in <div class="owl-item">
      // making the li's parent a div, not ul. Add role="presentation" to suppress the error.
      document.querySelectorAll<HTMLElement>(
        "[data-snapshot-client] .owl-item > li, [data-snapshot-client] .owl-item li"
      ).forEach((li) => {
        li.setAttribute("role", "presentation");
      });

      // Label owl prev/next nav buttons — owl.js injects them with no accessible text
      document.querySelectorAll<HTMLElement>(
        "[data-snapshot-client] button.owl-prev:not([aria-label]), [data-snapshot-client] button.owl-next:not([aria-label])"
      ).forEach((btn) => {
        btn.setAttribute("aria-label", btn.classList.contains("owl-prev") ? "Previous slide" : "Next slide");
      });

      // Label owl dot buttons (pagination indicators) — injected by owl.js with no text or label
      document.querySelectorAll<HTMLElement>(
        "[data-snapshot-client] button.owl-dot:not([aria-label])"
      ).forEach((btn, i) => {
        btn.setAttribute("aria-label", `Go to slide ${i + 1}`);
      });

      // Re-check any remaining unlabeled buttons after owl.js DOM changes
      document.querySelectorAll<HTMLElement>(
        "[data-snapshot-client] button:not([aria-label]):not([aria-labelledby])"
      ).forEach((btn) => {
        if (btn.textContent?.trim()) return;
        const questSpan = btn.querySelector(".faq_quest");
        if (questSpan?.textContent?.trim()) {
          btn.setAttribute("aria-label", questSpan.textContent.trim());
        }
      });
    };

    // Watch for owl-loaded class being added to any carousel — fires when owl.js finishes init,
    // much earlier than body.loaded. Fall back to body.loaded if no carousels on this page.
    const carousels = Array.from(
      document.querySelectorAll<HTMLElement>("[data-snapshot-client] .owl-carousel")
    );

    if (carousels.length === 0) {
      // No carousels — still run for non-owl button fixes after body.loaded
      if (document.body.classList.contains("loaded")) {
        applyPostOwlFixes();
        return;
      }
      const bodyObserver = new MutationObserver(() => {
        if (document.body.classList.contains("loaded")) {
          bodyObserver.disconnect();
          applyPostOwlFixes();
        }
      });
      bodyObserver.observe(document.body, { attributes: true, attributeFilter: ["class"] });
      return () => bodyObserver.disconnect();
    }

    // Carousels exist — check if already initialized
    const allLoaded = carousels.every((c) => c.classList.contains("owl-loaded"));
    if (allLoaded) {
      applyPostOwlFixes();
      return;
    }

    // Watch for owl-loaded being added; also set a hard fallback at 2s
    let done = false;
    const finish = () => {
      if (done) return;
      done = true;
      carouselObserver.disconnect();
      applyPostOwlFixes();
    };
    const carouselObserver = new MutationObserver(() => {
      if (carousels.some((c) => c.classList.contains("owl-loaded"))) finish();
    });
    for (const c of carousels) {
      carouselObserver.observe(c, { attributes: true, attributeFilter: ["class"] });
    }
    const fallback = setTimeout(finish, 2000);
    return () => {
      carouselObserver.disconnect();
      clearTimeout(fallback);
    };
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
