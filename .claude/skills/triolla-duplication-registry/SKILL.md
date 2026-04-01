---
name: triolla-duplication-registry
description: Maintains Triolla bilingual snapshot deduplication in html-to-react web app. Covers bilingualSnapshotRegistry.ts, BilingualSnapshotByRegistryKey, heSnapshotPathsFromDeps, defineRedirectLangPage, LANG_REDIRECT_PAGE_COPY, and TriollaLangProps. Use when adding or changing bilingual marketing pages, Hebrew snapshot paths, or [lang] redirect routes; after edits run cd web && npm run build.
---

# Triolla duplication registry (web app)

## Bilingual marketing snapshots

1. **Single source of truth:** `web/app/lib/bilingualSnapshotRegistry.ts` — imports EN/HE `*-deps.json`, sets `fragmentUrlEn`, `pageLabel`, `landingSlugEn`, `assetDirEn`, and either fixed Hebrew fields or `hePathsFromDeps: true` (uses `heSnapshotPathsFromDeps(depsHe)` for fragment URL, asset dir, landing slug).
2. **Client wrappers:** Each `*Client.tsx` should only render `<BilingualSnapshotByRegistryKey pageKey="…" lang={lang} />` with `TriollaLangProps` from `web/app/lib/triollaLangProps.ts`.
3. **Adding a page:** Add registry entry (correct JSON paths under `web/app/<route>/`), add thin `*Client.tsx`, wire `page.tsx` / `[lang]/…/page.tsx` as needed.

## `[lang]` redirect + metadata

1. **Factory:** `web/app/lib/defineRedirectLangPage.tsx` — `en` → `redirect(canonicalPath)`, `he` → `<Client lang="he" />`.
2. **Copy:** `web/app/lib/langRedirectPageCopy.ts` — keep EN/HE `title` / `description` in sync with top-level route `metadata` where applicable.
3. **Page file pattern:** Import client + `defineRedirectLangPage` + `LANG_REDIRECT_PAGE_COPY[path]`, `export const generateMetadata = pageDef.generateMetadata`, `export default pageDef.Page`.

## Hebrew blog

- Shared helpers: `loadHeBlogDeps`, `hebrewBlogFragmentExists` in `web/app/lib/blogPostRegistry.ts`.

## Verification

After changes: `cd web && npm run build` (runs `validate-snapshot-deps.js` + `next build`).
