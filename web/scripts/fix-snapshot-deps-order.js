#!/usr/bin/env node
/**
 * Re-apply script-order fixes after pipeline extract overwrites *-deps.json:
 * - Insert gsap + ScrollTrigger before all.js (and before jquery.bez when present)
 * - Copy gsap/ScrollTrigger/hooks from web/public/assets/services when missing
 * - Insert hooks.min.js before i18n.min.js when i18n is present without hooks
 *
 * Run: npm run fix:snapshot-deps-order
 * Then: npm run validate:snapshot-deps
 */

const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..");
const APP = path.join(ROOT, "app");
const PUBLIC_ASSETS = path.join(ROOT, "public", "assets");
const SERVICES = path.join(PUBLIC_ASSETS, "services");

const ALL_JS = new Set(["all.js_edabec9e.js", "all.js_edabec9e_bc9f3932.js", "all.js"]);
const BEZ = "jquery.bez.min.js_edabec9e.js";
const GSAP_FALLBACK = "gsap.min.js";
const GSAP_ALT = "gsap.min_4a57399e.js";
const SCROLL = "ScrollTrigger.min.js";
const HOOKS = "hooks.min.js_4fddbd9c.js";

function walkDepsFiles(dir, acc = []) {
  for (const name of fs.readdirSync(dir)) {
    const full = path.join(dir, name);
    const st = fs.statSync(full);
    if (st.isDirectory()) walkDepsFiles(full, acc);
    else if (name.endsWith("-deps.json")) acc.push(full);
  }
  return acc;
}

function assetDirForDeps(assetBase) {
  if (typeof assetBase !== "string" || !assetBase.startsWith("/assets/")) {
    return null;
  }
  return path.join(PUBLIC_ASSETS, assetBase.replace(/^\/assets\//, "").replace(/\/$/, ""));
}

function isAllJs(file) {
  return ALL_JS.has(file);
}

function hasGsapBefore(js, idx) {
  return js.slice(0, idx).some((f) => /^gsap\.min/.test(f));
}

function hasHooksBefore(js, idx) {
  return js.slice(0, idx).some((f) => /^hooks\.min\.js/.test(f));
}

function ensureFile(destDir, name, srcPath) {
  const dest = path.join(destDir, name);
  if (fs.existsSync(dest) || !fs.existsSync(srcPath)) return fs.existsSync(dest);
  try {
    fs.copyFileSync(srcPath, dest);
    return true;
  } catch {
    return false;
  }
}

function main() {
  let nGsap = 0;
  let nHooks = 0;

  for (const fp of walkDepsFiles(APP)) {
    let data;
    try {
      data = JSON.parse(fs.readFileSync(fp, "utf8"));
    } catch {
      continue;
    }
    if (!Array.isArray(data.js)) continue;
    const js = data.js;

    const allIdx = js.findIndex(isAllJs);
    if (allIdx !== -1 && !hasGsapBefore(js, allIdx)) {
      const pub = assetDirForDeps(data.assetBase);
      if (!pub) continue;

      let gsapFile = GSAP_FALLBACK;
      if (!fs.existsSync(path.join(pub, gsapFile)) && fs.existsSync(path.join(pub, GSAP_ALT))) {
        gsapFile = GSAP_ALT;
      }
      ensureFile(pub, GSAP_FALLBACK, path.join(SERVICES, GSAP_FALLBACK));
      if (!fs.existsSync(path.join(pub, gsapFile)) && fs.existsSync(path.join(pub, GSAP_FALLBACK))) {
        gsapFile = GSAP_FALLBACK;
      }
      ensureFile(pub, SCROLL, path.join(SERVICES, SCROLL));

      const bezIdx = js.indexOf(BEZ);
      const insertAt = bezIdx !== -1 && bezIdx < allIdx ? bezIdx : allIdx;
      if (fs.existsSync(path.join(pub, gsapFile))) {
        js.splice(insertAt, 0, gsapFile);
        if (fs.existsSync(path.join(pub, SCROLL)) && !js.includes(SCROLL)) {
          js.splice(insertAt + 1, 0, SCROLL);
        }
        nGsap++;
      }
    }

    for (let i = 0; i < js.length; i++) {
      if (!/^i18n\.min\.js/.test(js[i])) continue;
      if (hasHooksBefore(js, i)) continue;
      const pub = assetDirForDeps(data.assetBase);
      if (!pub) continue;
      ensureFile(pub, HOOKS, path.join(SERVICES, HOOKS));
      if (fs.existsSync(path.join(pub, HOOKS))) {
        js.splice(i, 0, HOOKS);
        nHooks++;
        i++;
      }
    }

    fs.writeFileSync(fp, JSON.stringify(data, null, 2) + "\n");
  }

  console.log(
    `fix-snapshot-deps-order: patched gsap+ScrollTrigger blocks: ${nGsap}, hooks before i18n: ${nHooks}`,
  );
}

main();
