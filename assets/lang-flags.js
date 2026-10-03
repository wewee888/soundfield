(function () {
  'use strict';

  const FLAG_ASSET_BASE = (() => {
    try {
      const src = document.currentScript?.src || (typeof document !== 'undefined' && document.querySelector('script[src*="lang-flags"]')?.src);
      if (src) return new URL('flags/', src);
    } catch (_) {
      // ignore
    }
    return null;
  })();

  const FLAG_ISO = {
    en: 'us',
    zh: 'cn',
    es: 'es',
    fr: 'fr',
    de: 'de',
    ja: 'jp',
    ko: 'kr',
    vi: 'vn',
    th: 'th',
  };

  const LABELS = {
    en: 'English',
    zh: '中文',
    es: 'Español',
    fr: 'Français',
    de: 'Deutsch',
    ja: '日本語',
    ko: '한국어',
    vi: 'Tiếng Việt',
    th: 'ไทย',
  };

  function primaryFromValue(value) {
    if (!value) return 'en';
    const raw = String(value).trim().toLowerCase().split(/[-_]/)[0];
    return FLAG_ISO[raw] ? raw : 'en';
  }

  function flagUrl(primary) {
    const iso = FLAG_ISO[primary] || primary || 'us';
    if (FLAG_ASSET_BASE) {
      return new URL(`${iso}.png`, FLAG_ASSET_BASE).href;
    }
    return `/assets/flags/${iso}.png`;
  }

  function closeAllPickers(except) {
    document.querySelectorAll('.lang-picker').forEach((node) => {
      if (node !== except) {
        node.classList.remove('is-open');
        const btn = node.querySelector('.lang-picker-btn');
        if (btn) btn.setAttribute('aria-expanded', 'false');
        const menu = node.querySelector('.lang-picker-menu');
        if (menu) {
          menu.hidden = true;
          menu.style.display = 'none';
        }
      }
    });
  }

  function renderPicker(config) {
    const {
      mount,
      value,
      options,
      onChange,
      ariaLabel = 'Switch language',
    } = config;
    if (!mount) return null;

    const currentPrimary = primaryFromValue(value);
    const currentLabel = options.find((o) => o.value === value)?.label || LABELS[currentPrimary] || value;

    mount.classList.add('lang-picker');

    const existingBtn = mount.querySelector('.lang-picker-btn');
    const existingMenu = mount.querySelector('.lang-picker-menu');
    if (existingBtn && existingMenu) {
      const flag = existingBtn.querySelector('.lang-picker-flag');
      if (flag) flag.src = flagUrl(currentPrimary);
      const label = existingBtn.querySelector('.lang-picker-label');
      if (label) label.textContent = currentLabel;
      existingBtn.setAttribute('aria-label', ariaLabel);
      existingBtn.setAttribute('aria-expanded', 'false');
      mount.classList.remove('is-open');
      existingMenu.hidden = true;
      existingMenu.style.display = 'none';

      existingMenu.querySelectorAll('.lang-picker-option').forEach((optEl) => {
        if (optEl.dataset.value === value) {
          optEl.setAttribute('aria-selected', 'true');
        } else {
          optEl.removeAttribute('aria-selected');
        }
      });
      return mount;
    }

    mount.classList.remove('is-open');
    mount.innerHTML = '';

    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'lang-picker-btn';
    btn.setAttribute('aria-haspopup', 'listbox');
    btn.setAttribute('aria-expanded', 'false');
    btn.setAttribute('aria-label', ariaLabel);

    const flag = document.createElement('img');
    flag.className = 'lang-picker-flag';
    flag.src = flagUrl(currentPrimary);
    flag.alt = '';
    flag.width = 20;
    flag.height = 15;
    flag.loading = 'lazy';
    flag.decoding = 'async';

    const label = document.createElement('span');
    label.className = 'lang-picker-label';
    label.textContent = currentLabel;

    const chev = document.createElement('span');
    chev.className = 'lang-picker-chevron';
    chev.setAttribute('aria-hidden', 'true');
    chev.textContent = '▾';

    btn.append(flag, label, chev);

    const menu = document.createElement('ul');
    menu.className = 'lang-picker-menu';
    menu.setAttribute('role', 'listbox');
    menu.hidden = true;
    menu.style.display = 'none';

    options.forEach((opt) => {
      const primary = opt.primary || primaryFromValue(opt.value);
      const item = document.createElement('li');
      item.className = 'lang-picker-option';
      item.setAttribute('role', 'option');
      item.dataset.value = opt.value;
      if (opt.value === value) item.setAttribute('aria-selected', 'true');

      const img = document.createElement('img');
      img.className = 'lang-picker-flag';
      img.src = flagUrl(primary);
      img.alt = '';
      img.width = 20;
      img.height = 15;
      img.loading = 'lazy';

      const text = document.createElement('span');
      text.textContent = opt.label || LABELS[primary] || opt.value;

      item.append(img, text);
      item.addEventListener('click', (event) => {
        event.stopPropagation();
        event.preventDefault();
        mount.classList.remove('is-open');
        btn.setAttribute('aria-expanded', 'false');
        menu.hidden = true;
        menu.style.display = 'none';
        closeAllPickers(null);
        if (typeof onChange === 'function') {
          onChange(opt.value);
        }
      });
      menu.appendChild(item);
    });

    btn.addEventListener('click', (event) => {
      event.stopPropagation();
      event.preventDefault();
      const willOpen = !mount.classList.contains('is-open');
      if (willOpen) {
        closeAllPickers(mount);
        mount.classList.add('is-open');
        btn.setAttribute('aria-expanded', 'true');
        menu.hidden = false;
        menu.style.display = 'block';
      } else {
        mount.classList.remove('is-open');
        btn.setAttribute('aria-expanded', 'false');
        menu.hidden = true;
        menu.style.display = 'none';
      }
    });

    mount.append(btn, menu);
    return mount;
  }

  if (typeof document !== 'undefined') {
    const handleDismiss = (event) => {
      if (!event.target?.closest || !event.target.closest('.lang-picker')) {
        closeAllPickers(null);
      }
    };
    document.addEventListener('click', handleDismiss, true);
    document.addEventListener('pointerdown', handleDismiss, true);
    document.addEventListener('touchstart', handleDismiss, { capture: true, passive: true });
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' || event.key === 'Esc') {
        closeAllPickers(null);
      }
    });
  }

  window.LangFlags = {
    FLAG_ISO,
    LABELS,
    primaryFromValue,
    flagUrl,
    renderPicker,
    closeAll: () => closeAllPickers(null),
  };
})();
