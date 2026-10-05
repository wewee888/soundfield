# scripts/append_scenarios_data.py
import json

SCENARIOS_3_TO_6 = {
    'construction-noise-monitoring': {
        'img': 'construction_noise_evidence.webp',
        'img_alt': {
            'es': 'Auditoría de ruido de maquinaria de obra desde el linde con smartphone protegido',
            'de': 'Überprüfung von Baustellenlärm an der Grundstücksgrenze mit robustem Smartphone',
            'fr': 'Contrôle du bruit de machines de chantier depuis la limite de propriété avec smartphone',
            'ja': '工事現場の敷地境界線から頑丈なスマートフォンで建設重機騒音を測定する様子',
            'ko': '공사장 부지 경계선에서 스마트폰으로 중장비 소음과 진동을 실시간 계측하는 모습',
            'th': 'การตรวจวัดเสียงเครื่องจักรงานก่อสร้างจากแนวเขตพื้นที่ด้วยสมาร์ตโฟน',
            'vi': 'Kiểm tra tiếng ồn máy móc công trình xây dựng từ ranh giới bằng điện thoại'
        },
        'stats': {
            'es': [('86.5 dBA', 'Pico de demolición'), ('Modo A/C', 'Impacto + Graves'), ('Sello GPS', 'Linde de obra'), ('PDF + CSV', 'Exportación técnica')],
            'de': [('86,5 dBA', 'Abbruch-Spitzenwert'), ('A/C-Modus', 'Impuls + Bass'), ('GPS-Stempel', 'Baugrundstück'), ('PDF + CSV', 'Technischer Export')],
            'fr': [('86,5 dBA', 'Pic de démolition'), ('Mode A/C', 'Impacts + Graves'), ('Sceau GPS', 'Limite de chantier'), ('PDF + CSV', 'Export technique')],
            'ja': [('86.5 dBA', '解体・打撃ピーク'), ('A/C特性', '衝撃音＋重低音'), ('GPS刻印', '敷地境界線証明'), ('PDF+CSV', '技術データ出力')],
            'ko': [('86.5 dBA', '철거 타격 피크치'), ('A/C 모드', '충격음 및 진동'), ('GPS 각인', '공사장 경계 증빙'), ('PDF+CSV', '기술 데이터 출력')],
            'th': [('86.5 dBA', 'พีคเสียงทุบรื้อถอน'), ('โหมด A/C', 'เสียงกระแทก+เบส'), ('ประทับ GPS', 'แนวเขตสถานที่ก่อสร้าง'), ('PDF + CSV', 'ส่งออกข้อมูลทางเทคนิค')],
            'vi': [('86.5 dBA', 'Đỉnh tiếng đập phá'), ('Chế độ A/C', 'Va đập + Rung'), ('Dấu GPS', 'Ranh giới công trình'), ('PDF + CSV', 'Xuất dữ liệu kỹ thuật')]
        },
        'hero': {
            'es': {
                'eyebrow': 'Caso de uso · Monitorización de obras y reformas',
                'headline': 'Registre infracciones de obras y reformas con <em>contexto técnico indiscutible</em>.',
                'lead': 'No permita que martillos neumáticos a las 6 AM, demoliciones ilegales en fin de semana o maquinaria pesada sin apantallar arruinen su descanso. Capture inicio, picos y pausas con fotos de custodia, GPS, registros de superación y dosieres en PDF.'
            },
            'de': {
                'eyebrow': 'Anwendungsfall · Bau- &amp; Renovierungslärm',
                'headline': 'Dokumentieren Sie Baustellen-Verstöße mit <em>belastbaren Messdaten</em>.',
                'lead': 'Lassen Sie sich illegales Hämmern um 6 Uhr morgens, sonntäglichen Abrisslärm oder ungedämpfte Baumaschinen nicht gefallen. Erfassen Sie Beginn, Spitzenpegel und Ruhezeiten mit manipulationssicherem Fotostempel, GPS und technischem PDF-Report.'
            },
            'fr': {
                'eyebrow': 'Cas d’usage · Surveillance de chantiers et travaux',
                'headline': 'Enregistrez les infractions de chantier avec un <em>dossier technique incontestable</em>.',
                'lead': 'Ne laissez pas les marteaux-piqueurs à 6 heures du matin, les démolitions illégales le week-end ou les engins lourds détruire votre quotidien. Consignez le début, les pics et les temps de pause avec photos horodatées, coordonnées GPS et rapports PDF.'
            },
            'ja': {
                'eyebrow': '利用シーン · 工事・解体・リフォーム騒音監視',
                'headline': '違法な早朝工事や休日の解体作業を<em>決定的な技術データ</em>で立証。',
                'lead': '朝6時の削岩機、休日返上のコンクリート破砕、無防音シートの重機作業に耐え続ける必要はありません。作業開始時刻、最大騒音値（Lmax/L10）、GPS位置情報を写真とグラフで記録し、自治体の建築指導課へ提出。'
            },
            'ko': {
                'eyebrow': '활용 사례 · 공사 및 리모델링 소음 감시',
                'headline': '이른 아침의 불법 타격음과 주말 공사 위반을 <em>명백한 계측 데이터</em>로 고발하세요.',
                'lead': '새벽 6시부터 시작되는 브레이커 타격, 주말 무단 철거 공사, 방음벽 미설치 중장비 소음으로 고통받지 마세요. 작업 개시 시점, 최대 피크치, GPS 현장 좌표를 워터마크 사진과 타임라인 그래프로 완벽히 기록합니다.'
            },
            'th': {
                'eyebrow': 'กรณีการใช้งาน · งานก่อสร้าง ต่อเติม และทุบตึก',
                'headline': 'บันทึกการทำงานก่อสร้างที่ผิดกฎหมายด้วย<em>ข้อมูลทางเทคนิคที่โต้แย้งไม่ได้</em>.',
                'lead': 'อย่าปล่อยให้เสียงเจาะปูนตอน 6 โมงเช้า การทุบตึกในวันหยุด หรือเครื่องจักรขนาดใหญ่ทำลายสุขภาพของคุณ บันทึกเวลาเริ่มงาน พีคเสียงสูงสุด และช่วงเวลาทำงานนอกเวลาด้วยภาพถ่ายประทับค่าเสียง พิกัด GPS และรายงานสรุป PDF.'
            },
            'vi': {
                'eyebrow': 'Trường hợp sử dụng · Giám sát thi công &amp; sửa chữa',
                'headline': 'Ghi nhận các vi phạm thi công công trình với <em>căn cứ kỹ thuật rõ ràng</em>.',
                'lead': 'Đừng cam chịu tiếng máy khoan đục từ 6 giờ sáng, đập phá trái phép vào ngày nghỉ hoặc máy ủi không che chắn. Ghi lại thời điểm bắt đầu, đỉnh điểm vượt chuẩn và tọa độ GPS bằng hình ảnh đóng dấu số liệu và hồ sơ PDF.'
            }
        },
        'table': {
            'headers': {
                'es': ('Nivel medido', 'Maquinaria y fuente de obra', 'Normativa y límites permitidos', 'Acción recomendada'),
                'de': ('Gemessener Pegel', 'Baugerät & Lärmursache', 'Baulärm-Verordnung & Richtwerte', 'Handlungsempfehlung'),
                'fr': ('Niveau mesuré', 'Engin et source de chantier', 'Réglementation et horaires autorisés', 'Action recommandée'),
                'ja': ('実測値', '工事・解体機械の発生源', '公害防止法・作業制限基準', '推奨対応措置'),
                'ko': ('측정치', '공사 장비 및 소음원', '소음진동관리법 공사장 규제기준', '권장 조치 단계'),
                'th': ('ระดับที่วัดได้', 'เครื่องจักรก่อสร้างและแหล่งกำเนิด', 'เกณฑ์ตามกฎหมายและเวลาที่อนุญาต', 'การดำเนินการที่แนะนำ'),
                'vi': ('Mức đo được', 'Thiết bị & máy móc thi công', 'Quy chuẩn kỹ thuật & giờ cho phép', 'Hành động khuyến nghị')
            },
            'title': {
                'es': 'Límites de decibelios y restricciones horarias para obras',
                'de': 'Richtwerte und Ruhezeiten für Baulärm',
                'fr': 'Seuils acoustiques et plages horaires autorisées pour chantiers',
                'ja': '建設作業・解体工事の特定建設作業法定基準値対照表',
                'ko': '공사장 소음 배출허용기준 및 작업 시간제한 기준표',
                'th': 'เกณฑ์จำกัดระดับเสียงและเวลาที่อนุญาตสำหรับงานก่อสร้าง',
                'vi': 'Bảng giới hạn tiếng ồn và khung giờ thi công cho phép'
            },
            'lead': {
                'es': 'Compare sus mediciones con las ordenanzas municipales sobre horarios y límites en linde de parcela.',
                'de': 'Vergleichen Sie Ihre Messwerte mit der AVV Baulärm und kommunalen Arbeitszeitbeschränkungen.',
                'fr': 'Comparez vos relevés aux arrêtés préfectoraux régissant les bruits de chantier et de bricolage lourd.',
                'ja': '特定建設作業に適用される法定限度（85dB等）および日曜日・休日の作業制限と実測値を比較できます。',
                'ko': '주거지역 인근 공사장에 적용되는 법정 기준치(주간 65~70 dBA) 및 휴일 작업 제한 규정과 비교하세요.',
                'th': 'เปรียบเทียบค่าที่วัดได้กับข้อกำหนดทางกฎหมายเกี่ยวกับการทำงานก่อสร้างในเขตชุมชน.',
                'vi': 'Đối chiếu mức đo với quy chuẩn kỹ thuật quốc gia về tiếng ồn tại khu vực công trường xây dựng.'
            },
            'rows': {
                'es': [
                    ('< 50 dBA', 'Fase inactiva, herramientas manuales, descanso', 'Límite de fondo exigible durante noches y festivos', 'badge-safe', 'Límite nocturno'),
                    ('65 – 70 dBA', 'Hormigoneras, andamios, pequeña maquinaria', 'Límite legal estándar en linde durante jornada diurna permitida', 'badge-mild', 'Diurno autorizado'),
                    ('75 – 82 dBA', 'Miniexcavadoras, corte de azulejos, radiales', 'Nivel máximo en zonas urbanas; requiere pantallas acústicas', 'badge-moderate', 'Máximo admisible'),
                    ('85 – 92 dBA', 'Martillo neumático, corte de hormigón, perforadoras', 'Infracción grave si se realiza fuera de horario o sin aviso formal', 'badge-severe', 'Infracción horaria'),
                    ('95+ dBA', 'Hincado de pilotes, cizallas pesadas, voladuras', 'Riesgo estructural y auditivo; requiere permiso especial y aviso vecinal', 'badge-severe', 'Orden de parada')
                ],
                'de': [
                    ('< 50 dBA', 'Ruhender Bauplatz, Handwerkzeuge, Pausenzeit', 'Zulässiger Höchstwert während Nacht- und Sonntagsruhe', 'badge-safe', 'Ruhezeit-Ziel'),
                    ('65 – 70 dBA', 'Betonmischer, Gerüstbau, leichte Aggregate', 'Zulässiger Tageswert an der Grundstücksgrenze im Wohngebiet', 'badge-mild', 'Tagsüber zulässig'),
                    ('75 – 82 dBA', 'Minibagger, Steinsägen, Trennschleifer', 'Oberer Tagesgrenzwert; erfordert mobilen Schallschutz', 'badge-moderate', 'Schallschutz nötig'),
                    ('85 – 92 dBA', 'Presslufthammer, Betonmeißel, Rammarbeiten', 'Unzulässig vor 07:00 Uhr und am Wochenende; Inspektionsgrund', 'badge-severe', 'Unzulässig außerh.'),
                    ('95+ dBA', 'Hydraulikmeißel, schwere Rammen, Sprengung', 'Gefahr von Bauschäden und Gehörschäden; Baustopp-Niveau', 'badge-severe', 'Sofortiger Baustopp')
                ],
                'fr': [
                    ('< 50 dBA', 'Chantier à l’arrêt, outillage à main silencieux', 'Niveau maximal toléré durant les nuits et les dimanches', 'badge-safe', 'Objectif repos'),
                    ('65 – 70 dBA', 'Bétonnières, montage d’échafaudages, petits compresseurs', 'Limite diurne légale en limite de zone résidentielle', 'badge-mild', 'Diurne toléré'),
                    ('75 – 82 dBA', 'Mini-pelles, scies à carrelage, disqueuses', 'Seuil haut autorisé ; impose des bâches acoustiques', 'badge-moderate', 'Écrans requis'),
                    ('85 – 92 dBA', 'Marteaux-piqueurs, brise-roches, perforateurs', 'Illégal tôt le matin ou le week-end ; constat d’infraction immédiat', 'badge-severe', 'Infraction d’horaire'),
                    ('95+ dBA', 'Palplanches, cisailles industrielles de démolition', 'Risque vibratoire et auditif majeur ; motif d’arrêt de chantier', 'badge-severe', 'Arrêt de chantier')
                ],
                'ja': [
                    ('< 50 dBA', '作業休止中、手工具による軽作業、昼休み', '特定建設作業が禁止される夜間・休日の環境基準値', 'badge-safe', '休日・夜間基準'),
                    ('65 – 70 dBA', '小型コンクリートミキサー、足場組立、運搬作業', '住宅地における昼間の法定受忍限度・作業境界値', 'badge-mild', '昼間通常基準'),
                    ('75 – 82 dBA', '小型ユンボ、タイル切断サンダー、インパクトドライバー', '住宅街での上限領域；防音パネル・シートの設置が義務', 'badge-moderate', '防音対策義務域'),
                    ('85 – 92 dBA', 'コンクリート削岩機、エアーブレーカー、油圧圧砕機', '法定制限（85dB）超過；早朝・休日の施工は直ちに作業停止指導', 'badge-severe', '法定基準超過'),
                    ('95+ dBA', '杭打ち機、大型油圧ブレーカー、爆破解体', '建物躯体損傷および難聴リスク；特別許可および事前住民説明が必須', 'badge-severe', '即時作業中止レベル')
                ],
                'ko': [
                    ('< 50 dBA', '공사 일시 중단, 수공구 경작업, 점심시간', '야간 및 공휴일에 유지되어야 하는 주거지역 암소음선', 'badge-safe', '휴일·심야 기준'),
                    ('65 – 70 dBA', '레미콘 타설, 비계 조립, 소형 발전기 가동', '소음진동관리법상 주거지역 주간 공사장 배출허용기준(65 dBA)', 'badge-mild', '주간 허용 상한'),
                    ('75 – 82 dBA', '미니 굴착기, 석재 절단기, 전동 해머', '특정공사 사전신고 기준 초과; 이동식 방음벽 설치 의무', 'badge-moderate', '방음벽 설치 필요'),
                    ('85 – 92 dBA', '유압 브레이커 타격, 콘크리트 파쇄, 항타기', '조기 착공(07시 이전) 및 주말 작업 위반 시 과태료 및 조치명령', 'badge-severe', '조업정지 대상'),
                    ('95+ dBA', '대형 항타항발기, 중장비 철거 파쇄, 다짐 공사', '심각한 구조물 균열 위험 및 청력 손상; 즉각적 공사 중지 요건', 'badge-severe', '즉시 공사 중지')
                ],
                'th': [
                    ('< 50 dBA', 'ช่วงพักงาน เครื่องมือช่างทั่วไปที่ไม่มีเสียงดัง', 'ระดับเสียงสูงสุดที่ยอมรับได้ในเวลากลางคืนและวันหยุด', 'badge-safe', 'ระดับพักผ่อน'),
                    ('65 – 70 dBA', 'รถผสมปูน การประกอบนั่งร้าน เครื่องกำเนิดไฟฟ้าเล็ก', 'เกณฑ์จำกัดเสียงตามกฎหมายบริเวณแนวเขตที่ดินเวลากลางวัน', 'badge-mild', 'อนุญาตเวลากลางวัน'),
                    ('75 – 82 dBA', 'รถแบ็กโฮขนาดเล็ก เครื่องตัดกระเบื้อง เลื่อยวงเดือน', 'ขีดจำกัดสูงสุดในเขตชุมชน ต้องมีแผงกั้นเสียงโดยรอบ', 'badge-moderate', 'ต้องมีแผงกันเสียง'),
                    ('85 – 92 dBA', 'เครื่องเจาะคอนกรีต สว่านกระแทกขนาดใหญ่', 'ผิดกฎหมายอย่างร้ายแรงหากทำก่อนเวลาที่กำหนดหรือในวันหยุด', 'badge-severe', 'ฝ่าฝืนเวลาทำงาน'),
                    ('95+ dBA', 'เครื่องตอกเสาเข็ม เครื่องบดทำลายอาคาร', 'อันตรายต่อโครงสร้างบ้านใกล้เรือนเคียง สั่งระงับการทำงานได้ทันที', 'badge-severe', 'สั่งหยุดงานทันที')
                ],
                'vi': [
                    ('< 50 dBA', 'Công trường tạm nghỉ, đồ nghề thủ công nhỏ', 'Ngưỡng âm thanh tối đa cho phép ban đêm và ngày nghỉ lễ', 'badge-safe', 'Mục tiêu ban đêm'),
                    ('65 – 70 dBA', 'Xe trộn bê tông, lắp dựng giàn giáo, máy phát nhỏ', 'Giới hạn âm thanh ban ngày cho phép tại khu vực dân cư', 'badge-mild', 'Cho phép ban ngày'),
                    ('75 – 82 dBA', 'Máy xúc mini, máy cắt gạch, máy mài cầm tay', 'Ngưỡng tối đa cho phép; bắt buộc phải có bạt cách âm bao quanh', 'badge-moderate', 'Bắt buộc chắn ồn'),
                    ('85 – 92 dBA', 'Máy khoan đục bê tông cỡ lớn, máy đóng cọc', 'Vi phạm nghiêm trọng nếu thi công sáng sớm hoặc ngày nghỉ', 'badge-severe', 'Vi phạm khung giờ'),
                    ('95+ dBA', 'Máy ép cọc thủy lực công suất lớn, nổ mìn phá đá', 'Nguy cơ gây nứt nhà lân cận; đủ điều kiện ra quyết định dừng thi công', 'badge-severe', 'Đình chỉ thi công')
                ]
            }
        },
        'steps': {
            'title': {
                'es': 'Cómo construir una reclamación sólida contra ruidos de obras',
                'de': 'In 4 Schritten gegen Baustellenlärm vorgehen',
                'fr': 'Comment documenter les nuisances de chantier de façon inattaquable',
                'ja': '工事・解体騒音の違反を是正させる4ステップ証拠化手順',
                'ko': '공사장 소음 피해를 입증하고 공사 중지를 이끌어내는 4단계 절차',
                'th': 'ขั้นตอนการรวบรวมหลักฐานเอาผิดงานก่อสร้างใน 4 ขั้นตอน',
                'vi': 'Quy trình 4 bước lập hồ sơ khiếu nại công trình thi công'
            },
            'lead': {
                'es': 'Siga este procedimiento para lograr inspecciones de disciplina urbanística y órdenes de cese.',
                'de': 'Rechtssichere Schritte für Bußgelder und Auflagen durch das Bauordnungsamt.',
                'fr': 'Une méthodologie rigoureuse pour contraindre les maîtres d’ouvrage au respect des règles.',
                'ja': '行政の建築指導課や警察が即座に現場停止命令を出すための証拠構築法です。',
                'ko': '구청 건축과와 환경지도과가 즉각 현장 점검 및 과태료 처분을 내리도록 만드는 핵심 절차입니다.',
                'th': 'ขั้นตอนที่เป็นระบบเพื่อให้เจ้าหน้าที่ฝ่ายโยธาและเทศกิจเข้าตรวจสอบและสั่งแก้ไข.',
                'vi': 'Quy trình chuẩn hóa giúp cơ quan thanh tra xây dựng và môi trường có đủ căn cứ xử phạt.'
            },
            'items': {
                'es': [
                    ('1', '⏰', 'Registrar hora de inicio y fin', 'La mayoría de infracciones se producen al arrancar antes de las 07:00 o 08:00 AM. Registre con marca horaria la primera maquinaria en marcha.'),
                    ('2', '📊', 'Medir picos de impacto (Lmax)', 'Capture las puntas de decibelios ocasionadas por demoledores y martillos neumáticos para demostrar la superación de los límites diurnos.'),
                    ('3', '📸', 'Fotografiar maquinaria y cartel de obra', 'Tome fotos de la maquinaria en funcionamiento y del cartel con el número de licencia municipal con el nivel sonoro estampado.'),
                    ('4', '📑', 'Remitir el dosier a urbanismo y policía', 'Genere el informe técnico en PDF con hash de integridad para cursar denuncia ante la policía local y el departamento de licencias de obras.')
                ],
                'de': [
                    ('1', '⏰', 'Arbeitsbeginn sekundengenau erfassen', 'Die meisten Verstöße geschehen vor 07:00 Uhr morgens. Dokumentieren Sie den exakten Zeitpunkt der ersten Lärmentwicklung.'),
                    ('2', '📊', 'Impulsspitzen (Lmax/L10) messen', 'Erfassen Sie Höchstwerte von Abbruchhämmern und Sägen, um die Überschreitung der Immissionsrichtwerte zu belegen.'),
                    ('3', '📸', 'Maschinen & Bauschild fotografieren', 'Fotografieren Sie die Baumaschinen im Einsatz sowie das Bauschild mit Genehmigungsnummer und eingeblendetem Dezibelwert.'),
                    ('4', '📑', 'Bauordnungsamt & Polizei einschalten', 'Exportieren Sie das offizielle PDF-Gutachten und fordern Sie das Bauamt zu unangekündigten Kontrollen und Auflagen auf.')
                ],
                'fr': [
                    ('1', '⏰', 'Consigner l’heure exacte de démarrage', 'Les infractions surviennent souvent avant 7h ou 8h du matin. Enregistrez précisément le démarrage des premiers engins.'),
                    ('2', '📊', 'Mesurer les pointes d’impact (Lmax)', 'Enregistrez les émergences brutales causées par les brise-béton pour prouver le non-respect des seuils autorisés.'),
                    ('3', '📸', 'Photographier les engins et le panneau de permis', 'Clichés horodatés de l’équipement bruyant et de l’affichage officiel du permis de construire avec mesure de dB incrustée.'),
                    ('4', '📑', 'Saisir le service d’urbanisme de la mairie', 'Transmettez le dossier PDF complet aux agents assermentés de la ville pour verbalisation et injonction de suspension.')
                ],
                'ja': [
                    ('1', '⏰', '違法早朝作業の開始時刻を秒単位で刻印', '工事騒音トラブルの多くは朝7時または8時前の無断作業です。重機が起動した決定的瞬間を確定時刻とともに記録します。'),
                    ('2', '📊', '衝撃音ピーク値（Lmax・L10）を計測', '削岩機やコンクリート斫りによる突発的な極大音圧レベルを連続計測し、特定建設作業の法定規制基準（85dB等）超過を立証。'),
                    ('3', '📸', '現場の重機と「建築確認標識」を同時撮影', '作業中の建機本体および施工会社名・許可番号が記載された工事看板を、dBA数値・GPS座標付き写真として押さえます。'),
                    ('4', '📑', '自治体建築指導課・警察へ是正申立書を提出', 'SHA-256ハッシュ入りPDFレポートを印刷し、役所の公害担当部署および警察へ提出。是正命令や作業時間遵守指導を要求。')
                ],
                'ko': [
                    ('1', '⏰', '규정 외 조기 작업 착공 시간 기록', '대부분의 공사 위반은 오전 7시 이전 조기 작업에서 발생합니다. 첫 타격 소음이 발생한 정확한 시간을 타임스탬프로 확보하세요.'),
                    ('2', '📊', '충격 소음 피크치(Lmax 및 L10) 포착', '브레이커, 착암기, 굴착기 파쇄음의 순간 피크 데시벨을 측정하여 환경부 공사장 소음 기준(주간 65~70 dBA) 초과를 증명합니다.'),
                    ('3', '📸', '작동 중인 중장비와 공사 안내 표지판 촬영', '소음을 유발하는 건설 장비와 시공사명, 공사 허가 번호가 적힌 현장 안내판을 실시간 데시벨 워터마크와 함께 촬영합니다.'),
                    ('4', '📑', '구청 환경과 및 건축과 공식 민원 접수', '위변조 방지 해시가 포함된 기술 감사 리포트(PDF/CSV)를 첨부하여 현장 점검, 과태료 부과 및 조업정지 처분을 청구합니다.')
                ],
                'th': [
                    ('1', '⏰', 'บันทึกเวลาเริ่มทำงานอย่างแม่นยำ', 'การกระทำผิดส่วนใหญ่มักเริ่มก่อน 7:00 หรือ 8:00 น. บันทึกเวลาที่เครื่องจักรเครื่องแรกเริ่มทำงาน.'),
                    ('2', '📊', 'วัดค่าเสียงกระแทกสูงสุด (Lmax)', 'จับภาพคลื่นเสียงที่เกิดจากเครื่องสกัดคอนกรีตเพื่อแสดงว่าเกินขีดจำกัดที่กฎหมายกำหนด.'),
                    ('3', '📸', 'ถ่ายภาพเครื่องจักรและป้ายโครงการ', 'ถ่ายภาพเครื่องจักรที่กำลังทำงานและป้ายอนุญาตก่อสร้างพร้อมประทับค่าเสียงและพิกัด GPS.'),
                    ('4', '📑', 'ยื่นเอกสารต่อสำนักงานเขตและตำรวจ', 'ส่งออกเอกสารสรุป PDF เพื่อยื่นต่อฝ่ายโยธา สำนักงานเขต หรือเทศบาลเพื่อสั่งระงับการทำงานนอกเวลา.')
                ],
                'vi': [
                    ('1', '⏰', 'Ghi lại chính xác giờ bắt đầu thi công', 'Hầu hết các vi phạm xảy ra do bắt đầu làm trước 7h sáng. Hãy ghi lại thời điểm phát ra tiếng ồn đầu tiên.'),
                    ('2', '📊', 'Đo đạc đỉnh tiếng ồn va đập (Lmax)', 'Ghi nhận các xung âm thanh cực đại do máy khoan đục gây ra để chứng minh vượt quy chuẩn ban ngày.'),
                    ('3', '📸', 'Chụp ảnh thiết bị và biển báo công trình', 'Chụp lại máy móc đang vận hành cùng biển thông tin giấy phép xây dựng có đóng dấu chỉ số dBA.'),
                    ('4', '📑', 'Nộp hồ sơ kỹ thuật cho Thanh tra Xây dựng', 'Xuất báo cáo PDF gửi UBND và Đội Quản lý Trật tự Đô thị để tiến hành kiểm tra đột xuất và xử lý.')
                ]
            }
        },
        'features': {
            'title': {
                'es': 'Funciones avanzadas para control de obras y disciplina urbanística',
                'de': 'Spezialfunktionen für Baustellenüberwachung',
                'fr': 'Fonctionnalités avancées pour l’inspection de chantiers',
                'ja': '工事現場・解体作業の監視に特化した高機能モジュール',
                'ko': '공사장 소음 점검 및 민원 단속 전용 고급 기능',
                'th': 'ฟังก์ชันขั้นสูงสำหรับการตรวจสอบงานก่อสร้าง',
                'vi': 'Các tính năng kỹ thuật giám sát công trình xây dựng'
            },
            'lead': {
                'es': 'Herramientas concebidas para certificar infracciones ante técnicos municipales y juzgados.',
                'de': 'Messwerkzeuge für wasserdichte Beweisführung gegenüber Bauaufsicht und Gerichten.',
                'fr': 'Conçu pour satisfaire aux exigences de preuve des inspecteurs de salubrité et des juges.',
                'ja': '自治体の建築指導課や裁判所が求める証拠要件を満たすよう設計された機能群です。',
                'ko': '지자체 환경지도관과 법원이 요구하는 객관적 증거 요건을 철저히 충족합니다.',
                'th': 'เครื่องมือที่สร้างขึ้นเพื่อให้ตรงกับมาตรฐานที่วิศวกรและหน่วยงานรัฐต้องการ.',
                'vi': 'Được tối ưu để đáp ứng hoàn toàn yêu cầu thẩm định của thanh tra xây dựng.'
            },
            'items': {
                'es': [
                    ('⏰', 'Marcador de horario de inicio y fin', 'Documenta con precisión atómica las infracciones de arranque matutino o trabajo en festivos no autorizados.'),
                    ('📊', 'Ponderación A y C simultánea', 'Evalúa el impacto en dBA para molestia general y en dBC para vibraciones mecánicas y retumbos graves de maquinaria pesada.'),
                    ('📸', 'Fotos con sellado pericial y GPS', 'Acredita la localización exacta de la obra mediante coordenadas GPS y fecha-hora estampada en el propio archivo.'),
                    ('📈', 'Estadística percentil L10 y Lmax', 'Muestra la intensidad de los picos acústicos más repetitivos causados por corte de hormigón y demolición.'),
                    ('📑', 'Exportación dual en PDF y CSV', 'Genere tanto un informe visual para técnicos municipales como los datos brutos en CSV para auditorías de ingeniería.'),
                    ('🔒', 'Registro local inalterable', 'Toda la telemetría acústica se custodia en su terminal para garantizar la cadena de custodia probatoria.')
                ],
                'de': [
                    ('⏰', 'Automatische Arbeitszeit-Erfassung', 'Dokumentiert unzulässigen Lärm vor 07:00 Uhr morgens oder an Sonn- und Feiertagen lückenlos.'),
                    ('📊', 'A- und C-Bewertung parallel', 'Misst dBA für Luftschall und dBC für Erschütterungen und tiefes Motorbrummen von Schwerlastmaschinen.'),
                    ('📸', 'Beweisfoto mit GPS & Baustellenstempel', 'Beweist den Standort der Baustelle unverrückbar durch GPS-Koordinaten und Zeitstempel direkt im Foto.'),
                    ('📈', 'L10- & Lmax-Perzentilanalyse', 'Weist Spitzenpegel von Abbruchhämmern und Baumaschinen nach, die Schwellenwerte sprengen.'),
                    ('📑', 'Dualer PDF- & CSV-Export', 'Erstellt übersichtliche Berichte für Behörden und exportiert Rohdaten für schalltechnische Gutachten.'),
                    ('🔒', 'Manipulationssichere Speicherung', 'Alle Sensordaten verbleiben geschützt im lokalen Speicher zur Wahrung der Beweiskette.')
                ],
                'fr': [
                    ('⏰', 'Horodatage automatique de démarrage', 'Prouve sans équivoque les démarrages illégaux avant les heures autorisées ou durant les jours fériés.'),
                    ('📊', 'Pondérations A et C combinées', 'Analyse en dBA pour la gêne auditive et en dBC pour les basses fréquences et vibrations de moteurs lourds.'),
                    ('📸', 'Photos probatoires géolocalisées', 'Incruste les coordonnées GPS précises et l’horodatage pour authentifier l’emplacement du chantier incriminé.'),
                    ('📈', 'Statistiques L10 et pics Lmax', 'Quantifie la répétitivité des chocs sonores causés par le concassage et les marteaux-piqueurs.'),
                    ('📑', 'Export complet PDF et CSV', 'Génère un rapport formel pour la mairie et un fichier tableur brut pour les experts acousticiens.'),
                    ('🔒', 'Sécurisation locale des preuves', 'Vos mesures restent stockées en toute sécurité sur votre appareil pour garantir leur intégrité.')
                ],
                'ja': [
                    ('⏰', '作業開始・終了時刻自動タイムスタンプ', '早朝7時前や日曜日の違法作業の開始・終了時刻を秒単位で改ざん不能な形で記録。'),
                    ('📊', 'A特性・C特性デュアル周波数補正', '一般的な聴覚影響（dBA）と、重機・削岩機特有の低周波振動衝撃（dBC）を同時評価。'),
                    ('📸', '高精度GPS＆騒音スタンプ撮影', '撮影した写真に位置情報（緯度経度）、実測騒音値、時刻を埋め込み、現場境界線の特定証拠に。'),
                    ('📈', 'Lmax（最大値）・L10（ピーク頻度）統計', '単なる平均値では隠れがちな、ハンマー打撃や鉄骨落下の瞬間的破滅音を明確に抽出。'),
                    ('📑', 'PDF報告書＆生データCSV同時出力', '役所提出用の美しい公式PDFレポートに加え、音響鑑定人向けのCSV数値ログもワンクリック出力。'),
                    ('🔒', '証拠保全のための端末ローカル保存', '全ての測定ログはブラウザ内IndexedDBに暗号化保存され、外部漏洩の心配なく証拠能力を維持。')
                ],
                'ko': [
                    ('⏰', '작업 개시 및 종료 시각 정밀 타임스탬프', '오전 7시 이전 조기 공사 착공 및 일요일·공휴일 무단 작업 시점을 명확히 박제합니다.'),
                    ('📊', 'A특성 및 C특성 동시 가중치 측정', '공기 중 체감 소음(dBA)과 대형 디젤 중장비의 지반 진동 및 저주파수 충격(dBC)을 동시 측정합니다.'),
                    ('📸', '정밀 GPS 위치 및 데시벨 각인 카메라', '촬영 사진에 GPS 좌표(위경도), 실시간 dB 수치, 일시를 영구 각인하여 공사장 위치를 입증합니다.'),
                    ('📈', 'Lmax(최대값) 및 L10(피크 백분위수) 분석', '평균값에 묻히기 쉬운 착암기 타격 및 강재 낙하 충격 소음의 최대치를 정밀 분리합니다.'),
                    ('📑', '공식 PDF 보고서 및 CSV 원시 데이터 출력', '시·구청 건축과 제출용 규격 PDF와 전문 엔지니어링 감정용 원본 CSV를 동시 생성합니다.'),
                    ('🔒', '증거 보존을 위한 100% 로컬 보안 스토리지', '모든 계측 데이터와 사진은 사용자 기기 내부에만 보관되어 무단 유출 없이 증거 능력을 유지합니다.')
                ],
                'th': [
                    ('⏰', 'บันทึกเวลาเริ่มและเลิกงานอัตโนมัติ', 'บันทึกเวลาทำงานที่ผิดกฎหมายก่อน 7:00 น. หรือการทำงานในวันหยุดอย่างแม่นยำ.'),
                    ('📊', 'ระบบวัดแบบ A-weighting และ C-weighting', 'วัดค่า dBA สำหรับเสียงทั่วไป และ dBC สำหรับแรงสั่นสะเทือนจากเครื่องจักรหนัก.'),
                    ('📸', 'กล้องประทับพิกัด GPS และระดับเสียง', 'ฝังพิกัดและค่าเสียงลงในภาพถ่ายเพื่อยืนยันตำแหน่งของสถานที่ก่อสร้างที่กระทำความผิด.'),
                    ('📈', 'วิเคราะห์สถิติ L10 และ Lmax', 'แสดงระดับเสียงพีคสูงสุดที่เกิดจากการทุบปูนและการรื้อถอนอย่างชัดเจน.'),
                    ('📑', 'ส่งออกเอกสาร PDF และข้อมูลดิบ CSV', 'สร้างรายงาน PDF สำหรับเจ้าหน้าที่รัฐ และไฟล์ CSV สำหรับการตรวจสอบทางวิศวกรรม.'),
                    ('🔒', 'จัดเก็บข้อมูลในเครื่องอย่างปลอดภัย', 'ข้อมูลทั้งหมดจะถูกเก็บไว้ในอุปกรณ์ของคุณ เพื่อรักษาความถูกต้องของพยานหลักฐาน.')
                ],
                'vi': [
                    ('⏰', 'Ghi dấu thời gian thi công chuẩn xác', 'Chứng minh rõ ràng các trường hợp thi công sai quy định trước 7h sáng hoặc trong ngày nghỉ.'),
                    ('📊', 'Đo đạc song song thang A và thang C', 'Phân tích dBA cho mức ồn cảm nhận và dBC cho các rung chấn tần số thấp từ xe cơ giới nặng.'),
                    ('📸', 'Chụp ảnh có tọa độ GPS và thông số thực', 'In trực tiếp tọa độ định vị và mức decibel lên ảnh để xác thực vị trí công trường vi phạm.'),
                    ('📈', 'Thống kê phân vị đỉnh L10 và Lmax', 'Làm nổi bật các xung âm thanh cực đại do máy đục bê tông và máy nghiền đá gây ra.'),
                    ('📑', 'Xuất đồng thời báo cáo PDF và bảng CSV', 'Tạo tài liệu chính thức gửi cơ quan chức năng và file dữ liệu thô phục vụ giám định chuyên sâu.'),
                    ('🔒', 'Lưu trữ cục bộ bảo toàn chứng cứ', 'Mọi thông số kỹ thuật được lưu trong thiết bị của bạn nhằm đảm bảo chuỗi chứng cứ nguyên vẹn.')
                ]
            }
        },
        'rules': {
            'title': {
                'es': 'Reglas probatorias para detener obras fuera de normativa',
                'de': 'Beweisregeln zum Stoppen von illegalem Baulärm',
                'fr': 'Règles essentielles pour faire cesser les nuisances de chantier',
                'ja': '工事騒音の違法施工を確実に止めるための実務鉄則',
                'ko': '공사장 불법 소음을 차단하고 행정명령을 이끌어내는 핵심 수칙',
                'th': 'หลักเกณฑ์การใช้หลักฐานเพื่อระงับงานก่อสร้างที่ผิดกฎหมาย',
                'vi': 'Các quy tắc thu thập chứng cứ buộc công trình tuân thủ quy định'
            },
            'lead': {
                'es': 'Las empresas constructoras suelen ignorar quejas verbales. Use estos métodos técnicos para obligarles a actuar.',
                'de': 'Bauunternehmen ignorieren mündliche Beschwerden meist. Nutzen Sie diese Methodik für verbindliche Auflagen.',
                'fr': 'Les entreprises de BTP ignorent souvent les plaintes verbales. Voici comment leur imposer le respect des règles.',
                'ja': '現場監督への口頭クレームは聞き流されがちです。行政指導を直接発動させるための証拠提出法です。',
                'ko': '현장 소장에게 구두 항의만 해서는 개선되지 않습니다. 관할 지자체가 즉각 조치명령을 내리게 만드는 방법입니다.',
                'th': 'ผู้รับเหมามักเพิกเฉยต่อการบ่นด้วยวาจา ใช้แนวทางทางเทคนิคเหล่านี้เพื่อบังคับให้เกิดการแก้ไข.',
                'vi': 'Nhà thầu thường bỏ qua các lời nhắc nhở miệng. Đây là cách buộc họ phải áp dụng biện pháp giảm ồn.'
            },
            'items': {
                'es': [
                    ('📍', 'Regla 1: Mida en el linde de su propiedad, no dentro de la obra', 'Las ordenanzas evalúan el nivel sonoro en la fachada o linde del receptor afectado. Coloque el móvil en el límite de su parcela o ventana abierta.'),
                    ('⏰', 'Regla 2: Registre el primer minuto de actividad matutina', 'Iniciar la maquinaria a las 06:45 cuando el permiso marca las 08:00 constituye una infracción flagrante directa de horarios.'),
                    ('📸', 'Regla 3: Vincule la foto de la máquina con el cartel de obra', 'Fotografíe tanto el foco de ruido (ej. compresor) como la licencia urbanística con mediciones en dB selladas para asociar la responsabilidad.'),
                    ('📑', 'Regla 4: Exija la visita de disciplina urbanística con el PDF', 'Remita el informe con tablas horarias al área de urbanismo y medio ambiente para forzar la instalación de pantallas acústicas.')
                ],
                'de': [
                    ('📍', 'Regel 1: An der eigenen Grundstücksgrenze messen', 'Baulärmrichtwerte gelten am maßgeblichen Immissionsort der Betroffenen. Messen Sie an Ihrer Grundstücksgrenze oder am offenen Wohnungsfenster.'),
                    ('⏰', 'Regel 2: Die erste Minute des morgendlichen Baubeginns festhalten', 'Ein Baggerstart um 06:30 Uhr bei einer Genehmigung ab 07:00 Uhr ist ein direkter und unstrittiger Ordnungsverstoß.'),
                    ('📸', 'Regel 3: Baumaschine und Genehmigungsschild verknüpfen', 'Erfassen Sie die lärmende Maschine sowie das Bauschild mit der Genehmigungsnummer und eingeblendetem Dezibelwert im selben Datensatz.'),
                    ('📑', 'Regel 4: Vor-Ort-Messung durch Bauaufsicht mit PDF anfordern', 'Reichen Sie das vollständige Lärmprotokoll schriftlich ein, um den Einsatz von mobilen Lärmschutzwänden oder Baustopps durchzusetzen.')
                ],
                'fr': [
                    ('📍', 'Règle 1 : Mesurer en limite de propriété ou façade exposée', 'Les limites légales s’apprécient au point de réception. Positionnez le terminal sur votre balcon ou à la limite séparative face aux travaux.'),
                    ('⏰', 'Règle 2 : Capturer la première minute d’activité matinale', 'Démarrer un concasseur à 6h45 alors que l’arrêté autorise 8h00 constitue une infraction horaire formelle immédiate.'),
                    ('📸', 'Règle 3 : Relier la machine incriminée au panneau de permis', 'Photographiez l’engin bruyant et le panneau officiel portant le numéro d’autorisation avec estampillage des dB réels.'),
                    ('📑', 'Règle 4 : Exiger l’intervention de la police de l’urbanisme', 'Fournissez le rapport PDF d’exposition pour contraindre la mairie à dépêcher un agent assermenté et exiger des écrans acoustiques.')
                ],
                'ja': [
                    ('📍', '鉄則1：工事敷地内ではなく、自己の敷地境界線・窓辺で測定する', '条例の規制基準は「被害を受ける住民側の境界線」で判定されます。自室のベランダや境界フェンス際で測定するのが正解です。'),
                    ('⏰', '鉄則2：早朝の「最初の1分間」の稼働音を確実に捕捉する', '許可時間が朝8時からであるにもかかわらず、7時前に重機エンジンを始動させた事実は、言い逃れのできない明確な違反行為です。'),
                    ('📸', '鉄則3：騒音重機と「建築計画のお知らせ看板」をセットで証拠化', '騒音を放つ重機本体と、施工会社名や工事責任者名が書かれた看板をそれぞれ測定値入り写真としてセットで記録します。'),
                    ('📑', '鉄則4：PDF監査資料を行政の建築指導課へ提出し現場指導を促す', '時間別グラフが掲載された公式PDFを役所の窓口へ提出することで、防音シートの設置や作業時間厳守の指導が即座に発動します。')
                ],
                'ko': [
                    ('📍', '수칙 1: 공사장 내부가 아닌 본인 거주지 부지 경계선에서 측정하세요', '소음진동관리법상 규제 기준은 피해 세대의 주거지 부지 경계선입니다. 발코니나 창문 앞에서 측정해야 공식적 효력을 갖습니다.'),
                    ('⏰', '수칙 2: 규정 시간 이전 \'첫 1분\'의 작업 착공 시점을 확보하세요', '오전 8시 허가 현장에서 7시 이전 공사를 개시한 사실은 소음 크기와 무관하게 명백한 작업 시간 제한 위반에 해당합니다.'),
                    ('📸', '수칙 3: 소음 발생 장비와 공사 허가 표지판을 함께 채증하세요', '브레이커나 발전기 등 소음원 장비와 시공사 정보가 적힌 공사 표지판을 실시간 데시벨 워터마크 사진으로 짝지어 기록하세요.'),
                    ('📑', '수칙 4: 공식 계측 리포트를 구청에 제출하여 에어 방음벽 설치를 강제하세요', '시계열 그래프가 담긴 PDF를 관할 지자체에 제출하면, 공무원이 현장 단속을 실시하고 이동식 방음벽 설치 명령을 내립니다.')
                ],
                'th': [
                    ('📍', 'กฎข้อที่ 1: วัดที่แนวเขตที่ดินของตนเอง มิใช่เข้าไปในเขตก่อสร้าง', 'กฎหมายพิจารณาค่าเสียง ณ จุดรับเสียงของผู้ได้รับผลกระทบ วางเครื่องมือบริเวณระเบียงหรือหน้าต่างห้องของคุณ.'),
                    ('⏰', 'กฎข้อที่ 2: บันทึกนาทีแรกที่เริ่มงานก่อนเวลาที่กำหนด', 'การเริ่มทำงานก่อนเวลาที่ได้รับอนุญาตถือเป็นความผิดอย่างชัดเจน บันทึกเวลาที่เริ่มติดเครื่องจักรเครื่องแรก.'),
                    ('📸', 'กฎข้อที่ 3: บันทึกภาพเครื่องจักรควบคู่กับป้ายใบอนุญาตก่อสร้าง', 'ถ่ายภาพเครื่องจักรที่เป็นต้นเหตุร่วมกับป้ายชื่อโครงการที่มีเลขที่ใบอนุญาตพร้อมประทับค่าเสียง.'),
                    ('📑', 'กฎข้อที่ 4: ยื่นเอกสารสรุป PDF เพื่อสั่งให้ติดตั้งแผงกั้นเสียง', 'ยื่นรายงานต่อฝ่ายโยธาเพื่อบังคับให้ผู้รับเหมาต้องติดตั้งแผงกั้นเสียงและปฏิบัติตามเวลาทำงานอย่างเคร่งครัด.')
                ],
                'vi': [
                    ('📍', 'Quy tắc 1: Đo tại ranh giới nhà bạn, không vào trong công trường', 'Quy chuẩn môi trường xác định tại vị trí người bị ảnh hưởng. Đo từ ban công hoặc cửa sổ nhà bạn hướng về công trường.'),
                    ('⏰', 'Quy tắc 2: Ghi nhận phút đầu tiên máy móc khởi động sai giờ', 'Bật máy thi công lúc 6h30 khi quy định là 7h30 sáng là hành vi vi phạm khung giờ rõ ràng, không thể chối cãi.'),
                    ('📸', 'Quy tắc 3: Chụp ảnh máy móc gây ồn gắn liền với biển báo dự án', 'Chụp rõ thiết bị gây ồn cùng bảng thông tin giấy phép xây dựng của công trình có kèm chỉ số dBA thực tế.'),
                    ('📑', 'Quy tắc 4: Nộp hồ sơ PDF để yêu cầu lắp dựng rào chắn cách âm', 'Nộp tài liệu cho cơ quan quản lý để buộc chủ đầu tư phải lắp đặt hệ thống bạt chắn âm và tuân thủ giờ giấc.')
                ]
            }
        },
        'faqs': {
            'es': [
                ("¿En qué horarios está permitido el ruido de obras en zonas residenciales?",
                 "En la mayoría de municipios, las obras solo están permitidas de lunes a viernes de 08:00 a 18:00 o 19:00 horas, y los sábados con horario reducido (ej. 09:00 a 14:00). Los domingos y festivos los trabajos ruidosos están totalmente prohibidos. SOUNDTEST.PRO le permite verificar si una obra infringe el horario municipal."),
                ("¿Qué nivel de decibelios es el límite legal para obras de construcción?",
                 "En general, el límite de inmisión en fachada residencial durante el día suele fijarse entre 65 y 70 dBA para actividades continuas. Trabajos de demolición de gran impacto no deben superar los 80–85 dBA y requieren medidas de apantallamiento acústico."),
                ("¿Pueden trabajar las constructoras en festivos o fines de semana?",
                 "Salvo que dispongan de una autorización municipal extraordinaria por razones de urgencia o seguridad pública, los trabajos ruidosos en domingos y festivos son ilegales."),
                ("¿Cómo denuncio una obra que no respeta los límites acústicos?",
                 "Llame a la Policía Local para levantar acta en el momento del incumplimiento. Posteriormente presente una denuncia formal ante el área de Urbanismo aportando su informe PDF de SOUNDTEST.PRO con el historial de picos y fotos geolocalizadas.")
            ],
            'de': [
                ("Zu welchen Zeiten ist Baulärm in Wohngebieten zulässig?",
                 "Gemäß Bundes-Immissionsschutzgesetz und Gemeindesatzungen sind lärmintensive Bauarbeiten werktags meist von 07:00 bis 20:00 Uhr erlaubt. An Sonn- und Feiertagen sowie während der Nachtruhe (22:00 bis 07:00 Uhr) gilt strikte Ruhezeit."),
                ("Welche Dezibelgrenzen gelten für Baustellen?",
                 "Die AVV Baulärm setzt in reinen Wohngebieten tagsüber einen Immissionsrichtwert von 50 dBA an, in allgemeinen Wohngebieten 55 dBA und in Mischgebieten 60 dBA. Einzelne Geräuschspitzen dürfen diese Werte um maximal 30 dBA überschreiten."),
                ("Dürfen Handwerker am Wochenende arbeiten?",
                 "Samstags gelten reguläre Werktagsregeln, sonntags sind gewerbliche laute Bauarbeiten gesetzlich untersagt, sofern keine behördliche Ausnahmegenehmigung vorliegt."),
                ("Wie bringe ich das Bauamt dazu, eine Baustelle zu überprüfen?",
                 "Reichen Sie ein lückenloses Messprotokoll mit dB-Werten, Uhrzeiten und Fotobeweisen ein. Dies verpflichtet die Bauaufsicht, amtliche Kontrollmessungen anzuordnen.")
            ],
            'fr': [
                ("Quels sont les horaires autorisés pour les travaux bruyants ?",
                 "Les arrêtés municipaux autorisent généralement les travaux de chantier du lundi au vendredi de 8h à 12h et de 14h à 19h, et le samedi matin. Ils sont rigoureusement interdits les dimanches et jours fériés sauf dérogation exceptionnelle."),
                ("Quelle est la limite de décibels pour un chantier en ville ?",
                 "L’émergence globale tolérée ne doit pas dépasser 5 dB le jour par rapport au bruit ambiant résiduel. Les équipements lourds doivent être munis de dispositifs silencieux conformes aux normes européennes."),
                ("Les ouvriers peuvent-ils travailler le week-end ?",
                 "Le samedi après-midi et le dimanche complet font l’objet d’une interdiction générale pour les travaux bruyants d’entreprises en milieu résidentiel."),
                ("Comment faire constater une infraction de chantier ?",
                 "Faites constater le démarrage illégal par la police municipale et transmettez votre rapport SOUNDTEST.PRO au service urbanisme de votre commune.")
            ],
            'ja': [
                ("住宅地での工事騒音は法律上何時から何時まで認められていますか？",
                 "騒音規制法に基づく「特定建設作業」では、原則として作業時間は午前7時から午後7時まで（1日10時間以内）に制限されており、日曜日や休日の作業は禁止されています。"),
                ("工事騒音の法定受忍限度は何デシベルですか？",
                 "特定建設作業の規制基準値は敷地境界線上で85 dBA以下と定められています。これを超える衝撃音や騒音は改善勧告および改善命令の対象となります。"),
                ("休日に工事を行う業者は違法ですか？",
                 "緊急復旧工事などの特例許可を得ている場合を除き、日曜日や祝日に特定建設作業に該当する重機工事を行うことは明確な法令違反です。"),
                ("騒音のひどい解体工事やリフォームを止めるにはどうすれば良いですか？",
                 "区役所・市役所の建築指導課または環境対策課へ、時間刻印付きのPDFレポートを提出してください。行政による立ち入り検査と防音対策指導が実施されます。")
            ],
            'ko': [
                ("주거지역 공사장의 법적 작업 가능 시간은 언제인가요?",
                 "소음·진동관리법 규정상 특정공사 작업 시간은 통상 평일 오전 07:00부터 오후 18:00까지이며, 공휴일 및 일요일은 원칙적으로 특정공사 작업이 제한됩니다."),
                ("공사장 소음의 법적 규제 기준치는 얼마인가요?",
                 "주거지역 인근 공사장의 배출허용기준은 주간(07:00~18:00) 65 dBA 이하, 아침·저녁(05:00~07:00, 18:00~22:00) 60 dBA 이하, 야간 50 dBA 이하입니다."),
                ("주말이나 공휴일에 공사를 강행하면 불법인가요?",
                 "사전 허가받지 않은 일요일 및 공휴일의 특정장비(굴착기, 브레이커 등) 가동은 조업 제한 명령 대상이 되는 명백한 법 위반입니다."),
                ("소음이 심한 공사장을 관할 관청에 신고하려면 어떻게 해야 하나요?",
                 "시계열 측정 그래프와 GPS 각인 사진이 포함된 SOUNDTEST.PRO 리포트를 구청 환경과에 민원으로 접수하면, 담당 공무원이 즉시 현장에 파견되어 개선명령을 내립니다.")
            ],
            'th': [
                ("งานก่อสร้างในเขตที่อยู่อาศัยสามารถทำได้ในเวลาใดบ้าง?",
                 "โดยทั่วไปงานก่อสร้างที่ก่อให้เกิดเสียงดังได้รับอนุญาตเฉพาะวันจันทร์ถึงเสาร์ เวลา 08:00 ถึง 18:00 น. เท่านั้น ห้ามทำงานที่มีเสียงรบกวนในวันอาทิตย์และวันหยุดนักขัตฤกษ์."),
                ("เกณฑ์จำกัดระดับเสียงงานก่อสร้างตามกฎหมายคือเท่าใด?",
                 "ค่าระดับเสียงเฉลี่ยต่อเนื่องตลอดวันไม่ควรเกิน 75-80 dBA ที่บริเวณแนวเขตที่ดิน และต้องไม่รบกวนผู้พักอาศัยข้างเคียงเกินเกณฑ์ที่กฎหมายผังเมืองกำหนด."),
                ("ผู้รับเหมาสามารถทำงานในวันอาทิตย์ได้หรือไม่?",
                 "หากไม่มีหนังสืออนุญาตเป็นกรณีพิเศษจากเจ้าพนักงานท้องถิ่น การทำงานก่อสร้างที่มีเสียงดังในวันอาทิตย์ถือเป็นการฝ่าฝืนกฎหมาย."),
                ("ขั้นตอนการร้องเรียนไซต์งานก่อสร้างที่ส่งเสียงดังต้องทำอย่างไร?",
                 "แจ้งฝ่ายโยธาของสำนักงานเขตหรือเทศบาลในพื้นที่ พร้อมแนบรายงานสรุป PDF ของ SOUNDTEST.PRO เพื่อให้เจ้าหน้าที่ออกคำสั่งระงับการทำงานชั่วคราว.")
            ],
            'vi': [
                ("Công trình xây dựng được phép thi công trong khung giờ nào?",
                 "Theo quy định hiện hành, các công việc gây ồn chỉ được phép thực hiện từ 6h hoặc 7h sáng đến 18h hoặc 21h các ngày làm việc. Nghiêm cấm thi công gây ồn vào các ngày nghỉ lễ, Tết nếu không có giấy phép đặc biệt."),
                ("Mức giới hạn tiếng ồn công trình xây dựng là bao nhiêu decibel?",
                 "Quy chuẩn kỹ thuật quy định mức tiếng ồn thông thường tại khu vực dân cư vào ban ngày không được vượt quá 70 dBA và ban đêm không được vượt quá 55 dBA."),
                ("Nhà thầu có được phép thi công ầm ĩ vào Chủ Nhật không?",
                 "Các công việc đục phá, vận hành máy móc công suất lớn vào ngày Chủ Nhật tại khu dân cư là hành vi vi phạm trật tự công cộng."),
                ("Làm thế nào để báo cáo công trình thi công vi phạm tiếng ồn?",
                 "Gửi hồ sơ chứng cứ dạng PDF từ SOUNDTEST.PRO tới Đội Quản lý Trật tự Đô thị và UBND cấp quận/huyện để yêu cầu đình chỉ thi công nếu không có biện pháp cách âm.")
            ]
        },
        'cta_band': {
            'es': ('¿Sufre por ruidos de obras y maquinaria cerca de su casa?',
                   'Documente picos y horarios ilegales en 10 segundos directamente en su navegador. Sin compras de equipos, sin descargas, 100% privado.'),
            'de': ('Wollen Sie unzulässigen Baustellenlärm vor Ihrem Fenster stoppen?',
                   'Erfassen Sie Spitzenwerte und Ruhezeitverstöße in 10 Sekunden direkt im Browser. Keine Spezialhardware, kein Download, 100% datenschutzkonform.'),
            'fr': ('Prêt à faire respecter les horaires et limites de chantier ?',
                   'Enregistrez les infractions en 10 secondes directement dans votre navigateur. Sans matériel spécialisé, sans téléchargement d’appli, 100% confidentiel.'),
            'ja': ('耐え難い工事・解体騒音に、確固たる証拠で立ち向かいませんか？',
                   '高価な騒音計の購入もアプリのインストールも不要。ブラウザを開いて10秒で測定開始。完全プライベート・安心のローカル保存。'),
            'ko': ('지긋지긋한 공사장 불법 소음, 이제 과학적인 증거로 중단시키세요',
                   '고가의 전문 측정 장비나 별도 프로그램 설치 없이 브라우저에서 10초 만에 공사 소음을 계측할 수 있습니다. 100% 로컬 보안 보장.'),
            'th': ('พร้อมที่จะยุติเสียงงานก่อสร้างที่ละเมิดเวลาทำงานแล้วหรือยัง?',
                   'บันทึกระดับเสียงและเวลาที่ผิดกฎหมายได้ฟรีใน 10 วินาทีผ่านเบราว์เซอร์ ไม่ต้องซื้อเครื่องมือวัดราคาแพง รักษาความเป็นส่วนตัว 100%.'),
            'vi': ('Sẵn sàng chấm dứt sự tra tấn từ tiếng ồn công trình xây dựng?',
                   'Ghi lại các thông số vi phạm chuẩn xác chỉ trong 10 giây ngay trên trình duyệt. Không cần mua máy đo đắt tiền, bảo mật tuyệt đối.')
        }
    }
}
