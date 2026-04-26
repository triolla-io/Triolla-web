#!/usr/bin/env node
/**
 * Adds registry entries for Hebrew fragment files on disk that are missing from
 * snapshotRegistry.json (reads canonical path from .pageurl in the fragment).
 */
import { readFile, writeFile, readdir } from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const FRAGMENTS = path.join(ROOT, "public", "fragments");
const REGISTRY_PATH = path.join(ROOT, "lib", "snapshotRegistry.json");
const TEMPLATE_SLUG = "triolla-io-he-about-us";

function lowerPercentHex(p) {
  return p.replace(/%[0-9A-Fa-f]{2}/g, (m) => "%" + m.slice(1).toLowerCase());
}

function normalizePath(p) {
  if (!p || !p.startsWith("/he")) return null;
  let s = p.split("?")[0].split("#")[0].trim();
  if (!s.endsWith("/")) s += "/";
  return lowerPercentHex(s);
}

function extractPageUrl(html) {
  const m = html.match(/class="pageurl"[^>]*>([^<]+)</i);
  if (!m) return null;
  return normalizePath(m[1].trim());
}

async function main() {
  const registry = JSON.parse(await readFile(REGISTRY_PATH, "utf-8"));
  const template = registry.find((e) => e.slug === TEMPLATE_SLUG && e.locale === "he");
  if (!template) {
    console.error(`Missing template ${TEMPLATE_SLUG}`);
    process.exit(1);
  }
  const bySlug = new Map(registry.map((e) => [e.slug, e]));
  const byPath = new Set(
    registry.filter((e) => e.locale === "he" && e.path).map((e) => normalizePath(e.path)),
  );

  const files = (await readdir(FRAGMENTS)).filter(
    (f) => f.startsWith("triolla-io-he-") && f.endsWith("-he-body.html"),
  );
  let added = 0;
  for (const fname of files) {
    const slug = fname.replace(/-he-body\.html$/, "");
    if (bySlug.has(slug)) continue;

    const html = await readFile(path.join(FRAGMENTS, fname), "utf-8");
    const p = extractPageUrl(html);
    if (!p) {
      console.warn(`skip ${fname}: no .pageurl path`);
      continue;
    }
    if (byPath.has(p)) {
      console.warn(`skip ${fname}: path already registered ${p}`);
      continue;
    }

    const entry = structuredClone(template);
    entry.slug = slug;
    entry.locale = "he";
    entry.dir = "rtl";
    entry.path = p;
    entry.fragment = `fragments/${fname}`;
    const titleMatch = html.match(/<title>([^<]+)<\/title>/i);
    if (titleMatch && entry.head) {
      entry.head = { ...entry.head, title: titleMatch[1].trim() };
    }
    registry.push(entry);
    bySlug.set(slug, entry);
    byPath.add(p);
    added++;
    console.log(`registered ${slug} -> ${p}`);
  }

  if (added) {
    await writeFile(REGISTRY_PATH, JSON.stringify(registry, null, 2) + "\n", "utf-8");
  }
  console.log(`register-orphan-he-fragments: added ${added} entr(y|ies)`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
