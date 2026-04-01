#!/usr/bin/env python3
"""
Run multiple download_worker or convert_worker processes without opening N terminals.

Logs go to .pipeline-logs/ so output is readable (one file per worker).

  python3 pipeline/run_parallel_workers.py download -j 6
  python3 pipeline/run_parallel_workers.py convert -j 4
  python3 pipeline/run_parallel_workers.py download -j 4 --include-file pipeline/include.txt
  python3 pipeline/run_parallel_workers.py download -j 6 --order start   # top of urls.json first

Faster throughput = more workers (-j), until the site or your network starts failing.
"""
from __future__ import annotations

import argparse
import subprocess
import sys
from pathlib import Path

_REPO = Path(__file__).resolve().parents[1]


def main() -> None:
    ap = argparse.ArgumentParser(description="Run N parallel download or convert workers")
    ap.add_argument("mode", choices=("download", "convert"), help="Worker type")
    ap.add_argument(
        "-j",
        "--jobs",
        type=int,
        default=4,
        metavar="N",
        help="Parallel worker count (default: 4)",
    )
    ap.add_argument(
        "--log-dir",
        type=Path,
        default=_REPO / ".pipeline-logs",
        help="Per-worker log directory",
    )
    args, forwarded = ap.parse_known_args()

    if args.jobs < 1:
        sys.exit("--jobs must be >= 1")

    script = "download_worker.py" if args.mode == "download" else "convert_worker.py"
    script_path = _REPO / "pipeline" / script
    if not script_path.is_file():
        sys.exit(f"Missing {script_path}")

    args.log_dir.mkdir(parents=True, exist_ok=True)
    cmd_base = [sys.executable, str(script_path), *forwarded]

    procs: list[subprocess.Popen] = []
    for i in range(1, args.jobs + 1):
        log_path = args.log_dir / f"{args.mode}-{i}.log"
        log_f = open(log_path, "w", encoding="utf-8")
        p = subprocess.Popen(cmd_base, cwd=str(_REPO), stdout=log_f, stderr=subprocess.STDOUT)
        procs.append(p)
        print(f"started {args.mode} worker {i}/{args.jobs} pid={p.pid} log={log_path}")

    print("Waiting until all workers finish (nothing left to claim)…")
    worst = 0
    for p in procs:
        r = p.wait()
        if r != 0 and r > worst:
            worst = r
    if worst != 0:
        print(f"One or more workers exited non-zero (max exit {worst}). Check logs in {args.log_dir}", file=sys.stderr)
    sys.exit(worst)


if __name__ == "__main__":
    main()
