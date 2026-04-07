import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { runDeploymentPipeline } from "../../agents/deployment-agent/deploymentService";

// ─── Rate limiting (in-memory, sliding window) ────────────────────────────────

const RATE_LIMIT_WINDOW_MS = 60_000; // 1 minute
const RATE_LIMIT_MAX = 5;            // max requests per window per IP

const requestLog = new Map<string, number[]>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const windowStart = now - RATE_LIMIT_WINDOW_MS;
  const timestamps = (requestLog.get(ip) ?? []).filter((t) => t > windowStart);
  if (timestamps.length >= RATE_LIMIT_MAX) return true;
  requestLog.set(ip, [...timestamps, now]);
  return false;
}

// ─── Route ────────────────────────────────────────────────────────────────────

const publishBodySchema = z.object({
  message: z.string().min(1).max(200).optional(),
});

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0].trim() ?? "unknown";
  if (isRateLimited(ip)) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  // TODO: replace with proper auth
  const body = await req.json().catch(() => ({}));
  const parsed = publishBodySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues }, { status: 400 });
  }

  const result = await runDeploymentPipeline(parsed.data.message ?? "chore: publish update");
  return NextResponse.json(result);
}
