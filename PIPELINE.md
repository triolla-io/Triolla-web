# HTML-to-React Pipeline

**Automated batch conversion system**: Discover website URLs → Download HTML snapshots → Convert to Next.js React components.

## Quick Start (Single Agent)

```bash
# 1. Discover all pages on triolla.io
python3 pipeline/discover.py triolla.io

# 2. Download all to landing-page/
cd landing-page
python3 _batch_download.py

# 3. Convert all to web/ routes
cd ../
python3 pipeline/batch_convert.py

# 4. Test locally
cd web && npm run dev
# → Visit http://localhost:3000
```

**Time estimate:** 2–3 min per page (depends on size)

---

## System Architecture

### 1. **Discover** (`pipeline/discover.py`)
**Input:** Domain (e.g., `triolla.io`)  
**Output:** `pipeline/urls.json`

- Fetches `sitemap.xml` (or crawls if missing)
- Deduplicates and filters URLs
- Generates slugs (e.g., `triolla-io-about-us`)
- All entries start with status `"pending"`

```bash
python3 pipeline/discover.py triolla.io --output pipeline/urls.json
```

**Output structure:**
```json
{
  "domain": "triolla.io",
  "scrapedAt": "2026-03-28T19:30:00Z",
  "source": "sitemap",
  "totalPages": 8,
  "urls": [
    {"url": "https://triolla.io/about-us/", "slug": "triolla-io-about-us", "path": "/about-us/", "title": "About Us", "status": "pending"},
    ...
  ]
}
```

---

### 2. **Download** (`landing-page/_batch_download.py`)
**Input:** `pipeline/urls.json`  
**Output:** `landing-page/<slug>/` (for each URL)

Each slug folder contains:
- `index.html` (rewritten with local asset paths)
- `_assets/` (CSS, JS, images, fonts)
- `_manifest.json` (asset URL mappings)

```bash
cd landing-page
python3 _batch_download.py
# or, to download one:
python3 _batch_download.py --only-slug triolla-io-about-us
```

**Rate limiting:** Downloads one URL at a time (respects server, no throttling needed)

---

### 3. **Convert** (`pipeline/batch_convert.py`)
**Input:** `landing-page/<slug>/` folders (must exist after download)  
**Output:** Next.js route artifacts in `web/`

For each slug, generates:
- `web/public/fragments/<slug>-body.html` (body HTML, scripts removed)
- `web/app/<route>/<route>-deps.json` (CSS/JS load order)
- `web/public/assets/<slug>/` (synced `_assets/`)

```bash
python3 pipeline/batch_convert.py
# or, to convert one:
python3 pipeline/batch_convert.py --only-slug triolla-io-about-us
```

**What it does:**
1. Runs `extract_snapshot_fragment.py` (from triolla skill)
2. Copies `_assets/` to `web/public/assets/<slug>/`
3. Updates manifest status to `"converted"`

---

## Manifest (`pipeline/urls.json`)

**Single source of truth** — tracks each URL through the pipeline:

| Status | Meaning |
|--------|---------|
| `pending` | Not started |
| `downloading` | Downloader is working |
| `downloaded` | `landing-page/<slug>/` ready |
| `converting` | Converter is working |
| `converted` | `web/` artifacts ready |
| `failed` | Download error |
| `conversion_failed` | Convert error |
| `ready_for_production` | QA passed |

**Workflow:**
```
pending → downloading → downloaded → converting → converted → ready_for_production
```

---

## Multi-Agent Coordination

When running with **multiple Claude Code sessions**, use `.team/` files:

- **`.team/session-status.json`** — Who is working on what (updated by Coordinator)
- **`.team/COORDINATION.md`** — Shared reference for roles, timeline, blockers
- **`.team/blockers.md`** — Shared issue tracker
- **`.team/standup.md`** — Daily progress notes

See **`.team/COORDINATION.md`** for detailed team workflows.

### Claiming Work

1. Check `pipeline/urls.json` for a slug with status `pending` (for downloader) or `downloaded` (for converter)
2. Update `.team/session-status.json` with your `currentSlug`
3. Run the appropriate step: `--only-slug <slug>`
4. After success, status updates automatically

---

## Folder Layout

```
html-to-react/
├── pipeline/
│   ├── discover.py                  ← Scanner
│   ├── batch_convert.py             ← Converter
│   └── urls.json                    ← Manifest (auto-generated)
├── landing-page/
│   ├── _download_snapshot.py        ← Generic downloader (reused by batch script)
│   ├── _batch_download.py           ← Batch wrapper
│   ├── triolla-io-about-us/         ← One slug folder
│   │   ├── index.html
│   │   ├── _assets/
│   │   └── _manifest.json
│   └── triolla-io-technology/
│       ├── index.html
│       ├── _assets/
│       └── _manifest.json
├── web/
│   ├── app/
│   │   ├── about-us/
│   │   │   ├── page.tsx
│   │   │   ├── AboutUsClient.tsx
│   │   │   └── about-us-deps.json
│   │   └── technology/
│   │       ├── page.tsx
│   │       ├── TechnologyClient.tsx
│   │       └── technology-deps.json
│   ├── public/
│   │   ├── fragments/
│   │   │   ├── about-us-body.html
│   │   │   └── technology-body.html
│   │   └── assets/
│   │       ├── about-us/           ← Synced from landing-page/.../_assets/
│   │       └── technology/
│   └── scripts/
│       └── extract_snapshot_fragment.py
└── .team/
    ├── session-status.json          ← Coordination status
    ├── COORDINATION.md              ← Team guide
    ├── blockers.md                  ← Shared issues
    └── standup.md                   ← Daily notes
```

---

## Typical Workflow

### Single Agent

```bash
# 1. Discover URLs (once)
python3 pipeline/discover.py triolla.io

# 2. Review pipeline/urls.json
cat pipeline/urls.json | jq '.urls[] | {slug, url}'

# 3. Download all
cd landing-page && python3 _batch_download.py

# 4. Convert all
cd .. && python3 pipeline/batch_convert.py

# 5. Test
cd web && npm run dev
# Visit http://localhost:3000/about-us, etc.

# 6. Troubleshoot if needed
# - Check web/public/fragments/<slug>-body.html
# - Review web/app/<route>/<route>-deps.json
# - Look for missing assets in DevTools Network tab
```

### Multi-Agent (Example)

**Agent 1 (Coordinator):**
```bash
python3 pipeline/discover.py triolla.io
# Then monitor .team/session-status.json
```

**Agent 2 (Downloader):**
```bash
cd landing-page
python3 _batch_download.py --only-slug triolla-io-about-us
python3 _batch_download.py --only-slug triolla-io-technology
```

**Agent 3 (Converter):**
```bash
python3 pipeline/batch_convert.py --only-slug triolla-io-about-us
# Check for errors in .team/blockers.md
python3 pipeline/batch_convert.py --only-slug triolla-io-technology
```

**Agent 4 (QA):**
```bash
cd web && npm run dev
# Verify pages render, no 404s, animations work, fonts load
```

---

## Known Limitations

1. **JavaScript-rendered content** — Snapshot captures static HTML only; dynamic rendering/SPA behavior not included
2. **Authenticated pages** — Cannot snapshot pages requiring login
3. **Rate limits** — triolla.io is polite about requests; bulk download is single-threaded (respect servers)
4. **Large pages** — Very large HTML files may time out during download (increase timeout if needed)

---

## Troubleshooting

### Discover fails: "ERROR fetching..."
- Check domain (e.g., `triolla.io`, not `www.triolla.io`)
- Check internet connection
- Sitemap may not exist; script falls back to crawl (slower)

### Download fails: "ERROR: index.html not found"
- Check `landing-page/<slug>/` exists and contains `index.html`
- Re-run downloader for that slug

### Convert fails: "extractor not found"
- Ensure `web/scripts/extract_snapshot_fragment.py` exists
- If missing, copy from `.claude/skills/triolla-html-to-react/` or regenerate

### Sections invisible after convert
- CSS may use `opacity: 0` until `.show` class applied
- Check `.team/blockers.md` for known issues
- May need custom JavaScript mount (see triolla skill docs)

### Assets return 404
- Check `web/public/assets/<slug>/` exists
- Re-run `batch_convert.py` without `--skip-assets`
- Verify asset filenames match in `<slug>-deps.json`

---

## Performance

| Step | Time per Page | Notes |
|------|---------------|-------|
| Discover | 30 sec (once) | Fetches sitemap or crawls |
| Download | 10–30 sec | Depends on page size & asset count |
| Convert | 5–10 sec | Extraction + asset sync |
| **Total** | **~1–2 min** | For typical pages (50–100KB HTML, < 10MB assets) |

---

## Next Steps

1. **First run:** Follow "Single Agent" workflow above
2. **Validate:** Check one page at `http://localhost:3000/about-us` (npm run dev)
3. **If successful:** Scale with multi-agent workflow
4. **If issues:** Check `.team/blockers.md` and triolla skill docs for common patterns

---

## Skills Reference

- **discover-site-urls** — Scans domain, outputs `urls.json`
- **download-html-assets** — Single URL downloader (reused by batch script)
- **triolla-html-to-react** — Extraction, dependency analysis, React patterns
- **dependencies-aware-react-converter** — Automatic dep detection for complex pages

See `.claude/skills/*/SKILL.md` for detailed documentation.
