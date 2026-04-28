#!/usr/bin/env node
// One-shot script: inserts SSR JS preload hints into every app/**/page.tsx.
// Safe to re-run — skips files that already contain the preload block.

import { readFileSync, writeFileSync, readdirSync, statSync } from "fs";
import { join } from "path";

const ROOT = "/Users/ariell/Desktop/triolla-snapshot/output/triolla.io";

function findPages(dir) {
  const results = [];
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) {
      results.push(...findPages(full));
    } else if (entry === "page.tsx") {
      results.push(full);
    }
  }
  return results;
}

const ANCHOR = `      {/* SSR snapshot CSS so downloads start during HTML parse`;

const PRELOAD_BLOCK = `      {/* SSR JS preloads — browser starts fetching scripts during HTML parse, not after hydration */}
      {entry.js
        .filter((src) => !/googletagmanager|facebook\\.net|hotjar|clarity\\.ms|hubspot|hs-scripts|\\/\\d{7,}\\.js/i.test(src))
        .slice(0, 5)
        .map((href) => (
          <link key={href} rel="preload" as="script" href={href} />
        ))}
`;

const pages = findPages(join(ROOT, "app"));

let updated = 0;
let skipped = 0;

for (const file of pages) {
  const src = readFileSync(file, "utf8");
  if (src.includes("SSR JS preloads")) {
    skipped++;
    continue;
  }
  if (!src.includes(ANCHOR)) {
    console.warn(`SKIP (no anchor): ${file}`);
    skipped++;
    continue;
  }
  writeFileSync(file, src.replace(ANCHOR, PRELOAD_BLOCK + ANCHOR), "utf8");
  updated++;
}

console.log(`Done: ${updated} updated, ${skipped} skipped.`);
