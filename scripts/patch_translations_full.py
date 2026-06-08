"""
patch_translations_full.py
==========================
One-shot patcher that fills in the missing homepage copy for the 7 non-zh
locales (es, fr, de, ja, ko, vi, th) in scripts/sync-locale-homepages.py.

The 46 English keys are the same set produced by scripts/check_missing.py.
Chinese (zh) is the source of truth for meaning; the translations below
mirror the same intent in each target language while keeping the brand
voice (calm, professional, evidence-oriented) consistent with the existing
7 strings already in each locale.

Re-runnable: pairs whose en key is already present in a locale are skipped.
"""
from __future__ import annotations

import ast
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
TARGET = ROOT / "scripts" / "sync-locale-homepages.py"

# ---------------------------------------------------------------------------
# Translations: en -> {es, fr, de, ja, ko, vi, th}
# ---------------------------------------------------------------------------
# Order is the canonical reading order from scripts/missing_46_zh.tsv.
TRANSLATIONS: dict[str, dict[str, str]] = {
    'Measure Decibels, Record Sound, Save Time &amp; Location for Legal Complaint Documentation. Neighbor noise, construction, bar &amp; street disturbance, rental dispute — start recording in one click, right in your browser.': {
        "es": 'Mide decibelios, graba sonido y guarda hora y ubicación para la documentación de quejas legales. Ruido de vecinos, obras, bares y calle, disputas de alquiler — empieza a grabar con un clic, directamente en tu navegador.',
        "fr": "Mesurez les décibels, enregistrez le son, sauvegardez l'heure et le lieu pour la documentation de plainte légale. Bruit de voisinage, construction, bars et rue, litige locatif — commencez à enregistrer en un clic, directement dans votre navigateur.",
        "de": 'Dezibel messen, Ton aufnehmen, Zeit und Ort für die Dokumentation rechtlicher Beschwerden speichern. Nachbarschaftslärm, Bauarbeiten, Bars und Straße, Mietstreitigkeiten — starten Sie die Aufnahme mit einem Klick, direkt in Ihrem Browser.',
        "ja": 'デシベルを測定し、音を録音し、時間と場所を保存して法的苦情の証拠に。隣人騒音、工事、バーや街の騒音、賃貸トラブル — ブラウザでワンクリック録音開始。',
        "ko": '데시벨 측정, 소리 녹음, 시간과 위치 저장으로 법적 민원 자료 정리. 이웃 소음, 공사, 술집 및 거리 소음, 임대 분쟁 — 브라우저에서 원클릭으로 녹음 시작.',
        "vi": 'Đo decibel, ghi âm, lưu thời gian và vị trí phục vụ hồ sơ khiếu nại pháp lý. Tiếng ồn hàng xóm, thi công, quán bar và đường phố, tranh chấp thuê nhà — bắt đầu ghi chỉ với một cú nhấp, ngay trong trình duyệt.',
        "th": 'วัดเดซิเบล บันทึกเสียง บันทึกเวลาและตำแหน่งเพื่อเป็นหลักฐานในการร้องเรียนทางกฎหมาย เสียงรบกวนจากเพื่อนบ้าน การก่อสร้าง บาร์และถนน ข้อพิพาทการเช่า — เริ่มบันทึกได้ในคลิกเดียว บนเบราว์เซอร์ของคุณ',
        "zh": '测量分贝、记录声音、保存时间与位置，用于噪音投诉资料整理。邻里噪音、装修施工、商铺街道噪音、租房纠纷 — 浏览器一键开始记录。',
    },
    'Data processed locally · No upload': {
        "es": 'Datos procesados localmente · Sin subida',
        "fr": 'Traitement local · Aucun envoi',
        "de": 'Lokale Verarbeitung · Kein Upload',
        "ja": 'ローカル処理 · アップロードなし',
        "ko": '로컬 처리 · 업로드 없음',
        "vi": 'Xử lý tại máy · Không tải lên',
        "th": 'ประมวลผลในเครื่อง · ไม่อัปโหลด',
        "zh": '本地处理 · 不上传',
    },
    'No install · Multilingual · Local-first': {
        "es": 'Sin instalación · Multilingüe · Local primero',
        "fr": "Sans installation · Multilingue · Local d'abord",
        "de": 'Keine Installation · Mehrsprachig · Lokal zuerst',
        "ja": 'インストール不要 · 多言語 · ローカル優先',
        "ko": '설치 불필요 · 다국어 · 로컬 우선',
        "vi": 'Không cài đặt · Đa ngôn ngữ · Ưu tiên cục bộ',
        "th": 'ไม่ต้องติดตั้ง · หลายภาษา · ใช้เครื่องเป็นหลัก',
        "zh": '无需安装 · 多语言 · 本地优先',
    },
    'Run AI workflow': {
        "es": 'Ejecutar flujo de IA',
        "fr": 'Lancer le flux IA',
        "de": 'KI-Workflow starten',
        "ja": 'AIワークフローを実行',
        "ko": 'AI 워크플로 실행',
        "vi": 'Chạy quy trình AI',
        "th": 'เรียกใช้เวิร์กโฟลว์ AI',
        "zh": '运行工作流',
    },
    'Describe what you want to document — e.g. nightly bar noise on Elm Street': {
        "es": 'Describe lo que quieres documentar — p. ej., ruido nocturno de bar en la calle Elm',
        "fr": 'Décrivez ce que vous voulez documenter — p. ex. bruit nocturne de bar rue Elm',
        "de": 'Beschreiben Sie, was Sie dokumentieren möchten — z. B. nächtlicher Lärm aus der Bar in der Elm Street',
        "ja": '記録したい内容を記述してください — 例:エルム通りの夜のバー騒音',
        "ko": '문서화할 내용을 설명하세요 — 예: Elm Street의 야간 바 소음',
        "vi": 'Mô tả nội dung bạn muốn ghi nhận — ví dụ: tiếng ồn quán bar về đêm trên phố Elm',
        "th": 'อธิบายสิ่งที่คุณต้องการบันทึก — เช่น เสียงรบกวนจากบาร์ยามค่ำคืนบนถนน Elm',
        "zh": '描述要记录的场景，例如：夜间酒吧街噪',
    },
    'Neighbor noise': {
        "es": 'Ruido de vecinos',
        "fr": 'Bruit de voisinage',
        "de": 'Nachbarschaftslärm',
        "ja": '隣人騒音',
        "ko": '이웃 소음',
        "vi": 'Tiếng ồn hàng xóm',
        "th": 'เสียงรบกวนจากเพื่อนบ้าน',
        "zh": '邻里噪音',
    },
    'Construction': {
        "es": 'Obras',
        "fr": 'Construction',
        "de": 'Bauarbeiten',
        "ja": '工事',
        "ko": '공사',
        "vi": 'Thi công',
        "th": 'การก่อสร้าง',
        "zh": '施工噪音',
    },
    'Bar &amp; street': {
        "es": 'Bar y calle',
        "fr": 'Bar et rue',
        "de": 'Bar und Straße',
        "ja": 'バー・街頭',
        "ko": '술집 및 거리',
        "vi": 'Quán bar và đường phố',
        "th": 'บาร์และถนน',
        "zh": '酒吧街道',
    },
    'Rental dispute': {
        "es": 'Disputa de alquiler',
        "fr": 'Litige locatif',
        "de": 'Mietstreitigkeit',
        "ja": '賃貸トラブル',
        "ko": '임대 분쟁',
        "vi": 'Tranh chấp thuê nhà',
        "th": 'ข้อพิพาทการเช่า',
        "zh": '租房纠纷',
    },
    'One-click start': {
        "es": 'Inicio con un clic',
        "fr": 'Démarrage en un clic',
        "de": 'Ein-Klick-Start',
        "ja": 'ワンクリック開始',
        "ko": '원클릭 시작',
        "vi": 'Khởi động một cú nhấp',
        "th": 'เริ่มในคลิกเดียว',
        "zh": '一键开始',
    },
    '9 languages': {
        "es": '9 idiomas',
        "fr": '9 langues',
        "de": '9 Sprachen',
        "ja": '9言語',
        "ko": '9개 언어',
        "vi": '9 ngôn ngữ',
        "th": '9 ภาษา',
        "zh": '9 种语言',
    },
    'View report samples': {
        "es": 'Ver muestras de informes',
        "fr": 'Voir des exemples de rapports',
        "de": 'Berichtsbeispiele ansehen',
        "ja": 'レポートサンプルを見る',
        "ko": '보고서 샘플 보기',
        "vi": 'Xem mẫu báo cáo',
        "th": 'ดูตัวอย่างรายงาน',
        "zh": '查看报告样例',
    },
    'Read accuracy limits': {
        "es": 'Leer límites de precisión',
        "fr": 'Lire les limites de précision',
        "de": 'Genauigkeitsgrenzen lesen',
        "ja": '精度の限界を読む',
        "ko": '정확도 한계 확인',
        "vi": 'Đọc giới hạn độ chính xác',
        "th": 'อ่านข้อจำกัดด้านความแม่นยำ',
        "zh": '查看精度说明',
    },
    'Standby · click to wake': {
        "es": 'En espera · clic para activar',
        "fr": 'Veille · cliquer pour activer',
        "de": 'Standby · Klick zum Aufwecken',
        "ja": 'スタンバイ · クリックで起動',
        "ko": '대기 · 클릭하여 깨우기',
        "vi": 'Chờ · nhấp để đánh thức',
        "th": 'สแตนด์บาย · คลิกเพื่อปลุก',
        "zh": '待机 · 点击唤醒',
    },
    'Local microphone only': {
        "es": 'Solo micrófono local',
        "fr": 'Micro local uniquement',
        "de": 'Nur lokales Mikrofon',
        "ja": 'ローカルマイクのみ',
        "ko": '로컬 마이크만',
        "vi": 'Chỉ dùng mic cục bộ',
        "th": 'ใช้ไมโครโฟนของเครื่องเท่านั้น',
        "zh": '仅本地麦克风',
    },
    'Measure, record, stamp, and export — one calm workflow.': {
        "es": 'Medir, grabar, etiquetar y exportar — un flujo tranquilo.',
        "fr": 'Mesurer, enregistrer, horodater et exporter — un flux serein.',
        "de": 'Messen, aufnehmen, markieren und exportieren — ein ruhiger Workflow.',
        "ja": '測定・録音・タイムスタンプ・書き出し — 静かなワークフロー。',
        "ko": '측정, 녹음, 타임스탬프, 내보내기 — 차분한 한 번의 흐름.',
        "vi": 'Đo, ghi, đóng dấu, xuất — một quy trình gọn gàng.',
        "th": 'วัด บันทึก ประทับเวลา ส่งออก — ขั้นตอนเดียวที่ใจเย็น',
        "zh": '测量、记录、标记、导出 — 一条清晰流程。',
    },
    'Daytime Reference &amp; Nighttime Reference': {
        "es": 'Referencia diurna y nocturna',
        "fr": 'Références diurne et nocturne',
        "de": 'Tag- und Nachtreferenz',
        "ja": '昼間基準と夜間基準',
        "ko": '주간 기준 및 야간 기준',
        "vi": 'Tham chiếu ban ngày và ban đêm',
        "th": 'เกณฑ์กลางวันและกลางคืน',
        "zh": '昼间参考与夜间参考',
    },
    'Cool down, click once, document everything.': {
        "es": 'Respira, haz clic una vez, documenta todo.',
        "fr": 'Respirez, cliquez une fois, documentez tout.',
        "de": 'Durchatmen, einmal klicken, alles dokumentieren.',
        "ja": '落ち着いて、一度クリック、すべてを記録。',
        "ko": '차분히, 한 번 클릭, 전부 기록.',
        "vi": 'Bình tĩnh, nhấp một lần, ghi lại tất cả.',
        "th": 'ใจเย็น คลิกครั้งเดียว บันทึกทุกอย่าง',
        "zh": '冷静一次点击，完整记录现场。',
    },
    'Global noise reference': {
        "es": 'Referencia global de ruido',
        "fr": 'Référence mondiale du bruit',
        "de": 'Globale Lärmreferenz',
        "ja": 'グローバル騒音基準',
        "ko": '글로벌 소음 기준',
        "vi": 'Tham chiếu tiếng ồn toàn cầu',
        "th": 'เกณฑ์เสียงรบกวนระดับโลก',
        "zh": '噪声参考',
    },
    'Daytime Reference (6:00–22:00)': {
        "es": 'Referencia diurna (6:00–22:00)',
        "fr": 'Référence diurne (6h00–22h00)',
        "de": 'Tagreferenz (6:00–22:00)',
        "ja": '昼間基準 (6:00–22:00)',
        "ko": '주간 기준 (6:00–22:00)',
        "vi": 'Tham chiếu ban ngày (6:00–22:00)',
        "th": 'เกณฑ์กลางวัน (6:00–22:00)',
        "zh": '昼间参考（6:00-22:00）',
    },
    'Nighttime Reference (22:00–6:00)': {
        "es": 'Referencia nocturna (22:00–6:00)',
        "fr": 'Référence nocturne (22h00–6h00)',
        "de": 'Nachtreferenz (22:00–6:00)',
        "ja": '夜間基準 (22:00–6:00)',
        "ko": '야간 기준 (22:00–6:00)',
        "vi": 'Tham chiếu ban đêm (22:00–6:00)',
        "th": 'เกณฑ์กลางคืน (22:00–6:00)',
        "zh": '夜间参考（22:00-6:00）',
    },
    'Start with the web tool': {
        "es": 'Empieza con la herramienta web',
        "fr": "Commencez avec l'outil web",
        "de": 'Starten Sie mit dem Web-Tool',
        "ja": 'Webツールで始める',
        "ko": '웹 도구로 시작',
        "vi": 'Bắt đầu với công cụ web',
        "th": 'เริ่มต้นด้วยเครื่องมือเว็บ',
        "zh": '先用网页工具开始',
    },
    'Upgrade to Premium': {
        "es": 'Actualizar a Premium',
        "fr": 'Passer à Premium',
        "de": 'Auf Premium upgraden',
        "ja": 'プレミアムにアップグレード',
        "ko": '프리미엄으로 업그레이드',
        "vi": 'Nâng cấp lên Premium',
        "th": 'อัปเกรดเป็นพรีเมียม',
        "zh": '升级高级版',
    },
    'Open free tool': {
        "es": 'Abrir herramienta gratuita',
        "fr": "Ouvrir l'outil gratuit",
        "de": 'Kostenloses Tool öffnen',
        "ja": '無料ツールを開く',
        "ko": '무료 도구 열기',
        "vi": 'Mở công cụ miễn phí',
        "th": 'เปิดเครื่องมือฟรี',
        "zh": '打开免费工具',
    },
    'Create account &amp; checkout': {
        "es": 'Crear cuenta y pagar',
        "fr": 'Créer un compte et payer',
        "de": 'Konto erstellen und bezahlen',
        "ja": 'アカウント作成と購入',
        "ko": '계정 만들기 및 결제',
        "vi": 'Tạo tài khoản và thanh toán',
        "th": 'สร้างบัญชีและชำระเงิน',
        "zh": '注册并开通',
    },
    'Latest Updates': {
        "es": 'Últimas actualizaciones',
        "fr": 'Dernières mises à jour',
        "de": 'Neueste Updates',
        "ja": '最新の更新',
        "ko": '최근 업데이트',
        "vi": 'Cập nhật mới nhất',
        "th": 'อัปเดตล่าสุด',
        "zh": '最新更新',
    },
    'Disclaimer:': {
        "es": 'Aviso:',
        "fr": 'Avertissement :',
        "de": 'Haftungsausschluss:',
        "ja": '免責事項：',
        "ko": '면책 조항:',
        "vi": 'Tuyên bố miễn trừ:',
        "th": 'ข้อจำกัดความรับผิดชอบ:',
        "zh": '免责声明：',
    },
    'The static web tool does not collect': {
        "es": 'La herramienta web estática no recopila',
        "fr": "L'outil web statique ne collecte pas",
        "de": 'Das statische Web-Tool erfasst keine',
        "ja": '静的Webツールは収集しません',
        "ko": '정적 웹 도구는 수집하지 않습니다',
        "vi": 'Công cụ web tĩnh không thu thập',
        "th": 'เครื่องมือเว็บแบบสถิตไม่เก็บรวบรวม',
        "zh": '静态网页工具不会收集',
    },
    'Product': {
        "es": 'Producto',
        "fr": 'Produit',
        "de": 'Produkt',
        "ja": '製品',
        "ko": '제품',
        "vi": 'Sản phẩm',
        "th": 'ผลิตภัณฑ์',
        "zh": '产品',
    },
    'Resources': {
        "es": 'Recursos',
        "fr": 'Ressources',
        "de": 'Ressourcen',
        "ja": 'リソース',
        "ko": '리소스',
        "vi": 'Tài nguyên',
        "th": 'ทรัพยากร',
        "zh": '资源',
    },
    'Legal': {
        "es": 'Legal',
        "fr": 'Mentions légales',
        "de": 'Rechtliches',
        "ja": '法的事項',
        "ko": '법적 고지',
        "vi": 'Pháp lý',
        "th": 'ข้อกฎหมาย',
        "zh": '法律信息',
    },
    'Language': {
        "es": 'Idioma',
        "fr": 'Langue',
        "de": 'Sprache',
        "ja": '言語',
        "ko": '언어',
        "vi": 'Ngôn ngữ',
        "th": 'ภาษา',
        "zh": '语言',
    },
    'Open App': {
        "es": 'Abrir app',
        "fr": "Ouvrir l'app",
        "de": 'App öffnen',
        "ja": 'アプリを開く',
        "ko": '앱 열기',
        "vi": 'Mở ứng dụng',
        "th": 'เปิดแอป',
        "zh": '打开工具',
    },
    'Features': {
        "es": 'Funciones',
        "fr": 'Fonctions',
        "de": 'Funktionen',
        "ja": '機能',
        "ko": '기능',
        "vi": 'Tính năng',
        "th": 'ฟีเจอร์',
        "zh": '功能',
    },
    'Pro Pricing': {
        "es": 'Precios Pro',
        "fr": 'Tarifs Pro',
        "de": 'Pro-Preise',
        "ja": 'Pro料金',
        "ko": 'Pro 요금',
        "vi": 'Giá Pro',
        "th": 'ราคา Pro',
        "zh": 'Pro 定价',
    },
    'Help': {
        "es": 'Ayuda',
        "fr": 'Aide',
        "de": 'Hilfe',
        "ja": 'ヘルプ',
        "ko": '도움말',
        "vi": 'Trợ giúp',
        "th": 'ช่วยเหลือ',
        "zh": '帮助',
    },
    'Account': {
        "es": 'Cuenta',
        "fr": 'Compte',
        "de": 'Konto',
        "ja": 'アカウント',
        "ko": '계정',
        "vi": 'Tài khoản',
        "th": 'บัญชี',
        "zh": '账户',
    },
    'Upgrade Pro': {
        "es": 'Actualizar a Pro',
        "fr": 'Passer à Pro',
        "de": 'Pro upgraden',
        "ja": 'Proにアップグレード',
        "ko": 'Pro로 업그레이드',
        "vi": 'Nâng cấp lên Pro',
        "th": 'อัปเกรดเป็น Pro',
        "zh": '升级 Pro',
    },
    'Real Time Decibel Meter': {
        "es": 'Medidor de decibelios en tiempo real',
        "fr": 'Sonomètre en temps réel',
        "de": 'Echtzeit-Dezibel-Messgerät',
        "ja": 'リアルタイム分貝計',
        "ko": '실시간 데시벨 측정기',
        "vi": 'Máy đo decibel thời gian thực',
        "th": 'เครื่องวัดเดซิเบลแบบเรียลไทม์',
        "zh": '实时分贝测量',
    },
    'Audio &amp; Waveform Recording': {
        "es": 'Grabación de audio y forma de onda',
        "fr": "Enregistrement audio et forme d'onde",
        "de": 'Audio- und Wellenform-Aufnahme',
        "ja": '音声・波形録音',
        "ko": '오디오 및 파형 녹음',
        "vi": 'Ghi âm thanh và dạng sóng',
        "th": 'บันทึกเสียงและรูปคลื่น',
        "zh": '音频与波形记录',
    },
    'Auto Time &amp; Location Stamp': {
        "es": 'Marca automática de hora y ubicación',
        "fr": 'Horodatage et géolocalisation automatiques',
        "de": 'Automatischer Zeit- und Ortsstempel',
        "ja": '自動タイム＆位置スタンプ',
        "ko": '자동 시간 및 위치 스탬프',
        "vi": 'Tự động đóng dấu thời gian và vị trí',
        "th": 'ประทับเวลาและตำแหน่งอัตโนมัติ',
        "zh": '自动时间与位置标记',
    },
    'Evidence Report Export': {
        "es": 'Exportación de informe de evidencia',
        "fr": 'Export du rapport de preuve',
        "de": 'Beweisbericht-Export',
        "ja": '証拠レポート書き出し',
        "ko": '증거 보고서 내보내기',
        "vi": 'Xuất báo cáo bằng chứng',
        "th": 'ส่งออกรายงานหลักฐาน',
        "zh": '证据报告导出',
    },
    'Neighbor &amp; Apartment Noise': {
        "es": 'Ruido de vecinos y apartamentos',
        "fr": "Bruit de voisinage et d'appartement",
        "de": 'Nachbarschafts- und Wohnungslärm',
        "ja": '隣人・マンション騒音',
        "ko": '이웃 및 아파트 소음',
        "vi": 'Tiếng ồn hàng xóm và căn hộ',
        "th": 'เสียงรบกวนจากเพื่อนบ้านและอพาร์ตเมนต์',
        "zh": '邻里与公寓噪音',
    },
    'Construction Renovation Noise': {
        "es": 'Ruido de obras y reformas',
        "fr": 'Bruit de construction et rénovation',
        "de": 'Bau- und Renovierungslärm',
        "ja": '建設・リフォーム騒音',
        "ko": '건설 및 리모델링 소음',
        "vi": 'Tiếng ồn thi công và cải tạo',
        "th": 'เสียงรบกวนจากการก่อสร้างและรีโนเวท',
        "zh": '装修施工噪音',
    },
    'Bar, Shop &amp; Street Disturbance': {
        "es": 'Molestias de bares, tiendas y calle',
        "fr": 'Nuisances de bars, commerces et rue',
        "de": 'Belästigung durch Bars, Geschäfte und Straße',
        "ja": 'バー・店舗・街頭騒音',
        "ko": '술집, 상점 및 거리 소란',
        "vi": 'Quấy rối từ quán bar, cửa hàng và đường phố',
        "th": 'เสียงรบกวนจากบาร์ ร้านค้า และถนน',
        "zh": '酒吧商铺与街道扰民',
    },
    'Rental Dispute &amp; Legal Evidence Aid': {
        "es": 'Disputas de alquiler y apoyo de prueba legal',
        "fr": 'Litige locatif et aide à la preuve légale',
        "de": 'Mietstreit und juristische Beweishilfe',
        "ja": '賃貸トラブルと法的証拠支援',
        "ko": '임대 분쟁 및 법적 증거 지원',
        "vi": 'Tranh chấp thuê nhà và hỗ trợ bằng chứng pháp lý',
        "th": 'ข้อพิพาทการเช่าและตัวช่วยหลักฐานทางกฎหมาย',
        "zh": '租房纠纷与证据辅助',
    },
    'Home Environment Sound Monitoring': {
        "es": 'Monitoreo de sonido en el hogar',
        "fr": 'Surveillance sonore à la maison',
        "de": 'Schallüberwachung zu Hause',
        "ja": '家庭環境サウンドモニタリング',
        "ko": '가정 환경 소리 모니터링',
        "vi": 'Giám sát âm thanh môi trường gia đình',
        "th": 'การตรวจวัดเสียงในสภาพแวดล้อมภายในบ้าน',
        "zh": '居家环境声音监测',
    },
}


def find_block_bounds(src: str, code: str) -> tuple[int, int]:
    """Return (list_start_idx, list_end_idx) for `code`'s `replacements` list."""
    code_start = src.find(f'"{code}": {{')
    repl_key = src.find('"replacements": ', code_start)
    list_start = src.find('[', repl_key)
    depth = 0
    i = list_start
    while i < len(src):
        c = src[i]
        if c == '[':
            depth += 1
        elif c == ']':
            depth -= 1
            if depth == 0:
                return list_start, i + 1
        i += 1
    raise ValueError(f"could not find replacements list for {code!r}")


def parse_existing(src: str, code: str) -> list[tuple[str, str]]:
    a, b = find_block_bounds(src, code)
    return list(ast.literal_eval(src[a:b]))


def format_pair(en: str, tr: str) -> str:
    """Render a (en, tr) tuple in the file's style: 12-space indent, escaped quotes."""
    en_e = en.replace('\\', '\\\\').replace('"', '\\"')
    tr_e = tr.replace('\\', '\\\\').replace('"', '\\"')
    return f'            ("{en_e}", "{tr_e}"),'


def main() -> None:
    if not TARGET.exists():
        raise SystemExit(f"target not found: {TARGET}")
    src = TARGET.read_text(encoding='utf-8')

    summary: dict[str, dict[str, int]] = {}
    # Patch every locale that has a replacements list (en has an empty one and is
    # handled separately by build_locale, so we leave it alone).
    for code in ('zh', 'es', 'fr', 'de', 'ja', 'ko', 'vi', 'th'):
        existing = parse_existing(src, code)
        existing_keys = {en for en, _ in existing}
        to_add = [(en, tr[code]) for en, tr in TRANSLATIONS.items()
                  if en not in existing_keys and code in tr]
        if not to_add:
            summary[code] = {'existing': len(existing), 'added': 0, 'skipped': len(TRANSLATIONS) - len(to_add)}
            continue

        # Inject at end of replacements list (just before the closing `]`)
        a, b = find_block_bounds(src, code)
        injection = '\n'.join(format_pair(en, tr) for en, tr in to_add) + '\n'
        # The block ends at `b-1` (the `]`), inject before it
        new_src = src[:b - 1] + injection + src[b - 1:]
        src = new_src
        summary[code] = {'existing': len(existing), 'added': len(to_add),
                         'skipped': len(TRANSLATIONS) - len(to_add)}

    TARGET.write_text(src, encoding='utf-8')

    print(f"patched {TARGET.relative_to(ROOT)}")
    for code in ('zh', 'es', 'fr', 'de', 'ja', 'ko', 'vi', 'th'):
        s = summary[code]
        print(f"  {code}: existing={s['existing']:>3}  added={s['added']:>3}  skipped={s['skipped']:>3}")


if __name__ == '__main__':
    main()
