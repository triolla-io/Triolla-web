import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { runDeploymentPipeline } from "../../deployment-agent/deploymentService";

const publishBodySchema = z.object({
  message: z.string().min(1).max(200).optional(),
});

export async function POST(req: NextRequest) {
  const token = req.headers.get("x-publish-token");
  if (token !== process.env.PUBLISH_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json().catch(() => ({}));
  const parsed = publishBodySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues }, { status: 400 });
  }

  const commitMessage = parsed.data.message ?? "chore: publish update";
  const result = await runDeploymentPipeline(commitMessage);

  return NextResponse.json(result);
}
