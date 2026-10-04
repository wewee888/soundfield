import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

test('Super Admin membership endpoint /api/admin/membership authorization and operations', async () => {
  const adminMemPath = path.join(rootDir, 'functions/api/admin/membership.js');
  assert.ok(fs.existsSync(adminMemPath), 'admin/membership.js must exist');

  const adminMemModule = await import(`file://${adminMemPath.replace(/\\/g, '/')}`);

  const kv = new Map();
  const mockEnv = {
    ab_test: {
      get: async (k) => kv.get(k) || null,
      put: async (k, v) => kv.set(k, v),
      delete: async (k) => kv.delete(k),
    },
  };

  // 1. Non-admin unauthorized
  const unauthReq = new Request('https://soundtest.pro/api/admin/membership', {
    method: 'POST',
    headers: { 'content-type': 'application/json', 'x-admin-email': 'stranger@example.com' },
    body: JSON.stringify({ target_email: 'user@example.com', plan: 'pro' }),
  });
  const unauthRes = await adminMemModule.onRequestPost({ request: unauthReq, env: mockEnv });
  assert.equal(unauthRes.status, 403);
  const unauthData = await unauthRes.json();
  assert.equal(unauthData.ok, false);

  // 2. Super admin wewee1@gmail.com grants Team tier to a user
  const targetEmail = 'vip_client@example.com';
  const grantReq = new Request('https://soundtest.pro/api/admin/membership', {
    method: 'POST',
    headers: { 'content-type': 'application/json', 'x-admin-email': 'wewee1@gmail.com' },
    body: JSON.stringify({
      admin_email: 'wewee1@gmail.com',
      target_email: targetEmail,
      plan: 'team',
      duration_days: 365,
    }),
  });
  const grantRes = await adminMemModule.onRequestPost({ request: grantReq, env: mockEnv });
  assert.equal(grantRes.status, 200);
  const grantData = await grantRes.json();
  assert.equal(grantData.ok, true);
  assert.equal(grantData.record.plan, 'team');
  assert.equal(grantData.record.status, 'paid');
  assert.ok(kv.has(`member:${targetEmail}`));

  // 3. Super admin queries membership
  const queryReq = new Request(`https://soundtest.pro/api/admin/membership?email=${encodeURIComponent(targetEmail)}`, {
    method: 'GET',
    headers: { 'x-admin-email': 'wewee1@gmail.com' },
  });
  const queryRes = await adminMemModule.onRequestGet({ request: queryReq, env: mockEnv });
  assert.equal(queryRes.status, 200);
  const queryData = await queryRes.json();
  assert.equal(queryData.ok, true);
  assert.equal(queryData.membership.plan, 'team');
  assert.equal(queryData.membership.status, 'paid');
});

test('Session and verify-magic automatically grant wewee1@gmail.com Team tier and admin role', async () => {
  const sessionPath = path.join(rootDir, 'functions/api/auth/session.js');
  const verifyMagicPath = path.join(rootDir, 'functions/api/auth/verify-magic.js');

  const sessionModule = await import(`file://${sessionPath.replace(/\\/g, '/')}`);
  const verifyMagicModule = await import(`file://${verifyMagicPath.replace(/\\/g, '/')}`);

  const kv = new Map();
  const mockEnv = {
    ab_test: {
      get: async (k) => kv.get(k) || null,
      put: async (k, v) => kv.set(k, v),
      delete: async (k) => kv.delete(k),
    },
  };

  // Session verification for wewee1@gmail.com
  kv.set('sess:test_wewee_token', JSON.stringify({
    email: 'wewee1@gmail.com',
    plan: 'free',
    created_at: new Date().toISOString(),
    expires_at: new Date(Date.now() + 86400000).toISOString(),
  }));
  const sessionReq = new Request('https://soundtest.pro/api/auth/session', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ token: 'test_wewee_token' }),
  });
  const sessionRes = await sessionModule.onRequestPost({ request: sessionReq, env: mockEnv });
  assert.equal(sessionRes.status, 200);
  const sessionData = await sessionRes.json();
  assert.equal(sessionData.valid, true);
  assert.equal(sessionData.membership.plan, 'team');
  assert.equal(sessionData.membership.role, 'admin');

  // Verify-magic for wewee1@gmail.com
  kv.set('magic_code:wewee1@gmail.com', JSON.stringify({
    email: 'wewee1@gmail.com',
    code: '123456',
    token: 'test_token_123',
  }));
  const verifyReq = new Request('https://soundtest.pro/api/auth/verify-magic', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ email: 'wewee1@gmail.com', code: '123456' }),
  });
  const verifyRes = await verifyMagicModule.onRequestPost({ request: verifyReq, env: mockEnv });
  assert.equal(verifyRes.status, 200);
  const verifyData = await verifyRes.json();
  assert.equal(verifyData.ok, true);
  assert.equal(verifyData.membership.plan, 'team');
  assert.equal(verifyData.membership.role, 'admin');
});

test('UI templates contain admin console card, close button, and friendly subtab labels', () => {
  const zhAuthHtml = fs.readFileSync(path.join(rootDir, 'zh/auth.html'), 'utf8');
  const enAuthHtml = fs.readFileSync(path.join(rootDir, 'auth.html'), 'utf8');
  const authCss = fs.readFileSync(path.join(rootDir, 'assets/auth.css'), 'utf8');
  const experienceJs = fs.readFileSync(path.join(rootDir, 'assets/site-experience.js'), 'utf8');

  // Friendly terminology (no naked confusing "magic link" jargon)
  assert.ok(zhAuthHtml.includes('邮箱验证码 / 免密快捷登录'), 'zh/auth.html has friendly subtab');
  assert.ok(enAuthHtml.includes('Email Code / One-Click Login'), 'auth.html has friendly subtab');

  // Admin console card present
  assert.ok(zhAuthHtml.includes('id="adminConsoleCard"'), 'zh/auth.html has admin console card');
  assert.ok(enAuthHtml.includes('id="adminConsoleCard"'), 'auth.html has admin console card');

  // CSS label styling cleanly separates label above input (no text crowding/overlap)
  assert.ok(authCss.includes('flex-direction: column-reverse;'), 'auth.css separates label above input');
  assert.ok(authCss.includes('.dash-admin-card'), 'auth.css has .dash-admin-card style');

  // PWA banner has close button and guide modal
  assert.ok(experienceJs.includes('pwa-close-btn'), 'site-experience.js has close button');
  assert.ok(experienceJs.includes('openPwaGuideModal'), 'site-experience.js has install guide modal');
});

test('Mobile anti-transcoding, interactive watermark camera, and multi-tier geo fallback', async () => {
  const soundtestHtml = fs.readFileSync(path.join(rootDir, 'soundtest.html'), 'utf8');
  const headersFile = fs.readFileSync(path.join(rootDir, '_headers'), 'utf8');
  const geoReversePath = path.join(rootDir, 'functions/api/geo/reverse.js');
  const siteCss = fs.readFileSync(path.join(rootDir, 'assets/site.css'), 'utf8');
  const authCss = fs.readFileSync(path.join(rootDir, 'assets/auth.css'), 'utf8');

  // Anti-transcoding & anti-ad injection while retaining 51.la analytics
  assert.ok(headersFile.includes('Cache-Control: no-transform, no-siteapp'), '_headers prevents carrier transcoding');
  assert.ok(soundtestHtml.includes('meta http-equiv="Cache-Control" content="no-siteapp"'), 'soundtest.html has no-siteapp meta');
  assert.ok(soundtestHtml.includes('meta http-equiv="Cache-Control" content="no-transform"'), 'soundtest.html has no-transform meta');
  assert.ok(soundtestHtml.includes('sdk.51.la'), 'soundtest.html retains 51.la tracking script');
  assert.ok(soundtestHtml.includes('281wblDNvub2tk9f'), 'soundtest.html retains 51.la account id');
  assert.ok(soundtestHtml.includes('[id*="baidu_transcode"]'), 'soundtest.html contains defensive ad suppression CSS');

  // Mobile 2-column footer layout (两排两列)
  assert.ok(siteCss.includes('grid-template-columns: repeat(2, minmax(0, 1fr));'), 'site.css has 2-column mobile footer');
  assert.ok(siteCss.includes('grid-column: 1 / -1;'), 'site.css spans footer brand across both columns');

  // Mobile auth page first-screen form visibility
  assert.ok(authCss.includes('.auth-brand {\n    display: contents;\n  }'), 'auth.css unwraps auth-brand on mobile');
  assert.ok(authCss.includes('.auth-form-panel {\n    order: 2;'), 'auth.css places form panel first on mobile');

  // Interactive watermark camera overlays
  assert.ok(soundtestHtml.includes('id="watermarkMonitoringPill" onclick="toggleMon({fromAuthModal:true})"'), 'monitoring pill is clickable');
  assert.ok(soundtestHtml.includes('id="watermarkDbCard" onclick="toggleMon({fromAuthModal:true})"'), 'dB card is clickable');

  // Multi-tier geo fallback
  assert.ok(soundtestHtml.includes('async function fallbackIpLocation()'), 'soundtest.html defines fallbackIpLocation');
  assert.ok(soundtestHtml.includes('tryLowAccuracy'), 'getLoc falls back to low-accuracy network');
  assert.ok(soundtestHtml.includes('/api/geo/reverse?mode=ip'), 'getLoc calls IP fallback');

  // Geo reverse endpoint supports IP fallback mode
  const geoModule = await import(`file://${geoReversePath.replace(/\\/g, '/')}`);
  const mockCfReq = new Request('https://soundtest.pro/api/geo/reverse?mode=ip');
  mockCfReq.cf = { latitude: '31.2304', longitude: '121.4737', city: 'Shanghai', country: 'CN' };
  const geoRes = await geoModule.onRequestGet({ request: mockCfReq, env: {} });
  assert.equal(geoRes.status, 200);
  const geoData = await geoRes.json();
  assert.equal(geoData.ok, true);
  assert.equal(geoData.isIp, true);
  assert.ok(geoData.lat && geoData.lng, 'IP geo returns lat and lng');
});

test('Privacy notice / cookie consent: excluded for China and non-GDPR regions, localized for EU', () => {
  const experienceJs = fs.readFileSync(path.join(rootDir, 'assets/site-experience.js'), 'utf8');

  // Verify GDPR country list exists and includes EU countries but excludes CN/US/JP/KR
  const gdprMatch = experienceJs.match(/const GDPR_COUNTRIES = \[([\s\S]*?)\];/);
  assert.ok(gdprMatch, 'GDPR_COUNTRIES array exists');
  const gdprList = gdprMatch[1];
  assert.ok(gdprList.includes("'DE'"), 'GDPR list includes Germany');
  assert.ok(gdprList.includes("'FR'"), 'GDPR list includes France');
  assert.ok(gdprList.includes("'GB'"), 'GDPR list includes UK');
  assert.ok(!gdprList.includes("'CN'"), 'GDPR list excludes China');
  assert.ok(!gdprList.includes("'JP'"), 'GDPR list excludes Japan');
  assert.ok(!gdprList.includes("'US'"), 'GDPR list excludes United States');

  // Verify China user exclusion logic
  assert.ok(experienceJs.includes('function isChinaUser()'), 'defines isChinaUser check');
  assert.ok(experienceJs.includes("if (country === 'CN'"), 'excludes CN country');
  assert.ok(experienceJs.includes("if (locale === 'zh') return true;"), 'excludes zh locale');
  assert.ok(experienceJs.includes('Shanghai'), 'checks Chinese timezones');

  // Verify non-GDPR editions exclusion
  assert.ok(experienceJs.includes("['zh', 'ja', 'ko', 'vi', 'th'].includes(locale)"), 'excludes non-GDPR Asian locales');

  // Verify multi-language localization (not English for all)
  assert.ok(experienceJs.includes('Datenschutz'), 'has German localization');
  assert.ok(experienceJs.includes('Confidentialité'), 'has French localization');
  assert.ok(experienceJs.includes('Privacidad'), 'has Spanish localization');
  assert.ok(experienceJs.includes('Privacy Notice'), 'has English localization');
});

test('Dedicated Camera standalone page, Pro showcase card, and SEO integration', () => {
  const cameraHtml = fs.readFileSync(path.join(rootDir, 'camera.html'), 'utf8');
  const zhCameraHtml = fs.readFileSync(path.join(rootDir, 'zh/camera.html'), 'utf8');
  const soundtestHtml = fs.readFileSync(path.join(rootDir, 'soundtest.html'), 'utf8');
  const sitemapXml = fs.readFileSync(path.join(rootDir, 'sitemap.xml'), 'utf8');
  const indexHtml = fs.readFileSync(path.join(rootDir, 'index.html'), 'utf8');
  const zhIndexHtml = fs.readFileSync(path.join(rootDir, 'zh/index.html'), 'utf8');

  // camera.html standalone setup
  assert.ok(cameraHtml.includes('assets/camera.css'), 'camera.html loads camera.css');
  assert.ok(cameraHtml.includes('assets/camera.js'), 'camera.html loads camera.js');
  assert.ok(cameraHtml.includes('LA.init({id:"281wblDNvub2tk9f"'), 'camera.html has 51.la analytics');
  assert.ok(cameraHtml.includes('hudDb'), 'camera.html has real-time hudDb');
  assert.ok(cameraHtml.includes('shutterBtn'), 'camera.html has shutter button');

  // zh/camera.html localized setup
  assert.ok(zhCameraHtml.includes('../assets/camera.css'), 'zh/camera.html loads relative camera.css');
  assert.ok(zhCameraHtml.includes('../assets/camera.js'), 'zh/camera.html loads relative camera.js');

  // Pro showcase card in core meter
  assert.ok(soundtestHtml.includes('proShowcaseCard'), 'soundtest.html has Pro showcase card');
  assert.ok(soundtestHtml.includes('forensic_report_preview.webp'), 'soundtest.html displays forensic report preview image');
  assert.ok(soundtestHtml.includes('href="camera.html"'), 'soundtest.html links to dedicated camera page');

  // SEO & sitemap integration
  assert.ok(sitemapXml.includes('https://soundtest.pro/camera.html'), 'sitemap.xml contains camera.html URL');
  assert.ok(indexHtml.includes('camera.html'), 'index.html footer links to camera');
  assert.ok(zhIndexHtml.includes('camera.html'), 'zh/index.html footer links to camera');
});

test('Runtime script safety: declarations, 51.la guarding, and permission modal stability', () => {
  const soundtestHtml = fs.readFileSync(path.join(rootDir, 'soundtest.html'), 'utf8');

  // Verify variable declarations prevent ReferenceErrors
  assert.ok(soundtestHtml.includes('let capHideTmr=null;'), 'capHideTmr is declared');
  assert.ok(soundtestHtml.includes('longMonitorNoiseEvents=noiseEvents'), 'longMonitorNoiseEvents is defined and aliased to noiseEvents');

  // Verify 51.la script is guarded against network/adblock failure
  assert.ok(soundtestHtml.includes('try{window.LA&&LA.init'), '51.la script is safely guarded with try and existence check');

  // Verify permission modal is hidden by default in markup to prevent blocking clicks
  assert.ok(soundtestHtml.includes('class="perm-modal hidden"'), 'permModal has hidden class in initial markup');
  assert.ok(soundtestHtml.includes('id="permModal"') && soundtestHtml.includes('style="display:none;"'), 'permModal has display:none in initial markup');

  // Verify toggleMon does not rethrow unconditionally causing unhandled promise rejections
  assert.ok(soundtestHtml.includes('if(opts?.rethrow)throw e;'), 'toggleMon guards rethrowing with opts.rethrow');
});



