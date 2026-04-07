import { NextRequest, NextResponse } from "next/server";
import { getRunStatus } from "../../../agents/deployment-agent/statusStore";

export async function GET(req: NextRequest) {
  const id = req.nextUrl.searchParams.get("id");
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

  const status = getRunStatus(id);
  if (!status) return NextResponse.json({ error: "Not found" }, { status: 404 });

  return NextResponse.json(status);
}
