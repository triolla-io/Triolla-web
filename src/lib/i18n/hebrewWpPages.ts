import generated from "@/messages/hebrewPages.generated.json";

export type HebrewWpPageRecord = {
  id: number | null;
  slug: string;
  link: string;
  template: string;
  title: string;
  excerpt: string;
  description: string;
  hasContent: boolean;
};

type HebrewWpGenerated = {
  generatedAt: string;
  source: string;
  count: number;
  records: Record<string, HebrewWpPageRecord>;
};

const data = generated as HebrewWpGenerated;

export const hebrewWpPagesGeneratedAt = data.generatedAt;
export const hebrewWpPagesCount = data.count;
export const hebrewWpPagesByKey = data.records;

function normalizePath(pathname: string): string {
  const withLeadingSlash = pathname.startsWith("/") ? pathname : `/${pathname}`;
  return withLeadingSlash.replace(/\/+$/, "") || "/";
}

function normalizeWpLink(link: string): string {
  try {
    const url = new URL(link);
    const decodedPath = decodeURIComponent(url.pathname);
    return normalizePath(decodedPath);
  } catch {
    return normalizePath(link);
  }
}

export function getHebrewWpPageByKey(key: string): HebrewWpPageRecord | undefined {
  return hebrewWpPagesByKey[key];
}

export function getHebrewWpPageByPath(pathname: string): HebrewWpPageRecord | undefined {
  const target = normalizePath(decodeURIComponent(pathname));
  const entries = Object.values(hebrewWpPagesByKey);
  return entries.find((entry) => normalizeWpLink(entry.link) === target);
}
