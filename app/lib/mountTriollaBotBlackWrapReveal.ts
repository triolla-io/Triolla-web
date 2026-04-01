/**
 * Blog post fragments use `.botblackwrap` ("More Posts" + related cards). Theme CSS only
 * shows `.armpost` / `.blackimg` / `.blacktxt` when `.botblackwrap.show` is set (see
 * style-new.css). Live WordPress used jQuery `.visible()` on scroll; that inline script
 * is not in the snapshot — restore the reveal with IntersectionObserver.
 */
export function mountTriollaBotBlackWrapReveal(root: HTMLElement): () => void {
  const wraps = root.querySelectorAll(".botblackwrap");
  if (!wraps.length) return () => {};

  const markShown = (el: Element) => {
    el.classList.add("show");
  };

  const io = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        markShown(entry.target);
        io.unobserve(entry.target);
      }
    },
    { threshold: 0.12, rootMargin: "0px 0px -8% 0px" },
  );

  const vh = () => window.innerHeight || 0;

  wraps.forEach((w) => {
    const r = w.getBoundingClientRect();
    const visible = r.top < vh() && r.bottom > 0;
    if (visible) {
      markShown(w);
    } else {
      io.observe(w);
    }
  });

  return () => {
    io.disconnect();
  };
}
