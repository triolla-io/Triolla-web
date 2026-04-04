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

    const arrow = target.closest<HTMLElement>(".hmenumob .marrow");
    if (arrow && root.contains(arrow)) {
      e.preventDefault();
      const li = arrow.closest("li");
      if (!li) return;
      li.classList.toggle("active");
      const sub = li.querySelector<HTMLElement>(":scope > ul");
      if (sub) {
        sub.style.display = sub.style.display === "block" ? "none" : "block";
      }
    }
  };

  root.addEventListener("click", onClickCapture, true);
  stripJQueryMenutoggleClickHandlers(root);

  return () => {
    body.classList.remove("mbodyact");
    root.removeEventListener("click", onClickCapture, true);
  };
}
