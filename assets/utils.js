/**
 * SOUNDTEST.PRO — Shared Utilities
 * Single source of truth for escape and locale normalization functions.
 * Used by: soundtest.html, site-auth.js, site-experience.js, lang-flags.js, site-i18n.js
 */
(function () {
  'use strict';

  const SUPPORTED_APP_LANGUAGES = [
    { primary: 'en', value: 'en-US' },
    { primary: 'zh', value: 'zh-CN' },
    { primary: 'es', value: 'es' },
    { primary: 'fr', value: 'fr' },
    { primary: 'de', value: 'de' },
    { primary: 'ja', value: 'ja' },
    { primary: 'ko', value: 'ko' },
    { primary: 'vi', value: 'vi' },
    { primary: 'th', value: 'th' },
  ];

  function escHtml(str) {
    const d = document.createElement('div');
    d.textContent = str;
    return d.innerHTML;
  }

  function supportedLanguageFromPrimary(value) {
    const primary = String(value || '').trim().toLowerCase().split(/[-_]/)[0];
    return SUPPORTED_APP_LANGUAGES.find(language => language.primary === primary)?.value || '';
  }

  function normalizeAppLanguage(value) {
    if (!value) return '';
    // If it's already a full supported locale value (en-US, zh-CN, etc.)
    if (SUPPORTED_APP_LANGUAGES.find(l => l.value === value)) return value;
    // Otherwise try to map from primary (en, zh, etc.) to full locale
    return supportedLanguageFromPrimary(value);
  }

  function isEmptyObject(obj) {
    return obj && typeof obj === 'object' && Object.keys(obj).length === 0;
  }

  function debounce(fn, delay) {
    let timer;
    return function (...args) {
      clearTimeout(timer);
      timer = setTimeout(() => fn.apply(this, args), delay);
    };
  }

  // Expose utilities globally for backward compatibility
  window.__sfUtils = {
    escHtml,
    supportedLanguageFromPrimary,
    normalizeAppLanguage,
    isEmptyObject,
    debounce,
    SUPPORTED_APP_LANGUAGES,
  };

})();