#!/usr/bin/env python3
"""
Generic: extract <body> HTML (no <script>) + ordered css/js lists from a triolla snapshot.

Defaults target about-us; override paths for any page.

Usage:
  python3 scripts/extract_snapshot_fragment.py
  python3 scripts/extract_snapshot_fragment.py \\
    --html ../../landing-page/triolla-io-home/index.html \\
    --out-body public/fragments/home-body.html \\
    --out-deps app/home/home-deps.json \\
    --asset-base /assets/triolla-io-home

  WordPress mirror (absolute https://triolla.io/... URLs in HTML):
  python3 scripts/extract_snapshot_fragment.py \\
    --html ../landing-page/triolla-io-technology/index.html \\
    --out-body public/fragments/technology-body.html \\
    --out-deps app/technology/technology-deps.json \\
    --asset-base /assets/triolla-io-technology \\
    --rewrite-origin https://triolla.io
"""
from __future__ import annotations

import argparse
import html as html_lib
import json
import re
import sys
from pathlib import Path

REPO = Path(__file__).resolve().parents[2]


def _norm_origin(origin: str) -> str:
    return origin.rstrip("/")


def _should_skip_css_relative(path: str) -> bool:
    p = path.lower()
    return "wp-block-library" in p or "/dist/block-library/" in p


def _should_skip_js_url(src: str) -> bool:
    s = src.lower()
    if "/wp-includes/js/jquery/jquery.min.js" in s:
        return True
    if "/wp-includes/js/jquery/jquery-migrate" in s:
        return True
    if "js.hs-scripts.com" in s:
        return True
    if "cdn.nagishexpress.co.il" in s or "nagishexpress" in s:
        return True
    if "email-decode.min.js" in s and "cloudflare" in s:
        return True
    return False


def _cdn_js_allowed(src: str) -> bool:
    s = src.lower()
    if "cdnjs.cloudflare.com" not in s:
        return False
    return "bodymovin" in s or "/gsap/" in s


def extract_ordered_css_absolute(html: str, origin: str) -> list[str]:
    base = _norm_origin(origin) + "/"
    esc = re.escape(base)
    out: list[str] = []
    for m in re.finditer(
        rf"<link\s[^>]*href=['\"]({esc}[^'\"]+)['\"][^>]*>", html, re.I
    ):
        tag = m.group(0)
        if not re.search(r"rel\s*=\s*['\"]stylesheet['\"]", tag, re.I):
            continue
        href = html_lib.unescape(m.group(1))
        rel = href[len(base) :]
        if _should_skip_css_relative(rel):
            continue
        if rel not in out:
            out.append(rel)
    return out


def extract_ordered_js_mixed(html: str, origin: str) -> list[str]:
    """Origin-relative paths plus allowed CDN URLs (e.g. lottie, gsap), in document order."""
    base = _norm_origin(origin) + "/"
    out: list[str] = []
    for m in re.finditer(
        r"<script\b[^>]*?\bsrc=['\"]([^'\"]+)['\"]", html, re.I | re.DOTALL
    ):
        src = html_lib.unescape(m.group(1)).strip()
        if _should_skip_js_url(src):
            continue
        if src.startswith(base):
            rel = src[len(base) :]
            if rel and rel not in out:
                out.append(rel)
        elif _cdn_js_allowed(src):
            if src not in out:
                out.append(src)
    return out


def rewrite_origin_urls(fragment: str, origin: str, asset_base: str) -> str:
    base = asset_base.rstrip("/") + "/"
    o = _norm_origin(origin)
    for prefix in (f"{o}/", o.replace("https://", "http://") + "/"):
        fragment = fragment.replace(prefix, base)
    return fragment


def extract_ordered_css(html: str, local_prefix: str) -> list[str]:
    esc = re.escape(local_prefix)
    out: list[str] = []
    for m in re.finditer(
        rf"<link\s[^>]*href=['\"]({esc}[^'\"]+)['\"][^>]*>", html, re.I
    ):
        tag = m.group(0)
        if re.search(r"rel\s*=\s*['\"]stylesheet['\"]", tag, re.I):
            path = m.group(1)
            name = path[len(local_prefix) :]
            if name not in out:
                out.append(name)
    return out


def extract_ordered_js(html: str, local_prefix: str) -> list[str]:
    esc = re.escape(local_prefix)
    out: list[str] = []
    for m in re.finditer(
        rf"<script\s[^>]*src=['\"]({esc}[^'\"]+\.js)['\"][^>]*>", html, re.I
    ):
        path = m.group(1)
        name = path[len(local_prefix) :]
        if name not in out:
            out.append(name)
    return out


def body_inner(html: str) -> str:
    m = re.search(r"<body[^>]*>", html, re.I)
    if not m:
        raise ValueError("no <body>")
    start = m.end()
    end = html.lower().rfind("</body>")
    if end == -1:
        raise ValueError("no </body>")
    return html[start:end]


def strip_scripts(fragment: str) -> str:
    return re.sub(
        r"<script\b[^>]*>.*?</script>",
        "",
        fragment,
        flags=re.DOTALL | re.IGNORECASE,
    )


def body_class(html: str) -> str:
    m = re.search(r"<body[^>]*\sclass=['\"]([^'\"]+)['\"]", html, re.I)
    return m.group(1).strip() if m else ""


def body_data_rsssl(html: str) -> str | None:
    m = re.search(r"<body[^>]*\bdata-rsssl\s*=\s*([0-9]+)", html, re.I)
    return m.group(1) if m else None


def main() -> int:
    p = argparse.ArgumentParser(description="Extract body fragment + deps for Next.js snapshot page")
    p.add_argument(
        "--html",
        type=Path,
        default=REPO / "landing-page/triolla-io-about-us/index.html",
        help="Source snapshot index.html",
    )
    p.add_argument(
        "--out-body",
        type=Path,
        default=REPO / "web/public/fragments/about-us-body.html",
        help="Output body HTML (scripts stripped, paths rewritten)",
    )
    p.add_argument(
        "--out-deps",
        type=Path,
        default=REPO / "web/app/about-us/about-us-deps.json",
        help="Output deps JSON for the client loader",
    )
    p.add_argument(
        "--asset-base",
        default="/assets/triolla-io-about-us",
        help="Public URL prefix for assets, e.g. /assets/my-page-slug",
    )
    p.add_argument(
        "--local-prefix",
        default="_assets/",
        help="Path prefix in the HTML before rewrite (triolla downloads use _assets/)",
    )
    p.add_argument(
        "--rewrite-origin",
        default="",
        metavar="URL",
        help=(
            "If set (e.g. https://triolla.io), extract css/js from absolute site URLs, "
            "rewrite body https://origin/ → asset-base/, and set pathEncoding=segments in JSON."
        ),
    )
    args = p.parse_args()

    local_prefix: str = args.local_prefix
    if not local_prefix.endswith("/"):
        local_prefix += "/"

    asset_base: str = args.asset_base.rstrip("/")

    if not args.html.is_file():
        print(f"missing --html {args.html}", file=sys.stderr)
        return 1

    html = args.html.read_text(encoding="utf-8", errors="replace")
    body_class_name = body_class(html)
    data_rsssl = body_data_rsssl(html)
    inner = body_inner(html)
    inner = strip_scripts(inner)

    if args.rewrite_origin:
        origin = _norm_origin(args.rewrite_origin)
        css = extract_ordered_css_absolute(html, origin)
        js = extract_ordered_js_mixed(html, origin)
        inner = rewrite_origin_urls(inner, origin, asset_base)
    else:
        css = extract_ordered_css(html, local_prefix)
        js = extract_ordered_js(html, local_prefix)
        inner = inner.replace(local_prefix, f"{asset_base}/")

    args.out_body.parent.mkdir(parents=True, exist_ok=True)
    banner = (
        "<!-- Snapshot body fragment only: no stylesheets here. "
        "Open the Next.js route (e.g. /technology) so the client injects CSS/JS. -->\n\n"
    )
    args.out_body.write_text(banner + inner.strip() + "\n", encoding="utf-8")

    payload: dict = {
        "assetBase": asset_base,
        "bodyClass": body_class_name,
        "dataRsssl": data_rsssl,
        "css": css,
        "js": js,
    }
    if args.rewrite_origin:
        payload["pathEncoding"] = "segments"
    args.out_deps.parent.mkdir(parents=True, exist_ok=True)
    args.out_deps.write_text(json.dumps(payload, indent=2) + "\n", encoding="utf-8")
    print(f"wrote {args.out_body} ({len(inner)} chars)")
    print(f"wrote {args.out_deps} ({len(css)} css, {len(js)} js)")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
