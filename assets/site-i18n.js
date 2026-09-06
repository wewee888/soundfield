(function () {
  'use strict';

  const supportedLocales = window.__sfUtils
    ? window.__sfUtils.SUPPORTED_APP_LANGUAGES.map(l => l.primary)
    : ['en', 'zh', 'es', 'fr', 'de', 'ja', 'ko', 'vi', 'th'];
  const localeLabels = {
    en: { name: 'English' },
    zh: { name: '中文' },
    es: { name: 'Español' },
    fr: { name: 'Français' },
    de: { name: 'Deutsch' },
    ja: { name: '日本語' },
    ko: { name: '한국어' },
    vi: { name: 'Tiếng Việt' },
    th: { name: 'ไทย' },
  };
  const storageKey = 'soundtest_locale';

  function normalizeLocale(value) {
    if (!value || typeof value !== 'string') return '';
    const primary = value.trim().toLowerCase().split(/[-_]/)[0];
    return supportedLocales.includes(primary) ? primary : '';
  }

  function pickLocale(input = {}) {
    const saved = normalizeLocale(input.savedLocale);
    if (saved) return saved;
    const languages = Array.isArray(input.navigatorLanguages) ? input.navigatorLanguages : [];
    for (const language of languages) {
      const normalized = normalizeLocale(language);
      if (normalized) return normalized;
    }
    return 'en';
  }

  function detectUserLocale() {
    const navigatorLanguages = navigator.languages?.length ? navigator.languages : [navigator.language];
    return pickLocale({ savedLocale: readSavedLocale(), navigatorLanguages });
  }

  function detectPageLocale() {
    try {
      const segments = window.location.pathname.split('/').filter(Boolean);
      for (let i = segments.length - 1; i >= 0; i -= 1) {
        const segment = segments[i].replace(/\.html$/i, '');
        const normalized = normalizeLocale(segment);
        if (normalized) return normalized;
      }
    } catch (_) {
      // ignore
    }
    return 'en'; // Default to English if no locale is explicitly in the URL
  }

  function localePath(locale) {
    const normalized = normalizeLocale(locale) || 'en';
    return `/${normalized}/`;
  }

  function readCookie(name) {
    try {
      const match = document.cookie?.match(new RegExp('(?:^|; )' + name + '=([^;]*)'));
      return match ? decodeURIComponent(match[1]) : '';
    } catch (_) {
      return '';
    }
  }

  function readSavedLocale() {
    try {
      const cookieLocale = normalizeLocale(readCookie('sf_locale'));
      if (cookieLocale) return cookieLocale;
      return normalizeLocale(window.localStorage?.getItem(storageKey)) || '';
    } catch (error) {
      return '';
    }
  }

  function saveLocale(locale) {
    const normalized = normalizeLocale(locale);
    if (!normalized) return '';
    try {
      window.localStorage?.setItem(storageKey, normalized);
      document.cookie = 'sf_locale=' + normalized + '; Path=/; Max-Age=31536000; SameSite=Lax';
    } catch (error) {
      // ignore
    }
    return normalized;
  }

  function siteLocaleOptions() {
    return supportedLocales.map((locale) => ({
      value: locale,
      primary: locale,
      label: localeLabels[locale]?.name || locale.toUpperCase(),
    }));
  }

  function enhanceFooterFlags() {
    if (!window.LangFlags) return;
    document.querySelectorAll('.footer-flag').forEach((link) => {
      const href = link.getAttribute('href') || '';
      const match = href.match(/(?:^|\/)(en|zh|es|fr|de|ja|ko|vi|th)\//);
      if (!match) return;
      const locale = match[1];
      const label = localeLabels[locale];
      if (!label) return;
      link.setAttribute('title', label.name);
      link.setAttribute('aria-label', label.name);
      link.addEventListener('click', () => {
        saveLocale(locale);
      });
      let img = link.querySelector('.footer-flag-img');
      if (!img) {
        const emoji = link.textContent.trim().slice(0, 4);
        link.textContent = '';
        img = document.createElement('img');
        img.className = 'footer-flag-img';
        img.width = 22;
        img.height = 16;
        img.alt = '';
        link.appendChild(img);
        const text = document.createElement('span');
        text.className = 'footer-flag-text';
        text.textContent = locale.toUpperCase() === 'ZH' ? '中' : locale.toUpperCase();
        link.appendChild(text);
      }
      img.src = LangFlags.flagUrl(locale);
    });
  }

  function buildNavLanguageSwitcher(locale) {
    const nav = document.querySelector('.site-nav');
    if (!nav || !window.LangFlags) return null;
    let utility = nav.querySelector('.nav-utility');
    if (!utility) {
      utility = document.createElement('div');
      utility.className = 'nav-utility';
      nav.appendChild(utility);
    }

    let mount = utility.querySelector('[data-lang-picker-mount]');
    if (!mount) {
      mount = document.createElement('div');
      mount.setAttribute('data-lang-picker-mount', '');
      const upgrade = utility.querySelector('.nav-upgrade');
      if (upgrade) utility.insertBefore(mount, upgrade);
      else utility.prepend(mount);
    }

    LangFlags.renderPicker({
      mount,
      value: locale,
      options: siteLocaleOptions(),
      ariaLabel: 'Switch language / 切换语言',
      onChange: (next) => {
        const normalized = saveLocale(next);
        if (!normalized) return;
        window.location.href = localePath(normalized);
      },
    });
    return mount;
  }

  function initLanguageSwitcher() {
    const pageLocale = detectPageLocale();
    if (pageLocale && pageLocale !== 'en') {
      saveLocale(pageLocale);
    }
    const path = window.location.pathname;
    const onRoot = path === '/' || /^\/(?:index\.html?)?$/i.test(path) || /^\/[a-c]\/(?:index\.html?)?$/i.test(path);
    if (onRoot) {
      const userLocale = detectUserLocale();
      if (userLocale && userLocale !== 'en') {
        saveLocale(userLocale);
        window.location.replace(localePath(userLocale));
        return;
      }
    }
    buildNavLanguageSwitcher(pageLocale);
    enhanceFooterFlags();
  }

  window.SoundtestI18n = {
    supportedLocales,
    localeLabels,
    storageKey,
    normalizeLocale,
    pickLocale,
    detectPageLocale,
    detectUserLocale,
    localePath,
    initLanguageSwitcher,
  };

  if (typeof document !== 'undefined') {
    document.addEventListener('DOMContentLoaded', initLanguageSwitcher);
  }
})();
