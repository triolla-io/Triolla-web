/** Pathnames where the route renders a full Triolla HTML snapshot (header/footer inside fragment). */

function normalizePath(p: string): string {
  if (!p) return "/";
  const t = p.length > 1 && p.endsWith("/") ? p.slice(0, -1) : p;
  return t || "/";
}

/** Paths where <main> is a full Triolla HTML snapshot with its own header + mobile drawer. */
const HIDE_SITE_CHROME = new Set<string>([
  "/he/services",
  "/he/blog",
  /** PortfolioPageWithCSS + injected chrome; React fixed header (z-index 50) otherwise covers theme header (z-index 9). */
  "/he/mobile-apps",
  /** Triolla hamburger + drawer QA — `app/triolla-mobile-menu-qa/page.tsx`. */
  "/triolla-mobile-menu-qa",
]);

export function shouldHideSiteChromeForPath(pathname: string): boolean {
  const p = normalizePath(pathname);
  return HIDE_SITE_CHROME.has(p);
}
