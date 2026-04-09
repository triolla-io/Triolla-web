import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { startDeployment } from "../../../agents/deployment-agent/deploymentService";
import { isRateLimited, getIp } from "../../utils/rateLimit";

const publishBodySchema = z.object({
  message: z.string().min(1).max(200).optional(),
});

export async function POST(req: NextRequest) {
  if (isRateLimited(getIp(req), { max: 4, windowMs: 5 * 60_000 })) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  // TODO: add proper auth
  
  const body = await req.json().catch(() => ({}));
  const parsed = publishBodySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues }, { status: 400 });
  }

  const runId = startDeployment(parsed.data.message ?? `chore: publish update - ${new Date().toISOString()}`);
  return NextResponse.json({ runId });
}
