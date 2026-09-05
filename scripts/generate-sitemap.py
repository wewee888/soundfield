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
import re
import sys
from pathlib import Path
from datetime import datetime, timezone
from xml.sax.saxutils import escape

ROOT = Path(__file__).resolve().parent.parent
DOMAIN = "https://soundtest.pro"

# 1. Languages that exist on disk (verified by scanning earlier)
LANGS = ["en", "zh", "es", "fr", "de", "ja", "ko", "vi", "th"]

# 2. Subdirectories we never want in the sitemap
SKIP_DIRS = {
    "test-results",
    "_temp",
    "scripts",
    "functions",
    "assets",
    "public",
    "a",
    "b",
    "c",
    ".git",
    ".wrangler",
    ".github",
    ".claude",
    "tests",
}

# 3. .html -> canonical URL map (mirrors _redirects)
# Keys are the BARE filename (no slash), values are the clean canonical URL.
# Pages that 302 to another page are NOT listed as separate sitemap entries.
# index.html is handled specially in file_to_canonical() below.
HTML_TO_CANONICAL: dict[str, str] = {
    "app.html": "/soundtest/",
    "soundtest.html": "/soundtest/",
    "samples.html": "/samples/",
    "accuracy.html": "/accuracy/",
    "auth.html": "/auth/",
    "compliance.html": "/compliance/",
    "download.html": "/download/",
    "launch-metrics.html": "/launch-metrics/",
    "monetization.html": "/monetization/",
    "standards.html": "/standards/",
    "changelog.html": "/changelog/",
    "disclaimer.html": "/disclaimer/",
    "privacy.html": "/privacy/",
    "refund.html": "/refund/",
    "stats.html": "/stats/",
}


def is_skipped_dir(path: Path) -> bool:
    parts = set(path.relative_to(ROOT).parts)
    return bool(parts & SKIP_DIRS)


def file_to_canonical(rel_path: str) -> tuple[str | None, str | None]:
    """Convert 'en/samples.html' to (logical_key, lang).

    Returns (logical_key, lang). logical_key is the language-agnostic path
    like '/samples/' or '/use-cases/neighbor-noise-evidence/'.
    Returns (None, None) if the file should be skipped entirely.
    """
    if not rel_path.endswith(".html"):
        return None, None

    parts = rel_path.split("/")
    fname = parts[-1]

    # Detect language prefix
    lang: str | None = None
    subdirs = parts[:-1]  # everything before the filename
    if subdirs and subdirs[0] in LANGS:
        lang = subdirs[0]
        subdirs = subdirs[1:]

    # index.html: language homepages
    if fname == "index.html":
        # /en/index.html -> lang=en, key='/'
        # /use-cases/en/index.html -> lang=en, key='/use-cases/'
        # /index.html -> lang=None, key='/'
        if subdirs and subdirs[0] == "use-cases":
            return "/use-cases/", lang
        return "/", lang

    # use-cases pages keep their .html (no _redirects rule for them)
    if subdirs and subdirs[0] == "use-cases":
        # /use-cases/<lang>/foo.html -> lang from <lang>; key=/use-cases/foo/
        # /use-cases/foo.html -> no lang; key=/use-cases/foo/
        tail = fname[:-len(".html")]  # strip .html
        if lang is None and subdirs[1:]:
            # /use-cases/<some-lang-as-subdir>/foo.html — treat <some-lang-as-subdir> as lang
            if subdirs[1] in LANGS:
                lang = subdirs[1]
        return f"/use-cases/{tail}/", lang

    # Standard doc pages: must be in HTML_TO_CANONICAL
    if fname not in HTML_TO_CANONICAL:
        return None, None

    return HTML_TO_CANONICAL[fname], lang


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
    """Given logical key '/samples/' and lang='zh', return '/zh/samples/'.
    For x-default, return the root-level key.
    """
    if lang == "x-default":
        return f"{DOMAIN}{canonical_key}"
    return f"{DOMAIN}/{lang}{canonical_key}"


def file_mtime_iso(abs_path: Path) -> str:
    ts = abs_path.stat().st_mtime
    return datetime.fromtimestamp(ts, tz=timezone.utc).strftime("%Y-%m-%d")


def pick_lastmod(logical_key: str) -> str:
    """Pick the most-recent mtime across all language variants of the page.

    logical_key examples:
        "/"          -> root index.html
        "/samples/"  -> <lang>/samples.html and /samples.html
        "/use-cases/neighbor-noise-evidence/" -> use-cases/<lang>/foo.html and use-cases/foo.html
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
    elif logical_key.startswith("/use-cases/"):
        # /use-cases/<name>/
        tail = logical_key[len("/use-cases/") :].rstrip("/")
        for lang in LANGS + [None]:
            if lang:
                p = ROOT / "use-cases" / lang / f"{tail}.html"
            else:
                p = ROOT / "use-cases" / f"{tail}.html"
            if p.exists():
                candidates.append(p)
    else:
        # /<doc>/ -> <lang>/<doc>.html and /<doc>.html
        doc = logical_key.strip("/")
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
