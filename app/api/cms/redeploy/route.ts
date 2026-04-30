import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/cms/auth";
import { triggerCoolifyRedeploy } from "@/lib/cms/coolify";

export async function POST() {
  const guard = await requireAdmin();
  if (!guard.ok) return guard.response;
  const result = await triggerCoolifyRedeploy();
  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: 500 });
  }
  return NextResponse.json({ ok: true });
}
