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

  // 8. Verify iOS dynamic range compensation & smooth noise floor anchor algorithm
  assert.ok(soundtestHtml.includes('function applyAcousticResponseProfile'), 'soundtest.html must define applyAcousticResponseProfile');
  assert.ok(soundtestHtml.includes('function isIosCalibrationActive'), 'soundtest.html must define isIosCalibrationActive');
  assert.ok(soundtestHtml.includes('db=applyAcousticResponseProfile(db, isIosCalibrationActive());'), 'instantDb must apply acoustic response profile');
  assert.ok(soundtestHtml.includes('<option value="ios-browser">iPhone / iPad (+7.0 dB)</option>'), 'Dropdown option must show +7.0 dB');

  // 9. Verify mathematical accuracy of dynamic acoustic profile
  const proMeterJs = await fs.readFile(path.join(projectRoot, 'assets', 'pro-meter.js'), 'utf-8');
  assert.ok(proMeterJs.includes('applyAcousticResponseProfile'), 'pro-meter.js must export applyAcousticResponseProfile');

  // Evaluate the mathematical formula directly to assert exact acoustic curve behavior
  const match = soundtestHtml.match(/function applyAcousticResponseProfile\([^)]*\)\s*\{([\s\S]*?)\n\}/);
  assert.ok(match, 'applyAcousticResponseProfile implementation must be extracted');
  const evalFunc = new Function('rawCalDb', 'isIos', match[1]);

  // Non-iOS: must remain completely unaltered linear pass-through
  assert.strictEqual(evalFunc(48.6, false), 48.6, 'Non-iOS must remain strictly unaltered');
  assert.strictEqual(evalFunc(20.0, false), 20.0, 'Non-iOS quiet must remain unaltered');

  // iOS: quiet room (~29.9 dB) anchors smoothly to ~30.3 dB
  const quietVal = evalFunc(29.9, true);
  assert.ok(quietVal >= 29.8 && quietVal <= 30.6, `Quiet room must be anchored ~30 dB, got ${quietVal}`);

  // iOS: sub-quiet (< 27 dB) passes through smoothly without artificial cutoff
  assert.strictEqual(evalFunc(20.0, true), 20.0, 'Sub-quiet level must pass through naturally');

  // iOS: speech range (48.6 dB raw) expands to match ~60 dB sound level meter
  const speechVal = evalFunc(48.6, true);
  assert.ok(speechVal >= 59.5 && speechVal <= 60.5, `Speech level must expand to ~60 dB, got ${speechVal}`);

  // iOS: loud peak (56.0 dB raw) expands to match 72 dB peak
  const loudVal = evalFunc(56.0, true);
  assert.ok(loudVal >= 71.5 && loudVal <= 72.5, `Loud peak must expand to ~72 dB, got ${loudVal}`);
});
