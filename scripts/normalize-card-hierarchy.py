import glob
import re

files = glob.glob('use-cases/**/*.html', recursive=True)
count = 0

for f in files:
    with open(f, 'r', encoding='utf-8') as fp:
        content = fp.read()
    
    orig = content
    # Replace misleading card-badge FAQ in habits card with Habits
    content = re.sub(r'<div class="card-badge">FAQ</div>(\s*<h[23]>.*?</h[23]>)', r'<div class="card-badge">Habits</div>\1', content)
    # Ensure headings inside grid two cards are h3 for proper hierarchy
    content = re.sub(r'(<section class="section grid two">[\s\S]*?<div class="card-badge">Habits</div>\s*)<h2>(.*?)</h2>', r'\1<h3>\2</h3>', content)
    content = re.sub(r'(<section class="section grid two">[\s\S]*?<div class="card-badge">Practice</div>\s*)<h2>(.*?)</h2>', r'\1<h3>\2</h3>', content)
    content = re.sub(r'(<section class="section grid two">[\s\S]*?<div class="card-badge">Tips</div>\s*)<h2>(.*?)</h2>', r'\1<h3>\2</h3>', content)
    content = re.sub(r'(<section class="section grid two">[\s\S]*?<div class="card-badge">Suggested script</div>\s*)<h2>(.*?)</h2>', r'\1<h3>\2</h3>', content)
    content = re.sub(r'(<section class="section grid two">[\s\S]*?<div class="card-badge">Best fit</div>\s*)<h2>(.*?)</h2>', r'\1<h3>\2</h3>', content)

    if content != orig:
        with open(f, 'w', encoding='utf-8') as fp:
            fp.write(content)
        print('Fixed badge & heading hierarchy in:', f)
        count += 1

print('Total files updated:', count)
