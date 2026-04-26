#!/usr/bin/env node
/**
 * fix-external-deps.mjs
 *
 * Makes the snapshot fully self-contained:
 * 1. Scans every _cas/ file for absolute https://triolla.io/... URLs
 *    AND root-relative /wp-content/... and /wp-includes/... URLs
 * 2. Downloads each missing asset, saves it as _cas/<sha256>.<ext>
 * 3. Rewrites every CSS file that contained those URLs so they point
 *    to /assets/_cas/<sha256>.<ext> instead
 * 4. New CSS files are saved under their own new SHA-256 hash
 * 5. Updates snapshotRegistry.ts to reference the new CSS hashes
 */

import { createHash } from "crypto";
import { createReadStream, createWriteStream } from "fs";
import {
  readFile,
  writeFile,
  mkdir,
  copyFile,
  readdir,
  stat,
} from "fs/promises";
import { existsSync } from "fs";
import path from "path";
import { pipeline } from "stream/promises";
import https from "https";
import http from "http";

const ROOT = new URL("..", import.meta.url).pathname;
const CAS_DIR = path.join(ROOT, "public/assets/_cas");
const REGISTRY_PATH = path.join(ROOT, "lib/snapshotRegistry.ts");
const ORIGIN = "https://triolla.io";

// Extensions we know how to handle as downloadable assets
const DOWNLOADABLE_EXTS = new Set([
  ".js", ".css", ".png", ".jpg", ".jpeg", ".gif", ".svg",
  ".webp", ".ico", ".woff", ".woff2", ".ttf", ".eot", ".otf",
  ".mp4", ".webm", ".json", ".xml",
]);

// ── helpers ──────────────────────────────────────────────────────────────────

function sha256ofBuffer(buf) {
  return createHash("sha256").update(buf).digest("hex");
}

function extOf(urlOrPath) {
  const u = urlOrPath.split("?")[0].split("#")[0];
  return path.extname(u).toLowerCase();
}

function casPath(hash, ext) {
  return path.join(CAS_DIR, `${hash}${ext}`);
}

function casUrl(hash, ext) {
  return `/assets/_cas/${hash}${ext}`;
}

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function download(url, retries = 3) {
  for (let attempt = 0; attempt < retries; attempt++) {
    try {
      return await new Promise((resolve, reject) => {
        const mod = url.startsWith("https") ? https : http;
        const req = mod.get(url, { timeout: 20000 }, (res) => {
          if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
            const redirectUrl = res.headers.location.startsWith("http")
              ? res.headers.location
              : `${ORIGIN}${res.headers.location}`;
            resolve(download(redirectUrl, retries));
            return;
          }
          if (res.statusCode !== 200) {
            reject(new Error(`HTTP ${res.statusCode} for ${url}`));
            return;
          }
          const chunks = [];
          res.on("data", (c) => chunks.push(c));
          res.on("end", () => resolve(Buffer.concat(chunks)));
          res.on("error", reject);
        });
        req.on("error", reject);
        req.on("timeout", () => { req.destroy(); reject(new Error(`Timeout: ${url}`)); });
      });
    } catch (e) {
      if (attempt < retries - 1) {
        console.warn(`  ↺ retry ${attempt + 1}/${retries - 1}: ${url} (${e.message})`);
        await sleep(1000 * (attempt + 1));
      } else {
        throw e;
      }
    }
  }
}

// ── phase 1: collect all URLs needing download ───────────────────────────────

const ABSOLUTE_RE = /https?:\/\/triolla\.io(\/[^\s"')\]>]*)/g;
// Root-relative paths that resolve against the host (wp-content, wp-includes, cdn-cgi)
const ROOT_REL_RE = /url\(\s*['"]?(\/(?:wp-content|wp-includes|cdn-cgi)\/[^\s"')]*)/g;

async function collectUrls() {
  const files = await readdir(CAS_DIR);
  // url → { absoluteUrl, ext }
  const urlMap = new Map();

  for (const file of files) {
    if (!file.endsWith(".css") && !file.endsWith(".js")) continue;
    const content = await readFile(path.join(CAS_DIR, file), "utf8");

    // Absolute triolla.io URLs
    for (const m of content.matchAll(ABSOLUTE_RE)) {
      const fullUrl = `https://triolla.io${m[1].split(/["')]/)[0]}`;
      const ext = extOf(fullUrl);
      if (DOWNLOADABLE_EXTS.has(ext) || ext === "") {
        urlMap.set(fullUrl, { ext: ext || ".bin" });
      }
    }

    // Root-relative wp-content / wp-includes paths (CSS url() only)
    if (file.endsWith(".css")) {
      for (const m of content.matchAll(ROOT_REL_RE)) {
        const rawPath = m[1].split(/["')]/)[0];
        const fullUrl = `${ORIGIN}${rawPath}`;
        const ext = extOf(rawPath);
        if (DOWNLOADABLE_EXTS.has(ext)) {
          urlMap.set(fullUrl, { ext });
        }
      }
    }
  }
  return urlMap;
}

// ── phase 2: download & save to _cas ─────────────────────────────────────────

async function ensureAsset(url, ext) {
  // Check manifest first (url → hash mapping we build)
  // We'll just scan existing files by re-downloading and hashing if needed.
  // To avoid re-downloading: maintain a url→casPath map in memory.
  try {
    const buf = await download(url);
    const hash = sha256ofBuffer(buf);
    const realExt = ext || extOf(url) || ".bin";
    const dest = casPath(hash, realExt);
    if (!existsSync(dest)) {
      await writeFile(dest, buf);
    }
    return { hash, ext: realExt, ok: true };
  } catch (e) {
    console.error(`  ✗ FAILED ${url}: ${e.message}`);
    return { hash: null, ext, ok: false };
  }
}

// ── phase 3: rewrite a CSS file ──────────────────────────────────────────────

function buildRewriter(urlToLocal) {
  return (content) => {
    let out = content;

    // Replace absolute triolla.io URLs
    out = out.replace(ABSOLUTE_RE, (match, pathPart) => {
      const raw = match.split(/["') ]/)[0]; // trim trailing quote/paren
      const fullUrl = `https://triolla.io${pathPart.split(/["') ]/)[0]}`;
      if (urlToLocal.has(fullUrl)) {
        return match.replace(fullUrl, urlToLocal.get(fullUrl));
      }
      return match;
    });

    // Replace root-relative /wp-content /wp-includes in url()
    out = out.replace(ROOT_REL_RE, (match, rawPath) => {
      const cleanPath = rawPath.split(/["') ]/)[0];
      const fullUrl = `${ORIGIN}${cleanPath}`;
      if (urlToLocal.has(fullUrl)) {
        const replacement = urlToLocal.get(fullUrl);
        return match.replace(cleanPath, replacement);
      }
      return match;
    });

    return out;
  };
}

// ── phase 4: update snapshotRegistry.ts ──────────────────────────────────────

async function updateRegistry(oldHashToNew) {
  if (oldHashToNew.size === 0) {
    console.log("Registry: no CSS hashes changed, skipping.");
    return;
  }
  let content = await readFile(REGISTRY_PATH, "utf8");
  let changes = 0;
  for (const [oldHash, newHash] of oldHashToNew) {
    const before = content;
    // Replace in css[] arrays: "_cas/oldhash.css" → "_cas/newhash.css"
    content = content.replaceAll(
      `_cas/${oldHash}.css`,
      `_cas/${newHash}.css`
    );
    if (content !== before) changes++;
  }
  if (changes > 0) {
    await writeFile(REGISTRY_PATH, content, "utf8");
    console.log(`Registry: updated ${changes} CSS hash references.`);
  } else {
    console.log("Registry: no matching hashes found to replace.");
  }
}

// ── main ──────────────────────────────────────────────────────────────────────

async function main() {
  console.log("=== fix-external-deps ===\n");

  // 1. Collect
  console.log("Phase 1: collecting external URLs from _cas/ files...");
  const urlMap = await collectUrls();
  console.log(`  Found ${urlMap.size} unique external asset URLs.\n`);

  if (urlMap.size === 0) {
    console.log("Nothing to do — snapshot is already self-contained!");
    return;
  }

  // 2. Download
  console.log("Phase 2: downloading assets...");
  const urlToLocal = new Map(); // url → /_cas/<hash>.<ext>
  let downloaded = 0, skipped = 0, failed = 0;

  const entries = [...urlMap.entries()];
  // Process in batches of 8 to be polite
  const BATCH = 8;
  for (let i = 0; i < entries.length; i += BATCH) {
    const batch = entries.slice(i, i + BATCH);
    await Promise.all(
      batch.map(async ([url, { ext }]) => {
        process.stdout.write(`  ↓ ${url.slice(0, 80)}...\r`);
        const result = await ensureAsset(url, ext);
        if (result.ok) {
          urlToLocal.set(url, casUrl(result.hash, result.ext));
          downloaded++;
        } else {
          failed++;
        }
      })
    );
  }
  process.stdout.write("\n");
  console.log(`  Downloaded: ${downloaded}, Failed: ${failed}\n`);

  // 3. Rewrite CSS files
  console.log("Phase 3: rewriting CSS files...");
  const rewrite = buildRewriter(urlToLocal);
  const cssFiles = (await readdir(CAS_DIR)).filter((f) => f.endsWith(".css"));
  const oldHashToNew = new Map(); // old hash → new hash (for registry update)
  let rewritten = 0;

  for (const file of cssFiles) {
    const filePath = path.join(CAS_DIR, file);
    const original = await readFile(filePath, "utf8");
    const rewritten_ = rewrite(original);
    if (rewritten_ === original) continue; // no change needed

    const newHash = sha256ofBuffer(Buffer.from(rewritten_, "utf8"));
    const oldHash = file.replace(".css", "");
    const newPath = casPath(newHash, ".css");

    await writeFile(newPath, rewritten_, "utf8");
    oldHashToNew.set(oldHash, newHash);
    rewritten++;
    console.log(`  ✓ ${oldHash.slice(0, 16)}… → ${newHash.slice(0, 16)}…`);
  }
  console.log(`  Rewritten: ${rewritten} CSS files.\n`);

  // 4. Update registry
  console.log("Phase 4: updating snapshotRegistry.ts...");
  await updateRegistry(oldHashToNew);

  console.log("\n=== Done! ===");
  console.log(`Assets downloaded : ${downloaded}`);
  console.log(`Assets failed     : ${failed}`);
  console.log(`CSS files rewritten: ${rewritten}`);
  console.log(`Registry entries updated: ${oldHashToNew.size}`);

  if (failed > 0) {
    console.warn(
      "\n⚠  Some assets failed to download (see errors above).\n" +
      "   These may be dynamic/gated URLs — check manually."
    );
  }
}

main().catch((e) => {
  console.error("Fatal:", e);
  process.exit(1);
});
