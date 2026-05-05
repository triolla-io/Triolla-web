import { NextResponse } from "next/server";

const MAX_BODY_BYTES = 16_384;
const PORTAL_ID = "5905093";
const FORM_GUID = "93f46e6d-1270-4f51-bd18-8d1b87cb5254";

// Gravity Forms field names → HubSpot contact property names
const FIELD_MAP: Record<string, string> = {
  input_1: "firstname",
  input_2: "lastname",
  input_3: "phone",
  input_4: "email",
  input_5: "message",
  input_11: "linkedin_bio",
};

export const runtime = "nodejs";

export async function POST(req: Request): Promise<NextResponse> {
  try {
    const contentType = req.headers.get("content-type") || "";
    if (!contentType.toLowerCase().includes("application/json")) {
      return NextResponse.json(
        { ok: false, error: "Expected application/json" },
        { status: 415 },
      );
    }

    const raw = await req.text();
    if (raw.length > MAX_BODY_BYTES) {
      return NextResponse.json(
        { ok: false, error: "Payload too large" },
        { status: 413 },
      );
    }

    let payload: unknown;
    try {
      payload = JSON.parse(raw);
    } catch {
      return NextResponse.json(
        { ok: false, error: "Invalid JSON" },
        { status: 400 },
      );
    }

    if (!payload || typeof payload !== "object") {
      return NextResponse.json(
        { ok: false, error: "Payload must be an object" },
        { status: 400 },
      );
    }

    const data = payload as Record<string, unknown>;

    // Map form fields to HubSpot property names
    const fields = Object.entries(data)
      .map(([key, value]) => ({
        name: FIELD_MAP[key] ?? key,
        value: String(value ?? "").trim(),
      }))
      .filter((f) => f.value !== "");

    const referer = req.headers.get("referer") || "";

    const hsPayload = {
      fields,
      context: {
        pageUri: referer || "triolla.io",
        pageName: "Contact Form",
      },
    };

    const hsRes = await fetch(
      `https://api.hsforms.com/submissions/v3/integration/submit/${PORTAL_ID}/${FORM_GUID}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(hsPayload),
      },
    );

    if (!hsRes.ok) {
      const errText = await hsRes.text().catch(() => "");
      console.error("[hubspot]", hsRes.status, errText);
      return NextResponse.json(
        { ok: false, error: `HubSpot error: ${hsRes.status}` },
        { status: 502 },
      );
    }

    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Internal error";
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}

export async function GET(): Promise<NextResponse> {
  return NextResponse.json({ ok: true, info: "POST JSON to submit." });
}
