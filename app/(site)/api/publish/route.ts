import { NextResponse } from "next/server";

/** Phase 2: promote drafts → published store + `revalidatePath`. */
export async function POST() {
  return NextResponse.json(
    { error: "Publish is not implemented yet (Phase 2: Auth + KV + revalidatePath)." },
    { status: 501 },
  );
}
