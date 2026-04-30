import { NextResponse } from "next/server";
import { z } from "zod";
import { requireAdmin } from "@/lib/cms/auth";
import {
  cmsScopeId,
  isValidKind,
  isValidLocale,
  isValidSlug,
  writePage,
} from "@/lib/cms/contentStore";
import { scopeCss } from "@/lib/cms/cssScoper";
import { sanitizeEditorHtml } from "@/lib/sanitize";

const Body = z.object({
  kind: z.string(),
  slug: z.string(),
  locale: z.string(),
  body: z.string().max(2_000_000),
  styles: z.string().max(1_000_000),
  meta: z.object({
    title: z.string().max(300),
    description: z.string().max(1000),
    ogImage: z.string().max(1024).optional(),
    jsonLd: z.unknown().optional(),
    status: z.enum(["draft", "published"]).optional(),
  }),
});

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
  const { kind, slug, locale, body, styles, meta } = parsed.data;
  if (!isValidKind(kind) || !isValidSlug(slug) || !isValidLocale(locale)) {
    return NextResponse.json({ error: "Invalid kind/slug/locale" }, { status: 400 });
  }

  const sanitized = sanitizeEditorHtml(body);
  let stylesScoped = "";
  try {
    stylesScoped = await scopeCss(styles, cmsScopeId(kind, slug));
  } catch (err) {
    return NextResponse.json(
      { error: "CSS parse error", detail: String(err) },
      { status: 400 }
    );
  }

  const result = await writePage(kind, slug, locale, {
    body: sanitized,
    styles,
    stylesScoped,
    meta: { ...meta, status: meta.status ?? "draft" },
  });

  return NextResponse.json({ ok: true, page: result });
}
