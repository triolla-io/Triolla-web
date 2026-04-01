import { alternateLocalePath } from "@/lib/i18n";

/**
 * Snapshot HTML still points the main nav (and black pill header) at production.
 * Rewrite same-site links so the top nav stays inside this Next.js app.
 *
 * English URLs have no /en prefix (/technology, /about-us). Hebrew keeps /he/...
 * Triolla Hebrew pages use pathname /he/...; we must not prepend /en (that produced /en/he/...).
 * 
 * Hebrew snapshot links may be URL-encoded (e.g., https://triolla.io/he/%d7%a1%d7%99%d7%99%d7%91%d7%a8/)
 * which decodes to "סייבר" but maps to the route /he/cyber-security.
 */
const TRIOLLA_HOST = /^https?:\/\/(www\.)?triolla\.io/i;

/**
 * Map decoded Hebrew text slugs to English route names.
 * Triolla uses Hebrew labels in URLs on the WordPress site; we map to English routes.
 */
const HEBREW_TO_ROUTE: Record<string, string> = {
  "אבטחת סייבר": "cyber-security",
  סייבר: "cyber-security",
  "רפואה ובריאות": "medical-healthcare",
  /** WordPress slug in nav (triolla.io/he/בריאות-ורפואה/) — differs from menu label word order. */
  "בריאות-ורפואה": "medical-healthcare",
  "פינטק ופיננסים": "fintech-finance",
  /** WordPress slug (triolla.io/he/פינטק-ופיננסים/) — hyphenated nav URL. */
  "פינטק-ופיננסים": "fintech-finance",
  גיימינג: "gaming",
  אגריטק: "agritech",
  b2c: "b2c",
  /** WordPress slug in nav (triolla.io/he/מכשירים-iot-new/) */
  "מכשירים-iot-new": "device-iot",
  "מכשירים ו-iot": "device-iot",
  "סטארט-אפים וטכנולוגיה": "startups-tech",
  "אפליקציות מובייל": "mobile-apps",
  /** Hyphenated WP slug variant used by some Hebrew links */
  "אפליקציות-מובייל": "mobile-apps",
  saas: "saas-platforms",
  b2b: "b2b",
  "פיתוח מערכות": "technology",
  /** WP services hub (triolla.io/he/השירותים-שלנו/...) */
  "השירותים-שלנו": "services",
  שירותים: "services",
  טכנולוגיה: "technology",
  about: "about-us",
  אודותינו: "about-us",
  בלוג: "blog",
  קריירה: "careers",
  /** WP slug in footer/nav (triolla.io/he/צור-קשר/) */
  "צור-קשר": "contact-us",
  "צור קשר": "contact-us",
};

/**
 * WordPress child slugs under /he/השירותים-שלנו/… → canonical /he/services/<slug>.
 */
const HEBREW_WP_SERVICE_CHILD_TO_SLUG: Record<string, string> = {
  "מחקר-ux": "ux-research",
  "עיצוב-ui": "ui-design",
  "עיצוב-דמויות": "character-design",
  "עיצוב-מצגות": "presentations",
  /** WP uses motion-design2; app route is motion-design */
  "motion-design2": "motion-design",
};

/**
 * Decode URL-encoded Hebrew characters in a pathname.
 * @param pathname e.g. /he/%d7%a1%d7%99%d7%99%d7%91%d7%a8/
 * @returns Decoded pathname, e.g. /he/סייבר/
 */
function decodeHebrewPathname(pathname: string): string {
  try {
    return decodeURIComponent(pathname);
  } catch {
    return pathname;
  }
}

/**
 * Attempt to map a Hebrew slug to an English route name.
 * @param hebrewSlug Decoded Hebrew text or partial slug
 * @returns English route name or original slug if no mapping found
 */
function mapHebrewSlugToRoute(hebrewSlug: string): string {
  const trimmed = hebrewSlug.trim();
  const direct = HEBREW_TO_ROUTE[trimmed];
  if (direct) return direct;
  const normalized = trimmed.toLowerCase();
  for (const [hebText, route] of Object.entries(HEBREW_TO_ROUTE)) {
    if (normalized.includes(hebText.toLowerCase()) || hebText.toLowerCase().includes(normalized)) {
      return route;
    }
  }
  return hebrewSlug;
}

function mapWordPressServiceChildToCanonicalSlug(segment: string): string {
  let s = segment;
  try {
    s = decodeURIComponent(segment.replace(/\+/g, "%20"));
  } catch {
    /* keep segment */
  }
  const mapped = HEBREW_WP_SERVICE_CHILD_TO_SLUG[s] ?? HEBREW_WP_SERVICE_CHILD_TO_SLUG[s.toLowerCase()];
  if (mapped) return mapped;
  if (/^[a-z0-9]+(?:-[a-z0-9]+)*$/i.test(s)) {
    return s.toLowerCase();
  }
  return s;
}

/**
 * Map a triolla.io URL pathname to this app's pathname, respecting current locale.
 * Handles both encoded and decoded Hebrew paths.
 * @param pathname Triolla URL path (e.g. /he/technology, /about-us, /he/%d7%a1%d7%99%d7%99%d7%91%d7%a8/)
 * @param currentLocale Current app locale ("en" | "he")
 */
export function triollaPathnameToAppPath(pathname: string, currentLocale: "en" | "he" = "en"): string {
  let path = pathname || "/";
  path = path.replace(/\/+$/, "") || "/";

  /** English about is canonical at `/about-us` (legacy `/about` redirects there). */
  if (path === "/about-us" || path === "/about") {
    return currentLocale === "he" ? "/he/about-us" : "/about-us";
  }

  /** Hebrew home is `/he`, not `/`. */
  if (path === "/" && currentLocale === "he") {
    return "/he";
  }

  // Undo bad links from older rewrites: /en/he/... → /he/...
  if (path.startsWith("/en/he")) {
    path = path.replace(/^\/en/, "") || "/";
  }

  // Decode URL-encoded Hebrew in Hebrew paths
  if (path.startsWith("/he/") && path.includes("%")) {
    path = decodeHebrewPathname(path);
  }

  // If target is Hebrew with potential Hebrew text slug, try to map it
  if (path.startsWith("/he/")) {
    const parts = path.split("/").filter(Boolean); // ["he", "סייבר", etc.]
    if (parts.length >= 2 && parts[0] === "he") {
      const slug = parts[1];
      // Check if this looks like Hebrew characters
      if (/[\u0590-\u05FF]/.test(slug)) {
        const mapped = mapHebrewSlugToRoute(slug);
        if (mapped !== slug) {
          const tail = parts.slice(2);
          const suffix =
            tail.length === 0
              ? ""
              : `/${(mapped === "services" ? tail.map(mapWordPressServiceChildToCanonicalSlug) : tail).join("/")}`;
          return `/he/${mapped}${suffix}`;
        }
      }
    }
    // Otherwise return as-is
    return path;
  }

  // Strip /en prefix (legacy or WP-side)
  if (path === "/en") {
    // Home
    return currentLocale === "he" ? "/he" : "/";
  }
  if (path.startsWith("/en/")) {
    const rest = path.slice("/en/".length);
    const normalized = rest ? `/${rest}` : "/";
    // If we're on a Hebrew page, add /he prefix to English links
    if (currentLocale === "he") {
      return `/he${normalized}`;
    }
    return normalized;
  }

  // English path — add /he prefix if on Hebrew page
  if (currentLocale === "he" && path !== "/" && !path.startsWith("/he")) {
    return `/he${path}`;
  }

  return path;
}

/**
 * Detect locale from a snapshot root's HTML.
 * Check for dir="rtl" attribute or assume English by default.
 */
function detectLocaleFromRoot(root: HTMLElement): "en" | "he" {
  return root.getAttribute("dir") === "rtl" ? "he" : "en";
}

/**
 * WPML language switcher: the link target is the *other* language, not the current page locale.
 * Without this, "אנגלית" on Hebrew snapshots becomes `/he/...` instead of the English route.
 */
function wpmlTargetLocaleForAnchor(a: HTMLAnchorElement): "en" | "he" | undefined {
  let el: HTMLElement | null = a;
  for (let i = 0; i < 10 && el; i++) {
    if (el.classList.contains("wpml-ls-item-en")) return "en";
    if (el.classList.contains("wpml-ls-item-he")) return "he";
    el = el.parentElement;
  }
  return undefined;
}

/**
 * @param _localePrefix — deprecated; triolla path alone selects /he vs English. Kept for call-site compatibility.
 */
export function rewriteTriollaNavLinks(root: HTMLElement, _localePrefix?: string): void {
  const locale = detectLocaleFromRoot(root);
  root.querySelectorAll("a[href]").forEach((node) => {
    const a = node as HTMLAnchorElement;
    const href = a.getAttribute("href");
    if (!href || href.startsWith("#") || href.startsWith("javascript:")) return;

    const pathLocale = wpmlTargetLocaleForAnchor(a) ?? locale;

    if (TRIOLLA_HOST.test(href)) {
      try {
        const u = new URL(href);
        const nextPath = triollaPathnameToAppPath(u.pathname || "/", pathLocale);
        a.setAttribute("href", `${nextPath}${u.search}${u.hash}`);
      } catch {
        /* ignore invalid href */
      }
      return;
    }

    /** Snapshot footer/nav sometimes uses root-relative /he/%d7%... (not triolla.io). */
    if (href === "/he" || href.startsWith("/he/") || href.startsWith("/he?") || href.startsWith("/he#")) {
      try {
        const u = new URL(href, "https://triolla.io");
        const path = u.pathname || "/";
        const nextPath = triollaPathnameToAppPath(path, pathLocale);
        if (nextPath !== path) {
          a.setAttribute("href", `${nextPath}${u.search}${u.hash}`);
        }
      } catch {
        /* ignore invalid href */
      }
      return;
    }

    /** Root-relative marketing paths that are not `triolla.io` absolute URLs. */
    if (
      href === "/about-us" ||
      href === "/about-us/" ||
      href.startsWith("/about-us?") ||
      href.startsWith("/about-us#") ||
      href === "/about" ||
      href === "/about/" ||
      href.startsWith("/about?") ||
      href.startsWith("/about#")
    ) {
      try {
        const u = new URL(href, "https://triolla.io");
        const nextPath = triollaPathnameToAppPath("/about-us", pathLocale);
        a.setAttribute("href", `${nextPath}${u.search}${u.hash}`);
      } catch {
        /* ignore */
      }
    }
  });

  const localeForPortfolio = detectLocaleFromRoot(root);
  /** Desktop/mobile nav + blog “black strip” cards (`.botblackwrap`) use the same empty-href portfolio pattern. */
  root.querySelectorAll(".header_menu a, .hmenumob a, .artbotblack a, .botblackwrap a").forEach((node) => {
    const a = node as HTMLAnchorElement;
    const href = a.getAttribute("href");
    if (href != null && href.trim() !== "") return;
    const label = a.textContent?.replace(/\s+/g, " ").trim().toLowerCase();
    if (label !== "portfolio") return;
    a.setAttribute("href", triollaPathnameToAppPath("/portfolio-page", localeForPortfolio));
  });

  rewriteFooterWpmlLanguageLinks(root);
}

/**
 * `_shared-footer.html` ships WPML links copied from one page (e.g. gaming). Point Eng/Heb
 * at this app's alternate locale for the current URL instead.
 */
function rewriteFooterWpmlLanguageLinks(root: HTMLElement): void {
  if (typeof window === "undefined") return;
  const pathname = window.location?.pathname ?? "/";
  const { en: pathEn, he: pathHe } = alternateLocalePath(pathname);

  const enLink = root.querySelector<HTMLAnchorElement>(".footer .wpml-ls-item-en a[href]");
  const heLink = root.querySelector<HTMLAnchorElement>(".footer .wpml-ls-item-he a[href]");
  if (enLink) enLink.setAttribute("href", pathEn);
  if (heLink) heLink.setAttribute("href", pathHe);
}
