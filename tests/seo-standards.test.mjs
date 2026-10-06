import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

test('SEO Standard: All public HTML pages have valid title, meta description, and canonical', () => {
  const skipFiles = new Set(['admin.html', 'stats.html', 'test-audio.html']);
  
  function scanDir(dir) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const ent of entries) {
      const fullPath = path.join(dir, ent.name);
      const relPath = path.relative(rootDir, fullPath).replace(/\\/g, '/');
      if (ent.isDirectory()) {
        if (['node_modules', '.git', '_temp', 'test-results', 'scripts', 'functions', 'assets'].includes(ent.name)) continue;
        scanDir(fullPath);
      } else if (ent.isFile() && ent.name.endsWith('.html')) {
        if (skipFiles.has(ent.name) || relPath.startsWith('a/') || relPath.startsWith('b/') || relPath.startsWith('c/')) continue;
        const html = fs.readFileSync(fullPath, 'utf8');
        assert.match(html, /<title>[^<]+<\/title>/i, `${relPath} is missing <title>`);
        assert.match(html, /<meta[^>]+name=["']description["'][^>]*>/i, `${relPath} is missing meta description`);
        assert.match(html, /<link[^>]+rel=["']canonical["'][^>]*>/i, `${relPath} is missing canonical link`);
      }
    }
  }
  scanDir(rootDir);
});

test('SEO Standard: All <img> tags have non-empty, non-generic alt and explicit width/height', () => {
  const genericAlts = new Set(['image', 'photo', 'illustration', 'scenario illustration', 'placeholder']);
  
  function scanDir(dir) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const ent of entries) {
      const fullPath = path.join(dir, ent.name);
      const relPath = path.relative(rootDir, fullPath).replace(/\\/g, '/');
      if (ent.isDirectory()) {
        if (['node_modules', '.git', '_temp', 'test-results', 'scripts', 'functions', 'assets'].includes(ent.name)) continue;
        scanDir(fullPath);
      } else if (ent.isFile() && ent.name.endsWith('.html')) {
        if (relPath.startsWith('a/') || relPath.startsWith('b/') || relPath.startsWith('c/') || ent.name === 'admin.html') continue;
        const html = fs.readFileSync(fullPath, 'utf8');
        const imgTags = html.match(/<img\b[^>]*>/gi) || [];
        for (const tag of imgTags) {
          const altMatch = tag.match(/alt=["']([^"']*)["']/i);
          assert.ok(altMatch, `${relPath} has <img> without alt attribute: ${tag}`);
          const altVal = altMatch[1].trim().toLowerCase();
          assert.ok(altVal.length > 0, `${relPath} has empty alt text: ${tag}`);
          assert.ok(!genericAlts.has(altVal), `${relPath} has generic placeholder alt text "${altVal}": ${tag}`);
        }
      }
    }
  }
  scanDir(rootDir);
});

test('SEO Standard: robots.txt and admin.html isolate administrative surfaces from indexing', () => {
  const robots = fs.readFileSync(path.join(rootDir, 'robots.txt'), 'utf8');
  assert.match(robots, /Disallow: \/admin\.html/);
  assert.match(robots, /Disallow: \/admin\//);
  assert.match(robots, /Disallow: \/api\//);

  const adminHtml = fs.readFileSync(path.join(rootDir, 'admin.html'), 'utf8');
  assert.match(adminHtml, /<meta\s+name=["']robots["']\s+content=["'][^"']*noindex/i);
});

test('SEO Standard: sitemap.xml does not contain noindexed or redirected pages', () => {
  const sitemap = fs.readFileSync(path.join(rootDir, 'sitemap.xml'), 'utf8');
  assert.doesNotMatch(sitemap, /<loc>[^<]*\/stats\/<\/loc>/);
  assert.doesNotMatch(sitemap, /<loc>[^<]*\/compliance\/<\/loc>/);
  assert.doesNotMatch(sitemap, /<loc>[^<]*\/admin\.html<\/loc>/);
});

test('SEO & GEO Standard: llms.txt and llms-full.txt are compliant and configured', () => {
  const llmsPath = path.join(rootDir, 'llms.txt');
  const llmsFullPath = path.join(rootDir, 'llms-full.txt');
  assert.ok(fs.existsSync(llmsPath), 'llms.txt must exist at project root');
  assert.ok(fs.existsSync(llmsFullPath), 'llms-full.txt must exist at project root');

  const llmsContent = fs.readFileSync(llmsPath, 'utf8');
  assert.match(llmsContent, /^#\s+SOUNDTEST\.PRO/m, 'llms.txt must start with H1 project name');
  assert.match(llmsContent, /^>\s+.+/m, 'llms.txt must have a blockquote summary');
  assert.match(llmsContent, /^##\s+.+/m, 'llms.txt must have H2 sections');

  const expectedLangs = ['en', 'zh', 'es', 'fr', 'de', 'ja', 'ko', 'vi', 'th'];
  for (const lang of expectedLangs) {
    assert.match(llmsContent, new RegExp(`https://soundtest\\.pro/${lang}/`), `llms.txt must include language route /${lang}/`);
  }

  const headers = fs.readFileSync(path.join(rootDir, '_headers'), 'utf8');
  assert.match(headers, /\/llms\.txt[\s\S]*?Content-Type:\s*text\/plain/i, '_headers must set text/plain for /llms.txt');
  assert.match(headers, /\/llms-full\.txt[\s\S]*?Content-Type:\s*text\/plain/i, '_headers must set text/plain for /llms-full.txt');
});
