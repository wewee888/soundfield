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
  // Bilinear warping grows toward Nyquist; 16 kHz stays inside a wide class-1 tolerance.
  const high = meter.iecWeightingMagnitudeDb('A', 48000, 16000);
  const highRef = meter.linearToDb(meter.aWeightLinear(16000));
  assert.ok(Math.abs(high - highRef) < 3.5, `16 kHz error ${high - highRef}`);
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

test('worklet reports accumulate every render quantum into one Leq block', () => {
  const engine = meter.iecCreateEngine(48000, 'Z');
  const a = meter.iecProcessBlock(engine, new Float32Array(128).fill(0.2));
  const b = meter.iecProcessBlock(engine, new Float32Array(128).fill(0.2));
  const acc = meter.iecAccumulateStats(meter.iecAccumulateStats(null, a), b);
  assert.equal(acc.blockSamples, 256);
  assert.ok(Math.abs(acc.blockSumSquares - (a.blockSumSquares + b.blockSumSquares)) < 1e-9);
  assert.equal(acc.clipCount, a.clipCount + b.clipCount);
});

test('microphone constraint attempts prefer exact processing-off then relax', () => {
  const attempts = meter.microphoneConstraintAttempts();
  assert.equal(attempts[0].audio.autoGainControl.exact, false);
  assert.equal(attempts[0].audio.voiceIsolation.exact, false);
  assert.equal(attempts[2].audio.echoCancellation.ideal, false);
  assert.equal(attempts[3].audio, true);
  const described = meter.describeMicProcessing({ autoGainControl: true, noiseSuppression: false, sampleRate: 48000 });
  assert.equal(described.autoGainControl, true);
  assert.equal(described.noiseSuppression, false);
  assert.equal(described.echoCancellation, false);
  assert.equal(described.sampleRate, 48000);
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
