import fs from "node:fs";
import path from "node:path";

const INPUT_PATH = path.resolve(process.cwd(), "src/scripts/hebrewPages.json");
const OUTPUT_PATH = path.resolve(process.cwd(), "src/messages/hebrewPages.generated.json");

function stripHtml(html) {
  return String(html ?? "")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&#(\d+);/g, (_, code) => String.fromCodePoint(Number(code)))
    .replace(/&#x([0-9a-fA-F]+);/g, (_, code) => String.fromCodePoint(parseInt(code, 16)))
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/\s+/g, " ")
    .trim();
}

function normalizeKey(value) {
  const decoded = decodeURIComponent(String(value ?? "").trim());
  return decoded
    .replace(/[^\p{L}\p{N}\s-]/gu, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

function buildEntry(page) {
  const slug = decodeURIComponent(String(page?.slug ?? ""));
  const title = stripHtml(page?.title?.rendered ?? "");
  const excerpt = stripHtml(page?.excerpt?.rendered ?? "");
  const description = stripHtml(page?.content?.rendered ?? "");
  const link = String(page?.link ?? "");
  const template = String(page?.template ?? "");

  return {
    id: page?.id ?? null,
    slug,
    link,
    template,
    title,
    excerpt,
    description,
    hasContent: description.length > 0,
  };
}

const raw = fs.readFileSync(INPUT_PATH, "utf8");
const pages = JSON.parse(raw);

if (!Array.isArray(pages)) {
  throw new Error("Expected hebrewPages.json to contain an array.");
}

const records = {};

for (const page of pages) {
  const entry = buildEntry(page);
  const keyFromSlug = normalizeKey(entry.slug);
  const keyFromTitle = normalizeKey(entry.title);
  const key = keyFromSlug || keyFromTitle || `page-${entry.id ?? "unknown"}`;
  records[key] = entry;
}

const payload = {
  generatedAt: new Date().toISOString(),
  source: "src/scripts/hebrewPages.json",
  count: Object.keys(records).length,
  records,
};

fs.writeFileSync(OUTPUT_PATH, `${JSON.stringify(payload, null, 2)}\n`, "utf8");
console.log(`Generated ${OUTPUT_PATH} with ${payload.count} records.`);
