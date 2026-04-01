#!/usr/bin/env python3
"""
Deduplicate assets in web/public/assets/ by:
1. Finding identical files across folders
2. Moving originals to web/public/assets/_shared/
3. Creating symlinks from original locations to _shared/
4. Reporting disk space saved
"""

import os
import hashlib
import json
from pathlib import Path
from collections import defaultdict
import shutil

assets_root = Path("/Users/ariell/html-to-react/web/public/assets")
shared_dir = assets_root / "_shared"

dedup_report = {
    "timestamp": "",
    "duplicates_found": 0,
    "files_moved_to_shared": 0,
    "symlinks_created": 0,
    "original_size_bytes": 0,
    "deduplicated_size_bytes": 0,
    "space_saved_mb": 0.0,
    "duplicates": {},
}

def get_file_hash(filepath, chunk_size=8192):
    """Calculate MD5 hash of file"""
    try:
        hasher = hashlib.md5()
        with open(filepath, 'rb') as f:
            while chunk := f.read(chunk_size):
                hasher.update(chunk)
        return hasher.hexdigest()
    except Exception as e:
        print(f"  ❌ Error hashing {filepath}: {e}")
        return None

def scan_assets():
    """Scan all files and group by hash"""
    print("\n" + "="*70)
    print("🔍 SCANNING ASSETS FOR DUPLICATES")
    print("="*70 + "\n")

    file_hashes = defaultdict(list)  # hash -> [(filepath, size), ...]
    total_size = 0

    # Exclude _shared and consolidation_log from scanning
    for root, dirs, files in os.walk(assets_root):
        # Skip _shared directory
        if "_shared" in root:
            continue

        for file in files:
            if file == "consolidation_log.json":
                continue

            filepath = Path(root) / file
            try:
                file_size = filepath.stat().st_size
                file_hash = get_file_hash(filepath)

                if file_hash:
                    file_hashes[file_hash].append((filepath, file_size))
                    total_size += file_size
            except Exception as e:
                print(f"  ❌ Error processing {filepath}: {e}")

    dedup_report["original_size_bytes"] = total_size

    # Find duplicates (files with hash appearing > 1 time)
    duplicates = {h: files for h, files in file_hashes.items() if len(files) > 1}

    print(f"Total files scanned: {sum(len(files) for files in file_hashes.values())}")
    print(f"Unique file hashes: {len(file_hashes)}")
    print(f"Duplicate groups found: {len(duplicates)}")
    print(f"Original total size: {total_size / (1024**2):.2f} MB\n")

    return duplicates, total_size

def deduplicate(duplicates):
    """Move duplicates to _shared and create symlinks"""
    print("="*70)
    print("🔗 DEDUPLICATING ASSETS")
    print("="*70 + "\n")

    # Create _shared directory
    shared_dir.mkdir(parents=True, exist_ok=True)

    total_moved = 0
    total_symlinks = 0
    deduplicated_size = 0

    for i, (file_hash, files) in enumerate(sorted(duplicates.items()), 1):
        # First file is the "original", rest are duplicates
        original_path, original_size = files[0]
        duplicates_list = files[1:]

        # Create a unique name in _shared based on original filename + hash
        filename = original_path.name
        shared_name = f"{file_hash}_{filename}"
        shared_path = shared_dir / shared_name

        print(f"[{i}/{len(duplicates)}] {filename} ({len(files)} copies)")

        try:
            # Move original to _shared (if not already there)
            if not shared_path.exists():
                shared_path.parent.mkdir(parents=True, exist_ok=True)
                shutil.move(str(original_path), str(shared_path))
                total_moved += 1
                deduplicated_size += original_size

            # Create symlinks from original location and all duplicate locations
            for dup_path, _ in [files[0]] + duplicates_list:
                if dup_path.exists():
                    # Remove the file/symlink
                    dup_path.unlink()

                # Create symlink to _shared
                dup_path.symlink_to(shared_path)
                total_symlinks += 1

            # Store in report
            dedup_report["duplicates"][file_hash] = {
                "filename": filename,
                "size": original_size,
                "copies": len(files),
                "saved": original_size * (len(files) - 1)
            }

        except Exception as e:
            print(f"    ❌ Error processing {filename}: {e}")

    dedup_report["files_moved_to_shared"] = total_moved
    dedup_report["symlinks_created"] = total_symlinks
    dedup_report["deduplicated_size_bytes"] = deduplicated_size

    return total_moved, total_symlinks

def calculate_savings(original_size, deduplicated_size):
    """Calculate space saved"""
    # Each duplicate was stored separately, now only stored once
    total_duplicates = sum(
        v["size"] * (v["copies"] - 1)
        for v in dedup_report["duplicates"].values()
    )

    saved_mb = total_duplicates / (1024**2)
    dedup_report["space_saved_mb"] = saved_mb

    return saved_mb, total_duplicates

def show_results(moved, symlinks, saved_mb, original_size):
    """Display deduplication results"""
    print("\n" + "="*70)
    print("📊 DEDUPLICATION RESULTS")
    print("="*70 + "\n")

    print(f"✅ Files moved to _shared: {moved}")
    print(f"🔗 Symlinks created: {symlinks}")
    print(f"💾 Space saved: {saved_mb:.2f} MB")
    print(f"📦 Original size: {original_size / (1024**2):.2f} MB")
    print(f"📦 New size: {(original_size - (saved_mb * 1024**2)) / (1024**2):.2f} MB")
    print(f"📍 Shared files location: {shared_dir}\n")

    # Show top duplicates
    if dedup_report["duplicates"]:
        print("Top 10 duplicates:\n")
        top_dupes = sorted(
            dedup_report["duplicates"].items(),
            key=lambda x: x[1]["saved"],
            reverse=True
        )[:10]

        for file_hash, info in top_dupes:
            print(f"  {info['filename']}")
            print(f"    Size: {info['size'] / 1024:.1f} KB | Copies: {info['copies']} | Saved: {info['saved'] / 1024:.1f} KB")
        print()

def save_report():
    """Save deduplication report"""
    report_path = assets_root / "dedup_report.json"
    with open(report_path, 'w') as f:
        json.dump(dedup_report, f, indent=2)
    print(f"📝 Report saved to: {report_path}\n")

if __name__ == "__main__":
    try:
        duplicates, original_size = scan_assets()

        if not duplicates:
            print("✅ No duplicates found!\n")
        else:
            moved, symlinks = deduplicate(duplicates)
            saved_mb, total_saved = calculate_savings(original_size, dedup_report["deduplicated_size_bytes"])
            show_results(moved, symlinks, saved_mb, original_size)
            save_report()

        print("="*70)
        print("✨ DEDUPLICATION COMPLETE!")
        print("="*70 + "\n")

    except Exception as e:
        print(f"❌ Error: {e}")
        import traceback
        traceback.print_exc()
