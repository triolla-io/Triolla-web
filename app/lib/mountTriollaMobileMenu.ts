"use client";

/**
 * Restore WordPress mobile side-menu interactions for injected snapshots.
 * Theme CSS opens the panel when <body> has `mbodyact`.
 */
export function mountTriollaMobileMenu(root: HTMLElement): () => void {
  // #region agent log: verify menutoggle is found and clickable
  const menutoggle = root.querySelector<HTMLElement>(".menutoggle");
  if (menutoggle) {
    fetch('http://127.0.0.1:7442/ingest/16494b4c-3094-42cb-81b5-aad92874073c', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-Debug-Session-Id': '143802' },
      body: JSON.stringify({
        sessionId: '143802',
        location: 'mountTriollaMobileMenu.ts:8',
        message: 'Menutoggle element found',
        data: {
          menutoggleDisplay: window.getComputedStyle(menutoggle).display,
          menutogglePointerEvents: window.getComputedStyle(menutoggle).pointerEvents,
          menutoggleCursor: window.getComputedStyle(menutoggle).cursor,
          hasAnchor: !!menutoggle.querySelector('a'),
          hasButton: !!menutoggle.querySelector('button')
        },
        timestamp: Date.now(),
        runId: 'debug-menutoggle',
        hypothesisId: 'H4-H5'
      })
    }).catch(() => {});
  }
  // #endregion

  const body = document.body;
  const isHebrew = root.getAttribute("dir") === "rtl";
  const mobileMenu = root.querySelector<HTMLElement>(".hmenumob");
  const menuToggles = Array.from(root.querySelectorAll<HTMLElement>(".menutoggle"));

  if (isHebrew) {
    menuToggles.forEach((toggle) => {
      toggle.classList.add("is-he");
      const blackIcon = toggle.querySelector<HTMLElement>("img.one");
      const whiteIcon = toggle.querySelector<HTMLElement>("img.two");
      if (blackIcon) blackIcon.style.display = "block";
      if (whiteIcon) whiteIcon.style.display = "none";
    });
    if (mobileMenu) {
      mobileMenu.classList.add("is-he");
    }
  }

  // #region agent log: click handlers
  const onOpen = (e: Event) => {
    fetch('http://127.0.0.1:7442/ingest/16494b4c-3094-42cb-81b5-aad92874073c', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-Debug-Session-Id': '143802' },
      body: JSON.stringify({
        sessionId: '143802',
        location: 'mountTriollaMobileMenu.ts:onOpen',
        message: 'Menu open clicked',
        data: { isHebrew: isHebrew },
        timestamp: Date.now(),
        runId: 'debug-clicks',
        hypothesisId: 'H2'
      })
    }).catch(() => {});
    e.preventDefault();
    body.classList.add("mbodyact");
  };
  
  const onClose = (e: Event) => {
    fetch('http://127.0.0.1:7442/ingest/16494b4c-3094-42cb-81b5-aad92874073c', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-Debug-Session-Id': '143802' },
      body: JSON.stringify({
        sessionId: '143802',
        location: 'mountTriollaMobileMenu.ts:onClose',
        message: 'Menu close clicked',
        data: { isHebrew: isHebrew },
        timestamp: Date.now(),
        runId: 'debug-clicks',
        hypothesisId: 'H2'
      })
    }).catch(() => {});
    e.preventDefault();
    body.classList.remove("mbodyact");
  };
  // #endregion

  const openHandlers: Array<{ el: HTMLElement; fn: (e: Event) => void }> = [];
  menuToggles.forEach((toggle) => {
    const interactive = toggle.querySelector<HTMLElement>("a, button");
    const el = interactive ?? toggle;
    el.addEventListener("click", onOpen);
    openHandlers.push({ el, fn: onOpen });
  });

  const closeHandlers: Array<{ el: HTMLElement; fn: (e: Event) => void }> = [];
  root.querySelectorAll<HTMLElement>(".hmenumobclose").forEach((wrap) => {
    const interactive = wrap.querySelector<HTMLElement>("a, button");
    const el = interactive ?? wrap;
    el.addEventListener("click", onClose);
    closeHandlers.push({ el, fn: onClose });
  });

  const arrowHandlers: Array<{ el: HTMLElement; fn: (e: Event) => void }> = [];
  root.querySelectorAll<HTMLElement>(".hmenumob .marrow").forEach((arrow) => {
    const fn = (e: Event) => {
      e.preventDefault();
      const li = arrow.closest("li");
      if (!li) return;
      li.classList.toggle("active");
      const sub = li.querySelector<HTMLElement>(":scope > ul");
      if (sub) {
        sub.style.display = sub.style.display === "block" ? "none" : "block";
      }
    };
    arrow.addEventListener("click", fn);
    arrowHandlers.push({ el: arrow, fn });
  });

  return () => {
    body.classList.remove("mbodyact");
    openHandlers.forEach(({ el, fn }) => el.removeEventListener("click", fn));
    closeHandlers.forEach(({ el, fn }) => el.removeEventListener("click", fn));
    arrowHandlers.forEach(({ el, fn }) => el.removeEventListener("click", fn));
  };
}
