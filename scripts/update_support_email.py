import os
import glob
import re

root_dir = r'E:\.site\dB_test\soundtest'
html_files = glob.glob(os.path.join(root_dir, '**', '*.html'), recursive=True)

count_email = 0
for f in html_files:
    if '_temp' in f or '.git' in f:
        continue
    content = open(f, 'r', encoding='utf-8').read()
    orig = content
    
    # 1. Update English / general footers
    content = re.sub(
        r'<div style="font-size:12px;color:var\(--soft\);margin-top:6px;">Official Support:.*?</div>',
        '<div style="font-size:12px;color:var(--soft);margin-top:6px;">Customer Support: <a href="mailto:support@soundtest.pro" style="color:var(--accent);text-underline-offset:2px;font-weight:600;">support@soundtest.pro</a> / <a href="mailto:hi@soundtest.pro" style="color:var(--accent);text-underline-offset:2px;">hi@soundtest.pro</a> (Replies within 24 hours)</div>',
        content
    )
    # Chinese footers
    content = re.sub(
        r'<div style="font-size:12px;color:var\(--soft\);margin-top:6px;">官方客服支持：.*?</div>',
        '<div style="font-size:12px;color:var(--soft);margin-top:6px;">官方客户支持邮箱：<a href="mailto:support@soundtest.pro" style="color:var(--accent);text-underline-offset:2px;font-weight:600;">support@soundtest.pro</a> / <a href="mailto:hi@soundtest.pro" style="color:var(--accent);text-underline-offset:2px;">hi@soundtest.pro</a>（24小时内极速回复）</div>',
        content
    )
    # Variant pages
    content = re.sub(
        r'Support Contact: <a href="mailto:hi@soundtest.pro"[^>]*>hi@soundtest.pro</a>',
        'Customer Support: <a href="mailto:support@soundtest.pro" style="color:var(--accent);font-weight:600;">support@soundtest.pro</a> / <a href="mailto:hi@soundtest.pro" style="color:var(--accent);font-weight:600;">hi@soundtest.pro</a>',
        content
    )
    # footer-social mailto
    content = re.sub(
        r'<a href="mailto:(?:hi|hello)@soundtest.pro" aria-label="[^"]*">',
        '<a href="mailto:support@soundtest.pro" aria-label="Customer Support (support@soundtest.pro)">',
        content
    )
    # terms.html contact section
    content = content.replace(
        '<li><strong>Official Support Email:</strong> <a href="mailto:hi@soundtest.pro"',
        '<li><strong>Customer Support Email:</strong> <a href="mailto:support@soundtest.pro" style="color:var(--accent);font-weight:600;">support@soundtest.pro</a> / <a href="mailto:hi@soundtest.pro"'
    )
    
    if content != orig:
        open(f, 'w', encoding='utf-8').write(content)
        count_email += 1

print(f'Successfully updated support email in {count_email} HTML files.')
