#!/usr/bin/env python3
"""Add ?v=6 cache-buster to all site-i18n.js script tags and update SW."""
import re
import sys
from pathlib import Path

ROOT = Path(r"E:\.site\dB_test\soundfield")
VERSION = "v=6"

# Find all HTML files except the scripts directory
html_files = []
for p in ROOT.rglob("*.html"):
    if "scripts" in p.parts:
        continue
    html_files.append(p)

# Patterns: relative `../assets/site-i18n.js` or `assets/site-i18n.js` or `/assets/site-i18n.js`
patterns = [
    (re.compile(r'(["\'])(?:\.\./)?assets/site-i18n\.js(?:\?[^"\']*)?\1'),
     lambda m: f'{m.group(1)}assets/site-i18n.js?{VERSION}{m.group(1)}'),
    (re.compile(r'(["\'])/assets/site-i18n\.js(?:\?[^"\']*)?\1'),
     lambda m: f'{m.group(1)}/assets/site-i18n.js?{VERSION}{m.group(1)}'),
]

ok = 0
for f in html_files:
    text = f.read_text(encoding="utf-8")
    new_text = text
    for pat, repl in patterns:
        new_text = pat.sub(repl, new_text)
    if new_text != text:
        f.write_text(new_text, encoding="utf-8")
        ok += 1
        print(f"OK: {f.relative_to(ROOT)}")

print(f"\nUpdated {ok} of {len(html_files)} HTML files")
