import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

test('WeChat Pay (Hupijiao) strict mobile vs PC parameter and redirection segregation', () => {
  const pricingJs = fs.readFileSync(path.join(rootDir, 'assets/membership-pricing.js'), 'utf8');
  const authJs = fs.readFileSync(path.join(rootDir, 'assets/site-auth.js'), 'utf8');
  const soundtestHtml = fs.readFileSync(path.join(rootDir, 'soundtest.html'), 'utf8');

  // 1. Verify membership-pricing.js adheres to XunhuPay official API documentation:
  // Mobile mode must NOT load or touch url_qrcode; PC mode must display url_qrcode and not redirect
  assert.ok(pricingJs.includes('function isMobileClient()'), 'membership-pricing.js defines isMobileClient helper');
  assert.ok(pricingJs.includes('qrcodeImg.src = \'\';'), 'Mobile mode in pricing clears qrcodeImg.src without requesting url_qrcode');
  assert.ok(pricingJs.includes('h5Btn.removeAttribute(\'target\')'), 'Mobile mode in pricing removes target="_blank" to prevent popup blocking');
  assert.ok(pricingJs.includes('window.location.href = data.url;'), 'Mobile mode in pricing triggers window.location.href to mobile url');
  assert.ok(pricingJs.includes('qrcodeImg.src = data.url_qrcode || fallbackUrl;'), 'PC mode in pricing uses url_qrcode');

  // 2. Verify site-auth.js adheres to XunhuPay official API documentation:
  assert.ok(authJs.includes('if (qrWrapper) qrWrapper.style.display = \'none\';'), 'Mobile mode in auth hides qrWrapper');
  assert.ok(authJs.includes('qrImg.src = \'\';'), 'Mobile mode in auth clears qrImg.src');
  assert.ok(authJs.includes('mobileBtn.removeAttribute(\'target\')'), 'Mobile mode in auth removes target="_blank"');
  assert.ok(authJs.includes('window.location.href = data.url;'), 'Mobile mode in auth triggers redirect');

  // 3. Verify soundtest.html mobile button does not have target="_blank"
  assert.ok(!soundtestHtml.includes('id="wxPayH5Btn" href="#" target="_blank"'), 'soundtest.html wxPayH5Btn does not have target="_blank"');
  assert.ok(soundtestHtml.includes('id="wxPayH5Btn" href="#" rel="noopener"'), 'soundtest.html wxPayH5Btn has rel="noopener" with default window target');
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
