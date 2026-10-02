import glob, re, os

locales = ['en', 'zh', 'es', 'fr', 'de', 'ja', 'ko', 'th', 'vi']
for loc in locales:
    path = os.path.join(loc, 'index.html')
    if not os.path.exists(path):
        continue
    with open(path, 'r', encoding='utf-8') as f:
        content = f.read()
    m = re.search(r'<div class="notice reveal">\s*<strong>(.*?)</strong>(.*?)</div>', content, re.DOTALL)
    if m:
        print(f"{loc}: {m.group(1)} -> {m.group(2).strip()[:60]}...")
    else:
        print(f"{loc}: No notice match")
