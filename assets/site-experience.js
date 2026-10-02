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
    neighbor: {
      en: {
        title: 'Neighbor Noise Evidence Template',
        desc: 'Optimized for ceiling footsteps, TV/music, pet disturbance, and HVAC vibrations.',
        day: '≤ 55 dB',
        night: '≤ 45 dB',
        metric: 'LAeq + L10',
        tamper: 'GPS + SHA-256',
        s1: 'Scenario acoustic profile matched',
        s2: 'Fast/Slow response & A-weighting initialized',
        s3: 'Zero-cloud local processing verified',
        s4: 'Ready — start recording to capture court-admissible facts',
        cta: 'Launch Evidence Recorder',
        guide: 'Case Guide'
      },
      zh: {
        title: '邻里与公寓噪音取证模板',
        desc: '针对楼上脚步声、低音炮扰民、宠物吠叫与管道空调震动优化。',
        day: '≤ 55 dB',
        night: '≤ 45 dB',
        metric: 'LAeq 等效声级',
        tamper: 'GPS + SHA-256',
        s1: '已匹配居住区生活噪音取证规范',
        s2: '初始化 A 计权滤波与快速动态响应',
        s3: '纯本地零云端存储已验证',
        s4: '就绪 — 启动取证以生成物业/法务标准底稿',
        cta: '启动邻里噪音取证',
        guide: '邻里维权指南'
      },
      path: 'neighbor-noise-evidence.html'
    },
    construction: {
      en: {
        title: 'Construction & Renovation Monitoring',
        desc: 'Detects impact hammer bursts, drilling, and unauthorized off-hours work.',
        day: '≤ 70 dB',
        night: '≤ 55 dB',
        metric: 'Lmax + Impulse Peak',
        tamper: 'GPS + SHA-256',
        s1: 'Construction regulatory threshold loaded',
        s2: 'Impulse shockwave detection enabled',
        s3: 'High-SPL safety range auto-compensated',
        s4: 'Ready — monitor work-hour compliance',
        cta: 'Launch Construction Monitor',
        guide: 'Construction Guide'
      },
      zh: {
        title: '装修与工程施工噪音监测模板',
        desc: '实时抓取电钻打孔、砸墙冲击瞬态峰值及违规超时施工行为。',
        day: '≤ 70 dB',
        night: '≤ 55 dB',
        metric: 'Lmax 瞬态冲击峰值',
        tamper: 'GPS + SHA-256',
        s1: '已加载建筑施工场界噪声限值规范',
        s2: '已开启突发冲击声脉冲检测模式',
        s3: '高声压级安全范围自动补偿',
        s4: '就绪 — 监测违规超时与超标施工',
        cta: '启动施工噪音监测',
        guide: '施工维权指南'
      },
      path: 'construction-noise-monitoring.html'
    },
    street: {
      en: {
        title: 'Bar, Shop & Street Disturbance',
        desc: '1/3 octave low-frequency bass analysis for outdoor seating and exhaust fans.',
        day: '≤ 60 dB',
        night: '≤ 50 dB',
        metric: '1/3 Octave Bass',
        tamper: 'GPS + SHA-256',
        s1: 'Commercial boundary standard loaded',
        s2: '1/3 octave low-frequency filters engaged',
        s3: 'Continuous FFT spectrum initialized',
        s4: 'Ready — record street & venue disturbance',
        cta: 'Launch Street Monitor',
        guide: 'Street Guide'
      },
      zh: {
        title: '酒吧商铺与街道外排扰民模板',
        desc: '专门针对低频低音炮震动、室外排档喧哗及大型排风外机。',
        day: '≤ 60 dB',
        night: '≤ 50 dB',
        metric: '1/3 倍频程低频',
        tamper: 'GPS + SHA-256',
        s1: '已加载商业区边界噪音排放标准',
        s2: '已启动 1/3 倍频程低频共振滤波',
        s3: '持续 FFT 频谱与时间序列初始化完成',
        s4: '就绪 — 锁定店铺与街道扰民音源',
        cta: '启动酒吧街道取证',
        guide: '商业扰民指南'
      },
      path: 'bar-street-disturbance.html'
    },
    rental: {
      en: {
        title: 'Rental Dispute & Lease Breach Packet',
        desc: 'Continuous multi-day acoustic log for landlord negotiation or small-claims court.',
        day: '≤ 55 dB',
        night: '≤ 45 dB',
        metric: 'LAeq (L50/L90)',
        tamper: 'GPS + SHA-256',
        s1: 'Habitability & quiet enjoyment standard set',
        s2: 'Multi-session cumulative statistics prepared',
        s3: 'Cryptographic SHA-256 chain ready',
        s4: 'Ready — build legally structured rent dispute dossier',
        cta: 'Launch Rental Dispute Packet',
        guide: 'Rental Guide'
      },
      zh: {
        title: '租房纠纷与退租退押维权举证包',
        desc: '为房东协调、中介协商或小额法庭提供多日累计客观声学事实底稿。',
        day: '≤ 55 dB',
        night: '≤ 45 dB',
        metric: '统计声级 (L50/L90)',
        tamper: 'GPS + SHA-256',
        s1: '已加载居住安宁与租赁合同维权标准',
        s2: '长周期多时段超标统计已就绪',
        s3: 'SHA-256 防伪哈希证据链已锁定',
        s4: '就绪 — 建立完整的租房争议退租底稿',
        cta: '启动租房维权取证',
        guide: '租房维权指南'
      },
      path: 'rental-dispute-evidence.html'
    }
  };

  function initScenarioWorkbench() {
    const wb = document.getElementById('scenario-workbench');
    if (!wb) return;

    const isZh = document.documentElement.lang.startsWith('zh') || location.pathname.includes('/zh/');
    const langKey = isZh ? 'zh' : 'en';

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

