#!/usr/bin/env python3
"""
Consolidate assets from landing-page to web/public/assets.
Maps: triolla-io-about-us -> about-us, triolla-io-blog -> blog, etc.
Deduplicates files and creates a consolidation report.
"""

import os
import json
import hashlib
import shutil
from pathlib import Path
from collections import defaultdict
from datetime import datetime

landing_page_root = Path("/Users/ariell/html-to-react/landing-page")
web_assets_dest = Path("/Users/ariell/html-to-react/web/public/assets")

consolidation_log = {
    "timestamp": datetime.now().isoformat(),
    "source": str(landing_page_root),
    "destination": str(web_assets_dest),
    "folders": {},
    "duplicates_found": [],
    "total_files_copied": 0,
    "total_duplicates_skipped": 0,
}

def sanitize_folder_name(folder_name: str) -> str:
    """Convert 'triolla-io-about-us' -> 'about-us'"""
    if folder_name.startswith("triolla-io-"):
        return folder_name.replace("triolla-io-", "")
    return folder_name

def get_file_hash(filepath, chunk_size=8192):
    """Calculate MD5 hash of file"""
    try:
        hasher = hashlib.md5()
        with open(filepath, 'rb') as f:
            while chunk := f.read(chunk_size):
                hasher.update(chunk)
        return hasher.hexdigest()
    except Exception as e:
        print(f"    ❌ Error hashing {filepath}: {e}")
        return None

def consolidate():
    """Main consolidation process"""
    print("\n" + "="*70)
    print("🚀 CONSOLIDATING ASSETS")
    print("="*70 + "\n")

    # Ensure destination exists
    web_assets_dest.mkdir(parents=True, exist_ok=True)

    folders = sorted([d for d in landing_page_root.iterdir()
                     if d.is_dir() and not d.name.startswith('.')])

    print(f"📁 Processing {len(folders)} folders...\n")

    for folder in folders:
        assets_path = folder / "_assets"

        if not assets_path.exists():
            print(f"⏭️  {folder.name}/ - no _assets folder, skipping")
            continue

        slug = sanitize_folder_name(folder.name)
        dest_base = web_assets_dest / slug

        print(f"📦 {folder.name} → {slug}/")

        # Track files by hash to detect duplicates
        slug_hashes = defaultdict(list)
        files_copied = 0
        duplicates_skipped = 0

        # Create destination folder
        dest_base.mkdir(parents=True, exist_ok=True)

        # Walk through all files in _assets
        for root, dirs, files in os.walk(assets_path):
            for file in files:
                src_file = Path(root) / file
                rel_path = src_file.relative_to(assets_path)
                dest_file = dest_base / rel_path

                # Create subdirectories if needed
                dest_file.parent.mkdir(parents=True, exist_ok=True)

                # Calculate hash
                file_hash = get_file_hash(src_file)
                if not file_hash:
                    continue

                # Check if we've seen this exact file before in this slug
                if file_hash in slug_hashes:
                    # Duplicate found - log it but don't copy
                    duplicates_skipped += 1
                    consolidation_log["duplicates_found"].append({
                        "slug": slug,
                        "original": str(slug_hashes[file_hash][0]),
                        "duplicate": str(rel_path),
                        "hash": file_hash
                    })
                    print(f"    ⚠️  Duplicate: {rel_path} (skipped)")
                    continue

                # Copy file
                try:
                    shutil.copy2(src_file, dest_file)
                    slug_hashes[file_hash].append(str(rel_path))
                    files_copied += 1
                except Exception as e:
                    print(f"    ❌ Error copying {src_file}: {e}")

        consolidation_log["folders"][slug] = {
            "source": str(assets_path),
            "destination": str(dest_base),
            "files_copied": files_copied,
            "duplicates_skipped": duplicates_skipped,
        }

        consolidation_log["total_files_copied"] += files_copied
        consolidation_log["total_duplicates_skipped"] += duplicates_skipped

        print(f"    ✅ {files_copied} files copied")
        if duplicates_skipped > 0:
            print(f"    ⚠️  {duplicates_skipped} duplicates skipped")
        print()

    return consolidation_log

def show_results(log):
    """Display consolidation results"""
    print("\n" + "="*70)
    print("📊 CONSOLIDATION RESULTS")
    print("="*70 + "\n")

    print(f"✅ Total files copied: {log['total_files_copied']}")
    print(f"⚠️  Total duplicates skipped: {log['total_duplicates_skipped']}")
    print(f"📦 Folders processed: {len(log['folders'])}\n")

    if log["duplicates_found"]:
        print("Duplicates details:")
        for dup in log["duplicates_found"][:10]:  # Show first 10
            print(f"  - {dup['slug']}/{dup['duplicate']}")
        if len(log["duplicates_found"]) > 10:
            print(f"  ... and {len(log['duplicates_found']) - 10} more")
        print()

    print(f"Destination: {log['destination']}\n")

def save_log(log):
    """Save consolidation log"""
    log_path = web_assets_dest / "consolidation_log.json"
    with open(log_path, 'w') as f:
        json.dump(log, f, indent=2)
    print(f"📝 Log saved to: {log_path}\n")

if __name__ == "__main__":
    try:
        log = consolidate()
        show_results(log)
        save_log(log)

        print("="*70)
        print("✨ CONSOLIDATION COMPLETE!")
        print("="*70)
        print("\nYou can now safely delete: /Users/ariell/html-to-react/landing-page/\n")

    except Exception as e:
        print(f"❌ Error: {e}")
        import traceback
        traceback.print_exc()
