import os
import glob

locales = ['de', 'en', 'es', 'fr', 'ja', 'ko', 'th', 'vi', 'zh']
count = 0

# Fix 1: <locale>/*.html having href="soundtest.html" -> href="../soundtest.html"
for loc in locales:
    for f in glob.glob(f'{loc}/*.html'):
        with open(f, 'r', encoding='utf-8', errors='ignore') as fp:
            content = fp.read()
        if 'href="soundtest.html"' in content or "href='soundtest.html'" in content:
            new_content = content.replace('href="soundtest.html"', 'href="../soundtest.html"')
            new_content = new_content.replace("href='soundtest.html'", "href='../soundtest.html'")
            with open(f, 'w', encoding='utf-8') as fp:
                fp.write(new_content)
            count += 1
            print(f'Fixed soundtest link in: {f}')

# Fix 2: use-cases/<loc>/index.html footer flags
for loc in locales:
    f = f'use-cases/{loc}/index.html'
    if os.path.exists(f):
        with open(f, 'r', encoding='utf-8', errors='ignore') as fp:
            content = fp.read()
        changed = False
        for l in locales:
            old = f'href="{l}/"'
            new = f'href="../{l}/"'
            if old in content:
                content = content.replace(old, new)
                changed = True
        if changed:
            with open(f, 'w', encoding='utf-8') as fp:
                fp.write(content)
            print(f'Fixed footer flags in: {f}')

print(f'Total files fixed: {count}')
