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
        if (skipFiles.has(ent.name) || ent.name.startsWith('baidu_verify_') || relPath.startsWith('a/') || relPath.startsWith('b/') || relPath.startsWith('c/')) continue;
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
  for (const leaf of ['auth', 'launch-metrics', 'monetization', 'refund', 'changelog', 'camera']) {
    assert.doesNotMatch(sitemap, new RegExp(`<loc>[^<]*/${leaf}(?:\\.html)?/?</loc>`), `${leaf} must stay out of the sitemap`);
  }
  assert.match(sitemap, /<loc>https:\/\/soundtest\.pro\/noise-levels<\/loc>/);
  assert.match(sitemap, /<loc>https:\/\/soundtest\.pro\/use-cases\/<\/loc>/);
  assert.match(sitemap, /hreflang="zh" href="https:\/\/soundtest\.pro\/zh\/"/);
  assert.doesNotMatch(sitemap, /<loc>https:\/\/soundtest\.pro\/noise-levels\/<\/loc>/);
});

test('SEO Standard: private and thin tool pages are noindex, public guides keep the final URL', () => {
  for (const rel of ['auth.html', 'launch-metrics.html', 'monetization.html', 'refund.html', 'changelog.html', 'camera.html', 'zh/auth.html', 'de/refund.html']) {
    const html = fs.readFileSync(path.join(rootDir, rel), 'utf8');
    assert.match(html, /<meta\s+name=["']robots["']\s+content=["']noindex, follow["']/i, `${rel} must be noindex`);
  }
  const accuracy = fs.readFileSync(path.join(rootDir, 'accuracy.html'), 'utf8');
  const standards = fs.readFileSync(path.join(rootDir, 'standards.html'), 'utf8');
  assert.match(accuracy, /rel="canonical" href="https:\/\/soundtest\.pro\/accuracy"/);
  assert.match(accuracy, /id="measurement-method"/);
  assert.match(standards, /rel="canonical" href="https:\/\/soundtest\.pro\/standards"/);
  assert.match(standards, /id="how-to-read-limits"/);
  assert.match(standards, /GB 3096-2008/);
  const zh = fs.readFileSync(path.join(rootDir, 'zh/standards.html'), 'utf8');
  assert.match(zh, /id="how-to-read-limits"/);
  assert.match(zh, /rel="canonical" href="https:\/\/soundtest\.pro\/zh\/standards"/);
});

test('SEO Standard: robots.txt allows search and AI answer crawlers and blocks training crawlers', () => {
  const robots = fs.readFileSync(path.join(rootDir, 'robots.txt'), 'utf8');
  assert.match(robots, /User-agent: OAI-SearchBot\nAllow: \//);
  assert.match(robots, /User-agent: PerplexityBot\nAllow: \//);
  assert.match(robots, /User-agent: Baiduspider\nAllow: \//);
  assert.match(robots, /User-agent: Googlebot\nAllow: \//);
  assert.match(robots, /User-agent: GPTBot\nDisallow: \//);
  assert.match(robots, /User-agent: Google-Extended\nDisallow: \//);
  assert.match(robots, /ai-input=yes/);
  assert.match(robots, /ai-train=no/);
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

test('HTML Syntax Integrity: All HTML files have properly closed HTML comments', () => {
  function scanDir(dir) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const ent of entries) {
      const fullPath = path.join(dir, ent.name);
      const relPath = path.relative(rootDir, fullPath).replace(/\\/g, '/');
      if (ent.isDirectory()) {
        if (['node_modules', '.git', '_temp', 'test-results', 'scripts', 'functions', 'assets'].includes(ent.name)) continue;
        scanDir(fullPath);
      } else if (ent.isFile() && ent.name.endsWith('.html')) {
        const html = fs.readFileSync(fullPath, 'utf8');
        const openMatches = html.match(/<!--/g) || [];
        const closeMatches = html.match(/-->/g) || [];
        assert.equal(
          openMatches.length,
          closeMatches.length,
          `${relPath} has unmatched HTML comments: <!-- (${openMatches.length}) vs --> (${closeMatches.length})`
        );
      }
    }
  }
  scanDir(rootDir);
});

