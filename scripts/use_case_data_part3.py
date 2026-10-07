# scripts/use_case_data_part3.py
# Scenarios 4, 5, 6 data for es, de, fr, ja, ko, th, vi

SCENARIOS_PART_3 = {
    'property-noise-complaint-report': {
        'img': 'property_noise_report.webp',
        'img_alt': {
            'es': 'Inquilino agotado en el escritorio con notas ignoradas y tableta mostrando dosier pericial oficial a 72.4 dBA',
            'de': 'Erschöpfter Bewohner am Schreibtisch mit Beschwerdezetteln und Tablet mit offiziellem Lärmdossier bei 72,4 dBA',
            'fr': 'Résident épuisé à son bureau avec réclamations ignorées et tablette affichant un dossier officiel à 72,4 dBA',
            'ja': '深夜のデスクで山積みの苦情メモに頭を抱え、タブレットで72.4dBAの公式証拠レポートを表示する居住者',
            'ko': '심야의 책상에서 무시당한 민원 쪽지에 지쳐 태블릿으로 72.4 dBA 공식 증거 보고서를 확인하는 입주민',
            'th': 'ผู้อยู่อาศัยที่เหนื่อยล้าที่โต๊ะทำงานพร้อมโน้ตข้อร้องเรียนและแท็บเล็ตแสดงรายงานหลักฐานทางการ 72.4 dBA',
            'vi': 'Cư dân mệt mỏi bên bàn làm việc với các tờ giấy phàn nàn và máy tính bảng hiển thị hồ sơ bằng chứng 72.4 dBA'
        },
        'stats': {
            'es': [('Unidad y piso', 'Etiquetas de sala'), ('±1.5 dB', 'Precisión pericial'), ('SHA-256', 'Sello digital'), ('PDF Oficial', 'Apto para juntas')],
            'de': [('Wohnung & Etage', 'Strukturierte Tags'), ('±1,5 dB', 'Referenzgenauigkeit'), ('SHA-256', 'Prüfsumme'), ('PDF-Protokoll', 'Beiratsfest')],
            'fr': [('Bâtiment & étage', 'Balises précises'), ('±1,5 dB', 'Précision étalonnée'), ('SHA-256', 'Sceau d’intégrité'), ('Rapport PDF', 'Prêt pour le syndic')],
            'ja': [('棟・階・号室', '構造化タグ'), ('±1.5 dB', '校正基準精度'), ('SHA-256', '改ざん防止ハッシュ'), ('PDF調停書', '理事会・総会提出用')],
            'ko': [('동·호수 표기', '구조화된 태그'), ('±1.5 dB', '공인 교정 정밀도'), ('SHA-256', '무결성 해시'), ('PDF 보고서', '입대의·관리실 제출')],
            'th': [('อาคารและห้อง', 'แท็กตำแหน่งชัดเจน'), ('±1.5 dB', 'ความแม่นยำเทียบมาตรฐาน'), ('SHA-256', 'รหัสตรวจสอบดิจิทัล'), ('รายงาน PDF', 'พร้อมยื่นนิติบุคคล')],
            'vi': [('Căn hộ & tầng', 'Gắn thẻ vị trí'), ('±1.5 dB', 'Độ chính xác chuẩn'), ('SHA-256', 'Mã băm bảo mật'), ('Báo cáo PDF', 'Nộp ban quản trị')]
        },
        'hero': {
            'es': {
                'eyebrow': 'Caso de uso · Administración de fincas y comunidades',
                'headline': 'Dote a administradores y comités de una forma estandarizada de <em>verificar y resolver quejas</em>.',
                'lead': 'Deje atrás las disputas basadas en la palabra de uno contra la de otro. Permita que administradores de fincas, comités y conserjes registren visitas con edificio, planta, vivienda, coordenadas GPS, promedios en dB y fotos objetivos.'
            },
            'de': {
                'eyebrow': 'Anwendungsfall · Hausverwaltung &amp; Eigentümergemeinschaft',
                'headline': 'Standardisierte Nachweise für Hausverwaltungen zur <em>sachlichen Konfliktlösung</em>.',
                'lead': 'Beenden Sie endlose Diskussionen nach dem Prinzip Aussage gegen Aussage. Ermöglichen Sie Verwaltungen, Beiräten und Sicherheitsdiensten die objektive Protokollierung vor Ort mit Etagen-, Wohnungs- und Pegeldaten sowie Fotodokumentation.'
            },
            'fr': {
                'eyebrow': 'Cas d’usage · Syndics de copropriété &amp; gestion immobilière',
                'headline': 'Offrez aux syndics une méthode standardisée pour <em>vérifier et arbitrer les plaintes</em>.',
                'lead': 'Mettez fin aux conflits stériles entre copropriétaires ou locataires. Permettez aux gestionnaires et gardiens d’établir des constats indiscutables mentionnant le bâtiment, l’étage, le lot, les coordonnées GPS et les niveaux sonores.'
            },
            'ja': {
                'eyebrow': '利用シーン · 管理会社・マンション管理組合・理事会',
                'headline': '水掛け論の苦情対応を終わらせ、<em>客観的なデータで迅速調停</em>。',
                'lead': '「音がした」「出していない」という主観の対立から脱却。管理会社フロント担当者や理事会役員が、棟・階・号室・GPS座標・実測デシベル平均・写真を一体化した標準調査票を作成し、住民トラブルを円満かつ公平に解決へ導きます。'
            },
            'ko': {
                'eyebrow': '활용 사례 · 관리사무소 및 아파트 입주자대표회의',
                'headline': '입주민 간 소모적인 감정 싸움을 끝내고 <em>표준화된 현장 검측으로 중재</em>하세요.',
                'lead': '당사자 간의 진실 공방으로 번지는 층간소음 민원에 명확한 기준을 제시합니다. 관리사무소 관리소장 및 보안팀이 동·호수별 현장 방문 계측, GPS 좌표, 실시간 데시벨 통계 및 현장 사진을 단일 리포트로 관리할 수 있습니다.'
            },
            'th': {
                'eyebrow': 'กรณีการใช้งาน · นิติบุคคลอาคารชุดและผู้จัดการตึก',
                'headline': 'มอบแนวทางที่เป็นมาตรฐานให้นิติบุคคลเพื่อ<em>ตรวจสอบและยุติข้อพิพาท</em>.',
                'lead': 'หยุดการโต้เถียงที่ไม่มีวันจบสิ้น ช่วยให้ผู้จัดการอาคาร กรรมการนิติบุคคล และทีมรปภ. สามารถบันทึกการตรวจสอบสถานที่จริง พร้อมระบุอาคาร ชั้น ห้องชุด พิกัด GPS และรูปถ่ายยืนยัน.'
            },
            'vi': {
                'eyebrow': 'Trường hợp sử dụng · Ban quản lý tòa nhà &amp; ban quản trị',
                'headline': 'Cung cấp cho ban quản lý phương thức chuẩn hóa để <em>xác minh và giải quyết khiếu nại</em>.',
                'lead': 'Chấm dứt những tranh cãi không hồi kết giữa các bên. Giúp ban quản lý, ban quản trị và bảo vệ ghi nhận các biên bản kiểm tra thực địa chuẩn xác gồm số tòa, số tầng, số phòng, tọa độ GPS và hình ảnh trực quan.'
            }
        },
        'table': {
            'headers': {
                'es': ('Nivel medido', 'Fuente habitual en el edificio', 'Criterio normativo del edificio', 'Acción recomendada'),
                'de': ('Gemessener Pegel', 'Typische Geräuschquelle im Haus', 'Hausordnung & Richtwert', 'Handlungsempfehlung'),
                'fr': ('Niveau mesuré', 'Source courante dans l’immeuble', 'Règlement de copropriété', 'Mesure recommandée'),
                'ja': ('実測値', 'マンション内の代表的音源', '管理規約・受忍限度基準', '推奨管理対応'),
                'ko': ('측정치', '단지 내 주요 소음원', '관리규약 및 공동체 기준', '관리사무소 권장 조치'),
                'th': ('ระดับที่วัดได้', 'แหล่งกำเนิดเสียงในอาคาร', 'ข้อบังคับอาคารชุด', 'การดำเนินการที่แนะนำ'),
                'vi': ('Mức đo được', 'Nguồn ồn phổ biến trong tòa nhà', 'Nội quy quản lý tòa nhà', 'Hành động khuyến nghị')
            },
            'title': {
                'es': 'Baremos de ruido para régimen interno y estatutos de comunidad',
                'de': 'Richtwert-Tabelle für Hausordnung und Gemeinschaftsbeschlüsse',
                'fr': 'Grille de référence pour règlements de copropriété et médiation',
                'ja': '集合住宅管理規約・コミュニティ騒音判定基準表',
                'ko': '공동주택 관리규약 및 층간소음 중재 판정 기준표',
                'th': 'เกณฑ์ระดับเสียงสำหรับระเบียบข้อบังคับอาคารชุด',
                'vi': 'Khung tham chiếu nội quy và biên bản xử lý tiếng ồn chung cư'
            },
            'lead': {
                'es': 'Estandarice los criterios de intervención de su equipo de administración de fincas.',
                'de': 'Vereinheitlichen Sie die Reaktionskriterien Ihres Verwaltungsteams auf objektiver Faktenbasis.',
                'fr': 'Standardisez les critères d’intervention de vos équipes de gardiennage et syndics.',
                'ja': '苦情受付時の管理側スタッフによる現地確認・一次対応基準を平準化できます。',
                'ko': '관리사무소 및 층간소음관리위원회의 현장 조사 및 1차 중재 기준을 표준화합니다.',
                'th': 'สร้างมาตรฐานในการปฏิบัติงานของทีมนิติบุคคลเมื่อได้รับแจ้งข้อร้องเรียน.',
                'vi': 'Chuẩn hóa quy trình phản ứng nhanh của ban quản lý khi nhận được phản ánh tiếng ồn.'
            },
            'rows': {
                'es': [
                    ('< 40 dBA', 'Ruido de fondo en pasillo común, ascensores modernos', 'Nivel de confort óptimo; no procede apercibimiento formal', 'badge-safe', 'Nivel normal'),
                    ('45 – 52 dBA', 'Conversación animada, aspiradora de día, música baja', 'Sonido de convivencia ordinaria; admisible en horario diurno', 'badge-mild', 'Convivencia normal'),
                    ('55 – 65 dBA', 'Fiestas en vivienda, música con graves, obras sin permiso', 'Supera los límites de la ordenanza municipal; requiere aviso formal', 'badge-moderate', 'Aviso por escrito'),
                    ('68 – 78 dBA', 'Gritos continuos, golpes violentos, mascotas solas', 'Infracción flagrante de los estatutos; apercibimiento y posible multa', 'badge-severe', 'Infracción estatutaria'),
                    ('80+ dBA', 'Equipos de sonido a volumen extremo, peleas violentas', 'Grave alteración de la seguridad comunitaria; aviso a policía local', 'badge-severe', 'Intervención policial')
                ],
                'de': [
                    ('< 40 dBA', 'Flurgrundgeräusch, leise Aufzugsfahrt', 'Normaler Wohnkomfort; kein Eingreifen der Hausverwaltung erforderlich', 'badge-safe', 'Normalbereich'),
                    ('45 – 52 dBA', 'Normale Gespräche, Staubsaugen am Tag, Radio', 'Übliche Wohnnutzung; während der Tagzeiten rechtlich hinzunehmen', 'badge-mild', 'Zulässiges Wohnen'),
                    ('55 – 65 dBA', 'Laute Feiern, Bassdröhnen, ungenehmigter Umbau', 'Verstoß gegen Hausordnung und Lärmschutz; schriftliche Abmahnung', 'badge-moderate', 'Abmahnung nötig'),
                    ('68 – 78 dBA', 'Fortgesetztes Poltern, laute Streitigkeiten, Hundegeheul', 'Erhebliche Störung des Hausfriedens; Anhörung des Eigentümers', 'badge-severe', 'Schwere Störung'),
                    ('80+ dBA', 'Musikanlage auf Höchstlast, extreme Randale', 'Gefahr für den Hausfrieden; Hinzuziehung der Polizei und Kündigungsprüfung', 'badge-severe', 'Polizeieinsatz')
                ],
                'fr': [
                    ('< 40 dBA', 'Bruit de fond des parties communes, ascenseur', 'Confort acoustique optimal ; aucun constat nécessaire', 'badge-safe', 'Conforme'),
                    ('45 – 52 dBA', 'Vie quotidienne normale, aspirateur le jour, radio basse', 'Bruits de comportement ordinaires ; autorisés en journée', 'badge-mild', 'Toléré'),
                    ('55 – 65 dBA', 'Musique forte, basses perceptibles, bricolage non déclaré', 'Infraction au règlement de copropriété ; courrier de rappel du syndic', 'badge-moderate', 'Rappel au règlement'),
                    ('68 – 78 dBA', 'Éclats de voix permanents, chocs répétés, chiens hurleurs', 'Trouble de jouissance manifeste ; mise en demeure par lettre recommandée', 'badge-severe', 'Mise en demeure'),
                    ('80+ dBA', 'Sono poussée au maximum, altercations violentes', 'Atteinte caractérisée à la tranquillité publique ; recours aux forces de l’ordre', 'badge-severe', 'Police requise')
                ],
                'ja': [
                    ('< 40 dBA', '共用廊下の暗騒音、最新エレベーターの昇降音', '良好な住居環境基準内；特段の管理対応は不要', 'badge-safe', '基準内良好'),
                    ('45 – 52 dBA', '日常会話、日中の掃除機、控えめなテレビ音量', '日常生活上やむを得ない許容範囲内の生活音', 'badge-mild', '受忍範囲内'),
                    ('55 – 65 dBA', '室内パーティー、ウーファー低音、未申請リフォーム', '管理規約違反基準超過；管理組合から該当住戸へ書面通知', 'badge-moderate', '改善注意通知'),
                    ('68 – 78 dBA', '継続的な床面打撃音、激しい怒号、長時間のペット鳴き声', '共同生活の平穏を著しく害する行為；理事会での聴聞・指導', 'badge-severe', '厳重警告・理事会指導'),
                    ('80+ dBA', 'オーディオ爆音、暴力沙汰、器物破損を伴う騒乱', '緊急性を伴う重大インシデント；警察通報および法的措置検討', 'badge-severe', '警察通報・法的対応')
                ],
                'ko': [
                    ('< 40 dBA', '공용 복도 배경음, 최신 엘리베이터 승강음', '쾌적한 공동주거 환경 수준; 별도 조치 불필요', 'badge-safe', '정상 범위'),
                    ('45 – 52 dBA', '통상적 가사 활동, 주간 청소기, 소형 가전음', '공동주택 생활에서 인정되는 통상적 생활 소음 범위', 'badge-mild', '허용 생활소음'),
                    ('55 – 65 dBA', '심야 홈파티, 우퍼 저음 진동, 미신고 리모델링', '공동주택 관리규약 위반 수준; 관리실 공식 1차 서면 경고 발송', 'badge-moderate', '관리실 공식 경고'),
                    ('68 – 78 dBA', '지속적인 바닥 충격음, 폭언 고성방가, 반려견 짖음', '입주자 공동체 질서의 중대한 침해; 층간소음관리위원회 회부', 'badge-severe', '분쟁조정위 회부'),
                    ('80+ dBA', '극단적 오디오 음압 폭력, 격렬한 다툼', '공동체 안전 위협 행위; 112 경찰 신고 및 손해배상 법적 대응', 'badge-severe', '경찰 출동 사유')
                ],
                'th': [
                    ('< 40 dBA', 'เสียงพื้นหลังทางเดินส่วนกลาง ลิฟต์โดยสาร', 'ระดับความสงบสุขมาตรฐาน ไม่จำเป็นต้องดำเนินการใดๆ', 'badge-safe', 'ระดับปกติ'),
                    ('45 – 52 dBA', 'การพูดคุยทั่วไป เสียงดูดฝุ่นเวลากลางวัน', 'เสียงการอยู่อาศัยตามปกติที่สามารถยอมรับได้เวลากลางวัน', 'badge-mild', 'ยอมรับได้'),
                    ('55 – 65 dBA', 'ปาร์ตี้ในห้อง เสียงเบสทึบ ต่อเติมห้องโดยไม่แจ้ง', 'ฝ่าฝืนระเบียบอาคารชุด นิติบุคคลออกหนังสือเตือนอย่างเป็นทางการ', 'badge-moderate', 'ออกหนังสือเตือน'),
                    ('68 – 78 dBA', 'เสียงกระแทกพื้นรุนแรง ทะเลาะวิวาท สัตว์เลี้ยงเห่า', 'สร้างความเดือดร้อนรำคาญร้ายแรง นิติบุคคลเชิญไกล่เกลี่ยพร้อมปรับเงิน', 'badge-severe', 'ฝ่าฝืนระเบียบร้ายแรง'),
                    ('80+ dBA', 'เครื่องเสียงดังขั้นสุด เหตุความวุ่นวาย', 'กระทบต่อความปลอดภัยส่วนรวม แจ้งตำรวจระงับเหตุทันที', 'badge-severe', 'แจ้งตำรวจระงับเหตุ')
                ],
                'vi': [
                    ('< 40 dBA', 'Âm thanh nền hành lang chung, thang máy êm', 'Môi trường sống lý tưởng; không cần can thiệp', 'badge-safe', 'Đạt chuẩn'),
                    ('45 – 52 dBA', 'Sinh hoạt thông thường, hút bụi ban ngày', 'Tiếng ồn sinh hoạt hợp lý; chấp nhận được vào ban ngày', 'badge-mild', 'Chấp nhận được'),
                    ('55 – 65 dBA', 'Tụ tập tiệc tùng, mở bass to, sửa chữa không báo', 'Vi phạm nội quy chung cư; ban quản lý gửi thông báo nhắc nhở', 'badge-moderate', 'Lập biên bản nhắc nhở'),
                    ('68 – 78 dBA', 'Nện sàn liên tục, cãi vã lớn tiếng, chó sủa lâu', 'Gây ảnh hưởng nghiêm trọng; ban quản trị mời lên làm việc và phạt nội quy', 'badge-severe', 'Xử phạt nội quy'),
                    ('80+ dBA', 'Dàn loa công suất cực lớn, xô xát gây rối', 'Đe dọa an ninh trật tự khu dân cư; yêu cầu công an can thiệp', 'badge-severe', 'Báo công an can thiệp')
                ]
            }
        },
        'steps': {
            'title': {
                'es': 'Protocolo estandarizado de resolución de quejas en fincas',
                'de': 'In 4 Schritten zu objektiver Konfliktbewältigung im Haus',
                'fr': 'Protocole standardisé de traitement des plaintes pour bruit',
                'ja': '管理会社・理事会による客観的騒音解決の4ステップ運用基準',
                'ko': '관리사무소 층간소음 민원 중재 4단계 표준 운영 프로토콜',
                'th': 'ขั้นตอนการจัดการข้อร้องเรียนเสียงของนิติบุคคลใน 4 ขั้นตอน',
                'vi': 'Quy trình 4 bước tiếp nhận và xử lý khiếu nại tiếng ồn của ban quản lý'
            },
            'lead': {
                'es': 'Permita que su equipo actúe con neutralidad y rigor técnico ante cualquier conflicto vecinal.',
                'de': 'Gewährleisten Sie rechtssicheres und neutrales Handeln Ihrer Mitarbeiter vor Ort.',
                'fr': 'Permettez à vos équipes de terrain d’intervenir avec impartialité et professionnalisme.',
                'ja': '主観的な感情のもつれに巻き込まれず、中立的・専門的にトラブルを解決する標準手順です。',
                'ko': '감정 대립을 방지하고 객관적 계측 사실에 입각하여 공정하게 중재하는 표준 매뉴얼입니다.',
                'th': 'ช่วยให้ทีมงานของคุณดำเนินการด้วยความเป็นกลางและมีหลักฐานอ้างอิงชัดเจน.',
                'vi': 'Quy chuẩn giúp đội ngũ ban quản lý hành động khách quan và dứt khoát trên cơ sở số liệu.'
            },
            'items': {
                'es': [
                    ('1', '📋', 'Registrar visita con datos de vivienda', 'Documente el número de portal, planta y puerta tanto de la vivienda reclamante como de la supuesta causante, con hora de inicio.'),
                    ('2', '⚖️', 'Comparar pasillo frente a interior', 'Mida el diferencial acústico en el descansillo común frente al interior de la vivienda para acreditar la propagación efectiva del ruido.'),
                    ('3', '📸', 'Adjuntar fotos de verificación técnica', 'Tome fotos del estado de puertas, elementos comunes o focos de vibración con los datos de decibelios incrustados en la imagen.'),
                    ('4', '📑', 'Generar parte oficial de mediación en PDF', 'Emita un informe unificado con hash digital para entregar a ambas partes y adjuntar al expediente de la comunidad.')
                ],
                'de': [
                    ('1', '📋', 'Vor-Ort-Protokoll mit Wohnungsdaten anlegen', 'Erfassen Sie Hausnummer, Etage und Wohnungsnummer von Beschwerdeführer und Verursacher mit exakter Uhrzeit.'),
                    ('2', '⚖️', 'Flur- vs. Innenraumpegel vergleichen', 'Messen Sie den Unterschied zwischen Hausflur und betroffener Wohnung, um die Ausbreitung objektiv zu belegen.'),
                    ('3', '📸', 'Fotobeweis der Ortsbesichtigung anhängen', 'Fotografieren Sie Wohnungstüren oder Schallüberträger mit direkt im Bild verankertem Messwert und Zeitstempel.'),
                    ('4', '📑', 'Neutralen Schlichtungsbericht als PDF exportieren', 'Erstellen Sie ein manipulationssicheres PDF-Dossier für die Streitparteien und die Akte der Eigentümergemeinschaft.')
                ],
                'fr': [
                    ('1', '📋', 'Ouvrir un constat d’intervention sur site', 'Consignez le bâtiment, l’étage et les numéros de lots du plaignant et de la source incriminée avec horodatage précis.'),
                    ('2', '⚖️', 'Comparer parties communes et volume privatif', 'Relevez le différentiel de dB entre le palier et l’intérieur de l’appartement pour objectiver l’émergence.'),
                    ('3', '📸', 'Joindre des clichés probatoires horodatés', 'Prenez des photos de la configuration des lieux avec incrustation des décibels relevés pendant la visite.'),
                    ('4', '📑', 'Éditer le rapport officiel de médiation PDF', 'Exportez une synthèse certifiée par empreinte SHA-256 à verser au dossier du syndicat des copropriétaires.')
                ],
                'ja': [
                    ('1', '📋', '対象住戸・日時の受付台帳登録', '通報者および被通報者の棟・階・号室、受付日時、申立内容をシステム上で構造化して記録します。'),
                    ('2', '⚖️', '共用廊下と受音住戸内の音圧差を比較計測', '玄関先廊下の暗騒音と室内での発生音圧の「差（暗騒音補正）」を計測し、騒音の侵入度合いを客観視。'),
                    ('3', '📸', '数値刻印付き現場調査写真を添付', '調査時の騒音値、時刻、GPS位置情報が焼き込まれた写真を現場エビデンスとして台帳に保存。'),
                    ('4', '📑', '理事会・調停用公式PDF調査報告書を発行', '改ざん防止ハッシュ付きの公正な報告書を出力し、当事者双方への提示および理事会協議の公的資料として活用。')
                ],
                'ko': [
                    ('1', '📋', '민원 접수 및 현장 방문 동·호수 등록', '피해 세대와 발생 세대의 동·호수, 방문 일시, 접수된 구체적 피해 양상을 표준 서식에 등록합니다.'),
                    ('2', '⚖️', '공용 복도와 실내 소음도 편차 측정', '복도의 암소음 레벨과 피해 세대 실내 소음의 상대적 편차를 측정하여 외부 유입 여부를 객관화합니다.'),
                    ('3', '📸', '현장 방문 실시간 워터마크 사진 첨부', '현장 방문 당시의 실측 데시벨, 시각, GPS 정보가 각인된 채증 사진을 단일 기록에 첨부합니다.'),
                    ('4', '📑', '입대의 및 중재용 공식 PDF 보고서 발행', '무결성 해시가 포함된 공인 양식의 중재 결과 보고서를 발행하여 당사자 열람 및 분쟁조정위에 제출합니다.')
                ],
                'th': [
                    ('1', '📋', 'ลงบันทึกการเข้าตรวจพร้อมระบุห้องชุด', 'ระบุอาคาร ชั้น และเลขที่ห้องของทั้งสองฝ่าย พร้อมเวลาที่เริ่มเข้าตรวจสอบ.'),
                    ('2', '⚖️', 'เปรียบเทียบค่าเสียงทางเดินกับในห้อง', 'วัดผลต่างของระดับเสียงบริเวณโถงทางเดินและภายในห้องพักเพื่อยืนยันการรั่วไหลของเสียง.'),
                    ('3', '📸', 'แนบภาพถ่ายการตรวจสอบพร้อมค่าเสียง', 'ถ่ายภาพบริเวณหน้าห้องหรือจุดกำเนิดเสียงพร้อมประทับค่าเดซิเบลและเวลา.'),
                    ('4', '📑', 'สร้างรายงานสรุปการไกล่เกลี่ยแบบ PDF', 'สร้างรายงาน PDF คุณภาพสูงที่มีรหัสตรวจสอบดิจิทัลเพื่อใช้ในการเจรจาไกล่เกลี่ยของนิติบุคคล.')
                ],
                'vi': [
                    ('1', '📋', 'Lập biên bản kiểm tra thực địa căn hộ', 'Ghi rõ số tòa nhà, số tầng, mã căn hộ của bên phản ánh và bên bị phản ánh cùng mốc giờ.'),
                    ('2', '⚖️', 'So sánh độ ồn hành lang và trong phòng', 'Đo chênh lệch âm thanh giữa khu vực hành lang chung và bên trong căn hộ để xác định độ phát tán.'),
                    ('3', '📸', 'Đính kèm ảnh chụp có đóng dấu số liệu', 'Chụp ảnh hiện trường có hiển thị chỉ số decibel và thời gian thực trong quá trình kiểm tra.'),
                    ('4', '📑', 'Xuất biên bản hòa giải chính thức dạng PDF', 'Tạo tài liệu PDF có chữ ký số để lưu hồ sơ ban quản trị và bàn giao cho các bên liên quan.')
                ]
            }
        },
        'features': {
            'title': {
                'es': 'Herramientas de gestión y mediación para comunidades de vecinos',
                'de': 'Verwaltungs- und Schlichtungswerkzeuge für Liegenschaften',
                'fr': 'Outils de médiation et de gestion pour les syndics',
                'ja': 'マンション管理・コミュニティ調停専用のプロフェッショナル機能',
                'ko': '관리사무소 및 공동주택 분쟁 중재 전용 전문 기능',
                'th': 'เครื่องมือการจัดการและไกล่เกลี่ยข้อพิพาทสำหรับอาคารชุด',
                'vi': 'Bộ công cụ quản lý và hòa giải chuyên biệt cho chung cư'
            },
            'lead': {
                'es': 'Diseñado para aportar rigor técnico y agilizar la labor de conserjes, juntas y administradores.',
                'de': 'Entwickelt zur Entlastung von Verwaltern, Beiräten und Schlichtungsstellen.',
                'fr': 'Conçu pour professionnaliser le traitement des plaintes et soulager les gestionnaires.',
                'ja': '管理組合・フロント担当者の負担を軽減し、住民トラブルを早期収束へ導く設計。',
                'ko': '관리소장과 층간소음위원회의 업무 부담을 덜고 신속한 분쟁 해결을 도모합니다.',
                'th': 'สร้างขึ้นเพื่อลดภาระของนิติบุคคลและช่วยให้ยุติข้อพิพาทได้อย่างรวดเร็ว.',
                'vi': 'Được thiết kế để giảm tải áp lực cho ban quản lý và nâng cao hiệu quả hòa giải.'
            },
            'items': {
                'es': [
                    ('🏢', 'Etiquetado jerárquico de viviendas', 'Organice las mediciones por edificio, portal, planta y puerta para disponer de un historial acumulado por inmueble.'),
                    ('⚖️', 'Diferencial pasillo / vivienda', 'Compara el sonido ambiente del descansillo comunitario con el interior para aislar la fuente de perturbación.'),
                    ('📸', 'Cámara de parte de incidencias', 'Incrusta en la fotografía la fecha, hora oficial, lectura en dBA y notas del conserje o técnico.'),
                    ('📊', 'Historial acumulado de quejas', 'Consolide las intervenciones realizadas a lo largo de semanas o meses para justificar sanciones estatutarias.'),
                    ('📑', 'Generador de cartas de mediación', 'Acceda a plantillas estandarizadas de requerimiento amistoso, aviso de sanción y citación a la junta directiva.'),
                    ('🔒', 'Privacidad y custodia conforme a RGPD', 'Los registros se conservan de forma segura sin almacenamiento no autorizado en servidores externos.')
                ],
                'de': [
                    ('🏢', 'Hierarchisches Wohnungs-Tagging', 'Strukturieren Sie Messprotokolle nach Gebäude, Etage und Wohnungsnummer für lückenlose Liegenschaftshistorien.'),
                    ('⚖️', 'Flur- und Innenraumdifferenzial', 'Gleicht den Flurpegel mit der Innenraummessung ab, um externe Lärmquellen zuverlässig auszuschließen.'),
                    ('📸', 'Fotodokumentation von Vorfällen', 'Bettet Uhrzeit, Datum und gemessene Dezibelwerte direkt in Begehungsfotos für die Akte ein.'),
                    ('📊', 'Langzeit-Vorfallshistorie', 'Dokumentiert wiederholte Beschwerden über Wochen und Monate als Grundlage für juristische Schritte.'),
                    ('📑', 'Muster-Schlichtungsbriefe', 'Nutzen Sie rechtssichere Vorlagen: von der freundlichen Mahnung bis zur Ankündigung von Sanktionen.'),
                    ('🔒', 'DSGVO-konforme Datenspeicherung', 'Keine unberechtigte Cloud-Übertragung; alle Berichte verbleiben lokal geschützt.')
                ],
                'fr': [
                    ('🏢', 'Classement hiérarchique par lot', 'Structurez les rapports par bâtiment, cage d’escalier et numéro d’appartement pour un suivi rigoureux.'),
                    ('⚖️', 'Différentiel palier / parties privatives', 'Isolez la source du bruit en mesurant l’atténuation acoustique entre la porte palière et le salon.'),
                    ('📸', 'Clichés horodatés de visite', 'Incorporez les relevés acoustiques et l’heure sur les photographies lors des tournées de contrôle.'),
                    ('📊', 'Journal historique des réclamations', 'Compilez les incidents répétés sur plusieurs mois pour justifier d’éventuelles poursuites ou amendes.'),
                    ('📑', 'Modèles d’avertissements officiels', 'Bénéficiez de courriers types : rappel au calme, convocation en commission de conciliation ou avertissement.'),
                    ('🔒', 'Conformité RGPD et stockage local', 'Protection absolue des données personnelles des résidents dans le navigateur local.')
                ],
                'ja': [
                    ('🏢', '棟・階・号室階層タグ管理', 'マンション全体の測定記録を部屋番号ごとに整理・蓄積し、再発時の経緯確認を即座に可能にします。'),
                    ('⚖️', '共用廊下・専有部差分判定', '玄関前廊下の騒音レベルと室内音の差分を比較し、外部要因による誤認通報を的確にフィルタリング。'),
                    ('📸', '調査員署名入り現場写真スタンプ', '日時、実測dBA、担当者メモを写真に直接埋め込み、理事会提出用の揺るぎない客観証拠を作成。'),
                    ('📊', '常習苦情インシデント履歴', '数週間から数か月にわたる対応履歴と数値推移を統合管理し、法的な注意勧告や規約改正の根拠に。'),
                    ('📑', '標準調停通知文ジェネレーター', '穏やかな注意ビラから、理事長名での公式是正勧告文、総会審議用レポートまで迅速生成。'),
                    ('🔒', '個人情報保護・ローカル完結保存', '居住者のプライバシーに関わる記録は外部に送信されず、端末内ローカルストレージで厳重管理。')
                ],
                'ko': [
                    ('🏢', '동·호수 계층화 태그 관리 시스템', '단지 내 측정 기록을 동·호수별로 체계적으로 분류하여 민원 재발 시 이전 조치 이력을 즉각 확인합니다.'),
                    ('⚖️', '공용 복도 대 세대 실내 차분 분석', '복도의 소음과 세대 내 측정치의 차이를 비교 분석하여 인접 도로 등 외부 소음 간섭을 정확히 배제합니다.'),
                    ('📸', '현장 조사관 각인 채증 카메라', '방문 일시, 측정 dBA 수치, 조사관 확인 메모를 사진에 워터마크로 영구 합성합니다.'),
                    ('📊', '다일간 누적 민원 관리 대장', '수개월에 걸친 반복 민원 발생 추이와 계측 데이터를 축적하여 입주자대표회의 상정 근거를 구축합니다.'),
                    ('📑', '공동주택 층간소음 표준 중재 공문', '친절한 1차 안내문부터 입대의 명의 공식 시정권고서, 분쟁조정위원회 접수 서식을 즉시 출력합니다.'),
                    ('🔒', '개인정보보호 및 100% 로컬 보안', '입주민 민원 기록은 외부 클라우드로 유출되지 않고 관리 주체 PC의 브라우저 로컬에만 안전하게 보관됩니다.')
                ],
                'th': [
                    ('🏢', 'จัดหมวดหมู่ตามเลขที่ห้องและอาคาร', 'จัดระเบียบข้อมูลตามอาคาร ชั้น และห้องชุด เพื่อติดตามประวัติการร้องเรียนได้อย่างเป็นระบบ.'),
                    ('⚖️', 'เปรียบเทียบเสียงโถงทางเดินและในห้อง', 'แยกแยะแหล่งกำเนิดเสียงจริงโดยเปรียบเทียบความแตกต่างระหว่างทางเดินส่วนกลางกับในห้อง.'),
                    ('📸', 'กล้องบันทึกหลักฐานการตรวจพื้นที่', 'ฝังค่าเสียง วันที่ เวลา และบันทึกของเจ้าหน้าที่ลงในภาพถ่ายการตรวจสอบ.'),
                    ('📊', 'บันทึกประวัติการร้องเรียนสะสม', 'รวบรวมเหตุการณ์ที่เกิดขึ้นต่อเนื่องเพื่อเป็นหลักฐานในการดำเนินการตามระเบียบคอนโด.'),
                    ('📑', 'แบบฟอร์มหนังสือตักเตือนมาตรฐาน', 'เข้าถึงแบบร่างหนังสือแจ้งเตือนที่เป็นทางการและหนังสือเชิญเข้าร่วมการไกล่เกลี่ย.'),
                    ('🔒', 'จัดเก็บในเครื่อง ปลอดภัยตามกฎหมาย', 'ข้อมูลของผู้พักอาศัยได้รับการปกป้องอย่างเคร่งครัด ไม่มีการส่งออกไปยังเซิร์ฟเวอร์ภายนอก.')
                ],
                'vi': [
                    ('🏢', 'Phân loại theo cấu trúc tòa nhà & căn hộ', 'Quản lý lịch sử đo đạc theo từng tòa, từng tầng và số phòng để theo dõi các trường hợp tái diễn.'),
                    ('⚖️', 'So sánh âm thanh hành lang & trong nhà', 'Đo đạc đối chứng giữa hành lang chung và không gian riêng để loại trừ các nguồn gây ồn ngoại cảnh.'),
                    ('📸', 'Máy ảnh ghi nhận biên bản kiểm tra', 'Đóng dấu chỉ số decibel, thời gian và ghi chú của nhân viên kiểm tra vào ảnh chụp hiện trường.'),
                    ('📊', 'Nhật ký theo dõi sự cố tích lũy', 'Tổng hợp diễn biến phản ánh qua nhiều tháng làm cơ sở áp dụng các biện pháp chế tài nội quy.'),
                    ('📑', 'Mẫu văn bản nhắc nhở & hòa giải chuẩn', 'Cung cấp sẵn các mẫu thư thông báo, biên bản làm việc và công văn gửi ban quản trị tòa nhà.'),
                    ('🔒', 'Bảo mật thông tin cư dân trên máy', 'Mọi thông tin nhạy cảm của cư dân được bảo vệ hoàn toàn trong trình duyệt của người quản lý.')
                ]
            }
        },
        'rules': {
            'title': {
                'es': 'Reglas para una gestión neutral y eficaz de quejas en fincas',
                'de': 'Grundsätze für sachliche Konfliktlösung in der Verwaltung',
                'fr': 'Règles déontologiques pour une médiation réussie en copropriété',
                'ja': '管理会社・理事会が中立・公平に騒音問題を収束させる4つの鉄則',
                'ko': '관리 주체의 중립적이고 효과적인 층간소음 중재를 위한 4대 수칙',
                'th': 'หลักการจัดการข้อร้องเรียนอย่างเป็นกลางและมีประสิทธิภาพ',
                'vi': 'Các quy tắc hòa giải tranh chấp tiếng ồn công bằng và chuẩn mực'
            },
            'lead': {
                'es': 'Actuar con rigor técnico evita que la administración de la finca sea acusada de parcialidad.',
                'de': 'Professionelle Vorgehensweise schützt Verwalter vor Vorwürfen der Parteinahme.',
                'fr': 'Une démarche factuelle protège le gestionnaire contre toute accusation de partialité.',
                'ja': '「肩入れしている」という不満を防ぎ、客観的な事実に基づいて双方を納得させる手順です。',
                'ko': '편파적이라는 오해를 사지 않고, 객관적 계측 수치를 통해 양측의 양보와 합의를 이끌어내는 방법입니다.',
                'th': 'การดำเนินการบนพื้นฐานของข้อเท็จจริงช่วยป้องกันข้อกล่าวหาว่าเข้าข้างฝ่ายใดฝ่ายหนึ่ง.',
                'vi': 'Hành động dựa trên dữ liệu kỹ thuật giúp ban quản lý giữ vững tính khách quan tuyệt đối.'
            },
            'items': {
                'es': [
                    ('⚖️', 'Regla 1: Mantenga siempre un registro neutral y desprovisto de juicios subjetivos', 'Anote exclusivamente cifras, horas y hechos comprobables in situ. Evite adjetivos emocionales en las notas de mediación.'),
                    ('🏢', 'Regla 2: Compare el descansillo común con la vivienda afectada', 'Verificar si el ruido es perceptible desde las zonas comunes resulta determinante para aplicar los estatutos de la comunidad.'),
                    ('📄', 'Regla 3: Facilite a ambas partes un extracto idéntico del informe', 'Entregar el mismo documento PDF con mediciones objetivas promueve el acuerdo amistoso al desarmar posturas intransigentes.'),
                    ('📑', 'Regla 4: Documente formalmente cada fase de la mediación', 'Conserve el historial de avisos para defender la diligencia debida de la administración si el asunto llega al juzgado.')
                ],
                'de': [
                    ('⚖️', 'Regel 1: Sachlich und wertungsfrei dokumentieren', 'Protokollieren Sie ausschließlich Dezibelwerte, Zeitpunkte und vor Ort nachweisbare Tatsachen ohne emotionale Wertung.'),
                    ('🏢', 'Regel 2: Flur- und Wohnungsmessung gegenüberstellen', 'Die Hörbarkeit im Treppenhaus ist für Hausfriedensverstöße nach der Hausordnung oft rechtlich ausschlaggebend.'),
                    ('📄', 'Regel 3: Beiden Parteien denselben Prüfbericht vorlegen', 'Ein identisches, faktenbasiertes PDF-Protokoll entwaffnet gegenseitige Vorwürfe und fördert die Einigung.'),
                    ('📑', 'Regel 4: Jeden Schlichtungsschritt aktenkundig machen', 'Dokumentieren Sie Fristen und Mahnungen lückenlos, um die Sorgfaltspflicht der Verwaltung abzusichern.')
                ],
                'fr': [
                    ('⚖️', 'Règle 1 : Rédiger des constats strictement factuels', 'Consignez uniquement les données chiffrées, dates et constatations physiques sans jugements de valeur.'),
                    ('🏢', 'Règle 2 : Constater la gêne depuis les parties communes', 'L’audibilité anormale depuis le couloir ou le palier justifie l’application immédiate du règlement de l’immeuble.'),
                    ('📄', 'Règle 3 : Partager la même synthèse technique aux deux voisins', 'Transmettre le même rapport PDF objectif désamorce les tensions en ramenant le litige sur le terrain des faits.'),
                    ('📑', 'Règle 4 : Consigner l’ensemble des étapes de conciliation', 'Gardez trace des démarches amiables pour démontrer la diligence du syndic en cas d’action judiciaire ultérieure.')
                ],
                'ja': [
                    ('⚖️', '鉄則1：感情的な表現を排し、数値・時刻・客観的事実のみを記録する', '調査報告書には「うるさい」「態度が悪い」といった主観を書かず、測定dBA、発生時間、状況事実のみを端的に記載します。'),
                    ('🏢', '鉄則2：共用廊下での可聴性を確認し、共同の利益侵害を立証する', '専有部内だけでなく、共用部である廊下まで漏れ出しているかを確認することで、管理規約上の「共同の利益に反する行為」として位置づけます。'),
                    ('📄', '鉄則3：当事者双方へ同一の客観的データサマリーを提示する', '客観的な数値が記載された同じPDFレポートを提示することで、「言った・言わない」の感情論を脱し、冷静な話し合いのテーブルに着かせます。'),
                    ('📑', '鉄則4：すべての注意・指導履歴を理事会記録として保管する', '万一裁判外紛争解決（ADR）や民事調停に移行した際、管理組合としての「善管注意義務の履行」を証明できるよう履歴を保全します。')
                ],
                'ko': [
                    ('⚖️', '수칙 1: 주관적 평가를 배제하고 실측 수치와 팩트만을 기록하세요', '보고서에는 감정적 서술 대신 계측된 데시벨, 지속 시간, 당시의 객관적 상황만을 사실 그대로 작성합니다.'),
                    ('🏢', '수칙 2: 공용 복도에서의 가청 여부를 반드시 확인하세요', "세대 내 소음이 공용 복도까지 명확히 전달되는지 확인하면 관리규약상 '공동의 이익을 해치는 행위'로 명확히 특정할 수 있습니다."),
                    ('📄', '수칙 3: 양 당사자에게 동일한 공식 계측 요약본을 제공하세요', '동일한 수치 데이터를 바탕으로 중재를 진행하면 억지 주장이나 부인을 원천 차단하고 합리적인 중재안을 도출할 수 있습니다.'),
                    ('📑', '수칙 4: 모든 방문 상담 및 통보 이력을 공적 문서로 보존하세요', '향후 정식 분쟁조정위나 법적 소송으로 확대될 경우를 대비하여 관리사무소의 선량한 관리자 의무(선관주의의무) 이행 증빙을 남깁니다.')
                ],
                'th': [
                    ('⚖️', 'กฎข้อที่ 1: บันทึกเฉพาะข้อเท็จจริงและตัวเลขที่วัดได้ ปราศจากอารมณ์', 'จดบันทึกเฉพาะค่าเดซิเบล เวลา และสภาพความเป็นจริงที่พบ หลีกเลี่ยงความคิดเห็นส่วนตัว.'),
                    ('🏢', 'กฎข้อที่ 2: ตรวจสอบว่าเสียงดังออกมาถึงโถงทางเดินส่วนกลางหรือไม่', 'หากเสียงเล็ดลอดออกมาถึงพื้นที่ส่วนกลาง จะถือว่าเป็นการละเมิดระเบียบอาคารชุดอย่างชัดเจน.'),
                    ('📄', 'กฎข้อที่ 3: มอบเอกสารสรุปผลการตรวจวัดฉบับเดียวกันให้ทั้งสองฝ่าย', 'การให้ข้อมูลข้อเท็จจริงทางวิทยาศาสตร์ชุดเดียวกันช่วยลดการโต้เถียงและนำไปสู่การประนีประนอม.'),
                    ('📑', 'กฎข้อที่ 4: เก็บหลักฐานการตักเตือนทุกขั้นตอนไว้ในแฟ้มประวัติ', 'เก็บรายงานไว้เพื่อพิสูจน์ว่านิติบุคคลได้ปฏิบัติหน้าที่ในการจัดการปัญหาอย่างถูกต้องตามกฎหมายแล้ว.')
                ],
                'vi': [
                    ('⚖️', 'Quy tắc 1: Lập biên bản hoàn toàn trung lập dựa trên số liệu thực tế', 'Chỉ ghi lại mức decibel đo được, thời gian và hiện trạng cụ thể, tuyệt đối không đưa nhận định cảm tính.'),
                    ('🏢', 'Quy tắc 2: Kiểm tra độ truyền âm ra hành lang khu vực chung', 'Tiếng ồn lọt ra hành lang chung là căn cứ rõ ràng nhất để áp dụng các điều khoản xử lý nội quy tòa nhà.'),
                    ('📄', 'Quy tắc 3: Cung cấp bản trích xuất kỹ thuật giống nhau cho hai bên', 'Chia sẻ cùng một báo cáo số liệu khách quan giúp các bên nhìn nhận sự việc một cách có thiện chí và bình tĩnh.'),
                    ('📑', 'Quy tắc 4: Lưu trữ đầy đủ toàn bộ tiến trình hòa giải', 'Bảo quản toàn bộ biên bản nhắc nhở để chứng minh ban quản lý đã thực hiện đầy đủ trách nhiệm nếu có kiện tụng.')
                ]
            }
        },
        'faqs': {
            'es': [
                ("¿Cómo deben actuar los administradores ante quejas de ruido?",
                 "Deben verificar de forma neutral e in situ la realidad de la molestia, documentar las mediciones y levantar acta. SOUNDTEST.PRO facilita un informe estandarizado en PDF que sirve como base para enviar apercibimientos formales y preservar la convivencia."),
                ("¿Se requiere un sonómetro homologado para imponer una sanción comunitaria?",
                 "Para sanciones de régimen interno en la comunidad de propietarios, los estatutos suelen requerir una acreditación fehaciente de la molestia continuada. SOUNDTEST.PRO proporciona informes con firma digital SHA-256 perfectamente válidos para acuerdos de junta y mediación."),
                ("¿Cómo puede demostrar la administración que actuó con diligencia debida?",
                 "Custodiando un expediente con las fechas de visita, mediciones registradas, fotos selladas y comunicaciones enviadas a las partes afectadas."),
                ("¿Cuál es la diferencia entre ruido aéreo y ruido de impacto estructural?",
                 "El ruido aéreo (música, voces) se atenúa fácilmente con puertas y ventanas. El ruido de impacto (taconeo, arrastre de muebles) viaja por la estructura del forjado y requiere mediciones de picos rápidos y bajas frecuencias.")
            ],
            'de': [
                ("Wie sollten Hausverwaltungen mit Lärmbeschwerden umgehen?",
                 "Verwaltungen müssen neutral bleiben und den Sachverhalt vor Ort sachlich ermitteln. SOUNDTEST.PRO bietet standardisierte Lärmberichte als verlässliche Entscheidungsgrundlage für Abmahnungen und Beiratsbeschlüsse."),
                ("Braucht man für Abmahnungen nach Hausordnung zwingend ein behördliches Gutachten?",
                 "Nein. Für miet- und wohnungseigentumsrechtliche Maßnahmen (wie Abmahnungen oder Gemeinschaftsbeschlüsse) genügt eine schlüssige Dokumentation der Störung durch Zeugen und nachvollziehbare Messprotokolle."),
                ("Wie weist die Verwaltung ihre Sorgfaltspflicht nach?",
                 "Durch das Führen einer lückenlosen Vorfallshistorie mit Datum, Uhrzeit, Pegeldaten und dokumentierten Schlichtungsgesprächen."),
                ("Was unterscheidet Luftschall von Trittschall?",
                 "Luftschall (Gespräche, TV) breitet sich über die Luft aus. Trittschall (Schritte, Möbelrücken) überträgt sich direkt über den Baukörper und erfordert Spitzenwertmessungen (Lmax/L10).")
            ],
            'fr': [
                ("Comment le syndic doit-il gérer les réclamations pour nuisances sonores ?",
                 "Le gestionnaire doit vérifier impartialement la matérialité des faits, consigner les niveaux acoustiques et rappeler le règlement. SOUNDTEST.PRO fournit un rapport PDF probatoire pour structurer la conciliation."),
                ("Faut-il une mesure homologuée pour appliquer une clause du règlement ?",
                 "Non. Pour les démarches amiables et les avertissements du syndic, une constatation rigoureuse avec photos horodatées et niveaux en décibels est largement suffisante."),
                ("Comment le gestionnaire prouve-t-il sa diligence en cas de litige ?",
                 "En archivant un dossier chronologique comprenant les comptes-rendus de visite, les relevés de décibels et les courriers de mise en demeure."),
                ("Quelle est la différence entre bruit aérien et bruit d’impact ?",
                 "Le bruit aérien (voix, musique) se diffuse par l’air ; le bruit d’impact (talons, chocs) se propage dans la structure même du bâtiment et nécessite une analyse des pics.")
            ],
            'ja': [
                ("管理会社や理事会は住民間の騒音トラブルにどう対応すべきですか？",
                 "主観的なクレームに左右されず、中立的な立場で現地確認を行い、客観的数値を記録することが不可欠です。SOUNDTEST.PROのPDFレポートを用いれば、公平な立場で改善勧告を行えます。"),
                ("管理規約に基づく注意勧告に公式の計量証明は必須ですか？",
                 "いいえ。マンション内の規約違反指導や理事会での審議においては、日時・数値・状況が整理された客観的な調査記録があれば十分に有効です。"),
                ("管理側が「善管注意義務」を果たしたことを証明するにはどうすれば良いですか？",
                 "受付日時、訪問調査記録、実測デシベルデータ、双方への通知書面を時系列で台帳保管することで、法的な義務履行を完全に証明できます。"),
                ("空気伝播音と固体伝播音（衝撃音）の違いは何ですか？",
                 "話し声やテレビ音は空気を通して伝わりますが、足音や家具の引きずり音はコンクリートスラブや壁面を伝わって共振するため、ピーク値測定と低周波分析が極めて重要です。")
            ],
            'ko': [
                ("관리사무소는 층간소음 민원에 어떻게 대처해야 가장 공정한가요?",
                 "어느 한쪽의 말만 듣지 않고, 현장을 직접 방문하여 객관적인 데시벨 수치를 기록하고 중립적인 입장에서 중재해야 합니다. SOUNDTEST.PRO 리포트는 가장 신뢰할 수 있는 기초 자료가 됩니다."),
                ("관리규약에 따른 시정 권고를 내릴 때 국가 공인 계측기가 필수인가요?",
                 "아닙니다. 단지 내 관리규약에 따른 사실 확인 및 1차 행정 지도 단계에서는 시계열 통계와 워터마크 사진이 포함된 정밀 리포트로도 충분한 소명력을 갖습니다."),
                ("관리사무소가 선량한 관리자로서 성실히 대처했음을 입증하려면?",
                 "민원 접수 일시, 현장 방문 측정치, 당사자 면담 기록, 공식 경고문 발송 내역을 시계열로 편철하여 보관함으로써 법적 책임을 완벽히 방어할 수 있습니다."),
                ("공기전파 소음과 바닥충격음(직접충격)의 차이는 무엇인가요?",
                 "TV나 대화 소리는 공기를 통해 전파되지만, 뒤꿈치 발망치나 가구 끄는 소리는 건축물 골조를 흔드는 충격음이므로 순간 피크치(Lmax) 측정이 핵심입니다.")
            ],
            'th': [
                ("นิติบุคคลควรจัดการกับข้อร้องเรียนเรื่องเสียงอย่างไร?",
                 "ควรเข้าตรวจสอบสถานที่จริงอย่างเป็นกลาง บันทึกระดับเสียง และจัดทำรายงาน SOUNDTEST.PRO มอบเอกสารสรุปที่เป็นมาตรฐานเพื่อใช้ออกหนังสือเตือนและยุติข้อพิพาทอย่างสันติ."),
                ("จำเป็นต้องใช้เครื่องวัดเสียงที่มีใบรับรองในการตักเตือนตามระเบียบหรือไม่?",
                 "สำหรับการบังคับใช้ระเบียบภายในอาคารชุด เอกสารบันทึกเหตุการณ์ที่มีรูปถ่ายและระดับเดซิเบลที่ชัดเจนถือว่าเพียงพอในการดำเนินการตามอำนาจหน้าที่ของนิติบุคคล."),
                ("นิติบุคคลจะพิสูจน์ได้อย่างไรว่าได้ปฏิบัติหน้าที่อย่างเต็มความสามารถแล้ว?",
                 "โดยการจัดเก็บแฟ้มประวัติการตรวจสอบ บันทึกระดับเสียง ภาพถ่าย และสำเนาหนังสือแจ้งเตือนที่ส่งถึงคู่กรณีไว้อย่างเป็นระบบ."),
                ("เสียงในอากาศและเสียงกระแทกผ่านโครงสร้างต่างกันอย่างไร?",
                 "เสียงพูดคุยหรือเสียงทีวีเดินทางผ่านอากาศ แต่เสียงเดินลงส้นหรือลากเก้าอี้เดินทางผ่านโครงสร้างคอนกรีต ซึ่งจำเป็นต้องอาศัยการวัดค่าพีคและย่านความถี่ต่ำ.")
            ],
            'vi': [
                ("Ban quản lý nên xử lý các tranh chấp tiếng ồn giữa các căn hộ như thế nào?",
                 "Cần giữ thái độ trung lập, tiến hành đo đạc thực tế tại hiện trường và lập biên bản rõ ràng. SOUNDTEST.PRO giúp chuẩn hóa biên bản kỹ thuật để làm việc với các bên."),
                ("Có bắt buộc phải có máy đo kiểm định để xử lý vi phạm nội quy chung cư không?",
                 "Để thực thi nội quy tòa nhà, chỉ cần biên bản ghi nhận khách quan có kèm hình ảnh và thông số decibel hợp lý là đủ cơ sở để ban quản trị ra quyết định xử lý."),
                ("Làm thế nào để chứng minh ban quản lý đã làm tròn trách nhiệm?",
                 "Lưu trữ toàn bộ hồ sơ các lần đi kiểm tra, số liệu đo được và các văn bản nhắc nhở đã phát hành để chứng minh sự mẫn cán khi có cơ quan cấp trên kiểm tra."),
                ("Tiếng ồn truyền qua không khí khác tiếng ồn va đập kết cấu như thế nào?",
                 "Tiếng nói hay tivi truyền qua không khí, trong khi tiếng nện sàn hay kéo bàn ghế truyền thẳng qua sàn bê tông, đòi hỏi phải đo được các xung đỉnh cực đại.")
            ]
        },
        'cta_band': {
            'es': ('¿Desea resolver los conflictos de ruido en su comunidad con datos objetivos?',
                   'Genere partes periciales estructurados en 10 segundos directamente en su navegador. Sin compras de hardware, sin descargas, 100% privado.'),
            'de': ('Wollen Sie Lärmstreitigkeiten im Haus sachlich und fair beilegen?',
                   'Erstellen Sie strukturierte Nachweise in 10 Sekunden direkt im Browser. Keine Spezialgeräte, kein Download, 100% datenschutzkonform.'),
            'fr': ('Prêt à professionnaliser la gestion des bruits en copropriété ?',
                   'Éditez des constats standardisés en 10 secondes directement dans votre navigateur. Sans matériel onéreux, sans téléchargement d’application, 100% confidentiel.'),
            'ja': ('マンションの騒音苦情対応を、客観的なデータで円満解決へ導きませんか？',
                   '専用機器の購入もアプリのインストールも不要。ブラウザを開いて10秒で調査記録を作成。100%ローカル保存で安全。'),
            'ko': ('아파트 층간소음 민원, 이제 감정 싸움 대신 객관적 데이터로 해결하세요',
                   '고가의 장비나 복잡한 프로그램 없이 브라우저에서 10초 만에 공인 양식의 중재 보고서를 생성할 수 있습니다. 100% 로컬 보안 보장.'),
            'th': ('พร้อมที่จะจัดการปัญหาเสียงรบกวนในคอนโดด้วยข้อมูลที่โปร่งใสแล้วหรือยัง?',
                   'สร้างรายงานตรวจสอบมาตรฐานได้ฟรีใน 10 วินาทีผ่านเบราว์เซอร์ ไม่ต้องซื้ออุปกรณ์เสริม รักษาความเป็นส่วนตัว 100%.'),
            'vi': ('Sẵn sàng nâng tầm công tác hòa giải tiếng ồn tại tòa nhà của bạn?',
                   'Tạo biên bản đo đạc chuẩn hóa chỉ trong 10 giây ngay trên trình duyệt. Không cần đầu tư thiết bị đắt tiền, bảo mật tuyệt đối.')
        }
    }
}
