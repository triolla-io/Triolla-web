#!/usr/bin/env python3
"""Generate missing blog Client components for 152 blog posts."""

import json
import os
from pathlib import Path

app_dir = Path("/Users/ariell/html-to-react/web/app")

# Find all blog-* directories with deps files
blog_dirs = sorted([
    d for d in app_dir.iterdir()
    if d.is_dir() and d.name.startswith("blog-") and not d.name == "blog"
])

print(f"🔍 Found {len(blog_dirs)} blog post directories\n")

# Template for page.tsx
PAGE_TEMPLATE = '''import type {{ Metadata }} from "next";
import {{ BlogPostClient }} from "./BlogPostClient";
import deps from "./{slug}-deps.json";

export const metadata: Metadata = {{
  title: "{title} | Triolla Blog",
  description: "Read the full article on Triolla's blog.",
}};

export default function BlogPostPage() {{
  return <BlogPostClient slug="{slug}" deps={{deps}} />;
}}
'''

# Template for BlogSlugClient.tsx
CLIENT_TEMPLATE = '''\"use client\";

import {{ TriollaPortfolioSnapshotClient }} from \"../lib/TriollaPortfolioSnapshotClient\";
import type {{ TriollaPortfolioSnapshotDeps }} from \"../lib/TriollaPortfolioSnapshotClient\";

export type BlogPostClientProps = {{
  slug: string;
  deps: TriollaPortfolioSnapshotDeps;
}};

export function BlogPostClient({{ slug, deps }}: BlogPostClientProps) {{
  return (
    <TriollaPortfolioSnapshotClient
      fragmentUrl={{`/fragments/blog-${{slug}}-body.html`}}
      deps={{deps}}
      pageLabel={{slug}}
      landingSlug={{`triolla-io-blog-${{slug}}`}}
      assetDir={{`blog-${{slug}}`}}
    />
  );
}}
'''

created = 0
skipped = 0

for blog_dir in blog_dirs:
    slug = blog_dir.name.replace("blog-", "")
    deps_file = blog_dir / f"{blog_dir.name}-deps.json"

    # Check if page.tsx already exists
    if (blog_dir / "page.tsx").exists():
        skipped += 1
        continue

    # Check if deps.json exists
    if not deps_file.exists():
        print(f"⏭️  {slug} - no deps.json, skipping")
        continue

    # Read deps to validate
    try:
        with open(deps_file) as f:
            deps_data = json.load(f)
    except:
        print(f"⏭️  {slug} - invalid deps.json, skipping")
        continue

    # Generate page.tsx
    title = slug.replace("-", " ").title()
    page_content = PAGE_TEMPLATE.format(slug=slug, title=title)

    page_path = blog_dir / "page.tsx"
    with open(page_path, "w") as f:
        f.write(page_content)

    # Generate BlogPostClient.tsx
    client_path = blog_dir / "BlogPostClient.tsx"
    with open(client_path, "w") as f:
        f.write(CLIENT_TEMPLATE)

    created += 2  # 2 files per blog post
    print(f"✅ {slug}")

print(f"\n{'='*70}")
print(f"✅ Created: {created // 2} page.tsx + {created // 2} BlogPostClient.tsx files")
print(f"⏭️  Skipped: {skipped} (already exist)")
print(f"{'='*70}\n")
