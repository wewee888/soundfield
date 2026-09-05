#!/usr/bin/env python3
"""Add hreflang alternate links to every translated page, and re-fix
canonical URLs that point at the wrong path.

Two pre-existing bugs being fixed here:
  (a) Translated sub-pages (zh/accuracy.html, en/samples.html, ...) had
      ZERO hreflang annotations. Google reads hreflang from the page
      <head> first; sitemap hreflang is a fallback. Without these, the
      378 'alternate page with canonical' entries won't drop.
  (b) use-cases/<lang>/foo.html had its canonical set to /<lang>/use-cases/foo/
      by the previous fix-canonical.py run, but CF Pages serves that URL
      as the homepage (no /zh/use-cases/ directory exists). Correct URL
      is /use-cases/<lang>/foo/.

This script:
  1. For every .html under <lang>/ or use-cases/<lang>/, computes the
     correct canonical URL.
  2. Updates <link rel="canonical" href="..."> to that URL.
  3. Builds the full hreflang block (x-default + all available siblings)
     and inserts it right after the canonical line.
"""

from __future__ import annotations

import os
import re
import sys
from collections import defaultdict
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
DOMAIN = "https://soundtest.pro"

LANGS = ["en", "zh", "es", "fr", "de", "ja", "ko", "vi", "th"]

SKIP_DIRS = {
    "test-results", "_temp", "scripts", "functions", "assets",
    "public", "a", "b", "c", ".git", ".wrangler", ".github",
    ".claude", "tests",
}

# doc pages → clean URL (matches _redirects). Use-cases pages keep their .html
# at the URL level (no _redirects rule for them) but the canonical we emit
# uses the clean /tail/ form to match the sitemap and CF Pages auto-strip.
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
    r'<link\s+rel="canonical"\s+href="[^"]*"\s*/?>',
    re.IGNORECASE,
)
HREFLANG_RE = re.compile(
    r'<link\s+rel="alternate"\s+hreflang="[^"]*"\s+href="[^"]*"\s*/?>',
    re.IGNORECASE,
)


def is_skipped_dir(path: Path) -> bool:
    parts = set(path.relative_to(ROOT).parts)
    return bool(parts & SKIP_DIRS)


def file_meta(rel_path: str) -> tuple[str, str | None, str] | None:
    """Parse rel_path into (logical_key, lang, doc).

    logical_key is the language-agnostic path:
        /accuracy/         <- for zh/accuracy.html, en/accuracy.html, etc.
        /use-cases/foo/    <- for use-cases/zh/foo.html, use-cases/en/foo.html

    Returns None if the file should be skipped.
    """
    if not rel_path.endswith(".html"):
        return None

    parts = rel_path.split("/")
    fname = parts[-1]
    subdirs = parts[:-1]

    # Root-level doc pages — no hreflang action needed here
    # (their hreflang block, if any, is generated from the translated siblings)
    if not subdirs:
        return None
    # use-cases/<name>.html at root — same; hreflang generated from siblings
    if subdirs == ["use-cases"]:
        return None
    # Root index.html — already has hreflang, skip
    if subdirs == [] and fname == "index.html":
        return None

    lang: str | None = None

    # Pattern: <lang>/<doc>.html
    if len(subdirs) == 1 and subdirs[0] in LANGS and fname != "index.html":
        lang = subdirs[0]
        if fname not in HTML_TO_CANONICAL:
            return None
        logical_key = HTML_TO_CANONICAL[fname]
        doc = fname
        return logical_key, lang, doc

    # Pattern: <lang>/index.html — language homepage (already has hreflang)
    if len(subdirs) == 1 and subdirs[0] in LANGS and fname == "index.html":
        return None  # zh/index.html etc. already handled

    # Pattern: use-cases/<lang>/<doc>.html
    if len(subdirs) == 2 and subdirs[0] == "use-cases" and subdirs[1] in LANGS:
        lang = subdirs[1]
        tail = fname[:-len(".html")]
        logical_key = f"/use-cases/{tail}/"
        return logical_key, lang, fname

    # Pattern: use-cases/<lang>/index.html (we won't touch — handled like <lang>/index.html)
    if len(subdirs) == 2 and subdirs[0] == "use-cases" and fname == "index.html":
        return None

    return None


def canonical_for(logical_key: str, lang: str) -> str:
    """URL form that actually resolves on CF Pages.

    Note: use-cases pages keep /use-cases/<lang>/<tail>/ form (NOT /<lang>/use-cases/<tail>/).
    """
    if logical_key.startswith("/use-cases/"):
        return f"{DOMAIN}/use-cases/{lang}{logical_key[len('/use-cases'):]}"
    return f"{DOMAIN}/{lang}{logical_key}"


def sibling_canonical(logical_key: str, lang_or_default: str) -> str:
    """Canonical URL for a sibling hreflang entry."""
    if lang_or_default == "x-default":
        return f"{DOMAIN}{logical_key}"
    return canonical_for(logical_key, lang_or_default)


def process(abs_path: Path, lang: str, group: dict[str, str]) -> tuple[bool, str]:
    """Process one translated page.

    group maps lang_code -> canonical URL for this logical page.
    Returns (changed, summary).
    """
    text = abs_path.read_text(encoding="utf-8")

    # 1. Find canonical
    cm = CANONICAL_RE.search(text)
    if not cm:
        return False, "no canonical tag"

    cur_href = re.search(r'href="([^"]*)"', cm.group(0)).group(1)
    # The page's own canonical = group[lang] (NOT first key, which is insertion order)
    expected = group[lang]
    if cur_href != expected:
        new_canonical = cm.group(0).replace(f'href="{cur_href}"', f'href="{expected}"')
        text = text[: cm.start()] + new_canonical + text[cm.end() :]
        cm = CANONICAL_RE.search(text)

    # 2. Remove any existing hreflang block (idempotent)
    text = HREFLANG_RE.sub("", text)

    # 3. Build new hreflang block
    block_lines = []
    # x-default first
    block_lines.append(
        f'  <link rel="alternate" hreflang="x-default" href="{group["x-default"]}"/>'
    )
    # Then each available lang
    for lang in sorted(group):
        if lang == "x-default":
            continue
        block_lines.append(
            f'  <link rel="alternate" hreflang="{lang}" href="{group[lang]}"/>'
        )
    block = "\n".join(block_lines) + "\n"

    # 4. Insert block right after the canonical line
    assert cm is not None
    insert_pos = cm.end()
    # If the next char isn't a newline, keep the canonical line intact by
    # inserting a newline before our block.
    prefix = "\n" if text[insert_pos - 1] != "\n" else ""
    text = text[:insert_pos] + prefix + block + text[insert_pos:]

    abs_path.write_text(text, encoding="utf-8")
    return True, f"canonical={expected}, hreflang={len(group)}"


def main() -> int:
    # Group pages by logical_key
    groups: dict[str, dict[str, str]] = defaultdict(dict)

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
            meta = file_meta(rel)
            if meta is None:
                continue
            logical_key, lang, _doc = meta
            canonical = canonical_for(logical_key, lang)
            groups[logical_key][lang] = canonical
            # Also remember the default (root) canonical IF a root file exists
            root_canonical = f"{DOMAIN}{logical_key}"
            # check root file existence
            tail = logical_key.rstrip("/").split("/")[-1]
            if logical_key.startswith("/use-cases/"):
                root_file = ROOT / "use-cases" / f"{tail}.html"
            else:
                root_file = ROOT / f"{tail}.html"
            if root_file.exists():
                groups[logical_key]["x-default"] = root_canonical

    changed = 0
    skipped = 0
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
            meta = file_meta(rel)
            if meta is None:
                continue
            logical_key, lang, _doc = meta
            was_changed, _summary = process(abs_path, lang, groups[logical_key])
            if was_changed:
                changed += 1
            else:
                skipped += 1

    print(f"Translated pages updated: {changed}")
    print(f"Skipped (no canonical): {skipped}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
