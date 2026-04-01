# 🇮🇱 Hebrew Support: Quick Start

Your application is now configured for Hebrew language support! Here's what was implemented and how to use it.

## What's New

✅ **Language-aware routing:** `/en/about-us` and `/he/about-us`
✅ **RTL support:** Hebrew pages automatically set `dir="rtl"`  
✅ **Language detection in manifest:** Each URL tagged with `lang: "en"` or `lang: "he"`
✅ **Separate assets:** English and Hebrew have independent asset directories

## File Changes Summary

### Pipeline Scripts (Updated)
- `pipeline/discover.py` — Now detects `/he/` URL pattern
- `landing-page/_batch_download.py` — Shows language during download
- `pipeline/batch_convert.py` — Creates language-specific fragments and assets

### Next.js App (Refactored)
- `app/[lang]/layout.tsx` — NEW: Handles RTL, metadata per language
- `app/[lang]/page.tsx` — NEW: Language root, redirects to about-us
- `app/[lang]/about-us/` — Moved from `app/about-us/`, accepts `lang` param
- `app/[lang]/technology/` — Moved from `app/technology/`, accepts `lang` param

### Client Components (Updated)
- `AboutUsClient.tsx` — Now loads correct fragment + assets based on `lang`
- `TechnologyClient.tsx` — Now loads correct fragment + assets based on `lang`

## How to Use

### 1. Download Pages (Example)

```bash
cd landing-page
# Download all pages (takes 5-10 min for 292 pages)
python3 _batch_download.py

# Or download specific language (example)
python3 _batch_download.py --only-slug triolla-io-he-technology
```

### 2. Convert to Next.js

```bash
cd ..
# Convert all pages
python3 pipeline/batch_convert.py

# Or convert specific language (example)
python3 pipeline/batch_convert.py --only-slug triolla-io-he-technology
```

### 3. Test Locally

```bash
cd web
npm run dev
```

Visit:
- **English:** `http://localhost:3000/en/about-us`
- **Hebrew:** `http://localhost:3000/he/about-us`

Notice:
- Hebrew page has `dir="rtl"` (text flows right-to-left)
- Layout respects Hebrew styling
- Language can be detected from URL

## URLs Structure

```
/                          → Redirects to /en
/en/                       → English home (about-us)
/en/about-us               → English about page
/en/technology             → English technology page
/en/services               → English services (future)
/en/blog/...               → English blog posts (future)

/he/                       → Hebrew home (about-us)
/he/about-us               → Hebrew about page (RTL)
/he/technology             → Hebrew technology page (RTL)
```

## Asset Management

After conversion, your assets look like:

```
web/public/assets/
  about-us/                  # English about-us assets
  about-us-he/               # Hebrew about-us assets
  technology/                # English technology assets
  technology-he/             # Hebrew technology assets
```

Each language has its own:
- CSS files
- JavaScript files
- Images and fonts
- Manifest JSON

## Fragment Management

```
web/public/fragments/
  about-us-body.html         # English about page HTML body
  about-us-he-body.html      # Hebrew about page HTML body
  technology-body.html       # English technology HTML body
  technology-he-body.html    # Hebrew technology HTML body
```

Components load the correct fragment based on the `[lang]` route parameter.

## Manifest Format

Your `pipeline/urls.json` now includes:

```json
{
  "url": "https://triolla.io/about-us/",
  "slug": "triolla-io-about-us",
  "path": "/about-us/",
  "title": "About Us",
  "lang": "en",           // ← NEW: Language tag
  "status": "pending"
}
```

## Browser Testing

When you visit a page:

1. **URL shows language:** `/en/` or `/he/`
2. **HTML tag reflects language:**
   ```html
   <!-- English -->
   <html lang="en" dir="ltr">
   
   <!-- Hebrew -->
   <html lang="he" dir="rtl">
   ```
3. **Styles apply RTL:** Margins, padding, text alignment all flip

## Future: Language Switcher

To add a language switcher in your footer, you can use the `lang` parameter from the route. Example component (pseudo-code):

```typescript
function LanguageSwitcher({ lang }: { lang: string }) {
  const otherLang = lang === "he" ? "en" : "he";
  const otherPath = lang === "he" 
    ? location.pathname.replace("/he/", "/en/")
    : "/he" + location.pathname;
  
  return (
    <a href={otherPath}>
      {lang === "he" ? "English" : "עברית"}
    </a>
  );
}
```

## Troubleshooting

**Q: Hebrew page shows 404**  
A: Make sure `pipeline/batch_convert.py` ran successfully and the fragment file exists in `web/public/fragments/`

**Q: Hebrew text doesn't look right-to-left**  
A: Check browser DevTools: HTML should have `dir="rtl"`. If not, check `app/[lang]/layout.tsx`

**Q: Assets not loading for Hebrew**  
A: Verify `web/public/assets/about-us-he/` directory exists and has files

**Q: Discovery didn't find Hebrew URLs**  
A: Sitemap may not include Hebrew versions. Check if `https://triolla.io/he/` pages exist on the live site

## What's Next?

1. **Run the full pipeline:** Download and convert all pages
2. **Test all routes:** Verify both English and Hebrew pages
3. **Add language switcher:** Let users toggle between languages
4. **Monitor metrics:** Track which pages benefit from Hebrew support

For detailed implementation guide, see `HEBREW_SUPPORT.md`.

## Questions?

Check the implementation details in:
- `pipeline/discover.py` — How language is detected
- `app/[lang]/layout.tsx` — How RTL is applied
- `app/[lang]/about-us/AboutUsClient.tsx` — How fragments are loaded per language

Good luck! 🚀
