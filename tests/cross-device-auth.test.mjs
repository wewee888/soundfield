import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

test('cross-device auth endpoints exist and export onRequestPost', async () => {
  const registerPath = path.join(rootDir, 'functions/api/auth/register.js');
  const loginPath = path.join(rootDir, 'functions/api/auth/login.js');
  const changePasswordPath = path.join(rootDir, 'functions/api/auth/change-password.js');

  assert.ok(fs.existsSync(registerPath), 'register.js must exist');
  assert.ok(fs.existsSync(loginPath), 'login.js must exist');
  assert.ok(fs.existsSync(changePasswordPath), 'change-password.js must exist');

  const registerModule = await import(`file://${registerPath.replace(/\\/g, '/')}`);
  const loginModule = await import(`file://${loginPath.replace(/\\/g, '/')}`);
  const changePwdModule = await import(`file://${changePasswordPath.replace(/\\/g, '/')}`);

  assert.equal(typeof registerModule.onRequestPost, 'function');
  assert.equal(typeof loginModule.onRequestPost, 'function');
  assert.equal(typeof changePwdModule.onRequestPost, 'function');
});

test('register.js and login.js interact with KV ab_test correctly', async () => {
  const registerModule = await import(`file://${path.join(rootDir, 'functions/api/auth/register.js').replace(/\\/g, '/')}`);
  const loginModule = await import(`file://${path.join(rootDir, 'functions/api/auth/login.js').replace(/\\/g, '/')}`);

  // Mock KV store
  const kv = new Map();
  const mockEnv = {
    ab_test: {
      get: async (k) => kv.get(k) || null,
      put: async (k, v) => kv.set(k, v),
      delete: async (k) => kv.delete(k),
    },
  };

  const testEmail = 'cross_device_user@soundtest.pro';
  const testPasswordHash = 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855';

  // 1. Register user
  const regReq = new Request('https://soundtest.pro/api/auth/register', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
      name: 'Tester',
      email: testEmail,
      passwordHash: testPasswordHash,
    }),
  });
  const regRes = await registerModule.onRequestPost({ request: regReq, env: mockEnv });
  assert.equal(regRes.status, 200);
  const regData = await regRes.json();
  assert.equal(regData.ok, true);
  assert.ok(regData.session_token);
  assert.ok(kv.has(`user:${testEmail}`));

  // 2. Duplicate registration returns 409
  const dupReq = new Request('https://soundtest.pro/api/auth/register', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
      name: 'Tester',
      email: testEmail,
      passwordHash: testPasswordHash,
    }),
  });
  const dupRes = await registerModule.onRequestPost({ request: dupReq, env: mockEnv });
  assert.equal(dupRes.status, 409);

  // 3. Login with correct password hash returns 200 and session token
  const loginReq = new Request('https://soundtest.pro/api/auth/login', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
      email: testEmail,
      passwordHash: testPasswordHash,
    }),
  });
  const loginRes = await loginModule.onRequestPost({ request: loginReq, env: mockEnv });
  assert.equal(loginRes.status, 200);
  const loginData = await loginRes.json();
  assert.equal(loginData.ok, true);
  assert.equal(loginData.email, testEmail);
  assert.ok(loginData.session_token);

  // 4. Login with incorrect password hash returns 401
  const badLoginReq = new Request('https://soundtest.pro/api/auth/login', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
      email: testEmail,
      passwordHash: 'wrong_password_hash',
    }),
  });
  const badLoginRes = await loginModule.onRequestPost({ request: badLoginReq, env: mockEnv });
  assert.equal(badLoginRes.status, 401);
});

test('variant pages a, b, and c feature pricing tiers matching site standards', () => {
  const pages = ['a/index.html', 'b/index.html', 'c/index.html'];
  const expectedClasses = ['price-card', 'price-card pro', 'price-card lifetime'];

  for (const pageRel of pages) {
    const content = fs.readFileSync(path.join(rootDir, pageRel), 'utf-8');
    for (const expClass of expectedClasses) {
      assert.ok(content.includes(expClass), `${pageRel} must include class "${expClass}"`);
    }
    // Creem links present for paid tiers
    assert.ok(content.includes('prod_18nHbuAQNpc4n334rM9hGV'), `${pageRel} must link to Lifetime checkout`);
  }
});

test('delete-account and team workspace endpoints exist and function as expected', async () => {
  const deleteAccountPath = path.join(rootDir, 'functions/api/auth/delete-account.js');
  const teamWorkspacePath = path.join(rootDir, 'functions/api/team/workspace.js');

  assert.ok(fs.existsSync(deleteAccountPath), 'delete-account.js must exist');
  assert.ok(fs.existsSync(teamWorkspacePath), 'team/workspace.js must exist');

  const deleteModule = await import(`file://${deleteAccountPath.replace(/\\/g, '/')}`);
  const teamModule = await import(`file://${teamWorkspacePath.replace(/\\/g, '/')}`);

  assert.equal(typeof deleteModule.onRequestPost, 'function');
  assert.equal(typeof teamModule.onRequestGet, 'function');
  assert.equal(typeof teamModule.onRequestPost, 'function');

  // Mock KV
  const kv = new Map();
  const mockEnv = {
    ab_test: {
      get: async (k) => kv.get(k) || null,
      put: async (k, v) => kv.set(k, v),
      delete: async (k) => kv.delete(k),
    },
  };

  // 1. Save team workspace & enterprise branding
  const teamSaveReq = new Request('https://soundtest.pro/api/team/workspace', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
      teamId: 'team@soundtest.pro',
      enterpriseName: 'Acme Property Management Ltd.',
      projectCodePrefix: 'PRJ-2026-',
      defaultInspector: 'Lead Inspector Wu',
      disclaimerStamp: 'Official Field Noise Inspection Record',
    }),
  });
  const teamSaveRes = await teamModule.onRequestPost({ request: teamSaveReq, env: mockEnv });
  assert.equal(teamSaveRes.status, 200);
  const teamSaveData = await teamSaveRes.json();
  assert.equal(teamSaveData.ok, true);
  assert.equal(teamSaveData.workspace.enterpriseName, 'Acme Property Management Ltd.');

  // 2. Fetch team workspace
  const teamGetReq = new Request('https://soundtest.pro/api/team/workspace?teamId=team@soundtest.pro');
  const teamGetRes = await teamModule.onRequestGet({ request: teamGetReq, env: mockEnv });
  assert.equal(teamGetRes.status, 200);
  const teamGetData = await teamGetRes.json();
  assert.equal(teamGetData.ok, true);
  assert.equal(teamGetData.workspace.enterpriseName, 'Acme Property Management Ltd.');

  // 3. Delete account
  kv.set('user:delete_me@soundtest.pro', JSON.stringify({ name: 'Delete Me' }));
  kv.set('session:token123', JSON.stringify({ email: 'delete_me@soundtest.pro' }));

  const delReq = new Request('https://soundtest.pro/api/auth/delete-account', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
      email: 'delete_me@soundtest.pro',
      token: 'token123',
    }),
  });
  const delRes = await deleteModule.onRequestPost({ request: delReq, env: mockEnv });
  assert.equal(delRes.status, 200);
  const delData = await delRes.json();
  assert.equal(delData.ok, true);
  assert.equal(kv.has('user:delete_me@soundtest.pro'), false);
  assert.equal(kv.has('session:token123'), false);
});

test('geo reverse geocoding endpoint exists and handles valid and invalid requests', async () => {
  const geoPath = path.join(rootDir, 'functions/api/geo/reverse.js');
  assert.ok(fs.existsSync(geoPath), 'reverse.js must exist');

  const geoModule = await import(`file://${geoPath.replace(/\\/g, '/')}`);
  assert.equal(typeof geoModule.onRequestGet, 'function');

  // Test invalid coordinates
  const badReq = new Request('https://soundtest.pro/api/geo/reverse?lat=invalid&lng=116.4');
  const badRes = await geoModule.onRequestGet({ request: badReq, env: {} });
  assert.equal(badRes.status, 400);

  // Test options
  const optRes = await geoModule.onRequestOptions();
  assert.equal(optRes.status, 204);
});

test('hupijiao payment endpoints support team plan and correct yearly mapping', async () => {
  const createPath = path.join(rootDir, 'functions/api/payment/hupijiao-create.js');
  const checkPath = path.join(rootDir, 'functions/api/payment/hupijiao-check.js');
  const notifyPath = path.join(rootDir, 'functions/api/payment/hupijiao-notify.js');

  assert.ok(fs.existsSync(createPath), 'hupijiao-create.js exists');
  assert.ok(fs.existsSync(checkPath), 'hupijiao-check.js exists');
  assert.ok(fs.existsSync(notifyPath), 'hupijiao-notify.js exists');

  const notifyModule = await import(`file://${notifyPath.replace(/\\/g, '/')}`);

  const kv = new Map();
  const mockEnv = {
    ab_test: {
      get: async (k) => kv.get(k) || null,
      put: async (k, v) => kv.set(k, v),
      delete: async (k) => kv.delete(k),
    },
    HUPIJIAO_APPID: 'test_appid',
    HUPIJIAO_APPSECRET: 'test_secret',
  };

  // Test notify for team plan
  const tradeOrderId = 'sf_team_test_123';
  kv.set(`order:${tradeOrderId}`, JSON.stringify({
    plan: 'team',
    fee: '1998.00',
    email: 'team_admin@enterprise.com',
  }));

  // Create valid MD5 hash for notification
  const params = {
    trade_order_id: tradeOrderId,
    status: 'OD',
    total_fee: '1998.00',
  };
  const sorted = Object.keys(params).sort();
  const qs = sorted.map(k => `${k}=${params[k]}`).join('&');
  const hash = await notifyModule.md5(qs + mockEnv.HUPIJIAO_APPSECRET);

  const notifyReq = new Request('https://soundtest.pro/api/payment/hupijiao-notify', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ ...params, hash }),
  });
  const notifyRes = await notifyModule.onRequestPost({ request: notifyReq, env: mockEnv });
  assert.equal(notifyRes.status, 200);

  // Check that member record was created with plan: 'team'
  const memberRaw = kv.get('member:team_admin@enterprise.com');
  assert.ok(memberRaw, 'Member record must be created in KV');
  const member = JSON.parse(memberRaw);
  assert.equal(member.plan, 'team');
  assert.equal(member.status, 'paid');
});

test('assets/site-auth.js includes openUpgradePayModal and guards paid features', () => {
  const authJsPath = path.join(rootDir, 'assets/site-auth.js');
  const authCssPath = path.join(rootDir, 'assets/auth.css');
  assert.ok(fs.existsSync(authJsPath), 'site-auth.js must exist');
  assert.ok(fs.existsSync(authCssPath), 'auth.css must exist');

  const jsContent = fs.readFileSync(authJsPath, 'utf8');
  const cssContent = fs.readFileSync(authCssPath, 'utf8');

  // Verify modal function and helpers exist
  assert.ok(jsContent.includes('function openUpgradePayModal'), 'openUpgradePayModal function must be defined');
  assert.ok(jsContent.includes('function getEffectivePlan'), 'getEffectivePlan function must be defined');
  assert.ok(jsContent.includes('closeUpgradePayModal'), 'closeUpgradePayModal function must be defined');

  // Verify feature configs include sync, team, and pro
  assert.ok(jsContent.includes('featureConfigs'), 'featureConfigs must be configured');
  assert.ok(jsContent.includes('1998.00'), 'Team pricing 1998.00 must be in configs');
  assert.ok(jsContent.includes('19.90'), 'Yearly pricing 19.90 must be in configs');

  // Verify paid features guard checks
  assert.ok(jsContent.includes("feature: 'sync'"), 'btn-sync-cloud must guard with openUpgradePayModal sync');
  assert.ok(jsContent.includes("feature: 'team'"), 'team-branding-form must guard with openUpgradePayModal team');

  // Verify modal CSS classes exist
  assert.ok(cssContent.includes('.auth-pay-overlay'), '.auth-pay-overlay style must be defined');
  assert.ok(cssContent.includes('.auth-pay-modal'), '.auth-pay-modal style must be defined');
  assert.ok(cssContent.includes('.auth-pay-qr-wrapper'), '.auth-pay-qr-wrapper style must be defined');
  assert.ok(cssContent.includes('.auth-pay-plan-btn'), '.auth-pay-plan-btn style must be defined');
});

test('soundtest.html Pro upgrade modal removes sample report link and locks Chinese users to WeChat Pay CNY tier', async () => {
  const htmlPath = path.join(rootDir, 'soundtest.html');
  const htmlContent = fs.readFileSync(htmlPath, 'utf8');

  // Verify pumPreviewLink is removed
  assert.ok(!htmlContent.includes('pumPreviewLink'), 'pumPreviewLink must be removed so it does not distract users from payment');
  assert.ok(!htmlContent.includes('查看正式报告样例'), 'Link text 查看正式报告样例 must not appear in upgrade modal');

  // Verify isChinaPricingUser prioritizes Chinese language
  assert.ok(htmlContent.includes("appLanguage === 'zh-CN' || (typeof appLanguage === 'string' && appLanguage.startsWith('zh'))"), 'isChinaPricingUser must prioritize Chinese language');

  // Verify pricing-tier endpoint honors Chinese language parameter
  const pricingTierPath = path.join(rootDir, 'functions/api/geo/pricing-tier.js');
  const pricingTierModule = await import(`file://${pricingTierPath.replace(/\\/g, '/')}`);
  const zhReq = new Request('https://soundtest.pro/api/geo/pricing-tier?lang=zh-CN', {
    headers: { 'cf-ipcountry': 'US' } // Even if user is on US proxy
  });
  const zhRes = await pricingTierModule.onRequestGet({ request: zhReq });
  assert.equal(zhRes.status, 200);
  const zhData = await zhRes.json();
  assert.equal(zhData.isChinaIp, true, 'isChinaIp should be true for Chinese language request');
  assert.equal(zhData.currency, 'CNY', 'Currency should be CNY for Chinese language request');
  assert.equal(zhData.pricingTier, 'china_test');
});

test('WeChat Pay QR code rendering supports multi-tier fallback and mobile visibility in site-auth.js', () => {
  const jsContent = fs.readFileSync(path.join(rootDir, 'assets', 'site-auth.js'), 'utf8');
  assert.ok(jsContent.includes('primaryQr'), 'site-auth.js must compute primaryQr');
  assert.ok(jsContent.includes('fallbackQr'), 'site-auth.js must compute fallbackQr');
  assert.ok(jsContent.includes('qrImg.onerror'), 'site-auth.js must attach onerror fallback handler to qrImg');
  assert.ok(jsContent.includes('qrImg.onload'), 'site-auth.js must attach onload handler to qrImg');
});

test('soundtest.html implements dual-stop, anti-jitter acoustic hysteresis, and flush bottom shell', () => {
  const htmlContent = fs.readFileSync(path.join(rootDir, 'soundtest.html'), 'utf8');

  // Dual-stop: stops both recording and monitoring in a single click
  assert.ok(htmlContent.includes('if(isMon) await toggleMon();'), 'toggleRecAction must stop monitoring when stopping recording');

  // Anti-jitter: acoustic hysteresis and hold duration
  assert.ok(htmlContent.includes('instantAlertHoldUntil'), 'soundtest.html must define instantAlertHoldUntil');
  assert.ok(htmlContent.includes('instantAlertBelowSince'), 'soundtest.html must define instantAlertBelowSince');
  assert.ok(htmlContent.includes('nowTs + 3500'), 'soundtest.html must hold alert for minimum duration to prevent rapid flutter');
  assert.ok(htmlContent.includes('alertTh - 2.5'), 'soundtest.html must require 2.5 dB hysteresis recovery');

  // Solid flush bottom shell
  assert.ok(htmlContent.includes('background: #080c16 !important;'), '.bottom-shell must use solid background to prevent bleed-through');
  assert.ok(htmlContent.includes('max(6px, env(safe-area-inset-bottom, 0px)) !important;'), '.bottom-nav must pad above Android/iOS home indicator');
});

test('soundtest.html hides purchase plans upon member login and upgrades top Pro button to VIP tier badge', () => {
  const htmlContent = fs.readFileSync(path.join(rootDir, 'soundtest.html'), 'utf8');
  const cssContent = fs.readFileSync(path.join(rootDir, 'assets/soundtest.css'), 'utf8');

  // 1. Verify Top Pro Button markup & dynamic handlers
  assert.ok(htmlContent.includes('id="appProBtn"'), 'Top Pro button must have id="appProBtn"');
  assert.ok(htmlContent.includes('onclick="handleTopProBtnClick()"'), 'Top Pro button must call handleTopProBtnClick');
  assert.ok(htmlContent.includes('function updateTopProBtn()'), 'soundtest.html must implement updateTopProBtn');
  assert.ok(htmlContent.includes('function handleTopProBtnClick()'), 'soundtest.html must implement handleTopProBtnClick');
  assert.ok(htmlContent.includes('function getMemberBadgeText('), 'soundtest.html must implement getMemberBadgeText');
  assert.ok(htmlContent.includes('function isUserPaidMember()'), 'soundtest.html must implement isUserPaidMember');

  // 2. Verify Member Tier Badges dictionary across multiple locales
  assert.ok(htmlContent.includes('MEMBER_TIER_BADGES'), 'soundtest.html must define MEMBER_TIER_BADGES');
  assert.ok(htmlContent.includes('👑 TEAM 管理员'), 'MEMBER_TIER_BADGES must have Chinese TEAM admin badge');
  assert.ok(htmlContent.includes('👑 TEAM Admin'), 'MEMBER_TIER_BADGES must have English TEAM admin badge');
  assert.ok(htmlContent.includes('💎 终身会员'), 'MEMBER_TIER_BADGES must have lifetime badge');
  assert.ok(htmlContent.includes('👑 PRO 会员'), 'MEMBER_TIER_BADGES must have pro member badge');

  // 3. Verify Active Member VIP Dossier markup
  assert.ok(htmlContent.includes('id="activeMemberDossier"'), 'soundtest.html must contain activeMemberDossier');
  assert.ok(htmlContent.includes('id="purchasePlansWrap"'), 'soundtest.html must wrap purchase tier cards in purchasePlansWrap');
  assert.ok(htmlContent.includes('id="membershipUnauthedBox"'), 'soundtest.html must have membershipUnauthedBox');
  assert.ok(htmlContent.includes('id="dossierTierBadge"'), 'activeMemberDossier must have dossierTierBadge');
  assert.ok(htmlContent.includes('id="dossierValidPill"'), 'activeMemberDossier must have dossierValidPill');
  assert.ok(htmlContent.includes('id="dossierEmail"'), 'activeMemberDossier must have dossierEmail');
  assert.ok(htmlContent.includes('id="dossierBenefitsGrid"'), 'activeMemberDossier must have dossierBenefitsGrid');
  assert.ok(htmlContent.includes('id="dossierManageBtn"'), 'activeMemberDossier must have dossierManageBtn');
  assert.ok(htmlContent.includes('id="dossierRefreshBtn"'), 'activeMemberDossier must have dossierRefreshBtn');
  assert.ok(htmlContent.includes('id="dossierLogoutBtn"'), 'activeMemberDossier must have dossierLogoutBtn');

  // 4. Verify renderMembershipPanel toggles purchase plans vs active dossier
  assert.ok(htmlContent.includes("purchasePlansWrap.style.display = 'none'"), 'renderMembershipPanel must hide purchasePlansWrap when paid');
  assert.ok(htmlContent.includes("activeMemberDossier.style.display = 'block'"), 'renderMembershipPanel must show activeMemberDossier when paid');
  assert.ok(htmlContent.includes("membershipUnauthedBox.style.display = 'none'"), 'renderMembershipPanel must hide unauthed box when paid');
  assert.ok(htmlContent.includes("purchasePlansWrap.style.display = 'block'"), 'renderMembershipPanel must show purchasePlansWrap when unpaid');
  assert.ok(htmlContent.includes("activeMemberDossier.style.display = 'none'"), 'renderMembershipPanel must hide activeMemberDossier when unpaid');
  assert.ok(htmlContent.includes('populateActiveMemberDossier()'), 'renderMembershipPanel must call populateActiveMemberDossier');

  // 5. Verify CSS styling for VIP active badge and active member dossier
  assert.ok(cssContent.includes('.app-pro-btn.member-active-badge'), 'assets/soundtest.css must define .app-pro-btn.member-active-badge');
  assert.ok(cssContent.includes('.active-member-dossier'), 'assets/soundtest.css must define .active-member-dossier');
  assert.ok(cssContent.includes('.dossier-tier-badge'), 'assets/soundtest.css must define .dossier-tier-badge');
  assert.ok(cssContent.includes('.dossier-meta-grid'), 'assets/soundtest.css must define .dossier-meta-grid');
  assert.ok(cssContent.includes('.dossier-benefits-grid'), 'assets/soundtest.css must define .dossier-benefits-grid');
});

test('i18n integrity: activeMemberDossier has zero hardcoded Chinese in default DOM and all 9 locales have complete language packs', () => {
  const htmlContent = fs.readFileSync(path.join(rootDir, 'soundtest.html'), 'utf-8');
  const i18nCode = fs.readFileSync(path.join(rootDir, 'assets/i18n-data.js'), 'utf-8');

  // 1. Static HTML of #activeMemberDossier must NOT contain any Chinese characters in markup
  const match = htmlContent.match(/<div class="active-member-dossier" id="activeMemberDossier"[\s\S]*?<\/div>\s*<\/div>/);
  assert.ok(match, 'activeMemberDossier markup must exist in soundtest.html');
  const dossierMarkup = match[0];
  assert.doesNotMatch(dossierMarkup, /[\u4e00-\u9fff]/, 'activeMemberDossier static HTML must not contain hardcoded Chinese');

  // 2. populateActiveMemberDossier must use t('dossier.')
  assert.ok(htmlContent.includes("t('dossier.tierSuper'"), 'populateActiveMemberDossier must query t(dossier.tierSuper)');
  assert.ok(htmlContent.includes("t('dossier.permanentLicense'"), 'populateActiveMemberDossier must query t(dossier.permanentLicense)');
  assert.ok(htmlContent.includes("t('dossier.lblStatus'"), 'populateActiveMemberDossier must query t(dossier.lblStatus)');
  assert.ok(htmlContent.includes("t('dossier.b1'"), 'populateActiveMemberDossier must query t(dossier.b1)');
  assert.ok(htmlContent.includes("t('dossier.manageBtn'"), 'populateActiveMemberDossier must query t(dossier.manageBtn)');

  // 3. Verify evaluate i18n data across all 9 locales
  const win = {};
  eval(i18nCode.replace('window.__sfI18N = I18N_DATA;', 'win.__sfI18N = I18N_DATA;').replace('window.__sfSupportedAppLanguages', 'win.__sfSupportedAppLanguages'));
  const locales = ['en-US', 'zh-CN', 'es', 'fr', 'de', 'ja', 'ko', 'vi', 'th'];

  const requiredDossierKeys = [
    'tierSuper', 'tierLifetime', 'tierYearly', 'tierSingle', 'tierPro',
    'permanentLicense', 'renewsPrefix', 'activePass',
    'lblStatus', 'valStatus', 'lblExpiry', 'valExpiryPermanent',
    'lblSecurity', 'valSecurity', 'lblSync', 'valSync',
    'benefitsTitle', 'b1', 'b2', 'b3', 'b4', 'b5', 'b6_team', 'b6_user',
    'manageBtn', 'refreshBtn', 'logoutBtn'
  ];

  locales.forEach((loc) => {
    const data = win.__sfI18N[loc];
    assert.ok(data, `${loc} translation data must exist`);
    assert.ok(data.dossier, `${loc} must have dossier dictionary`);
    for (const key of requiredDossierKeys) {
      assert.ok(data.dossier[key], `${loc} dossier must contain key ${key}`);
    }
    assert.ok(data.toasts, `${loc} must have toasts dictionary`);
    assert.ok(data.toasts.linkCopied, `${loc} toasts must have linkCopied`);
    assert.ok(data.toasts.feedbackCopied, `${loc} toasts must have feedbackCopied`);
    assert.ok(data.toasts.applied, `${loc} toasts must have applied`);
    assert.ok(data.reports, `${loc} must have reports dictionary`);
    assert.ok(data.reports.exportOfficial, `${loc} reports must have exportOfficial`);
    assert.ok(data.ui.noGps, `${loc} ui must have noGps`);
    assert.ok(data.ui.requireHttps, `${loc} ui must have requireHttps`);
  });

  // 4. Verify helper functions for presets
  assert.ok(htmlContent.includes('function getPresetLabel('), 'soundtest.html must implement getPresetLabel');
  assert.ok(htmlContent.includes('function getPresetReason('), 'soundtest.html must implement getPresetReason');
});




