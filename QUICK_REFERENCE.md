# Consolidation System - Quick Reference

## Commands

```bash
# Scan for all duplicates
node scripts/detect-duplicates.js

# Find files with a pattern
node scripts/consolidation-utils.js find-section <class-name>

# Extract HTML from a file
node scripts/consolidation-utils.js extract-section <file> <class-name>

# Generate component
node scripts/consolidation-utils.js generate-component <name>

# Generate metadata
node scripts/consolidation-utils.js generate-metadata <name>

# List all patterns
node scripts/consolidation-utils.js list-patterns
```

## Current Duplicates

| Pattern | Files | % | Priority | Status |
|---------|-------|---|----------|--------|
| portfolio_banner | 182 | 98.9 | HIGH | Pending |
| unique_design | 30 | 16.3 | HIGH | ✓ Done |
| bullet_txt | 29 | 15.8 | HIGH | Pending |
| port_cyber_con | 26 | 14.1 | HIGH | Pending |

## Files

| Purpose | Path |
|---------|------|
| Scripts | `scripts/detect-duplicates.js`, `consolidation-utils.js` |
| Analysis | `DUPLICATE_REPORT.json` |
| Component Example | `web/app/components/ProcessFlow.tsx` |
| Metadata Example | `web/app/metadata/process-flow-metadata.json` |
| Documentation | `CONSOLIDATION_GUIDE.md`, `CONSOLIDATION_ROADMAP.md`, `CONSOLIDATION_SUMMARY.md` |

## ProcessFlow Component (Complete)

```tsx
import ProcessFlow from '@/app/components/ProcessFlow';

// Default
<ProcessFlow />

// Custom
<ProcessFlow
  title="Our Process"
  steps={[...]}
  customMetadataKey="home"
/>
```

**Metadata:** `web/app/metadata/process-flow-metadata.json`
**Template:** `web/public/assets/_shared/process-flow-template.html`
**Replaces:** 30 duplicate sections

## Next Priority

**Portfolio Banner** (182 files, 98.9%)
- Highest impact
- Timeline: Week of April 7
- Effort: 4-5 hours

## Consolidation Checklist

- [ ] Run detect-duplicates.js
- [ ] Choose pattern to consolidate
- [ ] node consolidation-utils.js find-section <pattern>
- [ ] node consolidation-utils.js extract-section <file> <pattern>
- [ ] node consolidation-utils.js generate-component <name>
- [ ] node consolidation-utils.js generate-metadata <name>
- [ ] Create template HTML file
- [ ] Update all fragment files
- [ ] Test on multiple pages
- [ ] Git commit & push
- [ ] Code review & merge

## File Organization

```
/Users/ariell/html-to-react/
├── scripts/
│   ├── detect-duplicates.js
│   └── consolidation-utils.js
├── web/app/
│   ├── components/ProcessFlow.tsx
│   └── metadata/process-flow-metadata.json
├── web/public/assets/_shared/process-flow-template.html
├── DUPLICATE_REPORT.json
├── CONSOLIDATION_ROADMAP.md
├── CONSOLIDATION_SUMMARY.md
├── DUPLICATE_DETECTION_GUIDE.md
└── QUICK_REFERENCE.md (this file)
```

## Key Metrics

- Total fragments: 184
- Duplicates found: 5
- Potential savings: 68 KB
- ProcessFlow status: ✓ Complete (30 files)
- Time to implement roadmap: 15-20 hours

## See Also

- Full guide: `DUPLICATE_DETECTION_GUIDE.md`
- Strategic plan: `CONSOLIDATION_ROADMAP.md`
- Complete summary: `CONSOLIDATION_SUMMARY.md`
- Latest report: `DUPLICATE_REPORT.json`
