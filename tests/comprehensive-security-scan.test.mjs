import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const rootDir = process.cwd();

test('Security Scan: Admin endpoints reject spoofed x-admin-email without valid token or session', async () => {
  const mockEnv = {
    ADMIN_SECRET: 'soundtest_admin_2026',
    ab_test: {
      get: async () => null,
      put: async () => {},
      delete: async () => {},
    },
  };

  const endpoints = [
    { name: 'orders', path: 'functions/api/admin/orders.js', method: 'GET' },
    { name: 'users', path: 'functions/api/admin/users.js', method: 'GET' },
    { name: 'membership', path: 'functions/api/admin/membership.js', method: 'GET', url: 'https://soundtest.pro/api/admin/membership?email=target@example.com' },
    { name: 'analytics', path: 'functions/api/admin/analytics.js', method: 'GET' },
    { name: 'send-email', path: 'functions/api/admin/send-email.js', method: 'POST', body: { orderId: 'test' } },
  ];

  for (const ep of endpoints) {
    const fullPath = path.join(rootDir, ep.path);
    const mod = await import(`file://${fullPath.replace(/\\/g, '/')}`);
    const handler = ep.method === 'POST' ? mod.onRequestPost : mod.onRequestGet;

    // 1. Attacker sends spoofed admin email with no token -> MUST BE REJECTED (401 or 403)
    const spoofReq = new Request(ep.url || `https://soundtest.pro/api/admin/${ep.name}`, {
      method: ep.method,
      headers: {
        'content-type': 'application/json',
        'x-admin-email': 'wewee1@gmail.com',
      },
      body: ep.body ? JSON.stringify(ep.body) : undefined,
    });
    const spoofRes = await handler({ request: spoofReq, env: mockEnv });
    assert.ok(
      spoofRes.status === 401 || spoofRes.status === 403,
      `Endpoint ${ep.name} must reject spoofed x-admin-email without token (got status ${spoofRes.status})`
    );

    // 2. Genuine request with valid Authorization token -> MUST BE ACCEPTED (200 or 400 for missing target data, but NOT 401/403)
    const legitReq = new Request(ep.url || `https://soundtest.pro/api/admin/${ep.name}`, {
      method: ep.method,
      headers: {
        'content-type': 'application/json',
        'Authorization': 'Bearer soundtest_admin_2026',
        'x-admin-email': 'wewee1@gmail.com',
      },
      body: ep.body ? JSON.stringify(ep.body) : undefined,
    });
    const legitRes = await handler({ request: legitReq, env: mockEnv });
    assert.notEqual(
      legitRes.status,
      401,
      `Endpoint ${ep.name} must not reject valid token with 401`
    );
    assert.notEqual(
      legitRes.status,
      403,
      `Endpoint ${ep.name} must not reject valid token with 403`
    );
  }
});

test('Security Scan: Payment Webhooks reject unconfigured gateway secrets', async () => {
  const notifyPath = path.join(rootDir, 'functions/api/payment/hupijiao-notify.js');
  const createPath = path.join(rootDir, 'functions/api/payment/hupijiao-create.js');
  const checkPath = path.join(rootDir, 'functions/api/payment/hupijiao-check.js');

  const notifyMod = await import(`file://${notifyPath.replace(/\\/g, '/')}`);
  const createMod = await import(`file://${createPath.replace(/\\/g, '/')}`);
  const checkMod = await import(`file://${checkPath.replace(/\\/g, '/')}`);

  // When env does NOT define HUPIJIAO_APPSECRET
  const emptyEnv = { ab_test: { get: async () => null } };

  // Notify should fail with 500 when secret is unconfigured
  const notifyReq = new Request('https://soundtest.pro/api/payment/hupijiao-notify', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ trade_order_id: 'ord_123', status: 'OD', hash: 'fakehash' }),
  });
  const notifyRes = await notifyMod.onRequestPost({ request: notifyReq, env: emptyEnv });
  assert.equal(notifyRes.status, 500, 'Notify must reject when HUPIJIAO_APPSECRET is missing');

  // Create should fail with 503 when secret is unconfigured
  const createReq = new Request('https://soundtest.pro/api/payment/hupijiao-create', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ plan: 'pro', lang: 'zh' }),
  });
  const createRes = await createMod.onRequestPost({ request: createReq, env: emptyEnv });
  assert.equal(createRes.status, 503, 'Create must return 503 when gateway is unconfigured');

  // Check should return paid:false with gateway_unconfigured
  const checkReq = new Request('https://soundtest.pro/api/payment/hupijiao-check?order_id=test_ord', {
    method: 'GET',
  });
  const checkRes = await checkMod.onRequestGet({ request: checkReq, env: emptyEnv });
  const checkData = await checkRes.json();
  assert.equal(checkData.error, 'gateway_unconfigured');
});

test('Security Scan: Magic link rate-limiting cooldown and OTP brute-force lockout', async () => {
  const magicLinkPath = path.join(rootDir, 'functions/api/auth/magic-link.js');
  const verifyPath = path.join(rootDir, 'functions/api/auth/verify-magic.js');

  const magicMod = await import(`file://${magicLinkPath.replace(/\\/g, '/')}`);
  const verifyMod = await import(`file://${verifyPath.replace(/\\/g, '/')}`);

  const testKV = new Map();
  const mockEnv = {
    ab_test: {
      get: async (k) => testKV.get(k) || null,
      put: async (k, v) => testKV.set(k, v),
      delete: async (k) => testKV.delete(k),
    },
  };

  const testEmail = 'sec_test@example.com';

  // 1. First magic-link request succeeds
  const req1 = new Request('https://soundtest.pro/api/auth/magic-link', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ email: testEmail }),
  });
  const res1 = await magicMod.onRequestPost({ request: req1, env: mockEnv });
  assert.equal(res1.status, 200);

  // 2. Second immediate magic-link request is blocked by rate-limiting (429)
  const req2 = new Request('https://soundtest.pro/api/auth/magic-link', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ email: testEmail }),
  });
  const res2 = await magicMod.onRequestPost({ request: req2, env: mockEnv });
  assert.equal(res2.status, 429, 'Immediate second request must return 429 rate_limited');
  const data2 = await res2.json();
  assert.equal(data2.error, 'rate_limited');

  // 3. Brute force OTP guesses: 4 failed guesses decrement attempts, 5th locks out and purges key
  for (let i = 1; i <= 4; i++) {
    const wrongReq = new Request('https://soundtest.pro/api/auth/verify-magic', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ email: testEmail, code: '000000' }),
    });
    const wrongRes = await verifyMod.onRequestPost({ request: wrongReq, env: mockEnv });
    assert.equal(wrongRes.status, 401);
    const wrongData = await wrongRes.json();
    assert.equal(wrongData.attempts_left, 5 - i);
  }

  // 5th guess triggers lockout and deletion
  const fifthReq = new Request('https://soundtest.pro/api/auth/verify-magic', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ email: testEmail, code: '000000' }),
  });
  const fifthRes = await verifyMod.onRequestPost({ request: fifthReq, env: mockEnv });
  assert.equal(fifthRes.status, 429, '5th failed attempt must return 429 too_many_attempts');
  assert.ok(!testKV.has(`magic_code:${testEmail}`), 'KV key must be purged after 5 failed attempts');
});

test('Security Scan: XSS prevention and link sanitization in admin.html & track-visit.js', async () => {
  const adminHtml = fs.readFileSync(path.join(rootDir, 'admin.html'), 'utf8');
  assert.ok(adminHtml.includes('function sanitizeUrl'), 'admin.html must define sanitizeUrl');
  assert.ok(adminHtml.includes('javascript|data|vbscript|blob'), 'sanitizeUrl must block malicious URI schemes');
  assert.ok(adminHtml.includes('${sanitizeUrl(v.page)}'), 'Visitor table must use sanitizeUrl on v.page');
  assert.ok(adminHtml.includes('${escHtml(v.page)}'), 'Visitor table must escape v.page');

  // Track visit API sanitization
  const trackVisitPath = path.join(rootDir, 'functions/api/track-visit.js');
  const trackMod = await import(`file://${trackVisitPath.replace(/\\/g, '/')}`);

  let savedRecord = null;
  const mockEnv = {
    ab_test: {
      get: async () => null,
      put: async (k, v) => {
        if (k === 'visitors:recent') {
          const list = JSON.parse(v);
          savedRecord = list[0];
        }
      },
    },
  };

  const maliciousTrackReq = new Request('https://soundtest.pro/api/track-visit', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
      page: 'javascript:alert(document.cookie)',
      title: 'Evil<script>alert(1)</script>',
    }),
  });

  const trackRes = await trackMod.onRequestPost({ request: maliciousTrackReq, env: mockEnv });
  assert.equal(trackRes.status, 200);
  assert.ok(savedRecord, 'visit_log must be saved');
  assert.equal(savedRecord.page, '/', 'Malicious javascript: URI must be sanitized to safe fallback /');
  assert.ok(!savedRecord.title.includes('<script>'), 'Title must have HTML brackets stripped');
});

test('Security Scan: _headers and robots.txt enforce HSTS, COOP, and admin indexing isolation', () => {
  const headers = fs.readFileSync(path.join(rootDir, '_headers'), 'utf8');
  const robots = fs.readFileSync(path.join(rootDir, 'robots.txt'), 'utf8');

  // HSTS & COOP
  assert.ok(headers.includes('Strict-Transport-Security: max-age=31536000; includeSubDomains; preload'), '_headers must enforce HSTS');
  assert.ok(headers.includes('Cross-Origin-Opener-Policy: same-origin-allow-popups'), '_headers must enforce COOP');

  // Admin isolation in _headers
  assert.ok(headers.includes('/admin.html'), '_headers must configure /admin.html section');
  assert.ok(headers.includes('X-Robots-Tag: noindex, nofollow, noarchive'), '/admin.html must have X-Robots-Tag');
  assert.ok(headers.includes('Cache-Control: private, no-store, no-cache, must-revalidate'), '/admin.html must forbid caching');

  // robots.txt isolation
  assert.ok(robots.includes('Disallow: /admin.html'), 'robots.txt must disallow /admin.html');
  assert.ok(robots.includes('Disallow: /api/'), 'robots.txt must disallow /api/');
});
