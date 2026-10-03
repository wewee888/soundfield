import os, re

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
AUTH_MASTER = os.path.join(ROOT, 'auth.html')

with open(AUTH_MASTER, 'r', encoding='utf-8') as f:
    master_html = f.read()

LOCALES = {
    'zh': {
        'html_lang': 'zh-CN',
        'tab_pwd': '🔑 密码登录',
        'tab_magic': '✨ 邮箱免密 / 动态验证码',
        'code_label': '6 位动态验证码',
        'code_msg': '📬 登录凭证已发送！请查收您的邮箱，点击邮件中的<strong>一键安全登录</strong>链接，或直接在上方输入 <strong>6 位动态验证码</strong>完成登录。',
        'verify_btn': '验证并登录',
        'send_magic_btn': '✨ 发送登录链接与验证码',
        'note': '本地优先安全：密码在本地哈希，支持 Cloudflare Turnstile 人机验证与邮箱安全免密登录。'
    },
    'en': {
        'html_lang': 'en',
        'tab_pwd': '🔑 Password',
        'tab_magic': '✨ Magic Link / One-Time Code',
        'code_label': '6-Digit One-Time Code',
        'code_msg': '📬 Login credentials sent! Please check your inbox, click the <strong>One-Click Sign In</strong> link, or enter the <strong>6-digit code</strong> above.',
        'verify_btn': 'Verify &amp; Sign In',
        'send_magic_btn': '✨ Send Magic Link &amp; Code',
        'note': 'Local-first security: passwords hashed locally; email verification supported via Cloudflare Turnstile &amp; Magic Links.'
    },
    'fr': {
        'html_lang': 'fr',
        'tab_pwd': '🔑 Mot de passe',
        'tab_magic': '✨ Lien magique',
        'code_label': 'Code à 6 chiffres',
        'code_msg': '📬 Identifiants envoyés ! Consultez votre boîte mail, cliquez sur le lien <strong>Connexion directe</strong> ou saisissez le <strong>code à 6 chiffres</strong> ci-dessus.',
        'verify_btn': 'Vérifier et se connecter',
        'send_magic_btn': '✨ Envoyer le lien magique',
        'note': 'Sécurité locale d\'abord : mots de passe hachés localement, vérification Turnstile Cloudflare et liens magiques.'
    },
    'de': {
        'html_lang': 'de',
        'tab_pwd': '🔑 Passwort',
        'tab_magic': '✨ Magic Link',
        'code_label': '6-stelliger Einmalcode',
        'code_msg': '📬 Anmeldedaten gesendet! Bitte prüfen Sie Ihr Postfach, klicken Sie auf den <strong>Direkt-Login-Link</strong> oder geben Sie den <strong>6-stelligen Code</strong> oben ein.',
        'verify_btn': 'Bestätigen &amp; Anmelden',
        'send_magic_btn': '✨ Magic Link senden',
        'note': 'Lokale Sicherheit zuerst: Passwörter lokal gehasht, Cloudflare Turnstile und Magic Links unterstützt.'
    },
    'es': {
        'html_lang': 'es',
        'tab_pwd': '🔑 Contraseña',
        'tab_magic': '✨ Enlace mágico',
        'code_label': 'Código de 6 dígitos',
        'code_msg': '📬 ¡Credenciales enviadas! Revise su correo, haga clic en el enlace de <strong>Inicio seguro con 1 clic</strong> o introduzca el <strong>código de 6 dígitos</strong> arriba.',
        'verify_btn': 'Verificar e iniciar sesión',
        'send_magic_btn': '✨ Enviar enlace mágico',
        'note': 'Seguridad local primero: contraseñas cifradas localmente, soporte para Cloudflare Turnstile y enlaces mágicos.'
    },
    'ja': {
        'html_lang': 'ja',
        'tab_pwd': '🔑 パスワード',
        'tab_magic': '✨ マジックリンク',
        'code_label': '6桁の認証コード',
        'code_msg': '📬 ログイン認証情報を送信しました。メール内の<strong>ワンクリック安全ログイン</strong>リンクをクリックするか、上記の<strong>6桁認証コード</strong>を入力してください。',
        'verify_btn': '認証してログイン',
        'send_magic_btn': '✨ マジックリンクを送信',
        'note': 'ローカル優先セキュリティ：パスワードは端末内でハッシュ化され、Cloudflare Turnstile認証とマジックリンクに対応しています。'
    },
    'ko': {
        'html_lang': 'ko',
        'tab_pwd': '🔑 비밀번호',
        'tab_magic': '✨ 매직 링크',
        'code_label': '6자리 인증코드',
        'code_msg': '📬 로그인 인증 정보가 전송되었습니다! 이메일을 확인하여 <strong>원클릭 안전 로그인</strong> 링크를 누르거나, 상단에 <strong>6자리 인증코드</strong>를 입력해 주세요.',
        'verify_btn': '인증 및 로그인',
        'send_magic_btn': '✨ 매직 링크 발송',
        'note': '로컬 우선 보안: 비밀번호는 기기 내에서 해싱 처리되며, Cloudflare Turnstile 및 매직 링크 로그인을 지원합니다.'
    },
    'vi': {
        'html_lang': 'vi',
        'tab_pwd': '🔑 Mật khẩu',
        'tab_magic': '✨ Liên kết đăng nhập',
        'code_label': 'Mã xác thực 6 chữ số',
        'code_msg': '📬 Đã gửi thông tin đăng nhập! Vui lòng kiểm tra email và nhấp vào liên kết <strong>Đăng nhập 1 chạm</strong> hoặc nhập <strong>mã 6 chữ số</strong> bên trên.',
        'verify_btn': 'Xác thực &amp; Đăng nhập',
        'send_magic_btn': '✨ Gửi liên kết đăng nhập',
        'note': 'Bảo mật cục bộ: mật khẩu được băm cục bộ, hỗ trợ xác thực Cloudflare Turnstile và liên kết đăng nhập an toàn.'
    },
    'th': {
        'html_lang': 'th',
        'tab_pwd': '🔑 รหัสผ่าน',
        'tab_magic': '✨ ลิงก์ด่วนทางอีเมล',
        'code_label': 'รหัสยืนยัน 6 หลัก',
        'code_msg': '📬 ส่งข้อมูลการเข้าสู่ระบบแล้ว! โปรดตรวจสอบอีเมลของคุณ แล้วคลิกลิงก์ <strong>เข้าสู่ระบบปลอดภัย</strong> หรือกรอก <strong>รหัส 6 หลัก</strong> ด้านบน',
        'verify_btn': 'ยืนยันและเข้าสู่ระบบ',
        'send_magic_btn': '✨ ส่งลิงก์ด่วนทางอีเมล',
        'note': 'ความปลอดภัยบนอุปกรณ์เป็นหลัก: แฮชรหัสผ่านในเครื่อง รองรับการยืนยันตัวตน Cloudflare Turnstile และลิงก์ด่วนทางอีเมล'
    }
}

HREFLANGS = """  <link rel="alternate" hreflang="x-default" href="https://soundtest.pro/auth/"/>
  <link rel="alternate" hreflang="de" href="https://soundtest.pro/de/auth/"/>
  <link rel="alternate" hreflang="en" href="https://soundtest.pro/en/auth/"/>
  <link rel="alternate" hreflang="es" href="https://soundtest.pro/es/auth/"/>
  <link rel="alternate" hreflang="fr" href="https://soundtest.pro/fr/auth/"/>
  <link rel="alternate" hreflang="ja" href="https://soundtest.pro/ja/auth/"/>
  <link rel="alternate" hreflang="ko" href="https://soundtest.pro/ko/auth/"/>
  <link rel="alternate" hreflang="th" href="https://soundtest.pro/th/auth/"/>
  <link rel="alternate" hreflang="vi" href="https://soundtest.pro/vi/auth/"/>
  <link rel="alternate" hreflang="zh" href="https://soundtest.pro/zh/auth/"/>"""

for loc, cfg in LOCALES.items():
    loc_file = os.path.join(ROOT, loc, 'auth.html')
    html = master_html

    # Replace html lang
    html = re.sub(r'<html lang="[^"]*">', f'<html lang="{cfg["html_lang"]}">', html, count=1)

    # Replace canonical and insert hreflangs
    canonical_tag = f'<link rel="canonical" href="https://soundtest.pro/{loc}/auth/">\n{HREFLANGS}'
    html = re.sub(r'<link rel="canonical" href="[^"]*">', canonical_tag, html, count=1)

    # Adjust asset paths to parent directory
    html = html.replace('href="assets/', 'href="../assets/')
    html = html.replace('src="assets/', 'src="../assets/')

    # Adjust top-level routes from subfolder
    html = html.replace('href="soundtest.html', 'href="../soundtest.html')
    html = html.replace('href="use-cases/', 'href="../use-cases/')
    html = html.replace('href="noise-levels.html"', 'href="../noise-levels.html"')
    html = re.sub(r'href="(en|zh|es|fr|de|ja|ko|vi|th)/', r'href="../\1/', html)

    # Localize subtabs
    subtab_pattern = r'(<button type="button" class="login-subtab active" id="tabLoginPassword"[^>]*>)[^<]*(</button>\s*<button type="button" class="login-subtab" id="tabLoginMagic"[^>]*>)[^<]*(</button>)'
    subtab_repl = rf'\g<1>{cfg["tab_pwd"]}\g<2>{cfg["tab_magic"]}\g<3>'
    html = re.sub(subtab_pattern, subtab_repl, html)

    # Localize 6-digit code label
    code_lbl_pattern = r'(<label for="magicCodeInput">)[^<]*(</label>)'
    html = re.sub(code_lbl_pattern, rf'\g<1>{cfg["code_label"]}\g<2>', html)

    # Localize code sent description
    code_desc_pattern = r'(<div id="magicCodeSection"[^>]*>[\s\S]*?<div class="field-error" data-error="magicCode"></div>\s*</div>\s*<p[^>]*>)([\s\S]*?)(</p>)'
    html = re.sub(code_desc_pattern, rf'\g<1>\n                {cfg["code_msg"]}\n              \g<3>', html)

    # Localize verify button
    verify_btn_pattern = r'(<button type="button" id="btnVerifyCode"[^>]*>\s*<span>)[^<]*(</span>)'
    html = re.sub(verify_btn_pattern, rf'\g<1>{cfg["verify_btn"]}\g<2>', html)

    # Localize send magic link button
    send_btn_pattern = r'(<button type="button" id="btnSendMagicLink"[^>]*>\s*<span>)[^<]*(</span>)'
    html = re.sub(send_btn_pattern, rf'\g<1>{cfg["send_magic_btn"]}\g<2>', html)

    # Localize auth-mvp-note
    note_pattern = r'(<p class="auth-mvp-note">[\s\S]*?<svg[^>]*>[\s\S]*?</svg>\s*)([\s\S]*?)(</p>)'
    html = re.sub(note_pattern, rf'\g<1>{cfg["note"]}\n        \g<3>', html)

    with open(loc_file, 'w', encoding='utf-8') as f:
        f.write(html)
    print(f"Synchronized {loc}/auth.html with Turnstile & Magic Link!")

print("All language auth.html pages synchronized successfully.")
