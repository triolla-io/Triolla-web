"""
Rewrite absolute triolla.io asset URLs in snapshot index.html to _assets/... when the
expected flat file exists. Mirrors landing-page/_download_snapshot.py naming so
extract_snapshot_fragment.py (local _assets/ mode) can populate css/js lists.

Some older or interrupted downloads left index.html un-rewritten while _assets/ is populated.
"""
from __future__ import annotations

import hashlib
import os
import re
from urllib.parse import unquote, urlparse

# Keep in sync with landing-page/_download_snapshot.py (safe_filename + guess_ext + ext append).


def _safe_filename(url: str, hint: str | None = None) -> str:
    p = urlparse(url)
    path = unquote(p.path or "/")
    base = os.path.basename(path) or "asset"
    base = re.sub(r"[^a-zA-Z0-9._-]", "_", base)
    if not base or base in (".", "_"):
        base = (hint or "asset").replace("/", "_")
    if p.query and len(p.query) < 80:
        base = f"{base}_{hashlib.md5(p.query.encode()).hexdigest()[:8]}"
    elif p.query:
        base = f"{base}_{hashlib.md5(url.encode()).hexdigest()[:10]}"
    return base[:180] or hashlib.md5(url.encode()).hexdigest()[:16]


def _guess_ext(url: str) -> str:
    path = urlparse(url).path.lower()
    for e in (
        ".css",
        ".js",
        ".png",
        ".jpg",
        ".jpeg",
        ".gif",
        ".svg",
        ".webp",
        ".woff2",
        ".woff",
        ".ttf",
        ".ico",
    ):
        if path.endswith(e):
            return e
    return ""


def _expected_asset_rel(url: str) -> str:
    fname = _safe_filename(url)
    ext = _guess_ext(url)
    if ext and not fname.lower().endswith(ext):
        fname = fname + ext
    return "_assets/" + fname


def _rewrite_quoted(html: str, old: str, new: str) -> str:
    if old == new:
        return html
    esc = re.escape(old)
    return re.sub(rf'(["\']){esc}\1', rf"\1{new}\1", html)


def rewrite_absolute_origin_links(html: str, landing_page_dir: str, origin: str = "https://triolla.io") -> str:
    """
    Replace quoted absolute URLs under origin with _assets/... when that file exists on disk.
    Longest URLs first (same as _download_snapshot rewrite pass).
    """
    o = origin.rstrip("/")
    assets_dir = os.path.join(landing_page_dir, "_assets")
    if not os.path.isdir(assets_dir):
        return html

    found: set[str] = set()
    for m in re.finditer(rf"{re.escape(o)}/[^'\"\s>]+", html, re.I):
        u = m.group(0).split("#")[0]
        if u.startswith(o + "/"):
            found.add(u)

    for url in sorted(found, key=len, reverse=True):
        rel = _expected_asset_rel(url)
        disk = os.path.join(landing_page_dir, rel.replace("/", os.sep))
        if not os.path.isfile(disk):
            continue
        nu = url.split("#")[0]
        html = _rewrite_quoted(html, url, rel)
        if nu != url:
            html = _rewrite_quoted(html, nu, rel)

    return html


def index_needs_asset_rewrite(index_html_path: str, origin: str = "https://triolla.io") -> bool:
    """True if index still loads theme/plugin CSS from absolute origin (not _assets/)."""
    o = origin.rstrip("/")
    try:
        with open(index_html_path, encoding="utf-8", errors="replace") as f:
            html = f.read(800_000)
    except OSError:
        return False
    # Already using local mirror paths for stylesheets.
    if re.search(
        r"<link\b[^>]*\brel\s*=\s*['\"]stylesheet['\"][^>]*\bhref\s*=\s*['\"]_assets/",
        html,
        re.I,
    ):
        return False
    return bool(
        re.search(
            rf"<link\b[^>]*\brel\s*=\s*['\"]stylesheet['\"][^>]*\bhref\s*=\s*['\"]{re.escape(o)}/",
            html,
            re.I,
        )
    )
