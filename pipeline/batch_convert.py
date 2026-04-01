#!/usr/bin/env python3
"""
Batch convert downloaded landing-page/<slug>/ to Next.js routes in web/
Orchestrates extraction, asset sync, and client component generation
"""
from __future__ import annotations

import json
import subprocess
import sys
import os
import shutil
import tempfile
from pathlib import Path

_pipeline_dir = os.path.dirname(os.path.abspath(__file__))
if _pipeline_dir not in sys.path:
    sys.path.insert(0, _pipeline_dir)
import include_filter as _inc
from manifest_lock import update_slug_status
from snapshot_link_rewrite import index_needs_asset_rewrite, rewrite_absolute_origin_links
from theme_asset_fill import fill_theme_assets_for_mirror


def path_is_hebrew_home(path: str | None) -> bool:
    """WPML Hebrew homepage path (must download https://<domain>/he/, not English /)."""
    if not path:
        return False
    p = (path or "/").rstrip("/")
    return p == "/he"


def bilingual_he_colocated_base(slug: str) -> str | None:
    """
    Slugs like triolla-io-technology-he → Hebrew snapshot colocated under app/<base>/ with
    <base>-he-deps.json and fragments/<base>-he-body.html (same pattern as English hub).
    """
    prefix, suffix = "triolla-io-", "-he"
    if not slug.startswith(prefix) or not slug.endswith(suffix):
        return None
    inner = slug[len(prefix) : -len(suffix)]
    if not inner:
        return None
    return inner


def load_urls_manifest(manifest_path='pipeline/urls.json'):
    """Load URLs from manifest."""
    if not os.path.exists(manifest_path):
        print(f"ERROR: {manifest_path} not found", file=sys.stderr)
        sys.exit(1)
    
    with open(manifest_path) as f:
        return json.load(f)

def check_downloaded(slug, repo_root='.'):
    """Check if landing-page/<slug>/index.html exists."""
    repo_root = os.path.abspath(repo_root)
    lp_dir = os.path.join(repo_root, 'landing-page', slug)
    return os.path.exists(os.path.join(lp_dir, 'index.html'))

def extract_fragment(slug, lang='en', repo_root='.', path=None):
    """Run extract_snapshot_fragment.py for a slug."""
    repo_root = os.path.abspath(repo_root)
    landing_page_dir = os.path.join(repo_root, 'landing-page', slug)
    index_html = os.path.join(landing_page_dir, 'index.html')

    if not os.path.exists(index_html):
        print(f"✗ {slug}: index.html not found in {landing_page_dir}")
        return False

    web_root = os.path.join(repo_root, 'web')
    extractor = os.path.join(web_root, 'scripts', 'extract_snapshot_fragment.py')
    
    if not os.path.exists(extractor):
        print(f"✗ {slug}: extractor not found at {extractor}")
        return False
    
    # Determine output paths based on slug and language
    route_name = slug.replace('triolla-io-', '')
    lang_prefix = 'he/' if lang == 'he' else ''
    asset_suffix = f'-{lang}' if lang == 'he' else ''
    hebrew_home = lang == 'he' and path_is_hebrew_home(path)
    colocated_he = bilingual_he_colocated_base(slug)

    if colocated_he:
        route_dir = os.path.join(web_root, 'app', colocated_he)
        body_out = os.path.join(
            web_root, 'public', 'fragments', f'{colocated_he}-he-body.html'
        )
        deps_out = os.path.join(route_dir, f'{colocated_he}-he-deps.json')
        asset_base = f'/assets/{colocated_he}-he'
    elif route_name == 'home':
        route_dir = os.path.join(web_root, 'app', lang_prefix.rstrip('/')) if lang_prefix else os.path.join(web_root, 'app')
        body_out = os.path.join(web_root, 'public', 'fragments', f'home{asset_suffix}-body.html')
        deps_out = os.path.join(route_dir, 'home-deps.json') if route_dir != os.path.join(web_root, 'app') else os.path.join(web_root, 'app', 'home-deps.json')
        asset_base = f'/assets/home{asset_suffix}'
    elif hebrew_home:
        # https://triolla.io/he/ → slug triolla-io-he; Next route is /he with home-he-* artifacts
        route_dir = os.path.join(web_root, 'app', 'he')
        body_out = os.path.join(web_root, 'public', 'fragments', 'home-he-body.html')
        deps_out = os.path.join(route_dir, 'home-deps.json')
        asset_base = '/assets/home-he'
    else:
        route_dir = os.path.join(web_root, 'app', lang_prefix + route_name)
        body_out = os.path.join(web_root, 'public', 'fragments', f'{route_name}{asset_suffix}-body.html')
        deps_out = os.path.join(route_dir, f'{route_name}-deps.json')
        asset_base = f'/assets/{route_name}{asset_suffix}'
    
    os.makedirs(os.path.dirname(body_out), exist_ok=True)
    os.makedirs(os.path.dirname(deps_out), exist_ok=True)

    html_for_extract = index_html
    tmp_extract: str | None = None
    if index_needs_asset_rewrite(index_html):
        try:
            with open(index_html, encoding="utf-8", errors="replace") as f:
                raw_html = f.read()
            fixed = rewrite_absolute_origin_links(raw_html, landing_page_dir)
            if fixed != raw_html:
                fd, tmp_extract = tempfile.mkstemp(
                    suffix=".html", prefix=".extract-rewrite-", dir=landing_page_dir
                )
                with os.fdopen(fd, "w", encoding="utf-8") as tmp_f:
                    tmp_f.write(fixed)
                html_for_extract = tmp_extract
                print(f"  (rewrote absolute asset URLs → _assets/ for extract)")
        except OSError as e:
            print(f"✗ {slug}: could not prepare HTML for extract: {e}")
            return False

    print(f"⏳ Extracting {slug} ({lang})...")
    try:
        result = subprocess.run(
            [
                'python3', extractor,
                '--html', html_for_extract,
                '--out-body', body_out,
                '--out-deps', deps_out,
                '--asset-base', asset_base
            ],
            capture_output=True,
            text=True,
            timeout=60,
            cwd=web_root
        )

        if result.returncode != 0:
            print(f"✗ Extraction failed: {result.stderr}")
            return False

        print(f"✓ Extracted {slug} ({lang})")
        print(f"  Body: {body_out}")
        print(f"  Deps: {deps_out}")
        return True
    except Exception as e:
        print(f"✗ ERROR: {e}")
        return False
    finally:
        if tmp_extract and os.path.isfile(tmp_extract):
            try:
                os.unlink(tmp_extract)
            except OSError:
                pass

def sync_assets(slug, lang='en', repo_root='.', path=None):
    """Copy landing-page/<slug>/_assets/ to web/public/assets/<route>/"""
    repo_root = os.path.abspath(repo_root)
    landing_page_dir = os.path.join(repo_root, 'landing-page', slug)
    assets_src = os.path.join(landing_page_dir, '_assets')
    
    route_name = slug.replace('triolla-io-', '')
    asset_suffix = f'-{lang}' if lang == 'he' else ''
    hebrew_home = lang == 'he' and path_is_hebrew_home(path)
    colocated_he = bilingual_he_colocated_base(slug)

    if colocated_he:
        assets_dst = os.path.join(
            repo_root, 'web', 'public', 'assets', f'{colocated_he}-he'
        )
    elif route_name == 'home':
        assets_dst = os.path.join(repo_root, 'web', 'public', 'assets', f'home{asset_suffix}')
    elif hebrew_home:
        assets_dst = os.path.join(repo_root, 'web', 'public', 'assets', 'home-he')
    else:
        assets_dst = os.path.join(repo_root, 'web', 'public', 'assets', f'{route_name}{asset_suffix}')
    
    if not os.path.exists(assets_src):
        print(f"⚠️  No _assets/ found for {slug}")
        return False
    
    print(f"⏳ Syncing assets {slug} ({lang})...")
    try:
        if os.path.exists(assets_dst):
            shutil.rmtree(assets_dst)
        shutil.copytree(assets_src, assets_dst)
        fill_theme_assets_for_mirror(assets_dst, repo_root)
        print(f"✓ Assets synced to {assets_dst}")
        return True
    except Exception as e:
        print(f"✗ ERROR syncing assets: {e}")
        return False

def update_status(manifest_path, slug, status):
    """Update status in manifest (flock — safe with parallel workers)."""
    update_slug_status(manifest_path, slug, status)

def main():
    import argparse
    parser = argparse.ArgumentParser(description='Batch convert downloaded pages to Next.js')
    parser.add_argument('--manifest', default='pipeline/urls.json', help='URLs manifest')
    parser.add_argument('--repo-root', default='.', help='Repo root')
    parser.add_argument('--only-slug', help='Convert only this slug')
    parser.add_argument(
        '--include-file',
        metavar='PATH',
        help='Only slugs/paths/URLs listed in this file (same format as batch download)',
    )
    parser.add_argument('--skip-extract', action='store_true', help='Skip extraction, only sync assets')
    parser.add_argument('--skip-assets', action='store_true', help='Skip asset sync')
    parser.add_argument(
        '--allow-converted',
        action='store_true',
        help='With --only-slug, re-run extract/sync even when manifest status is already converted (repair stale deps)',
    )
    args = parser.parse_args()
    
    manifest = load_urls_manifest(args.manifest)
    if args.include_file:
        if not os.path.isfile(args.include_file):
            print(f"ERROR: include file not found: {args.include_file}", file=sys.stderr)
            sys.exit(1)
    include = _inc.load_include_file(args.include_file) if args.include_file else None
    if args.include_file and include is None:
        print(f"ERROR: include file has no valid lines: {args.include_file}", file=sys.stderr)
        sys.exit(1)

    print(f"🔄 Batch Convert from {manifest['domain']}")
    print(f"   Manifest: {args.manifest}")
    if include is not None:
        slugs, urls, paths = include
        print(f"   Include file: {args.include_file} ({len(slugs)} slugs, {len(paths)} paths, {len(urls)} urls)")
    print()
    
    converted = 0
    failed = 0
    skipped = 0
    
    for entry in manifest['urls']:
        slug = entry['slug']
        status = entry['status']
        lang = entry.get('lang', 'en')
        path = entry.get('path')
        
        if args.only_slug and slug != args.only_slug:
            skipped += 1
            continue
        
        if not _inc.entry_matches(entry, include):
            skipped += 1
            continue

        if status == 'converting' and not args.only_slug:
            print(f"⊘ {slug} skip (convert claimed by a parallel worker)")
            skipped += 1
            continue
        
        eligible = ('downloaded', 'conversion_failed', 'converting')
        if args.allow_converted and args.only_slug:
            eligible = eligible + ('converted',)
        if status not in eligible:
            # Duplicate manifest rows: another line may be eligible; avoid noisy logs for --only-slug.
            if not args.only_slug:
                need = 'downloaded, converting, or conversion_failed'
                if args.allow_converted:
                    need += ', or converted (--allow-converted)'
                print(f"⊘ {slug} skip (status: {status}; need {need})")
            skipped += 1
            continue

        if not check_downloaded(slug, args.repo_root):
            print(f"✗ {slug}: landing-page/ not found")
            failed += 1
            if args.only_slug:
                break
            continue
        
        print(f"\n📦 Processing {slug} ({lang})...")
        
        success = True
        
        if not args.skip_extract:
            if not extract_fragment(slug, lang=lang, repo_root=args.repo_root, path=path):
                success = False
        
        if success and not args.skip_assets:
            if not sync_assets(slug, lang=lang, repo_root=args.repo_root, path=path):
                success = False
        
        if success:
            update_status(args.manifest, slug, 'converted')
            converted += 1
            print(f"✓ {slug} converted")
        else:
            update_status(args.manifest, slug, 'conversion_failed')
            failed += 1

        # One run per subprocess: duplicate url rows share the same slug and stale in-memory status.
        if args.only_slug:
            break
    
    print()
    print(f"📊 Summary:")
    print(f"   Converted: {converted}")
    print(f"   Failed: {failed}")
    print(f"   Skipped: {skipped}")
    print()
    print(f"✓ Manifest updated: {args.manifest}")
    
    if failed > 0:
        print(f"\n⚠️  {failed} conversions failed.")
        sys.exit(1)

if __name__ == '__main__':
    main()
