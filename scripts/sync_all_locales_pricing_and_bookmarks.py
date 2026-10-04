import os, re

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

CONFIG = {
    'de': {
        'nav_bm': '<button type="button" class="nav-bookmark-btn" data-bookmark-trigger title="Lesezeichen oder zum Startbildschirm hinzufügen">\n          <span class="star" aria-hidden="true">⭐</span>\n          <span class="nav-bm-text">Lesezeichen</span>\n          <kbd data-bookmark-key>Ctrl+D</kbd>\n        </button>',
        'hero_bm': '<div class="hero-bookmark-bar" data-bookmark-trigger title="Lesezeichen &amp; Schnellzugriff">\n            <span class="star-icon" aria-hidden="true">⭐</span>\n            <span>Tipp: Mit <kbd data-bookmark-key>Ctrl+D</kbd> als Lesezeichen speichern (Mobil: Zum Startbildschirm), jederzeit sofort griffbereit</span>\n            <span class="action-arrow" aria-hidden="true">→</span>\n          </div>',
        'toggle_yearly': 'Jährliche Abrechnung',
        'toggle_discount': '58% Ersparnis',
        'toggle_monthly': 'Monatliche Abrechnung',
        'free_pill': 'Kostenlose Basis',
        'free_name': 'Kostenlose Version',
        'free_hint': 'Schneller Lärmcheck &amp; Echtzeit-Dezibelmessung im Browser',
        'free_cta': 'Jetzt kostenlos starten',
        'free_items': [
            'Echtzeit-Dezibelmessung (A-Bewertung dB)',
            'Live-Frequenzspektrumanalyse (FFT)',
            'Kurze browserinterne Audio- &amp; Fotoaufnahmen',
            'Automatischer Zeit- und GPS-Koordinatenstempel',
            'Vorschau-Prüfbericht mit Wasserzeichen'
        ],
        'pro_badge': '★ Beliebteste Wahl',
        'pro_pill': 'Pro Jahresversion',
        'pro_name': 'Langzeit-Beweisakte',
        'pro_hint_yearly': '365 Tage automatisierte Überwachung · Entlastet von manueller Protokollierung',
        'pro_hint_monthly': 'Ideal für zeitlich begrenzte Ruhestörungen, Baustellen oder Mietprüfungen',
        'pro_items': [
            '<strong>Unbegrenzte</strong> offizielle <strong>PDF-Beweisberichte ohne Wasserzeichen</strong> (mit Prüffingerabdruck)',
            '🌙 <strong>Nacht-Wächter-Modus</strong>: Lückenlose Erfassung nächtlicher Ruhestörungen',
            '📊 <strong>Mehrtägiges Stördossier</strong>: Monatsübergreifende Lärmverlaufskurven',
            '⚖️ <strong>Juristische Beschwerdevorlagen</strong>: Formblätter für Vermieter &amp; Behörden',
            '☁️ <strong>Verschlüsselte Cloud-Synchronisation</strong>: Dauerhafte Sicherung &amp; Multi-Device-Sync'
        ],
        'pro_cta_yearly': 'Pro Jahrespass holen · 24,99 $',
        'pro_cta_monthly': 'Pro Monat sichern · 4,99 $',
        'single_bar_text': 'Benötigen Sie nur einen einzelnen Bericht?',
        'single_bar_link': 'Einzelbericht ohne Wasserzeichen für 1,99 $ freischalten →',
        'pro_login_link': 'Bereits ein Konto? Anmelden',
        'life_pill': 'Lebenslange Lizenz',
        'life_name': 'Unbegrenzter Vollzugang',
        'life_hint': 'Einmalzahlung · Dauerhafte Gewissheit &amp; Rechtssicherheit ohne Abo',
        'life_items': [
            '<strong>Dauerhafte Volllizenz</strong> ohne wiederkehrende Gebühren oder Abofallen',
            'Enthält alle Wächter-Funktionen, Stördossiers und Musterschreiben',
            'Geräteübergreifende Synchronisation &amp; dauerhafter Cloud-Speicher',
            'Prioritäts-Support &amp; alle zukünftigen Akustik-Updates inklusive',
            'Jederzeit einsatzbereit bei Miet-, Nachbarschafts- oder Gewerbekonflikten'
        ],
        'life_cta': 'Lebenslang sichern · 79,99 $'
    },
    'es': {
        'nav_bm': '<button type="button" class="nav-bookmark-btn" data-bookmark-trigger title="Guardar en marcadores o añadir a inicio">\n          <span class="star" aria-hidden="true">⭐</span>\n          <span class="nav-bm-text">Marcador</span>\n          <kbd data-bookmark-key>Ctrl+D</kbd>\n        </button>',
        'hero_bm': '<div class="hero-bookmark-bar" data-bookmark-trigger title="Añadir a marcadores y acceso rápido">\n            <span class="star-icon" aria-hidden="true">⭐</span>\n            <span>Consejo: Guarda con <kbd data-bookmark-key>Ctrl+D</kbd> en marcadores (en móvil: añadir a inicio) para medir ruidos repentinos</span>\n            <span class="action-arrow" aria-hidden="true">→</span>\n          </div>',
        'toggle_yearly': 'Facturación Anual',
        'toggle_discount': 'Ahorra 58%',
        'toggle_monthly': 'Facturación Mensual',
        'free_pill': 'Nivel Gratuito',
        'free_name': 'Versión Gratuita',
        'free_hint': 'Chequeo rápido de nivel de ruido y estimación de dB en tiempo real',
        'free_cta': 'Comenzar Gratis',
        'free_items': [
            'Monitoreo de decibelios en tiempo real (Ponderación A)',
            'Espectro de frecuencia FFT dinámico',
            'Grabación breve de audio y fotografías con marca de agua',
            'Etiquetado automático con marca temporal y geolocalización GPS',
            'Informe preliminar para comprobación personal'
        ],
        'pro_badge': '★ Opción Más Popular',
        'pro_pill': 'Pro Versión Anual',
        'pro_name': 'Expediente Legal Pro',
        'pro_hint_yearly': '365 días de monitorización continua · Libérate del insomnio de registrar a mano',
        'pro_hint_monthly': 'Perfecto para conflictos de alquiler, ruidos de reformas u obras inmediatas',
        'pro_items': [
            '<strong>Descargas ilimitadas</strong> de <strong>informes PDF formales sin marca de agua</strong> (con huella digital)',
            '🌙 <strong>Modo Centinela Nocturno</strong>: Registro automático de picos de exceso de ruido',
            '📊 <strong>Dossier de Molestias Continuas</strong>: Gráficos de tendencias acústicas acumuladas',
            '⚖️ <strong>Plantillas de Reclamación Legal</strong>: Escritos de queja y requerimientos formales',
            '☁️ <strong>Sincronización en la Nube</strong>: Acceso multidispositivo, pruebas siempre a salvo'
        ],
        'pro_cta_yearly': 'Obtener Pase Anual Pro · $24.99',
        'pro_cta_monthly': 'Contratar Pro Mensual · $4.99',
        'single_bar_text': '¿Solo necesitas un único informe?',
        'single_bar_link': 'Desbloquear informe único sin marca de agua $1.99 →',
        'pro_login_link': '¿Ya tienes una cuenta? Iniciar sesión',
        'life_pill': 'Licencia de por Vida',
        'life_name': 'Acceso Total Ilimitado',
        'life_hint': 'Pago único · Protección y seguridad permanente sin suscripciones recurrentes',
        'life_items': [
            '<strong>Licencia permanente de por vida</strong> sin tarifas de renovación periódicas',
            'Incluye todas las funciones de centinela, informes de tendencia y plantillas legales',
            'Sincronización multidispositivo y respaldo cifrado en la nube',
            'Soporte prioritario VIP y todas las actualizaciones acústicas futuras',
            'Listo para actuar de inmediato ante conflictos de vivienda, vecinos o locales'
        ],
        'life_cta': 'Obtener Acceso Vitalicio · $79.99'
    },
    'fr': {
        'nav_bm': '<button type="button" class="nav-bookmark-btn" data-bookmark-trigger title="Ajouter aux favoris ou à l\'écran d\'accueil">\n          <span class="star" aria-hidden="true">⭐</span>\n          <span class="nav-bm-text">Favoris</span>\n          <kbd data-bookmark-key>Ctrl+D</kbd>\n        </button>',
        'hero_bm': '<div class="hero-bookmark-bar" data-bookmark-trigger title="Ajouter aux favoris et accès rapide">\n            <span class="star-icon" aria-hidden="true">⭐</span>\n            <span>Astuce : Enregistrez avec <kbd data-bookmark-key>Ctrl+D</kbd> dans vos favoris (mobile : ajouter à l\'accueil) pour un accès immédiat</span>\n            <span class="action-arrow" aria-hidden="true">→</span>\n          </div>',
        'toggle_yearly': 'Facturation annuelle',
        'toggle_discount': '-58% de réduction',
        'toggle_monthly': 'Facturation mensuelle',
        'free_pill': 'Offre Gratuite',
        'free_name': 'Version Gratuite',
        'free_hint': 'Vérification acoustique immédiate &amp; estimation des décibels en direct',
        'free_cta': 'Commencer Gratuitement',
        'free_items': [
            'Mesure des décibels en temps réel (pondération A)',
            'Analyseur de spectre sonore FFT en direct',
            'Enregistrement audio et photos horodatées dans le navigateur',
            'Horodatage inviolable &amp; géolocalisation GPS automatique',
            'Rapport d\'évaluation avec filigrane pour vérification personnelle'
        ],
        'pro_badge': '★ Choix le Plus Populaire',
        'pro_pill': 'Version Annuelle Pro',
        'pro_name': 'Dossier Preuve Pro',
        'pro_hint_yearly': '365 jours de surveillance continue automatisée · Plus besoin de veiller pour enregistrer',
        'pro_hint_monthly': 'Idéal pour litiges locatifs, bruits de travaux urgents ou constatations ponctuelles',
        'pro_items': [
            '<strong>Téléchargements illimités</strong> de <strong>rapports PDF certifiés sans filigrane</strong>',
            '🌙 <strong>Mode Sentinelle Nocturne</strong> : Détection automatique des pics de tapage',
            '📊 <strong>Dossier de Nuisances Répétées</strong> : Courbes d\'évolution sur plusieurs semaines',
            '⚖️ <strong>Modèles Juridiques de Plainte</strong> : Lettres types pour syndic, propriétaire et forces de l\'ordre',
            '☁️ <strong>Sauvegarde Chiffrée Cloud</strong> : Synchronisation multi-appareils pour ne rien perdre'
        ],
        'pro_cta_yearly': 'Pass Annuel Pro · $24.99',
        'pro_cta_monthly': 'Prendre Pro Mensuel · $4.99',
        'single_bar_text': 'Besoin d\'un seul rapport ?',
        'single_bar_link': 'Débloquer un rapport unique sans filigrane $1.99 →',
        'pro_login_link': 'Déjà un compte ? Se connecter',
        'life_pill': 'Licence à Vie',
        'life_name': 'Accès Illimité Définitif',
        'life_hint': 'Paiement unique · Sérénité et force probante permanente sans abonnement',
        'life_items': [
            '<strong>Licence permanente à vie</strong> sans aucun frais récurrent ni renouvellement',
            'Comprend toutes les fonctionnalités Sentinelle, dossiers d\'analyse et modèles légaux',
            'Synchronisation multi-appareils et stockage cloud chiffré illimité',
            'Support VIP prioritaire et toutes les futures améliorations acoustiques incluses',
            'Prêt à être mobilisé à tout moment en cas de litige de voisinage, bail ou chantier'
        ],
        'life_cta': 'Obtenir l\'Accès à Vie · $79.99'
    },
    'ja': {
        'nav_bm': '<button type="button" class="nav-bookmark-btn" data-bookmark-trigger title="ブックマークまたはホーム画面に追加">\n          <span class="star" aria-hidden="true">⭐</span>\n          <span class="nav-bm-text">ブックマーク</span>\n          <kbd data-bookmark-key>Ctrl+D</kbd>\n        </button>',
        'hero_bm': '<div class="hero-bookmark-bar" data-bookmark-trigger title="ブックマークとホーム画面追加">\n            <span class="star-icon" aria-hidden="true">⭐</span>\n            <span>おすすめ：<kbd data-bookmark-key>Ctrl+D</kbd> でブックマーク保存（スマホはホーム画面に追加）しておくと、突然の騒音でも即座に起動できます</span>\n            <span class="action-arrow" aria-hidden="true">→</span>\n          </div>',
        'toggle_yearly': '年額プラン',
        'toggle_discount': '58% OFF',
        'toggle_monthly': '月額プラン',
        'free_pill': '無料基本プラン',
        'free_name': '無料版',
        'free_hint': '迅速な騒音レベル測定とリアルタイムdB推定',
        'free_cta': '今すぐ無料で始める',
        'free_items': [
            'リアルタイム騒音測定（A特性周波数重み付け）',
            'ライブFFT音響スペクトラム解析',
            'ブラウザ内での簡易録音および写真記録',
            '自動タイムスタンプおよびGPS位置情報付与',
            '民間参考用の透かし入り事前確認レポート'
        ],
        'pro_badge': '★ 最も選ばれている人気プラン',
        'pro_pill': 'Pro 年間プレミアム',
        'pro_name': '長期紛争対策ファイル',
        'pro_hint_yearly': '365日間の自動監視体制 · 手動での見張りや記録ストレスから完全解放',
        'pro_hint_monthly': '短期賃貸中のトラブル、突発的な解体・リフォーム工事対策に最適',
        'pro_items': [
            '<strong>無制限</strong>の公式<strong>ウォーターマークなし証拠PDFレポート出力</strong> (改ざん防止検証付き)',
            '🌙 <strong>夜間ノイズ見張り番モード</strong>：深夜の断続的騒音を逃さず自動記録',
            '📊 <strong>連続騒音被害鑑定ファイル</strong>：月単位の騒音推移と頻度マップ集計',
            '⚖️ <strong>苦情申入・法的通知書テンプレート</strong>：管理会社や大家への交渉書面を作成',
            '☁️ <strong>暗号化クラウド同期</strong>：複数端末同期＆長期証拠バックアップ'
        ],
        'pro_cta_yearly': '年間Proパスを入手 · $24.99',
        'pro_cta_monthly': '月額Proに加入 · $4.99',
        'single_bar_text': '単回のレポート出力のみが必要ですか？',
        'single_bar_link': '1回きりの無透かし証拠レポートをアンロック $1.99 →',
        'pro_login_link': 'アカウントをお持ちですか？ ログイン',
        'life_pill': '永久ライセンス',
        'life_name': '買い切り無制限版',
        'life_hint': '1回のお支払いで永久利用 · 更新料やサブスク課金は一切不要',
        'life_items': [
            '<strong>永久利用ライセンス</strong>：継続的な課金リスクなし',
            '見張り番モード、被害ファイル、法的書面テンプレートを全網羅',
            'デバイス間同期および永久暗号化クラウド保存',
            'VIP優先サポートおよび将来の全音響ツール機能へのアクセス権',
            '賃貸・隣人トラブル・工事騒音発生時にいつでも即座に証拠化可能'
        ],
        'life_cta': '永久アクセス権を獲得 · $79.99'
    },
    'ko': {
        'nav_bm': '<button type="button" class="nav-bookmark-btn" data-bookmark-trigger title="북마크 또는 홈 화면에 추가">\n          <span class="star" aria-hidden="true">⭐</span>\n          <span class="nav-bm-text">북마크</span>\n          <kbd data-bookmark-key>Ctrl+D</kbd>\n        </button>',
        'hero_bm': '<div class="hero-bookmark-bar" data-bookmark-trigger title="북마크 및 홈 화면 추가">\n            <span class="star-icon" aria-hidden="true">⭐</span>\n            <span>팁: <kbd data-bookmark-key>Ctrl+D</kbd> 로 북마크 저장(모바일은 홈 화면 추가)해 두시면 돌발 소음 발생 시 즉시 측정 가능합니다</span>\n            <span class="action-arrow" aria-hidden="true">→</span>\n          </div>',
        'toggle_yearly': '연간 결제',
        'toggle_discount': '58% 할인',
        'toggle_monthly': '월간 결제',
        'free_pill': '무료 기본 플랜',
        'free_name': '무료 버전',
        'free_hint': '신속한 기준 소음 측정 및 실시간 데시벨 추정',
        'free_cta': '지금 무료 시작',
        'free_items': [
            '실시간 데시벨 측정 (dB A-가중치 적용)',
            '실시간 FFT 음향 주파수 스펙트럼 분석기',
            '브라우저 내 즉석 오디오 녹음 및 워터마크 사진 기록',
            '위변조 방지 타임스탬프 및 GPS 위치 좌표 자동 표기',
            '민간 참고용 워터마크 미리보기 리포트 제공'
        ],
        'pro_badge': '★ 가장 인기 있는 추천 플랜',
        'pro_pill': 'Pro 연간 프리미엄',
        'pro_name': '장기 분쟁 증거 보관철',
        'pro_hint_yearly': '365일 무중단 자동 감시 · 밤샘 수동 기록의 피로에서 해방',
        'pro_hint_monthly': '단기 임대차 갈등, 돌발 인테리어 공사 소음 대비에 최적',
        'pro_items': [
            '<strong>무제한</strong> 정식 <strong>워터마크 없는 증거 PDF 리포트 발행</strong> (위변조 방지 지문 탑재)',
            '🌙 <strong>야간 소음 보초 모드</strong>: 기준 초과 돌발 소음 발생 시 자동 포착 및 기록',
            '📊 <strong>연속 소음 피해 분석철</strong>: 다일간의 소음 추세 및 통계 그래프 집계',
            '⚖️ <strong>법적 분쟁 항의서 템플릿</strong>: 관리사무소, 집주인 및 경찰 제출용 서식',
            '☁️ <strong>암호화 클라우드 동기화</strong>: 기기 변경에도 영구 보존되는 증거 원본'
        ],
        'pro_cta_yearly': '연간 Pro 패스 시작 · $24.99',
        'pro_cta_monthly': '월간 Pro 구독 · $4.99',
        'single_bar_text': '단 1건의 리포트만 필요하신가요?',
        'single_bar_link': '단회 워터마크 해제 리포트 열람 $1.99 →',
        'pro_login_link': '이미 계정이 있으신가요? 로그인',
        'life_pill': '평생 소장 라이선스',
        'life_name': '평생 무제한 패키지',
        'life_hint': '단 1회 결제로 평생 이용 · 정기 구독료 없는 완전 소장',
        'life_items': [
            '<strong>영구 평생 이용 라이선스</strong>로 향후 추가 구독료 전혀 없음',
            '야간 보초 감시, 피해 통계철, 법무 템플릿의 모든 특권 포함',
            '다기기 계정 동기화 및 무제한 클라우드 보안 보관',
            'VIP 우선 지원 및 향후 출시되는 모든 음향 분석 기능 무료 제공',
            '층간소음, 공사 갈등 발생 시 언제든 즉각적인 법적 증빙 자료 생성'
        ],
        'life_cta': '평생 소장권 구매 · $79.99'
    },
    'th': {
        'nav_bm': '<button type="button" class="nav-bookmark-btn" data-bookmark-trigger title="บุ๊กมาร์กหรือเพิ่มลงในหน้าจอหลัก">\n          <span class="star" aria-hidden="true">⭐</span>\n          <span class="nav-bm-text">บุ๊กมาร์ก</span>\n          <kbd data-bookmark-key>Ctrl+D</kbd>\n        </button>',
        'hero_bm': '<div class="hero-bookmark-bar" data-bookmark-trigger title="บุ๊กมาร์กและเพิ่มลงหน้าจอหลัก">\n            <span class="star-icon" aria-hidden="true">⭐</span>\n            <span>คำแนะนำ: กด <kbd data-bookmark-key>Ctrl+D</kbd> เพื่อบันทึกเป็นบุ๊กมาร์ก (มือถือ: เพิ่มไปยังหน้าจอหลัก) พร้อมตรวจวัดเสียงรบกวนทันที</span>\n            <span class="action-arrow" aria-hidden="true">→</span>\n          </div>',
        'toggle_yearly': 'ชำระรายปี',
        'toggle_discount': 'ประหยัด 58%',
        'toggle_monthly': 'ชำระรายเดือน',
        'free_pill': 'แผนฟรีพื้นฐาน',
        'free_name': 'เวอร์ชันฟรี',
        'free_hint': 'ตรวจสอบระดับเสียงรบกวนและประมาณค่าเดซิเบลแบบเรียลไทม์',
        'free_cta': 'เริ่มใช้งานฟรีทันที',
        'free_items': [
            'ตรวจวัดระดับเดซิเบลแบบเรียลไทม์ (การถ่วงน้ำหนัก A-weighting)',
            'วิเคราะห์สเปกตรัมความถี่เสียง FFT แบบเรียลไทม์',
            'บันทึกเสียงและภาพถ่ายพร้อมลายน้ำชั่วคราวบนเบราว์เซอร์',
            'ประทับเวลาและพิกัดตำแหน่ง GPS อัตโนมัติป้องกันการแก้ไข',
            'รายงานตัวอย่างพร้อมลายน้ำสำหรับการตรวจสอบด้วยตนเอง'
        ],
        'pro_badge': '★ ตัวเลือกยอดนิยม',
        'pro_pill': 'Pro เวอร์ชันรายปี',
        'pro_name': 'แฟ้มหลักฐาน Pro ระยะยาว',
        'pro_hint_yearly': 'เฝ้าระวังอัตโนมัติตลอด 365 วัน · หมดกังวลเรื่องการอดนอนบันทึกเสียงด้วยตนเอง',
        'pro_hint_monthly': 'เหมาะสำหรับข้อพิพาทการเช่าระยะสั้น หรือการก่อสร้างต่อเติมเร่งด่วน',
        'pro_items': [
            '<strong>ส่งออกรายงาน PDF หลักฐานทางการแบบไร้ลายน้ำไม่จำกัด</strong> (พร้อมระบบลายนิ้วมือป้องกันการแก้ไข)',
            '🌙 <strong>โหมดเวรยามกลางคืน (Sentry Mode)</strong>: บันทึกและทำเครื่องหมายอัตโนมัติเมื่อเสียงเกินเกณฑ์',
            '📊 <strong>แฟ้มประเมินการรบกวนต่อเนื่อง</strong>: แผนภูมิแนวโน้มความถี่เสียงสะสมหลายวัน',
            '⚖️ <strong>แบบฟอร์มเอกสารร้องเรียนทางกฎหมาย</strong>: สร้างหนังสือร้องเรียนและจดหมายเตือนได้ในคลิกเดียว',
            '☁️ <strong>สำรองข้อมูลบนคลาวด์แบบเข้ารหัส</strong>: ซิงค์ข้ามอุปกรณ์ หลักฐานไม่มีวันสูญหาย'
        ],
        'pro_cta_yearly': 'สมัคร Pro รายปี · $24.99',
        'pro_cta_monthly': 'สมัคร Pro รายเดือน · $4.99',
        'single_bar_text': 'ต้องการเพียงรายงานฉบับเดียว?',
        'single_bar_link': 'ปลดล็อกรายงานเดี่ยวไร้ลายน้ำ $1.99 →',
        'pro_login_link': 'มีบัญชีอยู่แล้ว? เข้าสู่ระบบ',
        'life_pill': 'ใบอนุญาตตลอดชีพ',
        'life_name': 'แพ็กเกจตลอดชีพไร้ขีดจำกัด',
        'life_hint': 'ชำระครั้งเดียวใช้งานได้ตลอดชีพ · ไม่มีการต่ออายุหรือเรียกเก็บเงินซ้ำซ้อน',
        'life_items': [
            '<strong>สิทธิ์ใช้งานตลอดชีพถาวร</strong> ปราศจากค่าธรรมเนียมรายเดือนหรือรายปีใดๆ ทั้งสิ้น',
            'รวมฟังก์ชันเวรยามกลางคืน แฟ้มสถิติเสียง และเอกสารทางกฎหมายทั้งหมด',
            'ซิงค์ข้ามอุปกรณ์และพื้นที่จัดเก็บข้อมูลบนคลาวด์แบบเข้ารหัสถาวร',
            'สิทธิ์การบริการระดับ VIP และอัปเกรดฟีเจอร์อะคูสติกใหม่ทั้งหมดในอนาคตฟรี',
            'พร้อมใช้งานได้ทันทีเมื่อเกิดข้อพิพาทเพื่อนบ้าน การก่อสร้าง หรือสถานบันเทิง'
        ],
        'life_cta': 'รับสิทธิ์ตลอดชีพ · $79.99'
    },
    'vi': {
        'nav_bm': '<button type="button" class="nav-bookmark-btn" data-bookmark-trigger title="Lưu dấu trang hoặc thêm vào màn hình chính">\n          <span class="star" aria-hidden="true">⭐</span>\n          <span class="nav-bm-text">Dấu trang</span>\n          <kbd data-bookmark-key>Ctrl+D</kbd>\n        </button>',
        'hero_bm': '<div class="hero-bookmark-bar" data-bookmark-trigger title="Lưu dấu trang và truy cập nhanh">\n            <span class="star-icon" aria-hidden="true">⭐</span>\n            <span>Gợi ý: Nhấn <kbd data-bookmark-key>Ctrl+D</kbd> để lưu dấu trang (trên điện thoại: thêm vào màn hình chính) để kích hoạt ngay khi có tiếng ồn</span>\n            <span class="action-arrow" aria-hidden="true">→</span>\n          </div>',
        'toggle_yearly': 'Thanh toán hàng năm',
        'toggle_discount': 'Tiết kiệm 58%',
        'toggle_monthly': 'Thanh toán hàng tháng',
        'free_pill': 'Gói Miễn phí',
        'free_name': 'Phiên bản Miễn phí',
        'free_hint': 'Kiểm tra độ ồn tức thì &amp; ước lượng decibel theo thời gian thực',
        'free_cta': 'Bắt đầu Miễn phí Ngay',
        'free_items': [
            'Đo mức decibel theo thời gian thực (trọng số A-weighting)',
            'Phân tích phổ tần số âm thanh FFT động',
            'Ghi âm và chụp ảnh kèm tọa độ trực tiếp trong trình duyệt',
            'Tự động gắn dấu thời gian và tọa độ GPS chống sửa đổi',
            'Báo cáo xem trước có hình mờ phục vụ tham khảo cá nhân'
        ],
        'pro_badge': '★ Lựa chọn Phổ biến Nhất',
        'pro_pill': 'Pro Bản Hàng năm',
        'pro_name': 'Hồ sơ Chứng cứ Pro',
        'pro_hint_yearly': 'Giám sát tự động liên tục 365 ngày · Giải phóng hoàn toàn khỏi việc thức đêm ghi âm thủ công',
        'pro_hint_monthly': 'Phù hợp cho tranh chấp thuê nhà ngắn hạn hoặc tiếng ồn sửa chữa khẩn cấp',
        'pro_items': [
            '<strong>Xuất không giới hạn</strong> các <strong>báo cáo PDF chứng cứ chính thức không hình mờ</strong> (có vân tay chống giả)',
            '🌙 <strong>Chế độ Lính gác Đêm</strong>: Tự động ghi lại và đánh dấu khi tiếng ồn vượt ngưỡng',
            '📊 <strong>Hồ sơ Đánh giá Quấy nhiễu Liên tục</strong>: Biểu đồ xu hướng âm học tổng hợp nhiều ngày',
            '⚖️ <strong>Biểu mẫu Khiếu nại Pháp lý</strong>: Tạo đơn kiến nghị và văn bản yêu cầu xử lý trong 1 cú nhấp',
            '☁️ <strong>Đồng bộ Đám mây Mã hóa</strong>: Truy cập đa thiết bị, lưu trữ an toàn trọn đời'
        ],
        'pro_cta_yearly': 'Nhận thẻ Pro 1 năm · $24.99',
        'pro_cta_monthly': 'Đăng ký Pro hàng tháng · $4.99',
        'single_bar_text': 'Chỉ cần một bản báo cáo duy nhất?',
        'single_bar_link': 'Mở khóa 1 báo cáo không hình mờ $1.99 →',
        'pro_login_link': 'Đã có tài khoản? Đăng nhập',
        'life_pill': 'Bản quyền Trọn đời',
        'life_name': 'Gói Trọn đời Không Giới hạn',
        'life_hint': 'Thanh toán một lần duy nhất · An tâm bảo vệ quyền lợi lâu dài, không gia hạn',
        'life_items': [
            '<strong>Bản quyền trọn đời vĩnh viễn</strong>, không bao giờ phải chịu phí gia hạn định kỳ',
            'Bao gồm toàn bộ tính năng lính gác đêm, thống kê xu hướng và biểu mẫu pháp lý',
            'Đồng bộ tài khoản đa thiết bị và lưu trữ đám mây mã hóa an toàn tuyệt đối',
            'Hỗ trợ ưu tiên VIP và miễn phí toàn bộ công cụ âm học nâng cấp trong tương lai',
            'Sẵn sàng trích xuất bằng chứng bất cứ khi nào phát sinh tranh chấp tiếng ồn'
        ],
        'life_cta': 'Sở hữu Trọn đời · $79.99'
    }
}

def update_locale_page(code, cfg):
    path = os.path.join(ROOT, code, 'index.html')
    if not os.path.exists(path):
        print(f"Skipping {code}: file does not exist")
        return
    with open(path, 'r', encoding='utf-8') as f:
        html = f.read()

    # 1. Nav bookmark button in .nav-utility
    if 'class="nav-bookmark-btn"' not in html:
        # insert right before <a class="nav-upgrade"
        m = re.search(r'(<div class="nav-utility">)(\s*)(<a class="nav-upgrade")', html)
        if m:
            replacement = f'{m.group(1)}\n        {cfg["nav_bm"]}\n        {m.group(3)}'
            html = html[:m.start()] + replacement + html[m.end():]
            print(f"[{code}] Added nav bookmark button")

    # 2. Hero bookmark bar in .hero-actions
    if 'class="hero-bookmark-bar"' not in html:
        # insert right after </div> of .hero-actions
        m = re.search(r'(<div class="hero-actions">[\s\S]*?</div>)', html)
        if m:
            replacement = f'{m.group(1)}\n          {cfg["hero_bm"]}'
            html = html[:m.start()] + replacement + html[m.end():]
            print(f"[{code}] Added hero bookmark bar")

    # 3. Pricing Section Redesign (Option A: 3 Cards + Billing Toggle)
    # Match the entire pricing section content from <div class="pricing-row"> up to before <div class="pricing-matrix-wrap
    pattern = re.compile(r'(<div class="section-header reveal">[\s\S]*?</div>\s*)(<div class="pricing-row">[\s\S]*?</div>)(\s*<!-- Full Feature Comparison Matrix -->|\s*<div class="pricing-matrix-wrap)', re.MULTILINE)
    m = pattern.search(html)
    if m:
        free_li_html = "\n            ".join([f"<li>{item}</li>" for item in cfg['free_items']])
        pro_li_html = "\n            ".join([f"<li>{item}</li>" for item in cfg['pro_items']])
        life_li_html = "\n            ".join([f"<li>{item}</li>" for item in cfg['life_items']])

        new_pricing_block = f'''<!-- Interactive Billing Toggle -->
      <div class="billing-toggle-wrap reveal">
        <div class="billing-toggle" role="group" aria-label="Billing cycle selector">
          <button type="button" class="billing-toggle-btn active" data-billing-toggle="yearly">
            <span>{cfg['toggle_yearly']}</span>
            <span class="billing-discount-badge">{cfg['toggle_discount']}</span>
          </button>
          <button type="button" class="billing-toggle-btn" data-billing-toggle="monthly">
            <span>{cfg['toggle_monthly']}</span>
          </button>
        </div>
      </div>

      <div class="pricing-row pricing-three-cards">
        <!-- Free Tier -->
        <div class="price-card reveal">
          <span class="price-pill">{cfg['free_pill']}</span>
          <span class="price-name">{cfg['free_name']}</span>
          <div class="price-tag">$0<small style="font-size:13px;color:var(--soft);">/forever</small></div>
          <div class="price-compare-hint">{cfg['free_hint']}</div>
          <ul class="check-list">
            {free_li_html}
          </ul>
          <a class="button" href="../soundtest.html">{cfg['free_cta']}</a>
        </div>

        <!-- Pro Tier (Interactive Toggle Yearly vs Monthly) -->
        <div class="price-card pro reveal">
          <div class="price-card-img" style="border-radius:8px;overflow:hidden;margin:0 0 10px;max-height:100px;">
            <img src="../assets/images/sentry_night_monitor.webp" alt="Overnight Sentry Mode illustration" loading="lazy" style="width:100%;height:100px;object-fit:cover;object-position:center 40%;display:block;">
          </div>
          <span class="price-badge-popular">{cfg['pro_badge']}</span>
          <span class="price-pill">{cfg['pro_pill']}</span>
          <span class="price-name">{cfg['pro_name']}</span>
          <div class="price-tag">
            <span class="billing-period-yearly">
              <del class="price-del">$59.99</del>$24.99<small style="font-size:13px;color:var(--soft);">/yr</small>
              <span class="price-discount-tag" style="background:rgba(44,240,193,0.2);color:#2cf0c1;border-color:rgba(44,240,193,0.5);">Save $35</span>
            </span>
            <span class="billing-period-monthly" style="display:none;">
              <del class="price-del">$9.99</del>$4.99<small style="font-size:13px;color:var(--soft);">/mo</small>
              <span class="price-discount-tag" style="background:rgba(124,155,255,0.2);color:#7c9bff;border-color:rgba(124,155,255,0.4);">50% OFF</span>
            </span>
          </div>
          <div class="price-compare-hint billing-period-yearly">{cfg['pro_hint_yearly']}</div>
          <div class="price-compare-hint billing-period-monthly" style="display:none;">{cfg['pro_hint_monthly']}</div>
          <ul class="check-list">
            {pro_li_html}
          </ul>
          <a class="button primary billing-period-yearly" href="https://www.creem.io/payment/prod_18imyd506sx0xFOcMiqB2c" target="_blank" rel="noopener">{cfg['pro_cta_yearly']}</a>
          <a class="button primary billing-period-monthly" href="https://www.creem.io/payment/prod_4jTdMPIau4Pzn1HKHPW9NQ" target="_blank" rel="noopener" style="display:none;border-color:rgba(124,155,255,0.45);background:linear-gradient(135deg,rgba(124,155,255,0.2),rgba(255,255,255,0.04));color:#a5b4fc;font-weight:750;">{cfg['pro_cta_monthly']}</a>
          <div class="single-report-link-bar">
            <span>{cfg['single_bar_text']}</span>
            <a class="single-link" href="https://www.creem.io/payment/prod_2Xc2ichF1Xk2mmzrhBxyYC" target="_blank" rel="noopener">{cfg['single_bar_link']}</a>
          </div>
          <a class="button-link" href="auth.html" style="margin-top:6px;font-size:12px;">{cfg['pro_login_link']}</a>
        </div>

        <!-- Lifetime Tier -->
        <div class="price-card lifetime reveal">
          <span class="price-pill">{cfg['life_pill']}</span>
          <span class="price-name">{cfg['life_name']}</span>
          <div class="price-tag">
            <del class="price-del">$199.00</del>$79.99
            <span class="price-discount-tag">60% OFF</span>
          </div>
          <div class="price-compare-hint">{cfg['life_hint']}</div>
          <ul class="check-list">
            {life_li_html}
          </ul>
          <a class="button" href="https://www.creem.io/payment/prod_18nHbuAQNpc4n334rM9hGV" target="_blank" rel="noopener" style="border-color:rgba(245,158,11,0.5);background:linear-gradient(135deg,rgba(245,158,11,0.2),rgba(255,255,255,0.04));color:#fbbf24;font-weight:800;">{cfg['life_cta']}</a>
          <a class="button-link" href="auth.html" style="margin-top:6px;font-size:12px;">{cfg['pro_login_link']}</a>
        </div>
      </div>'''

        html = html[:m.start(2)] + new_pricing_block + html[m.end(2):]
        print(f"[{code}] Successfully converted pricing to Option A (3 modern cards + billing toggle)")

    with open(path, 'w', encoding='utf-8') as f:
        f.write(html)

for code, cfg in CONFIG.items():
    update_locale_page(code, cfg)
print("All locale pages processed!")
