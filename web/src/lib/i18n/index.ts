export type Locale = "en" | "he";

export const HE_PREFIX = "/he";
const EN_ONLY_PATHS = new Set<string>(["/agritech/"]);

/** Default locale uses no URL prefix (English at root). */
export const defaultLocale: Locale = "en";

export function localeFromPathname(pathname: string | null | undefined): Locale {
  if (!pathname) return "en";
  const p = pathname.startsWith("/") ? pathname : `/${pathname}`;
  return p === "/he" || p.startsWith("/he/") ? "he" : "en";
}

/**
 * Strip /he prefix for comparing "canonical" paths (e.g. /he/about-us/ → /about-us/).
 */
export function stripLocalePrefix(pathname: string): string {
  if (pathname === "/he" || pathname === "/he/") return "/";
  if (pathname.startsWith("/he/")) {
    const rest = pathname.slice(3);
    return rest.startsWith("/") ? rest : `/${rest}`;
  }
  return pathname || "/";
}

/**
 * Prefix path for the given locale. `path` should be like `/about-us/` (with leading slash, trailing slash optional).
 */
export function withLocalePrefix(path: string, locale: Locale): string {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  const enNormalized =
    normalized === "/" || normalized === ""
      ? "/"
      : normalized.endsWith("/")
        ? normalized
        : `${normalized}/`;
  if (locale === "en") return normalized === "" ? "/" : normalized;
  if (EN_ONLY_PATHS.has(enNormalized)) return enNormalized;
  if (normalized === "/" || normalized === "") return `${HE_PREFIX}/`;
  const withoutLeading = normalized.replace(/^\//, "").replace(/\/$/, "");
  return `${HE_PREFIX}/${withoutLeading}/`;
}

/**
 * Toggle between EN and HE URLs for the language switcher.
 */
export function alternateLocalePath(pathname: string): { en: string; he: string } {
  const canonical = stripLocalePrefix(pathname || "/");
  const enPath =
    canonical === "/" || canonical === ""
      ? "/"
      : canonical.endsWith("/")
        ? canonical
        : `${canonical}/`;
  const hePath = EN_ONLY_PATHS.has(enPath)
    ? enPath
    : withLocalePrefix(enPath === "/" ? "/" : enPath, "he");
  return { en: enPath, he: hePath };
}
