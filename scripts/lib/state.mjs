/**
 * State persistence for the Lighthouse suite.
 *
 * One file per target at .lighthouse/state/<safeKey>.json.
 * Filenames must be filesystem-safe — registry slugs include URL-encoded
 * Hebrew (e.g. "triolla-io-he-%d7%aa...") so % is replaced with _.
 *
 * State shape:
 *   {
 *     key, slug, locale, formFactor, path,
 *     status: "pending" | "audited" | "fixing" | "converged" | "failed",
 *     scores: { performance, seo, accessibility, "best-practices" } | null,
 *     lastAuditAt: ISO-8601 string,
 *     iterations: number,
 *     incompatibleFixers: [fixerId, ...],   // fixers proven to break this page
 *     lastError: string | null,
 *   }
 */

import { mkdirSync, readdirSync, readFileSync, writeFileSync, existsSync, renameSync } from "node:fs";
import { join } from "node:path";

export const PASS_THRESHOLD = 0.90;
export const BLOCKING_CATEGORIES = ["performance", "seo", "accessibility", "best-practices"];

export function targetKey(t) {
  return `${t.slug}-${t.locale}-${t.formFactor}`;
}

function safeFilename(key) {
  // % is legal on POSIX but trips some shells/tools; underscore is safer.
  return key.replace(/%/g, "_") + ".json";
}

export function ensureStateDir(stateDir) {
  mkdirSync(stateDir, { recursive: true });
}

export function loadOne(stateDir, key) {
  const file = join(stateDir, safeFilename(key));
  if (!existsSync(file)) return null;
  try {
    return JSON.parse(readFileSync(file, "utf-8"));
  } catch {
    return null;
  }
}

export function loadAll(stateDir) {
  if (!existsSync(stateDir)) return {};
  const out = {};
  for (const f of readdirSync(stateDir)) {
    if (!f.endsWith(".json")) continue;
    try {
      const entry = JSON.parse(readFileSync(join(stateDir, f), "utf-8"));
      if (entry?.key) out[entry.key] = entry;
    } catch {
      // ignore corrupt files; next persist will overwrite.
    }
  }
  return out;
}

export function persist(stateDir, key, patch) {
  ensureStateDir(stateDir);
  const file = join(stateDir, safeFilename(key));
  const tmp = file + ".tmp";
  const prev = loadOne(stateDir, key) ?? {};
  const next = { ...prev, ...patch, key, updatedAt: new Date().toISOString() };
  writeFileSync(tmp, JSON.stringify(next, null, 2));
  renameSync(tmp, file); // atomic on POSIX
  return next;
}

export function recordAudit(stateDir, target, scores, error = null, retries = 0) {
  const blocking = scores
    ? BLOCKING_CATEGORIES.every((c) => scores[c] != null && scores[c] >= PASS_THRESHOLD)
    : false;
  const prev = loadOne(stateDir, targetKey(target)) ?? {};
  return persist(stateDir, targetKey(target), {
    slug: target.slug,
    locale: target.locale,
    formFactor: target.formFactor,
    path: target.path,
    status: error ? "failed" : blocking ? "converged" : "audited",
    scores: scores ?? null,
    lastAuditAt: new Date().toISOString(),
    iterations: (prev.iterations ?? 0) + 1,
    retries: (prev.retries ?? 0) + retries,
    incompatibleFixers: prev.incompatibleFixers ?? [],
    lastError: error ?? null,
  });
}

export function isConverged(stateEntry) {
  return stateEntry?.status === "converged";
}

export function summarize(stateMap) {
  const totals = { total: 0, converged: 0, audited: 0, failed: 0, pending: 0 };
  for (const v of Object.values(stateMap)) {
    totals.total++;
    totals[v.status] = (totals[v.status] ?? 0) + 1;
  }
  return totals;
}

/**
 * Count the full matrix (with locale/formFactor filters) bucketed by the
 * persisted state status. Pages with no state file are bucketed as "pending".
 *
 * Returns: { total, converged, audited, failed, pending }
 *
 * Used for accurate run-summary logging that distinguishes "skipped because
 * already converged" from "trimmed by AUDIT_LIMIT".
 */
export function countByStatus({ root, stateDir, onlyLocale, onlyFormFactor }) {
  // Inline matrix walk to avoid coupling state.mjs to enumerate-targets.mjs.
  const reg = JSON.parse(readFileSync(join(root, "lib", "snapshotRegistry.json"), "utf-8"));
  const formFactors = onlyFormFactor ? [onlyFormFactor] : ["mobile", "desktop"];
  const stateMap = loadAll(stateDir);

  const totals = { total: 0, converged: 0, audited: 0, failed: 0, pending: 0 };
  for (const e of reg) {
    if (onlyLocale && e.locale !== onlyLocale) continue;
    if (!e.path) continue;
    for (const ff of formFactors) {
      totals.total++;
      const key = `${e.slug}-${e.locale}-${ff}`;
      const status = stateMap[key]?.status ?? "pending";
      totals[status] = (totals[status] ?? 0) + 1;
    }
  }
  return totals;
}
