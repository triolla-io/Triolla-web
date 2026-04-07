import { NextRequest, NextResponse } from "next/server";
import { getDeploymentStatus } from "../../../deployment-agent/deploymentService";

export async function GET(req: NextRequest) {
  const id = req.nextUrl.searchParams.get("id");
  if (!id) {
    return NextResponse.json({ error: "Missing id" }, { status: 400 });
  }

  try {
    const status = await getDeploymentStatus(id);
    return NextResponse.json({ status });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Unknown error" },
      { status: 500 }
    );
  }
}
