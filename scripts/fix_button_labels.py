#!/usr/bin/env python3
"""
Add aria-label to every <a role="button"> that lacks one, across all fragment HTML files.

Label strategy:
  1. Has .faq_quest child span → use its text (FAQ toggle question)
  2. Has .default-text child span → use its text (hover-swap CTA button)
  3. Text content is empty or "test" → "Toggle submenu" (nav sub-menu toggle)
  4. Otherwise → aria-label = stripped text content (fallback for any other pattern)
"""

import os
import re
import glob
import html as html_mod

FRAGMENTS_DIR = os.path.join(os.path.dirname(__file__), "..", "public", "fragments")


def strip_tags(fragment: str) -> str:
    text = re.sub(r"<[^>]+>", " ", fragment)
    return re.sub(r"\s+", " ", text).strip()


def span_text(content: str, cls: str) -> str:
    """Return inner text of the first span whose class includes `cls`."""
    m = re.search(
        rf'<span[^>]*class="[^"]*{re.escape(cls)}[^"]*"[^>]*>([\s\S]*?)</span>',
        content,
    )
    if m:
        return strip_tags(m.group(1))
    return ""


def compute_label(content: str) -> str:
    # 1. FAQ question span
    label = span_text(content, "faq_quest")
    if label:
        return label

    # 2. Hover-swap CTA (.default-text)
    label = span_text(content, "default-text")
    if label:
        return label

    # 3. Plain text — use it as-is (already visible to sighted users)
    text = strip_tags(content)
    if not text or text.lower() == "test":
        return "Toggle submenu"

    return text


def process_file(path: str) -> bool:
    with open(path, encoding="utf-8") as f:
        html = f.read()

    changed = False
    out_parts = []
    pos = 0

    # Match every <a ...> that carries role="button" but NOT aria-label
    for m in re.finditer(
        r'<a\b([^>]*\brole="button"[^>]*)>',
        html,
    ):
        tag_start = m.start()
        tag_end = m.end()
        attrs = m.group(1)

        # Already labeled — skip
        if 'aria-label' in attrs:
            out_parts.append(html[pos:tag_end])
            pos = tag_end
            continue

        # Find the matching </a>
        close = html.find("</a>", tag_end)
        if close == -1:
            continue
        content = html[tag_end:close]

        label = compute_label(content)
        escaped = label.replace("&", "&amp;").replace('"', "&quot;")

        # Rebuild the opening tag with the new attribute appended
        new_open = f'<a{attrs} aria-label="{escaped}">'
        out_parts.append(html[pos:tag_start])
        out_parts.append(new_open)
        pos = tag_end
        changed = True

    out_parts.append(html[pos:])

    if changed:
        with open(path, "w", encoding="utf-8") as f:
            f.write("".join(out_parts))

    return changed


def main():
    pattern = os.path.join(FRAGMENTS_DIR, "*-body.html")
    files = sorted(glob.glob(pattern))
    print(f"Found {len(files)} fragment files")

    fixed = 0
    for path in files:
        if process_file(path):
            fixed += 1
            print(f"  fixed  {os.path.basename(path)}")

    print(f"\nDone — {fixed}/{len(files)} files updated")


if __name__ == "__main__":
    main()
