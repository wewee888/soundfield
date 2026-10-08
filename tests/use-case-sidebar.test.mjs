import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');

const SCENARIOS = [
  'neighbor-noise-evidence.html',
  'bar-street-disturbance.html',
  'construction-noise-monitoring.html',
  'property-noise-complaint-report.html',
  'rental-dispute-evidence.html',
  'workplace-noise-inspection.html'
];

const ALL_LOCALES = ['en', 'zh', 'es', 'de', 'fr', 'ja', 'ko', 'th', 'vi'];

test('all root use-case articles contain 2-column layout and sticky right sidebar', () => {
  SCENARIOS.forEach((file) => {
    const filePath = path.join(ROOT_DIR, 'use-cases', file);
    assert.ok(fs.existsSync(filePath), `Missing root use-case: ${file}`);
    const html = fs.readFileSync(filePath, 'utf8');

    assert.ok(html.includes('class="uc-article-layout"'), `Missing uc-article-layout in ${file}`);
    assert.ok(html.includes('class="uc-article-main"'), `Missing uc-article-main in ${file}`);
    assert.ok(html.includes('class="uc-article-sidebar"'), `Missing uc-article-sidebar in ${file}`);
    assert.ok(html.includes('id="benchmarks"'), `Missing #benchmarks in ${file}`);
    assert.ok(html.includes('id="workflow"'), `Missing #workflow in ${file}`);
    assert.ok(html.includes('id="capabilities"'), `Missing #capabilities in ${file}`);
    assert.ok(html.includes('id="rules"'), `Missing #rules in ${file}`);
    assert.ok(html.includes('id="faq-section"'), `Missing #faq-section in ${file}`);

    // Check sidebar components
    assert.ok(html.includes('class="uc-sb-card uc-sb-meter"'), `Missing meter card in ${file}`);
    assert.ok(html.includes('class="uc-sb-card uc-sb-toc"'), `Missing toc card in ${file}`);
    assert.ok(html.includes('class="uc-sb-card uc-sb-cheat"'), `Missing cheat sheet in ${file}`);
    assert.ok(html.includes('class="uc-sb-card uc-sb-legal"'), `Missing legal dossier in ${file}`);
    assert.ok(html.includes('class="uc-sb-trust"'), `Missing trust badges in ${file}`);
  });
});

test('all localized use-case articles across 9 locales feature responsive right sidebar without language leakage', () => {
  ALL_LOCALES.forEach((locale) => {
    SCENARIOS.forEach((file) => {
      const filePath = path.join(ROOT_DIR, 'use-cases', locale, file);
      assert.ok(fs.existsSync(filePath), `Missing ${locale}/${file}`);
      const html = fs.readFileSync(filePath, 'utf8');

      assert.ok(html.includes('class="uc-article-layout"'), `Missing uc-article-layout in ${locale}/${file}`);
      assert.ok(html.includes('class="uc-article-main"'), `Missing uc-article-main in ${locale}/${file}`);
      assert.ok(html.includes('class="uc-article-sidebar"'), `Missing uc-article-sidebar in ${locale}/${file}`);
      assert.ok(html.includes('id="benchmarks"'), `Missing #benchmarks in ${locale}/${file}`);
      assert.ok(html.includes('id="workflow"'), `Missing #workflow in ${locale}/${file}`);
      assert.ok(html.includes('id="capabilities"'), `Missing #capabilities in ${locale}/${file}`);
      assert.ok(html.includes('id="rules"'), `Missing #rules in ${locale}/${file}`);
      assert.ok(html.includes('id="faq-section"'), `Missing #faq-section in ${locale}/${file}`);

      const sidebarMatch = html.match(/<aside class="uc-article-sidebar">([\s\S]*?)<\/aside>/);
      assert.ok(sidebarMatch, `Sidebar not found in ${locale}/${file}`);
      const sidebarContent = sidebarMatch[1];

      if (['en', 'es', 'de', 'fr', 'th', 'vi', 'ko'].includes(locale)) {
        // Western, Thai, Vietnamese, and Korean sidebars must NOT contain Chinese characters
        const hasChinese = /[\u4e00-\u9fa5]/.test(sidebarContent);
        assert.strictEqual(hasChinese, false, `Sidebar in ${locale}/${file} contains leaked Chinese characters!`);
      } else if (locale === 'ja') {
        // Japanese sidebar must contain Japanese kana and NOT contain Chinese-specific phrases
        const hasKana = /[\u3040-\u30ff]/.test(sidebarContent);
        assert.ok(hasKana, `Japanese sidebar in ${locale}/${file} should contain Kana`);
        assert.ok(!sidebarContent.includes('在线分贝测量仪'), `Japanese sidebar leaked Chinese title`);
        assert.ok(!sidebarContent.includes('打开实时测量仪'), `Japanese sidebar leaked Chinese button`);
      } else if (locale === 'zh') {
        assert.ok(sidebarContent.includes('在线分贝测量仪'), `Chinese sidebar missing expected title`);
      }
    });
  });
});
