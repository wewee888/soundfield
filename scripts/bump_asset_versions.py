import glob, re, sys

sys.stdout.reconfigure(encoding='utf-8')

NEW_VER = '20261005h'

html_files = glob.glob('**/*.html', recursive=True)
updated_css_count = 0
updated_js_count = 0

for file_path in html_files:
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()

        new_content = content
        
        # Replace site.css?v=...
        if 'site.css' in new_content:
            new_content, n1 = re.subn(r'site\.css(?:\?v=[a-zA-Z0-9_.-]+)?', f'site.css?v={NEW_VER}', new_content)
            if n1 > 0:
                updated_css_count += 1

        # Replace site-auth.js?v=...
        if 'site-auth.js' in new_content:
            new_content, n2 = re.subn(r'site-auth\.js(?:\?v=[a-zA-Z0-9_.-]+)?', f'site-auth.js?v={NEW_VER}', new_content)
            if n2 > 0:
                updated_js_count += 1

        if new_content != content:
            with open(file_path, 'w', encoding='utf-8', newline='') as f:
                f.write(new_content)

    except Exception as e:
        print(f"Error updating {file_path}: {e}")

print(f"Successfully bumped asset versions to {NEW_VER}:")
print(f"  - site.css updated in {updated_css_count} files")
print(f"  - site-auth.js updated in {updated_js_count} files")
