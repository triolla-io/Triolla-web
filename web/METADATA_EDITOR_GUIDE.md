# Metadata Editor Guide for Agents

This guide explains how to update page titles, descriptions, and SEO metadata without editing code.

## Quick Start

### Option 1: Web-Based Editor (Recommended for Agents)

1. **Start the dev server:**
   ```bash
   npm run dev
   ```

2. **Open the metadata editor:**
   ```
   http://localhost:3000/admin/metadata
   ```

3. **Select a page** from the list on the left (about-us, technology, services, etc.)

4. **Edit the metadata** in the form:
   - **English** (left column): Title, Description, Keywords
   - **Hebrew** (right column): Title, Description, Keywords
   - **OG Image**: Social sharing image URL
   - **OG Type**: "website" or "article"

5. **Click "Save Changes"** → JSON file updates automatically

6. **Verify** by reloading the page in your browser (Ctrl+F5 to hard refresh)

---

## Option 2: Direct API Calls (For Scripting/Automation)

### Get metadata for a page:
```bash
curl http://localhost:3000/api/metadata/about-us
```

**Response:**
```json
{
  "slug": "about-us",
  "title_en": "About Us | Triolla",
  "title_he": "אודות טריולה",
  "description_en": "Meet Triolla - a team of experienced...",
  "description_he": "הכירו את טריולה...",
  "og_image": "/og-image.png",
  "og_type": "website",
  "keywords_en": "about us, design agency, ...",
  "keywords_he": "אודות, סוכנות עיצוב, ...",
  "section": "main"
}
```

### Update metadata for a page:
```bash
curl -X PUT http://localhost:3000/api/metadata/about-us \
  -H "Content-Type: application/json" \
  -d '{
    "slug": "about-us",
    "title_en": "New Title | Triolla",
    "title_he": "כותרת חדשה | טריולה",
    "description_en": "Updated description...",
    "description_he": "תיאור מעודכן...",
    "og_image": "/og-image.png",
    "og_type": "website",
    "keywords_en": "new, keywords, here",
    "keywords_he": "מילים, חדשות, כאן",
    "section": "main"
  }'
```

### List all pages:
```bash
curl http://localhost:3000/api/metadata
```

---

## Metadata Fields

### Required Fields
- **`slug`** — Unique page identifier (e.g., "about-us", "product-ux-ui-design")
- **`title_en`** — English page title (appears in browser tab and social sharing)
- **`title_he`** — Hebrew page title
- **`description_en`** — English meta description (appears in search results, ~160 chars)
- **`description_he`** — Hebrew meta description
- **`og_type`** — Either "website" or "article"
- **`section`** — Either "main", "service", or "blog"

### Optional Fields
- **`og_image`** — URL to image for social sharing (default: `/og-image.png`)
- **`keywords_en`** — Comma-separated keywords for search
- **`keywords_he`** — Comma-separated Hebrew keywords

---

## Best Practices

### Title Guidelines
- Keep between 50-60 characters for best search results
- Include your brand name (e.g., "About Us | Triolla")
- Be descriptive but concise

### Description Guidelines
- Keep between 150-160 characters
- Use natural language (write for humans, not search engines)
- Include a call-to-action when relevant
- Avoid keyword stuffing

### Keywords Guidelines
- List 3-5 primary keywords
- Separate with commas
- Include long-tail keywords (e.g., "product design for startups")
- Both languages should have similar thematic keywords

---

## Available Pages to Edit

### Main Pages
- `about-us` — About Us page
- `technology` — Technology Solutions page

### Services (Examples)
- `ai-automation` — AI & Automation Services
- `product-ux-ui-design` — Product UX/UI Design Services
- `back-end-dev` — Back-End Development Services
- `front-end-dev` — Front-End Development Services
- `ui-design` — UI Design Services
- And 10+ more...

**List all available pages:**
```bash
curl http://localhost:3000/api/metadata | jq '.pages[] | .slug'
```

---

## Troubleshooting

### Changes not visible on the page?
1. **Hard refresh** the browser (Ctrl+F5 or Cmd+Shift+R)
2. Restart the dev server (`npm run dev`)
3. Check the browser console for errors

### "Validation failed" error?
- Ensure all required fields are filled in
- Check that `slug` matches the URL
- Ensure `og_type` is either "website" or "article"

### API returns 404?
- Check the slug spelling matches exactly
- Metadata must exist as a JSON file in `app/metadata/`

---

## File Locations

All metadata files are stored in JSON format:

```
web/app/metadata/
├── about-us-metadata.json
├── technology-metadata.json
└── services/
    ├── ai-automation-metadata.json
    ├── product-ux-ui-design-metadata.json
    └── ...
```

You can also edit these files directly (not recommended), but changes won't take effect until the dev server restarts.

---

## What Gets Updated When You Save?

When you update metadata through the editor:

1. **JSON file** is updated with new values
2. **Page metadata** (title tag, meta description, OG tags) updates on next page load
3. **SEO impact** takes effect when Google re-crawls the page
4. **Social sharing** preview updates (test with: https://www.opengraph.xyz/)

---

## Integration with Next.js

The metadata system is integrated with Next.js's built-in SEO functionality:

- **Server-side:** `/app/lib/metadataLoader.ts` loads JSON at build/request time
- **Generation:** `generatePageMetadata()` in `metadata.ts` creates final metadata
- **HTML Output:** Next.js generates proper `<title>`, `<meta>`, and `<og:*>` tags

Example page that uses metadata:
```tsx
// app/about-us/page.tsx
const pageMetadata = loadPageMetadata("about-us", "en");
export const metadata = generatePageMetadata({
  title: pageMetadata.title,
  description: pageMetadata.description,
  // ... other fields
});
```

---

## Questions?

For detailed architecture, see:
- `/app/lib/metadataLoader.ts` — Loading + validation logic
- `/app/lib/metadata.ts` — Next.js metadata generation
- `/app/api/metadata/route.ts` — API endpoints
- `/app/admin/metadata/page.tsx` — Web UI component
