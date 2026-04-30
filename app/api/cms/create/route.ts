import { NextResponse } from "next/server";
import { z } from "zod";
import path from "path";
import { readFile } from "fs/promises";
import { requireAdmin } from "@/lib/cms/auth";
import {
  cmsScopeId,
  isValidKind,
  isValidLocale,
  isValidSlug,
  localeExists,
  readPage,
  writePage,
} from "@/lib/cms/contentStore";
import { scopeCss } from "@/lib/cms/cssScoper";
import { getEntry } from "@/lib/snapshotRegistry";

const Body = z.object({
  kind: z.string(),
  slug: z.string(),
  locale: z.string(),
  // Clone an existing CMS page as template.
  fromTemplate: z
    .object({ kind: z.string(), slug: z.string(), locale: z.string() })
    .optional(),
  // Clone a snapshot registry entry as template (inherits CSS/JS + seeds body HTML).
  fromSnapshotTemplate: z.string().max(512).optional(),
});

const STARTER_HTML = `<section class="cms-section">
  <h1>New page</h1>
  <p>Edit this content in the CMS editor.</p>
</section>
`;

const STARTER_CSS = `.cms-section {
  padding: 64px 24px;
  max-width: 960px;
  margin: 0 auto;
  font-family: ui-sans-serif, system-ui, sans-serif;
}
.cms-section h1 {
  font-size: 36px;
  margin: 0 0 16px;
}
`;

export async function POST(req: Request) {
  const guard = await requireAdmin();
  if (!guard.ok) return guard.response;

  let raw: unknown;
  try {
    raw = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
  const parsed = Body.safeParse(raw);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }
  const { kind, slug, locale, fromTemplate, fromSnapshotTemplate } = parsed.data;
  if (!isValidKind(kind) || !isValidSlug(slug) || !isValidLocale(locale)) {
    return NextResponse.json({ error: "Invalid kind/slug/locale" }, { status: 400 });
  }
  if (await localeExists(kind, slug, locale)) {
    return NextResponse.json({ error: "Page+locale already exists" }, { status: 409 });
  }

  let body = STARTER_HTML;
  let styles = STARTER_CSS;
  let title = slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
  let description = "";
  let templateSlug: string | undefined;

  if (fromSnapshotTemplate) {
    // Inherit CSS/JS from the snapshot entry + seed body from its fragment.
    const entry =
      getEntry(fromSnapshotTemplate, locale) ?? getEntry(fromSnapshotTemplate, "en");
    if (entry) {
      templateSlug = entry.slug;
      // Seed body from the fragment so CEO sees real HTML structure to replace.
      try {
        const fragmentPath = path.join(process.cwd(), "public", entry.fragment);
        body = await readFile(fragmentPath, "utf-8");
      } catch {
        body = STARTER_HTML;
      }
      styles = "";
      const rawTitle = entry.head?.title ?? slug;
      title = rawTitle.replace(/\s*[-|]\s*Triolla.*$/i, "").trim() || title;
      const ogMeta = entry.head?.metaTags?.find((m) => m.property === "og:image");
      description = entry.head?.metaTags?.find((m) => m.name === "description")?.content ?? "";
    }
  } else if (fromTemplate) {
    // Clone from an existing CMS page.
    if (
      isValidKind(fromTemplate.kind) &&
      isValidSlug(fromTemplate.slug) &&
      isValidLocale(fromTemplate.locale)
    ) {
      const src = await readPage(fromTemplate.kind, fromTemplate.slug, fromTemplate.locale);
      if (src) {
        body = src.body;
        styles = src.styles;
        title = src.meta.title || title;
        description = src.meta.description || "";
        templateSlug = src.meta.templateSlug;
      }
    }
  }

  const stylesScoped = styles ? await scopeCss(styles, cmsScopeId(kind, slug)) : "";
  const result = await writePage(kind, slug, locale, {
    body,
    styles,
    stylesScoped,
    meta: { title, description, status: "draft", templateSlug },
  });

  return NextResponse.json({ ok: true, page: result });
}
