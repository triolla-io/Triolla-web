#!/usr/bin/env node
/**
 * Write pipeline/css_dedup_report.json — hash groups for all .css under public/assets
 * (excluding _shared as source walk; include all dirs for scan).
 */

const crypto = require("crypto");
const fs = require("fs");
const path = require("path");

const WEB = path.join(__dirname, "..");
const ASSETS = path.join(WEB, "public", "assets");
const OUT = path.join(WEB, "..", "pipeline", "css_dedup_report.json");
const SKIP_TOP = new Set(["_triolla-fonts"]);

function sha256File(abs) {
  const h = crypto.createHash("sha256");
  h.update(fs.readFileSync(abs));
  return h.digest("hex");
}

function countCssSymlinks(dir, n = 0) {
  for (const name of fs.readdirSync(dir)) {
    const full = path.join(dir, name);
    const st = fs.lstatSync(full);
    if (st.isSymbolicLink() && name.endsWith(".css")) n++;
    else if (st.isDirectory()) {
      if (dir === ASSETS && SKIP_TOP.has(name)) continue;
      n = countCssSymlinks(full, n);
    }
  }
  return n;
}

function walkCss(dir, acc = []) {
  for (const name of fs.readdirSync(dir)) {
    const full = path.join(dir, name);
    const st = fs.lstatSync(full);
    if (st.isSymbolicLink()) continue;
    if (st.isDirectory()) {
      if (dir === ASSETS && SKIP_TOP.has(name)) continue;
      walkCss(full, acc);
    } else if (name.endsWith(".css")) acc.push(full);
  }
  return acc;
}

function main() {
  const files = walkCss(ASSETS);
  const byHash = new Map();
  for (const abs of files) {
    const hash = sha256File(abs);
    const rel = path.relative(ASSETS, abs).split(path.sep).join("/");
    if (!byHash.has(hash)) byHash.set(hash, []);
    byHash.get(hash).push(rel);
  }

  const groups = [];
  let wasted = 0;
  let scanned = files.length;
  for (const [hash, paths] of byHash) {
    if (paths.length < 2) continue;
    const sorted = [...paths].sort((a, b) => a.length - b.length);
    const size = fs.statSync(path.join(ASSETS, sorted[0])).size;
    const w = (paths.length - 1) * size;
    wasted += w;
    groups.push({
      hash,
      size_bytes: size,
      count: paths.length,
      wasted_bytes: w,
      paths: sorted,
    });
  }

  const symlinkCss = countCssSymlinks(ASSETS);
  const report = {
    root: ASSETS,
    scope: "css_only",
    note: "Real files only; identical CSS in page dirs is stored as symlinks to _shared/.",
    scanned_real_css_files: scanned,
    css_symlinks_elsewhere: symlinkCss,
    unique_content_hashes: byHash.size,
    duplicate_groups_among_real_files: groups.length,
    total_wasted_bytes: wasted,
    total_wasted_mb: Math.round((wasted / 1024 / 1024) * 100) / 100,
    groups,
  };

  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  fs.writeFileSync(OUT, JSON.stringify(report, null, 2) + "\n");
  console.log(
    `Wrote ${path.relative(process.cwd(), OUT)} (real CSS files: ${scanned}, symlinks: ${symlinkCss}, duplicate real-file groups: ${groups.length}).`,
  );
}

main();
