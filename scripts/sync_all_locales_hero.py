import os, re

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

LOCALES_CONFIG = {
    'en': {
        'files': ['en/index.html'],
        'css_rel': '../assets/site.css?v=20261004c',
        'badge': '🔒 Local Encryption · Direct Mic Zero Cloud Leak',
        'eyebrow': 'Acoustic Reference Standards · Civilian Evidence Dossier',
        'headline': 'Free Online Noise Evidence Recorder | <em>No App Required</em><br><span class="hero-subhead">Accurate Decibel Monitoring &amp; Tamper-Proof Evidence</span>',
        'lead': 'Whether dealing with upstairs stomping, sudden renovation noise, or commercial street disturbances, verbal complaints often hit a wall without proof. SOUNDTEST.PRO starts in one click right in your browser to record decibels, audio, and watermarked photos with GPS and timestamps. Supporting overnight sentry logging, all data stays securely on your device ready to export formal evidence reports.',
        'btn_primary': ('../soundtest.html', 'Start Monitoring'),
        'btn_secondary': ('samples.html', 'View report samples'),
        'btn_ghost': ('standards.html', 'Noise Reference Limits'),
        'tag_1': '24/7 Ready · Instant Wake',
        'tag_2': 'Direct Mic · Zero Cloud Leak',
        'tag_3': 'Night Sentry Mode',
        'stamp': 'Acoustic Standards · Evidence-Grade Security'
    },
    'root': {
        'files': ['index.html'],
        'css_rel': 'assets/site.css?v=20261004c',
        'badge': '🔒 Local Encryption · Direct Mic Zero Cloud Leak',
        'eyebrow': 'Acoustic Reference Standards · Civilian Evidence Dossier',
        'headline': 'Free Online Noise Evidence Recorder | <em>No App Required</em><br><span class="hero-subhead">Accurate Decibel Monitoring &amp; Tamper-Proof Evidence</span>',
        'lead': 'Whether dealing with upstairs stomping, sudden renovation noise, or commercial street disturbances, verbal complaints often hit a wall without proof. SOUNDTEST.PRO starts in one click right in your browser to record decibels, audio, and watermarked photos with GPS and timestamps. Supporting overnight sentry logging, all data stays securely on your device ready to export formal evidence reports.',
        'btn_primary': ('soundtest.html', 'Start Monitoring'),
        'btn_secondary': ('samples.html', 'View report samples'),
        'btn_ghost': ('standards.html', 'Noise Reference Limits'),
        'tag_1': '24/7 Ready · Instant Wake',
        'tag_2': 'Direct Mic · Zero Cloud Leak',
        'tag_3': 'Night Sentry Mode',
        'stamp': 'Acoustic Standards · Evidence-Grade Security'
    },
    'de': {
        'files': ['de/index.html'],
        'css_rel': '../assets/site.css?v=20261004c',
        'badge': '🔒 Lokale Verschlüsselung · Keine Cloud-Übertragung',
        'eyebrow': 'Akustische Normen · Beweissichere Dokumentation',
        'headline': 'Kostenloser Lärmaufzeichner für Beweise | <em>Keine App nötig</em><br><span class="hero-subhead">Präzise Dezibelmessung &amp; manipulationssichere Beweise</span>',
        'lead': 'Ob Trittschall von oben, plötzlicher Baulärm oder laute Bässe: Reine mündliche Aussagen reichen bei Ruhestörungen selten aus. SOUNDTEST.PRO startet direkt im Browser zur lückenlosen Dezibelmessung, Fotodokumentation mit GPS-Zeitstempel und Nacht-Wächter-Überwachung — alle Daten bleiben verschlüsselt auf Ihrem Gerät für offizielle Beschwerdeprotokolle.',
        'btn_primary': ('../soundtest.html', 'Überwachung starten'),
        'btn_secondary': ('samples.html', 'Berichtsbeispiele ansehen'),
        'btn_ghost': ('standards.html', 'Lärmrichtwerte prüfen'),
        'tag_1': '24/7 Einsatzbereit · Sofort aktiv',
        'tag_2': 'Direktmikrofon · Keine Cloud-Übertragung',
        'tag_3': 'Nacht-Wächter-Modus',
        'stamp': 'Akustische Normen · Beweiskräftige Sicherheit'
    },
    'es': {
        'files': ['es/index.html'],
        'css_rel': '../assets/site.css?v=20261004c',
        'badge': '🔒 Cifrado Local · Cero Fugas a la Nube',
        'eyebrow': 'Normas Acústicas · Estándar de Evidencia Vecinal',
        'headline': 'Grabador de Evidencia de Ruido Online Gratuito | <em>Sin Instalar App</em><br><span class="hero-subhead">Medición precisa de decibelios y pruebas inalterables</span>',
        'lead': 'Ya sean pisadas en el techo, obras repentinas o música de locales, las quejas verbales rara vez prosperan sin pruebas. SOUNDTEST.PRO funciona directo en su navegador con medición en tiempo real, fotos con marca de agua GPS, centinela nocturno y registros cifrados en su propio dispositivo para reclamos formales.',
        'btn_primary': ('../soundtest.html', 'Iniciar Monitoreo'),
        'btn_secondary': ('samples.html', 'Ver ejemplos de informes'),
        'btn_ghost': ('standards.html', 'Límites de Ruido'),
        'tag_1': '24/7 Listo · Activación Inmediata',
        'tag_2': 'Micrófono Directo · Cero Fugas Cloud',
        'tag_3': 'Modo Centinela Nocturno',
        'stamp': 'Normas Acústicas · Seguridad Probatoria'
    },
    'fr': {
        'files': ['fr/index.html'],
        'css_rel': '../assets/site.css?v=20261004c',
        'badge': '🔒 Chiffrement Local · Zéro Fuite Cloud',
        'eyebrow': 'Normes Acoustiques · Cadre de Preuve Civile',
        'headline': 'Enregistreur de Bruit Preuve Gratuit <em>Sans Application</em><br><span class="hero-subhead">Mesure précise des décibels et preuves infalsifiables</span>',
        'lead': 'Qu\'il s\'agisse de bruits de pas au plafond, de travaux nocturnes ou de nuisances de quartier, les réclamations orales manquent souvent de poids. SOUNDTEST.PRO fonctionne instantanément dans votre navigateur avec sonomètre en temps réel, horodatage GPS, photos filigranées et sentinelle nocturne pour constituer des dossiers de plainte irréfutables.',
        'btn_primary': ('../soundtest.html', 'Lancer la mesure'),
        'btn_secondary': ('samples.html', 'Exemples de rapports'),
        'btn_ghost': ('standards.html', 'Normes de Bruit'),
        'tag_1': '24/7 Prêt · Réveil en 1 Clic',
        'tag_2': 'Micro Direct · Zéro Fuite Cloud',
        'tag_3': 'Mode Sentinelle Nocturne',
        'stamp': 'Normes Acoustiques · Sécurité Probatoire'
    },
    'ja': {
        'files': ['ja/index.html'],
        'css_rel': '../assets/site.css?v=20261004c',
        'badge': '🔒 完全ローカル暗号化 · クラウド漏洩ゼロ',
        'eyebrow': '環境基準適合 · 民間騒音トラブル証拠保全仕様',
        'headline': '無料オンライン騒音証拠記録ツール｜<em>アプリ不要</em><br><span class="hero-subhead">高精度デシベル測定・改ざん不可能な客観証拠</span>',
        'lead': '上階の足音や衝撃音、突発的な工事騒音、飲食店トラブルなど、口頭での苦情は証拠がなければ解決しません。SOUNDTEST.PROはアプリ不要でブラウザから即座に起動し、リアルタイム測定、位置・時刻印字カメラ、夜間自動監視でデータを端末内に暗号化保存。管理会社や警察への提出に耐えうる正式な報告書を作成できます。',
        'btn_primary': ('../soundtest.html', '測定開始'),
        'btn_secondary': ('samples.html', '証拠レポート例を見る'),
        'btn_ghost': ('standards.html', '基準値を確認する'),
        'tag_1': '常時待機 · ワンタップ起動',
        'tag_2': 'マイク直結 · クラウド漏洩ゼロ',
        'tag_3': '夜間監視モード',
        'stamp': '音響基準適合 · 証拠級耐改ざん保護'
    },
    'ko': {
        'files': ['ko/index.html'],
        'css_rel': '../assets/site.css?v=20261004c',
        'badge': '🔒 로컬 암호화 · 마이크 직결 클라우드 유출 제로',
        'eyebrow': '소음 기준 규격 부합 · 민원 분쟁 입증 표준',
        'headline': '무료 온라인 소음 증거 녹음 도구 | <em>앱 설치 불필요</em><br><span class="hero-subhead">정밀 데시벨 측정 &amp; 위변조 방지 객관 증거 확보</span>',
        'lead': '층간소음 발망치, 야간 공사, 상가 저음 소음 등은 객관적 증거 없이는 해결하기 어렵습니다. SOUNDTEST.PRO는 앱 설치 없이 브라우저에서 즉시 작동하여 실시간 데시벨 측정, GPS 위치 및 타임스탬프 각인, 야간 소음 센트리 모드를 지원하며, 관리실 및 민원 제출용 공식 증거 보고서를 생성합니다.',
        'btn_primary': ('../soundtest.html', '측정 시작'),
        'btn_secondary': ('samples.html', '보고서 샘플 보기'),
        'btn_ghost': ('standards.html', '소음 기준 확인'),
        'tag_1': '24/7 대기 · 원클릭 활성화',
        'tag_2': '마이크 직결 · 클라우드 유출 제로',
        'tag_3': '야간 센트리 모드',
        'stamp': '음향 표준 규격 · 증거급 위변조 방지'
    },
    'vi': {
        'files': ['vi/index.html'],
        'css_rel': '../assets/site.css?v=20261004c',
        'badge': '🔒 Mã hóa cục bộ · Micro trực tiếp không rò rỉ cloud',
        'eyebrow': 'Quy chuẩn âm học · Tiêu chuẩn bằng chứng khiếu nại',
        'headline': 'Công cụ ghi nhận tiếng ồn trực tuyến miễn phí | <em>Không cần cài app</em><br><span class="hero-subhead">Đo decibel chính xác &amp; bảo toàn bằng chứng chống giả mạo</span>',
        'lead': 'Dù là tiếng bước chân trên lầu, công trình đêm hay tiếng ồn quán xá, khiếu nại bằng miệng khó có hiệu lực nếu thiếu bằng chứng. SOUNDTEST.PRO chạy trực tiếp trên trình duyệt, đo decibel thời gian thực, đóng dấu GPS và hỗ trợ lính gác ban đêm để xuất báo cáo đối chiếu đầy đủ.',
        'btn_primary': ('../soundtest.html', 'Bắt đầu đo'),
        'btn_secondary': ('samples.html', 'Xem báo cáo mẫu'),
        'btn_ghost': ('standards.html', 'Tra cứu quy chuẩn'),
        'tag_1': 'Sẵn sàng 24/7 · Khởi động tức thì',
        'tag_2': 'Micro trực tiếp · Không rò rỉ cloud',
        'tag_3': 'Chế độ lính gác ban đêm',
        'stamp': 'Tiêu chuẩn âm học · Bảo mật cấp bằng chứng'
    },
    'th': {
        'files': ['th/index.html'],
        'css_rel': '../assets/site.css?v=20261004c',
        'badge': '🔒 เข้ารหัสในเครื่อง · ไมโครโฟนโดยตรงข้อมูลไม่รั่วไหล',
        'eyebrow': 'เกณฑ์อ้างอิงเสียงรบกวน · มาตรฐานหลักฐานเพื่อการร้องเรียน',
        'headline': 'เครื่องมือบันทึกหลักฐานเสียงรบกวนออนไลน์ฟรี | <em>ไม่ต้องติดตั้งแอป</em><br><span class="hero-subhead">วัดเดซิเบลแม่นยำ พร้อมหลักฐานป้องกันการแก้ไข</span>',
        'lead': 'ไม่ว่าจะเป็นเสียงเดินชั้นบน การก่อสร้างกลางดึก หรือเสียงดนตรีจากร้านค้า การร้องเรียนด้วยวาจามักไร้ผลหากขาดหลักฐาน SOUNDTEST.PRO ใช้งานได้ทันทีบนเบราว์เซอร์ วัดเดซิเบลเรียลไทม์ ประทับพิกัด GPS และมีโหมดเฝ้าระวังกลางคืนเพื่อสร้างรายงานหลักฐานที่น่าเชื่อถือ',
        'btn_primary': ('../soundtest.html', 'เริ่มการวัดระดับเสียง'),
        'btn_secondary': ('samples.html', 'ดูตัวอย่างรายงาน'),
        'btn_ghost': ('standards.html', 'ตรวจสอบมาตรฐานเสียง'),
        'tag_1': 'พร้อม 24/7 · เริ่มทำงานทันที',
        'tag_2': 'ไมโครโฟนโดยตรง · ข้อมูลไม่รั่วไหล',
        'tag_3': 'โหมดเฝ้าระวังกลางคืน',
        'stamp': 'มาตรฐานเสียง · ความปลอดภัยระดับหลักฐาน'
    }
}

def sync_hero_for_locale(loc, cfg):
    for rel_file in cfg['files']:
        file_path = os.path.join(ROOT, rel_file)
        if not os.path.exists(file_path):
            continue
        with open(file_path, 'r', encoding='utf-8') as f:
            html = f.read()

        # 1. Update css link
        html = re.sub(r'<link rel="stylesheet" href="([^"]*assets/site\.css)[^"]*"',
                      f'<link rel="stylesheet" href="{cfg["css_rel"]}"', html)

        # 2. Build hero-split-text
        new_hero_text = f"""        <div class="hero-split-text reveal">
          <div class="hero-eyebrow-cluster">
            <span class="privacy-badge">{cfg['badge']}</span>
            <span class="eyebrow">{cfg['eyebrow']}</span>
          </div>
          <h1 class="hero-headline">{cfg['headline']}</h1>
          <p class="hero-lead">{cfg['lead']}</p>

          <div class="hero-actions">
            <a class="button primary" href="{cfg['btn_primary'][0]}">{cfg['btn_primary'][1]}</a>
            <a class="button" href="{cfg['btn_secondary'][0]}">{cfg['btn_secondary'][1]}</a>
            <a class="button ghost" href="{cfg['btn_ghost'][0]}">{cfg['btn_ghost'][1]}</a>
          </div>
        </div>"""

        # Replace existing hero-split-text block
        hero_pattern = r'(<div class="hero-split-text reveal">[\s\S]*?</div>\s*</div>)'
        m = re.search(hero_pattern, html)
        if m:
            html = html[:m.start()] + new_hero_text + html[m.end():]

        # 3. Build echo-stage
        new_echo_stage = f"""        <aside class="echo-stage reveal" aria-label="Echo mascot showing the recorder in standby">
          <div class="echo-stage-tags">
            <span class="echo-stage-tag"><span class="dot" aria-hidden="true"></span>{cfg['tag_1']}</span>
            <span class="echo-stage-tag"><span class="dot violet" aria-hidden="true"></span>{cfg['tag_2']}</span>
            <span class="echo-stage-tag"><span class="dot rose" aria-hidden="true"></span>{cfg['tag_3']}</span>
          </div>
          <div class="echo-waveform-rings" aria-hidden="true">
            <span></span><span></span><span></span><span></span>
          </div>
          <div class="echo-mascot" role="img" aria-label="Echo, the SOUNDTEST.PRO crystal owl mascot, standing on a glass platter with an idle equalizer chest"></div>
          <div class="echo-hud" aria-hidden="true">
            <span class="echo-hud-dot"></span>
            <span class="echo-hud-value">32.4 dB</span>
            <span class="echo-hud-label">Standby</span>
          </div>
          <div class="echo-evidence-stamp" aria-hidden="true">
            <span class="stamp-icon"></span>
            <span>{cfg['stamp']}</span>
          </div>
        </aside>"""

        stage_pattern = r'(<aside class="echo-stage reveal"[^>]*>[\s\S]*?</aside>)'
        m_stage = re.search(stage_pattern, html)
        if m_stage:
            html = html[:m_stage.start()] + new_echo_stage + html[m_stage.end():]

        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(html)
        print(f"[{rel_file}] Updated hero-split-text, echo-stage, and CSS cachebuster!")

for loc, cfg in LOCALES_CONFIG.items():
    sync_hero_for_locale(loc, cfg)

print("All locales synchronized successfully!")
