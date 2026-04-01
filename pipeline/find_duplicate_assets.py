#!/usr/bin/env python3
"""Find byte-identical files under landing-page/ (size bucket + SHA256).

Usage:
  python3 pipeline/find_duplicate_assets.py [--root DIR] [--json OUT.json]

Default root is repo-root/landing-page. Only files under **/_assets/** are scanned
unless --all-landing-page is passed.
"""
from __future__ import annotations

import argparse
import hashlib
import json
import os
import sys
from collections import defaultdict


def file_sha256(path: str, chunk: int = 1024 * 1024) -> str:
    h = hashlib.sha256()
    with open(path, "rb") as f:
        while True:
            b = f.read(chunk)
            if not b:
                break
            h.update(b)
    return h.hexdigest()


def main() -> int:
    ap = argparse.ArgumentParser(description="Find duplicate asset files by content hash.")
    ap.add_argument(
        "--root",
        default=None,
        help="Directory to scan (default: <repo>/landing-page)",
    )
    ap.add_argument(
        "--all-landing-page",
        action="store_true",
        help="Include all files under root (default: only **/_assets/**)",
    )
    ap.add_argument("--json", metavar="FILE", help="Write duplicate groups as JSON")
    args = ap.parse_args()

    repo = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    root = os.path.abspath(args.root or os.path.join(repo, "landing-page"))
    if not os.path.isdir(root):
        print(f"Not a directory: {root}", file=sys.stderr)
        return 1

    size_map: dict[int, list[str]] = defaultdict(list)
    scanned = 0
    for dirpath, _dirnames, filenames in os.walk(root):
        for name in filenames:
            path = os.path.join(dirpath, name)
            if not args.all_landing_page:
                parts = os.path.normpath(path).split(os.sep)
                if "_assets" not in parts:
                    continue
            try:
                st = os.stat(path)
            except OSError:
                continue
            if not os.path.isfile(path):
                continue
            size_map[st.st_size].append(path)
            scanned += 1

    hash_map: dict[str, list[str]] = defaultdict(list)
    hash_jobs = sum(len(paths) for sz, paths in size_map.items() if len(paths) > 1 and sz >= 0)
    done = 0
    for size, paths in size_map.items():
        if len(paths) < 2:
            continue
        for p in paths:
            digest = file_sha256(p)
            hash_map[digest].append(p)
            done += 1
            if done % 500 == 0:
                print(f"  hashing duplicates bucket: {done}/{hash_jobs}", file=sys.stderr)

    dup_groups = [paths for paths in hash_map.values() if len(paths) > 1]
    dup_groups.sort(key=lambda ps: len(ps) * os.path.getsize(ps[0]), reverse=True)

    total_waste = 0
    total_dup_files = 0
    for paths in dup_groups:
        sz = os.path.getsize(paths[0])
        total_waste += sz * (len(paths) - 1)
        total_dup_files += len(paths) - 1

    print(f"Root: {root}")
    print(f"Scope: {'all files' if args.all_landing_page else '**/_assets/** only'}")
    print(f"Files scanned: {scanned}")
    print(f"Duplicate content groups: {len(dup_groups)}")
    print(f"Redundant copies (count - 1 per group): {total_dup_files}")
    print(f"Approx. redundant bytes (if only one copy kept): {total_waste:,} ({total_waste / (1024**3):.2f} GiB)")
    print()
    for paths in dup_groups[:50]:
        sz = os.path.getsize(paths[0])
        print(f"--- {len(paths)} copies, {sz:,} bytes each (waste {(len(paths)-1)*sz:,}) ---")
        for p in sorted(paths)[:12]:
            rel = os.path.relpath(p, repo)
            print(f"  {rel}")
        if len(paths) > 12:
            print(f"  ... and {len(paths) - 12} more")
    if len(dup_groups) > 50:
        print(f"\n... {len(dup_groups) - 50} more groups (use --json for full list)")

    if args.json:
        out = []
        for paths in dup_groups:
            sz = os.path.getsize(paths[0])
            out.append(
                {
                    "size_bytes": sz,
                    "count": len(paths),
                    "wasted_bytes": sz * (len(paths) - 1),
                    "paths": [os.path.relpath(p, repo) for p in sorted(paths)],
                }
            )
        with open(args.json, "w", encoding="utf-8") as f:
            json.dump(
                {
                    "root": root,
                    "scope": "all" if args.all_landing_page else "_assets_only",
                    "scanned_files": scanned,
                    "groups": out,
                    "summary": {
                        "duplicate_groups": len(dup_groups),
                        "redundant_copies": total_dup_files,
                        "wasted_bytes": total_waste,
                    },
                },
                f,
                indent=2,
            )
        print(f"\nWrote {args.json}")

    return 0


if __name__ == "__main__":
    raise SystemExit(main())
