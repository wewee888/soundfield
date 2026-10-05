import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const rootDir = process.cwd();

test('Admin security: admin.html removes plaintext passwords and one-click bypass', () => {
  const adminHtml = fs.readFileSync(path.join(rootDir, 'admin.html'), 'utf-8');

  // Verify plaintext password display is removed
  assert.ok(!adminHtml.includes('默认管理员密码：<code'), 'Must NOT display default admin password in plaintext');
  assert.ok(!adminHtml.includes('⚡ 站长一键免密解锁'), 'Must NOT contain one-click passwordless bypass button');
  assert.ok(!adminHtml.includes('quickFillAndLogin'), 'Must NOT contain quickFillAndLogin function');

  // Verify Email + Password inputs exist
  assert.ok(adminHtml.includes('id="adminEmailInput"'), 'Must contain adminEmailInput');
  assert.ok(adminHtml.includes('id="adminSecretInput"'), 'Must contain adminSecretInput');

  // Verify interactive Human Verification widget exists
  assert.ok(adminHtml.includes('id="captchaWidget"'), 'Must contain captchaWidget');
  assert.ok(adminHtml.includes('id="captchaBox"'), 'Must contain captchaBox');
  assert.ok(adminHtml.includes('id="captchaLabel"'), 'Must contain captchaLabel');
  assert.ok(adminHtml.includes('handleCaptchaClick'), 'Must contain handleCaptchaClick');
});

test('Admin login API: enforces captcha and credential validation', async () => {
  const loginPath = path.join(rootDir, 'functions/api/admin/login.js');
  assert.ok(fs.existsSync(loginPath), 'functions/api/admin/login.js must exist');

  const loginModule = await import(`file://${loginPath.replace(/\\/g, '/')}`);

  const mockEnv = {
    ADMIN_SECRET: 'soundtest_admin_2026',
    ab_test: {
      get: async (key) => null,
    }
  };

  // 1. Missing captcha
  const noCaptchaReq = new Request('https://soundtest.pro/api/admin/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'wewee1@gmail.com', password: 'SOUNDTEST.PRO@2026', captchaPassed: false }),
  });
  const noCaptchaRes = await loginModule.onRequestPost({ request: noCaptchaReq, env: mockEnv });
  assert.equal(noCaptchaRes.status, 400);
  const noCaptchaData = await noCaptchaRes.json();
  assert.equal(noCaptchaData.error, 'captcha_required');

  // 2. Invalid password
  const badPwdReq = new Request('https://soundtest.pro/api/admin/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'wewee1@gmail.com', password: 'wrongpassword', captchaPassed: true }),
  });
  const badPwdRes = await loginModule.onRequestPost({ request: badPwdReq, env: mockEnv });
  assert.equal(badPwdRes.status, 401);

  // 3. Valid master secret with captcha
  const goodReq = new Request('https://soundtest.pro/api/admin/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'wewee@163.com', password: 'SOUNDTEST.PRO@2026', captchaPassed: true }),
  });
  const goodRes = await loginModule.onRequestPost({ request: goodReq, env: mockEnv });
  assert.equal(goodRes.status, 200);
  const goodData = await goodRes.json();
  assert.equal(goodData.ok, true);
  assert.equal(goodData.role, 'super_admin');
  assert.equal(goodData.email, 'wewee@163.com');
  assert.equal(goodData.token, 'soundtest_admin_2026');
});

test('Seamless session transfer: site-auth.js generates admin token and links directly to admin', () => {
  const siteAuthJs = fs.readFileSync(path.join(rootDir, 'assets/site-auth.js'), 'utf-8');

  // checkIsSuperAdmin recognizes all master admin emails
  assert.ok(siteAuthJs.includes('wewee1@gmail.com') && siteAuthJs.includes('wewee@163.com') && siteAuthJs.includes('admin@soundtest.pro'), 'Must list admin emails');
  assert.ok(siteAuthJs.includes('function checkIsSuperAdmin'), 'Must define checkIsSuperAdmin function');

  // getLocaleAdminHref attaches ?token=soundtest_admin_2026
  assert.ok(siteAuthJs.includes('?token=soundtest_admin_2026'), 'Admin href must attach query token for seamless login');

  // loginUser seeds admin token
  assert.ok(siteAuthJs.includes('localStorage.setItem(\'soundtest_admin_token\', \'soundtest_admin_2026\')'), 'Must auto-seed admin token in storage');
});

test('admin.html checkAuth automatically bypasses gate for frontend session or URL token', () => {
  const adminHtml = fs.readFileSync(path.join(rootDir, 'admin.html'), 'utf-8');

  // Checks URL query parameters
  assert.ok(adminHtml.includes('urlParams.get(\'token\')'), 'Must check ?token= param');

  // Checks soundtest_session_v1 and sf_membership_v1
  assert.ok(adminHtml.includes('localStorage.getItem(\'soundtest_session_v1\')'), 'Must check soundtest_session_v1');
  assert.ok(adminHtml.includes('localStorage.getItem(\'sf_membership_v1\')'), 'Must check sf_membership_v1');

  // Pre-fills email
  assert.ok(adminHtml.includes('emailInput.value = detectedEmail'), 'Must pre-fill email if available');
});
