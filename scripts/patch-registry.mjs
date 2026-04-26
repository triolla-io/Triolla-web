#!/usr/bin/env node
/**
 * patch-registry.mjs
 *
 * Finds every CSS hash currently in snapshotRegistry.json,
 * checks if there's a newer rewritten version in _cas/ (created today),
 * pairs them by normalizing url() values, then updates the JSON.
 */

import { createHash } from "crypto";
import { readFile, writeFile, readdir, stat } from "fs/promises";
import path from "path";

const ROOT = new URL("..", import.meta.url).pathname;
const CAS_DIR = path.join(ROOT, "public/assets/_cas");
const REGISTRY_JSON = path.join(ROOT, "lib/snapshotRegistry.json");

function sha256(str) {
  return createHash("sha256").update(str, "utf8").digest("hex");
}

// Strip all url() values and absolute triolla URLs for comparison
function normalize(css) {
  return css
    .replace(/url\(\s*['"]?[^)'"]+['"]?\s*\)/g, "url(X)")
    .replace(/https?:\/\/triolla\.io\/[^\s"')\]>]*/g, "TRIOLLA");
}

async function main() {
  // 1. Load registry to get the CSS hashes currently in use
  const registryRaw = await readFile(REGISTRY_JSON, "utf8");
  const registry = JSON.parse(registryRaw);

  const usedCssHashes = new Set();
  for (const entry of registry) {
    for (const cssPath of entry.css || []) {
      // cssPath is like "/assets/_cas/<hash>.css" or "_cas/<hash>.css"
      const m = cssPath.match(/([a-f0-9]{64})\.css/);
      if (m) usedCssHashes.add(m[1]);
    }
  }
  console.log(`Registry uses ${usedCssHashes.size} unique CSS hashes.`);

  // 2. Find all CSS files in _cas/ created in the last 2 hours (new rewrites)
  const now = Date.now();
  const TWO_HOURS = 2 * 60 * 60 * 1000;
  const allCss = (await readdir(CAS_DIR)).filter((f) => f.endsWith(".css"));
  
  const newCssFiles = [];
  for (const f of allCss) {
    const s = await stat(path.join(CAS_DIR, f));
    if (now - s.mtimeMs < TWO_HOURS) {
      newCssFiles.push(f.replace(".css", ""));
    }
  }
  console.log(`New CSS files (last 2h): ${newCssFiles.length}`);

  // 3. Pair old→new by normalized content
  const oldToNew = new Map();

  for (const oldHash of usedCssHashes) {
    const oldPath = path.join(CAS_DIR, `${oldHash}.css`);
    let oldContent;
    try {
      oldContent = await readFile(oldPath, "utf8");
    } catch {
      console.warn(`  ⚠ Missing: ${oldHash}.css`);
      continue;
    }
    const oldNorm = normalize(oldContent);

    for (const newHash of newCssFiles) {
      if (newHash === oldHash) continue;
      const newPath = path.join(CAS_DIR, `${newHash}.css`);
      const newContent = await readFile(newPath, "utf8");
      const newNorm = normalize(newContent);
      if (oldNorm === newNorm) {
        oldToNew.set(oldHash, newHash);
        break;
      }
    }
  }

  console.log(`Paired: ${oldToNew.size} old→new CSS hashes\n`);

  if (oldToNew.size === 0) {
    // Check if maybe the registry already has new hashes
    const alreadyNew = [...usedCssHashes].filter((h) => newCssFiles.includes(h));
    if (alreadyNew.length > 0) {
      console.log(`Registry already references ${alreadyNew.length} new (rewritten) CSS files. Nothing to do.`);
    } else {
      console.log("No pairs found. The old CSS files may not need rewriting, or pairing failed.");
    }
    return;
  }

  // 4. Update registry JSON by replacing old hashes with new hashes
  let updated = registryRaw;
  let count = 0;
  for (const [oldHash, newHash] of oldToNew) {
    const before = updated;
    updated = updated.replaceAll(oldHash, newHash);
    if (updated !== before) {
      count++;
      console.log(`  ${oldHash.slice(0, 16)}… → ${newHash.slice(0, 16)}…`);
    }
  }

  await writeFile(REGISTRY_JSON, updated, "utf8");
  console.log(`\n✓ snapshotRegistry.json updated: ${count} hash replacements.`);
}

main().catch((e) => { console.error(e); process.exit(1); });
