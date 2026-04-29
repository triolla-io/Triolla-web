#!/usr/bin/env node
/**
 * inject-lcp-preloads.mjs
 *
 * Reads every *-mobile.json LHR from .lighthouse/lhr-live/, extracts the URL
 * that Lighthouse identified as the Largest Contentful Paint element, and
 * writes it into the matching snapshotRegistry.json entry as `imagePreloads`.
 *
 * This gives the page component a machine-verified preload URL — the browser
 * will start fetching the LCP image during HTML parse, before any JS runs.
 *
 * Rules:
 *   - Only injects for CAS paths (/assets/_cas/) — reliable, local, fast.
 *   - Skips SVGs (vector, no decode benefit from preload).
 *   - Skips entries that already have imagePreloads set.
 *   - Safe to re-run: idempotent.
 *
 * Usage:
 *   node scripts/inject-lcp-preloads.mjs [--dry-run]
 */

import { readFileSync, writeFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

const ROOT = process.cwd();
const LHR_DIR = join(ROOT, ".lighthouse", "lhr-live");
const REGISTRY_PATH = join(ROOT, "lib", "snapshotRegistry.json");

const DRY_RUN = process.argv.includes("--dry-run");
if (DRY_RUN) console.log("[inject-lcp] DRY RUN — registry will not be written");

// ─── Parse the LCP element src from an LHR ─────────────────────────────────

function extractLcpSrc(lhr) {
  const lcp = lhr.audits?.["largest-contentful-paint-element"];
  if (!lcp?.details?.items) return null;

  // details.items is an array of tables. The first table has headings[0].label === "Element".
  for (const table of lcp.details.items) {
    if (!Array.isArray(table.headings)) continue;
    if (table.headings[0]?.label !== "Element") continue;
    const node = table.items?.[0]?.node;
    if (!node?.snippet) continue;
    const m = node.snippet.match(/\bsrc=["']([^"']+)["']/);
    if (m) return m[1];
  }
  return null;
}

// ─── Map LHR filename → { slug, locale } ───────────────────────────────────
//
// File name pattern: <slug>-<locale>-mobile.json
// where <locale> is a 2-letter ISO code (en, he, …).
// Examples:
//   triolla-io-blog-foo-en-mobile.json → slug=triolla-io-blog-foo, locale=en
//   triolla-io-blog-foo-1-he-mobile.json → slug=triolla-io-blog-foo-1, locale=he

function parseFilename(filename) {
  const base = filename.replace(/-mobile\.json$/, "");
  // Match last -<2-letter-code> segment
  const m = base.match(/^(.+)-([a-z]{2})$/);
  if (!m) return null;
  return { slug: m[1], locale: m[2] };
}

// ─── Main ───────────────────────────────────────────────────────────────────

const registry = JSON.parse(readFileSync(REGISTRY_PATH, "utf-8"));

// Build O(1) index: "slug|locale" → array index
const byKey = new Map(registry.map((e, i) => [`${e.slug}|${e.locale}`, i]));

let updated = 0;
let alreadySet = 0;
let noLhr = 0;
let skipped = 0;

let files;
try {
  files = readdirSync(LHR_DIR).filter((f) => f.endsWith("-mobile.json"));
} catch {
  console.error(`[inject-lcp] LHR directory not found: ${LHR_DIR}`);
  console.error("  Run the lighthouse suite first: node scripts/lighthouse-suite.mjs --once");
  process.exit(1);
}

console.log(`[inject-lcp] Processing ${files.length} mobile LHR files…`);

for (const file of files) {
  const parsed = parseFilename(file);
  if (!parsed) { skipped++; continue; }

  const idx = byKey.get(`${parsed.slug}|${parsed.locale}`);
  if (idx === undefined) { noLhr++; continue; }

  const entry = registry[idx];

  // Already has a manually-set or previously injected preload — don't overwrite.
  if (entry.imagePreloads?.length) { alreadySet++; continue; }

  let lhr;
  try {
    lhr = JSON.parse(readFileSync(join(LHR_DIR, file), "utf-8"));
  } catch {
    skipped++;
    continue;
  }

  const src = extractLcpSrc(lhr);

  // Only inject CAS paths: local, immutably cached, guaranteed available.
  // Skip SVGs (they render natively; preload hint has minimal LCP impact).
  if (!src || !src.startsWith("/assets/_cas/") || /\.svg$/i.test(src)) {
    skipped++;
    continue;
  }

  entry.imagePreloads = [{ href: src }];
  updated++;
  console.log(`  [+] ${parsed.slug} (${parsed.locale})`);
  console.log(`       → ${src.slice(0, 90)}`);
}

console.log(
  `\n[inject-lcp] ${updated} updated, ${alreadySet} already set, ` +
    `${noLhr} no registry match, ${skipped} skipped (no CAS WebP LCP).`,
);

if (!DRY_RUN && updated > 0) {
  writeFileSync(REGISTRY_PATH, JSON.stringify(registry, null, 2) + "\n");
  console.log(`[inject-lcp] Wrote ${REGISTRY_PATH}`);
} else if (DRY_RUN) {
  console.log("[inject-lcp] DRY RUN — no changes written.");
}
