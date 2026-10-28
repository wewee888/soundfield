import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';

const projectRoot = process.cwd();

test('Calibration presets, iOS baseline calibration, and laptop built-in mic optimization', async () => {
  const soundtestHtml = await fs.readFile(path.join(projectRoot, 'soundtest.html'), 'utf-8');
  const adminHtml = await fs.readFile(path.join(projectRoot, 'admin.html'), 'utf-8');
  const reportCertJs = await fs.readFile(path.join(projectRoot, 'assets', 'report-cert-engine.js'), 'utf-8');

  // 1. Verify CALIBRATION_PRESETS contains iOS calibrated offset 7.0 dB, Android +1.0 dB, Tablet +2.0 dB, PC -22.5 dB, laptop compensation 38 dB
  assert.ok(soundtestHtml.includes("'ios-browser'"), 'ios-browser preset must exist');
  assert.ok(soundtestHtml.includes('offset:12.0'), 'ios-browser offset must be the quiet-room field baseline +12.0 dB');
  assert.ok(soundtestHtml.includes('offset:-11.0'), 'android-browser offset must be the quiet-room field baseline -11.0 dB');
  assert.ok(soundtestHtml.includes('offset:2.0') || soundtestHtml.includes('offset:2'), 'tablet-browser offset must be calibrated to 2.0 dB');
  assert.ok(soundtestHtml.includes('offset:-21.0'), 'desktop-browser offset must be the quiet-room field baseline -21.0 dB');
  assert.ok(soundtestHtml.includes("'laptop-internal-mic'"), 'laptop-internal-mic preset must exist');
  assert.ok(soundtestHtml.includes('offset:38'), 'laptop-internal-mic offset must provide +38 dB compensation');

  // 2. Verify CALIBRATION_BASELINE is bumped to v9 to ensure auto-refresh on existing devices
  assert.ok(soundtestHtml.includes("const CALIBRATION_BASELINE='device-preset-v12'"), 'CALIBRATION_BASELINE must be device-preset-v12');
  assert.ok(soundtestHtml.includes("preset: (typeof calibrationPresetKey !== 'undefined' ? calibrationPresetKey : 'device-preset-v12')"), 'Snapshot preset fallback must be device-preset-v12');

  // 3. Verify Slider ranges are expanded to accommodate offsets down to -35 dB and up to +45 dB, and Admin device matrix exists
  const calRMatches = soundtestHtml.match(/id="calR"[^>]*min="-35"/g) || soundtestHtml.match(/min="-35"[^>]*id="calR"/g);
  assert.ok(calRMatches && calRMatches.length >= 2, 'All calR sliders in drawer and settings view must allow min="-35"');
  assert.ok(adminHtml.includes('id="cfgCalOffset"') && adminHtml.includes('min="-35"'), 'admin.html cfgCalOffset slider must allow min="-35"');
  assert.ok(adminHtml.includes('id="cfgIosCalOffset"'), 'admin.html must include cfgIosCalOffset for iOS baseline adjustment');
  assert.ok(adminHtml.includes('id="cfgAndroidCalOffset"') && adminHtml.includes('value="-11.0"'), 'admin.html must include cfgAndroidCalOffset for Android baseline adjustment');
  assert.ok(adminHtml.includes('id="cfgTabletCalOffset"') && adminHtml.includes('value="2.0"'), 'admin.html must include cfgTabletCalOffset for Tablet baseline adjustment');
  assert.ok(adminHtml.includes('id="cfgDesktopCalOffset"') && adminHtml.includes('value="-21.0"'), 'admin.html must include cfgDesktopCalOffset defaulting to -21.0 dB');

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
  assert.ok(soundtestHtml.includes('<option value="ios-browser">iPhone / iPad (+12.0 dB)</option>'), 'Dropdown option must show +12.0 dB');
  assert.ok(soundtestHtml.includes('<option value="desktop-browser">PC Desktop Browser (-21.0 dB)</option>'), 'Dropdown option must show -21.0 dB');
  assert.ok(soundtestHtml.includes('<option value="android-browser">Android Browser (-11.0 dB)</option>'), 'Dropdown option must show -11.0 dB');
  assert.ok(soundtestHtml.includes('<option value="tablet-browser">Tablet Browser (+2.0 dB)</option>'), 'Dropdown option must show +2.0 dB');

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

  // iOS: quiet room (30.0 dB) anchors cleanly at 30.0 dB
  const quietVal = evalFunc(30.0, true);
  assert.strictEqual(quietVal, 30.0, 'Quiet room must be anchored ~30 dB');

  // iOS: sub-quiet (< 27 dB) passes through smoothly without artificial cutoff
  assert.strictEqual(evalFunc(20.0, true), 20.0, 'Sub-quiet level must pass through naturally');

  // iOS: whisper (40.0 dB) and speech range (58.0 dB raw) maintain 1:1 linear physical acoustic fidelity
  assert.strictEqual(evalFunc(40.0, true), 40.0, 'Whisper level must remain 1:1 linear');
  assert.strictEqual(evalFunc(58.0, true), 58.0, 'Casual speech level must remain 1:1 linear ~58 dB (no runaway expansion to 80 dB)');

  // iOS: loud peak (72.0 dB raw) tracks 1:1 linear
  assert.strictEqual(evalFunc(72.0, true), 72.0, 'Loud peak must remain 1:1 linear ~72 dB');

  // iOS: high-SPL (>88 dB) triggers soft-knee saturation
  const loudVal = evalFunc(95.0, true);
  assert.ok(loudVal > 88.0 && loudVal < 95.0, `High-SPL must engage soft-knee saturation, got ${loudVal}`);

  // 10. Verify Hardware Overload / Clipping detection & indicator
  assert.ok(soundtestHtml.includes('id="overloadBadge"'), 'soundtest.html must include overloadBadge indicator');
  assert.ok(soundtestHtml.includes('function showOverloadHelpToast'), 'soundtest.html must define showOverloadHelpToast');
  assert.ok(soundtestHtml.includes('overloadActiveUntil = performance.now() + 1800;'), 'instantDb must trigger overload hold upon clipping');

  // 11. Verify Background Audio Keep-Alive and Screen-Lock Sentry continuous engine
  assert.ok(soundtestHtml.includes('function startBackgroundAudioKeepAlive'), 'soundtest.html must define startBackgroundAudioKeepAlive');
  assert.ok(soundtestHtml.includes('function stopBackgroundAudioKeepAlive'), 'soundtest.html must define stopBackgroundAudioKeepAlive');
  assert.ok(soundtestHtml.includes('function tickBackground'), 'soundtest.html must define tickBackground');
  assert.ok(soundtestHtml.includes("document.addEventListener('visibilitychange'"), 'soundtest.html must listen for visibilitychange for background execution');
  assert.ok(soundtestHtml.includes('startBackgroundAudioKeepAlive();'), 'toggleMon must start background audio keep-alive');

  // 12. Verify 10-Second Two-Step Precision Calibration Wizard
  assert.ok(soundtestHtml.includes('id="calWizardModal"'), 'soundtest.html must include calWizardModal');
  assert.ok(soundtestHtml.includes('function openCalWizardModal'), 'soundtest.html must define openCalWizardModal');
  assert.ok(soundtestHtml.includes('function startQuietSampleCountdown'), 'soundtest.html must define startQuietSampleCountdown');
  assert.ok(soundtestHtml.includes('function completeCalWizard'), 'soundtest.html must define completeCalWizard');

  // 13. Verify Audio Pipeline NaN & Non-Finite Immunity and Self-Healing
  assert.ok(soundtestHtml.includes('const lvInfo=db=>(!Number.isFinite(db)||db<50)'), 'lvInfo must guard against NaN and non-finite values');
  assert.ok(soundtestHtml.includes('const dbCol=db=>(!Number.isFinite(db)||db<50)'), 'dbCol must guard against NaN and non-finite values');
  assert.ok(soundtestHtml.includes('const lvBadge=db=>(!Number.isFinite(db)||db<50)'), 'lvBadge must guard against NaN and non-finite values');
  assert.ok(soundtestHtml.includes('const fmtDb=v=>(!Number.isFinite(v)||v<=0)'), 'fmtDb must guard against NaN and non-finite values');
  assert.ok(soundtestHtml.includes('validInst=(Number.isFinite(inst)&&inst>0)?inst:0;'), 'applyMeterBallistics must validate inst');
  assert.ok(soundtestHtml.includes('if(!Number.isFinite(prev)||prev<=0)'), 'applyMeterBallistics must self-heal when prev is NaN or non-positive');
  assert.ok(soundtestHtml.includes('validDb=(Number.isFinite(db)&&db>0)?db:0;'), 'updateGauge must sanitize db against NaN');
  assert.ok(soundtestHtml.includes('document.hidden) || (typeof sentryModeActive !== \'undefined\' && sentryModeActive)'), 'startBackgroundAudioKeepAlive must avoid audio routing glitch in foreground');
});
