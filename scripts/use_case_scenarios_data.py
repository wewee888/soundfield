# scripts/use_case_scenarios_data.py
# High quality multi-lingual data for all 6 scenarios across es, de, fr, ja, ko, th, vi

SCENARIOS_DATA = {
    'neighbor-noise-evidence': {
        'img': 'neighbor_noise_monitor.webp',
        'img_alt': {
            'es': 'Residente sufriendo por ruidos del vecino de arriba en la noche con teléfono en la mesita midiendo 68.4 dBA',
            'de': 'Verzweifelte Mieterin bei Nachtlärm durch Trampeln von oben mit Smartphone-Pegelmesser auf dem Nachttisch bei 68,4 dBA',
            'fr': 'Résidente en détresse face aux bruits de pas au plafond la nuit avec smartphone affichant 68,4 dBA sur la table de chevet',
            'ja': '深夜2時に上階のかかと歩き・騒音に苦しむ居住者と枕元のスマホで計測中の68.4dBA画面',
            'ko': '심야 2시 위층 발망치와 층간소음으로 고통받는 입주민과 68.4 dBA를 기록 중인 협탁 위 스마트폰',
            'th': 'ผู้อยู่อาศัยที่ทุกข์ทรมานจากเสียงเดินลงส้นข้างบนตอนดึก พร้อมโทรศัพท์วัดเสียง 68.4 dBA ข้างเตียง',
            'vi': 'Cư dân kiệt sức vì tiếng bước chân nện sàn lúc nửa đêm với điện thoại đo 68.4 dBA đặt cạnh giường'
        },
        'stats': {
            'es': [('68.4 dBA', 'Pico de pisadas arriba'), ('🌙 Centinela', 'Vigilancia nocturna'), ('SHA-256', 'Firma digital'), ('100% Local', 'Privacidad IndexedDB')],
            'de': [('68,4 dBA', 'Spitze Trampeln'), ('🌙 Nachtwächter', 'Automatische Nachtwache'), ('SHA-256', 'Prüfsumme'), ('100% Lokal', 'Speicherung im Browser')],
            'fr': [('68,4 dBA', 'Pic de pas au plafond'), ('🌙 Sentinelle', 'Veille nocturne auto'), ('SHA-256', 'Empreinte inviolable'), ('100% Local', 'Stockage IndexedDB')],
            'ja': [('68.4 dBA', '上階足音ピーク'), ('🌙 自動見張り', '夜間監視モード'), ('SHA-256', '改ざん防止ハッシュ'), ('100% ローカル', '端末内完結保存')],
            'ko': [('68.4 dBA', '위층 발망치 피크'), ('🌙 센트리', '야간 자동 감시'), ('SHA-256', '무결성 해시'), ('100% 로컬', '브라우저 보안 저장')],
            'th': [('68.4 dBA', 'พีคเสียงเดินลงส้น'), ('🌙 เฝ้าระวัง', 'ตรวจจับกลางคืนอัตโนมัติ'), ('SHA-256', 'รหัสตรวจสอบความถูกต้อง'), ('100% ในเครื่อง', 'บันทึกในเบราว์เซอร์')],
            'vi': [('68.4 dBA', 'Đỉnh tiếng nện sàn'), ('🌙 Trực ban', 'Giám sát đêm tự động'), ('SHA-256', 'Mã băm chống sửa'), ('100% Cục bộ', 'Lưu trong trình duyệt')]
        },
        'hero': {
            'es': {
                'eyebrow': 'Caso de uso · Ruido vecinal y de apartamentos',
                'headline': 'Convierte el ruido insoportable de vecinos en <em>pruebas legalmente defendibles</em>.',
                'lead': 'Deja de sufrir noches en vela por pisadas, muebles arrastrados, música con graves o ladridos continuos. Captura pruebas irrefutables con el Modo Centinela nocturno, fotos con marca de agua de dB en tiempo real y dosieres PDF oficiales sin marcas de agua.'
            },
            'de': {
                'eyebrow': 'Anwendungsfall · Wohnungs- &amp; Nachbarschaftslärm',
                'headline': 'Verwandeln Sie unerträglichen Nachbarschaftslärm in <em>rechtlich verwertbare Beweise</em>.',
                'lead': 'Schluss mit schlaflosen Nächten durch Trampeln von oben, Verrücken von Möbeln, dröhnende Bässe oder ständiges Bellen. Sichern Sie unwiderlegbare Beweise mit automatischem Nachtwächter, Live-dB-Fotostempel und offiziellen PDF-Lärmprotokollen.'
            },
            'fr': {
                'eyebrow': 'Cas d’usage · Bruits de voisinage et d’appartement',
                'headline': 'Transformez les bruits de voisinage insupportables en <em>preuves juridiquement recevables</em>.',
                'lead': 'Ne subissez plus les nuits blanches causées par les pas au plafond, les meubles traînés, les basses étouffées ou les aboiements constants. Capturez des preuves irréfutables grâce au Mode Sentinelle nocturne, aux photos avec dB en direct et aux dossiers PDF certifiés.'
            },
            'ja': {
                'eyebrow': '利用シーン · マンション・近隣生活騒音',
                'headline': '耐え難い近隣騒音を、管理会社や調停で通じる<em>客観的証拠</em>に変える。',
                'lead': '上階の足音やかかと歩き、家具の引きずり音、深夜の重低音に悩まされる生活に終止符を。夜間自動見張りモード（Sentry）、測定値リアルタイム刻印カメラ、複数日統計グラフで確固たる証拠を残せます。'
            },
            'ko': {
                'eyebrow': '활용 사례 · 아파트 층간소음 및 이웃 갈등',
                'headline': '참기 힘든 층간소음을 관리사무소와 분쟁조정위가 인정하는 <em>법적 증거</em>로 만드세요.',
                'lead': '위층 발망치, 가구 끄는 소리, 우퍼 저음으로 인한 불면의 밤을 끝내세요. 야간 자동 센트리 모드, 실시간 데시벨 워터마크 현장 사진, 다일간 통계 그래프와 위변조 방지 PDF 증거 보고서로 완벽하게 대응하세요.'
            },
            'th': {
                'eyebrow': 'กรณีการใช้งาน · เสียงรบกวนเพื่อนบ้านและคอนโด',
                'headline': 'เปลี่ยนเสียงรบกวนข้างห้องที่ทนไม่ไหว ให้เป็น<em>หลักฐานที่มีน้ำหนักตามกฎหมาย</em>.',
                'lead': 'หยุดทนทุกข์กับค่ำคืนที่นอนไม่หลับจากเสียงเดินลงส้น ลากเก้าอี้ เบสทึบๆ หรือสุนัขเห่าไม่หยุด บันทึกหลักฐานที่ปฏิเสธไม่ได้ด้วยโหมดเฝ้าระวังอัตโนมัติ ภาพถ่ายพร้อมค่า dB แบบเรียลไทม์ และรายงานสรุป PDF มาตรฐาน.'
            },
            'vi': {
                'eyebrow': 'Trường hợp sử dụng · Tiếng ồn hàng xóm &amp; căn hộ',
                'headline': 'Biến tiếng ồn hàng xóm không thể chịu nổi thành <em>bằng chứng pháp lý vững chắc</em>.',
                'lead': 'Chấm dứt những đêm mất ngủ vì tiếng bước chân nện sàn, kéo lê bàn ghế, âm trầm dội tường hay chó sủa liên tục. Thu thập bằng chứng không thể chối cãi với Chế độ Trực ban đêm, chụp ảnh đóng dấu dB thời gian thực và hồ sơ PDF chuẩn hóa.'
            }
        },
        'table': {
            'headers': {
                'es': ('Nivel medido', 'Fuente habitual de ruido vecinal', 'Límite legal y sanitario', 'Nivel de acción'),
                'de': ('Gemessener Pegel', 'Typische Lärmquelle', 'Gesetzlicher & gesundheitlicher Richtwert', 'Handlungsrelevanz'),
                'fr': ('Niveau mesuré', 'Source typique de bruit', 'Norme légale et sanitaire', 'Niveau d’action'),
                'ja': ('実測値', '近隣生活騒音の代表例', '公的環境基準・健康影響ライン', '対応措置レベル'),
                'ko': ('측정치', '대표적인 층간소음 원인', '법적 기준 및 건강 영향선', '대응 조치 단계'),
                'th': ('ระดับที่วัดได้', 'แหล่งกำเนิดเสียงทั่วไป', 'เกณฑ์มาตรฐานตามกฎหมายและสุขภาพ', 'ระดับการดำเนินการ'),
                'vi': ('Mức đo được', 'Nguồn tiếng ồn điển hình', 'Quy chuẩn pháp lý & sức khỏe', 'Mức độ xử lý')
            },
            'title': {
                'es': 'Tabla de referencia de decibelios para ruido residencial',
                'de': 'Referenztabelle für Wohn- und Nachbarschaftslärm',
                'fr': 'Tableau de référence des décibels en milieu résidentiel',
                'ja': '集合住宅・生活騒音のデシベル基準値対照表',
                'ko': '공동주택 층간소음 데시벨 기준치 대조표',
                'th': 'ตารางอ้างอิงระดับเดซิเบลสำหรับที่อยู่อาศัย',
                'vi': 'Bảng đối chiếu mức decibel tiếng ồn dân cư'
            },
            'lead': {
                'es': 'Compare sus mediciones con las directrices de la OMS y las ordenanzas municipales de horas de silencio.',
                'de': 'Vergleichen Sie Ihre Messwerte mit WHO-Leitlinien und kommunalen Ruhezeit-Verordnungen.',
                'fr': 'Comparez vos mesures aux directives de l’OMS et aux arrêtés préfectoraux relatifs aux heures de repos.',
                'ja': 'WHOガイドラインおよび自治体の深夜受忍限度基準と実測値を比較・確認できます。',
                'ko': '측정된 데시벨을 WHO 권고안 및 공동주택 층간소음 관리기준과 비교해 보세요.',
                'th': 'เปรียบเทียบค่าที่วัดได้กับเกณฑ์แนะนำของ WHO และข้อบัญญัติเวลาพักผ่อน.',
                'vi': 'So sánh chỉ số đo được với hướng dẫn của WHO và quy chuẩn tiếng ồn ban đêm.'
            },
            'rows': {
                'es': [
                    ('< 30 dBA', 'Dormitorio silencioso, susurros, respiración', 'Recomendación OMS para descanso nocturno reparador', 'badge-safe', 'Ambiente normal'),
                    ('35 – 42 dBA', 'Conversación baja contigua, ascensor lejano, aire acondicionado', 'Límite máximo permitido en ordenanzas nocturnas (22:00–06:00)', 'badge-mild', 'Límite permisible'),
                    ('45 – 55 dBA', 'Televisión a volumen medio, habla normal, pasos ligeros', 'Nivel diurno habitual; perturbador si ocurre de madrugada', 'badge-moderate', 'Molestia nocturna'),
                    ('60 – 72 dBA', 'Pisadas fuertes (talonazos), arrastre de muebles, ladridos continuos', 'Supera los límites legales en 15–25 dB; causa insomnio y estrés grave', 'badge-severe', 'Infracción grave'),
                    ('75+ dBA', 'Subwoofer con graves potentes, discusiones a gritos, fiestas', 'Alteración grave de la convivencia; motivo de intervención policial', 'badge-severe', 'Infracción extrema')
                ],
                'de': [
                    ('< 30 dBA', 'Ruhiges Schlafzimmer, Flüstern, Atmen', 'WHO-Empfehlung für ungestörten Nachtschlaf im Innenraum', 'badge-safe', 'Normbereich'),
                    ('35 – 42 dBA', 'Leise Gespräche nebenan, Aufzugsfahrt, Lüftungssummen', 'Oberer Grenzwert der nächtlichen Ruhezeiten (22:00–06:00 Uhr)', 'badge-mild', 'Zulässiger Grenzwert'),
                    ('45 – 55 dBA', 'Fernseher bei Zimmerlautstärke, normale Sprache, Schritte', 'Üblicher Tagespegel; störend bei kontinuierlichem Auftreten nachts', 'badge-moderate', 'Störung zur Nachtzeit'),
                    ('60 – 72 dBA', 'Fersentrampeln, Möbelrücken, laute Spiele, anhaltendes Bellen', 'Überschreitet gesetzliche Grenzwerte um 15–25 dB; Ursache für Schlafstörungen', 'badge-severe', 'Erhebliche Störung'),
                    ('75+ dBA', 'Subwoofer-Bass, lautes Schreien, nächtliche Musikpartys', 'Schwere Ruhestörung; Anlass für Polizeieinsatz und Vermieterabmahnung', 'badge-severe', 'Schwere Ruhestörung')
                ],
                'fr': [
                    ('< 30 dBA', 'Chambre calme, chuchotement, respiration légère', 'Recommandation OMS pour le sommeil réparateur en intérieur', 'badge-safe', 'Ambiance normale'),
                    ('35 – 42 dBA', 'Voix basses mitoyennes, ascenseur lointain, climatisation', 'Seuil limite des arrêtés municipaux et préfectoraux de nuit (22h–6h)', 'badge-mild', 'Seuil réglementaire'),
                    ('45 – 55 dBA', 'Volume TV moyen, conversation normale, pas réguliers', 'Niveau diurne standard ; troublant si continu après minuit', 'badge-moderate', 'Nuisance nocturne'),
                    ('60 – 72 dBA', 'Bruits d’impact de talons, meubles traînés, aboiements continus', 'Dépasse la limite réglementaire de 15 à 25 dB ; altère gravement la santé', 'badge-severe', 'Infraction avérée'),
                    ('75+ dBA', 'Basses de caisson, cris répétés, soirées festives nocturnes', 'Trouble anormal de voisinage manifeste ; constat d’huissier / police', 'badge-severe', 'Infraction grave')
                ],
                'ja': [
                    ('< 30 dBA', '静寂な寝室、ささやき声、穏やかな呼吸音', 'WHO推奨の安眠に必要な室内暗騒音目標レベル', 'badge-safe', '正常な静粛環境'),
                    ('35 – 42 dBA', '隣室の小声、遠くのエレベーター音、換気扇', '各自治体が定める深夜（22時〜翌6時）の室内許容上限', 'badge-mild', '夜間受忍限界'),
                    ('45 – 55 dBA', '通常のテレビ音量、日常会話、歩行音', '昼間の標準生活音；深夜帯に継続すれば睡眠障害を誘発', 'badge-moderate', '受忍限度超過'),
                    ('60 – 72 dBA', '上階のかかと歩き衝撃音、家具の引きずり、犬の無駄吠え', '法定制限を15〜25dB超過；明確な不法行為・注意警告の根拠', 'badge-severe', '重大な規約違反'),
                    ('75+ dBA', '重低音ウーファー、怒号、深夜のオーディオ爆音', '平穏な居住権の著しい侵害；警察通報および損害賠償請求対象', 'badge-severe', '違法侵害レベル')
                ],
                'ko': [
                    ('< 30 dBA', '조용한 침실, 속삭임, 규칙적인 숨소리', 'WHO 권고 숙면 보장 실내 암소음 기준치', 'badge-safe', '정상적 주거 환경'),
                    ('35 – 42 dBA', '옆방의 조용한 대화, 멀리서 울리는 엘리베이터, 공조기', '공동주택 층간소음 규칙 야간(22:00~06:00) 직접충격 기준치', 'badge-mild', '야간 법적 한도'),
                    ('45 – 55 dBA', '중간 볼륨 TV, 일상 대화, 가벼운 보행음', '주간 기준치 수준이나, 심야 지속 시 심각한 수면 방해 초래', 'badge-moderate', '심야 수인한도 초과'),
                    ('60 – 72 dBA', '위층 발망치(뒤꿈치 타격), 의자 끄는 소리, 개 짖음', '환경부 층간소음 기준을 15~25dB 초과; 분쟁조정위 판정 요건', 'badge-severe', '법적 피해보상 대상'),
                    ('75+ dBA', '우퍼 저음 진동, 고성방가, 심야 홈파티 음악', '인근소란 및 주거 평온권 침해; 경찰 출동 및 최고장 발송 사유', 'badge-severe', '중대 위법 행위')
                ],
                'th': [
                    ('< 30 dBA', 'ห้องนอนที่เงียบสงบ เสียงกระซิบ ลมหายใจแผ่วเบา', 'เป้าหมายระดับเสียงในร่มที่ WHO แนะนำเพื่อการนอนหลับ', 'badge-safe', 'ระดับปกติ'),
                    ('35 – 42 dBA', 'เสียงพูดคุยเบาๆ เสียงลิฟต์ไกลๆ เสียงแอร์', 'เกณฑ์จำกัดสูงสุดสำหรับช่วงเวลากลางคืน (22:00–06:00 น.)', 'badge-mild', 'ขีดจำกัดที่ยอมรับได้'),
                    ('45 – 55 dBA', 'เสียงทีวีระดับปานกลาง พูดคุยปกติ เดินไปมา', 'ระดับกลางวันปกติ แต่หากเกิดขึ้นหลังเที่ยงคืนจะรบกวนมาก', 'badge-moderate', 'ระดับรบกวนยามดึก'),
                    ('60 – 72 dBA', 'เสียงเดินลงส้น ลากเก้าอี้กระแทกพื้น สุนัขเห่าไม่หยุด', 'เกินเกณฑ์มาตรฐาน 15–25 dB ส่งผลต่อสุขภาพจิตและนอนไม่หลับ', 'badge-severe', 'ละเมิดสิทธิ์ชัดเจน'),
                    ('75+ dBA', 'เสียงเบสทึบจากซับวูฟเฟอร์ ปาร์ตี้เปิดเพลงเสียงดัง', 'สร้างความเดือดร้อนรำคาญร้ายแรง สามารถแจ้งเจ้าหน้าที่ได้ทันที', 'badge-severe', 'การกระทำผิดรุนแรง')
                ],
                'vi': [
                    ('< 30 dBA', 'Phòng ngủ yên tĩnh, tiếng thì thầm, thở nhẹ', 'Mục tiêu khuyến nghị của WHO cho giấc ngủ trọn vẹn trong nhà', 'badge-safe', 'Môi trường yên tĩnh'),
                    ('35 – 42 dBA', 'Tiếng trò chuyện nhỏ nhẹ, thang máy từ xa, máy lạnh', 'Ngưỡng giới hạn cho phép trong quy chuẩn ban đêm (22h–6h)', 'badge-mild', 'Giới hạn cho phép'),
                    ('45 – 55 dBA', 'Tivi âm lượng vừa, trò chuyện bình thường, bước chân', 'Mức sinh hoạt ban ngày thông thường; gây rối nếu xảy ra lúc nửa đêm', 'badge-moderate', 'Vượt ngưỡng đêm'),
                    ('60 – 72 dBA', 'Nện gót chân xuống sàn, kéo lê đồ đạc, chó sủa liên hồi', 'Vượt quy chuẩn từ 15–25 dB; nguyên nhân trực tiếp gây mất ngủ, ức chế', 'badge-severe', 'Vi phạm quy chuẩn'),
                    ('75+ dBA', 'Âm trầm subwoofer, la hét to tiếng, tiệc tùng mở nhạc lớn', 'Gây rối trật tự nghiêm trọng; đủ căn cứ xử phạt hành chính', 'badge-severe', 'Vi phạm nghiêm trọng')
                ]
            }
        },
        'steps': {
            'title': {
                'es': 'Cómo construir un dosier indiscutible de ruido vecinal',
                'de': 'In 4 Schritten zum lückenlosen Nachbarschaftslärm-Dossier',
                'fr': 'Comment constituer un dossier irréfutable de bruits de voisins',
                'ja': '反論の余地を与えない近隣騒音証拠の4ステップ収集法',
                'ko': '반박 불가능한 층간소음 증거를 구축하는 4단계 절차',
                'th': 'วิธีสร้างแฟ้มหลักฐานเสียงข้างห้องที่โต้แย้งไม่ได้ใน 4 ขั้นตอน',
                'vi': 'Quy trình 4 bước xây dựng hồ sơ chứng cứ tiếng ồn không thể bác bỏ'
            },
            'lead': {
                'es': 'Siga este flujo de 4 pasos para transformar quejas subjetivas en hechos acústicos objetivos que administradore y tribunales toman en serio.',
                'de': 'Verwandeln Sie subjektive Beschwerden in strukturierte Fakten, die von Hausverwaltungen und Gerichten anerkannt werden.',
                'fr': 'Transformez vos réclamations subjectives en faits acoustiques structurés reconnus par les syndics et la justice.',
                'ja': '「うるさい」という感情論を、管理組合や第三者機関が納得せざるを得ない客観データへ昇華させる手順です。',
                'ko': '감정적인 다툼을 넘어 관리사무소, 층간소음이웃사이센터, 법원이 즉각 인정하는 객관적 데이터로 전환합니다.',
                'th': 'เปลี่ยนความรู้สึกรำคาญให้เป็นข้อเท็จจริงทางเสียงที่มีโครงสร้าง ซึ่งนิติบุคคลและศาลยอมรับได้.',
                'vi': 'Biến những phàn nàn cảm tính thành dữ liệu âm học có cấu trúc vững chắc được ban quản lý và cơ quan chức năng công nhận.'
            },
            'items': {
                'es': [
                    ('1', '🌙', 'Activar Centinela nocturno', 'Establezca el umbral de activación (ej. 50 dBA). La pantalla se atenúa con Wake Lock, monitoreando y capturando picos mientras duerme.'),
                    ('2', '📸', 'Capturar fotos de custodia', 'Utilice la cámara interna para fotografiar techos o paredes con el nivel en dB, coordenadas GPS y hora exacta estampados en la imagen.'),
                    ('3', '📊', 'Acumular tendencias multidiarias', 'Registre de 7 a 14 días. Nuestro motor analiza LAeq, picos L10 y fondo L90, demostrando que no es un hecho aislado sino una molestia crónica.'),
                    ('4', '⚖️', 'Exportar dosier oficial en PDF', 'Genere un informe PDF sin marcas de agua con hash SHA-256 e incorpórelo a sus escritos para el administrador o el comité de propietarios.')
                ],
                'de': [
                    ('1', '🌙', 'Nachtwächter aktivieren', 'Schwellenwert festlegen (z. B. 50 dBA). Der Bildschirm dunkelt automatisch ab, während Pegelspitzen im Schlaf lückenlos aufgezeichnet werden.'),
                    ('2', '📸', 'Fotobeweis mit Pegelstempel', 'Fotografieren Sie vibrierende Decken oder Wände mit direkt ins Bild eingeblendetem dB-Wert, GPS und sekundengenauem Zeitstempel.'),
                    ('3', '📊', 'Mehrtages-Statistik erfassen', '7–14 Tage dokumentieren. Der Analyse-Algorithmus ermittelt LAeq, L10-Spitzen und L90-Grundpegel als Nachweis chronischer Störung.'),
                    ('4', '⚖️', 'Offizielles PDF-Dossier exportieren', 'Erstellen Sie ein manipulationssicheres PDF-Lärmprotokoll mit SHA-256-Hash für Vermieter, Hausverwaltung oder Schlichtungsstelle.')
                ],
                'fr': [
                    ('1', '🌙', 'Armer la Sentinelle nocturne', 'Définissez le seuil de déclenchement (ex. 50 dBA). L’écran s’assombrit avec veille active, consignant chaque pic sonore pendant votre sommeil.'),
                    ('2', '📸', 'Prendre des photos de preuve', 'Photographiez les zones d’impact avec incrustation directe des dB en direct, coordonnées GPS et horodatage certifié.'),
                    ('3', '📊', 'Compiler les tendances sur 7 à 14 jours', 'Notre moteur calcule le LAeq, les pointes L10 et le bruit de fond L90, démontrant le caractère répétitif et anormal du trouble.'),
                    ('4', '⚖️', 'Générer le rapport PDF officiel', 'Exportez un dossier PDF inviolable muni d’un sceau SHA-256, prêt à être transmis au syndic, au bailleur ou à votre avocat.')
                ],
                'ja': [
                    ('1', '🌙', '夜間自動見張り（Sentry）を起動', 'トリガー閾値（例: 50 dBA）を設定。画面を減光したまま画面スリープを防ぎ、就寝中の衝撃音ピークを漏らさず自動記録。'),
                    ('2', '📸', '測定値入り現場写真を撮影', '内蔵カメラで天井や壁面の振動箇所を撮影。リアルタイムdBA、GPS座標、ミリ秒単位の時刻が改ざん防止スタンプとして焼き込まれます。'),
                    ('3', '📊', '複数日の騒音推移を蓄積', '7〜14日間の記録を蓄積。等価騒音レベル（LAeq）、ピーク頻度（L10）、暗騒音（L90）を自動集計し「慢性的侵害」を立証。'),
                    ('4', '⚖️', '公式PDF証拠書類を出力', 'SHA-256ハッシュ付きの公式PDFレポートを出力。管理会社、理事会、調停委員会へそのまま提出できる法務形式です。')
                ],
                'ko': [
                    ('1', '🌙', '야간 자동 센트리 가동', '감지 기준치(예: 50 dBA)를 설정합니다. 화면이 어두워진 상태로 유지되며 수면 중 발생하는 돌발 소음 피크를 자동 캡처합니다.'),
                    ('2', '📸', '실시간 워터마크 현장 촬영', '인앱 카메라로 천장 타격 지점이나 진동 부위를 촬영하면 실시간 dB 수치, GPS 좌표, 타임스탬프가 사진에 영구 각인됩니다.'),
                    ('3', '📊', '다일간 소음 패턴 데이터 축적', '7~14일간 데이터를 수집합니다. LAeq(등가소음도), L10(피크치), L90(배경소음)을 통계화하여 만성적 피해를 객관적으로 증명합니다.'),
                    ('4', '⚖️', '위변조 방지 PDF 리포트 발행', 'SHA-256 전자 해시가 포함된 정식 증거 보고서를 생성하여 관리사무소, 이웃사이센터, 분쟁조정위에 즉각 제출하세요.')
                ],
                'th': [
                    ('1', '🌙', 'เปิดโหมดเฝ้าระวังกลางคืน', 'ตั้งค่าระดับตรวจจับ (เช่น 50 dBA) หน้าจอจะหรี่แสงลงพร้อมเปิดหน้าจอค้างไว้ เพื่อดักจับเสียงกระแทกยามค่ำคืนโดยอัตโนมัติ.'),
                    ('2', '📸', 'ถ่ายภาพพร้อมประทับค่า dB สด', 'ใช้กล้องในแอปถ่ายจุดที่เกิดเสียงหรือผนังห้อง โดยมีค่า dB พิกัด GPS และเวลาประทับลงบนภาพถ่ายอย่างชัดเจน.'),
                    ('3', '📊', 'สะสมข้อมูลแนวโน้มหลายวัน', 'บันทึกต่อเนื่อง 7–14 วัน ระบบจะคำนวณค่า LAeq พีค L10 และเสียงพื้นหลัง L90 พิสูจน์ว่าไม่ใช่เหตุการณ์ที่เกิดขึ้นเพียงครั้งเดียว.'),
                    ('4', '⚖️', 'ส่งออกรายงาน PDF ทางการ', 'สร้างรายงาน PDF คุณภาพสูงพร้อมรหัสตรวจสอบ SHA-256 นำไปยื่นต่อนิติบุคคล เจ้าของอาคาร หรือคณะกรรมการไกล่เกลี่ยได้ทันที.')
                ],
                'vi': [
                    ('1', '🌙', 'Kích hoạt Chế độ Trực ban đêm', 'Đặt ngưỡng kích hoạt (ví dụ: 50 dBA). Màn hình tự giảm sáng để tiết kiệm pin nhưng vẫn giữ kết nối, tự động ghi nhận các đợt tiếng ồn khi bạn ngủ.'),
                    ('2', '📸', 'Chụp ảnh bằng chứng có dấu thời gian', 'Sử dụng máy ảnh trong ứng dụng để chụp vị trí rung lắc với chỉ số dB trực tiếp, tọa độ GPS và thời gian được đóng dấu vào ảnh.'),
                    ('3', '📊', 'Tích lũy dữ liệu xu hướng nhiều ngày', 'Ghi nhật ký từ 7–14 ngày. Hệ thống tổng hợp LAeq, đỉnh L10 và nền L90, chứng minh đây là ô nhiễm tiếng ồn mãn tính kéo dài.'),
                    ('4', '⚖️', 'Xuất hồ sơ báo cáo PDF chính thức', 'Tạo báo cáo PDF không dấu mờ kèm mã băm SHA-256 bảo vệ tính toàn vẹn, sẵn sàng chuyển cho ban quản lý hoặc chính quyền giải quyết.')
                ]
            }
        },
        'features': {
            'title': {
                'es': 'Funciones diseñadas para resolver disputas vecinales',
                'de': 'Spezialfunktionen für Nachbarschaftskonflikte',
                'fr': 'Fonctionnalités dédiées au règlement des litiges de voisinage',
                'ja': '近隣トラブル解決のために専用設計された証拠能力',
                'ko': '층간소음 분쟁 해결을 위해 특화 설계된 전용 기능',
                'th': 'ฟังก์ชันที่ออกแบบมาเพื่อยุติข้อพิพาทเพื่อนบ้านโดยเฉพาะ',
                'vi': 'Các tính năng chuyên sâu giải quyết tranh chấp hàng xóm'
            },
            'lead': {
                'es': 'Cada herramienta elimina las excusas habituales de vecinos conflictivos y administradores escépticos.',
                'de': 'Entwickelt, um typische Ausflüchte von Verursachern und Verwaltungen zu widerlegen.',
                'fr': 'Chaque outil neutralise les excuses habituelles des voisins récalcitrants et des gestionnaires sceptiques.',
                'ja': '「そんな音は出していない」「気のせいだ」という言い逃れを完全に排除する仕様です。',
                'ko': '가해 세대의 부인과 관리실의 미온적 태도를 무력화하는 명확한 기술 사양을 제공합니다.',
                'th': 'ทุกฟังก์ชันได้รับการออกแบบมาเพื่อขจัดข้ออ้างที่ว่า "ไม่ได้ทำเสียงดัง" ให้หมดไป.',
                'vi': 'Mỗi tính năng đều được tối ưu để loại bỏ những lời bao biện vô căn cứ của người gây ồn.'
            },
            'items': {
                'es': [
                    ('🌙', 'Modo Centinela nocturno', 'Funciona toda la noche sin apagarse. Registra automáticamente eventos cuando el ruido de los vecinos supera el umbral establecido.'),
                    ('📸', 'Cámara de custodia inalterable', 'Incrusta en la fotografía la lectura en dBA/dBC, marca de tiempo ISO, ubicación GPS y notas de calibración.'),
                    ('📉', 'Espectro FFT de baja frecuencia', 'Las notas de voz de los móviles pierden los ruidos sordos. Nuestro motor de 1/3 de octava visualiza vibraciones graves hasta 31.5 Hz.'),
                    ('📊', 'Dosier de perturbación multidiario', 'Agrupa percentiles estadísticos (L10 picos, L50 mediana, L90 fondo) y desglose día/noche a lo largo de semanas.'),
                    ('⚖️', 'Plantillas de reclamación formal', 'Acceda a modelos de cartas estandarizados: aviso amistoso, queja formal al administrador o reclamación por daños.'),
                    ('🔒', 'Privacidad 100% en el dispositivo', 'Grabaciones, registros y fotos permanecen exclusivamente en el IndexedDB de su navegador, sin subidas no solicitadas a la nube.')
                ],
                'de': [
                    ('🌙', 'Nachtwächter-Überwachung', 'Überwacht die ganze Nacht störungsfrei. Registriert automatisch Lärmereignisse, sobald der Pegel Ihren Grenzwert übersteigt.'),
                    ('📸', 'Manipulationssichere Kamera', 'Bettet Live-dBA/dBC-Werte, ISO-Zeitstempel, GPS-Koordinaten und Kalibrierungsdaten direkt in das Fotomaterial ein.'),
                    ('📉', 'Tieffrequenz-FFT-Spektrum', 'Standard-Sprachmemos erfassen dumpfes Wummern nicht. Unsere 1/3-Oktav-FFT analysiert Bässe und Schwingungen bis 31,5 Hz.'),
                    ('📊', 'Mehrtägiges Lärmdossier', 'Erfasst statistische Perzentile (L10-Spitze, L50-Median, L90-Basis) und Tag-/Nacht-Verteilung über Wochen hinweg.'),
                    ('⚖️', 'Rechtssichere Musteranschreiben', 'Nutzen Sie erprobte Vorlagen: von der höflichen Notiz bis zur offiziellen Mängelrüge mit Mietminderungsankündigung.'),
                    ('🔒', '100% lokale Privatsphäre', 'Messungen, Notizen und Fotos verbleiben verschlüsselt im Browser (IndexedDB). Keine ungefragten Cloud-Uploads.')
                ],
                'fr': [
                    ('🌙', 'Mode Sentinelle nocturne', 'Veille active sans interruption. Enregistre automatiquement les dépassements dès que l’impact dépasse le seuil paramétré.'),
                    ('📸', 'Caméra probatoire certifiée', 'Incruste dans chaque cliché les niveaux dBA/dBC réels, l’horodatage ISO, le point GPS et les références métrologiques.'),
                    ('📉', 'Analyse FFT basses fréquences', 'Les mémos vocaux étouffent les bruits sourds. Notre moteur 1/3 d’octave restitue les vibrations de 31,5 Hz à 125 Hz.'),
                    ('📊', 'Historique statistique complet', 'Consolide les percentiles (L10 pics, L50 médian, L90 bruit de fond) et la répartition jour/nuit sur plusieurs semaines.'),
                    ('⚖️', 'Modèles de courriers juridiques', 'Accédez à des lettres types prêtes à l’emploi : avertissement amiable, mise en demeure du syndic ou réclamation au bailleur.'),
                    ('🔒', 'Confidentialité 100% locale', 'Fichiers audio, journaux et photos demeurent exclusivement dans l’IndexedDB de votre navigateur.')
                ],
                'ja': [
                    ('🌙', '夜間自動見張り（Sentry）', 'バッテリー消費を抑えながら一晩中稼働。設定したデシベル超過時に音声と推移を自動記録します。'),
                    ('📸', '改ざん防止付き証拠撮影カメラ', 'リアルタイムdBA/dBC測定値、ISO世界標準時、GPS位置情報、端末校正値を写真フレームに直接刻印。'),
                    ('📉', '低周波音FFT周波数スペクトル', 'スマホの標準ボイスメモでは拾えない「ドスンドスン」という重低音・壁面共振（31.5Hz〜）を周波数別に可視化。'),
                    ('📊', '複数日被害統計ダッシュボード', 'L10（突発ピーク）、L50（中央値）、L90（環境底騒音）の推移を週単位で集計し、常習的な受忍限度超過を立証。'),
                    ('⚖️', '管理会社・大家向け交渉通知文', '穏やかな注意喚起から、内容証明郵便・賃料減額請求・損害賠償通知まで対応する文面テンプレートを同梱。'),
                    ('🔒', '完全端末内完結のプライバシー', '録音データや現場写真はブラウザ内IndexedDBにのみ暗号化保存。無断でクラウドにアップロードされることはありません。')
                ],
                'ko': [
                    ('🌙', '야간 자동 센트리 감시', '화면을 켜둔 채 밤새 조용히 실행됩니다. 설정한 기준 데시벨을 초과하는 충격 소음이 발생하면 즉시 자동 기록합니다.'),
                    ('📸', '위변조 방지 증거 촬영', '실시간 dBA/dBC 측정치, ISO 표준 일시, GPS 위치 좌표, 마이크 교정 정보를 사진 프레임에 영구 기록합니다.'),
                    ('📉', '초저주파 FFT 스펙트럼 분석', '일반 음성 녹음으로는 잡히지 않는 쿵쿵거리는 저주파 진동(31.5Hz~)을 1/3 옥타브 밴드로 시각화하여 입증합니다.'),
                    ('📊', '다일간 층간소음 종합 분석', 'L10(피크치), L50(중간치), L90(배경소음) 백분위수와 주/야간 위반 횟수를 분석하여 지속적 고통을 증명합니다.'),
                    ('⚖️', '공식 내용증명 및 민원 양식', '정중한 1차 요청서부터 관리실 공식 민원 접수증, 분쟁조정위 신청서 및 손해배상 최고장 양식을 즉시 활용하세요.'),
                    ('🔒', '100% 로컬 데이터 절대 보안', '측정 파일, 사진, 오디오는 사용자 기기의 IndexedDB에만 보관됩니다. 외부 서버로 무단 전송되지 않아 안심할 수 있습니다.')
                ],
                'th': [
                    ('🌙', 'โหมดเฝ้าระวังยามค่ำคืน', 'ทำงานเงียบๆ ตลอดทั้งคืนโดยไม่ตัดการเชื่อมต่อ บันทึกข้อมูลทันทีเมื่อเสียงดังเกินเกณฑ์ที่ตั้งไว้.'),
                    ('📸', 'กล้องประทับพิกัดและค่าเสียง', 'ฝังค่า dBA/dBC สด เวลาสากล พิกัด GPS และหมายเหตุการปรับเทียบลงในรูปถ่ายโดยตรง ป้องกันข้อกล่าวหาตัดต่อภาพ.'),
                    ('📉', 'วิเคราะห์สเปกตรัมความถี่ต่ำ FFT', 'การอัดเสียงทั่วไปจับเสียงกระแทกทึบไม่ได้ ระบบ 1/3-octave ของเราแสดงพลังงานการสั่นสะเทือนความถี่ต่ำได้ถึง 31.5 Hz.'),
                    ('📊', 'แฟ้มสถิติรบกวนต่อเนื่องหลายวัน', 'ประมวลผลเปอร์เซ็นไทล์ (L10 พีคสูงสุด, L50 ค่าเฉลี่ย, L90 เสียงพื้นหลัง) แสดงรูปแบบการละเมิดตลอดสัปดาห์.'),
                    ('⚖️', 'แบบฟอร์มหนังสือแจ้งเตือนทางการ', 'เข้าถึงแบบร่างหนังสือร้องเรียนมาตรฐาน ตั้งแต่การแจ้งเพื่อนบ้านอย่างสุภาพ ไปจนถึงหนังสือแจ้งนิติบุคคลและยื่นข้อพิพาท.'),
                    ('🔒', 'ความเป็นส่วนตัวในเครื่อง 100%', 'ไฟล์เสียง บันทึกเซนเซอร์ และภาพถ่ายทั้งหมดจะถูกเก็บไว้ใน IndexedDB ของเบราว์เซอร์ ไม่มีการอัปโหลดขึ้นคลาวด์.')
                ],
                'vi': [
                    ('🌙', 'Chế độ Trực ban đêm tự động', 'Chạy thầm lặng suốt đêm không ngắt quãng. Tự động ghi lại các sự kiện vượt ngưỡng khi tiếng ồn vượt mức bạn chọn.'),
                    ('📸', 'Máy ảnh lưu giữ chứng cứ nguyên vẹn', 'Đóng dấu trực tiếp chỉ số dBA/dBC, thời gian ISO, vị trí GPS và thông số hiệu chuẩn vào khung hình.'),
                    ('📉', 'Phổ tần số rung động thấp FFT', 'Bản ghi âm điện thoại thông thường không bắt được tiếng nện sàn trầm. Bộ phân tích 1/3-octave hiển thị rõ dao động xuống tới 31.5 Hz.'),
                    ('📊', 'Hồ sơ thống kê vi phạm nhiều ngày', 'Tổng hợp các phân vị thống kê (đỉnh L10, trung vị L50, nền L90) và phân bổ ngày/đêm qua nhiều tuần liền.'),
                    ('⚖️', 'Mẫu văn bản khiếu nại quy chuẩn', 'Cung cấp các mẫu thư thông báo chuẩn mực: từ nhắc nhở nhã nhặn đến đơn gửi ban quản lý tòa nhà và cơ quan hòa giải.'),
                    ('🔒', 'Bảo mật dữ liệu tuyệt đối trên máy', 'Clip âm thanh, nhật ký cảm biến và ảnh chụp chỉ lưu trong IndexedDB của trình duyệt, không tự ý tải lên đám mây.')
                ]
            }
        },
        'rules': {
            'title': {
                'es': 'Reglas probatorias que realmente funcionan en mediación',
                'de': 'Beweisregeln, die bei Schlichtung und Gericht überzeugen',
                'fr': 'Règles de preuve incontournables lors d’une médiation',
                'ja': '管理会社・調停の場で実際に有効な証拠収集の鉄則',
                'ko': '분쟁 조정과 협의에서 실제로 효력을 발휘하는 입증 수칙',
                'th': 'หลักเกณฑ์การใช้หลักฐานที่ได้ผลจริงในการไกล่เกลี่ย',
                'vi': 'Các quy tắc thu thập chứng cứ thuyết phục khi hòa giải'
            },
            'lead': {
                'es': 'Los administradores y mediadores reciben cientos de quejas emocionales. Así es como logrará que la suya sea creíble y vinculante.',
                'de': 'Hausverwaltungen und Richter erleben unzählige emotionale Beschwerden. So wird Ihr Anliegen sachlich unanfechtbar.',
                'fr': 'Les gestionnaires et juges voient défiler des centaines de plaintes émotionnelles. Voici comment rendre la vôtre indiscutable.',
                'ja': '感情的な怒りの訴えは受け流されがちです。相手を動かすための客観的かつ法的に隙のない残し方を解説します。',
                'ko': '관리소와 판사는 감정적인 호소를 수없이 접합니다. 객관적 사실로 즉각적인 조치를 이끌어내는 방법입니다.',
                'th': 'นิติบุคคลและคนกลางต้องรับฟังข้อร้องเรียนที่ใช้อารมณ์มากมาย นี่คือวิธีทำให้ข้อร้องเรียนของคุณมีน้ำหนักและน่าเชื่อถือ.',
                'vi': 'Ban quản lý thường bỏ qua những lời than phiền nặng cảm tính. Đây là cách làm cho bằng chứng của bạn có tính thuyết phục cao.'
            },
            'items': {
                'es': [
                    ('📅', 'Regla 1: Múltiples sesiones cortas superan a una grabación larga', 'Un registro de 10 días que demuestra golpes de más de 65 dBA a la 1:30 AM es abrumador. Una sola grabación de 2 horas rara vez se escucha y se descarta como anomalía.'),
                    ('📍', 'Regla 2: Mantenga fija la posición de medición y el estado de la sala', 'Mida desde el centro de la estancia afectada, a unos 1,2 metros del suelo. Anote siempre si las ventanas estaban cerradas para excluir ruidos de tráfico exterior.'),
                    ('📄', 'Regla 3: Entregue informes PDF limpios con huella digital SHA-256', 'Nunca envíe audios sueltos por mensajería. Entregue un resumen en PDF con compensación de calibración, gráficos y firmas hash para exigir actuación inmediata.'),
                    ('⚖️', 'Regla 4: Conozca la diferencia entre prueba civil y peritaje homologado', 'SOUNDTEST.PRO proporciona documentación civil de alta precisión que resuelve el 95% de conflictos vecinales. En litigios judiciales formales, compleméntelo con sonómetros certificados.')
                ],
                'de': [
                    ('📅', 'Regel 1: Mehrere kurze Messungen schlagen eine Endlosaufnahme', 'Ein 10-Tage-Protokoll mit wiederholtem 65+ dBA Trampeln um 01:30 Uhr ist beweiskräftig. Eine 2-stündige Datei wird kaum angehört und schnell als Einzelfall abgetan.'),
                    ('📍', 'Regel 2: Messort und Raumzustand stets identisch halten', 'Messen Sie in der Raummitte ca. 1,2 Meter über dem Boden. Dokumentieren Sie, ob Türen und Fenster geschlossen waren, um Fremdgeräusche auszuschließen.'),
                    ('📄', 'Regel 3: Strukturierte PDF-Dossiers mit SHA-256 übergeben', 'Vermeiden Sie lose Sprachnachrichten. Legen Sie ein formatiertes PDF-Protokoll mit Pegelkurven und Prüfsummen vor, damit Verwaltung oder Vermieter sofort handeln.'),
                    ('⚖️', 'Regel 4: Zivile Beweiskraft realistisch einordnen', 'SOUNDTEST.PRO liefert präzise zivile Dokumentationen für 95 % aller Nachbarschaftsfälle. Bei Gerichtsverfahren dient es als Basis für Sachverständigengutachten.')
                ],
                'fr': [
                    ('📅', 'Règle 1 : Plusieurs sessions courtes valent mieux qu’un enregistrement continu', 'Un journal de 10 jours montrant des chocs répétés de plus de 65 dBA à 1h30 est accablant. Un fichier de 2 heures est rarement écouté et souvent rejeté comme anomalie.'),
                    ('📍', 'Règle 2 : Maintenez le même point de mesure et l’état des fenêtres', 'Mesurez au centre de la pièce à 1,2 mètre du sol. Précisez systématiquement si fenêtres et portes étaient closes pour exclure les bruits extérieurs.'),
                    ('📄', 'Règle 3 : Remettez des synthèses PDF avec empreinte SHA-256', 'N’envoyez pas d’audios bruts par message. Fournissez un document PDF structuré avec graphiques et sceau cryptographique pour contraindre à une réponse formelle.'),
                    ('⚖️', 'Règle 4 : Distinguez constat civil et expertise homologuée', 'SOUNDTEST.PRO offre une documentation civile de haute précision résolvant 95% des conflits amiables. En cas de procès, elle guide l’intervention d’un expert agréé.')
                ],
                'ja': [
                    ('📅', '鉄則1：1回の長時間録音より、複数日・短時間の定時記録が圧倒的に強い', '「深夜1時30分に65dB超の足音」が10日間連続しているデータは決定的です。2時間のダラダラした録音は誰も聴かず「たまたまでは？」と一蹴されます。'),
                    ('📍', '鉄則2：測定位置と部屋の状態（窓・扉の開閉）を毎回統一する', '影響を受けている部屋の中央、床上約1.2mで測定します。外の道路騒音の影響を排除するため、窓と室内扉を閉めていた事実を必ず記録に残してください。'),
                    ('📄', '鉄則3：バラバラの音声ではなく、SHA-256ハッシュ入りPDF報告書で提出する', 'LINE等でバラバラに音声ファイルを送るのは逆効果です。校正値、グラフ、改ざん防止ハッシュが1枚にまとまったPDFを渡すことで、管理側は即座に動かざるを得なくなります。'),
                    ('⚖️', '鉄則4：市民向け証拠記録と法定計量器の境界線を正しく理解する', 'SOUNDTEST.PROの高精度な記録で賃貸・マンション管理組合の紛争の95%は解決します。正式な民事訴訟に発展する場合は、認定計量士による検定器と併用してください。')
                ],
                'ko': [
                    ('📅', '수칙 1: 1번의 긴 녹음보다 여러 날에 걸친 짧은 반복 측정이 결정적입니다', '새벽 1시 30분에 65 dBA 이상의 발망치가 10일간 반복된 통계는 법적으로 반박 불가능합니다. 2시간짜리 단발성 녹음은 아무도 끝까지 듣지 않으며 일회성으로 치부됩니다.'),
                    ('📍', '수칙 2: 측정 위치와 실내 환경(창문 및 문 닫힘)을 항상 동일하게 유지하세요', '피해가 발생하는 방의 중앙, 바닥에서 약 1.2m 높이에서 측정합니다. 외부 도로 소음 간섭을 배제하기 위해 창문과 방문을 닫았음을 기록에 반드시 남기세요.'),
                    ('📄', '수칙 3: 메신저 음성 파일 대신 SHA-256 해시가 담긴 정리된 PDF 리포트를 제출하세요', '단편적인 음성 파일 전송은 설득력이 떨어집니다. 교정 오프셋, 시계열 그래프, 무결성 해시가 포함된 공인 양식의 PDF를 전달해야 관리 주체가 즉각 조치합니다.'),
                    ('⚖️', '수칙 4: 민간 증거 보존과 법정 공인 계측의 범위를 명확히 이해하세요', 'SOUNDTEST.PRO는 이웃 협의 및 분쟁 조정의 95%를 해결하는 높은 정밀도를 제공합니다. 정식 민사 손해배상 소송 청구 시에는 본 데이터를 바탕으로 공인 측정을 병행하세요.')
                ],
                'th': [
                    ('📅', 'กฎข้อที่ 1: การบันทึกสั้นๆ หลายวัน มีน้ำหนักมากกว่าการอัดเสียงยาวครั้งเดียว', 'บันทึก 10 วันที่แสดงเสียงกระแทกเกิน 65 dBA ตอนตี 1:30 น. เป็นหลักฐานที่ปฏิเสธไม่ได้ การอัดเสียงยาว 2 ชั่วโมงแทบไม่มีใครเปิดฟังและมักถูกปัดว่าเป็นเหตุสุดวิสัย.'),
                    ('📍', 'กฎข้อที่ 2: ตั้งตำแหน่งวัดและสภาพห้องให้เหมือนเดิมทุกครั้ง', 'วัดจากกึ่งกลางห้อง สูงจากพื้นประมาณ 1.2 เมตร และระบุในบันทึกเสมอว่าปิดประตูหน้าต่างมิดชิด เพื่อตัดเสียงรบกวนจากการจราจรภายนอก.'),
                    ('📄', 'กฎข้อที่ 3: ยื่นเอกสารสรุป PDF พร้อมรหัสตรวจสอบ SHA-256', 'อย่าส่งไฟล์เสียงเดี่ยวๆ ผ่านแชต ให้ยื่นเอกสารสรุป PDF ที่มีกราฟ ค่าชดเชย และรหัสตรวจสอบความถูกต้อง เพื่อให้นิติบุคคลต้องดำเนินการทันที.'),
                    ('⚖️', 'กฎข้อที่ 4: เข้าใจขอบเขตระหว่างหลักฐานภาคประชาชนและเครื่องมือตรวจวัดทางกฎหมาย', 'SOUNDTEST.PRO ให้ข้อมูลหลักฐานที่มีความแม่นยำสูงซึ่งช่วยยุติข้อพิพาทเพื่อนบ้านได้ถึง 95% หากเข้าสู่กระบวนการฟ้องร้องในศาล สามารถใช้ร่วมกับเครื่องวัดมาตรฐาน.')
                ],
                'vi': [
                    ('📅', 'Quy tắc 1: Nhiều phiên đo ngắn qua nhiều ngày có giá trị hơn 1 bản ghi âm dài', 'Nhật ký 10 ngày ghi nhận tiếng nện sàn trên 65 dBA lúc 1h30 sáng có sức nặng áp đảo. Một bản ghi âm dài 2 tiếng hiếm khi được nghe hết và dễ bị coi là ngoại lệ.'),
                    ('📍', 'Quy tắc 2: Giữ cố định vị trí đo và trạng thái phòng', 'Đo từ trung tâm phòng, cách sàn khoảng 1.2 mét. Luôn ghi chú tình trạng cửa sổ và cửa phòng đóng kín để loại trừ tiếng ồn xe cộ bên ngoài.'),
                    ('📄', 'Quy tắc 3: Nộp hồ sơ PDF hoàn chỉnh có mã băm SHA-256', 'Đừng gửi các đoạn ghi âm rời rạc qua tin nhắn. Hãy gửi tập hồ sơ PDF chuẩn hóa có biểu đồ và chữ ký số để ban quản lý buộc phải xử lý ngay.'),
                    ('⚖️', 'Quy tắc 4: Hiểu rõ ranh giới giữa chứng cứ dân sự và giám định tư pháp', 'SOUNDTEST.PRO cung cấp tài liệu dân sự độ chính xác cao giúp giải quyết 95% tranh chấp hòa giải. Trong các vụ kiện tụng chính thức, hãy kết hợp với thiết bị kiểm định.')
                ]
            }
        },
        'faqs': {
            'es': [
                ("¿Pueden usarse las grabaciones móviles como prueba de ruido vecinal?",
                 "En la mayoría de jurisdicciones, los audios registrados dentro de su propio domicilio son admisibles como prueba indiciaria y documental en mediaciones, quejas a la comunidad de propietarios y arbitrajes. Al acompañar el sonido con curvas de decibelios con marca de tiempo, fotos con lectura de dB y un registro continuado de varios días, su fuerza probatoria es infinitamente superior a un audio suelto. SOUNDTEST.PRO es un instrumento civil de documentación; ante litigios formales, compleméntelo con sonómetros homologados."),
                ("¿Qué nivel de decibelios se considera acoso o infracción por ruido?",
                 "La OMS considera que niveles nocturnos en el dormitorio superiores a 30-35 dBA suponen un riesgo directo para el sueño. La mayoría de ordenanzas municipales sancionan ruidos residenciales nocturnos reiterados que superen los 40-45 dBA (o 55-65 dBA en horario diurno). La clave para ganar una reclamación radica en demostrar la reiteración continuada y no un pico accidental."),
                ("¿Cuánto tiempo debo recopilar datos antes de formular una queja oficial?",
                 "Un registro de 7 a 14 días que acredite entre 5 y 10 episodios reiterados de infracción resulta mucho más sólido que una queja precipitada. Active el Modo Centinela nocturno para documentar los picos de madrugada de forma automática y exporte el dosier en PDF."),
                ("¿Conviene hablar primero con el vecino o empezar a documentar?",
                 "Ambas acciones deben iniciarse en paralelo. Comience a registrar desde el primer día para tener una referencia objetiva. Si una conversación amistosa resuelve el problema, perfecto. Pero si niegan el ruido o reaccionan con hostilidad, dispondrá de inmediato de un registro documental contrastado ante el administrador o las autoridades.")
            ],
            'de': [
                ("Können Smartphone-Aufnahmen als Beweis für Nachbarschaftslärm genutzt werden?",
                 "In den meisten Ländern sind Aufnahmen in den eigenen vier Wänden als unterstützende Beweise bei Schlichtungen, Vermieterbeschwerden und Mietminderungen zulässig. In Kombination mit zeitgestempelten dB-Verläufen, Fotobeweisen mit Live-Pegel und einem Mehrtagesprotokoll ist die Beweiskraft deutlich höher als bei einfachen Audiodateien. SOUNDTEST.PRO ist ein ziviles Dokumentationswerkzeug; für gerichtliche Gutachten sind geeichte Messungen erforderlich."),
                ("Ab welchem Dezibelwert gilt Nachbarschaftslärm als rechtswidrig?",
                 "Die WHO stuft nächtliche Innenraumpegel über 30–35 dBA als gesundheitsgefährdend für den Schlaf ein. Kommunale Lärmschutzverordnungen setzen die Grenze während der Nachtruhe (22:00–06:00 Uhr) meist bei 35–40 dBA an. Entscheidend für Rechtsansprüche wie Mietminderung ist der Nachweis regelmäßiger, unzumutbarer Überschreitungen über längere Zeiträume."),
                ("Wie lange sollte man Lärm dokumentieren, bevor man Beschwerde einlegt?",
                 "Ein lückenloses Lärmprotokoll über 7 bis 14 Tage mit 5 bis 10 dokumentierten Störungen ist wesentlich stichhaltiger als eine Momentaufnahme. Nutzen Sie den Nachtwächter-Modus, um nächtliche Störspitzen automatisiert zu erfassen, und exportieren Sie anschließend das PDF-Dossier."),
                ("Sollte man zuerst das Gespräch suchen oder direkt protokollieren?",
                 "Beides parallel. Beginnen Sie ab dem ersten Vorfall mit der neutralen Dokumentation. Lässt sich die Situation im freundlichen Gespräch klären, umso besser. Weist der Verursacher die Vorwürfe jedoch zurück, besitzen Sie sofort belastbare Fakten für Vermieter, Hausverwaltung oder Schiedsamt.")
            ],
            'fr': [
                ("Les enregistrements sur téléphone sont-ils recevables comme preuve ?",
                 "Dans la plupart des pays, les enregistrements effectués chez soi sans intrusion sont recevables à titre d’éléments de preuve devant le syndic, le bailleur ou le tribunal de proximité. Associer l’audio à des courbes de dB horodatées, des photos avec valeurs en direct et un historique sur plusieurs jours confère une force probante majeure. SOUNDTEST.PRO est un outil documentaire civil ; les recours judiciaires lourds s’appuient ensuite sur un sonomètre de Classe 1/2."),
                ("Quel niveau de décibels caractérise un trouble anormal de voisinage ?",
                 "L’OMS préconise un niveau sonore nocturne inférieur à 30–35 dBA dans la chambre à coucher. La réglementation relative aux bruits de voisinage sanctionne l’émergence globale dès qu’elle dépasse 3 à 5 dB au-dessus du bruit ambiant la nuit. L’élément décisif réside dans la répétition, la durée et l’intensité du trouble."),
                ("Combien de temps faut-il consigner les bruits avant de saisir les autorités ?",
                 "Un journal rigoureux de 7 à 14 jours attestant de 5 à 10 épisodes probants est bien plus défendable qu’une saisine impulsive. Utilisez le Mode Sentinelle pour enregistrer automatiquement les nuisances nocturnes, puis générez votre dossier PDF."),
                ("Faut-il discuter d’abord avec le voisin ou commencer à mesurer ?",
                 "Les deux en même temps. Mesurez discrètement dès le premier jour pour disposer d’une base factuelle indiscutable. Si un dialogue courtois aboutit, le conflit s’éteint. S’il nie ou devient agressif, votre dossier est déjà constitué pour le syndic ou les forces de l’ordre.")
            ],
            'ja': [
                ("スマホによる測定や録音は近隣騒音の証拠として有効ですか？",
                 "自室の室内で測定・記録したデータは、管理会社への相談、理事会での協議、民事調停における有力な疎明資料（客観的証拠）として広く採用されます。音声だけでなく、タイムスタンプ付きのデシベル推移グラフ、数値刻印写真、複数日の被害日誌が揃うことで信用性が飛躍的に高まります。※裁判の決定打とするには認定計量士による公式測定の併用が推奨されます。"),
                ("どのくらいのデシベル数から受忍限度超過（違法）とみなされますか？",
                 "環境省の環境基準および各自治体の公害防止条例では、深夜帯（22時〜翌6時）の室内騒音は40〜45 dBA以下、WHO指針では30〜35 dBAが安眠基準とされています。かかと歩きや重低音で50〜65 dBA以上が断続的に発生している場合、社会生活上の受忍限度を超えていると判断される可能性が極めて高くなります。"),
                ("管理会社や公的窓口に相談する前に、何日間記録すべきですか？",
                 "最低でも7日〜14日間、5回以上の超過記録を蓄積することが極めて効果的です。「いつ、何時何分に、何デシベルの音が発生したか」が一覧化されたPDFレポートを提出することで、管理会社も「単なるクレーマー」ではなく「実害を被っている被害者」として迅速に動きます。"),
                ("直接相手に注意するべきですか？ それとも先に記録を集めるべきですか？",
                 "記録の収集を最優先、または並行して進めてください。客観的なデータがない状態で直接訪問すると、「そんな音は出していない」と感情論の対立に発展し、関係が悪化するリスクがあります。あらかじめ記録を取っておけば、管理会社を通じた公式通知や第三者調停へスムーズに移行できます。")
            ],
            'ko': [
                ("스마트폰으로 측정한 소음 데이터가 법적 증거로 인정받을 수 있나요?",
                 "본인의 주거 공간 내부에서 직접 측정한 데이터는 관리사무소 민원, 층간소음이웃사이센터 분쟁 조정, 내용증명 발송 및 법원 소송 시 매우 유력한 정황 증거(소명 자료)로 활용됩니다. 단순 녹음본과 달리 시간대별 데시벨 수치, 파형 그래프, 워터마크 사진이 결합된 보고서는 증거 가치가 매우 높습니다."),
                ("몇 데시벨(dBA)부터 법적 기준 초과로 인정되나요?",
                 "공동주택 층간소음의 범위와 기준에 관한 규칙상, 직접충격 소음의 야간(22:00~06:00) 기준은 1분 등가소음도(LAeq) 34 dBA, 최고소음도(Lmax) 52 dBA입니다. 위층의 발망치나 가구 끄는 소리로 순간 피크가 55~65 dBA 이상 지속된다면 명백한 법적 기준 초과에 해당합니다."),
                ("공식 민원이나 조정을 신청하기 전 며칠 동안 기록해야 하나요?",
                 "최소 7일에서 14일 동안, 5회 이상의 초과 사례를 축적하는 것이 가장 효과적입니다. 일회성 소음은 상대방이 '어쩌다 한 번'이라고 발뺌하기 쉽지만, 다일간의 시계열 보고서는 상습성과 고의성을 입증하는 결정적 무기가 됩니다."),
                ("이웃을 직접 찾아가서 따져야 할까요, 기록부터 해야 할까요?",
                 "직접 대면하기 전에 객관적인 기록부터 확보하는 것이 원칙입니다. 증거 없이 찾아갔다가는 감정 싸움으로 번지거나 주거침입·스토킹 등 역고소를 당할 위험이 있습니다. 객관적인 데시벨 리포트를 먼저 구축한 후 관리사무소나 공문서를 통해 전달하는 것이 가장 안전합니다.")
            ],
            'th': [
                ("การบันทึกเสียงด้วยสมาร์ตโฟนสามารถใช้เป็นหลักฐานได้หรือไม่?",
                 "ในทางกฎหมายและระเบียบที่อยู่อาศัย ข้อมูลเสียงที่คุณบันทึกในห้องพักของตนเองสามารถใช้เป็นหลักฐานสนับสนุนที่มีน้ำหนักในการไกล่เกลี่ยของนิติบุคคล หรือคณะกรรมการระงับข้อพิพาท ยิ่งมีกราฟเดซิเบลประทับเวลาและรูปถ่ายยืนยัน หลักฐานจะมีความน่าเชื่อถือสูงกว่าการส่งคลิปเสียงธรรมดา."),
                ("ระดับเสียงกี่เดซิเบลถึงถือว่าเป็นการสร้างความเดือดร้อนรำคาญทางกฎหมาย?",
                 "ตามคำแนะนำขององค์การอนามัยโลก (WHO) เสียงในห้องนอนยามค่ำคืนไม่ควรเกิน 30-35 dBA และกฎหมายท้องถิ่นส่วนใหญ่กำหนดว่าเสียงรบกวนยามวิกาลที่เกิน 40-50 dBA อย่างต่อเนื่องถือเป็นเหตุรำคาญ หัวใจสำคัญของการชนะข้อพิพาทคือการพิสูจน์ว่าเป็นพฤติกรรมที่เกิดขึ้นซ้ำๆ มิใช่เหตุบังเอิญ."),
                ("ควรบันทึกข้อมูลนานแค่ไหนก่อนยื่นเรื่องร้องเรียนอย่างเป็นทางการ?",
                 "ควรบันทึกข้อมูลอย่างน้อย 7 ถึง 14 วัน โดยมีหลักฐานเหตุการณ์เกินเกณฑ์ 5 ถึง 10 ครั้ง แฟ้มข้อมูลที่มีความต่อเนื่องจะทำให้นิติบุคคลหรือเจ้าหน้าที่ตระหนักถึงความรุนแรงและดำเนินการตักเตือนคู่กรณีทันที."),
                ("ควรไปคุยกับข้างห้องก่อนหรือเริ่มบันทึกหลักฐานก่อน?",
                 "ควรทำควบคู่กันโดยเริ่มบันทึกหลักฐานตั้งแต่วันแรก หากการพูดคุยด้วยความสุภาพสามารถแก้ปัญหาได้ก็ถือว่าดี แต่หากคู่กรณีปฏิเสธหรือมีท่าทีก้าวร้าว คุณจะมีหลักฐานที่เป็นรูปธรรมพร้อมดำเนินการขั้นต่อไปได้ทันที.")
            ],
            'vi': [
                ("Ghi âm và đo tiếng ồn bằng điện thoại có được chấp nhận làm bằng chứng không?",
                 "Âm thanh và dữ liệu đo được thực hiện bên trong không gian riêng của bạn hoàn toàn hợp pháp và được coi là chứng cứ hỗ trợ quan trọng trong các cuộc hòa giải, khiếu nại ban quản trị chung cư hoặc chính quyền địa phương. Khi kết hợp đồ thị dB có dấu thời gian và ảnh chụp hiện trường, giá trị chứng minh sẽ thuyết phục hơn rất nhiều so với file ghi âm đơn lẻ."),
                ("Mức decibel bao nhiêu thì bị coi là vi phạm trật tự tiếng ồn?",
                 "Quy chuẩn kỹ thuật quốc gia về tiếng ồn quy định mức giới hạn tối đa tại khu vực dân cư từ 21h đến 6h sáng là 45 dBA. WHO khuyến nghị tiếng ồn phòng ngủ ban đêm không nên vượt quá 30–35 dBA. Yếu tố quyết định để xử lý khiếu nại là chứng minh được sự tái diễn thường xuyên gây ảnh hưởng đến sức khỏe và sinh hoạt."),
                ("Nên theo dõi và ghi nhật ký trong bao lâu trước khi nộp đơn khiếu nại?",
                 "Bạn nên theo dõi liên tục từ 7 đến 14 ngày, ghi nhận từ 5 đến 10 phiên vượt ngưỡng rõ rệt. Một bản báo cáo tổng hợp nhiều ngày chứng minh hành vi gây ồn mang tính hệ thống, giúp ban quản lý tòa nhà có đủ cơ sở pháp lý để lập biên bản xử lý."),
                ("Nên sang nhắc nhở trực tiếp hay âm thầm thu thập chứng cứ trước?",
                 "Bạn nên âm thầm thu thập chứng cứ ngay từ ngày đầu tiên. Nếu sau đó bạn góp ý hòa nhã mà đối phương tiếp thu thì rất tốt. Nhưng nếu họ phủ nhận hoặc có thái độ thách thức, bạn đã có sẵn tập hồ sơ chứng cứ vững chắc để yêu cầu cơ quan có thẩm quyền can thiệp.")
            ]
        },
        'cta_band': {
            'es': ('¿Listo para poner fin a las molestias de ruido vecinal?',
                   'Comience a registrar sus mediciones gratis en 10 segundos directamente en su navegador. Sin compras de hardware, sin descargas de tiendas, 100% privado.'),
            'de': ('Bereit, dem Nachbarschaftslärm ein Ende zu setzen?',
                   'Starten Sie Ihre kostenlose Lärmmessung in 10 Sekunden direkt im Browser. Keine Hardwareanschaffung, kein App-Download, 100% datenschutzkonform.'),
            'fr': ('Prêt à mettre un terme aux nuisances de voisinage ?',
                   'Commencez à documenter gratuitement en 10 secondes directement dans votre navigateur. Sans matériel onéreux, sans téléchargement d’application, 100% confidentiel.'),
            'ja': ('耐え難い近隣騒音トラブルに、今すぐ終止符を打ちませんか？',
                   '専用機器の購入もアプリのダウンロードも不要。ブラウザを開いて10秒で無料測定を開始できます。完全プライベート・安心のローカル保存。'),
            'ko': ('지긋지긋한 층간소음 고통, 이제 객관적인 증거로 해결하세요',
                   '비싼 소음측정기 구입이나 앱 설치 없이 브라우저에서 10초 만에 무료 측정을 시작할 수 있습니다. 100% 로컬 보안 보장.'),
            'th': ('พร้อมที่จะยุติปัญหาเสียงรบกวนจากข้างห้องแล้วหรือยัง?',
                   'เริ่มบันทึกข้อมูลเสียงได้ฟรีใน 10 วินาทีผ่านเบราว์เซอร์ของคุณ ไม่ต้องซื้ออุปกรณ์เสริม ไม่ต้องโหลดแอป รักษาความเป็นส่วนตัว 100%.'),
            'vi': ('Sẵn sàng chấm dứt nỗi ám ảnh tiếng ồn từ hàng xóm?',
                   'Bắt đầu đo lường hoàn toàn miễn phí chỉ trong 10 giây ngay trên trình duyệt. Không cần mua máy đo tốn kém, không cần cài app, bảo mật 100%.')
        }
    }
}

print("Scenario 1 data loaded.")
