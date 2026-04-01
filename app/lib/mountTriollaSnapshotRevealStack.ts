import { mountAboutUsReveal } from "../about-us/aboutUsReveal";
import { mountTechnologyReveal } from "../technology/technologyReveal";
import { mountTriollaBotBlackWrapReveal } from "./mountTriollaBotBlackWrapReveal";
import { mountTriollaPortfolioTemplateFixes } from "./mountTriollaPortfolioTemplateFixes";

/**
 * Presets for scroll / `.show` restoration after a Triolla body fragment is injected.
 * - **technology** — default for home, portfolio, technology, and most theme pages (`mountTechnologyReveal`).
 * - **about** — About Us–specific observers + equalheight / parallax (`mountAboutUsReveal`).
 */
export type TriollaSnapshotRevealPreset = "technology" | "about";

function mountTriollaSnapshotRevealStackNow(
  root: HTMLElement,
  preset: TriollaSnapshotRevealPreset,
): () => void {
  const disposePortfolio = mountTriollaPortfolioTemplateFixes(root);
  const disposeBotBlack = mountTriollaBotBlackWrapReveal(root);
  const disposeReveal =
    preset === "about" ? mountAboutUsReveal(root) : mountTechnologyReveal(root);
  return () => {
    disposePortfolio();
    disposeBotBlack();
    disposeReveal();
  };
}

/**
 * Generic mounts for **all** Triolla HTML snapshot routes (run after CSS + JS + innerHTML):
 *
 * 1. **Portfolio template fixes** (no-op if `.portfoli_lists` is absent).
 * 2. **Reveal preset** — IntersectionObserver `.show` (and about-only scroll helpers).
 *
 * **Deferred arm:** Callers typically invoke this in the same `useEffect` tick as
 * `setState("ready")`, while the snapshot root is still `visibility: hidden`.
 * Registering `IntersectionObserver` in that state can miss callbacks for sections
 * like `.abthretop` / `.abthrebot` (home “Why startups…”). We arm after
 * `requestAnimationFrame` ×2 + `setTimeout(0)` so React has committed `visible` first.
 */
export function mountTriollaSnapshotRevealStack(
  root: HTMLElement,
  preset: TriollaSnapshotRevealPreset,
): () => void {
  let innerDispose: (() => void) | undefined;
  let cancelled = false;
  let timeoutId: number | undefined;
  let rafOuter = 0;
  let rafInner = 0;

  const arm = () => {
    if (cancelled) return;
    /* Theme `all.js` does `jQuery(window).on('load', () => body.addClass('loaded'))` — that never runs after
     * async snapshot script injection because `load` already fired. Without `body.loaded`, `.enter-y` blocks
     * stay `opacity:0` (see animation.css: `.loaded .show .enter-y`). */
    document.body.classList.add("loaded");
    innerDispose?.();
    innerDispose = mountTriollaSnapshotRevealStackNow(root, preset);
  };

  rafOuter = requestAnimationFrame(() => {
    rafInner = requestAnimationFrame(() => {
      if (cancelled) return;
      timeoutId = window.setTimeout(arm, 0);
    });
  });

  return () => {
    cancelled = true;
    cancelAnimationFrame(rafOuter);
    cancelAnimationFrame(rafInner);
    if (timeoutId !== undefined) window.clearTimeout(timeoutId);
    innerDispose?.();
    document.body.classList.remove("loaded");
  };
}
