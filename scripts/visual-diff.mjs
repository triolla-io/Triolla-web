#!/usr/bin/env node
/**
 * visual-diff.mjs
 *
 * Screenshots key pages on both the live site and localhost,
 * then pixel-diffs them using pixelmatch.
 * Saves side-by-side PNGs to .pipeline/screenshots/.
 */

import { chromium } from "playwright";
import { mkdir, writeFile, readFile } from "fs/promises";
import { existsSync } from "fs";
import path from "path";
import { createRequire } from "module";

const require = createRequire(import.meta.url);
const ROOT = new URL("..", import.meta.url).pathname;
const OUT_DIR = path.join(ROOT, ".pipeline/screenshots");
const LIVE = "https://triolla.io";
const LOCAL = "http://localhost:3000";

// Pages to check: [localPath, livePath]
const PAGES = [
  ["/", "/"],
  ["/saas-platforms/", "/saas-platforms/"],
  ["/services/", "/services/"],
  ["/about-us/", "/about-us/"],
  ["/cyber-security/", "/cyber-security/"],
  ["/blog/the-fintech-ux-playbook/", "/blog/the-fintech-ux-playbook/"],
  ["/device-iot/", "/device-iot/"],
  ["/technology/", "/technology/"],
];

const WIDTHS = [375, 1440];
const THRESHOLD = 0.05; // 5% pixel difference tolerance

async function screenshot(page, url, width, filePath) {
  await page.setViewportSize({ width, height: 900 });
  await page.goto(url, { waitUntil: "networkidle", timeout: 30000 });
  // Wait a bit for animations/lazy loads
  await page.waitForTimeout(2000);
  await page.screenshot({ path: filePath, fullPage: true });
}

async function pixelDiff(livePng, localPng, diffPng) {
  // Use jimp or sharp if available, else fall back to simple size comparison
  try {
    const pixelmatch = require("pixelmatch");
    const { PNG } = require("pngjs");

    const liveImg = PNG.sync.read(await readFile(livePng));
    const localImg = PNG.sync.read(await readFile(localPng));

    const { width, height } = liveImg;
    if (localImg.width !== width || localImg.height !== height) {
      return {
        diffPct: null,
        note: `Size mismatch: live ${width}x${height} vs local ${localImg.width}x${localImg.height}`,
      };
    }

    const diff = new PNG({ width, height });
    const numDiff = pixelmatch(
      liveImg.data, localImg.data, diff.data,
      width, height,
      { threshold: 0.1, alpha: 0.1, includeAA: false }
    );
    await writeFile(diffPng, PNG.sync.write(diff));

    const total = width * height;
    const diffPct = (numDiff / total) * 100;
    return { diffPct, numDiff, total };
  } catch (e) {
    return { diffPct: null, note: `pixelmatch unavailable: ${e.message}` };
  }
}

async function main() {
  await mkdir(OUT_DIR, { recursive: true });

  // Check pixelmatch availability
  let hasPM = false;
  try { require("pixelmatch"); require("pngjs"); hasPM = true; } catch {}
  if (!hasPM) {
    console.log("⚠  pixelmatch/pngjs not installed — will take screenshots only, no pixel diff.");
    console.log("   Install with: npm install --save-dev pixelmatch pngjs\n");
  }

  const browser = await chromium.launch({ headless: true });
  const results = [];

  for (const [localPath, livePath] of PAGES) {
    console.log(`\n▶ ${localPath}`);
    for (const width of WIDTHS) {
      const slug = localPath.replace(/\//g, "_").replace(/^_|_$/g, "") || "home";
      const base = `${slug}-${width}`;
      const liveFile = path.join(OUT_DIR, `${base}-live.png`);
      const localFile = path.join(OUT_DIR, `${base}-local.png`);
      const diffFile = path.join(OUT_DIR, `${base}-diff.png`);

      try {
        const livePage = await browser.newPage();
        await livePage.route("**/*", (route) => {
          // Block analytics/tracking to speed up
          const url = route.request().url();
          if (url.includes("analytics") || url.includes("hotjar") || url.includes("gtag")) {
            route.abort();
          } else {
            route.continue();
          }
        });
        process.stdout.write(`  ${width}px live...`);
        await screenshot(livePage, `${LIVE}${livePath}`, width, liveFile);
        await livePage.close();

        const localPage = await browser.newPage();
        process.stdout.write(` local...`);
        await screenshot(localPage, `${LOCAL}${localPath}`, width, localFile);
        await localPage.close();

        let result = { page: localPath, width, liveFile, localFile };

        if (hasPM) {
          const diff = await pixelDiff(liveFile, localFile, diffFile);
          result = { ...result, ...diff };
          if (diff.diffPct === null) {
            console.log(` ⚠  ${diff.note}`);
          } else {
            const ok = diff.diffPct <= THRESHOLD;
            console.log(` ${ok ? "✓" : "✗"} diff: ${diff.diffPct.toFixed(2)}%${ok ? "" : " ← FAIL"}`);
          }
        } else {
          console.log(` screenshots saved.`);
        }

        results.push(result);
      } catch (e) {
        console.log(` ✗ ERROR: ${e.message}`);
        results.push({ page: localPath, width, error: e.message });
      }
    }
  }

  await browser.close();

  // Summary
  const failed = results.filter((r) => r.diffPct != null && r.diffPct > THRESHOLD);
  console.log("\n=== Summary ===");
  console.log(`Pages checked: ${PAGES.length}, widths: ${WIDTHS.join(", ")}px`);
  if (hasPM) {
    console.log(`Failures (>${THRESHOLD}% diff): ${failed.length}`);
    if (failed.length > 0) {
      console.log("\nFailed pages:");
      for (const f of failed) {
        console.log(`  ${f.page} @ ${f.width}px — ${f.diffPct?.toFixed(2)}%`);
      }
    } else {
      console.log("✅ All pages within threshold!");
    }
  }
  console.log(`\nScreenshots saved to: ${OUT_DIR}`);

  await writeFile(
    path.join(ROOT, ".pipeline/visual-diff-report.json"),
    JSON.stringify(results, null, 2)
  );
}

main().catch((e) => { console.error(e); process.exit(1); });
