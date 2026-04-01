# Metadata Schema Documentation

This directory contains all page metadata in JSON format. Each file follows the schema defined below.

## File Structure

```
metadata/
├── about-us-metadata.json
├── technology-metadata.json
├── services/
│   ├── ai-automation-metadata.json
│   ├── product-ux-ui-design-metadata.json
│   └── ... (other services)
└── SCHEMA.md (this file)
```

## JSON Schema

Every metadata file must conform to this structure:

```json
{
  "slug": "string",           // unique identifier (e.g., "about-us")
  "title_en": "string",       // English page title
  "title_he": "string",       // Hebrew page title
  "description_en": "string", // English meta description
  "description_he": "string", // Hebrew meta description
  "og_image": "string",       // (optional) social sharing image URL
  "og_type": "website|article", // page type
  "keywords_en": "string",    // (optional) comma-separated keywords
  "keywords_he": "string",    // (optional) comma-separated Hebrew keywords
  "section": "main|service|blog" // page category
}
```

## Field Details

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `slug` | string | ✓ | Unique page identifier. Must match filename (e.g., "about-us" for "about-us-metadata.json") |
| `title_en` | string | ✓ | Appears in browser tab. Keep to 50-60 chars for SEO. Include brand name. |
| `title_he` | string | ✓ | Hebrew version of title. |
| `description_en` | string | ✓ | Meta description. 150-160 chars. Shown in search results. |
| `description_he` | string | ✓ | Hebrew version of description. |
| `og_image` | string | × | URL to image for social sharing. Default: `/og-image.png` |
| `og_type` | enum | ✓ | Either `"website"` (default for most pages) or `"article"` (for blog posts) |
| `keywords_en` | string | × | SEO keywords, comma-separated. Example: `"design, UX, UI"` |
| `keywords_he` | string | × | Hebrew keywords, comma-separated. |
| `section` | enum | ✓ | Category: `"main"` (core pages), `"service"` (service detail pages), `"blog"` (articles) |

## Validation Rules

- All **required fields** must be non-empty strings
- `slug` must match the filename (without `-metadata.json`)
- `og_type` must be exactly `"website"` or `"article"`
- `section` must be `"main"`, `"service"`, or `"blog"`
- All language fields (ending in `_en` or `_he`) must be provided
- No trailing/leading whitespace in strings

## Examples

### Example: Main Page
```json
{
  "slug": "about-us",
  "title_en": "About Us | Triolla",
  "title_he": "אודות טריולה",
  "description_en": "Meet Triolla - a team of experienced UX/UI designers dedicated to creating world-class digital products.",
  "description_he": "הכירו את טריולה - צוות של מעצבי UX/UI בעלי ניסיון המוקדשים ליצור מוצרים דיגיטליים ברמה עולמית.",
  "og_image": "/og-image.png",
  "og_type": "website",
  "keywords_en": "about us, design agency, design company, UX/UI team",
  "keywords_he": "אודות, סוכנות עיצוב, חברת עיצוב, צוות UX/UI",
  "section": "main"
}
```

### Example: Service Page
```json
{
  "slug": "product-ux-ui-design",
  "title_en": "Product UX/UI Design Services | Triolla",
  "title_he": "שירותי עיצוב UX/UI למוצרים | טריולה",
  "description_en": "End-to-end product UX and UI design for digital products.",
  "description_he": "עיצוב UX ו-UI מקצה לקצה למוצרים דיגיטליים.",
  "og_image": "/og-image.png",
  "og_type": "website",
  "keywords_en": "product design, UX/UI design, digital product design",
  "keywords_he": "עיצוב מוצר, עיצוב UX/UI, עיצוב מוצרים דיגיטליים",
  "section": "service"
}
```

## How to Add a New Page

1. Create a new JSON file in the appropriate directory:
   - Main pages → `metadata/`
   - Services → `metadata/services/`
   - Blog posts → `metadata/` (future)

2. Name it `{slug}-metadata.json` (e.g., `services-new-service-metadata.json`)

3. Fill in all required fields following the schema above

4. Run validation:
   ```bash
   # The system validates automatically when you save through the editor
   # Or test via API:
   curl http://localhost:3000/api/metadata/{slug}
   ```

5. Update the page's `page.tsx` to load from the loader:
   ```tsx
   import { loadPageMetadata } from "../lib/metadataLoader";
   
   const pageMetadata = loadPageMetadata("your-slug", "en");
   ```

## Accessing Metadata

### In TypeScript/React
```typescript
import { loadPageMetadata, loadRawPageMetadata } from "../lib/metadataLoader";

// Get language-specific metadata
const meta = loadPageMetadata("about-us", "en");
// Returns: { title, description, og_image, og_type, keywords, section }

// Get raw unfiltered metadata (admin editor use)
const raw = loadRawPageMetadata("about-us");
// Returns: full PageMetadata object
```

### Via API
```bash
# Get single page metadata
curl http://localhost:3000/api/metadata/about-us

# Get all pages list
curl http://localhost:3000/api/metadata

# Update metadata
curl -X PUT http://localhost:3000/api/metadata/about-us \
  -H "Content-Type: application/json" \
  -d '{ ... }'
```

## Best Practices

1. **Keep titles concise** — 50-60 characters for optimal search results display
2. **Write descriptions for users** — Not search engines. Make them compelling.
3. **Use natural keywords** — Not keyword stuffed. "product design for startups" not "product, design, startups, web, app"
4. **Maintain consistency** — Brand name should appear in all English titles
5. **Bilingual parity** — Ensure Hebrew translations are natural, not literal
6. **Regular updates** — Keep metadata fresh; update when content changes significantly

## Troubleshooting

### Validation error: "Title required"
- Ensure `title_en` and `title_he` are non-empty strings
- Check for no trailing/leading whitespace

### "Slug mismatch" error
- Ensure the `slug` field in JSON matches the filename
- Example: file `about-us-metadata.json` should have `"slug": "about-us"`

### Changes not reflected on page
- Metadata is loaded at request/build time. Hard refresh browser or restart dev server.
- Check that the page's `page.tsx` calls `loadPageMetadata()`

---

For a user-friendly editing experience, use the web UI:
```
http://localhost:3000/admin/metadata
```

See [METADATA_EDITOR_GUIDE.md](../METADATA_EDITOR_GUIDE.md) for detailed instructions.
