#!/bin/bash

# Create favicon SVG
cat > favicon.svg << 'SVG'
<?xml version="1.0" encoding="UTF-8"?>
<svg width="32" height="32" xmlns="http://www.w3.org/2000/svg">
  <rect width="32" height="32" fill="#000000"/>
  <text x="16" y="24" font-size="20" font-weight="bold" text-anchor="middle" fill="#4a9eff" font-family="Arial">T</text>
</svg>
SVG

echo "✅ Created favicon.svg"

# Create simple favicon.ico placeholder
# This is a minimal ICO file (1x1 black pixel)
printf '\x00\x00\x01\x00\x01\x00\x01\x01\x00\x00\x01\x00\x18\x00\x30\x00\x00\x00\x16\x00\x00\x00' > favicon.ico
echo "✅ Created favicon.ico (placeholder)"

# Create apple-touch-icon.svg
cat > apple-touch-icon.svg << 'SVG'
<?xml version="1.0" encoding="UTF-8"?>
<svg width="180" height="180" xmlns="http://www.w3.org/2000/svg">
  <rect width="180" height="180" rx="40" fill="#000000"/>
  <text x="90" y="130" font-size="120" font-weight="bold" text-anchor="middle" fill="#4a9eff" font-family="Arial">T</text>
</svg>
SVG

echo "✅ Created apple-touch-icon.svg"

