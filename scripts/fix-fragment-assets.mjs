#!/usr/bin/env node
/**
 * fix-fragment-assets.mjs
 *
 * Rewrites /wp-content/... and https://triolla.io/... asset URLs
 * in all HTML fragment files to use local /assets/_cas/<hash>.<ext> paths.
 *
 * Strategy:
 * 1. Build URL→localPath from manifest.json (already-downloaded assets)
 * 2. Collect all /wp-content/ URLs used in fragments not in manifest
 * 3. Download missing ones, add to _cas/
 * 4. Rewrite all fragment files
 */

import { createHash } from "crypto";
import { readFile, writeFile, readdir } from "fs/promises";
import { existsSync } from "fs";
import path from "path";
import https from "https";
import http from "http";

const ROOT = new URL("..", import.meta.url).pathname;
const CAS_DIR = path.join(ROOT, "public/assets/_cas");
const FRAG_DIR = path.join(ROOT, "public/fragments");
const MANIFEST_PATH = path.join(CAS_DIR, "manifest.json");
const ORIGIN = "https://triolla.io";

function sha256(buf) {
  return createHash("sha256").update(buf).digest("hex");
}

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function download(url, retries = 3) {
  for (let attempt = 0; attempt < retries; attempt++) {
    try {
      return await new Promise((resolve, reject) => {
        const mod = url.startsWith("https") ? https : http;
        const req = mod.get(url, { timeout: 15000 }, (res) => {
          if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
            const loc = res.headers.location;
            resolve(download(loc.startsWith("http") ? loc : `${ORIGIN}${loc}`, retries));
            return;
          }
          if (res.statusCode !== 200) {
            reject(new Error(`HTTP ${res.statusCode}`));
            return;
          }
          const chunks = [];
          res.on("data", (c) => chunks.push(c));
          res.on("end", () => resolve(Buffer.concat(chunks)));
          res.on("error", reject);
        });
        req.on("error", reject);
        req.on("timeout", () => { req.destroy(); reject(new Error("Timeout")); });
      });
    } catch (e) {
      if (attempt < retries - 1) await sleep(800 * (attempt + 1));
      else throw e;
    }
  }
}

function extOf(url) {
  return path.extname(url.split("?")[0].split("#")[0]).toLowerCase() || ".bin";
}

// ── main ──────────────────────────────────────────────────────────────────────

async function main() {
  console.log("=== fix-fragment-assets ===\n");

  // 1. Build URL → local /assets/_cas/ path from manifest
  const manifest = JSON.parse(await readFile(MANIFEST_PATH, "utf8"));
  const urlToLocal = new Map(); // originalUrl → /assets/_cas/<hash><ext>

  for (const [hash, info] of Object.entries(manifest)) {
    if (info.originalUrl) {
      const ext = info.ext || extOf(info.originalUrl);
      urlToLocal.set(info.originalUrl, `/assets/_cas/${hash}${ext}`);
      // Also map without query string (fragments often reference clean URLs)
      const cleanUrl = info.originalUrl.split("?")[0];
      if (cleanUrl !== info.originalUrl) {
        urlToLocal.set(cleanUrl, `/assets/_cas/${hash}${ext}`);
      }
    }
  }
  console.log(`Manifest: ${urlToLocal.size} URL→local mappings loaded.`);

  // 2. Scan all fragments for /wp-content/ and https://triolla.io/ URLs
  const fragFiles = (await readdir(FRAG_DIR)).filter((f) => f.endsWith(".html"));
  const needed = new Map(); // url → { absoluteUrl, ext }

  const WP_RE = /(?:src|href|data-src|data-lazy-src|data-bg|srcset|content)=["']([^"']*\/wp-content\/[^"']+)["']/g;
  const STYLE_WP_RE = /url\(\s*["']?(\/wp-content\/[^\s"')]+)["']?\s*\)/g;
  const ABS_RE = /(?:src|href|data-src|data-lazy-src|data-bg|srcset|content)=["'](https?:\/\/triolla\.io\/wp-content\/[^"']+)["']/g;

  for (const file of fragFiles) {
    const content = await readFile(path.join(FRAG_DIR, file), "utf8");

    // Attribute-based /wp-content/ paths
    for (const m of content.matchAll(WP_RE)) {
      const raw = m[1].split(/[\s,]/)[0]; // handle srcset "url 2x, url 3x"
      const absUrl = `${ORIGIN}${raw}`;
      if (!urlToLocal.has(absUrl) && !urlToLocal.has(raw)) {
        const ext = extOf(raw);
        if (ext !== ".bin" || raw.includes(".")) needed.set(absUrl, { ext });
      }
    }

    // Inline style url(/wp-content/...)
    for (const m of content.matchAll(STYLE_WP_RE)) {
      const absUrl = `${ORIGIN}${m[1]}`;
      if (!urlToLocal.has(absUrl) && !urlToLocal.has(m[1])) {
        needed.set(absUrl, { ext: extOf(m[1]) });
      }
    }

    // Absolute https://triolla.io/wp-content/ in attributes
    for (const m of content.matchAll(ABS_RE)) {
      const absUrl = m[1].split(/[\s,]/)[0];
      if (!urlToLocal.has(absUrl)) {
        needed.set(absUrl, { ext: extOf(absUrl) });
      }
    }
  }

  console.log(`\nMissing assets to download: ${needed.size}`);

  // 3. Download missing assets
  let downloaded = 0, failed = 0;
  const entries = [...needed.entries()];
  const BATCH = 10;

  for (let i = 0; i < entries.length; i += BATCH) {
    await Promise.all(
      entries.slice(i, i + BATCH).map(async ([url, { ext }]) => {
        try {
          const buf = await download(url);
          const hash = sha256(buf);
          const realExt = ext !== ".bin" ? ext : extOf(url);
          const dest = path.join(CAS_DIR, `${hash}${realExt}`);
          if (!existsSync(dest)) await writeFile(dest, buf);
          urlToLocal.set(url, `/assets/_cas/${hash}${realExt}`);
          // Also map root-relative version
          const rootRel = url.replace(ORIGIN, "");
          urlToLocal.set(rootRel, `/assets/_cas/${hash}${realExt}`);
          downloaded++;
        } catch (e) {
          console.warn(`  ✗ ${url.slice(0, 70)}: ${e.message}`);
          failed++;
        }
      })
    );
  }
  if (needed.size > 0) {
    console.log(`Downloaded: ${downloaded}, Failed: ${failed}`);
  }

  // Also ensure root-relative entries exist for all manifest items
  for (const [url, local] of urlToLocal) {
    if (url.startsWith(ORIGIN)) {
      const rootRel = url.replace(ORIGIN, "");
      if (!urlToLocal.has(rootRel)) urlToLocal.set(rootRel, local);
    }
  }

  // 4. Rewrite all fragment files
  console.log("\nRewriting fragment files...");
  let rewrittenFiles = 0;
  let totalReplacements = 0;

  for (const file of fragFiles) {
    const filePath = path.join(FRAG_DIR, file);
    let content = await readFile(filePath, "utf8");
    const original = content;

    // Replace all /wp-content/ root-relative paths in attributes and style
    // We need to handle: src="/wp-content/...", srcset="/wp-content/... 2x", url(/wp-content/...)
    content = content.replace(
      /((?:src|href|data-src|data-lazy-src|data-bg|srcset|content)=["'])([^"']*\/wp-content\/[^"']+)(["'])/g,
      (match, prefix, urlPart, suffix) => {
        // srcset may have multiple URLs: "url1 size, url2 size"
        const rewritten = urlPart.replace(/\/wp-content\/[^\s,"']+/g, (u) => {
          const clean = u.split("?")[0];
          return urlToLocal.get(u) || urlToLocal.get(clean) || urlToLocal.get(`${ORIGIN}${u}`) || urlToLocal.get(`${ORIGIN}${clean}`) || u;
        });
        return `${prefix}${rewritten}${suffix}`;
      }
    );

    // Replace url(/wp-content/...) in inline styles
    content = content.replace(
      /url\(\s*["']?(\/wp-content\/[^\s"')]+)["']?\s*\)/g,
      (match, u) => {
        const local = urlToLocal.get(u) || urlToLocal.get(u.split("?")[0]) || urlToLocal.get(`${ORIGIN}${u}`);
        return local ? `url(${local})` : match;
      }
    );

    // Replace absolute https://triolla.io/wp-content/ in attributes
    content = content.replace(
      /((?:src|href|data-src|data-lazy-src|data-bg|srcset|content)=["'])(https?:\/\/triolla\.io\/wp-content\/[^"']+)(["'])/g,
      (match, prefix, url, suffix) => {
        const rewritten = url.replace(/https?:\/\/triolla\.io\/wp-content\/[^\s,"']+/g, (u) => {
          const clean = u.split("?")[0];
          return urlToLocal.get(u) || urlToLocal.get(clean) || u;
        });
        return `${prefix}${rewritten}${suffix}`;
      }
    );

    if (content !== original) {
      await writeFile(filePath, content, "utf8");
      rewrittenFiles++;
      // Count replacements roughly
      const before = (original.match(/\/wp-content\//g) || []).length;
      const after = (content.match(/\/wp-content\//g) || []).length;
      totalReplacements += before - after;
    }
  }

  console.log(`\n=== Done ===`);
  console.log(`Fragment files rewritten: ${rewrittenFiles} / ${fragFiles.length}`);
  console.log(`Asset references fixed:   ~${totalReplacements}`);
  if (failed > 0) {
    console.warn(`\n⚠  ${failed} assets failed to download.`);
  }
}

main().catch((e) => { console.error(e); process.exit(1); });
