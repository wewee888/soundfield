#!/usr/bin/env python3
"""
scripts/fix_spider_trap_and_i18n.py

Comprehensive fixer for:
1. Static resource paths (manifest, CSS, JS, images, icons) -> Absolute root-relative paths (/...)
2. Footer flags & language switchers -> Absolute root-relative paths (anti-spider trap)
3. Localized pages language follow:
   - Brand logo links -> /{locale}/
   - Soundtest app links -> /soundtest.html?lang={locale} (preserving query params)
   - Use-case links -> /use-cases/{locale}/...
   - Legal/resource links -> /{locale}/...
4. Root pages links -> Root-relative /...
5. Canonical and alternate hreflang fixes (removing /index/)
"""

import os
import re
import urllib.parse

ROOT_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))

LOCALES = ['zh', 'en', 'es', 'fr', 'de', 'ja', 'ko', 'vi', 'th']
NON_EN_LOCALES = ['zh', 'es', 'fr', 'de', 'ja', 'ko', 'vi', 'th']

STANDARD_PAGES = [
    'about', 'accuracy', 'auth', 'camera', 'changelog', 'compliance',
    'disclaimer', 'download', 'launch-metrics', 'monetization',
    'noise-levels', 'privacy', 'refund', 'samples', 'standards',
    'stats', 'terms'
]

SCENARIOS = [
    'neighbor-noise-evidence',
    'construction-noise-monitoring',
    'bar-street-disturbance',
    'rental-dispute-evidence',
    'property-noise-complaint-report',
    'workplace-noise-inspection'
]

def get_page_context(rel_path):
    """
    Returns (locale, is_use_case, page_name)
    """
    parts = rel_path.replace('\\', '/').split('/')
    if len(parts) == 1:
        # e.g. index.html, samples.html, soundtest.html
        return ('en', False, parts[0])
    
    if parts[0] in ['a', 'b', 'c']:
        return ('en', False, parts[1])
    
    if parts[0] in LOCALES:
        # e.g. zh/index.html, fr/samples.html
        return (parts[0], False, parts[1])
    
    if parts[0] == 'use-cases':
        if len(parts) == 2:
            # use-cases/index.html or use-cases/neighbor-noise-evidence.html
            return ('en', True, parts[1])
        elif len(parts) == 3 and parts[1] in LOCALES:
            # use-cases/fr/index.html
            return (parts[1], True, parts[2])
    
    return ('en', False, parts[-1])

def fix_manifest(content):
    """Convert any <link rel="manifest" href="..."> to href="/manifest.webmanifest"."""
    return re.sub(
        r'(<link[^>]+rel=["\']manifest["\'][^>]+href=["\'])[^"\']*(["\'])',
        r'\g<1>/manifest.webmanifest\g<2>',
        content
    )

def fix_assets(content):
    """
    Convert relative assets paths (CSS, JS, images, icons, manifest)
    e.g. href="../assets/...", src="../../assets/...", src="assets/..."
    to start with /assets/
    """
    # 1. Attributes href/src/content with assets/
    def repl_asset(m):
        attr = m.group(1)
        quote = m.group(2)
        val = m.group(3)
        # If already absolute or external, keep it
        if val.startswith('/') or re.match(r'^(?:https?:|//|data:)', val):
            return m.group(0)
        # Strip any leading ../ or ./
        clean_val = re.sub(r'^(?:\.\./|\./)+', '', val)
        if clean_val.startswith('assets/'):
            return f'{attr}={quote}/{clean_val}{quote}'
        return m.group(0)

    pattern = re.compile(r'\b(href|src|content)=(["\'])([^"\']*?assets/[^"\']*?)\2')
    return pattern.sub(repl_asset, content)

def fix_canonical_and_hreflang(content):
    """Fix /index/ in canonical or alternate URLs."""
    content = re.sub(r'https://soundtest\.pro/use-cases/([a-z]{2})/index/', r'https://soundtest.pro/use-cases/\1/', content)
    content = re.sub(r'https://soundtest\.pro/use-cases/index/', r'https://soundtest.pro/use-cases/', content)
    return content

def fix_footer_flags(content, locale, is_use_case):
    """
    Fix .footer-flag hrefs to absolute paths.
    """
    def repl_flag(m):
        full_tag = m.group(0)
        # Detect target locale from title or existing href or text
        target_loc = None
        for loc in LOCALES:
            if re.search(rf'\b(?:{loc}|{loc.upper()})\b', full_tag, re.IGNORECASE):
                target_loc = loc
                break
        if not target_loc:
            # Try to extract from href
            href_m = re.search(r'href=["\']([^"\']+)["\']', full_tag)
            if href_m:
                h = href_m.group(1)
                loc_m = re.search(r'/(en|zh|es|fr|de|ja|ko|vi|th)/', h)
                if loc_m:
                    target_loc = loc_m.group(1)

        if not target_loc:
            return full_tag

        target_url = '/' if target_loc == 'en' else f'/{target_loc}/'
        if is_use_case:
            target_url = '/use-cases/' if target_loc == 'en' else f'/use-cases/{target_loc}/'

        # Replace href attribute
        new_tag = re.sub(r'href=["\'][^"\']*["\']', f'href="{target_url}"', full_tag)
        return new_tag

    return re.sub(r'<a\s+[^>]*class=["\'][^"\']*footer-flag[^"\']*["\'][^>]*>[\s\S]*?</a>', repl_flag, content)

def fix_footer_lang_list(content, is_use_case):
    """
    Fix language lists in footer:
    <li><a href="../../en/index.html">English</a></li> etc.
    """
    def repl_lang_link(m):
        prefix = m.group(1)
        loc = m.group(2)
        suffix = m.group(3)
        target_url = '/' if loc == 'en' else f'/{loc}/'
        if is_use_case:
            target_url = '/use-cases/' if loc == 'en' else f'/use-cases/{loc}/'
        return f'{prefix}href="{target_url}"{suffix}'

    pattern = re.compile(r'(<a\s+[^>]*)href=["\'][^"\']*(?:/|\b)(en|zh|es|fr|de|ja|ko|vi|th)/(?:index\.html?)?["\']([^>]*>(?:English|中文|Español|Français|Deutsch|日本語|한국어|Tiếng Việt|ไทย)</a>)', re.IGNORECASE)
    return pattern.sub(repl_lang_link, content)

def fix_soundtest_links(content, locale):
    """
    Ensure all soundtest links:
    1. Are root-relative /soundtest.html
    2. Have ?lang={locale} (for non-en locales)
    """
    def repl_st(m):
        full_tag = m.group(0)
        href_match = re.search(r'href=(["\'])([^"\']*soundtest\.html[^"\']*)\1', full_tag)
        if not href_match:
            return full_tag
        
        quote = href_match.group(1)
        orig_href = href_match.group(2)
        
        # Split hash
        parts = orig_href.split('#', 1)
        url_part = parts[0]
        hash_part = ('#' + parts[1]) if len(parts) > 1 else ''
        
        # Parse query params
        q_parts = url_part.split('?', 1)
        base_path = '/soundtest.html'
        query_str = q_parts[1] if len(q_parts) > 1 else ''
        
        params = urllib.parse.parse_qsl(query_str, keep_blank_values=True)
        # Convert to dict or list of pairs
        param_dict = dict(params)
        
        if locale != 'en':
            param_dict['lang'] = locale
            param_dict.pop('locale', None)
        else:
            # English
            param_dict.pop('lang', None)
            param_dict.pop('locale', None)

        new_query = urllib.parse.urlencode(param_dict)
        final_url = base_path + (('?' + new_query) if new_query else '') + hash_part
        
        return full_tag[:href_match.start()] + f'href={quote}{final_url}{quote}' + full_tag[href_match.end():]

    return re.sub(r'<a\s+[^>]*href=["\'][^"\']*soundtest\.html[^"\']*["\'][^>]*>', repl_st, content)

def fix_brand_links(content, locale):
    """
    Ensure brand logo in header & footer links to /{locale}/ (or / for en).
    """
    target = '/' if locale == 'en' else f'/{locale}/'
    return re.sub(
        r'(<a\s+[^>]*class=["\'][^"\']*brand[^"\']*["\'][^>]*\bhref=)(["\'])[^"\']*\2',
        rf'\1\2{target}\2',
        content
    )

def fix_use_case_pills_and_links(content, locale):
    """
    In localized pages, ensure links to use-case scenarios point to /{locale}/ or /use-cases/{locale}/...
    """
    for sc in SCENARIOS:
        # 1. Naked scenario: href="neighbor-noise-evidence.html"
        content = re.sub(
            rf'href=(["\'])(?:\.\./)*(?:use-cases/)?{sc}\.html\1',
            rf'href=\1/use-cases/{locale}/{sc}.html\1' if locale != 'en' else rf'href=\1/use-cases/{sc}.html\1',
            content
        )
        # 2. Existing cross-locale use-case links like ../use-cases/neighbor-noise-evidence.html
        if locale != 'en':
            content = re.sub(
                rf'href=(["\'])(?:\.\./)+(?:use-cases/)?(?:[a-z]{{2}}/)?{sc}\.html\1',
                rf'href=\1/use-cases/{locale}/{sc}.html\1',
                content
            )

    return content

def fix_localized_standard_page_links(content, locale, is_use_case):
    """
    In localized pages, ensure navigation and footer links to standard pages
    (samples, accuracy, standards, noise-levels, auth, camera, terms, privacy, etc.)
    point to /{locale}/{page}.html (or /{page}.html for en).
    """
    target_prefix = '/' if locale == 'en' else f'/{locale}/'

    for page in STANDARD_PAGES:
        # Match href="samples.html" or href="../samples.html" or href="../../samples.html" or href="../zh/samples.html"
        pattern = re.compile(
            rf'href=(["\'])(?:\.\./)*(?:[a-z]{{2}}/)?{page}\.html((?:[?#][^"\']*)?)\1'
        )
        def repl(m):
            quote = m.group(1)
            extra = m.group(2)
            return f'href={quote}{target_prefix}{page}.html{extra}{quote}'
        content = pattern.sub(repl, content)

    # Home links: href="index.html" or href="../index.html" or href="../../index.html"
    # (excluding brand links which were already handled)
    pattern_home = re.compile(r'(?<!brand )href=(["\'])(?:\.\./)*(?:[a-z]{2}/)?index\.html((?:#[^"\']*)?)\1')
    def repl_home(m):
        quote = m.group(1)
        hash_val = m.group(2)
        return f'href={quote}{target_prefix}{hash_val}{quote}'
    content = pattern_home.sub(repl_home, content)

    # Pricing links: href="../#pricing" or href="../../#pricing" or href="#pricing"
    # If in non-en locale and not on index.html:
    if is_use_case:
        content = re.sub(
            r'href=(["\'])(?:\.\./)+#pricing\1',
            rf'href=\1{target_prefix}#pricing\1',
            content
        )

    return content

def process_file(file_path):
    rel_path = os.path.relpath(file_path, ROOT_DIR).replace('\\', '/')
    locale, is_use_case, page_name = get_page_context(rel_path)

    with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
        content = f.read()

    orig_content = content

    # 1. Manifest
    content = fix_manifest(content)

    # 2. Assets (CSS/JS/img)
    content = fix_assets(content)

    # 3. Canonical and hreflang
    content = fix_canonical_and_hreflang(content)

    # 4. Footer flags
    content = fix_footer_flags(content, locale, is_use_case)

    # 5. Footer language list
    content = fix_footer_lang_list(content, is_use_case)

    # 6. Brand logo
    content = fix_brand_links(content, locale)

    # 7. Soundtest links with lang
    content = fix_soundtest_links(content, locale)

    # 8. Use-case links
    content = fix_use_case_pills_and_links(content, locale)

    # 9. Standard page links
    content = fix_localized_standard_page_links(content, locale, is_use_case)

    if content != orig_content:
        with open(file_path, 'w', encoding='utf-8', newline='\n') as f:
            f.write(content)
        return True
    return False

def main():
    skip_dirs = {'.git', 'node_modules', '_temp', 'test-results'}
    modified_count = 0
    total_files = 0

    for root, dirs, files in os.walk(ROOT_DIR):
        dirs[:] = [d for d in dirs if d not in skip_dirs]
        for f in files:
            if f.endswith('.html'):
                total_files += 1
                full_path = os.path.join(root, f)
                if process_file(full_path):
                    modified_count += 1

    print(f"Scanned {total_files} HTML files. Modified {modified_count} files.")

if __name__ == '__main__':
    main()
