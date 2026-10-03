#!/usr/bin/env python3
"""
scripts/sync_navigation.py

Standardize and unify the navigation bar across all 9 localized editions and
root marketing/documentation pages of SOUNDTEST.PRO.

Menu items:
1. Home
2. Open App
3. Samples
4. Accuracy
5. Standards
6. Noise Levels
7. Account
"""

import os
import re
import sys

NAV_TRANSLATIONS = {
    'en': {
        'home': 'Home',
        'open_app': 'Open App',
        'samples': 'Samples',
        'accuracy': 'Accuracy',
        'standards': 'Standards',
        'noise_levels': 'Noise Levels',
        'account': 'Account',
    },
    'zh': {
        'home': '首页',
        'open_app': '打开工具',
        'samples': '报告样例',
        'accuracy': '计量精度',
        'standards': '噪声标准',
        'noise_levels': '分贝等级',
        'account': '账户中心',
    },
    'es': {
        'home': 'Inicio',
        'open_app': 'Abrir app',
        'samples': 'Muestras',
        'accuracy': 'Precisión',
        'standards': 'Estándares',
        'noise_levels': 'Niveles de ruido',
        'account': 'Mi cuenta',
    },
    'fr': {
        'home': 'Accueil',
        'open_app': 'Ouvrir l’outil',
        'samples': 'Échantillons',
        'accuracy': 'Précision',
        'standards': 'Normes',
        'noise_levels': 'Niveaux de bruit',
        'account': 'Compte',
    },
    'de': {
        'home': 'Start',
        'open_app': 'Tool öffnen',
        'samples': 'Messberichte',
        'accuracy': 'Genauigkeit',
        'standards': 'Normen',
        'noise_levels': 'Dezibel-Tabelle',
        'account': 'Konto',
    },
    'ja': {
        'home': 'ホーム',
        'open_app': '測定ツール',
        'samples': 'サンプル',
        'accuracy': '測定精度',
        'standards': '環境基準',
        'noise_levels': 'デシベル基準',
        'account': 'アカウント',
    },
    'ko': {
        'home': '홈',
        'open_app': '측정 도구',
        'samples': '샘플 리포트',
        'accuracy': '정밀도',
        'standards': '소음 기준',
        'noise_levels': '데시벨 기준',
        'account': '계정',
    },
    'vi': {
        'home': 'Trang chủ',
        'open_app': 'Mở ứng dụng',
        'samples': 'Mẫu báo cáo',
        'accuracy': 'Độ chính xác',
        'standards': 'Quy chuẩn',
        'noise_levels': 'Mức decibel',
        'account': 'Tài khoản',
    },
    'th': {
        'home': 'หน้าแรก',
        'open_app': 'เปิดเครื่องมือ',
        'samples': 'ตัวอย่างรายงาน',
        'accuracy': 'ความแม่นยำ',
        'standards': 'มาตรฐานเสียง',
        'noise_levels': 'ระดับเดซิเบล',
        'account': 'บัญชีผู้ใช้',
    },
}

LOCALES = ['zh', 'en', 'es', 'fr', 'de', 'ja', 'ko', 'vi', 'th']

def get_file_context(rel_path):
    """Determine locale, relative URLs, active key, and whether this file should have unified nav."""
    parts = rel_path.replace('\\', '/').split('/')
    file_name = parts[-1]

    # Skip files that should not have standard site-nav
    if file_name in ['auth.html', 'soundtest.html', 'app.html', 'refund.html', 'admin.html']:
        return None
    if 'node_modules' in parts or '.git' in parts or '_temp' in parts:
        return None

    # Determine active item
    active_map = {
        'index.html': 'home',
        'samples.html': 'samples',
        'accuracy.html': 'accuracy',
        'standards.html': 'standards',
        'noise-levels.html': 'noise_levels',
    }
    active_key = active_map.get(file_name, None)

    # 1. Root level files (e.g. "index.html", "standards.html")
    if len(parts) == 1:
        lang = 'en'
        urls = {
            'home': 'index.html',
            'open_app': 'soundtest.html',
            'samples': 'samples.html',
            'accuracy': 'accuracy.html',
            'standards': 'standards.html',
            'noise_levels': 'noise-levels.html',
            'account': 'auth.html',
        }
        return {'lang': lang, 'urls': urls, 'active': active_key}

    # 2. Variant folders (e.g. "a/index.html", "b/index.html", "c/index.html")
    if len(parts) == 2 and parts[0] in ['a', 'b', 'c']:
        lang = 'en'
        urls = {
            'home': '../index.html',
            'open_app': '../soundtest.html',
            'samples': '../samples.html',
            'accuracy': '../accuracy.html',
            'standards': '../standards.html',
            'noise_levels': '../noise-levels.html',
            'account': '../auth.html',
        }
        return {'lang': lang, 'urls': urls, 'active': active_key}

    # 3. Locale subdirectories (e.g. "zh/index.html", "es/standards.html")
    if len(parts) == 2 and parts[0] in LOCALES:
        lang = parts[0]
        urls = {
            'home': 'index.html',
            'open_app': '../soundtest.html',
            'samples': 'samples.html',
            'accuracy': 'accuracy.html',
            'standards': 'standards.html',
            'noise_levels': 'noise-levels.html',
            'account': 'auth.html',
        }
        return {'lang': lang, 'urls': urls, 'active': active_key}

    # 4. Use-cases root (e.g. "use-cases/neighbor-noise-evidence.html")
    if len(parts) == 2 and parts[0] == 'use-cases':
        lang = 'en'
        urls = {
            'home': '../index.html',
            'open_app': '../soundtest.html',
            'samples': '../samples.html',
            'accuracy': '../accuracy.html',
            'standards': '../standards.html',
            'noise_levels': '../noise-levels.html',
            'account': '../auth.html',
        }
        return {'lang': lang, 'urls': urls, 'active': None}

    # 5. Use-cases locale (e.g. "use-cases/zh/neighbor-noise-evidence.html")
    if len(parts) == 3 and parts[0] == 'use-cases' and parts[1] in LOCALES:
        lang = parts[1]
        urls = {
            'home': f'../../{lang}/index.html',
            'open_app': '../../soundtest.html',
            'samples': f'../../{lang}/samples.html',
            'accuracy': f'../../{lang}/accuracy.html',
            'standards': f'../../{lang}/standards.html',
            'noise_levels': f'../../{lang}/noise-levels.html',
            'account': f'../../{lang}/auth.html',
        }
        return {'lang': lang, 'urls': urls, 'active': None}

    return None

def build_nav_links_html(ctx):
    lang = ctx['lang']
    urls = ctx['urls']
    active_key = ctx['active']
    t = NAV_TRANSLATIONS.get(lang, NAV_TRANSLATIONS['en'])

    def a_tag(key, url):
        cls = ' class="active"' if key == active_key else ''
        return f'<a href="{url}"{cls}>{t[key]}</a>'

    items = [
        a_tag('home', urls['home']),
        a_tag('open_app', urls['open_app']),
        a_tag('samples', urls['samples']),
        a_tag('accuracy', urls['accuracy']),
        a_tag('standards', urls['standards']),
        a_tag('noise_levels', urls['noise_levels']),
        a_tag('account', urls['account']),
    ]

    inner = '\n          '.join(items)
    return f'<div class="nav-links">\n          {inner}\n        </div>'

def process_file(file_path, dry_run=False):
    rel_path = os.path.relpath(file_path, '.').replace('\\', '/')
    ctx = get_file_context(rel_path)
    if not ctx:
        return False, "Skipped"

    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # Check if this file has a site-nav
    if '<nav class="site-nav' not in content and '<nav class="site-nav' not in content:
        return False, "No site-nav found"

    new_nav_links = build_nav_links_html(ctx)

    # Strategy: Replace either <div class="nav-links">...</div> or <div class="nav-anchor-group"[^>]*>...</div>
    # inside <div class="site-nav-main">
    pattern_nav_links = re.compile(r'<div class="nav-links">[\s\S]*?<\/div>')
    pattern_nav_anchor = re.compile(r'<div class="nav-anchor-group"[^>]*>[\s\S]*?<\/div>')

    new_content = None
    if pattern_nav_links.search(content):
        new_content = pattern_nav_links.sub(new_nav_links, content, count=1)
    elif pattern_nav_anchor.search(content):
        new_content = pattern_nav_anchor.sub(new_nav_links, content, count=1)
    else:
        # Try finding <div class="site-nav-main"> ... </div> and inserting after <a class="brand..."
        brand_match = re.search(r'(<div class="site-nav-main">[\s\S]*?<a [^>]*class="brand[^>]*>[\s\S]*?<\/a>)', content)
        if brand_match:
            prefix = brand_match.group(1)
            # Find the end of site-nav-main
            new_content = content.replace(prefix, prefix + '\n        ' + new_nav_links, 1)

    if not new_content or new_content == content:
        return False, "Unchanged"

    # Verify that all local relative links point to existing files
    base_dir = os.path.dirname(os.path.abspath(file_path))
    for key, target in ctx['urls'].items():
        clean_target = target.split('?')[0].split('#')[0]
        abs_target = os.path.abspath(os.path.join(base_dir, clean_target))
        if not os.path.exists(abs_target):
            print(f"ERROR: Broken link generated in {rel_path}: {target} -> {abs_target}", file=sys.stderr)
            return False, f"Broken link: {target}"

    if not dry_run:
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(new_content)

    return True, f"Updated ({ctx['lang']}, active={ctx['active']})"

def main():
    dry_run = '--dry-run' in sys.argv
    print(f"Starting navigation synchronization (dry_run={dry_run})...")

    updated_count = 0
    skipped_count = 0
    errors = []

    for root, dirs, files in os.walk('.'):
        if any(ignored in root for ignored in ['node_modules', '.git', '_temp']):
            continue
        for f in files:
            if not f.endswith('.html'):
                continue
            path = os.path.join(root, f)
            success, msg = process_file(path, dry_run=dry_run)
            if success:
                updated_count += 1
                print(f"  [OK] {path}: {msg}")
            else:
                skipped_count += 1
                if "Broken link" in msg:
                    errors.append((path, msg))

    print(f"\nFinished. Updated: {updated_count}, Skipped/Unchanged: {skipped_count}")
    if errors:
        print(f"Encountered {len(errors)} errors:")
        for p, err in errors:
            print(f"  {p}: {err}")
        sys.exit(1)

if __name__ == '__main__':
    main()
