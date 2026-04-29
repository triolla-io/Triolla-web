/**
 * Target enumeration for the Lighthouse suite.
 *
 * Produces the cartesian product of registry entries × form factors,
 * with optional filters and resume-aware skipping of already-converged
 * pages.
 *
 * Every registry entry has a `path` field, so we don't need to recover
 * the public URL from the slug like seo-loop.mjs does.
 */

import { readFileSync } from "node:fs";
import { join } from "node:path";
import { isConverged, loadAll, targetKey } from "./state.mjs";
import { activeThrottlingProfile } from "../stability-guard.mjs";

export const FORM_FACTORS = ["mobile", "desktop"];

export const VIEWPORTS = {
  mobile: { width: 375, height: 667 },
  desktop: { width: 1440, height: 900 },
};

function loadRegistry(root) {
  return JSON.parse(readFileSync(join(root, "lib", "snapshotRegistry.json"), "utf-8"));
}

/**
 * @param {object} opts
 * @param {string} opts.root             - Project root (where lib/snapshotRegistry.json lives).
 * @param {string} opts.stateDir         - .lighthouse/state directory.
 * @param {string} [opts.onlyLocale]     - "en" | "he"
 * @param {string} [opts.onlySlug]       - substring match against slug
 * @param {string} [opts.onlyFormFactor] - "mobile" | "desktop"
 * @param {boolean} [opts.includeConverged=false] - if true, don't skip already-passing targets
 * @param {number} [opts.limit]
 * @returns {Array<{slug, locale, formFactor, path, key, viewport, throttling}>}
 */
export function enumerateTargets({
  root,
  stateDir,
  onlyLocale,
  onlySlug,
  onlyFormFactor,
  includeConverged = false,
  limit,
}) {
  const reg = loadRegistry(root);
  const state = loadAll(stateDir);
  const profile = activeThrottlingProfile();

  const formFactors = onlyFormFactor ? [onlyFormFactor] : FORM_FACTORS;

  const all = [];
  for (const entry of reg) {
    if (onlyLocale && entry.locale !== onlyLocale) continue;
    if (onlySlug && !entry.slug.includes(onlySlug)) continue;
    if (!entry.path) continue; // defensive — every entry should have one

    for (const ff of formFactors) {
      const t = {
        slug: entry.slug,
        locale: entry.locale,
        formFactor: ff,
        path: entry.path,
        viewport: VIEWPORTS[ff],
        throttling: profile[ff],
        throttlingMethod: profile.method,
        throttlingProfile: profile.name,
      };
      t.key = targetKey(t);
      if (!includeConverged && isConverged(state[t.key])) continue;
      all.push(t);
    }
  }

  return typeof limit === "number" ? all.slice(0, limit) : all;
}

/**
 * Enumerate the full matrix without state filtering — used for the
 * "total expected" denominator in progress reporting.
 */
export function enumerateFullMatrix({ root, onlyLocale, onlyFormFactor }) {
  const reg = loadRegistry(root);
  const formFactors = onlyFormFactor ? [onlyFormFactor] : FORM_FACTORS;
  let count = 0;
  for (const entry of reg) {
    if (onlyLocale && entry.locale !== onlyLocale) continue;
    if (!entry.path) continue;
    count += formFactors.length;
  }
  return count;
}
