/**
 * Subset the CAS woff2 fonts to Latin + Hebrew + common symbols only.
 * Full SF Pro fonts are ~900 KB each; subsetted they drop to ~100-200 KB.
 *
 * Steps:
 *   1. Run pyftsubset on each target woff2 → subsetted woff2 buffer
 *   2. SHA-256 hash the output → new CAS filename
 *   3. Write to _cas/ if it doesn't exist
 *   4. Rewrite all CSS files in _cas/ that reference the old URL
 *
 * Usage:
 *   node scripts/subset-fonts.mjs [--dry-run]
 */

import { createHash } from "crypto";
import { readFileSync, writeFileSync, existsSync, readdirSync } from "fs";
import { readFile, writeFile } from "fs/promises";
import { execFile } from "child_process";
import { promisify } from "util";
import { tmpdir } from "os";
import path from "path";

const execFileAsync = promisify(execFile);

const ROOT    = path.resolve(import.meta.dirname, "..");
const CAS_DIR = path.join(ROOT, "public", "assets", "_cas");
const DRY_RUN = process.argv.includes("--dry-run");

// Unicode ranges to keep:
//   U+0020-007F  Basic Latin (ASCII printable)
//   U+00A0-00FF  Latin-1 Supplement (accents, €, ©, ×, etc.)
//   U+0100-017F  Latin Extended-A
//   U+0180-024F  Latin Extended-B
//   U+2000-206F  General Punctuation (", ", …, —, etc.)
//   U+20A0-20CF  Currency Symbols (€, £, ¥, ₪)
//   U+2100-214F  Letterlike Symbols (™, ®)
//   U+2190-21FF  Arrows
//   U+0590-05FF  Hebrew block (full — 110 chars)
//   U+FB1D-FB4F  Hebrew Presentation Forms
const UNICODES = [
  "U+0020-007F",
  "U+00A0-00FF",
  "U+0100-017F",
  "U+0180-024F",
  "U+2000-206F",
  "U+20A0-20CF",
  "U+2100-214F",
  "U+2190-21FF",
  "U+0590-05FF",
  "U+FB1D-FB4F",
].join(",");

// The five SFProText/SFPro weights stored in the CAS.
// (Identified from @font-face declarations in the CSS bundles.)
const TARGETS = [
  "b3b1bf129ae240ee38e98573b0adb4c6e52f0363bb943fecd1b36bbcfe493bda.woff2", // 400 regular
  "2ae4ffbe11229a3b4a7a922b0203b29ca338e1050157b1e61c81ac6da619f393.woff2", // 500 medium
  "3ecb4d6a9d92b6a3f80131012d394a934ed7f2bb248bf649aa8e68fcab6283d8.woff2", // 400 SF Pro alt
  "7889ba6acd5eccb51500ba8a63943c543283e2d6b2e2ee60480790f5fae2caf8.woff2", // 600 semibold
  "a063a162d9148d32291b6196a792fba4d6786c3e7cc4226be9eb266a4b3269b7.woff2", // 700 bold
];

function sha256(buf) {
  return createHash("sha256").update(buf).digest("hex");
}

async function subsetFont(srcPath) {
  const tmp = path.join(tmpdir(), `subset-${Date.now()}.woff2`);
  await execFileAsync("pyftsubset", [
    srcPath,
    `--unicodes=${UNICODES}`,
    "--flavor=woff2",
    "--layout-features=*",   // keep all OpenType features (kerning, ligatures)
    `--output-file=${tmp}`,
  ]);
  const buf = readFileSync(tmp);
  return buf;
}

async function main() {
  const urlMap = new Map(); // old URL → new URL

  for (const file of TARGETS) {
    const srcPath = path.join(CAS_DIR, file);
    if (!existsSync(srcPath)) {
      console.log(`  skip (missing): ${file.slice(0, 16)}…`);
      continue;
    }

    const origSize = readFileSync(srcPath).length;

    let subsetBuf;
    try {
      subsetBuf = await subsetFont(srcPath);
    } catch (e) {
      console.warn(`  ✗ ${file.slice(0, 16)}…: ${e.message}`);
      continue;
    }

    const newHash = sha256(subsetBuf);
    const newFile = `${newHash}.woff2`;
    const newPath = path.join(CAS_DIR, newFile);
    const savings = Math.round((1 - subsetBuf.length / origSize) * 100);

    console.log(
      `  ${file.slice(0, 16)}… ${Math.round(origSize / 1024)}KB → ` +
      `${newFile.slice(0, 16)}… ${Math.round(subsetBuf.length / 1024)}KB (-${savings}%)`
    );

    if (!DRY_RUN && !existsSync(newPath)) {
      writeFileSync(newPath, subsetBuf);
    }

    urlMap.set(`/assets/_cas/${file}`, `/assets/_cas/${newFile}`);
  }

  if (urlMap.size === 0) {
    console.log("[subset] Nothing to rewrite.");
    return;
  }

  // Rewrite CSS files that reference the old font URLs
  const escaped = [...urlMap.keys()].map(u => u.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));
  const pattern = new RegExp(escaped.join("|"), "g");
  const replace = s => s.replace(pattern, m => urlMap.get(m) ?? m);

  const cssFiles = readdirSync(CAS_DIR).filter(f => f.endsWith(".css"));
  let hits = 0;
  for (const f of cssFiles) {
    const p = path.join(CAS_DIR, f);
    const orig = await readFile(p, "utf-8");
    const updated = replace(orig);
    if (updated !== orig) {
      if (!DRY_RUN) await writeFile(p, updated, "utf-8");
      hits++;
    }
  }
  console.log(`\n[subset] Updated ${hits} CSS files`);

  // Also update layout.tsx font preload hrefs
  const layoutPath = path.join(ROOT, "app", "layout.tsx");
  const layoutOrig = await readFile(layoutPath, "utf-8");
  const layoutUpdated = replace(layoutOrig);
  if (layoutUpdated !== layoutOrig) {
    if (!DRY_RUN) await writeFile(layoutPath, layoutUpdated, "utf-8");
    console.log("[subset] Updated layout.tsx preload hrefs");
  }

  console.log("\n[subset] Done. Run `npm run build` to apply.");
}

main().catch(e => { console.error(e); process.exit(1); });
