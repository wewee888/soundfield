#!/usr/bin/env python3
"""
scripts/sync_scenarios_and_copy.py

1. Synchronize all 6 noise scenarios in the hero workbench across all 9 languages and root index.html:
   - general (🌐)
   - neighbor (🏠)
   - construction (🚧)
   - street (🍻)
   - rental (📋)
   - traffic (🚗)

2. Synchronize all 6 use-case cards in the #scenarios grid across all 9 languages and root index.html:
   - neighbor
   - construction
   - street
   - rental
   - property (🏢 Property & Building Management Coordination)
   - workplace (📋 Workplace & Occupational Noise Inspection)

3. Modernize privacy / storage copywriting from absolute "纯本地·不上传·No upload" to:
   "本地优先，隐私受控，支持多端云备份与跨设备同步" / "Local-First Privacy with Multi-Device Cloud Sync".
"""

import os
import re
import sys

LOCALES = ['zh', 'en', 'es', 'fr', 'de', 'ja', 'ko', 'vi', 'th']

# 1. Six Workbench Scenarios
WORKBENCH_SCENARIOS = {
    'general': {
        'icon': '🌐',
        'en': ('General Sound Check', 'Any sudden or ambient noise · Instant test'),
        'zh': ('通用环境测量', '日常/突发声响 · 不想分类直接测'),
        'es': ('Medición general', 'Ruido repentino o ambiental · Test directo'),
        'fr': ('Mesure générale', 'Bruits ambiants ou soudains · Test direct'),
        'de': ('Allgemeine Messung', 'Umgebungs- oder Spontanlärm · Direkt messen'),
        'ja': ('一般的な環境測定', '日常・突発騒音 · 分類せずすぐ測定'),
        'ko': ('일반 소음 측정', '일상 및 돌발 소음 · 즉시 간편 측정'),
        'vi': ('Đo lường chung', 'Tiếng ồn tức thời hoặc môi trường · Đo ngay'),
        'th': ('วัดเสียงทั่วไป', 'เสียงรบกวนฉับพลันหรือรอบตัว · วัดได้ทันที'),
    },
    'neighbor': {
        'icon': '🏠',
        'en': ('Neighbor Noise', 'Footsteps, bass &amp; walls'),
        'zh': ('邻里生活噪音', '楼上脚步、低音炮、共振'),
        'es': ('Ruido vecinal', 'Pisadas, graves y vibración'),
        'fr': ('Bruits de voisinage', 'Pas au plafond, basses, résonance'),
        'de': ('Nachbarschaftslärm', 'Schritte, Bässe &amp; Vibrationen'),
        'ja': ('近隣・生活騒音', '足音、重低音、壁の共振'),
        'ko': ('이웃 층간소음', '발걸음, 우퍼 저음, 벽 진동'),
        'vi': ('Tiếng ồn hàng xóm', 'Tiếng bước chân, âm trầm, rung'),
        'th': ('เสียงรบกวนข้างห้อง', 'เสียงฝีเท้า, เบส และแรงสั่นสะเทือน'),
    },
    'construction': {
        'icon': '🚧',
        'en': ('Construction', 'Drilling, hammer &amp; off-hours'),
        'zh': ('装修工程施工', '电钻砸墙、违规超时作业'),
        'es': ('Obras y reformas', 'Taladros, martillos y horas prohibidas'),
        'fr': ('Chantier &amp; travaux', 'Perceuse, marteau, heures indues'),
        'de': ('Baustellen &amp; Umbau', 'Bohren, Hämmern &amp; Ruhezeiten'),
        'ja': ('工事・リフォーム騒音', 'ドリル、打撃音、時間外作業'),
        'ko': ('공사 및 리모델링', '드릴, 타격음, 야간 작업'),
        'vi': ('Thi công xây dựng', 'Khoan tường, tiếng đập, quá giờ quy định'),
        'th': ('งานก่อสร้างต่อเติม', 'เสียงเจาะ สว่าน และทำงานเกินเวลา'),
    },
    'street': {
        'icon': '🍻',
        'en': ('Bar &amp; Street', 'Low-freq bass &amp; exhausts'),
        'zh': ('酒吧商铺扰民', '排风机低频、夜市音乐喧哗'),
        'es': ('Bares y vía pública', 'Graves de fiesta, terrazas y escapes'),
        'fr': ('Bars &amp; bruits de rue', 'Musique nocturne, terrasses, moteurs'),
        'de': ('Bars &amp; Straßenlärm', 'Basslärm, Gastronomie &amp; Auspuffe'),
        'ja': ('飲食店・街頭騒音', '排気ファン低周波、音楽、喧騒'),
        'ko': ('상가 및 야간 거리', '환풍기 저주파, 음악, 고성방가'),
        'vi': ('Quán bar &amp; đường phố', 'Âm trầm quạt hút, tiếng ồn phố đêm'),
        'th': ('สถานบันเทิงและถนน', 'เสียงเบส พัดลมระบายอากาศ และท่อไอเสีย'),
    },
    'rental': {
        'icon': '📋',
        'en': ('Rental Dispute', 'Habitability &amp; lease proof'),
        'zh': ('租房维权举证', '退租退押、居住安宁证据包'),
        'es': ('Disputas de alquiler', 'Habitabilidad, fianza y rescisión'),
        'fr': ('Litiges locatifs', 'Habitabilité, caution &amp; preuve bail'),
        'de': ('Mietstreitigkeiten', 'Wohnmängel, Mietminderung &amp; Kaution'),
        'ja': ('賃貸トラブル証拠', '解約・敷金返還、居住権侵害の証拠'),
        'ko': ('임대차 분쟁 증빙', '계약 해지, 보증금 반환, 주거 평온'),
        'vi': ('Tranh chấp thuê nhà', 'Bằng chứng trả cọc, điều kiện ở'),
        'th': ('ข้อพิพาทเช่าห้อง', 'หลักฐานขอยกเลิกสัญญา คืนเงินประกัน'),
    },
    'traffic': {
        'icon': '🚗',
        'en': ('Traffic &amp; Highway', 'Traffic flow, honking &amp; road rumble'),
        'zh': ('道路交通噪声', '主干道车流、车辆鸣笛、低频胎噪'),
        'es': ('Tráfico rodado', 'Autovías, bocinas y rodadura continua'),
        'fr': ('Trafic routier', 'Circulation continue, klaxons &amp; roulement'),
        'de': ('Straßenverkehr', 'Hauptverkehr, Hupen &amp; Abrollgeräusche'),
        'ja': ('道路・交通騒音', '幹線道路、クラクション、ロードノイズ'),
        'ko': ('도로 교통 소음', '간선도로 차량 통행, 경적, 타이어 마찰음'),
        'vi': ('Giao thông đường bộ', 'Lưu lượng xe, còi xe, tiếng rít lốp'),
        'th': ('การจราจรและถนนใหญ่', 'เสียงยานพาหนะ บีบแตร และเสียงยางบดถนน'),
    },
}

# 2. Six Use-Case Cards
USE_CASE_CARDS = {
    'neighbor': {
        'slug': 'neighbor-noise-evidence.html',
        'icon_svg': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M3 11l9-7 9 7v9a2 2 0 0 1-2 2h-4v-6h-6v6H5a2 2 0 0 1-2-2z"/></svg>',
        'en': ('Neighbor &amp; Apartment Noise', 'For tenants, owners, and mediators who need a structured diary with dB trends, timestamps, photos, and reports.'),
        'zh': ('邻里与公寓噪音', '面向受楼上跑跳、低音炮、宠物狂吠困扰的租客与业主，记录分贝趋势、时间戳、现场照片与完整日志，向物业及居委会举证。'),
        'es': ('Ruido de vecinos y apartamentos', 'Para inquilinos, propietarios y mediadores que necesitan un diario estructurado con tendencias de dB, marcas de tiempo, fotos e informes.'),
        'fr': ("Bruit de voisinage et d'appartement", "Pour locataires, propriétaires et médiateurs ayant besoin d'un journal structuré avec courbes de dB, horodatages, photos et rapports."),
        'de': ('Nachbarschafts- und Wohnungslärm', 'Für Mieter, Eigentümer und Schlichter, die ein strukturiertes Lärmprotokoll mit dB-Verläufen, Zeitstempeln, Fotos und Berichten benötigen.'),
        'ja': ('近隣・マンション騒音', '上階の足音、重低音、ペットの鳴き声に悩む居住者のための構造化記録：デシベル推移、時間刻印、現場写真、報告書。'),
        'ko': ('이웃 및 아파트 층간소음', '발걸음 소리, 우퍼 저음, 반려동물 소음 등에 직면한 입주민을 위해 dB 추이, 타임스탬프, 현장 사진 및 표준 보고서를 제공합니다.'),
        'vi': ('Tiếng ồn hàng xóm và căn hộ', 'Dành cho người thuê, chủ nhà và hòa giải viên cần nhật ký có cấu trúc với biểu đồ dB, dấu thời gian, ảnh và báo cáo.'),
        'th': ('เสียงรบกวนจากเพื่อนบ้านและคอนโด', 'สำหรับผู้เช่า เจ้าของห้อง และผู้ไกล่เกลี่ยที่ต้องการบันทึกแบบมีโครงสร้าง พร้อมกราฟแนวโน้ม dB ประทับเวลา รูปภาพ และรายงาน.'),
    },
    'construction': {
        'slug': 'construction-noise-monitoring.html',
        'icon_svg': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M3 21h18M5 21V9l7-5 7 5v12M9 21V12h6v9"/></svg>',
        'en': ('Construction Renovation Noise', 'Capture start, peak, and quiet-after periods with site notes, GPS, video, and exportable summaries.'),
        'zh': ('装修施工噪音', '针对违规夜间或午间作业、重型设备施工，快速锁定超标峰值、作业时段与 GPS 施工坐标，助力向城管及 12345 投诉。'),
        'es': ('Ruido de obras y reformas', 'Capture inicios, picos y pausas con notas del lugar, GPS, vídeo y resúmenes exportables para reclamaciones formales.'),
        'fr': ('Bruit de chantier et rénovation', 'Consignez le début, les pics et les périodes de calme avec notes de site, GPS, vidéo et synthèses exportables.'),
        'de': ('Bau- und Renovierungslärm', 'Erfassen Sie Arbeitsbeginn, Spitzenwerte und Ruhephasen mit Baustellennotizen, GPS, Video und exportierbaren Protokollen.'),
        'ja': ('工事・リフォーム騒音', '違法な夜間・早朝工事や重機作業のピーク値、作業時間帯、GPS位置情報を素早く記録し、行政や管理組合へ提出。'),
        'ko': ('공사 및 리모델링 소음', '공사 시작 시간, 최대 피크치, 작업 휴지기를 현장 메모, GPS, 영상 및 내보내기 가능한 요약서로 완벽 기록합니다.'),
        'vi': ('Tiếng ồn thi công và cải tạo', 'Ghi lại thời điểm bắt đầu, đỉnh điểm và khoảng lặng với ghi chú thực địa, GPS, video và bản tóm tắt xuất khẩu.'),
        'th': ('เสียงงานก่อสร้างและต่อเติม', 'จับภาพช่วงเวลาเริ่มต้น ช่วงเสียงดังสูงสุด และช่วงหยุดพัก พร้อมบันทึกสถานที่ GPS วิดีโอ และสรุปรายงาน.'),
    },
    'street': {
        'slug': 'bar-street-disturbance.html',
        'icon_svg': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M3 6h18M5 6v6c0 4 3 7 7 7s7-3 7-7V6"/><path d="M9 2v3M15 2v3"/></svg>',
        'en': ('Bar, Shop &amp; Street Disturbance', 'Document repeated disturbance patterns with time, place, media, and complaint-ready summaries.'),
        'zh': ('酒吧商铺与街道扰民', '记录临街夜市、酒吧低音炮、广场舞与商铺高音喇叭重复扰民规律，沉淀具备时间连续性的维权底稿。'),
        'es': ('Molestias de bares, tiendas y calle', 'Documente patrones repetitivos de molestias con hora, lugar, medios y resúmenes listos para denuncias.'),
        'fr': ('Nuisances de bars, commerces et rue', 'Documentez les perturbations récurrentes avec date, lieu, médias et synthèses prêtes pour les réclamations.'),
        'de': ('Belästigung durch Bars, Geschäfte und Straße', 'Dokumentieren Sie wiederkehrende Lärmmuster mit Uhrzeit, Ort, Medien und beschwerdereifen Zusammenfassungen.'),
        'ja': ('飲食店・商店・街頭騒音', '夜市、クラブの重低音、店舗スピーカーによる反復的な迷惑騒音パターンを、時間・位置・メディア証拠とともに蓄積。'),
        'ko': ('상가, 주점 및 야간 거리 소음', '야간 업소, 클럽 우퍼 저음, 상가 확성기의 반복적 소음 패턴을 시간, 장소, 미디어와 함께 체계적으로 기록합니다.'),
        'vi': ('Quấy rối từ quán bar, cửa hàng &amp; đường phố', 'Ghi lại các đợt quấy rối lặp lại theo thời gian, địa điểm, tệp đa phương tiện và bản tóm tắt khiếu nại.'),
        'th': ('สถานบันเทิง ร้านค้า และถนน', 'บันทึกรูปแบบการรบกวนที่เกิดขึ้นซ้ำๆ พร้อมเวลา สถานที่ สื่อ และสรุปข้อมูลพร้อมยื่นร้องเรียน.'),
    },
    'rental': {
        'slug': 'rental-dispute-evidence.html',
        'icon_svg': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M4 7l8-4 8 4-8 4-8-4z"/><path d="M4 12l8 4 8-4"/><path d="M4 17l8 4 8-4"/></svg>',
        'en': ('Rental Dispute &amp; Legal Evidence Aid', 'Organize facts before speaking with a landlord, property manager, local authority, or legal adviser.'),
        'zh': ('租房纠纷与证据辅助', '房屋严重噪音影响正常居住无法入睡时，整理确凿事实与超标报告，为房东协商、合法退租退押或法律诉讼提供佐证。'),
        'es': ('Disputas de alquiler y apoyo legal', 'Organice los hechos antes de hablar con el casero, el administrador de la finca, las autoridades o un abogado.'),
        'fr': ('Litige locatif et aide à la preuve légale', 'Rassemblez les faits avant d’échanger avec un bailleur, un syndic, les autorités locales ou un avocat.'),
        'de': ('Mietstreit und juristische Beweishilfe', 'Strukturieren Sie Fakten vor dem Gespräch mit Vermieter, Hausverwaltung, Behörden oder Rechtsbeistand.'),
        'ja': ('賃貸トラブル・証拠支援', '深刻な騒音で安眠が妨げられた際、大家や管理会社との交渉、契約解除、敷金返還請求のための客観資料を整理。'),
        'ko': ('임대차 분쟁 및 법적 증빙 지원', '주거 환경 침해 시 임대인 협의, 계약 해지, 보증금 반환 또는 분쟁 조정을 위한 객관적 증거 자료를 체계화합니다.'),
        'vi': ('Tranh chấp thuê nhà và hỗ trợ pháp lý', 'Sắp xếp sự thật khách quan trước khi làm việc với chủ nhà, ban quản lý, cơ quan chức năng hoặc luật sư.'),
        'th': ('ข้อพิพาทการเช่าและหลักฐานทางกฎหมาย', 'รวบรวมข้อเท็จจริงก่อนเจรจากับเจ้าของห้อง นิติบุคคล เจ้าหน้าที่ หรือที่ปรึกษากฎหมายเพื่อขอยกเลิกสัญญา.'),
    },
    'property': {
        'slug': 'property-noise-complaint-report.html',
        'icon_svg': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M3 21h18M5 21V7l7-4 7 4v14M9 13h6M9 17h6"/></svg>',
        'en': ('Property &amp; Building Management Coordination', 'Structured complaint logs and re-check reports for building managers, HOAs, and tenant mediation.'),
        'zh': ('物业噪音协同与回访复查', '为物业管家、业委会与居委会提供统一的投诉受理与回访复查凭证，精准覆盖楼栋、楼层与单元。'),
        'es': ('Gestión de comunidades y fincas', 'Registro estructurado de quejas y partes de verificación para administradores de fincas y propietarios.'),
        'fr': ('Gestion immobilière &amp; syndics', 'Registres de plaintes et rapports de contre-visite structurés pour régies, syndics et médiations.'),
        'de': ('Hausverwaltung &amp; Quartiere', 'Strukturierte Beschwerdeprotokolle und Nachprüfberichte für Hausverwaltungen, Beiräte und Mediation.'),
        'ja': ('管理会社・マンション管理組合', '苦情の受付から現場再確認まで、棟・階・号室ごとに整理された客観的な調査報告書を作成。'),
        'ko': ('관리사무소 및 공동주택 협의', '동·호수별 민원 접수와 재측정 확인을 위한 표준화된 현장 보고서로 원만한 중재 지원.'),
        'vi': ('Ban quản lý tòa nhà &amp; chung cư', 'Nhật ký tiếp nhận khiếu nại và báo cáo kiểm tra thực tế có hệ thống theo từng tòa nhà, tầng và căn hộ.'),
        'th': ('นิติบุคคลอาคารชุดและผู้จัดการตึก', 'บันทึกข้อร้องเรียนและรายงานตรวจสอบซ้ำที่เป็นระบบ แยกตามอาคาร ชั้น และห้องชุดเพื่อไกล่เกลี่ย.'),
    },
    'workplace': {
        'slug': 'workplace-noise-inspection.html',
        'icon_svg': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M4 4h16v6H4zM4 14h16v6H4z"/><path d="M8 7h2M8 17h2"/></svg>',
        'en': ('Workplace &amp; Occupational Noise Inspection', 'Repeatable acoustic monitoring for offices, retail stores, manufacturing, and OSHA/health compliance checks.'),
        'zh': ('企业与职场噪音巡检', '面向办公室、连锁商超、制造车间及静音空间，建立符合职业健康标准的定期声学巡检台账。'),
        'es': ('Inspección de ruido laboral', 'Monitorización acústica periódica en oficinas, comercios y fábricas conforme a prevención de riesgos.'),
        'fr': ('Inspection du bruit en entreprise', 'Contrôles acoustiques reproductibles pour bureaux, commerces, ateliers et conformité santé au travail.'),
        'de': ('Betrieblicher Arbeitsschutz &amp; Lärm', 'Reproduzierbare Lärmaudits für Büros, Filialen, Gewerbehallen und betrieblichen Gesundheitsschutz.'),
        'ja': ('職場・オフィス・工場騒音巡回', 'オフィス、店舗、工場や静寂空間における労働安全衛生・環境基準に準拠した定期点検記録。'),
        'ko': ('직장 및 사업장 소음 점검', '사무실, 매장, 제조 공장 및 정숙 공간을 위한 산업안전보건 기준 맞춤형 소음 점검 대장.'),
        'vi': ('Kiểm tra tiếng ồn nơi làm việc', 'Bản ghi kiểm tra âm học định kỳ cho văn phòng, cửa hàng, nhà xưởng và tuân thủ an toàn lao động.'),
        'th': ('การตรวจสอบเสียงในสถานที่ทำงาน', 'การบันทึกตรวจวัดเสียงสำหรับสำนักงาน ร้านค้า โรงงาน ตามมาตรฐานความปลอดภัยและอาชีวอนามัย.'),
    },
}

# 3. Privacy / Cloud Sync Badges
PRIVACY_BADGES = {
    'zh': '本地优先 · 隐私受控',
    'en': 'Local-First Privacy · Multi-Device Sync',
    'es': 'Privacidad local · Sincronización en la nube',
    'fr': 'Traitement local · Synchronisation cloud',
    'de': 'Lokal gespeichert · Cloud-Synchronisation',
    'ja': 'ローカル優先・マルチデバイス同期対応',
    'ko': '로컬 우선 보안 · 클라우드 동기화 지원',
    'vi': 'Ưu tiên cục bộ · Đồng bộ đám mây',
    'th': 'ประมวลผลในเครื่อง · รองรับซิงค์คลาวด์',
}

WORKBENCH_META_POINT2 = {
    'zh': '<span>✓ <strong>本地优先存储</strong> · 支持跨设备云备份</span>',
    'en': '<span>✓ <strong>Local-first privacy</strong> · Multi-device cloud sync</span>',
    'es': '<span>✓ <strong>Privacidad local</strong> · Sincronización en la nube</span>',
    'fr': '<span>✓ <strong>Traitement local</strong> · Synchronisation cloud</span>',
    'de': '<span>✓ <strong>Lokale Datenhoheit</strong> · Multi-Device Cloud-Backup</span>',
    'ja': '<span>✓ <strong>ローカル最優先</strong> · 端末間クラウド同期対応</span>',
    'ko': '<span>✓ <strong>로컬 우선 보안</strong> · 멀티 디바이스 클라우드 백업</span>',
    'vi': '<span>✓ <strong>Bảo mật cục bộ</strong> · Hỗ trợ đồng bộ đám mây</span>',
    'th': '<span>✓ <strong>จัดเก็บในเครื่อง</strong> · รองรับสำรองข้อมูลบนคลาวด์</span>',
}

def build_workbench_chips_html(lang):
    items = []
    scenarios_order = ['general', 'neighbor', 'construction', 'street', 'rental', 'traffic']
    for key in scenarios_order:
        data = WORKBENCH_SCENARIOS[key]
        title, desc = data.get(lang, data['en'])
        is_active = (key == 'neighbor')
        active_cls = ' active' if is_active else ''
        aria_sel = 'true' if is_active else 'false'
        items.append(f'''            <button type="button" class="scenario-pill-btn{active_cls}" data-scenario="{key}" role="tab" aria-selected="{aria_sel}">
              <span class="scenario-pill-icon">{data['icon']}</span>
              <div class="scenario-pill-text">
                <strong>{title}</strong>
                <small>{desc}</small>
              </div>
            </button>''')
    inner = '\n'.join(items)
    return f'<div class="workbench-chips-grid" role="tablist">\n{inner}\n          </div>'

def build_use_case_cards_html(lang, is_root=False):
    if is_root:
        prefix = 'use-cases/'
    elif lang == 'en':
        prefix = '../use-cases/'
    else:
        prefix = f'../use-cases/{lang}/'
    cards_order = ['neighbor', 'construction', 'street', 'rental', 'property', 'workplace']
    card_htmls = []
    for key in cards_order:
        card = USE_CASE_CARDS[key]
        title, desc = card.get(lang, card['en'])
        href = f'{prefix}{card["slug"]}'
        card_htmls.append(f'''        <a class="card reveal" href="{href}">
          <span class="feature-icon" aria-hidden="true">
            {card['icon_svg']}
          </span>
          <h3>{title}</h3>
          <p>{desc}</p>
        </a>''')
    inner = '\n'.join(card_htmls)
    return f'<div class="grid" style="margin-top:18px">\n{inner}\n      </div>'

def update_index_page(file_path, lang, is_root=False):
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # 1. Update workbench-chips-grid
    new_chips = build_workbench_chips_html(lang)
    chips_pattern = re.compile(r'<div class="workbench-chips-grid"[^>]*>[\s\S]*?<\/div>\s*<\/div>')
    if chips_pattern.search(content):
        content = chips_pattern.sub(f'{new_chips}\n        </div>', content, count=1)

    # 2. Update meta point 2 in workbench
    meta_pattern = re.compile(r'<span>[✓✔]\s*<strong>(?:纯本地计算|Zero cloud upload|Local-only|Lokal|Localmente)[\s\S]*?<\/span>')
    if meta_pattern.search(content):
        content = meta_pattern.sub(WORKBENCH_META_POINT2.get(lang, WORKBENCH_META_POINT2['en']), content, count=1)

    # 3. Update privacy badge
    badge_text = PRIVACY_BADGES.get(lang, PRIVACY_BADGES['en'])
    content = re.sub(
        r'<span class="privacy-badge">[\s\S]*?<\/span>',
        f'<span class="privacy-badge">{badge_text}</span>',
        content
    )

    # 4. Update the 6 use-case cards in #scenarios
    # Target the <div class="grid" style="margin-top:18px"> ... </div> right before </section>
    new_cards = build_use_case_cards_html(lang, is_root=is_root)
    # Match the cards grid inside #scenarios
    grid_pattern = re.compile(r'(<section[^>]*id="scenarios"[\s\S]*?)<div class="grid"[^>]*>[\s\S]*?<\/div>(\s*<\/section>)')
    if grid_pattern.search(content):
        content = grid_pattern.sub(r'\1' + new_cards + r'\2', content, count=1)

    # 5. Update Free Tier bullet 5 in pricing
    if lang == 'zh':
        content = content.replace('<li>数据仅限当前浏览器本地临时暂存</li>', '<li>数据默认保留在当前设备；登录账户可享多端云备份</li>')
    else:
        content = content.replace('<li>Local device storage only</li>', '<li>Stored locally on your device by default; sign in for cloud backup</li>')
        content = content.replace('<li>Datos solo en el navegador local</li>', '<li>Datos guardados en el dispositivo local; inicie sesión para respaldo en la nube</li>')

    # 6. Update og:description and twitter:description
    if lang == 'zh':
        content = re.sub(
            r'<meta property="og:description" content="[^"]*No app\. No upload\. No account\.[^"]*">',
            '<meta property="og:description" content="免费在线分贝仪与噪声取证记录工具。本地优先、隐私受控，支持多设备云端安全备份。">',
            content
        )
        content = re.sub(
            r'<meta name="twitter:description" content="[^"]*No app\. No upload\. No account\.[^"]*">',
            '<meta name="twitter:description" content="免费在线分贝仪与噪声取证记录工具。本地优先、隐私受控，支持多设备云端安全备份。">',
            content
        )
    else:
        content = re.sub(
            r'<meta property="og:description" content="[^"]*No app\. No upload\. No account\.[^"]*">',
            '<meta property="og:description" content="A free browser dB meter that turns sound into tamper-evident proof. Local-first by default, with multi-device cloud backup.">',
            content
        )
        content = re.sub(
            r'<meta name="twitter:description" content="[^"]*No app\. No upload\. No account\.[^"]*">',
            '<meta name="twitter:description" content="A free browser dB meter that turns sound into tamper-evident proof. Local-first by default, with multi-device cloud backup.">',
            content
        )

    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(content)

    print(f"  [OK] Updated index page: {file_path} ({lang})")

def update_privacy_badges_in_file(file_path, lang):
    if not os.path.exists(file_path):
        return
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    badge_text = PRIVACY_BADGES.get(lang, PRIVACY_BADGES['en'])
    new_content = re.sub(
        r'<span class="privacy-badge">[\s\S]*?<\/span>',
        f'<span class="privacy-badge">{badge_text}</span>',
        content
    )
    if 'No app. No upload. No account.' in new_content:
        new_content = new_content.replace(
            'No app. No upload. No account.',
            'Local-first by default, with optional multi-device cloud sync.'
        )

    if new_content != content:
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f"  [OK] Updated privacy badge in {file_path}")

def main():
    print("Synchronizing all 6 noise scenarios, 6 use-case cards, and modernizing privacy copy...")

    # Root index.html
    update_index_page('index.html', 'en', is_root=True)

    # 9 Locales index.html
    for lang in LOCALES:
        path = f'{lang}/index.html'
        if os.path.exists(path):
            update_index_page(path, lang, is_root=False)

    # Update samples, changelog, disclaimer across root and locales
    files_to_update_badges = [
        ('samples.html', 'en'),
        ('changelog.html', 'en'),
        ('disclaimer.html', 'en'),
        ('use-cases/index.html', 'en'),
    ]
    for lang in LOCALES:
        files_to_update_badges.extend([
            (f'{lang}/samples.html', lang),
            (f'{lang}/changelog.html', lang),
            (f'{lang}/disclaimer.html', lang),
            (f'use-cases/{lang}/index.html', lang),
        ])

    for fpath, lcode in files_to_update_badges:
        update_privacy_badges_in_file(fpath, lcode)

    print("Synchronization complete!")

if __name__ == '__main__':
    main()
