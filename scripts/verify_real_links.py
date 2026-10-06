import sys
import re
from pathlib import Path

sys.stdout.reconfigure(encoding='utf-8')
ROOT = Path(__file__).resolve().parent.parent

total_files = 0
broken_map = {}

for p in ROOT.rglob("*.html"):
    if any(x in p.parts for x in [".git", "node_modules", "scripts", "test-results", "_temp", "temp"]):
        continue
    total_files += 1
    txt = p.read_text(encoding="utf-8")
    links = re.findall(r'(?:href|src|data-chip-path)="([^"#?]+)"', txt)
    base = p.parent
    for l in links:
        if l.startswith("http") or l.startswith("mailto:") or l.startswith("tel:") or l.startswith("//") or l.startswith("data:"):
            continue
        if l.startswith("/"):
            target = (ROOT / l.lstrip("/")).resolve()
        else:
            target = (base / l).resolve()
        if not target.exists():
            rel = str(p.relative_to(ROOT))
            if rel not in broken_map:
                broken_map[rel] = []
            broken_map[rel].append((l, str(target)))

print(f"Scanned {total_files} real HTML files. Files with broken links: {len(broken_map)}")
for f, blist in sorted(broken_map.items()):
    print(f"\n[{f}] ({len(blist)} broken):")
    for link, target in blist[:5]:
        print(f"   {link} -> {target}")
    if len(blist) > 5:
        print(f"   ... and {len(blist) - 5} more")
