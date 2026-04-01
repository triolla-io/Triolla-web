# Duplicate HTML Section Detection & Consolidation Guide

A complete system for finding and consolidating duplicate HTML sections in your Next.js codebase.

---

## Overview

This guide covers two powerful tools:

1. **Duplicate Detection Script** (`detect-duplicates.js`) - Automated analysis of all 184 fragment files
2. **Consolidation Utilities** (`consolidation-utils.js`) - Helper tools for creating components and metadata

---

## Quick Start

### Find All Duplicates

```bash
node scripts/detect-duplicates.js
```

**Output:**
- Console report with high/medium/low priority sections
- Detailed JSON report saved to `DUPLICATE_REPORT.json`
- Consolidation recommendations with estimated code savings

### Find Specific Pattern

```bash
node scripts/consolidation-utils.js find-section unique_design
```

### Extract Section from File

```bash
node scripts/consolidation-utils.js extract-section home-body.html unique_design
```

### Generate New Component

```bash
node scripts/consolidation-utils.js generate-component portfolio-banner
```

---

## Available Scripts

### 1. detect-duplicates.js

**Purpose:** Automated scanning of all 184 fragment files to identify duplicate sections.

**Usage:**
```bash
# Default (5+ occurrences)
node scripts/detect-duplicates.js

# Verbose output
node scripts/detect-duplicates.js --verbose

# Custom threshold (e.g., 10+ occurrences)
node scripts/detect-duplicates.js --min-count 10
```

**What it does:**
- Scans entire fragments directory
- Searches for semantic section patterns
- Counts occurrences in each file
- Prioritizes by frequency (HIGH >= 10, MEDIUM 5-9, LOW < 5)
- Generates JSON report with file lists
- Estimates code savings

**Output Example:**
```
DUPLICATE HTML SECTION DETECTOR
======================================================================
Scanning 184 fragment files...

🔴 portfolio_banner     | 182 files | 98.9% | HIGH   | Portfolio showcase banner
🔴 unique_design        | 30  files | 16.3% | HIGH   | Design process flow with 8 steps
🔴 bullet_txt           | 29  files | 15.8% | HIGH   | Bulleted text items
🔴 port_cyber_con       | 26  files | 14.1% | HIGH   | Portfolio cybersecurity content

RECOMMENDED CONSOLIDATIONS (HIGH PRIORITY)
======================================================================
1. portfolio_banner - 182 files (98.9%)
2. unique_design - 30 files (16.3%)
3. bullet_txt - 29 files (15.8%)
4. port_cyber_con - 26 files (14.1%)

Detailed report saved to: DUPLICATE_REPORT.json
```

---

### 2. consolidation-utils.js

**Purpose:** Helper tools for manually consolidating sections.

**Commands:**

#### find-section
Find all files containing a specific section.

```bash
node scripts/consolidation-utils.js find-section <class-name>

# Example:
node scripts/consolidation-utils.js find-section unique_design
```

Output: Lists all files containing the class pattern.

#### extract-section
Extract HTML for a section from a specific file.

```bash
node scripts/consolidation-utils.js extract-section <file> <class-name>

# Example:
node scripts/consolidation-utils.js extract-section home-body.html unique_design
```

Output: Displays extracted HTML and saves to `_extracted_<class-name>.html`

#### generate-component
Create boilerplate React component.

```bash
node scripts/consolidation-utils.js generate-component <name>

# Example:
node scripts/consolidation-utils.js generate-component portfolio-banner
```

Output: Creates `web/app/components/PortfolioBanner.tsx`

#### generate-metadata
Create JSON metadata file for content management.

```bash
node scripts/consolidation-utils.js generate-metadata <name> [files...]

# Example:
node scripts/consolidation-utils.js generate-metadata portfolio-banner home-body.html about-us-body.html
```

Output: Creates `web/app/metadata/portfolio-banner-metadata.json`

#### list-patterns
Show all known patterns and their frequencies.

```bash
node scripts/consolidation-utils.js list-patterns
```

---

## Current Duplicates Detected

As of March 31, 2026:

| Section | Files | % | Priority | Status |
|---------|-------|---|----------|--------|
| portfolio_banner | 182 | 98.9% | HIGH | Pending |
| unique_design | 30 | 16.3% | HIGH | ✓ Completed |
| bullet_txt | 29 | 15.8% | HIGH | Pending |
| port_cyber_con | 26 | 14.1% | HIGH | Pending |

**Completed:**
- ✓ ProcessFlow component (unique_design, 30 files)

**Next Priority:**
- PortfolioBanner (182 files) - Highest impact
- BulletText (29 files)
- PortfolioCyberContent (26 files)

---

## Consolidation Workflow

### Step 1: Identify Duplicates
```bash
node scripts/detect-duplicates.js
```

Review output and choose a section to consolidate. Start with highest count.

### Step 2: Analyze the Section
```bash
node scripts/consolidation-utils.js find-section portfolio_banner
```

Note all affected files and understand the variations.

### Step 3: Extract a Sample
```bash
node scripts/consolidation-utils.js extract-section home-body.html portfolio_banner
```

Study the HTML structure and identify:
- Common elements
- Variations across files
- Dynamic content areas
- Dependencies (CSS classes, animations)

### Step 4: Create Component
```bash
node scripts/consolidation-utils.js generate-component portfolio-banner
```

Edit the generated component to:
- Accept props for variations
- Handle dynamic content
- Include necessary styling
- Support animation/interaction

Example structure:
```tsx
interface PortfolioBannerProps {
  title?: string;
  subtitle?: string;
  items?: BannerItem[];
  variant?: 'default' | 'compact';
}

export default function PortfolioBanner({ ... }: PortfolioBannerProps) {
  // Implementation
}
```

### Step 5: Create Metadata
```bash
node scripts/consolidation-utils.js generate-metadata portfolio-banner
```

Edit metadata to include:
- Default configuration
- Page-specific overrides
- Editable fields for content management
- Consolidation tracking

### Step 6: Create Template
Manual step - Save extracted HTML to:
```
web/public/assets/_shared/portfolio_banner-template.html
```

### Step 7: Replace in Fragments
Update all identified fragment files to use the component instead of inline HTML.

**Before:**
```html
<div class="portfolio_banner">
  <!-- 100+ lines of HTML -->
</div>
```

**After:**
```html
<PortfolioBanner metadataKey="home" />
```

Or for React pages:
```tsx
import PortfolioBanner from '@/app/components/PortfolioBanner';

export default function HomePage() {
  return <PortfolioBanner metadataKey="home" />;
}
```

### Step 8: Test
- Verify on 3+ different pages
- Check desktop and mobile rendering
- Test animations and interactions
- Validate styling matches original
- Check console for errors

### Step 9: Deploy
- Create commit with all changes
- Push to feature branch
- Create pull request
- Merge after review

---

## Directory Structure

### Components
```
web/app/components/
├── ProcessFlow.tsx ✓
├── PortfolioBanner.tsx (TODO)
├── BulletText.tsx (TODO)
└── PortfolioCyberContent.tsx (TODO)
```

### Metadata
```
web/app/metadata/
├── process-flow-metadata.json ✓
├── portfolio_banner-metadata.json (TODO)
├── bullet_txt-metadata.json (TODO)
└── port_cyber_con-metadata.json (TODO)
```

### Templates (Reference)
```
web/public/assets/_shared/
├── process-flow-template.html ✓
├── portfolio_banner-template.html (TODO)
├── bullet_txt-template.html (TODO)
└── port_cyber_con-template.html (TODO)
```

### Scripts
```
scripts/
├── detect-duplicates.js ✓
└── consolidation-utils.js ✓
```

---

## Understanding the Reports

### Console Output

```
🔴 portfolio_banner     | 182 files | 98.9% | HIGH   | Portfolio showcase banner
   ↓       ↓             ↓          ↓      ↓        ↓
  icon   pattern      count      percent priority   description
```

**Icons:**
- 🔴 Red = HIGH priority (10+ files, significant savings)
- 🟡 Yellow = MEDIUM priority (5-9 files, moderate savings)
- 🟢 Green = LOW priority (< 5 files, minimal savings)

### JSON Report (DUPLICATE_REPORT.json)

```json
{
  "timestamp": "2026-03-31T16:26:45.752Z",
  "totalFiles": 184,
  "duplicatesFound": 5,
  "highPriority": [
    {
      "name": "portfolio_banner",
      "pattern": "class=\"portfolio_banner\"",
      "occurrences": 182,
      "percentage": 98.9,
      "files": ["file1.html", "file2.html", ...],
      "estimatedSavings": "46 KB"
    }
  ],
  "allDuplicates": [...]
}
```

---

## Estimated Savings

Based on current analysis:

| Consolidation | Files | Savings | Priority |
|---------------|-------|---------|----------|
| PortfolioBanner | 182 | 46 KB | 1 (Highest) |
| ProcessFlow | 30 | 8 KB | 2 |
| BulletText | 29 | 7 KB | 3 |
| PortfolioCyberContent | 26 | 7 KB | 4 |
| **TOTAL** | - | **68 KB** | - |

These savings compound when minified and gzipped for production.

---

## Best Practices

### Do:
- ✓ Start with highest-frequency duplicates (portfolio_banner)
- ✓ Extract the most common version as the template
- ✓ Handle variations via props and metadata
- ✓ Test thoroughly on multiple pages
- ✓ Track consolidations in git
- ✓ Create clear component APIs
- ✓ Keep metadata in JSON for flexibility

### Don't:
- ✗ Don't consolidate sections that vary significantly
- ✗ Don't make components too generic/complex
- ✗ Don't skip testing on edge cases
- ✗ Don't remove fragments without full replacement
- ✗ Don't hard-code page-specific logic in components

---

## Troubleshooting

### Script not finding sections
```bash
# Check if files exist
find web/public/fragments -name "*.html" | wc -l

# Test grep directly
grep -r "unique_design" web/public/fragments | wc -l
```

### Component not rendering
- Check metadata is being loaded correctly
- Verify component props match metadata structure
- Check for missing dependencies
- Review console for errors

### Styling looks different
- Ensure CSS classes are preserved
- Check for responsive breakpoint issues
- Verify animation classes are applied
- Test on actual device/viewport sizes

---

## Advanced Usage

### Custom Pattern Search
```bash
# Find sections with specific patterns
grep -r "class=\"[^\"]*feature[^\"]*\"" web/public/fragments

# Count occurrences by pattern
grep -roh 'class="[^"]*feature[^"]*"' web/public/fragments | sort | uniq -c
```

### Generate Multiple Components at Once
```bash
for pattern in portfolio_banner bullet_txt port_cyber_con; do
  node scripts/consolidation-utils.js generate-component $pattern
done
```

### Batch Extract Sections
```bash
# Extract from all files with a pattern
for file in $(grep -rl 'class="unique_design"' web/public/fragments); do
  echo "=== $(basename $file) ==="
  grep -A 50 'class="unique_design"' "$file" | head -50
done
```

---

## Next Steps

1. **Run detection** to see current duplicates
2. **Review roadmap** (`CONSOLIDATION_ROADMAP.md`)
3. **Choose next consolidation** (portfolio_banner recommended)
4. **Follow workflow** step by step
5. **Test thoroughly** before deployment
6. **Update roadmap** with progress

---

## Support

**Questions?** Check these files:
- `CONSOLIDATION_ROADMAP.md` - Strategic plan and timeline
- `DUPLICATE_REPORT.json` - Latest analysis results
- Component examples:
  - `web/app/components/ProcessFlow.tsx` - Completed example
  - `web/app/metadata/process-flow-metadata.json` - Metadata template

**To regenerate analysis:**
```bash
node scripts/detect-duplicates.js --verbose > latest-analysis.txt
```

---

## File Locations

- Scripts: `/Users/ariell/html-to-react/scripts/`
- Components: `/Users/ariell/html-to-react/web/app/components/`
- Metadata: `/Users/ariell/html-to-react/web/app/metadata/`
- Templates: `/Users/ariell/html-to-react/web/public/assets/_shared/`
- Fragments: `/Users/ariell/html-to-react/web/public/fragments/`

---

**Last Updated:** March 31, 2026
**Analysis Version:** 1.0
**Total Fragments:** 184
**Duplicates Identified:** 5 (4 HIGH priority)
