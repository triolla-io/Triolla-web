#!/usr/bin/env python3
"""Fetch HTML + linked assets for offline snapshot. Usage: python3 _download_snapshot.py <URL> <out-dir>"""
from __future__ import annotations

import hashlib
import json
import mimetypes
import os
import re
import ssl
import sys
from urllib.parse import urljoin, urlparse, unquote, urlunparse
from urllib.request import Request, urlopen

if len(sys.argv) < 3:
    print("Usage: _download_snapshot.py <URL> <out-dir>")
    sys.exit(1)

BASE_URL = sys.argv[1].rstrip("/") + "/"
OUT_DIR = os.path.abspath(sys.argv[2])
ASSETS_DIR = os.path.join(OUT_DIR, "_assets")

UA = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
CTX = ssl.create_default_context()


def fetch_bytes(url: str) -> tuple[bytes, str]:
    req = Request(url, headers={"User-Agent": UA})
    with urlopen(req, context=CTX, timeout=90) as r:
        data = r.read()
        ctype = r.headers.get_content_type() or ""
    return data, ctype


def safe_filename(url: str, hint: str | None = None) -> str:
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


def guess_ext(ctype: str, url: str) -> str:
    ct = (ctype or "").split(";")[0].strip().lower()
    ext = mimetypes.guess_extension(ct, strict=False) if ct else None
    if ext in (".htm",):
        ext = ".html"
    if ext:
        return ext
    path = urlparse(url).path.lower()
    for e in (".css", ".js", ".png", ".jpg", ".jpeg", ".gif", ".svg", ".webp", ".woff2", ".woff", ".ttf", ".ico"):
        if path.endswith(e):
            return e
    return ""


def collect_urls_from_html(html: str, base: str) -> set[str]:
    out: set[str] = set()
    for attr in ("src", "href"):
        for m in re.finditer(rf"\b{attr}\s*=\s*[\"']([^\"']+)[\"']", html, re.I):
            u = m.group(1).strip()
            if not u or u.startswith(("#", "data:", "mailto:", "tel:", "javascript:")):
                continue
            abs_u = urljoin(base, u)
            if abs_u.startswith("http"):
                out.add(abs_u.split("#")[0])
    return out


def collect_urls_from_css(css_text: str, base: str) -> set[str]:
    out: set[str] = set()
    for m in re.finditer(r"url\(\s*[\"']?([^\"')]+)[\"']?\s*\)", css_text, re.I):
        u = m.group(1).strip()
        if u.startswith(("data:", "#")):
            continue
        abs_u = urljoin(base, u)
        if abs_u.startswith("http"):
            out.add(abs_u.split("#")[0])
    for m in re.finditer(r"@import\s+(?:url\(\s*[\"']?([^\"')]+)[\"']?\s*\)|[\"']([^\"']+)[\"'])", css_text, re.I):
        u = (m.group(1) or m.group(2) or "").strip()
        if not u:
            continue
        abs_u = urljoin(base, u)
        if abs_u.startswith("http"):
            out.add(abs_u.split("#")[0])
    return out


def main() -> None:
    os.makedirs(ASSETS_DIR, exist_ok=True)
    seen: dict[str, str] = {}  # url -> relative path from OUT_DIR
    queue: list[str] = []

    html_bytes, html_ct = fetch_bytes(BASE_URL)
    charset = "utf-8"
    m = re.search(rb"charset\s*=\s*([a-zA-Z0-9_-]+)", html_bytes[:8000], re.I)
    if m:
        charset = m.group(1).decode("ascii", errors="ignore")
    html = html_bytes.decode(charset, errors="replace")

    main_path = os.path.join(OUT_DIR, "index.html")
    with open(main_path, "w", encoding="utf-8") as f:
        f.write(html)

    def enqueue(url: str) -> None:
        if url not in seen and url not in queue:
            queue.append(url)

    for u in collect_urls_from_html(html, BASE_URL):
        enqueue(u)

    while queue:
        url = queue.pop(0)
        if url in seen:
            continue
        try:
            data, ctype = fetch_bytes(url)
        except Exception as e:
            print(f"skip {url!r}: {e}")
            continue

        fname = safe_filename(url)
        ext = guess_ext(ctype, url)
        if ext and not fname.lower().endswith(ext):
            fname = fname + ext

        rel = os.path.join("_assets", fname)
        disk = os.path.join(OUT_DIR, rel)
        if os.path.exists(disk):
            stem, e = os.path.splitext(fname)
            fname = f"{stem}_{hashlib.md5(url.encode()).hexdigest()[:8]}{e}"
            rel = os.path.join("_assets", fname)
            disk = os.path.join(OUT_DIR, rel)

        if ctype and "html" in ctype.lower():
            print("skip html asset", url)
            continue

        with open(disk, "wb") as f:
            f.write(data)
        seen[url] = rel.replace("\\", "/")
        print("saved", rel)

        if "css" in ctype or url.lower().endswith(".css"):
            try:
                ctext = data.decode("utf-8", errors="replace")
            except Exception:
                ctext = data.decode("latin-1", errors="replace")
            for u2 in collect_urls_from_css(ctext, url):
                enqueue(u2)

    # Rewrite index.html: replace full URLs with local paths
    with open(main_path, encoding="utf-8") as f:
        h = f.read()

    def strip_fragment(u: str) -> str:
        return u.split("#")[0]

    def rewrite_quoted(html: str, old: str, new: str) -> str:
        if old == new:
            return html
        esc = re.escape(old)
        return re.sub(rf'(["\']){esc}\1', rf"\1{new}\1", html)

    for url in sorted(seen.keys(), key=len, reverse=True):
        local = seen[url]
        nu = strip_fragment(url)
        h = rewrite_quoted(h, url, local)
        if nu != url:
            h = rewrite_quoted(h, nu, local)

    parsed_base = urlparse(BASE_URL)
    origin = urlunparse((parsed_base.scheme, parsed_base.netloc, "", "", "", ""))
    for path_only in set(re.findall(r'(?:src|href)\s*=\s*["\'](/[^"\']+)["\']', h, re.I)):
        abs_u = strip_fragment(urljoin(origin + "/", path_only.lstrip("/")))
        if abs_u in seen:
            h = rewrite_quoted(h, path_only, seen[abs_u])

    with open(main_path, "w", encoding="utf-8") as f:
        f.write(h)

    # Rewrite url(...) inside saved CSS files
    for rel_path in set(seen.values()):
        if not rel_path.endswith(".css"):
            continue
        cpath = os.path.join(OUT_DIR, rel_path)
        if not os.path.isfile(cpath):
            continue
        try:
            ctext = open(cpath, encoding="utf-8", errors="replace").read()
        except OSError:
            continue
        orig = ctext
        for u in sorted(seen.keys(), key=len, reverse=True):
            loc = seen[u]
            loc_same = os.path.basename(loc)
            for pat in (
                rf"url\(\s*{re.escape(u)}\s*\)",
                rf"url\(\s*[\"']{re.escape(u)}[\"']\s*\)",
            ):
                ctext = re.sub(pat, f"url({loc_same})", ctext, flags=re.I)
        if ctext != orig:
            with open(cpath, "w", encoding="utf-8") as f:
                f.write(ctext)

    manifest = os.path.join(OUT_DIR, "_manifest.json")
    with open(manifest, "w", encoding="utf-8") as f:
        json.dump(seen, f, indent=0, sort_keys=True)

    print("wrote", main_path, "assets", len(seen))


if __name__ == "__main__":
    main()
