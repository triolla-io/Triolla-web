#!/usr/bin/env python3
"""
Parallel-safe download worker: claims one pending/failed slug at a time (flock), then runs
landing-page/_batch_download.py --only-slug for that slug.

Run several terminals from the repo root, e.g.:
  python3 pipeline/download_worker.py
  python3 pipeline/download_worker.py

Do not run the full sequential _batch_download.py at the same time as workers.
"""
from __future__ import annotations

import argparse
import os
import subprocess
import sys

_REPO = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
_PIPELINE = os.path.join(_REPO, "pipeline")
if _PIPELINE not in sys.path:
    sys.path.insert(0, _PIPELINE)

import include_filter as _inc
from manifest_lock import manifest_transaction, release_stuck_claims


def _urls_in_claim_order(urls: list, order: str):
    if order == "end":
        return reversed(urls)
    return urls


def claim_next_download(manifest_path: str, include, order: str) -> str | None:
    with manifest_transaction(manifest_path) as (data, save):
        for e in _urls_in_claim_order(data["urls"], order):
            if e["status"] not in ("pending", "failed"):
                continue
            if not _inc.entry_matches(e, include):
                continue
            slug = e["slug"]
            # Duplicate manifest rows can share the same slug; claim all of them.
            for e2 in data["urls"]:
                if e2["slug"] == slug and e2["status"] in ("pending", "failed"):
                    e2["status"] = "downloading"
            save()
            return slug
    return None


def main() -> None:
    parser = argparse.ArgumentParser(description="Parallel download worker (claim + one slug)")
    parser.add_argument("--repo-root", default=_REPO, help="Repository root (default: auto)")
    parser.add_argument("--manifest", default="pipeline/urls.json", help="Manifest path (relative to repo-root unless absolute)")
    parser.add_argument(
        "--include-file",
        metavar="PATH",
        help="Same as _batch_download --include-file",
    )
    parser.add_argument("--timeout", type=int, default=600, help="Per-page snapshot timeout (seconds)")
    parser.add_argument("--max-jobs", type=int, default=0, help="Stop after N claims (0 = until queue empty)")
    parser.add_argument(
        "--order",
        choices=("start", "end"),
        default="end",
        help="Claim pending/failed rows from the end of urls.json first (default: end) or from the start",
    )
    parser.add_argument(
        "--release-stuck",
        action="store_true",
        help="Reset downloading→pending (run only when no workers are active)",
    )
    args = parser.parse_args()

    repo = os.path.abspath(args.repo_root)
    manifest_path = args.manifest if os.path.isabs(args.manifest) else os.path.join(repo, args.manifest)

    if not os.path.isfile(manifest_path):
        print(f"ERROR: manifest not found: {manifest_path}", file=sys.stderr)
        sys.exit(1)

    if args.release_stuck:
        d, c = release_stuck_claims(manifest_path)
        print(f"Released stuck claims: {d} downloading→pending, {c} converting→downloaded.")
        return

    if args.include_file:
        if not os.path.isfile(args.include_file):
            print(f"ERROR: include file not found: {args.include_file}", file=sys.stderr)
            sys.exit(1)
    include = _inc.load_include_file(args.include_file) if args.include_file else None
    if args.include_file and include is None:
        print(f"ERROR: include file has no valid lines: {args.include_file}", file=sys.stderr)
        sys.exit(1)

    download_script = os.path.join(repo, "landing-page", "_batch_download.py")
    if not os.path.isfile(download_script):
        print(f"ERROR: {download_script} not found", file=sys.stderr)
        sys.exit(1)

    print("📥 Download worker (Ctrl+C to stop; re-run to continue)")
    print(f"   Manifest: {manifest_path}")
    print(f"   Claim order: {args.order} of urls list")
    print()

    jobs = 0
    try:
        while True:
            slug = claim_next_download(manifest_path, include, args.order)
            if not slug:
                print("✓ No more pending/failed slugs to claim (for this include filter).")
                break

            jobs += 1
            print(f"── Claimed {slug} ──")
            cmd = [
                sys.executable,
                download_script,
                "--manifest",
                manifest_path,
                "--repo-root",
                repo,
                "--only-slug",
                slug,
                "--timeout",
                str(args.timeout),
            ]
            if args.include_file:
                cmd.extend(["--include-file", os.path.abspath(args.include_file)])

            rc = subprocess.run(cmd, cwd=repo).returncode
            if rc != 0:
                print(f"⚠️  _batch_download exited {rc} for {slug}", file=sys.stderr)

            if args.max_jobs and jobs >= args.max_jobs:
                print(f"Stopped after --max-jobs={args.max_jobs}")
                break
    except KeyboardInterrupt:
        print("\nInterrupted. If a slug is stuck in `downloading`, run:", file=sys.stderr)
        print(f"  python3 pipeline/download_worker.py --release-stuck", file=sys.stderr)
        sys.exit(130)


if __name__ == "__main__":
    main()
