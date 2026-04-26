#!/usr/bin/env node
import { readFile, writeFile, readdir } from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const FRAGMENTS = path.join(ROOT, "public", "fragments");

const LINK_FIXES = {
  '/he/about/': '/he/about-us/',
  '/he/%D7%A9%D7%99%D7%A8%D7%95%D7%AA%D7%99%D7%9D-%D7%A9%D7%9C%D7%A0%D7%95/product-stars/': '/services/product-stars/',
};

async function main() {
  const files = (await readdir(FRAGMENTS)).filter((f) => f.endsWith("-he-body.html"));
  let fixed = 0;

  for (const file of files) {
    const filePath = path.join(FRAGMENTS, file);
    let html = await readFile(filePath, "utf-8");
    const original = html;

    for (const [broken, correct] of Object.entries(LINK_FIXES)) {
      if (html.includes(broken)) {
        html = html.replace(new RegExp(broken.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), correct);
      }
    }

    if (html !== original) {
      await writeFile(filePath, html, "utf-8");
      fixed++;
      console.log(`✓ Fixed: ${file}`);
    }
  }

  console.log(`\nFixed ${fixed} fragment(s)`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
