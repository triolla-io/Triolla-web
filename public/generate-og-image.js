const fs = require("fs");
const path = require("path");

// Create a simple SVG-based OG image
const svgContent = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#000;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#1a1a1a;stop-opacity:1" />
    </linearGradient>
  </defs>
  
  <rect width="1200" height="630" fill="url(#grad1)"/>
  
  <!-- Main Text -->
  <text x="600" y="250" font-size="72" font-weight="bold" text-anchor="middle" fill="#ffffff" font-family="Arial, sans-serif">
    Triolla
  </text>
  
  <text x="600" y="350" font-size="48" text-anchor="middle" fill="#e0e0e0" font-family="Arial, sans-serif">
    Product UX/UI Design Studio
  </text>
  
  <text x="600" y="420" font-size="32" text-anchor="middle" fill="#b0b0b0" font-family="Arial, sans-serif">
    #1 Design Studio in Israel
  </text>
  
  <!-- Accent line -->
  <line x1="300" y1="480" x2="900" y2="480" stroke="#4a9eff" stroke-width="4"/>
</svg>`;

fs.writeFileSync("og-image.svg", svgContent);
console.log("✅ Created og-image.svg");

// Convert SVG to PNG using a data URI approach or just note that it needs conversion
console.log("Note: SVG created. Use online converter or upload as-is for now.");
console.log("Recommended: Use RealFaviconGenerator.net for proper OG image generation.");
