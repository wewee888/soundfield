import test from 'node:test';
import assert from 'node:assert/strict';
import i18n from '../assets/site-i18n.js';

const { resolveTargetLocaleUrl, detectPageLocale, normalizeLocale } = i18n;

test('normalizeLocale handles various language codes', () => {
  assert.equal(normalizeLocale('zh'), 'zh');
  assert.equal(normalizeLocale('zh-CN'), 'zh');
  assert.equal(normalizeLocale('en-US'), 'en');
  assert.equal(normalizeLocale('ES'), 'es');
  assert.equal(normalizeLocale('unknown'), '');
  assert.equal(normalizeLocale(''), '');
});

test('detectPageLocale parses locale from path', () => {
  assert.equal(detectPageLocale('/zh/noise-levels.html'), 'zh');
  assert.equal(detectPageLocale('/es/index.html'), 'es');
  assert.equal(detectPageLocale('/use-cases/fr/neighbor-noise-evidence.html'), 'fr');
  assert.equal(detectPageLocale('/noise-levels.html'), 'en');
  assert.equal(detectPageLocale('/use-cases/neighbor-noise-evidence.html'), 'en');
  assert.equal(detectPageLocale('/'), 'en');
});

test('resolveTargetLocaleUrl: Root homepage', () => {
  assert.equal(resolveTargetLocaleUrl('zh', '/'), '/zh/');
  assert.equal(resolveTargetLocaleUrl('es', '/'), '/es/');
  assert.equal(resolveTargetLocaleUrl('en', '/'), '/');

  assert.equal(resolveTargetLocaleUrl('zh', '/index.html'), '/zh/');
  assert.equal(resolveTargetLocaleUrl('es', '/index.html'), '/es/');
  assert.equal(resolveTargetLocaleUrl('en', '/index.html'), '/');
});

test('resolveTargetLocaleUrl: Localized homepage', () => {
  assert.equal(resolveTargetLocaleUrl('es', '/zh/'), '/es/');
  assert.equal(resolveTargetLocaleUrl('en', '/zh/'), '/');
  assert.equal(resolveTargetLocaleUrl('de', '/zh/index.html'), '/de/');
  assert.equal(resolveTargetLocaleUrl('en', '/zh/index.html'), '/');
});

test('resolveTargetLocaleUrl: Root standard pages', () => {
  assert.equal(resolveTargetLocaleUrl('zh', '/noise-levels.html'), '/zh/noise-levels.html');
  assert.equal(resolveTargetLocaleUrl('es', '/noise-levels.html'), '/es/noise-levels.html');
  assert.equal(resolveTargetLocaleUrl('en', '/noise-levels.html'), '/noise-levels.html');
  assert.equal(resolveTargetLocaleUrl('ja', '/accuracy.html'), '/ja/accuracy.html');
  assert.equal(resolveTargetLocaleUrl('zh', '/auth.html'), '/zh/auth.html');
  assert.equal(resolveTargetLocaleUrl('fr', '/camera.html'), '/fr/camera.html');
});

test('resolveTargetLocaleUrl: Localized standard pages', () => {
  assert.equal(resolveTargetLocaleUrl('es', '/zh/noise-levels.html'), '/es/noise-levels.html');
  assert.equal(resolveTargetLocaleUrl('en', '/zh/noise-levels.html'), '/noise-levels.html');
  assert.equal(resolveTargetLocaleUrl('fr', '/de/standards.html'), '/fr/standards.html');
  assert.equal(resolveTargetLocaleUrl('en', '/ja/accuracy.html'), '/accuracy.html');
  assert.equal(resolveTargetLocaleUrl('zh', '/es/auth.html'), '/zh/auth.html');
});

test('resolveTargetLocaleUrl: Clean URLs without .html (Cloudflare Pages)', () => {
  assert.equal(resolveTargetLocaleUrl('zh', '/noise-levels'), '/zh/noise-levels.html');
  assert.equal(resolveTargetLocaleUrl('es', '/zh/noise-levels'), '/es/noise-levels.html');
  assert.equal(resolveTargetLocaleUrl('en', '/zh/noise-levels'), '/noise-levels.html');
  assert.equal(resolveTargetLocaleUrl('fr', '/zh/noise-levels/'), '/fr/noise-levels.html');
});

test('resolveTargetLocaleUrl: Use-cases index', () => {
  assert.equal(resolveTargetLocaleUrl('zh', '/use-cases/'), '/use-cases/zh/');
  assert.equal(resolveTargetLocaleUrl('es', '/use-cases/'), '/use-cases/es/');
  assert.equal(resolveTargetLocaleUrl('en', '/use-cases/'), '/use-cases/');

  assert.equal(resolveTargetLocaleUrl('es', '/use-cases/zh/'), '/use-cases/es/');
  assert.equal(resolveTargetLocaleUrl('en', '/use-cases/zh/'), '/use-cases/');
  assert.equal(resolveTargetLocaleUrl('zh', '/use-cases/en/index.html'), '/use-cases/zh/');
});

test('resolveTargetLocaleUrl: Specific use-case scenarios', () => {
  // From root English scenario to other languages
  assert.equal(
    resolveTargetLocaleUrl('zh', '/use-cases/neighbor-noise-evidence.html'),
    '/use-cases/zh/neighbor-noise-evidence.html'
  );
  assert.equal(
    resolveTargetLocaleUrl('es', '/use-cases/neighbor-noise-evidence.html'),
    '/use-cases/es/neighbor-noise-evidence.html'
  );
  assert.equal(
    resolveTargetLocaleUrl('en', '/use-cases/neighbor-noise-evidence.html'),
    '/use-cases/neighbor-noise-evidence.html'
  );

  // From localized scenario to other languages
  assert.equal(
    resolveTargetLocaleUrl('es', '/use-cases/zh/neighbor-noise-evidence.html'),
    '/use-cases/es/neighbor-noise-evidence.html'
  );
  assert.equal(
    resolveTargetLocaleUrl('fr', '/use-cases/zh/neighbor-noise-evidence.html'),
    '/use-cases/fr/neighbor-noise-evidence.html'
  );
  assert.equal(
    resolveTargetLocaleUrl('en', '/use-cases/zh/neighbor-noise-evidence.html'),
    '/use-cases/neighbor-noise-evidence.html'
  );

  // Construction & bar street scenarios
  assert.equal(
    resolveTargetLocaleUrl('zh', '/use-cases/construction-noise-monitoring.html'),
    '/use-cases/zh/construction-noise-monitoring.html'
  );
  assert.equal(
    resolveTargetLocaleUrl('de', '/use-cases/zh/bar-street-disturbance.html'),
    '/use-cases/de/bar-street-disturbance.html'
  );

  // Clean URLs in use-cases
  assert.equal(
    resolveTargetLocaleUrl('zh', '/use-cases/neighbor-noise-evidence'),
    '/use-cases/zh/neighbor-noise-evidence.html'
  );
  assert.equal(
    resolveTargetLocaleUrl('es', '/use-cases/zh/neighbor-noise-evidence/'),
    '/use-cases/es/neighbor-noise-evidence.html'
  );
});

test('resolveTargetLocaleUrl: Core tool app stays on soundtest.html', () => {
  assert.equal(resolveTargetLocaleUrl('zh', '/soundtest.html'), '/soundtest.html?lang=zh');
  assert.equal(resolveTargetLocaleUrl('es', '/soundtest.html', '?token=abc'), '/soundtest.html?token=abc&lang=es');
  assert.equal(resolveTargetLocaleUrl('zh', '/soundtest.html', '?lang=en&token=abc'), '/soundtest.html?lang=zh&token=abc');
  assert.equal(resolveTargetLocaleUrl('fr', '/soundtest.html', '', '#sentry'), '/soundtest.html?lang=fr#sentry');
  assert.equal(resolveTargetLocaleUrl('zh', '/app.html'), '/soundtest.html?lang=zh');
});

test('resolveTargetLocaleUrl: Admin dashboard', () => {
  assert.equal(resolveTargetLocaleUrl('zh', '/admin.html'), '/admin.html');
  assert.equal(resolveTargetLocaleUrl('zh', '/admin.html', '?token=xyz', '#audit'), '/admin.html?token=xyz#audit');
});

test('resolveTargetLocaleUrl: Query params and hash preservation', () => {
  assert.equal(
    resolveTargetLocaleUrl('es', '/zh/noise-levels.html', '?tab=residential', '#traffic'),
    '/es/noise-levels.html?tab=residential#traffic'
  );
  assert.equal(
    resolveTargetLocaleUrl('zh', '/', '', '#pricing'),
    '/zh/#pricing'
  );
  assert.equal(
    resolveTargetLocaleUrl('en', '/zh/', '', '#pricing'),
    '/#pricing'
  );
  assert.equal(
    resolveTargetLocaleUrl('de', '/use-cases/zh/neighbor-noise-evidence.html', '?session=123', '#faq'),
    '/use-cases/de/neighbor-noise-evidence.html?session=123#faq'
  );
});

test('resolveTargetLocaleUrl: Special pages (about.html, terms.html)', () => {
  assert.equal(resolveTargetLocaleUrl('zh', '/about.html'), '/zh/about.html');
  assert.equal(resolveTargetLocaleUrl('en', '/zh/about.html'), '/about.html');
  // Safe fallback to root about.html for languages without localized about
  assert.equal(resolveTargetLocaleUrl('es', '/zh/about.html'), '/about.html');
  assert.equal(resolveTargetLocaleUrl('zh', '/terms.html'), '/zh/terms.html');
  assert.equal(resolveTargetLocaleUrl('fr', '/zh/terms.html'), '/terms.html');
});
