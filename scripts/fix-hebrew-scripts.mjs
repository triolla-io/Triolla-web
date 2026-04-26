#!/usr/bin/env node
/**
 * Fix undefined script references in Hebrew fragments
 * - Remove moove_frontend_gdpr_scripts references that cause errors
 * - Add stub implementations for scripts that can't be removed
 */
import { readFile, writeFile, readdir } from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const FRAGMENTS = path.join(ROOT, "public", "fragments");

async function main() {
  const files = (await readdir(FRAGMENTS)).filter((f) => f.endsWith("-he-body.html"));
  let fixed = 0;

  for (const file of files) {
    const filePath = path.join(FRAGMENTS, file);
    let html = await readFile(filePath, "utf-8");
    const original = html;

    // Fix moove_frontend_gdpr_scripts by wrapping it in a window check
    html = html.replace(
      /if\s*\(\s*typeof\s+moove_frontend_gdpr_scripts\s*!==/g,
      "if (typeof window !== 'undefined' && typeof moove_frontend_gdpr_scripts !=="
    );

    // Add stub for moove_frontend_gdpr_scripts if it doesn't exist
    if (html.includes("moove_frontend_gdpr_scripts") && !html.includes("window.moove_frontend_gdpr_scripts = ")) {
      const stub = "window.moove_frontend_gdpr_scripts = {initGdpr: function() {}, getCookie: function() { return null; }};";
      // Add stub before any scripts that reference it
      if (!html.includes(stub)) {
        // Find first occurrence of moove_frontend_gdpr_scripts and add stub before it
        const idx = html.indexOf("moove_frontend_gdpr_scripts");
        if (idx > 0) {
          // Find the nearest script opening tag before this occurrence
          const scriptStart = html.lastIndexOf("<script", idx);
          if (scriptStart > 0) {
            const scriptEnd = html.indexOf(">", scriptStart) + 1;
            html = html.slice(0, scriptEnd) + `\nwindow.moove_frontend_gdpr_scripts = {getCookie: function() { return null; }, initGdpr: function() {}};` + html.slice(scriptEnd);
          }
        }
      }
    }

    // Remove broken GDPR modal if it exists and causes issues
    html = html.replace(/<dialog[^>]*id="moove_gdpr_cookie_modal"[^>]*>[\s\S]*?<\/dialog>/i, "");

    if (html !== original) {
      await writeFile(filePath, html, "utf-8");
      fixed++;
      console.log(`✓ Fixed: ${file}`);
    }
  }

  console.log(`\nFixed ${fixed} Hebrew fragment(s)`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
