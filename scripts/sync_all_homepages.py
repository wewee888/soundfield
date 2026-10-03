import os, re

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

# ── 1. Update site-experience.js with full multilingual SCENARIO_DATA ──
EXPERIENCE_JS = os.path.join(ROOT, 'assets', 'site-experience.js')

with open(EXPERIENCE_JS, 'r', encoding='utf-8') as f:
    js_content = f.read()

# Let's inspect where SCENARIO_DATA is in site-experience.js
# We will update initScenarioWorkbench in site-experience.js
old_init_wb = """  function initScenarioWorkbench() {
    const wb = document.getElementById('scenario-workbench');
    if (!wb) return;

    const isZh = document.documentElement.lang.startsWith('zh') || location.pathname.includes('/zh/');
    const langKey = isZh ? 'zh' : 'en';"""

new_init_wb = """  function initScenarioWorkbench() {
    const wb = document.getElementById('scenario-workbench');
    if (!wb) return;

    const langCode = (document.documentElement.lang || 'en').trim().toLowerCase().split(/[-_]/)[0];
    const pathMatch = location.pathname.match(/\\/(zh|en|fr|de|es|ja|ko|vi|th)\\//);
    const langKey = pathMatch ? pathMatch[1] : (SCENARIO_DATA.neighbor[langCode] ? langCode : 'en');
    const isZh = langKey === 'zh';"""

if old_init_wb in js_content:
    js_content = js_content.replace(old_init_wb, new_init_wb)
    with open(EXPERIENCE_JS, 'w', encoding='utf-8') as f:
        f.write(js_content)
    print("Updated initScenarioWorkbench in assets/site-experience.js!")

# ── 2. Full Workbench HTML definitions per locale ──
WORKBENCH_HTML = {
    'fr': {
        'badge_s1': 'Étape 1 · Choisir le scénario',
        'title_s1': 'Sélectionnez votre situation de bruit',
        'desc_s1': 'Chargez les seuils acoustiques calibrés, les règles de preuve et les modèles de plainte adaptés.',
        'chip_neighbor': ('🏠', 'Bruit de voisinage', 'Pas au plafond, basses &amp; cloisons'),
        'chip_construction': ('🚧', 'Chantier &amp; travaux', 'Perceuse, marteau &amp; heures indues'),
        'chip_street': ('🍻', 'Bars &amp; commerces', 'Basses fréquences &amp; terrasses'),
        'chip_rental': ('📋', 'Litige locatif', 'Habitabilité &amp; retenue sur caution'),
        'input_ph': 'Décrivez la nuisance (ex. ascenseur nocturne)...',
        'btn_apply': 'Appliquer',
        'meta_1': 'Démarrage en 1 clic', 'meta_1_sub': 'Sans appli',
        'meta_2': 'Zéro envoi cloud',
        'meta_3': 'Dossier PDF / CSV',
        'badge_s2': 'Étape 2 · Pipeline de preuve',
        'title_s2': 'Modèle de preuve bruit de voisinage',
        'desc_s2': 'Optimisé pour les bruits de pas, TV/musique, aboiements et vibrations CVC.',
        'lbl_day': 'Limite de jour', 'val_day': '≤ 55 dB',
        'lbl_night': 'Limite de nuit', 'val_night': '≤ 45 dB',
        'lbl_metric': 'Indicateur clé', 'val_metric': 'LAeq + L10',
        'lbl_tamper': 'Intégrité', 'val_tamper': 'GPS + SHA-256',
        'step_1': 'Profil acoustique du scénario calibré',
        'step_2': 'Filtre pondération A et réponse rapide initialisés',
        'step_3': 'Traitement 100% local sur votre appareil vérifié',
        'step_4': 'Prêt — lancez l\'enregistrement pour figer les faits opposables',
        'btn_cta': 'Lancer l\'enregistreur de preuve',
        'btn_guide': 'Guide du litige',
        'guide_link': '../use-cases/neighbor-noise-evidence.html',
    },
    'de': {
        'badge_s1': 'Schritt 1 · Szenario wählen',
        'title_s1': 'Wählen Sie Ihre Lärmsituation',
        'desc_s1': 'Automatische Konfiguration von Dezibel-Grenzwerten, Beweisregeln und Beschwerdevorlagen.',
        'chip_neighbor': ('🏠', 'Nachbarschaftslärm', 'Schritte, Bässe &amp; Trittschall'),
        'chip_construction': ('🚧', 'Bau- &amp; Sanierungslärm', 'Bohren, Hämmern &amp; Ruhezeiten'),
        'chip_street': ('🍻', 'Gastronomie &amp; Straße', 'Tieffrequente Bässe &amp; Außenlüfter'),
        'chip_rental': ('📋', 'Mietstreitigkeiten', 'Mietminderung &amp; Wohnruhe-Beweis'),
        'input_ph': 'Lärmsituation beschreiben (z.B. nächtlicher Aufzug)...',
        'btn_apply': 'Anwenden',
        'meta_1': 'Sofortstart im Browser', 'meta_1_sub': 'Ohne App',
        'meta_2': 'Keine Cloud-Übertragung',
        'meta_3': 'PDF / CSV Protokoll',
        'badge_s2': 'Schritt 2 · Beweissicherungs-Pipeline',
        'title_s2': 'Beweisvorlage Nachbarschaftslärm',
        'desc_s2': 'Optimiert für Trittschall, TV/Musik, Tierlärm und Lüftungsvibrationen.',
        'lbl_day': 'Tag-Richtwert', 'val_day': '≤ 55 dB',
        'lbl_night': 'Nacht-Richtwert', 'val_night': '≤ 45 dB',
        'lbl_metric': 'Hauptmesswert', 'val_metric': 'LAeq + L10',
        'lbl_tamper': 'Rechtssicherheit', 'val_tamper': 'GPS + SHA-256',
        'step_1': 'Akustisches Szenarioprofil zugeordnet',
        'step_2': 'A-Bewertung &amp; Zeitbewertung initialisiert',
        'step_3': 'Lokale Verarbeitung ohne Cloud-Upload verifiziert',
        'step_4': 'Bereit — Messung starten für verwertbare Fakten',
        'btn_cta': 'Beweisaufzeichnung starten',
        'btn_guide': 'Leitfaden öffnen',
        'guide_link': '../use-cases/neighbor-noise-evidence.html',
    },
    'es': {
        'badge_s1': 'Paso 1 · Elegir escenario',
        'title_s1': 'Seleccione su situación de ruido',
        'desc_s1': 'Cargue límites acústicos calibrados, reglas de evidencia y plantillas de queja oficiales.',
        'chip_neighbor': ('🏠', 'Ruido de vecinos', 'Pisadas, graves y música'),
        'chip_construction': ('🚧', 'Obras y reformas', 'Taladros y horarios no autorizados'),
        'chip_street': ('🍻', 'Bares y vía pública', 'Graves de música y extractores'),
        'chip_rental': ('📋', 'Disputa de alquiler', 'Habitabilidad y fianza'),
        'input_ph': 'Describa el ruido (ej. motor de ascensor nocturno)...',
        'btn_apply': 'Aplicar',
        'meta_1': 'Inicio con 1 clic', 'meta_1_sub': 'Sin app',
        'meta_2': 'Cero subida a la nube',
        'meta_3': 'Informe PDF / CSV',
        'badge_s2': 'Paso 2 · Flujo de evidencia',
        'title_s2': 'Plantilla de evidencia para ruido vecinal',
        'desc_s2': 'Optimizada para pisadas superiores, TV/música, mascotas y vibraciones.',
        'lbl_day': 'Límite diurno', 'val_day': '≤ 55 dB',
        'lbl_night': 'Límite nocturno', 'val_night': '≤ 45 dB',
        'lbl_metric': 'Métrica clave', 'val_metric': 'LAeq + L10',
        'lbl_tamper': 'Integridad', 'val_tamper': 'GPS + SHA-256',
        'step_1': 'Perfil acústico del escenario ajustado',
        'step_2': 'Ponderación A y respuesta rápida inicializadas',
        'step_3': 'Procesamiento local confidencial verificado',
        'step_4': 'Listo — inicie el registro para capturar pruebas válidas',
        'btn_cta': 'Iniciar registro de evidencia',
        'btn_guide': 'Guía del caso',
        'guide_link': '../use-cases/neighbor-noise-evidence.html',
    },
    'ja': {
        'badge_s1': 'ステップ 1 · 騒音シナリオを選択',
        'title_s1': 'お困りの騒音状況を選択',
        'desc_s1': '各基準に合わせた参考限度値、証拠収集ルール、公的申し立てテンプレートを自動読み込み。',
        'chip_neighbor': ('🏠', '近隣・生活騒音', '上階の足音、重低音、振動'),
        'chip_construction': ('🚧', '解体・内装工事', 'ドリル打撃音、時間外作業'),
        'chip_street': ('🍻', '店舗・路上騒音', '重低音ウーファー、排気ダクト'),
        'chip_rental': ('📋', '賃貸トラブル・証拠', '退去・敷金返還、住環境証拠'),
        'input_ph': '具体的な状況を入力（例：夜間のエレベーター低周波）...',
        'btn_apply': '適用',
        'meta_1': 'ワンクリック開始', 'meta_1_sub': 'アプリ不要',
        'meta_2': 'クラウド送信なし',
        'meta_3': 'PDF / CSV 報告書',
        'badge_s2': 'ステップ 2 · 証拠作成パイプライン',
        'title_s2': '近隣騒音証拠作成テンプレート',
        'desc_s2': '足音、音楽・テレビ、ペットの鳴き声、空調配管振動に最適化。',
        'lbl_day': '昼間限度値', 'val_day': '≤ 55 dB',
        'lbl_night': '夜間限度値', 'val_night': '≤ 45 dB',
        'lbl_metric': '重点指標', 'val_metric': 'LAeq 等価騒音レベル',
        'lbl_tamper': '改ざん防止', 'val_tamper': 'GPS + SHA-256',
        'step_1': '居住環境騒音の収集基準に適合',
        'step_2': 'A特性フィルタと動特性を初期化',
        'step_3': '端末内完結のプライベート処理を確認',
        'step_4': '準備完了 — 管理会社・調停向け証拠記録を開始',
        'btn_cta': '証拠記録を開始する',
        'btn_guide': 'トラブル対応ガイド',
        'guide_link': '../use-cases/neighbor-noise-evidence.html',
    },
    'ko': {
        'badge_s1': '1단계 · 소음 시나리오 선택',
        'title_s1': '겪고 계신 소음 유형을 선택하세요',
        'desc_s1': '표준 기준치, 증거 수집 규정 및 민원 대응 서식 템플릿을 자동으로 불러옵니다.',
        'chip_neighbor': ('🏠', '층간 및 이웃 소음', '발망치 발소리, 우퍼 중저음, 진동'),
        'chip_construction': ('🚧', '인테리어 공사 소음', '드릴 파쇄음, 규정 외 시간 작업'),
        'chip_street': ('🍻', '상가 및 거리 소음', '클럽 베이스, 대형 환풍기 배기음'),
        'chip_rental': ('📋', '임대차 갈등 소명', '계약 해지, 보증금 반환, 주거 안녕 증거'),
        'input_ph': '상황 입력 (예: 야간 엘리베이터 저주파 진동)...',
        'btn_apply': '적용',
        'meta_1': '1초 즉시 시작', 'meta_1_sub': '앱 설치 없음',
        'meta_2': '완전 로컬 처리',
        'meta_3': 'PDF / CSV 증거 패키지',
        'badge_s2': '2단계 · 증거 생성 파이프라인',
        'title_s2': '층간 및 이웃 소음 증거 템플릿',
        'desc_s2': '상부층 발소리, TV/음악, 반려동물 짖음, 배관 공조 진동에 최적화.',
        'lbl_day': '주간 기준', 'val_day': '≤ 55 dB',
        'lbl_night': '야간 기준', 'val_night': '≤ 45 dB',
        'lbl_metric': '핵심 지표', 'val_metric': 'LAeq 등가소음도',
        'lbl_tamper': '위변조 방지', 'val_tamper': 'GPS + SHA-256',
        'step_1': '주거지역 생활소음 기준 규격 적용',
        'step_2': 'A-가중 필터 및 반응 속도 설정 완료',
        'step_3': '클라우드 전송 없는 기기 내 처리 확인',
        'step_4': '준비 완료 — 민원 및 분쟁 조정용 증거 기록 시작',
        'btn_cta': '소음 증거 기록 시작',
        'btn_guide': '소음 해결 가이드',
        'guide_link': '../use-cases/neighbor-noise-evidence.html',
    },
    'vi': {
        'badge_s1': 'Bước 1 · Chọn tình huống',
        'title_s1': 'Chọn tình trạng tiếng ồn bạn gặp phải',
        'desc_s1': 'Tự động tải ngưỡng quy chuẩn, quy tắc lưu bằng chứng và mẫu biên bản khiếu nại.',
        'chip_neighbor': ('🏠', 'Tiếng ồn hàng xóm', 'Tiếng bước chân, âm trầm, rung lắc'),
        'chip_construction': ('🚧', 'Thi công xây dựng', 'Khoan đục, thi công ngoài giờ'),
        'chip_street': ('🍻', 'Quán bar &amp; phố xá', 'Loa công suất lớn, quạt thông gió'),
        'chip_rental': ('📋', 'Tranh chấp thuê nhà', 'Vi phạm hợp đồng, bằng chứng trả cọc'),
        'input_ph': 'Mô tả tiếng ồn (VD: tiếng rung thang máy ban đêm)...',
        'btn_apply': 'Áp dụng',
        'meta_1': 'Bắt đầu với 1 chạm', 'meta_1_sub': 'Không cài app',
        'meta_2': 'Không gửi dữ liệu lên đám mây',
        'meta_3': 'Bộ hồ sơ PDF / CSV',
        'badge_s2': 'Bước 2 · Quy trình lập chứng cứ',
        'title_s2': 'Mẫu bằng chứng tiếng ồn khu dân cư',
        'desc_s2': 'Tối ưu cho tiếng bước chân trên lầu, loa TV, thú cưng và rung chấn điều hòa.',
        'lbl_day': 'Giới hạn ngày', 'val_day': '≤ 55 dB',
        'lbl_night': 'Giới hạn đêm', 'val_night': '≤ 45 dB',
        'lbl_metric': 'Chỉ số chính', 'val_metric': 'LAeq + L10',
        'lbl_tamper': 'Tính toàn vẹn', 'val_tamper': 'GPS + SHA-256',
        'step_1': 'Đã tải quy chuẩn tiếng ồn sinh hoạt',
        'step_2': 'Khởi tạo bộ lọc A-weighting và phản hồi',
        'step_3': 'Xác thực xử lý hoàn toàn trên thiết bị',
        'step_4': 'Sẵn sàng — bắt đầu ghi âm để tạo hồ sơ khiếu nại',
        'btn_cta': 'Bắt đầu ghi bằng chứng',
        'btn_guide': 'Hướng dẫn vụ việc',
        'guide_link': '../use-cases/neighbor-noise-evidence.html',
    },
    'th': {
        'badge_s1': 'ขั้นตอนที่ 1 · เลือกสถานการณ์เสียง',
        'title_s1': 'เลือกสถานการณ์เสียงรบกวนที่คุณพบ',
        'desc_s1': 'โหลดค่าขีดจำกัดมาตรฐาน กฎการรวบรวมหลักฐาน และแบบฟอร์มข้อร้องเรียนที่ตรงกับกรณีของคุณ',
        'chip_neighbor': ('🏠', 'เสียงเพื่อนบ้าน', 'เสียงเดิน กระแทก เบส ท่อสั่น'),
        'chip_construction': ('🚧', 'งานก่อสร้างต่อเติม', 'เจาะ ทุบ ทำงานนอกเวลา'),
        'chip_street': ('🍻', 'ร้านค้าและถนน', 'เสียงเบสสถานบันเทิง พัดลมระบายอากาศ'),
        'chip_rental': ('📋', 'ข้อพิพาทสัญญาเช่า', 'หลักฐานการยกเลิกสัญญา ขอคืนเงินมัดจำ'),
        'input_ph': 'อธิบายเสียงรบกวน (เช่น เสียงลิฟต์สั่นตอนกลางคืน)...',
        'btn_apply': 'นำไปใช้',
        'meta_1': 'เริ่มทันทีใน 1 คลิก', 'meta_1_sub': 'ไม่ต้องโหลดแอป',
        'meta_2': 'ไม่ส่งข้อมูลขึ้นคลาวด์',
        'meta_3': 'ส่งออกชุดหลักฐาน PDF / CSV',
        'badge_s2': 'ขั้นตอนที่ 2 · สายพานรวบรวมหลักฐาน',
        'title_s2': 'แม่แบบหลักฐานเสียงรบกวนเพื่อนบ้าน',
        'desc_s2': 'ปรับแต่งสำหรับเสียงเดินบนเพดาน ดนตรี/ทีวี สัตว์เลี้ยง และการสั่นของระบบปรับอากาศ',
        'lbl_day': 'มาตรฐานกลางวัน', 'val_day': '≤ 55 dB',
        'lbl_night': 'มาตรฐานกลางคืน', 'val_night': '≤ 45 dB',
        'lbl_metric': 'ดัชนีหลัก', 'val_metric': 'LAeq + L10',
        'lbl_tamper': 'ความสมบูรณ์', 'val_tamper': 'GPS + SHA-256',
        'step_1': 'โหลดโปรไฟล์เสียงรบกวนที่อยู่อาศัยแล้ว',
        'step_2': 'เริ่มต้นตัวกรอง A-weighting และการตอบสนอง',
        'step_3': 'ประมวลผลในเครื่องโดยไม่ต้องส่งขึ้นคลาวด์',
        'step_4': 'พร้อม — เริ่มบันทึกเพื่อจัดทำหลักฐานข้อร้องเรียน',
        'btn_cta': 'เริ่มบันทึกหลักฐานเสียง',
        'btn_guide': 'คู่มือการจัดการปัญหา',
        'guide_link': '../use-cases/neighbor-noise-evidence.html',
    }
}

def generate_workbench_html(cfg):
    return f"""      <div class="hero-workbench reveal" id="scenario-workbench">
        <!-- Left Column: Scenario Selector -->
        <div class="workbench-card">
          <div class="workbench-header">
            <span class="card-badge">{cfg['badge_s1']}</span>
            <h3>{cfg['title_s1']}</h3>
            <p>{cfg['desc_s1']}</p>
          </div>

          <div class="workbench-chips-grid" role="tablist">
            <button type="button" class="scenario-pill-btn active" data-scenario="neighbor" role="tab" aria-selected="true">
              <span class="scenario-pill-icon">{cfg['chip_neighbor'][0]}</span>
              <div class="scenario-pill-text">
                <strong>{cfg['chip_neighbor'][1]}</strong>
                <small>{cfg['chip_neighbor'][2]}</small>
              </div>
            </button>
            <button type="button" class="scenario-pill-btn" data-scenario="construction" role="tab" aria-selected="false">
              <span class="scenario-pill-icon">{cfg['chip_construction'][0]}</span>
              <div class="scenario-pill-text">
                <strong>{cfg['chip_construction'][1]}</strong>
                <small>{cfg['chip_construction'][2]}</small>
              </div>
            </button>
            <button type="button" class="scenario-pill-btn" data-scenario="street" role="tab" aria-selected="false">
              <span class="scenario-pill-icon">{cfg['chip_street'][0]}</span>
              <div class="scenario-pill-text">
                <strong>{cfg['chip_street'][1]}</strong>
                <small>{cfg['chip_street'][2]}</small>
              </div>
            </button>
            <button type="button" class="scenario-pill-btn" data-scenario="rental" role="tab" aria-selected="false">
              <span class="scenario-pill-icon">{cfg['chip_rental'][0]}</span>
              <div class="scenario-pill-text">
                <strong>{cfg['chip_rental'][1]}</strong>
                <small>{cfg['chip_rental'][2]}</small>
              </div>
            </button>
          </div>

          <form class="workbench-custom-row" data-wb-custom-form onsubmit="return false;">
            <input type="text" class="workbench-custom-input" data-wb-custom-input placeholder="{cfg['input_ph']}" autocomplete="off">
            <button type="submit" class="workbench-custom-btn" data-wb-custom-btn>
              <span>{cfg['btn_apply']}</span>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
            </button>
          </form>

          <div class="hero-meta" style="margin-top:10px;justify-content:flex-start">
            <span>✓ <strong>{cfg['meta_1']}</strong> · {cfg['meta_1_sub']}</span>
            <span>✓ <strong>{cfg['meta_2']}</strong></span>
            <span>✓ <strong>{cfg['meta_3']}</strong></span>
          </div>
        </div>

        <!-- Right Column: Live Pipeline Preview & Launch -->
        <div class="workbench-card">
          <div class="workbench-header">
            <span class="card-badge" style="color:var(--accent)">{cfg['badge_s2']}</span>
            <h3 id="wb-preview-title">{cfg['title_s2']}</h3>
            <p id="wb-preview-desc">{cfg['desc_s2']}</p>
          </div>

          <div class="workbench-specs-row" id="wb-specs">
            <div class="wb-spec-cell">
              <span>{cfg['lbl_day']}</span>
              <strong id="wb-day">{cfg['val_day']}</strong>
            </div>
            <div class="wb-spec-cell">
              <span>{cfg['lbl_night']}</span>
              <strong id="wb-night">{cfg['val_night']}</strong>
            </div>
            <div class="wb-spec-cell">
              <span>{cfg['lbl_metric']}</span>
              <strong id="wb-metric">{cfg['val_metric']}</strong>
            </div>
            <div class="wb-spec-cell">
              <span>{cfg['lbl_tamper']}</span>
              <strong id="wb-tamper" style="color:var(--accent)">{cfg['val_tamper']}</strong>
            </div>
          </div>

          <div class="live-steps" id="wb-steps">
            <div class="live-step" data-state="done"><span class="dot" aria-hidden="true">✓</span><span id="wb-s1">{cfg['step_1']}</span></div>
            <div class="live-step" data-state="done"><span class="dot" aria-hidden="true">✓</span><span id="wb-s2">{cfg['step_2']}</span></div>
            <div class="live-step" data-state="done"><span class="dot" aria-hidden="true">✓</span><span id="wb-s3">{cfg['step_3']}</span></div>
            <div class="live-step" data-state="active"><span class="dot" aria-hidden="true">●</span><span id="wb-s4">{cfg['step_4']}</span></div>
          </div>

          <div class="workbench-actions-row">
            <a class="button primary" id="wb-cta" href="../soundtest.html?scenario=neighbor">
              <span>{cfg['btn_cta']}</span>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14"/><path d="M13 6l6 6-6 6"/></svg>
            </a>
            <a class="button ghost" id="wb-guide" href="{cfg['guide_link']}">{cfg['btn_guide']}</a>
          </div>
        </div>
      </div>"""

for loc, cfg in WORKBENCH_HTML.items():
    file_path = os.path.join(ROOT, loc, 'index.html')
    if not os.path.exists(file_path):
        continue
    with open(file_path, 'r', encoding='utf-8') as f:
        html = f.read()

    # Check if already has hero-workbench
    if 'id="scenario-workbench"' in html:
        print(f"[{loc}] Already has scenario-workbench")
        continue

    # Replace old <div class="hero-search reveal" ...> ... </div>
    # with generate_workbench_html(cfg)
    pattern = r'(<div class="hero-search reveal"[^>]*>[\s\S]*?</div>\s*</div>)'
    m = re.search(pattern, html)
    if m:
        wb_html = generate_workbench_html(cfg)
        html = html[:m.start()] + wb_html + html[m.end():]
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(html)
        print(f"[{loc}] Replaced hero-search with modern 2-step scenario-workbench!")
    else:
        print(f"[{loc}] Could not find hero-search pattern to replace")

print("Homepage workbench upgrade completed successfully.")
