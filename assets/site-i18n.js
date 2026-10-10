(function () {
  'use strict';

  const supportedLocales = (typeof window !== 'undefined' && window.__sfUtils)
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
    if (typeof navigator === 'undefined') return 'en';
    const navigatorLanguages = navigator.languages?.length ? navigator.languages : [navigator.language];
    return pickLocale({ savedLocale: readSavedLocale(), navigatorLanguages });
  }

  function detectPageLocale(customPath) {
    try {
      const path = typeof customPath === 'string'
        ? customPath
        : (typeof window !== 'undefined' ? window.location.pathname : '/');
      const segments = path.split('/').filter(Boolean);
      for (let i = segments.length - 1; i >= 0; i -= 1) {
        const segment = segments[i].replace(/\.html$/i, '');
        const normalized = normalizeLocale(segment);
        if (normalized) return normalized;
      }
      if (typeof window !== 'undefined' && window.location.search) {
        const sp = new URLSearchParams(window.location.search);
        const searchLocale = normalizeLocale(sp.get('lang') || sp.get('locale'));
        if (searchLocale) return searchLocale;
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

  function resolveTargetLocaleUrl(targetLocale, currentPath, currentSearch, currentHash) {
    const next = normalizeLocale(targetLocale) || 'en';

    const pathStr = typeof currentPath === 'string'
      ? currentPath
      : (typeof window !== 'undefined' ? window.location.pathname : '/');

    const searchStr = typeof currentSearch === 'string'
      ? currentSearch
      : (typeof window !== 'undefined' ? window.location.search : '');

    const hashStr = typeof currentHash === 'string'
      ? currentHash
      : (typeof window !== 'undefined' ? window.location.hash : '');

    const formattedHash = hashStr ? (hashStr.startsWith('#') ? hashStr : `#${hashStr}`) : '';
    let formattedSearch = searchStr ? (searchStr.startsWith('?') ? searchStr : `?${searchStr}`) : '';

    let cleanPath = (pathStr || '/').trim();
    if (!cleanPath.startsWith('/')) cleanPath = '/' + cleanPath;

    // 1. Core Tool App: soundtest.html or app.html
    if (/^\/(?:soundtest(?:\.html)?|app(?:\.html)?)$/i.test(cleanPath)) {
      const sp = new URLSearchParams(formattedSearch.replace(/^\?/, ''));
      sp.set('lang', next);
      const qs = sp.toString() ? `?${sp.toString()}` : '';
      return `/soundtest.html${qs}${formattedHash}`;
    }

    // 2. Admin dashboard
    if (/^\/admin(?:\.html)?$/i.test(cleanPath)) {
      return `/admin.html${formattedSearch}${formattedHash}`;
    }

    const segments = cleanPath.split('/').filter(Boolean);

    // 3. Use-cases: /use-cases/...
    if (segments.length > 0 && segments[0].toLowerCase() === 'use-cases') {
      let sub = segments.slice(1);
      if (sub.length > 0 && supportedLocales.includes(normalizeLocale(sub[0]))) {
        sub = sub.slice(1);
      }
      const slug = sub[0] || '';
      const isIndex = !slug || /^(?:index(?:\.html)?)?$/i.test(slug);

      if (isIndex) {
        return next === 'en'
          ? `/use-cases/${formattedSearch}${formattedHash}`
          : `/use-cases/${next}/${formattedSearch}${formattedHash}`;
      }

      const file = slug.endsWith('.html') ? slug : `${slug}.html`;
      return next === 'en'
        ? `/use-cases/${file}${formattedSearch}${formattedHash}`
        : `/use-cases/${next}/${file}${formattedSearch}${formattedHash}`;
    }

    // 4. Variant landing pages: /a/, /b/, /c/
    if (segments.length > 0 && ['a', 'b', 'c'].includes(segments[0].toLowerCase())) {
      const variant = segments[0].toLowerCase();
      if (next === 'en') {
        return `/${variant}/${formattedSearch}${formattedHash}`;
      }
      return `/${next}/${formattedSearch}${formattedHash}`;
    }

    // 5. Standard pages & Homepage
    let fileSegments = [...segments];
    if (fileSegments.length > 0 && supportedLocales.includes(normalizeLocale(fileSegments[0]))) {
      fileSegments = fileSegments.slice(1);
    }

    const page = fileSegments.join('/');
    const isHomepage = !page || /^(?:index(?:\.html)?)?$/i.test(page);

    if (isHomepage) {
      return next === 'en'
        ? `/${formattedSearch}${formattedHash}`
        : `/${next}/${formattedSearch}${formattedHash}`;
    }

    let fileName = page;
    if (!fileName.includes('.')) {
      fileName = `${fileName}.html`;
    }

    const specialRootZhPages = ['about.html', 'terms.html'];
    if (specialRootZhPages.includes(fileName.toLowerCase())) {
      if (next === 'zh') {
        return `/zh/${fileName}${formattedSearch}${formattedHash}`;
      }
      return `/${fileName}${formattedSearch}${formattedHash}`;
    }

    return next === 'en'
      ? `/${fileName}${formattedSearch}${formattedHash}`
      : `/${next}/${fileName}${formattedSearch}${formattedHash}`;
  }

  function readCookie(name) {
    if (typeof document === 'undefined') return '';
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
      if (typeof window !== 'undefined' && window.localStorage) {
        return normalizeLocale(window.localStorage.getItem(storageKey)) || '';
      }
      return '';
    } catch (error) {
      return '';
    }
  }

  function saveLocale(locale) {
    const normalized = normalizeLocale(locale);
    if (!normalized) return '';
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.setItem(storageKey, normalized);
        const appLang = normalized === 'zh' ? 'zh-CN' : (normalized === 'en' ? 'en-US' : normalized);
        window.localStorage.setItem('sf_language', appLang);
      }
      if (typeof document !== 'undefined') {
        document.cookie = 'sf_locale=' + normalized + '; Path=/; Max-Age=31536000; SameSite=Lax';
      }
    } catch (error) {
      // ignore
    }
    return normalized;
  }

  // Proactively persist locale immediately upon script load if on a localized path
  try {
    if (typeof window !== 'undefined') {
      const imm = detectPageLocale();
      if (imm && imm !== 'en') {
        saveLocale(imm);
      }
    }
  } catch (_) {}

  function enhanceSoundtestLinks(locale) {
    if (typeof document === 'undefined') return;
    const targetLocale = locale || detectPageLocale();
    if (!targetLocale || targetLocale === 'en') return;

    document.querySelectorAll('a[href*="soundtest"]').forEach((link) => {
      try {
        const href = link.getAttribute('href');
        if (!href) return;
        const hashIdx = href.indexOf('#');
        const baseHref = hashIdx !== -1 ? href.slice(0, hashIdx) : href;
        const hash = hashIdx !== -1 ? href.slice(hashIdx) : '';
        const [cleanPath, queryStr] = baseHref.split('?');
        const params = new URLSearchParams(queryStr || '');
        params.set('lang', targetLocale);
        params.delete('locale');
        link.setAttribute('href', `${cleanPath}?${params.toString()}${hash}`);
      } catch (_) {}
    });
  }

  function enhanceLocaleLinks(locale) {
    if (typeof document === 'undefined') return;
    const targetLocale = locale || detectPageLocale();
    if (!targetLocale || targetLocale === 'en') return;

    document.querySelectorAll('a.brand, a.app-brand, .site-nav a.brand').forEach((link) => {
      try {
        const href = link.getAttribute('href') || '';
        if (href === '/' || href === '/index.html' || href === 'index.html' || href.endsWith('/index.html')) {
          link.setAttribute('href', `/${targetLocale}/`);
        }
      } catch (_) {}
    });

    const subpages = [
      'samples.html', 'accuracy.html', 'standards.html', 'noise-levels.html',
      'auth.html', 'about.html', 'terms.html', 'privacy.html',
      'disclaimer.html', 'refund.html', 'download.html', 'changelog.html',
      'camera.html'
    ];
    document.querySelectorAll('a[href]').forEach((link) => {
      try {
        const rawHref = link.getAttribute('href') || '';
        if (rawHref.startsWith('/') && !rawHref.startsWith('//')) {
          const [cleanPart, queryPart] = rawHref.split('?');
          const [clean, hashPart] = cleanPart.split('#');
          const stripped = clean.replace(/^\//, '');
          if (subpages.includes(stripped)) {
            const extra = (queryPart ? `?${queryPart}` : '') + (hashPart ? `#${hashPart}` : '');
            link.setAttribute('href', `/${targetLocale}/${stripped}${extra}`);
          }
        }
      } catch (_) {}
    });
  }

  function siteLocaleOptions() {
    return supportedLocales.map((locale) => ({
      value: locale,
      primary: locale,
      label: localeLabels[locale]?.name || locale.toUpperCase(),
    }));
  }

  function enhanceFooterFlags() {
    if (typeof document === 'undefined' || !window.LangFlags) return;
    document.querySelectorAll('.footer-flag').forEach((link) => {
      const href = link.getAttribute('href') || '';
      const match = href.match(/(?:^|\/|\.\.\/)(en|zh|es|fr|de|ja|ko|vi|th)\//i);
      if (!match) return;
      const locale = match[1].toLowerCase();
      const label = localeLabels[locale];
      if (!label) return;
      link.setAttribute('title', label.name);
      link.setAttribute('aria-label', label.name);

      const targetUrl = resolveTargetLocaleUrl(locale);
      link.setAttribute('href', targetUrl);
      link.addEventListener('click', (e) => {
        e.preventDefault();
        saveLocale(locale);
        window.location.href = targetUrl;
      });

      let img = link.querySelector('.footer-flag-img');
      if (!img) {
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

  function enhanceFooterLangLinks() {
    if (typeof document === 'undefined') return;
    document.querySelectorAll('.footer-col a').forEach((link) => {
      const href = link.getAttribute('href') || '';
      const match = href.match(/(?:^|\/|\.\.\/)(en|zh|es|fr|de|ja|ko|vi|th)\/(?:index\.html?)?$/i);
      let locale = match ? match[1].toLowerCase() : null;
      if (!locale && (href === 'index.html' || href === './index.html')) {
        const pageLoc = detectPageLocale();
        if (pageLoc && pageLoc !== 'en') {
          locale = pageLoc;
        }
      }
      if (locale && supportedLocales.includes(locale)) {
        const targetUrl = resolveTargetLocaleUrl(locale);
        link.setAttribute('href', targetUrl);
        link.addEventListener('click', (e) => {
          e.preventDefault();
          saveLocale(locale);
          window.location.href = targetUrl;
        });
      }
    });
  }

  function buildNavLanguageSwitcher(locale) {
    if (typeof document === 'undefined') return null;
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
        const targetUrl = resolveTargetLocaleUrl(normalized);
        if (window.location.pathname.endsWith('soundtest.html') && typeof window.setAppLanguage === 'function') {
          window.setAppLanguage(normalized, { persist: true, notify: true });
          try {
            const u = new URL(window.location.href);
            u.searchParams.set('lang', normalized);
            window.history.replaceState(null, '', u.toString());
          } catch (_) {}
          return;
        }
        window.location.href = targetUrl;
      },
    });
    return mount;
  }

  function initLanguageSwitcher() {
    if (typeof window === 'undefined') return;
    const pageLocale = detectPageLocale();
    if (pageLocale && pageLocale !== 'en') {
      saveLocale(pageLocale);
    }
    const path = window.location.pathname;
    const onRoot = path === '/' || /^\/(?:index\.html?)?$/i.test(path) || /^\/[a-c]\/(?:index\.html?)?$/i.test(path);
    const onRootAuth = /^\/(?:auth(?:\.html)?\/?)$/i.test(path);
    if (onRoot || onRootAuth) {
      const userLocale = detectUserLocale();
      if (userLocale && userLocale !== 'en') {
        saveLocale(userLocale);
        const target = onRootAuth ? `/${userLocale}/auth.html${window.location.search}` : localePath(userLocale);
        window.location.replace(target);
        return;
      }
    }
    buildNavLanguageSwitcher(pageLocale);
    enhanceFooterFlags();
    enhanceFooterLangLinks();
    enhanceSoundtestLinks(pageLocale);
    enhanceLocaleLinks(pageLocale);
  }

  const exported = {
    supportedLocales,
    localeLabels,
    storageKey,
    normalizeLocale,
    pickLocale,
    detectPageLocale,
    detectUserLocale,
    localePath,
    resolveTargetLocaleUrl,
    initLanguageSwitcher,
    enhanceFooterFlags,
    enhanceFooterLangLinks,
    enhanceSoundtestLinks,
    enhanceLocaleLinks,
    saveLocale,
  };

  if (typeof window !== 'undefined') {
    window.SoundtestI18n = exported;
  }
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = exported;
  }

  if (typeof document !== 'undefined') {
    document.addEventListener('DOMContentLoaded', initLanguageSwitcher);
  }
})();
