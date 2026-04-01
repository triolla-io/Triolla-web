/**
 * Theme `all.js` defines global `equalheight(selector)` (jQuery row equalizer).
 * Home / About inline scripts call it for `.abthrebot` cards after `.show`; without it,
 * `.abthrebotdiv` boxes keep uneven heights and `display:table-cell` icon rows misalign.
 */
export const TRIOLLA_EQUAL_HEIGHT_SELECTORS = [
  ".abthrebottxt h5",
  ".abthrebotdiv",
  ".abseheight",
  ".ablealisttxt p",
  ".mobilebullets .bullet_txt p",
] as const;

export function runTriollaEqualheightInRoot(root: HTMLElement): void {
  const w = window as Window & { equalheight?: (container: string) => void };
  if (typeof w.equalheight !== "function") return;
  for (const sel of TRIOLLA_EQUAL_HEIGHT_SELECTORS) {
    if (!root.querySelector(sel)) continue;
    try {
      w.equalheight(sel);
    } catch {
      /* theme helper may depend on full WP DOM */
    }
  }
}
