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
    // Delegate to shared utils if available
    if (window.__sfUtils && window.__sfUtils.supportedLanguageFromPrimary) {
      const result = window.__sfUtils.supportedLanguageFromPrimary(value);
      return result ? result.primary : '';
    }
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
    const navigatorLanguages = navigator.languages?.length ? navigator.languages : [navigator.language];
    return pickLocale({ savedLocale: readSavedLocale(), navigatorLanguages });
  }

  function localePath(locale) {
    const normalized = normalizeLocale(locale) || 'en';
    const origin = (typeof window !== 'undefined' && window.location && window.location.origin)
      ? window.location.origin
      : '';
    return `${origin}/${normalized}/index.html`;
  }

  function readSavedLocale() {
    try {
      return window.localStorage?.getItem(storageKey) || '';
    } catch (error) {
      return '';
    }
  }

  function saveLocale(locale) {
    const normalized = normalizeLocale(locale);
    if (!normalized) return '';
    try {
      window.localStorage?.setItem(storageKey, normalized);
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
    const locale = detectPageLocale();
    saveLocale(locale);
    const path = window.location.pathname;
    const onRoot = path === '/' || /^\/(?:index\.html?)?$/i.test(path);
    if (onRoot && locale !== 'en') {
      window.location.replace(localePath(locale));
      return;
    }
    buildNavLanguageSwitcher(locale);
    enhanceFooterFlags();
  }

  window.SoundtestI18n = {
    supportedLocales,
    localeLabels,
    storageKey,
    normalizeLocale,
    pickLocale,
    detectPageLocale,
    localePath,
    initLanguageSwitcher,
  };

  if (typeof document !== 'undefined') {
    document.addEventListener('DOMContentLoaded', initLanguageSwitcher);
  }
})();
