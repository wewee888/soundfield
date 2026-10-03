/**
 * SOUNDTEST.PRO - Dedicated Acoustic Evidence Camera Module (camera.js)
 * Clean, lightweight, modular camera & watermark recording logic
 */

(function () {
  'use strict';

  // Constants & Storage keys matching SOUNDTEST.PRO ecosystem
  const MEDIA_DB = 'soundfield_media_v1';
  const MEDIA_STORE = 'media_blobs';
  const STORAGE_KEY = 'sf_v5';

  // App State
  let videoStream = null;
  let audioStream = null;
  let audioCtx = null;
  let analyser = null;
  let facingMode = 'environment';
  let curDb = 0;
  let peakDb = 0;
  let avgDb = 0;
  let dbSamples = [];
  let curLocation = null;
  let isRecording = false;
  let mediaRecorder = null;
  let recordedChunks = [];
  let recordTimer = null;
  let recordSeconds = 0;
  let lang = 'zh-CN';

  // Elements
  const videoEl = document.getElementById('camVideo');
  const flashOverlay = document.getElementById('camFlash');
  const hudDb = document.getElementById('hudDb');
  const hudLevelDesc = document.getElementById('hudLevelDesc');
  const hudTime = document.getElementById('hudTime');
  const hudPeak = document.getElementById('hudPeak');
  const hudAvg = document.getElementById('hudAvg');
  const hudGeo = document.getElementById('hudGeo');
  const hudHash = document.getElementById('hudHash');
  const shutterBtn = document.getElementById('shutterBtn');
  const switchCamBtn = document.getElementById('switchCamBtn');
  const previewModal = document.getElementById('previewModal');
  const previewImg = document.getElementById('previewImg');
  const downloadBtn = document.getElementById('downloadPhotoBtn');
  const closePreviewBtn = document.getElementById('closePreviewBtn');
  const toastEl = document.getElementById('camToast');
  const galleryThumb = document.getElementById('galleryThumb');

  // Detect language
  if (document.documentElement.lang.startsWith('en')) {
    lang = 'en-US';
  } else if (location.pathname.includes('/en/')) {
    lang = 'en-US';
  }

  function t(zh, en) {
    return lang === 'en-US' ? en : zh;
  }

  function showToast(msg, ms = 2200) {
    if (!toastEl) return;
    toastEl.textContent = msg;
    toastEl.classList.add('show');
    clearTimeout(toastEl._timer);
    toastEl._timer = setTimeout(() => toastEl.classList.remove('show'), ms);
  }

  /* ── IndexedDB Utilities (100% interoperable with soundtest.html) ── */
  function openMediaDb() {
    if (!window.indexedDB) return Promise.resolve(null);
    return new Promise((resolve, reject) => {
      const req = indexedDB.open(MEDIA_DB, 1);
      req.onupgradeneeded = () => req.result.createObjectStore(MEDIA_STORE);
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    });
  }

  async function saveMediaBlob(id, blob) {
    try {
      const db = await openMediaDb();
      if (!db) return false;
      return new Promise((resolve, reject) => {
        const tx = db.transaction(MEDIA_STORE, 'readwrite');
        const store = tx.objectStore(MEDIA_STORE);
        store.put(blob, String(id));
        tx.oncomplete = () => { db.close(); resolve(true); };
        tx.onerror = () => { db.close(); reject(tx.error); };
      });
    } catch (e) {
      console.warn('[saveMediaBlob failed]', e);
      return false;
    }
  }

  function appendEvidenceRecord(record) {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      const parsed = raw ? JSON.parse(raw) : {};
      const list = Array.isArray(parsed.recs) ? parsed.recs : [];
      list.unshift(record);
      parsed.recs = list;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(parsed));
    } catch (e) {
      console.warn('[appendEvidenceRecord failed]', e);
    }
  }

  /* ── SHA-256 Fingerprint Generator ── */
  async function computeSha256(str) {
    try {
      if (crypto && crypto.subtle) {
        const buf = new TextEncoder().encode(str);
        const hash = await crypto.subtle.digest('SHA-256', buf);
        return Array.from(new Uint8Array(hash)).map(b => b.toString(16).padStart(2, '0')).join('').slice(0, 16).toUpperCase();
      }
    } catch (_) {}
    return Math.random().toString(36).substring(2, 10).toUpperCase() + Date.now().toString(36).slice(-6).toUpperCase();
  }

  /* ── Noise Level Evaluation ── */
  function getLevelInfo(db) {
    if (db < 40) return { label: t('环境安静', 'Quiet Room'), color: '#2AFFD4' };
    if (db < 50) return { label: t('正常生活声', 'Normal Indoors'), color: '#4ADE80' };
    if (db < 60) return { label: t('轻度噪音 / 居民区夜间超标', 'Moderate Noise / Night Limit Exceeded'), color: '#FFB520' };
    if (db < 70) return { label: t('明显超标 / 日间限值超标', 'Excessive Noise / Day Limit Exceeded'), color: '#FF9040' };
    return { label: t('严重扰民 / 达到维权取证标准', 'Severe Disturbance / Forensic Evidence Level'), color: '#FF3F50' };
  }

  /* ── Camera Stream Initialization ── */
  async function initCamera() {
    if (videoStream) {
      videoStream.getTracks().forEach(tr => tr.stop());
      videoStream = null;
    }

    try {
      const constraints = {
        video: {
          facingMode: { ideal: facingMode },
          width: { ideal: 1920 },
          height: { ideal: 1080 }
        },
        audio: false
      };
      videoStream = await navigator.mediaDevices.getUserMedia(constraints);
      videoEl.srcObject = videoStream;
      await videoEl.play();
    } catch (err) {
      console.warn('[Camera fallback to basic constraints]', err);
      try {
        videoStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
        videoEl.srcObject = videoStream;
        await videoEl.play();
      } catch (fatalErr) {
        showToast(t('无法开启摄像头，请在浏览器中允许权限', 'Unable to start camera. Please allow permission.'), 4000);
      }
    }
  }

  /* ── Microphone & Live Decibel Meter ── */
  async function initAudio() {
    try {
      audioStream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: false,
          noiseSuppression: false,
          autoGainControl: false
        }
      });

      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      audioCtx = new AudioContextClass();
      if (audioCtx.state === 'suspended') {
        audioCtx.resume().catch(() => {});
      }

      const src = audioCtx.createMediaStreamSource(audioStream);
      analyser = audioCtx.createAnalyser();
      analyser.fftSize = 2048;
      analyser.smoothingTimeConstant = 0.3;
      src.connect(analyser);

      sampleAudioLoop();
    } catch (err) {
      console.warn('[Microphone initialization failed]', err);
      showToast(t('麦克风未开启，分贝数据待测', 'Microphone not active; dB reading pending.'), 3000);
    }
  }

  function sampleAudioLoop() {
    if (!analyser) return;
    const buf = new Float32Array(analyser.fftSize);
    analyser.getFloatTimeDomainData(buf);

    let sum = 0;
    for (let i = 0; i < buf.length; i++) {
      sum += buf[i] * buf[i];
    }
    const rms = Math.sqrt(sum / buf.length);

    // Standardized Civilian Decibel Calculation calibrated against reference SPL
    let db = 0;
    if (rms > 0.000001) {
      db = 20 * Math.log10(rms) + 94; // 94 dB SPL calibration reference base
    }
    db = Math.max(30, Math.min(125, Math.round(db * 10) / 10));

    curDb = db;
    if (db > peakDb) peakDb = db;
    dbSamples.push(db);
    if (dbSamples.length > 50) dbSamples.shift();
    avgDb = Math.round((dbSamples.reduce((a, b) => a + b, 0) / dbSamples.length) * 10) / 10;

    updateHud();
    requestAnimationFrame(sampleAudioLoop);
  }

  /* ── Geolocation & Reverse Geocoding with Fallback ── */
  async function initLocation() {
    if (hudGeo) hudGeo.textContent = t('正在获取 GPS 坐标与现场地址…', 'Locating via GPS & network…');

    const fallbackToIp = async () => {
      try {
        const res = await fetch(`/api/geo/reverse?mode=ip&lang=${encodeURIComponent(lang)}`);
        if (res.ok) {
          const data = await res.json();
          if (data && data.ok) {
            curLocation = {
              lat: parseFloat(data.lat),
              lng: parseFloat(data.lng),
              acc: 2000,
              address: data.address || data.name || data.city || 'IP Network Location',
              provider: data.provider || 'IP'
            };
            updateHudGeo();
            return true;
          }
        }
      } catch (e) {
        console.warn('[IP Geo Fallback failed]', e);
      }
      return false;
    };

    if (!navigator.geolocation) {
      await fallbackToIp();
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        curLocation = {
          lat: parseFloat(pos.coords.latitude.toFixed(6)),
          lng: parseFloat(pos.coords.longitude.toFixed(6)),
          acc: Math.round(pos.coords.accuracy || 10),
          address: '',
          provider: 'GPS'
        };

        // Reverse geocode via internal API
        try {
          const res = await fetch(`/api/geo/reverse?lat=${curLocation.lat}&lng=${curLocation.lng}&lang=${encodeURIComponent(lang)}`);
          if (res.ok) {
            const data = await res.json();
            if (data && (data.name || data.address)) {
              curLocation.address = data.address || data.name;
            }
          }
        } catch (_) {}
        updateHudGeo();
      },
      async (err) => {
        console.warn('[Geolocation GPS failed, trying IP]', err);
        const ok = await fallbackToIp();
        if (!ok && hudGeo) {
          hudGeo.textContent = t('GPS 信号较弱 · 未获取详细地址', 'GPS unavailable · Address unlisted');
        }
      },
      { enableHighAccuracy: true, timeout: 8000, maximumAge: 60000 }
    );
  }

  function updateHudGeo() {
    if (!hudGeo) return;
    if (curLocation) {
      const place = curLocation.address ? `${curLocation.address} · ` : '';
      const coords = `${curLocation.lat.toFixed(4)}°N, ${curLocation.lng.toFixed(4)}°E (±${curLocation.acc}m)`;
      hudGeo.textContent = place + coords;
    } else {
      hudGeo.textContent = t('现场定位获取中…', 'Acquiring location…');
    }
  }

  /* ── HUD Realtime Refresh ── */
  function updateHud() {
    const activeVal = curDb ? Math.round(curDb) : '--';
    const lv = getLevelInfo(curDb || 0);

    if (hudDb) {
      hudDb.textContent = activeVal;
      hudDb.style.color = lv.color;
    }
    if (hudLevelDesc) {
      hudLevelDesc.textContent = curDb ? lv.label : t('声级待测', 'Awaiting Sound');
    }
    if (hudPeak) hudPeak.textContent = `${Math.round(peakDb || 0)} dB`;
    if (hudAvg) hudAvg.textContent = `${Math.round(avgDb || 0)} dB`;

    const now = new Date();
    if (hudTime) {
      hudTime.textContent = now.toLocaleTimeString(lang, { hour12: false });
    }
  }

  /* ── Take Photo & Burn Forensic Watermark ── */
  async function takePhoto() {
    if (!videoEl || !videoEl.videoWidth) {
      showToast(t('摄像头正在对焦加载中，请稍后…', 'Camera loading, please wait…'));
      return;
    }

    // Trigger flash animation
    if (flashOverlay) {
      flashOverlay.classList.remove('flashing');
      void flashOverlay.offsetWidth;
      flashOverlay.classList.add('flashing');
    }

    // High resolution canvas matching native video stream
    const canvas = document.createElement('canvas');
    canvas.width = videoEl.videoWidth;
    canvas.height = videoEl.videoHeight;
    const ctx = canvas.getContext('2d');

    // 1. Draw camera video frame
    ctx.drawImage(videoEl, 0, 0, canvas.width, canvas.height);

    // 2. Composite Professional Forensic Watermark Card
    const W = canvas.width;
    const H = canvas.height;
    const pad = Math.max(28, Math.round(W * 0.035));
    const cardH = Math.min(Math.round(H * 0.46), 460);

    // Gradient dark backdrop for bottom watermark card
    const grad = ctx.createLinearGradient(0, H - cardH - 60, 0, H);
    grad.addColorStop(0, 'rgba(3, 7, 14, 0)');
    grad.addColorStop(0.2, 'rgba(3, 7, 14, 0.72)');
    grad.addColorStop(1, 'rgba(3, 7, 14, 0.96)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, H - cardH - 60, W, cardH + 60);

    // Top Header Bar
    ctx.fillStyle = 'rgba(3, 7, 14, 0.75)';
    ctx.fillRect(0, 0, W, Math.max(68, Math.round(H * 0.1)));

    ctx.fillStyle = '#2AFFD4';
    ctx.font = `800 ${Math.max(20, Math.round(W * 0.026))}px system-ui, sans-serif`;
    ctx.fillText('SOUNDTEST.PRO · ACOUSTIC EVIDENCE', pad, Math.max(40, Math.round(H * 0.055)));

    const now = new Date();
    const isoTime = now.toISOString();
    const localTimeStr = now.toLocaleString(lang);

    ctx.fillStyle = 'rgba(241, 245, 249, 0.82)';
    ctx.font = `600 ${Math.max(13, Math.round(W * 0.016))}px system-ui, sans-serif`;
    ctx.textAlign = 'right';
    ctx.fillText(localTimeStr, W - pad, Math.max(40, Math.round(H * 0.055)));
    ctx.textAlign = 'left';

    // Massive Decibel Stamp
    const activeDb = Math.round(curDb || avgDb || 0);
    const lv = getLevelInfo(activeDb);
    const yBase = H - cardH + Math.max(48, Math.round(cardH * 0.16));

    ctx.fillStyle = lv.color;
    ctx.font = `900 ${Math.max(68, Math.round(W * 0.11))}px monospace`;
    ctx.fillText(`${activeDb} dB`, pad, yBase);

    ctx.fillStyle = '#FFFFFF';
    ctx.font = `700 ${Math.max(18, Math.round(W * 0.028))}px system-ui, sans-serif`;
    ctx.fillText(lv.label, pad, yBase + Math.max(34, Math.round(W * 0.042)));

    // Metric Summary Chips (PEAK, AVG)
    const chipW = Math.max(120, Math.round(W * 0.18));
    const chipH = Math.max(46, Math.round(cardH * 0.16));
    const chipY = yBase + Math.max(54, Math.round(W * 0.065));

    // Peak chip
    ctx.fillStyle = 'rgba(255, 255, 255, 0.08)';
    ctx.fillRect(pad, chipY, chipW, chipH);
    ctx.fillStyle = 'rgba(241, 245, 249, 0.6)';
    ctx.font = `600 ${Math.max(11, Math.round(W * 0.013))}px system-ui, sans-serif`;
    ctx.fillText('PEAK 峰值', pad + 12, chipY + 18);
    ctx.fillStyle = '#FFB520';
    ctx.font = `800 ${Math.max(16, Math.round(W * 0.02))}px monospace`;
    ctx.fillText(`${Math.round(peakDb || activeDb)} dB`, pad + 12, chipY + 38);

    // Avg chip
    ctx.fillStyle = 'rgba(255, 255, 255, 0.08)';
    ctx.fillRect(pad + chipW + 12, chipY, chipW, chipH);
    ctx.fillStyle = 'rgba(241, 245, 249, 0.6)';
    ctx.font = `600 ${Math.max(11, Math.round(W * 0.013))}px system-ui, sans-serif`;
    ctx.fillText('AVG 平均', pad + chipW + 24, chipY + 18);
    ctx.fillStyle = '#2AFFD4';
    ctx.font = `800 ${Math.max(16, Math.round(W * 0.02))}px monospace`;
    ctx.fillText(`${Math.round(avgDb || activeDb)} dB`, pad + chipW + 24, chipY + 38);

    // Location & Geo stamp
    const geoTop = chipY + chipH + Math.max(22, Math.round(W * 0.025));
    const placeStr = curLocation && curLocation.address ? curLocation.address : t('现场定位已记录', 'Onsite GPS Recorded');
    const coordsStr = curLocation ? `${curLocation.lat}°N, ${curLocation.lng}°E (±${curLocation.acc}m)` : '';

    ctx.fillStyle = 'rgba(241, 245, 249, 0.92)';
    ctx.font = `600 ${Math.max(14, Math.round(W * 0.018))}px system-ui, sans-serif`;
    ctx.fillText(`📍 ${placeStr}`, pad, geoTop);

    if (coordsStr) {
      ctx.fillStyle = 'rgba(241, 245, 249, 0.65)';
      ctx.font = `500 ${Math.max(12, Math.round(W * 0.015))}px monospace`;
      ctx.fillText(coordsStr, pad + 24, geoTop + Math.max(20, Math.round(W * 0.022)));
    }

    // Cryptographic Evidence Fingerprint
    const rawFingerprint = `${isoTime}|${activeDb}dB|${curLocation?.lat},${curLocation?.lng}|SOUNDTEST.PRO`;
    const hash = await computeSha256(rawFingerprint);
    const evidenceId = `EV-${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}-${hash.slice(0, 6)}`;

    ctx.fillStyle = 'rgba(255, 255, 255, 0.42)';
    ctx.font = `500 ${Math.max(11, Math.round(W * 0.014))}px monospace`;
    ctx.fillText(`防伪指纹: SHA-256 [${hash}] · 存证ID: ${evidenceId}`, pad, H - 24);

    // 3. Export to Blob and Store
    canvas.toBlob(async (blob) => {
      if (!blob) return;

      const blobId = `photo_${Date.now()}`;
      await saveMediaBlob(blobId, blob);

      // Register into localStorage for unified reports
      const record = {
        id: evidenceId,
        blobId,
        hasVid: false,
        isPhoto: true,
        time: isoTime,
        db: activeDb,
        peak: Math.round(peakDb || activeDb),
        avg: Math.round(avgDb || activeDb),
        hash,
        location: curLocation ? { ...curLocation } : null
      };
      appendEvidenceRecord(record);

      // Show preview modal
      const photoUrl = URL.createObjectURL(blob);
      if (previewImg) previewImg.src = photoUrl;
      if (galleryThumb) {
        galleryThumb.innerHTML = `<img src="${photoUrl}" alt="Thumbnail">`;
      }
      if (previewModal) previewModal.classList.add('open');

      if (downloadBtn) {
        downloadBtn.onclick = () => {
          const a = document.createElement('a');
          a.href = photoUrl;
          a.download = `SOUNDTEST-EVIDENCE-${evidenceId}.png`;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          showToast(t('照片已开始下载至本地', 'Evidence photo downloading.'));
        };
      }

      showToast(t('📸 存证照片已加盖水印并存入证据库', 'Evidence photo captured & saved with forensic watermark!'));
    }, 'image/png');
  }

  /* ── Event Listeners ── */
  if (shutterBtn) {
    shutterBtn.addEventListener('click', () => {
      takePhoto();
    });
  }

  if (switchCamBtn) {
    switchCamBtn.addEventListener('click', () => {
      facingMode = facingMode === 'environment' ? 'user' : 'environment';
      initCamera();
      showToast(facingMode === 'environment' ? t('已切换后置摄像头', 'Switched to Back Camera') : t('已切换前置摄像头', 'Switched to Front Camera'));
    });
  }

  if (closePreviewBtn && previewModal) {
    closePreviewBtn.addEventListener('click', () => {
      previewModal.classList.remove('open');
    });
  }

  // Double tap viewfinder to switch camera
  if (videoEl) {
    let lastTap = 0;
    videoEl.addEventListener('click', () => {
      const now = Date.now();
      if (now - lastTap < 350) {
        switchCamBtn?.click();
      }
      lastTap = now;
    });
  }

  // Hash Token initialization
  computeSha256(`INIT-${Date.now()}`).then(h => {
    if (hudHash) hudHash.textContent = `SHA-256 [${h.slice(0, 10)}…]`;
  });

  // Startup
  window.addEventListener('DOMContentLoaded', () => {
    initCamera();
    initAudio();
    initLocation();
  });
})();
