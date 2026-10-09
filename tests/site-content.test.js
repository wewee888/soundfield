const assert = require('node:assert/strict');
const fs = require('node:fs');
const test = require('node:test');
const path = require('node:path');

global.window = {};
require(path.join(__dirname, '..', 'assets', 'site-content.js'));
require(path.join(__dirname, '..', 'assets', 'site-i18n.js'));
require(path.join(__dirname, '..', 'assets', 'lang-flags.js'));

const site = global.window.SoundfieldSite;
const i18n = global.window.SoundtestI18n;
const langFlags = global.window.LangFlags;

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
  assert.equal(site.homepageCopy.slogan, 'Free Online Decibel Meter & Noise Evidence Recorder | No App Required');
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
  ['index.html', 'soundtest.html', 'privacy.html', 'accuracy.html', 'standards.html', 'samples.html', 'download.html', 'compliance.html', 'changelog.html'].forEach((href) => {
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

test('locale flag images are stored locally for Cloudflare deploy', () => {
  const flagsDir = path.join(__dirname, '..', 'assets', 'flags');
  ['us', 'cn', 'es', 'fr', 'de', 'jp', 'kr', 'vn', 'th'].forEach((iso) => {
    const file = path.join(flagsDir, `${iso}.png`);
    assert.ok(fs.existsSync(file), `${iso}.png exists`);
    assert.ok(fs.statSync(file).size > 80, `${iso}.png is non-empty`);
  });
  const langFlagsCode = fs.readFileSync(path.join(__dirname, '..', 'assets', 'lang-flags.js'), 'utf8');
  assert.match(langFlagsCode, /flags\//);
  assert.doesNotMatch(langFlagsCode, /flagcdn\.com/);
});

test('LangFlags maps primary languages and flag URLs correctly', () => {
  assert.equal(langFlags.primaryFromValue('zh-CN'), 'zh');
  assert.equal(langFlags.primaryFromValue('zh'), 'zh');
  assert.equal(langFlags.primaryFromValue('en-US'), 'en');
  assert.equal(langFlags.primaryFromValue('en'), 'en');
  assert.equal(langFlags.primaryFromValue('ja-JP'), 'ja');
  assert.equal(langFlags.primaryFromValue('ko-KR'), 'ko');
  assert.equal(langFlags.primaryFromValue('es-ES'), 'es');
  assert.match(langFlags.flagUrl('zh'), /cn\.png$/);
  assert.match(langFlags.flagUrl('en'), /us\.png$/);
  assert.match(langFlags.flagUrl('ja'), /jp\.png$/);
  assert.match(langFlags.flagUrl('ko'), /kr\.png$/);
  assert.match(langFlags.flagUrl('es'), /es\.png$/);
  assert.equal(typeof langFlags.closeAll, 'function');
});

test('language routing prefers saved choice, then system language, then English', () => {
  assert.equal(i18n.pickLocale({ savedLocale: 'ja', navigatorLanguages: ['de-DE'] }), 'ja');
  assert.equal(i18n.pickLocale({ savedLocale: '', navigatorLanguages: ['fr-CA', 'en-US'] }), 'fr');
  assert.equal(i18n.pickLocale({ savedLocale: '', navigatorLanguages: ['zh-CN'] }), 'zh');
  assert.equal(i18n.pickLocale({ savedLocale: '', navigatorLanguages: ['zh-TW'] }), 'zh');
  assert.equal(i18n.localePath('ko'), '/ko/');
  assert.equal(i18n.localePath('zh-CN'), '/zh/');
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
  assert.match(html, /Free Online Decibel Meter & Noise Evidence Recorder \| No App Required/);
  assert.match(html, /<a class="button primary" href="soundtest\.html">Start Monitoring<\/a>/);
  assert.match(html, /Perfect For:/);
  assert.match(html, /Neighbor &amp; Apartment Noise/);
  assert.match(html, /Daytime Reference/);
  assert.match(html, /Free Version/);
  assert.match(html, /Pro Premium Version/);
  assert.match(html, /assets\/site-i18n\.js/);
  assert.match(html, /assets\/site-auth\.js/);
  assert.match(html, /href="auth\.html">Account<\/a>/);
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

test('new use-case pages include a primary app CTA', () => {
  ['bar-street-disturbance.html', 'rental-dispute-evidence.html'].forEach((file) => {
    const html = fs.readFileSync(path.join(__dirname, '..', 'use-cases', file), 'utf8');
    assert.match(html, /<a class="button primary" href="\.\.\/soundtest\.html">Start documenting noise<\/a>/);
  });
});

test('Chinese landing page mirrors the full homepage structure', () => {
  const html = fs.readFileSync(path.join(__dirname, '..', 'zh', 'index.html'), 'utf8');
  ['核心功能', '适用场景', '噪声参考', '免费版', '高级版', '隐私保护'].forEach((text) => {
    assert.match(html, new RegExp(text));
  });
  assert.match(html, /href="\.\.\/soundtest\.html">开始监测<\/a>/);
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
      if (file === 'soundtest.html') continue;
    const html = fs.readFileSync(path.join(__dirname, '..', file), 'utf8');
    assert.doesNotMatch(html, /Soundfield|SOUNDFIELD/, `${file} should use SOUNDTEST.PRO public brand`);
    assert.match(html, /SOUNDTEST\.PRO/, `${file} includes uppercase public brand`);
  }

  const manifest = fs.readFileSync(path.join(__dirname, '..', 'manifest.webmanifest'), 'utf8');
  assert.match(manifest, /"name": "SOUNDTEST\.PRO Noise Evidence"/);
  assert.match(manifest, /"short_name": "SOUNDTEST\.PRO"/);
});

test('core tool page exposes SOUNDTEST.PRO as public app name', () => {
  const html = fs.readFileSync(path.join(__dirname, '..', 'soundtest.html'), 'utf8');
  assert.match(html, /<meta name="application-name" content="SOUNDTEST\.PRO">/);
  assert.match(html, /<meta name="apple-mobile-web-app-title" content="SOUNDTEST\.PRO">/);
  assert.match(html, /<title>SOUNDTEST\.PRO/);
  assert.doesNotMatch(html, />\s*soundtest\.pro\s*</);
});

test('core tool retries microphone startup with basic constraints', () => {
  const html = fs.readFileSync(path.join(__dirname, '..', 'soundtest.html'), 'utf8');
  assert.match(html, /async function requestMicrophoneStream\(\)/);
  assert.match(html, /async function ensureAudioContextReady\(\)/);
  assert.match(html, /getUserMedia\(professionalConstraints\)/);
  assert.match(html, /NotAllowedError','NotFoundError','NotReadableError','SecurityError','AbortError/);
  assert.match(html, /getUserMedia\(\{audio:true\}\)/);
  assert.match(html, /await ensureAudioContextReady\(\);\s*micStream=await requestMicrophoneStream\(\)/);
  assert.match(html, /mediaErrorDetail\(e\)/);
  assert.match(html, /SOUNDTEST\.PRO 会自动改用基础麦克风模式重试/);
});

test('toggleMon implements re-entrancy locking and defensive rollback upon microphone error', () => {
  const html = fs.readFileSync(path.join(__dirname, '..', 'soundtest.html'), 'utf8');
  assert.match(html, /isTogglingMon=false/);
  assert.match(html, /if\(isTogglingMon\)return false/);
  assert.match(html, /isTogglingMon=true/);
  assert.match(html, /isMon=false;\s*if\(monTmr\)\{clearInterval\(monTmr\);monTmr=null;\}/);
  assert.match(html, /if\(startBtn\)startBtn\.className='start-btn';\s*setStartButtonText\(\);/);
  assert.match(html, /isTogglingMon=false;\s*setButtonBusy\('startBtn',false\);/);
});

test('audio engine supports Web Audio priming, global gesture unlocker, Windows multi-mic compatibility, and silence self-healing', () => {
  const html = fs.readFileSync(path.join(__dirname, '..', 'soundtest.html'), 'utf8');
  assert.match(html, /function primeAudioContext\(ctx\)/);
  assert.match(html, /async function fallbackToStandardMicStream\(\)/);
  assert.match(html, /gestureUnlockAudio/);
  assert.match(html, /fallbackToStandardMicStream\(\)/);
  assert.match(html, /function setWeighting\(w\)/);
  assert.match(html, /echoCancellation:\s*\{\s*ideal:\s*false\s*\}/);
  assert.match(html, /document\.getElementById\('capCard'\)\?\.classList\.add\('collapsed'\)/);
  assert.match(html, /stxt\.textContent=t\('ui\.ready','Ready'\)/);
  
  const reportEngine = fs.readFileSync(path.join(__dirname, '..', 'assets', 'report-cert-engine.js'), 'utf8');
  assert.match(reportEngine, /capturePhoto:\s*typeof capturePhoto/);
  assert.match(reportEngine, /captureSnapshotDuringRecording:\s*typeof captureSnapshotDuringRecording/);
  assert.match(reportEngine, /formatEvidencePlaceLine:\s*typeof formatEvidencePlaceLine/);
  assert.match(reportEngine, /formatGpsLine:\s*typeof formatGpsLine/);
});

test('watermark camera UI does not reference block-scoped isVideo outside scope', () => {
  const html = fs.readFileSync(path.join(__dirname, '..', 'soundtest.html'), 'utf8');
  assert.match(html, /const isVideo=\(watermarkCameraMode\|\|evidenceMode\)==='video';\s*const primary=document\.getElementById\('watermarkPrimaryBtn'\)/);
  assert.match(html, /if\(snapshotBtn\)snapshotBtn\.style\.display=isVideo&&isRec\?'inline-flex':'none';/);
});

test('core app language options stay synchronized with the website locales', () => {
  const html = fs.readFileSync(path.join(__dirname, '..', 'soundtest.html'), 'utf8');
  ['en-US', 'zh-CN', 'es', 'fr', 'de', 'ja', 'ko', 'vi', 'th'].forEach((locale) => {
    assert.match(html, new RegExp(`<option value="${locale}">`), `${locale} option exists in the app selector`);
  });
  assert.match(html, /SUPPORTED_APP_LANGUAGES/);
  assert.match(html, /supportedLanguageFromPrimary/);
  assert.match(html, /SITE_LANG_KEY='soundtest_locale'/);
  assert.match(html, /localStorage\.getItem\(SITE_LANG_KEY\)/);
  assert.match(html, /const base=I18N\[appLanguage\]\|\|\{\}/);
  assert.match(html, /const useEnglish=appLanguage!=='zh-CN'/);
  assert.doesNotMatch(html, /appLanguage==='en-US'/);
  assert.doesNotMatch(html, /appLanguage!=='en-US'/);
});

test('core tool wires Lemon checkout and membership lookup UI', () => {
  const html = fs.readFileSync(path.join(__dirname, '..', 'soundtest.html'), 'utf8');
  assert.match(html, /memberEmailInput/);
  assert.match(html, /lookupMembership\(\)/);
  assert.match(html, /beginCheckout\('pro'\)/);
  assert.match(html, /beginCheckout\('team'\)/);
  assert.match(html, /beginCheckout\('lifetime'\)/);
  assert.match(html, /MEMBERSHIP_API_BASE='\/api\/membership'/);
  assert.match(html, /fetch\(`\$\{MEMBERSHIP_API_BASE\}\/create-checkout`/);
  assert.match(html, /fetch\(`\$\{MEMBERSHIP_API_BASE\}\/lookup`/);
});

test('Cloudflare membership API endpoints exist', () => {
  [
    'functions/api/membership/config.js',
    'functions/api/membership/create-checkout.js',
    'functions/api/membership/lookup.js',
  ].forEach((file) => {
    assert.ok(fs.existsSync(path.join(__dirname, '..', file)), `${file} exists`);
  });
});

test('account page provides register and login forms', () => {
  const html = fs.readFileSync(path.join(__dirname, '..', 'auth.html'), 'utf8');
  assert.match(html, /data-auth-page="unauthenticated"/);
  assert.match(html, /data-auth-form="login"/);
  assert.match(html, /data-auth-form="register"/);
  assert.match(html, /assets\/site-auth\.js/);
});

test('sitemap and robots expose all public SEO entry points', () => {
  const sitemap = fs.readFileSync(path.join(__dirname, '..', 'sitemap.xml'), 'utf8');
  const robots = fs.readFileSync(path.join(__dirname, '..', 'robots.txt'), 'utf8');
  assert.match(robots, /Sitemap: https:\/\/soundtest\.pro\/sitemap\.xml/);
  ['/', '/soundtest/', '/standards/', '/privacy/', '/accuracy/'].forEach((urlPath) => {
    assert.match(sitemap, new RegExp(`<loc>https://soundtest\\.pro${urlPath}</loc>`));
  });
  for (const locale of site.supportedLanguages) {
    assert.match(sitemap, new RegExp(`hreflang=\"${locale.code}\"`));
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
      if (file === 'soundtest.html') continue;
    const absoluteFile = path.join(__dirname, '..', file);
    const html = fs.readFileSync(absoluteFile, 'utf8');
    const baseDir = path.dirname(absoluteFile);
    for (const match of html.matchAll(localReferencePattern)) {
      const target = match[1];
      if (/^(https?:|mailto:|tel:|data:|\/\/)/i.test(target)) continue;
      if (target.startsWith('#')) continue;
      if (target.startsWith('${')) continue;
      const targetPath = target.split('?')[0];
      assert.ok(fs.existsSync(path.resolve(baseDir, targetPath)), `${file} links to existing ${target}`);
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
      if (file === 'soundtest.html') continue;
    const html = fs.readFileSync(path.join(__dirname, '..', file), 'utf8');
    assert.doesNotMatch(html, /<span class="brand-mark">SF<\/span>/, `${file} does not use text-only brand mark`);
    assert.match(html, /class="brand-mark" aria-hidden="true"/, `${file} has decorative shared brand mark`);
  }
});

test('action bar dual buttons and translation keys are configured', () => {
  const soundtestHtml = fs.readFileSync(path.join(__dirname, '..', 'soundtest.html'), 'utf8');
  assert.match(soundtestHtml, /id="startBtn"/);
  assert.match(soundtestHtml, /id="recActionBtn"/);
  assert.match(soundtestHtml, /grid-template-columns:\s*1fr\s+1fr/);
  assert.match(soundtestHtml, /\.live-monitor-notice\{display:none!important\}/);

  const i18nCode = fs.readFileSync(path.join(__dirname, '..', 'assets', 'i18n-data.js'), 'utf8');
  assert.match(i18nCode, /startMeter:/);
  assert.match(i18nCode, /recordEvidence:/);
});

test('all 9 locales have complete dual buttons, sentry, scene chips, and new UI keys', () => {
  const i18nCode = fs.readFileSync(path.join(__dirname, '..', 'assets', 'i18n-data.js'), 'utf8');
  const win = {};
  eval(i18nCode.replace('window.__sfI18N = I18N_DATA;', 'win.__sfI18N = I18N_DATA;').replace('window.__sfSupportedAppLanguages', 'win.__sfSupportedAppLanguages'));
  const locales = ['en-US', 'zh-CN', 'es', 'fr', 'de', 'ja', 'ko', 'vi', 'th'];
  const chips = ['general', 'neighbor', 'footstep', 'renovation', 'traffic', 'hvac', 'pet', 'appliance', 'ktv', 'elevator', 'property', 'inspection', 'boundary', 'legal'];

  locales.forEach((loc) => {
    const data = win.__sfI18N[loc];
    assert.ok(data, `${loc} translation data exists`);

    // Dual buttons
    assert.ok(data.ui.startMeter, `${loc} has startMeter`);
    assert.ok(data.ui.meterSub, `${loc} has meterSub`);
    assert.ok(data.ui.stopMeter, `${loc} has stopMeter`);
    assert.ok(data.ui.monitoringSub, `${loc} has monitoringSub`);
    assert.ok(data.ui.recordEvidence, `${loc} has recordEvidence`);
    assert.ok(data.ui.recordSub, `${loc} has recordSub`);
    assert.ok(data.ui.stopRecord, `${loc} has stopRecord`);
    assert.ok(data.ui.recordingSub, `${loc} has recordingSub`);

    // Sentry mode
    assert.ok(data.modes.sentry?.label, `${loc} has sentry label`);
    assert.ok(data.modes.sentry?.activeLabel, `${loc} has sentry activeLabel`);
    assert.ok(data.modes.sentry?.tagline, `${loc} has sentry tagline`);
    assert.ok(data.modes.sentry?.activeTagline, `${loc} has sentry activeTagline`);

    // Scene chips (all 14)
    chips.forEach((c) => {
      assert.ok(data.sceneChips[c]?.label, `${loc} sceneChip ${c} has label`);
      assert.ok(data.sceneChips[c]?.note, `${loc} sceneChip ${c} has note`);
    });

    // Extra UI & placeholders
    assert.ok(data.ui.brandSub, `${loc} has brandSub`);
    assert.ok(data.ui.savePoint, `${loc} has savePoint`);
    assert.ok(data.ui.exportCsv, `${loc} has exportCsv`);
    assert.ok(data.ui.exportPdf, `${loc} has exportPdf`);
    assert.ok(data.ui.clearRecords, `${loc} has clearRecords`);
    assert.ok(data.ui.sessions, `${loc} has sessions`);
    assert.ok(data.placeholders.building, `${loc} has building placeholder`);
    assert.ok(data.placeholders.floor, `${loc} has floor placeholder`);
    assert.ok(data.placeholders.room, `${loc} has room placeholder`);
    assert.ok(data.placeholders.point, `${loc} has point placeholder`);
  });
});

test('soundtest.html applies translations to bottom nav, mode cards, and scene chips', () => {
  const soundtestHtml = fs.readFileSync(path.join(__dirname, '..', 'soundtest.html'), 'utf8');

  // Bottom navigation 4th button translated
  assert.match(soundtestHtml, /setButtonTextWithSvg\('nt-s',\s*t\('ui\.settings'/);

  // Mode card label translated via t()
  assert.match(soundtestHtml, /setText\('modeCardLabel',\s*t\('modes\.cardLabel'/);

  // New element IDs exist
  assert.match(soundtestHtml, /id="recStatusCardLabel"/);
  assert.match(soundtestHtml, /id="camPreviewCardLabel"/);
  assert.match(soundtestHtml, /id="gpsCardLabel"/);
  assert.match(soundtestHtml, /id="noiseMapCardLabel"/);
  assert.match(soundtestHtml, /id="geoSessionsCardLabel"/);
  assert.match(soundtestHtml, /id="settingsHubCardLabel"/);
  assert.match(soundtestHtml, /id="dataCardLabel"/);

  // Language detection checks URL query params first
  assert.match(soundtestHtml, /params\.get\('lang'\)\s*\|\|\s*params\.get\('locale'\)/);
  // Language detection checks cookie sf_locale
  assert.match(soundtestHtml, /document\.cookie\?\.match\(/);
  assert.match(soundtestHtml, /sf_locale=/);
  // Language detection checks referrer
  assert.match(soundtestHtml, /document\.referrer\.match\(/);
});

test('noise-levels pages exist across all 9 locales plus root with complete SEO hreflang matrix and structured data', () => {
  const rootHtml = fs.readFileSync(path.join(__dirname, '..', 'noise-levels.html'), 'utf8');
  assert.match(rootHtml, /rel="canonical" href="https:\/\/soundtest\.pro\/noise-levels\/"/);
  assert.match(rootHtml, /rel="alternate" hreflang="x-default" href="https:\/\/soundtest\.pro\/noise-levels\/"/);
  assert.match(rootHtml, /class="db-table"/);
  assert.match(rootHtml, /class="spectrum-scale-bar"/);
  assert.match(rootHtml, /id="chartLightbox"/);

  const locales = ['en', 'zh', 'es', 'fr', 'de', 'ja', 'ko', 'vi', 'th'];
  locales.forEach((code) => {
    const file = path.join(__dirname, '..', code, 'noise-levels.html');
    assert.ok(fs.existsSync(file), `${code}/noise-levels.html exists`);
    const html = fs.readFileSync(file, 'utf8');
    assert.match(html, new RegExp(`rel="canonical" href="https://soundtest\\.pro/${code}/noise-levels/"`));
    assert.match(html, /rel="alternate" hreflang="x-default" href="https:\/\/soundtest\.pro\/noise-levels\/"/);
    locales.forEach((l) => {
      assert.match(html, new RegExp(`rel="alternate" hreflang="${l}" href="https://soundtest\\.pro/${l}/noise-levels/"`));
    });
    assert.match(html, /class="db-table"/);
    assert.match(html, /class="spectrum-scale-bar"/);
    assert.match(html, /id="chartLightbox"/);
    assert.match(html, /id="openLightboxBtn"/);
    assert.match(html, /id="tableSearchInput"/);
    assert.match(html, /data-filter="quiet"/);
    assert.match(html, /data-filter="danger"/);
    assert.match(html, /"@type":\s*"FAQPage"/);
  });
});

test('all 9 locales and root pages feature unified 7-item navigation with authentic localized labels and active state', () => {
  const rootIndex = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8');
  assert.match(rootIndex, /<div class="nav-links">/);
  assert.match(rootIndex, /<a href="index\.html" class="active">Home<\/a>/);
  assert.match(rootIndex, /<a href="soundtest\.html">Open App<\/a>/);
  assert.match(rootIndex, /<a href="samples\.html">Samples<\/a>/);
  assert.match(rootIndex, /<a href="accuracy\.html">Accuracy<\/a>/);
  assert.match(rootIndex, /<a href="standards\.html">Standards<\/a>/);
  assert.match(rootIndex, /<a href="noise-levels\.html">Noise Levels<\/a>/);
  assert.match(rootIndex, /<a href="auth\.html">Account<\/a>/);

  const zhStandards = fs.readFileSync(path.join(__dirname, '..', 'zh', 'standards.html'), 'utf8');
  assert.match(zhStandards, /<div class="nav-links">/);
  assert.match(zhStandards, /<a href="standards\.html" class="active">噪声标准<\/a>/);
  assert.match(zhStandards, /<a href="samples\.html">报告样例<\/a>/);
  assert.match(zhStandards, /<a href="noise-levels\.html">分贝等级<\/a>/);

  const locales = {
    zh: ['首页', '打开工具', '报告样例', '计量精度', '噪声标准', '分贝等级', '账户中心'],
    es: ['Inicio', 'Abrir app', 'Muestras', 'Precisión', 'Estándares', 'Niveles de ruido', 'Mi cuenta'],
    fr: ['Accueil', 'Ouvrir l’outil', 'Échantillons', 'Précision', 'Normes', 'Niveaux de bruit', 'Compte'],
    de: ['Start', 'Tool öffnen', 'Messberichte', 'Genauigkeit', 'Normen', 'Dezibel-Tabelle', 'Konto'],
    ja: ['ホーム', '測定ツール', 'サンプル', '測定精度', '環境基準', 'デシベル基準', 'アカウント'],
    ko: ['홈', '측정 도구', '샘플 리포트', '정밀도', '소음 기준', '데시벨 기준', '계정'],
    vi: ['Trang chủ', 'Mở ứng dụng', 'Mẫu báo cáo', 'Độ chính xác', 'Quy chuẩn', 'Mức decibel', 'Tài khoản'],
    th: ['หน้าแรก', 'เปิดเครื่องมือ', 'ตัวอย่างรายงาน', 'ความแม่นยำ', 'มาตรฐานเสียง', 'ระดับเดซิเบล', 'บัญชีผู้ใช้'],
  };

  Object.entries(locales).forEach(([code, labels]) => {
    const file = path.join(__dirname, '..', code, 'index.html');
    const html = fs.readFileSync(file, 'utf8');
    assert.match(html, /<div class="nav-links">/);
    labels.forEach((label) => {
      assert.ok(html.includes(label), `${code}/index.html contains nav label ${label}`);
    });
  });
});

test('all 9 locales and root index feature all 6 noise scenarios and 6 use-case cards', () => {
  const scenarioKeys = ['general', 'neighbor', 'construction', 'street', 'rental', 'traffic'];
  const useCaseFiles = [
    'neighbor-noise-evidence.html',
    'construction-noise-monitoring.html',
    'bar-street-disturbance.html',
    'rental-dispute-evidence.html',
    'property-noise-complaint-report.html',
    'workplace-noise-inspection.html'
  ];
  const allDirs = ['', 'zh', 'en', 'es', 'fr', 'de', 'ja', 'ko', 'vi', 'th'];

  allDirs.forEach((dir) => {
    const filePath = dir ? path.join(__dirname, '..', dir, 'index.html') : path.join(__dirname, '..', 'index.html');
    const html = fs.readFileSync(filePath, 'utf8');
    
    // Check all 6 scenario buttons
    scenarioKeys.forEach((key) => {
      assert.ok(html.includes(`data-scenario="${key}"`), `${filePath} contains scenario button ${key}`);
    });

    // Check all 6 use-case cards
    useCaseFiles.forEach((file) => {
      assert.ok(html.includes(file), `${filePath} contains use-case card for ${file}`);
    });
  });
});

test('soundtest.html verifies microphone permission and pops up permission modal on real-time monitor click if unauthorized', () => {
  const soundtestHtml = fs.readFileSync(path.join(__dirname, '..', 'soundtest.html'), 'utf8');
  assert.match(soundtestHtml, /id="permModal"/);
  assert.match(soundtestHtml, /id="permDeniedWarning"/);
  assert.match(soundtestHtml, /micPermissionGranted/);
  assert.match(soundtestHtml, /openPermissionModal/);
  assert.match(soundtestHtml, /if\(!opts\?\.fromAuthModal && !micPermissionGranted\)/);
  assert.match(soundtestHtml, /isIOS&&\(name==='microphone'\|\|name==='camera'\)/);
  assert.match(soundtestHtml, /Safari 浏览器 ➔ 麦克风/);
});

test('dedicated camera exists in all 9 locales, header logo is protected, and bottom nav features 5 items including camera', () => {
  const locales = ['zh', 'en', 'es', 'fr', 'de', 'ja', 'ko', 'vi', 'th'];
  
  // 1. Verify camera.html exists across all 9 locales + root
  assert.ok(fs.existsSync(path.join(__dirname, '..', 'camera.html')), 'root camera.html exists');
  locales.forEach((loc) => {
    const locCam = path.join(__dirname, '..', loc, 'camera.html');
    assert.ok(fs.existsSync(locCam), `${loc}/camera.html exists`);
    const content = fs.readFileSync(locCam, 'utf8');
    assert.match(content, /SOUNDTEST\.PRO/);
    assert.match(content, /cam-stage/);
    assert.match(content, /cam-watermark-overlay/);
  });

  // 2. Verify soundtest.html header does not crowd the brand logo
  const soundtestHtml = fs.readFileSync(path.join(__dirname, '..', 'soundtest.html'), 'utf8');
  assert.doesNotMatch(soundtestHtml, /class="app-header-actions"[\s\S]*?class="app-cam-nav-btn"/, 'camera button removed from top header');
  assert.match(soundtestHtml, /\.app-brand\{display:flex;align-items:center;gap:10px;min-width:max-content;flex-shrink:0;/);

  // 3. Verify bottom nav has 5 items including nt-cam
  assert.match(soundtestHtml, /id="nt-cam"/);
  assert.match(soundtestHtml, /href="camera\.html"/);
  assert.match(soundtestHtml, /setButtonTextWithSvg\('nt-cam'/);
});

test('settings hub card is aligned full-width and bottom nav is flush with compact mobile height', () => {
  const soundtestHtml = fs.readFileSync(path.join(__dirname, '..', 'soundtest.html'), 'utf8');
  const soundtestCss = fs.readFileSync(path.join(__dirname, '..', 'assets', 'soundtest.css'), 'utf8');
  const layoutFlowCss = fs.readFileSync(path.join(__dirname, '..', 'assets', 'layout-flow.css'), 'utf8');

  // 1. settingsHubCard must NOT have layout-settings-measure class
  assert.doesNotMatch(soundtestHtml, /class="card layout-settings-measure settings-hub-card"/, 'settingsHubCard must not have layout-settings-measure class');
  assert.match(soundtestHtml, /id="settingsHubCard"/);

  // 2. Settings hub and detail header must span full width
  assert.match(soundtestHtml, /#settingsHubCard,\s*\.settings-hub-card[\s\S]*?grid-column:\s*1\s*\/\s*-1/);
  assert.match(soundtestHtml, /#settingsDetailHeader,\s*\.settings-detail-header[\s\S]*?grid-column:\s*1\s*\/\s*-1/);

  // 3. Bottom bar must be flush to bottom (bottom: 0) without floating pill margin or radius
  assert.match(soundtestHtml, /\.bottom-shell\s*\{[\s\S]*?bottom:\s*0\s*!important/);
  assert.match(soundtestHtml, /\.bottom-shell\s*\{[\s\S]*?border-radius:\s*0\s*!important/);
  assert.match(soundtestCss, /\.bottom-shell\{[\s\S]*?bottom:0;/);

  // 4. Mobile nav buttons must have compact height
  assert.match(soundtestHtml, /\.nav-btn\s*\{[\s\S]*?min-height:\s*44px/);
  assert.match(soundtestHtml, /\.nav-btn svg\s*\{[\s\S]*?width:\s*18px/);
});

