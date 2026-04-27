import "server-only";
import { notFound } from "next/navigation";
import { readFile } from "fs/promises";
import { unstable_cache } from "next/cache";
import path from "path";
import { readDrafts } from "./draftStore";
import { normalizeFragmentHtml, patchImageAttributes } from "./normalizeFragmentHtml";
import { applyPatches } from "./patches";
import { getEntry, type SnapshotEntry } from "./snapshotRegistry";

const EDITOR_ENABLED = process.env.NEXT_PUBLIC_EDITOR_ENABLED === "true";

/**
 * Server-side snapshot loader used by per-page route files
 * (app/page.tsx, app/about-us/page.tsx, app/he/page.tsx, …).
 *
 * Each generated page calls `loadSnapshot(slug, locale)` directly — no dynamic
 * params, no segment parsing. Returns the registry entry plus the page body
 * HTML fragment read from `public/<entry.fragment>`.
 *
 * Triggers notFound() if the slug is not in the registry or the fragment file
 * is missing on disk, so build failures surface as 404s rather than crashes.
 */
export type LoadedSnapshot = {
  entry: SnapshotEntry;
  bodyHtml: string;
  widgetProps: Record<string, { type: string; props: unknown }> | null;
};

// Cache the expensive part: disk read + HTML normalization.
// Keyed by fragment path so a re-extract (new fragment filename) busts the cache.
// Editor mode bypasses this cache so draft patches are always applied fresh.
const _readFragment = unstable_cache(
  async (fragmentPath: string) => {
    const raw = await readFile(fragmentPath, "utf-8");
    const normalized = normalizeFragmentHtml(raw);
    return patchImageAttributes(normalized);
  },
  ["snapshot-fragment"],
  { revalidate: false },
);

export async function loadSnapshot(
  slug: string,
  locale: string,
): Promise<LoadedSnapshot> {
  const entry = getEntry(slug, locale);
  if (!entry) notFound();

  try {
    const fragmentPath = path.join(process.cwd(), "public", entry.fragment);

    let patchedHtml: string;
    let lcpImageUrl: string | null | undefined;

    if (EDITOR_ENABLED) {
      let bodyHtml = await readFile(fragmentPath, "utf-8");
      try {
        const patches = await readDrafts(slug, locale);
        if (patches.length > 0) {
          const { html } = applyPatches(bodyHtml, patches);
          bodyHtml = html;
        }
      } catch (e) {
        console.error("[loadSnapshot] draft patches failed", slug, locale, e);
      }
      const normalized = normalizeFragmentHtml(bodyHtml);
      ({ html: patchedHtml, lcpImageUrl } = patchImageAttributes(normalized));
    } else {
      ({ html: patchedHtml, lcpImageUrl } = await _readFragment(fragmentPath));
    }

    const widgetProps = await readWidgetProps(slug, locale);

    // Augment entry with a detected LCP image preload when the registry doesn't
    // already supply one. This lets the page emit a <link rel="preload"> in the
    // SSR <head> so the browser starts the download before React hydrates.
    const augmentedEntry = lcpImageUrl && !entry.imagePreloads?.length
      ? { ...entry, imagePreloads: [{ href: lcpImageUrl }] }
      : entry;

    return { entry: augmentedEntry, bodyHtml: patchedHtml, widgetProps };
  } catch {
    notFound();
  }
}

async function readWidgetProps(
  slug: string,
  locale: string,
): Promise<Record<string, { type: string; props: unknown }> | null> {
  const propsPath = path.join(
    process.cwd(),
    "lib",
    "widgetProps",
    `${slug}-${locale}.json`,
  );
  try {
    const raw = await readFile(propsPath, "utf-8");
    const parsed: unknown = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
      return null;
    }
    return parsed as Record<string, { type: string; props: unknown }>;
  } catch {
    return null;
  }
}
