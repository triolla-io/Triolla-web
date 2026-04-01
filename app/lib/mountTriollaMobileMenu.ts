"use client";

/**
 * Restore WordPress mobile side-menu interactions for injected snapshots.
 * Theme CSS opens the panel when <body> has `mbodyact`.
 */
export function mountTriollaMobileMenu(root: HTMLElement): () => void {
  const body = document.body;
  const onOpen = (e: Event) => {
    e.preventDefault();
    body.classList.add("mbodyact");
  };
  const onClose = (e: Event) => {
    e.preventDefault();
    body.classList.remove("mbodyact");
  };

  const openLinks = Array.from(
    root.querySelectorAll<HTMLAnchorElement>(".menutoggle a"),
  );
  const closeLinks = Array.from(
    root.querySelectorAll<HTMLAnchorElement>(".hmenumobclose a"),
  );

  openLinks.forEach((a) => a.addEventListener("click", onOpen));
  closeLinks.forEach((a) => a.addEventListener("click", onClose));

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
    openLinks.forEach((a) => a.removeEventListener("click", onOpen));
    closeLinks.forEach((a) => a.removeEventListener("click", onClose));
    arrowHandlers.forEach(({ el, fn }) => el.removeEventListener("click", fn));
  };
}
