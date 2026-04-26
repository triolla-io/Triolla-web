#!/usr/bin/env node
/**
 * update-registry-hashes.mjs
 *
 * Reads the old→new CSS hash mapping produced by fix-external-deps
 * and applies it to snapshotRegistry.json (and .ts via replaceAll).
 *
 * The mapping is derived by comparing old _cas/*.css files that now have
 * companion rewritten versions. We detect them by checking which old
 * hashes no longer have the right content (they no longer contain
 * triolla.io URLs) — or more precisely, we just need the mapping stored
 * by the previous script. Since we don't persist it, we re-derive it here:
 *
 * Strategy: for every old .css hash in the registry, check if its file
 * still exists AND the registry also has a corresponding new file (where
 * the new file doesn't contain triolla.io/wp-content URLs).
 *
 * Simpler: just do a string replacement of every old hash that appears
 * in the registry with the new hash, by re-running the rewrite logic and
 * computing new hashes.
 */

import { createHash } from "crypto";
import { readFile, writeFile, readdir } from "fs/promises";
import { existsSync } from "fs";
import path from "path";

const ROOT = new URL("..", import.meta.url).pathname;
const CAS_DIR = path.join(ROOT, "public/assets/_cas");
const REGISTRY_JSON = path.join(ROOT, "lib/snapshotRegistry.json");
const REGISTRY_TS = path.join(ROOT, "lib/snapshotRegistry.ts");

function sha256ofBuffer(buf) {
  return createHash("sha256").update(buf).digest("hex");
}

const TRIOLLA_URL_RE = /https?:\/\/triolla\.io\//;

async function main() {
  const cssFiles = (await readdir(CAS_DIR)).filter((f) => f.endsWith(".css"));

  // Build: oldHash → newHash
  // Logic: if a CSS file contains triolla.io URLs it's the OLD version.
  //        The new version (rewritten) will have its own hash in _cas/.
  //        We need to find pairs. The rewrite script created new files;
  //        the old files still exist. We can detect the NEW file by
  //        checking which files do NOT contain triolla.io URLs.
  //
  // Approach: Re-run the rewrite on every old file and compute what the
  //           new hash would be, then find that file in _cas/.

  // First build urlToLocal from the manifest or by scanning _cas for known assets
  // Actually, let's just re-derive the mapping by re-applying rewrite logic:

  const ABSOLUTE_RE = /https?:\/\/triolla\.io(\/[^\s"')\]>]*)/g;
  const ROOT_REL_RE = /url\(\s*['"]?(\/(?:wp-content|wp-includes|cdn-cgi)\/[^\s"')]*)/g;

  // We need the urlToLocal map. Re-build it by scanning _cas for all non-css/non-js files
  // and then matching known URL patterns. But that's complex.
  // 
  // Simpler: just compare each CSS file with what we'd get after stripping triolla.io.
  // Since the new files are already written in _cas, we just need to find the mapping
  // by checking: for each CSS file that HAS triolla URLs (old), compute what its rewritten
  // content would look like WITHOUT downloading (we can use a placeholder), hash it,
  // then find a file with that hash.
  //
  // Even simpler: scan all CSS files in _cas. If file A contains triolla URLs, it's old.
  // Search for a file B that has the same content except triolla URLs → local paths.
  // 
  // SIMPLEST: The script above printed the mapping. Let's just use file mtime to figure
  // out which files were created recently (by the previous script run).

  // Get files created/modified in the last 10 minutes
  const { stat } = await import("fs/promises");
  const now = Date.now();
  const TEN_MIN = 10 * 60 * 1000;

  const newHashes = new Set();
  const oldHashes = new Set();

  for (const file of cssFiles) {
    const filePath = path.join(CAS_DIR, file);
    const s = await stat(filePath);
    const content = await readFile(filePath, "utf8");
    const isOld = TRIOLLA_URL_RE.test(content);
    const isNew = now - s.mtimeMs < TEN_MIN;

    if (isOld) oldHashes.add(file.replace(".css", ""));
    if (isNew && !isOld) newHashes.add(file.replace(".css", ""));
  }

  console.log(`Old CSS files (contain triolla.io): ${oldHashes.size}`);
  console.log(`New CSS files (recently created, clean): ${newHashes.size}`);

  // Now we need the pairing. Re-run the rewrite to find which old → new
  // We need the urlToLocal map to do the rewrite. Let's build it from _cas/.
  // For each non-css/non-js file in _cas, we know it's a downloaded asset.
  // But we don't know what URL it came from without the manifest.
  //
  // Alternative: use the printed output from the previous script run.
  // The script printed lines like:
  //   ✓ 068f1cda1760130c… → c5f2ccc9214263a2…
  // Parse those from terminal if available? No, that's brittle.
  //
  // Best approach: re-derive urlToLocal by downloading a tiny manifest, or
  // just rewrite using any placeholder and find the matching new file.
  //
  // ACTUAL SIMPLEST: just read registry.json, find all CSS hashes, and for
  // each old hash check if a new file exists that we recently created.
  // Map them by position (old file i → new file i in sorted order).
  // This is fragile. Let's use the correct approach.

  // Re-run rewrite and match by content hash.
  // We'll re-read all downloaded assets (non-css/non-js files recently added).
  // Actually we don't need to re-download — we just need to know what URL maps to what path.
  // 
  // Let's just parse the manifest.json if it exists in _cas/.
  const manifestPath = path.join(CAS_DIR, "manifest.json");
  let manifest = {};
  if (existsSync(manifestPath)) {
    manifest = JSON.parse(await readFile(manifestPath, "utf8"));
  }

  // manifest: { byUrl: { url: { sha256, filename } }, ... }
  // Let's build url→casUrl from manifest.byUrl
  let urlToLocal = new Map();
  if (manifest.byUrl) {
    for (const [url, info] of Object.entries(manifest.byUrl)) {
      const hash = info.sha256 || info.hash;
      const ext = path.extname(info.filename || info.path || "");
      if (hash && ext) {
        urlToLocal.set(url, `/assets/_cas/${hash}${ext}`);
      }
    }
  }

  // If no manifest, build from what we can infer from file names
  // We can't know url→hash without re-downloading. Use a different strategy:
  // For each old CSS file, rewrite it using whatever url→local we have,
  // compute new hash, check if that file exists in _cas.

  // Since we may not have a manifest, let's do the pairing differently:
  // Read ALL CSS files in _cas. Group into old (has triolla URLs) and new (no triolla URLs).
  // For each old file, compute what the rewritten content would look like IF we had
  // replaced triolla URLs with something. Since we don't know the exact replacements,
  // we can check: does there exist a new file created in the last 10 min whose content
  // is a "near match" to the old file?
  //
  // This is getting complex. Let's take the pragmatic route:
  // We know the script printed the mapping. Re-run the core rewrite function
  // but this time BUILD the urlToLocal map from the recently downloaded files.

  // Step 1: find all recently downloaded assets (non css/js) in _cas/
  const allFiles = await readdir(CAS_DIR);
  const recentAssets = [];
  for (const f of allFiles) {
    if (f.endsWith(".css") || f.endsWith(".js") || f === "manifest.json") continue;
    const s = await stat(path.join(CAS_DIR, f));
    if (now - s.mtimeMs < TEN_MIN) {
      recentAssets.push(f);
    }
  }
  console.log(`Recently downloaded assets: ${recentAssets.length}`);

  // Step 2: for each old CSS file, we need to know what URL maps to what local path.
  // We can extract the URLs from the old CSS file and try to match them to recently
  // downloaded assets by extension. But multiple assets have the same extension.
  // 
  // This is fundamentally impossible without the URL→hash mapping unless we re-download.
  // 
  // FINAL APPROACH: Re-run the full rewrite pipeline but use the already-downloaded files.
  // We need: URL → sha256 of downloaded content. We have the files in _cas.
  // We need a way to know which file corresponds to which URL.
  //
  // Since we can't do this without re-downloading or a manifest, let's just re-run the
  // main script with a "skip download if file exists" mode, collect the mapping, and update.
  //
  // Actually wait — the main script DID collect urlToLocal in memory, but updateRegistry
  // looked at snapshotRegistry.TS not JSON. Let me just fix this properly.

  console.log("\nThe registry JSON needs to be updated with the hash mapping.");
  console.log("Re-running rewrite to collect the mapping...\n");
  
  // We'll re-derive by: for each old CSS file, rewrite it the same way,
  // compute new hash, and that IS the new file (we wrote it already).
  // We don't need the exact url→local mapping to compute the new hash,
  // we just need to apply the SAME rewrite. The same rewrite = replace
  // every triolla.io URL with /assets/_cas/<hash>.<ext>.
  // 
  // But to know <hash> we need to have downloaded the file.
  // 
  // Key insight: The new rewritten CSS files ARE already in _cas/.
  // We just don't know which old hash maps to which new hash.
  // 
  // Solution: for each old CSS file, re-apply rewrite with whatever
  // urlToLocal we can derive, compute new hash, check if that file exists.
  // 
  // To derive urlToLocal: we know all the URLs from the old CSS files,
  // and we have recently downloaded assets. We can try to match by
  // downloading each URL again (tiny files, mostly fonts/images) and
  // hashing them — but we already have them in _cas/.
  //
  // OR: just compare the recently-created new CSS files against old ones
  // to find pairs where new is a subset of old (same text but URLs replaced).

  // Compare approach: for each new css file, find its corresponding old one.
  // New = recently created, doesn't have triolla URLs.
  // Old = has triolla URLs.
  // They should be paired 1-1 (one new per old).

  const oldHashToNew = new Map();
  
  // Read all new CSS content
  const newCssData = new Map(); // hash → content
  for (const file of cssFiles) {
    const hash = file.replace(".css", "");
    if (!newHashes.has(hash)) continue;
    const content = await readFile(path.join(CAS_DIR, file), "utf8");
    newCssData.set(hash, content);
  }

  // For each old CSS, strip all URLs (replace with empty string) and compare
  // to new CSS stripped of all URLs. If they match, it's a pair.
  // "Strip URLs" = remove the content inside url() calls.
  
  // More reliable: check that old and new have the same non-URL text.
  // Replace every url(...) value with a placeholder.
  function normalizeUrls(css) {
    return css
      .replace(/url\([^)]*\)/g, "url(PLACEHOLDER)")
      .replace(/https?:\/\/triolla\.io\/[^\s"',)>]*/g, "PLACEHOLDER");
  }

  for (const oldHash of oldHashes) {
    const oldContent = await readFile(path.join(CAS_DIR, `${oldHash}.css`), "utf8");
    const oldNorm = normalizeUrls(oldContent);

    for (const [newHash, newContent] of newCssData) {
      const newNorm = normalizeUrls(newContent);
      if (oldNorm === newNorm) {
        oldHashToNew.set(oldHash, newHash);
        break;
      }
    }
  }

  console.log(`Paired ${oldHashToNew.size} old→new CSS hashes.`);

  if (oldHashToNew.size === 0) {
    console.log("Nothing to update in registry.");
    return;
  }

  // Update snapshotRegistry.json
  let jsonContent = await readFile(REGISTRY_JSON, "utf8");
  let jsonChanges = 0;
  for (const [oldHash, newHash] of oldHashToNew) {
    const before = jsonContent;
    jsonContent = jsonContent.replaceAll(oldHash, newHash);
    if (jsonContent !== before) jsonChanges++;
  }
  if (jsonChanges > 0) {
    await writeFile(REGISTRY_JSON, jsonContent, "utf8");
    console.log(`✓ snapshotRegistry.json: updated ${jsonChanges} hash references.`);
  }

  // Also update the .ts file if it has any direct references
  let tsContent = await readFile(REGISTRY_TS, "utf8");
  let tsChanges = 0;
  for (const [oldHash, newHash] of oldHashToNew) {
    const before = tsContent;
    tsContent = tsContent.replaceAll(oldHash, newHash);
    if (tsContent !== before) tsChanges++;
  }
  if (tsChanges > 0) {
    await writeFile(REGISTRY_TS, tsContent, "utf8");
    console.log(`✓ snapshotRegistry.ts: updated ${tsChanges} hash references.`);
  }

  console.log("\n=== Registry update complete ===");
}

main().catch((e) => {
  console.error("Fatal:", e);
  process.exit(1);
});
