(function () {
  'use strict';

  const FAST_TIME_CONSTANT_SECONDS = 0.125;
  const SLOW_TIME_CONSTANT_SECONDS = 1.0;

  function aWeightLinear(frequencyHz) {
    if (!Number.isFinite(frequencyHz) || frequencyHz <= 0) return 0;
    const f2 = frequencyHz * frequencyHz;
    const numerator = 1.2588966 * 148840000 * Math.pow(frequencyHz, 4);
    const denominator =
      (f2 + 424.36) *
      (f2 + 148840000) *
      Math.sqrt((f2 + 11599.29) * (f2 + 544496.41));
    return numerator / denominator;
  }

  function cWeightLinear(frequencyHz) {
    if (!Number.isFinite(frequencyHz) || frequencyHz <= 0) return 0;
    const f2 = frequencyHz * frequencyHz;
    const f1 = 20.6;
    const f4 = 12194;
    const raw = (f4 * f4 * f2) / ((f2 + f1 * f1) * (f2 + f4 * f4));
    const refF2 = 1000 * 1000;
    const ref = (f4 * f4 * refF2) / ((refF2 + f1 * f1) * (refF2 + f4 * f4));
    return raw / ref;
  }

  function linearToDb(linearValue) {
    if (!Number.isFinite(linearValue) || linearValue <= 0) return -Infinity;
    return 20 * Math.log10(linearValue);
  }

  function timeWeightAlpha(deltaSeconds, mode) {
    const tau = mode === 'S' ? SLOW_TIME_CONSTANT_SECONDS : FAST_TIME_CONSTANT_SECONDS;
    return 1 - Math.exp(-Math.max(deltaSeconds, 1 / 240) / tau);
  }

  function percentileAscending(values, percentile) {
    if (!values.length) return 0;
    const sorted = [...values].sort((a, b) => a - b);
    const index = Math.min(
      sorted.length - 1,
      Math.max(0, Math.ceil((percentile / 100) * sorted.length) - 1)
    );
    return sorted[index];
  }

  // Ln is the level exceeded for n% of the measurement interval.
  function exceedanceLevel(values, exceedancePercent) {
    return percentileAscending(values, 100 - exceedancePercent);
  }

  function calculateLnLevels(values, exceedancePercents) {
    return exceedancePercents.reduce((levels, percent) => {
      levels[`L${percent}`] = exceedanceLevel(values, percent);
      return levels;
    }, {});
  }

  const THIRD_OCTAVE_CENTERS = [
    20, 25, 31.5, 40, 50, 63, 80, 100, 125, 160, 200, 250, 315, 400, 500,
    630, 800, 1000, 1250, 1600, 2000, 2500, 3150, 4000, 5000, 6300, 8000,
    10000, 12500, 16000, 20000,
  ];

  function thirdOctaveBands(frequencyDataDb, sampleRate, fftSize) {
    if (!frequencyDataDb || !Number.isFinite(sampleRate) || !Number.isFinite(fftSize)) return [];
    const ratio = Math.pow(2, 1 / 6);
    return THIRD_OCTAVE_CENTERS.map((centerHz) => {
      const low = centerHz / ratio;
      const high = centerHz * ratio;
      let energy = 0;
      let bins = 0;
      for (let i = 1; i < frequencyDataDb.length; i++) {
        const frequencyHz = (i * sampleRate) / fftSize;
        if (frequencyHz < low || frequencyHz >= high) continue;
        const db = frequencyDataDb[i];
        if (!Number.isFinite(db)) continue;
        energy += Math.pow(10, db / 10);
        bins++;
      }
      return {
        centerHz,
        lowHz: low,
        highHz: high,
        db: bins ? 10 * Math.log10(energy) : -Infinity,
        bins,
      };
    }).filter((band) => band.bins > 0);
  }

  function detectImpulseEvents(values, options = {}) {
    const thresholdDb = options.thresholdDb ?? 75;
    const jumpDb = options.jumpDb ?? 10;
    const events = [];
    for (let i = 1; i < values.length; i++) {
      const previous = values[i - 1];
      const current = values[i];
      if (!Number.isFinite(previous) || !Number.isFinite(current)) continue;
      if (current >= thresholdDb && current - previous >= jumpDb) {
        events.push({ index: i, peakDb: current, jumpDb: current - previous });
      }
    }
    return events;
  }

  window.SoundfieldPro = {
    FAST_TIME_CONSTANT_SECONDS,
    SLOW_TIME_CONSTANT_SECONDS,
    aWeightLinear,
    cWeightLinear,
    linearToDb,
    timeWeightAlpha,
    percentileAscending,
    exceedanceLevel,
    calculateLnLevels,
    thirdOctaveBands,
    detectImpulseEvents,
    THIRD_OCTAVE_CENTERS,
  };
})();
