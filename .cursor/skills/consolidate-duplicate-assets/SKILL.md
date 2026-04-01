---
name: consolidate-duplicate-assets
description: Finds identical static assets duplicated under web/public/assets (and optionally mirrored in landing-page/_assets), moves one canonical copy to web/public/assets/_shared, and updates references only inside the Next web app (fragments, public CSS, TS/TSX)—not landing-page HTML. Use when deduplicating theme SVGs (e.g. footerphmob.svg), shared icons, or many copies of the same file; when the user asks for generic shared assets without editing snapshot HTML.
---

# Consolidate duplicate static assets (Triolla / html-to-react)

## Goal

Replace many per-page copies of the **same bytes** with **one file** under `web/public/assets/_shared/` and point all runtime references at `/assets/_shared/<filename>`.

This repo already dedupes **CSS** the same way via symlinks (`web/scripts/dedupe-public-css.js`, `npm run dedupe:css`). For **SVGs, images, fonts**, follow the workflow below when you need **one canonical URL** (not only symlink dedupe).

## When to use

- Same basename appears in many `landing-page/*/_assets/` or `web/public/assets/<page-key>/` folders.
- User wants a **generic shared asset** and **updated links** (not just deleting unused files).

## When not to use

- Files differ (even slightly): keep separate paths or use distinct names.

## Scope: Next.js `web/` only

Do **not** edit `landing-page/**` (`index.html`, `_manifest.json`, `_assets`) for this workflow unless the user explicitly asks. Duplicates may remain under `landing-page/` as offline mirrors; the app is corrected via `web/` only.

## Step 1: Prove identity (required)

Never merge on filename alone.

1. Collect candidates: `rg --files -g 'footerphmob*.svg' web/public/assets landing-page` (adjust pattern).
2. Compare hashes: `shasum -a 256 <paths>` — **all hashes must match** for a safe merge.

If hashes differ but markup is equivalent, pick one source and normalize before consolidating.

## Step 2: Choose canonical location

- **Default:** `web/public/assets/_shared/<basename>`  
  Example: `web/public/assets/_shared/footerphmob.svg`
- **Basename collision** (two different files, same name): use a stable subdirectory, e.g. `web/public/assets/_shared/theme/footerphmob.svg`, or a descriptive name (`footerphmob-phone.svg`).

Ensure the canonical file exists as a **regular file** (not only a symlink target from the CSS script) if nothing is there yet—copy from any verified-identical source.

## Step 3: Update references (inside `web/` only)

Search and replace until nothing under `web/` still points at per-page copies:

1. **`web/public/fragments/*-body.html`** — e.g. `src="/assets/<page-key>/foo.svg"` → `src="/assets/_shared/foo.svg"`; fix `url(...)` in inline styles the same way when they reference the old path.
2. **CSS under `web/public/assets/**`** — adjust `url(...)` if it referenced a duplicate under a page-specific folder; prefer absolute `/assets/_shared/...` or a correct relative path into `_shared` (verify in browser).
3. **Next.js app code — `web/app/**/*.tsx`, `web/app/**/*.ts`, etc.** — string literals, `next/image` `src`, or imports that reference `public/` paths still using the old per-page asset location.

Run `rg 'foo\.svg|/assets/[^/]+/foo'` with `web/` as the search root (or path-restricted) until clean. Ignore matches under `landing-page/` for this workflow.

## Step 4: Remove duplicate copies under `web/public/assets` (optional)

After references point at `_shared/`, delete **identical** copies from `web/public/assets/<page-key>/` only if grep confirms nothing in `web/` still references them. Leave `landing-page/**` copies in place unless the user asked to touch snapshots.

## Step 5: Verify

```bash
cd web && npm run build
```

Fix any `validate-snapshot-deps` or missing-file errors by restoring a required asset or updating the dep manifest for that page.

## Related

- CSS symlink dedupe: `web/scripts/dedupe-public-css.js`, `npm run dedupe:css`
- CSS hash report: `node web/scripts/report-css-dedup.js`
- Bilingual page registry (not asset dedupe): `.claude/skills/triolla-duplication-registry/SKILL.md`

## Checklist

- [ ] SHA256 (or equivalent) match for all merged files
- [ ] Canonical file in `web/public/assets/_shared/` (or agreed subpath)
- [ ] All references under `web/` updated (fragments, CSS, TS/TSX); no stale per-page `public/assets/...` paths for that asset
- [ ] `cd web && npm run build` passes
