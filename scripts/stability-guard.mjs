#!/usr/bin/env node
/**
 * Stability Guard — environment stabilizer + regression detector for the
 * Lighthouse Optimization Suite.
 *
 * Replaces the old visual-diff.mjs. Three responsibilities:
 *
 *   1. THROTTLING_PROFILES — single source of truth for the
 *      "honest network/CPU profile". Both audit-worker (Lighthouse) and
 *      the visual capture pipeline (Playwright) read from here so
 *      Lighthouse scores correlate with real-world devices and we never
 *      optimize for inflated localhost numbers.
 *
 *   2. capture(target) — load a page in a deterministic, screenshot-stable
 *      way (fonts ready, animations off, lazy images forced, dynamic
 *      regions masked) and produce both a PNG and a DOM signature.
 *
 *   3. verdict(baseline, current) — decide whether a fix should be kept
 *      or rolled back. DOM assertions are HARD (lost <h1>, lost nav links,
 *      new console errors → rollback). Pixel diff is SOFT (logged for
 *      review, doesn't block).
 *
 * CLI:
 *   node scripts/stability-guard.mjs --baseline                  capture all targets
 *   node scripts/stability-guard.mjs --baseline --slug <substr>  capture matching
 *   node scripts/stability-guard.mjs --check  --slug <substr>    verify against baseline
 *   node scripts/stability-guard.mjs --print-throttling strict   dump the profile
 */

import { mkdirSync, writeFileSync, readFileSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";
import { chromium } from "playwright";
import { enumerateTargets, VIEWPORTS } from "./lib/enumerate-targets.mjs";

const require = createRequire(import.meta.url);
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const ROOT = process.cwd();

// ─── Throttling profiles (THE single source of truth) ──────────────────────
//
// Lighthouse `throttlingMethod: "simulate"` runs the page WITHOUT applying
// network/CPU throttling and then mathematically estimates what the scores
// would look like under throttling. It runs in ~3s and is convenient, but
// it consistently scores 10–20 points higher than real devices.
//
// `"devtools"` (a.k.a. provided) uses the real DevTools Protocol to throttle
// network and CPU before timing. Slower (10–20s per audit) but the numbers
// are honest.
//
// Empirical anchor: the user reported PSI Mobile = 63 for a page where this
// suite reported 88 with the previous "simulate + Slow 4G + 4× CPU" defaults.
// The "strict" profile below — devtools throttling + Regular 3G network +
// 6× CPU — closes most of that gap. Run `THROTTLING_PROFILE=strict` to use
// it; the suite ships with `psi` (matches PageSpeed Insights lab settings)
// as the default going forward.
//
// All numeric fields use Lighthouse's units (kbps, ms, multiplier).

export const THROTTLING_PROFILES = {
  // Old, optimistic. Kept only for diffing against historical scores.
  legacy: {
    label: "legacy (simulate, Slow 4G, 4× CPU)",
    method: "simulate",
    mobile: { rttMs: 150, throughputKbps: 1638.4, requestLatencyMs: 562.5, downloadThroughputKbps: 1474.5, uploadThroughputKbps: 675, cpuSlowdownMultiplier: 4 },
    desktop: { rttMs: 40, throughputKbps: 10240, requestLatencyMs: 0, downloadThroughputKbps: 0, uploadThroughputKbps: 0, cpuSlowdownMultiplier: 1 },
  },

  // Default. Matches PageSpeed Insights lab settings (devtools throttling).
  // Closes the simulate→reality gap. Use this for normal runs.
  psi: {
    label: "psi (devtools, Slow 4G, 4× CPU)",
    method: "devtools",
    mobile: { rttMs: 150, throughputKbps: 1638.4, requestLatencyMs: 562.5, downloadThroughputKbps: 1474.5, uploadThroughputKbps: 675, cpuSlowdownMultiplier: 4 },
    desktop: { rttMs: 40, throughputKbps: 10240, requestLatencyMs: 0, downloadThroughputKbps: 0, uploadThroughputKbps: 0, cpuSlowdownMultiplier: 1 },
  },

  // Strict. Regular 3G + 6× CPU on mobile, cable + 2× CPU on desktop.
  // This is the "match the real 63" anchor — we'd rather optimize for an
  // honestly-low-end device than chase localhost vanity scores.
  strict: {
    label: "strict (devtools, Regular 3G, 6× CPU mobile / 2× CPU desktop)",
    method: "devtools",
    mobile: {
      rttMs: 300,
      throughputKbps: 700,
      requestLatencyMs: 300,
      downloadThroughputKbps: 700,
      uploadThroughputKbps: 250,
      cpuSlowdownMultiplier: 6,
    },
    desktop: {
      rttMs: 28,
      throughputKbps: 5120,
      requestLatencyMs: 28,
      downloadThroughputKbps: 5120,
      uploadThroughputKbps: 1024,
      cpuSlowdownMultiplier: 2,
    },
  },
};

export function activeThrottlingProfile() {
  const name = process.env.THROTTLING_PROFILE ?? "psi";
  const profile = THROTTLING_PROFILES[name];
  if (!profile) {
    throw new Error(
      `Unknown THROTTLING_PROFILE=${name}. Choose: ${Object.keys(THROTTLING_PROFILES).join(", ")}`,
    );
  }
  return { name, ...profile };
}

// ─── Mask config ───────────────────────────────────────────────────────────

const DEFAULT_CONFIG = {
  // Selectors hidden before pixel diff. Anything genuinely non-deterministic
  // belongs here — carousels, animated counters, third-party widgets, dates.
  globalMasks: [
    ".owl-carousel",
    ".swiper",
    ".slick-slider",
    "time",
    "[data-counter]",
    "iframe",
    "video",
    ".animated-text",
    ".typing-effect",
  ],
  // Per-template extras keyed by slug substring.
  perTemplate: {
    blog: [".post-meta-date", ".reading-time"],
    "service-detail": [".testimonial-rotator"],
  },
  // Pixel diff threshold (fraction of changed pixels). DOM checks are the real gate.
  pixelThreshold: 0.02,
};

function loadConfig(configPath) {
  if (!configPath || !existsSync(configPath)) return DEFAULT_CONFIG;
  try {
    const user = JSON.parse(readFileSync(configPath, "utf-8"));
    return {
      ...DEFAULT_CONFIG,
      ...user,
      globalMasks: [...DEFAULT_CONFIG.globalMasks, ...(user.globalMasks ?? [])],
      perTemplate: { ...DEFAULT_CONFIG.perTemplate, ...(user.perTemplate ?? {}) },
    };
  } catch {
    return DEFAULT_CONFIG;
  }
}

function masksForTarget(target, config) {
  const extras = Object.entries(config.perTemplate)
    .filter(([k]) => target.slug.includes(k))
    .flatMap(([, v]) => v);
  return [...config.globalMasks, ...extras];
}

// ─── Stable capture pipeline ───────────────────────────────────────────────
//
// The "stable" part: anything that wiggles between runs without any code
// change must be neutralized BEFORE we compare. Otherwise the safety net
// fires constantly and gets ignored — the bug we're fixing.

const ANIM_KILL_CSS = `
  *, *::before, *::after {
    animation-duration: 0s !important;
    animation-delay: 0s !important;
    transition-duration: 0s !important;
    transition-delay: 0s !important;
    caret-color: transparent !important;
  }
  html { scroll-behavior: auto !important; }
`;

async function preparePage(page, target, masks) {
  const vp = VIEWPORTS[target.formFactor];
  await page.setViewportSize({ width: vp.width, height: vp.height });

  // Track console + network errors for the DOM signature.
  const consoleErrors = [];
  const failedRequests = [];
  page.on("console", (m) => {
    if (m.type() === "error") consoleErrors.push(m.text());
  });
  page.on("requestfailed", (r) => {
    failedRequests.push(`${r.failure()?.errorText ?? "fail"} ${r.url()}`);
  });
  page.on("response", (r) => {
    if (r.status() >= 400) failedRequests.push(`HTTP ${r.status()} ${r.url()}`);
  });

  await page.goto(target._absUrl, { waitUntil: "networkidle", timeout: 60_000 });
  await page.addStyleTag({ content: ANIM_KILL_CSS });

  // Wait for fonts (FOUT/FOIT will shift text) + a settle delay.
  await page.evaluate(() => document.fonts?.ready ?? null);
  await page.waitForTimeout(500);

  // Force lazy-loaded images to materialize. Scroll down then back up,
  // then wait for any newly-fetched images to settle.
  await page.evaluate(async () => {
    const h = document.documentElement.scrollHeight;
    for (let y = 0; y < h; y += window.innerHeight) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 50));
    }
    window.scrollTo(0, 0);
  });
  await page.waitForLoadState("networkidle").catch(() => {});
  await page.waitForTimeout(300);

  // Hide masked regions. Use visibility:hidden (preserves layout) not
  // display:none (would shift everything else).
  if (masks.length > 0) {
    await page.evaluate((sels) => {
      for (const s of sels) {
        document.querySelectorAll(s).forEach((el) => {
          el.style.visibility = "hidden";
        });
      }
    }, masks);
  }

  return { consoleErrors, failedRequests };
}

async function domSignature(page, errors) {
  return await page.evaluate((errs) => {
    const txt = (el) => (el?.textContent ?? "").replace(/\s+/g, " ").trim();
    const collectLinks = (sel) => {
      const root = document.querySelector(sel);
      if (!root) return { linkCount: 0, hrefs: [] };
      const links = [...root.querySelectorAll("a[href]")];
      return {
        linkCount: links.length,
        hrefs: links
          .map((a) => a.getAttribute("href"))
          .filter((h) => h && !h.startsWith("javascript:"))
          .sort(),
      };
    };
    return {
      h1: {
        count: document.querySelectorAll("h1").length,
        texts: [...document.querySelectorAll("h1")].map(txt),
      },
      nav: collectLinks("header nav") || collectLinks("nav"),
      footer: collectLinks("footer"),
      title: document.title,
      lang: document.documentElement.lang,
      consoleErrors: errs.consoleErrors.slice(0, 20),
      failedRequests: errs.failedRequests.slice(0, 20),
    };
  }, errors);
}

// ─── StabilityGuard class ──────────────────────────────────────────────────

export class StabilityGuard {
  /**
   * @param {object} opts
   * @param {string} opts.host           e.g. "http://localhost:3030"
   * @param {string} opts.baselineDir    .stability-guard/baseline (PNG + .json signature)
   * @param {string} [opts.configPath]   scripts/stability-guard.config.json
   */
  constructor({ host, baselineDir, configPath }) {
    this.host = host;
    this.baselineDir = baselineDir;
    this.config = loadConfig(configPath);
    this.browser = null;
    this.context = null;
  }

  async init() {
    this.browser = await chromium.launch({ headless: true });
    this.context = await this.browser.newContext({
      deviceScaleFactor: 1,
      reducedMotion: "reduce",
    });
    mkdirSync(this.baselineDir, { recursive: true });
  }

  async close() {
    await this.context?.close().catch(() => {});
    await this.browser?.close().catch(() => {});
    this.browser = null;
    this.context = null;
  }

  _safeKey(target) {
    return `${target.key}-${VIEWPORTS[target.formFactor].width}`.replace(/%/g, "_");
  }

  _paths(target) {
    const base = join(this.baselineDir, this._safeKey(target));
    return {
      png: `${base}.png`,
      sig: `${base}.json`,
      cur: `${base}.current.png`,
      diff: `${base}.diff.png`,
    };
  }

  /**
   * Capture a target deterministically. Returns the in-memory PNG buffer
   * and DOM signature without writing anywhere.
   */
  async capture(target) {
    if (!this.context) throw new Error("StabilityGuard.init() not called");
    target._absUrl = this.host + target.path;
    const masks = masksForTarget(target, this.config);
    const page = await this.context.newPage();
    try {
      const errors = await preparePage(page, target, masks);
      const png = await page.screenshot({ fullPage: true });
      const sig = await domSignature(page, errors);
      return { png, sig };
    } finally {
      await page.close();
    }
  }

  /** Capture and write to baselineDir. Idempotent — overwrites. */
  async writeBaseline(target) {
    const { png, sig } = await this.capture(target);
    const { png: pngPath, sig: sigPath } = this._paths(target);
    writeFileSync(pngPath, png);
    writeFileSync(sigPath, JSON.stringify(sig, null, 2));
    return { pngPath, sigPath, sig };
  }

  /**
   * Compare current capture against the stored baseline.
   * Returns { verdict, reasons, domDiff, pixelDiff }.
   *
   *   verdict === "rollback"  hard fail; caller should revert the fix
   *   verdict === "warn"      pixel drift only; caller keeps fix, logs review
   *   verdict === "ok"        baseline matches
   */
  async verdict(target) {
    const { png: basePngPath, sig: baseSigPath, cur: curPngPath, diff: diffPngPath } = this._paths(target);
    if (!existsSync(basePngPath) || !existsSync(baseSigPath)) {
      return { verdict: "no-baseline", reasons: ["no baseline captured"], target };
    }
    const baseSig = JSON.parse(readFileSync(baseSigPath, "utf-8"));
    const { png: curPng, sig: curSig } = await this.capture(target);
    writeFileSync(curPngPath, curPng);

    const domDiff = compareDom(baseSig, curSig);
    const pixelDiff = await comparePng(basePngPath, curPngPath, diffPngPath);

    const reasons = [...domDiff.reasons];
    let verdict = "ok";
    if (!domDiff.ok) verdict = "rollback";
    else if (pixelDiff.fraction != null && pixelDiff.fraction > this.config.pixelThreshold) {
      verdict = "warn";
      reasons.push(`pixel drift ${(pixelDiff.fraction * 100).toFixed(2)}% > ${(this.config.pixelThreshold * 100).toFixed(2)}%`);
    }
    return { verdict, reasons, domDiff, pixelDiff, target };
  }
}

// ─── DOM diff (the hard gate) ──────────────────────────────────────────────

function compareDom(base, cur) {
  const reasons = [];

  if (base.h1.count !== cur.h1.count) {
    reasons.push(`h1 count changed: ${base.h1.count} → ${cur.h1.count}`);
  }
  // Don't fail on h1 *text* changes — content edits are legitimate. Only
  // structure (count) is load-bearing for accessibility/SEO.

  if (base.nav.linkCount !== cur.nav.linkCount) {
    reasons.push(`nav link count: ${base.nav.linkCount} → ${cur.nav.linkCount}`);
  }
  const navLost = base.nav.hrefs.filter((h) => !cur.nav.hrefs.includes(h));
  if (navLost.length > 0) reasons.push(`nav lost links: ${navLost.slice(0, 3).join(", ")}${navLost.length > 3 ? "…" : ""}`);

  if (base.footer.linkCount !== cur.footer.linkCount) {
    reasons.push(`footer link count: ${base.footer.linkCount} → ${cur.footer.linkCount}`);
  }
  const footerLost = base.footer.hrefs.filter((h) => !cur.footer.hrefs.includes(h));
  if (footerLost.length > 0) reasons.push(`footer lost links: ${footerLost.slice(0, 3).join(", ")}${footerLost.length > 3 ? "…" : ""}`);

  if (base.lang !== cur.lang) reasons.push(`html[lang] changed: ${base.lang} → ${cur.lang}`);

  // Only flag NEW console errors / NEW failed requests — not pre-existing ones.
  const newConsole = cur.consoleErrors.filter((e) => !base.consoleErrors.includes(e));
  if (newConsole.length > 0) reasons.push(`new console errors (${newConsole.length}): ${newConsole[0].slice(0, 80)}`);
  const newFailed = cur.failedRequests.filter((e) => !base.failedRequests.includes(e));
  if (newFailed.length > 0) reasons.push(`new failed requests (${newFailed.length}): ${newFailed[0].slice(0, 80)}`);

  return { ok: reasons.length === 0, reasons };
}

// ─── Pixel diff (the soft gate) ────────────────────────────────────────────

async function comparePng(baselinePath, currentPath, diffPath) {
  try {
    const pixelmatch = require("pixelmatch");
    const { PNG } = require("pngjs");
    const a = PNG.sync.read(readFileSync(baselinePath));
    const b = PNG.sync.read(readFileSync(currentPath));

    if (a.width !== b.width || a.height !== b.height) {
      return {
        fraction: null,
        note: `size mismatch: ${a.width}×${a.height} vs ${b.width}×${b.height}`,
      };
    }
    const diff = new PNG({ width: a.width, height: a.height });
    const numDiff = pixelmatch(a.data, b.data, diff.data, a.width, a.height, {
      threshold: 0.1,
      alpha: 0.1,
      includeAA: false,
    });
    writeFileSync(diffPath, PNG.sync.write(diff));
    return { fraction: numDiff / (a.width * a.height), numDiff, total: a.width * a.height };
  } catch (e) {
    return { fraction: null, note: `pixelmatch unavailable: ${e.message}` };
  }
}

// ─── CLI ───────────────────────────────────────────────────────────────────

function parseArgv(argv) {
  const out = { mode: null, slug: null };
  for (let i = 2; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--baseline") out.mode = "baseline";
    else if (a === "--check") out.mode = "check";
    else if (a === "--print-throttling") {
      out.mode = "print-throttling";
      out.profile = argv[++i];
    } else if (a === "--slug") out.slug = argv[++i];
  }
  return out;
}

async function cliMain() {
  const args = parseArgv(process.argv);
  const PORT = Number(process.env.PORT ?? 3030);
  const HOST = `http://localhost:${PORT}`;
  const BASELINE_DIR = join(ROOT, ".stability-guard", "baseline");
  const CONFIG_PATH = join(ROOT, "scripts", "stability-guard.config.json");

  if (args.mode === "print-throttling") {
    const p = THROTTLING_PROFILES[args.profile];
    if (!p) {
      console.error(`Unknown profile: ${args.profile}. Choose: ${Object.keys(THROTTLING_PROFILES).join(", ")}`);
      process.exit(1);
    }
    console.log(JSON.stringify(p, null, 2));
    return;
  }

  if (!args.mode) {
    console.error("Usage: stability-guard.mjs --baseline | --check | --print-throttling <profile> [--slug <substr>]");
    process.exit(1);
  }

  const targets = enumerateTargets({
    root: ROOT,
    stateDir: join(ROOT, ".lighthouse", "state"),
    onlySlug: args.slug,
    includeConverged: true,
  });
  if (targets.length === 0) {
    console.error(`No targets matched (--slug ${args.slug ?? ""})`);
    process.exit(1);
  }

  const guard = new StabilityGuard({ host: HOST, baselineDir: BASELINE_DIR, configPath: CONFIG_PATH });
  await guard.init();

  let okCount = 0, warnCount = 0, rollbackCount = 0, missingCount = 0, errorCount = 0;
  try {
    for (let i = 0; i < targets.length; i++) {
      const t = targets[i];
      const tag = `[${i + 1}/${targets.length}] ${t.formFactor.padEnd(7)} ${t.locale} ${t.path}`;
      try {
        if (args.mode === "baseline") {
          const r = await guard.writeBaseline(t);
          console.log(`${tag} BASELINED → ${r.pngPath}`);
          okCount++;
        } else {
          const r = await guard.verdict(t);
          if (r.verdict === "ok") { okCount++; console.log(`${tag} OK`); }
          else if (r.verdict === "warn") { warnCount++; console.log(`${tag} WARN  ${r.reasons.join("; ")}`); }
          else if (r.verdict === "rollback") { rollbackCount++; console.log(`${tag} ROLLBACK  ${r.reasons.join("; ")}`); }
          else { missingCount++; console.log(`${tag} ${r.verdict}  ${r.reasons.join("; ")}`); }
        }
      } catch (e) {
        errorCount++;
        console.log(`${tag} ERROR ${e.message}`);
      }
    }
  } finally {
    await guard.close();
  }

  console.log(`──── Stability Guard summary ────`);
  console.log(`mode=${args.mode} ok=${okCount} warn=${warnCount} rollback=${rollbackCount} missing-baseline=${missingCount} error=${errorCount}`);
  process.exit(rollbackCount > 0 ? 1 : 0);
}

if (import.meta.url === `file://${process.argv[1]}`) {
  cliMain().catch((err) => {
    console.error(`[stability-guard] FATAL: ${err.stack ?? err.message}`);
    process.exit(1);
  });
}
