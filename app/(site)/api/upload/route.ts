import { NextResponse } from "next/server";

/** Phase 3: Vercel Blob uploads for editor image replacement. */
export async function POST() {
  return NextResponse.json(
    { error: "Upload is not implemented yet (Phase 3: Vercel Blob)." },
    { status: 501 },
  );
}
