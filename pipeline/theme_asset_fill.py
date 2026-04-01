#!/usr/bin/env python3
"""
Theme CSS references url(images/...) while snapshot _assets/ are flat under public/assets/<route>/.
Copy matching files into <route>/images/ and backfill missing Triolla webfonts from the canonical
English mirror (public/assets/services).
"""
from __future__ import annotations

import re
import shutil
import sys
from pathlib import Path

CANONICAL_THEME_ASSET_DIR = "services"

_CSS_URL_IMAGES = re.compile(
    r"url\s*\(\s*['\"]?images/([^'\"?)]+)",
    re.IGNORECASE,
)
_CSS_URL_PARENT_IMAGES = re.compile(
    r"url\s*\(\s*['\"]?\.\./images/([^'\"?)]+)",
    re.IGNORECASE,
)


def theme_donor_dir(repo_root: str) -> Path:
    return Path(repo_root).resolve() / "web" / "public" / "assets" / CANONICAL_THEME_ASSET_DIR


def _collect_image_basenames_from_css(assets_dir: Path) -> set[str]:
    names: set[str] = set()
    for css in assets_dir.glob("*.css*"):
        try:
            text = css.read_text(encoding="utf-8", errors="replace")
        except OSError:
            continue
        for rx in (_CSS_URL_IMAGES, _CSS_URL_PARENT_IMAGES):
            for m in rx.finditer(text):
                part = m.group(1).strip()
                if not part or "/" in part:
                    continue
                names.add(part)
    return names


def ensure_images_subdir_from_css(assets_dst: str, repo_root: str = ".") -> None:
    dst_path = Path(assets_dst).resolve()
    if not dst_path.is_dir():
        return
    names = _collect_image_basenames_from_css(dst_path)
    if not names:
        return
    img_dir = dst_path / "images"
    img_dir.mkdir(exist_ok=True)

    donor = theme_donor_dir(repo_root)
    donors: list[Path] = [dst_path]
    if dst_path.name.endswith("-he"):
        sibling = dst_path.parent / dst_path.name[: -len("-he")]
        if sibling.is_dir():
            donors.append(sibling)
            si = sibling / "images"
            if si.is_dir():
                donors.append(si)
    if donor.is_dir():
        donors.append(donor)
        di = donor / "images"
        if di.is_dir():
            donors.append(di)

    for base in sorted(names):
        dest = img_dir / base
        if dest.is_file():
            continue
        for d in donors:
            for candidate in (d / base, d / "images" / base):
                if candidate.is_file():
                    shutil.copy2(candidate, dest)
                    break
            else:
                continue
            break


def ensure_theme_fonts_from_services_donor(assets_dst: str, repo_root: str = ".") -> None:
    dst_path = Path(assets_dst).resolve()
    donor = theme_donor_dir(repo_root).resolve()
    if not dst_path.is_dir() or not donor.is_dir() or dst_path == donor:
        return
    for pattern in ("Almoni*", "almoni*"):
        for src in donor.glob(pattern):
            if not src.is_file():
                continue
            dest = dst_path / src.name
            if not dest.exists():
                shutil.copy2(src, dest)


def fill_theme_assets_for_mirror(assets_dst: str, repo_root: str = ".") -> None:
    ensure_images_subdir_from_css(assets_dst, repo_root)
    ensure_theme_fonts_from_services_donor(assets_dst, repo_root)


def repair_all_public_asset_mirrors(repo_root: str = ".") -> tuple[int, int]:
    """
    Run fill_theme_assets_for_mirror on each web/public/assets/* that contains theme CSS.
    Returns (processed_dir_count, skipped_no_theme_css_count).
    """
    root = Path(repo_root).resolve() / "web" / "public" / "assets"
    if not root.is_dir():
        return 0, 0
    processed = 0
    skipped_no_css = 0
    for p in sorted(root.iterdir()):
        if not p.is_dir() or p.name.startswith("."):
            continue
        if not any(p.glob("*.css*")):
            skipped_no_css += 1
            continue
        fill_theme_assets_for_mirror(str(p), repo_root)
        processed += 1
    return processed, skipped_no_css


def main() -> None:
    repo_root = sys.argv[1] if len(sys.argv) > 1 else "."
    n, sk = repair_all_public_asset_mirrors(repo_root)
    print(f"Theme asset fill: {n} asset directories updated ({sk} dirs had no *.css*).")
    if n == 0:
        sys.exit(1)


if __name__ == "__main__":
    main()
