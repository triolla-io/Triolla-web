# Pipeline Orchestration & Coordination

**Goal:** Convert a website (triolla.io) from HTML to Next.js React components at scale.

## Team Roles & Responsibilities

### ✨ Single-Agent Workflow (Recommended for < 5 pages)

**One person/session runs everything sequentially:**

```
[Discover URLs] → [Download all] → [Convert all] → Done
```

**Time estimate:** 30 min per page (depends on size/complexity)

---

### 🚀 Multi-Agent Workflow (For > 5 pages or parallel work)

**Multiple Claude Code sessions coordinate via `pipeline/urls.json` + `.team/`**

#### Session 1: **Coordinator / Scanner**
- **Role:** Maintain URL manifest and project status
- **Owns:** `pipeline/urls.json`, `.team/session-status.json`, `.team/COORDINATION.md`
- **Does:**
  - Run discover once: `python3 pipeline/discover.py triolla.io`
  - Monitor progress of other sessions
  - Merge changes at end
  - NOT modifying `landing-page/` or `web/` directly
- **Duration:** 10 min initial, then monitoring only
- **Depends on:** None
- **Unblocks:** Downloaders & Converters

#### Sessions 2–4: **Downloaders** (Optional, if many URLs)
- **Role:** Download from `pipeline/urls.json` to `landing-page/<slug>/`
- **Owns:** Assigned slugs in `pipeline/urls.json` (claim one at a time)
- **Does:**
  - Pick an unclaimed URL with status `pending`
  - Run: `python3 landing-page/_batch_download.py --only-slug <slug>`
  - Update manifest (automatic)
  - Repeat for next slug
- **Duration:** 1–3 min per slug
- **Depends on:** Coordinator (URL list exists)
- **Unblocks:** Converters

#### Sessions 5–7: **Converters** (Main work)
- **Role:** Extract and synced downloaded pages to `web/`
- **Owns:** Assigned slugs (once downloaded)
- **Does:**
  - Pick a slug with status `downloaded`
  - Run: `python3 pipeline/batch_convert.py --only-slug <slug>`
  - Manually review output (check for missing assets, invisible sections)
  - Run local tests if needed
  - Update manifest
  - Repeat for next slug
- **Duration:** 5–15 min per slug (depends on complexity)
- **Depends on:** Downloaders (pages exist)
- **Unblocks:** QA/Testing (optional)

#### Sessions 8–9: **QA / Testing** (Optional)
- **Role:** Verify converted pages render correctly
- **Owns:** Converted slugs
- **Does:**
  - Check DevTools for 404s, missing assets, invisible sections
  - Compare `web/` route vs original `landing-page/` snapshot
  - File issues in `.team/blockers.md`
  - Mark status `ready_for_production` or `needs_fixes`
- **Duration:** 3–5 min per slug
- **Depends on:** Converters
- **Unblocks:** None (final pass)

---

## Coordination Infrastructure

### `.team/session-status.json`

All sessions read this; Coordinator updates it:

```json
{
  "project": "html-to-react-batch",
  "currentPhase": 2,
  "startedAt": "2026-03-28T19:30:00Z",
  "urlsManifest": "pipeline/urls.json",
  "sessions": {
    "coordinator": {
      "status": "active",
      "role": "Scanner & Monitor",
      "progress": 100,
      "notes": "Discovered 8 pages from sitemap"
    },
    "downloader-1": {
      "status": "in_progress",
      "role": "Download",
      "currentSlug": "triolla-io-technology",
      "progress": 50,
      "notes": "3 downloaded, 5 remaining"
    },
    "converter-1": {
      "status": "in_progress",
      "role": "Convert",
      "currentSlug": "triolla-io-about-us",
      "progress": 75,
      "notes": "Extracting assets, syncing to web/"
    },
    "qa-1": {
      "status": "blocked",
      "role": "QA",
      "blockedBy": "converter-1",
      "notes": "Waiting for first converted page"
    }
  },
  "syncPoints": [
    {
      "phase": 1,
      "name": "Discovery",
      "status": "completed",
      "completedAt": "2026-03-28T19:35:00Z"
    },
    {
      "phase": 2,
      "name": "Download & Convert in Parallel",
      "status": "in_progress",
      "gate": "All URLs downloaded, first page converted"
    }
  ]
}
```

### `.team/COORDINATION.md`

Shared reference for all sessions:

```markdown
# Coordination — HTML to React Batch Conversion

## Timeline
- Phase 1 (10 min): Discover URLs
- Phase 2 (20–40 min): Download & Convert in parallel
- Phase 3 (10 min): QA & merge

## Known Constraints
- Max 2 concurrent downloaders (respect rate limits)
- Converters wait for landing-page/ folders to exist
- Do not edit web/public/assets/<slug>/ directly; use batch_convert.py

## How to Claim Work
1. Check pipeline/urls.json for status: "pending" → "downloading" → "downloaded" → "converting" → "converted"
2. Before starting, update .team/session-status.json with your currentSlug
3. After finishing a slug, update its status in pipeline/urls.json
4. File any blockers in .team/blockers.md

## Critical Paths
- None blocked yet; all phases can proceed in parallel after discovery

## Communication
- Blockers: .team/blockers.md
- Daily notes: .team/standup.md (optional, for reference)
```

### `.team/blockers.md`

Shared issue tracker:

```markdown
# Blockers & Issues

## Critical
- None

## High
- **Converter needs custom JS mount for fade-in (triolla-io-about-us)**
  - Issue: Sections invisible after convert; CSS has opacity:0 + expects .show class
  - Assigned: converter-1
  - Action: Check `aboutUsReveal.ts` pattern; implement intersection observer

## Medium
- Assets syncing slowly for large pages
  - Mitigation: Run batches of 2–3 converters in parallel, not all 5

## Resolved
- (none yet)
```

---

## Execution Flows

### Single-Agent (Recommended)

```bash
# Terminal 1: Discovery
$ python3 pipeline/discover.py triolla.io
✓ Discovered 8 pages

# Terminal 2: Download all
$ cd landing-page
$ python3 _batch_download.py
✓ Downloaded 8 pages

# Terminal 3: Convert all
$ python3 pipeline/batch_convert.py
✓ Converted 8 pages

# Terminal 4: Local test (optional)
$ cd web && npm run dev
```

### Multi-Agent (Parallel)

**Agent 1 (Coordinator):**
```bash
$ python3 pipeline/discover.py triolla.io
$ # Monitor .team/session-status.json and pipeline/urls.json
$ # Update .team/standup.md daily
```

**Agent 2 (Downloader):**
```bash
$ watch -n 5 'cat pipeline/urls.json | jq .urls[].status'
$ python3 landing-page/_batch_download.py --only-slug triolla-io-about-us
$ # Repeat for next unclaimed slug with status "pending"
```

**Agent 3 (Converter):**
```bash
$ python3 pipeline/batch_convert.py --only-slug triolla-io-technology
$ # Repeat for next unclaimed slug with status "downloaded"
$ # If errors, check .team/blockers.md
```

**Agent 4 (QA):**
```bash
$ cd web && npm run dev
$ # Visit http://localhost:3000/about-us
$ # Check DevTools for 404s, invisible sections, missing fonts
$ # File findings in .team/blockers.md
```

### Multi-process workers (flock, same machine)

Several terminals can run in parallel without corrupting `pipeline/urls.json`. Each worker **claims** the next slug under an exclusive file lock, then runs the same per-slug scripts as before.

From the **repository root** (not `web/`):

```bash
# 2–4 download workers (phase: pending / failed → downloaded)
python3 pipeline/download_worker.py
python3 pipeline/download_worker.py

# After enough downloads exist, 2–4 convert workers (downloaded → converted)
python3 pipeline/convert_worker.py
python3 pipeline/convert_worker.py
```

Optional subset: `--include-file pipeline/include.txt` on both workers.

**Do not** run the full sequential `landing-page/_batch_download.py` or `pipeline/batch_convert.py` **at the same time** as these workers (they would skip `downloading` / `converting` rows but still add confusion). If a process dies mid-job, clear claim flags (only when no workers are running):

```bash
python3 pipeline/download_worker.py --release-stuck
# or
python3 pipeline/convert_worker.py --release-stuck
```

---

## Status Definitions

| Status | Meaning | Next Step |
|--------|---------|-----------|
| `pending` | Not started | Assign to downloader |
| `downloading` | Downloader is working | Wait |
| `downloaded` | landing-page/<slug>/ ready | Assign to converter |
| `converting` | Converter is working | Wait |
| `converted` | web/ artifacts ready | QA can start |
| `ready_for_production` | QA passed | Ship |
| `failed` | Download or convert error | Debug & retry |
| `conversion_failed` | Convert error | Check .team/blockers.md |
| `needs_fixes` | QA found issues | Converter fixes & resubmits |

---

## Troubleshooting

### Download fails: "ERROR fetching https://..."
- **Cause:** Rate limit, SSL, network timeout
- **Fix:** Retry manually; if persistent, check domain/URL validity

### Convert fails: "index.html not found"
- **Cause:** Download didn't complete
- **Status:** Check `pipeline/urls.json` for entry status; should be "downloaded"
- **Fix:** Re-run downloader for that slug

### Sections invisible after convert
- **Cause:** CSS expects `.show` class; inline scripts stripped by snapshot
- **Fix:** See converter notes; implement `IntersectionObserver` in client component

### Assets return 404
- **Cause:** `_assets/` not synced to `web/public/assets/<slug>/`
- **Fix:** Run `batch_convert.py` with `--skip-extract` to retry assets sync

### Cannot find `extract_snapshot_fragment.py`
- **Cause:** Script not in `web/scripts/`
- **Status:** Copy from `.claude/skills/triolla-html-to-react/` or use the triolla skill to regenerate

---

## Verification Checklist (Before Shipping)

For each converted page:

- [ ] `web/public/fragments/<slug>-body.html` exists
- [ ] `web/app/<route>/<route>-deps.json` exists
- [ ] `web/public/assets/<slug>/*.css`, `*.js`, `*.svg` exist (no 404s in DevTools)
- [ ] Page renders in browser (npm run dev)
- [ ] No visible missing sections
- [ ] Fonts load correctly
- [ ] Scroll animations / carousels work
- [ ] Mobile responsive (check at 375px, 768px, 1440px)

---

## Next Steps

1. **First run:** Single-agent workflow to establish pattern
2. **Validation:** Check one converted page in browser; fix any obvious gaps
3. **Scale:** If satisfied, add more sessions for parallel conversion
4. **Optimization:** Batch rate-limited downloads if hitting server limits
