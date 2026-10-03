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

  function initMobileNav() {
    const nav = document.querySelector('.site-nav');
    if (!nav) return;
    const navMain = nav.querySelector('.site-nav-main');
    if (!navMain) return;

    let toggleBtn = nav.querySelector('.site-nav-toggle');
    if (!toggleBtn) {
      toggleBtn = document.createElement('button');
      toggleBtn.type = 'button';
      toggleBtn.className = 'site-nav-toggle';
      toggleBtn.setAttribute('aria-label', 'Toggle menu');
      toggleBtn.setAttribute('aria-expanded', 'false');
      toggleBtn.innerHTML = `
        <svg class="icon-menu" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
        <svg class="icon-close" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" style="display:none"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
      `;
      navMain.appendChild(toggleBtn);
    }

    toggleBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const isExpanded = nav.classList.toggle('is-expanded');
      toggleBtn.setAttribute('aria-expanded', String(isExpanded));
      const iconMenu = toggleBtn.querySelector('.icon-menu');
      const iconClose = toggleBtn.querySelector('.icon-close');
      if (iconMenu && iconClose) {
        iconMenu.style.display = isExpanded ? 'none' : 'block';
        iconClose.style.display = isExpanded ? 'block' : 'none';
      }
    });

    nav.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        if (nav.classList.contains('is-expanded')) {
          nav.classList.remove('is-expanded');
          toggleBtn.setAttribute('aria-expanded', 'false');
          const iconMenu = toggleBtn.querySelector('.icon-menu');
          const iconClose = toggleBtn.querySelector('.icon-close');
          if (iconMenu && iconClose) {
            iconMenu.style.display = 'block';
            iconClose.style.display = 'none';
          }
        }
      });
    });

    document.addEventListener('click', (e) => {
      if (!nav.contains(e.target) && nav.classList.contains('is-expanded')) {
        nav.classList.remove('is-expanded');
        toggleBtn.setAttribute('aria-expanded', 'false');
        const iconMenu = toggleBtn.querySelector('.icon-menu');
        const iconClose = toggleBtn.querySelector('.icon-close');
        if (iconMenu && iconClose) {
          iconMenu.style.display = 'block';
          iconClose.style.display = 'none';
        }
      }
    });
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
    initMobileNav();
    initCookieConsent();
  });
})();

