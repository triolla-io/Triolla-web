#!/usr/bin/env node
import { writeFile, readFile } from "fs/promises";
import { load } from "cheerio";
import path from "path";
import { fileURLToPath } from "url";
import crypto from "crypto";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");

async function downloadFile(url) {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Failed to fetch ${url}: ${response.status}`);
  return response.arrayBuffer();
}

function hashFile(data) {
  return crypto.createHash("sha256").update(Buffer.from(data)).digest("hex");
}

async function main() {
  console.log("Extracting Hebrew cyber security page...");

  const pageUrl = "https://triolla.io/he/%d7%a1%d7%99%d7%99%d7%91%d7%a8/";

  // Fetch page
  console.log("Downloading page...");
  const pageRes = await fetch(pageUrl);
  if (!pageRes.ok) throw new Error(`Failed to fetch: ${pageRes.status}`);

  const html = await pageRes.text();
  const $ = load(html);

  // Extract body
  const bodyHtml = $("body").html();
  if (!bodyHtml) throw new Error("No body found");

  // Remove scripts
  const fragment = bodyHtml
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
    .replace(/<noscript.*?<\/noscript>/gi, "");

  // Rewrite URLs
  let fixed = fragment.replace(/https?:\/\/triolla\.io\//g, "/");

  // Download CSS and create CAS entries
  const cssLinks = [];
  const cssHrefs = new Set();

  $("link[rel='stylesheet']").each((i, el) => {
    let href = $(el).attr("href");
    if (href && !cssHrefs.has(href)) {
      cssHrefs.add(href);
      cssLinks.push(href);
    }
  });

  console.log(`Found ${cssLinks.length} stylesheets`);

  for (const href of cssLinks) {
    const url = href.startsWith("http") ? href : `https://triolla.io${href}`;
    try {
      console.log(`  Downloading: ${href}`);
      const data = await downloadFile(url);
      const hash = hashFile(data);
      const casPath = `/assets/_cas/${hash}.css`;
      const filePath = path.join(ROOT, "public", "assets", "_cas", `${hash}.css`);

      // Create dir if needed
      await import("fs").then(fs => fs.promises.mkdir(path.dirname(filePath), { recursive: true }));
      await writeFile(filePath, Buffer.from(data));

      // Rewrite in fragment
      fixed = fixed.replace(new RegExp(href.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "g"), casPath);
    } catch (e) {
      console.error(`  ✗ Error: ${e.message}`);
    }
  }

  // Write fragment
  const fragmentPath = path.join(ROOT, "public", "fragments", "triolla-io-he-%d7%a1%d7%99%d7%99%d7%91%d7%a8-he-body.html");
  await writeFile(fragmentPath, fixed + "\n", "utf-8");

  console.log(`✓ Fragment written: ${fragmentPath}`);
  console.log(`\nNow run: npm run build && npm run dev`);
}

main().catch(e => {
  console.error(e);
  process.exit(1);
});
