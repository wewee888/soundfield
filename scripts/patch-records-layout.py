from pathlib import Path
import re

p = Path(__file__).resolve().parents[1] / "soundtest.html"
t = p.read_text(encoding="utf-8")
t = t.replace("<motion ", "<div ").replace("</motion>", "</div>")

# Remove first promo-card inside #p-r only
pat = re.compile(
    r'(<div class="panel" id="p-r">\n)'
    r'    <div class="promo-card layout-record-share">.*?</div>\n',
    re.DOTALL,
)
t2, n = pat.subn(r"\1", t, count=1)
if n != 1:
    raise SystemExit(f"remove top promo: {n}")

p.write_text(t2, encoding="utf-8")
print("removed duplicate promo")
