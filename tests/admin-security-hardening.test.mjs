import test from 'node:test';
import assert from 'node:assert/strict';
import path from 'node:path';

const rootDir = process.cwd();

test('Admin Security Hardening: rejects non-admin email with 403 even with valid password', async () => {
  const loginModule = await import(
    `file://${path.join(rootDir, 'functions/api/admin/login.js').replace(/\\/g, '/')}`
  );

  const mockKv = new Map();
  const mockEnv = {
    ADMIN_SECRET: 'soundtest_admin_2026',
    ab_test: {
      get: async (k) => mockKv.get(k) || null,
      put: async (k, v) => mockKv.set(k, v),
      delete: async (k) => mockKv.delete(k),
    },
  };

  // Stranger tries to use valid password with unauthorized email
  const req = new Request('https://soundtest.pro/api/admin/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'cf-connecting-ip': '1.2.3.4' },
    body: JSON.stringify({
      email: 'stranger@gmail.com',
      password: 'soundtest_admin_2026',
      captchaPassed: true,
    }),
  });

  const res = await loginModule.onRequestPost({ request: req, env: mockEnv });
  assert.equal(res.status, 403);
  const data = await res.json();
  assert.equal(data.ok, false);
  assert.equal(data.error, 'forbidden_identity');
});

test('Admin Security Hardening: locks out IP after 5 consecutive failed attempts', async () => {
  const loginModule = await import(
    `file://${path.join(rootDir, 'functions/api/admin/login.js').replace(/\\/g, '/')}`
  );

  const mockKv = new Map();
  const mockEnv = {
    ADMIN_SECRET: 'soundtest_admin_2026',
    ab_test: {
      get: async (k) => mockKv.get(k) || null,
      put: async (k, v) => mockKv.set(k, v),
      delete: async (k) => mockKv.delete(k),
    },
  };

  const attackerIp = '198.51.100.99';

  // Attempt 1 to 4: should return 401 with remaining attempts
  for (let i = 1; i <= 4; i++) {
    const req = new Request('https://soundtest.pro/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'cf-connecting-ip': attackerIp },
      body: JSON.stringify({
        email: 'wewee1@gmail.com',
        password: 'wrong_password_' + i,
        captchaPassed: true,
      }),
    });
    const res = await loginModule.onRequestPost({ request: req, env: mockEnv });
    assert.equal(res.status, 401);
  }

  // Attempt 5: triggers lockout (status 429)
  const req5 = new Request('https://soundtest.pro/api/admin/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'cf-connecting-ip': attackerIp },
    body: JSON.stringify({
      email: 'wewee1@gmail.com',
      password: 'wrong_password_5',
      captchaPassed: true,
    }),
  });
  const res5 = await loginModule.onRequestPost({ request: req5, env: mockEnv });
  assert.equal(res5.status, 429);
  const data5 = await res5.json();
  assert.equal(data5.error, 'ip_locked');

  // Attempt 6 (even with correct password): must be locked out immediately with 429
  const req6 = new Request('https://soundtest.pro/api/admin/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'cf-connecting-ip': attackerIp },
    body: JSON.stringify({
      email: 'wewee1@gmail.com',
      password: 'soundtest_admin_2026',
      captchaPassed: true,
    }),
  });
  const res6 = await loginModule.onRequestPost({ request: req6, env: mockEnv });
  assert.equal(res6.status, 429);
});

test('Admin Security Hardening: logout endpoint destroys session', async () => {
  const logoutModule = await import(
    `file://${path.join(rootDir, 'functions/api/admin/logout.js').replace(/\\/g, '/')}`
  );

  const mockKv = new Map();
  mockKv.set('adm_sess:adm_sess_123456', JSON.stringify({ email: 'wewee1@gmail.com' }));

  const mockEnv = {
    ab_test: {
      get: async (k) => mockKv.get(k) || null,
      delete: async (k) => mockKv.delete(k),
    },
  };

  const req = new Request('https://soundtest.pro/api/admin/logout', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer adm_sess_123456' },
  });

  const res = await logoutModule.onRequestPost({ request: req, env: mockEnv });
  assert.equal(res.status, 200);
  assert.equal(mockKv.has('adm_sess:adm_sess_123456'), false, 'Session must be deleted from KV');
});
