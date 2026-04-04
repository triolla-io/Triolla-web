#!/usr/bin/env python3
"""Flatten Portfolio mega-menu: one sub-menu under Portfolio (all industry+platform links), no Industries/Platforms parents."""

from __future__ import annotations

import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
FRAGMENTS = ROOT / "public" / "fragments"


def find_outer_li_end(s: str, start: int) -> int:
    i = start
    n = len(s)
    depth = 0
    while i < n:
        if s.startswith("<li", i) and (i + 3 >= n or s[i + 3] in " \t\n\r>/"):
            depth += 1
            gt = s.find(">", i)
            if gt == -1:
                return -1
            i = gt + 1
        elif s.startswith("</li>", i):
            depth -= 1
            i += 5
            if depth == 0:
                return i
        else:
            i += 1
    return -1


def first_outer_li_with_class(html: str, class_mark: str, start: int = 0) -> tuple[int, int] | None:
    pos = start
    while pos < len(html):
        i = html.find(class_mark, pos)
        if i == -1:
            return None
        li_start = html.rfind("<li", 0, i)
        if li_start == -1:
            pos = i + 1
            continue
        gt = html.find(">", li_start)
        if gt == -1:
            pos = i + 1
            continue
        if class_mark not in html[li_start : gt + 1]:
            pos = i + 1
            continue
        end = find_outer_li_end(html, li_start)
        if end < 0:
            pos = i + 1
            continue
        return (li_start, end)
    return None


def inner_submenu_lis(outer_li_html: str) -> str:
    m = re.search(r'<ul\s+class="sub-menu">\s*(.*?)\s*</ul>', outer_li_html, re.DOTALL)
    return m.group(1).strip() if m else ""


def demote_indent(fragment: str) -> str:
    lines = fragment.splitlines()
    out: list[str] = []
    for line in lines:
        if line.startswith("\t\t"):
            out.append("\t" + line[2:])
        else:
            out.append(line)
    return "\n".join(out)


def flatten_one_pair(html: str, c1: str, c2: str) -> tuple[str, bool]:
    a = first_outer_li_with_class(html, c1, 0)
    if not a:
        return html, False
    start_a, end_a = a
    b = first_outer_li_with_class(html, c2, end_a)
    if not b:
        return html, False
    start_b, end_b = b
    if start_b < end_a:
        return html, False
    li_a = html[start_a:end_a]
    li_b = html[start_b:end_b]
    inner_a = inner_submenu_lis(li_a)
    inner_b = inner_submenu_lis(li_b)
    if not inner_a or not inner_b:
        return html, False
    replacement = demote_indent(inner_a) + "\n" + demote_indent(inner_b)
    return html[:start_a] + replacement + html[end_b:], True


def flatten_all_pairs(html: str, c1: str, c2: str) -> tuple[str, bool]:
    changed = False
    while True:
        html, did = flatten_one_pair(html, c1, c2)
        if not did:
            break
        changed = True
    return html, changed


def process_file(path: Path) -> bool:
    text = path.read_text(encoding="utf-8")
    if "menu-item-1094" not in text and "menu-item-1972" not in text:
        return False
    orig = text
    text, e = flatten_all_pairs(text, "menu-item-1094", "menu-item-1101")
    text, h = flatten_all_pairs(text, "menu-item-1972", "menu-item-1976")
    if text != orig:
        path.write_text(text, encoding="utf-8")
        return True
    return False


def main() -> int:
    n = 0
    for path in sorted(FRAGMENTS.glob("*.html")):
        if process_file(path):
            print(path.relative_to(ROOT))
            n += 1
    print(f"updated {n} files", file=sys.stderr)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
