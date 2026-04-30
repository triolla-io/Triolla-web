import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/cms/auth";
import { listAllPages } from "@/lib/cms/contentStore";

export async function GET() {
  const guard = await requireAdmin();
  if (!guard.ok) return guard.response;
  const pages = await listAllPages();
  return NextResponse.json({ pages });
}
