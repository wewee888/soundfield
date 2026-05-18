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
        const label = pill.getAttribute('data-recent-label') || '';
        const path = pill.getAttribute('data-recent-path') || '';
        triggerSearch(label, path);
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

  function runSimulatedRun(label, path) {
    const live = document.querySelector('[data-live-card]');
    if (!live) return;
    const steps = live.querySelectorAll('.live-step');
    if (!steps.length) return;

    live.setAttribute('data-open', 'true');
    steps.forEach((step) => step.setAttribute('data-state', 'idle'));

    const sequence = Array.from(steps);
    let current = 0;
    const tickOnce = () => {
      if (current > 0) sequence[current - 1].setAttribute('data-state', 'done');
      if (current >= sequence.length) {
        finish();
        return;
      }
      sequence[current].setAttribute('data-state', 'active');
      current += 1;
    };
    const finish = () => {
      clearInterval(timer);
      writeRecent({ label, path });
      const cta = live.querySelector('[data-live-cta]');
      if (cta) cta.hidden = false;
    };

    tickOnce();
    const timer = setInterval(tickOnce, 950);
  }

  function triggerSearch(label, path = 'soundtest.html') {
    const input = document.querySelector('[data-hero-input]');
    if (input) input.value = label;
    runSimulatedRun(label, path);
    const live = document.querySelector('[data-live-card]');
    if (live) live.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  function initHero() {
    const form = document.querySelector('[data-hero-form]');
    if (!form) return;

    const input = form.querySelector('[data-hero-input]');

    form.addEventListener('submit', (event) => {
      event.preventDefault();
      const value = (input?.value || '').trim();
      if (!value) {
        input?.focus();
        return;
      }
      triggerSearch(value, 'soundtest.html');
    });

    document.querySelectorAll('[data-chip]').forEach((chip) => {
      chip.addEventListener('click', () => {
        const label = chip.getAttribute('data-chip') || chip.textContent.trim();
        const path = chip.getAttribute('data-chip-path') || 'soundtest.html';
        triggerSearch(label, path);
      });
    });

    const cta = document.querySelector('[data-live-cta]');
    if (cta) {
      cta.addEventListener('click', () => {
        const target = cta.getAttribute('data-target') || 'soundtest.html';
        window.location.href = target;
      });
    }
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
    initCookieConsent();
  });
})();
