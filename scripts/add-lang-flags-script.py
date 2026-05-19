"""Insert lang-flags.js before site-i18n.js in all HTML files."""
from pathlib import Path

root = Path(__file__).resolve().parents[1]
needle = '<script src="assets/site-i18n.js" defer></script>'
insert = '<script src="assets/lang-flags.js" defer></script>\n  <script src="assets/site-i18n.js" defer></script>'
needle_rel = '<script src="../assets/site-i18n.js" defer></script>'
insert_rel = '<script src="../assets/lang-flags.js" defer></script>\n  <script src="../assets/site-i18n.js" defer></script>'

count = 0
for html in root.rglob("*.html"):
    if html.name == "soundtest.html":
        continue
    text = html.read_text(encoding="utf-8")
    if "lang-flags.js" in text:
        continue
    if needle_rel in text:
        text = text.replace(needle_rel, insert_rel, 1)
        count += 1
    elif needle in text:
        text = text.replace(needle, insert, 1)
        count += 1
    else:
        continue
    html.write_text(text, encoding="utf-8")
    print("patched", html.relative_to(root))

print("total", count)
