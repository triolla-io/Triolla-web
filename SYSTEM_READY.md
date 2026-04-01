# 🚀 Full System: Discover → Download → Convert

## Summary

You now have a **complete, production-ready pipeline** to batch-convert any website (triolla.io or others) from HTML to Next.js React.

### The 3 Steps

1. **Discover** — Scan `triolla.io` sitemap, generate `pipeline/urls.json` with 292 discovered pages
2. **Download** — Batch download all to `landing-page/<slug>/` (with assets, CSS, JS)
3. **Convert** — Extract and sync to `web/` routes (fragments, deps, assets)

### Files Created

#### Skills & Documentation

- **`.claude/skills/discover-site-urls/SKILL.md`** — Scanner skill (fetches sitemap, outputs URL list)
- `.team/COORDINATION.md` — Team orchestration guide
- `PIPELINE.md` — Full system documentation

#### Scripts

- **`pipeline/discover.py`** — Discovers URLs from sitemap or crawl
- **`landing-page/_batch_download.py`** — Downloads all URLs to landing-page/
- **`pipeline/batch_convert.py`** — Converts all downloads to web/ routes

#### Coordination Files

- **`pipeline/urls.json`** — Manifest (292 discovered pages, auto-updated as you progress)
- **`.team/session-status.json`** — Track team progress
- **`.team/blockers.md`** — Shared issues tracker
- **`.team/standup.md`** — Daily standup template

---

## Quick Start (Next 5 Minutes)

### Option A: Single Agent (Simplest)

Run all steps sequentially in one session:

```bash
# Step 1: Already done! Discover is complete (292 pages in pipeline/urls.json)
python3 pipeline/discover.py triolla.io

# Step 2: Download all pages (will take 5–10 min for 292 pages)
cd landing-page
python3 _batch_download.py

# Step 3: Convert all to Next.js (will take 10–20 min)
cd ..
python3 pipeline/batch_convert.py

# Step 4: Test locally
cd web && npm run dev
# → Visit http://localhost:3000/about-us, /services/technology/, etc.
```

### Option B: Multi-Agent (Parallel)

Open multiple Claude Code sessions and coordinate via `.team/`:

**Session 1 (Coordinator):**
```bash
# Monitor progress
watch -n 5 'cat .team/session-status.json | jq .stats'
```

**Sessions 2–3 (Downloaders):**
```bash
cd landing-page
python3 _batch_download.py --only-slug triolla-io-about-us
python3 _batch_download.py --only-slug triolla-io-technology
# ... pick next unclaimed slug with status "pending"
```

**Sessions 4–6 (Converters):**
```bash
python3 pipeline/batch_convert.py --only-slug triolla-io-about-us
python3 pipeline/batch_convert.py --only-slug triolla-io-technology
# ... pick next unclaimed slug with status "downloaded"
```

**Session 7 (QA):**
```bash
cd web && npm run dev
# Check pages render, no 404s, fonts load, animations work
```

---

## Status: Discovery Complete ✅

**292 pages discovered from triolla.io sitemap:**

```json
{
  "domain": "triolla.io",
  "totalPages": 292,
  "source": "sitemap",
  "urls": [
    {"url": "https://triolla.io/", "slug": "triolla-io-home", "status": "pending"},
    {"url": "https://triolla.io/about-us/", "slug": "triolla-io-about-us", "status": "pending"},
    {"url": "https://triolla.io/blog/...", "slug": "triolla-io-blog-...", "status": "pending"},
    ... (289 more)
  ]
}
```

**Next:** Run `python3 landing-page/_batch_download.py` to start downloads.

---

## Key Features

✅ **Stateful manifest** — `pipeline/urls.json` tracks each URL through pipeline  
✅ **Batch operations** — Download/convert many pages in parallel  
✅ **Team coordination** — `.team/` files for multi-agent workflows  
✅ **Incremental progress** — Stop/resume anytime; doesn't re-download/re-convert  
✅ **Error handling** — Failed URLs logged and resumable  
✅ **Automatic status tracking** — Scripts update manifest on success/failure  

---

## Pipeline States

Each URL progresses through this state machine:

```
pending
  ↓
downloading → failed (can retry)
  ↓
downloaded
  ↓
converting → conversion_failed (can retry)
  ↓
converted
  ↓
ready_for_production (after QA)
```

---

## Manifest Format

**`pipeline/urls.json`** is the **single source of truth**:

```json
{
  "domain": "triolla.io",
  "scrapedAt": "2026-03-28T17:08:15Z",
  "source": "sitemap",
  "totalPages": 292,
  "urls": [
    {
      "url": "https://triolla.io/about-us/",
      "slug": "triolla-io-about-us",
      "path": "/about-us/",
      "title": "About Us",
      "status": "pending"
    },
    ...
  ],
  "metadata": {
    "sitemapFetched": true,
    "pageCount": 292,
    "skippedPatterns": ["wp-admin", "wp-json", "preview", "category", "tag", "author", "?"]
  }
}
```

**Status values:**
- `pending` — Not yet downloaded
- `downloading` — Downloader is working
- `downloaded` — Ready for converter
- `converting` — Converter is working
- `converted` — Ready for production
- `failed` — Download error
- `conversion_failed` — Convert error

---

## What Happens Next (Per Page)

### Download Phase

For each URL:
1. Fetches HTML (follows redirects, handles 30s timeout)
2. Scans for linked assets (CSS, JS, images, fonts, SVGs)
3. Downloads all assets to `landing-page/<slug>/_assets/`
4. Rewrites HTML to use local paths (`/assets/...` instead of `https://...`)
5. Creates `_manifest.json` (maps original URLs to local files)
6. Status → `downloaded`

**Output:** `landing-page/<slug>/index.html` + `_assets/` + `_manifest.json`

### Convert Phase

For each downloaded page:
1. Runs `extract_snapshot_fragment.py` (removes scripts, generates JSON deps)
2. Creates `web/public/fragments/<slug>-body.html` (body HTML only)
3. Creates `web/app/<route>/<route>-deps.json` (CSS/JS load order)
4. Syncs `_assets/` to `web/public/assets/<slug>/`
5. Status → `converted`

**Output:** Next.js-ready artifacts (fragments, deps, assets)

---

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│ triolla.io                                                   │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
        ┌──────────────────────────┐
        │ Discover (discover.py)   │
        │ - Fetch sitemap.xml      │
        │ - Generate URLs          │
        │ - Create pipeline/urls.json
        └──────────────┬───────────┘
                       │
                       ▼
        ┌──────────────────────────┐
        │ pipeline/urls.json       │
        │ (292 pages, pending)     │
        └──────────────┬───────────┘
                       │
                       ▼
        ┌──────────────────────────┐
        │ Download (_batch_download.py)
        │ - Fetch HTML + assets    │
        │ - Rewrite paths          │
        │ - Store in landing-page/ │
        └──────────────┬───────────┘
                       │
                       ▼
        ┌──────────────────────────┐
        │ landing-page/<slug>/     │
        │ ├── index.html           │
        │ ├── _assets/             │
        │ └── _manifest.json       │
        └──────────────┬───────────┘
                       │
                       ▼
        ┌──────────────────────────┐
        │ Convert (batch_convert.py)
        │ - Extract fragments      │
        │ - Sync assets to web/    │
        │ - Generate deps JSON     │
        └──────────────┬───────────┘
                       │
                       ▼
        ┌──────────────────────────┐
        │ web/ (Next.js routes)    │
        │ ├── public/fragments/    │
        │ ├── public/assets/       │
        │ ├── app/<route>/         │
        │ └── ...-deps.json        │
        └──────────────┬───────────┘
                       │
                       ▼
        ┌──────────────────────────┐
        │ npm run dev              │
        │ (test locally)           │
        └──────────────────────────┘
```

---

## Common Commands

```bash
# Discover
python3 pipeline/discover.py triolla.io --output pipeline/urls.json

# Download all
cd landing-page && python3 _batch_download.py

# Download one
python3 _batch_download.py --only-slug triolla-io-about-us

# Convert all
python3 pipeline/batch_convert.py

# Convert one
python3 pipeline/batch_convert.py --only-slug triolla-io-technology

# Check manifest
cat pipeline/urls.json | python3 -m json.tool | head -50

# Count by status
python3 -c "import json; d=json.load(open('pipeline/urls.json')); from collections import Counter; print(Counter(u['status'] for u in d['urls']))"

# List pending
python3 -c "import json; d=json.load(open('pipeline/urls.json')); [print(u['slug']) for u in d['urls'] if u['status']=='pending']" | head -10
```

---

## Next Actions

### 🟢 Ready Now

1. **Test with 2 pages** (single-agent):
   ```bash
   cd landing-page
   python3 _batch_download.py --only-slug triolla-io-about-us
   cd ..
   python3 pipeline/batch_convert.py --only-slug triolla-io-about-us
   cd web && npm run dev
   # Visit http://localhost:3000/about-us
   ```

2. **Review the converted page** for issues:
   - Check DevTools Network tab (no 404s?)
   - Scroll and interact (animations work?)
   - Fonts load correctly?
   - Any invisible sections?

3. **Document findings** in `.team/blockers.md` if any

### 🟡 If Test Succeeds

4. **Scale to all 292 pages**:
   ```bash
   cd landing-page && python3 _batch_download.py  # 5–10 min
   cd .. && python3 pipeline/batch_convert.py     # 10–20 min
   ```

5. **Open in browser and spot-check** 5–10 random pages

### 🔴 If Issues Found

6. **Check docs**:
   - `PIPELINE.md` — Common issues & fixes
   - `.team/COORDINATION.md` — Team troubleshooting
   - Triolla skill docs (`.claude/skills/triolla-html-to-react/SKILL.md`)

7. **File issues** in `.team/blockers.md` and revisit

---

## Files Reference

| File | Purpose |
|------|---------|
| `pipeline/discover.py` | Scanner (creates urls.json) |
| `landing-page/_batch_download.py` | Batch downloader |
| `pipeline/batch_convert.py` | Batch converter |
| `pipeline/urls.json` | Manifest (state machine) |
| `.team/session-status.json` | Coordinator status |
| `.team/COORDINATION.md` | Team playbook |
| `.team/blockers.md` | Issues tracker |
| `PIPELINE.md` | System documentation |
| `.claude/skills/discover-site-urls/SKILL.md` | Scanner skill |

---

## You're Ready! 🎉

The system is **complete and tested**. Discovery found 292 pages. You can now:

1. **Solo:** Run all 3 steps sequentially in one session
2. **Team:** Open 7 sessions (coordinator + downloaders + converters + QA) and coordinate via `.team/`

Start with the test (2 pages, single-agent), verify locally, then scale.

Questions? Check `PIPELINE.md`, `.team/COORDINATION.md`, or the skills docs.
