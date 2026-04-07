import { readFile, writeFile } from "fs/promises";
import { join } from "path";

const CONTENT_FILE = join(process.cwd(), "app/deployment-agent/mock-data.json");

// ─── Types ────────────────────────────────────────────────────────────────────

export type PageKey = "metadata" | "home"; // extend as pages are added

export type PageContent = {
  metadata: {
    version: number;
    updatedAt: string;
  };
  home: {
    heroTitle: string;
    heroSubtitle: string;
  };
};

export type SiteContent = PageContent;

// ─── Read ─────────────────────────────────────────────────────────────────────

export async function getContent(): Promise<SiteContent>;
export async function getContent<K extends PageKey>(page: K): Promise<PageContent[K]>;
export async function getContent<K extends PageKey>(page?: K): Promise<SiteContent | PageContent[K]> {
  const raw = JSON.parse(await readFile(CONTENT_FILE, "utf8")) as SiteContent;
  return page ? raw[page] : raw;
}

// ─── Write (server/admin only) ────────────────────────────────────────────────

export async function updateContent<K extends PageKey>(
  page: K,
  updates: Partial<PageContent[K]>
): Promise<void> {
  const current = JSON.parse(await readFile(CONTENT_FILE, "utf8")) as SiteContent;
  current[page] = { ...current[page], ...updates };
  await writeFile(CONTENT_FILE, JSON.stringify(current, null, 2) + "\n");
}
