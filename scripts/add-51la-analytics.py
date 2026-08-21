#!/usr/bin/env python3
"""Insert 51.la tracking script before </head> in all HTML files."""
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]

TRACKING_SNIPPET = (
    '  <script charset="UTF-8" id="LA_COLLECT" src="//sdk.51.la/js-sdk-pro.min.js"></script>\r\n'
    '  <script>LA.init({id:"281wblDNvub2tk9f",ck:"281wblDNvub2tk9f"})</script>\r\n'
)

def main() -> None:
    html_files = [
        p for p in ROOT.rglob("*.html")
        if not any(part.startswith(".") or part == "_temp" or part == "node_modules" for part in p.relative_to(ROOT).parts)
    ]
    print(f"Total HTML files found: {len(html_files)}")

    updated = 0
    skipped = 0

    for path in html_files:
        content = path.read_text(encoding="utf-8")
        if "51.la" in content or "LA_COLLECT" in content:
            skipped += 1
            continue

        match = re.search(r"</head>", content, re.IGNORECASE)
        if not match:
            print(f"WARNING: No </head> tag in {path.relative_to(ROOT)}")
            continue

        new_content = content[:match.start()] + TRACKING_SNIPPET + content[match.start():]
        path.write_text(new_content, encoding="utf-8")
        updated += 1

    print(f"Successfully updated: {updated} files (Skipped: {skipped})")

if __name__ == "__main__":
    main()
