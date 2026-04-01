#!/bin/bash
# Quick start: full pipeline in one shot (single agent)
#
# Optional: only process pages listed in a file (slug, /path/, or URL per line):
#   PIPELINE_INCLUDE_FILE=pipeline/include.txt ./QUICK_START.sh
#   ./QUICK_START.sh pipeline/include.txt
# See pipeline/include.example.txt

set -e

INCLUDE_ARGS=()
if [ -n "${PIPELINE_INCLUDE_FILE:-}" ]; then
  INCLUDE_ARGS=(--include-file "$PIPELINE_INCLUDE_FILE")
elif [ -n "${1:-}" ] && [ -f "$1" ]; then
  INCLUDE_ARGS=(--include-file "$1")
  shift
fi

echo "🚀 HTML-to-React Batch Pipeline"
echo "================================"
echo ""

# Step 1: Check discovery
if [ ! -f "pipeline/urls.json" ]; then
    echo "📍 Step 1: Discovering URLs..."
    python3 pipeline/discover.py triolla.io
    echo ""
else
    COUNT=$(python3 -c "import json; print(json.load(open('pipeline/urls.json'))['totalPages'])")
    echo "✅ Step 1 already done: $COUNT pages discovered"
    echo ""
fi

# Step 2: Download (do not stop the whole pipeline if some pages fail)
echo "📍 Step 2: Downloading pages to landing-page/..."
echo "   (Large pages may take several minutes each; timeout is 600s per page)"
DOWNLOAD_EXIT=0
python3 landing-page/_batch_download.py --repo-root . "${INCLUDE_ARGS[@]}" || DOWNLOAD_EXIT=$?
echo ""

# Step 3: Convert — still run so completed snapshots get synced to web/
echo "📍 Step 3: Converting to Next.js..."
CONVERT_EXIT=0
python3 pipeline/batch_convert.py --repo-root . "${INCLUDE_ARGS[@]}" || CONVERT_EXIT=$?
echo ""

# Step 4: Summary
echo "✅ Pipeline complete!"
echo ""
echo "📊 Summary:"
python3 -c "import json; d=json.load(open('pipeline/urls.json')); from collections import Counter; s=Counter(u['status'] for u in d['urls']); print(f\"   Downloaded: {s.get('downloaded', 0)}\"); print(f\"   Converted: {s.get('converted', 0)}\"); print(f\"   Pending: {s.get('pending', 0)}\")"
echo ""
echo "🎯 Next: cd web && npm run dev"
echo "   Then visit http://localhost:3000/about-us"

if [ "$DOWNLOAD_EXIT" -ne 0 ] || [ "$CONVERT_EXIT" -ne 0 ]; then
  echo ""
  echo "⚠️  Some steps failed (download exit $DOWNLOAD_EXIT, convert exit $CONVERT_EXIT)."
  echo "   Re-run the same command to retry; finished folders are skipped."
  exit 1
fi
