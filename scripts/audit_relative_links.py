import os
import re

root = '.'
manifest_rel = []
assets_rel = []
flags_rel = []
soundtest_no_lang = []
canonical_index_slash = []

locales = ['zh', 'fr', 'de', 'es', 'ja', 'ko', 'vi', 'th', 'en']

for r, dirs, files in os.walk(root):
    if any(skip in r for skip in ['.git', 'node_modules', '_temp', 'test-results']):
        continue
    for f in files:
        if f.endswith('.html'):
            p = os.path.join(r, f)
            rel_file = os.path.relpath(p, root).replace('\\', '/')
            with open(p, 'r', encoding='utf-8', errors='ignore') as fp:
                c = fp.read()
            
            # 1. Manifest
            if re.search(r'<link[^>]+rel=["\']manifest["\'][^>]+href=["\'](?!/)[^"\']+', c):
                manifest_rel.append(rel_file)
            
            # 2. Assets (CSS/JS/img)
            if re.search(r'(?:href|src)=["\'](?!(?:/|https?:|//|#|data:|mailto:|tel:))[^"\']*assets/', c):
                assets_rel.append(rel_file)
            
            # 3. Footer flags
            if re.search(r'class=["\']footer-flag["\'][^>]+href=["\'](?!(?:/|https?:))[^"\']+', c):
                flags_rel.append(rel_file)
            
            # 4. Localized files with soundtest missing lang param
            rel_dir = os.path.dirname(rel_file)
            is_loc = any(rel_dir == loc or rel_dir == f'use-cases/{loc}' for loc in ['zh','fr','de','es','ja','ko','vi','th'])
            if is_loc and re.search(r'href=["\'][^"\']*soundtest\.html(?![^"\']*[?&]lang=)[^"\']*["\']', c):
                soundtest_no_lang.append(rel_file)

            # 5. Canonical with /index/
            if '/index/' in c:
                canonical_index_slash.append(rel_file)

            # 6. Localized file with brand linking to root index.html
            if is_loc and re.search(r'class=["\']brand brand-glow["\'][^>]+href=["\'](?:\.\./|\.\./\.\./)index\.html["\']', c):
                pass

print(f"Total HTML files with relative manifest: {len(manifest_rel)}")
print(f"Total HTML files with relative assets: {len(assets_rel)}")
print(f"Total HTML files with relative footer flags: {len(flags_rel)}")
print(f"Total localized HTML files with soundtest missing lang: {len(soundtest_no_lang)}")
print(f"Total HTML files containing /index/: {len(canonical_index_slash)}")

