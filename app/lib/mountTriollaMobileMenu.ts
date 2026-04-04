"use client";

/**
 * Triolla snapshot mobile menu — capture-phase handler on the snapshot root.
 * Opens/closes via body.mbodyact (theme CSS). Runs before theme jQuery bubble handlers.
 */

/** Call after theme `all.js` (jQuery) loads so our capture handler is not undone by `.menutoggle a` click bindings. */
export function stripJQueryMenutoggleClickHandlers(root: HTMLElement): void {
  const jq = (window as unknown as {
    jQuery?: (sel: string | Element) => { off: (type: string) => unknown };
  }).jQuery;
  if (!jq) return;
  root.querySelectorAll(".menutoggle a").forEach((a) => {
    jq(a).off("click");
  });
}

export function mountTriollaMobileMenu(root: HTMLElement): () => void {
  const body = document.body;
  const isHebrew = root.getAttribute("dir") === "rtl";

  const menuToggles = Array.from(root.querySelectorAll<HTMLElement>(".menutoggle"));
  const mobileMenu = root.querySelector<HTMLElement>(".hmenumob");

  if (isHebrew) {
    menuToggles.forEach((toggle) => {
      toggle.classList.add("is-he");
      const blackIcon = toggle.querySelector<HTMLElement>("img.one");
      const whiteIcon = toggle.querySelector<HTMLElement>("img.two");
      if (blackIcon) blackIcon.style.display = "block";
      if (whiteIcon) whiteIcon.style.display = "none";
    });
    mobileMenu?.classList.add("is-he");
  }

  const onClickCapture = (e: MouseEvent) => {
    const target = e.target;
    if (!(target instanceof Element) || !root.contains(target)) return;

    const inDrawer = target.closest(".hmenumob");

    const closeWrap = target.closest(".hmenumobclose");
    if (closeWrap && root.contains(closeWrap)) {
      e.preventDefault();
      e.stopPropagation();
      body.classList.remove("mbodyact");
      return;
    }

    const toggle = target.closest(".menutoggle");
    if (toggle && root.contains(toggle) && !inDrawer) {
      e.preventDefault();
      e.stopPropagation();
      body.classList.toggle("mbodyact");
      return;
    }

    /* Theme chevron is on `a:after`; `.marrow` is often zero-size — taps hit the `a`. */
    if (inDrawer) {
      const liHasChildren = target.closest(".hmenumob li.menu-item-has-children");
      if (liHasChildren && root.contains(liHasChildren)) {
        const directA = liHasChildren.querySelector<HTMLElement>(":scope > a");
        const marrow = liHasChildren.querySelector<HTMLElement>(":scope > .marrow");
        const hitA =
          !!directA && (target === directA || directA.contains(target));
        const hitMarrow =
          !!marrow && (target === marrow || marrow.contains(target));
        if (hitA || hitMarrow) {
          // #region agent log
          fetch(
            "http://127.0.0.1:7442/ingest/16494b4c-3094-42cb-81b5-aad92874073c",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                "X-Debug-Session-Id": "143802",
              },
              body: JSON.stringify({
                sessionId: "143802",
                location: "mountTriollaMobileMenu.ts:submenu-toggle",
                message: "mobile submenu toggle",
                data: {
                  hitA,
                  hitMarrow,
                  tag: target instanceof Element ? target.tagName : null,
                },
                timestamp: Date.now(),
                hypothesisId: "A",
              }),
            },
          ).catch(() => {});
          // #endregion
          e.preventDefault();
          e.stopPropagation();
          liHasChildren.classList.toggle("active");
          const sub = liHasChildren.querySelector<HTMLElement>(":scope > ul");
          if (sub) {
            sub.style.display =
              sub.style.display === "block" ? "none" : "block";
          }
        }
      }
    }
  };

  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key !== "Escape") return;
    if (!body.classList.contains("mbodyact")) return;
    body.classList.remove("mbodyact");
  };

  root.addEventListener("click", onClickCapture, true);
  document.addEventListener("keydown", onKeyDown);
  stripJQueryMenutoggleClickHandlers(root);

  return () => {
    body.classList.remove("mbodyact");
    root.removeEventListener("click", onClickCapture, true);
    document.removeEventListener("keydown", onKeyDown);
  };
}
