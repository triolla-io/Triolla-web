import { usePathname } from "next/navigation";

/**
 * Detect current locale from pathname.
 * /he/* → "he", everything else → "en"
 */
export function useCurrentLocale(): "en" | "he" {
  const pathname = usePathname();
  return pathname?.startsWith("/he") ? "he" : "en";
}

/**
 * Convert a path to the other locale.
 * /technology → /he/technology
 * /he/technology → /technology
 */
export function toggleLocale(pathname: string): string {
  if (pathname.startsWith("/he/")) {
    return pathname.slice("/he".length) || "/";
  }
  if (pathname === "/he") {
    return "/";
  }
  return `/he${pathname}`;
}
