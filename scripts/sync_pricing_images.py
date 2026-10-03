import os, re

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
LOCALES = ['en', 'fr', 'de', 'es', 'ja', 'ko', 'vi', 'th']

single_img = """          <div class="price-card-img" style="border-radius:8px;overflow:hidden;margin:0 0 10px;max-height:100px;">
            <img src="../assets/images/forensic_report_preview.webp" alt="Official forensic PDF vs watermarked preview comparison" loading="lazy" style="width:100%;height:100px;object-fit:cover;object-position:center top;display:block;">
          </div>
"""

pro_img = """          <div class="price-card-img" style="border-radius:8px;overflow:hidden;margin:0 0 10px;max-height:100px;">
            <img src="../assets/images/sentry_night_monitor.webp" alt="Overnight Sentry Mode illustration" loading="lazy" style="width:100%;height:100px;object-fit:cover;object-position:center 40%;display:block;">
          </div>
"""

for loc in LOCALES:
    file_path = os.path.join(ROOT, loc, 'index.html')
    if not os.path.exists(file_path):
        continue
    with open(file_path, 'r', encoding='utf-8') as f:
        html = f.read()

    # 1. Insert single_img if not present
    if 'forensic_report_preview.webp' not in html:
        # Match <div class="price-card single-report reveal">
        p1 = r'(<div class="price-card single-report reveal">\s*)'
        if re.search(p1, html):
            html = re.sub(p1, rf'\1{single_img}', html, count=1)

    # 2. Insert pro_img if not present
    if 'sentry_night_monitor.webp' not in html:
        # Match <div class="price-card pro reveal">
        p2 = r'(<div class="price-card pro reveal">\s*)'
        if re.search(p2, html):
            html = re.sub(p2, rf'\1{pro_img}', html, count=1)

    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(html)
    print(f"[{loc}] Added pricing card images!")

print("All pricing card images synced.")
