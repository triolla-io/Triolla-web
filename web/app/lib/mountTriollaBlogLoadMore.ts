/**
 * Blog archive (`/blog`) relied on an inline WordPress script (not in body fragments) to:
 * - show the first 12 `ul.bot` cards (CSS keeps the rest `display:none` until `.show`)
 * - handle "Load More Posts" (desktop + mobile)
 * - run GSAP ScrollTrigger parallax on `.grid__item-img img` (mobile handler on live site)
 */

type JQueryCollection = {
  length: number;
  removeClass: (c: string) => JQueryCollection;
  addClass: (c: string) => JQueryCollection;
  slice: (start: number, end?: number) => JQueryCollection;
  fadeOut: (speed: string) => void;
  find: (sel: string) => JQueryCollection;
  on: (events: string, handler: (e: { preventDefault: () => void }) => void) => JQueryCollection;
  off: (events: string) => JQueryCollection;
};

export function mountTriollaBlogLoadMore(root: HTMLElement): () => void {
  const $ = (window as unknown as { jQuery?: (el: unknown) => JQueryCollection }).jQuery;
  if (!$) return () => {};

  const $root = $(root);
  const $items = $root.find("ul.bot li");
  const $wrap = $root.find(".blogrmore");
  if (!$items.length || !$wrap.length) return () => {};

  $items.removeClass("show");
  $items.slice(0, 12).addClass("show");

  const ns = "click.triollaBlogLoadMore";

  function revealBatch() {
    $root.find(".bot li:not(.show)").slice(0, 9).addClass("show");
    if ($root.find(".bot li:not(.show)").length === 0) {
      $wrap.fadeOut("slow");
    }
    try {
      (window as unknown as { ScrollTrigger?: { refresh: () => void } }).ScrollTrigger?.refresh();
    } catch {
      /* noop */
    }
  }

  $wrap.find("a.desktopload").on(ns, (e) => {
    e.preventDefault();
    revealBatch();
  });

  $wrap.find("a.mobileload").on(ns, (e) => {
    e.preventDefault();
    revealBatch();
  });

  let ctx: { revert: () => void } | null = null;
  function armGridParallax() {
    if (ctx) return;
    const gsap = (
      window as unknown as {
        gsap?: {
          context: (fn: () => void, scope?: Element) => { revert: () => void };
          to: (t: unknown, v: Record<string, unknown>) => unknown;
          utils: { toArray: (targets: unknown) => HTMLElement[] };
        };
      }
    ).gsap;
    if (!gsap?.context) return;
    ctx = gsap.context(() => {
      const imgs = gsap.utils.toArray(root.querySelectorAll(".grid__item-img img"));
      imgs.forEach((img) => {
        const speed = parseFloat(img.dataset.speed || "0");
        const y = Number.isFinite(speed) ? speed * 20 : 0;
        gsap.to(img, {
          yPercent: y,
          ease: "none",
          scrollTrigger: { trigger: img, start: "top bottom", scrub: true },
        });
      });
    }, root);
  }

  requestAnimationFrame(() => {
    armGridParallax();
    try {
      (window as unknown as { ScrollTrigger?: { refresh: () => void } }).ScrollTrigger?.refresh();
    } catch {
      /* noop */
    }
  });

  return () => {
    $wrap.find("a.desktopload, a.mobileload").off(ns);
    ctx?.revert();
    ctx = null;
  };
}
