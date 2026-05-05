import { NextResponse } from "next/server";
import { z } from "zod";
import { requireAdmin } from "@/lib/cms/auth";
import {
  deletePage,
  isValidKind,
  isValidLocale,
  isValidSlug,
  readPage,
} from "@/lib/cms/contentStore";

const Query = z.object({
  kind: z.string(),
  slug: z.string(),
  locale: z.string(),
});

function parseParams(url: string) {
  const sp = new URL(url).searchParams;
  const parsed = Query.safeParse({
    kind: sp.get("kind") ?? "",
    slug: sp.get("slug") ?? "",
    locale: sp.get("locale") ?? "",
  });
  if (!parsed.success) return { error: "Invalid params" as const };
  const { kind, slug, locale } = parsed.data;
  if (!isValidKind(kind) || !isValidSlug(slug) || !isValidLocale(locale)) {
    return { error: "Invalid params" as const };
  }
  return { kind, slug, locale };
}

export async function GET(req: Request) {
  const guard = await requireAdmin();
  if (!guard.ok) return guard.response;
  const p = parseParams(req.url);
  if ("error" in p) return NextResponse.json({ error: p.error }, { status: 400 });
  const page = await readPage(p.kind, p.slug, p.locale);
  if (!page) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ page });
}

export async function DELETE(req: Request) {
  const guard = await requireAdmin();
  if (!guard.ok) return guard.response;
  const p = parseParams(req.url);
  if ("error" in p) return NextResponse.json({ error: p.error }, { status: 400 });
  await deletePage(p.kind, p.slug, p.locale);
  return NextResponse.json({ ok: true });
}
