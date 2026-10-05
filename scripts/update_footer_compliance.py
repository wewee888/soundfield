import glob
import os
import re
import sys

def main():
    all_html = glob.glob('*.html') + glob.glob('*/*.html') + glob.glob('*/*/*.html')
    all_html = [f.replace('\\', '/') for f in all_html if not f.startswith('node_modules') and 'scratch' not in f]

    print(f"Total HTML files scanned: {len(all_html)}")

    updated_count = 0
    for f in all_html:
        with open(f, 'r', encoding='utf-8') as fp:
            orig = fp.read()
        c = orig
        is_zh = '/zh/' in f or f.startswith('zh/')
        
        parts = f.split('/')
        depth = len(parts) - 1

        if is_zh:
            if depth == 1:
                terms_path = 'terms.html'
                about_path = 'about.html'
            elif depth == 2:
                terms_path = '../../zh/terms.html'
                about_path = '../../zh/about.html'
            else:
                terms_path = 'terms.html'
                about_path = 'about.html'
        else:
            if depth == 0:
                terms_path = 'terms.html'
                about_path = 'about.html'
            elif depth == 1:
                terms_path = '../terms.html'
                about_path = '../about.html'
            elif depth == 2:
                terms_path = '../../terms.html'
                about_path = '../../about.html'
            else:
                terms_path = 'terms.html'
                about_path = 'about.html'

        # 1. Update copyright
        if is_zh:
            new_cr = '<span>© SOUNDTEST.PRO · 专业级声学测量与现场数字存证系统 · 严格遵循 IEC 61672 声学测定规范。</span>'
            support_line = '        <div style="font-size:12px;color:var(--soft);margin-top:6px;">官方客服支持：<a href="mailto:hi@soundtest.pro" style="color:var(--accent);text-underline-offset:2px;">hi@soundtest.pro</a>（24 小时内快速响应）</div>'
            about_link = f'<li><a href="{about_path}">关于我们与支持</a></li>'
        else:
            new_cr = '<span>© SOUNDTEST.PRO · Professional Acoustic Measurement &amp; Digital Evidence Platform · Engineered to IEC 61672 Standards.</span>'
            support_line = '        <div style="font-size:12px;color:var(--soft);margin-top:6px;">Official Support: <a href="mailto:hi@soundtest.pro" style="color:var(--accent);text-underline-offset:2px;">hi@soundtest.pro</a> (Replies within 24 hours)</div>'
            about_link = f'<li><a href="{about_path}">About &amp; Contact</a></li>'

        # Replace any old copyright line
        c = re.sub(r'<span>©\s*SOUNDTEST\.PRO[^<]*</span>', new_cr, c)

        # 2. Support line in footer-meta if not present
        if ('hi@soundtest.pro' not in c and '官方客服支持' not in c and 'Official Support' not in c) and '<div class="footer-meta">' in c:
            c = c.replace(new_cr, f'{new_cr}\n{support_line}')

        # 3. hello@ -> hi@
        c = c.replace('mailto:hello@soundtest.pro', 'mailto:hi@soundtest.pro')

        # 4. terms.html in legal column
        c = re.sub(
            r'href="[^"]*compliance\.html"(?=>\s*(?:Terms of Service|Conditions d\'utilisation|Nutzungsbedingungen|T&eacute;rminos de servicio|T[ée]rminos de servicio|利用規約|服务条款|合规与服务条款|서비스 약관|이용약관|Điều khoản dịch vụ|ข้อกำหนดการใช้งาน|ข้อกำหนดการให้บริการ))',
            f'href="{terms_path}"',
            c
        )

        # 5. about link if not present in footer
        if 'about.html' not in c and f'href="{terms_path}"' in c:
            c = c.replace(
                f'<li><a href="{terms_path}"',
                f'{about_link}\n            <li><a href="{terms_path}"'
            )

        if c != orig:
            with open(f, 'w', encoding='utf-8') as fp:
                fp.write(c)
            updated_count += 1

    print(f"Successfully updated {updated_count} files.")

if __name__ == '__main__':
    main()
