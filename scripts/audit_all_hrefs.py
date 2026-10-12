import os
import re

root = '.'
skip_dirs = {'.git', 'node_modules', '_temp', 'test-results'}

issues = []

for r, dirs, files in os.walk(root):
    dirs[:] = [d for d in dirs if d not in skip_dirs]
    for f in files:
        if f.endswith('.html'):
            p = os.path.join(r, f)
            rel_file = os.path.relpath(p, root).replace('\\', '/')
            with open(p, 'r', encoding='utf-8', errors='ignore') as fp:
                c = fp.read()
            
            # find all href
            for m in re.finditer(r'href=["\']([^"\']+)["\']', c):
                h = m.group(1).strip()
                if not (h.startswith('/') or h.startswith('http://') or h.startswith('https://') or
                        h.startswith('#') or h.startswith('mailto:') or h.startswith('tel:') or
                        h.startswith('javascript:') or h.startswith('${')):
                    issues.append((rel_file, h))

print(f"Total relative href found: {len(issues)}")
for rf, h in issues:
    print(f"{rf:50} -> {h}")
