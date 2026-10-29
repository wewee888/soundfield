#!/usr/bin/env python3
"""Apply the verified technical-SEO fixes to HTML and llms files.

- Rewrite absolute soundtest.pro URLs onto the path that returns HTTP 200.
- Add noindex to login, billing, changelog, refund, and the fullscreen camera.
- Insert the accuracy and standards sections once, before the footer.
"""

from __future__ import annotations

import re
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
from public_urls import LANGS, SKIP_DIRS, build_alias_map, normalize_absolute_url  # noqa: E402
from seo_depth_copy import accuracy_html, standards_html  # noqa: E402

ROOT = Path(__file__).resolve().parent.parent
NOINDEX_BASENAMES = {
    "auth.html",
    "launch-metrics.html",
    "monetization.html",
    "refund.html",
    "changelog.html",
    "camera.html",
}
URL_RE = re.compile(
    r"https?://(?:www\.)?soundtest\.pro(?:/[A-Za-z0-9._~%+\-]*)*(?:\?[A-Za-z0-9._~%=&+\-]*)?(?:#[A-Za-z0-9._~\-]*)?"
)
ROBOTS_RE = re.compile(
    r"<meta\s+[^>]*name=[\"']robots[\"'][^>]*>",
    re.IGNORECASE,
)
NOINDEX_TAG = '<meta name="robots" content="noindex, follow">'


def iter_html() -> list[Path]:
    found = []
    for path in ROOT.rglob("*.html"):
        rel_parts = set(path.relative_to(ROOT).parts)
        if rel_parts & SKIP_DIRS:
            continue
        found.append(path)
    return found


def rewrite_urls(text: str, aliases: dict[str, str]) -> tuple[str, int]:
    count = 0

    def repl(match: re.Match[str]) -> str:
        nonlocal count
        original = match.group(0)
        updated = normalize_absolute_url(original, aliases)
        if updated != original:
            count += 1
        return updated

    return URL_RE.sub(repl, text), count


def ensure_noindex(text: str) -> str:
    if ROBOTS_RE.search(text):
        def repl(match: re.Match[str]) -> str:
            tag = match.group(0)
            if re.search(r"noindex", tag, re.IGNORECASE):
                return tag
            return NOINDEX_TAG
        return ROBOTS_RE.sub(repl, text, count=1)
    return text.replace("<head>", "<head>\n  " + NOINDEX_TAG, 1)


def links_for(rel: str) -> dict[str, str]:
    parts = rel.split("/")
    if len(parts) >= 2 and parts[0] in LANGS and parts[0] != "en":
        lang = parts[0]
        return {
            "meter": f"/soundtest.html?lang={lang}",
            "standards": f"/{lang}/standards.html",
            "accuracy": f"/{lang}/accuracy.html",
            "levels": f"/{lang}/noise-levels.html",
            "samples": f"/{lang}/samples.html",
        }
    return {
        "meter": "/soundtest.html",
        "standards": "/standards.html",
        "accuracy": "/accuracy.html",
        "levels": "/noise-levels.html",
        "samples": "/samples.html",
    }


def fill_links(html: str, rel: str) -> str:
    out = html
    for key, href in links_for(rel).items():
        out = out.replace("{{" + key + "}}", href)
    return out


def insert_before_footer(text: str, block: str, marker: str) -> str:
    if marker in text:
        return text
    idx = text.find("<footer")
    if idx == -1:
        raise SystemExit(f"no footer for marker {marker}")
    return text[:idx] + block + "\n" + text[idx:]


def main() -> int:
    aliases = build_alias_map(ROOT)
    url_edits = 0
    noindex_edits = 0
    depth_edits = 0

    targets = iter_html()
    for extra in ("llms.txt", "llms-full.txt"):
        path = ROOT / extra
        if path.exists():
            targets.append(path)

    for path in targets:
        rel = path.relative_to(ROOT).as_posix()
        original = path.read_text(encoding="utf-8")
        text, n = rewrite_urls(original, aliases)
        url_edits += n
        if path.suffix == ".html" and path.name in NOINDEX_BASENAMES:
            updated = ensure_noindex(text)
            if updated != text:
                noindex_edits += 1
            text = updated
        if path.name == "accuracy.html" and "id=\"measurement-method\"" not in text:
            lang = rel.split("/")[0] if "/" in rel and rel.split("/")[0] in LANGS else "en"
            block = fill_links(accuracy_html(lang), rel)
            text = insert_before_footer(text, block, 'id="measurement-method"')
            depth_edits += 1
        if path.name == "standards.html" and "id=\"how-to-read-limits\"" not in text:
            lang = rel.split("/")[0] if "/" in rel and rel.split("/")[0] in LANGS else "en"
            block = fill_links(standards_html(lang), rel)
            text = insert_before_footer(text, block, 'id="how-to-read-limits"')
            depth_edits += 1
        if text != original:
            path.write_text(text, encoding="utf-8")

    print(f"url rewrites: {url_edits}")
    print(f"noindex tags: {noindex_edits}")
    print(f"depth sections: {depth_edits}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
