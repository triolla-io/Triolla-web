#!/usr/bin/env node
/**
 * SEO + LLM-readiness optimizer loop.
 *
 *   node scripts/seo-loop.mjs --once         Audit pass, no fixes (baseline).
 *   node scripts/seo-loop.mjs                Full loop: audit → fix via subagent → rebuild → repeat.
 *
 * Env:
 *   LOOP_MAX        Max iterations (default 10).
 *   PASS_THRESHOLD  Min score to count as "passing" (default 0.95).
 *   AUDIT_LIMIT     Cap pages per pass (default: all). Useful for smoke runs.
 *   PORT            Port for `next start` (default 3000).
 *   ONLY_LOCALE     Restrict to a locale ("en" or "he").
 *   ONLY_SLUG       Restrict to one slug (substring match).
 *   SKIP_BUILD      "1" to skip `next build` (assume .next exists).
 *   AGENT_CMD       Command to invoke the subagent (default: "claude --print").
 *
 * Audits are written to .lighthouse/<iteration>/<slug>-<locale>.json plus a
 * CSV summary. Only SEO + Accessibility + Best-Practices block convergence;
 * Performance is collected and reported separately in performance-suggestions.md.
 */

import { spawn, spawnSync } from "node:child_process";
import { mkdirSync, writeFileSync, existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { setTimeout as sleep } from "node:timers/promises";
import http from "node:http";

const ROOT = process.cwd();
// Default to 3030 (not 3000) so we never collide with `npm run dev` running locally.
const PORT = Number(process.env.PORT ?? 3030);
const HOST = `http://localhost:${PORT}`;
const LOOP_MAX = Number(process.env.LOOP_MAX ?? 10);
const PASS = Number(process.env.PASS_THRESHOLD ?? 0.95);
const PARALLEL = Number(process.env.PARALLEL ?? 4);
const AUDIT_LIMIT = process.env.AUDIT_LIMIT ? Number(process.env.AUDIT_LIMIT) : null;
const ONLY_LOCALE = process.env.ONLY_LOCALE ?? null;
const ONLY_SLUG = process.env.ONLY_SLUG ?? null;
const SKIP_BUILD = process.env.SKIP_BUILD === "1";
const AGENT_CMD = process.env.AGENT_CMD ?? "claude --print";
const ONCE = process.argv.includes("--once");
const OUT_DIR = join(ROOT, ".lighthouse");

const BLOCKING_CATEGORIES = ["seo", "accessibility", "best-practices"];
const ALL_CATEGORIES = [...BLOCKING_CATEGORIES, "performance"];

// ─── URL enumeration ────────────────────────────────────────────────────────

function loadRegistry() {
  return JSON.parse(readFileSync(join(ROOT, "lib", "snapshotRegistry.json"), "utf-8"));
}

function getDomainPrefix(registry) {
  if (registry.length < 2) return "";
  let prefix = registry[0].slug;
  for (const entry of registry) {
    while (prefix && !entry.slug.startsWith(prefix)) {
      const trimmed = prefix.endsWith("-") ? prefix.slice(0, -1) : prefix;
      const dash = trimmed.lastIndexOf("-");
      prefix = dash === -1 ? "" : trimmed.slice(0, dash + 1);
    }
    if (!prefix) break;
  }
  return prefix.endsWith("-") ? prefix : "";
}

function entryUrl(entry, defaultLocale, domainPrefix) {
  // HE entries carry an explicit `path`. For EN entries strip the domain
  // prefix from the slug to recover the public path used by app routes.
  if (entry.path) return entry.path;
  const localPart = domainPrefix && entry.slug.startsWith(domainPrefix)
    ? entry.slug.slice(domainPrefix.length)
    : entry.slug;
  if (entry.locale === defaultLocale) {
    return localPart === "home" || localPart === "" ? "/" : `/${localPart}`;
  }
  return `/${entry.locale}/${localPart}`;
}

function enumerateTargets() {
  const reg = loadRegistry();
  const defaultLocale =
    reg.find((e) => e.locale === "en")?.locale ?? reg[0]?.locale ?? "en";
  const prefix = getDomainPrefix(reg);
  let targets = reg.map((e) => ({
    slug: e.slug,
    locale: e.locale,
    path: entryUrl(e, defaultLocale, prefix),
  }));
  if (ONLY_LOCALE) targets = targets.filter((t) => t.locale === ONLY_LOCALE);
  if (ONLY_SLUG) targets = targets.filter((t) => t.slug.includes(ONLY_SLUG));
  if (AUDIT_LIMIT) targets = targets.slice(0, AUDIT_LIMIT);
  return targets;
}

// ─── Build + serve ──────────────────────────────────────────────────────────

function buildOnce() {
  if (SKIP_BUILD && existsSync(join(ROOT, ".next/BUILD_ID"))) {
    log(`SKIP_BUILD=1 and .next/BUILD_ID exists — skipping build`);
    return;
  }
  log(`Running next build…`);
  const r = spawnSync("npm", ["run", "build"], { stdio: "inherit", cwd: ROOT });
  if (r.status !== 0) throw new Error(`npm run build failed (exit ${r.status})`);
}

async function startServer() {
  // Pre-flight: refuse to start if the port is already taken (e.g. user's `npm run dev`).
  // Otherwise Lighthouse silently audits whatever's there and gives misleading scores.
  if (await isPortInUse(PORT)) {
    throw new Error(
      `port ${PORT} is already in use. Stop the other process or set PORT=<n>.`,
    );
  }
  log(`Starting next start on :${PORT}…`);
  const child = spawn("npx", ["next", "start", "--port", String(PORT)], {
    cwd: ROOT,
    stdio: ["ignore", "pipe", "pipe"],
    env: { ...process.env, NODE_ENV: "production" },
  });
  child.stdout.on("data", (d) => process.stdout.write(`[next] ${d}`));
  child.stderr.on("data", (d) => process.stderr.write(`[next] ${d}`));
  await waitFor200(HOST + "/", 60_000);
  return child;
}

function isPortInUse(port) {
  return new Promise((resolve) => {
    const req = http.get(`http://localhost:${port}/`, (res) => {
      res.resume();
      resolve(true);
    });
    req.on("error", () => resolve(false));
    req.setTimeout(500, () => {
      req.destroy();
      resolve(false);
    });
  });
}

async function waitFor200(url, timeoutMs) {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    const ok = await new Promise((resolve) => {
      const req = http.get(url, (res) => {
        res.resume();
        resolve(res.statusCode && res.statusCode < 500);
      });
      req.on("error", () => resolve(false));
      req.setTimeout(2000, () => {
        req.destroy();
        resolve(false);
      });
    });
    if (ok) return;
    await sleep(500);
  }
  throw new Error(`server did not respond at ${url} within ${timeoutMs}ms`);
}

// ─── Lighthouse driver ──────────────────────────────────────────────────────
//
// One Chrome instance per run, pages audited sequentially through it.
// Running multiple Chrome instances in the same Node process causes
// "performance mark has not been set" errors because Lighthouse uses
// global performance.mark() and the instances stomp on each other.

async function auditPage(url, port, lighthouse) {
  const result = await lighthouse(
    url,
    {
      port,
      output: "json",
      logLevel: "error",
      onlyCategories: ALL_CATEGORIES,
    },
    {
      extends: "lighthouse:default",
      settings: {
        formFactor: "mobile",
        throttlingMethod: "simulate",
      },
    },
  );
  return result.lhr;
}

async function runPool(targets, lighthouse, chromeLauncher, iter) {
  const results = [];
  const iterDir = join(OUT_DIR, String(iter));
  mkdirSync(iterDir, { recursive: true });

  const chrome = await chromeLauncher.launch({
    chromeFlags: ["--headless=new", "--no-sandbox", "--disable-gpu"],
  });
  log(`Chrome launched on port ${chrome.port}`);

  try {
    let i = 0;
    for (const t of targets) {
      const url = HOST + t.path;
      const start = Date.now();
      i++;
      try {
        const lhr = await auditPage(url, chrome.port, lighthouse);
        const file = join(iterDir, `${t.slug}-${t.locale}.json`);
        writeFileSync(file, JSON.stringify(lhr));
        const scores = Object.fromEntries(
          ALL_CATEGORIES.map((c) => [c, lhr.categories?.[c]?.score ?? null]),
        );
        results.push({ ...t, url, scores, lhrPath: file });
        log(
          `[${i}/${targets.length}] ${t.slug}/${t.locale} seo=${fmt(scores.seo)} a11y=${fmt(scores.accessibility)} bp=${fmt(scores["best-practices"])} perf=${fmt(scores.performance)} (${Date.now() - start}ms)`,
        );
      } catch (e) {
        log(`[${i}/${targets.length}] ERROR ${t.slug}/${t.locale}: ${e.message}`);
        results.push({ ...t, url, scores: null, error: e.message });
      }
    }
  } finally {
    await chrome.kill();
  }

  return results;
}

function fmt(s) {
  return s == null ? "—" : Math.round(s * 100).toString().padStart(3);
}

// ─── Reporting ──────────────────────────────────────────────────────────────

function writeSummary(results, iter) {
  const csv = [
    "slug,locale,path,seo,a11y,best-practices,performance,blocking_pass",
    ...results.map((r) => {
      const s = r.scores ?? {};
      const blocking = BLOCKING_CATEGORIES.every(
        (c) => s[c] != null && s[c] >= PASS,
      );
      return [
        r.slug,
        r.locale,
        r.path,
        fmt(s.seo).trim(),
        fmt(s.accessibility).trim(),
        fmt(s["best-practices"]).trim(),
        fmt(s.performance).trim(),
        blocking ? "yes" : "no",
      ].join(",");
    }),
  ].join("\n");
  writeFileSync(join(OUT_DIR, `summary-${iter}.csv`), csv);
}

function writePerformanceReport(results) {
  const rows = results
    .filter((r) => r.scores?.performance != null)
    .sort((a, b) => a.scores.performance - b.scores.performance)
    .slice(0, 30)
    .map((r) => {
      const lhr = JSON.parse(readFileSync(r.lhrPath, "utf-8"));
      const lcp = lhr.audits?.["largest-contentful-paint"]?.displayValue ?? "—";
      const cls = lhr.audits?.["cumulative-layout-shift"]?.displayValue ?? "—";
      const tbt = lhr.audits?.["total-blocking-time"]?.displayValue ?? "—";
      return `| ${r.slug}/${r.locale} | ${fmt(r.scores.performance).trim()} | ${lcp} | ${cls} | ${tbt} |`;
    });
  const md = [
    "# Performance suggestions (report-only)",
    "",
    "Snapshot pages preserve the original WordPress CSS/JS load order — strict-parity",
    "rules forbid reordering or lazy-loading scripts. The 30 lowest-scoring pages:",
    "",
    "| Page | Perf | LCP | CLS | TBT |",
    "|---|---|---|---|---|",
    ...rows,
    "",
    "To address: the only path that doesn't break parity is image-level work",
    "(decoding=async on `<img>`, fetchpriority hints, font preloads). CSS/JS",
    "consolidation would require abandoning the snapshot model.",
  ].join("\n");
  writeFileSync(join(OUT_DIR, "performance-suggestions.md"), md);
}

// ─── Failing-audit distillation ─────────────────────────────────────────────

function distillFailing(result) {
  if (!result.lhrPath) return null;
  const lhr = JSON.parse(readFileSync(result.lhrPath, "utf-8"));
  const failing = [];
  for (const cat of BLOCKING_CATEGORIES) {
    const refs = lhr.categories?.[cat]?.auditRefs ?? [];
    for (const ref of refs) {
      const a = lhr.audits?.[ref.id];
      if (!a) continue;
      // score === null  → not applicable (skip)
      // score === 1     → passing
      if (a.score === null || a.score === 1) continue;
      failing.push({
        id: ref.id,
        score: a.score,
        title: a.title,
        description: a.description,
        details: a.details ? trimDetails(a.details) : undefined,
      });
    }
  }
  return {
    url: result.url,
    slug: result.slug,
    locale: result.locale,
    scores: result.scores,
    failing,
  };
}

function trimDetails(d) {
  // Lighthouse details can be huge — keep just selector/url/snippet for items.
  if (!d?.items) return undefined;
  return {
    items: d.items.slice(0, 20).map((i) => ({
      selector: i.node?.selector ?? i.selector,
      snippet: i.node?.snippet ?? i.snippet,
      url: i.url,
      explanation: i.node?.explanation,
    })),
  };
}

// ─── Subagent invocation ────────────────────────────────────────────────────

function invokeAgent(input) {
  const inputJson = JSON.stringify(input);
  // Run sync, single page at a time — registry edits cannot interleave.
  const [cmd, ...rest] = AGENT_CMD.split(/\s+/);
  const args = [
    ...rest,
    "--agent",
    "seo-optimizer",
    `Apply SEO fixes for one page. Input on stdin.`,
  ];
  log(`[agent] ${input.slug}/${input.locale} (${input.failing.length} audits)`);
  const r = spawnSync(cmd, args, {
    cwd: ROOT,
    input: inputJson,
    stdio: ["pipe", "pipe", "inherit"],
    encoding: "utf-8",
  });
  if (r.status !== 0) {
    log(`[agent] non-zero exit ${r.status} for ${input.slug}/${input.locale}`);
  }
  if (r.stdout) process.stdout.write(r.stdout);
}

// ─── Main ───────────────────────────────────────────────────────────────────

function log(msg) {
  console.log(`[seo-loop ${new Date().toISOString().slice(11, 19)}] ${msg}`);
}

async function main() {
  mkdirSync(OUT_DIR, { recursive: true });
  const targets = enumerateTargets();
  log(`Enumerated ${targets.length} targets (en+he, AUDIT_LIMIT=${AUDIT_LIMIT ?? "none"})`);

  const lighthouse = (await import("lighthouse")).default;
  const chromeLauncher = await import("chrome-launcher");

  let server = null;
  try {
    if (!SKIP_BUILD || !existsSync(join(ROOT, ".next/BUILD_ID"))) buildOnce();
    server = await startServer();

    for (let iter = 0; iter < (ONCE ? 1 : LOOP_MAX); iter++) {
      log(`──────── iteration ${iter} ────────`);
      const results = await runPool(targets, lighthouse, chromeLauncher, iter);
      writeSummary(results, iter);
      writePerformanceReport(results);

      const failing = results.filter((r) => {
        if (!r.scores) return true; // errored runs count as failing, not passing
        return BLOCKING_CATEGORIES.some(
          (c) => r.scores[c] == null || r.scores[c] < PASS,
        );
      });

      log(
        `iteration ${iter}: ${results.length - failing.length}/${results.length} passing (seo+a11y+bp ≥ ${PASS}); ${failing.length} need fixes`,
      );

      if (ONCE) {
        log(`--once mode: stopping after baseline audit. See .lighthouse/summary-${iter}.csv`);
        return;
      }
      if (failing.length === 0) {
        log(`All pages passing — converged at iteration ${iter}.`);
        return;
      }

      // Hand each failing page to the subagent serially (registry edits must serialize).
      for (const r of failing) {
        const input = distillFailing(r);
        if (!input || input.failing.length === 0) continue;
        invokeAgent(input);
      }

      // Edits applied — rebuild before re-auditing.
      log(`Iteration ${iter} fixes applied — rebuilding…`);
      server.kill();
      buildOnce();
      server = await startServer();
    }

    log(`Hit LOOP_MAX=${LOOP_MAX} without full convergence. See .lighthouse/summary-*.csv`);
  } finally {
    if (server) server.kill();
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
