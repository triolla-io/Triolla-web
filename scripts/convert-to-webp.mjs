/**
 * Convert large PNG/JPG images in the CAS store to WebP, then rewrite
 * all fragment HTML files and CSS bundles to use the WebP versions.
 *
 * Safe to re-run: skips images that already have a WebP counterpart mapped,
 * and skips fragment rewrites where no replacements are needed.
 *
 * Usage:
 *   node scripts/convert-to-webp.mjs [--min-bytes=51200] [--quality=82] [--dry-run]
 */

import { createHash } from "crypto";
import { readFileSync, writeFileSync, existsSync, readdirSync, statSync } from "fs";
import { readFile, writeFile } from "fs/promises";
import path from "path";
import sharp from "sharp";

const ROOT = path.resolve(import.meta.dirname, "..");
const CAS_DIR = path.join(ROOT, "public", "assets", "_cas");
const FRAGMENTS_DIR = path.join(ROOT, "public", "fragments");

// --- CLI args ---
const args = process.argv.slice(2);
const DRY_RUN = args.includes("--dry-run");
const MIN_BYTES = parseInt(args.find(a => a.startsWith("--min-bytes="))?.split("=")[1] ?? "30720"); // 30 KB default
const QUALITY = parseInt(args.find(a => a.startsWith("--quality="))?.split("=")[1] ?? "88");

console.log(`[webp] DRY_RUN=${DRY_RUN} MIN_BYTES=${MIN_BYTES} QUALITY=${QUALITY}`);

function sha256(buf) {
  return createHash("sha256").update(buf).digest("hex");
}

async function convertImages() {
  const files = readdirSync(CAS_DIR);
  const pngJpg = files.filter(f => /\.(png|jpe?g)$/i.test(f));

  console.log(`[webp] Found ${pngJpg.length} PNG/JPG files in CAS`);

  // mapping: original public URL → webp public URL
  const urlMap = new Map(); // "/assets/_cas/abc.png" → "/assets/_cas/xyz.webp"

  let converted = 0;
  let skipped = 0;
  let tooSmall = 0;

  for (const file of pngJpg) {
    const srcPath = path.join(CAS_DIR, file);
    const size = statSync(srcPath).size;

    if (size < MIN_BYTES) {
      tooSmall++;
      continue;
    }

    const originalUrl = `/assets/_cas/${file}`;

    try {
      const img = sharp(srcPath);
      const meta = await img.metadata();

      // Skip animated GIFs disguised as PNG, or already-tiny after decode
      if (meta.pages && meta.pages > 1) {
        skipped++;
        continue;
      }

      const webpBuf = await img
        .webp({ quality: QUALITY, effort: 4 })
        .toBuffer();

      const webpHash = sha256(webpBuf);
      const webpFile = `${webpHash}.webp`;
      const webpPath = path.join(CAS_DIR, webpFile);
      const webpUrl = `/assets/_cas/${webpFile}`;

      // Only write if it's actually smaller (don't make things worse)
      if (webpBuf.length >= size) {
        skipped++;
        continue;
      }

      if (!existsSync(webpPath) && !DRY_RUN) {
        writeFileSync(webpPath, webpBuf);
      }

      urlMap.set(originalUrl, webpUrl);
      const savings = Math.round((1 - webpBuf.length / size) * 100);
      console.log(`  ✓ ${file} → ${webpFile} (${Math.round(size/1024)}KB → ${Math.round(webpBuf.length/1024)}KB, -${savings}%)`);
      converted++;
    } catch (e) {
      console.warn(`  ✗ ${file}: ${e.message}`);
      skipped++;
    }
  }

  console.log(`\n[webp] Converted: ${converted}, Skipped: ${skipped}, Too-small: ${tooSmall}`);
  return urlMap;
}

async function rewriteFragments(urlMap) {
  if (urlMap.size === 0) {
    console.log("[webp] No URL mappings — nothing to rewrite.");
    return;
  }

  // Build a single regex that matches any of the original URLs
  // Escape each URL for use in regex
  const escapedUrls = [...urlMap.keys()].map(u =>
    u.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
  );
  const pattern = new RegExp(escapedUrls.join("|"), "g");

  const replace = (content) => content.replace(pattern, match => urlMap.get(match) ?? match);

  // Rewrite fragment HTML files
  const fragFiles = readdirSync(FRAGMENTS_DIR).filter(f => f.endsWith(".html"));
  let fragRewrites = 0;
  for (const file of fragFiles) {
    const p = path.join(FRAGMENTS_DIR, file);
    const orig = await readFile(p, "utf-8");
    const updated = replace(orig);
    if (updated !== orig) {
      if (!DRY_RUN) await writeFile(p, updated, "utf-8");
      fragRewrites++;
    }
  }
  console.log(`[webp] Rewrote ${fragRewrites}/${fragFiles.length} fragment HTML files`);

  // Rewrite CSS bundles in CAS (background-image: url(...))
  const cssFiles = readdirSync(CAS_DIR).filter(f => f.endsWith(".css"));
  let cssRewrites = 0;
  for (const file of cssFiles) {
    const p = path.join(CAS_DIR, file);
    const orig = await readFile(p, "utf-8");
    const updated = replace(orig);
    if (updated !== orig) {
      if (!DRY_RUN) await writeFile(p, updated, "utf-8");
      cssRewrites++;
    }
  }
  console.log(`[webp] Rewrote ${cssRewrites}/${cssFiles.length} CSS files`);
}

async function main() {
  const urlMap = await convertImages();
  await rewriteFragments(urlMap);
  console.log("\n[webp] Done. Run `npm run build` to pick up changes.");
}

main().catch(e => { console.error(e); process.exit(1); });
