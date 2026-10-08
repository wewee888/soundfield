#!/usr/bin/env python3
"""
scripts/patch_existing_use_cases.py

Applies the 2-column article layout (.uc-article-layout, .uc-article-main)
and the responsive sticky right sidebar (.uc-article-sidebar) to:
- 6 root use-cases (English, relative depth '../')
- 6 en use-cases (English, relative depth '../../')
- 6 zh use-cases (Chinese, relative depth '../../')
"""

import os
import glob
import re
from use_case_base import build_sidebar_html

def patch_file(file_path, locale, rel_depth):
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # Skip if already patched
    if 'class="uc-article-layout"' in content:
        print(f"[SKIP] Already patched: {file_path}")
        return

    # Find the start of the 2nd section (Benchmark table, which contains uc-db-section)
    # Match the preceding comment (if any) and <section class="section reveal">
    m_start = re.search(r'([ \t]*<!--[^\n]*-->\s*<section class="section reveal"[^>]*>[\s\S]*?class="uc-db-section")', content)
    if not m_start:
        # Fallback to <section class="section reveal">
        m_start = re.search(r'(<section class="section reveal"[^>]*>[\s\S]*?class="uc-db-section")', content)
    if not m_start:
        print(f"[ERROR] Start of benchmark table not found in {file_path}")
        return

    start_idx = m_start.start()

    # Find the end of FAQ section: id="faq-section" ... </section>
    m_faq = re.search(r'(<section class="section"[^>]*id="faq-section"[\s\S]*?</section>)', content)
    if not m_faq:
        print(f"[ERROR] FAQ section not found in {file_path}")
        return

    end_idx = m_faq.end()

    article_body = content[start_idx:end_idx]

    # Add id="benchmarks" to the section containing uc-db-section
    def add_id(text, marker, target_id):
        # Find the <section class="section reveal"...> directly preceding marker
        pattern = re.compile(r'(<section class="section reveal)("(?![^>]*\bid=)[^>]*>([\s\S]*?' + re.escape(marker) + r'))')
        match = pattern.search(text)
        if match:
            # check if id is already there
            before = text[:match.start()]
            matched_section = match.group(1) + f'" id="{target_id}"' + match.group(0)[len(match.group(1)) + 1:]
            after = text[match.end():]
            return before + matched_section + after
        return text

    article_body = add_id(article_body, 'class="uc-db-section"', 'benchmarks')
    article_body = add_id(article_body, 'class="uc-steps"', 'workflow')
    article_body = add_id(article_body, 'class="uc-feature-grid"', 'capabilities')
    article_body = add_id(article_body, 'class="uc-evidence-strip"', 'rules')

    sidebar_html = build_sidebar_html(locale, rel_depth=rel_depth)

    wrapped_article = f'''    <div class="uc-article-layout">
      <div class="uc-article-main">
{article_body.strip()}
      </div>
{sidebar_html}
    </div>\n\n'''

    new_content = content[:start_idx] + wrapped_article + content[end_idx:]

    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(new_content)
    print(f"[PATCHED] {file_path} ({len(new_content)} bytes)")

def main():
    root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    
    # 1. Root use-cases (depth '../', locale 'en')
    for f in glob.glob(os.path.join(root, 'use-cases', '*.html')):
        if os.path.basename(f) == 'index.html':
            continue
        patch_file(f, locale='en', rel_depth='../')

    # 2. English use-cases (depth '../../', locale 'en')
    for f in glob.glob(os.path.join(root, 'use-cases', 'en', '*.html')):
        if os.path.basename(f) == 'index.html':
            continue
        patch_file(f, locale='en', rel_depth='../../')

    # 3. Chinese use-cases (depth '../../', locale 'zh')
    for f in glob.glob(os.path.join(root, 'use-cases', 'zh', '*.html')):
        if os.path.basename(f) == 'index.html':
            continue
        patch_file(f, locale='zh', rel_depth='../../')

if __name__ == '__main__':
    main()
