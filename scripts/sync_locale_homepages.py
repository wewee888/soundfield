import os, re

locale_configs = {
    'en': {
        'popular_badge': '★ Best Value · Save 58%',
        'compare_hint': 'Cheaper &amp; faster than buying a $60+ hardware decibel meter',
        'search_btn': 'Start Assessment',
        'stamp_text': 'Forensic Audio · Verified',
        'disclaimer_title': 'Compliance &amp; Evidence Protocol:',
        'disclaimer_body': ' SOUNDTEST.PRO provides an objective, tamper-evident digital record of onsite acoustic events, timestamps, and frequency metrics for dispute documentation, property mediation, and preliminary complaint filings. Formal statutory metrology penalties remain subject to local municipal standards and certified testing procedures. All audio and sensor data are securely processed locally on your device with complete privacy.',
        'privacy_title': 'Privacy &amp; Data Integrity:',
        'privacy_body': ' This zero-knowledge web application never transmits your microphone streams, audio recordings, or location metadata to any external server. All forensic evidence files and reports remain strictly stored in your local browser unless you choose to export them.'
    },
    'zh': {
        'popular_badge': '★ 最受欢迎 · 劲省 58%',
        'compare_hint': '比购买 300+ 元硬件分贝仪更便宜、更快速',
        'search_btn': '开始声学评估',
        'stamp_text': '声学存证标准 · 防篡改',
        'disclaimer_title': '合规与事实存证声明：',
        'disclaimer_body': ' SOUNDTEST.PRO 提供客观、防篡改的现场声学第一手事实数字化存证，精准记录分贝变化、频率特征、时间戳与地理位置链条，专用于物业协调、民间调解、租房争议与行政投诉的事实底稿呈递。涉及法定强制计量行政处罚的案件，以当地法定计量检定机构数据为准。全部音频与传感数据均在本地运行处理。',
        'privacy_title': '隐私保护与数据完整性：',
        'privacy_body': ' 本系统采用纯本地（Zero-Knowledge）计算架构，绝不向任何外部云端服务器上传、留存或转录您的麦克风音频、地理位置与现场录像。所有取证报告与原始数据均完好加密保存在您的本地浏览器中，由您完全自主掌控导出。'
    },
    'de': {
        'popular_badge': '★ Beliebteste Wahl · 58% sparen',
        'compare_hint': 'Günstiger &amp; schneller als der Kauf eines 60€+ Dezibelmessgeräts',
        'search_btn': 'Messung starten',
        'stamp_text': 'Akustische Beweise · Geprüft',
        'disclaimer_title': 'Konformitäts- und Beweisprotokoll:',
        'disclaimer_body': ' SOUNDTEST.PRO liefert eine objektive, manipulationssichere digitale Dokumentation akustischer Vorfälle vor Ort – inklusive Frequenzanalyse, Zeitstempel und Geokoordinaten als fundierte Faktengrundlage für Schlichtungsverfahren, Vermieterdialoge und Nachbarschaftsbeschwerden. Amtliche Bußgeldverfahren unterliegen den jeweiligen kommunalen Messvorschriften. Sämtliche Audio- und Sensordaten werden lokal auf Ihrem Endgerät verarbeitet.',
        'privacy_title': 'Datenschutz &amp; Datenintegrität:',
        'privacy_body': ' Dieses statische Web-Tool überträgt niemals Mikrofonsignale, Audioaufnahmen oder Standortdaten an externe Server. Ihre Dokumentationsdaten verbleiben vollständig in Ihrem lokalen Browser und unterliegen Ihrer alleinigen Kontrolle.'
    },
    'es': {
        'popular_badge': '★ Más Popular · Ahorra 58%',
        'compare_hint': 'Más económico y rápido que comprar un sonómetro de 60€+',
        'search_btn': 'Iniciar Evaluación',
        'stamp_text': 'Evidencia Acústica · Verificada',
        'disclaimer_title': 'Protocolo de cumplimiento y evidencia:',
        'disclaimer_body': ' SOUNDTEST.PRO proporciona un registro digital objetivo e inalterable de eventos acústicos, marcas de tiempo y geolocalización, diseñado como base probatoria para mediaciones vecinales, disputas de arrendamiento y presentación de quejas formales. Los procesos sancionadores oficiales se rigen por la normativa metrológica municipal local. Todos los datos de audio y sensores se procesan localmente en su dispositivo.',
        'privacy_title': 'Privacidad e integridad de datos:',
        'privacy_body': ' Esta aplicación web no recopila, almacena ni transmite grabaciones de voz, audio o ubicación a ningún servidor externo. Todas las evidencias se procesan y conservan estrictamente en el almacenamiento local de su navegador.'
    },
    'fr': {
        'popular_badge': '★ Le plus populaire · Économisez 58%',
        'compare_hint': 'Plus économique et rapide que l\'achat d\'un sonomètre à 60€+',
        'search_btn': 'Démarrer l\'évaluation',
        'stamp_text': 'Preuve Acoustique · Vérifiée',
        'disclaimer_title': 'Protocole de conformité et de preuve :',
        'disclaimer_body': ' SOUNDTEST.PRO offre un enregistrement numérique objectif et infalsifiable des événements acoustiques, combinant horodatage certifié, coordonnées GPS et spectre sonore pour servir de dossier factuel auprès des syndics, propriétaires et médiations de voisinage. Les procédures de sanction officielle relèvent des normes métrologiques municipales locales. Toutes les données audio sont traitées localement sur votre appareil.',
        'privacy_title': 'Protection de la vie privée et intégrité :',
        'privacy_body': ' Cet outil web statique ne transmet aucun flux de microphone, enregistrement sonore ou géolocalisation vers des serveurs externes. L\'ensemble des pièces et rapports reste stocké localement dans votre navigateur jusqu\'à votre décision d\'export.'
    },
    'ja': {
        'popular_badge': '★ 一番人気 · 58% お得',
        'compare_hint': '1万円以上の騒音計を購入するより手軽で低コスト',
        'search_btn': '測定を開始する',
        'stamp_text': '音響証拠基準 · 改ざん防止',
        'disclaimer_title': '適合性および証拠プロトコル：',
        'disclaimer_body': ' SOUNDTEST.PROは、時間・周波数・位置情報の改ざん防止チェーンを保持し、客観的な現場音響事実をデジタル記録する証拠作成支援ツールです。管理会社への提出、住民間調解、初期事実関係の証明資料として最適化されています。法的拘束力を伴う公的計量は自治体の指定基準に準拠します。音声およびセンサーデータはすべて端末内で安全にローカル処理されます。',
        'privacy_title': 'プライバシー保護とデータ完全性：',
        'privacy_body': ' 本ウェブツールは、マイク音声や録音ファイル、位置情報を外部サーバーに一切送信・保存しません。すべての証拠データはお使いの端末のブラウザ内にのみ安全に保持され、外部への提供はユーザー本人のエクスポート操作に限定されます。'
    },
    'ko': {
        'popular_badge': '★ 가장 인기 있는 플랜 · 58% 할인',
        'compare_hint': '10만원 상당의 소음측정기를 구매하는 것보다 훨씬 저렴하고 빠릅니다',
        'search_btn': '측정 시작하기',
        'stamp_text': '음향 증거 표준 · 위변조 방지',
        'disclaimer_title': '규정 준수 및 증거 프로토콜:',
        'disclaimer_body': ' SOUNDTEST.PRO는 분쟁 조정, 관리사무소 민원 제기, 임대차 갈등 해결을 위한 객관적이고 위변조 방지된 현장 음향 사건의 디지털 사실 기록을 생성합니다. 타임스탬프, 주파수 분포, 위치 정보가 포함되어 체계적인 소명 자료로 활용할 수 있습니다. 행정 처분을 위한 법정 계량은 관할 지자체 기준을 따릅니다. 모든 오디오 및 센서 데이터는 기기 내부에서 로컬로 안전하게 처리됩니다.',
        'privacy_title': '개인정보 보호 및 데이터 무결성:',
        'privacy_body': ' 본 웹 도구는 마이크 입력, 음성 녹음 또는 위치 정보를 외부 서버로 일절 전송하거나 저장하지 않습니다. 모든 증거 보고서와 기록은 브라우저 로컬 저장소에 안전하게 유지되며, 사용자가 직접 내보낼 때만 공유됩니다.'
    },
    'vi': {
        'popular_badge': '★ Phổ biến nhất · Tiết kiệm 58%',
        'compare_hint': 'Tiết kiệm và nhanh hơn nhiều so với mua máy đo decibel phần cứng',
        'search_btn': 'Bắt đầu đánh giá',
        'stamp_text': 'Bằng chứng âm thanh · Đã xác minh',
        'disclaimer_title': 'Quy chuẩn tuân thủ và chứng cứ:',
        'disclaimer_body': ' SOUNDTEST.PRO cung cấp bản ghi kỹ thuật số khách quan, chống giả mạo về các sự kiện âm thanh hiện trường bao gồm mức decibel, biểu đồ tần số, mốc thời gian và vị trí phục vụ hòa giải chung cư, tranh chấp hợp đồng và nộp đơn phản ánh. Việc xử phạt hành chính chính thức tuân theo quy chuẩn đo lường của cơ quan địa phương. Mọi dữ liệu âm thanh được xử lý cục bộ an toàn trên thiết bị của bạn.',
        'privacy_title': 'Bảo vệ quyền riêng tư &amp; toàn vẹn dữ liệu:',
        'privacy_body': ' Ứng dụng web hoàn toàn không thu thập, gửi hoặc lưu trữ âm thanh micrô, tệp ghi âm hoặc tọa độ vị trí lên bất kỳ máy chủ nào. Mọi hồ sơ chứng cứ đều được lưu giữ bảo mật trên trình duyệt cục bộ của bạn.'
    },
    'th': {
        'popular_badge': '★ ได้รับความนิยมสูงสุด · ประหยัด 58%',
        'compare_hint': 'ประหยัดและรวดเร็วกว่าการซื้อเครื่องวัดระดับเสียงทั่วไป',
        'search_btn': 'เริ่มต้นการตรวจวัด',
        'stamp_text': 'มาตรฐานหลักฐานเสียง · ตรวจสอบแล้ว',
        'disclaimer_title': 'เกณฑ์การปฏิบัติตามมาตรฐานและหลักฐาน:',
        'disclaimer_body': ' SOUNDTEST.PRO ให้การบันทึกดิจิทัลที่น่าเชื่อถือ ป้องกันการปลอมแปลง สำหรับเหตุการณ์เสียงรบกวนในสถานที่จริง พร้อมข้อมูลเวลา พิกัดสถานที่ และความถี่เสียง เพื่อใช้เป็นหลักฐานประกอบการเจรจานิติบุคคล ไกล่เกลี่ยข้อพิพาท และยื่นเรื่องร้องเรียนเบื้องต้น การดำเนินคดีตามกฎหมายอย่างเป็นทางการขึ้นอยู่กับการตรวจวัดตามระเบียบท้องถิ่น ข้อมูลเสียงและเซ็นเซอร์ทั้งหมดได้รับการประมวลผลในเครื่องของคุณอย่างปลอดภัย',
        'privacy_title': 'การคุ้มครองความเป็นส่วนตัวและความสมบูรณ์ของข้อมูล:',
        'privacy_body': ' เครื่องมือบนเว็บนี้ไม่มีการส่ง รวบรวม หรือจัดเก็บข้อมูลเสียงจากไมโครโฟน ไฟล์บันทึก หรือพิกัดตำแหน่งของคุณไปยังเซิร์ฟเวอร์ภายนอกใดๆ ข้อมูลหลักฐานทั้งหมดจะถูกจัดเก็บไว้ในเบราว์เซอร์ในอุปกรณ์ของคุณเท่านั้นจนกว่าคุณจะเลือกส่งออกด้วยตนเอง'
    }
}

targets = [(loc, cfg, os.path.join(loc, 'index.html')) for loc, cfg in locale_configs.items()]
targets.append(('root', locale_configs['en'], 'index.html'))

for loc, cfg, file_path in targets:
    if not os.path.exists(file_path):
        print(f"Skipping {loc}, file not found")
        continue

    with open(file_path, 'r', encoding='utf-8') as f:
        html = f.read()

    # 1. Update echo-stage (add waveform rings and evidence stamp if not present)
    if 'echo-waveform-rings' not in html:
        # replace <aside class="echo-stage reveal" ...> ... </aside>
        stage_pattern = r'(<aside class="echo-stage reveal"[^>]*>[\s\S]*?<div class="echo-mascot"[^>]*></div>[\s\S]*?<div class="echo-hud"[\s\S]*?</div>)(\s*</aside>)'
        m = re.search(stage_pattern, html)
        if m:
            middle = m.group(1)
            # Add rings before mascot if not there
            if 'echo-waveform-rings' not in middle:
                middle = re.sub(
                    r'(<div class="echo-stage-tags">[\s\S]*?</div>)',
                    r'\1\n          <div class="echo-waveform-rings" aria-hidden="true">\n            <span></span><span></span><span></span>\n          </div>',
                    middle
                )
            # Add stamp after echo-hud
            stamp_html = f'\n          <div class="echo-evidence-stamp" aria-hidden="true">\n            <span class="stamp-icon"></span>\n            <span>{cfg["stamp_text"]}</span>\n          </div>'
            new_stage = middle + stamp_html + m.group(2)
            html = html[:m.start()] + new_stage + html[m.end():]
            print(f"[{loc}] Added echo rings & stamp")

    # 2. Update price-card pro (add popular badge and compare hint)
    if 'price-badge-popular' not in html:
        # Match <div class="price-card pro reveal">
        pro_card_pattern = r'(<div class="price-card pro reveal">\s*)(<span class="price-pill">)'
        if re.search(pro_card_pattern, html):
            popular_badge_html = f'<span class="price-badge-popular">{cfg["popular_badge"]}</span>\n          '
            html = re.sub(pro_card_pattern, rf'\1{popular_badge_html}\2', html)
            print(f"[{loc}] Added price popular badge")

    if 'price-compare-hint' not in html:
        # Add compare hint after price-tag
        tag_pattern = r'(<span class="price-tag">[^<]+</span>\s*)(<ul class="check-list">)'
        if re.search(tag_pattern, html):
            hint_html = f'<div class="price-compare-hint">{cfg["compare_hint"]}</div>\n          '
            html = re.sub(tag_pattern, rf'\1{hint_html}\2', html)
            print(f"[{loc}] Added price compare hint")

    # 3. Update hero search button copy
    if 'Run AI workflow' in html:
        html = re.sub(
            r'<button class="hero-search-btn" type="submit">\s*<span>Run AI workflow</span>',
            f'<button class="hero-search-btn" type="submit">\n                <span>{cfg["search_btn"]}</span>',
            html
        )
        print(f"[{loc}] Updated search button text")

    # 4. Update disclaimers in <section class="section grid two">
    notice_pattern = r'(<section class="section grid two">\s*<div class="notice reveal">\s*<strong>)[^<]*(</strong>)[^<]*(</div>\s*<div class="notice reveal"[^>]*>\s*<strong>)[^<]*(</strong>)[^<]*(</div>\s*</section>)'
    if re.search(notice_pattern, html):
        new_notices = (
            rf'\g<1>{cfg["disclaimer_title"]}\g<2>{cfg["disclaimer_body"]}'
            rf'\g<3>{cfg["privacy_title"]}\g<4>{cfg["privacy_body"]}\g<5>'
        )
        html = re.sub(notice_pattern, new_notices, html)
        print(f"[{loc}] Updated legal & privacy notices")

    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(html)

print("Sync completed successfully.")
