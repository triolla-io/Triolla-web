#!/usr/bin/env node
/**
 * Fetches missing Hebrew pages from https://triolla.io and appends registry entries
 * + body fragments. Clones css/js/inlineScripts/loadOrderSha/gsapHook/loadedDelayMs/head
 * from triolla-io-he-about-us (pipeline parity baseline per project plan).
 */
import { readFile, writeFile, readdir } from "fs/promises";
import { load } from "cheerio";
import path from "path";
import { fileURLToPath } from "url";
import { HEBREW_NAV_LINK_FRAGMENTS } from "./hebrewNavFragmentSources.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const FRAGMENTS = path.join(ROOT, "public", "fragments");
const REGISTRY_PATH = path.join(ROOT, "lib", "snapshotRegistry.json");
const ORIGIN = "https://triolla.io";
const TEMPLATE_SLUG = "triolla-io-he-about-us";

/** Live URL has no Hebrew page — fetch English snapshot body from this URL instead. */
const FETCH_FALLBACK = {
  "/he/%d7%94%d7%a9%d7%99%d7%a8%d7%95%d7%aa%d7%99%d7%9d-%d7%a9%d7%9c%d7%a0%d7%95/product-stars/":
    "https://triolla.io/services/product-stars/",
};
const HREF_RE = /href=["'](\/he\/[^"'#?]*)["']/gi;

function lowerPercentHex(p) {
  return p.replace(/%[0-9A-Fa-f]{2}/g, (m) => "%" + m.slice(1).toLowerCase());
}

function normalizePath(p) {
  if (!p || !p.startsWith("/he")) return null;
  let s = p.split("?")[0].split("#")[0];
  if (!s.endsWith("/")) s += "/";
  return lowerPercentHex(s);
}

function canonicalPathKey(p) {
  const n = normalizePath(p);
  if (!n) return null;
  try {
    return decodeURI(n);
  } catch {
    return n;
  }
}

function collectHeHrefs(html) {
  const out = new Set();
  let m;
  while ((m = HREF_RE.exec(html)) !== null) {
    const raw = m[1];
    if (raw === "/he" || raw === "/he/") continue;
    out.add(normalizePath(raw));
  }
  return [...out].filter(Boolean);
}

function pathMatchesHeRegistry(normalizedHref, hePaths, hePathKeys) {
  const key = canonicalPathKey(normalizedHref);
  if (hePaths.has(normalizedHref) || hePathKeys.has(key)) return true;
  for (const p of hePaths) {
    try {
      if (canonicalPathKey(p) === key) return true;
    } catch {
      /* ignore */
    }
  }
  return false;
}

function pathToSlug(normPath) {
  const inner = normPath.slice("/he/".length, -1);
  return `triolla-io-he-${inner.replace(/\//g, "-")}`;
}

function rewriteOrigin(html) {
  return html.replace(/https?:\/\/triolla\.io\//g, "/");
}

async function collectOrphans() {
  const registryRaw = await readFile(REGISTRY_PATH, "utf-8");
  const registry = JSON.parse(registryRaw);
  const hePaths = new Set();
  const hePathKeys = new Set();
  for (const e of registry) {
    if (e.locale !== "he" || !e.path) continue;
    const n = normalizePath(e.path);
    hePaths.add(n);
    hePathKeys.add(canonicalPathKey(n));
  }
  const files =
    process.env.VERIFY_HEBREW_ALL_FRAGMENTS === "1"
      ? (await readdir(FRAGMENTS)).filter((f) => f.endsWith("-he-body.html"))
      : HEBREW_NAV_LINK_FRAGMENTS;
  const allHrefs = new Set();
  for (const f of files) {
    const html = await readFile(path.join(FRAGMENTS, f), "utf-8");
    for (const h of collectHeHrefs(html)) allHrefs.add(h);
  }
  const orphans = [];
  for (const href of [...allHrefs].sort()) {
    const n = normalizePath(href);
    if (!pathMatchesHeRegistry(n, hePaths, hePathKeys)) orphans.push(n);
  }
  return { orphans, registry, hePaths, hePathKeys };
}

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function main() {
  const { orphans, registry } = await collectOrphans();
  if (!orphans.length) {
    console.log("ingest-hebrew-orphans: nothing to do (no orphan /he/ links)");
    return;
  }

  const template = registry.find((e) => e.slug === TEMPLATE_SLUG && e.locale === "he");
  if (!template) {
    console.error(`Missing template entry ${TEMPLATE_SLUG}`);
    process.exit(1);
  }

  const existingSlugs = new Set(registry.map((e) => e.slug));
  let added = 0;

  for (const normPath of orphans) {
    const slug = pathToSlug(normPath);
    if (existingSlugs.has(slug)) {
      console.log(`skip (slug exists): ${slug}`);
      continue;
    }

    const fetchUrl = new URL(FETCH_FALLBACK[normPath] ?? normPath, ORIGIN).href;
    console.log(`fetch ${fetchUrl}`);
    const res = await fetch(fetchUrl, {
      headers: {
        "user-agent":
          "Mozilla/5.0 (compatible; triolla-snapshot-ingest/1.0; +https://triolla.io)",
        "accept-language": "he,en;q=0.9",
      },
    });
    if (!res.ok) {
      console.error(`HTTP ${res.status} for ${fetchUrl}`);
      process.exit(1);
    }
    const pageHtml = await res.text();
    const $ = load(pageHtml);
    const title = ($("title").first().text() || "Triolla").trim();
    const mainEl = $(".main_container").first();
    if (!mainEl.length) {
      console.error(`No .main_container in ${fetchUrl}`);
      process.exit(1);
    }
    let outer = rewriteOrigin(mainEl.prop("outerHTML") || "");
    if (!outer.trim().startsWith("<")) {
      console.error(`Bad main HTML for ${fetchUrl}`);
      process.exit(1);
    }

    const fragmentRel = `fragments/${slug}-he-body.html`;
    await writeFile(path.join(ROOT, "public", fragmentRel), outer + "\n", "utf-8");

    const entry = structuredClone(template);
    entry.slug = slug;
    entry.locale = "he";
    entry.dir = "rtl";
    entry.path = normPath;
    entry.fragment = fragmentRel;
    if (entry.head) {
      entry.head = { ...entry.head, title: `${title}`.replace(/\s*\|\s*Triolla\s*$/i, " - Triolla") };
    }
    registry.push(entry);
    existingSlugs.add(slug);
    added++;
    await sleep(350);
  }

  await writeFile(REGISTRY_PATH, JSON.stringify(registry, null, 2) + "\n", "utf-8");
  console.log(`ingest-hebrew-orphans: added ${added} Hebrew page(s)`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
