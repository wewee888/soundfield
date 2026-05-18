(function () {
  'use strict';

  const FLAG_ASSET_BASE = (() => {
    try {
      const src = document.currentScript?.src;
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
    return String(value).trim().toLowerCase().split(/[-_]/)[0];
  }

  function flagUrl(primary) {
    const iso = FLAG_ISO[primary] || primary || 'us';
    if (FLAG_ASSET_BASE) {
      return new URL(`${iso}.png`, FLAG_ASSET_BASE).href;
    }
    return `assets/flags/${iso}.png`;
  }

  function closeAllPickers(except) {
    document.querySelectorAll('.lang-picker.is-open').forEach((node) => {
      if (node !== except) {
        node.classList.remove('is-open');
        const btn = node.querySelector('.lang-picker-btn');
        if (btn) btn.setAttribute('aria-expanded', 'false');
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
      item.addEventListener('click', () => {
        if (opt.value === value) {
          mount.classList.remove('is-open');
          btn.setAttribute('aria-expanded', 'false');
          menu.hidden = true;
          return;
        }
        onChange(opt.value);
      });
      menu.appendChild(item);
    });

    btn.addEventListener('click', (event) => {
      event.stopPropagation();
      const open = mount.classList.toggle('is-open');
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
      menu.hidden = !open;
      if (open) closeAllPickers(mount);
    });

    mount.append(btn, menu);
    return mount;
  }

  document.addEventListener('click', () => closeAllPickers(null));
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') closeAllPickers(null);
  });

  window.LangFlags = {
    FLAG_ISO,
    LABELS,
    primaryFromValue,
    flagUrl,
    renderPicker,
  };
})();
