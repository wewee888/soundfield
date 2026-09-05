#!/usr/bin/env python3
"""Add 'Noise Levels Chart' link to footer Resources section in every HTML page.

Idempotent — skips pages that already link to noise-levels.
Path-aware — uses ../noise-levels/ for files in subdirs, noise-levels/ at root.
"""

from __future__ import annotations

import os
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent

SKIP_DIRS = {
    "test-results", "_temp", "scripts", "functions", "assets",
    "public", "a", "b", "c", ".git", ".wrangler", ".github",
    ".claude", "tests",
}

# Match the Resources <li><a href="...">Standards</a></li> line and insert noise-levels after it
# Captures the relative href pattern by referencing the existing href style (1-deep vs 2-deep)
# To keep it simple, we look for the literal standards.html reference with whatever prefix
STANDARDS_LINK_RE = re.compile(
    r'(<li>\s*<a\s+href="[^"]*standards(?:\.html)?/?">[^<]*</a>\s*</li>)',
    re.IGNORECASE,
)


def is_skipped_dir(path: Path) -> bool:
    parts = set(path.relative_to(ROOT).parts)
    return bool(parts & SKIP_DIRS)


def link_path(abs_path: Path) -> str:
    rel = abs_path.relative_to(ROOT)
    depth = len(rel.parts) - 1  # 0 at root, 1 in en/, 2 in en/foo/ (not applicable)
    if depth == 0:
        return "noise-levels/"
    return "../" * depth + "noise-levels/"


def has_noise_levels_link(text: str) -> bool:
    return bool(re.search(r'href="[^"]*noise-levels', text, re.IGNORECASE))


def process(abs_path: Path) -> tuple[bool, str]:
    text = abs_path.read_text(encoding="utf-8")
    if has_noise_levels_link(text):
        return False, "already linked"
    href = link_path(abs_path)
    new_li = f'            <li><a href="{href}">Noise Levels Chart</a></li>'

    m = STANDARDS_LINK_RE.search(text)
    if not m:
        return False, "no standards link to anchor after"
    text = text[: m.end()] + "\n" + new_li + text[m.end() :]
    abs_path.write_text(text, encoding="utf-8")
    return True, f"href={href}"


def main() -> int:
    changed = 0
    skipped = 0
    no_anchor = 0
    for dirpath, dirnames, filenames in os.walk(ROOT):
        full = Path(dirpath)
        if is_skipped_dir(full):
            dirnames[:] = []
            continue
        for fn in filenames:
            if not fn.endswith(".html"):
                continue
            abs_path = full / fn
            rel = abs_path.relative_to(ROOT)
            # Skip non-content files
            if rel.parts[0] in {"scripts", "assets", "functions"}:
                continue
            was_changed, summary = process(abs_path)
            if was_changed:
                changed += 1
            elif summary == "no standards link to anchor after":
                no_anchor += 1
            else:
                skipped += 1
    print(f"Updated: {changed}")
    print(f"Skipped (already linked): {skipped}")
    print(f"Skipped (no standards anchor): {no_anchor}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
