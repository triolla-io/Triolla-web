import { NextResponse } from "next/server";
import { z } from "zod";
import path from "path";
import { readFile, writeFile, rename } from "fs/promises";
import { requireAdmin } from "@/lib/cms/auth";
import { publish } from "@/lib/cms/git";
import { readDrafts, writeDrafts } from "@/lib/draftStore";
import { applyPatchesToHtml } from "@/lib/cms/patchApplicator";
import { getEntry } from "@/lib/snapshotRegistry";

const Body = z.object({
  slug: z.string().min(1).max(512),
  locale: z.string().min(1).max(32),
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
  const { slug, locale } = parsed.data;

  const patches = await readDrafts(slug, locale);
  if (patches.length === 0) {
    return NextResponse.json({ error: "No pending changes to publish" }, { status: 400 });
  }

  const entry = getEntry(slug, locale);
  if (!entry) {
    return NextResponse.json({ error: "Unknown snapshot page" }, { status: 404 });
  }

  const fragmentPath = path.join(process.cwd(), "public", entry.fragment);
  let html: string;
  try {
    html = await readFile(fragmentPath, "utf-8");
  } catch {
    return NextResponse.json({ error: "Fragment file not found" }, { status: 404 });
  }

  const updated = applyPatchesToHtml(html, patches);

  // Atomic write.
  const tmp = `${fragmentPath}.${process.pid}.tmp`;
  await writeFile(tmp, updated, "utf-8");
  await rename(tmp, fragmentPath);

  // Clear drafts.
  await writeDrafts(slug, locale, []);

  const commitMsg = `CMS: edit ${slug} [${locale}] by ${guard.session.email}`;
  const result = await publish({
    message: commitMsg,
    authorEmail: guard.session.email,
    authorName: guard.session.name ?? guard.session.email,
    paths: ["public/fragments", "data/drafts"],
  });

  if (!result.ok) {
    return NextResponse.json(
      { error: result.error, note: "Patches applied locally but push failed. Use Coolify redeploy." },
      { status: 500 }
    );
  }

  return NextResponse.json({ ok: true, sha: result.sha, patchCount: patches.length });
}

export const runtime = "nodejs";
