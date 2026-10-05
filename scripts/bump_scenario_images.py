# scripts/bump_scenario_images.py
# Appends ?v=20261006a to scenario image references across all html files

import os
import re

IMAGES = [
    'neighbor_noise_monitor.webp',
    'bar_street_noise.webp',
    'construction_noise_evidence.webp',
    'property_noise_report.webp',
    'rental_dispute_evidence.webp',
    'workplace_noise_inspection.webp'
]

VERSION = '20261006a'

def main():
    root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    count = 0
    updated_files = 0
    
    for dirpath, dirnames, filenames in os.walk(root):
        if any(skip in dirpath for skip in ['.git', '.wrangler', 'node_modules', '_temp']):
            continue
        for fn in filenames:
            if not fn.endswith('.html'):
                continue
            path = os.path.join(dirpath, fn)
            with open(path, 'r', encoding='utf-8') as f:
                content = f.read()
            
            modified = False
            for img in IMAGES:
                pattern = re.compile(rf'{re.escape(img)}(\?v=[a-zA-Z0-9_-]+)?')
                if pattern.search(content):
                    new_content = pattern.sub(f'{img}?v={VERSION}', content)
                    if new_content != content:
                        content = new_content
                        modified = True
                        count += 1
            
            if modified:
                with open(path, 'w', encoding='utf-8') as f:
                    f.write(content)
                updated_files += 1
                rel_path = os.path.relpath(path, root)
                print(f"Updated {rel_path}")

    print(f"\nCompleted: {count} image tags updated across {updated_files} HTML files.")

if __name__ == '__main__':
    main()
