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

  function applyAcousticResponseProfile(rawCalDb, isIos = false) {
    if (!isIos || !Number.isFinite(rawCalDb)) return rawCalDb;
    // iOS Safari / WebKit 1:1 Linear Acoustic Fidelity Profile with High-SPL Soft-Knee Saturation.
    // Standard Class-1 sound level meters require a strictly linear 1:1 response (K = 1.0)
    // across human hearing range (30 ~ 85 dB). Prevents runaway dynamic ballooning where casual speech
    // artificially spiked to 80+ dB. Soft-knee compression smoothly engages above 88 dB to handle
    // mobile microphone hardware saturation and prevent digital clipping overflow.
    const T = 30.0;
    const K = 1.0;
    const W = 3.0;
    if (rawCalDb <= T - W) {
      return rawCalDb;
    }
    if (rawCalDb >= T + W) {
      const expanded = T + K * (rawCalDb - T);
      if (expanded > 88.0) {
        const over = expanded - 88.0;
        return 88.0 + over / (1 + over * 0.02);
      }
      return expanded;
    }
    const a = (K - 1) / (4 * W);
    const dx = rawCalDb - (T - W);
    return (T - W) + dx + a * dx * dx;
  }

  function applyMeterBallistics(inst, prev, dt, timeWeight = 'F') {
    const validInst = (Number.isFinite(inst) && inst > 0) ? inst : 0;
    if (!Number.isFinite(prev) || prev <= 0) {
      return validInst;
    }
    if (!Number.isFinite(inst) || inst <= 0) {
      const safeDt = Math.max(0.001, Math.min(0.05, dt || 1 / 60));
      const tau = timeWeight === 'S' ? SLOW_TIME_CONSTANT_SECONDS : FAST_TIME_CONSTANT_SECONDS;
      const decayAlpha = 1 - Math.exp(-safeDt / tau);
      const decayed = prev * (1 - Math.max(0.02, decayAlpha * 0.8));
      return Math.max(0, decayed);
    }
    const tau = timeWeight === 'S' ? SLOW_TIME_CONSTANT_SECONDS : FAST_TIME_CONSTANT_SECONDS;
    const safeDt = Math.max(0.001, Math.min(0.05, dt || 1 / 60));
    let alpha = 1 - Math.exp(-safeDt / tau);
    if (!Number.isFinite(alpha)) alpha = 0.1;
    if (inst > prev) alpha = Math.min(0.35, alpha * 1.3);
    else alpha = Math.max(0.02, alpha * 0.8);
    const out = prev * (1 - alpha) + inst * alpha;
    return Number.isFinite(out) ? Math.max(0, out) : validInst;
  }

  // IEC 61672-1 frequency weighting as cascaded bilinear sections, gain-normalized at 1 kHz.
  function iecEmptyBiquad(b0, b1, b2, a1, a2) {
    return { b0, b1, b2, a1, a2, x1: 0, x2: 0, y1: 0, y2: 0 };
  }

  function iecBiquadHighpass(f0, Q, sampleRate) {
    const w0 = (2 * Math.PI * f0) / sampleRate;
    const cosw = Math.cos(w0);
    const alpha = Math.sin(w0) / (2 * Q);
    const a0 = 1 + alpha;
    return iecEmptyBiquad(
      ((1 + cosw) / 2) / a0,
      -(1 + cosw) / a0,
      ((1 + cosw) / 2) / a0,
      (-2 * cosw) / a0,
      (1 - alpha) / a0
    );
  }

  function iecBiquadLowpass(f0, Q, sampleRate) {
    const w0 = (2 * Math.PI * f0) / sampleRate;
    const cosw = Math.cos(w0);
    const alpha = Math.sin(w0) / (2 * Q);
    const a0 = 1 + alpha;
    return iecEmptyBiquad(
      ((1 - cosw) / 2) / a0,
      (1 - cosw) / a0,
      ((1 - cosw) / 2) / a0,
      (-2 * cosw) / a0,
      (1 - alpha) / a0
    );
  }

  function iecHighpass1(f0, sampleRate) {
    const g = Math.tan((Math.PI * f0) / sampleRate);
    const b0 = 1 / (1 + g);
    return iecEmptyBiquad(b0, -b0, 0, (g - 1) / (1 + g), 0);
  }

  function iecPlaceable(freq, sampleRate) {
    return freq > 0 && freq < sampleRate * 0.47;
  }

  function iecBiquadMagnitude(q, omega) {
    const c1 = Math.cos(omega);
    const s1 = Math.sin(omega);
    const c2 = Math.cos(2 * omega);
    const s2 = Math.sin(2 * omega);
    const br = q.b0 + q.b1 * c1 + q.b2 * c2;
    const bi = -(q.b1 * s1 + q.b2 * s2);
    const ar = 1 + q.a1 * c1 + q.a2 * c2;
    const ai = -(q.a1 * s1 + q.a2 * s2);
    const den = Math.hypot(ar, ai);
    if (!(den > 0)) return 0;
    return Math.hypot(br, bi) / den;
  }

  function iecDesignWeighting(kind, sampleRate) {
    const fs = Number.isFinite(sampleRate) && sampleRate >= 8000 ? sampleRate : 48000;
    const mode = kind === 'C' ? 'C' : kind === 'Z' ? 'Z' : 'A';
    const f1 = 20.598997;
    const f2 = 107.65265;
    const f3 = 737.86223;
    const f4 = 12194.217;
    const sections = [];
    if (mode !== 'Z') {
      if (iecPlaceable(f1, fs)) sections.push(iecBiquadHighpass(f1, 0.5, fs));
      if (mode === 'A') {
        if (iecPlaceable(f2, fs)) sections.push(iecHighpass1(f2, fs));
        if (iecPlaceable(f3, fs)) sections.push(iecHighpass1(f3, fs));
      }
      if (iecPlaceable(f4, fs)) sections.push(iecBiquadLowpass(f4, 0.5, fs));
    }
    let gain = 1;
    if (sections.length) {
      const refHz = Math.min(1000, fs * 0.2);
      const omega = (2 * Math.PI * refHz) / fs;
      let mag = 1;
      for (let i = 0; i < sections.length; i++) mag *= iecBiquadMagnitude(sections[i], omega);
      if (mag > 1e-12 && Number.isFinite(mag)) gain = 1 / mag;
    }
    return { kind: mode, sampleRate: fs, sections, gain };
  }

  function iecWeightingMagnitudeDb(kind, sampleRate, frequencyHz) {
    if (!(frequencyHz > 0) || !(sampleRate > 0)) return -Infinity;
    const design = iecDesignWeighting(kind, sampleRate);
    if (!design.sections.length) return 0;
    const omega = (2 * Math.PI * frequencyHz) / sampleRate;
    let mag = Math.abs(design.gain);
    for (let i = 0; i < design.sections.length; i++) mag *= iecBiquadMagnitude(design.sections[i], omega);
    if (!(mag > 0) || !Number.isFinite(mag)) return -Infinity;
    return 20 * Math.log10(mag);
  }

  function iecBiquadStep(q, x) {
    const y = q.b0 * x + q.b1 * q.x1 + q.b2 * q.x2 - q.a1 * q.y1 - q.a2 * q.y2;
    q.x2 = q.x1;
    q.x1 = x;
    q.y2 = q.y1;
    q.y1 = Math.abs(y) < 1e-20 ? 0 : y;
    return q.y1;
  }

  function iecCreateEngine(sampleRate, kind) {
    const design = iecDesignWeighting(kind, sampleRate);
    const fs = design.sampleRate;
    return {
      sampleRate: fs,
      weighting: design.kind,
      sections: design.sections,
      gain: design.gain,
      fastA: Math.exp(-1 / (fs * 0.125)),
      slowA: Math.exp(-1 / (fs * 1)),
      fast: 0,
      slow: 0,
    };
  }

  function iecProcessBlock(engine, input) {
    const sections = engine.sections;
    const gain = engine.gain;
    const fastA = engine.fastA;
    const slowA = engine.slowA;
    const n = input.length;
    let blockSum = 0;
    let blockRaw = 0;
    let blockPeak = 0;
    let clips = 0;
    let fast = engine.fast;
    let slow = engine.slow;
    for (let i = 0; i < n; i++) {
      const x = input[i];
      let y = x;
      for (let s = 0; s < sections.length; s++) y = iecBiquadStep(sections[s], y);
      y *= gain;
      const p2 = y * y;
      fast = fastA * fast + (1 - fastA) * p2;
      slow = slowA * slow + (1 - slowA) * p2;
      blockSum += p2;
      const ax = x < 0 ? -x : x;
      blockRaw += x * x;
      if (ax > blockPeak) blockPeak = ax;
      if (ax >= 0.99) clips++;
    }
    engine.fast = fast;
    engine.slow = slow;
    return {
      fastMs: fast,
      slowMs: slow,
      blockSumSquares: blockSum,
      blockRawSumSquares: blockRaw,
      blockSamples: n,
      blockPeak,
      clipCount: clips,
    };
  }

  function iecAccumulateStats(acc, stats) {
    if (!acc) {
      return {
        fastMs: stats.fastMs,
        slowMs: stats.slowMs,
        blockSumSquares: stats.blockSumSquares,
        blockRawSumSquares: stats.blockRawSumSquares,
        blockSamples: stats.blockSamples,
        blockPeak: stats.blockPeak,
        clipCount: stats.clipCount,
      };
    }
    acc.fastMs = stats.fastMs;
    acc.slowMs = stats.slowMs;
    acc.blockSumSquares += stats.blockSumSquares;
    acc.blockRawSumSquares += stats.blockRawSumSquares;
    acc.blockSamples += stats.blockSamples;
    acc.clipCount += stats.clipCount;
    if (stats.blockPeak > acc.blockPeak) acc.blockPeak = stats.blockPeak;
    return acc;
  }

  function dbFromMeanSquare(meanSquare, splRefDb, calOffsetDb) {
    if (!Number.isFinite(meanSquare) || meanSquare <= 1e-20) return 0;
    const db = 10 * Math.log10(meanSquare) + (Number(splRefDb) || 0) + (Number(calOffsetDb) || 0);
    return Number.isFinite(db) ? db : 0;
  }

  function createLevelHistogram(minDb = 0, maxDb = 140, step = 0.1) {
    const bins = Math.max(1, Math.round((maxDb - minDb) / step));
    const counts = new Float64Array(bins);
    let total = 0;
    let sum = 0;
    return {
      add(db) {
        if (!Number.isFinite(db)) return;
        const idx = Math.max(0, Math.min(bins - 1, Math.round((db - minDb) / step)));
        counts[idx] += 1;
        total += 1;
        sum += db;
      },
      count() {
        return total;
      },
      mean() {
        return total ? sum / total : 0;
      },
      exceedance(percent) {
        if (!total) return 0;
        const ascending = 100 - percent;
        const index = Math.min(total - 1, Math.max(0, Math.ceil((ascending / 100) * total) - 1));
        let acc = 0;
        for (let i = 0; i < bins; i++) {
          acc += counts[i];
          if (acc > index) return minDb + i * step;
        }
        return minDb;
      },
      ln(percents) {
        return percents.reduce((levels, percent) => {
          levels[`L${percent}`] = this.exceedance(percent);
          return levels;
        }, {});
      },
      reset() {
        counts.fill(0);
        total = 0;
        sum = 0;
      },
    };
  }

  function microphoneConstraintAttempts() {
    const exactOff = {
      echoCancellation: { exact: false },
      noiseSuppression: { exact: false },
      autoGainControl: { exact: false },
    };
    return [
      { audio: { ...exactOff, voiceIsolation: { exact: false } } },
      { audio: exactOff },
      {
        audio: {
          echoCancellation: { ideal: false },
          noiseSuppression: { ideal: false },
          autoGainControl: { ideal: false },
        },
      },
      { audio: true },
    ];
  }

  function describeMicProcessing(settings) {
    const s = settings || {};
    return {
      autoGainControl: s.autoGainControl === true,
      noiseSuppression: s.noiseSuppression === true,
      echoCancellation: s.echoCancellation === true,
      voiceIsolation: s.voiceIsolation === true,
      sampleRate: Number.isFinite(s.sampleRate) ? s.sampleRate : null,
      channelCount: Number.isFinite(s.channelCount) ? s.channelCount : null,
    };
  }

  function buildIecWorkletSource() {
    return `'use strict';
${iecEmptyBiquad.toString()}
${iecBiquadHighpass.toString()}
${iecBiquadLowpass.toString()}
${iecHighpass1.toString()}
${iecPlaceable.toString()}
${iecBiquadMagnitude.toString()}
${iecDesignWeighting.toString()}
${iecBiquadStep.toString()}
${iecCreateEngine.toString()}
${iecProcessBlock.toString()}
${iecAccumulateStats.toString()}
class IecMeterProcessor extends AudioWorkletProcessor {
  constructor() {
    super();
    this.epoch = 0;
    this.weighting = 'A';
    this.engine = iecCreateEngine(sampleRate, 'A');
    this.pending = 0;
    this.reportEvery = Math.max(128, Math.round(sampleRate / 20));
    this.mix = new Float32Array(128);
    this.acc = null;
    this.port.onmessage = (event) => {
      const data = event.data || {};
      if (data.type === 'configure') {
        this.epoch = Number(data.epoch) || 0;
        this.weighting = data.weighting === 'C' || data.weighting === 'Z' ? data.weighting : 'A';
        this.engine = iecCreateEngine(sampleRate, this.weighting);
        this.acc = null;
        this.pending = 0;
      }
    };
  }
  process(inputs, outputs) {
    const outCh = outputs[0] && outputs[0][0];
    if (outCh) outCh.fill(0);
    const channels = inputs[0];
    if (!channels || !channels.length || !channels[0] || !channels[0].length) return true;
    const n = channels[0].length;
    if (this.mix.length !== n) this.mix = new Float32Array(n);
    this.mix.set(channels[0]);
    if (channels.length > 1 && channels[1] && channels[1].length === n) {
      const other = channels[1];
      for (let i = 0; i < n; i++) this.mix[i] = (this.mix[i] + other[i]) * 0.5;
    }
    const stats = iecProcessBlock(this.engine, this.mix);
    this.acc = iecAccumulateStats(this.acc, stats);
    this.pending += n;
    if (this.pending >= this.reportEvery) {
      this.pending = 0;
      const out = this.acc;
      this.acc = null;
      out.epoch = this.epoch;
      this.port.postMessage(out);
    }
    return true;
  }
}
registerProcessor('iec-meter-v1', IecMeterProcessor);
`;
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
    applyAcousticResponseProfile,
    applyMeterBallistics,
    THIRD_OCTAVE_CENTERS,
    iecDesignWeighting,
    iecWeightingMagnitudeDb,
    iecCreateEngine,
    iecProcessBlock,
    iecAccumulateStats,
    dbFromMeanSquare,
    createLevelHistogram,
    microphoneConstraintAttempts,
    describeMicProcessing,
    buildIecWorkletSource,
  };
})();
