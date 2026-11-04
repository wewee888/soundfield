import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

test('S1-a (F3): /standards has visible FAQ and valid FAQPage JSON-LD with 7 finalized questions', () => {
  const html = fs.readFileSync(path.join(rootDir, 'standards.html'), 'utf8');
  assert.match(html, /id="faq"/);
  assert.match(html, /<h3>What are the WHO recommended day and night noise limits\?<\/h3>/);
  assert.match(html, /<h3>What are the recommended noise limits for bedrooms, classrooms, and residential areas\?<\/h3>/);
  assert.match(html, /<h3>Above how many decibels is noise considered a disturbance\?<\/h3>/);
  assert.match(html, /<h3>What are the OSHA permissible exposure limits and action levels for noise\?<\/h3>/);
  assert.match(html, /<h3>Why is there no single universal decibel limit for environmental noise\?<\/h3>/);
  assert.match(html, /<h3>Can a browser noise reading prove a legal noise violation\?<\/h3>/);
  assert.match(html, /<h3>Why can't a single night's recording be directly compared to WHO Lden or Lnight targets\?<\/h3>/);

  const jsonLdMatches = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/gi);
  assert.ok(jsonLdMatches && jsonLdMatches.length >= 2, 'Should have at least 2 JSON-LD scripts');

  const faqJsonLd = jsonLdMatches.find(s => s.includes('"FAQPage"'));
  assert.ok(faqJsonLd, 'Should include FAQPage schema');
  const jsonStr = faqJsonLd.replace(/<script[^>]*>|<\/script>/gi, '');
  const parsed = JSON.parse(jsonStr);
  assert.equal(parsed['@type'], 'FAQPage');
  assert.equal(parsed.mainEntity.length, 7, 'standards.html should have 7 FAQ items in JSON-LD');
});

test('S1-b (F4): /accuracy has visible FAQ and valid FAQPage JSON-LD with 5 questions including dBA/dBC and SHA-256', () => {
  const html = fs.readFileSync(path.join(rootDir, 'accuracy.html'), 'utf8');
  assert.match(html, /id="faq"/);
  assert.match(html, /<h3>How accurate is a phone or browser decibel meter\?<\/h3>/);
  assert.match(html, /<h3>What is the difference between a phone meter and a professional sound level meter\?<\/h3>/);
  assert.match(html, /<h3>What scenarios is a browser noise reading suitable or not suitable for\?<\/h3>/);
  assert.match(html, /<h3>What is the difference between dBA and dBC frequency weighting\?<\/h3>/);
  assert.match(html, /<h3>What does the SHA-256 hash prove in exported evidence reports\?<\/h3>/);

  const jsonLdMatches = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/gi);
  const faqJsonLd = jsonLdMatches.find(s => s.includes('"FAQPage"'));
  assert.ok(faqJsonLd, 'Should include FAQPage schema');
  const jsonStr = faqJsonLd.replace(/<script[^>]*>|<\/script>/gi, '');
  const parsed = JSON.parse(jsonStr);
  assert.equal(parsed['@type'], 'FAQPage');
  assert.equal(parsed.mainEntity.length, 5, 'accuracy.html should have 5 FAQ items in JSON-LD');
});

test('S1-c: /zh/gb-3096-2008 has visible FAQ and FAQPage JSON-LD exactly matching table numbers', () => {
  const html = fs.readFileSync(path.join(rootDir, 'zh/gb-3096-2008.html'), 'utf8');
  assert.match(html, /id="faq"/);
  assert.match(html, /GB 3096-2008 各类声环境功能区的昼间和夜间噪声限值是多少？/);
  assert.match(html, /0 类区昼间 50 dB\(A\)、夜间 40 dB\(A\)/);
  assert.match(html, /1 类区昼间 55 dB\(A\)、夜间 45 dB\(A\)/);
  assert.match(html, /4a 类区昼间 70 dB\(A\)、夜间 55 dB\(A\)/);
  assert.match(html, /4b 类区昼间 70 dB\(A\)、夜间 60 dB\(A\)/);

  const jsonLdMatches = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/gi);
  const faqJsonLd = jsonLdMatches.find(s => s.includes('"FAQPage"'));
  assert.ok(faqJsonLd, 'Should include FAQPage schema in gb-3096');
  const jsonStr = faqJsonLd.replace(/<script[^>]*>|<\/script>/gi, '');
  const parsed = JSON.parse(jsonStr);
  assert.equal(parsed['@type'], 'FAQPage');
  assert.equal(parsed.mainEntity.length, 4);
});

test('S1-6 (F2): /es/standards has visible FAQ and valid FAQPage JSON-LD with 3 Spanish questions', () => {
  const html = fs.readFileSync(path.join(rootDir, 'es/standards.html'), 'utf8');
  assert.match(html, /id="faq"/);
  assert.match(html, /<h3>¿Cuáles son los límites de ruido recomendados por la OMS para el descanso nocturno y el día\?<\/h3>/);
  assert.match(html, /<h3>¿Existe un límite único universal de decibelios para considerar que un ruido es ilegal\?<\/h3>/);
  assert.match(html, /<h3>¿Puede una grabación o medición de ruido con el teléfono móvil demostrar una infracción legal o administrativa\?<\/h3>/);

  const jsonLdMatches = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/gi);
  const faqJsonLd = jsonLdMatches.find(s => s.includes('"FAQPage"'));
  assert.ok(faqJsonLd, 'Should include FAQPage schema in es/standards.html');
  const jsonStr = faqJsonLd.replace(/<script[^>]*>|<\/script>/gi, '');
  const parsed = JSON.parse(jsonStr);
  assert.equal(parsed['@type'], 'FAQPage');
  assert.equal(parsed.mainEntity.length, 3);
});

test('S1-d (F5): /soundtest tool page has h1 with finalized wording Online Sound Level Meter & Noise Evidence Recorder', () => {
  const html = fs.readFileSync(path.join(rootDir, 'soundtest.html'), 'utf8');
  assert.match(html, /<h1[^>]*>Online Sound Level Meter &amp; Noise Evidence Recorder<\/h1>/);
});

test('S2-a & S2-补: /noise-levels 6 languages have 3-5 sentence conclusion block, source notes, and 3 tailored FAQPage JSON-LD', () => {
  const langs = [
    { file: 'noise-levels.html', callout: 'Key Takeaways', questions: 3 },
    { file: 'es/noise-levels.html', callout: 'Resumen Clave', questions: 3 },
    { file: 'de/noise-levels.html', callout: 'Kernfazit', questions: 3 },
    { file: 'fr/noise-levels.html', callout: 'Synthèse Clé', questions: 3 },
    { file: 'zh/noise-levels.html', callout: '核心速查', questions: 3 },
    { file: 'ja/noise-levels.html', callout: '要点総括', questions: 3 },
  ];

  for (const { file, callout, questions } of langs) {
    const html = fs.readFileSync(path.join(rootDir, file), 'utf8');
    assert.ok(html.includes(callout), `${file} should include callout: ${callout}`);
    assert.match(html, /id="faq(-section)?"/, `${file} should have visible FAQ section`);

    const jsonLdMatches = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/gi);
    const faqJsonLd = jsonLdMatches.find(s => s.includes('"FAQPage"'));
    assert.ok(faqJsonLd, `${file} should include FAQPage schema`);
    const jsonStr = faqJsonLd.replace(/<script[^>]*>|<\/script>/gi, '');
    const parsed = JSON.parse(jsonStr);
    assert.equal(parsed['@type'], 'FAQPage');
    assert.equal(parsed.mainEntity.length, questions, `${file} should have ${questions} FAQ items in JSON-LD`);
  }
});

test('S2-b & F6: /how-loud-is-85-db exists with valid FAQPage, OSHA/NIOSH table, and OSHA Table G-16 interpolation note', () => {
  const html = fs.readFileSync(path.join(rootDir, 'how-loud-is-85-db.html'), 'utf8');
  assert.match(html, /<link rel="canonical" href="https:\/\/soundtest\.pro\/how-loud-is-85-db">/);
  assert.match(html, /<h1[^>]*>How loud is 85 dB\?<\/h1>/i);
  assert.match(html, /NIOSH REL \(3 dB Rule\)/);
  assert.match(html, /OSHA PEL \(5 dB Rule\)/);
  assert.match(html, /Note on OSHA Table G-16 values/);
  assert.match(html, /id="faq"/);

  const jsonLdMatches = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/gi);
  const faqJsonLd = jsonLdMatches.find(s => s.includes('"FAQPage"'));
  assert.ok(faqJsonLd, 'Should include FAQPage schema');
  const jsonStr = faqJsonLd.replace(/<script[^>]*>|<\/script>/gi, '');
  const parsed = JSON.parse(jsonStr);
  assert.equal(parsed['@type'], 'FAQPage');
  assert.equal(parsed.mainEntity.length, 3);
});

test('F1: Cancelled pages dba-vs-dbc and how-loud-is-120-db are deleted and unreferenced', () => {
  assert.ok(!fs.existsSync(path.join(rootDir, 'dba-vs-dbc.html')), 'dba-vs-dbc.html should be deleted');
  assert.ok(!fs.existsSync(path.join(rootDir, 'how-loud-is-120-db.html')), 'how-loud-is-120-db.html should be deleted');

  const sitemap = fs.readFileSync(path.join(rootDir, 'sitemap.xml'), 'utf8');
  const count = (sitemap.match(/<url>/g) || []).length;
  assert.equal(count, 30, 'Sitemap should contain exactly 30 URLs');
  assert.doesNotMatch(sitemap, /dba-vs-dbc/);
  assert.doesNotMatch(sitemap, /how-loud-is-120-db/);
  assert.match(sitemap, /how-loud-is-85-db/);

  const llms = fs.readFileSync(path.join(rootDir, 'llms.txt'), 'utf8');
  assert.doesNotMatch(llms, /dba-vs-dbc/);
  assert.doesNotMatch(llms, /how-loud-is-120-db/);
  assert.match(llms, /how-loud-is-85-db/);
  assert.match(llms, /How loud is 30–110 dB\?/);
});
