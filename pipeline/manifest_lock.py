"""Exclusive flock on pipeline/urls.json for safe multi-process updates (macOS/Linux)."""
from __future__ import annotations

import fcntl
import json
from contextlib import contextmanager
from typing import Any, Callable


@contextmanager
def manifest_transaction(manifest_path: str):
    """
    Hold an exclusive lock for the whole critical section.
    Yields (data_dict, save_callable). Call save() after mutating data.
    """
    with open(manifest_path, "r+", encoding="utf-8") as f:
        fcntl.flock(f.fileno(), fcntl.LOCK_EX)
        try:
            f.seek(0)
            data: dict[str, Any] = json.load(f)

            def save() -> None:
                f.seek(0)
                json.dump(data, f, indent=2)
                f.truncate()

            yield data, save
        finally:
            fcntl.flock(f.fileno(), fcntl.LOCK_UN)


def update_slug_status(manifest_path: str, slug: str, status: str) -> None:
    """Set status for every manifest row with this slug (atomic under flock).

    urls.json can contain duplicate rows for the same slug (e.g. sitemap + alternate URL).
    Updating only the first row left duplicates stuck on ``downloading`` / ``pending``.
    """
    with manifest_transaction(manifest_path) as (data, save):
        for entry in data["urls"]:
            if entry["slug"] == slug:
                entry["status"] = status
        save()


def release_stuck_claims(manifest_path: str) -> tuple[int, int]:
    """
    Reset claim markers left after a crash (no workers should be running).
    downloading -> pending, converting -> downloaded
    Returns (download_reset_count, convert_reset_count).
    """
    d_reset = 0
    c_reset = 0
    with manifest_transaction(manifest_path) as (data, save):
        for entry in data["urls"]:
            if entry["status"] == "downloading":
                entry["status"] = "pending"
                d_reset += 1
            elif entry["status"] == "converting":
                entry["status"] = "downloaded"
                c_reset += 1
        save()
    return d_reset, c_reset
