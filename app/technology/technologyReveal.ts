/**
 * Inline scroll + .visible() handlers from the WordPress export (after </html>).
 * Theme CSS keeps these blocks at opacity:0 until .show.
 *
 * Home (`triolla-io-home`) also relied on a second inline block that adds .show to
 * `.abthretop` / `.abthrebot` (Why startups…), `.arbutnew`, `.portfolio_why` — that
 * script is stripped from body fragments, so we observe those here too.
 *
 * Portfolio hero: `.portfolio_text.show h1` etc. — `.portfolio_text` is observed here.
 * Call sites should use **`mountTriollaSnapshotRevealStack(root, "technology")`** from
 * `web/app/lib/mountTriollaSnapshotRevealStack.ts` (includes portfolio template fixes + this reveal).
 */

import { runTriollaEqualheightInRoot } from "../lib/runTriollaEqualheight";

const SHOW_SELECTORS = [
  ".portfolio_text",
  ".company_triker",
  ".design_wrap",
  ".design_bullets ul",
  ".partners_with",
  ".abthretop",
  ".abthrebot",
  ".arbutnew",
  ".portfolio_why",
  ".why_wrap",
  ".global_logos",
  ".global_con",
  ".portfolio_faq_wrap",
  /** Contact strip + footer: theme `all.js` toggles these on scroll; we skip `all.js` on consolidated pages. */
  ".blogmidbotwrap",
  ".footmobdiv",
  ".footer_top",
  ".footer_menu_wrap",
  ".footmoblogos",
  ".footer_bottom",
  ".footer_bot_socail",
  ".techonebot",
  ".technmidtwo",
  ".technmidthree",
  /** Services page (`page-service`): lists use `.enter-y` under these blocks; theme expects them + `body.loaded`. */
  ".servicemid",
  ".servbranding",
  ".servdevloptop",
  ".servdevbotrgt",
  /** Service detail (`servdetail_content`): article hero + copy use opacity until `.show` (see style-new.css). */
  ".post_featureimg",
  ".artbold",
  ".artnormtext",
] as const;

function isRoughlyInViewport(el: Element): boolean {
  const r = el.getBoundingClientRect();
  const vh = window.innerHeight || 0;
  return r.bottom > 0 && r.top < vh * 0.95;
}

function refreshAbmobileOwlInNode(node: Element): void {
  if (!(node instanceof HTMLElement) || !node.classList.contains("abthrebot")) return;
  const $ = (window as unknown as { jQuery?: (el: Element) => { trigger: (e: string) => void } })
    .jQuery;
  if (!$) return;
  node.querySelectorAll("ul.abmobile.owl-carousel.owl-loaded").forEach((ul) => {
    $(ul).trigger("refresh.owl.carousel");
  });
}

export function mountTechnologyReveal(root: HTMLElement): () => void {
  const scheduleEqualHeight = () => {
    requestAnimationFrame(() => runTriollaEqualheightInRoot(root));
  };

  const io = new IntersectionObserver(
    (entries) => {
      let added = false;
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        entry.target.classList.add("show");
        refreshAbmobileOwlInNode(entry.target);
        io.unobserve(entry.target);
        added = true;
      }
      if (added) scheduleEqualHeight();
    },
    /* threshold 0: short blocks (e.g. `.abthretop` copy) can fail stricter ratios; avoid bottom shrink */
    {
      root: null,
      threshold: 0,
      /** Pre-trigger blocks just below the fold (long pages e.g. gaming FAQ + footer). */
      rootMargin: "0px 0px 35% 0px",
    },
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
        refreshAbmobileOwlInNode(node);
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

  const onResizeEq = () => scheduleEqualHeight();
  window.addEventListener("resize", onResizeEq, { passive: true });

  void document.fonts?.ready?.then(() => scheduleEqualHeight());

  return () => {
    window.clearTimeout(lateFlushId);
    window.removeEventListener("resize", onResizeEq);
    io.disconnect();
  };
}
