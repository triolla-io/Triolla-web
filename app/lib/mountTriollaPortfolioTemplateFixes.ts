/**
 * Used only via **`mountTriollaSnapshotRevealStack`** — snapshot routes should not import this directly.
 *
 * Portfolio template pages (`page-template-page-portfolio`) expect:
 *
 * 1. A `.loaded` ancestor so theme CSS can reveal `.portfoli_lists` columns:
 *    `.loaded .portfoli_lists ul li .protfolio_con { opacity:1 }` (see style.css).
 *    WordPress `all.js` does `$(window).on('load', () => jQuery('body').addClass('loaded'))`
 *    — that handler often never runs in Next (window "load" already fired), and the
 *    snapshot root is not `<body>`. Add `loaded` to the snapshot root after the same
 *    delay the theme uses (~800ms).
 *
 * 2. Per-row `.show` on `.protfolio_con` and `.protfolio_img` (stripped inline jQuery
 *    scroll handlers in the saved HTML). Without it, inner blocks (log, text, tags)
 *    stay at opacity:0 even after `.loaded`.
 */
export function mountTriollaPortfolioTemplateFixes(root: HTMLElement): () => void {
  if (!root.querySelector(".portfoli_lists")) {
    return () => {};
  }

  let loadedTimer: number | undefined = window.setTimeout(() => {
    loadedTimer = undefined;
    root.classList.add("loaded");
  }, 800);

  const rowIo = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        const li = entry.target as HTMLElement;
        li.querySelectorAll(".protfolio_con, .protfolio_img").forEach((node) => {
          node.classList.add("show");
        });
        rowIo.unobserve(li);
      }
    },
    { root: null, threshold: 0, rootMargin: "0px" },
  );

  root.querySelectorAll(".portfoli_lists > ul > li").forEach((li) => rowIo.observe(li));

  return () => {
    if (loadedTimer !== undefined) {
      window.clearTimeout(loadedTimer);
    }
    root.classList.remove("loaded");
    rowIo.disconnect();
  };
}
