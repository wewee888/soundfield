import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';

const projectRoot = process.cwd();

test('soundtest.html includes Pro certificate engine, watermarked free summary, and dual export functions', async () => {
  const html = await fs.readFile(path.join(projectRoot, 'soundtest.html'), 'utf-8');

  // Verify functions exist
  assert.ok(html.includes('function buildProCertificateCanvas(stats, isWatermarked = false)'), 'buildProCertificateCanvas must be defined');
  assert.ok(html.includes('function buildSessionSummaryCanvas(stats, isWatermarked = true)'), 'buildSessionSummaryCanvas must be defined with watermark option');
  assert.ok(html.includes('function buildStatsFromRecord(r)'), 'buildStatsFromRecord must be defined');
  assert.ok(html.includes('function exportSessionSummaryImage()'), 'exportSessionSummaryImage must be defined');
  assert.ok(html.includes('function buildPDF(recs, isWatermarked = null)'), 'buildPDF must support watermarking parameter');

  // Verify Pro vs Free stop behavior
  assert.ok(html.includes('const canvas = buildProCertificateCanvas(stats, false);'), 'Pro mode must generate clean certificate canvas');
  assert.ok(html.includes('const canvas = buildSessionSummaryCanvas(stats, true);'), 'Free mode must generate watermarked summary canvas');

  // Verify 1620px height in free summary to avoid bottom cutoff
  assert.ok(html.includes('canvas.width=1080;canvas.height=1620;'), 'Free summary canvas height must be 1620px to prevent cutoff');

  // Verify 1200x1754 A4 ratio in pro certificate canvas
  assert.ok(html.includes('canvas.width = 1200') && html.includes('canvas.height = 1754'), 'Pro certificate canvas must have 1200x1754 resolution');

  // Verify PDF embedding canvas
  assert.ok(html.includes("doc.addImage(imgData, 'PNG', 0, 0, 210, 297, undefined, 'FAST');"), 'buildPDF must embed high-res certificate image onto A4 page');

  // Verify dynamic peak circle positioning in trend chart SVG
  assert.ok(html.includes("elPeakCircle.setAttribute('cx', String(peakX));"), 'renderCertificateData must position peak circle cx dynamically');
  assert.ok(html.includes("elPeakCircle.setAttribute('cy', String(peakY));"), 'renderCertificateData must position peak circle cy dynamically');

  // Verify dual download buttons in modal
  assert.ok(html.includes("id=\"rpmDownloadFreeBtn\""), 'PDF download button must exist in modal');
  assert.ok(html.includes("id=\"rpmDownloadImageBtn\""), 'Image download button must exist in modal');
});
