#!/usr/bin/env python3
"""
Deduplicate identical image/SVG binaries under public/assets into public/assets/_shared.

Only merges files with matching SHA256. Updates:
- Absolute paths /assets/<slug>/.../file → /assets/_shared/<canonical-name>
- Per-slug CSS: url(../file), url(./file), url(file), url('file') → url('/assets/_shared/...')

Skips public/assets/_fonts (fonts live in _fonts).

Usage:
  python3 app/scripts/dedupe-public-shared-static-assets.py [--dry-run]
"""

from __future__ import annotations

import argparse
import hashlib
import re
import shutil
from collections import Counter, defaultdict
from pathlib import Path

REPO = Path(__file__).resolve().parents[2]
ASSETS = REPO / "public" / "assets"
SHARED = ASSETS / "_shared"

EXTS = {".svg", ".png", ".jpg", ".jpeg", ".webp", ".gif", ".ico"}
SKIP_TOP = {"_fonts"}

TEXT_EXT = {".css", ".html", ".tsx", ".ts", ".json", ".js", ".mdx"}
SKIP_PARTS = {"node_modules", ".git", ".next", "dist", "build"}


def sha256_file(p: Path) -> str:
    h = hashlib.sha256()
    with open(p, "rb") as f:
        for chunk in iter(lambda: f.read(65536), b""):
            h.update(chunk)
    return h.hexdigest()


def collect_files() -> list[Path]:
    out: list[Path] = []
    if not ASSETS.is_dir():
        return out
    for p in ASSETS.rglob("*"):
        if not p.is_file() or p.is_symlink():
            continue
        if p.suffix.lower() not in EXTS:
            continue
        rel = p.relative_to(ASSETS)
        if rel.parts and rel.parts[0] in SKIP_TOP:
            continue
        out.append(p)
    return out


def ensure_shared(dest: Path, source: Path, dry_run: bool) -> None:
    if dest.exists():
        if sha256_file(dest) != sha256_file(source):
            raise SystemExit(f"Name collision: {dest} exists with different bytes than {source}")
        return
    if dry_run:
        return
    SHARED.mkdir(parents=True, exist_ok=True)
    shutil.copy2(source, dest)


def rewrite_css_urls_for_basename(css: str, basename: str, new_abs: str) -> str:
    esc = re.escape(basename)
    # Quoted
    css = re.sub(
        rf"url\(\s*(['\"])(?:\.\./)*(?:\./)*{esc}\1\s*\)",
        f"url('{new_abs}')",
        css,
        flags=re.IGNORECASE,
    )
    # Unquoted
    css = re.sub(
        rf"url\(\s*(?:\.\./)*(?:\./)*{esc}\s*\)",
        f"url('{new_abs}')",
        css,
        flags=re.IGNORECASE,
    )
    return css


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("--dry-run", action="store_true")
    args = ap.parse_args()
    dry = args.dry_run

    by_hash: dict[str, list[Path]] = defaultdict(list)
    for p in collect_files():
        try:
            by_hash[sha256_file(p)].append(p)
        except OSError as e:
            print("skip hash", p, e)

    groups = [ps for ps in by_hash.values() if len(ps) >= 2]
    print(f"Duplicate groups (identical bytes): {len(groups)}")

    planned: list[tuple[str, list[Path]]] = []
    for ps in groups:
        h0 = sha256_file(ps[0])
        name = Counter(p.name for p in ps).most_common(1)[0][0]
        stem, ext = Path(name).stem, Path(name).suffix
        dest = SHARED / name
        if dest.exists() and sha256_file(dest) != h0:
            name = f"{stem}_{h0[:8]}{ext}"
            dest = SHARED / name
        planned.append((name, ps))

    for name, ps in planned:
        src = sorted(ps, key=lambda x: len(str(x)))[0]
        ensure_shared(SHARED / name, src, dry)

    replacements: dict[str, str] = {}
    slug_basename: dict[tuple[str, str], str] = {}

    for name, ps in planned:
        new_url = f"/assets/_shared/{name}"
        dest = SHARED / name
        for p in ps:
            rel = p.relative_to(ASSETS)
            old_url = "/assets/" + "/".join(rel.parts)
            if old_url.rstrip("/") != new_url.rstrip("/"):
                replacements[old_url] = new_url
            slug = rel.parts[0]
            if slug not in ("_shared", "_fonts"):
                slug_basename[(slug, p.name)] = name

    rep_items = sorted(replacements.items(), key=lambda x: -len(x[0]))

    def rewrite_text(s: str) -> str:
        for old, new in rep_items:
            s = s.replace(old, new)
        return s

    def should_scan(path: Path) -> bool:
        return not any(p in SKIP_PARTS for p in path.parts)

    touched = 0
    for base in (REPO / "public", REPO / "app", REPO / "src"):
        if not base.is_dir():
            continue
        for p in base.rglob("*"):
            if not p.is_file() or p.suffix.lower() not in TEXT_EXT:
                continue
            if not should_scan(p.relative_to(REPO)):
                continue
            try:
                t = p.read_text(encoding="utf-8", errors="surrogateescape")
            except OSError:
                continue
            nt = rewrite_text(t)
            if nt != t:
                touched += 1
                if not dry:
                    p.write_text(nt, encoding="utf-8", errors="surrogateescape")
    print(f"Text files touched (absolute /assets/...): {touched}")

    css_touched = 0
    for (slug, basename), shared_name in slug_basename.items():
        if slug in ("_shared", "_fonts"):
            continue
        folder = ASSETS / slug
        if not folder.is_dir():
            continue
        new_abs = f"/assets/_shared/{shared_name}"
        for css_path in folder.rglob("*.css"):
            try:
                t = css_path.read_text(encoding="utf-8", errors="surrogateescape")
            except OSError:
                continue
            nt = rewrite_css_urls_for_basename(t, basename, new_abs)
            if nt != t:
                css_touched += 1
                if not dry:
                    css_path.write_text(nt, encoding="utf-8", errors="surrogateescape")
    print(f"CSS files touched (relative url() basenames under asset slugs): {css_touched}")

    deleted = 0
    for name, ps in planned:
        dest_path = SHARED / name
        try:
            dest_res = dest_path.resolve()
        except OSError:
            dest_res = None
        for p in ps:
            try:
                if dest_res is not None and p.resolve() == dest_res:
                    continue
            except OSError:
                pass
            if dry:
                deleted += 1
            else:
                try:
                    p.unlink()
                    deleted += 1
                except OSError as e:
                    print("unlink failed", p, e)
    print(f"Duplicate files removed: {deleted}")


if __name__ == "__main__":
    main()
