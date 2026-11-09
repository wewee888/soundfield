import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

test('Creem.io USD checkout strict mobile vs PC handling in soundtest.html and site-auth.js', () => {
  const soundtestHtml = fs.readFileSync(path.join(rootDir, 'soundtest.html'), 'utf8').replace(/\r\n/g, '\n');
  const authJs = fs.readFileSync(path.join(rootDir, 'assets/site-auth.js'), 'utf8').replace(/\r\n/g, '\n');
  const pricingJs = fs.readFileSync(path.join(rootDir, 'assets/membership-pricing.js'), 'utf8').replace(/\r\n/g, '\n');

  // 1. Verify all 4 Creem production product URLs are defined
  const expectedTiers = ['single', 'monthly', 'yearly', 'lifetime'];
  for (const tier of expectedTiers) {
    assert.ok(pricingJs.includes(`${tier}: 'https://www.creem.io/payment/prod_`), `pricingJs has ${tier} Creem checkout link`);
  }

  // 2. In soundtest.html:
  // Mobile uses window.location.href (avoiding popup blocker)
  // Desktop uses window.open with fallback to window.location.href
  assert.ok(soundtestHtml.includes('if (isMobile) {\n    window.location.href = finalUrl;\n  } else {\n    const newWin = window.open(finalUrl, \'_blank\', \'noopener\');'),
    'soundtest.html executes window.location.href on mobile and window.open on PC');

  // 3. In site-auth.js:
  // Mobile mode hides un-scannable QR code and removes target="_blank"
  assert.ok(authJs.includes('if (isMobile) {\n            // 📱 移动端：直接跳转收银台或点击同窗唤起'), 'site-auth.js has mobile Creem flow');
  assert.ok(authJs.includes('creemBtn.removeAttribute(\'target\')'), 'site-auth.js removes target="_blank" on mobile to avoid popup blocker');
  assert.ok(authJs.includes('window.location.href = data.checkoutUrl;'), 'site-auth.js redirects to Creem on mobile');
  assert.ok(authJs.includes('qrImg.src = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&margin=4&data=${encodeURIComponent(data.checkoutUrl)}`'),
    'site-auth.js renders QR code on PC for mobile scanning');
});

test('Creem checkout creation API endpoint supports plan mapping and KV record', async () => {
  const createPath = path.join(rootDir, 'functions/api/membership/create-checkout.js');
  const createModule = await import(`file://${createPath.replace(/\\/g, '/')}`);

  const mockStore = new Map();
  const mockKV = {
    async get(key) { return mockStore.get(key) || null; },
    async put(key, val) { mockStore.set(key, val); },
  };

  const req = new Request('https://soundtest.pro/api/membership/create-checkout', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      plan: 'yearly',
      email: 'overseas.buyer@test.com',
      source: 'test-suite',
    }),
  });

  const res = await createModule.onRequestPost({ request: req, env: { ab_test: mockKV } });
  assert.equal(res.status, 200);
  const data = await res.json();
  assert.equal(data.ok, true);
  assert.equal(data.plan, 'team'); // yearly maps to team internally
  assert.ok(data.checkoutUrl.includes('https://www.creem.io/payment/prod_18imyd506sx0xFOcMiqB2c'));
  assert.ok(data.checkoutUrl.includes('email=overseas.buyer%40test.com'));

  // Verify KV pending order was created
  const storedKeys = Array.from(mockStore.keys());
  const orderKey = storedKeys.find(k => k.startsWith('order:creem_'));
  assert.ok(orderKey, 'KV must store creem pending order');
  const storedOrder = JSON.parse(mockStore.get(orderKey));
  assert.equal(storedOrder.currency, 'USD');
  assert.equal(storedOrder.provider, 'creem');
  assert.equal(storedOrder.status, 'pending');
});
