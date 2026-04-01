#!/usr/bin/env python3
"""
If urls.json says `downloading` but landing-page/<slug>/index.html exists, set `downloaded`.

Download workers ignore `downloading`, so stuck rows never finish without this or
`download_worker.py --release-stuck` (which forces re-download).

Usage (from repo root):
  python3 pipeline/reconcile_downloading_with_disk.py
  python3 pipeline/reconcile_downloading_with_disk.py --dry-run
"""
from __future__ import annotations

import argparse
import os
import sys

_REPO = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if _REPO not in sys.path:
    sys.path.insert(0, os.path.join(_REPO, "pipeline"))

from manifest_lock import manifest_transaction  # noqa: E402


def main() -> int:
    ap = argparse.ArgumentParser(description="Reconcile stuck downloading rows with on-disk snapshots")
    ap.add_argument("--manifest", default=os.path.join(_REPO, "pipeline", "urls.json"))
    ap.add_argument("--repo-root", default=_REPO)
    ap.add_argument("--dry-run", action="store_true")
    args = ap.parse_args()

    repo = os.path.abspath(args.repo_root)
    manifest = os.path.abspath(args.manifest)

    with manifest_transaction(manifest) as (data, save):
        fixed = []
        for e in data["urls"]:
            if e.get("status") != "downloading":
                continue
            slug = e["slug"]
            index_html = os.path.join(repo, "landing-page", slug, "index.html")
            if os.path.isfile(index_html):
                e["status"] = "downloaded"
                fixed.append(slug)
        if fixed and not args.dry_run:
            save()
        elif fixed and args.dry_run:
            pass  # do not save

    if args.dry_run and fixed:
        print(f"Would set {len(fixed)} row(s) to downloaded: {fixed[:20]}{'...' if len(fixed) > 20 else ''}")
    elif fixed:
        print(f"Set {len(fixed)} manifest row(s) from downloading → downloaded (index.html present).")
    else:
        print("No downloading rows with a matching landing-page/<slug>/index.html.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
