import { NextResponse } from "next/server";
import { z } from "zod";
import { getEntry } from "@/lib/snapshotRegistry";
import { readDrafts, writeDrafts } from "@/lib/draftStore";
import type { Patch } from "@/lib/patches";
import { sanitizeEditorHtml } from "@/lib/sanitize";

const EDITOR_ENABLED = process.env.NEXT_PUBLIC_EDITOR_ENABLED === "true";

const PatchSchema = z.object({
  id: z.string().uuid(),
  selector: z.string().min(1).max(4000),
  op: z.enum(["setText", "setHtml", "setAttr"]),
  attr: z.string().max(128).optional(),
  value: z.string().max(1_000_000),
  fingerprint: z.string().max(128),
  updatedAt: z.number(),
});

const PostBody = z.object({
  slug: z.string().min(1).max(512),
  locale: z.string().min(1).max(32),
  patch: PatchSchema,
});

function notEnabled() {
  return NextResponse.json({ error: "Not found" }, { status: 404 });
}

export async function GET(req: Request) {
  if (!EDITOR_ENABLED) return notEnabled();
  const { searchParams } = new URL(req.url);
  const slug = searchParams.get("slug") ?? "";
  const locale = searchParams.get("locale") ?? "";
  if (!getEntry(slug, locale)) {
    return NextResponse.json({ error: "Unknown page" }, { status: 404 });
  }
  const patches = await readDrafts(slug, locale);
  return NextResponse.json({ patches });
}

export async function POST(req: Request) {
  if (!EDITOR_ENABLED) return notEnabled();
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
  const parsed = PostBody.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }
  const { slug, locale, patch: incoming } = parsed.data;
  if (!getEntry(slug, locale)) {
    return NextResponse.json({ error: "Unknown page" }, { status: 404 });
  }

  let value = incoming.value;
  if (incoming.op === "setHtml") {
    value = sanitizeEditorHtml(value);
  }

  const patch: Patch = {
    ...incoming,
    value,
    updatedAt: Date.now(),
  };

  const existing = await readDrafts(slug, locale);
  const idx = existing.findIndex((p) => p.id === patch.id);
  const next =
    idx === -1 ? [...existing, patch] : existing.map((p, i) => (i === idx ? patch : p));
  await writeDrafts(slug, locale, next);
  return NextResponse.json({ ok: true, patches: next });
}

const DeleteQuery = z.object({
  slug: z.string().min(1).max(512),
  locale: z.string().min(1).max(32),
  id: z.string().uuid(),
});

export async function DELETE(req: Request) {
  if (!EDITOR_ENABLED) return notEnabled();
  const { searchParams } = new URL(req.url);
  const q = DeleteQuery.safeParse({
    slug: searchParams.get("slug") ?? "",
    locale: searchParams.get("locale") ?? "",
    id: searchParams.get("id") ?? "",
  });
  if (!q.success) {
    return NextResponse.json({ error: q.error.flatten() }, { status: 400 });
  }
  const { slug, locale, id } = q.data;
  if (!getEntry(slug, locale)) {
    return NextResponse.json({ error: "Unknown page" }, { status: 404 });
  }
  const existing = await readDrafts(slug, locale);
  const next = existing.filter((p) => p.id !== id);
  await writeDrafts(slug, locale, next);
  return NextResponse.json({ ok: true, patches: next });
}
