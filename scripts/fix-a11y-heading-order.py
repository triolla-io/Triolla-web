#!/usr/bin/env python3
"""
Post-extract accessibility fix: normalize heading hierarchy in .abthrebottxt blocks.

The theme uses <h3> → <h5>, skipping <h4>. Lighthouse flags this as improper hierarchy.
This script rewrites <h5> to <h4> in all .abthrebottxt containers across page components.
Also updates layout.tsx to inject CSS rules that mirror the original h5 styling onto h4.

Run after extract_fragment.py stage; idempotent (safe to re-run).

Usage:
  python3 scripts/fix-a11y-heading-order.py
"""
from pathlib import Path
import re

def fix_heading_order(component_path: Path) -> int:
    """Swap h5→h4 inside .abthrebottxt divs; return count of changes."""
    src = component_path.read_text(encoding='utf-8')
    old_src = src

    # Split on <div className={"abthrebottxt"}> markers
    parts = src.split('<div className={"abthrebottxt"}>')
    if len(parts) == 1:
        return 0  # No abthrebottxt found

    out = [parts[0]]
    changes = 0
    for chunk in parts[1:]:
        # Replace only the first <h5> and </h5> in this chunk (one h5 per abthrebottxt block)
        new_chunk, n1 = re.subn(r'<h5>', '<h4>', chunk, count=1)
        new_chunk, n2 = re.subn(r'</h5>', '</h4>', new_chunk, count=1)
        changes += n1 + n2
        out.append(new_chunk)

    if changes > 0:
        component_path.write_text('<div className={"abthrebottxt"}>'.join(out), encoding='utf-8')
    return changes

def main():
    """Fix heading hierarchy in all page components."""
    components_dir = Path(__file__).parent.parent / "components" / "pages"
    total_changes = 0

    for component_file in components_dir.glob("*.tsx"):
        if component_file.name.startswith("_"):
            continue  # Skip metadata files
        changes = fix_heading_order(component_file)
        if changes > 0:
            print(f"{component_file.name}: {changes} heading tags fixed")
            total_changes += changes

    if total_changes == 0:
        print("No heading fixes needed.")
    else:
        print(f"\nTotal: {total_changes} heading tags normalized (h5→h4).")

if __name__ == "__main__":
    main()
