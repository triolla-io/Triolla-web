/**
 * Resize WebP images in CAS that Lighthouse flags as oversized.
 *
 * For each target image, resize to 2× its CSS display width (from Lighthouse data)
 * using sharp, write as a new CAS entry (SHA-256 hash of the WebP bytes), then
 * rewrite all fragment HTML and CSS files that reference the old URL.
 *
 * Safe to re-run: exits early if the new CAS file already exists.
 *
 * Usage:
 *   node scripts/resize-oversized.mjs [--dry-run]
 */

import { createHash } from "crypto";
import { readFileSync, writeFileSync, existsSync, readdirSync } from "fs";
import { readFile, writeFile } from "fs/promises";
import path from "path";
import sharp from "sharp";

const ROOT    = path.resolve(import.meta.dirname, "..");
const CAS_DIR = path.join(ROOT, "public", "assets", "_cas");
const FRAG_DIR = path.join(ROOT, "public", "fragments");
const DRY_RUN = process.argv.includes("--dry-run");

// Lighthouse-derived display widths (CSS px). We serve at 2× for retina.
// Only images where resizing saves > 20 KB are listed.
const TARGETS = [
  // file (in CAS)                                                                 maxW  maxH  quality
  { file: "7272fce8e4cbd3649c3e1396c0ed27411714a18e222ace14e2140bb02590e965.webp", maxW: 900,  maxH: 900,  quality: 80 },
  { file: "b9b3f81e62d34038bb4d799350bb1613d1bf4c2f414137690ad8a9792e90defd.webp", maxW: 540,  maxH: 1000, quality: 80 },
  { file: "e22db28e018ffdd6cdf605a8a2ec527bfb03156d508b4af089e0b3a6b03fc950.webp", maxW: 960,  maxH: 1280, quality: 80 },
  { file: "17416dc6c129d7dcd0b6584ce0109bf1b3fa847344ca146fcf63fb98052f3305.webp", maxW: 960,  maxH: 1280, quality: 80 },
  { file: "b132067af05e80e81543bb17f018b1e6524e35b602f80131e1033524a9306915.webp", maxW: 1320, maxH: 980,  quality: 80 },
  { file: "4489853cc87fae79dedb29e683d80b1980d6808da829547856e4d066c825f19c.webp", maxW: 1140, maxH: 760,  quality: 80 },
  { file: "35c573541ef11851d87ffecf81c5fc79056c381e80b88406f488e6a17a33e89c.webp", maxW: 740,  maxH: 1000, quality: 80 },
  { file: "665c2e7dc90613520bb33ae1776a80b36bbbcb711d2cc1dba77db51aa067431d.webp", maxW: 440,  maxH: 780,  quality: 80 },
  { file: "a62b3e0b072d76c6dd256cb228558f8c539274b497f540803c406238e03ead24.webp", maxW: 280,  maxH: 540,  quality: 80 },
  { file: "6d4839231058568be207991f70a647b3bced09263d54c55d65625a5a0ef3d9e6.webp", maxW: 600,  maxH: 600,  quality: 80 },
  { file: "7054d9e94ecba2a44da147624e6313f088786a90e9f4f70903510ebf5f0e20c8.webp", maxW: 600,  maxH: 600,  quality: 80 },
  { file: "8450811e9541d29ea33bb3c0a97f96276392eec4ce84f6992c8b963a80490f1e.webp", maxW: 600,  maxH: 600,  quality: 80 },
];

function sha256(buf) {
  return createHash("sha256").update(buf).digest("hex");
}

async function main() {
  const urlMap = new Map(); // old public URL → new public URL

  for (const { file, maxW, maxH, quality } of TARGETS) {
    const srcPath = path.join(CAS_DIR, file);
    if (!existsSync(srcPath)) {
      console.log(`  skip (not found): ${file}`);
      continue;
    }

    const meta = await sharp(srcPath).metadata();
    if (meta.width <= maxW && meta.height <= maxH) {
      console.log(`  skip (already fits ${maxW}×${maxH}): ${file} [${meta.width}×${meta.height}]`);
      continue;
    }

    const resized = await sharp(srcPath)
      .resize({ width: maxW, height: maxH, fit: "inside", withoutEnlargement: true })
      .webp({ quality, effort: 4 })
      .toBuffer();

    const newHash = sha256(resized);
    const newFile = `${newHash}.webp`;
    const newPath = path.join(CAS_DIR, newFile);

    const oldKB = Math.round(readFileSync(srcPath).length / 1024);
    const newKB = Math.round(resized.length / 1024);
    const savings = Math.round((1 - newKB / oldKB) * 100);
    const meta2 = await sharp(resized).metadata();

    console.log(`  ${file.slice(0,8)}… [${meta.width}×${meta.height}] → ${newFile.slice(0,8)}… [${meta2.width}×${meta2.height}] | ${oldKB}KB → ${newKB}KB (-${savings}%)`);

    if (!DRY_RUN && !existsSync(newPath)) {
      writeFileSync(newPath, resized);
    }

    urlMap.set(`/assets/_cas/${file}`, `/assets/_cas/${newFile}`);
  }

  if (urlMap.size === 0) {
    console.log("[resize] Nothing to rewrite.");
    return;
  }

  const escaped = [...urlMap.keys()].map(u => u.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));
  const pattern = new RegExp(escaped.join("|"), "g");
  const replace = (s) => s.replace(pattern, m => urlMap.get(m) ?? m);

  const fragFiles = readdirSync(FRAG_DIR).filter(f => f.endsWith(".html"));
  let fragHits = 0;
  for (const f of fragFiles) {
    const p = path.join(FRAG_DIR, f);
    const orig = await readFile(p, "utf-8");
    const updated = replace(orig);
    if (updated !== orig) {
      if (!DRY_RUN) await writeFile(p, updated, "utf-8");
      fragHits++;
    }
  }
  console.log(`\n[resize] Updated ${fragHits} fragment files`);

  const cssFiles = readdirSync(CAS_DIR).filter(f => f.endsWith(".css"));
  let cssHits = 0;
  for (const f of cssFiles) {
    const p = path.join(CAS_DIR, f);
    const orig = await readFile(p, "utf-8");
    const updated = replace(orig);
    if (updated !== orig) {
      if (!DRY_RUN) await writeFile(p, updated, "utf-8");
      cssHits++;
    }
  }
  console.log(`[resize] Updated ${cssHits} CSS files`);
  console.log("\n[resize] Done.");
}

main().catch(e => { console.error(e); process.exit(1); });
