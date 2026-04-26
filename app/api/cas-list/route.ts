import { NextResponse } from "next/server";
import path from "path";
import { readdir } from "fs/promises";

const EDITOR_ENABLED = process.env.NEXT_PUBLIC_EDITOR_ENABLED === "true";
const CAS_DIR = path.join(process.cwd(), "public", "assets", "_cas");
const MAX_FILES = 800;

export async function GET() {
  if (!EDITOR_ENABLED) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  try {
    const names = await readdir(CAS_DIR);
    const files = names
      .filter((n) => !n.startsWith("."))
      .slice(0, MAX_FILES)
      .map((n) => `/assets/_cas/${n}`);
    return NextResponse.json({ files });
  } catch {
    return NextResponse.json({ files: [] as string[] });
  }
}
