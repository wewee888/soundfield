# scripts/use_case_data_part4.py
# Scenario 5: rental-dispute-evidence for es, de, fr, ja, ko, th, vi

SCENARIOS_PART_4 = {
    'rental-dispute-evidence': {
        'img': 'rental_dispute_evidence.webp',
        'img_alt': {
            'es': 'Inquilino en piso de alquiler con maletas y móvil mostrando registro de ruidos y vulneración del disfrute pacífico',
            'de': 'Verzweifelter Mieter auf gepackten Umzugskartons mit Smartphone und Lärmprotokoll zur fristlosen Kündigung',
            'fr': 'Locataire épuisé assis sur ses valises avec smartphone affichant un relevé de nuisances pour résiliation de bail',
            'ja': '騒音に耐えかね荷造りしたスーツケースに腰掛け、賃貸解約・敷金返還のための証拠ログをスマホで確認する住人',
            'ko': '극심한 소음을 견디다 못해 짐을 싼 캐리어 위에 앉아 계약 해지 및 보증금 반환 증거를 확인하는 임차인',
            'th': 'ผู้เช่าที่เหนื่อยล้าบนกระเป๋าเดินทางพร้อมโทรศัพท์แสดงบันทึกเสียงรบกวนเพื่อขอยกเลิกสัญญาเช่า',
            'vi': 'Người thuê nhà mệt mỏi ngồi trên vali đóng gói cùng điện thoại hiển thị bằng chứng vi phạm hợp đồng thuê'
        },
        'stats': {
            'es': [('Registro 14 días', 'Patrón continuo'), ('Uso pacífico', 'Incumplimiento legal'), ('Cero nube', 'Privacidad inquilino'), ('Dosier PDF', 'Apto para arbitraje')],
            'de': [('14-Tage-Log', 'Chronisches Muster'), ('Wohnwertminderung', 'Vertragsverletzung'), ('Keine Cloud', 'Mieter-Privatsphäre'), ('PDF-Dossier', 'Schlichtungsfest')],
            'fr': [('Journal 14j', 'Trouble récurrent'), ('Jouissance paisible', 'Rupture contractuelle'), ('Zéro cloud', 'Vie privée locataire'), ('Dossier PDF', 'Prêt tribunal')],
            'ja': [('14日間ログ', '偶発的口実を打破'), ('平穏居住権', '契約不履行立証'), ('クラウド非送信', '賃借人プライバシー'), ('訴訟・調停PDF', '裁判所・少額訴訟提出')],
            'ko': [('14일 추이 기록', '일회성 변명 차단'), ('평온한 주거권', '민법상 계약 위반'), ('클라우드 제로', '임차인 개인정보'), ('소송·조정 PDF', '분쟁조정위·법원 제출')],
            'th': [('บันทึก 14 วัน', 'พิสูจน์ปัญหาต่อเนื่อง'), ('สิทธิความสงบสุข', 'ละเมิดสัญญาเช่า'), ('ไม่ผ่านคลาวด์', 'รักษาความเป็นส่วนตัว'), ('รายงาน PDF', 'พร้อมยื่นศาล/อนุญาโต')],
            'vi': [('Nhật ký 14 ngày', 'Quy luật liên tục'), ('Quyền cư trú yên tĩnh', 'Vi phạm hợp đồng'), ('Không tải lên cloud', 'Bảo mật cá nhân'), ('Hồ sơ PDF', 'Nộp tòa án/hòa giải')]
        },
        'hero': {
            'es': {
                'eyebrow': 'Caso de uso · Disputas de alquiler y derechos del inquilino',
                'headline': 'Proteja sus derechos de arrendamiento con un <em>expediente acústico objetivo</em>.',
                'lead': '¿Atrapado en un piso con paredes de papel, falsas promesas del propietario o ruidos insoportables de vecinos? No pierda su fianza. Construya un dosier acústico organizado antes de acudir al propietario, la agencia inmobiliaria o el tribunal arbitral.'
            },
            'de': {
                'eyebrow': 'Anwendungsfall · Mietrecht &amp; Mieterschutz',
                'headline': 'Sichern Sie Ihre Mieterrechte mit einem <em>lückenlosen akustischen Lärmprotokoll</em>.',
                'lead': 'Gefangen in einer hellhörigen Wohnung mit permanentem Nachbarschaftslärm oder uneinsichtigen Vermietern? Riskieren Sie nicht Ihre Kaution. Erstellen Sie ein beweissicheres Lärmprotokoll für Mietminderungen, Abmahnungen oder die fristlose Kündigung.'
            },
            'fr': {
                'eyebrow': 'Cas d’usage · Litiges locatifs &amp; droits des locataires',
                'headline': 'Défendez vos droits de locataire avec un <em>dossier de preuves acoustiques irréfutable</em>.',
                'lead': 'Piégé dans un logement mal isolé, promesses non tenues du bailleur ou nuisances incessantes ? Ne perdez pas votre dépôt de garantie. Constituez un dossier rigoureux pour négocier une baisse de loyer, résilier sans préavis ou saisir la commission de conciliation.'
            },
            'ja': {
                'eyebrow': '利用シーン · 賃貸トラブル・契約解除・敷金返還',
                'headline': '壁が薄く深夜も眠れない賃貸の苦痛から、<em>客観的な声学証拠で敷金を全額回収</em>。',
                'lead': '管理会社や大家が遮音性の低さを隠していたり、隣人の騒音で不眠症になっても、「自己都合退去だから違約金と敷金没収」と言われていませんか？民法の平穏居住権侵害を立証する連続測定データと水印写真で、正当な権利を勝ち取ります。'
            },
            'ko': {
                'eyebrow': '활용 사례 · 임대차 분쟁, 중도 해지 및 보증금 반환',
                'headline': '방음 불량으로 밤마다 고통받는 월세·전세, <em>객관적 소음 증거로 보증금 전액 반환</em>.',
                'lead': '집주인이나 부동산의 방음 기만, 이웃의 야간 소음으로 수면권을 박탈당했는데 중도 퇴거 위약금을 요구받고 계신가요? 민법상 계약 목적 달성 불가 및 임대인의 수선의무 불이행을 입증할 수 있는 공인 양식 보고서로 보증금을 안전하게 돌려받으세요.'
            },
            'th': {
                'eyebrow': 'กรณีการใช้งาน · ข้อพิพาทการเช่าและการคุ้มครองสิทธิผู้เช่า',
                'headline': 'ปกป้องสิทธิของคุณในฐานะผู้เช่าด้วย<em>หลักฐานระดับเสียงที่ปฏิเสธไม่ได้</em>.',
                'lead': 'ติดอยู่ในห้องเช่าที่ผนังบางจนนอนไม่ได้ เจ้าของห้องไม่สนใจ และขู่จะยึดเงินมัดจำ? สร้างแฟ้มหลักฐานเสียงที่มีรูปถ่ายและพิกัดเพื่อขอยกเลิกสัญญาโดยไม่เสียค่าปรับและได้เงินมัดจำคืนเต็มจำนวน.'
            },
            'vi': {
                'eyebrow': 'Trường hợp sử dụng · Tranh chấp thuê nhà &amp; bảo vệ quyền lợi người thuê',
                'headline': 'Bảo vệ quyền lợi thuê nhà của bạn với <em>hồ sơ âm học đầy đủ căn cứ pháp lý</em>.',
                'lead': 'Mắc kẹt trong căn hộ cách âm kém không thể ngủ, chủ nhà thoái thác trách nhiệm và dọa trừ tiền cọc? Lập hồ sơ đo đạc khoa học để đàm phán giảm giá thuê hoặc đơn phương chấm dứt hợp đồng hợp pháp mà không bị mất tiền cọc.'
            }
        },
        'table': {
            'title': {
                'es': 'Baremos de habitabilidad y disfrute pacífico en arrendamientos',
                'de': 'Referenzwerte für Wohnwertminderung und vertragsgemäßen Mietgebrauch',
                'fr': 'Seuils d’habitabilité et de jouissance paisible du logement loué',
                'ja': '賃貸住宅の平穏居住権・受忍限度と契約解除基準',
                'ko': '임대차 주택 수면권·정온 환경 기준 및 계약 해지 판정 기준',
                'th': 'เกณฑ์มาตรฐานความสงบสุขและการอยู่อาศัยในห้องเช่า',
                'vi': 'Quy chuẩn môi trường sống yên tĩnh & căn cứ xử lý vi phạm hợp đồng thuê'
            },
            'lead': {
                'es': 'Compare sus mediciones con los criterios de habitabilidad de la legislación de arrendamientos urbanos y la jurisprudencia arbitral.',
                'de': 'Vergleichen Sie Ihre Messwerte mit den Maßstäben der Mietminderungstabellen und der BGH-Rechtsprechung.',
                'fr': 'Comparez vos mesures aux obligations légales de délivrance d’un logement décent et aux barèmes de conciliation.',
                'ja': '測定デシベル値を民法上の賃貸借契約履行基準および裁判所の受忍限度判例と照合します。',
                'ko': '실측 소음 수치를 민법 제623조 임대인의 의무 및 법원 임대차 분쟁 조정 기준과 대조하세요.',
                'th': 'เปรียบเทียบระดับเสียงที่วัดได้กับมาตรฐานสัญญาเช่าและคำพิพากษาคดีผู้บริโภค.',
                'vi': 'So sánh số liệu đo với quy định về điều kiện nhà ở tối thiểu và luật dân sự hiện hành.'
            },
            'headers': {
                'es': ['Nivel medido', 'Situación residencial', 'Estado de habitabilidad legal', 'Acción recomendada'],
                'de': ['Messwert', 'Wohnsituation', 'Rechtlicher Mietstatus', 'Rechtliche Handhabe'],
                'fr': ['Niveau mesuré', 'Situation locative', 'Statut juridique d’habitabilité', 'Recours possible'],
                'ja': ['実測音圧レベル', '居住環境の実態', '契約履行および受忍限度判定', '法的救済・対抗措置'],
                'ko': ['실측 소음치', '주거 환경 실태', '민법상 안녕 주거 상태 판정', '법적 구제 조치'],
                'th': ['ระดับเสียงที่วัดได้', 'สภาพความเป็นอยู่จริง', 'สถานะทางกฎหมายตามสัญญาเช่า', 'แนวทางดำเนินการ'],
                'vi': ['Mức đo thực tế', 'Hiện trạng phòng trọ/căn hộ', 'Tình trạng pháp lý hợp đồng', 'Biện pháp can thiệp']
            },
            'rows': {
                'es': [
                    ('< 35 dBA', 'Ambiente normal con ventanas y puertas cerradas', 'Cumple el derecho al disfrute pacífico implícito en todo contrato de alquiler', 'badge-safe', 'Línea de base habitable'),
                    ('40 – 48 dBA', 'Conversaciones de vecinos y fontanería audibles a través de tabiques', 'Aislamiento deficiente (Rw < 45 dB); defecto acústico que fundamenta reducción de renta', 'badge-mild', 'Defecto acústico'),
                    ('52 – 62 dBA', 'Televisión penetrante y pisadas sobre forjados no aislados', 'Interferencia sustancial en el confort ordinario; base para requerimiento formal de subsanación', 'badge-moderate', 'Incumplimiento contractual'),
                    ('65 – 75 dBA', 'Gritos continuos a medianoche, vibraciones de bombas o maquinaria', 'Inhabitabilidad sobrevenida; habilita la rescisión de contrato sin penalización', 'badge-severe', 'Causa de rescisión legal'),
                    ('80+ dBA', 'Ruidos industriales en planta baja o actividad comercial ilícita', 'Vulneración grave e inmediata; da derecho a resolución urgente y restitución total de fianza', 'badge-severe', 'Devolución total fianza')
                ],
                'de': [
                    ('< 35 dBA', 'Normale Nachtruhe bei geschlossenen Fenstern', 'Erfüllt den vertragsgemäßen Zustand und gewährleistet erholsamen Schlaf', 'badge-safe', 'Vertragsgemäß'),
                    ('40 – 48 dBA', 'Normale Nachbargespräche durch hellhörige Wände deutlich hörbar', 'Mangelhafte Schalldämmung; berechtigt zu Mietminderung von 5% bis 10%', 'badge-mild', 'Akustischer Mangel'),
                    ('52 – 62 dBA', 'Lautes Trampeln auf ungedämmten Decken, TV-Ton durch Wände', 'Erhebliche Beeinträchtigung; Mängelanzeige mit Fristsetzung zur Abhilfe erforderlich', 'badge-moderate', 'Erheblicher Mangel'),
                    ('65 – 75 dBA', 'Regelmäßiger Nachtlärm, laute Schreie, mechanische Vibrationen', 'Gesundheitsgefährdender Mangel; berechtigt zur fristlosen Kündigung nach § 569 BGB', 'badge-severe', 'Fristlose Kündigung'),
                    ('80+ dBA', 'Gewerbelärm im Wohnhaus, unzumutbare Erschütterungen', 'Vollständige Unbewohnbarkeit; sofortige Kündigung, volle Kautionsrückzahlung & Schadensersatz', 'badge-severe', 'Volle Rückzahlung')
                ],
                'fr': [
                    ('< 35 dBA', 'Repos normal portes et fenêtres closes, fond sonore très faible', 'Respecte l’obligation de délivrance d’un logement paisible et décent', 'badge-safe', 'Logement décent'),
                    ('40 – 48 dBA', 'Conversations normales des voisins audibles à travers les cloisons', 'Défaut manifeste d’isolation phonique ; motif légitime de demande de minoration de loyer', 'badge-mild', 'Défaut d’isolation'),
                    ('52 – 62 dBA', 'Pas lourds résonnant dans le plancher, télévision perçue distinctement', 'Trouble anormal de voisinage engageant la responsabilité du bailleur', 'badge-moderate', 'Manquement contractuel'),
                    ('65 – 75 dBA', 'Cris nocturnes répétés, bruits d’équipements collectifs assourdissants', 'Atteinte caractérisée à la santé et au repos ; justifie un préavis réduit ou une résiliation', 'badge-severe', 'Motif de résiliation'),
                    ('80+ dBA', 'Nuisance industrielle continue ou fête clandestine permanente', 'Inhabitabilité avérée ; résiliation judiciaire immédiate et restitution intégrale de la caution', 'badge-severe', 'Restitution intégrale')
                ],
                'ja': [
                    ('< 35 dBA', '窓やドアを閉め切った正常な夜間安静環境', '賃貸借契約に基づく通常の居住・睡眠環境を満たしている基準状態', 'badge-safe', '契約履行・正常'),
                    ('40 – 48 dBA', '隣室の通常の会話や給排水音が壁越しに筒抜けで聞こえる', '界壁の遮音性能不足（D値不良）；契約上の瑕疵に該当し、家賃減額請求の対象', 'badge-mild', '遮音瑕疵・減額対象'),
                    ('52 – 62 dBA', '足音が天井からダイレクトに響き、テレビの音が室内に侵入', '平穏な居住を著しく阻害；貸主に対して改善要求および内容証明送付の事由', 'badge-moderate', '契約不履行・催告'),
                    ('65 – 75 dBA', '深夜の叫び声、パーティー、階下の機械・ポンプ振動が継続', '民法第606条・第611条に基づく受忍限度超過；違約金なしの中途解約事由', 'badge-severe', '無責解約事由成立'),
                    ('80+ dBA', '違法民泊や重機並みの騒音で居住が完全に不可能な状態', '重大な契約違反；敷金・礼金の全額即時返還および転居費用の損害賠償請求が可能', 'badge-severe', '敷金全額即時返還')
                ],
                'ko': [
                    ('< 35 dBA', '창문과 문을 닫은 정상적인 야간 수면 상태', '임대차계약에 따른 정상적인 주거 용도 및 쾌적한 주거권 충족', 'badge-safe', '정상 주거 상태'),
                    ('40 – 48 dBA', '옆집의 일상 대화나 배수 소음이 벽체를 통해 명확히 들림', '세대 간 경계벽 차음 성능 미달; 하자 담보책임에 따른 차임(월세) 감액 청구 가능', 'badge-mild', '방음 하자 감액 대상'),
                    ('52 – 62 dBA', '위층 발망치 진동 및 TV 소음이 방안 전체를 울림', '통상적 주거 생활의 현저한 방해; 임대인에게 하자 보수의무 이행 최고 사유', 'badge-moderate', '계약 위반 시정 최고'),
                    ('65 – 75 dBA', '심야 고성방가 및 모터 진동으로 만성 수면장애 유발', '민법 제623조 임대인의 의무 위반; 위약금 없는 즉시 중도 계약 해지 사유', 'badge-severe', '위약금 없는 즉시 해지'),
                    ('80+ dBA', '불법 상가 소음 및 기계 진동으로 도저히 생활이 불가능한 상태', '임대인의 중대한 채무불이행; 보증금 전액 즉시 반환 및 이사비 손해배상 청구', 'badge-severe', '보증금 전액 즉시 반환')
                ],
                'th': [
                    ('< 35 dBA', 'สภาพห้องปกติเมื่อปิดประตูหน้าต่างสนิท', 'ตรงตามเงื่อนไขสัญญาเช่าและสิทธิการอยู่อาศัยที่สงบสุข', 'badge-safe', 'สภาพปกติ'),
                    ('40 – 48 dBA', 'ได้ยินเสียงพูดคุยข้างห้องหรือเสียงท่อระบายน้ำผ่านผนังชัดเจน', 'ผนังห้องไม่มีฉนวนกันเสียงที่ดีพอ มีสิทธิขอลดหย่อนค่าเช่า', 'badge-mild', 'มีข้อบกพร่องด้านเสียง'),
                    ('52 – 62 dBA', 'เสียงเดินลงส้นเท้าหรือเสียงทีวีทะลุเข้ามาในห้องนอนอย่างต่อเนื่อง', 'รบกวนการใช้ชีวิตอย่างร้ายแรง เป็นเหตุให้ออกหนังสือแจ้งเจ้าของห้องแก้ไข', 'badge-moderate', 'ผิดสัญญาเช่า'),
                    ('65 – 75 dBA', 'เสียงกรีดร้อง ทะเลาะวิวาท หรือเครื่องจักรดังยามดึกเป็นประจำ', 'ส่งผลเสียต่อสุขภาพอย่างรุนแรง ขอยกเลิกสัญญาเช่าได้ทันทีโดยไม่เสียค่าปรับ', 'badge-severe', 'ยกเลิกสัญญาได้ทันที'),
                    ('80+ dBA', 'เสียงเครื่องจักรขนาดใหญ่ในอาคาร หรือการกระทำผิดกฎหมายของห้องข้างเคียง', 'ห้องไม่สามารถอยู่อาศัยได้ เจ้าของห้องต้องคืนเงินมัดจำเต็มจำนวนและชดใช้ค่าเสียหาย', 'badge-severe', 'คืนมัดจำเต็มจำนวน')
                ],
                'vi': [
                    ('< 35 dBA', 'Không gian nghỉ ngơi bình thường khi đóng kín cửa', 'Đảm bảo quyền cư trú yên tĩnh theo đúng thỏa thuận hợp đồng thuê', 'badge-safe', 'Tiêu chuẩn ở bình thường'),
                    ('40 – 48 dBA', 'Tiếng nói chuyện phòng bên cạnh nghe rõ qua vách tường mỏng', 'Khả năng cách âm của vách ngăn kém; cơ sở để yêu cầu giảm tiền thuê phòng', 'badge-mild', 'Lỗi cách âm công trình'),
                    ('52 – 62 dBA', 'Tiếng bước chân nện sàn và âm thanh tivi dội thẳng vào phòng ngủ', 'Gây cản trở sinh hoạt nghiêm trọng; yêu cầu chủ nhà can thiệp khắc phục', 'badge-moderate', 'Vi phạm thỏa thuận thuê'),
                    ('65 – 75 dBA', 'Tiếng la hét nửa đêm, tiệc tùng hoặc máy móc rung chuyển phòng', 'Ảnh hưởng nghiêm trọng sức khỏe; đủ điều kiện đơn phương hủy hợp đồng', 'badge-severe', 'Đủ điều kiện hủy hợp đồng'),
                    ('80+ dBA', 'Tiếng ồn máy móc công nghiệp hoặc quán bar hoạt động trái phép', 'Môi trường hoàn toàn không thể cư trú; đòi lại 100% tiền cọc và bồi thường', 'badge-severe', 'Hoàn trả 100% tiền cọc')
                ]
            }
        },
        'steps': {
            'title': {
                'es': 'Cómo preparar un caso pericial para resolver su disputa de alquiler',
                'de': 'In 4 Schritten zum beweissicheren Mietstreit-Dossier',
                'fr': 'Comment constituer un dossier solide pour faire valoir vos droits de locataire',
                'ja': '敷金を確実に回収し無責退去するための4ステップ',
                'ko': '보증금을 안전하게 지키고 위약금 없이 해지하는 4단계 절차',
                'th': 'ขั้นตอนการรวบรวมหลักฐานเพื่อยกเลิกสัญญาและได้เงินมัดจำคืน',
                'vi': 'Quy trình 4 bước lập hồ sơ lấy lại tiền cọc và hủy hợp đồng thuê'
            },
            'lead': {
                'es': 'Los arrendadores suelen desestimar quejas verbales. Siga este procedimiento documentado para proteger su dinero.',
                'de': 'Vermieter und Makler ignorieren oft emotionale E-Mails. Mit dieser Methodik schaffen Sie rechtssichere Tatsachen.',
                'fr': 'Les bailleurs minimisent souvent les réclamations verbales. Voici la méthode pour établir des faits incontestables.',
                'ja': '口頭や感情的なクレームは無視されがちです。法的効力を持つ手順で証拠を固め、交渉を有利に進めます。',
                'ko': '구두 항의나 감정적인 메시지는 무시당하기 쉽습니다. 법적 효력을 갖추는 표준 절차로 대응하세요.',
                'th': 'เจ้าของห้องมักปฏิเสธการร้องเรียนทางวาจา ปฏิบัติตามขั้นตอนนี้เพื่อสร้างหลักฐานทางกฎหมาย.',
                'vi': 'Chủ nhà thường bỏ qua các lời phàn nàn qua miệng. Thực hiện các bước này để tạo bằng chứng có giá trị pháp lý.'
            },
            'items': {
                'es': [
                    ('1', '📅', 'Registre un historial de 7 a 14 días', 'Documente las molestias de 1 a 2 semanas. Los tribunales descartan eventos aislados, pero un historial continuo acredita el incumplimiento del contrato.'),
                    ('2', '📸', 'Fotografíe puertas y ventanas cerradas', 'Utilice la cámara de custodia para certificar que las mediciones se realizan con todo cerrado, acreditando que el ruido penetra en la vivienda.'),
                    ('3', '⚖️', 'Calcule la tasa de exceso en horas de descanso', 'Obtenga el porcentaje de horas nocturnas en que el ruido supera los 45 dBA para ofrecer un dato objetivo e objetivo a mediadores y jueces.'),
                    ('4', '📑', 'Adjunte el informe a un burofax o requerimiento formal', 'Exporte el informe oficial en PDF con firma SHA-256 y adjúntelo a su requerimiento formal de resolución o reducción de fianza.')
                ],
                'de': [
                    ('1', '📅', 'Führen Sie ein 7- bis 14-tägiges Lärmprotokoll', 'Einmalige Vorfälle werden als Bagatellen abgetan. Erst eine lückenlose 1-2-wöchige Messreihe belegt die unzumutbare Störung des Mietgebrauchs.'),
                    ('2', '📸', 'Dokumentieren Sie geschlossene Fenster und Türen', 'Erfassen Sie mit dem Fotostempel Fotos bei geschlossenen Fenstern, um zu belegen, dass der Lärm die Bausubstanz durchdringt.'),
                    ('3', '⚖️', 'Ermitteln Sie die Überschreitungsquote der Ruhezeiten', 'Analysieren Sie, wie oft die Grenzwerte während der gesetzlichen Nachtruhe überschritten werden, als konkrete Verhandlungsgrundlage.'),
                    ('4', '📑', 'Fügen Sie das PDF-Dossier der Mängelanzeige bei', 'Übermitteln Sie das unmanipulierbare PDF-Gutachten mit SHA-256-Hash zusammen mit Ihrer Abmahnung per Einwurf-Einschreiben.')
                ],
                'fr': [
                    ('1', '📅', 'Consignez les nuisances sur 7 à 14 jours', 'Les bailleurs rejettent les faits isolés. Une série de relevés sur 2 semaines prouve la récurrence du trouble de jouissance.'),
                    ('2', '📸', 'Photographiez l’état des fenêtres et portes fermées', 'Prenez des photos certifiées prouvant que les mesures ont été effectuées fenêtres fermées, attestant le défaut d’isolation.'),
                    ('3', '⚖️', 'Calculez le taux de dépassement nocturne', 'Établissez le pourcentage d’heures de repos où le niveau dépasse 45 dBA, argument clé pour la commission de conciliation.'),
                    ('4', '📑', 'Joignez le rapport PDF à votre mise en demeure', 'Téléchargez le dossier PDF officiel avec empreinte SHA-256 et annexez-le à votre courrier recommandé avec accusé de réception.')
                ],
                'ja': [
                    ('1', '📅', '7〜14日間の連続モニタリングを実施', '1回きりの測定では「たまたま」と言い逃れされます。1〜2週間の深夜データを蓄積し、反復・継続的な居住被害を立証します。'),
                    ('2', '📸', '窓・ドアを閉めた状態で測定水印写真を撮影', '窓やカーテンを閉め切った状態でアプリ内カメラを起動し、日時・GPS・リアルタイムdBA入りの写真を撮影して遮音瑕疵を証明します。'),
                    ('3', '⚖️', '夜間基準超過率を算出し受忍限度超過を数値化', '夜間（22時〜翌6時）に45dBAを超過した時間割合をレポート化し、裁判外紛争解決（ADR）や調停委員へ提示します。'),
                    ('4', '📑', '公式PDFを内容証明郵便に添付して送付', '改ざん不可能なSHA-256署名付きPDFレポートを印刷し、契約解除通知や敷金返還請求書に添付して貸主・管理会社へ郵送します。')
                ],
                'ko': [
                    ('1', '📅', '7일~14일간 연속 소음 일지 기록', '단발성 녹음은 임대인이 억지 변명으로 일축합니다. 1~2주간의 연속 심야 데이터를 수집하여 상습적인 거주 방해를 입증하세요.'),
                    ('2', '📸', '문과 창문을 닫은 실내 상태 사진 채증', '창문과 문이 완전히 닫힌 방안 상태에서 실시간 데시벨, 시간, GPS가 각인된 사진을 촬영하여 방음 하자임을 명확히 합니다.'),
                    ('3', '⚖️', '야간 안녕 기준 초과율 통계 산출', '수면 시간대 동안 실내 소음이 45 dBA를 초과한 빈도와 지속시간을 수치화하여 임대차분쟁조정위원회에 제출할 정량 지표를 확보합니다.'),
                    ('4', '📑', 'SHA-256 정식 PDF를 내용증명에 첨부 발송', '위변조 방지 해시가 포함된 공식 리포트를 출력하여 임대차 계약 해지 통고서 및 보증금 반환 청구 내용증명에 첨부하세요.')
                ],
                'th': [
                    ('1', '📅', 'บันทึกข้อมูลต่อเนื่อง 7 ถึง 14 วัน', 'การบันทึกครั้งเดียวเจ้าของห้องมักอ้างว่าเป็นเรื่องบังเอิญ การบันทึก 1-2 สัปดาห์จะพิสูจน์ได้ว่าปัญหานี้เกิดขึ้นซ้ำซาก.'),
                    ('2', '📸', 'ถ่ายภาพยืนยันการปิดประตูหน้าต่างสนิท', 'ใช้กล้องบันทึกภาพพร้อมประทับค่าเสียง วันเวลา และพิกัด เพื่อพิสูจน์ว่าเสียงดังทะลุเข้ามาในห้องแม้จะปิดหน้าต่างแล้ว.'),
                    ('3', '⚖️', 'คำนวณอัตราความถี่ที่เสียงเกินเกณฑ์', 'แสดงข้อมูลเปอร์เซ็นต์ช่วงเวลากลางคืนที่มีเสียงเกิน 45 dBA เพื่อเป็นหลักฐานทางวิทยาศาสตร์ในการเจรจา.'),
                    ('4', '📑', 'แนบรายงาน PDF ฉบับสมบูรณ์ไปกับหนังสือเตือน', 'ดาวน์โหลดรายงาน PDF ที่มีรหัส SHA-256 แล้วแนบไปกับหนังสือแจ้งยกเลิกสัญญาเช่าและขอคืนเงินมัดจำ.')
                ],
                'vi': [
                    ('1', '📅', 'Theo dõi và ghi nhận liên tục từ 7 đến 14 ngày', 'Ghi nhận một lần rất dễ bị chủ nhà phủ nhận. Ghi nhật ký 1-2 tuần chứng minh vi phạm mang tính hệ thống và kéo dài.'),
                    ('2', '📸', 'Chụp ảnh căn phòng khi đã đóng kín cửa', 'Sử dụng máy ảnh chống giả mạo ghi nhận việc đo đạc được thực hiện khi đóng kín cửa sổ, chứng minh lỗi cách âm.'),
                    ('3', '⚖️', 'Tính toán tỷ lệ vượt ngưỡng trong giờ nghỉ', 'Xác định tỷ lệ phần trăm thời gian ban đêm có tiếng ồn vượt 45 dBA làm số liệu thuyết phục ban hòa giải hoặc luật sư.'),
                    ('4', '📑', 'Đính kèm bản báo cáo PDF vào thông báo chấm dứt hợp đồng', 'Xuất báo cáo PDF có mã băm SHA-256 đính kèm vào thư thông báo trả nhà và yêu cầu hoàn trả đầy đủ tiền đặt cọc.')
                ]
            }
        },
        'features': {
            'title': {
                'es': 'Herramientas periciales para proteger sus derechos de inquilino',
                'de': 'Funktionen zum Schutz von Mieterrechten und Kaution',
                'fr': 'Fonctionnalités dédiées à la défense des locataires',
                'ja': '賃貸トラブル・敷金回収に特化した実用機能',
                'ko': '임차인의 권리 보호와 보증금 반환을 위한 특화 기능',
                'th': 'ฟังก์ชันที่ออกแบบมาเพื่อปกป้องสิทธิผู้เช่า',
                'vi': 'Các tính năng bảo vệ quyền lợi người thuê nhà'
            },
            'lead': {
                'es': 'Equipado con herramientas específicas para negociar rebajas de renta o la rescisión de contrato sin penalizaciones.',
                'de': 'Entwickelt, um Mietern rechtssichere Verhandlungsvorteile für Kautionsrückzahlung oder Mietminderung zu verschaffen.',
                'fr': 'Des outils conçus pour négocier sereinement une réduction de loyer ou une résiliation sans indemnité.',
                'ja': '不当な違約金請求や敷金没収を阻止し、正当な権利を主張するためのプロ仕様ツール。',
                'ko': '부당한 위약금 공제를 방어하고 신속한 보증금 반환을 이끌어내기 위한 실전 기능입니다.',
                'th': 'เครื่องมือที่ช่วยให้คุณเจรจาขอลดค่าเช่าหรือยกเลิกสัญญาได้โดยไม่ต้องเสียเงินมัดจำ.',
                'vi': 'Công cụ giúp người thuê nhà có đầy đủ cơ sở yêu cầu giảm tiền thuê hoặc hủy hợp đồng lấy lại cọc.'
            },
            'items': {
                'es': [
                    ('📜', 'Dosier estructurado de habitabilidad', 'Formatea las mediciones conforme a las cláusulas estándar de habitabilidad y disfrute pacífico de la ley de arrendamientos.'),
                    ('📸', 'Fotos certificadas con ventana cerrada', 'Estampa decibelios, fecha y geolocalización en las fotos del dormitorio para neutralizar el pretexto de que dejó la ventana abierta.'),
                    ('🌙', 'Vigilancia nocturna desatendida', 'Deje el teléfono monitorizando toda la noche. Detecta automáticamente golpes y ruidos súbitos para registrar el insomnio sufrido.'),
                    ('📊', 'Cálculo de percentiles y picos Lmax', 'Desglosa valores LAeq, L10 y picos máximos para diferenciar el ruido ambiental constante de ruidos intrusivos de vecinos.'),
                    ('🔒', 'Privacidad total sin almacenamiento en nube', 'Las grabaciones, notas del contrato y datos de la vivienda permanecen en la memoria local de su dispositivo. Privacidad absoluta.'),
                    ('💾', 'Exportación de expediente pericial en PDF', 'Genere un PDF completo sin marcas de agua con hash criptográfico SHA-256 para presentarlo en juntas arbitrales o tribunales.')
                ],
                'de': [
                    ('📜', 'Dossier für Wohnwertminderung & Kündigung', 'Bereitet Messdaten strukturiert für Mietminderungsanträge und Kündigungsschreiben nach BGB auf.'),
                    ('📸', 'Fotostempel bei geschlossenem Fenster', 'Beweist durch Einblendung von dBA, Uhrzeit und GPS-Ort, dass der Lärm trotz geschlossener Fenster die Grenzwerte bricht.'),
                    ('🌙', 'Automatische Nachtüberwachung', 'Läuft die ganze Nacht im Hintergrund und erfasst Ruhestörungen und Schlafunterbrechungen automatisch.'),
                    ('📊', 'Statistische Perzentile & Lmax-Spitzen', 'Unterscheidet präzise zwischen normalem Grundgeräuschpegel und unzumutbaren Störspitzen im Wohnbereich.'),
                    ('🔒', '100% lokale Datenspeicherung', 'Keine sensiblen Aufnahmen oder Adressdaten verlassen Ihr Smartphone. Absolute Vertraulichkeit vor Dritten.'),
                    ('💾', 'PDF-Gutachten mit SHA-256 Prüfsumme', 'Erzeugt manipulationssichere PDF-Dateien für Schlichtungsstellen, Mietervereine oder Fachanwälte für Mietrecht.')
                ],
                'fr': [
                    ('📜', 'Dossier de constat de jouissance paisible', 'Met en forme les mesures selon les critères juridiques du décret sur le logement décent et le code civil.'),
                    ('📸', 'Photos horodatées fenêtres closes', 'Inscrit le niveau sonore, l’heure et la position sur les clichés de la pièce pour prouver l’imperméabilité acoustique déficiente.'),
                    ('🌙', 'Surveillance automatique de la nuit', 'Surveille l’environnement sonore pendant votre sommeil et archive chaque émergence anormale.'),
                    ('📊', 'Analyse statistique et pics Lmax', 'Distingue objectivement le bruit résiduel ambiant des pics de bruits d’impact de l’immeuble.'),
                    ('🔒', 'Confidentialité totale sans serveur distant', 'Toutes les données restent stockées dans la mémoire locale de votre navigateur sans aucun transfert.'),
                    ('💾', 'Dossier probatoire PDF avec hash SHA-256', 'Édite un rapport prêt à l’emploi pour la commission départementale de conciliation ou votre avocat.')
                ],
                'ja': [
                    ('📜', '平穏居住権侵害立証レポート', '民法の賃貸借瑕疵責任および受忍限度論に基づき、客観データを法的に整理された構成で出力。'),
                    ('📸', '閉窓確認タイムスタンプ付き水印カメラ', '窓やサッシが施錠された状態を撮影し、瞬時デシベル・時間・GPSを焼き込んで「開窓責任」の口実を完全封殺。'),
                    ('🌙', '就寝中の自動夜間モニタリング', '枕元に置くだけで夜間の突発的な足音や物音を自動検知し、睡眠被害の発生状況を客観的に記録。'),
                    ('📊', '統計パーセンタイル（L10/L50/L90）解析', '日常の定常環境騒音と、隣人の突発的な違反音（衝撃音・叫び声）を明確に峻別して証明。'),
                    ('🔒', '完全端末ローカル保存でプライバシー保護', '部屋の間取りやプライベートな測定記録は端末のIndexedDB内のみに保持。外部流出の懸念はゼロ。'),
                    ('💾', '改ざん防止SHA-256署名付きPDF出力', '裁判所、少額訴訟、弁護士、消費生活センターへそのまま提出可能な証拠資料をワンタップで作成。')
                ],
                'ko': [
                    ('📜', '평온한 주거권 침해 소명 리포트', '임대차보호법 및 민법상 하자담보책임 조항에 맞추어 전문적인 법률 소명 서식으로 데이터를 자동 구성합니다.'),
                    ('📸', '창문 폐쇄 상태 워터마크 증거 카메라', '창문이 닫힌 방안 상태에서 실시간 데시벨, 시각, GPS를 사진에 각인하여 환기창 핑계를 사전에 차단합니다.'),
                    ('🌙', '수면 중 심야 자동 감시 모드', '취침 중 머리맡에 스마트폰을 두면 기준치를 초과하는 충격 소음을 자동 감지하여 수면 박탈 기록을 축적합니다.'),
                    ('📊', '통계적 백분위수 및 Lmax 분석', '통상적인 주택 기저 소음과 이웃의 돌발적인 충격 소음(발망치, 고성)을 명확하게 분리 검증합니다.'),
                    ('🔒', '클라우드 전송 없는 100% 로컬 보안', '민감한 실내 사진, 호수 정보, 음성 데이터는 기기 내부 브라우저 저장소에만 안전하게 보관됩니다.'),
                    ('💾', 'SHA-256 무결성 검증 PDF 즉시 출력', '분쟁조정위원회, 법원 지급명령, 변호사 상담 시 바로 활용할 수 있는 워터마크 없는 보고서를 생성합니다.')
                ],
                'th': [
                    ('📜', 'แฟ้มรายงานการละเมิดสิทธิการอยู่อาศัย', 'จัดโครงสร้างข้อมูลตามหลักกฎหมายคุ้มครองผู้บริโภคและสัญญาเช่ามาตรฐาน.'),
                    ('📸', 'ภาพถ่ายประทับค่ายืนยันการปิดหน้าต่าง', 'บันทึกภาพพร้อมข้อมูลเดซิเบล วันเวลา และพิกัด เพื่อป้องกันข้ออ้างว่าเปิดหน้าต่างรับเสียงภายนอก.'),
                    ('🌙', 'ระบบตรวจจับเสียงรบกวนยามค่ำคืนอัตโนมัติ', 'เปิดเครื่องทิ้งไว้ขณะนอนหลับ เพื่อบันทึกเสียงกระแทกหรือเสียงรบกวนที่ปลุกคุณให้ตื่น.'),
                    ('📊', 'วิเคราะห์สถิติระดับเสียงและค่าพีค Lmax', 'แยกแยะระหว่างเสียงบรรยากาศปกติกับเสียงรบกวนเฉียบพลันได้อย่างชัดเจน.'),
                    ('🔒', 'จัดเก็บในเครื่อง 100% ไม่ส่งข้อมูลขึ้นคลาวด์', 'ภาพถ่ายและข้อมูลส่วนตัวจะถูกเก็บไว้ในอุปกรณ์ของคุณเท่านั้นเพื่อความเป็นส่วนตัวสูงสุด.'),
                    ('💾', 'ส่งออกรายงาน PDF พร้อมรหัสตรวจสอบ SHA-256', 'สร้างเอกสารสรุปหลักฐานที่พร้อมพิมพ์หรือส่งต่อให้นักกฎหมายได้ในคลิกเดียว.')
                ],
                'vi': [
                    ('📜', 'Hồ sơ chứng minh vi phạm quyền cư trú', 'Định dạng dữ liệu đo đạc theo các điều khoản bảo vệ người tiêu dùng và hợp đồng thuê chuẩn.'),
                    ('📸', 'Chụp ảnh có dấu khi đã đóng kín cửa', 'Đóng dấu số liệu decibel, thời gian và tọa độ GPS lên ảnh phòng để ngăn chặn việc bị đổ lỗi do mở cửa sổ.'),
                    ('🌙', 'Chế độ giám sát ban đêm tự động', 'Để điện thoại theo dõi suốt đêm để ghi lại các tiếng va đập đột ngột gây mất ngủ.'),
                    ('📊', 'Phân tích thống kê và các đỉnh xung Lmax', 'Phân tách rõ ràng giữa tiếng ồn nền thông thường và các đợt tiếng ồn do hàng xóm gây ra.'),
                    ('🔒', 'Bảo mật cục bộ 100% không qua máy chủ', 'Mọi dữ liệu nhạy cảm về căn phòng của bạn được lưu an toàn trên bộ nhớ trình duyệt của máy.'),
                    ('💾', 'Xuất hồ sơ PDF có mã băm toàn vẹn SHA-256', 'Tạo tài liệu hoàn chỉnh sẵn sàng in ấn nộp cơ quan công an, luật sư hoặc tổ hòa giải.')
                ]
            }
        },
        'rules': {
            'title': {
                'es': 'Cuatro reglas para rescindir el contrato y recuperar su fianza',
                'de': 'Vier Grundregeln zur Kautionssicherung bei Lärmstreitigkeiten',
                'fr': 'Quatre règles pour résilier son bail sans perdre son dépôt de garantie',
                'ja': '敷金を確実に死守し契約解除を勝ち取る4つの鉄則',
                'ko': '보증금을 지키고 원만하게 퇴거하기 위한 4대 법률 수칙',
                'th': 'กฎ 4 ข้อเพื่อยกเลิกสัญญาเช่าและรับเงินมัดจำคืน',
                'vi': 'Bốn nguyên tắc vàng để lấy lại tiền cọc và chấm dứt hợp đồng'
            },
            'lead': {
                'es': 'Los administradores de fincas cuentan con el cansancio del inquilino. Así puede invertir la carga de la prueba.',
                'de': 'Vermieter spekulieren oft auf die Erschöpfung der Mieter. So verschaffen Sie sich eine unangreifbare Verhandlungsposition.',
                'fr': 'Les gestionnaires comptent souvent sur la lassitude du locataire. Voici comment inverser le rapport de force.',
                'ja': '管理側は借主が泣き寝入りすることを計算しています。証拠で形勢を逆転させるためのポイントです。',
                'ko': '임대인과 중개업소는 세입자의 지친 심리를 이용합니다. 입증 책임을 전환하는 실전 가이드입니다.',
                'th': 'ผู้ให้เช่ามักคิดว่าผู้เช่าจะยอมแพ้ไปเอง นี่คือวิธีเปลี่ยนความได้เปรียบทางกฎหมายมาอยู่ข้างคุณ.',
                'vi': 'Chủ nhà thường trông chờ việc người thuê sẽ nản lòng. Đây là cách đảo ngược tình thế bằng chứng cứ.'
            },
            'items': {
                'es': [
                    ('📬', 'Regla 1: Establezca un requerimiento fehaciente por escrito', 'Nunca confíe en llamadas telefónicas. Envíe un correo o burofax adjuntando el informe PDF de SOUNDTEST.PRO con un plazo de subsanación de 14 días.'),
                    ('🛏️', 'Regla 2: Mida desde la zona de descanso (dormitorio)', 'Los tribunales dan especial relevancia al dormitorio. Registre las mediciones desde la cama para acreditar el impacto directo en la salud y el sueño.'),
                    ('📑', 'Regla 3: Mantenga un informe objetivo y libre de valoraciones personales', 'Deje que las cifras hablen por sí solas. Una serie de picos reiterados de 68 dBA a medianoche resulta objetivo ante cualquier juez o mediador.'),
                    ('⚖️', 'Regla 4: Conozca el valor del registro como prueba documental', 'SOUNDTEST.PRO aporta una prueba documental orientativa rigurosa. En procedimientos contenciosos de alta cuantía puede complementarse con peritaje judicial.')
                ],
                'de': [
                    ('📬', 'Regel 1: Sofort schriftliche Mängelanzeige mit Fristsetzung', 'Verlassen Sie sich nicht auf Telefonate. Senden Sie eine formelle Mängelanzeige mit PDF-Protokoll und einer Frist von 14 Tagen zur Mängelbeseitigung.'),
                    ('🛏️', 'Regel 2: Messungen im Schlafbereich durchführen', 'Gerichte bewerten Lärm im Schlafzimmer besonders streng. Platzieren Sie das Smartphone am Bett, um die Schlafstörung konkret nachzuweisen.'),
                    ('📑', 'Regel 3: Sachlich und zahlenbasiert argumentieren', 'Lassen Sie Messkurven und Dezibelzahlen für sich sprechen. Sachliche PDF-Nachweise entwaffnen den Vorwurf subjektiver Überempfindlichkeit.'),
                    ('⚖️', 'Regel 4: Beweiswert von Vor-Ort-Messungen verstehen', 'SOUNDTEST.PRO liefert eine fundierte Dokumentationsgrundlage für Mieterverein, Schlichtung und Verhandlung vor Gericht.')
                ],
                'fr': [
                    ('📬', 'Règle 1 : Établir immédiatement une trace écrite datée', 'N’agissez jamais uniquement par téléphone. Adressez une mise en demeure avec le rapport PDF de SOUNDTEST.PRO en accordant un délai de 15 jours.'),
                    ('🛏️', 'Règle 2 : Mesurer directement depuis la chambre à coucher', 'Les juges accordent une importance primordiale au sommeil. Mesurez depuis la tête de lit pour prouver l’atteinte concrète au repos.'),
                    ('📑', 'Règle 3 : Présenter des relevés neutres et factuels', 'Un rapport PDF montrant des pointes régulières à 68 dBA à 2h du matin a infiniment plus de poids qu’une description émotionnelle.'),
                    ('⚖️', 'Règle 4 : Connaître la valeur probatoire du dossier', 'SOUNDTEST.PRO fournit un élément de preuve documentaire de référence très efficace devant les commissions de conciliation.')
                ],
                'ja': [
                    ('📬', '鉄則1：電話ではなく、初回から日付入りの書面・メールで記録を残す', '口頭での苦情は「聞いていない」と言われます。測定PDFを添付したメールや書面を送り、14日間の改善催告期限を設定します。'),
                    ('🛏️', '鉄則2：被害の中心地である「寝室のベッド際」で測定する', '裁判や調停では睡眠環境が最重要視されます。リビングではなく寝室の枕元で測定し、睡眠権の侵害を明確に立証します。'),
                    ('📑', '鉄則3：感情的な悪口を書かず、数値とグラフで語らせる', '「うるさくて頭がおかしくなる」と書くより、「深夜2時に68dBAの突発音が連日記録された」という事実が決定打になります。'),
                    ('⚖️', '鉄則4：民間測定ツールの証拠価値と限界を理解する', 'SOUNDTEST.PROは示談交渉や調停、敷金返還の強力な事実証明となります。法医学的鑑定が必要な本訴では弁護士と連携してください。')
                ],
                'ko': [
                    ('📬', '수칙 1: 전화 통화 대신 반드시 내용증명이나 이메일로 시정 요구', '전화 항의는 법적 근거가 남지 않습니다. SOUNDTEST.PRO 리포트를 첨부하여 14일의 상당한 기간을 정해 내용증명으로 시정을 촉구하세요.'),
                    ('🛏️', '수칙 2: 생활과 수면의 중심인 침실 머리맡에서 측정', '법원과 분쟁조정위는 침실에서의 수면권 침해를 가장 중대하게 다룹니다. 침대 옆 협탁에서 계측하여 실질적 피해를 입증하세요.'),
                    ('📑', '수칙 3: 주관적 감정 표현을 배제하고 숫자와 그래프로 압박', '감정적 폭언은 오히려 불리하게 작용합니다. 매일 새벽 68 dBA를 기록한 데이터 그래프가 임대인의 변명을 무력화합니다.'),
                    ('⚖️', '수칙 4: 사설 측정의 증거 증명력 범위를 정확히 숙지', 'SOUNDTEST.PRO 리포트는 임대차 분쟁 조정 및 소송에서 유력한 정황·사실 증거로 채택됩니다. 형사 고소 시 전문가 자문과 병행하세요.')
                ],
                'th': [
                    ('📬', 'กฎข้อที่ 1: ติดต่อเป็นลายลักษณ์อักษรที่มีวันที่ระบุชัดเจนเสมอ', 'หลีกเลี่ยงการพูดปากเปล่า ส่งอีเมลหรือหนังสือเตือนพร้อมแนบรายงาน PDF ของ SOUNDTEST.PRO และกำหนดระยะเวลาแก้ไข 14 วัน.'),
                    ('🛏️', 'กฎข้อที่ 2: ทำการวัดในห้องนอนใกล้กับเตียง', 'เจ้าหน้าที่และศาลให้ความสำคัญกับห้องนอนมากที่สุด วางเครื่องมือวัดไว้ที่หัวเตียงเพื่อพิสูจน์ผลกระทบต่อสุขภาพและการนอนหลับ.'),
                    ('📑', 'กฎข้อที่ 3: ใช้ข้อมูลตัวเลขและกราฟแทนการระบายอารมณ์', 'ตัวเลขระดับเสียง 68 dBA ในช่วงตีสองที่เกิดขึ้นซ้ำๆ มีน้ำหนักทางกฎหมายมากกว่าการบ่นด้วยอารมณ์อย่างเทียบกันไม่ได้.'),
                    ('⚖️', 'กฎข้อที่ 4: เข้าใจขอบเขตของหลักฐานทางวิทยาศาสตร์', 'SOUNDTEST.PRO ให้หลักฐานที่เป็นข้อเท็จจริงสำหรับการไกล่เกลี่ยและการเจรจาต่อรอง หากเป็นคดีใหญ่สามารถใช้ร่วมกับการตรวจสอบเพิ่มเติมได้.')
                ],
                'vi': [
                    ('📬', 'Quy tắc 1: Luôn gửi thông báo bằng văn bản có ghi rõ ngày tháng', 'Không giải quyết bằng miệng. Gửi văn bản hoặc email kèm báo cáo PDF của SOUNDTEST.PRO và đặt thời hạn khắc phục 14 ngày.'),
                    ('🛏️', 'Quy tắc 2: Đo trực tiếp tại khu vực giường ngủ', 'Tòa án và cơ quan hòa giải đặc biệt chú trọng phòng ngủ. Đo tại đầu giường để chứng minh ảnh hưởng trực tiếp đến giấc ngủ và sức khỏe.'),
                    ('📑', 'Quy tắc 3: Để số liệu tự nói lên sự thật thay vì kể lể cảm tính', 'Biểu đồ cho thấy tiếng ồn liên tục chạm ngưỡng 68 dBA lúc 2 giờ sáng có sức nặng gấp nhiều lần những lời than phiền bằng lời.'),
                    ('⚖️', 'Quy tắc 4: Nắm vững giá trị chứng cứ của dữ liệu', 'SOUNDTEST.PRO cung cấp tài liệu kỹ thuật có giá trị chứng minh cao trong các buổi làm việc hòa giải và giải quyết tranh chấp.')
                ]
            }
        },
        'faqs': {
            'es': [
                ("¿Tienen valor legal las mediciones de sonido con el móvil en un arbitraje de alquiler?",
                 "En la mayoría de jurisdicciones los inquilinos tienen pleno derecho a documentar las condiciones de su vivienda. Los tribunales de arbitraje de arrendamientos aceptan dosieres técnicos bien fundamentados con fecha, hora y fotos certificadas como principio de prueba fehaciente."),
                ("¿Cuántos días de mediciones se recomiendan para rescindir un contrato de alquiler?",
                 "Se aconseja recopilar entre 7 y 14 días consecutivos con al menos 6 a 10 episodios críticos documentados. Demostrar un patrón reiterado e insoportable es el criterio fundamental para acreditar la inhabitabilidad sobrevenida."),
                ("¿Debo avisar al casero antes de comenzar a registrar los ruidos?",
                 "No es necesario solicitar autorización previa para medir en su propio hogar. Lo indicado es remitir el primer informe formal por escrito en cuanto se consolide el registro para acreditar la negligencia del arrendador."),
                ("¿Puedo exigir la devolución íntegra de la fianza si el piso tiene defectos graves de insonorización?",
                 "Sí, si acredita mediante un expediente objetivo que la vivienda no reúne las condiciones mínimas de habitabilidad y que el arrendador desatendió los requerimientos de subsanación.")
            ],
            'de': [
                ("Werden Smartphone-Messprotokolle bei Mietstreitigkeiten anerkannt?",
                 "Ja, als qualifizierte Sachdarstellung und substantiiertes Lärmprotokoll. Gerichte und Schlichtungsstellen verlangen eine genaue Darlegung von Art, Dauer und Intensität der Störung, was durch SOUNDTEST.PRO ideal erfüllt wird."),
                ("Wie viele Tage sollte ein Lärmprotokoll für eine Kündigung umfassen?",
                 "Empfohlen werden 7 bis 14 Tage lückenlose Erfassung mit mindestens 6 bis 10 dokumentierten Spitzenereignissen zur Unzeit, um ein chronisches Störmuster nachzuweisen."),
                ("Muss ich den Vermieter vor Beginn der Messungen informieren?",
                 "Nein, Dokumentationen in der eigenen Wohnung bedürfen keiner Ankündigung. Nach Abschluss der ersten Messreihe sollte jedoch umgehend eine schriftliche Mängelanzeige erfolgen."),
                ("Habe ich bei unerträglichem Lärm Anspruch auf die volle Kaution?",
                 "Ja. Bei berechtigter fristloser Kündigung wegen Gesundheitsgefährdung nach § 569 BGB darf die Kaution nicht als Mietausfall einbehalten werden.")
            ],
            'fr': [
                ("Les mesures acoustiques sur smartphone sont-elles recevables en commission de conciliation ?",
                 "Oui, à titre de commencement de preuve matérielle. Les commissions et tribunaux de proximité examinent avec attention les dossiers chronologiques détaillant les décibels et les heures."),
                ("Combien d’incidents faut-il consigner pour justifier un départ anticipé ?",
                 "Une période d’observation de 7 à 14 jours comprenant au moins 6 à 10 relevés nocturnes significatifs permet d’établir sans équivoque la réalité du préjudice."),
                ("Dois-je avertir mon propriétaire avant d’enregistrer les niveaux sonores ?",
                 "Non, vous êtes libre de mesurer l’ambiance acoustique de votre domicile. Il convient ensuite de lui notifier le dossier par courrier recommandé pour faire courir les délais."),
                ("Puis-je récupérer la totalité de mon dépôt de garantie en cas de résiliation pour bruit ?",
                 "Absolument, si l’inhabitabilité est établie et que le bailleur n’a pas remédié au trouble après mise en demeure, aucune retenue ne peut être appliquée.")
            ],
            'ja': [
                ("スマホで測定した騒音データは賃貸トラブルの調停や裁判で証拠になりますか？",
                 "はい、有力な状況証拠および受忍限度超過の疎明資料として十分に採用されます。日時、GPS、実測dBA、写真が一体となったレポートは、裁判所や調停委員に対して高い説得力を持ちます。"),
                ("中途解約や敷金全額返還を求めるには何日分のデータが必要ですか？",
                 "7〜14日間にわたる継続的な記録が推奨されます。少なくとも6〜10回以上の深夜騒音エピソードを立証することで、「一時的な物音」という相手方の抗弁を完全に崩せます。"),
                ("測定を始める前に大家や管理会社に告知する必要がありますか？",
                 "いいえ。自身の居室内における環境測定に事前許可は一切不要です。客観的なデータが揃った段階で、正式な書面とともに提示するのが最も効果的です。"),
                ("防音性能の著しい瑕疵を理由に、違約金なしで退去できますか？",
                 "はい。民法上の平穏居住権が著しく侵害され、催告後も改善されない場合、借主は無責で契約を解除し、敷金の全額返還を求める正当な法的権利を有します。")
            ],
            'ko': [
                ("스마트폰으로 측정한 소음 기록이 임대차 분쟁 조정이나 소송에서 증거력이 있나요?",
                 "네, 사실 관계를 입증하는 핵심 정황 증거 및 소명 자료로 적극 채택됩니다. 시간대별 데시벨 수치, 워터마크 사진, 지속 시간이 정리된 리포트는 조정위원과 판사에게 매우 강력한 신뢰를 줍니다."),
                ("중도 계약 해지와 보증금 반환을 청구하려면 며칠간의 데이터가 필요한가요?",
                 "최소 7일에서 14일간의 연속 기록이 가장 이상적입니다. 6회 이상 심야 소음 기준 초과 사실을 시계열로 입증하면 임대인의 '일시적 소음' 주장을 완벽히 차단할 수 있습니다."),
                ("계측을 시작하기 전에 집주인에게 미리 알려야 하나요?",
                 "아닙니다. 임차인이 자신의 주거 공간 내에서 환경을 측정하는 것은 완전한 자유입니다. 일주일치 객관적 데이터를 확보한 후 공식 시정 요구서와 함께 보내는 것이 유리합니다."),
                ("방음 하자를 이유로 중도 퇴거 시 위약금 없이 보증금을 다 돌려받을 수 있나요?",
                 "네. 주택의 정상적 사용이 불가능할 정도의 소음 피해가 지속되고 임대인이 수선의무를 이행하지 않은 경우, 세입자는 과실 없이 계약을 해지하고 보증금 전액 반환을 요구할 권리가 있습니다.")
            ],
            'th': [
                ("การบันทึกเสียงด้วยสมาร์ทโฟนใช้เป็นหลักฐานในการไกล่เกลี่ยข้อพิพาทได้หรือไม่?",
                 "ได้ โดยใช้เป็นหลักฐานประกอบที่มีน้ำหนักมากในการแสดงให้เห็นว่ามีความเดือดร้อนเกิดขึ้นจริง คณะกรรมการไกล่เกลี่ยข้อพิพาทจะพิจารณาข้อมูลที่มีวันเวลาและรูปถ่ายประกอบอย่างจริงจัง."),
                ("ต้องบันทึกเสียงนานกี่วันจึงจะมีน้ำหนักพอในการขอยกเลิกสัญญาเช่า?",
                 "แนะนำให้บันทึกต่อเนื่องอย่างน้อย 7 ถึง 14 วัน โดยมีเหตุการณ์รบกวนยามดึกอย่างน้อย 6 ถึง 10 ครั้ง เพื่อแสดงให้เห็นว่าเป็นปัญหาเรื้อรังที่เกิดขึ้นเป็นประจำ."),
                ("จำเป็นต้องแจ้งผู้ให้เช่าก่อนเริ่มบันทึกเสียงหรือไม่?",
                 "ไม่จำเป็น คุณมีสิทธิเต็มที่ในการบันทึกสภาพความเป็นอยู่ในห้องเช่าของคุณเอง และเมื่อมีข้อมูลพร้อมแล้วจึงส่งหนังสือแจ้งเจ้าของห้อง."),
                ("สามารถขอเงินมัดจำคืนเต็มจำนวนได้หรือไม่หากห้องเช่ามีปัญหาเรื่องเสียงอย่างรุนแรง?",
                 "สามารถทำได้ หากคุณมีหลักฐานที่พิสูจน์ได้ว่าห้องเช่าดังกล่าวไม่สามารถอยู่อาศัยได้อย่างสงบสุขตามวัตถุประสงค์แห่งสัญญาเช่า.")
            ],
            'vi': [
                ("Các số liệu đo bằng điện thoại có được chấp nhận trong hòa giải tranh chấp thuê nhà không?",
                 "Có, được dùng làm chứng cứ tài liệu quan trọng chứng minh thực tế bị quấy rầy. Hội đồng hòa giải và tòa án luôn đánh giá cao các hồ sơ có số liệu thời gian và hình ảnh cụ thể."),
                ("Cần thu thập số liệu bao nhiêu ngày để đủ căn cứ chấm dứt hợp đồng thuê?",
                 "Nên theo dõi từ 7 đến 14 ngày liên tục với ít nhất 6 đến 10 lần vi phạm nghiêm trọng vào ban đêm để chứng minh đây là tình trạng thường xuyên không thể chịu đựng."),
                ("Có cần thông báo cho chủ nhà trước khi tiến hành đo đạc không?",
                 "Không cần. Bạn có toàn quyền ghi nhận hiện trạng môi trường trong không gian phòng thuê của mình, sau đó gửi hồ sơ hoàn chỉnh cho chủ nhà."),
                ("Có thể đòi lại toàn bộ tiền đặt cọc khi hủy hợp đồng vì lý do phòng quá ồn không?",
                 "Hoàn toàn có thể, nếu bạn chứng minh được căn phòng không đáp ứng điều kiện cư trú cơ bản và chủ nhà không có biện pháp khắc phục sau khi đã được thông báo.")
            ]
        },
        'cta_band': {
            'es': ('¿Desea resolver su conflicto de alquiler con un dosier técnico objetivo?',
                   'Genere su informe pericial en PDF en 10 segundos directamente en el navegador. Sin descargas, 100% privado en su dispositivo.'),
            'de': ('Wollen Sie Ihren Mietstreit mit einem hieb- und stichfesten Nachweis beilegen?',
                   'Erstellen Sie Ihr vollständiges Lärmdossier in 10 Sekunden direkt im Browser. Keine Installation, 100% datenschutzkonform.'),
            'fr': ('Prêt à faire valoir vos droits de locataire avec un dossier solide ?',
                   'Éditez votre rapport acoustique en 10 secondes directement dans votre navigateur. Sans application, 100% confidentiel.'),
            'ja': ('客観的な声学データで、理不尽な賃貸トラブルと敷金没収を解決しませんか？',
                   '専用機器の購入もアプリのダウンロードも不要。ブラウザを開いて10秒で正式な証拠PDFを生成。100%端末内保存。'),
            'ko': ('방음 불량과 소음 고통, 이제 법적 소명 리포트로 보증금을 지키세요',
                   '복잡한 앱 설치 없이 브라우저에서 10초 만에 공인 양식의 소음 분쟁 해결 보고서를 생성하세요. 100% 로컬 보안 보장.'),
            'th': ('พร้อมที่จะปกป้องสิทธิของคุณและรับเงินมัดจำคืนด้วยหลักฐานที่ชัดเจนแล้วหรือยัง?',
                   'สร้างรายงานหลักฐานทางเสียงระดับมืออาชีพได้ใน 10 วินาทีผ่านเบราว์เซอร์ ไม่ต้องติดตั้งแอป รักษาความเป็นส่วนตัว 100%.'),
            'vi': ('Sẵn sàng bảo vệ quyền lợi thuê nhà và lấy lại tiền cọc bằng chứng cứ thuyết phục?',
                   'Tạo hồ sơ chứng cứ âm học chuẩn hóa chỉ trong 10 giây ngay trên trình duyệt. Không cần cài đặt, bảo mật tuyệt đối.')
        }
    }
}
