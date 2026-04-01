# Hebrew Language Support Implementation

## Overview

Your application now has full Hebrew language support with a URL-based routing system. Each page exists in both English and Hebrew versions, with complete HTML snapshots and separate assets for each language.

## Architecture

### URL Structure

```
/about-us/           → English version (default)
/he/about-us/        → Hebrew version
/technology/         → English version (default)  
/he/technology/      → Hebrew version
/                    → Redirects to /en
```

### Directory Structure

```
web/app/
  [lang]/                           # Dynamic language segment
    layout.tsx                      # RTL support for Hebrew
    page.tsx                        # Language-aware root
    about-us/
      page.tsx                      # Accepts lang param
      AboutUsClient.tsx             # Loads correct fragment
      about-us-deps.json            # Shared deps
      about-us-deps-he.json         # Hebrew deps (if different)
      {initTriollaCarousels.ts, ...}
    technology/
      page.tsx                      # Accepts lang param
      TechnologyClient.tsx          # Loads correct fragment
      technology-deps.json          # Shared deps
      {technologyReveal.ts, ...}

public/
  fragments/
    about-us-body.html              # English
    about-us-he-body.html           # Hebrew
    technology-body.html            # English
    technology-he-body.html         # Hebrew
  assets/
    about-us/                       # English assets
    about-us-he/                    # Hebrew assets (separate CSS, images if needed)
    technology/                     # English assets
    technology-he/                  # Hebrew assets
```

## Key Changes Made

### 1. Updated Pipeline Scripts

#### `pipeline/discover.py`
- Now detects Hebrew URLs (pattern: `/he/path/`)
- Adds `lang` field to each entry: `"lang": "en"` or `"lang": "he"`
- Supports both English and Hebrew pages in manifest

#### `landing-page/_batch_download.py`
- Displays language while downloading each page
- Handles both English and Hebrew URLs transparently

#### `pipeline/batch_convert.py`
- Detects language from manifest entry
- Creates language-specific fragments:
  - English: `/fragments/about-us-body.html`
  - Hebrew: `/fragments/about-us-he-body.html`
- Creates language-specific asset directories:
  - English: `/assets/about-us/`
  - Hebrew: `/assets/about-us-he/`

### 2. Next.js Layout System

#### `app/[lang]/layout.tsx` (NEW)
- Accepts dynamic `lang` parameter (`en` or `he`)
- Sets `dir="rtl"` and `lang="he"` for Hebrew
- Sets `dir="ltr"` and `lang="en"` for English
- Generates language-specific metadata

#### `app/[lang]/page.tsx` (NEW)
- Root page that redirects to `/en/about-us` by default
- Enables language-based routing

### 3. Page Components

#### `app/[lang]/about-us/page.tsx` & `app/[lang]/technology/page.tsx`
- Accept `lang` parameter from route
- Generate language-specific metadata (titles, descriptions)
- Pass `lang` to client components

#### `AboutUsClient.tsx` & `TechnologyClient.tsx` (UPDATED)
- Accept `lang` prop
- Load correct fragment based on language:
  ```typescript
  const fragmentUrl = lang === "he" 
    ? "/fragments/about-us-he-body.html"
    : "/fragments/about-us-body.html";
  ```
- Load correct asset base:
  ```typescript
  const assetBaseUrl = lang === "he" 
    ? "/assets/about-us-he"
    : "/assets/about-us";
  ```

## Next Steps: Implementation Workflow

### Step 1: Run Discovery

```bash
cd /Users/ariell/html-to-react
python3 pipeline/discover.py triolla.io --output pipeline/urls.json
```

**Status:** ✅ Done
- Found 292 pages
- 282 English, 10 Hebrew (based on current sitemap)
- Each entry has a `lang` field

### Step 2: Download Pages

```bash
cd landing-page
python3 _batch_download.py
```

This will:
- Download all English pages to `landing-page/triolla-io-about-us/`, etc.
- Download Hebrew pages to `landing-page/triolla-io-he-about-us/`, etc.
- Each with their own `_assets/` and `_manifest.json`

### Step 3: Convert to Next.js Routes

```bash
cd ..
python3 pipeline/batch_convert.py
```

This will:
- Extract English fragments: `/fragments/about-us-body.html`
- Extract Hebrew fragments: `/fragments/about-us-he-body.html`
- Sync English assets: `/assets/about-us/`
- Sync Hebrew assets: `/assets/about-us-he/`
- Update `pipeline/urls.json` status to `converted`

### Step 4: Test Locally

```bash
cd web
npm run dev
```

Visit:
- `http://localhost:3000/en/about-us` — English version
- `http://localhost:3000/he/about-us` — Hebrew version (RTL)
- `http://localhost:3000/` — Redirects to English home

## RTL Support Details

The `[lang]/layout.tsx` sets:
```typescript
dir={isHebrew ? "rtl" : "ltr"}
lang={lang}
```

This applies to the entire page:
- Text flows right-to-left
- Elements align right by default
- Margins and padding are semantically reversed

**Note:** Your Hebrew CSS (`responsive-he.css`) likely already handles RTL styles. The `dir` attribute on the HTML tag enables CSS to apply RTL rules automatically.

## Verification Checklist

After running the pipeline:

- [ ] Check `pipeline/urls.json` has `lang` field for all entries
- [ ] Verify download script shows both English and Hebrew URLs
- [ ] Confirm fragments created: `about-us-body.html`, `about-us-he-body.html`
- [ ] Check assets split: `assets/about-us/` and `assets/about-us-he/`
- [ ] Test English: `http://localhost:3000/en/about-us` loads correctly
- [ ] Test Hebrew: `http://localhost:3000/he/about-us` loads with RTL
- [ ] Verify text is right-to-left and left margin becomes right margin in Hebrew

## Troubleshooting

### Fragment not found
```
Could not load the About page snapshot. Run npm run sync:about from web/ and ensure public/assets/about-us is populated.
```
**Fix:** Ensure `pipeline/batch_convert.py` completed successfully and assets are in `web/public/assets/`

### Wrong asset base for Hebrew
**Check:** `app/[lang]/about-us/AboutUsClient.tsx` is calling `getAssetBase(lang)` correctly

### Text not right-to-left
**Check:** Layout sets `dir="rtl"` in `app/[lang]/layout.tsx`

### Hebrew page returns 404
**Check:** `pipeline/urls.json` has entries with `"lang": "he"` and they were downloaded to `landing-page/triolla-io-he-*/`

## Language Switcher (Optional Future Enhancement)

When ready, add a footer component that links between languages:

```typescript
// Example (not yet implemented)
function LanguageSwitcher({ lang }: { lang: string }) {
  const currentPath = usePathname().replace(`/${lang}`, "");
  const otherLang = lang === "he" ? "en" : "he";
  return (
    <a href={`/${otherLang}${currentPath}`}>
      {lang === "he" ? "English" : "עברית"}
    </a>
  );
}
```

## Summary

Your Hebrew support system is now:
- ✅ **Discoverable** — URLs include `lang` field
- ✅ **Downloadable** — Separate English/Hebrew snapshots
- ✅ **Convertible** — Language-aware fragment extraction
- ✅ **Routeable** — Next.js `[lang]` dynamic segments
- ✅ **RTL-Ready** — HTML `dir="rtl"` for Hebrew

Ready to run the full pipeline! 🚀
