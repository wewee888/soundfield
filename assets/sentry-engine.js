/**
 * SOUNDTEST.PRO · Sentry Surveillance Workstation Engine
 * Autonomous overnight noise monitoring, burst exceedance detection, hold delay, and incident ledger
 */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.SoundTestSentry = factory();
  }
}(typeof self !== 'undefined' ? self : this, function () {
/* ── Sentry Surveillance Workstation Helper Suite ── */
function translateSentryWorkstation() {
  const isZh = appLanguage === 'zh-CN';
  setText('sentryPipelineTitle', isZh ? '⚡ 哨兵无人值守全自动存证闭环' : '⚡ Autonomous Forensic Surveillance Pipeline');
  setText('pipeStep1T', isZh ? '静默守护' : 'Silent Standby');
  setText('pipeStep1D', isZh ? '超低功耗待命' : 'Low-power guard');
  setText('pipeStep2T', isZh ? '突发超标' : 'Spike Exceedance');
  setText('pipeStep2D', isZh ? `持续${autoRecMinSeconds}秒自动录` : `Auto-record on ${autoRecMinSeconds}s`);
  setText('pipeStep3T', isZh ? '回落延时' : 'Post-Drop Delay');
  setText('pipeStep3D', isZh ? `静音${autoRecAfterStopSeconds}秒截取` : `Hold ${autoRecAfterStopSeconds}s after drop`);
  setText('pipeStep4T', isZh ? '数字封存' : 'Cryptographic Seal');
  setText('pipeStep4D', isZh ? 'SHA-256指纹入库' : 'SHA-256 sealed');

  setText('sentryLiveDbLbl', isZh ? '实时环境分贝' : 'Live dB Reading');
  setText('sentryTriggerDbLbl', isZh ? '触发报警阈值' : 'Trigger Threshold');
  setText('sentryTonightCountLbl', isZh ? '今夜抓获违规' : "Tonight's Incidents");

  setText('sentryThSectionTitle', isZh ? '🎯 抓拍阈值设定 (超过此分贝启动录音)' : '🎯 Trigger Threshold (Auto-records above this dB)');
  setText('sentryPre45Span', isZh ? '夜间卧室 (国标限值)' : 'Night Bedroom (GB Limit)');
  setText('sentryPre50Span', isZh ? '住宅常态 (推荐默认)' : 'Residential (Default)');
  setText('sentryPre55Span', isZh ? '临街/白日' : 'Roadside / Daytime');
  setText('sentryCustomLabel', isZh ? '自定义数值：' : 'Custom value:');

  setText('sentryMinSecLbl', isZh ? `超标持续判定：${autoRecMinSeconds} 秒` : `Sustained Duration: ${autoRecMinSeconds}s`);
  setText('sentryMinSecDesc', isZh ? '噪音连续超过阈值达到此时长才录制（防止咳嗽、翻身、关门误触发）' : 'Only triggers after sound stays above threshold for this duration (filters coughs & bed turns)');
  setText('sentryStopSecLbl', isZh ? `恢复静音延时：${autoRecAfterStopSeconds} 秒` : `Silence Hold Delay: ${autoRecAfterStopSeconds}s`);
  setText('sentryStopSecDesc', isZh ? '噪音停止后继续录制此时长才封存（录完整段噪音，保全尾音）' : 'Continues recording for this duration after sound drops to capture full noise event');

  setText('sentryLedgerTitle', isZh ? '📁 今夜自动抓获的超标证据' : "📁 Tonight's Auto-Captured Proof");
  setText('sentryViewAllBtn', isZh ? '查看全部证据库 ↗' : 'View All Records ↗');
}

function setSentryPresetThreshold(db) {
  const val = Math.max(30, Math.min(120, Number(db) || 50));
  alertTh = val;
  const thR = document.getElementById('thR');
  if (thR) thR.value = alertTh;
  const thV = document.getElementById('thV');
  if (thV) thV.textContent = alertTh + ' dB';
  const customInput = document.getElementById('sentryCustomThInput');
  if (customInput) customInput.value = alertTh;
  updateSentryPresetButtons();
  saveState();
  toast(appLanguage === 'zh-CN' ? `🎯 哨兵触发阈值已设为 ${alertTh} dB` : `🎯 Sentry threshold set to ${alertTh} dB`, 'info', 2000);
}

function updateSentryPresetButtons() {
  const p45 = document.getElementById('sentryPre45');
  const p50 = document.getElementById('sentryPre50');
  const p55 = document.getElementById('sentryPre55');
  const customInput = document.getElementById('sentryCustomThInput');
  if (p45) p45.classList.toggle('active', alertTh === 45);
  if (p50) p50.classList.toggle('active', alertTh === 50);
  if (p55) p55.classList.toggle('active', alertTh === 55);
  if (customInput && document.activeElement !== customInput) customInput.value = alertTh;
}

function setSentryMinSec(val) {
  autoRecMinSeconds = Math.max(1, Math.min(30, Number(val) || 3));
  const elVal = document.getElementById('sentryMinSecVal');
  if (elVal) elVal.textContent = autoRecMinSeconds;
  const slider = document.getElementById('sentryMinSecSlider');
  if (slider) slider.value = autoRecMinSeconds;
  const r1 = document.getElementById('autoRecMinSR');
  if (r1) r1.value = autoRecMinSeconds;
  const v1 = document.getElementById('autoRecMinSV');
  if (v1) v1.textContent = autoRecMinSeconds + 's';
  const r2 = document.getElementById('autoRecMinSR2');
  if (r2) r2.value = autoRecMinSeconds;
  const v2 = document.getElementById('autoRecMinSV2');
  if (v2) v2.textContent = autoRecMinSeconds + 's';
  const pipe2 = document.getElementById('pipeStep2D');
  if (pipe2) pipe2.textContent = appLanguage === 'zh-CN' ? `持续${autoRecMinSeconds}秒自动录` : `Auto-record on ${autoRecMinSeconds}s`;
  const lbl = document.getElementById('sentryMinSecLbl');
  if (lbl) lbl.textContent = appLanguage === 'zh-CN' ? `超标持续判定：${autoRecMinSeconds} 秒` : `Sustained Duration: ${autoRecMinSeconds}s`;
  saveState();
}

function setSentryStopSec(val) {
  autoRecAfterStopSeconds = Math.max(3, Math.min(60, Number(val) || 10));
  const elVal = document.getElementById('sentryStopSecVal');
  if (elVal) elVal.textContent = autoRecAfterStopSeconds;
  const slider = document.getElementById('sentryStopSecSlider');
  if (slider) slider.value = autoRecAfterStopSeconds;
  const r1 = document.getElementById('autoRecAfterStopSR');
  if (r1) r1.value = autoRecAfterStopSeconds;
  const v1 = document.getElementById('autoRecAfterStopSV');
  if (v1) v1.textContent = autoRecAfterStopSeconds + 's';
  const r2 = document.getElementById('autoRecAfterStopSR2');
  if (r2) r2.value = autoRecAfterStopSeconds;
  const v2 = document.getElementById('autoRecAfterStopSV2');
  if (v2) v2.textContent = autoRecAfterStopSeconds + 's';
  const pipe3 = document.getElementById('pipeStep3D');
  if (pipe3) pipe3.textContent = appLanguage === 'zh-CN' ? `静音${autoRecAfterStopSeconds}秒截取` : `Hold ${autoRecAfterStopSeconds}s after drop`;
  const lbl = document.getElementById('sentryStopSecLbl');
  if (lbl) lbl.textContent = appLanguage === 'zh-CN' ? `恢复静音延时：${autoRecAfterStopSeconds} 秒` : `Silence Hold Delay: ${autoRecAfterStopSeconds}s`;
  saveState();
}

function renderSentryIncidentsList() {
  const container = document.getElementById('sentryIncidentsList');
  const countEl = document.getElementById('sentryTonightCountVal');
  const countBadge = document.getElementById('sentryTonightCountValBadge');
  if (!container) return;
  const isZh = appLanguage === 'zh-CN';
  const sentryRecs = (DB.records || []).filter(r => r.isSentry);
  const count = sentryRecs.length;
  if (countEl) countEl.innerHTML = `${count}<small> ${isZh ? '次' : 'hits'}</small>`;
  if (countBadge) countBadge.textContent = count;
  if (count === 0) {
    container.innerHTML = `
      <div class="sentry-empty-state">
        <div class="sentry-empty-icon">🌙</div>
        <div class="sentry-empty-title">${isZh ? '今夜尚未检测到超标突发噪音' : 'No noise exceedances detected yet'}</div>
        <div class="sentry-empty-desc">${isZh ? '哨兵已就绪，分贝持续超过设定阈值时将自动录音、抓现行并加盖数字指纹存证。' : 'Sentry is active. Audio will be auto-captured and digitally sealed when noise exceeds threshold.'}</div>
      </div>
    `;
    return;
  }
  container.innerHTML = sentryRecs.map(rec => {
    const timeDate = rec.time instanceof Date ? rec.time : new Date(rec.time);
    const timeStr = !isNaN(timeDate.getTime()) ? formatLocaleDate(timeDate, { hour: '2-digit', minute: '2-digit', second: '2-digit' }) : '--:--:--';
    const peak = rec.peakDb || '--';
    const dur = rec.dur || 0;
    const sha = rec.hashes?.mediaSha256 ? rec.hashes.mediaSha256.substring(0, 8).toUpperCase() : (rec.evidenceId || 'ST-PRO');
    return `
      <div class="sentry-incident-item">
        <div class="sentry-incident-header">
          <div class="sentry-incident-time">
            <span class="sentry-incident-dot"></span>
            <strong>${timeStr}</strong>
            <span class="sentry-incident-dur">${dur}s</span>
          </div>
          <div class="sentry-incident-peak">
            <span>${isZh ? '峰值' : 'Peak'}</span>
            <strong>${peak} dB</strong>
          </div>
        </div>
        <div class="sentry-incident-meta">
          <span class="sentry-sha-badge" title="SHA-256 Digital Fingerprint: ${rec.hashes?.mediaSha256 || ''}">🛡️ SHA-256: ${sha}...</span>
          <div class="sentry-incident-actions">
            ${(rec.url || rec.blobId) ? `<button type="button" class="sentry-mini-btn" onclick="playRecordUrl(${rec.id})">${isZh ? '▶ 试听' : '▶ Play'}</button>` : ''}
            <button type="button" class="sentry-mini-btn primary" onclick="openSentryIncidentReport(${rec.id})">${isZh ? '📄 报告' : '📄 Report'}</button>
          </div>
        </div>
      </div>
    `;
  }).join('');
}

function openSentryIncidentReport(id) {
  const rec = (DB.records || []).find(r => r.id === id);
  if (!rec) return;
  openReportPreviewModal([rec], false);
}

let activeSentryAudio = null;
function playRecordUrl(id) {
  const rec = (DB.records || []).find(r => r.id === id);
  if (!rec) return;
  if (activeSentryAudio) {
    try { activeSentryAudio.pause(); } catch (_) {}
    activeSentryAudio = null;
  }
  if (rec.url) {
    activeSentryAudio = new Audio(rec.url);
    activeSentryAudio.play().catch(e => console.warn('Audio play failed', e));
    toast(appLanguage === 'zh-CN' ? '正在播放该段超标录音...' : 'Playing captured incident audio...', 'info', 3000);
  } else if (rec.blobId && typeof loadMediaBlob === 'function') {
    loadMediaBlob(rec.blobId).then(blob => {
      if (blob) {
        const url = URL.createObjectURL(blob);
        activeSentryAudio = new Audio(url);
        activeSentryAudio.play().catch(e => console.warn('Audio play failed', e));
        toast(appLanguage === 'zh-CN' ? '正在播放该段超标录音...' : 'Playing captured incident audio...', 'info', 3000);
      }
    });
  }
}

function updateSentrySurveillanceHud(inst, isAbove, nowTs) {
  if (evidenceMode !== 'sentry') return;
  const isZh = appLanguage === 'zh-CN';
  const liveDbEl = document.getElementById('sentryLiveDbVal');
  const triggerDbEl = document.getElementById('sentryTriggerDbVal');
  const ledDot = document.getElementById('sentryLedDot');
  const statusText = document.getElementById('sentryStatusText');
  const deltaBar = document.getElementById('sentryDeltaBar');
  const deltaText = document.getElementById('sentryDeltaText');
  const pipe1 = document.getElementById('pipeStep1');
  const pipe2 = document.getElementById('pipeStep2');
  const pipe3 = document.getElementById('pipeStep3');
  const pipe4 = document.getElementById('pipeStep4');

  if (triggerDbEl) triggerDbEl.innerHTML = `${alertTh}<small> dB</small>`;

  if (!isMon) {
    if (liveDbEl) {
      liveDbEl.innerHTML = `--<small> dB</small>`;
      liveDbEl.style.color = 'var(--tx3)';
    }
    if (ledDot) ledDot.className = 'sentry-led-dot led-off';
    if (statusText) statusText.textContent = isZh ? '待启动监听 · 点击下方按钮开启守夜' : 'Standby · Click button below to start monitoring';
    if (deltaBar) {
      deltaBar.className = 'sentry-delta-bar';
      if (deltaText) deltaText.textContent = isZh ? `🛡️ 哨兵已就绪：已设阈值 ${alertTh} dB · 点击【启动夜间哨兵守护】开始监听` : `🛡️ Sentry ready: Preset threshold ${alertTh} dB · Click start below`;
    }
    pipe1?.classList.add('active');
    pipe2?.classList.remove('active');
    pipe3?.classList.remove('active');
    pipe4?.classList.remove('active');
    return;
  }

  const roundedDb = Math.round(inst || 0);
  if (liveDbEl) {
    liveDbEl.innerHTML = `${roundedDb}<small> dB</small>`;
    if (roundedDb >= alertTh) {
      liveDbEl.style.color = '#ef4444';
    } else if (roundedDb >= alertTh - 6) {
      liveDbEl.style.color = '#f59e0b';
    } else {
      liveDbEl.style.color = '#10b981';
    }
  }

  if (isRec) {
    if (ledDot) ledDot.className = 'sentry-led-dot led-recording';
    const recTimer = document.getElementById('recTimer')?.textContent || '--:--';
    if (statusText) statusText.textContent = isZh ? `🔴 突发噪音超标！自动录音存证中 ${recTimer}` : `🔴 Exceedance detected! Auto-recording ${recTimer}`;
    if (deltaBar) {
      deltaBar.className = 'sentry-delta-bar alert';
      if (deltaText) {
        if (autoRecTimeout) {
          deltaText.textContent = isZh ? `⏱️ 噪音已回落，延时封存缓冲中 · 将在 ${autoRecAfterStopSeconds} 秒后归档加盖 SHA-256 指纹` : `⏱️ Sound dropped, hold buffer active · Sealing in ${autoRecAfterStopSeconds}s`;
        } else {
          deltaText.textContent = isZh ? `🔴 正在抓取超标声学证据 · 声音回落后将延时 ${autoRecAfterStopSeconds} 秒自动封存入库` : `🔴 Recording incident · Will auto-seal ${autoRecAfterStopSeconds}s after sound drops`;
        }
      }
    }
    pipe1?.classList.remove('active');
    pipe2?.classList.remove('active');
    pipe3?.classList.add('active');
    pipe4?.classList.remove('active');
  } else if (isAbove) {
    if (ledDot) ledDot.className = 'sentry-led-dot led-triggered';
    const aboveSec = autoRecAboveSince ? ((nowTs - autoRecAboveSince) / 1000).toFixed(1) : '0.0';
    if (statusText) statusText.textContent = isZh ? `⚠️ 瞬时超标 +${roundedDb - alertTh} dB！判定中 ${aboveSec}s / ${autoRecMinSeconds}s` : `⚠️ Spike +${roundedDb - alertTh} dB! Holding ${aboveSec}s / ${autoRecMinSeconds}s`;
    if (deltaBar) {
      deltaBar.className = 'sentry-delta-bar warn';
      if (deltaText) deltaText.textContent = isZh ? `⚠️ 噪音已达 ${roundedDb} dB (超标 +${roundedDb - alertTh} dB) · 持续满 ${autoRecMinSeconds} 秒将立即自动唤醒录音` : `⚠️ Noise at ${roundedDb} dB (exceeds by +${roundedDb - alertTh} dB) · Auto-recording triggers at ${autoRecMinSeconds}s`;
    }
    pipe1?.classList.remove('active');
    pipe2?.classList.add('active');
    pipe3?.classList.remove('active');
    pipe4?.classList.remove('active');
  } else {
    if (ledDot) ledDot.className = 'sentry-led-dot led-standby';
    if (statusText) statusText.textContent = isZh ? '🟢 静默守护中 · 实时监听突发噪音...' : '🟢 Standing by silently · Listening for noise spikes...';
    const delta = Math.max(0, alertTh - roundedDb);
    if (deltaBar) {
      deltaBar.className = 'sentry-delta-bar';
      if (deltaText) deltaText.textContent = isZh ? `🛡️ 当前分贝低于阈值 ${delta} dB · 环境平稳，安然入睡` : `🛡️ Current dB is ${delta} dB below threshold · Environment quiet`;
    }
    pipe1?.classList.add('active');
    pipe2?.classList.remove('active');
    pipe3?.classList.remove('active');
    pipe4?.classList.remove('active');
  }
}

  return {
    translateSentryWorkstation: typeof translateSentryWorkstation !== 'undefined' ? translateSentryWorkstation : undefined,
    setSentryPresetThreshold: typeof setSentryPresetThreshold !== 'undefined' ? setSentryPresetThreshold : undefined,
    updateSentryPresetButtons: typeof updateSentryPresetButtons !== 'undefined' ? updateSentryPresetButtons : undefined,
    setSentryMinSec: typeof setSentryMinSec !== 'undefined' ? setSentryMinSec : undefined,
    setSentryStopSec: typeof setSentryStopSec !== 'undefined' ? setSentryStopSec : undefined,
    renderSentryIncidentsList: typeof renderSentryIncidentsList !== 'undefined' ? renderSentryIncidentsList : undefined,
    openSentryIncidentReport: typeof openSentryIncidentReport !== 'undefined' ? openSentryIncidentReport : undefined,
    playRecordUrl: typeof playRecordUrl !== 'undefined' ? playRecordUrl : undefined,
    updateSentrySurveillanceHud: typeof updateSentrySurveillanceHud !== 'undefined' ? updateSentrySurveillanceHud : undefined
  };
}));

if (typeof window !== 'undefined' && window.SoundTestSentry) {
  Object.assign(window, window.SoundTestSentry);
}
