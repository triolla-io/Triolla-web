#!/usr/bin/env node
import { readFile, writeFile, readdir } from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const FRAGMENTS = path.join(ROOT, "public", "fragments");
const REGISTRY_PATH = path.join(ROOT, "lib", "snapshotRegistry.json");

// Hebrew pages to rebuild
const HEBREW_PAGES = [
  "/he/",
  "/he/about-us/",
  "/he/%d7%a1%d7%99%d7%99%d7%91%d7%a8/",
  "/he/%d7%94%d7%a9%d7%99%d7%a8%d7%95%d7%aa%d7%99%d7%9d-%d7%a9%d7%9c%d7%a0%d7%95/",
  "/he/contact-us/",
];

async function main() {
  const registryRaw = await readFile(REGISTRY_PATH, "utf-8");
  const registry = JSON.parse(registryRaw);
  
  // Get Hebrew entries
  const hebrewEntries = registry.filter(e => e.locale === "he");
  console.log(`Found ${hebrewEntries.length} Hebrew pages`);
  
  let updated = 0;
  for (const entry of hebrewEntries.slice(0, 10)) {
    const url = new URL(entry.path, "https://triolla.io").href;
    console.log(`Fetching: ${entry.path}`);
    
    try {
      const res = await fetch(url, {
        headers: { "user-agent": "Mozilla/5.0 (compatible; triolla-rebuild/1.0)" }
      });
      
      if (!res.ok) {
        console.log(`  ✗ HTTP ${res.status}`);
        continue;
      }
      
      const html = await res.text();
      
      // Extract full body content
      const bodyMatch = html.match(/<body[^>]*>([\s\S]*)<\/body>/i);
      if (!bodyMatch) {
        console.log(`  ✗ No body found`);
        continue;
      }
      
      let bodyHtml = bodyMatch[1];
      // Clean up WordPress admin artifacts
      bodyHtml = bodyHtml.replace(/<div[^>]*id=['"]wpadminbar['"][^>]*>[\s\S]*?<\/div>/i, "");
      bodyHtml = bodyHtml.replace(/https?:\/\/triolla\.io\//g, "/");
      
      const fragmentFile = path.join(FRAGMENTS, entry.fragment);
      await writeFile(fragmentFile, bodyHtml + "\n");
      console.log(`  ✓ Saved ${entry.fragment}`);
      updated++;
      
      await new Promise(r => setTimeout(r, 300));
    } catch (err) {
      console.log(`  ✗ Error: ${err.message}`);
    }
  }
  
  console.log(`\n✓ Rebuilt ${updated} pages`);
}

main().catch(console.error);
