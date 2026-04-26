const FORBIDDEN_SELECTOR = [
  ".owl-carousel",
  ".owl-stage",
  ".owl-item",
  ".swiper-container",
  ".swiper-wrapper",
  ".swiper-slide",
  ".menutoggle",
  ".hmenumob",
  "script",
  "style",
  "svg",
  "noscript",
  "iframe",
];

export function isForbiddenElement(el: Element | null): boolean {
  if (!el) return true;
  let cur: Element | null = el;
  while (cur) {
    if (cur.matches?.(FORBIDDEN_SELECTOR.join(", "))) return true;
    cur = cur.parentElement;
  }
  return false;
}

export function forbiddenTooltip(): string {
  return "Cannot edit here (this area is managed by the page scripts).";
}
