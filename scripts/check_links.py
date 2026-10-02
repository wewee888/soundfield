import os
import re

html_files = []
for root, dirs, files in os.walk('.'):
    if 'node_modules' in root or '.git' in root or '_temp' in root:
        continue
    for file in files:
        if file.endswith('.html'):
            html_files.append(os.path.normpath(os.path.join(root, file)))

links = {}
for file in html_files:
    with open(file, 'r', encoding='utf-8', errors='ignore') as f:
        content = f.read()
        hrefs = re.findall(r'href=[\'\"]([^\'\">]+)[\'\"]', content)
        srcs = re.findall(r'src=[\'\"]([^\'\">]+)[\'\"]', content)
        for link in hrefs + srcs:
            if link.startswith('http') or link.startswith('//') or link.startswith('#') or link.startswith('mailto:') or link.startswith('data:') or link.startswith('javascript:') or link.startswith('${') or '/api/' in link:
                continue
            if link not in links:
                links[link] = []
            links[link].append(file)

def check_link(link, source_file):
    # remove query and hash
    orig = link
    link = link.split('?')[0].split('#')[0]
    if not link: return True
    if link.endswith('/'):
        link += 'index.html'
    
    if link.startswith('/'):
        path = '.' + link
    else:
        # handle relative
        source_dir = os.path.dirname(source_file)
        path = os.path.join(source_dir, link)
    
    path = os.path.normpath(path)
    
    if os.path.isdir(path):
        path = os.path.join(path, 'index.html')
    
    # allow some clean URLs due to _redirects
    if not os.path.exists(path):
        if not path.endswith('.html'):
            if os.path.exists(path + '.html'):
                return True
        return False
    return True

broken = []
for link, files in links.items():
    for f in files:
        if not check_link(link, f):
            broken.append((link, f))

# deduplicate
broken = list(set(broken))

for link, file in broken:
    print(f'Broken: {link} in {file}')
if not broken:
    print('No broken links found')
