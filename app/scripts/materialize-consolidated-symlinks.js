#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..", "..");
const CONSOLIDATED = path.join(ROOT, "public", "assets", "_consolidated");

function walk(dir, acc = []) {
  if (!fs.existsSync(dir)) return acc;
  for (const name of fs.readdirSync(dir)) {
    const full = path.join(dir, name);
    const st = fs.lstatSync(full);
    if (st.isDirectory()) walk(full, acc);
    else acc.push(full);
  }
  return acc;
}

function main() {
  if (!fs.existsSync(CONSOLIDATED)) {
    console.log("materialize-consolidated-symlinks: _consolidated not found, skip.");
    return;
  }

  let converted = 0;
  let skipped = 0;
  for (const file of walk(CONSOLIDATED)) {
    if (!fs.lstatSync(file).isSymbolicLink()) continue;

    const target = path.resolve(path.dirname(file), fs.readlinkSync(file));
    if (target === path.resolve(file) || !fs.existsSync(target)) {
      skipped++;
      continue;
    }
    if (fs.lstatSync(target).isDirectory()) {
      skipped++;
      continue;
    }

    fs.unlinkSync(file);
    fs.copyFileSync(target, file);
    converted++;
  }

  console.log(
    `materialize-consolidated-symlinks: converted ${converted} symlink(s), skipped ${skipped}.`,
  );
}

main();
