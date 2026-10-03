/* SOUNDTEST.PRO experience layer — entrance reveals, hero search, recent activity */
(function () {
  'use strict';

  const RECENT_KEY = 'soundtest_recent_v1';
  const MAX_RECENT = 5;

  function initRevealAnimations() {
    if (!('IntersectionObserver' in window)) {
      document.querySelectorAll('.reveal').forEach((el) => el.classList.add('is-visible'));
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.16, rootMargin: '0px 0px -40px 0px' }
    );
    document.querySelectorAll('.reveal').forEach((el, index) => {
      if (!el.style.getPropertyValue('--reveal-delay')) {
        el.style.setProperty('--reveal-delay', `${Math.min(index, 12) * 60}ms`);
      }
      observer.observe(el);
    });
  }

  function readRecent() {
    try {
      const raw = localStorage.getItem(RECENT_KEY);
      const list = JSON.parse(raw || '[]');
      return Array.isArray(list) ? list : [];
    } catch (_) {
      return [];
    }
  }

  function writeRecent(value) {
    try {
      const existing = readRecent().filter((item) => item.label !== value.label);
      const next = [value, ...existing].slice(0, MAX_RECENT);
      localStorage.setItem(RECENT_KEY, JSON.stringify(next));
      renderRecent();
    } catch (_) {
      /* storage may be disabled */
    }
  }

  function renderRecent() {
    const host = document.querySelector('[data-recent-host]');
    if (!host) return;
    const items = readRecent();
    if (!items.length) {
      host.hidden = true;
      host.innerHTML = '';
      return;
    }
    host.hidden = false;
    host.innerHTML = `
      <span class="recent-label">Recent</span>
      ${items
        .map(
          (item) => `
            <button type="button" class="recent-pill" data-recent-label="${escapeHtml(item.label)}" data-recent-path="${escapeHtml(item.path || '')}">
              <span aria-hidden="true">↺</span>
              <span>${escapeHtml(item.label)}</span>
            </button>
          `
        )
        .join('')}
    `;
    host.querySelectorAll('.recent-pill').forEach((pill) => {
      pill.addEventListener('click', () => {
        const path = pill.getAttribute('data-recent-path') || '../use-cases/';
        window.location.href = path;
      });
    });
  }

  function escapeHtml(value) {
    // Delegated to shared utils.js to avoid duplication
    if (window.__sfUtils && window.__sfUtils.escHtml) return window.__sfUtils.escHtml(value);
    return String(value || '').replace(/[&<>"']/g, (char) => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;',
    })[char]);
  }

  const SCENARIO_DATA = {
    "general": {
        "en": {
            "title": "General Environmental Sound Measurement",
            "desc": "Standard unclassified sound level monitoring with equivalent LAeq, peak and statistical metrics.",
            "day": "≤ 55 dB",
            "night": "≤ 45 dB",
            "metric": "LAeq + Lpeak + L90",
            "tamper": "GPS + SHA-256",
            "s1": "General environmental sound logging standards applied",
            "s2": "A-weighting & Fast dynamic response ready",
            "s3": "Local-only tamper-evident verification locked",
            "s4": "Ready — launch to generate official acoustic measurement log",
            "cta": "Start General Measurement",
            "guide": "Acoustic Standards"
        },
        "zh": {
            "title": "通用声学环境测量与日常记录模板",
            "desc": "面向未特定分类、日常突发声响、居家或办公环境的客观分贝存证记录。",
            "day": "≤ 55 dB",
            "night": "≤ 45 dB",
            "metric": "LAeq 等效声级 + Lpeak",
            "tamper": "GPS + SHA-256",
            "s1": "已加载通用声学环境监测与统计规范",
            "s2": "初始化 A 计权滤波与全频段平滑处理",
            "s3": "纯本地防篡改 SHA-256 存证链已就绪",
            "s4": "就绪 — 启动即可生成标准声学测量底稿",
            "cta": "启动通用环境测量",
            "guide": "噪声标准指南"
        },
        "path": "neighbor-noise-evidence.html"
    },
    "traffic": {
        "en": {
            "title": "Traffic & Road Transportation Noise",
            "desc": "Capture peak traffic flow, exhaust acceleration, and continuous road tire rumble.",
            "day": "≤ 70 dB",
            "night": "≤ 55 dB",
            "metric": "LAeq + L10 (Traffic Peaks)",
            "tamper": "GPS + SHA-256",
            "s1": "Transportation road boundary regulations loaded",
            "s2": "L10 traffic peak percentile calculator active",
            "s3": "GPS roadway anchor point confirmed",
            "s4": "Ready — monitor highway & road traffic noise",
            "cta": "Start Traffic Monitoring",
            "guide": "Road Noise Guide"
        },
        "zh": {
            "title": "道路交通与过往车辆噪音记录模板",
            "desc": "针对临街主干道车流、早晚高峰车辆鸣笛、大货车制动与低频胎噪。",
            "day": "≤ 70 dB",
            "night": "≤ 55 dB",
            "metric": "LAeq + L10 交通峰值",
            "tamper": "GPS + SHA-256",
            "s1": "已加载交通干线环境噪声限值标准",
            "s2": "启动 L10 交通流量峰值分位数统计",
            "s3": "GPS 临路绝对经纬度锚点已校验",
            "s4": "就绪 — 连续监测主干道车辆噪声数据",
            "cta": "启动道路交通监测",
            "guide": "交通噪声标准"
        },
        "path": "construction-noise-monitoring.html"
    },

    "neighbor": {
        "en": {
            "title": "Neighbor Noise Evidence Template",
            "desc": "Optimized for ceiling footsteps, TV/music, pet disturbance, and HVAC vibrations.",
            "day": "≤ 55 dB",
            "night": "≤ 45 dB",
            "metric": "LAeq + L10",
            "tamper": "GPS + SHA-256",
            "s1": "Scenario acoustic profile matched",
            "s2": "Fast/Slow response & A-weighting initialized",
            "s3": "Zero-cloud local processing verified",
            "s4": "Ready — start recording to capture court-admissible facts",
            "cta": "Launch Evidence Recorder",
            "guide": "Case Guide"
        },
        "zh": {
            "title": "邻里与公寓噪音取证模板",
            "desc": "针对楼上脚步声、低音炮扰民、宠物吠叫与管道空调震动优化。",
            "day": "≤ 55 dB",
            "night": "≤ 45 dB",
            "metric": "LAeq 等效声级",
            "tamper": "GPS + SHA-256",
            "s1": "已匹配居住区生活噪音取证规范",
            "s2": "初始化 A 计权滤波与快速动态响应",
            "s3": "纯本地零云端存储已验证",
            "s4": "就绪 — 启动取证以生成物业/法务标准底稿",
            "cta": "启动邻里噪音取证",
            "guide": "邻里维权指南"
        },
        "fr": {
            "title": "Modèle de preuve bruit de voisinage",
            "desc": "Optimisé pour les bruits de pas, TV/musique, aboiements et vibrations CVC.",
            "day": "≤ 55 dB",
            "night": "≤ 45 dB",
            "metric": "LAeq + L10",
            "tamper": "GPS + SHA-256",
            "s1": "Profil acoustique du scénario calibré",
            "s2": "Filtre pondération A et réponse rapide initialisés",
            "s3": "Traitement 100% local sur votre appareil vérifié",
            "s4": "Prêt — lancez l'enregistrement pour figer les faits opposables",
            "cta": "Lancer l'enregistreur de preuve",
            "guide": "Guide du litige"
        },
        "de": {
            "title": "Beweisvorlage Nachbarschaftslärm",
            "desc": "Optimiert für Trittschall, TV/Musik, Tierlärm und Lüftungsvibrationen.",
            "day": "≤ 55 dB",
            "night": "≤ 45 dB",
            "metric": "LAeq + L10",
            "tamper": "GPS + SHA-256",
            "s1": "Akustisches Szenarioprofil zugeordnet",
            "s2": "A-Bewertung & Zeitbewertung initialisiert",
            "s3": "Lokale Verarbeitung ohne Cloud-Upload verifiziert",
            "s4": "Bereit — Messung starten für verwertbare Fakten",
            "cta": "Beweisaufzeichnung starten",
            "guide": "Leitfaden öffnen"
        },
        "es": {
            "title": "Plantilla de evidencia de ruido vecinal",
            "desc": "Optimizada para pisadas superiores, TV/música, mascotas y vibraciones.",
            "day": "≤ 55 dB",
            "night": "≤ 45 dB",
            "metric": "LAeq + L10",
            "tamper": "GPS + SHA-256",
            "s1": "Perfil acústico del escenario ajustado",
            "s2": "Ponderación A y respuesta rápida initializadas",
            "s3": "Procesamiento local confidencial verificado",
            "s4": "Listo — inicie el registro para capturar pruebas válidas",
            "cta": "Iniciar registro de evidencia",
            "guide": "Guía del caso"
        },
        "ja": {
            "title": "近隣騒音証拠作成テンプレート",
            "desc": "足音、音楽・テレビ、ペットの鳴き声、空調配管振動に最適化。",
            "day": "≤ 55 dB",
            "night": "≤ 45 dB",
            "metric": "LAeq 等価騒音レベル",
            "tamper": "GPS + SHA-256",
            "s1": "居住環境騒音の収集基準に適合",
            "s2": "A特性フィルタと動特性を初期化",
            "s3": "端末内完結のプライベート処理を確認",
            "s4": "準備完了 — 管理会社・調停向け証拠記録を開始",
            "cta": "証拠記録を開始する",
            "guide": "トラブル対応ガイド"
        },
        "ko": {
            "title": "층간 및 이웃 소음 증거 템플릿",
            "desc": "상부층 발소리, TV/음악, 반려동물 짖음, 배관 공조 진동에 최적화.",
            "day": "≤ 55 dB",
            "night": "≤ 45 dB",
            "metric": "LAeq 등가소음도",
            "tamper": "GPS + SHA-256",
            "s1": "주거지역 생활소음 기준 규격 적용",
            "s2": "A-가중 필터 및 반응 속도 설정 완료",
            "s3": "클라우드 전송 없는 기기 내 처리 확인",
            "s4": "준비 완료 — 민원 및 분쟁 조정용 증거 기록 시작",
            "cta": "소음 증거 기록 시작",
            "guide": "소음 해결 가이드"
        },
        "vi": {
            "title": "Mẫu bằng chứng tiếng ồn khu dân cư",
            "desc": "Tối ưu cho tiếng bước chân trên lầu, loa TV, thú cưng và rung chấn điều hòa.",
            "day": "≤ 55 dB",
            "night": "≤ 45 dB",
            "metric": "LAeq + L10",
            "tamper": "GPS + SHA-256",
            "s1": "Đã tải quy chuẩn tiếng ồn sinh hoạt",
            "s2": "Khởi tạo bộ lọc A-weighting và phản hồi",
            "s3": "Xác thực xử lý hoàn toàn trên thiết bị",
            "s4": "Sẵn sàng — bắt đầu ghi âm để tạo hồ sơ khiếu nại",
            "cta": "Bắt đầu ghi bằng chứng",
            "guide": "Hướng dẫn vụ việc"
        },
        "th": {
            "title": "แม่แบบหลักฐานเสียงรบกวนเพื่อนบ้าน",
            "desc": "ปรับแต่งสำหรับเสียงเดินบนเพดาน ดนตรี/ทีวี สัตว์เลี้ยง และการสั่นของระบบปรับอากาศ",
            "day": "≤ 55 dB",
            "night": "≤ 45 dB",
            "metric": "LAeq + L10",
            "tamper": "GPS + SHA-256",
            "s1": "โหลดโปรไฟล์เสียงรบกวนที่อยู่อาศัยแล้ว",
            "s2": "เริ่มต้นตัวกรอง A-weighting และการตอบสนอง",
            "s3": "ประมวลผลในเครื่องโดยไม่ต้องส่งขึ้นคลาวด์",
            "s4": "พร้อม — เริ่มบันทึกเพื่อจัดทำหลักฐานข้อร้องเรียน",
            "cta": "เริ่มบันทึกหลักฐานเสียง",
            "guide": "คู่มือการจัดการปัญหา"
        },
        "path": "neighbor-noise-evidence.html"
    },
    "construction": {
        "en": {
            "title": "Construction & Renovation Monitoring",
            "desc": "Detects impact hammer bursts, drilling, and unauthorized off-hours work.",
            "day": "≤ 70 dB",
            "night": "≤ 55 dB",
            "metric": "Lmax + Impulse Peak",
            "tamper": "GPS + SHA-256",
            "s1": "Construction regulatory threshold loaded",
            "s2": "Impulse shockwave detection enabled",
            "s3": "High-SPL safety range auto-compensated",
            "s4": "Ready — monitor work-hour compliance",
            "cta": "Launch Construction Monitor",
            "guide": "Construction Guide"
        },
        "zh": {
            "title": "装修与工程施工噪音监测模板",
            "desc": "实时抓取电钻打孔、砸墙冲击瞬态峰值及违规超时施工行为。",
            "day": "≤ 70 dB",
            "night": "≤ 55 dB",
            "metric": "Lmax 瞬态冲击峰值",
            "tamper": "GPS + SHA-256",
            "s1": "已加载建筑施工场界噪声限值规范",
            "s2": "已开启突发冲击声脉冲检测模式",
            "s3": "高声压级安全范围自动补偿",
            "s4": "就绪 — 监测违规超时与超标施工",
            "cta": "启动施工噪音监测",
            "guide": "施工维权指南"
        },
        "fr": {
            "title": "Surveillance bruit de chantier & travaux",
            "desc": "Détecte les pics de perforation, marteaux et travaux en heures non autorisées.",
            "day": "≤ 70 dB",
            "night": "≤ 55 dB",
            "metric": "Lmax + Pic d'impulsion",
            "tamper": "GPS + SHA-256",
            "s1": "Seuils réglementaires de chantier chargés",
            "s2": "Détection d'ondes de choc impulsionnelles activée",
            "s3": "Compensation haute pression sonore validée",
            "s4": "Prêt — contrôlez le respect des horaires de chantier",
            "cta": "Lancer le suivi de chantier",
            "guide": "Guide travaux"
        },
        "de": {
            "title": "Bau- und Sanierungslärm-Überwachung",
            "desc": "Erfasst Schlagbohrerspitzen, Hämmern und unzulässige Ruhezeitverletzungen.",
            "day": "≤ 70 dB",
            "night": "≤ 55 dB",
            "metric": "Lmax + Impulsspitze",
            "tamper": "GPS + SHA-256",
            "s1": "Baulärmgrenzwerte gemäß Richtlinie geladen",
            "s2": "Impulsschallerkennung aktiviert",
            "s3": "Hoher Schalldruckpegel-Bereich kalibriert",
            "s4": "Bereit — Einhaltung der Arbeitszeiten dokumentieren",
            "cta": "Baustellenmessung starten",
            "guide": "Baulärm-Leitfaden"
        },
        "es": {
            "title": "Monitoreo de ruido de obras y reformas",
            "desc": "Detecta taladros, impactos y trabajos en horarios no autorizados.",
            "day": "≤ 70 dB",
            "night": "≤ 55 dB",
            "metric": "Lmax + Pico de impacto",
            "tamper": "GPS + SHA-256",
            "s1": "Umbrales normativos de construcción cargados",
            "s2": "Detección de ruido impulsivo activada",
            "s3": "Compensación de alto nivel de presión acústica lista",
            "s4": "Listo — documente el cumplimiento horario de obras",
            "cta": "Iniciar monitor de obras",
            "guide": "Guía de obras"
        },
        "ja": {
            "title": "工事・内装騒音モニタリング",
            "desc": "ドリル打撃音、削岩、時間外違法作業の突発ピークを捕捉。",
            "day": "≤ 70 dB",
            "night": "≤ 55 dB",
            "metric": "Lmax 瞬間ピーク値",
            "tamper": "GPS + SHA-256",
            "s1": "建設作業騒音の基準値をロード",
            "s2": "衝撃音パルス検出モードを起動",
            "s3": "高音圧レンジ自動補正完了",
            "s4": "準備完了 — 工事時間帯と基準超過を監視",
            "cta": "工事騒音モニタリング開始",
            "guide": "工事騒音ガイド"
        },
        "ko": {
            "title": "공사 및 인테리어 소음 모니터링",
            "desc": "드릴 타격, 파쇄 충격음 및 규정 외 시간 불법 공사를 포착합니다.",
            "day": "≤ 70 dB",
            "night": "≤ 55 dB",
            "metric": "Lmax 순간 충격 피크",
            "tamper": "GPS + SHA-256",
            "s1": "건설공사 소음 규제 기준치 적용",
            "s2": "돌발 충격음 펄스 감지 모드 활성화",
            "s3": "고음압 안전 범위 자동 보정",
            "s4": "준비 완료 — 작업 시간 및 기준 초과 여부 감시",
            "cta": "공사 소음 모니터링 시작",
            "guide": "공사 소음 가이드"
        },
        "vi": {
            "title": "Giám sát tiếng ồn thi công xây dựng",
            "desc": "Bắt các đỉnh va đập máy khoan, búa đục và thi công ngoài giờ cho phép.",
            "day": "≤ 70 dB",
            "night": "≤ 55 dB",
            "metric": "Lmax + Đỉnh xung kích",
            "tamper": "GPS + SHA-256",
            "s1": "Đã tải giới hạn quy định về tiếng ồn xây dựng",
            "s2": "Kích hoạt phát hiện sóng xung kích",
            "s3": "Tự động bù dải an toàn áp suất âm cao",
            "s4": "Sẵn sàng — kiểm tra tuân thủ giờ giấc thi công",
            "cta": "Giám sát thi công",
            "guide": "Hướng dẫn thi công"
        },
        "th": {
            "title": "ตรวจวัดเสียงงานก่อสร้างและต่อเติม",
            "desc": "ตรวจจับเสียงเจาะ กระแทก และการทำงานนอกเวลาที่กฎหมายกำหนด",
            "day": "≤ 70 dB",
            "night": "≤ 55 dB",
            "metric": "Lmax + ยอดคลื่นกระแทก",
            "tamper": "GPS + SHA-256",
            "s1": "โหลดเกณฑ์มาตรฐานเสียงงานก่อสร้างแล้ว",
            "s2": "เปิดใช้งานการตรวจจับเสียงกระแทกฉับพลัน",
            "s3": "ชดเชยช่วงระดับความดันเสียงสูงอัตโนมัติ",
            "s4": "พร้อม — ตรวจสอบการปฏิบัติตามเวลาทำงาน",
            "cta": "เริ่มตรวจวัดเสียงก่อสร้าง",
            "guide": "คู่มืองานก่อสร้าง"
        },
        "path": "construction-noise-monitoring.html"
    },
    "street": {
        "en": {
            "title": "Bar, Shop & Street Disturbance",
            "desc": "1/3 octave low-frequency bass analysis for outdoor seating and exhaust fans.",
            "day": "≤ 60 dB",
            "night": "≤ 50 dB",
            "metric": "1/3 Octave Bass",
            "tamper": "GPS + SHA-256",
            "s1": "Commercial boundary standard loaded",
            "s2": "1/3 octave low-frequency filters engaged",
            "s3": "Continuous FFT spectrum initialized",
            "s4": "Ready — record street & venue disturbance",
            "cta": "Launch Street Monitor",
            "guide": "Street Guide"
        },
        "zh": {
            "title": "酒吧商铺与街道外排扰民模板",
            "desc": "专门针对低频低音炮震动、室外排档喧哗及大型排风外机。",
            "day": "≤ 60 dB",
            "night": "≤ 50 dB",
            "metric": "1/3 倍频程低频",
            "tamper": "GPS + SHA-256",
            "s1": "已加载商业区边界噪音排放标准",
            "s2": "已启动 1/3 倍频程低频共振滤波",
            "s3": "持续 FFT 频谱与时间序列初始化完成",
            "s4": "就绪 — 锁定店铺与街道扰民音源",
            "cta": "启动酒吧街道取证",
            "guide": "商业扰民指南"
        },
        "fr": {
            "title": "Nuisances de bars, commerces & rue",
            "desc": "Analyse par tiers d'octave des basses fréquences des terrasses et extracteurs.",
            "day": "≤ 60 dB",
            "night": "≤ 50 dB",
            "metric": "Basses 1/3 d'octave",
            "tamper": "GPS + SHA-256",
            "s1": "Norme de limite commerciale chargée",
            "s2": "Filtres tiers d'octave basse fréquence activés",
            "s3": "Spectre FFT continu initialisé",
            "s4": "Prêt — enregistrez les nuisances de rue et d'établissements",
            "cta": "Lancer le suivi rue & commerces",
            "guide": "Guide nuisances"
        },
        "de": {
            "title": "Gastronomie-, Gewerbe- & Straßenlärm",
            "desc": "Terzband-Tieffrequenzanalyse für Außenbereiche und laute Lüftungsanlagen.",
            "day": "≤ 60 dB",
            "night": "≤ 50 dB",
            "metric": "1/3-Oktav Bass",
            "tamper": "GPS + SHA-256",
            "s1": "Immissionsrichtwerte Gewerbegebiet geladen",
            "s2": "Terzband-Filter für tiefe Frequenzen aktiv",
            "s3": "Kontinuierliches FFT-Spektrum bereit",
            "s4": "Bereit — Ruhestörung durch Gewerbe & Gastronomie festhalten",
            "cta": "Gewerbemessung starten",
            "guide": "Gewerbeleitfaden"
        },
        "es": {
            "title": "Molestias de bares, comercios y calle",
            "desc": "Análisis de 1/3 de octava para graves musicales, terrazas y extractores.",
            "day": "≤ 60 dB",
            "night": "≤ 50 dB",
            "metric": "Graves 1/3 de octava",
            "tamper": "GPS + SHA-256",
            "s1": "Límites de zona comercial cargados",
            "s2": "Filtros de 1/3 de octava activados",
            "s3": "Espectro FFT continuo inicializado",
            "s4": "Listo — registre las molestias de locales y vía pública",
            "cta": "Iniciar monitor de calle",
            "guide": "Guía de vía pública"
        },
        "ja": {
            "title": "飲食店・店舗・路上騒音テンプレート",
            "desc": "重低音ウーファー、室外排気ファン、深夜の路上喧騒を分析。",
            "day": "≤ 60 dB",
            "night": "≤ 50 dB",
            "metric": "1/3オクターブ低周波",
            "tamper": "GPS + SHA-256",
            "s1": "商業地域境界騒音基準を適用",
            "s2": "1/3オクターブ低周波フィルタ作動",
            "s3": "連続FFTスペクトラム解析準備完了",
            "s4": "準備完了 — 店舗・路上の騒音源を特定記録",
            "cta": "路上騒音記録を開始",
            "guide": "商業騒音ガイド"
        },
        "ko": {
            "title": "상가 주점 및 도로변 소음 템플릿",
            "desc": "클럽 우퍼 저주파 진동, 야외 테라스 소음, 대형 환풍기 배기를 분석합니다.",
            "day": "≤ 60 dB",
            "night": "≤ 50 dB",
            "metric": "1/3 옥타브 저주파",
            "tamper": "GPS + SHA-256",
            "s1": "상업지역 경계 소음 기준 로드 완료",
            "s2": "1/3 옥타브 저주파 필터 작동",
            "s3": "실시간 FFT 스펙트럼 분석 준비 완료",
            "s4": "준비 완료 — 상가 및 거리 소음원 사실 기록",
            "cta": "상가 소음 기록 시작",
            "guide": "상가 소음 가이드"
        },
        "vi": {
            "title": "Tiếng ồn quán bar, cửa hàng & phố xá",
            "desc": "Phân tích âm trầm 1/3 quãng tám cho loa công suất lớn và quạt hút gió.",
            "day": "≤ 60 dB",
            "night": "≤ 50 dB",
            "metric": "Âm trầm 1/3 quãng tám",
            "tamper": "GPS + SHA-256",
            "s1": "Đã tải quy chuẩn ranh giới thương mại",
            "s2": "Kích hoạt bộ lọc âm trầm tần số thấp",
            "s3": "Khởi tạo phổ FFT liên tục",
            "s4": "Sẵn sàng — ghi nhận tiếng ồn phố xá và cơ sở kinh doanh",
            "cta": "Giám sát phố xá",
            "guide": "Hướng dẫn tiếng ồn phố"
        },
        "th": {
            "title": "เสียงรบกวนจากร้านค้า สถานบันเทิง และถนน",
            "desc": "วิเคราะห์เสียงเบสความถี่ต่ำ 1/3 อ็อกเทฟ สำหรับลำโพงและพัดลมระบายอากาศ",
            "day": "≤ 60 dB",
            "night": "≤ 50 dB",
            "metric": "เบส 1/3 อ็อกเทฟ",
            "tamper": "GPS + SHA-256",
            "s1": "โหลดมาตรฐานขอบเขตย่านการค้าแล้ว",
            "s2": "เปิดตัวกรองความถี่ต่ำ 1/3 อ็อกเทฟ",
            "s3": "เริ่มต้นสเปกตรัม FFT ต่อเนื่อง",
            "s4": "พร้อม — บันทึกเสียงรบกวนจากร้านค้าและท้องถนน",
            "cta": "เริ่มบันทึกเสียงถนน",
            "guide": "คู่มือสถานบันเทิง"
        },
        "path": "bar-street-disturbance.html"
    },
    "rental": {
        "en": {
            "title": "Rental Dispute & Lease Breach Packet",
            "desc": "Continuous multi-day acoustic log for landlord negotiation or small-claims court.",
            "day": "≤ 55 dB",
            "night": "≤ 45 dB",
            "metric": "LAeq (L50/L90)",
            "tamper": "GPS + SHA-256",
            "s1": "Habitability & quiet enjoyment standard set",
            "s2": "Multi-session cumulative statistics prepared",
            "s3": "Cryptographic SHA-256 chain ready",
            "s4": "Ready — build legally structured rent dispute dossier",
            "cta": "Launch Rental Dispute Packet",
            "guide": "Rental Guide"
        },
        "zh": {
            "title": "租房纠纷与退租退押维权举证包",
            "desc": "为房东协调、中介协商或小额法庭提供多日累计客观声学事实底稿。",
            "day": "≤ 55 dB",
            "night": "≤ 45 dB",
            "metric": "统计声级 (L50/L90)",
            "tamper": "GPS + SHA-256",
            "s1": "已加载居住安宁与租赁合同维权标准",
            "s2": "长周期多时段超标统计已就绪",
            "s3": "SHA-256 防伪哈希证据链已锁定",
            "s4": "就绪 — 建立完整的租房争议退租底稿",
            "cta": "启动租房维权取证",
            "guide": "租房维权指南"
        },
        "fr": {
            "title": "Dossier litige locatif & résiliation de bail",
            "desc": "Relevé acoustique sur plusieurs jours pour négociation bailleur ou tribunal.",
            "day": "≤ 55 dB",
            "night": "≤ 45 dB",
            "metric": "LAeq (L50/L90)",
            "tamper": "GPS + SHA-256",
            "s1": "Norme d'habitabilité et jouissance paisible chargée",
            "s2": "Statistiques cumulées multi-sessions prêtes",
            "s3": "Chaîne cryptographique SHA-256 verrouillée",
            "s4": "Prêt — constituez un dossier solide de litige locatif",
            "cta": "Lancer le dossier de litige",
            "guide": "Guide locataire"
        },
        "de": {
            "title": "Beweisakte Mietstreit & Mietminderung",
            "desc": "Mehrtägiges akustisches Lärmprotokoll für Vermieterdialog oder Schlichtung.",
            "day": "≤ 55 dB",
            "night": "≤ 45 dB",
            "metric": "LAeq (L50/L90)",
            "tamper": "GPS + SHA-256",
            "s1": "Wohnwert- und Ruhevorschriften hinterlegt",
            "s2": "Mehrtägige kumulierte Messdaten vorbereitet",
            "s3": "Kryptografische SHA-256 Kette verifiziert",
            "s4": "Bereit — gerichtsfeste Faktenakte für Mietminderung anlegen",
            "cta": "Miet-Beweisakte starten",
            "guide": "Mietminderungs-Guide"
        },
        "es": {
            "title": "Expediente de disputa de alquiler y fianza",
            "desc": "Registro acústico de varios días para negociación con casero o arbitraje.",
            "day": "≤ 55 dB",
            "night": "≤ 45 dB",
            "metric": "LAeq (L50/L90)",
            "tamper": "GPS + SHA-256",
            "s1": "Estándar de habitabilidad y disfrute pacífico cargado",
            "s2": "Estadísticas acumuladas multisesión listas",
            "s3": "Cadena criptográfica SHA-256 bloqueada",
            "s4": "Listo — elabore un expediente sólido de disputa de arrendamiento",
            "cta": "Iniciar expediente de alquiler",
            "guide": "Guía de arrendamiento"
        },
        "ja": {
            "title": "賃貸トラブル・敷金返還・住環境証拠パック",
            "desc": "大家・管理会社への家賃減額交渉や小額訴訟のための客観記録。",
            "day": "≤ 55 dB",
            "night": "≤ 45 dB",
            "metric": "統計音響 (L50/L90)",
            "tamper": "GPS + SHA-256",
            "s1": "賃貸借契約の平穏享受基準を適用",
            "s2": "複数日累積の基準超過統計を算出準備",
            "s3": "暗号学的SHA-256改ざん防止チェーン検証済",
            "s4": "準備完了 — 退去・敷金返還のための証拠ファイルを作成",
            "cta": "賃貸証拠収集を開始",
            "guide": "賃貸トラブル手引き"
        },
        "ko": {
            "title": "임대차 분쟁 및 계약 해지 소명 패키지",
            "desc": "임대인 협의, 보증금 반환, 분쟁 조정을 위한 다일간 객관 소음 기록.",
            "day": "≤ 55 dB",
            "night": "≤ 45 dB",
            "metric": "통계소음도 (L50/L90)",
            "tamper": "GPS + SHA-256",
            "s1": "주거 안녕 및 임대차 분쟁 기준 적용",
            "s2": "누적 다회차 초과 통계 생성 준비",
            "s3": "위변조 방지 SHA-256 체인 검증",
            "s4": "준비 완료 — 계약 해지 및 보증금 반환용 사실 증거 패키지 구축",
            "cta": "임대차 소명 패키지 시작",
            "guide": "임대차 소음 가이드"
        },
        "vi": {
            "title": "Hồ sơ tranh chấp thuê nhà & hợp đồng",
            "desc": "Nhật ký âm thanh nhiều ngày phục vụ đàm phán chủ nhà hoặc hoàn cọc.",
            "day": "≤ 55 dB",
            "night": "≤ 45 dB",
            "metric": "LAeq (L50/L90)",
            "tamper": "GPS + SHA-256",
            "s1": "Đã tải tiêu chuẩn quyền sống yên tĩnh",
            "s2": "Chuẩn bị thống kê tích lũy nhiều phiên",
            "s3": "Khóa chuỗi mã hóa SHA-256 chống giả mạo",
            "s4": "Sẵn sàng — xây dựng hồ sơ tranh chấp hợp đồng nhà ở",
            "cta": "Mở gói tranh chấp thuê nhà",
            "guide": "Cẩm nang thuê nhà"
        },
        "th": {
            "title": "ชุดหลักฐานข้อพิพาทการเช่าและสัญญา",
            "desc": "บันทึกเสียงต่อเนื่องหลายวันสำหรับการเจรจากับเจ้าของบ้านหรือขอยกเลิกสัญญา",
            "day": "≤ 55 dB",
            "night": "≤ 45 dB",
            "metric": "LAeq (L50/L90)",
            "tamper": "GPS + SHA-256",
            "s1": "กำหนดมาตรฐานสิทธิการอยู่อาศัยอย่างสงบแล้ว",
            "s2": "เตรียมสถิติสะสมหลายช่วงเวลา",
            "s3": "ล็อกห่วงโซ่การเข้ารหัส SHA-256 ป้องกันการปลอมแปลง",
            "s4": "พร้อม — จัดทำแฟ้มหลักฐานข้อพิพาทการเช่า",
            "cta": "เริ่มชุดหลักฐานการเช่า",
            "guide": "คู่มือข้อพิพาทการเช่า"
        },
        "path": "rental-dispute-evidence.html"
    }
};

  function initScenarioWorkbench() {
    const wb = document.getElementById('scenario-workbench');
    if (!wb) return;

    const langCode = (document.documentElement.lang || 'en').trim().toLowerCase().split(/[-_]/)[0];
    const pathMatch = location.pathname.match(/\/(zh|en|fr|de|es|ja|ko|vi|th)\//);
    const langKey = pathMatch ? pathMatch[1] : (SCENARIO_DATA.neighbor[langCode] ? langCode : 'en');
    const isZh = langKey === 'zh';

    const appLink = document.querySelector('.site-nav a[href*="soundtest.html"]');
    const isSubdir = appLink && appLink.getAttribute('href').startsWith('../');
    const basePrefix = isSubdir ? '../' : '';

    const buttons = wb.querySelectorAll('.scenario-pill-btn');
    const titleEl = document.getElementById('wb-preview-title');
    const descEl = document.getElementById('wb-preview-desc');
    const dayEl = document.getElementById('wb-day');
    const nightEl = document.getElementById('wb-night');
    const metricEl = document.getElementById('wb-metric');
    const s1El = document.getElementById('wb-s1');
    const s2El = document.getElementById('wb-s2');
    const s3El = document.getElementById('wb-s3');
    const s4El = document.getElementById('wb-s4');
    const ctaBtn = document.getElementById('wb-cta');
    const guideBtn = document.getElementById('wb-guide');

    function selectScenario(key) {
      const data = SCENARIO_DATA[key];
      if (!data) return;
      const copy = data[langKey] || data.en;

      buttons.forEach(btn => {
        const active = btn.dataset.scenario === key;
        btn.classList.toggle('active', active);
        btn.setAttribute('aria-selected', String(active));
      });

      if (titleEl) titleEl.textContent = copy.title;
      if (descEl) descEl.textContent = copy.desc;
      if (dayEl) dayEl.textContent = copy.day;
      if (nightEl) nightEl.textContent = copy.night;
      if (metricEl) metricEl.textContent = copy.metric;
      if (s1El) s1El.textContent = copy.s1;
      if (s2El) s2El.textContent = copy.s2;
      if (s3El) s3El.textContent = copy.s3;
      if (s4El) s4El.textContent = copy.s4;

      if (ctaBtn) {
        ctaBtn.href = `${basePrefix}soundtest.html?scenario=${key}`;
        const ctaSpan = ctaBtn.querySelector('span');
        if (ctaSpan) ctaSpan.textContent = copy.cta;
      }
      if (guideBtn) {
        guideBtn.href = `${basePrefix}use-cases/${data.path}`;
        guideBtn.textContent = copy.guide;
      }

      const steps = wb.querySelectorAll('.live-step');
      steps.forEach((step, idx) => {
        step.style.opacity = '0.5';
        setTimeout(() => { step.style.opacity = '1'; }, idx * 50 + 40);
      });
    }

    buttons.forEach(btn => {
      btn.addEventListener('click', () => {
        selectScenario(btn.dataset.scenario);
      });
    });

    const customForm = wb.querySelector('[data-wb-custom-form]');
    const customInput = wb.querySelector('[data-wb-custom-input]');
    if (customForm && customInput) {
      customForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const val = customInput.value.trim();
        if (!val) return;
        if (titleEl) titleEl.textContent = (isZh ? '自定义场景：' : 'Custom Scenario: ') + val;
        if (descEl) descEl.textContent = isZh ? '正在根据您的输入匹配声学滤波与防篡改存证参数。' : 'Configuring acoustic filters and tamper-proof evidence rules for your input.';
        if (ctaBtn) {
          ctaBtn.href = `${basePrefix}soundtest.html?scenario=custom&note=${encodeURIComponent(val)}`;
          const ctaSpan = ctaBtn.querySelector('span');
          if (ctaSpan) ctaSpan.textContent = isZh ? `启动「${val.slice(0, 8)}」取证` : `Launch for "${val.slice(0, 10)}"`;
        }
      });
    }
  }

  function initHero() {
    const form = document.querySelector('[data-hero-form]');
    if (!form) return;

    const input = form.querySelector('[data-hero-input]');

    form.addEventListener('submit', (event) => {
      event.preventDefault();
      const q = (input?.value || '').trim();
      const appLink = document.querySelector('.site-nav a[href*="soundtest.html"]');
      const isSubdir = appLink && appLink.getAttribute('href').startsWith('../');
      const basePrefix = isSubdir ? '../' : '';
      const target = q
        ? `${basePrefix}use-cases/?q=${encodeURIComponent(q)}`
        : `${basePrefix}use-cases/`;
      window.location.href = target;
    });
  }

  function initCookieConsent() {
    if (localStorage.getItem('soundtest_cookie_consent')) return;
    
    const banner = document.createElement('div');
    banner.style.cssText = `
      position: fixed; bottom: 20px; left: 20px; right: 20px; z-index: 9999;
      display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 16px;
      padding: 18px 24px; border-radius: 16px; border: 1px solid rgba(44, 240, 193, 0.22);
      background: linear-gradient(180deg, rgba(13, 21, 37, 0.96), rgba(6, 10, 18, 0.96));
      box-shadow: 0 24px 80px rgba(0, 0, 0, 0.48), inset 0 1px 0 rgba(255, 255, 255, 0.07);
      backdrop-filter: blur(20px); font-family: -apple-system, system-ui, sans-serif;
    `;
    
    const text = document.createElement('div');
    text.style.cssText = "color: #92a4b8; font-size: 13px; line-height: 1.5; flex: 1; min-width: 280px;";
    text.innerHTML = `<strong>Privacy First:</strong> We use essential cookies to provide local processing features and analytics. Your microphone data is <strong>never uploaded to the cloud</strong>. By continuing to use SOUNDTEST.PRO, you agree to our <a href="/privacy.html" style="color: #2cf0c1; text-decoration: none;">Privacy Policy</a>.`;
    
    const btn = document.createElement('button');
    btn.style.cssText = `
      padding: 10px 20px; border-radius: 999px; border: none; font-weight: 700; font-size: 13px; cursor: pointer;
      background: linear-gradient(135deg, #2cf0c1, #0a9172); color: #071018; box-shadow: 0 0 22px rgba(42, 255, 212, 0.18);
    `;
    btn.textContent = "Got it";
    
    btn.addEventListener('click', () => {
      localStorage.setItem('soundtest_cookie_consent', 'accepted');
      banner.style.opacity = '0';
      banner.style.transform = 'translateY(20px)';
      banner.style.transition = 'all 0.3s ease';
      setTimeout(() => banner.remove(), 300);
    });
    
    banner.appendChild(text);
    banner.appendChild(btn);
    document.body.appendChild(banner);
  }

  const MOBILE_NAV_I18N = {
    zh: {
      home: '首页',
      pricing: '价格权益',
      measure: '测分贝',
      scenarios: '维权场景',
      more: '更多',
      drawerTitle: '快捷导航与工具',
      standards: '国家标准',
      accuracy: '精度校准',
      samples: '报告样例',
      download: '安装应用',
      changelog: '更新日志',
      disclaimer: '免责声明',
      privacy: '隐私政策',
      compliance: '服务条款',
      account: '个人中心',
      login: '登录 / 注册',
      proTag: '首发特惠中',
      close: '关闭',
    },
    en: {
      home: 'Home',
      pricing: 'Pricing',
      measure: 'Measure',
      scenarios: 'Scenarios',
      more: 'More',
      drawerTitle: 'Quick Navigation & Tools',
      standards: 'Standards',
      accuracy: 'Accuracy',
      samples: 'Samples',
      download: 'Install App',
      changelog: 'Changelog',
      disclaimer: 'Disclaimer',
      privacy: 'Privacy',
      compliance: 'Compliance',
      account: 'Account',
      login: 'Login / Register',
      proTag: 'Launch Special',
      close: 'Close',
    },
    es: {
      home: 'Inicio',
      pricing: 'Precios',
      measure: 'Medir dB',
      scenarios: 'Casos',
      more: 'Más',
      drawerTitle: 'Navegación y Herramientas',
      standards: 'Normas',
      accuracy: 'Calibración',
      samples: 'Muestras',
      download: 'Instalar App',
      changelog: 'Historial',
      disclaimer: 'Aviso Legal',
      privacy: 'Privacidad',
      compliance: 'Términos',
      account: 'Cuenta',
      login: 'Acceso / Registro',
      proTag: 'Oferta Especial',
      close: 'Cerrar',
    },
    fr: {
      home: 'Accueil',
      pricing: 'Tarifs',
      measure: 'Mesurer',
      scenarios: 'Scénarios',
      more: 'Plus',
      drawerTitle: 'Navigation & Outils',
      standards: 'Normes',
      accuracy: 'Étalonnage',
      samples: 'Échantillons',
      download: 'Installer l’App',
      changelog: 'Journal',
      disclaimer: 'Mentions Légales',
      privacy: 'Confidentialité',
      compliance: 'Conditions',
      account: 'Compte',
      login: 'Connexion',
      proTag: 'Offre Spéciale',
      close: 'Fermer',
    },
    de: {
      home: 'Start',
      pricing: 'Preise',
      measure: 'Messen',
      scenarios: 'Szenarien',
      more: 'Mehr',
      drawerTitle: 'Navigation & Tools',
      standards: 'Normen',
      accuracy: 'Kalibrierung',
      samples: 'Muster',
      download: 'App laden',
      changelog: 'Changelog',
      disclaimer: 'Haftung',
      privacy: 'Datenschutz',
      compliance: 'Bedingungen',
      account: 'Konto',
      login: 'Anmelden',
      proTag: 'Aktionspreis',
      close: 'Schließen',
    },
    ja: {
      home: 'ホーム',
      pricing: '料金プラン',
      measure: '騒音測定',
      scenarios: '活用事例',
      more: 'メニュー',
      drawerTitle: 'クイックナビゲーション',
      standards: '騒音基準',
      accuracy: '校正精度',
      samples: 'レポート例',
      download: 'アプリ導入',
      changelog: '更新履歴',
      disclaimer: '免責事項',
      privacy: 'プライバシー',
      compliance: '利用規約',
      account: 'アカウント',
      login: 'ログイン',
      proTag: '限定セール',
      close: '閉じる',
    },
    ko: {
      home: '홈',
      pricing: '요금제',
      measure: '소음측정',
      scenarios: '활용사례',
      more: '더보기',
      drawerTitle: '빠른 메뉴 & 도구',
      standards: '소음 기준',
      accuracy: '정밀도 보정',
      samples: '보고서 샘플',
      download: '앱 설치',
      changelog: '업데이트 로그',
      disclaimer: '면책 조항',
      privacy: '개인정보처리',
      compliance: '이용약관',
      account: '내 계정',
      login: '로그인 / 가입',
      proTag: '특가 할인',
      close: '닫기',
    },
    vi: {
      home: 'Trang chủ',
      pricing: 'Bảng giá',
      measure: 'Đo dB',
      scenarios: 'Trường hợp',
      more: 'Thêm',
      drawerTitle: 'Điều hướng & Công cụ',
      standards: 'Tiêu chuẩn',
      accuracy: 'Hiệu chuẩn',
      samples: 'Mẫu báo cáo',
      download: 'Tải ứng dụng',
      changelog: 'Lịch sử',
      disclaimer: 'Miễn trừ',
      privacy: 'Quyền riêng tư',
      compliance: 'Điều khoản',
      account: 'Tài khoản',
      login: 'Đăng nhập',
      proTag: 'Ưu đãi mở bán',
      close: 'Đóng',
    },
    th: {
      home: 'หน้าแรก',
      pricing: 'ราคา',
      measure: 'วัดเสียง',
      scenarios: 'กรณีใช้งาน',
      more: 'เพิ่มเติม',
      drawerTitle: 'เมนูทางลัดและเครื่องมือ',
      standards: 'มาตรฐาน',
      accuracy: 'การสอบเทียบ',
      samples: 'ตัวอย่างรายงาน',
      download: 'ติดตั้งแอป',
      changelog: 'ประวัติอัปเดต',
      disclaimer: 'ข้อจำกัดสิทธิ',
      privacy: 'ความเป็นส่วนตัว',
      compliance: 'ข้อกำหนด',
      account: 'บัญชีผู้ใช้',
      login: 'เข้าสู่ระบบ',
      proTag: 'โปรโมชั่นพิเศษ',
      close: 'ปิด',
    },
  };

  function getMobileNavLang() {
    const docLang = (document.documentElement.lang || '').slice(0, 2).toLowerCase();
    if (MOBILE_NAV_I18N[docLang]) return docLang;
    const match = window.location.pathname.match(/\/(zh|en|es|fr|de|ja|ko|vi|th)\//);
    return match ? match[1] : (docLang === 'zh' ? 'zh' : 'en');
  }

  function getMobileNavUrls(lang) {
    const path = window.location.pathname;
    const isUseCase = path.includes('/use-cases/');
    const isLocaleSubdir = /\/(zh|en|es|fr|de|ja|ko|vi|th)\//.test(path);

    let base = '';
    let meterUrl = 'soundtest.html';

    if (isUseCase) {
      base = `../../${lang}/`;
      meterUrl = '../../soundtest.html';
    } else if (isLocaleSubdir) {
      base = '';
      meterUrl = '../soundtest.html';
    } else {
      base = `${lang}/`;
      meterUrl = 'soundtest.html';
    }

    const homeUrl = base ? `${base}index.html` : 'index.html';
    return {
      home: homeUrl,
      pricing: `${homeUrl}#pricing`,
      scenarios: `${homeUrl}#scenarios`,
      meter: meterUrl,
      standards: base ? `${base}standards.html` : 'standards.html',
      accuracy: base ? `${base}accuracy.html` : 'accuracy.html',
      samples: base ? `${base}samples.html` : 'samples.html',
      download: base ? `${base}download.html` : 'download.html',
      changelog: base ? `${base}changelog.html` : 'changelog.html',
      disclaimer: base ? `${base}disclaimer.html` : 'disclaimer.html',
      privacy: base ? `${base}privacy.html` : 'privacy.html',
      compliance: base ? `${base}compliance.html` : 'compliance.html',
      auth: base ? `${base}auth.html` : 'auth.html',
    };
  }

  function initMobileBottomNav() {
    if (document.querySelector('.mobile-bottom-bar')) return;

    const lang = getMobileNavLang();
    const t = MOBILE_NAV_I18N[lang] || MOBILE_NAV_I18N.en;
    const urls = getMobileNavUrls(lang);

    // 1. Build Mobile Bottom Bar
    const bar = document.createElement('nav');
    bar.className = 'mobile-bottom-bar';
    bar.setAttribute('aria-label', 'Mobile Navigation');
    bar.innerHTML = `
      <a href="${urls.home}" class="mobile-nav-tab" data-nav="home">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
        <span>${t.home}</span>
      </a>
      <a href="${urls.pricing}" class="mobile-nav-tab" data-nav="pricing">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
        <span>${t.pricing}</span>
      </a>
      <a href="${urls.meter}" class="mobile-nav-cta" title="${t.measure}">
        <div class="mobile-nav-cta-btn">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="22"/></svg>
        </div>
        <span class="mobile-nav-cta-label">${t.measure}</span>
      </a>
      <a href="${urls.scenarios}" class="mobile-nav-tab" data-nav="scenarios">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><rect width="7" height="7" x="3" y="3" rx="1"/><rect width="7" height="7" x="14" y="3" rx="1"/><rect width="7" height="7" x="14" y="14" rx="1"/><rect width="7" height="7" x="3" y="14" rx="1"/></svg>
        <span>${t.scenarios}</span>
      </a>
      <button type="button" class="mobile-nav-tab" data-mobile-drawer-trigger aria-label="${t.more}">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="12" cy="12" r="1.5"/><circle cx="19" cy="12" r="1.5"/><circle cx="5" cy="12" r="1.5"/></svg>
        <span>${t.more}</span>
      </button>
    `;

    // 2. Build Slide-up Drawer & Overlay
    const overlay = document.createElement('div');
    overlay.className = 'mobile-drawer-overlay';
    overlay.setAttribute('aria-hidden', 'true');

    const drawer = document.createElement('div');
    drawer.className = 'mobile-drawer';
    drawer.setAttribute('role', 'dialog');
    drawer.setAttribute('aria-modal', 'true');
    drawer.setAttribute('aria-label', t.drawerTitle);
    drawer.innerHTML = `
      <div class="mobile-drawer-handle" aria-hidden="true"></div>
      <div class="mobile-drawer-header">
        <span class="mobile-drawer-title">${t.drawerTitle}</span>
        <button type="button" class="mobile-drawer-close" aria-label="${t.close}">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </button>
      </div>
      <a href="${urls.pricing}" class="mobile-drawer-upgrade">
        <div>
          <strong>★ SOUNDTEST.PRO PRO</strong>
          <span>${t.proTag} · 点击查看全部特权权益</span>
        </div>
        <span class="upgrade-arrow">›</span>
      </a>
      <div class="mobile-drawer-grid">
        <a href="${urls.standards}" class="mobile-drawer-item">
          <div class="mobile-drawer-item-icon">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z"/><path d="M6 6h10M6 10h10"/></svg>
          </div>
          <span>${t.standards}</span>
        </a>
        <a href="${urls.accuracy}" class="mobile-drawer-item">
          <div class="mobile-drawer-item-icon">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="3"/><line x1="12" y1="3" x2="12" y2="6"/><line x1="12" y1="18" x2="12" y2="21"/></svg>
          </div>
          <span>${t.accuracy}</span>
        </a>
        <a href="${urls.samples}" class="mobile-drawer-item">
          <div class="mobile-drawer-item-icon">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect width="18" height="18" x="3" y="3" rx="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>
          </div>
          <span>${t.samples}</span>
        </a>
        <a href="${urls.download}" class="mobile-drawer-item">
          <div class="mobile-drawer-item-icon">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
          </div>
          <span>${t.download}</span>
        </a>
        <a href="${urls.changelog}" class="mobile-drawer-item">
          <div class="mobile-drawer-item-icon">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
          </div>
          <span>${t.changelog}</span>
        </a>
        <a href="${urls.disclaimer}" class="mobile-drawer-item">
          <div class="mobile-drawer-item-icon">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
          </div>
          <span>${t.disclaimer}</span>
        </a>
        <a href="${urls.privacy}" class="mobile-drawer-item">
          <div class="mobile-drawer-item-icon">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
          </div>
          <span>${t.privacy}</span>
        </a>
        <a href="${urls.compliance}" class="mobile-drawer-item">
          <div class="mobile-drawer-item-icon">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
          </div>
          <span>${t.compliance}</span>
        </a>
        <a href="${urls.auth}" class="mobile-drawer-item">
          <div class="mobile-drawer-item-icon">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
          </div>
          <span>${t.account}</span>
        </a>
      </div>
      <div class="mobile-drawer-auth">
        <a href="${urls.auth}" class="auth-primary">${t.login}</a>
      </div>
    `;

    document.body.appendChild(bar);
    document.body.appendChild(overlay);
    document.body.appendChild(drawer);

    function openDrawer() {
      overlay.classList.add('is-active');
      drawer.classList.add('is-active');
      document.body.style.overflow = 'hidden';
    }

    function closeDrawer() {
      overlay.classList.remove('is-active');
      drawer.classList.remove('is-active');
      document.body.style.overflow = '';
    }

    bar.querySelector('[data-mobile-drawer-trigger]')?.addEventListener('click', openDrawer);
    drawer.querySelector('.mobile-drawer-close')?.addEventListener('click', closeDrawer);
    overlay.addEventListener('click', closeDrawer);

    drawer.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', closeDrawer);
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && drawer.classList.contains('is-active')) {
        closeDrawer();
      }
    });

    // Also wire up top nav toggle button to open the bottom drawer
    const nav = document.querySelector('.site-nav');
    if (nav) {
      const navMain = nav.querySelector('.site-nav-main');
      if (navMain) {
        let toggleBtn = nav.querySelector('.site-nav-toggle');
        if (!toggleBtn) {
          toggleBtn = document.createElement('button');
          toggleBtn.type = 'button';
          toggleBtn.className = 'site-nav-toggle';
          toggleBtn.setAttribute('aria-label', 'Toggle menu');
          toggleBtn.innerHTML = `
            <svg class="icon-menu" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
          `;
          navMain.appendChild(toggleBtn);
        }
        toggleBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          openDrawer();
        });
      }
    }
  }

  function ready(fn) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', fn);
    } else {
      fn();
    }
  }

  ready(() => {
    initRevealAnimations();
    renderRecent();
    initHero();
    initScenarioWorkbench();
    initMobileBottomNav();
    initCookieConsent();
    initPricingNavigation();
  });

  function initPricingNavigation() {
    document.addEventListener('click', (e) => {
      const upgradeBtn = e.target.closest('.nav-upgrade, a[href="#pricing"], a[href$="#pricing"], .mobile-drawer-upgrade');
      if (!upgradeBtn) return;
      const pricingSection = document.getElementById('pricing');
      if (pricingSection) {
        e.preventDefault();
        const proCard = pricingSection.querySelector('.price-card.pro') || pricingSection;
        proCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
        proCard.classList.remove('card-highlight-pulse');
        void proCard.offsetWidth;
        proCard.classList.add('card-highlight-pulse');
        if (window.history && window.history.replaceState) {
          window.history.replaceState(null, '', '#pricing');
        }
      }
    });
  }
})();


