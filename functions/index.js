// Override static /index.html on Cloudflare Pages.
// Intelligently routes visitors by:
// 1. Explicit query override (?locale= or ?lang=)
// 2. Explicit cookie preference (sf_locale)
// 3. IP geolocation country code (cf-ipcountry header from Cloudflare)
// 4. Browser language preference (Accept-Language header)
// 5. Fallback to English (with A/B variant assignment)

const SUPPORTED_LOCALES = ['en', 'zh', 'es', 'fr', 'de', 'ja', 'ko', 'vi', 'th'];
const VARIANTS = ['a', 'b', 'c'];

// ISO 3166-1 alpha-2 country code to supported site locale
const COUNTRY_TO_LOCALE = {
  // Chinese
  CN: 'zh',
  TW: 'zh',
  HK: 'zh',
  MO: 'zh',
  SG: 'zh',

  // Japanese
  JP: 'ja',

  // Korean
  KR: 'ko',

  // Spanish (Spain & Hispanic America)
  ES: 'es',
  MX: 'es',
  AR: 'es',
  CO: 'es',
  CL: 'es',
  PE: 'es',
  VE: 'es',
  EC: 'es',
  GT: 'es',
  CU: 'es',
  BO: 'es',
  DO: 'es',
  HN: 'es',
  PY: 'es',
  SV: 'es',
  NI: 'es',
  CR: 'es',
  PR: 'es',
  PA: 'es',
  UY: 'es',
  GQ: 'es',

  // French
  FR: 'fr',
  BE: 'fr',
  MC: 'fr',
  SN: 'fr',
  CI: 'fr',
  CM: 'fr',
  CD: 'fr',
  CG: 'fr',
  MG: 'fr',
  ML: 'fr',
  NE: 'fr',
  BF: 'fr',
  BJ: 'fr',
  TG: 'fr',
  GA: 'fr',
  DJ: 'fr',

  // German
  DE: 'de',
  AT: 'de',
  LI: 'de',
  CH: 'de',

  // Vietnamese
  VN: 'vi',

  // Thai
  TH: 'th',

  // English
  US: 'en',
  GB: 'en',
  AU: 'en',
  CA: 'en',
  NZ: 'en',
  IE: 'en',
  ZA: 'en',
  IN: 'en',
  PH: 'en',
};

function parseCookie(header, name) {
  if (!header) return null;
  const parts = header.split(';');
  for (let i = 0; i < parts.length; i++) {
    const p = parts[i].trim();
    const eq = p.indexOf('=');
    if (eq === -1) continue;
    const k = p.slice(0, eq).trim();
    if (k === name) return p.slice(eq + 1).trim();
  }
  return null;
}

function parseAcceptLanguage(header) {
  if (!header) return null;
  const items = header.split(',').map((part) => {
    const [lang, qVal] = part.trim().split(';');
    let q = 1.0;
    if (qVal && qVal.trim().startsWith('q=')) {
      const parsedQ = parseFloat(qVal.trim().slice(2));
      if (!isNaN(parsedQ)) q = parsedQ;
    }
    const code = (lang || '').trim().toLowerCase().split(/[-_]/)[0];
    return { code, q };
  });

  items.sort((a, b) => b.q - a.q);

  for (const item of items) {
    if (SUPPORTED_LOCALES.includes(item.code)) {
      return item.code;
    }
  }
  return null;
}

function pickVariant() {
  const r = Math.random();
  const i = Math.floor(r * VARIANTS.length);
  return VARIANTS[Math.min(i, VARIANTS.length - 1)];
}

function resolveLocale({ url, cookieHeader, countryHeader, acceptLanguageHeader }) {
  // 1. URL parameter override: ?locale=xx or ?lang=xx
  const urlLocale = (url.searchParams.get('locale') || url.searchParams.get('lang') || '').toLowerCase().trim();
  if (urlLocale && SUPPORTED_LOCALES.includes(urlLocale)) {
    return urlLocale;
  }

  // 2. Explicit cookie preference: sf_locale
  const cookieLocale = (parseCookie(cookieHeader, 'sf_locale') || '').toLowerCase().trim();
  if (cookieLocale && SUPPORTED_LOCALES.includes(cookieLocale)) {
    return cookieLocale;
  }

  // 3. IP geolocation country code from Cloudflare (cf-ipcountry header)
  const country = (countryHeader || '').toUpperCase().trim();
  if (country && COUNTRY_TO_LOCALE[country]) {
    return COUNTRY_TO_LOCALE[country];
  }

  // 4. Accept-Language header from browser
  const acceptLocale = parseAcceptLanguage(acceptLanguageHeader);
  if (acceptLocale) {
    return acceptLocale;
  }

  // 5. Default fallback to English
  return 'en';
}

function onRequestGet(context) {
  const url = new URL(context.request.url);
  const cookieHeader = context.request.headers.get('cookie') || '';
  const countryHeader = context.request.headers.get('cf-ipcountry') || context.request.cf?.country || '';
  const acceptLanguageHeader = context.request.headers.get('accept-language') || '';

  const locale = resolveLocale({
    url,
    cookieHeader,
    countryHeader,
    acceptLanguageHeader,
  });

  const search = url.search || '';
  const headers = new Headers();
  headers.set('Cache-Control', 'no-store');

  if (locale !== 'en') {
    // Redirect to localized path, e.g. /zh/, /ja/, /es/
    const dest = '/' + locale + '/' + search;
    headers.set('Location', dest);
    headers.append('Set-Cookie', 'sf_locale=' + locale + '; Path=/; Max-Age=31536000; SameSite=Lax');
    return new Response(null, {
      status: 302,
      headers,
    });
  }

  // English: handle A/B test variant assignment
  const overrideVariant = url.searchParams.get('variant');
  let variant = overrideVariant && VARIANTS.includes(overrideVariant) ? overrideVariant : null;

  if (!variant) {
    variant = parseCookie(cookieHeader, 'sf_variant');
    if (!variant || !VARIANTS.includes(variant)) {
      variant = pickVariant();
    }
  }

  const dest = '/' + variant + '/' + search;
  headers.set('Location', dest);
  headers.append('Set-Cookie', 'sf_locale=en; Path=/; Max-Age=31536000; SameSite=Lax');
  headers.append('Set-Cookie', 'sf_variant=' + variant + '; Path=/; Max-Age=31536000; SameSite=Lax');

  return new Response(null, {
    status: 302,
    headers,
  });
}

export {
  onRequestGet,
  resolveLocale,
  parseAcceptLanguage,
  parseCookie,
  pickVariant,
  COUNTRY_TO_LOCALE,
  SUPPORTED_LOCALES,
  VARIANTS,
};