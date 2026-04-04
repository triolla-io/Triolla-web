"use client";

/**
 * Restore WordPress mobile side-menu interactions for injected snapshots.
 * Theme CSS opens the panel when <body> has `mbodyact`.
 */
export function mountTriollaMobileMenu(root: HTMLElement): () => void {
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
    e.preventDefault();
    body.classList.add("mbodyact");
  };
  
  const onClose = (e: Event) => {
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
