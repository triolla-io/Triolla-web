#!/usr/bin/env node
/**
 * Lighthouse audit worker — one OS process per worker.
 *
 * Spawned by worker-pool.mjs via child_process.fork. Owns exactly one
 * Chrome instance for its lifetime. Listens for IPC messages and replies
 * with audit results.
 *
 * Why a separate process: lighthouse uses the global `performance.mark()`
 * API, so running multiple Lighthouse instances in the same Node process
 * corrupts each other's measurements. Process isolation is mandatory.
 *
 * Argv:
 *   process.argv[2] = chrome remote-debugging-port (assigned by pool)
 *   process.argv[3] = target host (e.g. "http://localhost:3030")
 *   process.argv[4] = lhr output dir (absolute path)
 *
 * IPC protocol:
 *   parent -> { id, type: "audit", target }
 *   child  -> { id, type: "result", scores, lhrPath, durationMs, error? }
 *   parent -> { id, type: "shutdown" }
 *   child  -> { id, type: "bye" } then exits 0
 *
 * `id` is an opaque correlation token chosen by the parent.
 */

import { writeFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";
import { setTimeout as sleep } from "node:timers/promises";

const PORT = Number(process.argv[2]);
const HOST = process.argv[3];
const LHR_DIR = process.argv[4];
const WORKER_ID = process.pid;

if (!PORT || !HOST || !LHR_DIR) {
  console.error(`[worker ${WORKER_ID}] missing argv: port=${PORT} host=${HOST} lhrDir=${LHR_DIR}`);
  process.exit(2);
}

mkdirSync(LHR_DIR, { recursive: true });

function log(msg) {
  console.log(`[worker ${WORKER_ID}:${PORT}] ${msg}`);
}

let chrome = null;
let lighthouse = null;

async function startup() {
  const chromeLauncher = await import("chrome-launcher");
  lighthouse = (await import("lighthouse")).default;
  chrome = await chromeLauncher.launch({
    port: PORT,
    chromeFlags: [
      "--headless=new",
      "--no-sandbox",
      "--disable-gpu",
      "--disable-dev-shm-usage",
    ],
  });
  log(`Chrome launched on debug port ${chrome.port}`);
  // Confirm to parent we're ready.
  process.send?.({ type: "ready", port: chrome.port, pid: WORKER_ID });
}

function safeFilename(key) {
  return key.replace(/%/g, "_");
}

async function runLighthouse(target) {
  const url = HOST + target.path;

  const flags = {
    port: chrome.port,
    output: "json",
    logLevel: "error",
    onlyCategories: ["performance", "seo", "accessibility", "best-practices"],
    ...(process.env.VERCEL_AUTOMATION_BYPASS_SECRET && {
      extraHeaders: { "x-vercel-protection-bypass": process.env.VERCEL_AUTOMATION_BYPASS_SECRET },
    }),
  };

  // Lighthouse needs explicit form-factor + screen emulation + throttling
  // when switching off the default mobile preset. Desktop config disables
  // mobile emulation and uses LAN-equivalent throttling (matches PSI desktop).
  const isMobile = target.formFactor === "mobile";
  const config = {
    extends: "lighthouse:default",
    settings: {
      formFactor: target.formFactor,
      throttlingMethod: target.throttlingMethod ?? "simulate",
      throttling: target.throttling,
      // Give Lighthouse enough headroom under heavy CPU/network throttling
      // to collect FCP before timing out. Defaults (~10s FCP / 45s load) are
      // too tight for simulate-throttled mobile pages on a local server.
      maxWaitForFcp: 30_000,
      maxWaitForLoad: 60_000,
      pauseAfterNetworkQuietMs: 3_000,
      pauseAfterFCPMs: 1_000,
      screenEmulation: {
        mobile: isMobile,
        width: target.viewport.width,
        height: target.viewport.height,
        deviceScaleFactor: isMobile ? 2 : 1,
        disabled: false,
      },
      emulatedUserAgent: isMobile
        ? "Mozilla/5.0 (Linux; Android 11; moto g power (2022)) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36"
        : "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    },
  };

  const result = await lighthouse(url, flags, config);
  const lhr = result.lhr;

  const scores = {
    performance: lhr.categories?.performance?.score ?? null,
    seo: lhr.categories?.seo?.score ?? null,
    accessibility: lhr.categories?.accessibility?.score ?? null,
    "best-practices": lhr.categories?.["best-practices"]?.score ?? null,
  };

  return {
    scores,
    lhr,
    runtimeError: lhr.runtimeError ?? null,
    finalUrl: lhr.finalDisplayedUrl ?? lhr.finalUrl,
  };
}

// Retry policy:
//   - ERRORED_DOCUMENT_REQUEST (Vercel rate-limit / 429): sleep 8s then retry.
//   - Any other null Performance score (PROTOCOL_TIMEOUT, metric blip): retry immediately.
//   - SEO/Accessibility/BP scores are merged across attempts so a perf failure
//     never silently discards already-collected non-perf scores.
async function audit(target) {
  const start = Date.now();
  let attempt = await runLighthouse(target);
  let retries = 0;
  let retryReason = null;

  const isDocError = attempt.runtimeError?.code === "ERRORED_DOCUMENT_REQUEST";
  const isPerfNull = attempt.scores.performance == null;

  if (isDocError || isPerfNull) {
    if (isDocError) {
      retryReason = "ERRORED_DOCUMENT_REQUEST (rate-limit/5xx) — sleeping 8s";
      log(`${retryReason} for ${target.path}`);
      await sleep(8_000);
    } else {
      const fcpErr = attempt.lhr?.audits?.["first-contentful-paint"]?.errorMessage ?? "";
      retryReason = fcpErr.includes("PROTOCOL_TIMEOUT")
        ? "PROTOCOL_TIMEOUT on FCP"
        : `runtimeError: ${attempt.runtimeError?.code ?? "null perf score"}`;
    }

    retries = 1;
    const retry = await runLighthouse(target);

    // Merge: prefer retry scores, but rescue attempt-1 non-perf scores if the
    // retry also lost them (e.g. the server was still recovering).
    const merged = { ...retry.scores };
    for (const cat of ["seo", "accessibility", "best-practices"]) {
      if (merged[cat] == null && attempt.scores[cat] != null) {
        merged[cat] = attempt.scores[cat];
      }
    }
    attempt = { ...retry, scores: merged };
  }

  const lhrPath = join(LHR_DIR, `${safeFilename(target.key)}.json`);
  writeFileSync(lhrPath, JSON.stringify(attempt.lhr));

  return {
    scores: attempt.scores,
    lhrPath,
    durationMs: Date.now() - start,
    runtimeError: attempt.runtimeError,
    finalUrl: attempt.finalUrl,
    retries,
    retryReason,
  };
}

process.on("message", async (msg) => {
  if (!msg || typeof msg !== "object") return;
  if (msg.type === "audit") {
    try {
      const out = await audit(msg.target);
      process.send({ id: msg.id, type: "result", target: msg.target, ...out });
    } catch (err) {
      process.send({
        id: msg.id,
        type: "result",
        target: msg.target,
        scores: null,
        lhrPath: null,
        durationMs: 0,
        error: err?.message ?? String(err),
      });
    }
  } else if (msg.type === "shutdown") {
    try {
      await chrome?.kill();
    } catch {}
    process.send({ id: msg.id, type: "bye" });
    process.exit(0);
  }
});

async function shutdownHandler() {
  try {
    await chrome?.kill();
  } catch {}
  process.exit(0);
}
process.on("SIGTERM", shutdownHandler);
process.on("SIGINT", shutdownHandler);

startup().catch((err) => {
  console.error(`[worker ${WORKER_ID}] startup failed: ${err.message}`);
  process.exit(3);
});
