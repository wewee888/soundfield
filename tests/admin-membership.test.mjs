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

test('Language switching: immediate flag/label sync and complete bilingual translation of evidence mode and Pro cards', () => {
  const soundtestHtml = fs.readFileSync(path.join(rootDir, 'soundtest.html'), 'utf8');
  const langFlagsJs = fs.readFileSync(path.join(rootDir, 'assets/lang-flags.js'), 'utf8');

  // 1. Immediate visual feedback in lang-flags.js
  assert.ok(langFlagsJs.includes('// Immediate visual update to eliminate any possible UI lag'), 'lang-flags updates immediately');
  assert.ok(langFlagsJs.includes("btn.querySelector('.lang-picker-flag')"), 'updates flag img element');
  assert.ok(langFlagsJs.includes("btn.querySelector('.lang-picker-label')"), 'updates label text element');

  // 2. setAppLanguage prioritizes picker update and translates Pro cards
  assert.ok(soundtestHtml.includes('// 1. Immediately sync pickers so header responds without delay'), 'picker synced first');
  assert.ok(soundtestHtml.includes('translateProShowcaseCard();'), 'calls translateProShowcaseCard');
  assert.ok(soundtestHtml.includes('translateReportPreviewModal();'), 'calls translateReportPreviewModal');

  // 3. Pro showcase card IDs and bilingual translation
  const proCardIds = [
    'pscBadge', 'pscTitle', 'pscDesc', 'pscImgHint',
    'pscFeat1T', 'pscFeat1D', 'pscFeat2T', 'pscFeat2D',
    'pscFeat3T', 'pscFeat3D', 'pscFeat4T', 'pscFeat4D',
    'pscMainBtn', 'pscCamLink'
  ];
  proCardIds.forEach(id => {
    assert.ok(soundtestHtml.includes(`id="${id}"`), `soundtest.html contains element #${id}`);
  });
  assert.ok(soundtestHtml.includes('★ PRO FORENSIC EVIDENCE · Professional Noise Report'), 'has English pro badge');
  assert.ok(soundtestHtml.includes('Formal Acoustic Evidence with SHA-256 Digital Fingerprint'), 'has English pro title');
  assert.ok(soundtestHtml.includes('★ View Sample Report / Unlock Pro'), 'has English pro cta button');
  assert.ok(soundtestHtml.includes('📷 Open Evidence Camera ↗'), 'has English pro camera link');

  // 4. Evidence mode copy and language-aware fallbacks
  assert.ok(soundtestHtml.includes('● Start Audio Evidence'), 'modeCopy has English audio start');
  assert.ok(soundtestHtml.includes('📹 Start Evidence Video'), 'modeCopy has English video start');
  assert.ok(soundtestHtml.includes('📷 Capture Evidence Photo'), 'modeCopy has English photo start');
  assert.ok(soundtestHtml.includes("isZh?'取证存证模式（自动入库 · 生成法律报告）':'Evidence Mode (Auto-Vault & Formal Report)'"), 'modeCardLabel fallback is bilingual');
  assert.ok(soundtestHtml.includes("isZh?'获取/刷新地址':'Update Address'"), 'modeLocationBtn fallback is bilingual');
  assert.ok(soundtestHtml.includes("isZh?'查看证据库':'Records'"), 'modeRecordsBtn fallback is bilingual');
});

test('Membership lookup endpoint /api/membership/lookup and soundtest.html auto-grant wewee1@gmail.com', async () => {
  const lookupPath = path.join(rootDir, 'functions/api/membership/lookup.js');
  assert.ok(fs.existsSync(lookupPath), 'lookup.js must exist');

  const lookupModule = await import(`file://${lookupPath.replace(/\\/g, '/')}`);

  const kv = new Map();
  const mockEnv = {
    ab_test: {
      get: async (k) => kv.get(k) || null,
      put: async (k, v) => kv.set(k, v),
      delete: async (k) => kv.delete(k),
    },
  };

  // Test wewee1@gmail.com lookup auto-grant
  const lookupReq = new Request('https://soundtest.pro/api/membership/lookup', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ email: 'wewee1@gmail.com' }),
  });
  const lookupRes = await lookupModule.onRequestPost({ request: lookupReq, env: mockEnv });
  assert.equal(lookupRes.status, 200);
  const lookupData = await lookupRes.json();
  assert.equal(lookupData.active, true);
  assert.equal(lookupData.plan, 'team');
  assert.equal(lookupData.role, 'admin');
  assert.equal(lookupData.status, 'paid');
  assert.ok(kv.has('member:wewee1@gmail.com'));

  // Test soundtest.html contains currentPlanLabel dynamic update and superadmin bypass
  const soundtestHtml = fs.readFileSync(path.join(rootDir, 'soundtest.html'), 'utf8');
  assert.ok(soundtestHtml.includes("isSuperAdmin = email.toLowerCase() === 'wewee1@gmail.com'"), 'soundtest.html has isSuperAdmin check');
  assert.ok(soundtestHtml.includes("planLabel.textContent = membershipState.plan.toUpperCase()"), 'soundtest.html updates planLabel');
  assert.ok(soundtestHtml.includes("email.toLowerCase() === 'wewee1@gmail.com'"), 'soundtest.html lookupMembership has superadmin bypass');
});

test('Admin orders API /api/admin/orders calculates conversion funnel and executes order actions', async () => {
  const ordersPath = path.join(rootDir, 'functions/api/admin/orders.js');
  assert.ok(fs.existsSync(ordersPath), 'orders.js must exist');
  const ordersModule = await import(`file://${ordersPath.replace(/\\/g, '/')}`);

  const kv = new Map();
  // Seed sample data: 3 orders (2 paid, 1 unpaid), 2 users, 1 member
  kv.set('order:ord_001', JSON.stringify({
    trade_order_id: 'ord_001',
    plan: 'pro',
    fee: '9.90',
    currency: 'CNY',
    status: 'paid',
    email: 'alice@example.com',
    created_at: new Date().toISOString(),
    paid_at: new Date().toISOString(),
  }));
  kv.set('order:ord_002', JSON.stringify({
    trade_order_id: 'ord_002',
    plan: 'yearly',
    fee: '19.90',
    currency: 'CNY',
    status: 'pending',
    email: 'bob@example.com',
    created_at: new Date().toISOString(),
  }));
  kv.set('order:ord_003', JSON.stringify({
    trade_order_id: 'ord_003',
    plan: 'single',
    fee: '1.99',
    currency: 'USD',
    provider: 'creem',
    status: 'paid',
    email: 'charlie@example.com',
    created_at: new Date().toISOString(),
    paid_at: new Date().toISOString(),
  }));

  kv.set('user:alice@example.com', JSON.stringify({
    name: 'Alice',
    email: 'alice@example.com',
    createdAt: new Date().toISOString(),
  }));
  kv.set('user:bob@example.com', JSON.stringify({
    name: 'Bob',
    email: 'bob@example.com',
    createdAt: new Date().toISOString(),
  }));

  kv.set('member:alice@example.com', JSON.stringify({
    plan: 'pro',
    plan_display: 'pro',
    status: 'paid',
    expires_at: new Date(Date.now() + 86400000 * 30).toISOString(),
    granted_at: new Date().toISOString(),
  }));

  const mockEnv = {
    ADMIN_SECRET: 'soundtest_admin_2026',
    ab_test: {
      get: async (k) => kv.get(k) || null,
      put: async (k, v) => kv.set(k, v),
      delete: async (k) => kv.delete(k),
      list: async ({ prefix }) => {
        const matchingKeys = Array.from(kv.keys())
          .filter((k) => k.startsWith(prefix))
          .map((name) => ({ name }));
        return { keys: matchingKeys };
      },
    },
  };

  // 1. Unauthorized request
  const unauthReq = new Request('https://soundtest.pro/api/admin/orders');
  const unauthRes = await ordersModule.onRequestGet({ request: unauthReq, env: mockEnv });
  assert.equal(unauthRes.status, 401);

  // 2. Authorized request: check conversion funnel calculations
  const authReq = new Request('https://soundtest.pro/api/admin/orders', {
    headers: { 'Authorization': 'Bearer soundtest_admin_2026' },
  });
  const authRes = await ordersModule.onRequestGet({ request: authReq, env: mockEnv });
  assert.equal(authRes.status, 200);
  const data = await authRes.json();
  assert.equal(data.ok, true);
  assert.equal(data.stats.totalOrders, 3);
  assert.equal(data.stats.paidOrders, 2);
  assert.equal(data.stats.unpaidOrders, 1);
  assert.equal(data.stats.conversionRate, '66.7%');
  assert.equal(data.stats.dropRate, '33.3%');
  assert.equal(data.stats.totalRevenueCny, '9.90');
  assert.equal(data.stats.unpaidRevenueCny, '19.90');
  assert.equal(data.stats.totalRevenueUsd, '1.99');
  assert.equal(data.stats.totalUsers, 2);
  assert.equal(data.stats.paidUsersCount, 1);
  assert.equal(data.stats.payingUserRatio, '50.0%');

  // Verify users array has merged intelligence
  assert.equal(data.users.length, 2);
  const aliceUser = data.users.find((u) => u.email === 'alice@example.com');
  assert.ok(aliceUser);
  assert.equal(aliceUser.is_vip, true);
  assert.equal(aliceUser.plan, 'pro');

  // 3. Mark unpaid order as paid
  const markReq = new Request('https://soundtest.pro/api/admin/orders', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'Authorization': 'Bearer soundtest_admin_2026',
    },
    body: JSON.stringify({ action: 'mark_paid', order_id: 'ord_002', note: '微信转账核销' }),
  });
  const markRes = await ordersModule.onRequestPost({ request: markReq, env: mockEnv });
  assert.equal(markRes.status, 200);
  const markData = await markRes.json();
  assert.equal(markData.ok, true);
  assert.equal(markData.member_granted, true);

  // Verify Bob now has member record in KV
  assert.ok(kv.has('member:bob@example.com'));
  const bobMember = JSON.parse(kv.get('member:bob@example.com'));
  assert.equal(bobMember.status, 'paid');
});

test('Admin users API /api/admin/users allows query and membership adjustments', async () => {
  const usersPath = path.join(rootDir, 'functions/api/admin/users.js');
  assert.ok(fs.existsSync(usersPath), 'users.js must exist');
  const usersModule = await import(`file://${usersPath.replace(/\\/g, '/')}`);

  const kv = new Map();
  kv.set('user:member_test@example.com', JSON.stringify({
    name: 'Member Test',
    email: 'member_test@example.com',
    createdAt: new Date().toISOString(),
  }));

  const mockEnv = {
    ADMIN_SECRET: 'soundtest_admin_2026',
    ab_test: {
      get: async (k) => kv.get(k) || null,
      put: async (k, v) => kv.set(k, v),
      delete: async (k) => kv.delete(k),
      list: async ({ prefix }) => {
        const matchingKeys = Array.from(kv.keys())
          .filter((k) => k.startsWith(prefix))
          .map((name) => ({ name }));
        return { keys: matchingKeys };
      },
    },
  };

  // Adjust VIP tier to Team
  const adjustReq = new Request('https://soundtest.pro/api/admin/users', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'Authorization': 'Bearer soundtest_admin_2026',
    },
    body: JSON.stringify({
      action: 'adjust_vip',
      email: 'member_test@example.com',
      plan: 'team',
      days: 365,
    }),
  });
  const adjustRes = await usersModule.onRequestPost({ request: adjustReq, env: mockEnv });
  assert.equal(adjustRes.status, 200);
  const adjustData = await adjustRes.json();
  assert.equal(adjustData.ok, true);
  assert.equal(adjustData.plan, 'team');

  // Verify KV written
  assert.ok(kv.has('member:member_test@example.com'));
  const mem = JSON.parse(kv.get('member:member_test@example.com'));
  assert.equal(mem.plan, 'team');
  assert.equal(mem.status, 'paid');

  // Test edit_user profile & country/language
  const editReq = new Request('https://soundtest.pro/api/admin/users', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'Authorization': 'Bearer soundtest_admin_2026',
    },
    body: JSON.stringify({
      action: 'edit_user',
      email: 'member_test@example.com',
      name: 'Jeannie Reaves',
      country: 'US',
      language: 'en-US',
      plan: 'yearly',
      days: 365,
    }),
  });
  const editRes = await usersModule.onRequestPost({ request: editReq, env: mockEnv });
  assert.equal(editRes.status, 200);
  const editData = await editRes.json();
  assert.equal(editData.ok, true);

  const updatedRaw = JSON.parse(kv.get('user:member_test@example.com'));
  assert.equal(updatedRaw.name, 'Jeannie Reaves');
  assert.equal(updatedRaw.country, 'US');
  assert.equal(updatedRaw.language, 'en-US');

  // Test delete_user
  const delReq = new Request('https://soundtest.pro/api/admin/users', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'Authorization': 'Bearer soundtest_admin_2026',
    },
    body: JSON.stringify({
      action: 'delete_user',
      email: 'member_test@example.com',
    }),
  });
  const delRes = await usersModule.onRequestPost({ request: delReq, env: mockEnv });
  assert.equal(delRes.status, 200);
  assert.equal(kv.has('user:member_test@example.com'), false);
  assert.equal(kv.has('member:member_test@example.com'), false);
});

test('Admin analytics API /api/admin/analytics calculates traffic, funnel and attribution', async () => {
  const anlPath = path.join(rootDir, 'functions/api/admin/analytics.js');
  assert.ok(fs.existsSync(anlPath), 'analytics.js must exist');
  const anlModule = await import(`file://${anlPath.replace(/\\/g, '/')}`);

  const kv = new Map();
  // Set up 2 users: one US, one CN
  kv.set('user:jeannie@example.com', JSON.stringify({
    name: 'Jeannie Reaves',
    email: 'jeannie@example.com',
    country: 'US',
    language: 'en',
    sourcePage: '/soundtest.html',
    createdAt: new Date().toISOString(),
  }));
  kv.set('user:zhang@example.com', JSON.stringify({
    name: '张三',
    email: 'zhang@example.com',
    country: 'CN',
    language: 'zh-CN',
    sourcePage: '/zh/use-cases/apartment-noise.html',
    createdAt: new Date().toISOString(),
  }));

  // Set up orders
  kv.set('order:ord_1', JSON.stringify({
    order_id: 'ord_1',
    status: 'paid',
    fee: '19.90',
    currency: 'CNY',
  }));
  kv.set('order:ord_2', JSON.stringify({
    order_id: 'ord_2',
    status: 'pending',
    fee: '24.99',
    currency: 'USD',
  }));

  const mockEnv = {
    ADMIN_SECRET: 'soundtest_admin_2026',
    ab_test: {
      get: async (k) => kv.get(k) || null,
      put: async (k, v) => kv.set(k, v),
      delete: async (k) => kv.delete(k),
      list: async ({ prefix }) => {
        const matchingKeys = Array.from(kv.keys())
          .filter((k) => k.startsWith(prefix))
          .map((name) => ({ name }));
        return { keys: matchingKeys };
      },
    },
  };

  const req = new Request('https://soundtest.pro/api/admin/analytics', {
    method: 'GET',
    headers: {
      'Authorization': 'Bearer soundtest_admin_2026',
    },
  });
  const res = await anlModule.onRequestGet({ request: req, env: mockEnv });
  assert.equal(res.status, 200);
  const data = await res.json();
  assert.equal(data.ok, true);
  assert.equal(data.funnel.registered, 2);
  assert.equal(data.funnel.checkouts, 2);
  assert.equal(data.funnel.paid, 1);
  assert.ok(data.registrationPages.length >= 2);
  assert.ok(data.countries.some((c) => c.code === 'US'));
  assert.ok(data.countries.some((c) => c.code === 'CN'));
});

test('Admin send-email API /api/admin/send-email dispatches dunning emails and updates order stats', async () => {
  const sendEmailPath = path.join(rootDir, 'functions/api/admin/send-email.js');
  assert.ok(fs.existsSync(sendEmailPath), 'send-email.js must exist');
  const sendEmailModule = await import(`file://${sendEmailPath.replace(/\\/g, '/')}`);

  const kv = new Map();
  kv.set('order:creem_999', JSON.stringify({
    order_id: 'creem_999',
    plan: 'yearly',
    fee: '24.99',
    currency: 'USD',
    email: 'boodoll2018@gmail.com',
    status: 'pending',
  }));

  const mockEnv = {
    ADMIN_SECRET: 'soundtest_admin_2026',
    ab_test: {
      get: async (k) => kv.get(k) || null,
      put: async (k, v) => kv.set(k, v),
      delete: async (k) => kv.delete(k),
    },
  };

  // Test dry-run preview
  const dryReq = new Request('https://soundtest.pro/api/admin/send-email', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'Authorization': 'Bearer soundtest_admin_2026',
    },
    body: JSON.stringify({
      to: 'boodoll2018@gmail.com',
      name: 'Jeannie Reaves',
      orderId: 'creem_999',
      plan: 'yearly',
      amount: '$24.99',
      currency: 'USD',
      templateId: 'discount_24h',
      dryRun: true,
    }),
  });
  const dryRes = await sendEmailModule.onRequestPost({ request: dryReq, env: mockEnv });
  assert.equal(dryRes.status, 200);
  const dryData = await dryRes.json();
  assert.equal(dryData.ok, true);
  assert.ok(dryData.html.includes('15%'));
  assert.ok(dryData.subject.includes('15% OFF'));

  // Test simulation dispatch
  const sendReq = new Request('https://soundtest.pro/api/admin/send-email', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'Authorization': 'Bearer soundtest_admin_2026',
    },
    body: JSON.stringify({
      to: 'boodoll2018@gmail.com',
      name: 'Jeannie Reaves',
      orderId: 'creem_999',
      plan: 'yearly',
      amount: '$24.99',
      currency: 'USD',
      templateId: 'abandoned_1h',
    }),
  });
  const sendRes = await sendEmailModule.onRequestPost({ request: sendReq, env: mockEnv });
  assert.equal(sendRes.status, 200);
  const sendData = await sendRes.json();
  assert.equal(sendData.ok, true);

  // Check KV was updated with dunning stats
  const ordAfter = JSON.parse(kv.get('order:creem_999'));
  assert.equal(ordAfter.dunning_count, 1);
  assert.ok(ordAfter.last_dunning_at);
  assert.equal(ordAfter.last_dunning_template, 'abandoned_1h');
});

test('User first login confirmation, browsing history trail, and minute-precision UI display', async () => {
  const registerPath = path.join(rootDir, 'functions/api/auth/register.js');
  const sessionPath = path.join(rootDir, 'functions/api/auth/session.js');
  const checkoutPath = path.join(rootDir, 'functions/api/membership/create-checkout.js');
  const adminUsersPath = path.join(rootDir, 'functions/api/admin/users.js');

  const registerModule = await import(`file://${registerPath.replace(/\\/g, '/')}`);
  const sessionModule = await import(`file://${sessionPath.replace(/\\/g, '/')}`);
  const checkoutModule = await import(`file://${checkoutPath.replace(/\\/g, '/')}`);
  const adminUsersModule = await import(`file://${adminUsersPath.replace(/\\/g, '/')}`);

  const kv = new Map();
  const mockEnv = {
    ab_test: {
      get: async (k) => kv.get(k) || null,
      put: async (k, v) => kv.set(k, v),
      delete: async (k) => kv.delete(k),
      list: async ({ prefix }) => {
        const keys = [];
        for (const k of kv.keys()) {
          if (k.startsWith(prefix)) keys.push({ name: k });
        }
        return { keys };
      },
    },
  };

  const testUserEmail = 'traveler_jeannie@example.com';

  // 1. User registers
  const regReq = new Request('https://soundtest.pro/api/auth/register', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'cf-connecting-ip': '72.14.201.2',
      'cf-ipcountry': 'US',
    },
    body: JSON.stringify({
      name: 'Jeannie Reaves',
      email: testUserEmail,
      passwordHash: '9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08',
      lang: 'en',
      sourcePage: '/en/auth.html?mode=register',
    }),
  });

  const regRes = await registerModule.onRequestPost({ request: regReq, env: mockEnv });
  assert.equal(regRes.status, 200);
  const regData = await regRes.json();
  assert.equal(regData.ok, true);
  assert.ok(regData.session_token);

  // Verify KV user record initially has pending first login status
  const userRecAfterReg = JSON.parse(kv.get(`user:${testUserEmail}`));
  assert.equal(userRecAfterReg.firstLoginConfirmed, false);
  assert.equal(userRecAfterReg.firstLoginAt, null);
  assert.equal(userRecAfterReg.loginStatus, 'pending_first_login');

  // Verify initial history created
  const historyAfterReg = JSON.parse(kv.get(`history:${testUserEmail}`));
  assert.ok(Array.isArray(historyAfterReg));
  assert.equal(historyAfterReg.length, 1);
  assert.equal(historyAfterReg[0].action, 'register');

  // 2. Client loads a page with the session token -> silentSessionRefresh executes /api/auth/session
  const sessReq = new Request('https://soundtest.pro/api/auth/session', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'cf-connecting-ip': '72.14.201.2',
      'cf-ipcountry': 'US',
    },
    body: JSON.stringify({
      token: regData.session_token,
      page: '/measure/',
      title: 'Real-time Sound Level Meter',
      referrer: '/en/auth.html',
    }),
  });

  const sessRes = await sessionModule.onRequestPost({ request: sessReq, env: mockEnv });
  assert.equal(sessRes.status, 200);
  const sessData = await sessRes.json();
  assert.equal(sessData.valid, true);
  assert.equal(sessData.first_login_confirmed, true);
  assert.ok(sessData.last_login_at);

  // Verify user record now confirmed first login
  const userRecAfterSess = JSON.parse(kv.get(`user:${testUserEmail}`));
  assert.equal(userRecAfterSess.firstLoginConfirmed, true);
  assert.ok(userRecAfterSess.firstLoginAt);
  assert.ok(userRecAfterSess.lastLoginAt);
  assert.equal(userRecAfterSess.loginCount, 1);

  // 3. User initiates checkout
  const chkReq = new Request('https://soundtest.pro/api/membership/create-checkout', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'cf-connecting-ip': '72.14.201.2',
      'cf-ipcountry': 'US',
    },
    body: JSON.stringify({
      email: testUserEmail,
      plan: 'pro',
    }),
  });
  const chkRes = await checkoutModule.onRequestPost({ request: chkReq, env: mockEnv });
  assert.equal(chkRes.status, 200);

  // Verify browsing history contains registration, pageview, and checkout events
  const historyAfterChk = JSON.parse(kv.get(`history:${testUserEmail}`));
  assert.ok(historyAfterChk.length >= 3);
  assert.equal(historyAfterChk[0].action, 'checkout_open');
  assert.equal(historyAfterChk[1].action, 'page_view');
  assert.equal(historyAfterChk[2].action, 'register');

  // 4. Admin queries user details with browsing history
  const adminQueryReq = new Request(`https://soundtest.pro/api/admin/users?email=${encodeURIComponent(testUserEmail)}`, {
    method: 'GET',
    headers: {
      'content-type': 'application/json',
      'Authorization': 'Bearer soundtest_admin_2026',
    },
  });
  const adminQueryRes = await adminUsersModule.onRequestGet({ request: adminQueryReq, env: mockEnv });
  assert.equal(adminQueryRes.status, 200);
  const adminData = await adminQueryRes.json();
  assert.equal(adminData.ok, true);
  assert.equal(adminData.user.firstLoginConfirmed, true);
  assert.ok(adminData.user.firstLoginAt);
  assert.ok(adminData.user.lastLoginAt);
  assert.ok(Array.isArray(adminData.history));
  assert.ok(adminData.history.length >= 3);

  // 5. Verify admin.html UI contains modal, timeline styles, minute-precision columns
  const adminHtmlContent = fs.readFileSync(path.join(rootDir, 'admin.html'), 'utf8');
  assert.ok(adminHtmlContent.includes('id="userHistoryModal"'), 'admin.html must contain userHistoryModal');
  assert.ok(adminHtmlContent.includes('formatDateTime'), 'admin.html must contain formatDateTime function');
  assert.ok(adminHtmlContent.includes('首次登录状态'), 'admin.html must contain 首次登录状态 column');
  assert.ok(adminHtmlContent.includes('最后活跃时间'), 'admin.html must contain 最后活跃时间 column');
  assert.ok(adminHtmlContent.includes('openUserHistoryModal'), 'admin.html must contain openUserHistoryModal function');
});

test('IP regional pricing defense, admin visitor analytics, and mobile PRO upgrade responsiveness in soundtest.html', async () => {
  // 1. Verify Edge IP Pricing Tier API (/api/geo/pricing-tier)
  const pricingTierPath = path.join(rootDir, 'functions/api/geo/pricing-tier.js');
  assert.ok(fs.existsSync(pricingTierPath), 'pricing-tier.js must exist');
  const pricingModule = await import(`file://${pricingTierPath.replace(/\\/g, '/')}`);

  // Test Mainland China IP -> CNY test prices
  const reqChina = new Request('https://soundtest.pro/api/geo/pricing-tier', {
    method: 'GET',
    headers: {
      'cf-connecting-ip': '114.114.114.114',
      'cf-ipcountry': 'CN',
    },
  });
  const resChina = await pricingModule.onRequestGet({ request: reqChina });
  assert.equal(resChina.status, 200);
  const dataChina = await resChina.json();
  assert.equal(dataChina.ok, true);
  assert.equal(dataChina.isChinaIp, true);
  assert.equal(dataChina.currency, 'CNY');
  assert.equal(dataChina.currencySymbol, '¥');
  assert.equal(dataChina.pricingTier, 'china_test');
  assert.equal(dataChina.plans.yearly.price, '19.90');
  assert.equal(dataChina.plans.single.price, '3.90');

  // Test Overseas US IP -> USD global prices
  const reqUs = new Request('https://soundtest.pro/api/geo/pricing-tier', {
    method: 'GET',
    headers: {
      'cf-connecting-ip': '8.8.8.8',
      'cf-ipcountry': 'US',
    },
  });
  const resUs = await pricingModule.onRequestGet({ request: reqUs });
  assert.equal(resUs.status, 200);
  const dataUs = await resUs.json();
  assert.equal(dataUs.ok, true);
  assert.equal(dataUs.isChinaIp, false);
  assert.ok(dataUs.pricingTier === 'overseas' || dataUs.pricingTier === 'global_standard');
  assert.equal(dataUs.plans.yearly.price, '24.99');
  assert.equal(dataUs.plans.single.price, '1.99');

  // 2. Verify Hupijiao creation endpoint rejects non-CN IP
  const hupijiaoPath = path.join(rootDir, 'functions/api/payment/hupijiao-create.js');
  const hupijiaoModule = await import(`file://${hupijiaoPath.replace(/\\/g, '/')}`);
  const reqForeignHupijiao = new Request('https://soundtest.pro/api/payment/hupijiao-create', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'cf-connecting-ip': '8.8.8.8',
      'cf-ipcountry': 'US',
    },
    body: JSON.stringify({
      plan: 'yearly',
      email: 'test@example.com',
    }),
  });
  const resForeign = await hupijiaoModule.onRequestPost({ request: reqForeignHupijiao, env: {} });
  assert.equal(resForeign.status, 403);
  const dataForeign = await resForeign.json();
  assert.equal(dataForeign.ok, false);
  assert.equal(dataForeign.error, 'geo_pricing_restricted');

  // 3. Verify admin.html contains visitor tracking system and IP defense audit
  const adminHtml = fs.readFileSync(path.join(rootDir, 'admin.html'), 'utf8');
  assert.ok(adminHtml.includes('访客与全站分析'), 'admin.html must contain 访客与全站分析 tab');
  assert.ok(adminHtml.includes('id="analyticsVisitorsTableBody"'), 'admin.html must contain visitors table');
  assert.ok(adminHtml.includes('Geo-Pricing Enforcement Audit'), 'admin.html must contain IP pricing audit card');
  assert.ok(adminHtml.includes('renderVisitorsTable'), 'admin.html must have renderVisitorsTable function');

  // 4. Verify soundtest.html and assets/soundtest.css mobile upgrade responsiveness and modal
  const soundtestHtml = fs.readFileSync(path.join(rootDir, 'soundtest.html'), 'utf8');
  assert.ok(soundtestHtml.includes('id="proUpgradeModal"'), 'soundtest.html must contain proUpgradeModal');
  assert.ok(soundtestHtml.includes('id="subscriptionBanner"'), 'soundtest.html must contain subscriptionBanner');
  assert.ok(soundtestHtml.includes('onclick="showSubscriptionPlans()"'), 'soundtest.html elements must call showSubscriptionPlans');
  assert.ok(soundtestHtml.includes('function openProUpgradeModal'), 'soundtest.html must contain openProUpgradeModal');
  assert.ok(soundtestHtml.includes('function isChinaPricingUser'), 'soundtest.html must contain isChinaPricingUser');
  assert.ok(soundtestHtml.includes('fetchClientGeoPricing'), 'soundtest.html must fetch pricing tier from edge');

  const soundtestCss = fs.readFileSync(path.join(rootDir, 'assets/soundtest.css'), 'utf8');
  assert.ok(soundtestCss.includes('.pro-upgrade-modal'), 'assets/soundtest.css must contain .pro-upgrade-modal');
  assert.ok(soundtestCss.includes('.pum-card'), 'assets/soundtest.css must contain .pum-card');
  assert.ok(soundtestCss.includes('.subscription-banner{display:flex;align-items:center;justify-content:space-between;gap:10px;padding:10px 12px;border-radius:var(--r);border:.5px solid rgba(255,181,32,.26);background:linear-gradient(135deg,rgba(255,181,32,.12),rgba(42,255,212,.07));box-shadow:0 10px 30px rgba(0,0,0,.18);cursor:pointer'), 'subscription-banner must have cursor pointer');
});

test('Device-aware PWA prompt suppression on desktop and clean visitor pricing presentation', async () => {
  const experienceJs = fs.readFileSync(path.join(rootDir, 'assets/site-experience.js'), 'utf8');
  const soundtestHtml = fs.readFileSync(path.join(rootDir, 'soundtest.html'), 'utf8');
  const authJs = fs.readFileSync(path.join(rootDir, 'assets/site-auth.js'), 'utf8');

  // 1. Desktop devices must suppress mobile PWA install guide and banner
  assert.ok(experienceJs.includes('if (!isMobile) return;'), 'site-experience.js suppresses PWA banner on desktop');
  assert.ok(experienceJs.includes('const isMobile = isIOS || isAndroid || /Mobi|Tablet|Touch/i.test(ua);'), 'site-experience.js checks for mobile devices');

  // 2. Visitor-facing modals must NOT show defensive "IP 定价已锁定", "严禁跨区", or "pumGeoBanner"
  assert.ok(!soundtestHtml.includes('id="pumGeoBanner"'), 'soundtest.html must not contain pumGeoBanner');
  assert.ok(!soundtestHtml.includes('IP 定价已锁定'), 'soundtest.html must not display IP 定价已锁定 to visitors');
  assert.ok(!soundtestHtml.includes('Regional Pricing Locked'), 'soundtest.html must not display Regional Pricing Locked to visitors');
  assert.ok(!authJs.includes('IP 定价已锁定'), 'site-auth.js must not display IP 定价已锁定');
  assert.ok(!authJs.includes('严禁低价跨区'), 'site-auth.js must not display 严禁低价跨区 to visitors');
  assert.ok(!authJs.includes('auth-gw-badge'), 'site-auth.js must not display awkward geo badges in visitor pay modal');
});

test('Creem international checkout URLs are declared, exported, and wired across app modules', async () => {
  const pricingJs = fs.readFileSync(path.join(rootDir, 'assets/membership-pricing.js'), 'utf8');
  const reportCertJs = fs.readFileSync(path.join(rootDir, 'assets/report-cert-engine.js'), 'utf8');
  const soundtestHtml = fs.readFileSync(path.join(rootDir, 'soundtest.html'), 'utf8');

  // 1. All 4 tiers must exist in membership-pricing.js, report-cert-engine.js, and soundtest.html
  const tiers = ['single', 'monthly', 'yearly', 'lifetime'];
  for (const tier of tiers) {
    assert.ok(pricingJs.includes(`${tier}: 'https://www.creem.io/payment/prod_`), `pricingJs must have ${tier} Creem payment link`);
    assert.ok(reportCertJs.includes(`${tier}: 'https://www.creem.io/payment/prod_`), `reportCertJs must have ${tier} Creem payment link`);
    assert.ok(soundtestHtml.includes(`${tier}: 'https://www.creem.io/payment/prod_`), `soundtest.html must have ${tier} Creem payment link`);
  }

  // 2. membership-pricing.js must expose CREEM_CHECKOUT_URLS on window
  assert.ok(pricingJs.includes('window.CREEM_CHECKOUT_URLS = CREEM_CHECKOUT_URLS'), 'pricingJs must export window.CREEM_CHECKOUT_URLS');

  // 3. soundtest.html executeProUpgradeCheckout must have popup blocker fallback
  assert.ok(soundtestHtml.includes('function executeProUpgradeCheckout()'), 'soundtest.html has executeProUpgradeCheckout');
  assert.ok(soundtestHtml.includes('window.CREEM_CHECKOUT_URLS || (typeof CREEM_CHECKOUT_URLS'), 'soundtest.html has defensive CREEM_CHECKOUT_URLS resolution');
  assert.ok(soundtestHtml.includes('if (!newWin || newWin.closed || typeof newWin.closed === \'undefined\')'), 'soundtest.html has popup fallback');
});




