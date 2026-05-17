(function () {
  'use strict';

  const supportedLocales = ['en', 'es', 'fr', 'de', 'ja', 'ko', 'vi', 'th'];
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

  function initLanguageSwitcher() {
    const select = document.querySelector('[data-language-select]');
    const current = document.querySelector('[data-language-current]');
    const link = document.querySelector('[data-language-link]');
    if (!select) return;

    const navigatorLanguages = navigator.languages?.length ? navigator.languages : [navigator.language];
    const locale = pickLocale({ savedLocale: readSavedLocale(), navigatorLanguages });
    select.value = locale;
    if (current) current.textContent = locale.toUpperCase();
    if (link) link.setAttribute('href', localePath(locale));

    select.addEventListener('change', () => {
      const nextLocale = saveLocale(select.value);
      if (!nextLocale) return;
      window.location.href = localePath(nextLocale);
    });
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
