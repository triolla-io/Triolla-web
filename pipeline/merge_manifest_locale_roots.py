#!/usr/bin/env python3
"""Append missing locale roots (e.g. Hebrew /he/) to pipeline/urls.json without re-scraping."""
import json
import os
import sys

_REPO = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if _REPO not in sys.path:
    sys.path.insert(0, _REPO)

from pipeline.discover import get_slug, merge_missing_locale_roots  # noqa: E402


def main():
    path = os.path.join(_REPO, "pipeline", "urls.json")
    if not os.path.isfile(path):
        print(f"Missing {path}", file=sys.stderr)
        sys.exit(1)
    with open(path, encoding="utf-8") as f:
        data = json.load(f)
    domain = data.get("domain", "triolla.io")
    entries = data.get("urls", [])
    before = len(entries)
    merge_missing_locale_roots(domain, entries)
    added = len(entries) - before
    if added:
        data["urls"] = entries
        data["totalPages"] = len(entries)
        with open(path, "w", encoding="utf-8") as f:
            json.dump(data, f, indent=2)
        he_url = f"https://{domain.rstrip('/')}/he/"
        print(f"Added Hebrew homepage manifest entry: {he_url} (slug {get_slug(he_url, domain)})")
    else:
        print("Hebrew homepage (/he/) already in manifest; no changes.")


if __name__ == "__main__":
    main()
