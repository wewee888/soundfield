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

test('variant pages a, b, and c feature all 5 pricing tiers matching site standards', () => {
  const pages = ['a/index.html', 'b/index.html', 'c/index.html'];
  const expectedClasses = ['price-card single-report', 'price-card monthly', 'price-card pro', 'price-card lifetime'];

  for (const pageRel of pages) {
    const content = fs.readFileSync(path.join(rootDir, pageRel), 'utf-8');
    for (const expClass of expectedClasses) {
      assert.ok(content.includes(expClass), `${pageRel} must include class "${expClass}"`);
    }
    // Creem links present
    assert.ok(content.includes('prod_2Xc2ichF1Xk2mmzrhBxyYC'), `${pageRel} must link to Single Report checkout`);
    assert.ok(content.includes('prod_4jTdMPIau4Pzn1HKHPW9NQ'), `${pageRel} must link to Monthly checkout`);
    assert.ok(content.includes('prod_18imyd506sx0xFOcMiqB2c'), `${pageRel} must link to Yearly checkout`);
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


