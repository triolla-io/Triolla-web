#!/usr/bin/env node
/**
 * Deduplicate identical CSS files under public/assets by symlinking copies to
 * web/public/assets/_shared/<basename-of-canonical>.
 *
 * - Keeps one real file per content hash in _shared (copies from shortest path name).
 * - Replaces other identical files with relative symlinks (Next serves them like normal files).
 * - Skips _shared, _triolla-fonts, and paths that are already symlinks.
 *
 * Run after syncing new snapshot assets:
 *   npm run dedupe:css
 *
 * Optional: regenerate pipeline/css_dedup_report.json first:
 *   node scripts/report-css-dedup.js
 */

const crypto = require("crypto");
const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..");
const ASSETS = path.join(ROOT, "public", "assets");
const SHARED = path.join(ASSETS, "_shared");
function sha256File(abs) {
  const h = crypto.createHash("sha256");
  h.update(fs.readFileSync(abs));
  return h.digest("hex");
}

/** All regular .css files (not symlinks); include _shared so new page copies match canonical hashes. */
function walkCssFiles(dir, acc = []) {
  if (!fs.existsSync(dir)) return acc;
  for (const name of fs.readdirSync(dir)) {
    if (name === "_triolla-fonts" && dir === ASSETS) continue;
    const full = path.join(dir, name);
    const st = fs.lstatSync(full);
    if (st.isSymbolicLink()) continue;
    if (st.isDirectory()) walkCssFiles(full, acc);
    else if (name.endsWith(".css")) acc.push(full);
  }
  return acc;
}

function main() {
  if (!fs.existsSync(ASSETS)) {
    console.error("Missing public/assets");
    process.exit(1);
  }
  if (!fs.existsSync(SHARED)) fs.mkdirSync(SHARED, { recursive: true });

  const files = walkCssFiles(ASSETS);
  const byHash = new Map();
  for (const abs of files) {
    let hash;
    try {
      hash = sha256File(abs);
    } catch {
      continue;
    }
    if (!byHash.has(hash)) byHash.set(hash, []);
    byHash.get(hash).push(abs);
  }

  let groups = 0;
  let linked = 0;
  let copiedToShared = 0;

  for (const [, pathsAbs] of byHash) {
    if (pathsAbs.length < 2) continue;
    groups++;
    const underShared = pathsAbs.filter((p) => p.startsWith(SHARED + path.sep));
    const sorted = [...pathsAbs].sort((a, b) => a.length - b.length);
    const baseName = path.basename(sorted[0]);
    let sharedTarget =
      underShared.sort((a, b) => a.length - b.length)[0] ||
      path.join(SHARED, baseName);

    if (!underShared.length && !fs.existsSync(sharedTarget)) {
      fs.copyFileSync(sorted[0], sharedTarget);
      copiedToShared++;
    }

    if (!fs.existsSync(sharedTarget)) {
      console.warn("skip group: no shared target for", baseName);
      continue;
    }

    const sharedHash = sha256File(sharedTarget);
    for (const p of pathsAbs) {
      if (path.resolve(p) === path.resolve(sharedTarget)) continue;
      if (sha256File(p) !== sharedHash) continue;
      const rel = path.relative(path.dirname(p), sharedTarget);
      fs.unlinkSync(p);
      fs.symlinkSync(rel, p);
      linked++;
    }
  }

  console.log(
    `dedupe-public-css: ${groups} duplicate group(s), ${linked} symlink(s), ${copiedToShared} new canonical(s) in _shared.`,
  );
}

main();
