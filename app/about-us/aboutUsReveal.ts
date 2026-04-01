/**
 * Replaces inline scroll handlers that lived outside <body> in the WordPress export.
 * Theme CSS (style-new.css) keeps key blocks at opacity:0 until .show is added.
 */

import { runTriollaEqualheightInRoot } from "../lib/runTriollaEqualheight";

const SHOW_SELECTORS = [
  ".portfolio_text",
  ".design_wrap",
  ".abonelftone",
  ".abonelfttwo",
  ".abonerighttop",
  ".abonerightbot",
  ".abservtop",
  ".abservlistdiv1",
  ".abservlistdiv2",
  ".abservlistdiv3",
  ".abthretop",
  ".abthrebot",
  ".abthrebut",
  ".ableartop",
  ".ablearlist",
] as const;

function isRoughlyInViewport(el: Element): boolean {
  const r = el.getBoundingClientRect();
  const vh = window.innerHeight || 0;
  return r.bottom > 0 && r.top < vh * 0.95;
}

export function mountAboutUsReveal(root: HTMLElement): () => void {
  const scheduleEqualHeight = () => {
    requestAnimationFrame(() => runTriollaEqualheightInRoot(root));
  };

  const io = new IntersectionObserver(
    (entries) => {
      let added = false;
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        entry.target.classList.add("show");
        io.unobserve(entry.target);
        added = true;
      }
      if (added) scheduleEqualHeight();
    },
    { root: null, threshold: 0, rootMargin: "0px" },
  );

  for (const sel of SHOW_SELECTORS) {
    root.querySelectorAll(sel).forEach((node) => io.observe(node));
  }

  const flushAlreadyVisible = () => {
    let added = false;
    for (const sel of SHOW_SELECTORS) {
      root.querySelectorAll(sel).forEach((node) => {
        if (!isRoughlyInViewport(node)) return;
        node.classList.add("show");
        io.unobserve(node);
        added = true;
      });
    }
    if (added) scheduleEqualHeight();
  };
  requestAnimationFrame(() => requestAnimationFrame(flushAlreadyVisible));
  const lateFlushId = window.setTimeout(() => {
    flushAlreadyVisible();
    scheduleEqualHeight();
  }, 200);

  const onScrollDesign = () => {
    const h3 = root.querySelector(".top_design_text h3");
    const wrap = root.querySelector(".design_wrap");
    if (!h3 || !wrap) return;
    const rect = h3.getBoundingClientRect();
    const anchor = rect.top + window.scrollY;
    if (window.scrollY >= anchor) {
      wrap.classList.add("startani");
    }
  };

  const onScrollParallax = () => {
    const top = window.scrollY;
    for (const sel of [".abonelftone", ".abonelfttwo"] as const) {
      const container = root.querySelector(sel);
      if (!container) continue;
      const rect = container.getBoundingClientRect();
      if (rect.bottom <= 0 || rect.top >= window.innerHeight) continue;
      const offset = rect.top - top;
      container.querySelectorAll("img").forEach((img) => {
        (img as HTMLElement).style.top = `${offset / 8}px`;
      });
    }
  };

  window.addEventListener("scroll", onScrollDesign, { passive: true });
  window.addEventListener("scroll", onScrollParallax, { passive: true });
  onScrollDesign();
  onScrollParallax();

  const onResize = () => {
    runTriollaEqualheightInRoot(root);
    onScrollParallax();
  };
  window.addEventListener("resize", onResize);

  requestAnimationFrame(() => {
    runTriollaEqualheightInRoot(root);
    requestAnimationFrame(() => runTriollaEqualheightInRoot(root));
  });

  return () => {
    window.clearTimeout(lateFlushId);
    io.disconnect();
    window.removeEventListener("scroll", onScrollDesign);
    window.removeEventListener("scroll", onScrollParallax);
    window.removeEventListener("resize", onResize);
  };
}
