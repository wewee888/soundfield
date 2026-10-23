import os
import re

ROOT = r"E:\.site\dB_test\soundtest"

LANGS = ["zh", "en", "es", "fr", "de", "ja", "ko", "vi", "th"]

# 22 pages: Audited and refined to match authentic native speakers' search and legal terminology
KEYWORDS_MAP = {
    "home": {
        "zh": "噪音分贝仪, 在线分贝测试, 楼上邻居噪音取证, 手机测噪音分贝, 租房噪音维权, 分贝水印相机, 夜间噪音哨兵, 物业噪音维权证据, 民法典安宁权取证, 噪声超标记录",
        "en": "online decibel meter free, sound level meter online, neighbor noise complaint evidence, apartment noise meter, noise disturbance log, quiet enjoyment breach proof, tenant noise dispute evidence, decibel watermark camera, overnight noise sentry, tamper-evident sound report, small claims noise proof",
        "es": "sonómetro online gratis, medidor de ruido online, medir decibelios con el móvil, prueba de ruido vecinos, grabador de ruido nocturno, app decibelios sin instalar, denunciar ruido vecinos pruebas",
        "fr": "sonomètre en ligne gratuit, mesurer décibels en ligne, décibelmètre gratuit sans application, preuve tapage nocturne, constat bruit voisinage, enregistreur de bruit voisins, sonomètre pour litige",
        "de": "dezibelmesser online kostenlos, schallpegelmesser browser, lärmbelästigung nachbarn protokoll, lärmpegel messen handy kostenlos, lärmprotokoll vorlage, beweis ruhestörung",
        "ja": "騒音計 オンライン 無料, デシベル 測定 オンライン, 上の階 足音 騒音 証拠 集め方, マンション 騒音 苦情 証拠, 騒音測定 アプリ 不要, 騒音計 ブラウザ, 騒音トラブル 証拠",
        "ko": "온라인 소음측정기 무료, 데시벨 측정기 온라인, 층간소음 증거 수집 방법, 층간소음 법적기준, 층간소음 고소 증거, 무설치 데시벨 측정, 소음 리포트 PDF",
        "vi": "đo độ ồn online miễn phí, máy đo decibel trực tuyến, app đo tiếng ồn không cần cài đặt, thu thập bằng chứng tiếng ồn hàng xóm, tiếng ồn karaoke hàng xóm kiện, xuất báo cáo tiếng ồn PDF",
        "th": "วัดเดซิเบลออนไลน์ ฟรี, เครื่องวัดเสียง ออนไลน์, ร้องเรียนเสียงดังข้างบ้าน หลักฐาน, แอพวัดระดับเสียง ไม่ต้องโหลด, บันทึกหลักฐานเสียงรบกวน, รายงานเสียงรบกวน PDF"
    },
    "soundtest": {
        "all": "real-time decibel meter, online sound level meter, noise evidence workstation, acoustic spectrum analyzer, overnight noise sentry, tamper-evident PDF export, 实时分贝仪, 声级计在线测试, 噪音录音存证"
    },
    "camera": {
        "zh": "分贝相机, 现场声学拍照, 噪音水印相机, GPS经纬度时间戳拍照, 噪音投诉照片证据, 压印实时分贝照片",
        "en": "decibel watermark camera, acoustic evidence camera, timestamp decibel photo, GPS sound level photo, apartment noise complaint picture, timestamped noise photo",
        "es": "cámara marca de agua acústica, prueba de ruido con foto, cámara decibelios gps, foto denuncia por ruidos, evidencia acústica con fecha y hora",
        "fr": "caméra filigrane acoustique, photo constat bruit, appareil photo décibel horodaté, photo tapage nocturne GPS, photo preuve nuisance sonore",
        "de": "akustik-wasserzeichen-kamera, lärmprotokoll foto dezibel, foto mit zeitstempel und GPS lärm, beweis ruhestörung foto, lärmbelästigung beweisaufnahme",
        "ja": "騒音証拠カメラ, デシベル透かしカメラ, 近隣トラブル証拠写真, GPS日時入り騒音写真, 騒音苦情 写真証拠, デシベル表示カメラ",
        "ko": "소음 증거 카메라, 데시벨 워터마크 카메라, 층간소음 사진 증거, GPS 위치 시간 데시벨 인쇄, 소음 현장 촬영 증빙",
        "vi": "camera chứng cứ tiếng ồn, đóng dấu decibel, chụp ảnh tiếng ồn định vị GPS thời gian thực, ảnh khiếu nại tiếng ồn, máy ảnh bằng chứng âm thanh",
        "th": "กล้องหลักฐานเสียง, ลายน้ำเดซิเบล, ภาพถ่ายร้องเรียนเสียงดัง, กล้องบันทึกค่าเดซิเบลพร้อมพิกัด GPS และเวลาจริง, ภาพหลักฐานเสียงรบกวน"
    },
    "noise-levels": {
        "zh": "分贝等级表, 噪音分贝对照表, 常见噪音分贝值, 70分贝有多吵, 听力损伤分贝标准, 居住区夜间分贝上限",
        "en": "common noise levels decibels, decibel comparison chart, how loud is 70 dB, safe noise exposure time, dBA loudness scale, hearing damage threshold",
        "es": "tabla decibelios, niveles de ruido comunes, escala decibelios dBA, cuánto son 70 decibelios, límites OMS decibelios, umbral daño auditivo",
        "fr": "tableau décibels, niveaux de bruit courants, échelle décibels dBA, 70 dB c'est quoi, seuil de danger bruit décibel, recommandations OMS bruit",
        "de": "dezibel tabelle, lärmpegel vergleich, wie laut sind 70 dezibel, gehörschutz grenzwerte, lautstärke skala dBA, schallpegel richtwerte",
        "ja": "デシベル基準表, 騒音レベル目安, デシベル比較表, 70dBどのくらい, 騒音環境基準, WHO騒音ガイドライン, 難聴危険デシベル",
        "ko": "데시벨 기준표, 일상 소음 크기 비교, 70dB 얼마나 시끄러운가, 층간소음 데시벨 기준, WHO 소음 권고기준, 청력 손상 데시벨",
        "vi": "bảng decibel tiếng ồn, mức decibel thông thường, 70 dB là to cỡ nào, thang đo âm thanh dBA, tiêu chuẩn tiếng ồn WHO, ngưỡng tổn hại thính giác",
        "th": "ตารางระดับเสียงเดซิเบล, ระดับเสียงทั่วไป, เสียงดัง 70 dB แค่ไหน, เกณฑ์ระดับเสียงปลอดภัย, มาตรฐานมลพิษทางเสียง WHO, ระดับเดซิเบลอันตราย"
    },
    "accuracy": {
        "zh": "手机测分贝准吗, 分贝仪精度说明, Web Audio声学校准, IEC 61672声级计标准, 数字声学存证法律效力",
        "en": "phone decibel meter accuracy, can phone measure decibels accurately, Web Audio acoustic calibration, IEC 61672 sound meter standards, tamper-evident acoustic record legal weight",
        "es": "precisión sonómetro móvil, es fiable medir decibelios con el móvil, calibración micrófono web audio, estándar IEC 61672, validez legal prueba acústica",
        "fr": "précision sonomètre smartphone, mesurer décibels avec smartphone est-ce fiable, étalonnage microphone web, norme CEI 61672, valeur probante preuve acoustique",
        "de": "genauigkeit schallpegelmessung smartphone, wie genau ist handy dezibelmessung, mikrofon kalibrierung web audio, IEC 61672 norm, beweiskraft lärmmessung gericht",
        "ja": "スマホ騒音計 精度, スマホでデシベル測定 正確か, Web Audioマイク校正, IEC 61672規格, 裁判用騒音測定 証拠能力, 音響デジタル証拠 仕様",
        "ko": "스마트폰 소음측정기 정확도, 휴대폰 데시벨 측정 정확한가, 마이크 캘리브레이션 보정, IEC 61672 음향 규격, 위변조 방지 디지털 음향 증거",
        "vi": "độ chính xác máy đo decibel điện thoại, điện thoại đo decibel có chính xác không, hiệu chuẩn micro web audio, tiêu chuẩn IEC 61672, giá trị pháp lý bằng chứng âm thanh",
        "th": "ความแม่นยำเครื่องวัดเสียงบนมือถือ, มือถือวัดเดซิเบลแม่นไหม, การคาลิเบรตไมโครโฟน Web Audio, มาตรฐาน IEC 61672, คุณค่าทางกฎหมายของหลักฐานเสียงดิจิทัล"
    },
    "standards": {
        "zh": "噪音超标国家标准, GB 22337噪声排放限值, GB 3096声环境质量标准, 居民区夜间噪声标准45分贝, 治安管理处罚法扰民标准",
        "en": "global noise standards, residential noise limits, WHO environmental noise guidelines, nighttime residential decibel limits, quiet hours legal decibels, EPA noise regulations",
        "es": "normativa del ruido viviendas, límite decibelios noche España, ordenanza municipal de ruidos, niveles máximos permitidos decibelios, decibelios permitidos por la noche",
        "fr": "réglementation bruit de voisinage, décret bruit émergence sonore, limite légale décibels nuit, seuil tapage nocturne légal, code santé publique bruit",
        "de": "TA lärm richtwerte, nachtruhe dezibel grenzwerte, wohngebiet grenzwerte tag nacht 35 dB, bundesimmissionsschutzgesetz lärm, ruhezeiten gesetzliche vorgaben",
        "ja": "環境省 騒音環境基準, マンション受忍限度 デシベル, 深夜騒音 基準値40dB, 騒音規制法 条例, 夜間騒音受忍限度, 住宅地 デシベル 基準",
        "ko": "층간소음 법적 기준 데시벨, 공동주택 층간소음 기준 데시벨, 소음진동관리법 주간 야간 한도, 야간 38dB 기준, 환경분쟁조정 소음기준",
        "vi": "quy chuẩn kỹ thuật quốc gia về tiếng ồn QCVN 26, giới hạn decibel tiếng ồn khu dân cư, xử phạt tiếng ồn ban đêm, quy định tiếng ồn sinh hoạt, mức phạt tiếng ồn sau 22h",
        "th": "กฎหมายควบคุมระดับเสียงในชุมชน, ค่ามาตรฐานเสียงรบกวน กรมควบคุมมลพิษ, ระดับเสียงเกินมาตรฐานเวลากลางคืน, ข้อกำหนดระดับเสียงรบกวน, เสียงดังเกินกี่เดซิเบล ผิดกฎหมาย"
    },
    "samples": {
        "zh": "噪音投诉报告模板, 邻里噪音起诉证据模板, 物业协调报告底稿, 噪音维权PDF报告样本, 法院认可噪音证据链",
        "en": "noise complaint report sample, neighbor noise evidence template, small claims court noise proof, landlord noise log PDF, HOA dispute evidence template",
        "es": "modelo informe pericial acústico, plantilla reclamación ruidos vecinos, informe ruido PDF juicio, ejemplo queja ruidos administración, modelo denuncia por ruidos",
        "fr": "modèle plainte tapage nocturne, exemple constat acoustique huissier, rapport nuisance sonore PDF, modèle dossier litige bruit, modèle lettre mise en demeure bruit",
        "de": "muster lärmprotokoll PDF, lärmprotokoll mietminderung vorlage, schallmessbericht ordnungsamt, nachbarschaftsstreit beweise muster, lärmtagebuch vordruck",
        "ja": "騒音報告書 サンプル, マンション管理会社 提出用 騒音レポート, 調停 裁判 騒音証拠資料 雛形, PDF騒音記録 サンプル, 騒音トラブル 相談書 例文",
        "ko": "층간소음 증거 서식 샘플, 층간소음 피해 일지 양식, 이웃사이센터 제출용 소음 기록표, 민사소송 손해배상 증빙 양식, 소음 피해 확인서 PDF",
        "vi": "mẫu báo cáo khiếu nại tiếng ồn, mẫu bằng chứng khởi kiện tiếng ồn, biên bản ghi nhận tiếng ồn PDF, mẫu đơn khiếu nại tiếng ồn, nhật ký ghi nhận tiếng ồn",
        "th": "ตัวอย่างรายงานหลักฐานเสียงรบกวน, แบบฟอร์มร้องเรียนเสียงดัง PDF, ตัวอย่างบันทึกหลักฐานเสียงข้างห้องดำเนินคดี, แบบบันทึกมลพิษทางเสียง"
    },
    "download": {
        "zh": "安装分贝仪PWA, 分贝测试桌面快捷方式, 手机主屏幕添加分贝仪, 免下载声级计",
        "en": "install decibel meter PWA, sound level meter desktop app, home screen noise meter shortcut, web decibel meter app without app store",
        "es": "instalar sonómetro PWA, icono acceso directo medidor ruido, app sonómetro navegador, guardar pantalla inicio, medidor ruido sin descargar",
        "fr": "installer sonomètre PWA, raccourci écran sonomètre, application web décibelmètre, ajouter écran d'accueil, sonomètre sans téléchargement",
        "de": "PWA dezibelmesser installieren, homescreen verknüpfung, schallpegelmesser desktop app, lärm-app ohne download, schallmessung direkt im browser",
        "ja": "騒音計PWA インストール, ホーム画面に追加, デスクトップショートカット, ブラウザ騒音アプリ, アプリストア不要 騒音測定",
        "ko": "소음측정기 PWA 설치, 홈 화면 바로가기 추가, 데스크톱 소음측정기 앱, 웹 앱 바로설치, 앱스토어 다운로드 없이 소음측정",
        "vi": "cài đặt ứng dụng đo tiếng ồn PWA, thêm vào màn hình chính, máy đo độ ồn web app, lối tắt màn hình máy đo âm thanh, đo tiếng ồn không cần tải app",
        "th": "ติดตั้งเว็บแอป SOUNDTEST.PRO PWA, เพิ่มลงหน้าจอหลัก, ทางลัดเครื่องวัดเสียงบนเดสก์ท็อป, แอปวัดเสียงไม่ต้องโหลดจากสโตร์"
    },
    "auth": {
        "zh": "分贝仪专业版, SoundTest会员订阅, 无限制长时哨兵录音, 高精度报告导出, 个人声学账户",
        "en": "soundtest pro membership, unlimited noise sentry logging, pro acoustic report pass, sound level meter subscription, professional noise logging pass",
        "es": "suscripción soundtest pro, pase profesional acústico, grabación ilimitada ruido, cuenta sonómetro pro, informes ilimitados ruido",
        "fr": "abonnement soundtest pro, pass acoustique illimité, surveillance sonore continue pro, compte sonomètre professionnel, rapports certifiés illimités",
        "de": "soundtest pro lizenz, dauerüberwachung nacht lärm pro, akustik protokoll pass, mitgliedschaft schallpegel, unbegrenzte lärmberichte",
        "ja": "SOUNDTEST PRO 会員, 長時間騒音センチネル監視, 騒音レポート 無制限プラン, プロ版 音響アカウント, 夜間自動録音 サブスク",
        "ko": "SOUNDTEST PRO 회원, 야간 무제한 소음 기록, 프로 리포트 이용권, 소음측정 멤버십, 층간소음 24시간 센트리",
        "vi": "tài khoản soundtest pro, gói thành viên giám sát tiếng ồn, xuất báo cáo âm thanh không giới hạn, thẻ pro âm thanh, canh gác tiếng ồn ban đêm",
        "th": "สมัครสมาชิก SOUNDTEST PRO, บันทึกเสียงเฝ้าระวังยามดึกไม่จำกัด, บัญชีผู้ใช้งานระดับพรีเมียม, แพ็กเกจเครื่องวัดเสียง, สมาชิกตรวจวัดเสียงมืออาชีพ"
    },
    "use-cases": {
        "zh": "噪音取证场景, 邻里噪音, 装修噪音, 酒吧扰民, 租房退租取证, 工厂噪声巡检",
        "en": "noise documentation scenarios, neighbor noise, construction monitoring, tenant dispute, occupational noise, commercial noise complaints",
        "es": "casos de uso medición ruido, peritaje acústico particular, quejas por ruido vecinos, obras y locales, resolución conflictos acústicos",
        "fr": "cas d'usage preuve sonore, litiges bruits de voisinage, constat sonore chantier, nuisances sonores bars, médiation acoustique",
        "de": "anwendungsbereiche lärmdokumentation, lärmstreit beweise, ruhestörung erfassen, nachbarschaftslärm baulärm, mietminderung gründe",
        "ja": "騒音証拠 収集 シナリオ一覧, マンション近隣トラブル, 騒音被害 解決, 工事騒音 職場騒音, 賃貸騒音 トラブル解決",
        "ko": "소음 증빙 활용 사례 허브, 층간소음 해결, 소음 피해 신고, 공사소음 임대차소음, 사업장 소음 점검",
        "vi": "trung tâm tình huống thu thập chứng cứ tiếng ồn, tiếng ồn hàng xóm, công trình xây dựng, quán bar phố đêm, tranh chấp thuê phòng",
        "th": "ศูนย์รวมสถานการณ์บันทึกหลักฐานเสียงรบกวน, เสียงเพื่อนบ้าน, ไซต์ก่อสร้าง, ผับบาร์, ปัญหาเสียงห้องเช่า"
    },
    "neighbor-noise-evidence": {
        "zh": "邻里噪音取证, 楼上脚步声太响怎么维权, 楼上跺脚跑跳投诉, 夜间持续噪音录音, 12345投诉邻里噪音, 安宁权民法典起诉, 震楼器对抗存证",
        "en": "neighbor noise evidence, upstairs neighbor stomping noise complaint, heel walking neighbor noise, apartment noise recording, how to prove upstairs neighbor noise, overnight noise sentry, tamper-evident noise report, quiet enjoyment breach, call 311 noise complaint",
        "es": "denunciar ruido vecinos pruebas, cómo denunciar a un vecino por ruidos, ruido de tacones y pisadas vecino de arriba, ruidos molestos comunidad de propietarios, sentinela ruido nocturno, llamar a la policía por ruidos vecino, demanda judicial ruido",
        "fr": "preuve bruits de voisinage constat, que faire voisin bruyant, plainte tapage nocturne preuves, bruits de pas talons voisin du dessus, troubles anormaux de voisinage assignation, lettre mise en demeure bruit voisin, sentinelle sonore nocturne",
        "de": "nachbarschaftslärm beweisführung, lärmprotokoll nachbarn muster, lärmbelästigung trampeln obermieter, trampelgeräusche nachbar oben, ruhestörung nacht lärmprotokoll, ruhestörung polizei melden, unterlassungsklage lärm",
        "ja": "マンション 騒音 どこに相談, 上の階 足音 うるさい 苦情, 上の階 かかと歩き ドスドス, マンション 足音 子供 走る音 苦情, 騒音 証拠 集め方, マンション 騒音 管理会社 相談, 受忍限度 騒音 デシベル, 騒音トラブル 警察 通報",
        "ko": "층간소음 해결방법, 층간소음 법적기준, 윗집 발망치 소음 고소, 윗집 아이 뛰는 소리 신고, 층간소음 이웃사이센터 신고, 새벽 소음 센트리 자동 녹음, 환경분쟁조정위원회 증거, 층간소음 경찰신고",
        "vi": "thu thập bằng chứng tiếng ồn hàng xóm, hàng xóm hát karaoke gây ồn, báo công an hàng xóm làm ồn, tiếng bước chân giậm chân tầng trên chung cư, mức phạt tiếng ồn sau 22h, nghị định xử phạt tiếng ồn",
        "th": "ข้างห้องเสียงดัง ทำไงดี, เดินลงส้นเท้า คอนโด ร้องเรียน, ข้างห้องส่งเสียงดัง แจ้งนิติ, รวบรวมหลักฐานเสียงรบกวนข้างห้อง, แจ้งตำรวจเสียงรบกวนยามวิกาล, ฟ้องร้องค่าเสียหายเสียงรบกวน"
    },
    "construction-noise-monitoring": {
        "zh": "建筑施工噪音投诉, 违规夜间施工取证, 室内装修电钻砸墙噪音, 环保局12369举报施工扰民, 施工噪声排放限值, 周末违规装修投诉",
        "en": "construction noise monitoring, illegal renovation noise, after-hours construction report, municipal noise complaint 311, jackhammer decibel limits, weekend construction noise complaint",
        "es": "monitorización ruido de obras, denunciar obras fuera de horario, obras en casa horario permitido, ruido taladro albañiles decibelios, queja ayuntamiento obras, límite decibelios obras",
        "fr": "constat bruit de chantier, dénoncer travaux le dimanche ou la nuit, horaires travaux bruyants autorisés, bruit marteau piqueur réglementation, dépassement seuil bruit travaux, plainte mairie chantier",
        "de": "baustellenlärm überwachung, baulärm grenzwerte überschritten, renovierungslärm sonntagsarbeit beweisen, bohrlärm ruhezeiten mietwohnung, anzeige ordnungsamt baustelle, lärmbelästigung bauarbeiten",
        "ja": "工事 解体 リフォーム 騒音監視, 違法 工事時間 証拠, 工事 騒音 苦情 どこに言う, 解体工事 振動 騒音 苦情, 役所 への 騒音通報 証拠, 建設作業 騒音規制値",
        "ko": "공사 및 리모델링 소음 측정 모니터링, 불법 새벽 주말 공사 신고, 공사장 소음 기준 초과, 드릴 해머 소음 데시벨 입증, 구청 환경과 민원 접수, 비산먼지 소음 규제",
        "vi": "giám sát bằng chứng tiếng ồn công trình, khiếu nại thi công ngoài giờ quy định, tiếng máy khoan đập ban đêm, báo thanh tra môi trường, quy định tiếng ồn xây dựng, giờ giấc thi công xây dựng",
        "th": "ตรวจวัดและบันทึกหลักฐานเสียงงานก่อสร้าง, ร้องเรียนก่อสร้างต่อเติมเสียงดังนอกเวลา, แจ้งสำนักงานเขตเสียงไซต์งานก่อสร้าง, ก่อสร้างเสียงดัง วันอาทิตย์ แจ้งที่ไหน, ระดับเสียงเกินมาตรฐานงานก่อสร้าง"
    },
    "property-noise-complaint-report": {
        "zh": "物业噪音处理流程, 小区生活噪音调解报告, 业主噪音投诉工单底稿, 楼栋隔音纠纷客观核查, 物业服务纠纷证据, 邻里纠纷居委会调解",
        "en": "property manager noise report, HOA noise complaint, tenant noise log, landlord mediation report, multi-family noise dispute, resident noise complaint paper trail",
        "es": "informe ruidos administración fincas, queja ruidos comunidad propietarios, queja presidente comunidad ruidos, mediación conflicto acústico vecinos, libro incidencias ruidos comunidad",
        "fr": "rapport de gestion syndic nuisances sonores, plainte syndic copropriété bruit, médiation acoustique copropriété, règlement intérieur immeuble bruit, démarche syndic voisin bruyant",
        "de": "lärmbeschwerde hausverwaltung muster, eigentümergemeinschaft ruhestörung, konfliktlösung mieter lärm, hausordnung ruhezeiten protokoll, musterbrief hausverwaltung lärm",
        "ja": "マンション 管理会社 提出用 騒音報告書, 住民トラブル 仲介 証拠, 理事会 騒音クレーム 調査, 賃貸管理 騒音対応, 管理規約 騒音対策, 管理会社 動かない 証拠",
        "ko": "아파트 관리사무소 제출용 소음 확인서, 입주자대표회의 층간소음 중재 자료, 관리소 소음 점검표, 공동주택 관리규약 소음 위반, 관리사무소 층간소음 민원 접수",
        "vi": "báo cáo xử lý tiếng ồn ban quản lý chung cư, biên bản hòa giải tranh chấp tiếng ồn, nội quy tòa nhà tiếng ồn, hồ sơ giải quyết khiếu nại cư dân, khiếu nại ban quản trị chung cư",
        "th": "รายงานการจัดการข้อร้องเรียนเสียงนิติบุคคล, บันทึกการตรวจสอบเสียงคอนโดหมู่บ้าน, ไกล่เกลี่ยปัญหาเสียงดังระหว่างลูกบ้าน, ระเบียบการพักอาศัยเรื่องเสียงดัง, แจ้งนิติบุคคล คอนโดเสียงดัง"
    },
    "bar-street-disturbance": {
        "zh": "酒吧低频低音炮扰民, 沿街大排档夜市噪音投诉, 商铺户外高音喇叭扰民, 商业场所夜间噪声超标, 商业噪音民法典取证, 12345投诉沿街商铺噪音",
        "en": "bar street noise complaint, bass vibration recording, nightlife disturbance log, commercial patio noise, low frequency bass pollution, restaurant outdoor music ordinance violation",
        "es": "denunciar ruido bares terrazas, ruidos pubs discotecas bajos, vibración graves música discoteca, ruidos locales nocturnos, policía local sonometría bares, terraza bar molesta ruidos",
        "fr": "nuisance sonore bar terrasse, porter plainte bruit restaurant bar, vibration basses boite de nuit, musique amplifiée débit de boisson, tapage nocturne commercial, riverains bruit bar",
        "de": "lärmbelästigung gastronomie biergarten, bässe club vibrationen nachbarn, gaststättenlärm anzeige, außengastronomie ruhestörung, tieffrequenter lärm bässe, beschwerde ordnungsamt gaststätte",
        "ja": "飲食店 居酒屋 深夜営業 騒音 苦情, クラブ 低音 重低音 振動 被害, 繁華街 テラス席 騒音 証拠, 警察 通報 騒音記録, 深夜酒類提供 騒音, 店舗の重低音 振動 相談",
        "ko": "주점 상가 야시장 소음 피해 증빙, 클럽 베이스 저주파 진동 측정, 먹자골목 야외 테라스 소음 신고, 경찰 출동 증빙, 영업장 확성기 소음 규제, 음식점 심야 소음 민원",
        "vi": "khiếu nại tiếng ồn quán bar phố đêm, tiếng ồn loa kẹo kéo, quán nhậu mở nhạc ồn ào, tiếng bass rung lắc nhà dân, xử phạt quán nhậu gây ồn, ô nhiễm âm thanh tần số thấp",
        "th": "ร้องเรียนเสียงสถานบันเทิงผับบาร์, เสียงเบสกระหึ่มร้านเหล้าใกล้บ้าน, ร้องเรียนร้านอาหารเปิดเพลงเสียงดัง, ร้านเหล้าเปิดเพลงดัง แจ้งใคร, เสียงรบกวนตลาดกลางคืน, มลพิษทางเสียงความถี่ต่ำ"
    },
    "rental-dispute-evidence": {
        "zh": "租房隔音太差无责退租, 租房噪音纠纷, 房东隐瞒恶劣噪音违约, 房屋不符合居住条件退租, 租房合同安宁权违约证据, 退租仲裁全额退押金",
        "en": "rental dispute noise evidence, break lease due to noisy neighbor, constructive eviction noise uninhabitable, get security deposit back noisy apartment, landlord tenant noise dispute letter, quiet enjoyment breach tenant",
        "es": "rescindir contrato alquiler por ruidos, dejar piso de alquiler por ruido sin penalización, recuperar fianza piso ruidoso, resolución contrato alquiler falta habitabilidad, demanda casero ruido",
        "fr": "résiliation bail bruit voisin, quitter logement bruit sans préavis, logement indécent isolation phonique, récupérer caution appartement bruyant, mise en demeure bailleur insonorisation",
        "de": "mietminderung lärm beweise, fristlose kündigung lärm unbewohnbar, mietkaution zurückfordern schallschutz, mangel der mietsache schallschutz, unzumutbare wohnung lärm kündigen",
        "ja": "賃貸 騒音 退去 違約金 払いたくない, 賃貸 壁が薄い 解約 敷金, 賃貸 騒音 トラブル 解約 敷金 返還, 構造的 遮音性 欠如 契約解除, 騒音による 引っ越し 費用 請求, 賃貸 騒音 契約解除 判例",
        "ko": "원룸 방음 안됨 계약 파기, 원룸 방음 보증금 돌려받기, 임대차 소음 분쟁 및 계약 해지 법적 증빙, 원룸 옆방 소음 계약해지, 방음 하자 계약해지 소송, 세입자 주거평온권 침해",
        "vi": "thuê nhà trọ ồn ào đòi lại tiền cọc, bằng chứng tiếng ồn giải quyết tranh chấp thuê nhà, chấm dứt hợp đồng thuê phòng vì tiếng ồn, nhà trọ cách âm kém kiện chủ nhà, quyền yên tĩnh người thuê nhà",
        "th": "ห้องเช่าไม่เก็บเสียง ขอยกเลิกสัญญา, ขอเงินมัดจำคืน ห้องเสียงดัง, ยกเลิกสัญญาเช่าคอนโด เสียงรบกวน, บอกเลิกสัญญาเช่า ห้องไม่เก็บเสียง, สิทธิผู้เช่าเรื่องความสงบ"
    },
    "workplace-noise-inspection": {
        "zh": "职业噪声排查, 工厂车间85dB超标检测, 办公室隔音环境评估, 职业健康声学巡检报告, 劳动保护噪音危害, 职业性耳聋预防",
        "en": "workplace noise inspection, OSHA noise exposure limits 85 dBA, factory decibel meter, office acoustic audit, occupational noise exposure assessment, hearing conservation program noise audit",
        "es": "inspección ruido laboral, prevención riesgos laborales ruido, sonómetro para empresas, límite 85 dB jornada laboral, auditoría acústica oficinas, evaluación acústica puestos de trabajo",
        "fr": "contrôle du bruit au travail, médecine du travail seuil 85 dB, évaluation des risques acoustiques atelier, mesurage bruit bureau, santé sécurité travail bruit, pénibilité bruit au travail",
        "de": "lärmmessung am arbeitsplatz, arbeitsschutz 85 dB lärmbereich, gefährdungsbeurteilung lärm büro, schallpegel werkshalle prüfen, gehörschutz pflicht arbeitsplatz, lärmkataster erstellen",
        "ja": "職場 オフィス 工場 騒音巡回点検, 労働安全衛生法 85dB 騒音作業環境, オフィスの 音響環境 測定, 産業医 労働基準監督署 提出用, 聴力保護 基準, 作業環境測定 騒音",
        "ko": "직장 및 사업장 산업안전 소음 점검, 산업안전보건법 85dB 초과 작업장, 사무실 소음 환경 평가, 노동부 근로감독 제출용, 소음성 난청 예방, 작업환경측정 소음",
        "vi": "kiểm tra tiếng ồn nơi làm việc, an toàn lao động giới hạn 85 dB nhà xưởng, đo tiếng ồn văn phòng công ty, quan trắc môi trường lao động tiếng ồn, phòng chống bệnh điếc nghề nghiệp",
        "th": "การตรวจวัดเสียงในสถานที่ทำงานและโรงงาน, มาตรฐานความปลอดภัยทางชีวอนามัยเสียง 85 dB, ตรวจประเมินเสียงรบกวนในออฟฟิศ, การป้องกันอันตรายจากเสียงในที่ทำงาน, ตรวจวัดเสียงสะสมในโรงงาน"
    },
    "about": {
        "zh": "关于我们, 声学研发团队, SOUNDTEST.PRO愿景, 民间声学存证工具, 客服联系方式",
        "en": "about us, acoustic engineering team, SOUNDTEST.PRO mission, sound meter tools, customer support contact",
        "es": "sobre nosotros, equipo ingeniería acústica, misión soundtest, herramientas sonometría, contacto soporte",
        "fr": "à propos, équipe ingénierie acoustique, mission soundtest, sonomètre en ligne, contact support client",
        "de": "über uns, akustik entwicklerteam, soundtest mission, schallmessung browser, kundenservice kontakt",
        "ja": "運営情報, 開発チーム, SOUNDTEST.PROについて, 音響測定ツール 理念, お問い合わせ サポート",
        "ko": "회사 소개, 음향 엔지니어링 팀, SOUNDTEST.PRO 비전, 소음측정 도구, 고객지원 문의",
        "vi": "về chúng tôi, đội ngũ kỹ thuật âm thanh, sứ mệnh soundtest, công cụ đo tiếng ồn trực tuyến, liên hệ hỗ trợ",
        "th": "เกี่ยวกับเรา, ทีมวิศวกรเสียง, พันธกิจ SOUNDTEST.PRO, เครื่องมือวัดเสียงออนไลน์, ติดต่อฝ่ายสนับสนุน"
    },
    "changelog": {
        "zh": "版本更新日志, 声级算法更新记录, 精度优化历史, 功能迭代公告",
        "en": "product changelog, acoustic meter updates, calibration release notes, new features log",
        "es": "historial de versiones, registro de cambios, actualizaciones sonómetro, mejoras calibración",
        "fr": "journal des modifications, historique des versions, mises à jour sonomètre, notes de version",
        "de": "versionshistorie, changelog soundtest, änderungsprotokoll schallpegel, update meldungen",
        "ja": "更新履歴, リリースノート, 騒音計 バージョン情報, 音響アルゴリズム 改定記録",
        "ko": "업데이트 기록, 변경 로그, 소음측정기 버전 기록, 음향 알고리즘 개선 내역",
        "vi": "nhật ký cập nhật, lịch sử phiên bản, nâng cấp thuật toán âm thanh, tính năng mới",
        "th": "บันทึกการอัปเดต, บันทึกการเปลี่ยนแปลง, อัปเดตเครื่องวัดเสียง, ประวัติเวอร์ชันใหม่"
    },
    "disclaimer": {
        "zh": "法律免责声明, 民间声学证据效力, 非法定计量认证仪器说明, 维权参考依据",
        "en": "legal disclaimer, civilian acoustic evidence weight, non-certified meter disclosure, measurement reference only",
        "es": "aviso legal, limitación de responsabilidad, validez pericial civil, sonómetro no certificado aviso",
        "fr": "mentions légales, avertissement juridique, valeur probante constat privé, sonomètre non homologué notice",
        "de": "haftungsausschluss, rechtlicher hinweis, beweiswert privates lärmprotokoll, kein geeichtes messgerät",
        "ja": "免責事項, 法的告知, 民間測定 証拠能力, 非検定計器 表示, 測定結果 参考利用",
        "ko": "법적 면책 조항, 민간 소음측정 법적 효력, 비공인 측정기 고지, 분쟁 참고 자료 안내",
        "vi": "tuyên bố miễn trừ trách nhiệm, giá trị chứng cứ dân sự, thông báo máy đo không kiểm định, tài liệu tham khảo",
        "th": "ข้อสงวนสิทธิ์ทางกฎหมาย, คุณค่าทางกฎหมายของหลักฐานส่วนบุคคล, หนังสือแจ้งเครื่องมือไม่ผ่านการรับรอง, ข้อมูลอ้างอิงเบื้องต้น"
    },
    "privacy": {
        "zh": "隐私政策, 本地录音数据保护, 零上传音频隐私, GPS地理位置授权说明, Cookie合规",
        "en": "privacy policy, local audio storage, zero cloud audio upload, GDPR compliance, GPS data protection",
        "es": "política de privacidad, almacenamiento local audio, protección de datos RGPD, privacidad ubicación GPS",
        "fr": "politique de confidentialité, traitement local audio, conformité RGPD, protection données géolocalisation",
        "de": "datenschutzerklärung, lokale audiospeicherung, datenschutz DSGVO, standortdaten schutz",
        "ja": "プライバシーポリシー, 音声データ ローカル保持, 個人情報保護方針, 位置情報 取扱い規定",
        "ko": "개인정보 처리방침, 로컬 오디오 저장, 녹음 파일 비전송 원칙, GPS 위치정보 보호, 개인정보보호법 준수",
        "vi": "chính sách bảo mật, bảo vệ dữ liệu âm thanh tại chỗ, bảo mật quyền riêng tư không tải lên, dữ liệu định vị GPS",
        "th": "นโยบายความเป็นส่วนตัว, การจัดเก็บข้อมูลเสียงภายในเครื่อง, การคุ้มครองข้อมูลส่วนบุคคล PDPA, ความปลอดภัยข้อมูลพิกัด GPS"
    },
    "terms": {
        "zh": "服务条款, 用户使用协议, 声学数据使用规范, 软件许可协议, 会员服务条款",
        "en": "terms of service, user agreement, software license terms, acceptable use policy, subscription terms",
        "es": "términos del servicio, condiciones de uso, acuerdo de licencia, política de uso aceptable",
        "fr": "conditions d'utilisation, contrat d'utilisation, licence logicielle, conditions d'abonnement",
        "de": "nutzungsbedingungen, AGB soundtest, softwarelizenz bestimmungen, abonnement vertrag",
        "ja": "利用規約, ユーザー利用協定, サービス利用規約, ソフトウェアライセンス, サブスクリプション規約",
        "ko": "이용약관, 서비스 이용계약, 소프트웨어 라이선스, 회원 서비스 규정, 이용자 준수사항",
        "vi": "điều khoản dịch vụ, thỏa thuận người dùng, giấy phép phần mềm, quy định sử dụng dịch vụ",
        "th": "ข้อกำหนดการใช้งาน, ข้อตกลงผู้ใช้, เงื่อนไขการอนุญาตใช้ซอฟต์แวร์, ข้อกำหนดการสมัครสมาชิก"
    },
    "refund": {
        "zh": "退款政策, 会员退费细则, 7天无理由退款说明, 争议解决与消费者权益",
        "en": "refund policy, subscription cancellation, money back guarantee, customer satisfaction terms",
        "es": "política de reembolso, cancelación suscripción, garantía de devolución, derechos del consumidor",
        "fr": "politique de remboursement, droit de rétractation, annulation abonnement, garantie satisfaction",
        "de": "erstattungsrichtlinie, widerrufsrecht software, rückerstattung abonnement, geld-zurück-garantie",
        "ja": "返金ポリシー, サブスクリプション解約, クーリングオフ規定, 返金手続き 案内",
        "ko": "환불 정책, 구독 취소 규정, 결제 취소 및 환불 안내, 청약철회 및 소비자보호",
        "vi": "chính sách hoàn tiền, hủy gói thành viên, bảo đảm hoàn tiền, quyền lợi người tiêu dùng",
        "th": "นโยบายการคืนเงิน, การยกเลิกการสมัครสมาชิก, การรับประกันคืนเงิน, สิทธิของผู้บริโภค"
    }
}


def inject_keywords_into_html(filepath: str, keywords_str: str) -> bool:
    """Inject or update <meta name="keywords" content="..."> in given HTML file."""
    if not os.path.exists(filepath):
        return False

    with open(filepath, "r", encoding="utf-8", errors="ignore") as f:
        content = f.read()

    # Pattern for existing keywords tag
    kw_pattern = re.compile(r'<meta\s+name=["\']keywords["\'][^>]*>', re.IGNORECASE)
    new_kw_tag = f'<meta name="keywords" content="{keywords_str}">'

    if kw_pattern.search(content):
        # Update existing
        updated = kw_pattern.sub(new_kw_tag, content, count=1)
        if updated != content:
            with open(filepath, "w", encoding="utf-8") as f:
                f.write(updated)
            return True
        return False
    else:
        # Insert after <meta name="description" ...>
        desc_pattern = re.compile(r'(<meta\s+name=["\']description["\'][^>]*>)', re.IGNORECASE)
        m = desc_pattern.search(content)
        if m:
            replacement = m.group(1) + "\n" + new_kw_tag
            updated = content[:m.start()] + replacement + content[m.end():]
            with open(filepath, "w", encoding="utf-8") as f:
                f.write(updated)
            return True
        else:
            # Fallback: insert before </head>
            head_end = re.search(r'</head>', content, re.IGNORECASE)
            if head_end:
                updated = content[:head_end.start()] + new_kw_tag + "\n" + content[head_end.start():]
                with open(filepath, "w", encoding="utf-8") as f:
                    f.write(updated)
                return True
    return False


def main():
    pages_list = [
        ("home", "index.html", "{lang}/index.html"),
        ("camera", "camera.html", "{lang}/camera.html"),
        ("noise-levels", "noise-levels.html", "{lang}/noise-levels.html"),
        ("accuracy", "accuracy.html", "{lang}/accuracy.html"),
        ("standards", "standards.html", "{lang}/standards.html"),
        ("samples", "samples.html", "{lang}/samples.html"),
        ("download", "download.html", "{lang}/download.html"),
        ("auth", "auth.html", "{lang}/auth.html"),
        ("use-cases", "use-cases/index.html", "use-cases/{lang}/index.html"),
        ("neighbor-noise-evidence", "use-cases/neighbor-noise-evidence.html", "use-cases/{lang}/neighbor-noise-evidence.html"),
        ("construction-noise-monitoring", "use-cases/construction-noise-monitoring.html", "use-cases/{lang}/construction-noise-monitoring.html"),
        ("property-noise-complaint-report", "use-cases/property-noise-complaint-report.html", "use-cases/{lang}/property-noise-complaint-report.html"),
        ("bar-street-disturbance", "use-cases/bar-street-disturbance.html", "use-cases/{lang}/bar-street-disturbance.html"),
        ("rental-dispute-evidence", "use-cases/rental-dispute-evidence.html", "use-cases/{lang}/rental-dispute-evidence.html"),
        ("workplace-noise-inspection", "use-cases/workplace-noise-inspection.html", "use-cases/{lang}/workplace-noise-inspection.html"),
        ("about", "about.html", "{lang}/about.html"),
        ("changelog", "changelog.html", "{lang}/changelog.html"),
        ("disclaimer", "disclaimer.html", "{lang}/disclaimer.html"),
        ("privacy", "privacy.html", "{lang}/privacy.html"),
        ("terms", "terms.html", "{lang}/terms.html"),
        ("refund", "refund.html", "{lang}/refund.html")
    ]

    updated_count = 0
    total_processed = 0

    # 1. Update soundtest.html
    soundtest_path = os.path.join(ROOT, "soundtest.html")
    if os.path.exists(soundtest_path):
        if inject_keywords_into_html(soundtest_path, KEYWORDS_MAP["soundtest"]["all"]):
            updated_count += 1
            print(f"Updated: soundtest.html")
        total_processed += 1

    # 2. Iterate each page and each language
    for page_key, en_rel, lang_rel in pages_list:
        kw_data = KEYWORDS_MAP.get(page_key, {})
        for lang in LANGS:
            kw_str = kw_data.get(lang)
            if not kw_str:
                continue
            
            # Root English file (or en/{page})
            if lang == "en":
                paths = [os.path.join(ROOT, en_rel), os.path.join(ROOT, f"en/{en_rel}")]
            else:
                paths = [os.path.join(ROOT, lang_rel.format(lang=lang))]

            for p in paths:
                if os.path.exists(p):
                    total_processed += 1
                    if inject_keywords_into_html(p, kw_str):
                        updated_count += 1
                        print(f"Updated [{lang}] {os.path.relpath(p, ROOT)}")

    print(f"\nCompleted: Processed {total_processed} files, Updated/Injected {updated_count} files.")


if __name__ == "__main__":
    main()
