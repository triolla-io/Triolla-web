# Hebrew Support Implementation Checklist

## ✅ Completed Tasks

### Pipeline Scripts
- [x] Updated `pipeline/discover.py` to detect Hebrew URLs (`/he/` pattern)
- [x] Added `lang` field to manifest entries
- [x] Updated `landing-page/_batch_download.py` to handle language in logging
- [x] Updated `pipeline/batch_convert.py` to support language-specific conversions
- [x] Ran discovery — found 292 pages (282 English, 10 Hebrew)

### Next.js App Structure
- [x] Created `app/[lang]/layout.tsx` with RTL support
- [x] Created `app/[lang]/page.tsx` for language root
- [x] Refactored About Us pages to `app/[lang]/about-us/`
  - [x] Created `page.tsx` with language-aware metadata
  - [x] Updated `AboutUsClient.tsx` to accept `lang` prop
  - [x] Copied supporting files (deps, reveal, carousel, pill)
- [x] Refactored Technology pages to `app/[lang]/technology/`
  - [x] Created `page.tsx` with language-aware metadata
  - [x] Updated `TechnologyClient.tsx` to accept `lang` prop
  - [x] Copied supporting files (deps, reveal)
- [x] Created root `app/page.tsx` redirect to `/en`

### Client Components
- [x] `AboutUsClient.tsx` — Loads correct fragment based on language
- [x] `AboutUsClient.tsx` — Loads correct asset base based on language
- [x] `TechnologyClient.tsx` — Loads correct fragment based on language
- [x] `TechnologyClient.tsx` — Loads correct asset base based on language

### Documentation
- [x] Created `HEBREW_SUPPORT.md` — Comprehensive guide
- [x] Created `HEBREW_QUICK_START.md` — Quick reference
- [x] Created `HEBREW_IMPLEMENTATION.md` — What was changed

---

## 🔄 Next Steps (Run in Order)

### Step 1: Download All Pages
```bash
cd /Users/ariell/html-to-react/landing-page
python3 _batch_download.py
```
- [ ] Downloads all 292 pages
- [ ] Shows mixed English/Hebrew output
- [ ] Updates `pipeline/urls.json` with `status: "downloaded"`

**Time:** ~5-10 minutes

### Step 2: Convert to Next.js
```bash
cd ..
python3 pipeline/batch_convert.py
```
- [ ] Extracts all fragments (both languages)
- [ ] Syncs all assets (both languages)
- [ ] Updates manifest with `status: "converted"`

**Time:** ~10-20 minutes

### Step 3: Start Dev Server
```bash
cd web
npm run dev
```
- [ ] No build errors
- [ ] Server starts successfully

**Time:** ~1-2 minutes

### Step 4: Test Routes

#### English Pages (LTR)
- [ ] `http://localhost:3000/en/about-us` loads
- [ ] Content appears left-to-right
- [ ] Assets load (CSS, JS, images)
- [ ] Interactions work (carousels, accordions, reveals)

#### Hebrew Pages (RTL)
- [ ] `http://localhost:3000/he/about-us` loads
- [ ] Content appears right-to-left
- [ ] HTML tag shows `dir="rtl"`
- [ ] Assets load from correct language dir

#### Redirects
- [ ] `http://localhost:3000/` redirects to `/en`
- [ ] `/en/` redirects to `/en/about-us`

---

## 📋 Verification Tests

### Fragment Presence
```bash
ls -la web/public/fragments/ | grep -E "(about-us|technology)"
```
**Should show:**
- `about-us-body.html` (English)
- `about-us-he-body.html` (Hebrew)
- `technology-body.html` (English)
- `technology-he-body.html` (Hebrew)

- [ ] All fragments exist

### Asset Directories
```bash
ls -la web/public/assets/ | grep -E "(about-us|technology)"
```
**Should show:**
- `about-us/` (English)
- `about-us-he/` (Hebrew)
- `technology/` (English)
- `technology-he/` (Hebrew)

- [ ] All asset directories exist

### Manifest Format
```bash
python3 -c "import json; d=json.load(open('pipeline/urls.json')); 
u=d['urls'][0]; 
print(f'Entry keys: {list(u.keys())}'); 
print(f'Sample: {u}')"
```
**Should include:**
- `lang` field
- `status` field
- All other existing fields

- [ ] Manifest has correct structure

### Browser Check (DevTools)
For `http://localhost:3000/he/about-us`:
```
Look for in Inspector:
<html lang="he" dir="rtl">
```

- [ ] English: `lang="en"` `dir="ltr"`
- [ ] Hebrew: `lang="he"` `dir="rtl"`

---

## 🐛 Troubleshooting

### Issue: 404 on Hebrew page
```
[ ] Check if fragment exists: web/public/fragments/about-us-he-body.html
[ ] Check if batch_convert.py completed successfully
[ ] Check browser console for failed fetch
```

### Issue: Text not right-to-left
```
[ ] Verify layout.tsx sets dir="rtl" for Hebrew
[ ] Check HTML element in DevTools
[ ] Clear browser cache (Ctrl+Shift+Delete)
```

### Issue: Assets not loading
```
[ ] Check if assets directory exists: web/public/assets/about-us-he/
[ ] Check browser Network tab for 404s
[ ] Check client component loads correct asset base
```

### Issue: Discovery didn't find Hebrew URLs
```
[ ] Check if https://triolla.io/he/ pages exist
[ ] Verify sitemap includes Hebrew URLs
[ ] Try direct URL: https://triolla.io/he/about-us/
```

---

## 📊 Status Tracking

As you complete each step, update the status:

### Discovery Phase
- [x] Manifest regenerated
- [ ] Hebrew URLs detected

### Download Phase
- [ ] All pages downloaded
- [ ] Both English and Hebrew in landing-page/

### Conversion Phase
- [ ] Fragments extracted
- [ ] Assets synced
- [ ] Manifest updated

### Testing Phase
- [ ] English pages work
- [ ] Hebrew pages work (RTL)
- [ ] Redirects work
- [ ] No console errors

### Production Phase
- [ ] Ready to deploy
- [ ] Performance checked
- [ ] SEO metadata verified

---

## 🎯 Success Criteria

**You'll know it's working when:**

1. ✅ Discovery finds both English and Hebrew URLs
2. ✅ Download downloads both versions
3. ✅ Convert creates separate fragments for each
4. ✅ `/en/about-us` loads with English content (LTR)
5. ✅ `/he/about-us` loads with Hebrew content (RTL)
6. ✅ HTML element shows correct `lang` and `dir` attributes
7. ✅ No 404s in Network tab
8. ✅ All interactions work (carousels, accordions, etc.)

---

## 📝 Notes

- Hebrew sitemap only has ~10 pages (vs 282 English)
- Each language is a complete snapshot (no shared translation strings)
- RTL is CSS-only (browser handles with `dir` attribute)
- Assets are independent per language

---

## 🚀 Ready to Begin?

When ready:
```bash
cd /Users/ariell/html-to-react
python3 pipeline/discover.py triolla.io
cd landing-page && python3 _batch_download.py
cd .. && python3 pipeline/batch_convert.py
cd web && npm run dev
```

Good luck! 🇮🇱
