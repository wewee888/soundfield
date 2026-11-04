#!/usr/bin/env python3
"""Insert the Google Analytics 4 (gtag.js) snippet before </head> in all HTML files.

Mirrors scripts/add-51la-analytics.py (the 51.la rollout) so the GA tag is
distributed exactly the way this repo already distributes analytics:
statically, in the files themselves — no runtime/middleware injection.

Idempotent: files already containing the GA measurement ID are skipped.
Deviations from the 51.la script, both deliberate:
  - admin.html / auth.html (and their per-locale copies) are SKIPPED —
    back-office and sign-in pages should not beacon to GA.
  - LF line endings in the snippet (the repo's HTML files are LF today).
Run from anywhere:  python3 scripts/add-ga-analytics.py
"""
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
GA_ID = "G-81TT89GC8L"
SKIP_FILENAMES = {"admin.html", "auth.html"}

GA_SNIPPET = (
    "  <!-- Google tag (gtag.js) -->\n"
    f'  <script async src="https://www.googletagmanager.com/gtag/js?id={GA_ID}"></script>\n'
    "  <script>\n"
    "    window.dataLayer = window.dataLayer || [];\n"
    "    function gtag(){dataLayer.push(arguments);}\n"
    "    gtag('js', new Date());\n"
    f"    gtag('config', '{GA_ID}');\n"
    "  </script>\n"
)


def main() -> None:
    html_files = [
        p
        for p in ROOT.rglob("*.html")
        if not any(
            part.startswith(".") or part == "_temp" or part == "node_modules"
            for part in p.relative_to(ROOT).parts
        )
    ]
    print(f"Total HTML files found: {len(html_files)}")

    updated = 0
    skipped = 0

    for path in html_files:
        if path.name in SKIP_FILENAMES:
            skipped += 1
            continue
        content = path.read_text(encoding="utf-8")
        if GA_ID in content:
            skipped += 1
            continue

        match = re.search(r"</head>", content, re.IGNORECASE)
        if not match:
            print(f"WARNING: No </head> tag in {path.relative_to(ROOT)}")
            continue

        new_content = content[: match.start()] + GA_SNIPPET + content[match.start() :]
        path.write_text(new_content, encoding="utf-8")
        updated += 1

    print(f"Successfully updated: {updated} files (Skipped: {skipped})")


if __name__ == "__main__":
    main()
