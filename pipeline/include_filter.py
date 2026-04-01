"""Shared helpers for --include-file (slug, path, or URL per line)."""
from __future__ import annotations

import os
from typing import Any


def _norm_url(u: str) -> str:
    return u.split("#", 1)[0].rstrip("/")


def _norm_path(p: str) -> str:
    p = (p or "/").strip()
    if not p.startswith("/"):
        p = "/" + p
    out = p.rstrip("/")
    return out if out else "/"


def load_include_file(filepath: str) -> tuple[set[str], set[str], set[str]] | None:
    """Return (slugs, urls, paths). None if filepath is empty or missing."""
    if not filepath or not os.path.isfile(filepath):
        return None
    slugs: set[str] = set()
    urls: set[str] = set()
    paths: set[str] = set()
    with open(filepath, encoding="utf-8") as f:
        for line in f:
            s = line.split("#", 1)[0].strip()
            if not s:
                continue
            if s.startswith("http://") or s.startswith("https://"):
                urls.add(_norm_url(s))
            elif s.startswith("/"):
                np = _norm_path(s)
                paths.add(np)
                if np != "/":
                    paths.add(np + "/")
            else:
                slugs.add(s)
    if not slugs and not urls and not paths:
        return None
    return slugs, urls, paths


def entry_matches(entry: dict[str, Any], inc: tuple[set[str], set[str], set[str]] | None) -> bool:
    if inc is None:
        return True
    slugs, urls, paths = inc
    if entry.get("slug") in slugs:
        return True
    u = _norm_url(entry.get("url", ""))
    if u in urls:
        return True
    ep = _norm_path(entry.get("path", "/"))
    if ep in paths:
        return True
    if ep != "/" and (ep + "/") in paths:
        return True
    if ep.lstrip("/") in {p.lstrip("/") for p in paths if p != "/"}:
        return True
    return False
