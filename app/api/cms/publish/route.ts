import { NextResponse } from "next/server";
import { z } from "zod";
import { requireAdmin } from "@/lib/cms/auth";
import { publish } from "@/lib/cms/git";

const Body = z.object({
  message: z.string().min(1).max(500).optional(),
});

export async function POST(req: Request) {
  const guard = await requireAdmin();
  if (!guard.ok) return guard.response;

  let raw: unknown = {};
  try {
    raw = await req.json();
  } catch {
    /* empty body is fine */
  }
  const parsed = Body.safeParse(raw);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }
  const message =
    parsed.data.message ?? `CMS update by ${guard.session.email}`;
  const result = await publish({
    message: `${message}\n\nby ${guard.session.email}`,
    authorEmail: guard.session.email,
    authorName: guard.session.name ?? guard.session.email,
    paths: ["content", "public/uploads"],
  });
  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: 500 });
  }
  return NextResponse.json({ ok: true, sha: result.sha });
}

export const runtime = "nodejs";
