#!/usr/bin/env node
/**
 * Lighthouse Optimization Suite — entry point.
 *
 * Phase 1 (this file): --once mode only. Build, serve, audit the full
 * matrix in parallel, persist state, write summary CSV. No fixes yet.
 *
 *   node scripts/lighthouse-suite.mjs --once
 *
 * Future phases will add: stability-guard, deterministic fixers, LLM
 * subagents, global-fix planner, multi-iteration convergence loop.
 *
 * Env:
 *   PORT             default 3030 (avoid colliding with `next dev` on 3000)
 *   WORKERS          default 4
 *   AUDIT_LIMIT      cap the queue size for smoke runs
 *   ONLY_LOCALE      "en" | "he"
 *   ONLY_SLUG        substring filter
 *   ONLY_FORM_FACTOR "mobile" | "desktop"
 *   SKIP_BUILD       "1" to skip `next build` (assume .next exists)
 *   INCLUDE_CONVERGED "1" to re-audit pages already at ≥92 (default: skip)
 *   LH_DEBUG_BASE_PORT default 9222 (each worker uses BASE+i)
 *
 *   LIVE_URL         e.g. "https://triolla.io" — audit production instead of localhost.
 *                    When set: skips `next build` + `next start`, writes to
 *                    .lighthouse/state-live/ + .lighthouse/lhr-live/ +
 *                    summary-live.csv so live data never mixes with localhost.
 */

import { spawn, spawnSync } from "node:child_process";
import { mkdirSync, writeFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import { setTimeout as sleep } from "node:timers/promises";
import http from "node:http";
import { enumerateTargets, enumerateFullMatrix } from "./lib/enumerate-targets.mjs";
import { ensureStateDir, loadAll, summarize, countByStatus, BLOCKING_CATEGORIES, PASS_THRESHOLD } from "./lib/state.mjs";
import { runPool } from "./lib/worker-pool.mjs";

const ROOT = process.cwd();
const PORT = Number(process.env.PORT ?? 3030);
const AUDIT_LIMIT = process.env.AUDIT_LIMIT ? Number(process.env.AUDIT_LIMIT) : undefined;
const ONLY_LOCALE = process.env.ONLY_LOCALE || undefined;
const ONLY_SLUG = process.env.ONLY_SLUG || undefined;
const ONLY_FORM_FACTOR = process.env.ONLY_FORM_FACTOR || undefined;
const SKIP_BUILD = process.env.SKIP_BUILD === "1";
const INCLUDE_CONVERGED = process.env.INCLUDE_CONVERGED === "1";
const ONCE = process.argv.includes("--once");

// Live mode: audit production instead of localhost. Quarantine the output
// dirs so live + local scores never collide.
const LIVE_URL = process.env.LIVE_URL?.replace(/\/+$/, "") || null;
const LIVE_MODE = !!LIVE_URL;
const HOST = LIVE_URL ?? `http://localhost:${PORT}`;

// Live mode: default to 3 workers to avoid triggering Vercel rate-limiting.
// Local: 4 workers is safe (no external rate limiter).
// Override either default with WORKERS=N.
const WORKERS = Number(process.env.WORKERS ?? (LIVE_MODE ? 3 : 4));

const OUT_DIR = join(ROOT, ".lighthouse");
const STATE_DIR = join(OUT_DIR, LIVE_MODE ? "state-live" : "state");
const LHR_DIR = join(OUT_DIR, LIVE_MODE ? "lhr-live" : "lhr");
const SUMMARY_FILE = join(OUT_DIR, LIVE_MODE ? "summary-live.csv" : "summary.csv");

function log(msg) {
  console.log(`[suite ${new Date().toISOString().slice(11, 19)}] ${msg}`);
}

// ─── Build + serve (mirrors seo-loop.mjs, kept inline to avoid coupling) ───

function buildOnce() {
  if (SKIP_BUILD && existsSync(join(ROOT, ".next/BUILD_ID"))) {
    log(`SKIP_BUILD=1 and .next/BUILD_ID exists — skipping build`);
    return;
  }
  log(`Running next build…`);
  const r = spawnSync("npm", ["run", "build"], { stdio: "inherit", cwd: ROOT });
  if (r.status !== 0) throw new Error(`npm run build failed (exit ${r.status})`);
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

async function pingOnce(url, timeoutMs = 5000) {
  const ctl = new AbortController();
  const t = setTimeout(() => ctl.abort(), timeoutMs);
  try {
    const res = await fetch(url, { method: "GET", signal: ctl.signal, redirect: "follow" });
    return res.status < 500 ? res.status : null;
  } catch {
    return null;
  } finally {
    clearTimeout(t);
  }
}

async function waitFor200(url, timeoutMs) {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    const status = await pingOnce(url, 2000);
    if (status) return status;
    await sleep(500);
  }
  throw new Error(`server did not respond at ${url} within ${timeoutMs}ms`);
}

async function startServer() {
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

// ─── Reporting ─────────────────────────────────────────────────────────────

function writeSummaryCsv(stateMap, outFile) {
  const rows = ["slug,locale,formFactor,path,performance,seo,accessibility,best-practices,status,iterations,retries,lastAuditAt"];
  const sorted = Object.values(stateMap).sort((a, b) => {
    const pa = a.scores?.performance ?? -1;
    const pb = b.scores?.performance ?? -1;
    return pa - pb; // worst-first so the head of the file is the work queue
  });
  for (const e of sorted) {
    const s = e.scores ?? {};
    rows.push([
      e.slug,
      e.locale,
      e.formFactor,
      e.path,
      s.performance ?? "",
      s.seo ?? "",
      s.accessibility ?? "",
      s["best-practices"] ?? "",
      e.status,
      e.iterations ?? 0,
      e.retries ?? 0,
      e.lastAuditAt ?? "",
    ].join(","));
  }
  writeFileSync(outFile, rows.join("\n"));
}

// ─── Main ──────────────────────────────────────────────────────────────────

async function main() {
  ensureStateDir(STATE_DIR);
  mkdirSync(LHR_DIR, { recursive: true });

  if (LIVE_MODE) log(`LIVE MODE — auditing ${LIVE_URL} (state → ${STATE_DIR})`);

  const total = enumerateFullMatrix({ root: ROOT, onlyLocale: ONLY_LOCALE, onlyFormFactor: ONLY_FORM_FACTOR });
  const counts = countByStatus({
    root: ROOT,
    stateDir: STATE_DIR,
    onlyLocale: ONLY_LOCALE,
    onlyFormFactor: ONLY_FORM_FACTOR,
  });
  const targets = enumerateTargets({
    root: ROOT,
    stateDir: STATE_DIR,
    onlyLocale: ONLY_LOCALE,
    onlySlug: ONLY_SLUG,
    onlyFormFactor: ONLY_FORM_FACTOR,
    includeConverged: INCLUDE_CONVERGED,
    limit: AUDIT_LIMIT,
  });

  // Eligible-before-limit = total minus what we'd skip due to status (only
  // converged pages are skipped when INCLUDE_CONVERGED is false).
  const eligibleBeforeLimit = INCLUDE_CONVERGED ? total : total - counts.converged;
  const trimmedByLimit = Math.max(0, eligibleBeforeLimit - targets.length);
  const filterTag = `locale=${ONLY_LOCALE ?? "all"}, ff=${ONLY_FORM_FACTOR ?? "all"}` + (ONLY_SLUG ? `, slug~"${ONLY_SLUG}"` : "");

  log(`Matrix: ${total} total targets (${filterTag})`);
  log(`  prior state: converged=${counts.converged} audited=${counts.audited} failed=${counts.failed} pending=${counts.pending}`);
  if (!INCLUDE_CONVERGED && counts.converged > 0) {
    log(`  skipped (already converged): ${counts.converged}  [INCLUDE_CONVERGED=1 to re-audit]`);
  }
  if (trimmedByLimit > 0) {
    log(`  trimmed by AUDIT_LIMIT=${AUDIT_LIMIT}: ${trimmedByLimit}`);
  }
  log(`  → auditing: ${targets.length} with ${WORKERS} workers`);

  if (targets.length === 0) {
    log(`Nothing to do. Use INCLUDE_CONVERGED=1 to re-audit converged pages.`);
    return;
  }

  let server = null;
  try {
    if (LIVE_MODE) {
      log(`Verifying ${LIVE_URL} is reachable…`);
      const status = await pingOnce(LIVE_URL + "/", 8000);
      if (!status) throw new Error(`could not reach ${LIVE_URL} — check network/DNS`);
      log(`  ${LIVE_URL}/ → HTTP ${status}. Proceeding without local server.`);
    } else {
      if (!SKIP_BUILD || !existsSync(join(ROOT, ".next/BUILD_ID"))) buildOnce();
      server = await startServer();
    }

    const t0 = Date.now();
    await runPool({
      targets,
      total,
      host: HOST,
      workers: WORKERS,
      lhrDir: LHR_DIR,
      stateDir: STATE_DIR,
      log,
    });

    const finalState = loadAll(STATE_DIR);
    const summary = summarize(finalState);
    writeSummaryCsv(finalState, SUMMARY_FILE);

    const elapsed = ((Date.now() - t0) / 1000).toFixed(1);
    log(`──────── Run complete in ${elapsed}s ${LIVE_MODE ? `(LIVE: ${LIVE_URL})` : "(local)"} ────────`);
    log(`State: total=${summary.total} converged=${summary.converged ?? 0} audited=${summary.audited ?? 0} failed=${summary.failed ?? 0}`);
    log(`Convergence threshold: every category ≥ ${PASS_THRESHOLD} (${BLOCKING_CATEGORIES.join(", ")})`);
    log(`Summary CSV:      ${SUMMARY_FILE}`);
    log(`Per-target state: ${STATE_DIR}/*.json`);
    log(`Raw LHR JSON:     ${LHR_DIR}/*.json`);
  } finally {
    if (server) server.kill();
  }
}

if (!ONCE) {
  console.error("Phase 1 only supports --once. Re-run with: node scripts/lighthouse-suite.mjs --once");
  process.exit(1);
}

main().catch((err) => {
  console.error(`[suite] FATAL: ${err.stack ?? err.message}`);
  process.exit(1);
});
