#!/usr/bin/env node
/**
 * Fails if any href="/he/..." in *-he-body.html fragments does not resolve to
 * a Hebrew snapshot entry (locale he + matching path) or a static app/he route.
 */
import { readFile, readdir } from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import { HEBREW_NAV_LINK_FRAGMENTS } from "./hebrewNavFragmentSources.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const FRAGMENTS = path.join(ROOT, "public", "fragments");
const REGISTRY_PATH = path.join(ROOT, "lib", "snapshotRegistry.json");

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

/** Decode percent-encoding for comparison; keep trailing slash. */
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

async function main() {
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
    if (!pathMatchesHeRegistry(n, hePaths, hePathKeys)) orphans.push(href);
  }

  if (orphans.length) {
    console.error(`\nverify-hebrew-routes: ${orphans.length} orphan /he/ link(s):\n`);
    for (const o of orphans) console.error(`  - ${o}`);
    console.error("\nFix by adding registry entries + fragments, or correcting hrefs.\n");
    process.exit(1);
  }
  const scope =
    process.env.VERIFY_HEBREW_ALL_FRAGMENTS === "1"
      ? "all *-he-body.html fragments"
      : "nav fragments (set VERIFY_HEBREW_ALL_FRAGMENTS=1 for full site)";
  console.log(`verify-hebrew-routes: OK — no orphan /he/ links (${scope})`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
