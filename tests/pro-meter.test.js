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
