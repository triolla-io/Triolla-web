#!/usr/bin/env python3
"""
Re-run extract + asset sync for Next routes whose *-deps.json has an empty ``css`` list.

Two common causes:
1) index.html still has absolute https://triolla.io/... links — extract sees no _assets/ hrefs.
2) ``_assets/`` is nearly empty (failed/partial download) — rewrite cannot map URLs to files.

For (2), we copy missing files from a donor snapshot (default: triolla-io-agritech, same Triolla
theme) into ``landing-page/<slug>/_assets/``, then extract + sync.

Usage:
  python3 pipeline/repair_empty_snapshot_deps.py
  python3 pipeline/repair_empty_snapshot_deps.py --dry-run
  python3 pipeline/repair_empty_snapshot_deps.py --donor-slug triolla-io-fintech-finance
"""
from __future__ import annotations

import argparse
import json
import os
import shutil
import subprocess
import sys

_REPO = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

# Below this file count, treat snapshot as incomplete and merge theme assets from donor.
_MIN_ASSET_FILES = 40


def _backfill_assets_from_donor(
    repo: str,
    target_slug_folder: str,
    donor_slug: str,
    dry_run: bool,
) -> int:
    """Copy missing files from donor _assets into target _assets. Returns files copied."""
    donor_dir = os.path.join(repo, "landing-page", donor_slug, "_assets")
    target_dir = os.path.join(repo, "landing-page", target_slug_folder, "_assets")
    if not os.path.isdir(donor_dir):
        print(f"  (donor missing: {donor_dir})", file=sys.stderr)
        return 0
    os.makedirs(target_dir, exist_ok=True)
    n = 0
    for name in os.listdir(donor_dir):
        src = os.path.join(donor_dir, name)
        dst = os.path.join(target_dir, name)
        if not os.path.isfile(src) or os.path.exists(dst):
            continue
        if dry_run:
            n += 1
            continue
        shutil.copy2(src, dst)
        n += 1
    return n


def main() -> int:
    ap = argparse.ArgumentParser(description="Repair deps.json with empty css via batch_convert")
    ap.add_argument("--repo-root", default=_REPO)
    ap.add_argument("--dry-run", action="store_true")
    ap.add_argument(
        "--donor-slug",
        default="triolla-io-agritech",
        help="Landing-page folder to copy missing _assets/ files from (portfolio/theme sibling)",
    )
    args = ap.parse_args()
    repo = os.path.abspath(args.repo_root)
    app = os.path.join(repo, "web", "app")
    bc = os.path.join(repo, "pipeline", "batch_convert.py")

    skip_prefixes = ("blog-",)
    skip_dirs = frozenset({"lib", "api", "he", "[lang]"})

    to_fix: list[tuple[str, str]] = []
    for name in sorted(os.listdir(app)):
        if name.startswith(skip_prefixes):
            continue
        if name in skip_dirs or name.endswith(".tsx"):
            continue
        dir_path = os.path.join(app, name)
        if not os.path.isdir(dir_path):
            continue
        deps_path = os.path.join(dir_path, f"{name}-deps.json")
        if not os.path.isfile(deps_path):
            continue
        try:
            with open(deps_path, encoding="utf-8") as f:
                data = json.load(f)
        except (OSError, json.JSONDecodeError):
            continue
        css = data.get("css")
        if not isinstance(css, list) or len(css) > 0:
            continue
        slug = "triolla-io-" + name
        index_html = os.path.join(repo, "landing-page", slug, "index.html")
        if not os.path.isfile(index_html):
            print(f"skip {name}: no {slug}/index.html")
            continue
        to_fix.append((name, slug))

    if not to_fix:
        print("No routes with empty css in *-deps.json (under web/app/*).")
        return 0

    print(f"Repairing {len(to_fix)} route(s) with empty css…")
    for _route_name, slug in to_fix:
        print(f"  → {slug}")
        assets_dir = os.path.join(repo, "landing-page", slug, "_assets")
        n_existing = len(os.listdir(assets_dir)) if os.path.isdir(assets_dir) else 0
        if n_existing < _MIN_ASSET_FILES:
            added = _backfill_assets_from_donor(repo, slug, args.donor_slug, args.dry_run)
            print(f"    backfill _assets/: {n_existing} files → merged from {args.donor_slug} ({added} new)")
        if args.dry_run:
            continue
        r = subprocess.run(
            [
                sys.executable,
                bc,
                "--repo-root",
                repo,
                "--only-slug",
                slug,
                "--allow-converted",
            ],
            cwd=repo,
        )
        if r.returncode != 0:
            print(f"FAILED {slug} (exit {r.returncode})", file=sys.stderr)
            return r.returncode or 1

    print("Done.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
