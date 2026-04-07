import { readFile } from "fs/promises";
import { join } from "path";
import { NextResponse } from "next/server";

export async function GET() {
  const filePath = join(process.cwd(), "app/deployment-agent/mock-data.json");
  const data = JSON.parse(await readFile(filePath, "utf8"));
  return NextResponse.json(data);
}
