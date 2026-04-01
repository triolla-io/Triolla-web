/**
 * Initialize Lottie animations on all `.lottie-animation` elements.
 * Lottie library must be loaded globally via script before calling this.
 */
export function initTriollaLottie(root: HTMLElement): void {
  const w = window as Window & {
    lottie?: { loadAnimation: (opts: Record<string, unknown>) => void };
  };
  if (!w.lottie) return;
  root.querySelectorAll(".lottie-animation").forEach((el) => {
    const path = el.getAttribute("data-lottie");
    if (!path || !(el instanceof HTMLElement)) return;
    w.lottie!.loadAnimation({
      container: el,
      renderer: "svg",
      loop: true,
      autoplay: true,
      path,
    });
  });
}
