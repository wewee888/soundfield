# scripts/use_case_data_part5.py
# Scenario 6: workplace-noise-inspection for es, de, fr, ja, ko, th, vi

SCENARIOS_PART_5 = {
    'workplace-noise-inspection': {
        'img': 'workplace_noise_inspection.webp',
        'img_alt': {
            'es': 'Técnico de prevención de riesgos con chaleco de alta visibilidad midiendo el ruido en nave industrial con móvil a 88.5 dBA',
            'de': 'Sicherheitsbeauftragter mit Warnweste bei Lärmprüfung in Fabrikhalle mit Smartphone bei 88,5 dBA',
            'fr': 'Responsable HSE en gilet haute visibilité effectuant un contrôle du bruit en atelier industriel avec smartphone à 88,5 dBA',
            'ja': '安全ベストと保護メガネを着用し、轟音の工場ラインで88.5dBAのアラート表示スマホを掲げる検査員',
            'ko': '안전조끼를 착용한 산업안전 관리자가 시끄러운 공장 생산라인에서 88.5 dBA 경고 화면의 스마트폰으로 소음을 점검하는 모습',
            'th': 'เจ้าหน้าที่ความปลอดภัยสวมเสื้อสะท้อนแสงกำลังตรวจวัดระดับเสียงในโรงงานด้วยสมาร์ทโฟนที่ 88.5 dBA',
            'vi': 'Cán bộ an toàn lao động mặc áo phản quang đo kiểm tiếng ồn trong nhà xưởng bằng điện thoại hiển thị 88.5 dBA'
        },
        'stats': {
            'es': [('85 dBA', 'Nivel de acción PRL'), ('A / C / Z', 'Curvas de ponderación'), ('Fast / Slow', 'Respuesta dinámica'), ('Exportación CSV', 'Análisis de datos')],
            'de': [('85 dBA', 'Auslösewert LärmV'), ('A / C / Z', 'Frequenzbewertung'), ('Fast / Slow', 'Zeitbewertung'), ('CSV-Export', 'Rohdatenanalyse')],
            'fr': [('85 dBA', 'Seuil d’action VLEP'), ('A / C / Z', 'Pondérations'), ('Fast / Slow', 'Constantes de temps'), ('Export CSV', 'Données brutes')],
            'ja': [('85 dBA', '労働安全衛生法基準'), ('A / C / Z', '三重周波数補正'), ('Fast / Slow', '動特性切替'), ('CSV生データ', 'Excel台帳連携')],
            'ko': [('85 dBA', '산업안전 노출기준'), ('A / C / Z', '3중 청감 보정'), ('Fast / Slow', '동특성 반응모드'), ('CSV 원본', '안전보건 전산연계')],
            'th': [('85 dBA', 'เกณฑ์มาตรฐานความปลอดภัย'), ('A / C / Z', 'เส้นโค้งถ่วงน้ำหนัก'), ('Fast / Slow', 'การตอบสนองเชิงพลวัต'), ('ส่งออก CSV', 'วิเคราะห์ข้อมูลดิบ')],
            'vi': [('85 dBA', 'Ngưỡng hành động an toàn'), ('A / C / Z', 'Trọng số tần số'), ('Fast / Slow', 'Đáp ứng thời gian'), ('Xuất file CSV', 'Phân tích số liệu thô')]
        },
        'hero': {
            'es': {
                'eyebrow': 'Caso de uso · Ruido laboral y salud en el trabajo',
                'headline': 'Inspecciones de ruido laboral rápidas y repetibles <em>sin equipos pesados</em>.',
                'lead': 'Evalúe oficinas abiertas, salas de servidores, talleres, almacenes y líneas de producción para garantizar el confort acústico y el cumplimiento preventivo. Con ponderaciones A/C/Z, respuesta Fast/Slow, percentiles LAeq, fotos con marca de agua y exportación en CSV/PDF.'
            },
            'de': {
                'eyebrow': 'Anwendungsfall · Arbeitsplatz- &amp; Arbeitsschutzlärm',
                'headline': 'Effiziente Lärmprüfungen im Betrieb <em>ohne sperrige Messtechnik</em>.',
                'lead': 'Überprüfen Sie Großraumbüros, Serverräume, Werkstätten und Fertigungslinien auf akustischen Komfort und Einhaltung der LärmV-Schwellenwerte. Ausgestattet mit A/C/Z-Bewertung, Fast/Slow-Dynamik, LAeq-Statistiken, Fotostempeln und CSV/PDF-Export.'
            },
            'fr': {
                'eyebrow': 'Cas d’usage · Bruit au travail &amp; santé professionnelle',
                'headline': 'Contrôles acoustiques en entreprise rapides et fiables <em>sans matériel encombrant</em>.',
                'lead': 'Auditez open spaces, salles de serveurs, ateliers et lignes de production pour le confort acoustique et le respect de la réglementation sur le bruit au travail. Pondération A/C/Z, réponse Fast/Slow, percentiles LAeq, photos horodatées et exports CSV/PDF.'
            },
            'ja': {
                'eyebrow': '利用シーン · 職場環境・工場・労働安全衛生点検',
                'headline': '大型機器の持ち歩き不要、現場で即座に<em>職場の騒音暴露パトロール</em>。',
                'lead': 'オフィスの騒音環境改善から、サーバー室、加工工場、倉庫、製造ラインの労働安全衛生（OSHA・ISO 3382-3）適合巡回まで。A/C/Z計数補正、Fast/Slow動特性、統計パーセンタイル、現場水印写真、CSV/PDF一括出力に対応。'
            },
            'ko': {
                'eyebrow': '활용 사례 · 사업장 소음 및 산업안전보건 점검',
                'headline': '무거운 장비 없이 스마트폰 하나로 <em>사업장 및 공장 소음 노출 순회 점검</em>.',
                'lead': '오픈 오피스, 전산실, 금형 공장, 물류 창고, 제조 생산라인의 소음 노출 기준(OSHA/산업안전보건기준) 준수 여부를 즉각 스크리닝하세요. A/C/Z 3중 청감 보정, Fast/Slow 동특성, 통계 백분위수, 현장 워터마크 사진, CSV/PDF 전산 출력을 지원합니다.'
            },
            'th': {
                'eyebrow': 'กรณีการใช้งาน · ความปลอดภัยและอาชีวอนามัยในที่ทำงาน',
                'headline': 'ตรวจวัดระดับเสียงในสถานประกอบการได้อย่างรวดเร็วและแม่นยำ<em>โดยไม่ต้องพกอุปกรณ์ขนาดใหญ่</em>.',
                'lead': 'ตรวจสอบออฟฟิศแบบเปิด ห้องเซิร์ฟเวอร์ โรงกลึง และสายการผลิต เพื่อความสบายในการได้ยินและปฏิบัติตามกฎหมายความปลอดภัยในการทำงาน มาพร้อมการถ่วงน้ำหนัก A/C/Z การตอบสนอง Fast/Slow ภาพถ่ายประทับค่าเสียง และการส่งออกข้อมูล CSV/PDF.'
            },
            'vi': {
                'eyebrow': 'Trường hợp sử dụng · Tiếng ồn nơi làm việc &amp; an toàn lao động',
                'headline': 'Kiểm tra tiếng ồn môi trường làm việc nhanh chóng, chính xác <em>không cần thiết bị cồng kềnh</em>.',
                'lead': 'Khảo sát văn phòng mở, phòng máy chủ, xưởng cơ khí và dây chuyền sản xuất để đánh giá độ êm ái và tuân thủ quy chuẩn an toàn lao động. Tích hợp trọng số A/C/Z, thời gian đáp ứng Fast/Slow, phân tích LAeq, chụp ảnh đóng dấu số liệu và xuất báo cáo CSV/PDF.'
            }
        },
        'table': {
            'title': {
                'es': 'Umbrales de exposición a ruido laboral y salud ocupacional',
                'de': 'Lärmgrenzwerte am Arbeitsplatz & Arbeitsschutz-Stufen',
                'fr': 'Seuils d’exposition au bruit en milieu professionnel',
                'ja': '職場および工場における作業環境騒音基準・許容暴露時間',
                'ko': '작업장 물리적 인자 노출기준 및 소음 건강장해 예방 기준',
                'th': 'เกณฑ์ระดับเสียงและความปลอดภัยในการทำงานตามมาตรฐานสากล',
                'vi': 'Quy chuẩn giới hạn tiếp xúc tiếng ồn tại nơi làm việc'
            },
            'lead': {
                'es': 'Compare los niveles de su centro de trabajo con las directivas europeas de ruido laboral y los estándares internacionales ISO 3382-3.',
                'de': 'Vergleichen Sie Betriebsmessungen mit der Lärm- und Vibrations-Arbeitsschutzverordnung und ISO 3382-3.',
                'fr': 'Comparez vos relevés aux seuils de la directive européenne 2003/10/CE et à la norme ISO 3382-3.',
                'ja': '自社の職場環境を労働安全衛生規則、作業環境測定基準、ISO 3382-3推奨値と照合します。',
                'ko': '사업장 측정치를 고용노동부 고시 작업환경측정 및 산업안전보건기준에 관한 규칙과 비교하세요.',
                'th': 'เปรียบเทียบระดับเสียงในสถานที่ทำงานกับมาตรฐาน OSHA, ISO 3382-3 และกฎหมายคุ้มครองแรงงาน.',
                'vi': 'So sánh mức đo tại nhà xưởng với QCVN 24:2016/BYT và tiêu chuẩn quốc tế ISO 3382-3.'
            },
            'headers': {
                'es': ['Nivel medido', 'Entorno laboral', 'Criterio ergonómico / normativo', 'Medida preventiva requerida'],
                'de': ['Messwert', 'Arbeitsbereich', 'Arbeitsmedizinischer Standard', 'Schutzmaßnahme'],
                'fr': ['Niveau mesuré', 'Environnement professionnel', 'Norme ergonomique & santé', 'Mesure préventive requise'],
                'ja': ['実測音圧レベル', '対象の作業・業務環境', '労働衛生および生産性基準', '推奨・義務づけられる安全対策'],
                'ko': ['실측 데시벨', '대상 작업 환경', '산업안전 및 생산성 기준', '필요한 보건 조치'],
                'th': ['ระดับเสียงที่วัดได้', 'พื้นที่การทำงาน', 'มาตรฐานอาชีวอนามัยและสมาธิ', 'มาตรการป้องกันที่ต้องปฏิบัติ'],
                'vi': ['Mức đo thực tế', 'Môi trường làm việc', 'Quy chuẩn an toàn & năng suất', 'Biện pháp bảo hộ lao động']
            },
            'rows': {
                'es': [
                    ('40 – 48 dBA', 'Despacho directivo, sala de reuniones, zona de concentración', 'Nivel recomendado para trabajo intelectual exigente (ISO 3382-3)', 'badge-safe', 'Concentración óptima'),
                    ('52 – 62 dBA', 'Oficina abierta, centro de llamadas, zona de ventas comerciales', 'Nivel comercial típico; por encima de 65 dBA genera fatiga y dificultad de inteligibilidad', 'badge-mild', 'Oficina admisible'),
                    ('70 – 78 dBA', 'Sala de servidores, cocina comercial, taller ligero o embalaje', 'Requiere seguimiento periódico; dificulta la comunicación verbal sin alzar la voz', 'badge-moderate', 'Monitoreo preventivo'),
                    ('80 – 85 dBA', 'Taller mecánico, estampación ligera, líneas de envasado', 'Nivel de acción legal (85 dBA TWA 8h); recomendada protección auditiva e información', 'badge-severe', 'Protección recomendada'),
                    ('90+ dBA', 'Prensas pesadas, sierras circulares, fresado CNC sin cabina', 'Supera el límite legal permitido; obligatorio uso de protectores y medidas técnicas inmediatas', 'badge-severe', 'Protección obligatoria')
                ],
                'de': [
                    ('40 – 48 dBA', 'Einzelbüro, Besprechungsraum, Fokus-Arbeitsplatz', 'Empfohlener Richtwert für anspruchsvolle geistige Arbeit nach ISO 3382-3', 'badge-safe', 'Optimale Konzentration'),
                    ('52 – 62 dBA', 'Großraumbüro, Callcenter, Einzelhandelsfläche', 'Typischer Büropegel; ab 65 dBA steigen Fehlerhäufigkeit und kognitive Ermüdung', 'badge-mild', 'Bürostandard'),
                    ('70 – 78 dBA', 'Serverraum, Gastronomieküche, Logistik-Kommissionierung', 'Regelmäßige Überwachung erforderlich; Sprachverständigung wird spürbar erschwert', 'badge-moderate', 'Prüfbereich'),
                    ('80 – 85 dBA', 'Mechanische Fertigung, Montageband, Kfz-Werkstatt', 'Unterer/Oberer Auslösewert (LärmV); Bereitstellung von Gehörschutz und Unterweisung', 'badge-severe', 'Gehörschutz empfohlen'),
                    ('90+ dBA', 'Stanzwerkzeuge, Kreissägen, ungedämmte Fräsmaschinen', 'Überschreitung der Expositionsgrenzwerte; strikte Gehörschutzpflicht & Lärmsanierung', 'badge-severe', 'Gehörschutz Pflicht')
                ],
                'fr': [
                    ('40 – 48 dBA', 'Bureau individuel, salle de réunion, cabine de travail calme', 'Environnement acoustique recommandé pour la concentration mentale (ISO 3382-3)', 'badge-safe', 'Concentration optimale'),
                    ('52 – 62 dBA', 'Plateau open space, centre d’appels, surface de vente', 'Niveau tertiaire classique ; au-delà de 65 dBA la fatigue cognitive s’accroît', 'badge-mild', 'Niveau tertiaire'),
                    ('70 – 78 dBA', 'Salle informatique serveurs, cuisine de restaurant, atelier léger', 'Surveillance préventive conseillée ; fatigue vocale des collaborateurs', 'badge-moderate', 'Vigilance technique'),
                    ('80 – 85 dBA', 'Usinage mécanique, ligne d’emballage, atelier automobile', 'Seuil d’action réglementaire (85 dBA sur 8h) ; mise à disposition de protections auditives', 'badge-severe', 'Protecteurs recommandés'),
                    ('90+ dBA', 'Presses de découpe, scies industrielles, compresseurs non capotés', 'Dépassement de la valeur limite d’exposition ; port des EPI antibruit obligatoire', 'badge-severe', 'EPI obligatoire')
                ],
                'ja': [
                    ('40 – 48 dBA', '役員個室、重要会議室、高集中開発ブース', '知的集中作業に最適な推奨音響環境（ISO 3382-3基準）', 'badge-safe', '最適集中環境'),
                    ('52 – 62 dBA', 'オープンオフィス、コールセンター、店舗フロア', '一般的なオフィス音環境；65dBAを超えると会話妨害と疲労感が増大', 'badge-mild', '一般オフィス基準'),
                    ('70 – 78 dBA', 'サーバー室、厨房、軽作業・ピッキング梱包エリア', '定期モニタリング推奨；大声を出さないと会話が困難な作業レベル', 'badge-moderate', '定期測定推奨'),
                    ('80 – 85 dBA', '金属加工工場、成形ライン、自動車整備ピット', '労働安全衛生法・作業環境測定基準第2管理区分；耳栓着用の推奨と健康教育', 'badge-severe', '防音保護具推奨'),
                    ('90+ dBA', '大型プレス機、丸鋸切断機、未防音CNCフライス', '許容基準完全超過；防音保護具の着用義務化および発生源の施設改善命令', 'badge-severe', '防音保護具着用義務')
                ],
                'ko': [
                    ('40 – 48 dBA', '임원실, 화상회의실, 연구개발 포커스 룸', '고도의 집중력이 요구되는 두뇌 노동에 권장되는 음향 환경(ISO 3382-3)', 'badge-safe', '최적 집중 환경'),
                    ('52 – 62 dBA', '대형 오픈 오피스, 고객 콜센터, 매장 영업 공간', '일반 상업 사무실 수준; 65 dBA 초과 시 인지 피로 누적 및 의사소통 방해', 'badge-mild', '통상 사무실 환경'),
                    ('70 – 78 dBA', '전산 서버실, 대형 조리실, 경작업 물류 포장 라인', '정기적 소음 모니터링 필요; 근로자 간 육성 대화 시 목소리를 높여야 함', 'badge-moderate', '정기 감시 대상'),
                    ('80 – 85 dBA', '금속 가공 조립 라인, 사출 성형기, 정비 공장', '산업안전보건기준 노출기준 액션 레벨(85 dBA 8시간 TWA); 청력보호구 지급 및 교육', 'badge-severe', '귀마개 착용 권고'),
                    ('90+ dBA', '고속 프레스, 목공 원형톱, 방음 덮개 없는 밀링기', '허용 노출 한계(PEL) 초과; 청력보호구 의무 착용 및 시설 공학적 개선 조치 필수', 'badge-severe', '청력보호구 의무 착용')
                ],
                'th': [
                    ('40 – 48 dBA', 'ห้องผู้บริหาร ห้องประชุม ห้องทำงานที่ต้องใช้สมาธิสูง', 'ระดับเสียงที่แนะนำสำหรับการทำงานที่ต้องใช้สมองอย่างเข้มข้น (ISO 3382-3)', 'badge-safe', 'ระดับที่เหมาะสมที่สุด'),
                    ('52 – 62 dBA', 'ออฟฟิศแบบเปิด คอลเซ็นเตอร์ พื้นที่ขายหน้าร้าน', 'ระดับเสียงทั่วไปในสำนักงาน หากเกิน 65 dBA จะทำให้เหนื่อยล้าได้ง่าย', 'badge-mild', 'มาตรฐานสำนักงาน'),
                    ('70 – 78 dBA', 'ห้องเซิร์ฟเวอร์ ครัวร้านอาหาร แผนกบรรจุสินค้า', 'ต้องเฝ้าระวังอย่างสม่ำเสมอ เริ่มต้องตะโกนคุยกันในพื้นที่', 'badge-moderate', 'ควรเฝ้าระวัง'),
                    ('80 – 85 dBA', 'โรงกลึง แผนกประกอบชิ้นส่วน อู่ซ่อมรถยนต์', 'ระดับเตือนภัยตามกฎหมายความปลอดภัย แนะนำให้สวมใส่อุปกรณ์ลดเสียง', 'badge-severe', 'แนะนำอุปกรณ์ป้องกัน'),
                    ('90+ dBA', 'เครื่องปั๊มโลหะ เลื่อยวงเดือน เครื่อง CNC ที่ไม่มีฉนวน', 'เกินขีดจำกัดความปลอดภัย บังคับสวมใส่ที่ครอบหูลดเสียงและปรับปรุงเครื่องจักร', 'badge-severe', 'บังคับสวมใส่อุปกรณ์')
                ],
                'vi': [
                    ('40 – 48 dBA', 'Phòng giám đốc, phòng họp, khu vực làm việc tập trung', 'Môi trường âm học tối ưu cho công việc nghiên cứu và trí óc (ISO 3382-3)', 'badge-safe', 'Môi trường lý tưởng'),
                    ('52 – 62 dBA', 'Văn phòng mở, trung tâm chăm sóc khách hàng, cửa hàng', 'Mức độ văn phòng bình thường; trên 65 dBA sẽ gây căng thẳng thần kinh', 'badge-mild', 'Chuẩn văn phòng'),
                    ('70 – 78 dBA', 'Phòng máy chủ server, bếp công nghiệp, xưởng đóng gói', 'Cần kiểm tra định kỳ; việc trao đổi công việc bằng lời nói bắt đầu gặp khó khăn', 'badge-moderate', 'Theo dõi định kỳ'),
                    ('80 – 85 dBA', 'Xưởng cơ khí, dây chuyền lắp ráp, gara sửa chữa ô tô', 'Ngưỡng hành động an toàn lao động (85 dBA trong 8h); khuyến nghị cấp nút tai chống ồn', 'badge-severe', 'Khuyến nghị mang bảo hộ'),
                    ('90+ dBA', 'Máy dập kim loại, máy cưa gỗ, máy phay không có vỏ cách âm', 'Vượt quá giới hạn cho phép; bắt buộc đeo chụp tai bảo hộ và xử lý kỹ thuật giảm âm', 'badge-severe', 'Bắt buộc mang bảo hộ')
                ]
            }
        },
        'steps': {
            'title': {
                'es': 'Procedimiento normalizado para inspecciones de ruido en centros de trabajo',
                'de': 'In 4 Schritten zum reproduzierbaren Lärm-Screening im Betrieb',
                'fr': 'Procédure opérationnelle standard pour le contrôle du bruit au travail',
                'ja': '職場の騒音リスクを可視化する4ステップの巡回手順',
                'ko': '작업장 소음 유해 인자를 선제적으로 발굴하는 4단계 점검 절차',
                'th': 'ขั้นตอนการตรวจวัดระดับเสียงในสถานที่ทำงานอย่างเป็นระบบ',
                'vi': 'Quy trình 4 bước rà soát và kiểm soát tiếng ồn nơi làm việc'
            },
            'lead': {
                'es': 'Siga este procedimiento estructurado para evaluar departamentos, identificar focos críticos y registrar el cumplimiento preventivo.',
                'de': 'Nutzen Sie diesen standardisierten Ablauf, um Arbeitsbereiche zu prüfen, Hotspots zu lokalisieren und den Arbeitsschutz abzusichern.',
                'fr': 'Adoptez cette méthode rigoureuse pour cartographier vos ateliers, cibler les sources critiques et documenter la conformité.',
                'ja': '現場の安全衛生担当者が、部署ごとの測定ポイントを定期巡回し、改善対策の根拠台帳を作成するための標準手順です。',
                'ko': '안전관리자와 시설담당자가 사업장 부서별 측정 포인트를 체계적으로 순회하며 개선 근거를 확립하는 절차입니다.',
                'th': 'ปฏิบัติตามแนวทางนี้เพื่อเปรียบเทียบระดับเสียงในแต่ละแผนก ค้นหาจุดเสี่ยง และบันทึกหลักฐานความปลอดภัย.',
                'vi': 'Áp dụng quy trình chuẩn để phân loại các phòng ban, xác định điểm nóng tiếng ồn và hoàn thiện hồ sơ an toàn.'
            },
            'items': {
                'es': [
                    ('1', '📍', 'Defina puntos de control permanentes', 'Establezca estaciones de medición fijas (Punto A: Prensa CNC, Punto B: Logística, Punto C: Oficina) para asegurar auditorías comparables en el tiempo.'),
                    ('2', '⏱️', 'Realice mediciones representativas de 5 minutos', 'Mida a la altura del oído (1,5 m de pie o 1,2 m sentado) en el turno de máxima actividad con respuesta Slow para motores o Fast para impactos.'),
                    ('3', '📸', 'Fotografíe el estado operativo de la maquinaria', 'Tome fotos con indicación de decibelios, fecha y referencia de la máquina en funcionamiento para certificar la carga de trabajo real durante la prueba.'),
                    ('4', '📊', 'Exporte el informe técnico para el comité de seguridad', 'Descargue el archivo de datos CSV y el resumen ejecutivo en PDF con firma digital SHA-256 para el expediente de prevención de riesgos.')
                ],
                'de': [
                    ('1', '📍', 'Messstationen festlegen', 'Definieren Sie permanente Messpunkte (Station A: CNC-Fräse, Station B: Versand, Station C: Büro) für konsistente Quartalsprüfungen.'),
                    ('2', '⏱️', 'Standardisierte 5-Minuten-Messung starten', 'Messen Sie auf Ohrhöhe (1,5 m stehend / 1,2 m sitzend) bei voller Auslastung. Nutzen Sie Slow für Motoren und Fast für Impulslärm.'),
                    ('3', '📸', 'Betriebszustand mit Fotostempel dokumentieren', 'Fotografieren Sie die Maschine im Betrieb mit eingeblendetem Dezibelwert, Zeitstempel und Stationsbezeichnung als lückenlosen Nachweis.'),
                    ('4', '📊', 'Prüfbericht für Sicherheitsbeauftragte exportieren', 'Laden Sie vollständige CSV-Zeitreihendaten und formatierte PDF-Protokolle mit SHA-256 Hash für das Arbeitsschutzkataster herunter.')
                ],
                'fr': [
                    ('1', '📍', 'Établir des points de contrôle permanents', 'Définissez des postes de mesure fixes (Poste A : Ligne CNC, Poste B : Expédition, Poste C : Bureaux) pour des audits réguliers fiables.'),
                    ('2', '⏱️', 'Effectuer des prélèvements de 5 minutes', 'Mesurez à hauteur d’oreille (1,5 m debout ou 1,2 m assis) en pleine charge. Utilisez le mode Slow pour les moteurs continus et Fast pour les chocs.'),
                    ('3', '📸', 'Photographier l’état de marche de la machine', 'Prenez des photos certifiées intégrant les décibels, l’heure et le repère de l’équipement pour prouver les conditions réelles du test.'),
                    ('4', '📊', 'Télécharger le dossier pour le CSE / médecin du travail', 'Exportez les données brutes CSV et le rapport synthétique PDF avec signature SHA-256 pour le registre d’évaluation des risques (DUERP).')
                ],
                'ja': [
                    ('1', '📍', '常設測定ポイントを固定設定', '各フロアに定点測定ステーション（A地点：旋盤・CNC、B地点：出荷梱包、C地点：営業デスク）を設置し、四半期ごとの経時比較を可能にします。'),
                    ('2', '⏱️', 'ピーク稼働時に耳の高さで5分間測定', '作業者の聴覚位置（立作業1.5m、座作業1.2m）にスマホを構え、定常モーター音はSlowモード、プレス衝撃音はFastモードで測定します。'),
                    ('3', '📸', '機械の稼働状態と負荷を水印写真で記録', '機械の回転数や型番、製品加工中の様子をリアルタイムdBA表示入り写真で撮影し、「空転時の低ノイズ」との言い逃れを排除します。'),
                    ('4', '📊', '安全衛生委員会向けの公式PDF・CSVを出力', '全タイムスタンプ付きCSV生データと、改ざん防止ハッシュ付きPDFサマリーを一括ダウンロードして社内台帳へファイリングします。')
                ],
                'ko': [
                    ('1', '📍', '부서별 영구 계측 지점(스테이션) 지정', '사업장 내 핵심 지점(A: CNC 가공부, B: 조립라인, C: 사무구역)을 고정 지정하여 분기별 추이를 정확히 비교 검증합니다.'),
                    ('2', '⏱️', '정상 조업 시 작업자 귀 높이에서 5분간 계측', '작업자의 귀 위치(입식 1.5m, 좌식 1.2m)를 준수하고, 모터 회전체는 Slow 모드, 프레스 타격음은 Fast 모드로 전환하여 측정합니다.'),
                    ('3', '📸', '설비 가동 부하 상태를 워터마크 사진으로 캡처', '실제 생산 가동 중인 기계 설비와 제어판 상태를 실시간 데시벨 사진으로 촬영하여 정상 부하 가동 상태를 입증합니다.'),
                    ('4', '📊', '산업안전보건위원회 제출용 PDF/CSV 출력', '전산 백업용 CSV 시계열 데이터와 SHA-256 무결성 검증 PDF 요약서를 원클릭으로 다운로드하여 안전보건관리 대장에 보관하세요.')
                ],
                'th': [
                    ('1', '📍', 'กำหนดจุดตรวจวัดถาวร', 'กำหนดสถานีทดสอบประจำ (เช่น จุด A: แผนก CNC, จุด B: แผนกแพ็คกิ้ง, จุด C: ออฟฟิศ) เพื่อการตรวจสอบเปรียบเทียบที่สม่ำเสมอในแต่ละไตรมาส.'),
                    ('2', '⏱️', 'ตรวจวัดมาตรฐาน 5 นาทีในช่วงเวลาทำงานจริง', 'วัดที่ระดับความสูงของหู (1.5 ม. สำหรับคนยืน หรือ 1.2 ม. สำหรับคนนั่ง) เลือกโหมด Slow สำหรับเครื่องยนต์ หรือ Fast สำหรับเสียงกระแทก.'),
                    ('3', '📸', 'ถ่ายภาพยืนยันสถานะการทำงานของเครื่องจักร', 'บันทึกภาพพร้อมข้อมูลเดซิเบล วันเวลา และรหัสเครื่องจักร เพื่อยืนยันว่าเครื่องจักรทำงานเต็มกำลังระหว่างการวัด.'),
                    ('4', '📊', 'ส่งออกรายงานสำหรับคณะกรรมการความปลอดภัย', 'ดาวน์โหลดข้อมูลเวลาแบบละเอียดในรูปแบบ CSV และรายงานสรุป PDF พร้อมรหัสตรวจสอบ SHA-256 สำหรับบันทึกอาชีวอนามัย.')
                ],
                'vi': [
                    ('1', '📍', 'Thiết lập các trạm kiểm tra cố định', 'Xác định các điểm đo chuẩn (Điểm A: Máy tiện CNC, Điểm B: Đóng gói, Điểm C: Văn phòng) để có dữ liệu so sánh định kỳ hàng quý.'),
                    ('2', '⏱️', 'Tiến hành đo 5 phút chuẩn trong giờ sản xuất', 'Đo ở độ cao ngang tai người lao động (1,5m khi đứng hoặc 1,2m khi ngồi). Dùng chế độ Slow cho động cơ liên tục hoặc Fast cho tiếng dập va đập.'),
                    ('3', '📸', 'Chụp ảnh ghi nhận trạng thái tải của máy móc', 'Chụp hình thiết bị đang vận hành có đóng dấu số đo decibel, ngày giờ và mã máy để chứng minh điều kiện làm việc thực tế.'),
                    ('4', '📊', 'Xuất bộ hồ sơ kỹ thuật cho ban an toàn lao động', 'Tải dữ liệu mảng thời gian CSV và bản tóm tắt PDF có mã băm SHA-256 để lưu trữ vào sổ theo dõi điều kiện lao động.')
                ]
            }
        },
        'features': {
            'title': {
                'es': 'Funciones profesionales para inspección industrial y salud laboral',
                'de': 'Industrielle Screening-Funktionen für EHS & Betriebsleiter',
                'fr': 'Fonctionnalités avancées pour les équipes sécurité et maintenance',
                'ja': '産業衛生・設備管理チームのための高精度機能',
                'ko': '산업안전(EHS) 및 시설 관리팀을 위한 핵심 검측 기능',
                'th': 'ฟังก์ชันการตรวจสอบระดับเสียงสำหรับทีมอาชีวอนามัยและความปลอดภัย',
                'vi': 'Các tính năng chuyên sâu cho đội ngũ an toàn lao động & kỹ thuật'
            },
            'lead': {
                'es': 'Diseñado para ofrecer capacidades de cribado acústico profesional directamente en el navegador de cualquier móvil u ordenador.',
                'de': 'Entwickelt für verlässliches betriebliches Lärm-Screening direkt im Smartphone- oder Desktop-Browser.',
                'fr': 'Conçu pour réaliser des dépistages acoustiques fiables directement depuis le navigateur de votre smartphone.',
                'ja': '専用の測定機器を購入することなく、現場のスマートフォンですぐに高度な音響診断を実施できます。',
                'ko': '수백만 원대 전문 계측기 없이도 스마트폰 브라우저에서 전문가급 작업환경 소음 스크리닝이 가능합니다.',
                'th': 'ออกแบบมาเพื่อการตรวจวัดระดับเสียงในโรงงานอย่างมืออาชีพผ่านเบราว์เซอร์บนสมาร์ทโฟนทุกรุ่น.',
                'vi': 'Được xây dựng để thực hiện kiểm tra âm học công nghiệp chuyên nghiệp trực tiếp trên trình duyệt.'
            },
            'items': {
                'es': [
                    ('🎚️', 'Triple ponderación A / C / Z', 'Alterne entre dBA (sensibilidad del oído humano), dBC (maquinaria pesada y vibraciones) y dBZ (lineal no ponderado) para diagnósticos exhaustivos.'),
                    ('⚡', 'Constantes dinámicas Fast y Slow', 'Conforme a los estándares acústicos: Fast (125 ms) para impactos de prensas y caídas de piezas, Slow (1000 ms) para promedios de exposición horaria.'),
                    ('📸', 'Cámara de custodia de puestos de trabajo', 'Estampa lecturas sonoras, hora y notas del puesto directamente sobre la fotografía de las máquinas, aportando un contexto físico incontestable.'),
                    ('📈', 'Espectro en bandas de tercio de octava', 'Identifica frecuencias resonantes en bombas, rodamientos desgastados y compresores antes de que ocurra una avería mecánica grave.'),
                    ('📊', 'Exportación completa en formato CSV', 'Descargue series temporales segundo a segundo para procesar tablas dinámicas en Excel, paneles de control o estudios de ergonomía interna.'),
                    ('🔒', 'Almacenamiento privado sin salida a internet', 'Los datos confidenciales de las instalaciones y el audio de la fábrica permanecen de forma estricta en el dispositivo. Cero datos en la nube.')
                ],
                'de': [
                    ('🎚️', 'Dreifache Frequenzbewertung A / C / Z', 'Wechseln Sie flexibel zwischen dBA (Gehörkurve), dBC (Maschinen-Tieftöner) und dBZ (unbewerteter Schalldruck) für fundierte Ursachenanalysen.'),
                    ('⚡', 'Zeitbewertungen Fast & Slow', 'Entspricht akustischen Messnormen: Fast (125 ms) für Impulslärm von Pressen, Slow (1000 ms) für konstante Dauerbelastungen.'),
                    ('📸', 'Fotodokumentation von Arbeitsplätzen', 'Blendet Messwerte, Uhrzeit und Anlagenbezeichnung unlöschbar in Fotos ein und schafft unanfechtbare Nachweise des Betriebszustands.'),
                    ('📈', '1/3-Oktavband-Frequenzanalyse', 'Lokalisiert störende Resonanzfrequenzen von Motoren, Lagern oder Lüftern zur gezielten vorbeugenden Instandhaltung.'),
                    ('📊', 'Vollständiger CSV-Rohdatenexport', 'Sekundengenaue Messreihen als CSV für Auswertungen in Tabellenkalkulationen, BI-Dashboards oder Gefährdungsbeurteilungen.'),
                    ('🔒', '100% lokale On-Premises-Sicherheit', 'Werksaufnahmen und sensible Maschinendaten verbleiben sicher in der IndexedDB Ihres Browsers. Keine externe Datenübertragung.')
                ],
                'fr': [
                    ('🎚️', 'Triple pondération acoustique A / C / Z', 'Basculez entre le dBA (réponse physiologique), le dBC (basses fréquences industrielles) et le dBZ (pression acoustique linéaire).'),
                    ('⚡', 'Constantes temporelles Rapide et Lente', 'Respecte les normes : Fast (125 ms) pour capter les chocs de presses, Slow (1000 ms) pour évaluer l’exposition moyenne continue.'),
                    ('📸', 'Photos horodatées des postes de travail', 'Inscrit le niveau sonore, la date et le repère machine sur les photos pour consigner l’environnement physique réel.'),
                    ('📈', 'Analyse spectrale par tiers d’octave', 'Détecte les fréquences d’usure des roulements, moteurs et ventilateurs pour faciliter la maintenance prédictive.'),
                    ('📊', 'Exportation complète des séries CSV', 'Téléchargez les valeurs seconde par seconde pour intégration dans vos tableaux de bord HSE et études ergonomiques.'),
                    ('🔒', 'Confidentialité industrielle totale', 'Les données de processus et photos d’usines restent confinées dans le navigateur local. Aucun transfert vers des serveurs tiers.')
                ],
                'ja': [
                    ('🎚️', '三重周波数補正：A特性・C特性・Z特性', '人間の聴覚感度（dBA）、重機やエンジンの重低音（dBC）、補正なし物理音圧（dBZ）をワンタップで切り替えて精密診断。'),
                    ('⚡', '音響規格に準拠したFast（速）/Slow（遅）動特性', 'プレス機の衝撃音や落下音にはFast（125ms）、長時間の連続モーター音や法的暴露評価にはSlow（1000ms）を適用。'),
                    ('📸', '設備稼働状況を証明するタイムスタンプ水印カメラ', '騒音計のリアルタイム数値、日時、設備メモを写真に直接焼き込み、点検時の稼働事実を強固に保全。'),
                    ('📈', '1/3オクターブバンド実時間スペクトル解析', 'モーターのベアリング摩耗やファンの共振周波数をピンポイントで特定し、設備故障の予兆保全に貢献。'),
                    ('📊', 'Excel連携可能なCSV完全生データ出力', '1秒ごとの音圧時系列配列をCSVで即座にエクスポート。社内集計グラフや安全衛生委員会の資料作成に直結。'),
                    ('🔒', '工場機密を守る完全ローカルIndexedDB保存', '製造ラインの画像や機械データが外部クラウドにアップロードされることは一切ありません。機密保持を完全担保。')
                ],
                'ko': [
                    ('🎚️', 'A / C / Z 3중 청감 주파수 보정 곡선', '인간 청각 특성(dBA), 대형 모터 진동음(dBC), 순수 음압 물리량(dBZ)을 즉시 전환하여 다각도로 원인을 규명합니다.'),
                    ('⚡', 'Fast(125ms) 및 Slow(1000ms) 동특성 반응', '충격적인 프레스 타격음은 Fast 모드로 즉각 포착하고, 8시간 연속 노출 평가는 Slow 모드로 안정적으로 계측합니다.'),
                    ('📸', '설비 점검 현장 전용 워터마크 증거 카메라', '장비 가동 모습에 실시간 데시벨, 시간, 측정 포인트를 각인하여 현장 사진의 신뢰도를 극대화합니다.'),
                    ('📈', '1/3 옥타브 밴드 실시간 주파수 분석', '펌프, 감속기, 공조기 베어링의 이상 마모 고유 주파수를 선제적으로 파악하여 설비 돌발 고장을 예방합니다.'),
                    ('📊', '전산 분석을 위한 초 단위 CSV 원본 추출', '초당 실측 소음 데이터를 스프레드시트로 내보내어 사내 대시보드 연동 및 근골격계·작업환경 통계에 활용하세요.'),
                    ('🔒', '기업 산업기밀 보호를 위한 100% 로컬 보안', '공장 라인 사진과 내부 음향 데이터는 브라우저 내부 스토리지에만 저장되며, 외부 서버로 절대 유출되지 않습니다.')
                ],
                'th': [
                    ('🎚️', 'ระบบถ่วงน้ำหนักความถี่ 3 รูปแบบ: A / C / Z', 'สลับระหว่าง dBA (การได้ยินของคน), dBC (เสียงเบสต่ำของเครื่องจักร) และ dBZ (แรงดันเสียงดิบ) เพื่อการวินิจฉัยที่แม่นยำ.'),
                    ('⚡', 'การตอบสนองแบบ Fast และ Slow ตามมาตรฐานสากล', 'สอดคล้องกับมาตรฐานเครื่องวัดเสียง: Fast (125ms) สำหรับเสียงกระแทกของเครื่องปั๊ม และ Slow (1000ms) สำหรับค่าเฉลี่ย.'),
                    ('📸', 'กล้องถ่ายภาพหน้างานพร้อมประทับค่าเสียง', 'บันทึกภาพเครื่องจักรพร้อมประทับระดับเสียง เวลา และหมายเลขสถานี เพื่อใช้เป็นหลักฐานยืนยันสภาพการทำงานจริง.'),
                    ('📈', 'การวิเคราะห์สเปกตรัมความถี่ 1/3 Octave', 'ระบุความถี่การสั่นสะเทือนของลูกปืนหรือคอมเพรสเซอร์ เพื่อตรวจหาความผิดปกติก่อนที่เครื่องจักรจะชำรุดเสียหาย.'),
                    ('📊', 'ส่งออกข้อมูลดิบ CSV ละเอียดระดับวินาที', 'นำข้อมูลไปวิเคราะห์ต่อในโปรแกรมสเปรดชีต หรือนำเข้าแดชบอร์ดความปลอดภัยในการทำงานของโรงงานได้อย่างง่ายดาย.'),
                    ('🔒', 'รักษาความลับของโรงงาน ไม่ส่งข้อมูลขึ้นคลาวด์', 'ภาพถ่ายในโรงงานและข้อมูลเสียงทั้งหมดจะถูกเก็บไว้ในอุปกรณ์ของคุณเท่านั้น ไม่มีความเสี่ยงเรื่องข้อมูลรั่วไหล.')
                ],
                'vi': [
                    ('🎚️', 'Trọng số âm học ba chế độ: A / C / Z', 'Chuyển đổi linh hoạt giữa dBA (thính giác người), dBC (âm trầm động cơ lớn) và dBZ (áp suất âm thanh phẳng không bù trừ).'),
                    ('⚡', 'Hằng số thời gian Fast (nhanh) và Slow (chậm)', 'Đáp ứng tiêu chuẩn đo lường: Fast (125ms) bắt trọn tiếng búa dập đột ngột, Slow (1000ms) đánh giá độ ồn liên tục theo ca.'),
                    ('📸', 'Máy ảnh đóng dấu hiện trường máy móc', 'Đóng dấu số liệu decibel, thời gian và tên trạm làm việc trực tiếp lên ảnh thiết bị để xác nhận tình trạng vận hành thực.'),
                    ('📈', 'Phân tích dải tần 1/3 Octave theo thời gian thực', 'Xác định chính xác tần số rung lắc bất thường của vòng bi, cánh quạt hoặc máy nén để chủ động bảo trì phòng ngừa.'),
                    ('📊', 'Xuất toàn bộ mảng dữ liệu thô ra file CSV', 'Trích xuất dữ liệu đo theo từng giây để lập bảng biểu thống kê trong Excel hoặc tích hợp vào báo cáo an toàn định kỳ.'),
                    ('🔒', 'Bảo mật tuyệt đối bí mật công nghệ nhà máy', 'Dữ liệu hình ảnh xưởng và thông số đo chỉ lưu trữ cục bộ trên máy của bạn, tuyệt đối không gửi lên máy chủ đám mây.')
                ]
            }
        },
        'rules': {
            'title': {
                'es': 'Cuatro principios para auditorías de ruido laboral rigurosas',
                'de': 'Vier Grundregeln für professionelle Lärmprüfungen im Betrieb',
                'fr': 'Quatre principes pour des contrôles du bruit en entreprise irréprochables',
                'ja': '信頼性の高い職場騒音点検を実施するための4つの鉄則',
                'ko': '신뢰받는 사업장 소음 순회 점검을 위한 4대 실무 원칙',
                'th': 'หลักการ 4 ข้อสำหรับการตรวจวัดระดับเสียงในโรงงานอย่างถูกต้อง',
                'vi': 'Bốn nguyên tắc kiểm tra tiếng ồn chuẩn mực tại doanh nghiệp'
            },
            'lead': {
                'es': 'Las inspecciones de prevención de riesgos deben ser rigurosas y reproducibles. Así se garantiza un estándar técnico fiable.',
                'de': 'Arbeitsschutzprüfungen müssen exakt und nachvollziehbar sein. So sichern Sie professionelle Standards ab.',
                'fr': 'Les contrôles d’hygiène et sécurité doivent être rigoureux et reproductibles. Voici les bonnes pratiques.',
                'ja': '現場の安全巡回は再現性と客観性が命です。社内外から信頼される点検記録を残すための基準です。',
                'ko': '산업안전 점검은 재현성과 객관성이 핵심입니다. 감사나 감독관 입회 시 완벽한 신뢰를 보장하는 방법입니다.',
                'th': 'การตรวจสอบอาชีวอนามัยต้องทำอย่างรัดกุมและตรวจสอบซ้ำได้ นี่คือแนวทางการปฏิบัติที่ถูกต้อง.',
                'vi': 'Công tác kiểm tra an toàn lao động phải chặt chẽ và có thể lặp lại. Đây là các quy tắc chuyên môn cần tuân thủ.'
            },
            'items': {
                'es': [
                    ('👂', 'Regla 1: Mida siempre a la altura del oído del trabajador', 'Sitúe el micrófono a unos 1,5 metros de altura para operarios de pie o a 1,2 metros para operarios sentados, orientándolo hacia la zona auditiva.'),
                    ('⚙️', 'Regla 2: Anote la carga y velocidad operativa de las máquinas', 'Registre siempre si la línea estaba al ralentí, al 50% de capacidad o a plena producción. El nivel sonoro puede oscilar entre 10 y 15 dB.'),
                    ('📋', 'Regla 3: Utilice el cribado para planificar medidas de ingeniería', 'Emplee SOUNDTEST.PRO para inspeccionar 20 zonas en una jornada y priorice cabinas de insonorización en aquellos puntos que superen los 80 dBA.'),
                    ('⚖️', 'Regla 4: Conozca los límites entre cribado preliminar y peritaje homologado', 'SOUNDTEST.PRO es una herramienta de cribado y documentación continua. Para actas sancionadoras oficiales se requiere dosimetría homologada.')
                ],
                'de': [
                    ('👂', 'Regel 1: Immer auf Ohrhöhe der Beschäftigten messen', 'Mikrofon auf 1,5 m Höhe (stehende Tätigkeit) bzw. 1,2 m (sitzende Tätigkeit) positionieren, ausgerichtet auf den Gehörbereich des Mitarbeiters.'),
                    ('⚙️', 'Regel 2: Betriebsauslastung und Maschinentakt erfassen', 'Dokumentieren Sie stets, ob die Anlage im Leerlauf, im Teillast- oder Volllastbetrieb lief. Die Pegelunterschiede betragen oft 10 bis 15 dB.'),
                    ('📋', 'Regel 3: Screening-Daten für gezielte Lärmminderung nutzen', 'Nutzen Sie SOUNDTEST.PRO für schnelle Bestandsaufnahmen in allen Abteilungen und leiten Sie bei Werten über 80 dBA gezielte Maßnahmen ein.'),
                    ('⚖️', 'Regel 4: Grenzen zwischen Screening und Gutachten beachten', 'SOUNDTEST.PRO dient dem betrieblichen Lärm-Screening und der Prävention. Gesetzliche Revisionsprüfungen erfordern geeichte Klasse-1-Geräte.')
                ],
                'fr': [
                    ('👂', 'Règle 1 : Mesurer rigoureusement à hauteur d’oreille', 'Placez le terminal à 1,5 m du sol pour un opérateur debout ou 1,2 m pour un poste assis, orienté vers la zone d’écoute.'),
                    ('⚙️', 'Règle 2 : Noter la charge de travail et la cadence machine', 'Mentionnez si l’installation tourne à vide, à 50% ou à pleine charge. La différence de niveau sonore peut dépasser 10 à 15 dB.'),
                    ('📋', 'Règle 3 : Exploiter les résultats pour cibler les aménagements', 'Utilisez SOUNDTEST.PRO pour auditer l’ensemble de vos ateliers et prioriser les capotages acoustiques là où les 80 dBA sont dépassés.'),
                    ('⚖️', 'Règle 4 : Distinguer dépistage interne et métrologie certifiée', 'SOUNDTEST.PRO est un outil de suivi interne préventif. Les contrôles réglementaires formels de l’inspection du travail nécessitent un sonomètre classe 1 étalonné.')
                ],
                'ja': [
                    ('👂', '鉄則1：必ず作業者の「耳の高さ」で測定する', '測定器の位置は立作業で床上1.5m、座作業で1.2mを厳守し、機械本体ではなく作業員の受音域に向けて構えます。'),
                    ('⚙️', '鉄則2：機械の稼働負荷と回転速度を必ず併記する', '空転アイドリング、50%負荷、最大フル稼働時では騒音レベルが10〜15dB変動します。点検メモに稼働条件を明記します。'),
                    ('📋', '鉄則3：スクリーニング結果を防音カバー等の設備改善に活用', 'SOUNDTEST.PROで工場内の20箇所を迅速にパトロールし、80dBAを超える工程に対して優先的に吸音材や防音壁を施工します。'),
                    ('⚖️', '鉄則4：日常スクリーニングと法定作業環境測定の役割分担を理解する', 'SOUNDTEST.PROは日常の安全衛生自主点検・スクリーニングに最適です。労働基準監督署への法定届出には認定機関の計量器測定を併用してください。')
                ],
                'ko': [
                    ('👂', '수칙 1: 반드시 작업자의 귀 높이(청취 영역)에서 측정', '입식 작업자는 바닥 위 1.5m, 좌식 작업자는 1.2m 높이를 엄격히 유지하고 기계 모터가 아닌 작업자의 귀 방향으로 측정하세요.'),
                    ('⚙️', '수칙 2: 계측 시 설비의 가동 부하율을 명확히 기록', '공회전 상태, 50% 부하, 풀가동 생산 시 소음은 10~15 dB 이상 차이납니다. 측정 사진 메모에 실제 작업 조건을 반드시 기재하세요.'),
                    ('📋', '수칙 3: 스크리닝 데이터를 바탕으로 공학적 소음 저감 대책 수립', 'SOUNDTEST.PRO로 전 공정을 신속히 순회하여 80 dBA를 초과하는 위험 부서를 선별하고 방음 부스나 흡음재 시공 우선순위를 지정하세요.'),
                    ('⚖️', '수칙 4: 사내 자체 스크리닝과 법정 작업환경측정의 영역 구분', 'SOUNDTEST.PRO는 상시 안전보건 관리와 위험성 평가에 최적화되어 있습니다. 관할 고용노동청 정기 인허가 제출 시 공인 측정기관 평가와 병행하세요.')
                ],
                'th': [
                    ('👂', 'กฎข้อที่ 1: วัดที่ระดับความสูงของหูพนักงานเสมอ', 'วางตำแหน่งไมโครโฟนสูงประมาณ 1.5 เมตรสำหรับคนยืน หรือ 1.2 เมตรสำหรับคนนั่ง โดยหันไปทางบริเวณที่พนักงานรับฟังเสียง.'),
                    ('⚙️', 'กฎข้อที่ 2: บันทึกภาระงานและความเร็วของเครื่องจักร', 'บันทึกเสมอว่าเครื่องจักรทำงานที่ระดับเดินเบา 50% หรือเต็มกำลัง 100% เพราะระดับเสียงอาจต่างกันได้ถึง 10-15 dB.'),
                    ('📋', 'กฎข้อที่ 3: ใช้ข้อมูลการตรวจวัดเพื่อวางแผนปรับปรุงทางวิศวกรรม', 'ใช้ SOUNDTEST.PRO ตรวจสอบทั้งโรงงานอย่างรวดเร็ว และเน้นการติดตั้งแผงกั้นเสียงในจุดที่มีเสียงเกิน 80 dBA.'),
                    ('⚖️', 'กฎข้อที่ 4: เข้าใจขอบเขตระหว่างการตรวจเบื้องต้นกับการรับรองทางกฎหมาย', 'SOUNDTEST.PRO เป็นเครื่องมือสำหรับการเฝ้าระวังและปรับปรุงความปลอดภัยภายใน สำหรับการรับรองตามกฎหมายอย่างเป็นทางการต้องใช้เครื่องมือ Class 1.')
                ],
                'vi': [
                    ('👂', 'Quy tắc 1: Luôn đo ngang tầm tai của người lao động', 'Đặt thiết bị ở độ cao 1,5m đối với vị trí đứng hoặc 1,2m đối với vị trí ngồi, hướng về vùng thính giác của công nhân.'),
                    ('⚙️', 'Quy tắc 2: Ghi rõ công suất và chế độ hoạt động của máy', 'Luôn ghi chú máy đang chạy không tải, 50% tải hay hoạt động hết công suất. Mức ồn có thể chênh lệch từ 10 đến 15 dB giữa các trạng thái.'),
                    ('📋', 'Quy tắc 3: Dùng dữ liệu rà soát để triển khai giải pháp kỹ thuật', 'Sử dụng SOUNDTEST.PRO để kiểm tra nhanh 20 vị trí trong xưởng và ưu tiên bọc cách âm cho những máy móc phát ra trên 80 dBA.'),
                    ('⚖️', 'Quy tắc 4: Phân biệt rõ giữa tự kiểm tra nội bộ và đo kiểm định pháp lý', 'SOUNDTEST.PRO là công cụ giám sát và đánh giá rủi ro nội bộ đắc lực. Đối với biên bản thanh tra lao động nhà nước, cần phối hợp với máy đo chuyên dụng.')
                ]
            }
        },
        'faqs': {
            'es': [
                ("¿A partir de qué nivel de decibelios es obligatorio usar protectores auditivos en el trabajo?",
                 "Según la normativa de prevención de riesgos laborales y directivas europeas, a partir de 80 dBA (nivel de acción inferior) el empresario debe suministrar protección auditiva e información; a partir de 85 dBA (nivel de acción superior) el uso es estrictamente obligatorio."),
                ("¿Quién supervisa el cumplimiento del ruido laboral en las empresas?",
                 "La Inspección de Trabajo y Seguridad Social junto con los Servicios de Prevención y comités de seguridad y salud velan por el cumplimiento de los límites de exposición profesional."),
                ("¿Pueden los delegados de prevención o trabajadores registrar el ruido ambiental de su puesto?",
                 "Sí, la evaluación y seguimiento de las condiciones de trabajo es un derecho preventivo. SOUNDTEST.PRO ofrece una documentación técnica de referencia para solicitar evaluaciones específicas."),
                ("¿Qué diferencia hay entre TWA (promedio ponderado en el tiempo) y nivel pico?",
                 "El TWA representa la dosis media acumulada durante una jornada de 8 horas, mientras que el nivel pico (Lpeak) mide la presión instantánea máxima de impactos súbitos como troqueles o explosiones.")
            ],
            'de': [
                ("Ab welcher Lautstärke ist Gehörschutz am Arbeitsplatz Pflicht?",
                 "Nach der Lärm- und Vibrations-Arbeitsschutzverordnung (LärmVibrationsArbSchV) muss Gehörschutz ab dem unteren Auslösewert von 80 dBA zur Verfügung gestellt werden; ab dem oberen Auslösewert von 85 dBA ist das Tragen gesetzlich vorgeschrieben."),
                ("Wer kontrolliert die Einhaltung der Lärmschutzvorschriften im Betrieb?",
                 "Die Berufsgenossenschaften (DGUV) und die staatlichen Arbeitsschutzbehörden (Gewerbeaufsichtsämter) überwachen die Einhaltung der Arbeitsplatzgrenzwerte."),
                ("Dürfen Mitarbeiter oder Betriebsräte Lärmmessungen am Arbeitsplatz durchführen?",
                 "Ja, Betriebsräte und Mitarbeiter haben das Recht, gesundheitliche Belastungen zur Gefährdungsbeurteilung orientierend zu dokumentieren."),
                ("Was ist der Unterschied zwischen TWA (8-Stunden-Mittelwert) und Spitzenwert?",
                 "Der TWA (Time-Weighted Average / Lex,8h) normiert die Lärmdosis auf einen 8-Stunden-Arbeitstag. Spitzenwerte (Lpeak) erfassen extrem kurze Schalldruckspitzen (z. B. Stanzen), die das Trommelfell sofort schädigen können.")
            ],
            'fr': [
                ("À partir de quel niveau sonore le port de protections auditives est-il obligatoire ?",
                 "Dès 80 dBA d’exposition quotidienne (seuil d’action inférieur), l’employeur doit mettre des EPI à disposition ; dès 85 dBA (seuil supérieur), le port de protecteurs auditifs est obligatoire et la zone doit être balisée."),
                ("Qui est chargé de contrôler les nuisances sonores au travail ?",
                 "L’inspection du travail, la CARSAT / CRAMIF et les services de santé au travail contrôlent la mise en œuvre des mesures de prévention des risques liés au bruit."),
                ("Les membres du CSE ou salariés peuvent-ils mesurer le bruit de leur poste ?",
                 "Tout à fait. La remontée de données objectives par le personnel permet de justifier l’inscription du risque bruit dans le Document Unique (DUERP)."),
                ("Quelle est la différence entre dose TWA et niveau de crête (Peak) ?",
                 "La valeur TWA mesure l’exposition moyenne sur une journée de 8 heures, tandis que la valeur crête (Lpeak) mesure la pression instantanée des chocs métalliques ou détonations.")
            ],
            'ja': [
                ("職場で耳栓やイヤーマフの着用が義務付けられるのは何デシベルからですか？",
                 "労働安全衛生規則の作業環境測定基準では、85dBA以上（第2管理区分）で聴覚保護具の着用推奨および作業環境改善が求められ、90dBAを超えると常時着用が義務付けられます。"),
                ("職場の労働安全衛生および騒音基準を監督・指導する公的機関はどこですか？",
                 "厚生労働省管轄の労働基準監督署および労働安全衛生推進機関が、定期立ち入り点検や指導を行っています。"),
                ("現場の安全衛生担当者や作業員が職場の騒音を独自に測定しても問題ありませんか？",
                 "問題ありません。日々の自主的な安全パトロールやヒヤリハット活動として、現場のスマートフォンで迅速に音圧を記録することは、労働災害予防に極めて有用です。"),
                ("TWA（時間加重平均）とピーク音圧（Peak）の違いは何ですか？",
                 "TWAは8時間の労働時間全体で暴露された平均騒音エネルギー量を表し、ピーク値（Peak/Lmax）はプレス機やハンマーなどの瞬時最大の衝撃音圧を捉える指標です。両方の管理が不可欠です。")
            ],
            'ko': [
                ("작업장에서 청력보호구 착용이 법적으로 의무화되는 소음 기준은 얼마인가요?",
                 "산업안전보건기준에 관한 규칙상 8시간 기준 85 dBA에 도달하면 소음성 난청 예방 교육 및 귀마개 지급 권고 대상이 되며, 90 dBA를 초과하는 소음작업장에서는 착용이 법적 의무입니다."),
                ("사업장의 소음 노출 기준 준수 여부를 감독하는 기관은 어디인가요?",
                 "고용노동부 지방고용노동관서(근로감독관) 및 한국산업안전보건공단에서 사업장 근로 환경을 감독하고 위반 시 시정명령을 내립니다."),
                ("사내 안전담당자나 근로자가 스마트폰으로 작업장 소음을 직접 측정해도 되나요?",
                 "완전히 가능하며 적극 권장됩니다. 공식 작업환경측정 주기 사이의 상시 안전 순회 점검 및 유해 요인 사전 발굴을 위한 정량적 모니터링으로 매우 유용합니다."),
                ("TWA(시간가중평균)와 순간 최고 피크치(Peak)의 차이는 무엇인가요?",
                 "TWA는 8시간 근무 시간 동안 누적된 평균 소음 노출량을 뜻하며, 피크치(Peak)는 프레스 타격이나 에어 건 분사 시 발생하는 찰나의 최대 충격 음압을 의미합니다.")
            ],
            'th': [
                ("ระดับเสียงเท่าใดที่ต้องสวมใส่อุปกรณ์คุ้มครองความปลอดภัยส่วนบุคคล (PPE) ในที่ทำงาน?",
                 "ตามกฎหมายความปลอดภัย อาชีวอนามัย และสภาพแวดล้อมในการทำงาน หากทำงาน 8 ชั่วโมง ระดับเสียงเฉลี่ยต้องไม่เกิน 85 dBA หากเกินกว่านี้ นายจ้างต้องจัดหาอุปกรณ์ลดเสียงให้พนักงานสวมใส่."),
                ("หน่วยงานใดมีหน้าที่กำกับดูแลมาตรฐานเสียงในสถานที่ทำงาน?",
                 "กรมสวัสดิการและคุ้มครองแรงงาน กระทรวงแรงงาน เป็นผู้มีอำนาจตรวจสอบและบังคับใช้กฎหมายความปลอดภัยในการทำงาน."),
                ("เจ้าหน้าที่ความปลอดภัย (จป.) หรือพนักงานสามารถวัดระดับเสียงด้วยตนเองได้หรือไม่?",
                 "สามารถทำได้ และเป็นวิธีที่ดีในการเฝ้าระวังเบื้องต้น เพื่อค้นหาจุดเสี่ยงและวางแผนปรับปรุงสภาพแวดล้อมในการทำงาน."),
                ("ค่าเฉลี่ย TWA กับค่าพีค (Peak) ต่างกันอย่างไรในการตรวจวัดเสียง?",
                 "TWA คือค่าเฉลี่ยการรับสัมผัสเสียงตลอดการทำงาน 8 ชั่วโมง ส่วน Peak คือค่าความดันเสียงสูงสุด ณ เสี้ยววินาทีที่เกิดเสียงกระแทก เช่น เครื่องปั๊มโลหะ.")
            ],
            'vi': [
                ("Mức decibel nào bắt buộc người lao động phải mang nút tai chống ồn tại nơi làm việc?",
                 "Theo quy chuẩn kỹ thuật quốc gia QCVN 24:2016/BYT, giới hạn tiếp xúc tiếng ồn tại nơi làm việc không được vượt quá 85 dBA trong ca làm việc 8 giờ. Nếu vượt quá, người sử dụng lao động bắt buộc phải trang bị phương tiện bảo vệ thính giác."),
                ("Cơ quan nào có thẩm quyền thanh tra tiếng ồn và điều kiện lao động tại nhà máy?",
                 "Thanh tra Sở Lao động - Thương binh và Xã hội cùng Trung tâm Kiểm soát bệnh tật (CDC) các tỉnh/thành phố có thẩm quyền kiểm tra và xử phạt vi phạm."),
                ("Cán bộ an toàn nội bộ hoặc người lao động có được tự đo tiếng ồn tại xưởng không?",
                 "Hoàn toàn được. Việc tự kiểm tra thường xuyên giúp phát hiện sớm các nguy cơ gây điếc nghề nghiệp trước khi diễn ra đợt quan trắc môi trường lao động chính thức."),
                ("TWA (trung bình theo thời gian) khác giá trị đỉnh (Peak) như thế nào?",
                 "TWA là mức độ tiếp xúc tiếng ồn trung bình trong ca làm việc 8 giờ, còn Peak là giá trị áp suất âm thanh tức thời cực đại của các cú va đập cơ khí như máy dập.")
            ]
        },
        'cta_band': {
            'es': ('¿Desea optimizar la seguridad acústica de su centro de trabajo?',
                   'Realice auditorías de ruido estructuradas en 10 segundos directamente en el navegador. Sin hardware costoso, 100% privado.'),
            'de': ('Wollen Sie die Lärmsicherheit in Ihrem Betrieb verlässlich prüfen?',
                   'Erstellen Sie professionelle Lärm-Screenings in 10 Sekunden direkt im Browser. Keine teure Hardware, 100% datenschutzkonform.'),
            'fr': ('Prêt à auditer l’environnement acoustique de vos ateliers en toute simplicité ?',
                   'Réalisez des contrôles structurés en 10 secondes directement dans votre navigateur. Sans matériel lourd, 100% confidentiel.'),
            'ja': ('職場の騒音リスクと作業環境を、確かなデータで改善しませんか？',
                   '高価な専用機器の購入も不要。ブラウザを開いて10秒で現場の騒音監査台帳を作成。100%ローカル保存で安全。'),
            'ko': ('작업장 소음 유해 요인, 이제 스마트폰으로 신속하고 정확하게 관리하세요',
                   '고가의 장비 구매 없이 브라우저에서 10초 만에 산업안전 소음 점검 보고서를 생성할 수 있습니다. 100% 로컬 보안 보장.'),
            'th': ('พร้อมที่จะยกระดับความปลอดภัยทางเสียงในสถานที่ทำงานของคุณแล้วหรือยัง?',
                   'สร้างรายงานตรวจสอบระดับเสียงมาตรฐานได้ใน 10 วินาทีผ่านเบราว์เซอร์ ไม่ต้องใช้อุปกรณ์ราคาแพง รักษาความเป็นส่วนตัว 100%.'),
            'vi': ('Sẵn sàng kiểm soát an toàn tiếng ồn và bảo vệ thính lực người lao động?',
                   'Thực hiện kiểm tra âm học chuẩn hóa chỉ trong 10 giây ngay trên trình duyệt. Không cần đầu tư thiết bị đắt tiền, bảo mật tuyệt đối.')
        }
    }
}
