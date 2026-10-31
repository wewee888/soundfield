#!/usr/bin/env python3
"""Generate sitemap.xml for soundtest.pro.

Rules:
- Scan every .html file on disk; skip files inside test-results/, _temp/, scripts/, functions/, assets/, public/, a/, b/, c/.
- Map each .html to its canonical URL using _redirects rules (302 .html -> clean URL).
- Skip pages that 302 to another page (canonical page replaces them in the sitemap).
- Detect language code from path (en/, zh/, ...).
- Emit xhtml:link hreflang entries for every translated sibling of the same logical page.
- Use file mtime (ISO 8601 date) for <lastmod>.
"""

from __future__ import annotations

import os
import sys
from pathlib import Path
from datetime import datetime, timezone
from xml.sax.saxutils import escape

sys.path.insert(0, str(Path(__file__).resolve().parent))
from public_urls import (  # noqa: E402
    LANGS,
    SKIP_DIRS,
    logical_sitemap_key,
    sibling_path,
)

ROOT = Path(__file__).resolve().parent.parent
DOMAIN = "https://soundtest.pro"

# URL rules live in public_urls.py. Doc pages that Cloudflare Pages serves
# from foo.html use a slash-free path (/accuracy). Directory indexes keep
# the trailing slash (/ , /zh/ , /use-cases/). Login, billing, changelog,
# refund, and the fullscreen camera are omitted from the sitemap.


def is_skipped_dir(path: Path) -> bool:
    parts = set(path.relative_to(ROOT).parts)
    return bool(parts & SKIP_DIRS)


def file_to_canonical(rel_path: str) -> tuple[str | None, str | None]:
    """Convert 'en/samples.html' to (logical_key, lang).

    logical_key is the language-agnostic path that returns HTTP 200,
    like '/samples' or '/use-cases/neighbor-noise-evidence'. Directory
    indexes keep their slash: '/' and '/use-cases/'.
    Returns (None, None) if the file should be skipped entirely.
    """
    return logical_sitemap_key(rel_path)


def gather_pages() -> dict[str, set[str]]:
    """Return {logical_page_key: {lang_code, ...}}.

    logical_page_key is the path WITHOUT the lang prefix, e.g. "/samples/".
    """
    pages: dict[str, set[str]] = {}

    for dirpath, dirnames, filenames in os.walk(ROOT):
        full = Path(dirpath)
        if is_skipped_dir(full):
            dirnames[:] = []
            continue

        for fn in filenames:
            if not fn.endswith(".html"):
                continue
            abs_path = full / fn
            rel = abs_path.relative_to(ROOT).as_posix()
            logical_key, lang = file_to_canonical(rel)
            if logical_key is None:
                continue

            # Pages without a language prefix belong to "x-default" bucket
            if lang is None:
                lang = "x-default"

            pages.setdefault(logical_key, set()).add(lang)

    return pages


def sibling_url(canonical_key: str, lang: str) -> str:
    """Given logical key '/samples' and lang='zh', return the 200 URL."""
    return f"{DOMAIN}{sibling_path(canonical_key, lang)}"


def file_mtime_iso(abs_path: Path) -> str:
    ts = abs_path.stat().st_mtime
    return datetime.fromtimestamp(ts, tz=timezone.utc).strftime("%Y-%m-%d")


def pick_lastmod(logical_key: str) -> str:
    """Pick the most-recent mtime across all language variants of the page.

    logical_key examples:
        "/"          -> root index.html
        "/samples"   -> <lang>/samples.html and /samples.html
        "/use-cases/" -> use-cases/<lang>/index.html and use-cases/index.html
        "/use-cases/neighbor-noise-evidence" -> use-cases/<lang>/foo.html
    """
    candidates: list[Path] = []

    if logical_key == "/":
        # root homepage
        for lang in LANGS + [None]:
            if lang:
                p = ROOT / lang / "index.html"
            else:
                p = ROOT / "index.html"
            if p.exists():
                candidates.append(p)
    elif logical_key.rstrip("/") == "/use-cases":
        for lang in LANGS + [None]:
            if lang:
                p = ROOT / "use-cases" / lang / "index.html"
            else:
                p = ROOT / "use-cases" / "index.html"
            if p.exists():
                candidates.append(p)
    elif logical_key.startswith("/use-cases/"):
        tail = logical_key[len("/use-cases/") :].strip("/")
        for lang in LANGS + [None]:
            if lang:
                p = ROOT / "use-cases" / lang / f"{tail}.html"
            else:
                p = ROOT / "use-cases" / f"{tail}.html"
            if p.exists():
                candidates.append(p)
    else:
        # /<doc>/ -> <lang>/<doc>.html and /<doc>.html
        doc = logical_key.strip("/").removesuffix(".html")
        # doc is a single segment here (e.g. "samples", "soundtest")
        for lang in LANGS + [None]:
            if lang:
                p = ROOT / lang / f"{doc}.html"
            else:
                p = ROOT / f"{doc}.html"
            if p.exists():
                candidates.append(p)

    if not candidates:
        return datetime.now(tz=timezone.utc).strftime("%Y-%m-%d")
    newest = max(p.stat().st_mtime for p in candidates)
    return datetime.fromtimestamp(newest, tz=timezone.utc).strftime("%Y-%m-%d")


def build_url_node(canonical_key: str, langs: set[str]) -> str:
    """Build one <url> entry with hreflang xhtml:link alternates."""
    lastmod = pick_lastmod(canonical_key)

    # x-default always points to root canonical (no /xx/ prefix)
    default_loc = sibling_url(canonical_key, "x-default")

    lines = ["  <url>"]
    lines.append(f"    <loc>{escape(default_loc)}</loc>")
    lines.append(f"    <lastmod>{lastmod}</lastmod>")

    # x-default
    lines.append(
        f'    <xhtml:link rel="alternate" hreflang="x-default" href="{escape(default_loc)}"/>'
    )

    # Each available language
    sorted_langs = sorted(langs - {"x-default"})
    for lang in sorted_langs:
        loc = sibling_url(canonical_key, lang)
        lines.append(
            f'    <xhtml:link rel="alternate" hreflang="{lang}" href="{escape(loc)}"/>'
        )

    lines.append("  </url>")
    return "\n".join(lines)


def main() -> int:
    pages = gather_pages()
    if not pages:
        print("No pages found — aborting.", file=sys.stderr)
        return 1

    # Sort for stable diffs
    urls = [build_url_node(k, pages[k]) for k in sorted(pages.keys())]

    header = (
        '<?xml version="1.0" encoding="UTF-8"?>\n'
        '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"\n'
        '        xmlns:xhtml="http://www.w3.org/1999/xhtml">\n'
    )
    footer = "</urlset>\n"

    out_path = ROOT / "sitemap.xml"
    body = "\n".join(urls) + "\n"
    out_path.write_text(header + body + footer, encoding="utf-8")

    print(f"Wrote {out_path.relative_to(ROOT)} with {len(urls)} <url> entries.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
