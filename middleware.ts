import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { HEBREW_BLOG_SLUG_TO_ENGLISH_SLUG } from "./app/lib/heBlogSlugAliases";
import { triollaPathnameToAppPath } from "./app/lib/rewriteTriollaNavLinks";

/**
 * Redirect rules:
 * 1. /en  → /        (legacy English prefix)
 * 2. /en/* → /*      (legacy English prefix)
 * 3. /he/services-<slug> → /he/services/<slug>  (legacy flat Hebrew service URLs)
 *
 * Canonical service detail URLs are nested: /services/<slug> (e.g. /services/front-end-dev).
 * Legacy /services-<slug> is handled via permanentRedirect in each legacy route file.
 */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const norm = pathname.replace(/\/+$/, "") || "/";
  if (norm === "/" || norm === "/he") {
    const res = NextResponse.next();
    res.headers.append(
      "Link",
      '</assets/_shared/medicak-ipad.webp>; rel=preload; as=image; type="image/webp"',
    );
    return res;
  }

  /** WordPress has no Hebrew URL for these; English-only pages. */
  if (pathname === "/he/portfolio-page" || pathname === "/he/portfolio-page/") {
    const url = request.nextUrl.clone();
    url.pathname = "/portfolio-page";
    return NextResponse.redirect(url, 301);
  }
  if (pathname === "/he/dashboard-design" || pathname === "/he/dashboard-design/") {
    const url = request.nextUrl.clone();
    url.pathname = "/dashboard-design";
    return NextResponse.redirect(url, 301);
  }

  if (pathname === "/en") {
    const url = request.nextUrl.clone();
    url.pathname = "/";
    return NextResponse.redirect(url, 301);
  }

  if (pathname.startsWith("/en/")) {
    const url = request.nextUrl.clone();
    const rest = pathname.slice("/en".length) || "/";
    url.pathname = rest.startsWith("/") ? rest : `/${rest}`;
    return NextResponse.redirect(url, 301);
  }

  const heLegacyService = pathname.match(/^\/he\/services-([^/]+)\/?$/);
  if (heLegacyService) {
    const url = request.nextUrl.clone();
    url.pathname = `/he/services/${heLegacyService[1]}`;
    return NextResponse.redirect(url, 301);
  }

  /** Hebrew WordPress slugs → same English slug as /blog/<slug>/ and triolla.io/blog/... */
  const heBlog = pathname.match(/^\/he\/blog\/([^/]+)\/?$/);
  if (heBlog) {
    let segment = heBlog[1];
    try {
      segment = decodeURIComponent(segment.replace(/\+/g, "%20"));
    } catch {
      /* keep raw segment */
    }
    const canonical = HEBREW_BLOG_SLUG_TO_ENGLISH_SLUG[segment];
    if (canonical && canonical !== heBlog[1]) {
      const url = request.nextUrl.clone();
      url.pathname = `/he/blog/${canonical}`;
      return NextResponse.redirect(url, 308);
    }
  }

  /** e.g. /he/מכשירים-iot-new → /he/device-iot (WordPress Hebrew slugs → App Router segments) */
  const normHe = pathname.replace(/\/+$/, "") || "/";
  if (normHe.startsWith("/he")) {
    const canonicalHe = triollaPathnameToAppPath(normHe, "he");
    if (canonicalHe !== normHe) {
      const url = request.nextUrl.clone();
      url.pathname = canonicalHe;
      return NextResponse.redirect(url, 308);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/en", "/en/:path*", "/he", "/he/:path*"],
};
