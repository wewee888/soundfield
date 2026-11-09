#!/usr/bin/env python3
"""Remove 51.la tracking script from all HTML files to prevent mobile traffic hijacking."""
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]

def main() -> None:
    html_files = [
        p for p in ROOT.rglob("*.html")
        if not any(part.startswith(".") or part == "_temp" or part == "node_modules" for part in p.relative_to(ROOT).parts)
    ]
    print(f"Total HTML files found: {len(html_files)}")

    updated = 0
    for path in html_files:
        content = path.read_text(encoding="utf-8")
        if "51.la" in content or "LA_COLLECT" in content or "281wblDNvub2tk9f" in content:
            lines = content.splitlines(keepends=True)
            new_lines = [
                line for line in lines
                if "51.la" not in line and "LA_COLLECT" not in line and "281wblDNvub2tk9f" not in line
            ]
            path.write_text("".join(new_lines), encoding="utf-8")
            updated += 1

    print(f"Purged 51.la from {updated} HTML files")

if __name__ == "__main__":
    main()
