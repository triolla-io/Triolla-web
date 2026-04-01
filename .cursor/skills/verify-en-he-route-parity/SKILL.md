---
name: verify-en-he-route-parity
description: Verifies English marketing routes under localhost have matching Hebrew URLs (e.g. /services ↔ /he/services). Covers this Next.js app’s split routing (app/[lang] vs app/he/blog), middleware exceptions, blog snapshot fallbacks, and optional route-list automation. Use when auditing i18n coverage, adding pages, or when the user asks for EN/HE parity, Hebrew versions of pages, or /he/* equivalents.
---

# Verify English ↔ Hebrew route parity (Triolla Next.js)

## How this app exposes Hebrew

Two patterns coexist; both use the **`/he/...`** URL prefix for users.

| Pattern | Location in repo | Example URL |
|--------|-------------------|-------------|
| **Dynamic `[lang]`** | `web/app/[lang]/**` | `/he/services`, `/he/technology`, `/he/about-us` |
| **Literal `he` segment** | `web/app/he/**` (currently blog only) | `/he/blog`, `/he/blog/[slug]` |

English “top-level” marketing routes live under `web/app/<segment>/page.tsx` (e.g. `services/page.tsx` → `/services`). Their Hebrew counterparts are usually the **same path under** `web/app/[lang]/` (e.g. `[lang]/services/page.tsx` with `lang=he`).

**Do not assume** every English file has a sibling under `app/he/`; most Hebrew pages are under **`app/[lang]/`**, not `app/he/`.

## Parity checklist (manual)

1. **Pick an English path** (e.g. `/services`, `/contact-us`, `/blog/the-fintech-ux-playbook`).
2. **Expected Hebrew URL**: prepend **`/he`** → `/he/services`, `/he/contact-us`, `/he/blog/...`.
3. **Confirm a `page.tsx` exists** that serves that path:
   - For `/he/services`: `web/app/[lang]/services/page.tsx` (and `[lang]` must be `he`).
   - For `/he/blog`: `web/app/he/blog/page.tsx` (blog is special).
4. **Run locally**: `GET http://localhost:3000<path>` → expect **200** (not 404). Snapshot pages may show a loading phase then content.
5. **Content locale**: Hebrew snapshots use RTL fragments and `dir="rtl"` via theme HTML; English-only pages may **redirect** from `/he/...` (see exceptions below). **`/he/service-detail`** returns 200 with Hebrew `<title>`/description but the injected snapshot may still be English until a Hebrew fragment exists (like blog English fallback).

## Documented exceptions (do not flag as bugs)

Read `web/middleware.ts` for authoritative redirects:

- **`/he/portfolio-page`**, **`/he/dashboard-design`** → redirect to English-only URLs (no Hebrew WP URL).
- **`/en` / `/en/*`** → stripped to `/` or `/*` (legacy).
- **`/he/services-<slug>`** → **`/he/services/<slug>`** (legacy flat URL).
- **Hebrew blog slug** → canonical **English slug** under `/he/blog/<english-slug>` when listed in `web/app/lib/heBlogSlugAliases.ts`.

## Blog-specific rules

- **Index**: `/blog` ↔ `/he/blog` (separate implementations; both must exist).
- **Posts**: `/blog/[slug]` ↔ `/he/blog/[slug]` with the **same English `slug`**.
- **Hebrew body**: if `web/app/he/he-blog-<slug>/` + `public/fragments/he-blog-<slug>-he-body.html` exist, the Hebrew snapshot is shown; otherwise the app **falls back to the English post snapshot** (URL stays `/he/...`). Missing Hebrew **content** is a product/content gap, not a missing route.

## Adding a new marketing page

1. Add English route under `web/app/.../page.tsx` as needed.
2. Add **`web/app/[lang]/.../page.tsx`** mirroring the path (reuse client + Hebrew fragment/deps if this is a snapshot page — see repo `triolla-html-to-react` skill).
3. Ensure **`rewriteTriollaNavLinks`** / menus point `/he/...` correctly (see `web/app/lib/rewriteTriollaNavLinks.ts`).
4. Re-run parity spot-check for the new paths.

## Optional: enumerate routes (agent or maintainer)

There is no single Next.js manifest in-repo; to audit systematically:

- Grep for **`page.tsx`** under `web/app/[lang]` and compare path suffixes to `web/app` routes **excluding** `[lang]`, `he`, `api`, etc.
- Or run **`next build`** and inspect build output for routes (if configured).

When automating, treat these as **Hebrew-capable roots**: `web/app/[lang]/**/page.tsx`.

## Validation

- **`npm run verify`** (from `web/`) — TypeScript + snapshot deps (does not prove EN/HE parity).
- **Manual smoke**: curl or browser for each high-traffic pair `/x` and `/he/x`.

## Related repo docs

- `README_SNAPSHOT_MAINTENANCE.md` — regenerating fragments/deps.
- `web/middleware.ts` — redirects and canonical `/he` behavior.
- `.claude/skills/triolla-html-to-react/SKILL.md` — snapshot conversion patterns.
