#!/usr/bin/env python3
"""
For each app/blog-<slug>/ that has blog-<slug>-deps.json:
  1. Download https://triolla.io/blog/<slug>/ → landing-page/triolla-io-blog-<slug>/
  2. Run extract_snapshot_fragment.py → fragments + deps
  3. Copy _assets → public/assets/blog-<slug>

Usage:
  python3 scripts/sync_all_blog_snapshots.py              # only blogs missing fragment or empty assets
  python3 scripts/sync_all_blog_snapshots.py --all      # re-download and refresh every blog
  python3 scripts/sync_all_blog_snapshots.py --slug designing-...
"""
from __future__ import annotations

import argparse
import shutil
import subprocess
import sys
from concurrent.futures import ThreadPoolExecutor, as_completed
from pathlib import Path

REPO = Path(__file__).resolve().parents[2]
WEB = REPO / "web"
APP = WEB / "app"
LANDING = REPO / "landing-page"
DOWNLOADER = LANDING / "_download_snapshot.py"
EXTRACT = WEB / "scripts" / "extract_snapshot_fragment.py"


def iter_slugs() -> list[str]:
    slugs: list[str] = []
    for d in sorted(APP.iterdir()):
        if not d.is_dir() or not d.name.startswith("blog-"):
            continue
        slug = d.name.removeprefix("blog-")
        if (d / f"blog-{slug}-deps.json").is_file():
            slugs.append(slug)
    return slugs


def needs_work(slug: str) -> bool:
    frag = WEB / "public" / "fragments" / f"blog-{slug}-body.html"
    assets = WEB / "public" / "assets" / f"blog-{slug}"
    if not frag.is_file():
        return True
    if not assets.is_dir():
        return True
    try:
        next(assets.iterdir())
    except StopIteration:
        return True
    return False


def download_snapshot(slug: str) -> tuple[str, bool, str]:
    url = f"https://triolla.io/blog/{slug}/"
    out = LANDING / f"triolla-io-blog-{slug}"
    if not DOWNLOADER.is_file():
        return slug, False, f"missing {DOWNLOADER}"
    r = subprocess.run(
        [sys.executable, str(DOWNLOADER), url, str(out)],
        capture_output=True,
        text=True,
        timeout=300,
    )
    if r.returncode != 0:
        return slug, False, (r.stderr or r.stdout or "download failed")[:500]
    index = out / "index.html"
    if not index.is_file():
        return slug, False, "no index.html after download"
    return slug, True, "ok"


def extract_and_sync_assets(slug: str) -> tuple[str, bool, str]:
    landing_dir = LANDING / f"triolla-io-blog-{slug}"
    index = landing_dir / "index.html"
    if not index.is_file():
        return slug, False, f"missing {index}"

    body_out = WEB / "public" / "fragments" / f"blog-{slug}-body.html"
    deps_out = APP / f"blog-{slug}" / f"blog-{slug}-deps.json"
    asset_base = f"/assets/blog-{slug}"

    r = subprocess.run(
        [
            sys.executable,
            str(EXTRACT),
            "--html",
            str(index.resolve()),
            "--out-body",
            str(body_out.relative_to(WEB)) if body_out.is_relative_to(WEB) else str(body_out),
            "--out-deps",
            str(deps_out.relative_to(WEB)) if deps_out.is_relative_to(WEB) else str(deps_out),
            "--asset-base",
            asset_base,
            "--rewrite-origin",
            "https://triolla.io",
        ],
        cwd=str(WEB),
        capture_output=True,
        text=True,
        timeout=120,
    )
    if r.returncode != 0:
        return slug, False, (r.stderr or r.stdout or "extract failed")[:800]

    src_assets = landing_dir / "_assets"
    dest_assets = WEB / "public" / "assets" / f"blog-{slug}"
    if not src_assets.is_dir():
        return slug, False, f"missing _assets for {slug}"

    if dest_assets.exists():
        shutil.rmtree(dest_assets)
    shutil.copytree(src_assets, dest_assets)

    return slug, True, "ok"


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--all", action="store_true", help="Process every blog, not only missing")
    ap.add_argument("--slug", action="append", dest="slugs", metavar="SLUG", help="Only these slug(s)")
    ap.add_argument("--workers", type=int, default=3, help="Parallel downloads")
    args = ap.parse_args()

    if not EXTRACT.is_file():
        print(f"missing {EXTRACT}", file=sys.stderr)
        return 1

    slugs = list(args.slugs) if args.slugs else iter_slugs()
    todo = list(slugs)
    if not args.all and not args.slugs:
        todo = [s for s in todo if needs_work(s)]

    print(f"Blog snapshots to sync: {len(todo)}", flush=True)
    if not todo:
        return 0

    failures: list[tuple[str, str]] = []

    def download_and_sync(slug: str) -> tuple[str, bool, str]:
        s, ok, msg = download_snapshot(slug)
        if not ok:
            return slug, False, msg
        _s, ok2, msg2 = extract_and_sync_assets(slug)
        if not ok2:
            return slug, False, f"download ok but {msg2}"
        return slug, True, "ok"

    if args.workers <= 1:
        for slug in todo:
            slug, ok, msg = download_and_sync(slug)
            if not ok:
                failures.append((slug, msg))
                print(f"[FAIL] {slug}: {msg}", flush=True)
            else:
                print(f"[OK] {slug}", flush=True)
    else:
        with ThreadPoolExecutor(max_workers=args.workers) as ex:
            futs = {ex.submit(download_and_sync, s): s for s in todo}
            for fut in as_completed(futs):
                slug, ok, msg = fut.result()
                if not ok:
                    failures.append((slug, msg))
                    print(f"[FAIL] {slug}: {msg}", flush=True)
                else:
                    print(f"[OK] {slug}", flush=True)

    if failures:
        print(f"\nFailed ({len(failures)}):", flush=True)
        for s, m in failures:
            print(f"  {s}: {m[:200]}", flush=True)
        return 1
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
