/**
 * In all.js this runs inside document.addEventListener("DOMContentLoaded", ...).
 * In Next.js the document is already complete when all.js loads, and that native
 * listener may never fire; also loadScript dedupes so all.js does not re-run on
 * revisits. Reproduce the desktop "shrink to pill on scroll down" here, scoped
 * to the snapshot root — including tucking `.header_menu` so copy stays inside
 * the narrow pill (same as theme `all.js`).
 *
 * Full nav + CTAs only appear near the top of the page; mid-page scroll-up stays compact.
 */
function readDocumentScrollTop(): number {
  return (
    window.scrollY ||
    window.pageYOffset ||
    document.documentElement.scrollTop ||
    document.body.scrollTop ||
    0
  );
}

export function mountTriollaHeaderPill(root: HTMLElement): () => void {
  const navLinkWrap = root.querySelector(".header_menu") as HTMLElement | null;
  const navHeader = root.querySelector(".header") as HTMLElement | null;
  const headerWhatsapp = root.querySelector(".header_whatsapp") as HTMLElement | null;
  const headerBook = root.querySelector(".header_book") as HTMLElement | null;

  if (!navLinkWrap || !navHeader || !headerWhatsapp || !headerBook) {
    return () => {};
  }

  /** Enable header pill animation on ALL viewport sizes (desktop, tablet, mobile) */
  // Removed viewport check - should work everywhere

  const transition = "0.7s ease";
  /** Theme `all.js` (scroll down). */
  const headerWidthShrunk = "550px";
  /** Only show menu + CTAs when the user has scrolled back up into this band from the top. */
  const showFullHeaderTopZonePx = 120;

  const originalNavLinkWidth = `${navLinkWrap.offsetWidth}px`;
  const originalWhatsappWidth = `${headerWhatsapp.offsetWidth}px`;
  const originalBookWidth = `${headerBook.offsetWidth}px`;

  /** Menu + CTAs collapse off-screen so only the logo bar stays inside the pill. */
  const tuckInsidePill = [navLinkWrap, headerWhatsapp, headerBook];
  for (const el of tuckInsidePill) {
    el.style.transition = `transform ${transition}, width ${transition}, opacity ${transition}`;
    el.style.transform = "scale(1)";
    el.style.opacity = "1";
    el.style.pointerEvents = "auto";
    el.style.width = `${el.offsetWidth}px`;
  }

  navHeader.style.transition = `width ${transition}`;
  navHeader.style.width = "1009px";

  const applyExpanded = () => {
    navLinkWrap.style.width = originalNavLinkWidth;
    headerWhatsapp.style.width = originalWhatsappWidth;
    headerBook.style.width = originalBookWidth;
    for (const el of tuckInsidePill) {
      el.style.transform = "scale(1)";
      el.style.opacity = "1";
      el.style.pointerEvents = "auto";
    }
    navHeader.style.width = "1009px";
  };

  const applyCollapsed = () => {
    for (const el of tuckInsidePill) {
      el.style.transform = "scale(0.6)";
      el.style.width = "0px";
      el.style.opacity = "0";
      el.style.pointerEvents = "none";
    }
    navHeader.style.width = headerWidthShrunk;
  };

  let rafId: number | null = null;
  const onScroll = () => {
    if (rafId !== null) cancelAnimationFrame(rafId);
    rafId = requestAnimationFrame(() => {
      rafId = null;
      const scrollTop = readDocumentScrollTop();
      if (scrollTop <= showFullHeaderTopZonePx) {
        applyExpanded();
      } else {
        applyCollapsed();
      }
    });
  };

  let timeoutId: ReturnType<typeof setTimeout> | undefined;
  timeoutId = setTimeout(() => {
    timeoutId = undefined;
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }, 300);

  return () => {
    if (timeoutId !== undefined) clearTimeout(timeoutId);
    if (rafId !== null) cancelAnimationFrame(rafId);
    window.removeEventListener("scroll", onScroll);
    for (const el of tuckInsidePill) {
      el.style.removeProperty("transition");
      el.style.removeProperty("transform");
      el.style.removeProperty("width");
      el.style.removeProperty("opacity");
      el.style.removeProperty("pointer-events");
    }
    navHeader.style.removeProperty("transition");
    navHeader.style.removeProperty("width");
  };
}
