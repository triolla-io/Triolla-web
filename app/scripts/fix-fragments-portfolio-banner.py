#!/usr/bin/env python3
"""One-off: wrap hero sections with .portfolio_banner where inline CSS defines it but HTML lacked the class."""

from __future__ import annotations

import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
FRAGMENTS = ROOT / "public" / "fragments"

# about_main + style block + portfolio_wrap (20 files)
ABOUT_MAIN_OPEN = re.compile(
    r'(<style type="text/css">\s*\n\.portfolio_banner\{[^}]+\}\s*\n</style>\s*\n)(\t<div class="portfolio_wrap">)',
    re.MULTILINE,
)
ABOUT_MAIN_CLOSE = re.compile(
    r"(\n {8}</div>\n {7}\n {4}</div>\n\t\n</div>\n\n<div class=\"about_one\">)",
    re.MULTILINE,
)


def fix_about_main(html: str) -> str:
    m_open = ABOUT_MAIN_OPEN.search(html)
    if not m_open:
        return html
    if 'class="portfolio_banner"' in html or "class='portfolio_banner'" in html:
        return html
    html = ABOUT_MAIN_OPEN.sub(r"\1\t<div class=\"portfolio_banner\">\n\2", html, count=1)
    html = ABOUT_MAIN_CLOSE.sub(
        r"\n        </div>\n       \n    </div>\n\t</div>\n\t\n</div>\n\n<div class=\"about_one\">",
        html,
        count=1,
    )
    return html


CONTACT_OPEN = re.compile(
    r'(<div class="inner_content contact_content">\s*\n)(        <div class="contact_wrap">)',
    re.MULTILINE,
)
CONTACT_CLOSE = re.compile(
    r"(                <div class=\"clr\"></div>\n            </div>        \n            \n        </div>\n)(    </div>\n\n\n    \n\n    \n</div>\n\n<div class=\"pageurl\")",
    re.MULTILINE,
)


def fix_contact(html: str) -> str:
    if 'class="portfolio_banner"' in html and "contact_content" in html:
        return html
    if ".portfolio_banner{" not in html or "contact_content" not in html:
        return html
    html, n1 = CONTACT_OPEN.subn(
        r'\1        <div class="portfolio_banner">\n\2',
        html,
        count=1,
    )
    if n1 == 0:
        return html
    html, n2 = CONTACT_CLOSE.subn(
        r"\1        </div>\n\2",
        html,
        count=1,
    )
    if n2 == 0:
        raise SystemExit("contact close pattern not found after open was fixed")
    return html


def main() -> None:
    names = [
        "about-us-body.html",
        "agritech-body.html",
        "agritech-he-body.html",
        "b2b-body.html",
        "b2b-he-body.html",
        "b2c-body.html",
        "b2c-he-body.html",
        "contact-us-body.html",
        "contact-us-he-body.html",
        "cyber-security-body.html",
        "device-iot-body.html",
        "fintech-finance-body.html",
        "fintech-finance-he-body.html",
        "gaming-he-body.html",
        "medical-healthcare-body.html",
        "medical-healthcare-he-body.html",
        "mobile-apps-body.html",
        "mobile-apps-he-body.html",
        "saas-platforms-body.html",
        "saas-platforms-he-body.html",
        "startups-tech-body.html",
        "startups-tech-he-body.html",
    ]
    for name in names:
        path = FRAGMENTS / name
        raw = path.read_text(encoding="utf-8", errors="surrogateescape")
        if "contact_content" in raw:
            new = fix_contact(raw)
        else:
            new = fix_about_main(raw)
        if new != raw:
            path.write_text(new, encoding="utf-8", errors="surrogateescape")
            print("updated", name)
        else:
            print("skip", name)


if __name__ == "__main__":
    main()
