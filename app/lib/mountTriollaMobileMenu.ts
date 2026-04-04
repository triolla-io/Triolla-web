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
  root.querySelectorAll(".menutoggle a, .menutoggle button").forEach((el) => {
    jq(el).off("click");
  });
}

function eventTargetElement(target: EventTarget | null): Element | null {
  if (!target || !(target instanceof Node)) return null;
  if (target.nodeType === Node.TEXT_NODE) return target.parentElement;
  return target instanceof Element ? target : null;
}

/** Blue announcement strip: WP used jQuery `.tickclose` — snapshots use `<button>` with no handler. */
function mainContainerForTickerPadding(root: HTMLElement): HTMLElement {
  if (root.classList.contains("main_container")) return root;
  return root.querySelector(".main_container") ?? root;
}

function dismissHeaderticker(root: HTMLElement): void {
  root.querySelectorAll(".headerticker").forEach((t) => t.remove());
  root.querySelectorAll(".header.headnewact").forEach((h) => {
    h.classList.remove("headnewact");
  });
  mainContainerForTickerPadding(root).classList.add("triolla-ticker-dismissed");
}

function tryDismissHeaderticker(root: HTMLElement, e: Event): boolean {
  const target = eventTargetElement(e.target);
  if (!target || !root.contains(target)) return false;
  const tick = target.closest(".tickclose");
  if (!tick || !root.contains(tick)) return false;
  const ticker = tick.closest(".headerticker");
  if (!ticker || !root.contains(ticker)) return false;
  dismissHeaderticker(root);
  return true;
}

/** Expand/collapse a `.menu-item-has-children` row inside `.hmenumob` (Portfolio + columns). */
function tryToggleHmenumobSubmenu(root: HTMLElement, e: Event): boolean {
  const target = eventTargetElement(e.target);
  if (!target || !root.contains(target)) return false;
  if (!target.closest(".hmenumob")) return false;

  const liHasChildren = target.closest(".hmenumob li.menu-item-has-children");
  if (!liHasChildren || !root.contains(liHasChildren)) return false;

  const subUl = liHasChildren.querySelector<HTMLElement>(":scope > ul");

  /* Let real links inside this row's submenu navigate (Cybersecurity, etc.). */
  if (subUl && subUl.contains(target)) {
    const link = target.closest("a[href]");
    if (link && subUl.contains(link)) {
      const href = (link.getAttribute("href") || "").trim();
      if (
        href &&
        href !== "#" &&
        !/^javascript:/i.test(href)
      ) {
        return false;
      }
    }
  }

  const directA = liHasChildren.querySelector<HTMLElement>(":scope > a");
  const marrow = liHasChildren.querySelector<HTMLElement>(":scope > .marrow");
  const hitRow =
    target === liHasChildren ||
    (!!directA && (target === directA || directA.contains(target))) ||
    (!!marrow && (target === marrow || marrow.contains(target)));

  if (!hitRow) return false;

  liHasChildren.classList.toggle("active");
  return true;
}

export function mountTriollaMobileMenu(root: HTMLElement): () => void {
  const body = document.body;
  const isHebrew = root.getAttribute("dir") === "rtl";
  /** Skip the follow-up synthetic `click` after we handled `touchend` (iOS/WebKit). */
  let ignoreSubmenuClickUntil = 0;

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
    if (tryDismissHeaderticker(root, e)) {
      e.preventDefault();
      e.stopPropagation();
      return;
    }

    const target = eventTargetElement(e.target);
    if (!target || !root.contains(target)) return;

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
    if (
      inDrawer &&
      Date.now() >= ignoreSubmenuClickUntil &&
      tryToggleHmenumobSubmenu(root, e)
    ) {
      e.preventDefault();
      e.stopPropagation();
    }
  };

  const onTouchEndCapture = (e: TouchEvent) => {
    if (e.touches.length > 0) return;
    if (tryDismissHeaderticker(root, e)) {
      e.preventDefault();
      return;
    }
    if (!tryToggleHmenumobSubmenu(root, e)) return;
    ignoreSubmenuClickUntil = Date.now() + 400;
    e.preventDefault();
  };

  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key !== "Escape") return;
    if (!body.classList.contains("mbodyact")) return;
    body.classList.remove("mbodyact");
  };

  root.addEventListener("click", onClickCapture, true);
  root.addEventListener("touchend", onTouchEndCapture, {
    capture: true,
    passive: false,
  });
  document.addEventListener("keydown", onKeyDown);
  stripJQueryMenutoggleClickHandlers(root);

  return () => {
    body.classList.remove("mbodyact");
    root.removeEventListener("click", onClickCapture, true);
    root.removeEventListener("touchend", onTouchEndCapture, true);
    document.removeEventListener("keydown", onKeyDown);
  };
}
