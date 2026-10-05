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
      { threshold: 0.01, rootMargin: '0px 0px 240px 0px' }
    );
    document.querySelectorAll('.reveal').forEach((el, index) => {
      if (!el.style.getPropertyValue('--reveal-delay')) {
        el.style.setProperty('--reveal-delay', `${Math.min(index, 8) * 35}ms`);
      }
      observer.observe(el);
      try {
        const rect = el.getBoundingClientRect();
        if (rect.top <= (window.innerHeight || 800) + 300) {
          el.classList.add('is-visible');
        }
      } catch (_) {}
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
        ctaBtn.href = `${basePrefix}soundtest.html?scenario=${key}&lang=${langKey}`;
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
          ctaBtn.href = `${basePrefix}soundtest.html?scenario=custom&note=${encodeURIComponent(val)}&lang=${langKey}`;
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

  const GDPR_COUNTRIES = [
    'AT', 'BE', 'BG', 'HR', 'CY', 'CZ', 'DK', 'EE', 'FI', 'FR',
    'DE', 'GR', 'HU', 'IE', 'IT', 'LV', 'LT', 'LU', 'MT', 'NL',
    'PL', 'PT', 'RO', 'SK', 'SI', 'ES', 'SE', 'GB', 'IS', 'LI',
    'NO', 'CH'
  ];

  const CONSENT_I18N = {
    de: {
      badge: 'Datenschutz',
      body: 'Wir verwenden notwendige Cookies für Basisfunktionen und Analysen. Ihre Mikrofondaten werden <strong>ausschließlich lokal auf Ihrem Gerät verarbeitet</strong> und niemals in die Cloud übertragen. Weitere Details in unserer ',
      policy: 'Datenschutzerklärung',
      link: '/de/privacy.html',
      btn: 'Verstanden',
    },
    fr: {
      badge: 'Confidentialité',
      body: 'Nous utilisons des cookies essentiels pour le fonctionnement local et l\'analyse. Vos données de microphone sont <strong>traitées localement sur votre appareil</strong> et jamais envoyées dans le cloud. En savoir plus dans notre ',
      policy: 'Politique de confidentialité',
      link: '/fr/privacy.html',
      btn: 'J\'ai compris',
    },
    es: {
      badge: 'Privacidad',
      body: 'Utilizamos cookies esenciales para el funcionamiento local y métricas. Los datos de su micrófono se <strong>procesan solo en su dispositivo</strong> y nunca se suben a la nube. Más detalles en nuestra ',
      policy: 'Política de privacidad',
      link: '/es/privacy.html',
      btn: 'Entendido',
    },
    en: {
      badge: 'Privacy Notice',
      body: 'We use essential cookies to provide local processing features and analytics. Your microphone data is <strong>processed locally and never uploaded to the cloud</strong>. By continuing to use SOUNDTEST.PRO, you agree to our ',
      policy: 'Privacy Policy',
      link: '/privacy.html',
      btn: 'Got it',
    },
  };

  function getCountryFromCookie() {
    try {
      const match = document.cookie?.match(/(?:^|;\s*)sf_country=([^;]+)/);
      return match ? decodeURIComponent(match[1]).toUpperCase().trim() : '';
    } catch (_) {
      return '';
    }
  }

  function getCurrentLocale() {
    const path = (window.location.pathname || '').toLowerCase();
    const parts = path.split('/').filter(Boolean);
    if (parts.length > 0 && ['zh', 'de', 'fr', 'es', 'ja', 'ko', 'vi', 'th', 'en'].includes(parts[0])) {
      return parts[0];
    }
    const docLang = (document.documentElement.lang || '').toLowerCase();
    if (docLang.startsWith('zh')) return 'zh';
    if (docLang.startsWith('de')) return 'de';
    if (docLang.startsWith('fr')) return 'fr';
    if (docLang.startsWith('es')) return 'es';
    if (docLang.startsWith('ja')) return 'ja';
    if (docLang.startsWith('ko')) return 'ko';
    if (docLang.startsWith('vi')) return 'vi';
    if (docLang.startsWith('th')) return 'th';
    return 'en';
  }

  function isChinaUser() {
    // 1. Explicit country cookie
    const country = getCountryFromCookie();
    if (country === 'CN' || country === 'HK' || country === 'MO') return true;

    // 2. Chinese path or language tag
    const locale = getCurrentLocale();
    if (locale === 'zh') return true;

    // 3. Timezone detection (China mainland / HK / TW)
    try {
      const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || '';
      if (/^(Asia\/(Shanghai|Chongqing|Harbin|Urumqi|Beijing|Hong_Kong|Taipei|Macau)|PRC)$/i.test(tz)) {
        return true;
      }
    } catch (_) {}

    return false;
  }

  function shouldShowCookieConsent() {
    // If user already acknowledged, do not show
    if (localStorage.getItem('soundtest_cookie_consent')) return false;

    // 1. China region NEVER shows privacy notice popup (per user instruction)
    if (isChinaUser()) return false;

    // 2. Non-GDPR regional editions (zh, ja, ko, vi, th) NEVER show privacy notice popup
    const locale = getCurrentLocale();
    if (['zh', 'ja', 'ko', 'vi', 'th'].includes(locale)) return false;

    // 3. Explicit country code check
    const country = getCountryFromCookie();
    if (country) {
      return GDPR_COUNTRIES.includes(country);
    }

    // 4. Timezone check when country cookie is not yet set
    try {
      const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || '';
      // Non-GDPR major continents (Asia, Americas, Australia, Africa) -> do NOT show
      if (/^(Asia|America|Australia|Pacific|Africa)\//i.test(tz)) {
        return false;
      }
      // Europe timezone -> GDPR region
      if (/^Europe\//i.test(tz)) {
        return true;
      }
    } catch (_) {}

    // 5. European language pages (German, French) default to GDPR if timezone is not overseas
    if (locale === 'de' || locale === 'fr') {
      return true;
    }

    return false;
  }

  function initCookieConsent() {
    if (!shouldShowCookieConsent()) return;

    const locale = getCurrentLocale();
    const i18n = CONSENT_I18N[locale] || CONSENT_I18N.en;

    const banner = document.createElement('div');
    banner.setAttribute('id', 'cookieConsentBanner');
    banner.setAttribute('role', 'region');
    banner.setAttribute('aria-label', i18n.badge);
    banner.style.cssText = `
      position: fixed; bottom: 20px; left: 20px; right: 20px; z-index: 9999;
      display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 16px;
      padding: 16px 22px; border-radius: 16px; border: 1px solid rgba(44, 240, 193, 0.22);
      background: linear-gradient(180deg, rgba(13, 21, 37, 0.96), rgba(6, 10, 18, 0.96));
      box-shadow: 0 24px 80px rgba(0, 0, 0, 0.48), inset 0 1px 0 rgba(255, 255, 255, 0.07);
      backdrop-filter: blur(20px); font-family: -apple-system, system-ui, sans-serif;
      max-width: 960px; margin: 0 auto;
    `;

    const text = document.createElement('div');
    text.style.cssText = "color: #92a4b8; font-size: 13px; line-height: 1.5; flex: 1; min-width: 260px;";
    text.innerHTML = `<strong>${i18n.badge}:</strong> ${i18n.body}<a href="${i18n.link}" style="color: #2cf0c1; text-decoration: underline; text-underline-offset: 3px;">${i18n.policy}</a>.`;

    const btn = document.createElement('button');
    btn.style.cssText = `
      padding: 9px 20px; border-radius: 999px; border: none; font-weight: 700; font-size: 13px; cursor: pointer;
      background: linear-gradient(135deg, #2cf0c1, #0a9172); color: #071018; box-shadow: 0 0 22px rgba(42, 255, 212, 0.18);
      white-space: nowrap; flex-shrink: 0;
    `;
    btn.textContent = i18n.btn;

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

  // Expose helpers for testing and runtime inspection
  window.SoundtestExperience = window.SoundtestExperience || {};
  window.SoundtestExperience.shouldShowCookieConsent = shouldShowCookieConsent;
  window.SoundtestExperience.isChinaUser = isChinaUser;
  window.SoundtestExperience.isGdprRegion = shouldShowCookieConsent;
  window.SoundtestExperience.GDPR_COUNTRIES = GDPR_COUNTRIES;
  window.SoundtestExperience.CONSENT_I18N = CONSENT_I18N;

  const MOBILE_NAV_I18N = {
    zh: {
      home: '首页',
      pricing: '价格权益',
      measure: '测分贝',
      scenarios: '维权场景',
      more: '更多',
      drawerTitle: '快捷导航与工具',
      standards: '国家标准',
      noiseLevels: '分贝等级',
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
      language: '界面语言',
    },
    en: {
      home: 'Home',
      pricing: 'Pricing',
      measure: 'Measure',
      scenarios: 'Scenarios',
      more: 'More',
      drawerTitle: 'Quick Navigation & Tools',
      standards: 'Standards',
      noiseLevels: 'Noise Levels',
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
      language: 'Language',
    },
    es: {
      home: 'Inicio',
      pricing: 'Precios',
      measure: 'Medir dB',
      scenarios: 'Casos',
      more: 'Más',
      drawerTitle: 'Navegación y Herramientas',
      standards: 'Normas',
      noiseLevels: 'Niveles de ruido',
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
      language: 'Idioma',
    },
    fr: {
      home: 'Accueil',
      pricing: 'Tarifs',
      measure: 'Mesurer',
      scenarios: 'Scénarios',
      more: 'Plus',
      drawerTitle: 'Navigation & Outils',
      standards: 'Normes',
      noiseLevels: 'Niveaux de bruit',
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
      language: 'Langue',
    },
    de: {
      home: 'Start',
      pricing: 'Preise',
      measure: 'Messen',
      scenarios: 'Szenarien',
      more: 'Mehr',
      drawerTitle: 'Navigation & Tools',
      standards: 'Normen',
      noiseLevels: 'Dezibel-Tabelle',
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
      language: 'Sprache',
    },
    ja: {
      home: 'ホーム',
      pricing: '料金プラン',
      measure: '騒音測定',
      scenarios: '活用事例',
      more: 'メニュー',
      drawerTitle: 'クイックナビゲーション',
      standards: '騒音基準',
      noiseLevels: 'デシベル基準',
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
      language: '表示言語',
    },
    ko: {
      home: '홈',
      pricing: '요금제',
      measure: '소음측정',
      scenarios: '활용사례',
      more: '더보기',
      drawerTitle: '빠른 메뉴 & 도구',
      standards: '소음 기준',
      noiseLevels: '데시벨 기준',
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
      language: '언어 설정',
    },
    vi: {
      home: 'Trang chủ',
      pricing: 'Bảng giá',
      measure: 'Đo dB',
      scenarios: 'Trường hợp',
      more: 'Thêm',
      drawerTitle: 'Điều hướng & Công cụ',
      standards: 'Tiêu chuẩn',
      noiseLevels: 'Mức decibel',
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
      language: 'Ngôn ngữ',
    },
    th: {
      home: 'หน้าแรก',
      pricing: 'ราคา',
      measure: 'วัดเสียง',
      scenarios: 'กรณีใช้งาน',
      more: 'เพิ่มเติม',
      drawerTitle: 'เมนูทางลัดและเครื่องมือ',
      standards: 'มาตรฐาน',
      noiseLevels: 'ระดับเดซิเบล',
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
      language: 'เปลี่ยนภาษา',
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
    const isFile = window.location.protocol === 'file:';
    const isUseCase = path.includes('/use-cases/');
    const isLocaleSubdir = /\/(zh|en|es|fr|de|ja|ko|vi|th)\//.test(path);
    const variantMatch = path.match(/\/([abc])(?:\/|$)/i);
    const isVariantSubdir = !!variantMatch;
    const variant = variantMatch ? variantMatch[1].toLowerCase() : null;

    if (!isFile) {
      // Standard HTTP/HTTPS deployment (Cloudflare Pages)
      const meterUrl = '/soundtest.html';
      let homeUrl = `/${lang}/index.html`;
      let pricingUrl = `/${lang}/index.html#pricing`;
      let scenariosUrl = `/${lang}/index.html#scenarios`;

      if (isVariantSubdir) {
        homeUrl = `/${variant}/index.html`;
        pricingUrl = `/${variant}/index.html#pricing`;
        scenariosUrl = `/${variant}/index.html#scenarios`;
      } else if (!isLocaleSubdir && !isUseCase) {
        homeUrl = '/index.html';
        pricingUrl = '/index.html#pricing';
        scenariosUrl = '/index.html#scenarios';
      }

      const localePrefix = `/${lang}/`;
      return {
        home: homeUrl,
        pricing: pricingUrl,
        scenarios: scenariosUrl,
        meter: meterUrl,
        standards: `${localePrefix}standards.html`,
        noiseLevels: `${localePrefix}noise-levels.html`,
        accuracy: `${localePrefix}accuracy.html`,
        samples: `${localePrefix}samples.html`,
        download: `${localePrefix}download.html`,
        changelog: `${localePrefix}changelog.html`,
        disclaimer: `${localePrefix}disclaimer.html`,
        privacy: `${localePrefix}privacy.html`,
        compliance: `${localePrefix}compliance.html`,
        auth: `${localePrefix}auth.html`,
      };
    }

    // Local file:// protocol fallback
    let base = '';
    let meterUrl = 'soundtest.html';

    if (isUseCase) {
      base = `../../${lang}/`;
      meterUrl = '../../soundtest.html';
    } else if (isVariantSubdir) {
      base = `../${lang}/`;
      meterUrl = '../soundtest.html';
    } else if (isLocaleSubdir) {
      base = '';
      meterUrl = '../soundtest.html';
    } else {
      base = `${lang}/`;
      meterUrl = 'soundtest.html';
    }

    const homeUrl = isVariantSubdir ? 'index.html' : (base ? `${base}index.html` : 'index.html');
    return {
      home: homeUrl,
      pricing: `${homeUrl}#pricing`,
      scenarios: `${homeUrl}#scenarios`,
      meter: meterUrl,
      standards: base ? `${base}standards.html` : 'standards.html',
      noiseLevels: base ? `${base}noise-levels.html` : 'noise-levels.html',
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
        <a href="${urls.noiseLevels}" class="mobile-drawer-item">
          <div class="mobile-drawer-item-icon">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2v20M17 5v14M7 8v8M22 10v4M2 11v2"/></svg>
          </div>
          <span>${t.noiseLevels}</span>
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
      <div class="mobile-drawer-lang">
        <label for="mobileDrawerLangSelect" class="mobile-drawer-lang-label">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/></svg>
          <span>${t.language || 'Language'}</span>
        </label>
        <select id="mobileDrawerLangSelect" class="mobile-drawer-lang-select" aria-label="${t.language || 'Language'}">
          <option value="zh" ${lang === 'zh' ? 'selected' : ''}>🇨🇳 简体中文</option>
          <option value="en" ${lang === 'en' ? 'selected' : ''}>🇺🇸 English</option>
          <option value="es" ${lang === 'es' ? 'selected' : ''}>🇪🇸 Español</option>
          <option value="fr" ${lang === 'fr' ? 'selected' : ''}>🇫🇷 Français</option>
          <option value="de" ${lang === 'de' ? 'selected' : ''}>🇩🇪 Deutsch</option>
          <option value="ja" ${lang === 'ja' ? 'selected' : ''}>🇯🇵 日本語</option>
          <option value="ko" ${lang === 'ko' ? 'selected' : ''}>🇰🇷 한국어</option>
          <option value="vi" ${lang === 'vi' ? 'selected' : ''}>🇻🇳 Tiếng Việt</option>
          <option value="th" ${lang === 'th' ? 'selected' : ''}>🇹🇭 ไทย</option>
        </select>
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

    const langSelect = drawer.querySelector('#mobileDrawerLangSelect');
    if (langSelect) {
      langSelect.addEventListener('change', () => {
        const next = langSelect.value;
        if (!next || next === lang) return;
        if (window.SoundtestI18n && window.SoundtestI18n.saveLocale) {
          window.SoundtestI18n.saveLocale(next);
        } else {
          try {
            localStorage.setItem('soundtest_locale', next);
            document.cookie = 'sf_locale=' + next + '; Path=/; Max-Age=31536000; SameSite=Lax';
          } catch (_) {}
        }
        const currentPath = window.location.pathname;
        let pageName = currentPath.split('/').filter(Boolean).pop() || 'index.html';
        if (!pageName.includes('.html')) pageName = 'index.html';
        const targetUrl = next === 'en' ? (pageName === 'index.html' ? '/' : `/${pageName}`) : `/${next}/${pageName}`;
        window.location.href = targetUrl;
      });
    }

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

  /* Ambient decibel live simulator for hero owl HUD badge */
  function initEchoHudLiveSimulator() {
    const hud = document.querySelector('.echo-hud');
    if (!hud) return;
    const valEl = hud.querySelector('.echo-hud-value');
    const dotEl = hud.querySelector('.echo-hud-dot');
    if (!valEl) return;

    // Realistic indoor ambient noise range (30.4 dB ~ 35.8 dB)
    let currentDb = 32.4;
    let targetDb = 32.4;

    const colorSteps = [
      { max: 31.4, color: '#2cf0c1', glow: 'rgba(44, 240, 193, 0.75)', border: 'rgba(44, 240, 193, 0.45)' },
      { max: 33.2, color: '#38bdf8', glow: 'rgba(56, 189, 248, 0.75)', border: 'rgba(56, 189, 248, 0.45)' },
      { max: 34.8, color: '#818cf8', glow: 'rgba(129, 140, 248, 0.75)', border: 'rgba(129, 140, 248, 0.45)' },
      { max: 40.0, color: '#a78bfa', glow: 'rgba(167, 139, 250, 0.75)', border: 'rgba(167, 139, 250, 0.45)' }
    ];

    function applyDb(db) {
      valEl.textContent = db.toFixed(1) + ' dB';
      const step = colorSteps.find((s) => db <= s.max) || colorSteps[colorSteps.length - 1];
      valEl.style.color = step.color;
      valEl.style.textShadow = `0 0 10px ${step.glow}`;
      if (dotEl) {
        dotEl.style.backgroundColor = step.color;
        dotEl.style.boxShadow = `0 0 8px ${step.glow}`;
      }
      hud.style.borderColor = step.border;
    }

    function pickNextTarget() {
      const delta = (Math.random() - 0.48) * 3.2;
      let next = currentDb + delta;
      if (next < 30.2) next = 30.6 + Math.random() * 1.2;
      if (next > 35.8) next = 34.2 - Math.random() * 1.2;
      return parseFloat(next.toFixed(1));
    }

    applyDb(currentDb);

    let nextSwitchTime = performance.now() + 1100 + Math.random() * 800;

    function loop(now) {
      if (now >= nextSwitchTime) {
        targetDb = pickNextTarget();
        nextSwitchTime = now + 1000 + Math.random() * 1200;
      }
      const diff = targetDb - currentDb;
      if (Math.abs(diff) > 0.04) {
        currentDb += diff * 0.07;
        applyDb(currentDb);
      }
      requestAnimationFrame(loop);
    }
    requestAnimationFrame(loop);
  }

  ready(() => {
    initRevealAnimations();
    renderRecent();
    initHero();
    initScenarioWorkbench();
    initMobileBottomNav();
    initCookieConsent();
    initPricingNavigation();
    initPricingBillingToggle();
    initBookmarkQuickAccess();
    initPwaInstallBanner();
    initEchoHudLiveSimulator();
    initAppPreloading();
  });

  function initPwaInstallBanner() {
    let deferredPrompt = null;
    const DISMISS_KEY = 'sf_pwa_dismissed_v1';
    if (localStorage.getItem(DISMISS_KEY)) return;

    const isIOS = /(iPad|iPhone|iPod)/i.test(navigator.userAgent || '') && !window.MSStream;
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true;
    if (isStandalone) return;

    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      deferredPrompt = e;
      renderInstallBanner(false);
    });

    if (isIOS && !sessionStorage.getItem('sf_ios_pwa_seen')) {
      setTimeout(() => {
        renderInstallBanner(true);
      }, 3500);
    }

    function openPwaGuideModal(isApple) {
      if (document.getElementById('sf-pwa-guide-modal')) return;
      const lang = (document.documentElement.lang || 'en').slice(0, 2).toLowerCase();
      const isZh = lang === 'zh';

      const overlay = document.createElement('div');
      overlay.id = 'sf-pwa-guide-modal';
      overlay.className = 'pwa-guide-overlay';
      overlay.setAttribute('role', 'dialog');
      overlay.setAttribute('aria-modal', 'true');

      const iosSteps = isZh ? [
        { num: '1', title: '点击 Safari 底部「分享」图标', desc: '在屏幕底端工具栏中央，找到并点击带有向上箭头的正方形分享按钮 ⎋。' },
        { num: '2', title: '向上滑动菜单，点击「添加到主屏幕」', desc: '在弹出面板中向上滑动，找到带有 ➕ 号的“添加到主屏幕 (Add to Home Screen)”。' },
        { num: '3', title: '点击右上角「添加」', desc: '确认名称后点击右上角“添加”，手机主屏幕即可生成图标，支持全屏免安装使用。' }
      ] : [
        { num: '1', title: 'Tap the Share icon in Safari', desc: 'Find and tap the share button ⎋ (square with an up arrow) at the bottom.' },
        { num: '2', title: 'Scroll down and tap "Add to Home Screen"', desc: 'In the share sheet, scroll down to find the "Add to Home Screen" option with a ➕ icon.' },
        { num: '3', title: 'Tap "Add" in the top-right', desc: 'Confirm to add the SOUNDTEST.PRO icon directly to your home screen.' }
      ];

      const androidSteps = isZh ? [
        { num: '1', title: '点击浏览器右上角菜单 ⋮', desc: '在 Chrome、Edge 或自带浏览器右上角找到三点菜单按钮。' },
        { num: '2', title: '点击「安装应用」或「添加到主屏幕」', desc: '选择“安装应用”或“添加到主屏幕”，无需通过任何应用商店。' },
        { num: '3', title: '在桌面一键启动', desc: '桌面将生成应用快捷方式，启动即为独立窗口，测声更快捷。' }
      ] : [
        { num: '1', title: 'Open the browser menu ⋮', desc: 'Tap the three dots menu icon at the top right of your browser.' },
        { num: '2', title: 'Tap "Install app" or "Add to Home Screen"', desc: 'Select install from the menu to download the lightweight web app.' },
        { num: '3', title: 'Launch from your home screen', desc: 'Enjoy 1-tap instant sound monitoring directly from your phone screen.' }
      ];

      const steps = isApple ? iosSteps : androidSteps;

      overlay.innerHTML = `
        <div class="pwa-guide-modal">
          <button type="button" class="pwa-close-btn" id="pwaGuideClose" aria-label="${isZh ? '关闭' : 'Close'}">×</button>
          <div class="pwa-guide-header">
            <h3>📱 ${isZh ? (isApple ? 'iPhone / iPad 添加到桌面教程' : '安卓与桌面端安装教程') : 'How to Add to Home Screen'}</h3>
            <p>${isZh ? '无需在 App Store 下载，仅需 3 秒即可将专业分贝仪添加到手机桌面：' : 'No app store download needed. Set up 1-tap instant monitoring in seconds:'}</p>
          </div>
          <div class="pwa-guide-steps">
            ${steps.map(s => `
              <div class="pwa-guide-step">
                <div class="pwa-step-num">${s.num}</div>
                <div class="pwa-step-body">
                  <strong>${s.title}</strong>
                  <p>${s.desc}</p>
                </div>
              </div>
            `).join('')}
          </div>
          <div class="pwa-guide-footer">
            <button type="button" class="btn-primary btn-sm" id="pwaGuideDoneBtn">${isZh ? '我知道了' : 'Got it'}</button>
          </div>
        </div>
      `;

      document.body.appendChild(overlay);

      const closeModal = () => {
        overlay.remove();
      };
      overlay.querySelector('#pwaGuideClose')?.addEventListener('click', closeModal);
      overlay.querySelector('#pwaGuideDoneBtn')?.addEventListener('click', closeModal);
      overlay.addEventListener('click', (e) => {
        if (e.target === overlay) closeModal();
      });
    }

    function renderInstallBanner(isApple) {
      if (document.getElementById('sf-pwa-banner')) return;
      const lang = (document.documentElement.lang || 'en').slice(0, 2).toLowerCase();
      const isZh = lang === 'zh';

      const banner = document.createElement('aside');
      banner.id = 'sf-pwa-banner';
      banner.className = 'pwa-install-banner'; // Clean class, never reveal or is-visible
      banner.setAttribute('role', 'region');
      banner.setAttribute('aria-label', isZh ? '安装应用提示' : 'PWA Install Prompt');

      const title = isZh ? '添加 SOUNDTEST.PRO 到桌面' : 'Install SOUNDTEST.PRO App';
      const desc = isApple
        ? (isZh ? '点击分享 ⎋ 选择“添加到主屏幕”，可全屏免安装使用。' : 'Tap Share ⎋ then "Add to Home Screen" for instant 1-tap monitoring.')
        : (isZh ? '免应用商店，一键添加至手机桌面，支持离线声级取证。' : 'Add to home screen for fast full-screen noise recording.');
      const btnText = isZh ? '查看教程' : 'Install Guide';

      banner.innerHTML = `
        <button type="button" class="pwa-close-btn" id="pwaBannerCloseBtn" aria-label="${isZh ? '关闭' : 'Close'}">×</button>
        <div class="pwa-banner-content" id="pwaBannerClickArea">
          <div class="pwa-banner-icon" aria-hidden="true">📱</div>
          <div class="pwa-banner-text">
            <strong>${title}</strong>
            <p>${desc}</p>
          </div>
        </div>
        <div class="pwa-banner-actions">
          <button type="button" class="btn-ghost btn-sm pwa-guide-btn">${btnText}</button>
        </div>
      `;

      document.body.appendChild(banner);

      const dismissBanner = () => {
        localStorage.setItem(DISMISS_KEY, 'true');
        sessionStorage.setItem('sf_ios_pwa_seen', 'true');
        banner.remove();
      };

      banner.querySelector('#pwaBannerCloseBtn')?.addEventListener('click', dismissBanner);
      banner.querySelector('.pwa-guide-btn')?.addEventListener('click', () => {
        openPwaGuideModal(isApple);
      });
      banner.querySelector('#pwaBannerClickArea')?.addEventListener('click', () => {
        openPwaGuideModal(isApple);
      });
    }
  }

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

  window.setPricingBillingCycle = function(targetCycle) {
    const cycle = targetCycle === 'monthly' ? 'monthly' : 'yearly';
    const toggleBtns = document.querySelectorAll('.billing-toggle-btn');
    toggleBtns.forEach((b) => {
      const bCycle = b.getAttribute('data-billing') || b.getAttribute('data-billing-toggle') || 'yearly';
      const isActive = bCycle === cycle;
      b.classList.toggle('active', isActive);
      b.setAttribute('aria-checked', isActive ? 'true' : 'false');
    });

    const yearlyEls = document.querySelectorAll('.billing-period-yearly');
    const monthlyEls = document.querySelectorAll('.billing-period-monthly');

    if (cycle === 'yearly') {
      yearlyEls.forEach((el) => {
        el.style.display = el.tagName === 'A' ? 'inline-flex' : (el.classList.contains('price-tag') ? 'flex' : '');
      });
      monthlyEls.forEach((el) => {
        el.style.display = 'none';
      });
    } else {
      yearlyEls.forEach((el) => {
        el.style.display = 'none';
      });
      monthlyEls.forEach((el) => {
        el.style.display = el.tagName === 'A' ? 'inline-flex' : (el.classList.contains('price-tag') ? 'flex' : '');
      });
    }
  };

  function initPricingBillingToggle() {
    const toggleBtns = document.querySelectorAll('.billing-toggle-btn');
    if (!toggleBtns.length) return;

    toggleBtns.forEach((btn) => {
      const handler = (e) => {
        const targetCycle = btn.getAttribute('data-billing') || btn.getAttribute('data-billing-toggle') || 'yearly';
        window.setPricingBillingCycle(targetCycle);
      };

      btn.addEventListener('click', handler);
      btn.addEventListener('touchend', (e) => {
        e.preventDefault();
        handler(e);
      }, { passive: false });
    });
  }

  function initBookmarkQuickAccess() {
    // Disabled per user design request
    return;
    const triggers = document.querySelectorAll('[data-bookmark-trigger]');
    const keyLabels = document.querySelectorAll('[data-bookmark-key]');

    const isMac = /(Macintosh|Mac OS X)/i.test(navigator.userAgent || '') && !('ontouchend' in document);
    const isIOS = /(iPad|iPhone|iPod)/i.test(navigator.userAgent || '') || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
    const isAndroid = /Android/i.test(navigator.userAgent || '');
    const lang = (document.documentElement.lang || 'en').slice(0, 2).toLowerCase();

    const I18N_BM = {
      zh: {
        iosKey: '分享 ⎋', androidKey: '菜单 ⫶', btnDone: '我知道了',
        toast: '已按下快捷键！正在存入书签栏… 突发噪音随时秒开',
        ios: {
          title: '添加到 iPhone / iPad 主屏幕',
          sub: '突发噪音随时一键全屏调取，如同原生 App 般稳定可靠。',
          steps: [
            { num: '1', title: '点击 Safari 底部中央的「分享」图标', desc: '在屏幕最下方工具栏，点击带有向上箭头的正方形分享按钮 ⎋。' },
            { num: '2', title: '滑动菜单，选择「添加到主屏幕」', desc: '在弹出面板中向下微滑动，找到带有 ➕ 号的“添加到主屏幕 (Add to Home Screen)”。' },
            { num: '3', title: '点击右上角「添加」即刻生成桌面图标', desc: '下次遇到邻居跺脚或夜间噪音，桌面秒开即测，无需重新搜索网址。' }
          ]
        },
        android: {
          title: '添加到 Android 手机桌面',
          sub: '随时调取分贝仪与防伪录音，免去在浏览器反复输入网址。',
          steps: [
            { num: '1', title: '点击浏览器右上角的「更多菜单」', desc: '点击右上角竖排三点图标 (⫶) 打开浏览器功能面板。' },
            { num: '2', title: '选择「添加到主屏幕」或「安装应用」', desc: '在菜单列表中点击“添加到主屏幕 (Add to Home screen)”。' },
            { num: '3', title: '确认添加，桌面立即可见', desc: '遇到突发扰民随时在手机主屏幕一键秒开，取证快人一步。' }
          ]
        },
        mac: {
          title: '按快捷键存入 Mac 个人收藏',
          sub: '突发邻里噪音或深夜机械轰鸣，书签栏 1 秒调取取证。',
          steps: [
            { num: '1', title: '直接按下键盘 ⌘ + D 快捷键', desc: '或点击 Safari / Chrome 顶部菜单【书签】➔【添加书签】。' },
            { num: '2', title: '保存位置建议选择「书签栏」或「个人收藏」', desc: '将名称保留为 SOUNDTEST.PRO，便于在浏览器顶栏直观看见。' },
            { num: '3', title: '深夜或突发噪音随时一键启动', desc: '无需百度搜索或重新翻查历史记录，1秒进入高灵敏监听。' }
          ]
        },
        win: {
          title: '按 Ctrl+D 快速存入书签栏',
          sub: '楼上震楼或窗外施工往往突发发生，存入书签栏随时调取维权！',
          steps: [
            { num: '1', title: '按下键盘快捷键 Ctrl + D', desc: '或点击浏览器地址栏右侧的【⭐ 收藏此标签页】星标。' },
            { num: '2', title: '文件夹建议选择「书签栏」', desc: '名称保留为 SOUNDTEST.PRO，确保在浏览器顶部常驻可见。' },
            { num: '3', title: '突发扰民无需搜索，书签栏 1 秒秒开', desc: '即开即测，第一时间锁定现场分贝、录音与 GPS 防伪时间戳。' }
          ]
        }
      },
      en: {
        iosKey: 'Share ⎋', androidKey: 'Menu ⫶', btnDone: 'Got it',
        toast: 'Shortcut pressed! Bookmark added for instant emergency noise checks.',
        ios: {
          title: 'Add to Home Screen (iOS)',
          sub: '1-Tap instant access from your home screen during unexpected disturbances.',
          steps: [
            { num: '1', title: 'Tap the Share icon in Safari', desc: 'In Safari bottom bar, tap the share icon ⎋ (square with an up arrow).' },
            { num: '2', title: 'Scroll and select "Add to Home Screen"', desc: 'In the share sheet, find the "Add to Home Screen" option with a ➕ icon.' },
            { num: '3', title: 'Tap "Add" in the top right', desc: 'Your home screen gets a dedicated app icon for 1-tap rapid noise recording.' }
          ]
        },
        android: {
          title: 'Add to Home Screen (Android)',
          sub: 'Keep SOUNDTEST.PRO on your home screen for rapid emergency noise capture.',
          steps: [
            { num: '1', title: 'Tap the browser menu icon (⫶)', desc: 'Tap the three-dot menu in the upper right corner of Chrome.' },
            { num: '2', title: 'Select "Add to Home screen"', desc: 'Tap "Add to Home screen" or "Install App".' },
            { num: '3', title: 'Confirm addition', desc: 'The icon appears on your home screen ready for instant dB documentation.' }
          ]
        },
        mac: {
          title: 'Bookmark on macOS',
          sub: 'Save SOUNDTEST.PRO to your bookmarks bar for 1-click emergency verification.',
          steps: [
            { num: '1', title: 'Press ⌘ Command + D on your keyboard', desc: 'Or click the Bookmarks menu in your browser and select "Add Bookmark".' },
            { num: '2', title: 'Save to Bookmarks Bar / Favorites', desc: 'Keep the name as SOUNDTEST.PRO for immediate one-click visibility.' },
            { num: '3', title: 'One-click launch during noise spikes', desc: 'Instant access during late-night disruptions without typing URLs.' }
          ]
        },
        win: {
          title: 'Bookmark with Ctrl+D',
          sub: 'Save to your browser bookmarks bar for instant access when noise spikes occur.',
          steps: [
            { num: '1', title: 'Press Ctrl + D on your keyboard', desc: 'Or click the star icon (⭐) at the right end of your address bar.' },
            { num: '2', title: 'Select "Bookmarks bar" folder', desc: 'Keep SOUNDTEST.PRO pinned to your browser top bar for immediate access.' },
            { num: '3', title: 'Instant 1-second launch when disturbance strikes', desc: 'Capture decibels, audio, and GPS tamper-proof timestamps with zero delay.' }
          ]
        }
      },
      de: {
        iosKey: 'Teilen ⎋', androidKey: 'Menü ⫶', btnDone: 'Verstanden',
        toast: 'Tastenkombination gedrückt! Lesezeichen hinzugefügt.',
        ios: {
          title: 'Zum Startbildschirm hinzufügen (iOS)',
          sub: '1-Klick-Sofortzugriff bei unerwartetem Lärm direkt vom Home-Bildschirm.',
          steps: [
            { num: '1', title: 'Tippen Sie auf das Teilen-Symbol in Safari', desc: 'Tippen Sie in der unteren Leiste auf das Quadrat mit dem Pfeil nach oben ⎋.' },
            { num: '2', title: 'Wählen Sie „Zum Home-Bildschirm“', desc: 'Scrollen Sie im Teilen-Menü zur Option mit dem ➕-Symbol.' },
            { num: '3', title: 'Tippen Sie oben rechts auf „Hinzufügen“', desc: 'SOUNDTEST.PRO ist nun als App-Symbol für schnelle Lärmmessungen bereit.' }
          ]
        },
        android: {
          title: 'Zum Startbildschirm hinzufügen (Android)',
          sub: 'Halten Sie SOUNDTEST.PRO griffbereit für sofortige Lärmprotokolle.',
          steps: [
            { num: '1', title: 'Tippen Sie auf das Menü-Symbol (⫶)', desc: 'Tippen Sie oben rechts in Chrome auf die drei Punkte.' },
            { num: '2', title: 'Wählen Sie „Zum Startbildschirm hinzufügen“', desc: 'Wählen Sie im Menü „App installieren“ oder „Zum Startbildschirm“.' },
            { num: '3', title: 'Hinzufügen bestätigen', desc: 'Das Symbol erscheint sofort auf Ihrem Bildschirm für sekundenschnelle Messung.' }
          ]
        },
        mac: {
          title: 'Als Lesezeichen speichern (macOS)',
          sub: 'SOUNDTEST.PRO in der Favoritenleiste sichern für Sofortstart bei Ruhestörung.',
          steps: [
            { num: '1', title: 'Drücken Sie ⌘ Command + D', desc: 'Oder wählen Sie im Menü „Lesezeichen“ ➔ „Lesezeichen hinzufügen“.' },
            { num: '2', title: 'Speicherort „Favoriten / Lesezeichenleiste“ wählen', desc: 'Behalten Sie den Namen SOUNDTEST.PRO für optimale Auffindbarkeit bei.' },
            { num: '3', title: 'Sofortstart bei nächtlichem Lärm', desc: 'Kein langes Suchen nach URLs – ein Klick genügt.' }
          ]
        },
        win: {
          title: 'Mit Ctrl+D als Lesezeichen speichern',
          sub: 'In der Lesezeichenleiste anheften für Sofortzugriff bei akuter Lärmbelästigung.',
          steps: [
            { num: '1', title: 'Drücken Sie Strg + D (Ctrl + D)', desc: 'Oder klicken Sie auf das Sternsymbol (⭐) in der Adressleiste.' },
            { num: '2', title: 'Ordner „Lesezeichenleiste“ auswählen', desc: 'Speichern Sie die Seite für direkten Zugriff oben im Browser.' },
            { num: '3', title: '1-Sekunden-Start bei Störgeräuschen', desc: 'Dezibel, Audionachweis und GPS-Zeitstempel ohne Zeitverlust festhalten.' }
          ]
        }
      },
      es: {
        iosKey: 'Compartir ⎋', androidKey: 'Menú ⫶', btnDone: 'Entendido',
        toast: '¡Atajo presionado! Marcador guardado para acceso rápido.',
        ios: {
          title: 'Añadir a la pantalla de inicio (iOS)',
          sub: 'Acceso en 1 toque desde tu pantalla de inicio ante cualquier ruido imprevisto.',
          steps: [
            { num: '1', title: 'Toca el icono Compartir en Safari', desc: 'En la barra inferior de Safari, pulsa el icono cuadrado con flecha hacia arriba ⎋.' },
            { num: '2', title: 'Selecciona "Añadir a pantalla de inicio"', desc: 'En el menú emergente, localiza la opción con el símbolo ➕.' },
            { num: '3', title: 'Pulsa "Añadir" en la esquina superior', desc: 'Tendrás un icono directo en tu pantalla para medir decibelios al instante.' }
          ]
        },
        android: {
          title: 'Añadir a la pantalla de inicio (Android)',
          sub: 'Ten SOUNDTEST.PRO a mano para registrar pruebas de ruido sin demoras.',
          steps: [
            { num: '1', title: 'Toca el menú de tres puntos (⫶)', desc: 'Pulsa en la esquina superior derecha del navegador Chrome.' },
            { num: '2', title: 'Elige "Añadir a pantalla de inicio"', desc: 'Selecciona "Añadir a pantalla de inicio" o "Instalar aplicación".' },
            { num: '3', title: 'Confirma la adición', desc: 'El icono aparecerá en tu escritorio móvil listo para documentar ruidos.' }
          ]
        },
        mac: {
          title: 'Guardar en Marcadores (macOS)',
          sub: 'Guarda SOUNDTEST.PRO en tu barra de favoritos para emergencias acústicas.',
          steps: [
            { num: '1', title: 'Presiona ⌘ Command + D', desc: 'O haz clic en el menú Marcadores ➔ "Añadir marcador".' },
            { num: '2', title: 'Selecciona "Barra de favoritos"', desc: 'Conserva el nombre SOUNDTEST.PRO para verlo siempre arriba.' },
            { num: '3', title: 'Acceso en 1 clic ante ruidos molestos', desc: 'Sin necesidad de teclear direcciones web ni buscar en historiales.' }
          ]
        },
        win: {
          title: 'Guardar en marcadores con Ctrl+D',
          sub: 'Ancla la herramienta en tu barra de marcadores para medir ruidos al momento.',
          steps: [
            { num: '1', title: 'Presiona Ctrl + D en tu teclado', desc: 'O pulsa la estrella (⭐) al final de la barra de direcciones.' },
            { num: '2', title: 'Elige la carpeta "Barra de marcadores"', desc: 'Fija el acceso en la parte superior del navegador.' },
            { num: '3', title: 'Inicio en 1 segundo cuando surge el ruido', desc: 'Registra decibelios, audio y coordenadas GPS con valor probatorio.' }
          ]
        }
      },
      fr: {
        iosKey: 'Partager ⎋', androidKey: 'Menu ⫶', btnDone: 'Compris',
        toast: 'Raccourci activé ! Page ajoutée aux favoris.',
        ios: {
          title: 'Ajouter à l\'écran d\'accueil (iOS)',
          sub: 'Accès instantané en 1 toucher dès qu\'une nuisance sonore se produit.',
          steps: [
            { num: '1', title: 'Touchez le bouton Partager dans Safari', desc: 'Dans la barre en bas de Safari, appuyez sur l\'icône carrée avec la flèche ⎋.' },
            { num: '2', title: 'Choisissez "Sur l\'écran d\'accueil"', desc: 'Faites défiler le menu pour trouver l\'icône ➕ "Sur l\'écran d\'accueil".' },
            { num: '3', title: 'Touchez "Ajouter" en haut à droite', desc: 'L\'icône est créée sur votre écran pour lancer l\'enregistrement sans délai.' }
          ]
        },
        android: {
          title: 'Ajouter à l\'écran d\'accueil (Android)',
          sub: 'Gardez le sonomètre à portée de main en cas de tapage nocturne.',
          steps: [
            { num: '1', title: 'Touchez le menu à trois points (⫶)', desc: 'Appuyez en haut à droite de votre navigateur Chrome.' },
            { num: '2', title: 'Sélectionnez "Ajouter à l\'écran d\'accueil"', desc: 'Ou "Installer l\'application" selon votre version.' },
            { num: '3', title: 'Confirmez l\'ajout', desc: 'L\'icône est prête sur votre mobile pour constater le niveau sonore.' }
          ]
        },
        mac: {
          title: 'Ajouter aux favoris (macOS)',
          sub: 'Épinglez SOUNDTEST.PRO dans vos favoris pour un accès immédiat.',
          steps: [
            { num: '1', title: 'Appuyez sur ⌘ Command + D', desc: 'Ou cliquez sur le menu Favoris ➔ "Ajouter aux favoris".' },
            { num: '2', title: 'Choisissez l\'emplacement "Barre des favoris"', desc: 'Gardez le nom SOUNDTEST.PRO pour une visibilité directe.' },
            { num: '3', title: 'Activation en un clic lors d\'un tapage', desc: 'Plus besoin de chercher le site web au milieu de la nuit.' }
          ]
        },
        win: {
          title: 'Ajouter aux favoris avec Ctrl+D',
          sub: 'Enregistrez dans votre barre de favoris pour lancer la mesure instantanément.',
          steps: [
            { num: '1', title: 'Appuyez sur Ctrl + D au clavier', desc: 'Ou cliquez sur l\'étoile (⭐) à droite de la barre d\'adresse.' },
            { num: '2', title: 'Sélectionnez le dossier "Barre de favoris"', desc: 'Gardez SOUNDTEST.PRO toujours visible en haut du navigateur.' },
            { num: '3', title: 'Démarrage en 1 seconde en cas de litige', desc: 'Capturez les dB, l\'audio et l\'horodatage certifié sans perte de temps.' }
          ]
        }
      },
      ja: {
        iosKey: '共有 ⎋', androidKey: 'メニュー ⫶', btnDone: '了解',
        toast: 'ショートカット検知！ ブックマークに登録して騒音時に即座に測定可能。',
        ios: {
          title: 'iPhone / iPad のホーム画面に追加',
          sub: '突発的な騒音トラブル時もホーム画面から1タップで全画面起動できます。',
          steps: [
            { num: '1', title: 'Safari 下部の「共有」アイコンをタップ', desc: '画面最下部の中央にある四角と矢印の共有ボタン ⎋ をタップします。' },
            { num: '2', title: 'メニューから「ホーム画面に追加」を選択', desc: '下へスクロールし、➕ アイコンの「ホーム画面に追加」を選びます。' },
            { num: '3', title: '右上の「追加」をタップ', desc: '次回からアプリアイコンをタップするだけで瞬時に騒音測定を開始できます。' }
          ]
        },
        android: {
          title: 'Android のホーム画面に追加',
          sub: '騒音発生時にすぐ起動できるようホーム画面にショートカットを配置します。',
          steps: [
            { num: '1', title: 'ブラウザ右上のメニュー（⫶）をタップ', desc: 'Chrome 右上の縦の3点リーダーアイコンをタップします。' },
            { num: '2', title: '「ホーム画面に追加」または「アプリをインストール」を選択', desc: 'メニュー一覧から該当項目をタップします。' },
            { num: '3', title: '追加を確認して完了', desc: 'スマホのホーム画面にアイコンが作成され、1秒で測定画面に入れます。' }
          ]
        },
        mac: {
          title: 'ショートカットキーで Mac にブックマーク',
          sub: '深夜の騒音や上階の足音に備え、ブックマークバーに常駐させます。',
          steps: [
            { num: '1', title: 'キーボードで ⌘ Command + D を押す', desc: 'またはブラウザ上部メニューの【ブックマーク】➔【ブックマークを追加】を選択。' },
            { num: '2', title: '保存先を「お気に入り」または「ブックマークバー」に指定', desc: '名前を SOUNDTEST.PRO にしておくと視認性が高まります。' },
            { num: '3', title: '騒音発生時にワンクリックで即起動', desc: '検索やURL入力の手間なく、直ちにデシベル測定と録音を開始できます。' }
          ]
        },
        win: {
          title: 'Ctrl+D でブックマークバーに素早く登録',
          sub: '突発的な工事や隣人トラブル時、ブックマークバーから1秒で証拠採取を開始！',
          steps: [
            { num: '1', title: 'キーボードの Ctrl + D を押す', desc: 'またはアドレスバー右端の星型アイコン（⭐）をクリックします。' },
            { num: '2', title: 'フォルダを「ブックマークバー」に指定', desc: 'ブラウザの上部に常に表示されるように設定します。' },
            { num: '3', title: '騒音が発生したら1秒で起動', desc: '即座に現場の音圧デシベル、録音、GPS改ざん防止タイムスタンプを確保。' }
          ]
        }
      },
      ko: {
        iosKey: '공유 ⎋', androidKey: '메뉴 ⫶', btnDone: '확인',
        toast: '단축키 입력 확인! 북마크에 추가되었습니다.',
        ios: {
          title: 'iPhone / iPad 홈 화면에 추가',
          sub: '돌발 소음 발생 시 홈 화면에서 1초 만에 전체 화면으로 즉시 실행 가능합니다.',
          steps: [
            { num: '1', title: 'Safari 하단 중앙의 [공유] 아이콘 터치', desc: '화면 맨 아래 툴바에서 위쪽 화살표가 있는 사각형 아이콘 ⎋을 누릅니다.' },
            { num: '2', title: '메뉴를 스크롤하여 [홈 화면에 추가] 선택', desc: '팝업 시트에서 ➕ 기호가 표시된 "홈 화면에 추가" 항목을 선택합니다.' },
            { num: '3', title: '우측 상단 [추가] 터치', desc: '홈 화면에 앱 아이콘이 생성되어 층간소음 발생 시 즉시 측정할 수 있습니다.' }
          ]
        },
        android: {
          title: 'Android 휴대폰 홈 화면에 추가',
          sub: 'URL 검색 없이 바탕화면에서 즉시 데시벨 측정 및 녹음을 시작합니다.',
          steps: [
            { num: '1', title: '브라우저 우측 상단 더보기 메뉴(⫶) 터치', desc: 'Chrome 브라우저 오른쪽 위의 점 세 개 아이콘을 누릅니다.' },
            { num: '2', title: '[홈 화면에 추가] 또는 [앱 설치] 선택', desc: '메뉴 목록에서 "홈 화면에 추가"를 선택합니다.' },
            { num: '3', title: '추가 확인 완료', desc: '홈 화면에 바로가기가 생성되어 소음 발생 즉시 원터치로 증거를 수집합니다.' }
          ]
        },
        mac: {
          title: 'Mac 책갈피에 바로 저장하기',
          sub: '즐겨찾기 바에 저장해 두면 심야 소음 발생 시 1초 만에 실행할 수 있습니다.',
          steps: [
            { num: '1', title: '키보드에서 ⌘ Command + D 누르기', desc: '또는 브라우저 상단 메뉴 [책갈피] ➔ [책갈피 추가]를 클릭합니다.' },
            { num: '2', title: '저장 위치를 "즐겨찾기 막대"로 설정', desc: '이름을 SOUNDTEST.PRO로 유지하여 항상 상단에 보이도록 합니다.' },
            { num: '3', title: '돌발 소음 시 원클릭 측정 시작', desc: '검색 엔진을 거치지 않고 즉시 고감도 소음 감시 화면으로 진입합니다.' }
          ]
        },
        win: {
          title: 'Ctrl+D 로 북마크바에 빠른 저장',
          sub: '윗집 쿵쿵거림이나 야간 소음 발생 시 북마크바에서 1초 만에 증거 포착!',
          steps: [
            { num: '1', title: '키보드 단축키 Ctrl + D 누르기', desc: '또는 주소창 오른쪽 끝의 별표(⭐) 아이콘을 클릭합니다.' },
            { num: '2', title: '폴더를 "북마크바"로 지정', desc: '브라우저 상단에 고정 표시되도록 설정합니다.' },
            { num: '3', title: '소음 발생 시 즉시 실행', desc: '지연 없이 현장 데시벨 수치, 음성 녹음 및 GPS 타임스탬프를 잠금 보관합니다.' }
          ]
        }
      },
      th: {
        iosKey: 'แชร์ ⎋', androidKey: 'เมนู ⫶', btnDone: 'เข้าใจแล้ว',
        toast: 'ตรวจพบคีย์ลัด! บันทึกหน้าเว็บลงในบุ๊กมาร์กเรียบร้อยแล้ว',
        ios: {
          title: 'เพิ่มลงในหน้าจอหลัก (iOS)',
          sub: 'เปิดใช้งานเต็มหน้าจอได้ใน 1 แตะทันทีที่เกิดเสียงรบกวนฉุกเฉิน',
          steps: [
            { num: '1', title: 'แตะไอคอนแชร์ที่ด้านล่างของ Safari', desc: 'บนแถบเครื่องมือด้านล่าง ให้แตะปุ่มสี่เหลี่ยมพร้อมลูกศรชี้ขึ้น ⎋' },
            { num: '2', title: 'เลื่อนเมนูแล้วเลือก "เพิ่มไปยังหน้าจอโฮม"', desc: 'ค้นหาตัวเลือกที่มีเครื่องหมาย ➕ "เพิ่มไปยังหน้าจอโฮม"' },
            { num: '3', title: 'แตะ "เพิ่ม" ที่มุมขวาบน', desc: 'ไอคอนแอปจะปรากฏบนหน้าจอหลักพร้อมเปิดตรวจวัดเดซิเบลได้ทันที' }
          ]
        },
        android: {
          title: 'เพิ่มลงในหน้าจอหลัก (Android)',
          sub: 'เก็บ SOUNDTEST.PRO ไว้บนหน้าจอหลักเพื่อความรวดเร็วในการบันทึกหลักฐาน',
          steps: [
            { num: '1', title: 'แตะไอคอนเมนู 3 จุด (⫶)', desc: 'แตะที่มุมขวาบนของเบราว์เซอร์ Chrome' },
            { num: '2', title: 'เลือก "เพิ่มลงในหน้าจอหลัก"', desc: 'เลือก "เพิ่มลงในหน้าจอหลัก" หรือ "ติดตั้งแอป"' },
            { num: '3', title: 'ยืนยันการเพิ่มไอคอน', desc: 'ไอคอนจะปรากฏบนหน้าจอพร้อมเปิดวัดเสียงรบกวนได้ทันท่วงที' }
          ]
        },
        mac: {
          title: 'บันทึกเป็นบุ๊กมาร์กบน macOS',
          sub: 'ปักหมุดบนแถบรายการโปรดเพื่อให้พร้อมเปิดใช้งานใน 1 วินาที',
          steps: [
            { num: '1', title: 'กดแป้น ⌘ Command + D', desc: 'หรือคลิกเมนู บุ๊กมาร์ก ➔ "เพิ่มบุ๊กมาร์ก"' },
            { num: '2', title: 'เลือกโฟลเดอร์ "แถบรายการโปรด"', desc: 'ตั้งชื่อเป็น SOUNDTEST.PRO เพื่อให้มองเห็นได้ง่ายที่แถบด้านบน' },
            { num: '3', title: 'คลิกเปิดใช้งานทันทีเมื่อมีเสียงรบกวน', desc: 'ไม่ต้องเสียเวลาพิมพ์ URL เมื่อเกิดเสียงก่อสร้างหรือเสียงเพื่อนบ้านยามดึก' }
          ]
        },
        win: {
          title: 'กด Ctrl+D เพื่อบันทึกเป็นบุ๊กมาร์ก',
          sub: 'บันทึกไว้บนแถบบุ๊กมาร์กเพื่อเรียกใช้เครื่องมือวัดเสียงได้ทันที!',
          steps: [
            { num: '1', title: 'กดแป้นพิมพ์ Ctrl + D', desc: 'หรือคลิกไอคอนรูปดาว (⭐) ทางด้านขวาของแถบที่อยู่' },
            { num: '2', title: 'เลือกโฟลเดอร์ "แถบบุ๊กมาร์ก"', desc: 'เพื่อให้ลิงก์แสดงอยู่ด้านบนสุดของเบราว์เซอร์ตลอดเวลา' },
            { num: '3', title: 'เปิดใช้งานใน 1 วินาทีเมื่อมีเสียงรบกวน', desc: 'บันทึกค่าเดซิเบล เสียง และพิกัด GPS ป้องกันการแก้ไขได้ทันที' }
          ]
        }
      },
      vi: {
        iosKey: 'Chia sẻ ⎋', androidKey: 'Menu ⫶', btnDone: 'Đã hiểu',
        toast: 'Đã nhận phím tắt! Đang lưu trang vào dấu trang...',
        ios: {
          title: 'Thêm vào màn hình chính (iOS)',
          sub: 'Truy cập tức thì bằng 1 chạm từ màn hình chính khi có tiếng ồn bất ngờ.',
          steps: [
            { num: '1', title: 'Nhấn vào biểu tượng Chia sẻ trên Safari', desc: 'Ở thanh công cụ dưới cùng, chạm vào biểu tượng hình vuông có mũi tên ⎋.' },
            { num: '2', title: 'Cuộn menu và chọn "Thêm vào MH chính"', desc: 'Tìm tùy chọn có biểu tượng dấu ➕ "Thêm vào MH chính".' },
            { num: '3', title: 'Chạm "Thêm" ở góc trên bên phải', desc: 'Biểu tượng ứng dụng sẽ xuất hiện trên màn hình sẵn sàng đo âm thanh.' }
          ]
        },
        android: {
          title: 'Thêm vào màn hình chính (Android)',
          sub: 'Lưu SOUNDTEST.PRO trên màn hình để khởi động ngay khi cần chứng cứ.',
          steps: [
            { num: '1', title: 'Chạm vào menu 3 chấm (⫶)', desc: 'Nhấn vào góc trên bên phải của trình duyệt Chrome.' },
            { num: '2', title: 'Chọn "Thêm vào màn hình chính"', desc: 'Chọn "Thêm vào màn hình chính" hoặc "Cài đặt ứng dụng".' },
            { num: '3', title: 'Xác nhận thêm', desc: 'Biểu tượng sẽ hiển thị trên điện thoại giúp bạn đo decibel trong tích tắc.' }
          ]
        },
        mac: {
          title: 'Lưu dấu trang trên macOS',
          sub: 'Ghim vào thanh dấu trang để mở ngay khi xảy ra tiếng ồn đêm khuya.',
          steps: [
            { num: '1', title: 'Nhấn phím ⌘ Command + D trên bàn phím', desc: 'Hoặc chọn menu Dấu trang ➔ "Thêm dấu trang".' },
            { num: '2', title: 'Chọn thư mục "Thanh dấu trang / Mục ưa thích"', desc: 'Giữ tên SOUNDTEST.PRO để hiển thị rõ ràng trên thanh công cụ.' },
            { num: '3', title: 'Khởi chạy 1 chạm khi có tiếng ồn', desc: 'Không cần gõ lại địa chỉ web hay tìm kiếm lịch sử.' }
          ]
        },
        win: {
          title: 'Lưu vào thanh dấu trang bằng Ctrl+D',
          sub: 'Lưu cố định trên thanh dấu trang để kịp thời ghi nhận bằng chứng tiếng ồn!',
          steps: [
            { num: '1', title: 'Nhấn phím tắt Ctrl + D trên bàn phím', desc: 'Hoặc nhấn vào biểu tượng ngôi sao (⭐) ở cuối thanh địa chỉ.' },
            { num: '2', title: 'Chọn thư mục "Thanh dấu trang"', desc: 'Giữ SOUNDTEST.PRO luôn xuất hiện ở thanh trên cùng của trình duyệt.' },
            { num: '3', title: 'Khởi động trong 1 giây khi có quấy nhiễu', desc: 'Đo ngay mức decibel, ghi âm và gắn tọa độ GPS chống sửa đổi.' }
          ]
        }
      }
    };

    const curI18n = I18N_BM[lang] || I18N_BM['en'];

    if (keyLabels.length) {
      keyLabels.forEach((el) => {
        if (isMac) {
          el.textContent = '⌘+D';
        } else if (isIOS) {
          el.textContent = curI18n.iosKey || 'Share ⎋';
        } else if (isAndroid) {
          el.textContent = curI18n.androidKey || 'Menu ⫶';
        } else {
          el.textContent = 'Ctrl+D';
        }
      });
    }

    function showBookmarkToast(message) {
      let toast = document.getElementById('sf-bookmark-toast');
      if (!toast) {
        toast = document.createElement('div');
        toast.id = 'sf-bookmark-toast';
        toast.className = 'bookmark-toast';
        document.body.appendChild(toast);
      }
      toast.innerHTML = `<span aria-hidden="true">⭐</span><span>${message}</span>`;
      toast.classList.add('is-active');
      clearTimeout(toast._timer);
      toast._timer = setTimeout(() => {
        toast.classList.remove('is-active');
      }, 3200);
    }

    function openBookmarkModal() {
      if (document.getElementById('sf-bookmark-modal')) return;

      const overlay = document.createElement('div');
      overlay.id = 'sf-bookmark-modal';
      overlay.className = 'bookmark-modal-overlay';
      overlay.setAttribute('role', 'dialog');
      overlay.setAttribute('aria-modal', 'true');

      let modalData;
      let keyBadgeHtml = '';

      if (isIOS) {
        modalData = curI18n.ios;
        keyBadgeHtml = `<div class="bookmark-key-display"><span style="font-size:24px;">📱</span><span style="font-weight:700;">Safari</span></div>`;
      } else if (isAndroid) {
        modalData = curI18n.android;
        keyBadgeHtml = `<div class="bookmark-key-display"><span style="font-size:24px;">📱</span><span style="font-weight:700;">Chrome</span></div>`;
      } else if (isMac) {
        modalData = curI18n.mac;
        keyBadgeHtml = `<div class="bookmark-key-display"><kbd>⌘</kbd><span style="font-weight:700;color:var(--muted);">+</span><kbd>D</kbd></div>`;
      } else {
        modalData = curI18n.win;
        keyBadgeHtml = `<div class="bookmark-key-display"><kbd>Ctrl</kbd><span style="font-weight:700;color:var(--muted);">+</span><kbd>D</kbd></div>`;
      }

      overlay.innerHTML = `
        <div class="bookmark-modal-card">
          <button type="button" class="close-btn" id="sfBookmarkCloseBtn" aria-label="Close">×</button>
          <div style="font-size:32px;margin-bottom:6px;">⭐</div>
          <h3>${modalData.title}</h3>
          <p>${modalData.sub}</p>
          ${keyBadgeHtml}
          <div class="bookmark-steps-list">
            ${modalData.steps.map((s) => `
              <div class="bookmark-step-item">
                <span class="step-num">${s.num}</span>
                <div>
                  <strong style="color:var(--text-strong);display:block;margin-bottom:2px;">${s.title}</strong>
                  <span>${s.desc}</span>
                </div>
              </div>
            `).join('')}
          </div>
          <button type="button" class="button primary" id="sfBookmarkDoneBtn" style="width:100%;">${curI18n.btnDone}</button>
        </div>
      `;

      document.body.appendChild(overlay);

      const closeModal = () => {
        overlay.remove();
        document.removeEventListener('keydown', handleEsc);
      };

      const handleEsc = (e) => {
        if (e.key === 'Escape') closeModal();
      };

      document.addEventListener('keydown', handleEsc);
      overlay.querySelector('#sfBookmarkCloseBtn')?.addEventListener('click', closeModal);
      overlay.querySelector('#sfBookmarkDoneBtn')?.addEventListener('click', closeModal);
      overlay.addEventListener('click', (e) => {
        if (e.target === overlay) closeModal();
      });
    }

    triggers.forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        openBookmarkModal();
      });
    });

    window.addEventListener('keydown', (e) => {
      if ((e.ctrlKey || e.metaKey) && (e.key === 'd' || e.key === 'D')) {
        showBookmarkToast(curI18n.toast);
      }
    });
  }

  /* ── Ultra-Fast Tool Preloading for 0-Latency Monitoring Launch (PC & Mobile) ── */
  function initAppPreloading() {
    const pathname = window.location.pathname || '';
    if (pathname.endsWith('soundtest.html') || pathname.endsWith('camera.html')) return;

    // Detect if we are in a locale subdirectory (e.g. /zh/, /en/, /de/) or /use-cases/
    const isSubdir = !/^\/(?:index\.html)?$/.test(pathname) && (/^\/([a-z]{2})\//.test(pathname) || /^\/use-cases\//.test(pathname));
    const prefix = isSubdir ? '../' : '';

    const criticalUrls = [
      prefix + 'soundtest.html',
      prefix + 'assets/soundtest.css',
      prefix + 'assets/layout-flow.css',
      prefix + 'camera.html',
      prefix + 'assets/camera.css',
      prefix + 'assets/camera.js'
    ];

    const prefetchUrl = (url, asType = '') => {
      try {
        if (document.querySelector(`link[rel="prefetch"][href="${url}"]`)) return;
        const link = document.createElement('link');
        link.rel = 'prefetch';
        link.href = url;
        if (asType) link.as = asType;
        document.head.appendChild(link);
      } catch (_) {}
    };

    const fetchBackground = (url) => {
      try {
        if ('fetch' in window) {
          fetch(url, { priority: 'low', cache: 'force-cache' }).catch(() => {});
        }
      } catch (_) {}
    };

    let preloaded = false;
    const doPreload = () => {
      if (preloaded) return;
      preloaded = true;
      criticalUrls.forEach(url => {
        prefetchUrl(url);
        fetchBackground(url);
      });
    };

    // 1. Idle / background preload after initial page render (600ms on desktop / mobile)
    if ('requestIdleCallback' in window) {
      window.requestIdleCallback(doPreload, { timeout: 2000 });
    } else {
      setTimeout(doPreload, 800);
    }

    // 2. High-intent triggers: On hover or touchstart on any monitor / camera buttons
    const triggerSelectors = [
      'a[href*="soundtest.html"]',
      'a[href*="camera.html"]',
      '.hero-cta',
      '.app-btn',
      '.nav-btn-highlight',
      '[data-preload-app]',
      '.primary-cta',
      '.action-bar-btn'
    ];

    const eagerPreload = () => {
      doPreload();
      try {
        if (!document.querySelector('link[rel="prerender"][href*="soundtest.html"]')) {
          const prerender = document.createElement('link');
          prerender.rel = 'prerender';
          prerender.href = prefix + 'soundtest.html';
          document.head.appendChild(prerender);
        }
      } catch (_) {}
    };

    try {
      document.querySelectorAll(triggerSelectors.join(',')).forEach(el => {
        el.addEventListener('pointerenter', eagerPreload, { once: true, passive: true });
        el.addEventListener('touchstart', eagerPreload, { once: true, passive: true });
      });
    } catch (_) {}
  }
})();


