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

def extract_lang_from_url(url):
    """Extract language from URL. Returns 'he' or 'en' (default)."""
    parsed = urlparse(url)
    path = parsed.path.strip('/')
    if path.startswith('he/') or path == 'he':
        return 'he'
    return 'en'

def discover_from_sitemap(domain):
    """Try to fetch sitemap.xml and extract URLs (handles sitemap indexes too)."""
    sitemap_url = f"https://{domain}/sitemap.xml"
    print(f"Fetching sitemap: {sitemap_url}", file=sys.stderr)
    text = fetch_text(sitemap_url)
    if not text:
        return None, False
    
    try:
        root = ET.fromstring(text)
        ns = {'sitemap': 'http://www.sitemaps.org/schemas/sitemap/0.9'}
        
        # Check if this is a sitemap index
        sitemaps = root.findall('.//sitemap:sitemap', ns)
        if sitemaps:
            print(f"Found sitemap index with {len(sitemaps)} sitemaps", file=sys.stderr)
            urls = []
            for sitemap in sitemaps:
                loc = sitemap.find('sitemap:loc', ns)
                if loc is not None and loc.text:
                    # Recursively fetch each sitemap
                    sub_urls, _ = discover_from_sitemap_url(loc.text)
                    if sub_urls:
                        urls.extend(sub_urls)
            return urls if urls else None, True
        
        # Regular sitemap with URLs
        url_elements = root.findall('.//sitemap:url', ns)
        urls = []
        for url_elem in url_elements:
            loc = url_elem.find('sitemap:loc', ns)
            if loc is not None and loc.text:
                urls.append(loc.text)
        return urls if urls else None, True
    except Exception as e:
        print(f"ERROR parsing sitemap: {e}", file=sys.stderr)
        return None, False

def discover_from_sitemap_url(sitemap_url):
    """Fetch a specific sitemap URL and extract page URLs."""
    text = fetch_text(sitemap_url)
    if not text:
        return None, False
    
    try:
        root = ET.fromstring(text)
        ns = {'sitemap': 'http://www.sitemaps.org/schemas/sitemap/0.9'}
        
        # Check if this is a sitemap index
        sitemaps = root.findall('.//sitemap:sitemap', ns)
        if sitemaps:
            urls = []
            for sitemap in sitemaps:
                loc = sitemap.find('sitemap:loc', ns)
                if loc is not None and loc.text:
                    sub_urls, _ = discover_from_sitemap_url(loc.text)
                    if sub_urls:
                        urls.extend(sub_urls)
            return urls if urls else None, True
        
        # Regular sitemap with URLs
        url_elements = root.findall('.//sitemap:url', ns)
        urls = []
        for url_elem in url_elements:
            loc = url_elem.find('sitemap:loc', ns)
            if loc is not None and loc.text:
                urls.append(loc.text)
        return urls if urls else None, True
    except Exception as e:
        print(f"ERROR parsing {sitemap_url}: {e}", file=sys.stderr)
        return None, False

def should_skip(url, patterns):
    """Check if URL matches skip patterns."""
    for pattern in patterns:
        if pattern in url:
            return True
    return False

def _manifest_has_hebrew_home(entries):
    """True if manifest already includes the WPML Hebrew homepage (/he/)."""
    for e in entries:
        p = (urlparse(e.get('url', '')).path or '/').rstrip('/')
        if p == '/he':
            return True
    return False


def merge_missing_locale_roots(domain, entries):
    """
    Sitemaps often omit the localized home URL (e.g. https://triolla.io/he/).
    Snapshots must be downloaded from that URL, not inferred from English /.
    """
    if _manifest_has_hebrew_home(entries):
        return
    he_url = urljoin(f'https://{domain}/', 'he/')
    slug = get_slug(he_url, domain)
    entries.append({
        'url': he_url,
        'slug': slug,
        'path': '/he/',
        'title': 'Hebrew Home',
        'lang': 'he',
        'status': 'pending'
    })


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
        lang = extract_lang_from_url(url)
        
        entries.append({
            'url': url,
            'slug': slug,
            'path': path,
            'title': title,
            'lang': lang,
            'status': 'pending'
        })

    merge_missing_locale_roots(domain, entries)
    
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
            'skippedPatterns': skip_patterns,
            'languagesSupported': ['en', 'he']
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
