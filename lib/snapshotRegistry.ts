import { readFileSync } from "fs";
import { join } from "path";

// Lazy load: deferring the readFileSync keeps the 21 MB JSON out of any
// serverless function bundle that imports types/helpers from this file but
// doesn't actually call getEntry/getAllSlugs at runtime.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let _registryCache: any[] | null = null;
function _loadRegistry(): SnapshotEntry[] {
  if (_registryCache) return _registryCache as SnapshotEntry[];
  _registryCache = JSON.parse(
    readFileSync(join(process.cwd(), "lib", "snapshotRegistry.json"), "utf-8"),
  );
  return _registryCache as SnapshotEntry[];
}

export interface SnapshotHeadMeta {
  name?: string;
  property?: string;
  content?: string;
  charset?: string;
  "http-equiv"?: string;
  [key: string]: string | undefined;
}

export interface SnapshotHeadLink {
  rel?: string;
  href?: string;
  hreflang?: string;
  type?: string;
  sizes?: string;
  [key: string]: string | undefined;
}

export interface SnapshotHead {
  title: string;
  htmlLang: string;
  htmlDir: "ltr" | "rtl";
  metaTags: SnapshotHeadMeta[];
  linkTags: SnapshotHeadLink[];
  jsonLd: string[];
  jsonLdSynthesized?: string[];
  ogImage?: string;
}

export interface SnapshotEntry {
  slug: string;
  locale: string;
  dir: "ltr" | "rtl";
  /** Public URL path (e.g. `/he/technology/`) when this entry is routed under `/he/*` */
  path?: string;
  fragment: string;
  css: string[];
  js: string[];
  inlineScripts: Array<{ position: number; code: string }>;
  loadOrderSha: string;
  gsapHook: boolean;
  loadedDelayMs: number;
  head?: SnapshotHead;
  fontPreloads?: string[];
  imagePreloads?: Array<{
    href: string;
    type?: string;
    imagesrcset?: string;
  }>;
  jsDefer?: string[];
}

/**
 * Compute the common slug prefix shared by all entries (e.g. "triolla-io-").
 * Used as a fallback so URL paths like "about-us" resolve to "triolla-io-about-us".
 */
let _domainPrefixCache: string | null = null;
function _getDomainPrefix(): string {
  if (_domainPrefixCache !== null) return _domainPrefixCache;
  const registry = _loadRegistry();
  if (registry.length < 2) return (_domainPrefixCache = "");
  let prefix = registry[0].slug;
  for (const entry of registry) {
    while (prefix && !entry.slug.startsWith(prefix)) {
      // Drop trailing dash (if any) so lastIndexOf finds the *previous* dash,
      // otherwise we'd slice back to the same string and loop forever.
      const trimmed = prefix.endsWith("-") ? prefix.slice(0, -1) : prefix;
      const dash = trimmed.lastIndexOf("-");
      prefix = dash === -1 ? "" : trimmed.slice(0, dash + 1);
    }
    if (!prefix) break;
  }
  return (_domainPrefixCache = prefix.endsWith("-") ? prefix : "");
}

export function getEntry(slug: string, locale: string): SnapshotEntry | null {
  const registry = _loadRegistry();
  // Exact match
  const exact =
    registry.find((e) => e.slug === slug && e.locale === locale) ??
    registry.find((e) => e.slug === slug);
  if (exact) return exact;

  // Fallback: try with domain prefix (e.g. "home" → "triolla-io-home")
  const domainPrefix = _getDomainPrefix();
  if (domainPrefix) {
    const prefixed = `${domainPrefix}${slug}`;
    return (
      registry.find((e) => e.slug === prefixed && e.locale === locale) ??
      registry.find((e) => e.slug === prefixed) ??
      null
    );
  }

  return null;
}

export function getAllSlugs(): Array<{ slug: string; locale: string }> {
  return _loadRegistry().map((e) => ({ slug: e.slug, locale: e.locale }));
}

export function getAllLocales(): string[] {
  return [...new Set(_loadRegistry().map((e) => e.locale))];
}

export function getDefaultLocale(): string {
  const registry = _loadRegistry();
  const entry = registry.find((e) => e.locale === "en") ?? registry[0];
  return entry?.locale ?? "en";
}

/** Lowercase percent-hex so `%D7%90` matches `%d7%90`. */
export function lowerPercentHexEncoding(p: string): string {
  return p.replace(/%[0-9A-Fa-f]{2}/g, (m) => "%" + m.slice(1).toLowerCase());
}

/** Normalize `/he/...` paths for comparison (trailing slash, no query/hash). */
export function normalizeHePublicPath(p: string): string {
  let s = p.split("?")[0].split("#")[0];
  if (!s.startsWith("/he")) return s;
  if (!s.endsWith("/")) s += "/";
  return lowerPercentHexEncoding(s);
}

function hePathKeys(p: string): string[] {
  const n = normalizeHePublicPath(p);
  const keys = new Set<string>([n]);
  try {
    keys.add(decodeURI(n));
  } catch {
    /* ignore */
  }
  return [...keys];
}

/**
 * Resolve a Hebrew URL path to a registry entry (locale `he`, optional `path`).
 * Matches encoded vs decoded forms.
 */
export function matchHebrewRegistryPath(pathname: string): SnapshotEntry | null {
  const want = new Set(hePathKeys(pathname));
  for (const e of _loadRegistry()) {
    if (e.locale !== "he" || !e.path) continue;
    for (const k of hePathKeys(e.path)) {
      if (want.has(k)) return e;
    }
  }
  return null;
}

/** Build `/he/.../` from Next.js `params.segments` (filesystem segment names). */
export function heSegmentsToPathname(segments: string[]): string {
  if (!segments.length) return "/he/";
  const tail = segments.join("/");
  return normalizeHePublicPath(`/he/${tail}`);
}

/** Paths under `/he/` for `generateStaticParams` (excludes `/he/` home). */
export function getHeStaticSegmentParams(): { segments: string[] }[] {
  const seen = new Set<string>();
  const out: { segments: string[] }[] = [];
  for (const e of _loadRegistry()) {
    if (e.locale !== "he" || !e.path) continue;
    const n = normalizeHePublicPath(e.path);
    if (n === "/he/") continue;
    const inner = n.slice("/he/".length, -1);
    if (!inner) continue;
    if (seen.has(inner)) continue;
    seen.add(inner);
    out.push({ segments: inner.split("/").filter(Boolean) });
  }
  return out;
}
