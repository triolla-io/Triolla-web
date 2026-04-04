/** Pathnames where the route renders a full Triolla HTML snapshot (header/footer inside fragment). */

function normalizePath(p: string): string {
  if (!p) return "/";
  const t = p.length > 1 && p.endsWith("/") ? p.slice(0, -1) : p;
  return t || "/";
}

export function shouldHideSiteChromeForPath(pathname: string): boolean {
  const p = normalizePath(pathname);
  return p === "/he/services" || p === "/he/blog";
}
