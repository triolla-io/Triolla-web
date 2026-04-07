import { readFile, writeFile } from "fs/promises";
import type { Tool } from "./tools";
import { PATHS } from "../deployment-agent/config";

const CONTENT_FILE = PATHS.contentLocal;

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

// ─── Tools ────────────────────────────────────────────────────────────────────

export const readContentTool: Tool<void, SiteContent> = {
  name: "read_content",
  maxAttempts: 2,
  async execute() {
    try {
      const raw = await readFile(CONTENT_FILE, "utf8");
      return { ok: true, data: JSON.parse(raw) as SiteContent };
    } catch (e) {
      return { ok: false, retryable: true, error: String(e) };
    }
  },
};

export const updateContentTool: Tool<{ page: PageKey; updates: Partial<PageContent[PageKey]> }, void> = {
  name: "update_content",
  maxAttempts: 2,
  async execute({ page, updates }) {
    try {
      await updateContent(page, updates as never);
      return { ok: true, data: undefined };
    } catch (e) {
      return { ok: false, retryable: true, error: String(e) };
    }
  },
};
