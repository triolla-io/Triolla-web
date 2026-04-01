#!/usr/bin/env node
/**
 * Guardrails for Triolla snapshot *-deps.json. Run after editing deps or adding pages:
 *   npm run validate:snapshot-deps
 *
 * Catches regressions that caused silent runtime failures:
 * - all.js uses gsap on DOM ready → gsap (+ ScrollTrigger) must load before all.js
 * - WP i18n bundle expects wp.hooks → hooks.min.js before any i18n.min.js
 * - Shared fonts.css must use absolute /assets/_consolidated/ or /assets/_triolla-fonts/ (relative URLs 404 per-page)
 * - Portfolio template (page-template-page-portfolio) must include full theme CSS chain
 *   (style.min + cms-navigation + mlstyle, etc.) — same list as b2b / gaming; missing mlstyle breaks the header nav.
 */

const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..");
const APP = path.join(ROOT, "app");
const PUBLIC_ASSETS = path.join(ROOT, "public", "assets");
const SHARED_FONTS_CSS = path.join(
  PUBLIC_ASSETS,
  "_shared",
  "fonts.css_edabec9e.css",
);

const ALL_JS = new Set(["all.js_edabec9e.js", "all.js_edabec9e_bc9f3932.js", "all.js"]);

/** WordPress portfolio landing template — shared Triolla header/menu CSS must all load. */
const PORTFOLIO_BODY_RE = /page-template-page-portfolio/;

/** Each pattern must match exactly one entry in `css` (hashed WP names ok, e.g. …_50264762.css). */
const PORTFOLIO_CSS_LTR_RES = [
  /^style\.min\.css_edabec9e/,
  /^svgs-attachment/,
  /^style\.min\.css_68b3cde9/,
  /^cms-navigation-base\.css_7976b2e5/,
  /^cms-navigation\.css_7976b2e5/,
  /^style\.css_edabec9e/,
  /^style-new\.css_edabec9e/,
  /^responsive\.css_edabec9e/,
  /^fonts\.css_edabec9e/,
  /^animate\.css_edabec9e/,
  /^animation\.css_edabec9e/,
  /^jquery\.jConveyorTicker\.min\.css_edabec9e/,
  /^owl\.carousel\.css_edabec9e/,
  /^mlstyle\.css_edabec9e/,
  /^ml-responsive\.css_edabec9e/,
  /^gdpr-main-nf\.css_d6ea100c/,
];

const PORTFOLIO_CSS_RTL_RES = [
  /^style-rtl\.min\.css_edabec9e/,
  /^svgs-attachment/,
  /^style\.min\.css_68b3cde9/,
  /^cms-navigation-base\.css_7976b2e5/,
  /^cms-navigation\.css_7976b2e5/,
  /^style-he\.css_edabec9e/,
  /^style-new-he\.css_edabec9e/,
  /^responsive-he\.css_edabec9e/,
  /^fonts\.css_edabec9e/,
  /^animate\.css_edabec9e/,
  /^animation\.css_edabec9e/,
  /^jquery\.jConveyorTicker\.min\.css_edabec9e/,
  /^owl\.carousel\.css_edabec9e/,
  /^mlstyle\.css_edabec9e/,
  /^rtl\.css_edabec9e/,
  /^ml-responsive\.css_edabec9e/,
  /^gdpr-main-nf\.css_d6ea100c/,
];

const RE_MLSTYLE = /^mlstyle\.css_edabec9e/;
const RE_MLRESP = /^ml-responsive\.css_edabec9e/;

function walkDepsFiles(dir, acc = []) {
  for (const name of fs.readdirSync(dir)) {
    const full = path.join(dir, name);
    const st = fs.statSync(full);
    if (st.isDirectory()) walkDepsFiles(full, acc);
    else if (name.endsWith("-deps.json")) acc.push(full);
  }
  return acc;
}

function isAllJs(file) {
  return ALL_JS.has(file);
}

function isGsapFile(file) {
  return /^gsap\.min/.test(file);
}

function isScrollTriggerFile(file) {
  return /^ScrollTrigger\.min/.test(file);
}

function isI18nFile(file) {
  return /^i18n\.min\.js/.test(file);
}

function isHooksFile(file) {
  return /^hooks\.min\.js/.test(file);
}

function hasScrollTriggerBefore(js, idx) {
  return js.slice(0, idx).some(isScrollTriggerFile);
}

function hasHooksBefore(js, idx) {
  return js.slice(0, idx).some(isHooksFile);
}

function assetDirForDeps(assetBase) {
  if (typeof assetBase !== "string" || !assetBase.startsWith("/assets/")) {
    return null;
  }
  return path.join(PUBLIC_ASSETS, assetBase.replace(/^\/assets\//, "").replace(/\/$/, ""));
}

function main() {
  const errors = [];

  const files = walkDepsFiles(APP);
  for (const fp of files) {
    let data;
    try {
      data = JSON.parse(fs.readFileSync(fp, "utf8"));
    } catch (e) {
      errors.push(`${path.relative(ROOT, fp)}: invalid JSON (${e.message})`);
      continue;
    }
    const js = data.js;
    if (!Array.isArray(js)) continue;

    const allIdx = js.findIndex(isAllJs);
    if (allIdx !== -1) {
      const before = js.slice(0, allIdx);
      if (!before.some(isGsapFile)) {
        errors.push(
          `${path.relative(ROOT, fp)}: load a gsap.min*.js entry before ${js[allIdx]} (all.js expects global gsap).`,
        );
      }
      if (!hasScrollTriggerBefore(js, allIdx)) {
        errors.push(
          `${path.relative(ROOT, fp)}: load ScrollTrigger.min*.js before ${js[allIdx]}.`,
        );
      }

      const dir = assetDirForDeps(data.assetBase);
      if (dir && fs.existsSync(dir)) {
        const gsapName = before.find(isGsapFile);
        if (gsapName && !fs.existsSync(path.join(dir, gsapName))) {
          errors.push(
            `${path.relative(ROOT, fp)}: missing file public/assets/.../${gsapName} (referenced in js).`,
          );
        }
        const stName = before.find(isScrollTriggerFile);
        if (stName && !fs.existsSync(path.join(dir, stName))) {
          errors.push(
            `${path.relative(ROOT, fp)}: missing ${stName} under ${path.relative(ROOT, dir)}.`,
          );
        }
      }
    }

    for (let i = 0; i < js.length; i++) {
      if (!isI18nFile(js[i])) continue;
      if (!hasHooksBefore(js, i)) {
        errors.push(
          `${path.relative(ROOT, fp)}: load hooks.min.js* before ${js[i]} (i18n needs wp.hooks).`,
        );
      }
    }

    const bodyClass = typeof data.bodyClass === "string" ? data.bodyClass : "";
    if (PORTFOLIO_BODY_RE.test(bodyClass) && Array.isArray(data.css)) {
      const css = data.css;
      const rtl = /\brtl\b/.test(bodyClass);
      const patterns = rtl ? PORTFOLIO_CSS_RTL_RES : PORTFOLIO_CSS_LTR_RES;
      const rel = path.relative(ROOT, fp);
      for (const re of patterns) {
        if (!css.some((f) => re.test(f))) {
          errors.push(
            `${rel}: portfolio template missing css matching ${re} (compare app/b2b/b2b-deps.json; include style.min + cms-navigation + mlstyle chain).`,
          );
        }
      }
      const mi = css.findIndex((f) => RE_MLSTYLE.test(f));
      const mr = css.findIndex((f) => RE_MLRESP.test(f));
      if (mi !== -1 && mr !== -1 && mi > mr) {
        errors.push(
          `${rel}: portfolio css must list mlstyle.css_edabec9e* before ml-responsive.css_edabec9e* (menu/header layout).`,
        );
      }
      const dir = assetDirForDeps(data.assetBase);
      if (dir && fs.existsSync(dir)) {
        for (const re of patterns) {
          const fname = css.find((f) => re.test(f));
          if (!fname) continue;
          const p = path.join(dir, fname);
          if (!fs.existsSync(p)) {
            errors.push(
              `${rel}: missing file ${path.relative(ROOT, p)} (symlink from _shared/ or copy from another portfolio snapshot).`,
            );
          }
        }
      }
    }
  }

  if (fs.existsSync(SHARED_FONTS_CSS)) {
    const css = fs.readFileSync(SHARED_FONTS_CSS, "utf8");
    const badRel = [];
    const re = /url\(\s*'([^']*)'\s*\)/g;
    let m;
    while ((m = re.exec(css)) !== null) {
      const u = m[1];
      if (u.startsWith("/") || u.startsWith("data:") || u.startsWith("http://") || u.startsWith("https://")) {
        continue;
      }
      badRel.push(u.slice(0, 60));
    }
    if (badRel.length) {
      errors.push(
        `_shared/fonts.css_edabec9e.css: use absolute /assets/_consolidated/… or /assets/_triolla-fonts/… URLs (found ${badRel.length} relative url(s), e.g. ${badRel[0]}…).`,
      );
    }
    const hasFontsBundle =
      css.includes("/assets/_triolla-fonts/") || css.includes("/assets/_consolidated/");
    if (!hasFontsBundle) {
      errors.push(
        "_shared/fonts.css_edabec9e.css: expected /assets/_consolidated/ or /assets/_triolla-fonts/ paths for shared font bundle.",
      );
    }
  } else {
    errors.push("Missing _shared/fonts.css_edabec9e.css (font guard check skipped file).");
  }

  if (errors.length) {
    console.error("validate-snapshot-deps: FAILED\n");
    for (const e of errors) console.error(`  • ${e}`);
    console.error("\nFix order in *-deps.json or restore shared fonts.css. See web/AGENTS.md (Snapshot deps invariants).");
    process.exit(1);
  }
  console.log(`validate-snapshot-deps: OK (${files.length} deps files checked).`);
}

main();
