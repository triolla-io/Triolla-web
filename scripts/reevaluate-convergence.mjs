#!/usr/bin/env node
/**
 * reevaluate-convergence.mjs
 *
 * Re-checks every state file in .lighthouse/state-live/ against the current
 * PASS_THRESHOLD (defined in scripts/lib/state.mjs) and flips status from
 * "audited" → "converged" for any target whose previous scores already meet
 * the new bar. Avoids re-running Lighthouse on pages that simply changed
 * threshold side without changing scores.
 *
 * Idempotent — safe to re-run.
 *
 * Usage:
 *   node scripts/reevaluate-convergence.mjs
 *   node scripts/reevaluate-convergence.mjs --dry-run
 */

import { readFileSync, writeFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { PASS_THRESHOLD, BLOCKING_CATEGORIES } from "./lib/state.mjs";

const ROOT = process.cwd();
const STATE_DIR = join(ROOT, ".lighthouse", "state-live");
const DRY_RUN = process.argv.includes("--dry-run");

console.log(`[reeval] PASS_THRESHOLD=${PASS_THRESHOLD} (${PASS_THRESHOLD * 100}%)`);

const files = readdirSync(STATE_DIR).filter((f) => f.endsWith(".json"));
let promoted = 0;
let demoted = 0;
let unchanged = 0;
let stillFailing = 0;

const failingPages = [];

for (const f of files) {
  const path = join(STATE_DIR, f);
  const s = JSON.parse(readFileSync(path, "utf-8"));
  if (!s.scores) {
    unchanged++;
    continue;
  }

  const meetsThreshold = BLOCKING_CATEGORIES.every(
    (c) => s.scores[c] != null && s.scores[c] >= PASS_THRESHOLD,
  );

  const prev = s.status;
  if (meetsThreshold && prev !== "converged") {
    s.status = "converged";
    if (!DRY_RUN) writeFileSync(path, JSON.stringify(s, null, 2));
    promoted++;
  } else if (!meetsThreshold && prev === "converged") {
    s.status = "audited";
    if (!DRY_RUN) writeFileSync(path, JSON.stringify(s, null, 2));
    demoted++;
  } else {
    unchanged++;
  }

  if (!meetsThreshold) {
    stillFailing++;
    const failingCats = BLOCKING_CATEGORIES.filter(
      (c) => s.scores[c] == null || s.scores[c] < PASS_THRESHOLD,
    )
      .map((c) => `${c.slice(0, 4)}=${Math.round((s.scores[c] ?? 0) * 100)}`)
      .join(" ");
    failingPages.push(
      `  ${s.formFactor.padEnd(7)} ${s.locale} ${s.path}  [${failingCats}]`,
    );
  }
}

console.log(
  `[reeval] ${promoted} promoted to converged, ${demoted} demoted, ` +
    `${unchanged} unchanged, ${stillFailing} still failing`,
);

if (failingPages.length > 0) {
  console.log(`\n[reeval] Failing pages (${failingPages.length}):`);
  for (const p of failingPages.slice(0, 50)) console.log(p);
  if (failingPages.length > 50) {
    console.log(`  …and ${failingPages.length - 50} more`);
  }
}

if (DRY_RUN) console.log("\n[reeval] DRY RUN — no files written.");
