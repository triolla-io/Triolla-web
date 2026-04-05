#!/usr/bin/env node
/**
 * Encode WebP siblings for PNGs referenced by home-body / home-he-body fragments.
 * Run from repo root: node app/scripts/encode-home-fragment-pngs.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..", "..");
const SHARED = path.join(ROOT, "public", "assets", "_shared");

const FILES = [
  "1.png",
  "2.png",
  "3.png",
  "6.png",
  "88.png",
  "medicak-ipad.png",
  "Front-cloean-1.png",
  "White-1.png",
  "grid_all.png",
  "logo_new.png",
  "Group-1410103661.png",
  "Group-1410103660.png",
  "Group-1410103662.png",
  "faq_q1.png",
  "faq_q2.png",
  "faq_q3.png",
  "faq_q4.png",
  "faq_q5.png",
  "faq_q6.png",
  "faq_q7.png",
  "aivatar_cir_32.png",
  "aivatar_cir_05.png",
  "image-740.png",
  "image-741.png",
  "image-744.png",
  "image-745.png",
  "sqlink_icon.png",
  "startup1.png",
  "startup2.png",
  "startup3.png",
  "startup4.png",
];

async function main() {
  for (const name of FILES) {
    const input = path.join(SHARED, name);
    if (!fs.existsSync(input)) {
      console.warn("skip (missing):", name);
      continue;
    }
    const base = name.replace(/\.png$/i, "");
    const out = path.join(SHARED, `${base}.webp`);
    await sharp(input).webp({ quality: 82, effort: 6 }).toFile(out);
    const inSt = fs.statSync(input);
    const outSt = fs.statSync(out);
    console.log(
      `${name} → ${base}.webp (${(inSt.size / 1024).toFixed(1)} KiB → ${(outSt.size / 1024).toFixed(1)} KiB)`,
    );
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
