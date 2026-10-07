# scripts/use_case_data_2_6.py
# Complete scenario data for Scenarios 2 through 6 across 7 languages: es, de, fr, ja, ko, th, vi

SCENARIOS_2_TO_6 = {
    'bar-street-disturbance': {
        'img': 'bar_street_noise.webp',
        'img_alt': {
            'es': 'Inquilino en dormitorio oscuro mirando por la ventana hacia una ruidosa terraza de bar midiendo 76.8 dBA',
            'de': 'Schlafloser Anwohner am Fenster mit Blick auf laute Bar-Terrasse und Nachtleben bei 76,8 dBA',
            'fr': 'Résident épuisé à la fenêtre observant une terrasse de bar bruyante et mesurant 76,8 dBA',
            'ja': '深夜1時45分、眼下の騒がしい居酒屋・バーのテラス席と重低音に苦しみ窓際で76.8dBAを測定する様子',
            'ko': '심야 1시 45분 창문 밖 시끄러운 술집 야외 테라스 소음과 우퍼 저음에 시달리며 76.8 dBA를 측정하는 모습',
            'th': 'ผู้อยู่อาศัยที่หน้าต่างมองดูร้านเหล้าข้างล่างที่ส่งเสียงดังยามดึก พร้อมวัดเสียงได้ 76.8 dBA',
            'vi': 'Cư dân đứng bên cửa sổ nhìn xuống quán bar ồn ào và đo được mức 76.8 dBA lúc nửa đêm'
        },
        'stats': {
            'es': [('74.8 dBA', 'Pico en calle'), ('15m LAeq', 'Ventana legal'), ('Graves FFT', '31.5–125Hz'), ('PDF Oficial', 'Apto para licencias')],
            'de': [('74,8 dBA', 'Straßen-Spitzenwert'), ('15m LAeq', 'Messfenster'), ('Bass FFT', '31,5–125Hz'), ('PDF-Protokoll', 'Behördenfest')],
            'fr': [('74,8 dBA', 'Pic niveau rue'), ('15m LAeq', 'Fenêtre légale'), ('Basses FFT', '31,5–125Hz'), ('Audit PDF', 'Prêt pour la mairie')],
            'ja': [('74.8 dBA', '路上騒音ピーク'), ('15分 LAeq', '行政評価基準'), ('低周波FFT', '31.5〜125Hz'), ('PDF監査書', '警察・自治体提出用')],
            'ko': [('74.8 dBA', '거리 소음 피크'), ('15분 LAeq', '행정 기준창'), ('저주파 FFT', '31.5~125Hz'), ('PDF 보고서', '지자체·경찰 신고용')],
            'th': [('74.8 dBA', 'พีคเสียงริมถนน'), ('15m LAeq', 'ช่วงเวลาวัดทางกฎหมาย'), ('เบส FFT', '31.5–125Hz'), ('รายงาน PDF', 'พร้อมยื่นเจ้าหน้าที่')],
            'vi': [('74.8 dBA', 'Đỉnh tiếng ồn phố'), ('15p LAeq', 'Khung đo pháp lý'), ('Âm trầm FFT', '31.5–125Hz'), ('Báo cáo PDF', 'Nộp cơ quan quản lý')]
        },
        'hero': {
            'es': {
                'eyebrow': 'Caso de uso · Molestias de bares, terrazas y vía pública',
                'headline': 'Documente el ruido nocturno y de locales comerciales <em>que le roba el sueño</em>.',
                'lead': 'Terrazas no autorizadas, graves retumbantes y clientes ruidosos no deberían arruinar su descanso. Capture pruebas objetivos con análisis LAeq de 15 minutos, fotos con marca de agua y dosieres estructurados para policía local y licencias.'
            },
            'de': {
                'eyebrow': 'Anwendungsfall · Bars, Gastronomie &amp; Straßenlärm',
                'headline': 'Dokumentieren Sie Gastronomie- &amp; Straßenlärm, <em>der Ihnen den Schlaf raubt</em>.',
                'lead': 'Nicht genehmigte Außenbewirtung, wummernde Bassfrequenzen und laute Gäste dürfen Ihre Lebensqualität nicht zerstören. Sichern Sie hieb- und stichfeste Beweise mit 15-Minuten-LAeq-Messungen, Fotostempel und behördenreifen PDF-Dossiers.'
            },
            'fr': {
                'eyebrow': 'Cas d’usage · Bars, commerces et nuisances de rue',
                'headline': 'Documentez les nuisances sonores nocturnes <em>qui ruinent votre sommeil</em>.',
                'lead': 'Terrasses sauvages, vibrations de basses assourdissantes et attroupements nocturnes ne doivent plus gâcher vos nuits. Obtenez des preuves incontestables avec le calcul du LAeq sur 15 minutes, photos horodatées et rapports destinés aux services d’urbanisme.'
            },
            'ja': {
                'eyebrow': '利用シーン · 飲食店・居酒屋・街頭の深夜騒音',
                'headline': '睡眠を奪う店舗の重低音や深夜のテラス席騒音を<em>確実な証拠</em>として記録。',
                'lead': '深夜まで続く居酒屋の外売り、スピーカーの重低音、酔客の叫び声に耐え続ける必要はありません。15分間の等価騒音レベル（LAeq）、低周波FFT共振解析、リアルタイム写真スタンプで、警察や自治体・保健所へ提出する公式証拠を作成。'
            },
            'ko': {
                'eyebrow': '활용 사례 · 상가, 유흥주점 및 야간 거리 소음',
                'headline': '수면을 파괴하는 주점의 우퍼 저음과 야외 테이블 소음을 <em>명확한 실증 증거</em>로 확보하세요.',
                'lead': '허가받지 않은 야외 테라스 영업, 심야 클럽 우퍼의 진동 소음, 고성방가로 고통받지 마세요. 15분 법정 평가 기준(LAeq), 저주파수 대역 분석, 실시간 워터마크 사진으로 구청 및 경찰 신고용 공식 보고서를 완성합니다.'
            },
            'th': {
                'eyebrow': 'กรณีการใช้งาน · ร้านอาหาร สถานบันเทิง และเสียงริมถนน',
                'headline': 'บันทึกเสียงรบกวนยามค่ำคืนจากสถานบันเทิง<em>ที่พรากการนอนหลับของคุณ</em>.',
                'lead': 'โต๊ะนั่งดื่มริมทางที่เปิดเกินเวลา เสียงเบสตึบๆ และคนเมาส่งเสียงดังรบกวน ไม่ควรเป็นสิ่งที่คุณต้องทน บันทึกหลักฐานที่หนักแน่นด้วยการวิเคราะห์ LAeq 15 นาที ภาพถ่ายประทับค่าเสียง และรายงานเพื่อแจ้งเจ้าหน้าที่เทศบาล.'
            },
            'vi': {
                'eyebrow': 'Trường hợp sử dụng · Quán bar, nhà hàng &amp; phố đêm',
                'headline': 'Ghi lại bằng chứng tiếng ồn quán bar và phố đêm <em>cướp đi giấc ngủ của bạn</em>.',
                'lead': 'Kê bàn ghế lấn chiếm vỉa hè, âm trầm loa đập thình thịch và đám đông hò hét không thể tiếp tục phá vỡ sự yên tĩnh của bạn. Thu thập chứng cứ với phép đo LAeq 15 phút, chụp ảnh đóng dấu số liệu và xuất hồ sơ cho công an địa phương.'
            }
        },
        'table': {
            'headers': {
                'es': ('Nivel medido', 'Fuente habitual en vía pública', 'Límite legal y ordenanza', 'Acción recomendada'),
                'de': ('Gemessener Pegel', 'Typische Lärmquelle', 'Gewerbeordnung & Grenzwerte', 'Handlungsempfehlung'),
                'fr': ('Niveau mesuré', 'Source de nuisance commerciale', 'Norme d’urbanisme et d’exploitation', 'Action recommandée'),
                'ja': ('実測値', '商業・店舗・路上騒音の発生源', '環境基本法・騒音規制基準', '推奨対応措置'),
                'ko': ('측정치', '상가 및 거리 소음원', '소음진동관리법 배출허용기준', '권장 조치 단계'),
                'th': ('ระดับที่วัดได้', 'แหล่งกำเนิดเสียงทางพาณิชย์', 'เกณฑ์ผังเมืองและใบอนุญาต', 'การดำเนินการที่แนะนำ'),
                'vi': ('Mức đo được', 'Nguồn phát tiếng ồn thương mại', 'Quy chuẩn môi trường & kinh doanh', 'Hành động khuyến nghị')
            },
            'title': {
                'es': 'Límites legales de ruido para ocio nocturno y locales comerciales',
                'de': 'Grenzwerte für Gastronomie-, Gewerbe- & Straßenlärm',
                'fr': 'Seuils d’émission acoustique pour bars et commerces',
                'ja': '商業地域・飲食店深夜営業の法定騒音限度基準表',
                'ko': '상업·유흥시설 야간 소음 배출허용기준 대조표',
                'th': 'เกณฑ์จำกัดระดับเสียงสำหรับสถานบันเทิงและร้านค้า',
                'vi': 'Bảng giới hạn tiếng ồn cho cơ sở kinh doanh và giải trí'
            },
            'lead': {
                'es': 'Compare sus mediciones en ventana o fachada con los límites de licencias de actividad y normativas urbanas.',
                'de': 'Vergleichen Sie Ihre Messwerte am Fenster mit behördlichen Gaststättenauflagen und TA Lärm.',
                'fr': 'Comparez vos relevés aux prescriptions d’autorisation d’exploitation et aux arrêtés préfectoraux.',
                'ja': '窓辺や境界線での実測値を、用途地域別の法定基準および深夜営業許可条件と照合できます。',
                'ko': '창가나 건물 부지 경계선에서의 실측치를 지자체 조례 및 영업 허가 기준과 대조해 보세요.',
                'th': 'เปรียบเทียบค่าที่วัดได้บริเวณหน้าต่างกับเงื่อนไขใบอนุญาตเปิดสถานบริการ.',
                'vi': 'Đối chiếu số đo tại cửa sổ với điều kiện cấp phép kinh doanh và quy chuẩn kỹ thuật.'
            },
            'rows': {
                'es': [
                    ('< 45 dBA', 'Calle residencial tranquila de noche, tráfico lejano', 'Nivel de fondo objetivo en zona mixta residencial tras las 23:00', 'badge-safe', 'Ambiente conforme'),
                    ('50 – 55 dBA', 'Murmullo de terraza, música de fondo en interior', 'Límite legal en fachada para locales comerciales en la mayoría de ciudades', 'badge-mild', 'Límite de licencia'),
                    ('60 – 70 dBA', 'Gritos de clientes en terraza, actuaciones en calle', 'Supera los límites nocturnos; provoca dificultad grave para conciliar el sueño', 'badge-moderate', 'Zona de infracción'),
                    ('72 – 85 dBA', 'Música en directo amplificada, altavoces exteriores, karaoke', 'Infracción grave de la licencia municipal; motivo de denuncia policial inmediata', 'badge-severe', 'Infracción grave'),
                    ('90+ dBA', 'Graves de discoteca descontrolados, aglomeraciones', 'Contaminación acústica extrema; justificación para clausura y precinto cautelar', 'badge-severe', 'Clausura cautelar')
                ],
                'de': [
                    ('< 45 dBA', 'Ruhige Wohnstraße nachts, entfernter Verkehr', 'Ziel-Hintergrundpegel in Mischgebieten nach 22:00 Uhr', 'badge-safe', 'Zulässig'),
                    ('50 – 55 dBA', 'Leises Terrassengespräch, Hintergrundmusik im Lokal', 'Gesetzlicher Immissionsrichtwert an der Fassade (TA Lärm)', 'badge-mild', 'Genehmigungsgrenze'),
                    ('60 – 70 dBA', 'Grölende Gäste auf Außenterrasse, Straßenmusiker', 'Überschreitet Nachtgrenzwerte deutlich; führt zu Schlafstörungen', 'badge-moderate', 'Erhebliche Belästigung'),
                    ('72 – 85 dBA', 'Verstärkte Live-Bands, Außen-Lautsprecher, laute Bässe', 'Klarer Verstoß gegen Gaststättenkonzession; Anlass für Ordnungsamteinsatz', 'badge-severe', 'Schwerer Verstoß'),
                    ('90+ dBA', 'Wummernde Subwoofer-Bässe, Club-Schlangen vor der Tür', 'Extreme Lärmimmission; Rechtfertigung für behördliche Betriebsuntersagung', 'badge-severe', 'Betriebsschließung')
                ],
                'fr': [
                    ('< 45 dBA', 'Rue calme la nuit, circulation lointaine', 'Niveau de fond nocturne visé pour les zones mixtes après 22h', 'badge-safe', 'Ambiance conforme'),
                    ('50 – 55 dBA', 'Brouhaha modéré de terrasse, fond sonore intérieur', 'Limite d’émergence sonore en limite de propriété commerciale', 'badge-mild', 'Seuil d’autorisation'),
                    ('60 – 70 dBA', 'Éclats de voix sous les fenêtres, artistes de rue sonorisés', 'Dépassement caractérisé des seuils nocturnes ; trouble du sommeil majeur', 'badge-moderate', 'Nuisance anormale'),
                    ('72 – 85 dBA', 'Concert amplifié, enceintes extérieures non autorisées', 'Violation directe de la licence de débit de boisson ; verbalisation de police', 'badge-severe', 'Infraction grave'),
                    ('90+ dBA', 'Vibrations de basses extrêmes, portes grandes ouvertes', 'Pollution sonore intolérable ; motif de fermeture administrative immédiate', 'badge-severe', 'Fermeture requise')
                ],
                'ja': [
                    ('< 45 dBA', '深夜の閑静な住宅街、遠方の微かな走行音', '第2種住居地域・近隣商業地域の深夜（23時以降）基準値', 'badge-safe', '法令適合環境'),
                    ('50 – 55 dBA', '小規模飲食店の室内BGM、テラス席の控えめな談笑', '敷地境界線上での深夜飲食店営業許可の法定上限値', 'badge-mild', '営業許可限界'),
                    ('60 – 70 dBA', 'テラス席での泥酔客の嬌声、路上ライブ、客待ち列', '受忍限度を10〜15dB超過；生活環境保全条例違反に該当', 'badge-moderate', '違法擾乱レベル'),
                    ('72 – 85 dBA', '外向け拡声器スピーカー、生バンド演奏、カラオケ音漏れ', '風営法および公害防止条例違反；警察出動および指導対象', 'badge-severe', '重大な法令違反'),
                    ('90+ dBA', '建具を震わせるサブウーファーの低音直撃、クラブ爆音', '極めて悪質な音響公害；営業停止命令および過料処分の根拠', 'badge-severe', '即時営業停止基準')
                ],
                'ko': [
                    ('< 45 dBA', '심야의 조용한 주택가 골목, 원거리 차량 주행음', '상업·주거 복합지역 야간(22시 이후) 소음 환경 기준선', 'badge-safe', '법적 적합 환경'),
                    ('50 – 55 dBA', '실내 배경음악, 테라스 손님들의 통상적 대화', '소음진동관리법상 사업장 부지경계선 야간 배출허용기준', 'badge-mild', '배출 기준 한도'),
                    ('60 – 70 dBA', '야외 테이블 술주정, 길거리 버스킹 앰프 소음', '야간 배출기준을 10~20dB 초과; 구청 환경과 행정처분 요건', 'badge-moderate', '초과 영업 소음'),
                    ('72 – 85 dBA', '외부 지향 스피커, 라이브 밴드, 클럽 우퍼 음압', '경범죄처벌법 인근소란 및 영업정지 요건; 112 즉시 출동 사유', 'badge-severe', '중대 행정처분 대상'),
                    ('90+ dBA', '창문 샷시를 흔드는 극저주파 베이스 폭음', '악성 소음 공해; 영업허가 취소 및 손해배상 청구 기준', 'badge-severe', '영업장 폐쇄 조치')
                ],
                'th': [
                    ('< 45 dBA', 'ถนนที่เงียบสงบในเวลากลางคืน การจราจรบางตา', 'ระดับเสียงพื้นหลังเป้าหมายสำหรับพื้นที่อยู่อาศัยหลัง 23:00 น.', 'badge-safe', 'ระดับปกติ'),
                    ('50 – 55 dBA', 'เสียงพูดคุยบริเวณระเบียง ดนตรีเบาๆ ในร้าน', 'เกณฑ์จำกัดตามกฎหมายริมแนวเขตที่ดินสำหรับสถานประกอบการ', 'badge-mild', 'ขีดจำกัดใบอนุญาต'),
                    ('60 – 70 dBA', 'เสียงลูกค้าส่งเสียงดังนอกร้าน การแสดงดนตรีริมถนน', 'เกินเกณฑ์ยามวิกาล ส่งผลให้ผู้พักอาศัยนอนไม่หลับอย่างรุนแรง', 'badge-moderate', 'ระดับรบกวน'),
                    ('72 – 85 dBA', 'ลำโพงเปิดเพลงเสียงดัง คอนเสิร์ตสด ดนตรีเสียงเบสหนัก', 'ละเมิดเงื่อนไขใบอนุญาตอย่างชัดเจน สามารถแจ้งตำรวจระงับเหตุได้', 'badge-severe', 'ละเมิดรุนแรง'),
                    ('90+ dBA', 'เสียงเบสสั่นสะเทือนกระจกหน้าต่าง คลับบาร์เปิดเพลงล้น', 'มลพิษทางเสียงขั้นร้ายแรง มีมูลเหตุให้สั่งปิดสถานบริการชั่วคราว', 'badge-severe', 'สั่งปิดสถานประกอบการ')
                ],
                'vi': [
                    ('< 45 dBA', 'Đường phố đêm yên tĩnh, xe cộ từ xa', 'Mức ồn nền mục tiêu cho khu dân cư sau 22h đêm', 'badge-safe', 'Môi trường đạt chuẩn'),
                    ('50 – 55 dBA', 'Tiếng trò chuyện vừa phải, nhạc nền trong quán', 'Giới hạn tối đa tại ranh giới cơ sở kinh doanh theo quy định', 'badge-mild', 'Ngưỡng cho phép'),
                    ('60 – 70 dBA', 'Khách nhậu hò hét ngoài vỉa hè, hát rong loa kéo', 'Vượt quy chuẩn ban đêm từ 10–20 dB; gây ức chế tinh thần kéo dài', 'badge-moderate', 'Gây rối trật tự'),
                    ('72 – 85 dBA', 'Dàn loa công suất lớn hướng ra ngoài, quán bar dội âm', 'Vi phạm nghiêm trọng nghị định quản lý trật tự; công an xử phạt ngay', 'badge-severe', 'Vi phạm nghiêm trọng'),
                    ('90+ dBA', 'Âm trầm subwoofer cực mạnh làm rung cửa kính', 'Ô nhiễm tiếng ồn đặc biệt nghiêm trọng; đủ điều kiện đình chỉ hoạt động', 'badge-severe', 'Đình chỉ kinh doanh')
                ]
            }
        },
        'steps': {
            'title': {
                'es': 'Cómo documentar infracciones acústicas de locales comerciales',
                'de': 'In 4 Schritten gegen gewerblichen Lärm vorgehen',
                'fr': 'Comment documenter les infractions sonores d’un établissement',
                'ja': '店舗・飲食店騒音を確実に是正させる4ステップ証拠収集手順',
                'ko': '상가 및 주점의 소음 위반을 입증하는 4단계 단속 절차',
                'th': 'ขั้นตอนการรวบรวมหลักฐานเอาผิดสถานประกอบการใน 4 ขั้นตอน',
                'vi': 'Quy trình 4 bước thu thập chứng cứ tiếng ồn cơ sở kinh doanh'
            },
            'lead': {
                'es': 'Siga este procedimiento contrastado para exigir inspecciones municipales y sanciones firmes.',
                'de': 'Verbindliche Schritte, um Gewerbeaufsicht und Polizei zum Handeln zu bewegen.',
                'fr': 'La méthodologie requise pour obtenir un contrôle municipal et des astreintes administratives.',
                'ja': '保健所や生活安全課、警察が指導・摘発に動くための法定要件に即した手順です。',
                'ko': '구청 환경위생과와 경찰이 현장 조사 및 영업정지 행정처분에 착수하도록 만드는 표준 절차입니다.',
                'th': 'ขั้นตอนที่ถูกต้องเพื่อให้เจ้าหน้าที่เทศกิจและตำรวจสามารถออกใบสั่งและดำเนินคดีได้.',
                'vi': 'Quy chuẩn cần thiết để cơ quan quản lý đô thị và công an tiến hành xử phạt và cưỡng chế.'
            },
            'items': {
                'es': [
                    ('1', '⏱️', 'Medir el LAeq durante 15 minutos', 'Las ordenanzas exigen el nivel sonoro continuo equivalente. Registre un bloque de 15 minutos que refleje fielmente la exposición real.'),
                    ('2', '📉', 'Aislar los graves mediante FFT', 'Active el análisis de espectro en 1/3 de octava para demostrar la presencia de vibraciones mecánicas y frecuencias graves (31.5 a 125 Hz).'),
                    ('3', '📸', 'Fotografiar la terraza con marca de agua', 'Capture imágenes de los altavoces exteriores, mesas ocupadas en la vía pública o colas con la lectura de dB y la hora estampadas.'),
                    ('4', '📑', 'Remitir el informe a la autoridad competente', 'Exporte el dosier PDF con firma digital y preséntelo ante el área de medio ambiente y policía local para exigir un sonómetro oficial.')
                ],
                'de': [
                    ('1', '⏱️', '15-Minuten-LAeq erfassen', 'Ordnungsämter verlangen den äquivalenten Dauerschallpegel. Zeichnen Sie repräsentative 15-Minuten-Blöcke der Lärmbelastung auf.'),
                    ('2', '📉', 'Tieffrequente Bässe isolieren', 'Nutzen Sie die 1/3-Oktav-FFT, um wummernde Bassfrequenzen von 31,5 bis 125 Hz als unzulässige Schwingungen nachzuweisen.'),
                    ('3', '📸', 'Außengastronomie mit Fotostempel belegen', 'Fotografieren Sie überfüllte Terrassen und Außenboxen mit direkt im Foto verankertem dB-Wert und Zeitstempel.'),
                    ('4', '📑', 'Behördendossier einreichen', 'Erstellen Sie ein manipulationssicheres PDF-Lärmgutachten für Gewerbeaufsicht, Ordnungsamt oder Polizei.')
                ],
                'fr': [
                    ('1', '⏱️', 'Mesurer le LAeq sur 15 minutes', 'Les normes environnementales requièrent un niveau continu équivalent. Enregistrez un cycle de 15 minutes représentatif.'),
                    ('2', '📉', 'Analyser les émergences de basses', 'Enclenchez le spectre 1/3 d’octave pour isoler l’impact des caissons de basse de 31,5 à 125 Hz.'),
                    ('3', '📸', 'Prendre des photos d’exploitation probatoires', 'Clichés horodatés des enceintes en façade, terrasses débordantes et attroupements nocturnes avec mesure de dB incrustée.'),
                    ('4', '📑', 'Transmettre le dossier d’infraction', 'Remettez le rapport d’audit PDF certifié au service hygiène et santé environnementale de la mairie pour mise en demeure.')
                ],
                'ja': [
                    ('1', '⏱️', '法定15分間LAeq（等価騒音レベル）を測定', '行政の騒音測定基準に合わせ、15分間の等価連続音圧レベルを連続計測して客観的な平均暴露値を確定します。'),
                    ('2', '📉', '1/3オクターブFFTで重低音・共振を分離', '壁をすり抜ける31.5〜125Hzの重低音ビートを周波数別に単離し、一般的な騒音と異なる悪質な振動音であることを立証。'),
                    ('3', '📸', '外売り席・スピーカーを数値入り写真で記録', '店頭スピーカー、歩道にせり出したテラス席、深夜の行列をリアルタイムdBAとGPS付き写真で撮影し証拠化。'),
                    ('4', '📑', '警察・自治体生活環境窓口へ監査レポート提出', '改ざん防止ハッシュ付きのPDF証拠書類を印刷し、自治体の環境対策課および警察署へ提出して現地立ち入り調査を要求。')
                ],
                'ko': [
                    ('1', '⏱️', '법정 15분 등가소음도(LAeq) 연속 측정', '행정처분 기준에 부합하도록 15분간의 등가소음도를 측정하여 일시적 잡음이 아닌 지속적 위반임을 객관화합니다.'),
                    ('2', '📉', '1/3 옥타브 FFT로 저주파 쿵쿵거림 분리', '벽을 뚫고 들어오는 31.5~125Hz 대역의 베이스 비트를 분리하여 인체에 유해한 진동 소음임을 과학적으로 증명합니다.'),
                    ('3', '📸', '불법 테라스 및 외부 스피커 현장 채증', '도로를 점용한 야외 테이블, 매장 밖 확성기, 심야 손님 행렬을 실시간 데시벨 및 위치 좌표와 함께 사진으로 각인합니다.'),
                    ('4', '📑', '지자체 환경위생과 및 관할 지구대 제출', '무결성 해시가 포함된 공인 양식의 PDF 리포트를 민원 창구에 접수하여 영업장 현장 측정 및 개선명령을 이끌어냅니다.')
                ],
                'th': [
                    ('1', '⏱️', 'วัดค่า LAeq ต่อเนื่อง 15 นาที', 'ข้อกำหนดตามกฎหมายต้องใช้ระดับเสียงต่อเนื่องเทียบเท่า บันทึกช่วงเวลา 15 นาทีเพื่อแสดงระดับเสียงที่แท้จริง.'),
                    ('2', '📉', 'แยกความถี่ต่ำเสียงเบสด้วย FFT', 'ใช้ระบบ 1/3-octave เพื่อพิสูจน์การมีอยู่ของเสียงกระแทกย่านเบส 31.5 ถึง 125 Hz ที่ทะลุผ่านผนังเข้ามา.'),
                    ('3', '📸', 'ถ่ายรูปพื้นที่ร้านพร้อมประทับค่าเสียง', 'บันทึกลำโพงนอกร้าน โต๊ะที่ล้นออกมาบนทางเท้า หรือฝูงชน พร้อมประทับค่า dB และเวลาอย่างชัดเจน.'),
                    ('4', '📑', 'ยื่นรายงานต่อเจ้าหน้าที่เทศบาลและตำรวจ', 'ส่งออกเอกสารสรุป PDF เพื่อยื่นต่อสำนักงานเขต เทศบาล หรือสถานีตำรวจในพื้นที่เพื่อเข้าตรวจสอบทันที.')
                ],
                'vi': [
                    ('1', '⏱️', 'Đo mức âm tương đương LAeq trong 15 phút', 'Quy chuẩn môi trường yêu cầu mức âm liên tục tương đương. Thực hiện phiên đo 15 phút đại diện cho thời điểm ồn nhất.'),
                    ('2', '📉', 'Tách dải tần âm trầm bằng FFT', 'Sử dụng phân tích 1/3-octave để chứng minh tiếng đập bass tần số thấp (31.5 đến 125 Hz) rung động qua tường.'),
                    ('3', '📸', 'Chụp ảnh quán vi phạm có đóng dấu số liệu', 'Ghi hình loa đặt ngoài cửa, bàn ghế lấn chiếm vỉa hè hoặc đám đông kèm chỉ số dB và tọa độ GPS thực tế.'),
                    ('4', '📑', 'Nộp hồ sơ cho cơ quan chức năng kiểm tra', 'Xuất báo cáo PDF hoàn chỉnh gửi Ủy ban Nhân dân và Công an phường để yêu cầu kiểm tra và lập biên bản xử phạt.')
                ]
            }
        },
        'features': {
            'title': {
                'es': 'Herramientas de precisión para inspección de locales comerciales',
                'de': 'Präzisionswerkzeuge für Gewerbe- & Gastronomielärm',
                'fr': 'Outils d’investigation acoustique pour nuisances commerciales',
                'ja': '商業施設・飲食店騒音に特化した高精度測定エンジン',
                'ko': '상업 시설 및 유흥업소 소음 단속 특화 측정 기능',
                'th': 'เครื่องมือความแม่นยำสูงสำหรับการตรวจวัดเสียงสถานประกอบการ',
                'vi': 'Bộ công cụ phân tích âm học chuyên sâu cho khu thương mại'
            },
            'lead': {
                'es': 'Diseñado para cumplir con los requerimientos técnicos de policía local y departamentos de medio ambiente.',
                'de': 'Erfüllt die formalen Anforderungen von Gewerbeaufsicht, Ordnungsamt und Polizei.',
                'fr': 'Conforme aux protocoles d’évaluation des services municipaux de salubrité publique.',
                'ja': '警察の生活安全課や自治体の公害担当部署が即座に受領できる技術仕様を網羅しています。',
                'ko': '구청 환경지도과와 경찰청의 공식 조사 기준에 완벽하게 부합하도록 설계되었습니다.',
                'th': 'ออกแบบมาเพื่อให้สอดคล้องกับข้อกำหนดทางเทคนิคที่เจ้าหน้าที่รัฐต้องการ.',
                'vi': 'Được tối ưu để đáp ứng đầy đủ yêu cầu kỹ thuật của cơ quan thanh tra môi trường.'
            },
            'items': {
                'es': [
                    ('⏱️', 'Cálculo de LAeq en tiempo real', 'Promedia la energía sonora acumulada en ventanas de 5, 10 o 15 minutos conforme a los criterios de medición de actividades recreativas.'),
                    ('📉', 'Espectro FFT de 1/3 de octava', 'Identifica picos en frecuencias graves producidos por equipos de sonido, extractores industriales y equipos de climatización.'),
                    ('📸', 'Cámara con sellado de tiempo y GPS', 'Incrusta valores medidos, dirección estimada y sello horario en la fotografía para demostrar la relación causal con el local.'),
                    ('📊', 'Comparativa día vs. noche', 'Contrasta automáticamente los valores medidos frente a los límites permitidos para horario nocturno (23:00 a 07:00).'),
                    ('📑', 'Expediente listo para sanción administrativa', 'Genera informes en PDF con tablas de exceedance y gráficos para iniciar expedientes sancionadores y de revisión de licencias.'),
                    ('🔒', 'Procesamiento en dispositivo sin nube', 'Garantiza la confidencialidad de sus grabaciones y mediciones, almacenadas únicamente en su navegador.')
                ],
                'de': [
                    ('⏱️', 'Echtzeit-LAeq-Berechnung', 'Ermittelt den energieäquivalenten Dauerschallpegel über 5, 10 oder 15 Minuten gemäß TA Lärm und Gaststättenverordnungen.'),
                    ('📉', '1/3-Oktav-Frequenzanalyse', 'Lokalisiert dröhnende Bassfrequenzen von Musikanlagen, Lüftungsanlagen und Industriekühlaggregaten punktgenau.'),
                    ('📸', 'Fotokamera mit GPS- & Pegelstempel', 'Bettet Dezibelwert, Uhrzeit und GPS-Ort fest in das Foto ein, um den Lärmverursacher zweifelsfrei zuzuordnen.'),
                    ('📊', 'Tag-/Nacht-Vergleichsautomatik', 'Gleicht Messwerte automatisch mit den strengeren Grenzwerten der Nachtruhe (ab 22:00 Uhr) ab.'),
                    ('📑', 'Verwaltungsfestes PDF-Dossier', 'Exportiert vollständige Audit-Berichte zur Vorlage bei Ordnungsbehörden für Bußgeld- und Untersagungsverfahren.'),
                    ('🔒', 'Vollständig lokale Speicherung', 'Messdaten verbleiben absolut vertraulich im Browser des Nutzers ohne unautorisierte Serverübertragung.')
                ],
                'fr': [
                    ('⏱️', 'Calcul automatique du LAeq', 'Calcule le niveau équivalent sur 5, 10 ou 15 minutes conformément aux règles d’émergence spectrale en vigueur.'),
                    ('📉', 'Spectre FFT 1/3 d’octave', 'Détecte les résonances graves générées par les systèmes de sonorisation, hottes d’extraction et groupes froids.'),
                    ('📸', 'Appareil photo probatoire horodaté', 'Intègre dBA, coordonnées GPS et heure exacte sur les clichés pour prouver l’origine de la nuisance.'),
                    ('📊', 'Comparateur Jour/Nuit intégré', 'Compare directement les mesures aux seuils restrictifs applicables durant la période nocturne.'),
                    ('📑', 'Dossier de mise en demeure PDF', 'Génère un document formel avec courbes d’exposition pour appuyer vos démarches en mairie ou en préfecture.'),
                    ('🔒', 'Stockage local confidentiel', 'Vos données d’enquête restent sous votre contrôle exclusif dans l’IndexedDB de votre navigateur.')
                ],
                'ja': [
                    ('⏱️', 'リアルタイム等価騒音レベル（LAeq）演算', '環境省測定マニュアルに準拠し、5分・10分・15分間の時間積分平均値をリアルタイムで自動計算。'),
                    ('📉', '1/3オクターブ高解像度周波数分析', '音響機器のウーファー、大型排気ファン、室外機コンプレッサーによる低周波共振をピンポイント特定。'),
                    ('📸', 'GPS＆数値焼き込み証拠カメラ', '撮影時刻、実測dBA、位置情報を写真内に不可逆スタンプとして合成。店舗の違法営業の現行犯的証拠に。'),
                    ('📊', '昼夜法令基準自動照合機能', '昼間（〜22時）と深夜（22時以降）の異なる受忍限度基準を自動判別し、超過幅をビジュアル表示。'),
                    ('📑', '行政指導・摘発申立用PDF出力', '環境対策課や警察署へそのまま提出できる形式で、測定条件・グラフ・改ざん防止ハッシュを1枚に凝縮。'),
                    ('🔒', '安全な端末内ローカル処理', '騒音データや写真は外部サーバーへ送信されず、手元のブラウザ内でのみ厳重に保護されます。')
                ],
                'ko': [
                    ('⏱️', '실시간 15분 LAeq(등가소음도) 연산 엔진', '환경부 소음공정시험기준에 준하여 5분, 10분, 15분 단위의 등가소음도를 오차 없이 자동 산출합니다.'),
                    ('📉', '1/3 옥타브 실시간 주파수 분석', '음향 장비의 서브우퍼 저음, 주방 대형 환풍기, 실외기 압축기에서 발생하는 저주파 진동을 정밀 포착합니다.'),
                    ('📸', 'GPS 및 측정치 각인 현장 채증 카메라', '촬영 시점의 dBA 수치, GPS 정밀 좌표, ISO 타임스탬프를 사진에 워터마크로 영구 기록합니다.'),
                    ('📊', '주·야간 규제 기준 자동 대조표', '주간과 심야(22:00 이후)의 소음 배출허용기준을 자동 비교하여 초과 데시벨을 명확하게 표시합니다.'),
                    ('📑', '지자체 과태료·행정처분용 PDF 리포트', '시·구청 환경지도과와 경찰에 제출하여 과태료 부과 및 영업정지를 청구할 수 있는 표준 서식입니다.'),
                    ('🔒', '브라우저 단독 로컬 저장 및 개인정보 보호', '모든 소음 데이터와 채증 사진은 사용자 단말기 내부에만 저장되어 프라이버시가 철저히 보호됩니다.')
                ],
                'th': [
                    ('⏱️', 'คำนวณค่า LAeq แบบเรียลไทม์', 'เฉลี่ยพลังงานเสียงในช่วง 5, 10 หรือ 15 นาทีตามเกณฑ์มาตรฐานทางกฎหมาย.'),
                    ('📉', 'วิเคราะห์สเปกตรัมความถี่ 1/3-octave', 'ระบุเสียงเบสจากเครื่องเสียง พัดลมดูดควันอุตสาหกรรม และคอมเพรสเซอร์แอร์ได้อย่างแม่นยำ.'),
                    ('📸', 'กล้องประทับพิกัด GPS และเวลา', 'ฝังค่าเสียง วันที่ เวลา และพิกัดลงในภาพถ่ายเพื่อใช้เป็นหลักฐานเชื่อมโยงไปยังร้านต้นเหตุ.'),
                    ('📊', 'เปรียบเทียบเกณฑ์กลางวันและกลางคืน', 'เปรียบเทียบค่าที่วัดได้กับเกณฑ์จำกัดเสียงยามค่ำคืนที่เข้มงวดกว่าโดยอัตโนมัติ.'),
                    ('📑', 'รายงาน PDF พร้อมยื่นสั่งปรับ', 'สร้างเอกสารสรุปที่มีกราฟและตารางการละเมิดเพื่อนำไปยื่นต่อเจ้าหน้าที่ท้องถิ่นเพื่อบังคับใช้กฎหมาย.'),
                    ('🔒', 'ประมวลผลในเครื่อง ปลอดภัยสูงสุด', 'ข้อมูลการตรวจวัดและภาพถ่ายทั้งหมดจะถูกเก็บไว้ในเบราว์เซอร์ของคุณ ไม่ส่งออกภายนอก.')
                ],
                'vi': [
                    ('⏱️', 'Tính toán LAeq theo thời gian thực', 'Tự động tính mức âm tương đương tích lũy trong 5, 10 hoặc 15 phút theo đúng quy chuẩn đo đạc môi trường.'),
                    ('📉', 'Phân tích dải tần 1/3-octave', 'Xác định chính xác tiếng dội bass từ dàn loa, hệ thống hút mùi công nghiệp và máy làm mát của quán.'),
                    ('📸', 'Máy ảnh đóng dấu tọa độ và thông số', 'In thẳng chỉ số dBA, thời gian thực và vị trí GPS lên bức ảnh để chứng minh nguồn phát tiếng ồn.'),
                    ('📊', 'Tự động đối chiếu quy chuẩn ngày/đêm', 'Tự động so sánh số đo với ngưỡng giới hạn nghiêm ngặt áp dụng trong khung giờ ban đêm.'),
                    ('📑', 'Hồ sơ PDF phục vụ xử phạt hành chính', 'Xuất báo cáo kỹ thuật hoàn chỉnh để gửi cơ quan quản lý đô thị lập biên bản xử phạt cơ sở vi phạm.'),
                    ('🔒', 'Xử lý dữ liệu cục bộ an toàn', 'Dữ liệu đo đạc và hình ảnh được bảo mật hoàn toàn trong trình duyệt của bạn, không lo rò rỉ.')
                ]
            }
        },
        'rules': {
            'title': {
                'es': 'Reglas clave para que su denuncia contra un local prospere',
                'de': 'Erfolgsregeln für Beschwerden gegen Gewerbelärm',
                'fr': 'Règles décisives pour faire sanctionner un établissement',
                'ja': '店舗・飲食店への騒音通報を確実に通すための3大鉄則',
                'ko': '상가 소음 민원을 확실하게 해결하기 위한 4대 입증 수칙',
                'th': 'หลักการสำคัญในการร้องเรียนสถานประกอบการให้ได้ผล',
                'vi': 'Các quy tắc thiết yếu để xử lý triệt để tiếng ồn quán xá'
            },
            'lead': {
                'es': 'Los ayuntamientos descartan denuncias genéricas. Aplique estos criterios técnicos para forzar una inspección vinculante.',
                'de': 'Vermeiden Sie vage Beschwerden. Nutzen Sie diese Methodik für verbindliche behördliche Messungen.',
                'fr': 'Les mairies classent les signalements vagues. Suivez ces principes pour déclencher un contrôle contraignant.',
                'ja': '単に「うるさい」と電話するだけでは動きません。行政が現場立ち入りを行わざるを得ない証拠の出し方です。',
                'ko': "단순 민원은 '주의 권고'로 종결되기 쉽습니다. 실질적인 과태료 및 영업정지 조치를 이끌어내는 방법입니다.",
                'th': 'เจ้าหน้าที่มักละเลยการแจ้งเหตุลอยๆ ใช้หลักการทางเทคนิคเหล่านี้เพื่อให้เกิดการตรวจสอบจริง.',
                'vi': 'Cơ quan chức năng sẽ không xử lý nếu thiếu căn cứ. Áp dụng các nguyên tắc này để yêu cầu xử phạt dứt điểm.'
            },
            'items': {
                'es': [
                    ('🏢', 'Regla 1: Mida en el linde de su propiedad o con ventana abierta', 'Las ordenanzas evalúan la inmisión en fachada o en el linde de la finca afectada. Coloque el terminal a 1 metro de la ventana abierta orientada al foco de ruido.'),
                    ('📉', 'Regla 2: Demuestre la componente tonal o de baja frecuencia', 'La música con graves causa una molestia desproporcionada. Use el ponderado dBC o el espectro FFT para justificar una penalización técnica de +3 a +5 dB.'),
                    ('📜', 'Regla 3: Verifique el horario autorizado de la licencia', 'Muchas terrazas deben cesar su actividad a las 23:00 o 00:00. Registre de forma inequívoca la hora exacta de funcionamiento fuera del horario permitido.'),
                    ('📑', 'Regla 4: Entregue un dosier unificado a medio ambiente y policía', 'Presente el informe PDF con los gráficos de 15 minutos en el registro municipal para que la policía local acuda con sonómetro homologado a sancionar.')
                ],
                'de': [
                    ('🏢', 'Regel 1: Am offenen Fenster oder an der Grundstücksgrenze messen', 'Behörden bewerten die Immission am maßgeblichen Immissionsort. Messen Sie ca. 1 Meter vor dem geöffneten Fenster in Richtung der Schallquelle.'),
                    ('📉', 'Regel 2: Tieffrequente Tonhaltigkeit gezielt nachweisen', 'Basswummern gilt rechtlich als besonders lästig. Mit dBC-Messungen oder FFT können Sie den Tonzuschlag von bis zu +6 dB rechtlich geltend machen.'),
                    ('📜', 'Regel 3: Sperrzeit und Terrassen-Schlusszeiten prüfen', 'Außengastronomie muss oft ab 22:00 Uhr geräumt sein. Dokumentieren Sie minutengenau jede Bewirtung nach Beginn der Sperrzeit.'),
                    ('📑', 'Regel 4: Formelles PDF-Dossier bei der Gewerbeaufsicht einreichen', 'Reichen Sie das vollständige PDF-Protokoll schriftlich ein. Dies zwingt das Ordnungsamt zur Durchführung amtlicher Kontrollmessungen.')
                ],
                'fr': [
                    ('🏢', 'Règle 1 : Mesurer fenêtre ouverte orientée vers la source', 'L’émergence s’évalue en limite de façade ou pièce exposée. Placez le smartphone à 1 mètre de l’ouverture orientée vers la terrasse ou les enceintes.'),
                    ('📉', 'Règle 2 : Mettre en évidence la tonalité marquée des basses', 'Les basses fréquences subissent une pénalité réglementaire. Démontrez par FFT que le spectre est dominé par des pics résonants pour aggraver le constat.'),
                    ('📜', 'Règle 3 : Relever l’heure de fin d’autorisation de terrasse', 'Les autorisations d’occupation du domaine public fixent une heure limite stricte. Notez précisément toute activité constatée au-delà.'),
                    ('📑', 'Règle 4 : Déposer un dossier d’infraction structuré en mairie', 'Transmettez le rapport d’audit PDF aux services municipaux compétents pour déclencher une visite de police avec sonomètre homologué.')
                ],
                'ja': [
                    ('🏢', '鉄則1：敷地境界線上、または音源に面した開放窓から1mで計測する', '条例の評価基準は「受音点（被害者側）」です。道路に面した窓を開け、そこから1m離れた位置で測ることで法的な信憑性が確立します。'),
                    ('📉', '鉄則2：重低音の「卓越周波数成分」をFFTで可視化して提示する', '低周波の重低音は「特に有害な不快音」として条例上で補正値（+3〜5dB）が加算されます。FFTグラフでピークを明確に示すのが有効です。'),
                    ('📜', '鉄則3：自治体の深夜酒類提供・テラス席制限時間とのズレを突く', '多くの自治体でテラス席や路上営業は22時または23時までに制限されています。時間超過営業の決定的瞬間を時刻入りで記録します。'),
                    ('📑', '鉄則4：警察の生活安全課と自治体環境窓口へ同一PDFを同時提出する', '単独の通報ではなく、15分LAeqグラフが載った正式PDFを警察と行政に提出することで、双方が連携した是正指導・立ち入り検査が行われます。')
                ],
                'ko': [
                    ('🏢', '수칙 1: 피해 주택의 개방된 창문 또는 부지 경계선에서 측정하세요', '소음진동관리법상 평가 위치는 피해자 측의 경계면입니다. 소음원이 바라보이는 창문을 열고 1m 지점에서 측정해야 공식 효력을 갖습니다.'),
                    ('📉', '수칙 2: 우퍼 저음의 주파수 특성을 분리하여 증명하세요', '단순 dB보다 쿵쿵거리는 저주파 비트는 인체 피해가 큽니다. FFT 분석으로 125Hz 이하 대역의 돌출 피크를 제시하면 규제 적용이 엄격해집니다.'),
                    ('📜', '수칙 3: 지자체 옥외영업 허가 시간 위반을 결합하여 고발하세요', '대부분의 야외 테라스 영업은 심야(22:00~23:00) 이후 금지됩니다. 영업 허가 시간을 초과한 야외 영업 행위를 시계열로 기록하세요.'),
                    ('📑', '수칙 4: 구청 환경과 및 경찰서에 통일된 PDF 증거 서류를 접수하세요', '15분 LAeq 그래프가 포함된 공인 PDF 보고서를 첨부하여 민원을 넣으면 관할 공무원이 공인 계측기를 들고 현장 단속을 나오게 됩니다.')
                ],
                'th': [
                    ('🏢', 'กฎข้อที่ 1: วัดบริเวณริมหน้าต่างที่เปิดออกไปยังแหล่งกำเนิดเสียง', 'เกณฑ์ตามกฎหมายจะพิจารณาจากจุดรับเสียง วางอุปกรณ์ห่างจากหน้าต่างที่เปิดออกประมาณ 1 เมตร.'),
                    ('📉', 'กฎข้อที่ 2: แสดงองค์ประกอบความถี่ต่ำของเสียงเบส', 'เสียงเบสมีความน่ารำคาญสูง ใช้การวิเคราะห์ FFT เพื่อแสดงค่าพีคความถี่ต่ำ ซึ่งทำให้มีน้ำหนักทางกฎหมายมากขึ้น.'),
                    ('📜', 'กฎข้อที่ 3: ตรวจสอบเวลาปิดตามใบอนุญาตของร้าน', 'สถานประกอบการหลายแห่งต้องหยุดให้บริการภายนอกหลัง 23:00 น. บันทึกเวลาที่ร้านยังเปิดเกินเวลาที่กำหนด.'),
                    ('📑', 'กฎข้อที่ 4: ยื่นเอกสารสรุป PDF พร้อมกันทั้งเจ้าหน้าที่เทศบาลและตำรวจ', 'ยื่นรายงานที่มีกราฟ 15 นาที เพื่อให้เจ้าหน้าที่ต้องเข้าตรวจสอบและดำเนินการออกคำสั่งปรับอย่างเป็นทางการ.')
                ],
                'vi': [
                    ('🏢', 'Quy tắc 1: Đo tại vị trí cửa sổ mở hướng về phía quán', 'Quy chuẩn môi trường xác định độ ồn tại ranh giới người bị ảnh hưởng. Đặt điện thoại cách cửa sổ mở khoảng 1 mét.'),
                    ('📉', 'Quy tắc 2: Phân tích rõ tần số âm trầm của dàn âm thanh', 'Âm bass gây rung và ức chế nặng nề. Sử dụng biểu đồ FFT để chứng minh dải tần thấp chiếm ưu thế vượt chuẩn.'),
                    ('📜', 'Quy tắc 3: Ghi nhận vi phạm khung giờ kinh doanh ban đêm', 'Hầu hết các quán chỉ được mở nhạc công suất lớn đến 22h. Hãy ghi lại chính xác các vi phạm phát sinh sau giờ này.'),
                    ('📑', 'Quy tắc 4: Nộp hồ sơ PDF kỹ thuật cho Ủy ban và Công an', 'Nộp tập báo cáo có biểu đồ LAeq 15 phút để các cơ quan chức năng có đủ cơ sở tiến hành đo đạc chính thức và xử lý.')
                ]
            }
        },
        'faqs': {
            'es': [
                ("¿A qué nivel de decibelios pueden poner música los bares y locales?",
                 "La mayoría de ciudades limitan el ruido emitido hacia el exterior o en fachada residencial entre 50 y 55 dBA en horario diurno, y entre 40 y 45 dBA a partir de las 22:00 o 23:00 horas. En el interior del local los límites son mayores, pero la inmisión hacia viviendas contiguas está estrictamente regulada. Con SOUNDTEST.PRO puede contrastar su lectura con las ordenanzas municipales."),
                ("¿A quién debo acudir por música excesiva de un bar o discoteca?",
                 "En el momento del suceso, llame a la Policía Local para que efectúe una comprobación in situ. Para problemas crónicos, presente una reclamación formal ante el departamento de Medio Ambiente y Urbanismo del Ayuntamiento aportando su registro en PDF con lecturas continuadas y fotos selladas."),
                ("¿Puedo grabar desde mi ventana para denunciar el ruido de la calle?",
                 "Sí. Las mediciones acústicas y grabaciones realizadas desde su domicilio particular sin invadir la intimidad ajena son perfectamente legítimas como prueba documental y de apoyo. SOUNDTEST.PRO proporciona estimaciones con valor probatorio civil."),
                ("¿Existen límites más estrictos para los fines de semana?",
                 "Generalmente los fines de semana permiten una prolongación de 30 a 60 minutos en el horario de cierre de terrazas, pero los límites máximos de decibelios en fachada no aumentan. Las emisiones deben respetar el descanso vecinal independientemente del día.")
            ],
            'de': [
                ("Welche Dezibelgrenzen gelten für Bars und Gastronomiebetriebe?",
                 "Nach der TA Lärm und Gaststättenverordnungen gilt in Mischgebieten nachts ab 22:00 Uhr meist ein Immissionsgrenzwert von 45 dBA an der Fassade von Wohnungen, in reinen Wohngebieten sogar nur 35–40 dBA. Bässe dürfen im Raum nicht hörbar sein."),
                ("Wen kontaktiert man bei Ruhestörung durch Nachtlokale?",
                 "Bei akuter Ruhestörung in der Nacht ist die Polizei oder der kommunale Ordnungsdienst zuständig. Bei wiederkehrenden Verstößen sollten Sie eine formelle Beschwerde beim Gewerbe- oder Ordnungsamt einreichen und Ihr PDF-Lärmprotokoll beilegen."),
                ("Darf ich vom Fenster aus Aufnahmen machen?",
                 "Messungen und Dokumentationen aus den eigenen Wohnräumen zur Abwehr von Immissionen sind rechtlich zulässig. Personenbezogene Nahaufnahmen sollten vermieden werden; im Fokus stehen der Dezibelpegel und der Betriebsablauf."),
                ("Gelten am Wochenende andere Lärmgrenzwerte?",
                 "Nein. Zwar gibt es in vielen Städten verlängerte Öffnungszeiten am Wochenende, die zulässigen Schallpegelgrenzen zur Nachtruhe bleiben jedoch identisch und schützen das Ruhebedürfnis der Nachbarschaft.")
            ],
            'fr': [
                ("Quelle est la limite de décibels autorisée pour un bar ou un club ?",
                 "Les établissements diffusant de la musique amplifiée doivent respecter le décret relatif à la prévention des risques liés aux bruits. L’émergence sonore dans les logements voisins ne doit pas dépasser 3 dB la nuit. Les terrasses extérieures sont soumises aux arrêtés municipaux fixant la fermeture entre 22h et minuit."),
                ("Qui contacter en cas de nuisances sonores répétées d’un bar ?",
                 "Appelez la police municipale ou nationale pour constater l’infraction en direct. Ensuite, déposez un dossier auprès du service communal d’hygiène et de santé (SCHS) de la mairie en joignant votre rapport SOUNDTEST.PRO."),
                ("Est-il légal de mesurer le bruit depuis sa fenêtre ?",
                 "Tout à fait. Effectuer des mesures acoustiques depuis son espace privatif pour attester d’un trouble anormal de voisinage est un droit légitime. Ces données constituent un commencement de preuve solide."),
                ("Les règles changent-elles le week-end ?",
                 "Les horaires de fermeture peuvent bénéficier de dérogations d’une heure le week-end selon les communes, mais les règles régissant l’émergence sonore et le respect de la tranquillité publique demeurent inchangées.")
            ],
            'ja': [
                ("飲食店やバーは法律上何デシベルまで音を出して良いですか？",
                 "多くの自治体の公害防止条例では、深夜（23時〜翌6時）において住居が混在する地域での敷地境界線騒音基準を45〜50 dBA以下と定めています。これを超える音量や外向けスピーカーの使用は条例違反となります。"),
                ("近隣の居酒屋やクラブの騒音はどこに通報すべきですか？",
                 "深夜の現行の騒音については警察（110番または最寄りの警察署）へ通報して注意を要請します。常習的なトラブルの場合は、区役所・市役所の環境保全課および生活安全課へPDF証拠レポートを提出して正式な指導を求めます。"),
                ("自宅の窓辺から通りの騒音を測定・記録しても違法になりませんか？",
                 "自宅の敷地内・室内から公道や店舗の騒音状況を測定・記録することは、正当な権利行使であり何ら違法ではありません。SOUNDTEST.PROは改ざん防止ハッシュ付きで記録を保存できます。"),
                ("週末や休日は深夜騒音の規制が緩和されますか？",
                 "営業時間が週末に30分〜1時間延長される特例がある自治体もありますが、許容されるデシベル基準そのものは休日であっても緩和されません。近隣住民の健康を守る受忍限度基準は厳格に適用されます。")
            ],
            'ko': [
                ("주점 및 상업시설의 야간 음악 소음 허용 기준은 몇 데시벨인가요?",
                 "소음·진동관리법 규정상 상업·주거 혼합지역의 야간(22:00~06:00) 사업장 소음 배출허용기준은 50 dBA 이하, 주거지역은 45 dBA 이하입니다. 이를 초과하여 옥외로 음향을 송출하는 것은 과태료 부과 대상입니다."),
                ("상가 및 클럽의 심야 소음은 어디에 신고해야 가장 빠른가요?",
                 "야간 현장 조치는 112 경찰 신고를 통해 즉각적인 소음 중지 경고를 요청할 수 있으며, 상습적인 영업 행태는 시·군·구청 환경지도과에 PDF 측정 보고서를 첨부하여 정식 단속 민원을 접수해야 영업정지 처분이 내려집니다."),
                ("창가에서 외부 매장을 향해 측정 및 촬영하는 것이 법적으로 문제없나요?",
                 "자신의 주거지 내부에서 외부 소음 피해를 입증하기 위해 소음도를 측정하고 현장 상황을 촬영하는 것은 정당한 권리 행사로 인정됩니다."),
                ("금요일이나 주말 밤에는 소음 기준이 완화되나요?",
                 "영업 마감 시간이 다소 늦어질 수는 있으나, 주거지에 도달하는 법정 소음 배출기준치는 주말이라 해서 완화되지 않습니다. 심야 수면권 보장은 요일과 무관하게 법적으로 보호됩니다.")
            ],
            'th': [
                ("สถานบันเทิงและบาร์เปิดเพลงได้ดังสูงสุดกี่เดซิเบลตามกฎหมาย?",
                 "กฎหมายส่วนใหญ่กำหนดระดับเสียงรบกวนที่ส่งผลต่อชุมชนยามค่ำคืนไว้ไม่เกิน 45-50 dBA หากเป็นสถานบริการที่มีดนตรีสด ต้องมีระบบเก็บเสียงที่มิดชิดไม่ให้เสียงรั่วไหลออกมาภายนอก."),
                ("หากได้รับความเดือดร้อนจากเสียงผับบาร์ ควรแจ้งหน่วยงานใด?",
                 "ในขณะเกิดเหตุสามารถโทรแจ้งตำรวจเพื่อเข้าระงับเหตุได้ทันที สำหรับปัญหาเรื้อรัง ให้ยื่นหนังสือร้องเรียนต่อสำนักงานเขตหรือเทศบาลในพื้นที่พร้อมแนบรายงานสรุป PDF ของ SOUNDTEST.PRO."),
                ("สามารถอัดเสียงและวัดค่าเสียงจากหน้าต่างห้องตนเองได้หรือไม่?",
                 "สามารถทำได้ตามกฎหมาย การบันทึกหลักฐานความเดือดร้อนรำคาญจากในเคหสถานของตนเองถือเป็นการปกป้องสิทธิอันชอบธรรม."),
                ("วันหยุดสุดสัปดาห์มีข้อยกเว้นให้เปิดเพลงดังขึ้นได้หรือไม่?",
                 "อาจมีการอนุญาตให้เปิดบริการได้ดึกขึ้นในบางพื้นที่พิเศษ แต่ระดับเสียงที่รบกวนความสงบสุขของประชาชนยังคงอยู่ภายใต้เกณฑ์ควบคุมเช่นเดิม.")
            ],
            'vi': [
                ("Các quán bar, phòng trà được phép phát nhạc với âm lượng bao nhiêu?",
                 "Quy chuẩn môi trường quy định mức ồn tối đa tại khu vực dân cư từ 21h đêm đến 6h sáng là 45 dBA. Cơ sở kinh doanh dịch vụ karaoke, quán bar phải có biện pháp cách âm để không phát tán tiếng ồn vượt mức cho phép ra môi trường xung quanh."),
                ("Cần báo cho cơ quan nào khi bị quán bar gây ồn triền miên?",
                 "Khi tiếng ồn đang xảy ra, hãy báo ngay cho Công an phường để kiểm tra thực tế. Đối với tình trạng kéo dài, hãy nộp đơn phản ánh tới Ủy ban Nhân dân cấp xã/phường kèm theo hồ sơ đo đạc của SOUNDTEST.PRO."),
                ("Tôi có quyền đo và chụp ảnh quán gây ồn từ ban công nhà mình không?",
                 "Hoàn toàn được phép. Việc thu thập chứng cứ từ bên trong tư gia để chứng minh sự xâm hại đến cuộc sống sinh hoạt là hành vi tự bảo vệ quyền lợi hợp pháp."),
                ("Ngày cuối tuần quán có được phép mở nhạc to hơn không?",
                 "Quy định pháp luật không có ngoại lệ nới lỏng giới hạn âm lượng vào cuối tuần. Mọi cơ sở kinh doanh đều phải tôn trọng sự yên tĩnh và sức khỏe của cộng đồng dân cư.")
            ]
        },
        'cta_band': {
            'es': ('¿Harto del ruido de bares y terrazas bajo su ventana?',
                   'Documente infracciones con datos objetivos en 10 segundos directamente en su navegador. Sin aparatos caros ni descargas, 100% privado.'),
            'de': ('Genug vom Gastronomie- und Straßenlärm vor dem Fenster?',
                   'Dokumentieren Sie Grenzwertüberschreitungen in 10 Sekunden direkt im Browser. Keine teuren Messgeräte, kein Download, 100% datenschutzkonform.'),
            'fr': ('Exaspéré par les nuisances de terrasses et de bars ?',
                   'Constatez les dépassements en 10 secondes directement dans votre navigateur. Sans matériel onéreux ni téléchargement, 100% confidentiel.'),
            'ja': ('深夜の居酒屋や通りの騒音に、もう我慢する必要はありません。',
                   '専用測定器の購入もアプリのインストールも不要。ブラウザを開いて10秒で確実な証拠収集を開始。100%ローカル保存で安全。'),
            'ko': ('창밖 주점 소음과 유흥가 고성방가, 이제 확실한 데이터로 해결하세요',
                   '고가의 소음계나 앱 설치 없이 브라우저에서 10초 만에 법적 입증 자료를 측정할 수 있습니다. 100% 로컬 보안 보장.'),
            'th': ('หมดเวลาทนกับเสียงสถานบันเทิงและร้านเหล้าใต้ตึกของคุณแล้ว',
                   'บันทึกการละเมิดด้วยข้อมูลที่เป็นรูปธรรมใน 10 วินาทีผ่านเบราว์เซอร์ ไม่ต้องซื้อเครื่องมือวัดราคาแพง รักษาความเป็นส่วนตัว 100%.'),
            'vi': ('Chấm dứt sự tra tấn từ tiếng ồn quán bar dưới cửa sổ nhà bạn',
                   'Thu thập dữ liệu vi phạm chuẩn xác chỉ trong 10 giây ngay trên trình duyệt. Không cần mua thiết bị đắt tiền, bảo mật tuyệt đối.')
        }
    }
}

print("Scenario 2 (bar-street-disturbance) loaded.")
