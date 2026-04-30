import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/cms/auth";
import { getAllSlugs, getEntry } from "@/lib/snapshotRegistry";

export async function GET(req: Request) {
  const guard = await requireAdmin();
  if (!guard.ok) return guard.response;

  const { searchParams } = new URL(req.url);
  const kind = searchParams.get("kind") ?? "blog";
  const locale = searchParams.get("locale") ?? "en";

  const prefix = kind === "blog" ? "blog-" : "";
  const all = getAllSlugs();

  const seen = new Set<string>();
  const results: { slug: string; title: string; ogImage?: string; locale: string }[] = [];

  for (const { slug, locale: entryLocale } of all) {
    if (entryLocale !== locale) continue;
    if (prefix && !slug.includes(`-${prefix}`)) continue;
    if (seen.has(slug)) continue;
    seen.add(slug);

    const entry = getEntry(slug, locale);
    if (!entry) continue;

    const ogImage = entry.head?.metaTags?.find(
      (m) => m.property === "og:image"
    )?.content;
    const rawTitle = entry.head?.title ?? slug;
    // Strip trailing " - Triolla" or " | Triolla" suffixes.
    const title = rawTitle.replace(/\s*[-|]\s*Triolla.*$/i, "").trim() || rawTitle;

    results.push({ slug, title, ogImage, locale });
    if (results.length >= 50) break;
  }

  return NextResponse.json({ templates: results });
}
