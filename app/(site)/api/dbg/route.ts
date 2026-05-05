import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const LOG_PATH = path.join(process.cwd(), ".cursor", "debug-1accee.log");

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const line = JSON.stringify({ ...body, _server_ts: Date.now() }) + "\n";
    fs.mkdirSync(path.dirname(LOG_PATH), { recursive: true });
    fs.appendFileSync(LOG_PATH, line);
  } catch (_) {}
  return NextResponse.json({ ok: true });
}
