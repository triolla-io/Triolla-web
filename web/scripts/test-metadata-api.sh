#!/bin/bash

# Test script for metadata API
# Usage: npm run dev, then in another terminal: bash scripts/test-metadata-api.sh

API_BASE="http://localhost:3000/api/metadata"

echo "🧪 Testing Metadata API..."
echo ""

# Test 1: Get list of all pages
echo "1️⃣  GET /api/metadata (list all pages)"
PAGES=$(curl -s "$API_BASE")
echo "$PAGES" | jq '.' 2>/dev/null || echo "$PAGES"
echo ""

# Test 2: Get specific page metadata
echo "2️⃣  GET /api/metadata/about-us (get page metadata)"
ABOUT=$(curl -s "$API_BASE/about-us")
echo "$ABOUT" | jq '.' 2>/dev/null || echo "$ABOUT"
echo ""

# Test 3: Update metadata (without saving to disk, just validating)
echo "3️⃣  PUT /api/metadata/about-us (test update)"
UPDATED=$(curl -s -X PUT "$API_BASE/about-us" \
  -H "Content-Type: application/json" \
  -d '{
    "slug": "about-us",
    "title_en": "Test Title | Triolla",
    "title_he": "כותרת בדיקה | טריולה",
    "description_en": "This is a test description",
    "description_he": "זה תיאור בדיקה",
    "og_image": "/og-image.png",
    "og_type": "website",
    "keywords_en": "test, keywords",
    "keywords_he": "בדיקה, מילים",
    "section": "main"
  }')
echo "$UPDATED" | jq '.' 2>/dev/null || echo "$UPDATED"
echo ""

# Test 4: Verify it was saved
echo "4️⃣  GET /api/metadata/about-us (verify update)"
VERIFY=$(curl -s "$API_BASE/about-us")
echo "$VERIFY" | jq '.title_en' 2>/dev/null || echo "$VERIFY"
echo ""

echo "✅ API tests complete!"
echo ""
echo "💡 Tips:"
echo "  - Check browser: http://localhost:3000/admin/metadata"
echo "  - Verify page title: http://localhost:3000/about-us (check <title> tag)"
echo "  - View current metadata file: cat app/metadata/about-us-metadata.json"
