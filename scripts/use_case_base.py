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

SIDEBAR_I18N = {
    'en': {
        'meter_title': 'Online Decibel Meter',
        'meter_desc': 'Real-time IEC 61672 sound level monitoring with A/C weighting curves directly in your browser.',
        'meter_btn': 'Launch Live Meter',
        'meter_sentry': 'Overnight Sentry Mode',
        'meter_privacy': '100% In-Browser · Zero Cloud Uploads',
        'toc_title': 'On This Page',
        'toc_benchmarks': 'Decibel Benchmarks',
        'toc_workflow': '4-Step Evidence Workflow',
        'toc_capabilities': 'Technical Capabilities',
        'toc_rules': 'Evidentiary Rules',
        'toc_faq': 'Frequently Asked Questions',
        'cheat_title': 'Acoustic Reference Scale',
        'cheat_safe': 'Quiet bedroom ambient',
        'cheat_mild': 'Nighttime quiet limit',
        'cheat_mod': 'Actionable disturbance',
        'cheat_sev': 'Severe statutory violation',
        'toolkit_badge': 'EVIDENTIARY DOSSIER',
        'toolkit_title': 'Dispute Notice & Dossier Kit',
        'toolkit_desc': 'Pair your decibel recordings with pre-drafted mediation letters and cryptographic SHA-256 PDF reports.',
        'toolkit_btn': 'View Report Samples',
        'trust_hash': 'SHA-256 Digital Stamp',
        'trust_standard': 'IEC 61672 Curve Compliant',
        'trust_local': '100% Local (IndexedDB)'
    },
    'zh': {
        'meter_title': '在线分贝测量仪',
        'meter_desc': '遵循 IEC 61672 国际标准的 A/C 计权实时声级检测，浏览器即开即测。',
        'meter_btn': '打开实时测量仪',
        'meter_sentry': '通宵哨兵监听模式',
        'meter_privacy': '100% 本地隐私 · 无需安装',
        'toc_title': '本页内容导览',
        'toc_benchmarks': '分贝基准对照表',
        'toc_workflow': '4步闭环举证流程',
        'toc_capabilities': '专业核心功能',
        'toc_rules': '协商调解维权铁律',
        'toc_faq': '常见问题解答 (FAQ)',
        'cheat_title': '环境噪声速查标尺',
        'cheat_safe': '卧室安静背景底噪',
        'cheat_mild': '夜间法定静音上限',
        'cheat_mod': '受忍限度生活干扰',
        'cheat_sev': '重大超标违法侵权',
        'toolkit_badge': '证据公信力套件',
        'toolkit_title': '调解通告与举证报告',
        'toolkit_desc': '生成带有 SHA-256 防篡改时间戳的官方 PDF 报告，并配套专业调解交涉文书模板。',
        'toolkit_btn': '查看报告样例',
        'trust_hash': 'SHA-256 数字哈希防伪',
        'trust_standard': 'IEC 61672 计权曲线对齐',
        'trust_local': '100% 浏览器本地存储'
    },
    'es': {
        'meter_title': 'Sonómetro en línea',
        'meter_desc': 'Monitorización de decibelios en tiempo real con curvas de ponderación A/C según IEC 61672.',
        'meter_btn': 'Abrir sonómetro en vivo',
        'meter_sentry': 'Modo Centinela nocturno',
        'meter_privacy': '100% en navegador · Sin descargas',
        'toc_title': 'En esta página',
        'toc_benchmarks': 'Límites de decibelios',
        'toc_workflow': 'Flujo de pruebas en 4 pasos',
        'toc_capabilities': 'Capacidades técnicas',
        'toc_rules': 'Reglas de prueba legal',
        'toc_faq': 'Preguntas frecuentes (FAQ)',
        'cheat_title': 'Escala de referencia acústica',
        'cheat_safe': 'Ambiente de dormitorio silencioso',
        'cheat_mild': 'Límite de horario nocturno',
        'cheat_mod': 'Nuisance o molestia denunciable',
        'cheat_sev': 'Infracción legal grave',
        'toolkit_badge': 'DOSIER PROBATORIO',
        'toolkit_title': 'Kit de cartas y dosier legal',
        'toolkit_desc': 'Descarga informes PDF oficiales con firma digital SHA-256 y cartas formales de reclamación.',
        'toolkit_btn': 'Ver ejemplos de informes',
        'trust_hash': 'Sello digital SHA-256',
        'trust_standard': 'Curvas conformes a IEC 61672',
        'trust_local': '100% local (IndexedDB)'
    },
    'de': {
        'meter_title': 'Online-Schallpegelmesser',
        'meter_desc': 'Echtzeit-Dezibelmessung mit A/C-Bewertungskurven nach IEC 61672 direkt im Browser.',
        'meter_btn': 'Messung live starten',
        'meter_sentry': 'Automatischer Nachtwächter',
        'meter_privacy': '100% im Browser · Keine Installation',
        'toc_title': 'Auf dieser Seite',
        'toc_benchmarks': 'Akustische Richtwerte',
        'toc_workflow': '4-Stufen-Beweisverfahren',
        'toc_capabilities': 'Technische Leistungsmerkmale',
        'toc_rules': 'Praxisregeln für die Schlichtung',
        'toc_faq': 'Häufig gestellte Fragen (FAQ)',
        'cheat_title': 'Dezibel-Schnellübersicht',
        'cheat_safe': 'Ruhiges Schlafzimmer / Grundrauschen',
        'cheat_mild': 'Gesetzliche Nachtruhe-Grenze',
        'cheat_mod': 'Erhebliche Belästigung',
        'cheat_sev': 'Schwere Rechtsverletzung',
        'toolkit_badge': 'BEWEISMITTEL-PAKET',
        'toolkit_title': 'Musterbriefe & Lärmprotokoll',
        'toolkit_desc': 'Erstellen Sie offizielle PDF-Dossiers mit SHA-256-Prüfsumme und rechtssichere Abmahnschreiben.',
        'toolkit_btn': 'Musterberichte ansehen',
        'trust_hash': 'SHA-256 Manipulationsschutz',
        'trust_standard': 'IEC 61672 konforme Kurven',
        'trust_local': '100% lokal im Browser'
    },
    'fr': {
        'meter_title': 'Sonomètre en ligne',
        'meter_desc': 'Mesure des décibels en temps réel avec courbes de pondération A/C selon IEC 61672.',
        'meter_btn': 'Lancer la mesure en direct',
        'meter_sentry': 'Mode Sentinelle nocturne',
        'meter_privacy': '100% dans le navigateur · Sans installation',
        'toc_title': 'Sur cette page',
        'toc_benchmarks': 'Seuils et normes acoustiques',
        'toc_workflow': 'Méthodologie en 4 étapes',
        'toc_capabilities': 'Fonctionnalités avancées',
        'toc_rules': 'Règles de valeur probante',
        'toc_faq': 'Questions fréquentes (FAQ)',
        'cheat_title': 'Échelle de référence acoustique',
        'cheat_safe': 'Ambiance de chambre calme',
        'cheat_mild': 'Limite légale nocturne',
        'cheat_mod': 'Nuisance sonore avérée',
        'cheat_sev': 'Infraction réglementaire majeure',
        'toolkit_badge': 'DOSSIER PROBATOIRE',
        'toolkit_title': 'Kit de lettres et dossier officiel',
        'toolkit_desc': 'Générez des rapports PDF certifiés avec empreinte SHA-256 et modèles de mise en demeure.',
        'toolkit_btn': 'Consulter les exemples',
        'trust_hash': 'Empreinte numérique SHA-256',
        'trust_standard': 'Courbes conformes IEC 61672',
        'trust_local': '100% local (IndexedDB)'
    },
    'ja': {
        'meter_title': 'オンライン騒音測定器',
        'meter_desc': 'IEC 61672準拠のA/C特性によるリアルタイムデシベル測定。ブラウザ即起動。',
        'meter_btn': '今すぐ測定を開始する',
        'meter_sentry': '夜間自動見張りモード',
        'meter_privacy': '100% 端末内処理 · インストール不要',
        'toc_title': '目次ナビゲーション',
        'toc_benchmarks': '基準値・法令限度比較表',
        'toc_workflow': '4ステップ証拠化手順',
        'toc_capabilities': '専用設計の強力な機能',
        'toc_rules': '交渉を有利に進める鉄則',
        'toc_faq': 'よくある質問（FAQ）',
        'cheat_title': 'デシベル簡易基準スケール',
        'cheat_safe': '静粛な寝室の暗騒音',
        'cheat_mild': '夜間法令許容限度',
        'cheat_mod': '受忍限度超過の生活妨害',
        'cheat_sev': '重大な法令違反・健康被害',
        'toolkit_badge': '証拠力向上キット',
        'toolkit_title': '公式申立書＆PDF調書キット',
        'toolkit_desc': 'SHA-256改ざん防止ハッシュ付き公式PDFレポートと、管理会社・調停用提出書式。',
        'toolkit_btn': '公式レポート例を見る',
        'trust_hash': 'SHA-256 デジタル刻印',
        'trust_standard': 'IEC 61672 規格準拠',
        'trust_local': '100% ローカル保存'
    },
    'ko': {
        'meter_title': '온라인 데시벨 측정기',
        'meter_desc': 'IEC 61672 국제 규격 A/C 보정 회로를 통한 실시간 소음 측정. 브라우저 즉시 실행.',
        'meter_btn': '실시간 측정 시작하기',
        'meter_sentry': '야간 자동 센트리 모드',
        'meter_privacy': '100% 브라우저 로컬 · 설치 불필요',
        'toc_title': '목차 가이드',
        'toc_benchmarks': '소음 기준치 대조표',
        'toc_workflow': '4단계 증빙 수집 절차',
        'toc_capabilities': '특화된 증빙 엔진',
        'toc_rules': '중재 및 협의 핵심 수칙',
        'toc_faq': '자주 묻는 질문 (FAQ)',
        'cheat_title': '환경 소음 간이 기준 척도',
        'cheat_safe': '조용한 침실 배경 소음',
        'cheat_mild': '야간 법정 허용 한도',
        'cheat_mod': '수인한도 초과 생활 방해',
        'cheat_sev': '중대한 법적 위반 기준',
        'toolkit_badge': '법적 증거력 패키지',
        'toolkit_title': '공식 분쟁 통고문 &amp; 증거 조서',
        'toolkit_desc': 'SHA-256 위변조 방지 해시가 적용된 공식 PDF 리포트와 관리사무소 제출용 내용증명 서식.',
        'toolkit_btn': '공식 리포트 예시 보기',
        'trust_hash': 'SHA-256 무결성 디지털 인장',
        'trust_standard': 'IEC 61672 보정 곡선 준수',
        'trust_local': '100% 로컬 보안 저장'
    },
    'th': {
        'meter_title': 'เครื่องวัดระดับเดซิเบลออนไลน์',
        'meter_desc': 'ตรวจวัดระดับเสียงแบบเรียลไทม์ตามมาตรฐาน IEC 61672 ด้วย A/C-Weighting ในเบราว์เซอร์.',
        'meter_btn': 'เริ่มตรวจวัดเสียงสด',
        'meter_sentry': 'โหมดเฝ้าระวังอัตโนมัติตอนกลางคืน',
        'meter_privacy': '100% ในเบราว์เซอร์ · ไม่ต้องติดตั้ง',
        'toc_title': 'สารบัญในหน้านี้',
        'toc_benchmarks': 'ตารางเปรียบเทียบค่าเดซิเบล',
        'toc_workflow': 'ขั้นตอนรวบรวมหลักฐาน 4 ขั้น',
        'toc_capabilities': 'ฟังก์ชันตรวจวัดขั้นสูง',
        'toc_rules': 'หลักการเจรจาไกล่เกลี่ย',
        'toc_faq': 'คำถามที่พบบ่อย (FAQ)',
        'cheat_title': 'เกณฑ์อ้างอิงระดับเสียง',
        'cheat_safe': 'เสียงรบกวนต่ำในห้องนอน',
        'cheat_mild': 'ขีดจำกัดกฎหมายกลางคืน',
        'cheat_mod': 'เกินเกณฑ์รบกวนการอยู่อาศัย',
        'cheat_sev': 'ละเมิดเกณฑ์กฎหมายรุนแรง',
        'toolkit_badge': 'ชุดเอกสารหลักฐาน',
        'toolkit_title': 'หนังสือร้องเรียน &amp; รายงานทางการ',
        'toolkit_desc': 'สร้างรายงานสรุป PDF พร้อมรหัสตรวจสอบ SHA-256 และแบบฟอร์มหนังสือร้องเรียนมาตรฐาน.',
        'toolkit_btn': 'ดูตัวอย่างรายงาน',
        'trust_hash': 'รหัสตรวจสอบความถูกต้อง SHA-256',
        'trust_standard': 'มาตรฐานเส้นโค้ง IEC 61672',
        'trust_local': '100% บันทึกในเครื่อง (IndexedDB)'
    },
    'vi': {
        'meter_title': 'Máy đo decibel trực tuyến',
        'meter_desc': 'Đo mức âm thanh thời gian thực theo chuẩn IEC 61672 với bộ lọc A/C ngay trên trình duyệt.',
        'meter_btn': 'Mở máy đo trực tiếp',
        'meter_sentry': 'Chế độ Trực ban đêm tự động',
        'meter_privacy': '100% trong trình duyệt · Không cần cài đặt',
        'toc_title': 'Mục lục trang này',
        'toc_benchmarks': 'Bảng đối chiếu quy chuẩn decibel',
        'toc_workflow': 'Quy trình 4 bước thu thập chứng cứ',
        'toc_capabilities': 'Tính năng chuyên biệt',
        'toc_rules': 'Quy tắc vàng khi hòa giải',
        'toc_faq': 'Câu hỏi thường gặp (FAQ)',
        'cheat_title': 'Thang tham chiếu decibel',
        'cheat_safe': 'Nền phòng ngủ yên tĩnh',
        'cheat_mild': 'Giới hạn pháp lý ban đêm',
        'cheat_mod': 'Vượt ngưỡng khó chịu sinh hoạt',
        'cheat_sev': 'Vi phạm pháp luật nghiêm trọng',
        'toolkit_badge': 'BỘ HỒ SƠ CHỨNG CỨ',
        'toolkit_title': 'Biên bản khiếu nại &amp; Hồ sơ PDF',
        'toolkit_desc': 'Xuất báo cáo PDF chính thức có dấu băm SHA-256 chống sửa đổi và mẫu thư khiếu nại pháp lý.',
        'toolkit_btn': 'Xem mẫu báo cáo',
        'trust_hash': 'Dấu băm kỹ thuật số SHA-256',
        'trust_standard': 'Chuẩn đường cong IEC 61672',
        'trust_local': '100% Cục bộ (IndexedDB)'
    }
}

def build_sidebar_html(locale, rel_depth='/'):
    s = SIDEBAR_I18N.get(locale, SIDEBAR_I18N['en'])
    app_url = f"/soundtest.html?lang={locale}" if locale != 'en' else "/soundtest.html"
    
    if locale == 'en':
        samples_url = "/samples.html"
    else:
        samples_url = f"/{locale}/samples.html"
        
    return f'''      <aside class="uc-article-sidebar">
        <!-- Live Sound Meter Card -->
        <div class="uc-sb-card uc-sb-meter">
          <div class="uc-sb-eq" aria-hidden="true">
            <span class="uc-sb-eq-bar"></span>
            <span class="uc-sb-eq-bar"></span>
            <span class="uc-sb-eq-bar"></span>
            <span class="uc-sb-eq-bar"></span>
            <span class="uc-sb-eq-bar"></span>
            <span class="uc-sb-eq-bar"></span>
          </div>
          <h3 class="uc-sb-title">{s['meter_title']}</h3>
          <p class="uc-sb-desc">{s['meter_desc']}</p>
          <a class="button primary uc-sb-btn" href="{app_url}">{s['meter_btn']} &rarr;</a>
          <a class="uc-sb-sublink" href="{app_url}?mode=sentry">
            <span>🌙</span> <span>{s['meter_sentry']}</span>
          </a>
          <div class="uc-sb-note">
            <span class="uc-sb-dot"></span>
            <span>{s['meter_privacy']}</span>
          </div>
        </div>

        <!-- Table of Contents Card -->
        <div class="uc-sb-card uc-sb-toc">
          <div class="uc-sb-header">
            <svg class="uc-sb-header-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 6h16M4 12h16M4 18h7"/></svg>
            <strong>{s['toc_title']}</strong>
          </div>
          <nav class="uc-sb-toc-links" aria-label="{s['toc_title']}">
            <a href="#benchmarks" class="uc-sb-toc-link">
              <span class="uc-sb-toc-icon">📊</span>
              <span>{s['toc_benchmarks']}</span>
            </a>
            <a href="#workflow" class="uc-sb-toc-link">
              <span class="uc-sb-toc-icon">⚡</span>
              <span>{s['toc_workflow']}</span>
            </a>
            <a href="#capabilities" class="uc-sb-toc-link">
              <span class="uc-sb-toc-icon">🛠️</span>
              <span>{s['toc_capabilities']}</span>
            </a>
            <a href="#rules" class="uc-sb-toc-link">
              <span class="uc-sb-toc-icon">⚖️</span>
              <span>{s['toc_rules']}</span>
            </a>
            <a href="#faq-section" class="uc-sb-toc-link">
              <span class="uc-sb-toc-icon">❓</span>
              <span>{s['toc_faq']}</span>
            </a>
          </nav>
        </div>

        <!-- Acoustic Reference Cheat Sheet -->
        <div class="uc-sb-card uc-sb-cheat">
          <div class="uc-sb-header">
            <svg class="uc-sb-header-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 3"/></svg>
            <strong>{s['cheat_title']}</strong>
          </div>
          <div class="uc-sb-cheat-list">
            <div class="uc-sb-cheat-item">
              <span class="db-val db-safe">&lt; 35 dB</span>
              <span class="uc-sb-cheat-lbl">{s['cheat_safe']}</span>
            </div>
            <div class="uc-sb-cheat-item">
              <span class="db-val db-mild">40–50 dB</span>
              <span class="uc-sb-cheat-lbl">{s['cheat_mild']}</span>
            </div>
            <div class="uc-sb-cheat-item">
              <span class="db-val db-moderate">55–65 dB</span>
              <span class="uc-sb-cheat-lbl">{s['cheat_mod']}</span>
            </div>
            <div class="uc-sb-cheat-item">
              <span class="db-val db-severe">70+ dB</span>
              <span class="uc-sb-cheat-lbl">{s['cheat_sev']}</span>
            </div>
          </div>
        </div>

        <!-- Evidentiary Dossier Toolkit -->
        <div class="uc-sb-card uc-sb-legal">
          <span class="uc-sb-badge">{s['toolkit_badge']}</span>
          <h3 class="uc-sb-title" style="margin-top: 8px;">{s['toolkit_title']}</h3>
          <p class="uc-sb-desc">{s['toolkit_desc']}</p>
          <a class="button uc-sb-btn-secondary" href="{samples_url}">{s['toolkit_btn']} &rarr;</a>
        </div>

        <!-- Trust Badges Strip -->
        <div class="uc-sb-trust">
          <div class="uc-sb-trust-item">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
            <span>{s['trust_hash']}</span>
          </div>
          <div class="uc-sb-trust-item">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--accent-2)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>
            <span>{s['trust_standard']}</span>
          </div>
          <div class="uc-sb-trust-item">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
            <span>{s['trust_local']}</span>
          </div>
        </div>
      </aside>'''

print("Base setup loaded successfully.")
