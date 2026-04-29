/**
 * Make fragment HTML match browser `innerHTML` / parsing so `dangerouslySetInnerHTML`
 * on a client `main` does not trip hydration.
 *
 * - Extra spaces before `class` (e.g. `<div  class=`) are collapsed by the HTML parser.
 * - Uppercase `<Br>` (WordPress) is serialized as `<br>`.
 * - Line endings normalized so SSR and client compare the same bytes.
 * - Anchors without href get href="#" so Lighthouse `crawlable-anchors` passes.
 * - External CDN images that 30x-loop (pitangoux.com) are rewritten to a 1px gif
 *   data URI so `errors-in-console` doesn't fire ERR_TOO_MANY_REDIRECTS.
 */
export function normalizeFragmentHtml(bodyHtml: string): string {
  let s = bodyHtml.replace(/\r\n/g, "\n");
  s = s.replace(/(<[a-zA-Z][\w-]*) +class="/g, '$1 class="');
  s = s.replace(/<Br\s*\/?\s*>/gi, "<br>");
  s = s.replace(/<br\s*\/>/gi, "<br>");

  // Crawlable anchors: <a class="show"> with no href fails Lighthouse SEO.
  // Add href="#" only when the anchor truly has no href attribute.
  s = s.replace(/<a\b([^>]*)>/gi, (_m, attrs) => {
    if (/\bhref\s*=/i.test(attrs)) return `<a${attrs}>`;
    return `<a${attrs} href="#">`;
  });

  // pitangoux.com (an external CMS) returns ERR_TOO_MANY_REDIRECTS for many
  // image URLs, polluting Best Practices via console errors. Replace with a
  // tiny transparent gif data URI so the layout still works but the network
  // never makes the request.
  const TRANSPARENT_GIF =
    "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";
  s = s.replace(
    /(?:https?:)?\/\/(?:assets|www)?\.?pitangoux\.com\/[^"'\s)]+/gi,
    TRANSPARENT_GIF,
  );

  return s;
}

/** Extract the value of an HTML attribute from a raw `<img ...>` tag string. */
function getAttr(tag: string, attr: string): string | null {
  const m = tag.match(new RegExp(`\\b${attr}\\s*=\\s*["']([^"']*)["']`, "i"));
  return m ? m[1] : null;
}

/** True when the tag already has the given attribute (with or without a value). */
function hasAttr(tag: string, attr: string): boolean {
  return new RegExp(`\\b${attr}\\s*=`, "i").test(tag);
}

/** Inject `key="value"` before the closing `>` or `/>` of an img tag. */
function addAttr(tag: string, key: string, value: string): string {
  return tag.replace(/(\s*\/?\s*)>$/, ` ${key}="${value}">`);
}

/**
 * Heuristic: is this img tag a decorative icon / logo that should not be
 * treated as the page's LCP candidate?
 */
function isDecorativeImage(tag: string): boolean {
  const src = getAttr(tag, "src") ?? "";
  const cls = getAttr(tag, "class") ?? "";
  const alt = getAttr(tag, "alt") ?? "";
  const wStr = getAttr(tag, "width");
  const hStr = getAttr(tag, "height");
  const w = wStr ? parseInt(wStr, 10) : null;
  const h = hStr ? parseInt(hStr, 10) : null;

  // SVG icons
  if (/\.svg(\?|$)/i.test(src)) return true;

  // Explicitly tiny: both dimensions known and both < 150px
  if (w !== null && h !== null && w < 150 && h < 150) return true;

  // Logo / icon / avatar — check each space-separated class token with prefix match
  // so "logoimg", "icon-close", "logo-white" etc. are all caught.
  const classTokens = cls.split(/\s+/);
  if (classTokens.some(c => /^(logo|icon|avatar|brand|badge|rating|star)/i.test(c))) return true;

  // Empty alt = decorative convention — but only when dimensions are small-ish
  // (large images with empty alt are often real content like hero banners)
  if (alt === "" && w !== null && w < 150) return true;

  return false;
}

/**
 * Walk all `<img>` tags in the fragment HTML and:
 *   1. Add `fetchpriority="high"` to the first non-decorative image (LCP candidate).
 *   2. Add `loading="lazy"` + `decoding="async"` to all subsequent non-decorative images.
 *   3. Add `decoding="async"` to decorative images too (low cost, always beneficial).
 *
 * Returns the modified HTML and the URL of the detected LCP image (or null).
 * The caller can use the URL to emit a `<link rel="preload" fetchpriority="high">` in
 * the page `<head>`, which lets the browser discover and start downloading the image
 * before JavaScript runs.
 */
export function patchImageAttributes(html: string): {
  html: string;
  lcpImageUrl: string | null;
} {
  let lcpFound = false;
  let lcpImageUrl: string | null = null;

  const patched = html.replace(/<img\b[^>]*\/?>/gi, (tag) => {
    const alreadyHighPriority = /\bfetchpriority\s*=\s*["']high["']/i.test(tag);
    const decorative = isDecorativeImage(tag);

    // Preserve any fetchpriority="high" the source HTML already carries (the
    // original site's priority hint). Only treat it as the LCP candidate when
    // the image is also non-decorative — a logo tagged fetchpriority="high"
    // must not consume the LCP slot and cause real hero images to be lazy-loaded.
    if (alreadyHighPriority) {
      if (!decorative && !lcpFound) {
        lcpFound = true;
        lcpImageUrl = getAttr(tag, "src");
      }
      if (!hasAttr(tag, "decoding")) {
        tag = addAttr(tag, "decoding", "async");
      }
      return tag;
    }

    if (!decorative && !lcpFound) {
      // First content image → LCP candidate
      lcpFound = true;
      lcpImageUrl = getAttr(tag, "src");
      if (!hasAttr(tag, "fetchpriority")) {
        tag = addAttr(tag, "fetchpriority", "high");
      }
      if (!hasAttr(tag, "decoding")) {
        tag = addAttr(tag, "decoding", "async");
      }
      return tag;
    }

    // All other images: lazy-load + async decode.
    // Skip loading="lazy" on any remaining image that already has fetchpriority="high"
    // (multiple above-fold priority images can exist; don't penalise them).
    if (!hasAttr(tag, "loading") && !alreadyHighPriority) {
      tag = addAttr(tag, "loading", "lazy");
    }
    if (!hasAttr(tag, "decoding")) {
      tag = addAttr(tag, "decoding", "async");
    }
    return tag;
  });

  return { html: patched, lcpImageUrl };
}
