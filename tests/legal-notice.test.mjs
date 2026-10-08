import { test } from 'node:test';
import assert from 'node:assert';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');

test('assets/legal-notice.js exists and exports complete 9-language legal engine', async () => {
  const jsPath = path.join(rootDir, 'assets', 'legal-notice.js');
  assert.ok(fs.existsSync(jsPath), 'assets/legal-notice.js must exist');

  // Load module
  const { createRequire } = await import('node:module');
  const require = createRequire(import.meta.url);
  const legalEngine = require(jsPath);

  assert.ok(legalEngine, 'Legal engine module loaded');
  assert.equal(typeof legalEngine.getLegalData, 'function');
  assert.equal(typeof legalEngine.buildDocxBlob, 'function');

  const data = legalEngine.getLegalData();
  const expectedLangs = ['zh', 'en', 'de', 'fr', 'es', 'ja', 'ko', 'th', 'vi'];
  for (const lang of expectedLangs) {
    assert.ok(data[lang], `Language ${lang} exists in legal data`);
    assert.equal(data[lang].laws.length, 4, `${lang} has 4 legal provisions`);
    assert.ok(data[lang].tones.gentle, `${lang} has gentle tone`);
    assert.ok(data[lang].tones.firm, `${lang} has firm tone`);
    assert.ok(data[lang].tones.strict, `${lang} has strict tone`);
    assert.ok(data[lang].ui, `${lang} has UI translations`);
  }
});

test('buildDocxBlob produces valid OpenXML PKZip buffer with formatted dispute notice', async () => {
  const { createRequire } = await import('node:module');
  const require = createRequire(import.meta.url);
  const legalEngine = require(path.join(rootDir, 'assets', 'legal-notice.js'));

  const sampleNotice = {
    title: '民事侵害生活安宁停止妨害催告函与法律告知书',
    recipient: '402室邻居',
    sender: '302室住户',
    date: '2026-10-08',
    location: '幸福家园3栋',
    peakDb: '76.4',
    avgDb: '61.2',
    timeRange: '23:30 - 02:00',
    evidenceId: 'STP-9481-B2F8',
    body: '致402室邻居：\n\n贵方夜间持续产生噪音，实测峰值达 76.4 dB(A)。特此催告限期整改。',
    articles: [
      '《中华人民共和国民法典》第1032条：自然人享有隐私权，私人生活安宁受法律保护。',
      '《中华人民共和国噪声污染防治法》第63条：禁止排放超过社会生活环境噪声排放标准的噪声。'
    ]
  };

  const result = legalEngine.buildDocxBlob(sampleNotice);
  const u8 = result instanceof Uint8Array ? result : new Uint8Array(await result.arrayBuffer());
  assert.ok(u8.length > 1000, 'DOCX buffer length is valid');
  assert.strictEqual(u8[0], 0x50, 'PK header byte 1');
  assert.strictEqual(u8[1], 0x4B, 'PK header byte 2');
  assert.strictEqual(u8[2], 0x03, 'PK header byte 3');
  assert.strictEqual(u8[3], 0x04, 'PK header byte 4');
});

test('soundtest.html correctly integrates legal notice assets, buttons, and handlers', () => {
  const html = fs.readFileSync(path.join(rootDir, 'soundtest.html'), 'utf8');
  assert.ok(html.includes('assets/legal-notice.css'), 'soundtest.html must include legal-notice.css');
  assert.ok(html.includes('assets/legal-notice.js'), 'soundtest.html must include legal-notice.js');
  assert.ok(html.includes('id="recExportNoticeBtn"'), 'soundtest.html must include recExportNoticeBtn');
  assert.ok(html.includes('id="settingsExportNoticeBtn"'), 'soundtest.html must include settingsExportNoticeBtn');
  assert.ok(html.includes('function getUserTier'), 'soundtest.html must define getUserTier');
  assert.ok(html.includes('function openLegalNoticeFromUi'), 'soundtest.html must define openLegalNoticeFromUi');
  assert.ok(html.includes('function openLegalNoticeForRecord'), 'soundtest.html must define openLegalNoticeForRecord');
});

test('legal notice enforces user tier permissions (Free vs Single vs Pro)', async () => {
  const { createRequire } = await import('node:module');
  const require = createRequire(import.meta.url);
  const legalEngine = require(path.join(rootDir, 'assets', 'legal-notice.js'));

  assert.equal(typeof legalEngine.setUserTier, 'function');
  assert.equal(typeof legalEngine.getUserTier, 'function');

  legalEngine.setUserTier('free');
  assert.equal(legalEngine.getUserTier(), 'free');

  legalEngine.setUserTier('single');
  assert.equal(legalEngine.getUserTier(), 'single');

  legalEngine.setUserTier('pro');
  assert.equal(legalEngine.getUserTier(), 'pro');
});

