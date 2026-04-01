#!/usr/bin/env python3
"""
Merge a fresh triolla.io sitemap into pipeline/urls.json without wiping status.

Unlike discover.py (which overwrites the manifest), this script:
  - Adds new URLs as status \"pending\"
  - Keeps status (and other fields) for URLs that already exist with the same `url`
  - Dedupes the sitemap by URL (sitemap sometimes lists the same loc twice)
  - Appends legacy rows whose `url` no longer appears in the sitemap (optional)

Usage (repo root):
  python3 pipeline/discover_merge.py triolla.io
  python3 pipeline/discover_merge.py triolla.io --manifest pipeline/urls.json --no-orphans
"""
from __future__ import annotations

import argparse
import json
import sys
from datetime import datetime, timezone
from pathlib import Path
from urllib.parse import urlparse

_PIPELINE = Path(__file__).resolve().parent
if str(_PIPELINE) not in sys.path:
    sys.path.insert(0, str(_PIPELINE))

import discover as d  # noqa: E402


def _norm_url(u: str) -> str:
    u = (u or "").strip()
    if not u.endswith("/"):
        u += "/"
    return u


def _dedupe_preserve_order(urls: list[str]) -> list[str]:
    seen: set[str] = set()
    out: list[str] = []
    for u in urls:
        nu = _norm_url(u)
        if nu in seen:
            continue
        seen.add(nu)
        out.append(nu)
    return out


def merge_manifest(
    domain: str,
    manifest_path: Path,
    *,
    keep_orphans: bool,
) -> dict:
    raw_urls, _ok = d.discover_from_sitemap(domain)
    if not raw_urls:
        print("ERROR: could not load any URLs from sitemap", file=sys.stderr)
        sys.exit(1)

    skip_patterns = ["wp-admin", "wp-json", "preview", "category", "tag", "author", "?"]
    fresh_urls: list[str] = []
    for url in raw_urls:
        if d.should_skip(url, skip_patterns):
            continue
        fresh_urls.append(_norm_url(url))
    fresh_urls = _dedupe_preserve_order(fresh_urls)
    fresh_set: set[str] = set(fresh_urls)

    old: dict | None = None
    if manifest_path.is_file():
        old = json.loads(manifest_path.read_text(encoding="utf-8"))

    old_by_url: dict[str, dict] = {}
    if old:
        for e in old.get("urls", []):
            u = e.get("url") or ""
            if not u:
                continue
            nu = _norm_url(u)
            if nu not in old_by_url:
                old_by_url[nu] = dict(e)

    merged: list[dict] = []
    for url in fresh_urls:
        path = urlparse(url).path or "/"
        slug = d.get_slug(url, domain)
        title = path.strip("/").split("/")[-1].replace("-", " ").title() or "Home"
        lang = d.extract_lang_from_url(url)
        if url in old_by_url:
            e = dict(old_by_url[url])
            e["url"] = url
            e["path"] = path
            e["slug"] = slug
            e["title"] = title
            e["lang"] = lang
            merged.append(e)
        else:
            merged.append(
                {
                    "url": url,
                    "slug": slug,
                    "path": path,
                    "title": title,
                    "lang": lang,
                    "status": "pending",
                }
            )

    d.merge_missing_locale_roots(domain, merged)

    if keep_orphans and old:
        merged_urls = {_norm_url(e["url"]) for e in merged}
        for e in old.get("urls", []):
            u = e.get("url")
            if not u:
                continue
            nu = _norm_url(u)
            if nu in fresh_set or nu in merged_urls:
                continue
            merged.append(dict(e))
            merged_urls.add(nu)

    now = datetime.now(timezone.utc).isoformat().replace("+00:00", "Z")
    meta_old = (old or {}).get("metadata") or {}
    manifest = {
        "domain": domain,
        "scrapedAt": now,
        "source": "sitemap+merge",
        "slugRule": (old or {}).get("slugRule", "host-dots-to-hyphens + path-segments"),
        "totalPages": len(merged),
        "urls": merged,
        "metadata": {
            **meta_old,
            "sitemapFetched": True,
            "sitemapUrl": f"https://{domain}/sitemap.xml",
            "pageCount": len(merged),
            "mergeTool": "pipeline/discover_merge.py",
        },
    }
    return manifest


def main() -> None:
    p = argparse.ArgumentParser(description="Merge sitemap into urls.json (preserve status)")
    p.add_argument("domain", help="e.g. triolla.io")
    p.add_argument(
        "--manifest",
        type=Path,
        default=Path("pipeline/urls.json"),
        help="Manifest path (relative to cwd unless absolute)",
    )
    p.add_argument(
        "--no-orphans",
        action="store_true",
        help="Do not append old rows whose URL disappeared from the sitemap",
    )
    p.add_argument("--dry-run", action="store_true", help="Print counts only; do not write")
    args = p.parse_args()

    domain = args.domain.strip().rstrip("/")
    manifest_path = args.manifest if args.manifest.is_absolute() else Path.cwd() / args.manifest

    merged = merge_manifest(domain, manifest_path, keep_orphans=not args.no_orphans)
    old_n = len(json.loads(manifest_path.read_text())["urls"]) if manifest_path.is_file() else 0
    new_n = len(merged["urls"])
    print(f"URLs in manifest: {old_n} -> {new_n} (after merge)")

    if args.dry_run:
        return

    manifest_path.parent.mkdir(parents=True, exist_ok=True)
    manifest_path.write_text(json.dumps(merged, indent=2) + "\n", encoding="utf-8")
    print(f"Wrote {manifest_path}")


if __name__ == "__main__":
    main()
