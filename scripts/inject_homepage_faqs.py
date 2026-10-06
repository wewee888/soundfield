#!/usr/bin/env python3
"""
Inject localized, high-conversion SEO meta tags, FAQPage schema, and visible FAQ sections
into root index.html and all 9 localized index.html pages (zh, en, de, es, fr, ja, ko, th, vi).
"""

import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent

FAQ_DATA = {
    "zh": {
        "title": "免费在线噪音分贝测试与取证工具｜无需安装 App · SOUNDTEST.PRO",
        "description": "免费在线噪音分贝测试与维权存证工具。支持手机麦克风实时测分贝、实景水印拍照录像、夜间哨兵盯守，自动生成符合《民法典》安宁权与GB 22337标准的防篡改PDF证据卷宗。",
        "keywords": "噪音分贝在线检测, 在线分贝测试, 楼上邻居噪音取证, 租房噪音过大退租证据, 带分贝的水印相机, 夜间噪音超标投诉, 物业噪音维权证据, 民法典安宁权调解证据, 防篡改噪音录音",
        "eyebrow": "民间调解与纠纷记录 FAQ",
        "heading": "噪音记录与纠纷维权常见问题解答",
        "lead": "直击楼上踩踏噪音、租房无责退租、夜间超标认定与民间调解取证等核心维权与实操痛点。",
        "faqs": [
            {
                "q": "手机测分贝的数据能否作为邻里纠纷、物业调解与交涉维权的证据？",
                "a": "可以作为客观的民间自查记录与辅助证据材料。在邻里协商、物业协同与居委会民间调解中，SOUNDTEST.PRO 的实景水印相机（同步烧录分贝数值、时间戳与定位）及 SHA-256 防篡改封签，能清晰证明受扰时序与客观经过，杜绝对方推诿。请注意：本应用提供的是民间自查记录与证据辅助，非国家法定计量认证仪器；若涉及正式行政裁决或法定计量执法，法定程序通常需以经法定计量检定合格的专业声级计检测复核为准。"
            },
            {
                "q": "夜间几点以后超过多少分贝属于违法扰民？法定标准是多少？",
                "a": "依据中国《噪声污染防治法》及 GB 22337-2008 规定，城市居住区夜间通常指 22:00 至次日 06:00。在居住区室内，夜间等效声级 Leq 规定不得超过 30 dB 至 35 dB，突发峰值不得超过限值 10 dB；室内低频传导噪声（如电梯井、水泵、低音炮）夜间限值严苛至 30 dB(A)。"
            },
            {
                "q": "租房遇到楼上或室外严重噪音，如何凭分贝记录申请“无责退租退还押金”？",
                "a": "依据《民法典》第七百三十一条，租赁物危及承租人安全或健康的，承租人可随时解除合同。建议连续 3 至 7 天使用 SOUNDTEST.PRO 记录夜间超标频次与峰值，生成带防伪哈希的 PDF 证据报告并留存带定位水印照片，向房东或中介出具书面催告函，对方未在合理期限改善即可主张合同法定解除并全额退还押金。"
            },
            {
                "q": "楼上邻居半夜突发性跺脚、拖椅子，人不可能整夜守着手机，该如何取证？",
                "a": "开启 SOUNDTEST.PRO 独家研发的“夜间无人值守哨兵模式（Sentry Mode）”。设定分贝超标阈值（如 50 dB）与触发灵敏度，手机静置于床头或桌面，一旦侦测到突发撞击声即可自动启动录音并记录超标起止时间、峰值脉冲与波形频谱，无需熬夜守候。"
            },
            {
                "q": "普通免费在线分贝计与 SOUNDTEST.PRO 存证工作站有何本质区别？",
                "a": "普通在线分贝计仅显示跳动的即时数字，缺乏时间序列与背景信息；SOUNDTEST.PRO 专为民间维权与调解沟通打造，集成全流程自查记录链条：实景水印相机、无人值守夜间哨兵、社区楼栋级定位、SHA-256 电子封签、以及直呈物业与调解组织的结构化声学证据卷宗（PDF/CSV，民间辅助参考记录）。"
            }
        ]
    },
    "en": {
        "title": "Free Online Decibel Meter & Noise Evidence Recorder | No App Required · SOUNDTEST.PRO",
        "description": "Free online decibel meter and acoustic evidence workstation. Measure dB SPL, record audio with GPS & timestamp watermarks, run overnight sentry monitoring, and export tamper-evident PDF dossiers for tenant disputes and noise complaints.",
        "keywords": "online decibel meter free, sound level meter online, neighbor noise complaint evidence, apartment noise meter, noise disturbance log, quiet enjoyment breach proof, break lease noise evidence, decibel watermark camera, overnight noise sentry, tamper-evident sound report, small claims noise proof, how to prove noise nuisance",
        "eyebrow": "Civilian Documentation & Nuisance FAQ",
        "heading": "Frequently Asked Questions on Noise Documentation & Dispute Resolution",
        "lead": "Practical guidance on neighbor disputes, constructive eviction, tenancy lease breaking, and tamper-evident acoustic documentation.",
        "faqs": [
            {
                "q": "Can browser decibel readings and recordings be used as supporting evidence in tenant disputes and mediation?",
                "a": "Yes, as supporting civilian documentation to establish a factual timeline and pattern of disturbance for landlord communications, HOA mediation, and dispute filings. Formal statutory dispute proceedings or legal metrology enforcement may require measurements conducted with certified Class 1/2 sound level meters. SOUNDTEST.PRO provides objective civilian logs—pairing timestamped dB trends with residential GPS location tags, photographic watermark evidence, and SHA-256 cryptographic hashes—to demonstrate recurring disturbance documented in good faith."
            },
            {
                "q": "What decibel level constitutes actionable neighbor noise at night?",
                "a": "Most municipal noise ordinances in the US and UK set residential nighttime thresholds between 45 dBA and 55 dBA at property boundaries (typically 10 PM/11 PM to 7 AM), with WHO guidelines recommending indoor bedroom sound levels below 30–35 dBA for restful sleep. Sudden impulse noises exceeding ambient levels by 10+ dB are widely considered actionable."
            },
            {
                "q": "How can I break my apartment lease without penalty due to chronic noise?",
                "a": "To break a lease without losing your security deposit, you must build an unassailable paper trail proving your landlord failed to remedy a constructive eviction condition. Log at least 5–7 days of persistent exceedances using SOUNDTEST.PRO, export the formal PDF evidence dossier, and deliver written notice demanding abatement before giving notice of termination."
            },
            {
                "q": "How do I record sudden stomping or bass vibrations while sleeping without staying awake all night?",
                "a": "Use SOUNDTEST.PRO's automated Sentry Surveillance Mode. Set an exceedance trigger (e.g., 50–55 dBA). Leave your device plugged in on a nightstand; it automatically wakes on impulse sounds, recording the burst duration, peak dBA, and frequency spectrum with zero cloud upload."
            },
            {
                "q": "How does SOUNDTEST.PRO differ from generic online decibel meters?",
                "a": "Generic decibel meters only display a momentary fluctuating number without context or timestamps. SOUNDTEST.PRO is an end-to-end civilian documentation tool: incorporating an in-browser watermark camera, overnight sentry logging, community reverse geocoding, SHA-256 cryptographic hashing, and structured civilian PDF evidence dossier exports for mediation and dispute records (not certified metrology measurements)."
            }
        ]
    },
    "de": {
        "title": "Kostenloser Online-Dezibelmesser & Lärm-Beweisrekorder | Keine App nötig · SOUNDTEST.PRO",
        "description": "Kostenloser Online-Dezibelmesser und Schallpegel-Beweisrekorder ohne App. Ermitteln Sie dB-Werte, erfassen Sie Lärm mit GPS- und Zeit-Wasserzeichen, nutzen Sie den Nacht-Wächtermodus und exportieren Sie ein rechtssicheres PDF-Lärmprotokoll nach BGB § 536.",
        "keywords": "dezibelmesser online kostenlos, schallpegelmesser online, lärmprotokoll nachbarn mietminderung, lärmbelästigung dokumentieren, ruhestörung beweisen bgb 536, wasserzeichen kamera dezibel uhrzeit, nächtliche ruhestörung dokumentieren, ta lärm grenzwerte wohngebiet, schallpegelmessung browser",
        "eyebrow": "Rechts- & Beweis-FAQ",
        "heading": "Häufige Fragen zu Ruhestörung, Lärmprotokoll und Mietrecht",
        "lead": "Fundierte Antworten zu Mietminderung nach BGB § 536, TA Lärm Grenzwerten und strukturierter ziviler Dokumentation.",
        "faqs": [
            {
                "q": "Wird ein Online-Lärmprotokoll von Vermietern und Schlichtungsstellen für eine Mietminderung anerkannt?",
                "a": "Für eine Mietminderung nach BGB § 536 oder Vermietergespräche ist ein detailliertes ziviles Lärmprotokoll erforderlich, das Art, Dauer, Uhrzeit und Intensität belegt. SOUNDTEST.PRO erfasst diese Parameter als zivile Dokumentation mit Zeitstempeln und SHA-256 Prüfsumme (kein amtlich geeichtes Messgerät)."
            },
            {
                "q": "Welche Dezibel-Grenzwerte gelten während der gesetzlichen Nachtruhe (22:00 bis 06:00 Uhr)?",
                "a": "In reinen Wohngebieten sieht die TA Lärm nachts einen Immissionsrichtwert von 35 dB(A) vor, in allgemeinen Wohngebieten 40 dB(A). Einzelne kurzzeitige Geräuschspitzen dürfen diesen Wert um höchstens 20 dB(A) überschreiten. In Innenräumen liegt der Richtwert für Schlafräume bei 25–30 dB(A)."
            },
            {
                "q": "Wie weise ich Trittschall oder Bassvibrationen der Nachbarn nachts nach, ohne wachzubleiben?",
                "a": "Nutzen Sie den integrierten Sentry-Wächtermodus. Sobald der Schallpegel den eingestellten Schwellenwert überschreitet, startet die Messung automatisch, zeichnet den Frequenzverlauf auf und speichert den Spitzenwert samt Dauer direkt im Browser – 100 % datenschutzkonform ohne Cloud-Upload."
            },
            {
                "q": "Wie gehe ich rechtssicher vor, um die Miete wegen Ruhestörung zu mindern?",
                "a": "Führen Sie über 7 bis 14 Tage lückenlos Protokoll mit SOUNDTEST.PRO. Exportieren Sie den formalen PDF-Beweisbericht und fordern Sie Ihren Vermieter schriftlich mit Fristsetzung zur Mängelbeseitigung auf. Eine Mietminderung tritt kraft Gesetzes ab Mängelanzeige ein."
            },
            {
                "q": "Was unterscheidet SOUNDTEST.PRO von einfachen Dezibel-Apps?",
                "a": "Einfache Web-Dezibelmesser zeigen nur flüchtige Zahlen. SOUNDTEST.PRO ist eine zivile Beweisstation mit integrierter Wasserzeichenkamera, Nacht-Wächterfunktion, Adresszuordnung, SHA-256-Signatur und strukturierten PDF-Dossiers."
            }
        ]
    },
    "es": {
        "title": "Sonómetro Online Gratis y Grabador de Evidencia de Ruido | Sin App · SOUNDTEST.PRO",
        "description": "Sonómetro online gratis y grabador de pruebas de ruido sin app. Mida decibelios en tiempo real, tome fotos y vídeos con marca de agua GPS y fecha, active vigilancia nocturna y exporte informes PDF periciales con firma criptográfica SHA-256.",
        "keywords": "sonómetro online gratis, medidor de ruido online, denunciar ruido vecinos pruebas, denuncia por ruidos molestos, medir decibelios online, rescindir contrato alquiler por ruidos, cámara con marca de agua decibelios gps, límite decibelios noche vivienda, informe pericial acústico pdf",
        "eyebrow": "Preguntas Frecuentes y Guía Legal",
        "heading": "Preguntas Frecuentes sobre Evidencias de Ruido y Reclamaciones",
        "lead": "Respuestas directas sobre la Ley del Ruido, límites de decibelios en dormitorios y rescisión de contratos de alquiler.",
        "faqs": [
            {
                "q": "¿Sirven las mediciones desde el móvil como prueba para denunciar ruidos vecinales o rescindir el alquiler?",
                "a": "Sí, como principio de prueba documental para justificar mediaciones vecinales, requerimientos al casero (art. 27 LAU) o quejas ante la policía local. SOUNDTEST.PRO genera un informe PDF con marcas de tiempo, geolocalización, fotos con marca de agua indeleble y firma criptográfica SHA-256 para demostrar que los datos no han sido manipulados."
            },
            {
                "q": "¿Cuántos decibelios están permitidos en una vivienda por la noche según la normativa?",
                "a": "Según el Real Decreto 1367/2007 y las ordenanzas municipales (Ley del Ruido 37/2003), el límite en dormitorios durante el periodo nocturno (de 23:00 a 07:00 h) es de 30 dBA. Superar este límite de forma reiterada constituye una infracción administrativa susceptible de sanción."
            },
            {
                "q": "¿Cómo capturar pisadas nocturnas o música sin tener que estar despierto toda la noche?",
                "a": "El Modo Centinela (Sentry Mode) vigila automáticamente el entorno mientras duerme. Solo tiene que fijar un umbral de activación (por ej. 45 dBA); la aplicación registrará cada evento acústico anómalo, su duración y su espectro de frecuencias directamente en el navegador."
            },
            {
                "q": "¿Cómo puedo rescindir mi contrato de alquiler por ruidos sin perder la fianza?",
                "a": "Debe documentar de forma continuada durante al menos 5–7 días los excesos de ruido con SOUNDTEST.PRO, exportar el dossier PDF y enviar un burofax o notificación fehaciente al arrendador exigiendo subsanación por inhabitabilidad. Si no actúa, podrá resolver el contrato."
            },
            {
                "q": "¿En qué se diferencia SOUNDTEST.PRO de un sonómetro online convencional?",
                "a": "Los sonómetros genéricos solo muestran un número instantáneo sin valor probatorio. SOUNDTEST.PRO integra cámara con marca de agua de decibelios y ubicación, modo centinela nocturno, sellado SHA-256 y exportación de informes PDF preparados para mediación vecinal."
            }
        ]
    },
    "fr": {
        "title": "Sonomètre en Ligne Gratuit et Preuve de Bruit Sans App · SOUNDTEST.PRO",
        "description": "Sonomètre en ligne gratuit et enregistreur de preuves sonores sans application. Mesurez les dB, prenez des photos/vidéos horodatées avec filigrane GPS, activez la surveillance nocturne et exportez un dossier PDF infalsifiable pour litiges locatifs et tapage nocturne.",
        "keywords": "sonomètre en ligne gratuit, décibelmètre en ligne, preuve bruit voisin tapage nocturne, troubles anormaux de voisinage, mesurer décibels en ligne, résiliation bail nuisance sonore preuve, photo filigrane décibels gps, constat nuisance sonore appartement, rapport acoustique pdf",
        "eyebrow": "FAQ & Guide Juridique",
        "heading": "Questions Fréquentes sur les Preuves de Bruit et Litiges",
        "lead": "Conseils pratiques sur le tapage nocturne, l'émergence sonore globale et la résiliation de bail pour troubles de voisinage.",
        "faqs": [
            {
                "q": "Les mesures de décibels en ligne peuvent-elles servir de preuve pour tapage nocturne ou litige de bail ?",
                "a": "Elles constituent un faisceau d'indices et un dossier préliminaire déterminant pour alerter le syndic, adresser une mise en demeure au propriétaire (pour non-respect de la jouissance paisible) ou saisir un conciliateur de justice. SOUNDTEST.PRO horodate les relevés, appose un filigrane indélébile avec géolocalisation et scelle le dossier PDF avec une signature SHA-256."
            },
            {
                "q": "Quel est le seuil légal d'émergence sonore en France pour qualifier un trouble anormal de voisinage ?",
                "a": "L'article R1336-5 du Code de la santé publique fixe la valeur limite de l'émergence globale à 5 dB(A) le jour (7h-22h) et à seulement 3 dB(A) la nuit (22h-7h). Tout bruit dépassant ce différentiel par rapport au bruit ambiant est considéré comme illicite."
            },
            {
                "q": "Comment enregistrer les bruits d'impact (pas, chutes) la nuit sans rester éveillé ?",
                "a": "Activez le Mode Sentinelle. Laissez votre smartphone branché dans la pièce concernée. Dès qu'un pic dépasse le seuil défini, le système consigne automatiquement la durée, le pic en dB et la signature spectrale sans envoyer aucune donnée dans le cloud."
            },
            {
                "q": "Comment résilier un bail sans pénalité pour cause de nuisances sonores répétées ?",
                "a": "Cumulez au moins une semaine d'enregistrements d'infractions avec SOUNDTEST.PRO, exportez le rapport d'expertise PDF et adressez une mise en demeure par lettre recommandée avec AR au bailleur. En cas de carence, vous pourrez invoquer la perte d'usage paisible."
            },
            {
                "q": "Quelle est la différence entre SOUNDTEST.PRO et un simple sonomètre web ?",
                "a": "Les sonomètres classiques affichent une valeur instantanée sans valeur légale. SOUNDTEST.PRO est une station de preuve acoustique complète intégrant caméra avec filigrane, mode sentinelle nocturne, géocodage inversé, hachage cryptographique SHA-256 et dossiers PDF certifiés."
            }
        ]
    },
    "ja": {
        "title": "無料オンライン騒音計・騒音証拠記録ツール｜アプリ不要 · SOUNDTEST.PRO",
        "description": "無料オンライン騒音計・音響証拠記録ツール。アプリ不要でスマホからリアルタイムにデシベルを測定し、日時・位置情報付き透かし写真撮影、夜間自動監視、改ざん防止SHA-256付きPDF報告書を出力。上の階の足音や近隣トラブルの証拠化に。",
        "keywords": "騒音計 オンライン 無料, デシベル 測定 オンライン, 上の階 足音 騒音 証拠 集め方, マンション 騒音 トラブル 証拠, 受忍限度 騒音 証拠, 賃貸 騒音 退去 家賃減額 証拠, 管理会社 騒音 相談 証拠, デシベル 透かし カメラ 位置情報, 夜間 騒音 測定 記録 アプリ不要, 騒音 証拠 pdf 報告書",
        "eyebrow": "よくある質問・証拠化ガイド",
        "heading": "騒音トラブルと客観的証拠収集のよくある質問",
        "lead": "上の階の足音、受忍限度論、管理会社・警察への通報、違約金なしでの賃貸退去に関する法的実務ガイド。",
        "faqs": [
            {
                "q": "スマホブラウザで測定した騒音データは、警察・管理会社への通報や裁判の証拠になりますか？",
                "a": "はい、民事上の「受忍限度」を超える被害を客観的に立証する有力な初動証拠（証拠書類）として活用できます。SOUNDTEST.PRO は、写真にデシベル値・ミリ秒単位の時刻・詳細なGPS位置情報を焼き付ける透かしカメラ機能や、改ざん防止のSHA-256ハッシュ付きPDF報告書出力を備えており、相手の言い逃れを防ぎます。"
            },
            {
                "q": "日本の住宅街やマンションで、夜間は何デシベル以上が騒音と見なされますか？",
                "a": "環境省の環境基準では、住居専用地域における夜間（通常22時〜翌朝6時）の基準値は 40〜45 dB以下 と定められています。マンション室内では 35〜40 dB を超える断続的・衝撃的な足音や低音は受忍限度を超える違法な権利侵害と判断される傾向にあります。"
            },
            {
                "q": "夜中の突発的な足音やドスンという衝撃音を、寝ている間に自動で記録するには？",
                "a": "SOUNDTEST.PRO の「夜間セントリー（監視）モード」をご利用ください。設定した閾値（例: 45dB）を超える突発音が発生した際のみ自動で検知し、ピーク値・発生時間・持続秒数を記録します。データは端末内のみに安全に保存されます。"
            },
            {
                "q": "騒音トラブルで賃貸物件を違約金なしで退去・家賃減額を求める手順は？",
                "a": "SOUNDTEST.PRO で1〜2週間にわたり継続的な騒音発生データと透かし写真を蓄積し、PDF報告書を作成します。これを添えて管理会社や大家に書面で改善要请を行い、改善されない場合は賃貸借契約の解除（正当事由）を主張できます。"
            },
            {
                "q": "一般的なオンライン騒音計とSOUNDTEST.PROの違いは何ですか？",
                "a": "一般的なWeb騒音計はリアルタイムの数値を表示するだけで法的価値はありません。SOUNDTEST.PRO は、透かしカメラ、夜間自動監視、GPS位置証明、SHA-256暗号化ハッシュ、正式なPDF報告書出力を一体化した総合証拠収集プラットフォームです。"
            }
        ]
    },
    "ko": {
        "title": "무료 온라인 소음측정기 및 소음 증거 기록 도구 | 앱 설치 불필요 · SOUNDTEST.PRO",
        "description": "무료 온라인 소음측정기 및 층간소음 증거 수집 도구. 앱 설치 없이 브라우저에서 실시간 데시벨 측정, 시간·위치 각인 워터마크 카메라, 야간 무인 감시, 위변조 방지 SHA-256 적용 정식 PDF 보고서를 생성하여 이웃사이센터 및 분쟁 조정 증거로 활용하세요.",
        "keywords": "온라인 소음측정기 무료, 데시벨 측정기 온라인, 층간소음 증거 수집 방법, 층간소음 법적기준 데시벨, 윗집 발소리 층간소음 신고 증거, 층간소음 이웃사이센터 제출용, 데시벨 시간 위치 워터마크 카메라, 원룸 오피스텔 층간소음 계약해지 증거, 층간소음 손해배상 증거, 층간소음 pdf 보고서",
        "eyebrow": "자주 묻는 질문 및 법적 증거 가이드",
        "heading": "층간소음 증거 수집 및 분쟁 해결 FAQ",
        "lead": "윗집 쿵쿵거림 발소리 대처, 법정 층간소음 데시벨 기준, 이웃사이센터 제출 및 전월세 계약 해지 핵심 가이드.",
        "faqs": [
            {
                "q": "스마트폰 웹으로 측정한 데시벨 기록이 층간소음 이웃사이센터나 경찰, 법원 증거로 채택될 수 있나요?",
                "a": "네, 분쟁 조정 및 민사 손해배상 청구 시 피해 사실과 지속성을 증명하는 핵심 정황 증거 자료로 인정됩니다. SOUNDTEST.PRO는 측정 수치, 초 단위 타임스탬프, 건물 위치를 사진에 영구 각인하는 워터마크 카메라와 위·변조 방지 SHA-256 암호화 해시가 포함된 정식 PDF 보고서를 지원합니다."
            },
            {
                "q": "환경부 법정 층간소음 기준치는 몇 데시벨(dB)인가요?",
                "a": "2023년 개정된 환경부 기준에 따라 아파트 및 공동주택의 직접충격소음(발걸음, 뛰는 소리) 기준은 주간(06~22시) 1분 등가소음도 39 dB, 야간(22~06시) 34 dB 이하입니다. 최고소음도는 주간 57 dB, 야간 52 dB를 넘지 않아야 합니다."
            },
            {
                "q": "밤마다 쿵쿵거리는 윗집 소음을 밤새 깨어있지 않고 자동으로 채증하려면 어떻게 하나요?",
                "a": "SOUNDTEST.PRO의 '야간 센트리(무인 감시) 모드'를 켜두세요. 기준 데시벨(예: 45dB)을 설정해두면 자는 동안 충격 소음이 발생할 때마다 초과 시간, 최대 데시벨, 주파수 파형을 기기 내부에 자동으로 안전하게 기록합니다."
            },
            {
                "q": "층간소음으로 인해 전월세 계약을 중도 해지하고 보증금을 돌려받으려면?",
                "a": "SOUNDTEST.PRO로 최소 7일 이상의 초과 기록 및 보고서를 작성하여 집주인에게 내용증명으로 하자 보수(방음 조치 또는 가해 세대 중재)를 요구하세요. 불이행 시 임대차 목적 달성 불능으로 무과실 계약 해지를 주장할 수 있습니다."
            },
            {
                "q": "일반 온라인 소음측정기와 SOUNDTEST.PRO의 차이점은 무엇인가요?",
                "a": "단순 수치만 깜빡이는 일반 도구와 달리, SOUNDTEST.PRO는 현장 사진 워터마크, 야간 무인 감시, 상세 위치 각인, SHA-256 무결성 검증, 공공기관 제출용 PDF 보고서 출력을 완벽히 지원하는 전문 증거 수집 시스템입니다."
            }
        ]
    },
    "th": {
        "title": "เครื่องมือวัดระดับเสียงและบันทึกหลักฐานออนไลน์ฟรี | ไม่ต้องลงแอป · SOUNDTEST.PRO",
        "description": "เครื่องมือวัดระดับเสียงเดซิเบลออนไลน์ฟรีและบันทึกหลักฐานเสียงรบกวนโดยไม่ต้องติดตั้งแอป วัดระดับ dB แบบเรียลไทม์ ถ่ายภาพติดลายน้ำเวลาและพิกัด GPS โหมดเฝ้าระวังเวลากลางคืน และส่งออกรายงาน PDF เข้ารหัส SHA-256 สำหรับร้องเรียนข้างบ้านหรือนิติบุคคล",
        "keywords": "วัดเดซิเบลออนไลน์ ฟรี, เครื่องวัดเสียง ออนไลน์, ร้องเรียนเสียงดังข้างบ้าน หลักฐาน, กฎหมายเสียงรบกวน ข้างบ้าน, เสียงดังรบกวน แจ้งความ บันทึกเดซิเบล, กล้องถ่ายรูปติดลายน้ำเดซิเบลและพิกัด, ยกเลิกสัญญาเช่าห้อง เสียงดัง, รายงานเสียงรบกวน pdf",
        "eyebrow": "คำถามที่พบบ่อยและแนวทางรวบรวมหลักฐาน",
        "heading": "คำถามที่พบบ่อยเกี่ยวกับการบันทึกเสียงรบกวนและการร้องเรียน",
        "lead": "คำแนะนำทางกฎหมายและวิธีรวบรวมหลักฐานเสียงรบกวนข้างบ้าน พ.ร.บ.การสาธารณสุข และการยกเลิกสัญญาเช่า",
        "faqs": [
            {
                "q": "บันทึกเสียงและเดซิเบลผ่านมือถือใช้เป็นหลักฐานร้องเรียนเทศบาลหรือแจ้งความได้หรือไม่?",
                "a": "ได้ ใช้เป็นหลักฐานประกอบคำร้องเหตุรำคาญตาม พ.ร.บ.การสาธารณสุข พ.ศ. 2535 ต่อนิติบุคคล เทศบาล หรือสถานีตำรวจได้ SOUNDTEST.PRO มีกล้องลายน้ำบันทึกค่าเดซิเบล พิกัด GPS และเวลาจริง พร้อมรายงาน PDF เข้ารหัส SHA-256 ป้องกันการปลอมแปลง"
            },
            {
                "q": "ตามกฎหมายไทย เสียงดังเกินกี่เดซิเบลถือเป็นเสียงรบกวน?",
                "a": "ประกาศคณะกรรมการสิ่งแวดล้อมแห่งชาติกำหนดว่า หากระดับเสียงรบกวนดังกว่าระดับเสียงพื้นหลังปกติเกิน 10 เดซิเบล (dBA) ให้ถือเป็นเหตุเดือดร้อนรำคาญตามกฎหมาย โดยทั่วไปในห้องนอนเวลากลางคืนไม่ควรเกิน 35–40 dBA"
            },
            {
                "q": "จะบันทึกเสียงรบกวนช่วงดึกโดยไม่ต้องตื่นมาเฝ้าทั้งคืนได้อย่างไร?",
                "a": "เปิด 'โหมดเฝ้าระวังกลางคืน (Sentry Mode)' ของ SOUNDTEST.PRO ตั้งค่าระดับเสียงเตือน (เช่น 50 dB) เมื่อมีเสียงกระแทกหรือเสียงดัง ระบบจะตรวจจับและบันทึกช่วงเวลาพร้อมระดับเดซิเบลสูงสุดไว้ในเครื่องโดยอัตโนมัติ ไม่ส่งข้อมูลขึ้นคลาวด์"
            },
            {
                "q": "สามารถยกเลิกสัญญาเช่าคอนโด/หอพักโดยไม่เสียเงินมัดจำจากปัญหาเสียงดังได้หรือไม่?",
                "a": "สามารถทำได้โดยเก็บข้อมูลเสียงเกินมาตรฐานต่อเนื่อง 5–7 วันด้วย SOUNDTEST.PRO แล้วทำหนังสือแจ้งผู้ให้เช่าพร้อมแนบรายงาน PDF หากผู้ให้เช่าไม่แก้ไข ถือว่าผิดหน้าที่ในการส่งมอบทรัพย์สินให้อยู่ในสภาพใช้งานได้อย่างสงบสุข"
            },
            {
                "q": "SOUNDTEST.PRO แตกต่างจากเครื่องวัดเดซิเบลทั่วไปอย่างไร?",
                "a": "เครื่องวัดทั่วไปแสดงเพียงตัวเลขชั่วคราว แต่ SOUNDTEST.PRO รวมกล้องติดลายน้ำเดซิเบล โหมดเฝ้าระวังอัตโนมัติ การระบุพิกัดชุมชน การเข้ารหัสลับ SHA-256 และการส่งออกรายงาน PDF สำหรับใช้เจรจาหรือดำเนินการทางกฎหมาย"
            }
        ]
    },
    "vi": {
        "title": "Máy đo độ ồn decibel & ghi nhận chứng cứ trực tuyến | Không cần app · SOUNDTEST.PRO",
        "description": "Máy đo độ ồn decibel trực tuyến miễn phí và thu thập bằng chứng âm thanh không cần cài ứng dụng. Đo dB thời gian thực, chụp ảnh quay video đóng dấu vị trí GPS và thời gian, chế độ gác đêm tự động và xuất báo cáo PDF mã hóa SHA-256 khiếu nại tiếng ồn.",
        "keywords": "đo độ ồn online miễn phí, máy đo decibel trực tuyến, đo decibel bằng điện thoại, bằng chứng tiếng ồn hàng xóm hát karaoke, khiếu nại tiếng ồn chung cư, quy chuẩn tiếng ồn khu dân cư, chụp ảnh đóng dấu decibel gps, hủy hợp đồng thuê nhà vì tiếng ồn, báo cáo bằng chứng âm thanh pdf",
        "eyebrow": "Câu hỏi thường gặp & Hướng dẫn chứng cứ",
        "heading": "Câu hỏi thường gặp về Thu thập chứng cứ tiếng ồn & Khiếu nại",
        "lead": "Hướng dẫn thực tế khiếu nại tiếng ồn karaoke, tiêu chuẩn QCVN 26:2010/BTNMT và hủy hợp đồng thuê nhà.",
        "faqs": [
            {
                "q": "Dữ liệu đo decibel trên trình duyệt có dùng làm bằng chứng khiếu nại tiếng ồn được không?",
                "a": "Hoàn toàn có thể dùng làm tài liệu chứng cứ bước đầu để gửi ban quản lý chung cư, UBND phường hoặc công an theo Nghị định 144/2021/NĐ-CP. SOUNDTEST.PRO chụp ảnh đóng dấu mức decibel, vị trí GPS và mốc thời gian chính xác, đồng thời xuất báo cáo PDF chống chỉnh sửa bằng mã băm SHA-256."
            },
            {
                "q": "Tiêu chuẩn tiếng ồn khu dân cư tại Việt Nam quy định tối đa bao nhiêu decibel?",
                "a": "Theo QCVN 26:2010/BTNMT, đối với khu vực dân cư thông thường, giới hạn tiếng ồn tối đa từ 21h đến 6h sáng là 55 dBA (ban ngày từ 6h đến 21h là 70 dBA). Tại các khu vực cần yên tĩnh (như phòng ngủ, bệnh viện), giới hạn ban đêm là 45 dBA."
            },
            {
                "q": "Làm thế nào để thu thập bằng chứng tiếng ồn đập phá hoặc karaoke ban đêm mà không cần thức canh?",
                "a": "Sử dụng 'Chế độ Gác đêm (Sentry Mode)' trên SOUNDTEST.PRO. Bạn chỉ cần đặt ngưỡng cảnh báo (ví dụ 50 dBA); thiết bị sẽ tự động ghi nhận các đợt âm thanh xung kích bất thường, thời lượng và đỉnh dBA mà không tải dữ liệu lên đám mây."
            },
            {
                "q": "Làm sao để đơn phương chấm dứt hợp đồng thuê nhà lấy lại tiền cọc vì ô nhiễm tiếng ồn?",
                "a": "Thu thập nhật ký vi phạm liên tục trong 5–7 ngày bằng SOUNDTEST.PRO, xuất báo cáo PDF và gửi văn bản yêu cầu chủ nhà can thiệp. Nếu chủ nhà không khắc phục, bạn có căn cứ pháp lý để chấm dứt hợp đồng do không đảm bảo điều kiện sinh hoạt."
            },
            {
                "q": "SOUNDTEST.PRO khác gì so với các công cụ đo decibel trực tuyến thông thường?",
                "a": "Các công cụ thông thường chỉ hiển thị chỉ số nhất thời không có giá trị đối chiếu. SOUNDTEST.PRO là trạm bằng chứng âm học hoàn chỉnh với máy ảnh đóng dấu vị trí và decibel, chế độ gác đêm, chữ ký mã hóa SHA-256 và xuất hồ sơ PDF chính thức."
            }
        ]
    }
}

def build_faq_json_ld(faqs):
    main_entity = []
    for item in faqs:
        main_entity.append({
            "@type": "Question",
            "name": item["q"],
            "acceptedAnswer": {
                "@type": "Answer",
                "text": item["a"]
            }
        })
    payload = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": main_entity
    }
    return json.dumps(payload, ensure_ascii=False, indent=2)

def build_faq_html(data):
    cards = []
    for item in data["faqs"]:
        cards.append(
            f'        <div class="card reveal">\n'
            f'          <h3>{item["q"]}</h3>\n'
            f'          <p>{item["a"]}</p>\n'
            f'        </div>'
        )
    cards_html = "\n".join(cards)
    return (
        f'    <section class="section" id="faq-section">\n'
        f'      <div class="section-header reveal">\n'
        f'        <span class="eyebrow">{data["eyebrow"]}</span>\n'
        f'        <h2>{data["heading"]}</h2>\n'
        f'        <p class="lead">{data["lead"]}</p>\n'
        f'      </div>\n'
        f'      <div class="faq-grid">\n'
        f'{cards_html}\n'
        f'      </div>\n'
        f'    </section>\n\n'
    )

def update_file(file_path: Path, locale_key: str):
    data = FAQ_DATA[locale_key]
    html = file_path.read_text(encoding="utf-8")

    # 1. Update Title if needed
    html = re.sub(r'<title>.*?</title>', f'<title>{data["title"]}</title>', html, count=1)

    # 2. Update Meta Description
    html = re.sub(
        r'<meta\s+name=["\']description["\']\s+content=["\'].*?["\']>',
        f'<meta name="description" content="{data["description"]}">',
        html,
        count=1
    )

    # 3. Update Meta Keywords
    if '<meta name="keywords"' in html:
        html = re.sub(
            r'<meta\s+name=["\']keywords["\']\s+content=["\'].*?["\']>',
            f'<meta name="keywords" content="{data["keywords"]}">',
            html,
            count=1
        )
    else:
        # insert after description
        html = html.replace(
            f'<meta name="description" content="{data["description"]}">',
            f'<meta name="description" content="{data["description"]}">\n  <meta name="keywords" content="{data["keywords"]}">'
        )

    # 4. Update OpenGraph / Twitter tags
    html = re.sub(
        r'<meta\s+property=["\']og:title["\']\s+content=["\'].*?["\']>',
        f'<meta property="og:title" content="{data["title"]}">',
        html,
        count=1
    )
    html = re.sub(
        r'<meta\s+property=["\']og:description["\']\s+content=["\'].*?["\']>',
        f'<meta property="og:description" content="{data["description"]}">',
        html,
        count=1
    )
    html = re.sub(
        r'<meta\s+name=["\']twitter:title["\']\s+content=["\'].*?["\']>',
        f'<meta name="twitter:title" content="{data["title"]}">',
        html,
        count=1
    )
    html = re.sub(
        r'<meta\s+name=["\']twitter:description["\']\s+content=["\'].*?["\']>',
        f'<meta name="twitter:description" content="{data["description"]}">',
        html,
        count=1
    )

    # 5. Inject / replace FAQPage JSON-LD
    faq_schema = build_faq_json_ld(data["faqs"])
    faq_script = f'  <script type="application/ld+json">\n{faq_schema}\n  </script>'

    # Remove existing FAQPage schema if any
    html = re.sub(
        r'<script\s+type=["\']application/ld\+json["\']>\s*\{\s*"@context":\s*"https://schema\.org",\s*"@type":\s*"FAQPage"[\s\S]*?</script>\s*',
        '',
        html
    )

    # Insert after SoftwareApplication schema or canonical
    if '</script>' in html:
        # Insert right after the first ld+json script closing tag
        m = re.search(r'(<script\s+type=["\']application/ld\+json["\']>[\s\S]*?</script>)', html)
        if m:
            html = html.replace(m.group(1), m.group(1) + '\n' + faq_script)
        else:
            html = html.replace('</head>', f'{faq_script}\n</head>')
    else:
        html = html.replace('</head>', f'{faq_script}\n</head>')

    # 6. Inject / replace visible FAQ section
    faq_section_html = build_faq_html(data)
    # Remove existing faq-section if present
    html = re.sub(r'<section[^>]*id=["\']faq-section["\'][\s\S]*?</section>\s*', '', html)

    # Insert right before <section class="section" id="updates">
    if 'id="updates"' in html:
        m = re.search(r'([ \t]*<section[^>]*id=["\']updates["\'])', html)
        if m:
            html = html.replace(m.group(1), faq_section_html + m.group(1))
        else:
            html = html.replace('<footer', faq_section_html + '<footer')
    else:
        html = html.replace('<footer', faq_section_html + '<footer')

    file_path.write_text(html, encoding="utf-8")
    print(f"[OK] Updated {file_path.relative_to(ROOT)} ({locale_key})")

def main():
    # 1. Root index.html (uses en)
    update_file(ROOT / "index.html", "en")

    # 2. Localized index pages
    for loc in ["zh", "en", "de", "es", "fr", "ja", "ko", "th", "vi"]:
        p = ROOT / loc / "index.html"
        if p.exists():
            update_file(p, loc)
        else:
            print(f"[SKIP] Not found: {p}")

if __name__ == "__main__":
    main()
