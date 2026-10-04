import os

locales = ['de', 'es', 'fr', 'ja', 'ko', 'th', 'vi']
for loc in locales:
    p = os.path.join(loc, 'index.html')
    if os.path.exists(p):
        with open(p, 'r', encoding='utf-8') as f:
            c = f.read()
        if 'assets/site.css?v=' not in c:
            c = c.replace('href="../assets/site.css"', 'href="../assets/site.css?v=20261004c"')
            with open(p, 'w', encoding='utf-8') as f:
                f.write(c)
            print(f'Updated {p}')
