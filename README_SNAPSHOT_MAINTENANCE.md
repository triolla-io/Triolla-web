# Triolla snapshot & assets — maintenance guide

This document is the **operational README** for keeping the Next.js app (`web/`) healthy after downloads, extractions, or agent edits. All commands below are run from the **`web/`** directory unless noted.

---

## 1. Where things live

| Location | Role |
|----------|------|
| `web/app/**/ *-deps.json` | Lists CSS/JS filenames loaded per route (order matters). |
| `web/public/assets/<slug>/` | Static assets for that page (JS, CSS, images, fonts). |
| `web/public/assets/_shared/` | Canonical copies of duplicated theme CSS (symlink targets). |
| `web/public/assets/_triolla-fonts/` | Shared webfont files; `fonts.css` points here with absolute URLs. |
| `web/public/fragments/*-body.html` | HTML injected into the page (no full `<head>` scripts). |
| `landing-page/<slug>/` | Raw saved HTML + `_assets/` — **not** the live app; used to re-run extraction. |

**Live site:** users hit Next.js only. Do not ship `landing-page/*.html` as production pages.

---

## 2. NPM scripts (run from `web/`)

| Command | Purpose |
|---------|---------|
| `npm run dev` | Local dev server. |
| `npm run verify` | **TypeScript check** + **snapshot deps validator** — run before PRs / after editing deps. |
| `npm run validate:snapshot-deps` | Only the deps/font CSS checks (also runs automatically before `npm run build`). |
| `npm run build` | Validates deps, then `next build`. |
| `npm run dedupe:css` | Symlink byte-identical CSS under `public/assets/` into `_shared/` (run after rsync/sync adds CSS). |
| `npm run report:css-dedup` | Regenerates `pipeline/css_dedup_report.json` (real CSS file count + symlink count). |
| `npm run sync:about` / `sync:technology` / … | Regenerate fragment + deps from `landing-page/` (see `package.json` for full list). |

---

## 3. `*-deps.json` rules (common regressions)

The validator enforces these. If it fails, fix the listed JSON file.

### 3.1 `gsap is not defined` (e.g. in `all.js`)

Theme **`all.js`** runs **`gsap`** on `document.ready`.

**Rule:** For every `js` array that includes **`all.js`**, **`all.js_edabec9e.js`**, or **`all.js_edabec9e_bc9f3932.js`**:

1. List **`gsap.min*.js`** (hashed names like `gsap.min_4a57399e.js` are fine) **before** `all.js`.
2. List **`ScrollTrigger.min*.js`** **before** `all.js`.
3. Those files must exist under `public/assets/<same folder as assetBase>/`.

If a folder is missing GSAP, copy `gsap.min.js` and `ScrollTrigger.min.js` from `web/public/assets/services/` (or another complete page).

### 3.2 `Cannot read properties of undefined (reading 'defaultHooks')` in `i18n.min.js`

WordPress **`i18n.min.js`** expects **`wp.hooks`**, which is created by **`hooks.min.js*`** (`hooks.min.js_4fddbd9c.js` or hashed variant).

**Rule:** Every **`i18n.min.js*`** entry must appear **after** **`hooks.min.js*`** in the same `js` array.

If `hooks.min.js*` is missing from the asset folder, copy it from `web/public/assets/services/` into that page’s `public/assets/<slug>/`.

### 3.3 Portfolio pages (`page-template-page-portfolio`) — full theme `css` list

If `bodyClass` includes **`page-template-page-portfolio`**, **`npm run validate:snapshot-deps`** requires the same **CSS chain** as other portfolio landings (e.g. `b2b`): base **`style.min`**, **`cms-navigation`**, **`mlstyle`** (before **`ml-responsive`**), etc. Filenames may include WP content hashes (`…_50264762.css`); the check uses **prefix regexes**.

Omitting **`mlstyle`** (or **`style.min`**) unstyles the **header / mega menu** — the failure mode that hit `saas-platforms`. After batch convert, run **`validate:snapshot-deps`** before merge.

### 3.4 Font 404s (`SFProText-*.woff2` under `/assets/<slug>/`)

Shared **`web/public/assets/_shared/fonts.css_edabec9e.css`** must use **only** absolute URLs:

`url('/assets/_triolla-fonts/YourFont.woff2')`

Do **not** use relative `url('SFProText-….woff2')` there — the browser resolves them per page folder and causes mass 404s.

---

## 4. CSS duplication

- **Already applied:** Most theme CSS under `public/assets/` is a **symlink** to `public/assets/_shared/` (~80MB saved vs duplicate files).
- **After adding new snapshots:** run **`npm run dedupe:css`** so new identical CSS files become symlinks.
- **Report:** **`npm run report:css-dedup`** updates `pipeline/css_dedup_report.json` (expect **0** duplicate groups among real files when healthy; symlink count is shown separately).

---

## 5. Scroll / “missing” content (opacity 0)

Triolla CSS often uses **`opacity: 0`** until a parent gets **`.show`**, and **`body.loaded`** for **`.enter-y`** animations.

- **Implementation:** `web/app/technology/technologyReveal.ts` (IntersectionObserver targets) and `web/app/lib/mountTriollaSnapshotRevealStack.ts` (adds `loaded` on `body` when the snapshot reveal arms — because the real `window` `load` event already fired before async scripts).
- **Service detail pages:** selectors like **`.artbold`**, **`.artnormtext`**, **`.post_featureimg`** must be observed so article copy becomes visible.
- **Main services page:** **`.servicemid`**, **`.servbranding`**, **`.servdevloptop`**, **`.servdevbotrgt`** (see `technologyReveal.ts`).

If a new template uses the same pattern, extend **`SHOW_SELECTORS`** or add a page-specific mount.

---

## 6. Related docs

| Doc | Content |
|-----|---------|
| `web/AGENTS.md` | AI/human rules for snapshot routes (overlaps with this file). |
| `README_PIPELINE.md` | Download / batch conversion pipeline from sitemap. |
| `.claude/skills/triolla-html-to-react/SKILL.md` | Deep conversion notes (fragments, scripts, CSS paths). |
| `PAGE_STATUS.md` | Route inventory (if present in repo). |

---

## 7. Quick checklist after syncing a new page

1. `rsync` or extract assets into `web/public/assets/<slug>/`.
2. Fragment + deps updated (`sync:*` script or manual).
3. `cd web && npm run verify`
4. `npm run dedupe:css`
5. `npm run dev` — check browser console for GSAP / i18n / font errors.

---

## 8. Full site coverage (triolla.io)

To refresh `pipeline/urls.json` from the live sitemap **without** wiping `status` (and other fields) for URLs you already track:

1. **Repo root:** `python3 pipeline/discover_merge.py triolla.io` — use `--dry-run` to print counts only; `--no-orphans` to omit manifest rows whose URL no longer appears on the sitemap. New sitemap URLs are added as `pending`.
2. **Download** snapshots for new `pending` rows (see [README_PIPELINE.md](README_PIPELINE.md) for batch download and workers).
3. **Convert:** `python3 pipeline/batch_convert.py` (or the per-page flow in that doc).
4. **`cd web && npm run fix:snapshot-deps-order && npm run verify`**
5. **`npm run dedupe:css`**

The merge tool dedupes by normalized URL (trailing slash). If the old manifest listed the same URL more than once, the written manifest will have fewer rows than before.

**Blog:** `web/app/blog/[slug]/page.tsx` picks up posts automatically from `web/app/blog-<slug>/` when `blog-<slug>-deps.json` is present — no manual slug array.

---

*Last aligned with repo scripts in `web/package.json` and `web/scripts/validate-snapshot-deps.js`.*
