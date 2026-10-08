import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';

const projectRoot = process.cwd();

test('soundtest.html includes Pro certificate engine, watermarked free summary, and dual export functions', async () => {
  const html = await fs.readFile(path.join(projectRoot, 'soundtest.html'), 'utf-8');
  const certJs = await fs.readFile(path.join(projectRoot, 'assets', 'report-cert-engine.js'), 'utf-8');
  const code = html + '\n' + certJs;

  // Verify assets import
  assert.ok(html.includes('assets/report-cert-engine.js'), 'soundtest.html must import report-cert-engine.js');

  // Verify functions exist
  assert.ok(code.includes('function buildProCertificateCanvas(stats, isWatermarked = false)'), 'buildProCertificateCanvas must be defined');
  assert.ok(code.includes('function buildSessionSummaryCanvas(stats, isWatermarked = true)'), 'buildSessionSummaryCanvas must be defined with watermark option');
  assert.ok(code.includes('function buildStatsFromRecord(r)'), 'buildStatsFromRecord must be defined');
  assert.ok(code.includes('function exportSessionSummaryImage()'), 'exportSessionSummaryImage must be defined');
  assert.ok(code.includes('function buildPDF(recs, isWatermarked = null)'), 'buildPDF must support watermarking parameter');

  // Verify Pro vs Free stop behavior
  assert.ok(code.includes('const canvas = buildProCertificateCanvas(stats, false);'), 'Pro mode must generate clean certificate canvas');
  assert.ok(code.includes('const canvas = buildSessionSummaryCanvas(stats, true);'), 'Free mode must generate watermarked summary canvas');

  // Verify 1620px height in free summary to avoid bottom cutoff
  assert.ok(code.includes('canvas.width=1080;canvas.height=1620;'), 'Free summary canvas height must be 1620px to prevent cutoff');

  // Verify 800x1400 mobile-first ratio in pro certificate canvas (reduced width by 1/3)
  assert.ok(code.includes('canvas.width = 800') && code.includes('canvas.height = 1400'), 'Pro certificate canvas must have 800x1400 resolution');

  // Verify PDF embedding canvas
  assert.ok(code.includes("doc.addImage(imgData, 'PNG'"), 'buildPDF must embed certificate image onto A4 page');

  // Verify dynamic peak circle positioning in trend chart SVG
  assert.ok(code.includes("elPeakCircle.setAttribute('cx', String(peakX));"), 'renderCertificateData must position peak circle cx dynamically');
  assert.ok(code.includes("elPeakCircle.setAttribute('cy', String(peakY));"), 'renderCertificateData must position peak circle cy dynamically');

  // Verify dual download buttons in modal
  assert.ok(html.includes("id=\"rpmDownloadFreeBtn\""), 'PDF download button must exist in modal');
  assert.ok(html.includes("id=\"rpmDownloadImageBtn\""), 'Image download button must exist in modal');
});
