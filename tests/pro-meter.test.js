const assert = require('node:assert/strict');
const test = require('node:test');
const path = require('node:path');

global.window = {};
require(path.join(__dirname, '..', 'assets', 'pro-meter.js'));

const meter = global.window.SoundfieldPro;

test('C-weighting is near flat at 1 kHz and attenuates very low frequencies', () => {
  assert.ok(Math.abs(meter.linearToDb(meter.cWeightLinear(1000))) < 0.5);
  assert.ok(meter.linearToDb(meter.cWeightLinear(31.5)) < -2);
});

test('calculates standard exceedance levels from dB samples', () => {
  const levels = meter.calculateLnLevels([40, 50, 60, 70, 80, 90], [5, 10, 50, 90, 95]);

  assert.equal(levels.L5, 90);
  assert.equal(levels.L10, 90);
  assert.equal(levels.L50, 60);
  assert.equal(levels.L90, 40);
  assert.equal(levels.L95, 40);
});

test('groups FFT bins into one-third octave bands', () => {
  const sampleRate = 48000;
  const fftSize = 2048;
  const frequencyData = new Float32Array(fftSize / 2).fill(-120);
  const targetIndex = Math.round(1000 / sampleRate * fftSize);
  frequencyData[targetIndex] = -20;

  const bands = meter.thirdOctaveBands(frequencyData, sampleRate, fftSize);
  const oneKhzBand = bands.find((band) => band.centerHz === 1000);

  assert.ok(oneKhzBand, '1 kHz band exists');
  assert.ok(oneKhzBand.db > -25, `expected 1 kHz band to include signal, got ${oneKhzBand.db}`);
});

test('detects impulse noise events from sudden dB jumps', () => {
  const events = meter.detectImpulseEvents([45, 46, 47, 74, 50, 49, 82], {
    thresholdDb: 70,
    jumpDb: 12,
  });

  assert.equal(events.length, 2);
  assert.equal(events[0].peakDb, 74);
  assert.equal(events[1].index, 6);
});

test('time-domain A/C weighting matches the IEC magnitude curve', () => {
  const bands = [
    [20, 0.15], [31.5, 0.15], [63, 0.15], [125, 0.15], [250, 0.15], [500, 0.15],
    [1000, 0.05], [2000, 0.2], [4000, 0.45], [8000, 0.85], [12500, 0.85],
  ];
  for (const fs of [48000, 44100]) {
    for (const [f, tol] of bands) {
      const aRef = meter.linearToDb(meter.aWeightLinear(f));
      const aGot = meter.iecWeightingMagnitudeDb('A', fs, f);
      assert.ok(Math.abs(aGot - aRef) < tol, `A ${f} Hz @ ${fs}: got ${aGot.toFixed(2)} ref ${aRef.toFixed(2)}`);
      const cRef = meter.linearToDb(meter.cWeightLinear(f));
      const cGot = meter.iecWeightingMagnitudeDb('C', fs, f);
      assert.ok(Math.abs(cGot - cRef) < tol, `C ${f} Hz @ ${fs}: got ${cGot.toFixed(2)} ref ${cRef.toFixed(2)}`);
    }
  }
  assert.equal(meter.iecWeightingMagnitudeDb('Z', 48000, 100), 0);
  for (const fs of [48000, 44100]) {
    for (const kind of ['A', 'C']) {
      const high = meter.iecWeightingMagnitudeDb(kind, fs, 16000);
      const ref = kind === 'A'
        ? meter.linearToDb(meter.aWeightLinear(16000))
        : meter.linearToDb(meter.cWeightLinear(16000));
      assert.ok(Math.abs(high - ref) < 0.45, `${kind} 16 kHz @ ${fs}: ${high - ref}`);
      const mid = meter.iecWeightingMagnitudeDb(kind, fs, 1000);
      assert.ok(Math.abs(mid) < 0.05, `${kind} 1 kHz @ ${fs}: ${mid}`);
    }
  }
});

test('1 kHz sine keeps calibration reference and A-weighting near 0 dB', () => {
  const fs = 48000;
  const engine = meter.iecCreateEngine(fs, 'A');
  const amp = 0.5;
  const block = 1024;
  let sum = 0;
  let n = 0;
  let fastDb = 0;
  for (let t = 0; t < fs; t += block) {
    const input = new Float32Array(block);
    for (let i = 0; i < block; i++) {
      const k = t + i;
      input[i] = amp * Math.sin((2 * Math.PI * 1000 * k) / fs);
    }
    const stats = meter.iecProcessBlock(engine, input);
    sum += stats.blockSumSquares;
    n += stats.blockSamples;
    fastDb = meter.dbFromMeanSquare(stats.fastMs, 0, 0);
  }
  const leq = meter.dbFromMeanSquare(sum / n, 0, 0);
  const expected = 20 * Math.log10(amp / Math.SQRT2);
  assert.ok(Math.abs(leq - expected) < 0.2, `Leq ${leq} expected ${expected}`);
  assert.ok(Math.abs(fastDb - expected) < 0.2, `Fast ${fastDb} expected ${expected}`);
  const withCal = meter.dbFromMeanSquare(sum / n, 105, 7);
  assert.ok(Math.abs(withCal - (expected + 105 + 7)) < 0.2);
});

test('Fast and Slow time weighting use symmetric 125 ms and 1 s exponentials', () => {
  const fs = 48000;
  const engine = meter.iecCreateEngine(fs, 'Z');
  const amp = 0.1;
  const steady = amp * amp;
  const block = 480;
  const input = new Float32Array(block).fill(amp);
  for (let i = 0; i < Math.round(fs * 0.125); i += block) meter.iecProcessBlock(engine, input);
  const atTau = 10 * Math.log10(engine.fast / steady);
  const expected = 10 * Math.log10(1 - Math.exp(-1));
  assert.ok(Math.abs(atTau - expected) < 0.15, `Fast step ${atTau} expected ${expected}`);

  const settled = meter.iecCreateEngine(fs, 'Z');
  for (let i = 0; i < fs * 2; i += block) meter.iecProcessBlock(settled, input);
  const before = settled.fast;
  const zeros = new Float32Array(block);
  const decaySamples = Math.round(fs * 0.125);
  for (let done = 0; done < decaySamples;) {
    const n = Math.min(block, decaySamples - done);
    meter.iecProcessBlock(settled, n === block ? zeros : zeros.subarray(0, n));
    done += n;
  }
  const decay = 10 * Math.log10(settled.fast / before);
  assert.ok(Math.abs(decay - (10 * Math.log10(Math.exp(-1)))) < 0.15, `Fast decay ${decay}`);
  assert.ok(settled.slow > settled.fast, 'Slow decays slower than Fast');
});

test('A-weighting changes a 100 Hz tone relative to 1 kHz', () => {
  function toneLevel(freq) {
    const fs = 48000;
    const engine = meter.iecCreateEngine(fs, 'A');
    const block = 1024;
    let sum = 0;
    let n = 0;
    for (let t = 0; t < fs; t += block) {
      const input = new Float32Array(block);
      for (let i = 0; i < block; i++) input[i] = 0.4 * Math.sin((2 * Math.PI * freq * (t + i)) / fs);
      const stats = meter.iecProcessBlock(engine, input);
      if (t > fs * 0.25) {
        sum += stats.blockSumSquares;
        n += stats.blockSamples;
      }
    }
    return meter.dbFromMeanSquare(sum / n, 0, 0);
  }
  const delta = toneLevel(100) - toneLevel(1000);
  const ref = meter.linearToDb(meter.aWeightLinear(100)) - meter.linearToDb(meter.aWeightLinear(1000));
  assert.ok(Math.abs(delta - ref) < 0.4, `100 Hz delta ${delta} ref ${ref}`);
});

test('full-session histogram matches exceedance levels', () => {
  const hist = meter.createLevelHistogram(0, 140, 0.1);
  const values = [40, 50, 60, 70, 80, 90];
  values.forEach((v) => hist.add(v));
  const fromHist = hist.ln([5, 10, 50, 90, 95]);
  const fromArray = meter.calculateLnLevels(values, [5, 10, 50, 90, 95]);
  for (const key of ['L5', 'L10', 'L50', 'L90', 'L95']) {
    assert.ok(Math.abs(fromHist[key] - fromArray[key]) <= 0.1, `${key}: hist ${fromHist[key]} array ${fromArray[key]}`);
  }
  assert.equal(hist.count(), 6);
  hist.reset();
  assert.equal(hist.count(), 0);
});

test('clipping is counted from full-scale samples and quiet blocks are not clips', () => {
  const engine = meter.iecCreateEngine(48000, 'Z');
  const hot = new Float32Array(128).fill(0.2);
  hot[3] = 1;
  hot[4] = -0.995;
  const hotStats = meter.iecProcessBlock(engine, hot);
  assert.equal(hotStats.clipCount, 2);
  assert.ok(hotStats.blockPeak >= 0.99);
  const quiet = meter.iecProcessBlock(engine, new Float32Array(128).fill(0.001));
  assert.equal(quiet.clipCount, 0);
});

test('LCpeak and LZpeak track the inter-sample crest of a 1 kHz sine', () => {
  const fs = 48000;
  const amp = 0.5;
  const engine = meter.iecCreateEngine(fs, 'A');
  const block = 480;
  let cPeak = 0;
  let zPeak = 0;
  for (let t = 0; t < fs; t += block) {
    const input = new Float32Array(block);
    for (let i = 0; i < block; i++) input[i] = amp * Math.sin((2 * Math.PI * 1000 * (t + i)) / fs);
    const stats = meter.iecProcessBlock(engine, input);
    if (t < fs * 0.2) continue;
    if (stats.blockCPeak > cPeak) cPeak = stats.blockCPeak;
    if (stats.blockZPeak > zPeak) zPeak = stats.blockZPeak;
  }
  const lc = meter.dbFromPeakAmplitude(cPeak, 0, 0);
  const lz = meter.dbFromPeakAmplitude(zPeak, 0, 0);
  const expected = 20 * Math.log10(amp);
  assert.ok(Math.abs(lc - expected) < 0.25, `LCpeak ${lc} expected ${expected}`);
  assert.ok(Math.abs(lz - expected) < 0.25, `LZpeak ${lz} expected ${expected}`);
  assert.ok(lc > meter.dbFromMeanSquare(amp * amp / 2, 0, 0), 'peak is above RMS');
});

test('a correct quiet-room phone reading is not labeled as the device floor', () => {
  const latch = meter.createPhoneFloorLatch();
  assert.equal(latch.update(28.8, true), false, 'validated Android quiet room stays a room reading');
  assert.equal(latch.update(28.3, true), false, 'validated iPhone quiet room stays a room reading');
  assert.equal(latch.update(21, true), true);
  assert.equal(latch.update(24, true), true, 'stays limited until the exit threshold');
  assert.equal(latch.update(26, true), false);
  assert.equal(latch.update(18, false), false, 'desktop presets are not phone floors');
  assert.equal(meter.PHONE_ABSOLUTE_FLOOR_ENTER_DB, 22);
  assert.equal(meter.PHONE_ABSOLUTE_FLOOR_EXIT_DB, 26);
});

test('mic gain shifts the reading and does not amplify samples', () => {
  assert.equal(meter.digitalMicGainLinear(2), 1);
  assert.equal(meter.digitalMicGainLinear(-6), 1);
  assert.equal(meter.applyMicGainDb(60, 2), 62);
  assert.equal(meter.applyMicGainDb(60, -3), 57);
  assert.equal(meter.applyMicGainDb(60, 0), 60);
});

test('worklet reports accumulate every render quantum into one Leq block', () => {
  const engine = meter.iecCreateEngine(48000, 'Z');
  const a = meter.iecProcessBlock(engine, new Float32Array(128).fill(0.2));
  const b = meter.iecProcessBlock(engine, new Float32Array(128).fill(0.2));
  const acc = meter.iecAccumulateStats(meter.iecAccumulateStats(null, a), b);
  assert.equal(acc.blockSamples, 256);
  assert.ok(Math.abs(acc.blockSumSquares - (a.blockSumSquares + b.blockSumSquares)) < 1e-9);
  assert.equal(acc.clipCount, a.clipCount + b.clipCount);
});

test('microphone opens with processing off, including legacy Chrome flags', () => {
  const attempts = meter.microphoneConstraintAttempts();
  assert.equal(attempts[0].audio.autoGainControl, false);
  assert.equal(attempts[0].audio.googAutoGainControl, false);
  assert.equal(attempts[0].audio.echoCancellation, false);
  const exact = attempts.find((attempt) => attempt.audio && attempt.audio.voiceIsolation && attempt.audio.voiceIsolation.exact === false);
  assert.ok(exact);
  const ideal = attempts.find((attempt) => attempt.audio && attempt.audio.echoCancellation && attempt.audio.echoCancellation.ideal === false);
  assert.ok(ideal);
  assert.equal(attempts[attempts.length - 1].audio, true);
  assert.equal(meter.countEnabledMicProcessing({ autoGainControl: true, echoCancellation: true, noiseSuppression: false }), 2);
  assert.equal(meter.countEnabledMicProcessing({ autoGainControl: false, echoCancellation: false }), 0);
  assert.equal(meter.rawMicApplyConstraints()[0].googNoiseSuppression, false);
});

test('the first second of a session is excluded from Leq', () => {
  const warm = meter.sessionWarmupSamples(48000);
  assert.equal(warm, 48000);
  assert.equal(meter.shouldCountInSession(warm - 1, warm), false);
  assert.equal(meter.shouldCountInSession(warm, warm), true);
  assert.equal(meter.SESSION_WARMUP_SECONDS, 1);
});

test('peaks wait longer than Leq so a start transient is not LCpeak or Lmax', () => {
  const warm = meter.sessionWarmupSamples(48000);
  const peakWarm = meter.sessionPeakWarmupSamples(48000);
  assert.equal(meter.SESSION_PEAK_WARMUP_SECONDS, 2);
  assert.equal(peakWarm, 96000);
  assert.ok(peakWarm > warm);
  assert.equal(meter.shouldCountInSession(warm, peakWarm), false);
  assert.equal(meter.shouldCountInSession(peakWarm - 1, peakWarm), false);
  assert.equal(meter.shouldCountInSession(peakWarm, peakWarm), true);
});

test('preset migration keeps a hand-entered calibration offset', () => {
  const current = {
    'desktop-browser': { offset: -21 },
    'android-browser': { offset: -11 },
    'ios-browser': { offset: 12 },
    'tablet-browser': { offset: 2 },
    'laptop-internal-mic': { offset: 38 },
  };
  const desktopStock = meter.migrateSavedCalibration(
    { calibrationBaseline: 'device-preset-v10', calibrationPresetKey: 'desktop-browser', calOffset: -16.5 },
    current,
    'device-preset-v11',
  );
  assert.equal(desktopStock.calOffset, -21);
  assert.equal(desktopStock.keepManual, false);
  const desktopManual = meter.migrateSavedCalibration(
    { calibrationBaseline: 'device-preset-v10', calibrationPresetKey: 'desktop-browser', calOffset: -10 },
    current,
    'device-preset-v11',
  );
  assert.equal(desktopManual.calOffset, -10);
  assert.equal(desktopManual.keepManual, true);
  const phoneUntouched = meter.migrateSavedCalibration(
    { calibrationBaseline: 'device-preset-v10', calibrationPresetKey: 'android-browser', calOffset: -11 },
    current,
    'device-preset-v11',
  );
  assert.equal(phoneUntouched.calOffset, -11);
  const iosOldStock = meter.migrateSavedCalibration(
    { calibrationBaseline: 'device-preset-v9', calibrationPresetKey: 'ios-browser', calOffset: 7 },
    current,
    'device-preset-v11',
  );
  assert.equal(iosOldStock.calOffset, 12);
  const iosManual = meter.migrateSavedCalibration(
    { calibrationBaseline: 'device-preset-v9', calibrationPresetKey: 'ios-browser', calOffset: 9.5 },
    current,
    'device-preset-v11',
  );
  assert.equal(iosManual.calOffset, 9.5);
  assert.equal(iosManual.keepManual, true);
  const alreadyCurrent = meter.migrateSavedCalibration(
    { calibrationBaseline: 'device-preset-v11', calibrationPresetKey: 'desktop-browser', calOffset: -8 },
    current,
    'device-preset-v11',
  );
  assert.equal(alreadyCurrent.calOffset, -8);
  assert.equal(alreadyCurrent.migrated, false);
  for (const oldIos of [-6, 2, 6, 7, 15, 22.7]) {
    const moved = meter.migrateSavedCalibration(
      { calibrationBaseline: 'device-preset-v9', calibrationPresetKey: 'ios-browser', calOffset: oldIos },
      current,
      'device-preset-v12',
    );
    assert.equal(moved.calOffset, 12, `iOS factory offset ${oldIos} must become +12`);
    assert.equal(moved.keepManual, false);
  }
  const frozenOldStock = meter.migrateSavedCalibration(
    { calibrationBaseline: 'device-preset-v11', calibrationPresetKey: 'ios-browser', calOffset: 6 },
    current,
    'device-preset-v12',
  );
  assert.equal(frozenOldStock.calOffset, 12, 'a v11 profile that froze an old iOS factory offset must still move');
  const chosenAfterUpgrade = meter.migrateSavedCalibration(
    { calibrationBaseline: 'device-preset-v12', calibrationPresetKey: 'ios-browser', calOffset: 6 },
    current,
    'device-preset-v12',
  );
  assert.equal(chosenAfterUpgrade.calOffset, 6, 'a value chosen after the v12 save stays put');
  assert.equal(chosenAfterUpgrade.migrated, false);
  const wrongDevice = meter.migrateSavedCalibration(
    { calibrationBaseline: 'device-preset-v9', calibrationPresetKey: 'tablet-browser', calOffset: 2 },
    current,
    'device-preset-v12',
    'ios-browser',
  );
  assert.equal(wrongDevice.presetKey, 'ios-browser');
  assert.equal(wrongDevice.calOffset, 12);
  const manualOnWrongDevice = meter.migrateSavedCalibration(
    { calibrationBaseline: 'device-preset-v9', calibrationPresetKey: 'tablet-browser', calOffset: 9.5 },
    current,
    'device-preset-v12',
    'ios-browser',
  );
  assert.equal(manualOnWrongDevice.presetKey, 'tablet-browser');
  assert.equal(manualOnWrongDevice.calOffset, 9.5);
  assert.equal(manualOnWrongDevice.keepManual, true);
  const oldAndroid = meter.migrateSavedCalibration(
    { calibrationBaseline: 'device-preset-v5', calibrationPresetKey: 'android-browser', calOffset: 2 },
    current,
    'device-preset-v12',
    'android-browser',
  );
  assert.equal(oldAndroid.presetKey, 'android-browser');
  assert.equal(oldAndroid.calOffset, -11);
});

test('opening stats ignore the unmute and drop it if it was already counted', () => {
  const guard = meter.createOpeningStatsGuard(1000);
  const push = (samples, db) => {
    const step = 100;
    const decisions = [];
    for (let left = samples; left > 0; left -= step) decisions.push(guard.observe(Math.min(step, left), db));
    return decisions;
  };
  const quietStart = push(1900, 28);
  assert.ok(quietStart.every((d) => d === 'ignore'));
  assert.equal(guard.isOpen(), false);
  const quietOpen = push(800, 28);
  assert.ok(quietOpen.includes('keep'));
  assert.equal(guard.isOpen(), true);
  assert.ok(!quietOpen.includes('rebase'));

  const pop = meter.createOpeningStatsGuard(1000);
  const duringPop = [];
  for (let t = 0; t < 3000; t += 100) duringPop.push(pop.observe(100, 51));
  assert.ok(duringPop.includes('keep'), 'a steady unmute can enter stats once the minimum wait passes');
  const afterDrop = [];
  for (let t = 0; t < 1200; t += 100) afterDrop.push(pop.observe(100, 19.6));
  assert.ok(afterDrop.includes('rebase'), 'the collapse back to the room restarts LAeq and Lmax');
  const later = pop.observe(100, 60);
  assert.equal(later, 'keep');
  assert.ok(!afterDrop.slice(afterDrop.indexOf('rebase') + 1).includes('rebase'));
});

test('IEC worklet source parses and names the processor', () => {
  const source = meter.buildIecWorkletSource();
  assert.match(source, /registerProcessor\('iec-meter-v1'/);
  assert.match(source, /iecProcessBlock/);
  new Function(source.replace("registerProcessor('iec-meter-v1', IecMeterProcessor);", 'void IecMeterProcessor;'));
});

test('applyMeterBallistics recovers gracefully from NaN or zero prev values', () => {
  // When prev is NaN, ballistics must immediately self-heal to inst
  assert.equal(meter.applyMeterBallistics(65, NaN, 1 / 60, 'F'), 65);
  assert.equal(meter.applyMeterBallistics(42, 0, 1 / 60, 'F'), 42);
  assert.equal(meter.applyMeterBallistics(50, undefined, 1 / 60, 'F'), 50);

  // When inst is NaN, ballistics must decay prev smoothly, never returning NaN
  const decayed = meter.applyMeterBallistics(NaN, 50, 1 / 60, 'F');
  assert.ok(Number.isFinite(decayed), 'Decayed value must be finite');
  assert.ok(decayed > 45 && decayed <= 50, `Expected smooth decay around 49.x, got ${decayed}`);

  // Normal ballistic smoothing
  const rise = meter.applyMeterBallistics(80, 50, 1 / 60, 'F');
  assert.ok(rise > 50 && rise < 80, `Rising response must be smoothed, got ${rise}`);
});
