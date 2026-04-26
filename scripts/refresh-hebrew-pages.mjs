#!/usr/bin/env node
/**
 * Refresh all Hebrew page snapshots from the real website.
 * Fetches each registered Hebrew page and updates its fragment with latest content.
 */
import { readFile, writeFile } from "fs/promises";
import { load } from "cheerio";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const FRAGMENTS = path.join(ROOT, "public", "fragments");
const REGISTRY_PATH = path.join(ROOT, "lib", "snapshotRegistry.json");
const ORIGIN = "https://triolla.io";

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

function rewriteOrigin(html) {
  return html.replace(/https?:\/\/triolla\.io\//g, "/");
}

async function main() {
  const registryRaw = await readFile(REGISTRY_PATH, "utf-8");
  const registry = JSON.parse(registryRaw);

  // Filter Hebrew pages
  const hebrewPages = registry.filter(e => e.locale === "he" && e.path && e.path.startsWith("/he/"));

  console.log(`Found ${hebrewPages.length} Hebrew pages to refresh...`);

  let updated = 0;
  let failed = 0;

  for (const entry of hebrewPages) {
    const fetchUrl = new URL(entry.path, ORIGIN).href;
    console.log(`\nFetching: ${entry.path}`);

    try {
      const res = await fetch(fetchUrl, {
        headers: {
          "user-agent": "Mozilla/5.0 (compatible; triolla-snapshot-refresh/1.0; +https://triolla.io)",
          "accept-language": "he,en;q=0.9",
        },
      });

      if (!res.ok) {
        console.error(`  ✗ HTTP ${res.status}`);
        failed++;
        continue;
      }

      const pageHtml = await res.text();
      const $ = load(pageHtml);
      const mainEl = $(".main_container").first();

      if (!mainEl.length) {
        console.error(`  ✗ No .main_container found`);
        failed++;
        continue;
      }

      // Capture main container through to footer and beyond
      const bodyEl = $("body").first();
      if (!bodyEl.length) {
        console.error(`  ✗ No body tag found`);
        failed++;
        continue;
      }

      // Get HTML from main_container onwards (more complete capture)
      let mainIndex = bodyEl.html().indexOf(mainEl.prop("outerHTML"));
      if (mainIndex === -1) {
        console.error(`  ✗ Could not locate main_container in body`);
        failed++;
        continue;
      }

      let html = bodyEl.html().substring(mainIndex);
      // Remove trailing WP admin bar if present
      html = html.replace(/<div[^>]*id=['"]wpadminbar['"][^>]*>[\s\S]*?<\/div>/i, "");

      let outer = rewriteOrigin(html);
      if (!outer.trim().startsWith("<")) {
        console.error(`  ✗ Bad main HTML`);
        failed++;
        continue;
      }

      // Write updated fragment
      const fragmentPath = path.join(ROOT, "public", entry.fragment);
      await writeFile(fragmentPath, outer + "\n", "utf-8");
      console.log(`  ✓ Updated`);
      updated++;

      // Be nice to the server
      await sleep(500);
    } catch (err) {
      console.error(`  ✗ Error: ${err.message}`);
      failed++;
    }
  }

  console.log(`\n✓ Refresh complete: ${updated} updated, ${failed} failed`);
  process.exit(failed > 0 ? 1 : 0);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
