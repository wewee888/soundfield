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
