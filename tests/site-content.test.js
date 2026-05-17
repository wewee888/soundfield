const assert = require('node:assert/strict');
const fs = require('node:fs');
const test = require('node:test');
const path = require('node:path');

global.window = {};
require(path.join(__dirname, '..', 'assets', 'site-content.js'));
require(path.join(__dirname, '..', 'assets', 'site-i18n.js'));

const site = global.window.SoundfieldSite;
const i18n = global.window.SoundtestI18n;

test('global positioning keeps the product in documentation territory', () => {
  assert.match(site.positioning.en, /noise documentation/i);
  assert.match(site.positioning.en, /acoustic evidence aid/i);
  assert.doesNotMatch(site.positioning.en, /certified/i);
  assert.match(site.positioning.zh, /环境记录与证据辅助/);
});

test('primary keyword set covers global launch use cases', () => {
  const keywords = site.keywords.en.join(' | ');
  ['noise complaint evidence', 'neighbor noise recording', 'construction noise monitoring', 'workplace noise inspection'].forEach((keyword) => {
    assert.match(keywords, new RegExp(keyword, 'i'));
  });
});

test('homepage copy uses global noise evidence positioning with safer legal wording', () => {
  assert.equal(site.homepageCopy.slogan, 'Free Online Noise Evidence Recorder | No App Required');
  assert.match(site.homepageCopy.subtitle, /Measure Decibels, Record Sound, Save Time & Location/i);
  assert.match(site.homepageCopy.intro, /browser-based noise monitoring/i);
  assert.match(site.homepageCopy.intro, /No app download/i);
  assert.doesNotMatch(site.homepageCopy.intro, /official legal evidence/i);
});

test('multilingual homepage copy covers launch translation set', () => {
  ['en', 'zh', 'es', 'fr', 'de', 'ja', 'ko'].forEach((code) => {
    const copy = site.localizedCopy[code];
    assert.ok(copy, `${code} localized copy exists`);
    assert.ok(copy.slogan.length > 10, `${code} slogan is present`);
    assert.equal(copy.features.length, 4, `${code} has four feature labels`);
    assert.match(copy.buttons.startMonitoring, /.+/);
    assert.match(copy.disclaimer, /local|lokal|本地|端末|기기|localmente|localement/i);
  });
});

test('site routes include the planned public pages', () => {
  const hrefs = site.routes.map((route) => route.href);
  ['index.html', 'app.html', 'privacy.html', 'accuracy.html', 'standards.html', 'samples.html', 'download.html', 'compliance.html', 'changelog.html'].forEach((href) => {
    assert.ok(hrefs.includes(href), `${href} route exists`);
  });
  ['monetization.html', 'launch-metrics.html'].forEach((href) => {
    assert.ok(!hrefs.includes(href), `${href} is not a public navigation route`);
  });
});

test('changelog records latest public product updates', () => {
  assert.ok(site.changelog.length >= 4);
  const latest = site.changelog.map((entry) => `${entry.title} ${entry.summary}`).join(' | ');
  assert.match(latest, /SOUNDTEST\.PRO/i);
  assert.match(latest, /multilingual|language/i);
  assert.match(latest, /SEO|canonical|sitemap/i);
  assert.match(latest, /storage/i);
});

test('language routing prefers saved choice, then system language, then English', () => {
  assert.equal(i18n.pickLocale({ savedLocale: 'ja', navigatorLanguages: ['de-DE'] }), 'ja');
  assert.equal(i18n.pickLocale({ savedLocale: '', navigatorLanguages: ['fr-CA', 'en-US'] }), 'fr');
  assert.equal(i18n.pickLocale({ savedLocale: '', navigatorLanguages: ['zh-CN'] }), 'zh');
  assert.equal(i18n.pickLocale({ savedLocale: '', navigatorLanguages: ['zh-TW'] }), 'zh');
  assert.equal(i18n.localePath('ko'), 'ko/index.html');
  assert.equal(i18n.localePath('zh-CN'), 'zh/index.html');
});

test('global language directories cover launch locales', () => {
  const localeCodes = site.supportedLanguages.map((locale) => locale.code);
  ['en', 'zh', 'es', 'fr', 'de', 'ja', 'ko', 'vi', 'th'].forEach((code) => {
    assert.ok(localeCodes.includes(code), `${code} locale exists`);
    assert.ok(fs.existsSync(path.join(__dirname, '..', code, 'index.html')), `${code}/index.html exists`);
  });
});

test('noise guidelines are references, not violation judgments', () => {
  assert.ok(site.noiseGuidelines.length >= 3);
  for (const guideline of site.noiseGuidelines) {
    assert.match(guideline.disclaimer, /reference|guidance|local rules vary/i);
    assert.doesNotMatch(`${guideline.title} ${guideline.body}`, /illegal|violation|call police/i);
  }
});

test('global terminology avoids China-only complaint wording', () => {
  const terms = site.globalTerms.join(' | ');
  ['Legal Evidence', 'Noise Complaint', 'Local Authority', 'Police Report'].forEach((term) => {
    assert.match(terms, new RegExp(term, 'i'));
  });
  assert.doesNotMatch(terms, /12345|居委会/);
});

test('monetization model covers global web-first revenue without cloud overclaim', () => {
  const names = site.monetization.plans.map((plan) => plan.name);
  ['Free', 'Pro', 'Lifetime'].forEach((name) => assert.ok(names.includes(name), `${name} plan exists`));
  const benefits = site.monetization.plans.flatMap((plan) => plan.benefits).join(' | ');
  assert.match(benefits, /No ads/i);
  assert.match(benefits, /PDF/i);
  assert.doesNotMatch(benefits, /Cloud save|Cloud data backup/i);
  assert.doesNotMatch(benefits, /Official evidence template/i);
});

test('homepage renders launch copy, scenarios, reference limits, and plan cards', () => {
  const html = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8');
  assert.match(html, /Free Online Noise Evidence Recorder \| No App Required/);
  assert.match(html, /<a class="button primary" href="app\.html">Start Monitoring<\/a>/);
  assert.match(html, /Perfect For:/);
  assert.match(html, /Neighbor &amp; Apartment Noise/);
  assert.match(html, /Daytime Reference/);
  assert.match(html, /Free Version/);
  assert.match(html, /Pro Premium Version/);
  assert.match(html, /data-language-select/);
  assert.match(html, /<option value="zh">中文<\/option>/);
  assert.match(html, /href="zh\/index\.html">中文/);
  assert.match(html, /Latest Updates/);
  assert.doesNotMatch(html, /Chinese positioning|Beta Metrics|Launch Metrics|Cloud data backup|Official evidence template|Excessive noise can be used for official complaint/i);
});

test('homepage use-case cards link to matching user intent pages', () => {
  const html = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8');
  assert.match(html, /href="use-cases\/bar-street-disturbance\.html"[\s\S]*?<h3>Bar, Shop &amp; Street Disturbance<\/h3>/);
  assert.match(html, /href="use-cases\/rental-dispute-evidence\.html"[\s\S]*?<h3>Rental Dispute &amp; Legal Evidence Aid<\/h3>/);
  assert.doesNotMatch(html, /href="use-cases\/property-noise-complaint-report\.html"[\s\S]*?<h3>Bar, Shop &amp; Street Disturbance<\/h3>/);
  assert.doesNotMatch(html, /href="use-cases\/workplace-noise-inspection\.html"[\s\S]*?<h3>Rental Dispute &amp; Legal Evidence Aid<\/h3>/);
});

test('Chinese landing page mirrors the full homepage structure', () => {
  const html = fs.readFileSync(path.join(__dirname, '..', 'zh', 'index.html'), 'utf8');
  ['核心功能', '适用场景', '噪声参考', '免费版', '高级版', '隐私保护'].forEach((text) => {
    assert.match(html, new RegExp(text));
  });
  assert.match(html, /href="\.\.\/app\.html">开始监测<\/a>/);
  assert.doesNotMatch(html, /Beta Metrics|Launch Metrics|monetization/i);
});

test('primary locale pages render their localized launch slogans', () => {
  ['en', 'zh', 'es', 'fr', 'de', 'ja', 'ko'].forEach((code) => {
    const html = fs.readFileSync(path.join(__dirname, '..', code, 'index.html'), 'utf8');
    assert.match(html, new RegExp(site.localizedCopy[code].slogan.replace(/[|]/g, '\\|')));
  });
});

test('homepage and locale pages expose canonical and hreflang tags', () => {
  const localeCodes = site.supportedLanguages.map((locale) => locale.code);
  const homeHtml = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8');
  assert.match(homeHtml, /rel="canonical" href="https:\/\/soundtest\.pro\/"/);
  assert.match(homeHtml, /rel="alternate" hreflang="x-default" href="https:\/\/soundtest\.pro\/"/);
  for (const code of localeCodes) {
    assert.match(homeHtml, new RegExp(`rel="alternate" hreflang="${code}" href="https://soundtest\\.pro/${code}/"`));
    const localeHtml = fs.readFileSync(path.join(__dirname, '..', code, 'index.html'), 'utf8');
    assert.match(localeHtml, new RegExp(`rel="canonical" href="https://soundtest\\.pro/${code}/"`));
  }
});

test('homepage includes SoftwareApplication structured data', () => {
  const html = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8');
  assert.match(html, /<script type="application\/ld\+json">/);
  assert.match(html, /"@type": "SoftwareApplication"/);
  assert.match(html, /"name": "SOUNDTEST\.PRO"/);
  assert.match(html, /"applicationCategory": "UtilitiesApplication"/);
  assert.doesNotMatch(html, /"isCertified"|official legal evidence/i);
});

test('public brand name displays as SOUNDTEST.PRO across website shell and manifest', () => {
  const htmlFiles = [
    ...site.routes.map((route) => route.href),
    ...site.useCases.map((useCase) => useCase.href),
    ...site.supportedLanguages.map((locale) => `${locale.code}/index.html`),
  ];
  for (const file of htmlFiles) {
    const html = fs.readFileSync(path.join(__dirname, '..', file), 'utf8');
    assert.doesNotMatch(html, /Soundfield|SOUNDFIELD/, `${file} should use SOUNDTEST.PRO public brand`);
    assert.match(html, /SOUNDTEST\.PRO/, `${file} includes uppercase public brand`);
  }

  const manifest = fs.readFileSync(path.join(__dirname, '..', 'manifest.webmanifest'), 'utf8');
  assert.match(manifest, /"name": "SOUNDTEST\.PRO Noise Evidence"/);
  assert.match(manifest, /"short_name": "SOUNDTEST\.PRO"/);
});

test('core tool page exposes SOUNDTEST.PRO as public app name', () => {
  const html = fs.readFileSync(path.join(__dirname, '..', 'soundfield.html'), 'utf8');
  assert.match(html, /<meta name="application-name" content="SOUNDTEST\.PRO">/);
  assert.match(html, /<meta name="apple-mobile-web-app-title" content="SOUNDTEST\.PRO">/);
  assert.match(html, /<title>SOUNDTEST\.PRO/);
  assert.doesNotMatch(html, />\s*soundtest\.pro\s*</);
});

test('sitemap and robots expose all public SEO entry points', () => {
  const sitemap = fs.readFileSync(path.join(__dirname, '..', 'sitemap.xml'), 'utf8');
  const robots = fs.readFileSync(path.join(__dirname, '..', 'robots.txt'), 'utf8');
  assert.match(robots, /Sitemap: https:\/\/soundtest\.pro\/sitemap\.xml/);
  ['/', '/app.html', '/standards.html', '/privacy.html', '/accuracy.html'].forEach((urlPath) => {
    assert.match(sitemap, new RegExp(`<loc>https://soundtest\\.pro${urlPath}</loc>`));
  });
  for (const locale of site.supportedLanguages) {
    assert.match(sitemap, new RegExp(`<loc>https://soundtest\\.pro/${locale.code}/</loc>`));
  }
  ['monetization.html', 'launch-metrics.html'].forEach((internalPath) => {
    assert.doesNotMatch(sitemap, new RegExp(internalPath));
  });
});

test('public route files exist for the static website', () => {
  for (const route of site.routes) {
    assert.ok(fs.existsSync(path.join(__dirname, '..', route.href)), `${route.href} exists`);
  }
  for (const useCase of site.useCases) {
    assert.ok(fs.existsSync(path.join(__dirname, '..', useCase.href)), `${useCase.href} exists`);
  }
});

test('use case pages keep the certified-meter disclaimer', () => {
  assert.ok(site.useCases.length >= 4);
  for (const useCase of site.useCases) {
    assert.match(useCase.disclaimer, /not a certified/i);
    assert.ok(useCase.href.startsWith('use-cases/'));
  }
});

test('launch metrics capture product funnel and beta readiness', () => {
  const eventNames = site.launchMetrics.events.map((event) => event.name);
  ['monitor_start', 'evidence_photo_saved', 'recording_saved', 'pdf_exported', 'backup_exported', 'commercial_inquiry_copied'].forEach((name) => {
    assert.ok(eventNames.includes(name), `${name} is tracked`);
  });
  assert.ok(site.launchMetrics.successCriteria.length >= 4);
});

test('static website local links resolve to files', () => {
  const htmlFiles = [
    ...site.routes.map((route) => route.href),
    ...site.useCases.map((useCase) => useCase.href),
    ...site.supportedLanguages.map((locale) => `${locale.code}/index.html`),
  ];
  const localReferencePattern = /\b(?:href|src)="([^"#]+)"/g;

  for (const file of htmlFiles) {
    const absoluteFile = path.join(__dirname, '..', file);
    const html = fs.readFileSync(absoluteFile, 'utf8');
    const baseDir = path.dirname(absoluteFile);
    for (const match of html.matchAll(localReferencePattern)) {
      const target = match[1];
      if (/^(https?:|mailto:|tel:|data:)/i.test(target)) continue;
      if (target.startsWith('#')) continue;
      assert.ok(fs.existsSync(path.resolve(baseDir, target)), `${file} links to existing ${target}`);
    }
  }
});

test('static website brand mark uses the shared tool icon', () => {
  const htmlFiles = [
    ...site.routes.map((route) => route.href),
    ...site.useCases.map((useCase) => useCase.href),
  ];
  const css = fs.readFileSync(path.join(__dirname, '..', 'assets', 'site.css'), 'utf8');

  assert.match(css, /url\("icon\.svg"\)/);
  for (const file of htmlFiles) {
    const html = fs.readFileSync(path.join(__dirname, '..', file), 'utf8');
    assert.doesNotMatch(html, /<span class="brand-mark">SF<\/span>/, `${file} does not use text-only brand mark`);
    assert.match(html, /class="brand-mark" aria-hidden="true"/, `${file} has decorative shared brand mark`);
  }
});
