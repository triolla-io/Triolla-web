import { isForbiddenElement } from "./forbiddenZones";

function nthOfType(el: Element): number {
  const parent = el.parentElement;
  if (!parent) return 1;
  const tag = el.tagName;
  let n = 0;
  for (const c of Array.from(parent.children)) {
    if (c.tagName === tag) n += 1;
    if (c === el) return n;
  }
  return 1;
}

function segment(el: Element): string {
  const tag = el.tagName.toLowerCase();
  const nth = nthOfType(el);
  return `${tag}:nth-of-type(${nth})`;
}

/**
 * Build a CSS path from `el` up to (but not including) `root`.
 * `root` is expected to be `main[data-snapshot-client]`.
 */
export function buildCanonicalSelector(el: Element, root: Element): string | null {
  if (!root.contains(el)) return null;
  if (isForbiddenElement(el)) return null;
  if (el === root) return "[data-snapshot-client]";
  const parts: string[] = [];
  let cur: Element | null = el;
  while (cur && cur !== root) {
    if (isForbiddenElement(cur)) return null;
    parts.push(segment(cur));
    cur = cur.parentElement;
  }
  if (!cur || cur !== root) return null;
  return `[data-snapshot-client] > ${parts.reverse().join(" > ")}`;
}
