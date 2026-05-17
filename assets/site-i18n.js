(function () {
  'use strict';

  const supportedLocales = ['en', 'zh', 'es', 'fr', 'de', 'ja', 'ko', 'vi', 'th'];
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

  function localePath(locale) {
    const normalized = normalizeLocale(locale) || 'en';
    return `${normalized}/index.html`;
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
      // Browsers can disable storage; language navigation still works.
    }
    return normalized;
  }

  function buildNavLanguageSwitcher() {
    const nav = document.querySelector('.site-nav');
    if (!nav) return null;
    let utility = nav.querySelector('.nav-utility');
    if (!utility) {
      utility = document.createElement('div');
      utility.className = 'nav-utility';
      nav.appendChild(utility);
    }
    let select = utility.querySelector('[data-language-select]');
    if (!select) {
      select = document.createElement('select');
      select.className = 'nav-language';
      select.setAttribute('aria-label', 'Switch language');
      select.setAttribute('data-language-select', '');
      for (const locale of supportedLocales) {
        const option = document.createElement('option');
        option.value = locale;
        option.textContent = locale.toUpperCase();
        select.appendChild(option);
      }
      utility.prepend(select);
    }
    return select;
  }

  function bindSwitchers(locale) {
    const selects = document.querySelectorAll('[data-language-select]');
    const currentList = document.querySelectorAll('[data-language-current]');
    const linkList = document.querySelectorAll('[data-language-link]');
    for (const select of selects) {
      if (select.value !== locale) select.value = locale;
      if (select.dataset.boundLocale === 'true') continue;
      select.dataset.boundLocale = 'true';
      select.addEventListener('change', () => {
        const nextLocale = saveLocale(select.value);
        if (!nextLocale) return;
        window.location.href = localePath(nextLocale);
      });
    }
    for (const current of currentList) {
      current.textContent = locale.toUpperCase();
    }
    for (const link of linkList) {
      link.setAttribute('href', localePath(locale));
    }
  }

  function initLanguageSwitcher() {
    buildNavLanguageSwitcher();
    const navigatorLanguages = navigator.languages?.length ? navigator.languages : [navigator.language];
    const locale = pickLocale({ savedLocale: readSavedLocale(), navigatorLanguages });
    bindSwitchers(locale);
  }

  window.SoundtestI18n = {
    supportedLocales,
    storageKey,
    normalizeLocale,
    pickLocale,
    localePath,
    initLanguageSwitcher,
  };

  if (typeof document !== 'undefined') {
    document.addEventListener('DOMContentLoaded', initLanguageSwitcher);
  }
})();
