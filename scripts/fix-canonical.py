#!/usr/bin/env python3
"""Fix the canonical URL on every HTML page.

Bug being fixed: every translated page (en/, zh/, ...) had its canonical
pointing to the SAME English root URL (e.g. https://soundtest.pro/accuracy.html).
Google correctly read this as "all of these are copies of one page" — that's
the source of the 378 "alternate page with canonical" unindexed entries.

Fix: each page's canonical points to its OWN language URL.

Examples:
    en/accuracy.html  -> https://soundtest.pro/en/accuracy/
    zh/accuracy.html  -> https://soundtest.pro/zh/accuracy/
    accuracy.html     -> https://soundtest.pro/accuracy/
    use-cases/en/foo.html -> https://soundtest.pro/en/use-cases/foo/
"""

from __future__ import annotations

import os
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
DOMAIN = "https://soundtest.pro"

LANGS = ["en", "zh", "es", "fr", "de", "ja", "ko", "vi", "th"]

SKIP_DIRS = {
    "test-results", "_temp", "scripts", "functions", "assets",
    "public", "a", "b", "c", ".git", ".wrangler", ".github",
    ".claude", "tests",
}

# Mirror HTML_TO_CANONICAL from generate-sitemap.py
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

CANONICAL_RE = re.compile(
    r'(<link\s+rel="canonical"\s+href=")[^"]*("\s*/?>)',
    re.IGNORECASE,
)


def is_skipped_dir(path: Path) -> bool:
    parts = set(path.relative_to(ROOT).parts)
    return bool(parts & SKIP_DIRS)


def expected_canonical(rel_path: str) -> str | None:
    """Compute the correct canonical URL for this html file.

    Returns None if the file should be skipped.
    """
    if not rel_path.endswith(".html"):
        return None

    parts = rel_path.split("/")
    fname = parts[-1]
    subdirs = parts[:-1]

    lang: str | None = None
    if subdirs and subdirs[0] in LANGS:
        lang = subdirs[0]
        subdirs = subdirs[1:]

    # index.html
    if fname == "index.html":
        if subdirs and subdirs[0] == "use-cases":
            if lang:
                return f"{DOMAIN}/{lang}/use-cases/"
            return f"{DOMAIN}/use-cases/"
        if lang:
            return f"{DOMAIN}/{lang}/"
        return f"{DOMAIN}/"

    # use-cases pages (clean URL per sitemap)
    if subdirs and subdirs[0] == "use-cases":
        tail = fname[:-len(".html")]
        if lang is None and len(subdirs) > 1 and subdirs[1] in LANGS:
            lang = subdirs[1]
        if lang:
            return f"{DOMAIN}/{lang}/use-cases/{tail}/"
        return f"{DOMAIN}/use-cases/{tail}/"

    # Standard doc pages
    if fname not in HTML_TO_CANONICAL:
        return None
    clean = HTML_TO_CANONICAL[fname]
    if lang:
        return f"{DOMAIN}/{lang}{clean}"
    return f"{DOMAIN}{clean}"


def fix_one(abs_path: Path) -> tuple[bool, str, str | None]:
    """Fix one file. Returns (changed, current_or_new, expected_or_None)."""
    rel = abs_path.relative_to(ROOT).as_posix()
    expected = expected_canonical(rel)
    if expected is None:
        return False, "", None

    text = abs_path.read_text(encoding="utf-8")

    m = CANONICAL_RE.search(text)
    if not m:
        # No canonical link at all — add one in <head>
        new_link = f'  <link rel="canonical" href="{expected}"/>\n'
        # Try to insert before </head>
        if "</head>" in text:
            text = text.replace("</head>", new_link + "</head>", 1)
            abs_path.write_text(text, encoding="utf-8")
            return True, "(added)", expected
        return False, "(no canonical tag, no </head>)", expected

    current = re.search(r'href="([^"]*)"', m.group(0)).group(1)
    if current == expected:
        return False, current, expected

    new_tag = m.group(1) + expected + m.group(2)
    new_text = text[: m.start()] + new_tag + text[m.end() :]
    abs_path.write_text(new_text, encoding="utf-8")
    return True, current, expected


def main() -> int:
    changed = []
    skipped = []
    already_ok = []

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
            if expected_canonical(rel) is None:
                continue
            was_changed, before, after = fix_one(abs_path)
            if was_changed:
                changed.append((rel, before, after))
            elif before == "(no canonical tag, no </head>)":
                skipped.append(rel)
            else:
                already_ok.append(rel)

    print(f"Changed:    {len(changed)}")
    print(f"Already OK: {len(already_ok)}")
    print(f"Skipped:    {len(skipped)}")
    print()
    if changed:
        print("Files updated:")
        for rel, before, after in changed:
            print(f"  {rel}")
            print(f"    - {before}")
            print(f"    + {after}")
    if skipped:
        print()
        print("Skipped (no canonical tag and no </head>):")
        for rel in skipped:
            print(f"  {rel}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
