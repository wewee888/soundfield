import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

test('Security Audit: assets/site-auth.js enforces strict open redirect protection', () => {
  const siteAuthPath = path.join(rootDir, 'assets/site-auth.js');
  const code = fs.readFileSync(siteAuthPath, 'utf8');

  assert.ok(code.includes('sanitizeRedirectUrl'), 'assets/site-auth.js must declare sanitizeRedirectUrl');
  assert.ok(code.includes('__sfSanitizeRedirectUrl'), 'assets/site-auth.js must expose __sfSanitizeRedirectUrl');
  assert.ok(code.includes('javascript|data|vbscript|mailto'), 'Must block malicious URI schemes');
  assert.ok(code.includes('protocol-relative'), 'Must block protocol-relative URLs');
});

test('Security Audit: functions/api/auth/magic-link.js & verify-magic.js sanitize redirect_to against external URLs', async () => {
  const magicLinkPath = path.join(rootDir, 'functions/api/auth/magic-link.js');
  const verifyMagicPath = path.join(rootDir, 'functions/api/auth/verify-magic.js');

  const magicLinkCode = fs.readFileSync(magicLinkPath, 'utf8');
  const verifyMagicCode = fs.readFileSync(verifyMagicPath, 'utf8');

  assert.ok(magicLinkCode.includes('sanitizeRedirectUrl'), 'magic-link.js must define sanitizeRedirectUrl');
  assert.ok(magicLinkCode.includes('sanitizeRedirectUrl(body.redirect_to'), 'magic-link.js must sanitize body.redirect_to');

  assert.ok(verifyMagicCode.includes('sanitizeRedirectUrl'), 'verify-magic.js must define sanitizeRedirectUrl');
  assert.ok(verifyMagicCode.includes('sanitizeRedirectUrl(storedPayload.redirect_to'), 'verify-magic.js must sanitize storedPayload.redirect_to');

  // Dynamically test magic-link endpoint rejection of external porn / phishing URLs
  const magicModule = await import(`file://${magicLinkPath.replace(/\\/g, '/')}`);
  const mockEnv = {
    ab_test: {
      async put(key, val) {},
      async get(key) { return null; },
      async delete(key) {},
    },
  };

  const maliciousUrls = [
    'https://porn-site.example.com',
    'http://phishing.example.com/login',
    '//attacker.com/evil',
    '/\\attacker.com',
    'javascript:alert(document.cookie)',
    'data:text/html,<script>alert(1)</script>',
  ];

  for (const evilUrl of maliciousUrls) {
    const req = new Request('https://soundtest.pro/api/auth/magic-link', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ email: 'test@example.com', redirect_to: evilUrl }),
    });
    const res = await magicModule.onRequestPost({ request: req, env: mockEnv });
    assert.equal(res.status, 200);
    const data = await res.json();
    if (data.test_url) {
      assert.ok(!data.test_url.includes(evilUrl), `test_url must NOT contain evil external redirect: ${evilUrl}`);
    }
  }
});

test('Security Audit: _headers file enforces anti-clickjacking and referrer policy', () => {
  const headersPath = path.join(rootDir, '_headers');
  const headersContent = fs.readFileSync(headersPath, 'utf8');

  assert.ok(headersContent.includes('X-Frame-Options: SAMEORIGIN'), '_headers must include X-Frame-Options');
  assert.ok(headersContent.includes('Referrer-Policy: strict-origin-when-cross-origin'), '_headers must include Referrer-Policy');
});
