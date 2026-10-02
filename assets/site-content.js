(function () {
  'use strict';

  const positioning = {
    zh: 'SOUNDTEST.PRO 是面向噪声投诉、物业协同、施工巡检和企业环境管理的环境记录与证据辅助网站/PWA，提供实时分贝估算、地点标注、声学证据照片、录音录像和 PDF/CSV 报告。',
    en: 'SOUNDTEST.PRO is a global noise documentation website and acoustic evidence aid for complaints, property coordination, construction inspections, workplace reviews, evidence photos, recordings, and PDF/CSV reports.',
  };

  const keywords = {
    zh: [
      '噪音投诉证据',
      '邻里噪音取证',
      '物业噪音巡查',
      '施工噪音监测',
      '企业噪声巡检',
      '声学证据照片',
      '噪音报告生成',
    ],
    en: [
      'noise complaint evidence',
      'neighbor noise recording',
      'apartment noise meter',
      'construction noise monitoring',
      'property noise management',
      'workplace noise inspection',
      'environmental noise report',
      'acoustic evidence photo',
      'decibel meter with PDF report',
    ],
  };

  const routes = [
    { href: 'index.html', label: 'Home', zh: '首页' },
    { href: 'soundtest.html', label: 'Open App', zh: '打开工具' },
    { href: 'auth.html', label: 'Account', zh: '账户' },
    { href: 'privacy.html', label: 'Privacy', zh: '隐私' },
    { href: 'accuracy.html', label: 'Accuracy', zh: '精度说明' },
    { href: 'standards.html', label: 'Standards', zh: '噪声参考' },
    { href: 'samples.html', label: 'Samples', zh: '报告样例' },
    { href: 'download.html', label: 'Install', zh: '安装' },
    { href: 'compliance.html', label: 'Compliance', zh: '合规' },
    { href: 'changelog.html', label: 'Updates', zh: '更新记录' },
  ];

  const supportedLanguages = [
    { code: 'en', name: 'English', title: 'Free Online Noise Evidence Recorder', cta: 'Open web app' },
    { code: 'zh', name: '中文', title: '免费在线噪音取证记录工具', cta: '打开网页工具' },
    { code: 'es', name: 'Español', title: 'Grabador web de ruido para reclamaciones', cta: 'Abrir herramienta' },
    { code: 'fr', name: 'Français', title: 'Outil web pour documenter les nuisances sonores', cta: 'Ouvrir l’outil' },
    { code: 'de', name: 'Deutsch', title: 'Web-Tool zur Dokumentation von Lärm', cta: 'Tool öffnen' },
    { code: 'ja', name: '日本語', title: '騒音記録と苦情資料をブラウザーで作成', cta: 'ツールを開く' },
    { code: 'ko', name: '한국어', title: '소음 기록과 민원 자료를 브라우저에서 작성', cta: '도구 열기' },
    { code: 'vi', name: 'Tiếng Việt', title: 'Công cụ web ghi nhận tiếng ồn để khiếu nại', cta: 'Mở công cụ' },
    { code: 'th', name: 'ไทย', title: 'เครื่องมือเว็บสำหรับบันทึกหลักฐานเสียงรบกวน', cta: 'เปิดเครื่องมือ' },
  ];

  const homepageCopy = {
    slogan: 'Free Online Noise Evidence Recorder | No App Required',
    subtitle: 'Measure Decibels, Record Sound, Save Time & Location for Noise Complaint Documentation.',
    intro: 'A professional browser-based noise monitoring and evidence aid. No app download is required: run directly in your browser. Real-time decibel estimates, audio recording, waveform spectrum, timestamp, and location can be saved for neighbor noise, apartment disturbance, construction noise, bar and street noise, and legal complaint preparation.',
    features: [
      {
        title: 'Real Time Decibel Meter',
        body: 'Sound level detection with dB / dBA, peak, average, LAeq, and percentile summaries.',
      },
      {
        title: 'Audio & Waveform Recording',
        body: 'Record noise with waveform and spectrum context to keep complete local sound documentation.',
      },
      {
        title: 'Auto Time & Location Stamp',
        body: 'Automatically record date, time, and geographic location when permission is granted.',
      },
      {
        title: 'Evidence Report Export',
        body: 'Generate structured reports for property management, local authority, police report preparation, or legal review.',
      },
    ],
    scenarios: [
      'Neighbor & Apartment Noise',
      'Construction Renovation Noise',
      'Bar, Shop & Street Disturbance',
      'Rental Dispute & Legal Evidence Aid',
      'Home Environment Sound Monitoring',
    ],
    standardReference: {
      daytime: 'Daytime Reference (6:00-22:00)',
      daytimeLimit: 'Recommended context: <= 60 dB',
      nighttime: 'Nighttime Reference (22:00-6:00)',
      nighttimeLimit: 'Recommended context: <= 55 dB',
      disclaimer: 'Reference only. Local rules vary, and excessive noise should be verified with local authority procedures or certified equipment when formal proof is required.',
    },
    buttons: {
      startMonitoring: 'Start Monitoring',
      stopRecording: 'Stop Recording',
      exportReport: 'Export Report',
      copyLink: 'Copy Link',
      switchLanguage: 'Switch Language',
      upgradePro: 'Upgrade to Premium',
    },
  };

  const localizedCopy = {
    en: {
      slogan: 'Free Online Noise Evidence Recorder | No App Required',
      subtitle: 'Measure Decibels, Record Sound, Save Time & Location for Noise Complaint Documentation.',
      features: ['Real Time Decibel Meter', 'Audio & Waveform Recording', 'Auto Time & Location Stamp', 'Evidence Report Export'],
      scenarios: 'Neighbor & Apartment Noise / Construction Noise / Bar & Street Disturbance / Rental Dispute & Legal Evidence Aid',
      buttons: { startMonitoring: 'Start Monitoring', stopRecording: 'Stop Recording', exportReport: 'Export Report', switchLanguage: 'Switch Language' },
      disclaimer: 'Compliance & Evidence Protocol: SOUNDTEST.PRO provides an objective, tamper-evident digital record of onsite acoustic events for dispute documentation and municipal filing. All audio and sensor data are securely processed locally on your device with complete privacy.',
    },
    zh: {
      slogan: '免费在线噪音取证记录工具｜无需安装 App',
      subtitle: '测量分贝、记录声音、保存时间与位置，用于噪音投诉资料整理。',
      features: ['实时分贝测量', '音频与波形记录', '自动时间与位置标记', '证据报告导出'],
      scenarios: '邻里与公寓噪音 / 装修施工噪音 / 酒吧商铺与街道扰民 / 租房纠纷与证据辅助',
      buttons: { startMonitoring: '开始监测', stopRecording: '停止录制', exportReport: '导出报告', switchLanguage: '切换语言' },
      disclaimer: '合规与存证说明：本工具提供现场声学事实数字化记录与维权底稿，严密保留时间、频段与位置链条。法定计量认证依各属地行政程序办理，本平台所有音频与传感数据均在本地安全处理，绝不上传私密数据。',
    },
    es: {
      slogan: 'Grabador de Evidencia de Ruido Online Gratuito | Sin Instalar App',
      subtitle: 'Mide decibelios, graba sonido y guarda hora y ubicación para documentación de reclamos.',
      features: ['Medidor de decibelios en tiempo real', 'Grabación de audio y forma de onda', 'Sello automático de hora y ubicación', 'Exportar informe de evidencia'],
      scenarios: 'Ruido de vecinos y apartamentos / Ruido de construcción / Molestias de bares y calles / Disputas de alquiler y evidencia legal',
      buttons: { startMonitoring: 'Iniciar Monitoreo', stopRecording: 'Detener Grabación', exportReport: 'Exportar Informe', switchLanguage: 'Cambiar idioma' },
      disclaimer: 'Protocolo de cumplimiento y evidencia: SOUNDTEST.PRO proporciona un registro digital objetivo e inalterable de eventos acústicos para documentación de reclamos y mediación. Todos los datos se procesan localmente en su dispositivo garantizando total privacidad.',
    },
    fr: {
      slogan: 'Enregistreur de Bruit Preuve Gratuit Sans Application',
      subtitle: 'Mesurez les décibels, enregistrez le son, sauvegardez l’heure et la position pour préparer une plainte.',
      features: ['Mesure de décibels en temps réel', 'Enregistrement audio et forme d’onde', 'Horodatage et position automatique', 'Exporter le rapport de preuve'],
      scenarios: 'Bruit de voisins et appartement / Bruit de chantier / Nuisances de bars et rue / Litige locatif et preuve légale',
      buttons: { startMonitoring: 'Lancer la mesure', stopRecording: 'Arrêter l’enregistrement', exportReport: 'Exporter le rapport', switchLanguage: 'Changer de langue' },
      disclaimer: 'Protocole de conformité et de preuve : SOUNDTEST.PRO fournit un enregistrement numérique objectif et infalsifiable des événements acoustiques pour la constitution de dossiers et la médiation. Toutes les données sont traitées localement sur votre appareil en toute confidentialité.',
    },
    de: {
      slogan: 'Kostenloser Lärmaufzeichner für Beweise | Keine App nötig',
      subtitle: 'Messung von Dezibel, Tonaufnahme, Zeit- und Standortspeicherung für Beschwerdeunterlagen.',
      features: ['Echtzeit Dezibelmesser', 'Ton- und Wellenformaufnahme', 'Automatische Zeit- und Ortsmarkierung', 'Beweisbericht exportieren'],
      scenarios: 'Nachbar- und Wohnlärm / Baulärm / Lärm von Bars und Straßen / Mietstreitigkeiten & Rechtsbeweise',
      buttons: { startMonitoring: 'Überwachung starten', stopRecording: 'Aufnahme stoppen', exportReport: 'Bericht exportieren', switchLanguage: 'Sprache wechseln' },
      disclaimer: 'Konformitäts- und Beweisprotokoll: SOUNDTEST.PRO liefert eine objektive, manipulationssichere digitale Dokumentation akustischer Vorfälle für Schlichtungsverfahren und Nachbarschaftsbeschwerden. Sämtliche Daten werden lokal auf Ihrem Endgerät verarbeitet.',
    },
    ja: {
      slogan: '無料オンライン騒音証拠記録ツール｜アプリ不要',
      subtitle: 'デシベル測定・音録音・時間位置記録で騒音トラブルの資料作成に。',
      features: ['リアルタイムデシベル測定', '音声・波形録音', '時間・位置自動記録', '証拠レポート出力'],
      scenarios: '近所・アパート騒音 / 工事騒音 / 飲食店・街の騒音 / 賃貸トラブル証拠',
      buttons: { startMonitoring: '測定開始', stopRecording: '録音停止', exportReport: 'レポート出力', switchLanguage: '言語切り替え' },
      disclaimer: '適合性および証拠プロトコル：SOUNDTEST.PROは、近隣トラブルや申し立て資料として、現場の音響事象を客観的かつ改ざん防止技術でデジタル記録します。すべてのデータは端末内で安全にローカル処理され、プライバシーを厳格に保護します。',
    },
    ko: {
      slogan: '무료 온라인 소음 증거 녹음 도구 | 앱 설치 불필요',
      subtitle: '데시벨 측정, 소리 녹음, 시간 및 위치 저장으로 민원 자료를 준비하세요.',
      features: ['실시간 데시벨 측정', '음성 및 파형 녹음', '시간 및 위치 자동 기록', '증거 보고서 내보내기'],
      scenarios: '이웃 및 아파트 소음 / 공사 소음 / 술집·거리 소음 / 임대 분쟁 및 법적 증거',
      buttons: { startMonitoring: '측정 시작', stopRecording: '녹음 정지', exportReport: '보고서 내보내기', switchLanguage: '언어 전환' },
      disclaimer: '규정 준수 및 증거 프로토콜: SOUNDTEST.PRO는 분쟁 문서화 및 민원 접수를 위해 현장 음향 사건에 대한 객관적이고 위변조 방지 디지털 증거 기록을 제공합니다. 모든 데이터는 기기 내부에서 로컬로 안전하게 처리됩니다.',
    },
    vi: {
      slogan: 'Công cụ ghi nhận tiếng ồn trực tuyến miễn phí | Không cần cài app',
      subtitle: 'Đo decibel, ghi âm, lưu thời gian và vị trí phục vụ hồ sơ khiếu nại.',
      features: ['Máy đo decibel thời gian thực', 'Ghi âm thanh và dạng sóng', 'Tự động đóng dấu thời gian và vị trí', 'Xuất báo cáo bằng chứng'],
      scenarios: 'Tiếng ồn hàng xóm / Thi công / Quán bar và đường phố / Tranh chấp thuê nhà',
      buttons: { startMonitoring: 'Bắt đầu đo', stopRecording: 'Dừng ghi', exportReport: 'Xuất báo cáo', switchLanguage: 'Đổi ngôn ngữ' },
      disclaimer: 'Quy chuẩn và chứng cứ: SOUNDTEST.PRO cung cấp bản ghi kỹ thuật số khách quan, chống giả mạo về các sự kiện âm thanh hiện trường phục vụ hòa giải và hồ sơ khiếu nại. Mọi dữ liệu được xử lý cục bộ trên thiết bị của bạn.',
    },
    th: {
      slogan: 'เครื่องมือบันทึกหลักฐานเสียงรบกวนออนไลน์ฟรี | ไม่ต้องติดตั้งแอป',
      subtitle: 'วัดเดซิเบล บันทึกเสียง บันทึกเวลาและตำแหน่งเพื่อเตรียมการร้องเรียน',
      features: ['เครื่องวัดเดซิเบลแบบเรียลไทม์', 'บันทึกเสียงและรูปคลื่น', 'ประทับเวลาและตำแหน่งอัตโนมัติ', 'ส่งออกรายงานหลักฐาน'],
      scenarios: 'เสียงรบกวนจากเพื่อนบ้าน / การก่อสร้าง / เสียงรบกวนจากบาร์และถนน / ข้อพิพาทการเช่า',
      buttons: { startMonitoring: 'เริ่มวัด', stopRecording: 'หยุดบันทึก', exportReport: 'ส่งออกรายงาน', switchLanguage: 'เปลี่ยนภาษา' },
      disclaimer: 'เกณฑ์การปฏิบัติตามมาตรฐานและหลักฐาน: SOUNDTEST.PRO ให้การบันทึกดิจิทัลที่น่าเชื่อถือและป้องกันการดัดแปลงของเหตุการณ์เสียงในสถานที่ เพื่อการจัดทำเอกสารข้อพิพาท ข้อมูลทั้งหมดประมวลผลในเครื่องของคุณอย่างปลอดภัย',
    },
    };
  const noiseGuidelines = [
    {
      title: 'WHO environmental noise guidance',
      body: 'Use WHO public health guidance as a context reference for community, transport, and night noise discussions.',
      disclaimer: 'Reference guidance only; local rules vary and formal assessment needs qualified procedures.',
    },
    {
      title: 'Common day and night limits',
      body: 'Many local rules distinguish daytime and nighttime noise, but thresholds and enforcement processes differ by city and country.',
      disclaimer: 'Reference guidance only; local rules vary and SOUNDTEST.PRO does not decide compliance.',
    },
    {
      title: 'US and EU local authority context',
      body: 'Use exported reports to organize facts before speaking with landlords, local authorities, building managers, or legal advisers.',
      disclaimer: 'Reference guidance only; local rules vary and reports are not certified measurements.',
    },
  ];

  const globalTerms = [
    'Legal Evidence Aid',
    'Noise Complaint',
    'Local Authority',
    'Police Report',
    'Landlord Report',
    'Property Manager',
    'Tenant Dispute',
    'Field Documentation',
  ];

  const useCases = [
    {
      slug: 'neighbor-noise-evidence',
      href: 'use-cases/neighbor-noise-evidence.html',
      title: 'Neighbor Noise Evidence',
      zhTitle: '邻里噪音取证',
      keyword: 'neighbor noise recording',
      audience: 'Tenants, apartment owners, mediators, and property managers',
      promise: 'Build a time-stamped noise diary with dB trends, photos, location notes, and exportable complaint reports.',
      disclaimer: 'SOUNDTEST.PRO is not a certified sound level meter; use formal measurements when legal or regulatory proof is required.',
    },
    {
      slug: 'construction-noise-monitoring',
      href: 'use-cases/construction-noise-monitoring.html',
      title: 'Construction Noise Monitoring',
      zhTitle: '施工噪音监测',
      keyword: 'construction noise monitoring',
      audience: 'Renovation teams, site supervisors, property staff, and residents',
      promise: 'Record start, peak, and quiet-after periods with photos, video, GPS, LAeq, L10/L90, and field notes.',
      disclaimer: 'SOUNDTEST.PRO is not a certified sound level meter; project compliance should be verified with calibrated instruments.',
    },
    {
      slug: 'property-noise-complaint-report',
      href: 'use-cases/property-noise-complaint-report.html',
      title: 'Property Noise Complaint Report',
      zhTitle: '物业噪音投诉报告',
      keyword: 'property noise management',
      audience: 'Property managers, community committees, and resident service teams',
      promise: 'Turn site visits into structured records with measurement points, incident notes, PDF reports, and CSV exports.',
      disclaimer: 'SOUNDTEST.PRO is not a certified sound level meter; it organizes field documentation before professional review.',
    },
    {
      slug: 'bar-street-disturbance',
      href: 'use-cases/bar-street-disturbance.html',
      title: 'Bar, Shop & Street Disturbance',
      zhTitle: '酒吧商铺与街道扰民',
      keyword: 'bar street noise complaint',
      audience: 'Residents, shop neighbors, renters, and mediation teams',
      promise: 'Document repeated late-night or street-level disturbance patterns with time, place, audio, photos, and reports.',
      disclaimer: 'SOUNDTEST.PRO is not a certified sound level meter; local rules and complaint procedures vary.',
    },
    {
      slug: 'rental-dispute-evidence',
      href: 'use-cases/rental-dispute-evidence.html',
      title: 'Rental Dispute & Legal Evidence Aid',
      zhTitle: '租房纠纷与证据辅助',
      keyword: 'rental dispute noise evidence',
      audience: 'Tenants, landlords, housing advisers, and legal support teams',
      promise: 'Organize noise records before speaking with a landlord, property manager, local authority, or legal adviser.',
      disclaimer: 'SOUNDTEST.PRO is not a certified sound level meter; it organizes field documentation only and legal or regulatory claims require qualified review.',
    },
    {
      slug: 'workplace-noise-inspection',
      href: 'use-cases/workplace-noise-inspection.html',
      title: 'Workplace Noise Inspection',
      zhTitle: '办公与工厂噪声巡检',
      keyword: 'workplace noise inspection',
      audience: 'Office teams, factory EHS teams, stores, hotels, schools, and clinics',
      promise: 'Capture repeatable local inspection records with weighting, calibration context, media, and exportable summaries.',
      disclaimer: 'SOUNDTEST.PRO is not a certified sound level meter; occupational or legal assessments require qualified equipment.',
    },
  ];

  const launchMetrics = {
    events: [
      { name: 'monitor_start', why: 'Validates that visitors move from landing pages into the tool.' },
      { name: 'evidence_photo_saved', why: 'Shows that the acoustic evidence photo workflow is understandable.' },
      { name: 'recording_saved', why: 'Measures whether users complete audio or video evidence capture.' },
      { name: 'pdf_exported', why: 'Measures report-generation value.' },
      { name: 'csv_exported', why: 'Measures professional and team workflow demand.' },
      { name: 'backup_exported', why: 'Measures trust in local-first evidence management.' },
      { name: 'commercial_inquiry_copied', why: 'Signals interest in Pro, Team, or Lifetime Offline plans.' },
    ],
    successCriteria: [
      'At least one mobile and one desktop browser complete monitor, photo, recording, and PDF export.',
      'Saved watermarked video is verified outside the app, not only in preview.',
      'Landing pages produce app opens for at least two use-case segments.',
      'Every public page keeps the non-certified measurement disclaimer visible.',
      'Feedback reports include device, browser, permissions, and storage context.',
    ],
  };

  const monetization = {
    plans: [
      { name: 'Free', price: '$0', benefits: ['Live decibel estimate', 'Single evidence records', 'Basic PDF/CSV export', 'Careful ads outside core controls'] },
      { name: 'Single Report', price: '$1.99', benefits: ['One-time clean PDF export', 'Tamper-evident ID & GPS watermark', 'No watermark', 'No subscription required'] },
      { name: 'Pro', price: '$4.99/month or $24.99/year', benefits: ['No ads', 'Batch PDF/CSV', 'Premium report templates', 'Longer local recording guidance', 'Metadata backup tools'] },
      { name: 'Lifetime', price: '$79.99', benefits: ['No ads', 'Local-first desktop/offline edition waitlist', 'PDF templates', 'Calibration profiles', 'No subscription renewal'] },
    ],
    affiliate: ['soundproofing materials', 'professional sound level meters', 'tenant and legal consultation services'],
    warning: 'Do not promise cloud storage until accounts, deletion, encryption, retention, and regional privacy compliance are ready.',
  };

  const changelog = [
    {
      date: '2026-05-17',
      title: 'SOUNDTEST.PRO brand and global SEO launch',
      summary: 'Renamed the public product to SOUNDTEST.PRO, updated canonical links, hreflang tags, sitemap, robots, manifest, and SoftwareApplication structured data.',
    },
    {
      date: '2026-05-17',
      title: 'System language and saved language preference',
      summary: 'Added language routing that prefers a saved user selection, then the browser system language, and falls back to English for unsupported locales.',
    },
    {
      date: '2026-05-17',
      title: 'Multilingual global landing pages',
      summary: 'Added English, Spanish, French, German, Japanese, Korean, Vietnamese, and Thai landing paths for international SEO and sharing.',
    },
    {
      date: '2026-05-17',
      title: 'Local storage health and metadata backup',
      summary: 'Added local storage status, browser quota visibility, persistence context, and metadata-only backup export without bundling media blobs.',
    },
    {
      date: '2026-05-17',
      title: 'Evidence workflow hardening',
      summary: 'Added evidence IDs, manifest hashing, A/C/Z weighting, percentile metrics, 1/3 octave bands, Baidu Maps JSONP support, and photo capture during recording.',
    },
  ];

  window.SoundfieldSite = {
    positioning,
    keywords,
    routes,
    supportedLanguages,
    homepageCopy,
    localizedCopy,
    noiseGuidelines,
    globalTerms,
    useCases,
    launchMetrics,
    monetization,
    changelog,
    disclaimer: 'For field documentation only. SOUNDTEST.PRO is not a certified sound level meter.',
  };
})();
