# 🚀 Full Pipeline System Complete

Your **HTML-to-React batch conversion system** is now ready.

## What You Have

✅ **3 Python scripts** (discover → download → convert)  
✅ **292 pages discovered** from triolla.io sitemap  
✅ **Team coordination** infrastructure (`.team/`)  
✅ **Full documentation** (PIPELINE.md, SYSTEM_READY.md, **[README_SNAPSHOT_MAINTENANCE.md](README_SNAPSHOT_MAINTENANCE.md)** — Next.js deps, fonts, CSS dedupe, common JS errors)  
✅ **Stateful manifest** (pipeline/urls.json) tracking progress  

## Run It Now (30 seconds to test)

**Single agent, test with 1 page:**

```bash
cd landing-page
python3 _batch_download.py --only-slug triolla-io-about-us
cd ..
python3 pipeline/batch_convert.py --only-slug triolla-io-about-us
cd web && npm run dev
# → Open http://localhost:3000/about-us
```

**Full pipeline (all 292 pages, ~30 min):**

```bash
./QUICK_START.sh
```

**Only the pages you list** (copy `pipeline/include.example.txt` → `pipeline/include.txt`, edit lines):

```bash
./QUICK_START.sh pipeline/include.txt
# or: PIPELINE_INCLUDE_FILE=pipeline/include.txt ./QUICK_START.sh
```

Each line is a **slug** (e.g. `triolla-io-about-us`), a **path** starting with `/` (e.g. `/about-us/`), or a full **URL**. `#` starts a comment.

```bash
python3 landing-page/_batch_download.py --repo-root . --include-file pipeline/include.txt
python3 pipeline/batch_convert.py --repo-root . --include-file pipeline/include.txt
```

### Hebrew homepage (`/he/`)

The Hebrew home page must be **downloaded from** [`https://triolla.io/he/`](https://triolla.io/he/), not copied from English `/`. Discovery adds that URL to the manifest when missing. If you already have `pipeline/urls.json` and do not want to re-run a full sitemap scrape, append the entry once with:

```bash
python3 pipeline/merge_manifest_locale_roots.py
```

Then download slug `triolla-io-he` and run `batch_convert` so the app serves `fragments/home-he-body.html` and `public/assets/home-he/` from that snapshot.

## Key Files

| File | What it does |
|------|-------------|
| `pipeline/discover.py` | Scans sitemap.xml → creates urls.json (merges Hebrew `/he/` if sitemap omits it) |
| `pipeline/merge_manifest_locale_roots.py` | Append `/he/` to existing `urls.json` without re-discovery |
| `landing-page/_batch_download.py` | Downloads HTML + assets |
| `pipeline/batch_convert.py` | Converts to Next.js artifacts |
| `pipeline/urls.json` | **State machine** (progress tracker) |
| `pipeline/include.example.txt` | Template for `--include-file` subset runs |
| `.team/` | Coordination files (multi-agent workflows) |
| `QUICK_START.sh` | Run full pipeline in one command |
| `PIPELINE.md` | Complete documentation |
| `SYSTEM_READY.md` | Architecture & next steps |
| `.claude/skills/discover-site-urls/SKILL.md` | Scanner skill |

## How It Works

```
1. Discover (✅ Done - 292 pages found)
   ↓
2. Download (pending - 292 URLs)
   ↓
3. Convert (pending - awaits downloads)
   ↓
4. Test & Ship (npm run dev)
```

## Stateful Progress Tracking

**`pipeline/urls.json`** is your manifest. Each URL progresses:

```
pending → downloading → downloaded → converting → converted → ready_for_production
```

Scripts **automatically update** status as they complete.

## Single vs Multi-Agent

### Single Agent (Start Here)
One person/session runs all steps sequentially. Simplest, no coordination needed.

```bash
python3 landing-page/_batch_download.py    # Download all
python3 pipeline/batch_convert.py            # Convert all
```

### Multi-Agent (Scale Up)
Multiple Claude Code sessions coordinate via `.team/` files:
- Session A: Downloader (claims next `pending` slug)
- Session B: Converter (claims next `downloaded` slug)
- Session C: QA (verifies converted pages)
- Session D: Coordinator (monitors progress)

See `.team/COORDINATION.md` for detailed team workflows.

## Status Dashboard

```bash
# Check progress
python3 -c "import json; d=json.load(open('pipeline/urls.json')); from collections import Counter; s=Counter(u['status'] for u in d['urls']); print('\\n'.join(f'{k}: {v}' for k,v in sorted(s.items())))"

# List next work (pending downloads)
python3 -c "import json; d=json.load(open('pipeline/urls.json')); [print(u['slug']) for u in d['urls'] if u['status']=='pending'][:5]"
```

## Common Tasks

```bash
# Download one page
python3 landing-page/_batch_download.py --only-slug triolla-io-about-us

# Convert one page
python3 pipeline/batch_convert.py --only-slug triolla-io-about-us

# Download all (batch)
cd landing-page && python3 _batch_download.py

# Convert all (batch)
python3 pipeline/batch_convert.py

# Check status
cat pipeline/urls.json | python3 -m json.tool | grep -A1 '"status"' | head -20

# Run full pipeline
./QUICK_START.sh
```

## Next Steps

1. **Test 1 page** (verify it works)
   ```bash
   cd landing-page && python3 _batch_download.py --only-slug triolla-io-about-us
   cd .. && python3 pipeline/batch_convert.py --only-slug triolla-io-about-us
   cd web && npm run dev
   ```

2. **Check DevTools** (verify no 404s, fonts load, animations work)

3. **Scale to all 292** (if test passes)
   ```bash
   ./QUICK_START.sh
   ```

4. **Handle issues** as they arise (check PIPELINE.md for common patterns)

## Architecture

```
triolla.io (website)
    ↓ (discovery)
pipeline/urls.json (292 pages)
    ↓ (download)
landing-page/<slug>/ (HTML + assets)
    ↓ (convert)
web/ (Next.js routes)
    ↓ (test)
npm run dev → http://localhost:3000
```

## Documentation

- **PIPELINE.md** — Full system guide, troubleshooting, architecture
- **SYSTEM_READY.md** — Overview, status, next actions
- **.team/COORDINATION.md** — Team orchestration playbook
- **.claude/skills/discover-site-urls/SKILL.md** — Scanner skill details

## You're Ready! 🎉

Everything is set up. Start with the **1-page test**, verify it works, then scale to all 292 pages.

Questions? Check PIPELINE.md or SYSTEM_READY.md.

Happy converting! 🚀
