import "server-only";
import path from "path";
import { mkdir, readFile, rename, writeFile } from "fs/promises";
import type { Patch } from "./patches";

function draftPath(slug: string, locale: string): string {
  if (slug.includes("..") || locale.includes("..") || slug.includes("/") || locale.includes("/")) {
    throw new Error("Invalid slug or locale");
  }
  return path.join(process.cwd(), "data", "drafts", `${slug}-${locale}.json`);
}

export type DraftFile = { patches: Patch[] };

export async function readDrafts(slug: string, locale: string): Promise<Patch[]> {
  const p = draftPath(slug, locale);
  try {
    const raw = await readFile(p, "utf-8");
    const data = JSON.parse(raw) as unknown;
    if (!data || typeof data !== "object" || !("patches" in data)) return [];
    const patches = (data as DraftFile).patches;
    return Array.isArray(patches) ? patches : [];
  } catch {
    return [];
  }
}

export async function writeDrafts(slug: string, locale: string, patches: Patch[]): Promise<void> {
  const p = draftPath(slug, locale);
  await mkdir(path.dirname(p), { recursive: true });
  const tmp = `${p}.${process.pid}.tmp`;
  const body = JSON.stringify({ patches } satisfies DraftFile, null, 2);
  await writeFile(tmp, body, "utf-8");
  await rename(tmp, p);
}
