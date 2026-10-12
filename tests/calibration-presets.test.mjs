import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';

const projectRoot = process.cwd();

test('Calibration presets, iOS baseline calibration, and laptop built-in mic optimization', async () => {
  const soundtestHtml = await fs.readFile(path.join(projectRoot, 'soundtest.html'), 'utf-8');
  const adminHtml = await fs.readFile(path.join(projectRoot, 'admin.html'), 'utf-8');
  const reportCertJs = await fs.readFile(path.join(projectRoot, 'assets', 'report-cert-engine.js'), 'utf-8');

  // 1. Verify CALIBRATION_PRESETS contains iOS calibrated offset 7.0 dB and laptop compensation 38 dB
  assert.ok(soundtestHtml.includes("'ios-browser'"), 'ios-browser preset must exist');
  assert.ok(soundtestHtml.includes('offset:7.0') || soundtestHtml.includes('offset:7'), 'ios-browser offset must be calibrated to 7.0 dB');
  assert.ok(soundtestHtml.includes("'laptop-internal-mic'"), 'laptop-internal-mic preset must exist');
  assert.ok(soundtestHtml.includes('offset:38'), 'laptop-internal-mic offset must provide +38 dB compensation');

  // 2. Verify CALIBRATION_BASELINE is bumped to v5 to ensure auto-refresh on existing devices
  assert.ok(soundtestHtml.includes("const CALIBRATION_BASELINE='device-preset-v5'"), 'CALIBRATION_BASELINE must be device-preset-v5');
  assert.ok(soundtestHtml.includes("preset: (typeof calibrationPresetKey !== 'undefined' ? calibrationPresetKey : 'device-preset-v5')"), 'Snapshot preset fallback must be device-preset-v5');

  // 3. Verify Slider ranges are expanded to accommodate offsets up to +45 dB
  const calRMatches = soundtestHtml.match(/id="calR"[^>]*max="45"/g) || soundtestHtml.match(/max="45"[^>]*id="calR"/g);
  assert.ok(calRMatches && calRMatches.length >= 2, 'All calR sliders in drawer and settings view must allow max="45"');
  assert.ok(adminHtml.includes('id="cfgCalOffset"') && adminHtml.includes('max="45"'), 'admin.html cfgCalOffset slider must allow max="45"');

  // 4. Verify Mic Gain slider is expanded to max="36"
  const micRMatches = soundtestHtml.match(/id="micR"[^>]*max="36"/g) || soundtestHtml.match(/max="36"[^>]*id="micR"/g);
  assert.ok(micRMatches && micRMatches.length >= 2, 'All micR sliders in drawer and settings view must allow max="36"');

  // 5. Verify Windows touch screen laptops are recognized as desktop
  assert.ok(soundtestHtml.includes('const isWindows=/Windows/.test(ua);'), 'detectPlatformProfile must check isWindows');
  assert.ok(soundtestHtml.includes('(navigator.maxTouchPoints===0||isWindows)'), 'isDesktop must include touchscreen Windows laptops');

  // 6. Verify Low input diagnostic assistant
  assert.ok(soundtestHtml.includes('id="lowInputPrompt"'), 'soundtest.html must include lowInputPrompt diagnostic pill');
  assert.ok(soundtestHtml.includes('function updateLowInputDiagnostic(inst)'), 'soundtest.html must define updateLowInputDiagnostic');
  assert.ok(soundtestHtml.includes('function applyLaptopMicCompensation()'), 'soundtest.html must define applyLaptopMicCompensation');
  assert.ok(soundtestHtml.includes('updateLowInputDiagnostic(inst);'), 'tick loop must call updateLowInputDiagnostic');

  // 7. Verify report-cert-engine.js no longer falls back to legacy -12.0
  assert.ok(!reportCertJs.includes(': -12.0'), 'report-cert-engine.js must not contain legacy -12.0 fallback');
});
