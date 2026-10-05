#!/usr/bin/env python3
"""
scripts/build_all_localized_use_cases.py

Generates and upgrades all 42 use-case scenario pages across 7 international languages:
- es (Spanish)
- de (German)
- fr (French)
- ja (Japanese)
- ko (Korean)
- th (Thai)
- vi (Vietnamese)

Matches the modern, conversion-optimized architecture of the English and Chinese editions:
1. Hero with device frame and 4 stat chips
2. Scenario decibel benchmark reference table with color-coded badges
3. 4-step defensible evidence workflow
4. 6-card feature spotlight grid
5. 4 evidentiary rules strip
6. Expandable accordion FAQ with explicit SVG chevron dimensions
7. Conversion CTA band with Creem annual / single report links
8. Cross-scenario navigation pills
9. Standardized footer with language matrix and support contacts
10. Fully localized SEO titles, meta descriptions, and JSON-LD schema
"""

import os
import json

LOCALES = ['es', 'de', 'fr', 'ja', 'ko', 'th', 'vi']

ALL_LOCALES = ['en', 'zh', 'es', 'fr', 'de', 'ja', 'ko', 'vi', 'th']

SCENARIO_KEYS = [
    'neighbor-noise-evidence',
    'bar-street-disturbance',
    'construction-noise-monitoring',
    'property-noise-complaint-report',
    'rental-dispute-evidence',
    'workplace-noise-inspection'
]

NAV_DATA = {
    'en': {'home': 'Home', 'open_app': 'Open App', 'samples': 'Samples', 'accuracy': 'Accuracy', 'standards': 'Standards', 'noise_levels': 'Noise Levels', 'account': 'Account', 'upgrade': 'Upgrade Pro'},
    'zh': {'home': '首页', 'open_app': '打开工具', 'samples': '报告样例', 'accuracy': '计量精度', 'standards': '噪声标准', 'noise_levels': '分贝等级', 'account': '账户中心', 'upgrade': '升级专业版'},
    'es': {'home': 'Inicio', 'open_app': 'Abrir app', 'samples': 'Muestras', 'accuracy': 'Precisión', 'standards': 'Estándares', 'noise_levels': 'Niveles de ruido', 'account': 'Mi cuenta', 'upgrade': 'Mejorar a Pro'},
    'de': {'home': 'Start', 'open_app': 'Tool öffnen', 'samples': 'Messberichte', 'accuracy': 'Genauigkeit', 'standards': 'Normen', 'noise_levels': 'Dezibel-Tabelle', 'account': 'Konto', 'upgrade': 'Pro freischalten'},
    'fr': {'home': 'Accueil', 'open_app': 'Ouvrir l’outil', 'samples': 'Échantillons', 'accuracy': 'Précision', 'standards': 'Normes', 'noise_levels': 'Niveaux de bruit', 'account': 'Compte', 'upgrade': 'Passer à Pro'},
    'ja': {'home': 'ホーム', 'open_app': '測定ツール', 'samples': 'サンプル', 'accuracy': '測定精度', 'standards': '環境基準', 'noise_levels': 'デシベル基準', 'account': 'アカウント', 'upgrade': 'Pro版にアップグレード'},
    'ko': {'home': '홈', 'open_app': '측정 도구', 'samples': '샘플 리포트', 'accuracy': '정밀도', 'standards': '소음 기준', 'noise_levels': '데시벨 기준', 'account': '계정', 'upgrade': 'Pro 업그레이드'},
    'th': {'home': 'หน้าแรก', 'open_app': 'เปิดเครื่องมือ', 'samples': 'ตัวอย่างรายงาน', 'accuracy': 'ความแม่นยำ', 'standards': 'มาตรฐานเสียง', 'noise_levels': 'ระดับเดซิเบล', 'account': 'บัญชีผู้ใช้', 'upgrade': 'อัปเกรดเป็น Pro'},
    'vi': {'home': 'Trang chủ', 'open_app': 'Mở ứng dụng', 'samples': 'Mẫu báo cáo', 'accuracy': 'Độ chính xác', 'standards': 'Quy chuẩn', 'noise_levels': 'Mức decibel', 'account': 'Tài khoản', 'upgrade': 'Nâng cấp Pro'}
}

COMMON_LABELS = {
    'es': {
        'cta_measure': 'Empezar a registrar ruido',
        'cta_samples': 'Ver ejemplos de informes',
        'cta_free_band': 'Iniciar medición gratuita',
        'cta_pro_band': 'Obtener Pro Anual · $24.99',
        'cta_single_note': '¿Solo necesitas un informe? <a href="https://www.creem.io/payment/prod_2Xc2ichF1Xk2mmzrhBxyYC" target="_blank" rel="noopener">Desbloquear informe oficial individual por $1.99 &rarr;</a>',
        'explore_other': 'Explorar otros escenarios',
        'explore_sub': 'Guías de documentación acústica adaptadas a cada situación',
        'disclaimer': 'SOUNDTEST.PRO es una herramienta de estimación acústica civil, no un sonómetro legalmente certificado. Para disputas judiciales formales, verifique con técnicos homologados.',
        'sec_method': 'Metodología probada',
        'sec_features': 'Capacidades técnicas',
        'sec_rules': 'Consejos prácticos',
        'sec_table': 'Referencia acústica',
        'badge_safe': 'Nivel seguro',
        'badge_mild': 'Límite permisible',
        'badge_moderate': 'Zona de molestia',
        'badge_severe': 'Infracción grave',
        'prod_title': 'Producto',
        'res_title': 'Recursos',
        'legal_title': 'Legal',
        'lang_title': 'Idioma',
        'footer_desc': 'Plataforma de prueba acústica para documentación global de ruido. 100% en el navegador, local-first y multilingüe.',
        'support_note': 'Atención al cliente: <a href="mailto:support@soundtest.pro" style="color:var(--accent);text-underline-offset:2px;font-weight:600;">support@soundtest.pro</a> (Respuesta en 24 horas)'
    },
    'de': {
        'cta_measure': 'Lärmmessung starten',
        'cta_samples': 'Musterberichte ansehen',
        'cta_free_band': 'Kostenlose Messung starten',
        'cta_pro_band': 'Pro Jahreszugang sichern · 24,99 $',
        'cta_single_note': 'Benötigen Sie nur einen Einzelbericht? <a href="https://www.creem.io/payment/prod_2Xc2ichF1Xk2mmzrhBxyYC" target="_blank" rel="noopener">Offiziellen Einzelbericht für 1,99 $ freischalten &rarr;</a>',
        'explore_other': 'Weitere Lärmszenarien',
        'explore_sub': 'Praxisnahe Dokumentationsleitfäden für jede Konfliktsituation',
        'disclaimer': 'SOUNDTEST.PRO ist ein ziviles Dokumentationswerkzeug und kein geeichter Schallpegelmesser. Für gerichtliche Verfahren sind amtlich zertifizierte Gutachten erforderlich.',
        'sec_method': 'Erprobte Vorgehensweise',
        'sec_features': 'Spezialfunktionen',
        'sec_rules': 'Praxistipps',
        'sec_table': 'Akustische Richtwerte',
        'badge_safe': 'Normbereich',
        'badge_mild': 'Grenzbereich',
        'badge_moderate': 'Störbereich',
        'badge_severe': 'Erhebliche Belästigung',
        'prod_title': 'Produkt',
        'res_title': 'Ressourcen',
        'legal_title': 'Rechtliches',
        'lang_title': 'Sprache',
        'footer_desc': 'Akustische Beweishilfe für weltweite Lärmdokumentation. Browserbasiert, datenschutzfreundlich und mehrsprachig.',
        'support_note': 'Kundensupport: <a href="mailto:support@soundtest.pro" style="color:var(--accent);text-underline-offset:2px;font-weight:600;">support@soundtest.pro</a> (Antwort innerhalb 24 Std.)'
    },
    'fr': {
        'cta_measure': 'Commencer l’enregistrement',
        'cta_samples': 'Voir des exemples de rapports',
        'cta_free_band': 'Lancer la mesure gratuite',
        'cta_pro_band': 'Obtenir Pro Annuel · 24,99 $',
        'cta_single_note': 'Besoin d’un seul rapport ? <a href="https://www.creem.io/payment/prod_2Xc2ichF1Xk2mmzrhBxyYC" target="_blank" rel="noopener">Débloquer un rapport certifié unique pour 1,99 $ &rarr;</a>',
        'explore_other': 'Explorer d’autres scénarios',
        'explore_sub': 'Guides de documentation acoustique adaptés à chaque situation',
        'disclaimer': 'SOUNDTEST.PRO est un outil civil d’estimation acoustique, non un sonomètre certifié. Les procédures judiciaires formelles exigent des constats par techniciens agréés.',
        'sec_method': 'Méthodologie éprouvée',
        'sec_features': 'Fonctionnalités clés',
        'sec_rules': 'Conseils pratiques',
        'sec_table': 'Références acoustiques',
        'badge_safe': 'Zone conforme',
        'badge_mild': 'Seuil autorisé',
        'badge_moderate': 'Nuisance avérée',
        'badge_severe': 'Infraction majeure',
        'prod_title': 'Produit',
        'res_title': 'Ressources',
        'legal_title': 'Mentions légales',
        'lang_title': 'Langue',
        'footer_desc': 'Aide à la constitution de preuves acoustiques. 100% dans le navigateur, axé sur la confidentialité locale.',
        'support_note': 'Support client : <a href="mailto:support@soundtest.pro" style="color:var(--accent);text-underline-offset:2px;font-weight:600;">support@soundtest.pro</a> (Réponse sous 24 h)'
    },
    'ja': {
        'cta_measure': '騒音の記録を開始する',
        'cta_samples': '公式レポート例を見る',
        'cta_free_band': '無料ですぐに測定を開始',
        'cta_pro_band': 'Pro年間プランを入手 · $24.99/年',
        'cta_single_note': '単発の提出レポートのみが必要ですか？ <a href="https://www.creem.io/payment/prod_2Xc2ichF1Xk2mmzrhBxyYC" target="_blank" rel="noopener">公式PDFレポートを1通のみ $1.99 で購入 &rarr;</a>',
        'explore_other': 'その他の騒音トラブル事例',
        'explore_sub': '状況別の実践的騒音証拠収集・解決ガイド',
        'disclaimer': 'SOUNDTEST.PROは一般市民向けの客観的記録支援ツールであり、計量法上の検定合格器ではありません。正式な法的提訴・行政処分には認定技術者による計量証明をご活用ください。',
        'sec_method': '実証済みの証拠収集手順',
        'sec_features': '専用設計の強力な機能',
        'sec_rules': '調停・交渉を有利に進める鉄則',
        'sec_table': '基準値・法令限度比較表',
        'badge_safe': '基準内・静粛',
        'badge_mild': '夜間許容限度',
        'badge_moderate': '受忍限度超過',
        'badge_severe': '重大な法令違反',
        'prod_title': 'プロダクト',
        'res_title': 'リソース',
        'legal_title': '法的情報',
        'lang_title': '言語切り替え',
        'footer_desc': '世界基準の騒音証拠記録プラットフォーム。ブラウザ完結・完全ローカル保存・多言語対応。',
        'support_note': 'カスタマーサポート：<a href="mailto:support@soundtest.pro" style="color:var(--accent);text-underline-offset:2px;font-weight:600;">support@soundtest.pro</a>（24時間以内に回答）'
    },
    'ko': {
        'cta_measure': '소음 기록 시작하기',
        'cta_samples': '공식 리포트 예시 보기',
        'cta_free_band': '무료 소음 측정 시작',
        'cta_pro_band': 'Pro 연간 이용권 구매 · $24.99',
        'cta_single_note': '단 1회의 제출용 리포트만 필요하신가요? <a href="https://www.creem.io/payment/prod_2Xc2ichF1Xk2mmzrhBxyYC" target="_blank" rel="noopener">$1.99로 단건 공식 보고서 잠금해제 &rarr;</a>',
        'explore_other': '다른 소음 분쟁 시나리오',
        'explore_sub': '각 분쟁 상황에 맞춘 체계적인 소음 증거 수집 가이드',
        'disclaimer': 'SOUNDTEST.PRO는 민간 일상 기록 및 증거 보존 도구이며, 국가 형식승인을 득한 법정 소음측정기가 아닙니다. 법원 소송 및 정식 과태료 청구 시에는 공인 계측 업체의 검측을 병행하시기 바랍니다.',
        'sec_method': '입증력 높은 4단계 절차',
        'sec_features': '특화된 증빙 엔진',
        'sec_rules': '중재 및 협의 핵심 수칙',
        'sec_table': '소음 기준치 대조표',
        'badge_safe': '정상 환경',
        'badge_mild': '야간 허용 한도',
        'badge_moderate': '수인한도 초과',
        'badge_severe': '중대한 법적 위반',
        'prod_title': '제품',
        'res_title': '참고자료',
        'legal_title': '법적 고지',
        'lang_title': '언어 선택',
        'footer_desc': '글로벌 소음 증거 기록 플랫폼. 브라우저 로컬 저장소 우선 및 다국어 지원.',
        'support_note': '고객 지원: <a href="mailto:support@soundtest.pro" style="color:var(--accent);text-underline-offset:2px;font-weight:600;">support@soundtest.pro</a> (24시간 내 회신)'
    },
    'th': {
        'cta_measure': 'เริ่มบันทึกเสียงรบกวน',
        'cta_samples': 'ดูตัวอย่างรายงานทางการ',
        'cta_free_band': 'เริ่มตรวจวัดเสียงฟรี',
        'cta_pro_band': 'ซื้อแพ็กเกจ Pro รายปี · $24.99',
        'cta_single_note': 'ต้องการรายงานเพียงฉบับเดียว? <a href="https://www.creem.io/payment/prod_2Xc2ichF1Xk2mmzrhBxyYC" target="_blank" rel="noopener">ปลดล็อกรายงานเดี่ยวราคา $1.99 &rarr;</a>',
        'explore_other': 'สำรวจสถานการณ์เสียงอื่นๆ',
        'explore_sub': 'คู่มือรวบรวมหลักฐานเสียงที่ออกแบบมาเพื่อทุกสถานการณ์',
        'disclaimer': 'SOUNDTEST.PRO เป็นเครื่องมือช่วยบันทึกหลักฐานเบื้องต้นสำหรับประชาชน มิใช่เครื่องวัดเสียงที่ผ่านการรับรองทางมาตรวิทยาตามกฎหมาย การดำเนินคดีทางการควรใช้การตรวจวัดร่วมกับผู้เชี่ยวชาญ',
        'sec_method': 'ขั้นตอนรวบรวมหลักฐาน',
        'sec_features': 'ฟังก์ชันตรวจวัดขั้นสูง',
        'sec_rules': 'หลักการเจรจาไกล่เกลี่ย',
        'sec_table': 'ตารางเปรียบเทียบค่าเดซิเบล',
        'badge_safe': 'ระดับปกติ',
        'badge_mild': 'ขีดจำกัดกลางคืน',
        'badge_moderate': 'เกินเกณฑ์รบกวน',
        'badge_severe': 'ละเมิดกฎหมายรุนแรง',
        'prod_title': 'ผลิตภัณฑ์',
        'res_title': 'ข้อมูลอ้างอิง',
        'legal_title': 'ข้อกำหนดทางกฎหมาย',
        'lang_title': 'ภาษา',
        'footer_desc': 'แพลตฟอร์มบันทึกหลักฐานเสียงระดับมืออาชีพ ใช้งานผ่านเบราว์เซอร์ ไม่ต้องติดตั้ง รักษาความเป็นส่วนตัว.',
        'support_note': 'ฝ่ายสนับสนุนลูกค้า: <a href="mailto:support@soundtest.pro" style="color:var(--accent);text-underline-offset:2px;font-weight:600;">support@soundtest.pro</a> (ตอบกลับภายใน 24 ชม.)'
    },
    'vi': {
        'cta_measure': 'Bắt đầu ghi nhận tiếng ồn',
        'cta_samples': 'Xem mẫu báo cáo chính thức',
        'cta_free_band': 'Bắt đầu đo lường miễn phí',
        'cta_pro_band': 'Đăng ký Pro Hằng năm · $24.99',
        'cta_single_note': 'Bạn chỉ cần một báo cáo duy nhất? <a href="https://www.creem.io/payment/prod_2Xc2ichF1Xk2mmzrhBxyYC" target="_blank" rel="noopener">Mở khóa 1 báo cáo chính thức chỉ $1.99 &rarr;</a>',
        'explore_other': 'Khám phá các tình huống khác',
        'explore_sub': 'Hướng dẫn thu thập chứng cứ âm học phù hợp cho từng hoàn cảnh',
        'disclaimer': 'SOUNDTEST.PRO là công cụ ghi nhận chứng cứ dân sự, không phải máy đo âm thanh kiểm định tư pháp. Các thủ tục pháp lý chính thức cần đối chiếu bằng máy đo chuẩn Class 1/2.',
        'sec_method': 'Quy trình thu thập chứng cứ',
        'sec_features': 'Tính năng chuyên biệt',
        'sec_rules': 'Quy tắc vàng khi hòa giải',
        'sec_table': 'Bảng đối chiếu quy chuẩn decibel',
        'badge_safe': 'Mức bình thường',
        'badge_mild': 'Giới hạn ban đêm',
        'badge_moderate': 'Vượt ngưỡng khó chịu',
        'badge_severe': 'Vi phạm nghiêm trọng',
        'prod_title': 'Sản phẩm',
        'res_title': 'Tài nguyên',
        'legal_title': 'Pháp lý',
        'lang_title': 'Ngôn ngữ',
        'footer_desc': 'Nền tảng hỗ trợ chứng cứ âm thanh toàn cầu. Chạy trực tiếp trên trình duyệt, bảo mật cục bộ.',
        'support_note': 'Hỗ trợ khách hàng: <a href="mailto:support@soundtest.pro" style="color:var(--accent);text-underline-offset:2px;font-weight:600;">support@soundtest.pro</a> (Phản hồi trong 24 giờ)'
    }
}

PILL_DATA = {
    'neighbor-noise-evidence': {
        'icon': '🏢',
        'en': ('Neighbor & Apartment Noise', 'Stomping, music, barking'),
        'es': ('Ruido vecinal y de pisos', 'Pisadas, música, ladridos'),
        'de': ('Wohnungs- & Nachbarschaftslärm', 'Trampeln, Musik, Hundegebell'),
        'fr': ('Bruits de voisinage', 'Pas au plafond, musique, aboiements'),
        'ja': ('近隣・上階の生活騒音', '足音、重低音、ペット鳴き声'),
        'ko': ('이웃 및 아파트 층간소음', '발망치, 우퍼 저음, 반려견 짖음'),
        'th': ('เสียงรบกวนข้างห้องและคอนโด', 'เดินลงส้น ลากของ เบสทึบๆ'),
        'vi': ('Tiếng ồn hàng xóm & căn hộ', 'Nện sàn, âm trầm, chó sủa')
    },
    'bar-street-disturbance': {
        'icon': '🍻',
        'en': ('Bar & Street Disturbance', 'Patios, bass vibration, nightlife'),
        'es': ('Bares y ruido de calle', 'Terrazas, vibración de graves, fiesta'),
        'de': ('Bars & Straßenbelästigung', 'Terrassen, Bassdröhnen, Nachtleben'),
        'fr': ('Bars & nuisances de rue', 'Terrasses, basses sourdes, vie nocturne'),
        'ja': ('飲食店・街頭騒音', 'テラス席、重低音共振、深夜の喧騒'),
        'ko': ('주점 및 야간 거리 소음', '야외 테이블, 우퍼 진동, 심야 소란'),
        'th': ('สถานบันเทิงและถนนยามค่ำคืน', 'ร้านเหล้า เสียงเบส เสียงรบกวน'),
        'vi': ('Quán bar & tiếng ồn đường phố', 'Kê bàn ngoài trời, dội âm trầm')
    },
    'construction-noise-monitoring': {
        'icon': '🏗️',
        'en': ('Construction & Renovation', 'Drilling, curfews, heavy machinery'),
        'es': ('Obras y reformas', 'Taladros, horarios límite, maquinaria'),
        'de': ('Baustellen & Umbauarbeiten', 'Bohren, Ruhezeiten, Schwermaschinen'),
        'fr': ('Chantiers & rénovation', 'Perceuse, horaires interdits, engins'),
        'ja': ('工事・解体・リフォーム騒音', 'ドリル、早朝・休日工事、重機振動'),
        'ko': ('공사 및 리모델링 소음', '드릴, 주말/야간 작업, 중장비 소음'),
        'th': ('งานก่อสร้างและต่อเติมอาคาร', 'เสียงเจาะ สว่าน ทำงานนอกเวลา'),
        'vi': ('Thi công & cải tạo công trình', 'Máy khoan, làm việc quá giờ, máy ủi')
    },
    'rental-dispute-evidence': {
        'icon': '🏠',
        'en': ('Rental Dispute & Lease Break', 'Tenant rights, quiet enjoyment'),
        'es': ('Disputas de alquiler y rescisión', 'Derechos del inquilino, fianza'),
        'de': ('Mietstreit & Kündigungsbeweis', 'Mietminderung, Wohnwertminderung'),
        'fr': ('Litiges locatifs & résiliation', 'Droits du locataire, jouissance paisible'),
        'ja': ('賃貸トラブル・契約解除の証拠', '居住環境侵害、敷金返還、解約交渉'),
        'ko': ('임대차 분쟁 및 계약 해지', '주거 평온권 침해, 보증금 반환'),
        'th': ('ข้อพิพาทการเช่าและยกเลิกสัญญา', 'สิทธิผู้เช่า คืนเงินมัดจำ'),
        'vi': ('Tranh chấp thuê nhà & chấm dứt hợp đồng', 'Quyền người thuê, đòi lại cọc')
    },
    'property-noise-complaint-report': {
        'icon': '📋',
        'en': ('Property Management & HOA', 'Building logs, complaint visits'),
        'es': ('Administración de fincas y comunidades', 'Partes de queja, visitas in situ'),
        'de': ('Hausverwaltung & Eigentümergemeinschaft', 'Lärmprotokolle, Vor-Ort-Prüfung'),
        'fr': ('Syndics & gestion d’immeubles', 'Registres d’incidents, contre-visites'),
        'ja': ('管理会社・マンション管理組合', '棟・部屋別の苦情対応・再調査記録'),
        'ko': ('관리사무소 및 입주자대표회의', '동·호수별 민원 일지, 현장 확인'),
        'th': ('นิติบุคคลอาคารชุดและผู้จัดการตึก', 'บันทึกข้อร้องเรียน บันทึกตรวจซ้ำ'),
        'vi': ('Ban quản lý tòa nhà & chung cư', 'Sổ nhật ký khiếu nại, biên bản kiểm tra')
    },
    'workplace-noise-inspection': {
        'icon': '🏭',
        'en': ('Workplace & Industrial Noise', 'OSHA compliance, open offices'),
        'es': ('Ruido laboral e industrial', 'Prevención de riesgos, oficinas abiertas'),
        'de': ('Arbeitsplatz & Gewerbelärm', 'Arbeitsschutz, Großraumbüros, Werkstätten'),
        'fr': ('Bruit au travail & industrie', 'Santé au travail, open spaces, ateliers'),
        'ja': ('職場・工場・オフィス騒音巡視', '労働安全衛生基準、執務室環境'),
        'ko': ('사업장 및 직장 소음 점검', '산업안전보건 점검, 오피스 환경'),
        'th': ('เสียงในสถานที่ทำงานและโรงงาน', 'ความปลอดภัยอาชีวอนามัย ออฟฟิศ'),
        'vi': ('Tiếng ồn nơi làm việc & nhà xưởng', 'An toàn lao động, văn phòng mở')
    }
}

print("Base setup loaded successfully.")
