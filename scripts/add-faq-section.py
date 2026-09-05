#!/usr/bin/env python3
"""Insert visible FAQ section + JSON-LD FAQPage schema into use-case HTML pages.

Source of truth: scripts/content/use-case-faqs.json
Targets: use-cases/<lang>/<slug>.html AND use-cases/<slug>.html (root)

Behavior:
- Inserts JSON-LD <script type="application/ld+json"> right after the canonical link
- Inserts visible <section class="section faq-section"> right before <footer>
- Skips pages where FAQ data is missing for the slug
- Idempotent: if a FAQ section already exists (detected by id="faq-section"), it replaces it

Run:
    python scripts/add-faq-section.py           # all configured langs
    python scripts/add-faq-section.py --lang en # one language only
"""

from __future__ import annotations

import argparse
import json
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
FAQ_JSON = ROOT / "scripts" / "content" / "use-case-faqs.json"

# Map slug → json key. Same keys today; explicit in case they ever diverge.
SLUG_TO_KEY = {
    "neighbor-noise-evidence": "neighbor-noise-evidence",
    "construction-noise-monitoring": "construction-noise-monitoring",
    "bar-street-disturbance": "bar-street-disturbance",
    "rental-dispute-evidence": "rental-dispute-evidence",
    "property-noise-complaint-report": "property-noise-complaint-report",
    "workplace-noise-inspection": "workplace-noise-inspection",
}

# language code -> root-relative HTML file path of the FAQ source page
LANG_TARGETS = {
    "en": "use-cases/{slug}.html",
    # Other languages get content from a future translation file. For now, skip.
}


def detect_lang(path: Path) -> str | None:
    parts = path.relative_to(ROOT).parts
    if not parts:
        return None
    first = parts[0]
    if first in LANG_TARGETS:
        return first
    # root-level use-cases/foo.html treated as en
    if parts[0] == "use-cases" and len(parts) == 2:
        return "en"
    return None


def slug_from_path(path: Path) -> str | None:
    parts = path.relative_to(ROOT).parts
    fname = parts[-1]
    if not fname.endswith(".html"):
        return None
    stem = fname[: -len(".html")]
    if stem == "index":
        return None
    return stem


def build_faq_schema(questions: list[dict]) -> str:
    main_entity = []
    for qa in questions:
        main_entity.append(
            {
                "@type": "Question",
                "name": qa["q"],
                "acceptedAnswer": {"@type": "Answer", "text": qa["a"]},
            }
        )
    payload = {"@context": "https://schema.org", "@type": "FAQPage", "mainEntity": main_entity}
    # JSON-LD must be safe to embed inside HTML; use compact form, no </script> sequences.
    return json.dumps(payload, ensure_ascii=False, separators=(",", ":"))


def build_visible_section(title: str, questions: list[dict]) -> str:
    """Visible FAQ using existing site CSS classes (section, card, reveal, check-list, muted)."""
    items_html = []
    for qa in questions:
        items_html.append(
            '      <div class="card reveal">\n'
            f'        <h3>{qa["q"]}</h3>\n'
            f'        <p>{qa["a"]}</p>\n'
            "      </div>"
        )
    items = "\n".join(items_html)
    return (
        '    <section class="section" id="faq-section">\n'
        '      <div class="section-heading reveal">\n'
        f'        <span class="eyebrow">FAQ</span>\n'
        f'        <h2>{title}</h2>\n'
        "      </div>\n"
        '      <div class="faq-grid">\n'
        f"{items}\n"
        "      </div>\n"
        '      <p class="muted" style="margin-top:1rem;">SOUNDTEST.PRO is a documentation-grade estimate tool, not a certified sound level meter. Verify any formal claim with calibrated equipment and qualified measurement procedures.</p>\n'
        "    </section>\n\n"
    )


JSON_LD_RE = re.compile(
    r'<script\s+type="application/ld\+json">.*?</script>\s*',
    re.IGNORECASE | re.DOTALL,
)
VISIBLE_SECTION_RE = re.compile(
    r'<section[^>]*id="faq-section".*?</section>\s*',
    re.IGNORECASE | re.DOTALL,
)


def insert_json_ld(text: str, schema_json: str) -> str:
    block = (
        '<script type="application/ld+json">'
        + schema_json
        + "</script>\n\n"
    )
    # Idempotent: replace existing FAQPage JSON-LD if present
    def replace(m: re.Match) -> str:
        # Only replace if it is a FAQPage schema
        body = m.group(0)
        if "FAQPage" in body:
            return block
        # Leave other schemas alone, insert before the matched block
        return body + block

    if "application/ld+json" in text:
        return JSON_LD_RE.sub(replace, text, count=1)
    # No existing JSON-LD: insert right after </title>
    return text.replace("</title>", "</title>\n\n  " + block.rstrip("\n") + "  ", 1)


def insert_visible_section(text: str, section_html: str) -> str:
    if VISIBLE_SECTION_RE.search(text):
        return VISIBLE_SECTION_RE.sub(section_html.rstrip("\n"), text, count=1)
    # Insert right before <footer
    return text.replace("<footer", section_html + "<footer", 1)


def process(abs_path: Path, faq: dict) -> tuple[bool, str]:
    slug = slug_from_path(abs_path)
    if slug is None:
        return False, "not a content page"
    key = SLUG_TO_KEY.get(slug)
    if key is None or key not in faq:
        return False, f"no FAQ data for slug {slug}"
    page_faq = faq[key]
    text = abs_path.read_text(encoding="utf-8")

    schema_json = build_faq_schema(page_faq["questions"])
    text = insert_json_ld(text, schema_json)
    visible = build_visible_section(page_faq["title"], page_faq["questions"])
    text = insert_visible_section(text, visible)

    abs_path.write_text(text, encoding="utf-8")
    return True, f"{len(page_faq['questions'])} Q&A"


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--lang", help="only process this language (e.g. en)")
    args = parser.parse_args()

    if not FAQ_JSON.exists():
        print(f"FAQ source not found: {FAQ_JSON}", file=sys.stderr)
        return 1

    faq = json.loads(FAQ_JSON.read_text(encoding="utf-8"))

    changed = 0
    skipped = 0
    for path in sorted(ROOT.glob("use-cases/**/*.html")):
        lang = detect_lang(path)
        if lang is None:
            continue
        if args.lang and lang != args.lang:
            continue
        if path.relative_to(ROOT).parts[-1] == "index.html":
            continue
        was_changed, summary = process(path, faq)
        if was_changed:
            changed += 1
            print(f"  [+] {path.relative_to(ROOT)}: {summary}")
        else:
            skipped += 1
            print(f"  [ ] {path.relative_to(ROOT)}: {summary}")

    print(f"\nDone. Updated: {changed}, Skipped: {skipped}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
