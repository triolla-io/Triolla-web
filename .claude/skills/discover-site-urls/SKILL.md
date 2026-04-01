---
name: discover-site-urls
description: Discover and catalog all pages on a website (triolla.io or custom domain) by scraping sitemap.xml or crawling from homepage. Outputs a canonical URLs manifest (JSON) consumed by batch-download and orchestration pipeline.
---

# Discover Site URLs

Scan a website and produce a **`pipeline/urls.json`** manifest that lists all pages to convert. This is the **source of truth** for the download→convert pipeline.

## Triggers

Apply when the user:
- Asks to "discover URLs", "scan the site", "build a URL list"
- Invokes **`/discover [domain]`** (e.g. `/discover triolla.io`)
- Wants to set up a batch pipeline for multiple pages

## Output

**`pipeline/urls.json`**

```json
{
  "domain": "triolla.io",
  "scrapedAt": "2026-03-28T19:30:00Z",
  "source": "sitemap",
  "slugRule": "host-dots-to-hyphens + path segments",
  "totalPages": 8,
  "urls": [
    {
      "url": "https://triolla.io/",
      "slug": "triolla-io-home",
      "path": "/",
      "title": "Home",
      "status": "pending"
    },
    {
      "url": "https://triolla.io/about-us/",
      "slug": "triolla-io-about-us",
      "path": "/about-us/",
      "title": "About Us",
      "status": "pending"
    },
    {
      "url": "https://triolla.io/services/technology/",
      "slug": "triolla-io-technology",
      "path": "/services/technology/",
      "title": "Technology",
      "status": "pending"
    }
  ],
  "metadata": {
    "sitemapFetched": true,
    "sitemapUrl": "https://triolla.io/sitemap.xml",
    "pageCount": 8,
    "skippedPatterns": ["wp-admin", "wp-json", "preview", "category", "tag"]
  }
}
```

## Method: Python discovery script

Write **`pipeline/discover.py`** (generic, reusable) once. Run with domain and optional flags.

```python
#!/usr/bin/env python3
"""Discover all pages on a website. Outputs pipeline/urls.json"""
import argparse
import json
import sys
import re
from urllib.parse import urljoin, urlparse, urlunparse
from urllib.request import Request, urlopen
from datetime import datetime
from xml.etree import ElementTree as ET

UA = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36"

def fetch_text(url):
    """Fetch URL and return text."""
    req = Request(url, headers={"User-Agent": UA})
    try:
        with urlopen(req, timeout=30) as r:
            return r.read().decode('utf-8', errors='replace')
    except Exception as e:
        print(f"ERROR fetching {url}: {e}", file=sys.stderr)
        return None

def get_slug(url, domain):
    """Convert https://domain/path/ to domain-hyphenated-path."""
    parsed = urlparse(url)
    host = parsed.netloc.replace('.', '-').replace('www-', '')
    path = parsed.path.strip('/').replace('/', '-')
    if not path:
        return host + '-home'
    return f"{host}-{path}"

def discover_from_sitemap(domain):
    """Try to fetch sitemap.xml and extract URLs."""
    sitemap_url = f"https://{domain}/sitemap.xml"
    print(f"Fetching sitemap: {sitemap_url}", file=sys.stderr)
    text = fetch_text(sitemap_url)
    if not text:
        return None, False
    
    try:
        root = ET.fromstring(text)
        ns = {'sitemap': 'http://www.sitemaps.org/schemas/sitemap/0.9'}
        urls = []
        for loc in root.findall('.//sitemap:loc', ns):
            url = loc.text
            if url:
                urls.append(url)
        return urls, True
    except Exception as e:
        print(f"ERROR parsing sitemap: {e}", file=sys.stderr)
        return None, False

def should_skip(url, patterns):
    """Check if URL matches skip patterns."""
    for pattern in patterns:
        if pattern in url:
            return True
    return False

def build_manifest(domain, urls, source='sitemap', skip_patterns=None):
    """Build the JSON manifest."""
    if skip_patterns is None:
        skip_patterns = ['wp-admin', 'wp-json', 'preview', 'category', 'tag', 'author', '?']
    
    entries = []
    for url in urls:
        if should_skip(url, skip_patterns):
            continue
        
        slug = get_slug(url, domain)
        path = urlparse(url).path or '/'
        title = path.strip('/').split('/')[-1].replace('-', ' ').title() or 'Home'
        
        entries.append({
            'url': url,
            'slug': slug,
            'path': path,
            'title': title,
            'status': 'pending'
        })
    
    manifest = {
        'domain': domain,
        'scrapedAt': datetime.utcnow().isoformat() + 'Z',
        'source': source,
        'slugRule': 'host-dots-to-hyphens + path-segments',
        'totalPages': len(entries),
        'urls': entries,
        'metadata': {
            'sitemapFetched': source == 'sitemap',
            'sitemapUrl': f'https://{domain}/sitemap.xml',
            'pageCount': len(entries),
            'skippedPatterns': skip_patterns
        }
    }
    return manifest

def main():
    parser = argparse.ArgumentParser(description='Discover all pages on a domain')
    parser.add_argument('domain', help='Domain (e.g., triolla.io)')
    parser.add_argument('--output', default='pipeline/urls.json', help='Output JSON file')
    args = parser.parse_args()
    
    domain = args.domain.rstrip('/')
    
    # Try sitemap first
    urls, found_sitemap = discover_from_sitemap(domain)
    
    if urls:
        manifest = build_manifest(domain, urls, source='sitemap')
        source = 'sitemap'
    else:
        print(f"WARNING: Could not fetch sitemap. Crawling from homepage.", file=sys.stderr)
        # Fallback: crawl from homepage
        urls = set()
        visited = set()
        queue = [f'https://{domain}/']
        max_pages = 50
        
        while queue and len(urls) < max_pages:
            url = queue.pop(0)
            if url in visited:
                continue
            visited.add(url)
            
            text = fetch_text(url)
            if not text:
                continue
            
            urls.add(url)
            
            # Extract links
            for match in re.finditer(r'href=["\']([^"\']+)["\']', text):
                link = match.group(1)
                if link.startswith('http'):
                    abs_url = link
                elif link.startswith('/'):
                    abs_url = f'https://{domain}{link}'
                else:
                    continue
                
                parsed = urlparse(abs_url)
                if parsed.netloc == domain and abs_url not in visited:
                    queue.append(abs_url)
        
        manifest = build_manifest(domain, list(urls), source='crawl')
        source = 'crawl'
    
    # Write manifest
    import os
    os.makedirs(os.path.dirname(args.output) or '.', exist_ok=True)
    with open(args.output, 'w') as f:
        json.dump(manifest, f, indent=2)
    
    print(f"✓ Discovered {len(manifest['urls'])} pages from {source}")
    print(f"✓ Manifest: {args.output}")
    print(f"  Entries: {manifest['totalPages']}")

if __name__ == '__main__':
    main()
```

## Steps

1. Decide **domain** (e.g., `triolla.io`).
2. Run: `python3 pipeline/discover.py triolla.io --output pipeline/urls.json`
3. Review `pipeline/urls.json` — verify URLs and slugs look right.
4. Pass manifest to **batch-download** step (next in pipeline). To process **only some pages**, create `pipeline/include.txt` from `pipeline/include.example.txt` and run `landing-page/_batch_download.py --repo-root . --include-file pipeline/include.txt` (same flag for `pipeline/batch_convert.py`, or `./QUICK_START.sh pipeline/include.txt`).

## Output checklist

- [ ] `pipeline/urls.json` created
- [ ] `totalPages` > 0
- [ ] Each entry has `url`, `slug`, `path`, `title`, `status: "pending"`
- [ ] No query strings or fragments (cleaned)
- [ ] No duplicates

## Edge cases

- **Sitemap 404:** Falls back to crawl (slower, shallower, configurable max pages)
- **Crawl timeout:** Stops after 30s per URL; partial results still valid
- **Already crawled domains:** Rerun discover to refresh `scrapedAt` and reset all statuses to `pending`

## Next: Batch Download

Hand off `pipeline/urls.json` to the batch-download orchestrator or directly to `landing-page/_batch_download.py`. Optional subset: `--include-file pipeline/include.txt` (slug, `/path/`, or URL per line).
