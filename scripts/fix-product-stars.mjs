#!/usr/bin/env node
import { readFile, writeFile, readdir } from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const FRAGMENTS = path.join(ROOT, "public", "fragments");

async function main() {
  const files = (await readdir(FRAGMENTS)).filter((f) => f.endsWith("-he-body.html"));
  let fixed = 0;

  for (const file of files) {
    const filePath = path.join(FRAGMENTS, file);
    let html = await readFile(filePath, "utf-8");
    const original = html;

    // Fix the product-stars link to point to English version
    if (html.includes("/he/%d7%94%d7%a9%d7%99%d7%a8%d7%95%d7%aa%d7%99%d7%9d-%d7%a9%d7%9c%d7%a0%d7%95/product-stars/")) {
      html = html.replace(
        /\/he\/%d7%94%d7%a9%d7%99%d7%a8%d7%95%d7%aa%d7%99%d7%9d-%d7%a9%d7%9c%d7%a0%d7%95\/product-stars\//g,
        "/services/product-stars/"
      );
    }

    if (html !== original) {
      await writeFile(filePath, html, "utf-8");
      fixed++;
      console.log(`✓ Fixed: ${file}`);
    }
  }

  console.log(`\nFixed ${fixed} fragment(s) with product-stars link`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
