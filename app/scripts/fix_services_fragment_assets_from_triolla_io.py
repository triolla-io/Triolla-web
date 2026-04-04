#!/usr/bin/env python3
"""
Rewrite /assets/services-<slug>/ in public/fragments/services-*-body.html using URLs
scraped from matching triolla-io-services-<slug>-body.html (plus small fallbacks).

See .cursor/skills/fix-triolla-services-snapshots/SKILL.md.

Usage (repo root):
  python3 app/scripts/fix_services_fragment_assets_from_triolla_io.py
"""

from __future__ import annotations

import re
import sys
from pathlib import Path
from urllib.parse import unquote

REPO = Path(__file__).resolve().parents[2]
FRAG = REPO / "public" / "fragments"

UPLOADS_05 = "https://triolla.io/wp-content/uploads/2025/05/"
THEME = "https://triolla.io/wp-content/themes/triolla/images/"


def basename_urls_from_ref(ref_html: str) -> dict[str, str]:
    d: dict[str, str] = {}
    for m in re.finditer(r"https://triolla\.io/wp-content/[a-zA-Z0-9_./%-]+", ref_html):
        u = m.group(0)
        u = u.split('"')[0].split("'")[0].split(")")[0].split(">")[0]
        u = u.rstrip(".,;")
        clean = u.split("?")[0]
        base = unquote(clean.rstrip("/").split("/")[-1])
        if base and base not in d:
            d[base] = clean
    return d


def fallback_url(fn: str) -> str | None:
    if fn.startswith("jumping_"):
        return UPLOADS_05 + fn
    if fn in {
        "tickerxlose.svg",
        "logo_new.png",
        "hamburger.svg",
        "hamburger_white.svg",
        "togleclose.svg",
        "calenderimg.svg",
        "phmobicon.svg",
        "whatmobicon.svg",
    }:
        return THEME + fn
    return None


def process_body(body_path: Path) -> str:
    name = body_path.name
    if name == "services-he-body.html":
        return "skip_hub"
    m = re.match(r"^services-(.+)-body\.html$", name)
    if not m:
        return "skip_name"
    slug = m.group(1)
    if slug == "he":
        return "skip_he_segment"
    prefix = f"/assets/services-{slug}/"
    text = body_path.read_text(encoding="utf-8")
    if prefix not in text:
        return "no_prefix"

    ref_path = FRAG / f"triolla-io-services-{slug}-body.html"
    if not ref_path.is_file():
        return f"missing_ref:{slug}"

    mp = basename_urls_from_ref(ref_path.read_text(encoding="utf-8"))
    pattern = re.compile(re.escape(prefix) + r"([^\"'\s<>]+)")

    def repl(mm: re.Match) -> str:
        fn = mm.group(1).split("?")[0]
        if fn in mp:
            return mp[fn]
        fb = fallback_url(fn)
        if fb:
            return fb
        return mm.group(0)

    out = pattern.sub(repl, text)
    if prefix in out:
        out = pattern.sub(repl, out)
    if out == text:
        return "unchanged"
    body_path.write_text(out, encoding="utf-8")
    return "fixed"


def main() -> int:
    fixed = 0
    issues: list[str] = []
    for p in sorted(FRAG.glob("services-*-body.html")):
        r = process_body(p)
        if r == "fixed":
            fixed += 1
            print("fixed", p.name)
        elif r.startswith("missing_ref"):
            issues.append(f"{p.name}: {r}")
    if issues:
        print("issues:", file=sys.stderr)
        for x in issues:
            print(x, file=sys.stderr)
        return 1
    print(f"done, {fixed} file(s) updated")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
