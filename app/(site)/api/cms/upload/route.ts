import { NextResponse } from "next/server";
import { createHash } from "crypto";
import { mkdir, writeFile } from "fs/promises";
import path from "path";
import { requireAdmin } from "@/lib/cms/auth";

const ALLOWED = new Set([
  "image/png",
  "image/jpeg",
  "image/webp",
  "image/gif",
  "image/svg+xml",
]);
const MAX_BYTES = 8 * 1024 * 1024;
const EXT_BY_MIME: Record<string, string> = {
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/webp": "webp",
  "image/gif": "gif",
  "image/svg+xml": "svg",
};

export async function POST(req: Request) {
  const guard = await requireAdmin();
  if (!guard.ok) return guard.response;

  const form = await req.formData().catch(() => null);
  const file = form?.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "No file" }, { status: 400 });
  }
  if (!ALLOWED.has(file.type)) {
    return NextResponse.json({ error: "Unsupported type" }, { status: 415 });
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json({ error: "Too large (max 8 MB)" }, { status: 413 });
  }

  const buf = Buffer.from(await file.arrayBuffer());
  const sha = createHash("sha256").update(buf).digest("hex");
  const prefix = sha.slice(0, 2);
  const ext = EXT_BY_MIME[file.type];
  const filename = `${sha}.${ext}`;

  const targetDir = path.join(process.cwd(), "public", "uploads", prefix);
  await mkdir(targetDir, { recursive: true });
  const target = path.join(targetDir, filename);
  await writeFile(target, buf);

  return NextResponse.json({
    url: `/uploads/${prefix}/${filename}`,
    sha256: sha,
    size: file.size,
    type: file.type,
  });
}

export const runtime = "nodejs";
