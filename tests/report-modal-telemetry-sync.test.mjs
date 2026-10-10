import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';

const projectRoot = process.cwd();

test('Report modal telemetry synchronization and UX polish', async () => {
  const html = await fs.readFile(path.join(projectRoot, 'soundtest.html'), 'utf-8');
  const certJs = await fs.readFile(path.join(projectRoot, 'assets', 'report-cert-engine.js'), 'utf-8');
  const css = await fs.readFile(path.join(projectRoot, 'assets', 'soundtest.css'), 'utf-8');

  // 1. Session Telemetry Snapshot Capture
  assert.ok(html.includes('function captureCurrentSessionSnapshot()'), 'soundtest.html must define captureCurrentSessionSnapshot');
  assert.ok(html.includes('const snapshot = captureCurrentSessionSnapshot();'), 'stopAll must capture session snapshot immediately before zeroing state');
  assert.ok(html.includes('window.lastActiveSessionSnapshot = snapshot;'), 'stopAll must store lastActiveSessionSnapshot on window');
  assert.ok(html.includes('window.lastActiveSessionSnapshot = recItem;'), 'saveRec must store recItem in window.lastActiveSessionSnapshot');

  // 2. Open Latest Report & Prevention of 0.0 dB
  assert.ok(html.includes('Number(window.lastActiveSessionSnapshot.avgDb) > 0'), 'openLatestReportPreview must inspect lastActiveSessionSnapshot');
  assert.ok(certJs.includes('window.lastActiveSessionSnapshot?.avgDb'), 'renderCertificateData must fall back to window.lastActiveSessionSnapshot');
  assert.ok(certJs.includes('candidateAvg'), 'buildStatsFromRecord must compute candidateAvg with positive fallback');

  // 3. Legal Notice Data Synchronization
  assert.ok(html.includes('function openLegalNoticeFromUi(recOrId = null)'), 'openLegalNoticeFromUi must accept record object or ID');
  assert.ok(html.includes('r = window.currentReportRecord;'), 'openLegalNoticeFromUi must prioritize currentReportRecord');
  assert.ok(html.includes('r = DB.records[0];'), 'openLegalNoticeFromUi must read newest DB.records[0] instead of oldest record');
  assert.ok(html.includes('const target = rec || window.currentReportRecord || window.lastActiveSessionSnapshot;'), 'openLegalNoticeModal must forward active session target');

  // 4. Prominent Certificate Image Export Button
  assert.ok(html.includes('class="rpm-btn-primary-img" id="rpmDownloadImageBtn"'), 'rpmDownloadImageBtn must have prominent primary button class');
  assert.ok(css.includes('.rpm-btn-primary-img{'), 'soundtest.css must define .rpm-btn-primary-img with luminous styling');
  assert.ok(html.includes('id="rpmDownloadImageBtnText"'), 'soundtest.html must include inner span for localized button text');

  // 5. Responsive Head Layout
  assert.ok(html.includes('class="rpm-head-top"'), 'rpm-head must feature responsive rpm-head-top');
  assert.ok(html.includes('class="rpm-title-row"'), 'rpm-head must feature rpm-title-row to prevent narrow wrapping');
  assert.ok(css.includes('.rpm-title-row{'), 'soundtest.css must define .rpm-title-row layout');
});
