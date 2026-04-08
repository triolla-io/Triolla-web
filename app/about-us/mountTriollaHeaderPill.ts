/**
 * Scroll animation for Triolla header pill:
 * STARTUP: Header starts at FULL SIZE (expanded state) when page loads
 * SCROLL DOWN (> 120px): Header shrinks + menu/CTAs fade
 * SCROLL UP (≤ 120px): Header expands back to full size
 *
 * Width values are calculated dynamically from container size.
 * On Live site: 1009px expanded, 550px shrunk in 1905px container.
 * On local snapshot: proportional sizing based on actual container.
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
  const navHeader = root.querySelector(".header") as HTMLElement | null;
  const navLinkWrap = root.querySelector(".header_menu") as HTMLElement | null;
  const headerWhatsapp = root.querySelector(".header_whatsapp") as HTMLElement | null;
  const headerBook = root.querySelector(".header_book") as HTMLElement | null;

  if (!navHeader || !navLinkWrap || !headerWhatsapp || !headerBook) {
    return () => {};
  }

  const transition = "0.7s ease";
  /** Only show menu + CTAs when the user has scrolled back up into this band from the top. */
  const showFullHeaderTopZonePx = 120;

  // Capture initial widths (expanded state at page load)
  const expandedHeaderWidth = navHeader.offsetWidth;
  const expandedMenuWidth = navLinkWrap.offsetWidth;
  const expandedWhatsappWidth = headerWhatsapp.offsetWidth;
  const expandedBookWidth = headerBook.offsetWidth;

  // Calculate shrunk widths proportionally (ratio: 550px / 1009px = 0.545)
  // On Live: logo only, no menu/buttons visible
  const shrinkRatio = 550 / 1009; // ~0.545
  const shrunkHeaderWidth = Math.round(expandedHeaderWidth * shrinkRatio);

  // ✅ CRITICAL: Start at EXPANDED size - header must be FULL SIZE on page load
  navHeader.setAttribute("style", `width: ${expandedHeaderWidth}px !important; transition: width ${transition} !important;`);

  const tuckInsidePill = [navLinkWrap, headerWhatsapp, headerBook];
  for (const el of tuckInsidePill) {
    el.style.transition = `transform ${transition}, width ${transition}, opacity ${transition}`;
    el.style.transform = "scale(1)";      // Start VISIBLE
    el.style.opacity = "1";               // Start VISIBLE
    el.style.pointerEvents = "auto";
    el.style.width = `${el.offsetWidth}px`;
  }

  const applyExpanded = () => {
    // ✅ Header at FULL SIZE (1009px expanded)
    navHeader.setAttribute("style", `width: ${expandedHeaderWidth}px !important; transition: width ${transition} !important;`);
    navLinkWrap.style.width = `${expandedMenuWidth}px`;
    headerWhatsapp.style.width = `${expandedWhatsappWidth}px`;
    headerBook.style.width = `${expandedBookWidth}px`;
    for (const el of tuckInsidePill) {
      el.style.transform = "scale(1)";     // VISIBLE
      el.style.opacity = "1";              // VISIBLE
      el.style.pointerEvents = "auto";
    }
  };

  const applyCollapsed = () => {
    // 🔄 Header SHRINKS (550px shrunk)
    navHeader.setAttribute("style", `width: ${shrunkHeaderWidth}px !important; transition: width ${transition} !important;`);
    for (const el of tuckInsidePill) {
      el.style.transform = "scale(0.6)";   // HIDDEN
      el.style.width = "0px";
      el.style.opacity = "0";              // HIDDEN
      el.style.pointerEvents = "none";
    }
  };

  let rafId: number | null = null;
  const onScroll = () => {
    if (rafId !== null) cancelAnimationFrame(rafId);
    rafId = requestAnimationFrame(() => {
      rafId = null;
      const scrollTop = readDocumentScrollTop();
      // ✅ Only START the animation after page load + scroll listener active
      if (scrollTop <= showFullHeaderTopZonePx) {
        applyExpanded();
      } else {
        applyCollapsed();
      }
    });
  };

  // ✅ Delay scroll listener until page is fully loaded and rendered
  let timeoutId: ReturnType<typeof setTimeout> | undefined;
  timeoutId = setTimeout(() => {
    timeoutId = undefined;
    window.addEventListener("scroll", onScroll, { passive: true });
    // Call once immediately to set correct state based on current scroll position
    onScroll();
  }, 500);  // Increased delay to ensure full page load

  return () => {
    if (timeoutId !== undefined) clearTimeout(timeoutId);
    if (rafId !== null) cancelAnimationFrame(rafId);
    window.removeEventListener("scroll", onScroll);
    // Clean up inline styles
    navHeader.style.removeProperty("transition");
    navHeader.style.removeProperty("width");
    for (const el of tuckInsidePill) {
      el.style.removeProperty("transition");
      el.style.removeProperty("transform");
      el.style.removeProperty("width");
      el.style.removeProperty("opacity");
      el.style.removeProperty("pointer-events");
    }
  };
}
