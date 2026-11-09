import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

test('WeChat Pay (Hupijiao) strict mobile vs PC parameter, loading skeleton, and anti-cache defense', () => {
  const pricingJs = fs.readFileSync(path.join(rootDir, 'assets/membership-pricing.js'), 'utf8');
  const authJs = fs.readFileSync(path.join(rootDir, 'assets/site-auth.js'), 'utf8');
  const soundtestHtml = fs.readFileSync(path.join(rootDir, 'soundtest.html'), 'utf8');
  const headers = fs.readFileSync(path.join(rootDir, '_headers'), 'utf8');
  const swJs = fs.readFileSync(path.join(rootDir, 'sw.js'), 'utf8');

  // 1. Verify membership-pricing.js adheres to XunhuPay official API documentation:
  // Mobile mode must NOT load or touch url_qrcode; PC mode must display url_qrcode and not redirect
  assert.ok(pricingJs.includes('function isMobileClient()'), 'membership-pricing.js defines isMobileClient helper');
  assert.ok(pricingJs.includes('qrcodeImg.src = \'\';'), 'Mobile mode in pricing clears qrcodeImg.src without requesting url_qrcode');
  assert.ok(pricingJs.includes('h5Btn.setAttribute(\'target\', \'_blank\');'), 'Mobile mode in pricing enables external browser launch for PWA standalone shortcuts');
  assert.ok(pricingJs.includes('copyBtn.onclick'), 'Mobile mode in pricing provides copy payment link fallback for homescreen shortcut apps');
  assert.ok(pricingJs.includes('qrcodeImg.src = data.url_qrcode || fallbackUrl;'), 'PC mode in pricing uses url_qrcode');

  // 2. Verify soundtest.html eliminates broken image flash and provides copy fallback
  assert.ok(soundtestHtml.includes('id="wxPayLoadingWrap"'), 'soundtest.html includes loading skeleton to eliminate broken image flash');
  assert.ok(soundtestHtml.includes('id="wxQrcodeWrap" style="display:none;"'), 'soundtest.html hides QR wrapper by default to prevent broken image placeholder');
  assert.ok(soundtestHtml.includes('id="wxCopyPayUrlBtn"'), 'soundtest.html includes copy payment URL button');
  assert.ok(soundtestHtml.includes('/assets/membership-pricing.js?v=20261109_v17'), 'soundtest.html uses versioned cache-busting script tag');

  // 3. Verify caching and Service Worker defense against stale mobile assets
  assert.ok(headers.includes('/assets/membership-pricing.js\n  Cache-Control: public, max-age=0, must-revalidate, no-transform') ||
            headers.includes('/assets/membership-pricing.js\r\n  Cache-Control: public, max-age=0, must-revalidate, no-transform'),
            '_headers specifies max-age=0, must-revalidate for membership-pricing.js');
  assert.ok(swJs.includes('soundtest-pro-v17'), 'sw.js bumped cache version to soundtest-pro-v17');
  assert.ok(swJs.includes('/assets/membership-pricing.js'), 'sw.js includes membership-pricing.js in network-first paths');

  // 4. Verify return_url auto-enrichment and mobile sync return listener
  const createJs = fs.readFileSync(path.join(rootDir, 'functions/api/payment/hupijiao-create.js'), 'utf8');
  assert.ok(createJs.includes('u.searchParams.set(\'wx_return\', \'1\');'), 'hupijiao-create.js attaches wx_return to return_url');
  assert.ok(createJs.includes('u.searchParams.set(\'order_id\', trade_order_id);'), 'hupijiao-create.js attaches trade_order_id to return_url');
  assert.ok(pricingJs.includes('params.get(\'wx_return\') === \'1\''), 'membership-pricing.js listens for wx_return param to auto-unlock upon mobile return');
});

test('Zero 51.la rogue tracking scripts across entire project', () => {
  function scanDir(dir) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      if (entry.name === 'node_modules' || entry.name === '.git' || entry.name === '.gemini' || entry.name === 'scratch') continue;
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        scanDir(fullPath);
      } else if (entry.name.endsWith('.html')) {
        const content = fs.readFileSync(fullPath, 'utf8');
        assert.ok(!content.includes('51.la'), `File ${fullPath} must not contain 51.la`);
        assert.ok(!content.includes('LA_COLLECT'), `File ${fullPath} must not contain LA_COLLECT`);
        assert.ok(!content.includes('281wblDNvub2tk9f'), `File ${fullPath} must not contain 51.la account id`);
      }
    }
  }

  scanDir(rootDir);
});
