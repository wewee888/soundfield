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
/* ── Sentry Surveillance Workstation Helper Suite & 9-Locale Dictionary ── */
function getSentryLang() {
  const lang = (typeof appLanguage === 'string' ? appLanguage.toLowerCase() : 'en');
  if (lang.startsWith('zh')) return 'zh';
  const primary = lang.split('-')[0];
  const supported = ['en', 'zh', 'es', 'fr', 'de', 'ja', 'ko', 'vi', 'th'];
  return supported.includes(primary) ? primary : 'en';
}

const SENTRY_I18N = {
  zh: {
    title: '⚡ 哨兵无人值守全自动存证闭环',
    s1T: '静默守护', s1D: '超低功耗待命',
    s2T: '突发超标', s2D: sec => `持续${sec}秒自动录`,
    s3T: '回落延时', s3D: sec => `静音${sec}秒截取`,
    s4T: '数字封存', s4D: 'SHA-256指纹入库',
    liveDb: '实时环境分贝', triggerDb: '触发报警阈值', tonightCount: '今夜抓获违规', hitUnit: '次',
    thSection: '🎯 抓拍阈值设定 (超过此分贝启动录音)',
    p45: '夜间卧室 (静音)', p50: '住宅常态 (默认)', p55: '白昼 / 临街',
    customLbl: '自定义数值：',
    minSecLbl: sec => `超标持续判定：${sec} 秒`,
    minSecDesc: '噪音连续超过阈值达到此时长才录制（防止咳嗽、翻身、关门误触发）',
    stopSecLbl: sec => `恢复静音延时：${sec} 秒`,
    stopSecDesc: '噪音停止后继续录制此时长才封存（录完整段噪音，保全尾音）',
    ledgerTitle: '📁 今夜自动抓获的超标证据', viewAll: '查看全部证据库 ↗',
    standby: '待启动监听 · 点击下方按钮开启守夜',
    deltaReady: th => `🛡️ 哨兵已就绪：已设阈值 ${th} dB · 点击下方【启动夜间哨兵守护】开启麦克风监听`,
    emptyTitle: '今夜尚未检测到超标突发噪音',
    emptyDesc: '哨兵已就绪，分贝持续超过设定阈值时将自动录音、抓现行并加盖数字指纹存证。',
    peak: '峰值', play: '▶ 试听', report: '📄 报告',
    toastPreset: th => `🎯 哨兵触发阈值已设为 ${th} dB`,
    toastPlaying: '正在播放该段超标录音...'
  },
  en: {
    title: '⚡ Autonomous Forensic Surveillance Pipeline',
    s1T: 'Silent Standby', s1D: 'Low-power guard',
    s2T: 'Spike Exceedance', s2D: sec => `Auto-record on ${sec}s`,
    s3T: 'Post-Drop Delay', s3D: sec => `Hold ${sec}s after drop`,
    s4T: 'Cryptographic Seal', s4D: 'SHA-256 sealed',
    liveDb: 'Live Reading', triggerDb: 'Trigger Limit', tonightCount: "Tonight's Incidents", hitUnit: 'events',
    thSection: '🎯 Trigger Threshold (Auto-records above this level)',
    p45: 'Night Bedroom (Quiet)', p50: 'Residential (Default)', p55: 'Daytime / Street',
    customLbl: 'Custom value:',
    minSecLbl: sec => `Sustained Duration: ${sec}s`,
    minSecDesc: 'Only triggers after sound stays above threshold for this duration (filters coughs & bed turns)',
    stopSecLbl: sec => `Silence Hold Delay: ${sec}s`,
    stopSecDesc: 'Continues recording for this duration after sound drops to capture full noise event',
    ledgerTitle: "📁 Tonight's Auto-Captured Proof", viewAll: 'View Evidence Vault ↗',
    standby: 'Standby · Tap button below to start sentry guard',
    deltaReady: th => `🛡️ Sentry ready: Preset threshold ${th} dB · Click Start Sentry Guard below to begin monitoring`,
    emptyTitle: 'No noise violations detected tonight',
    emptyDesc: 'Sentry is active. Audio will be auto-captured and digitally sealed when noise exceeds threshold.',
    peak: 'Peak', play: '▶ Play', report: '📄 Report',
    toastPreset: th => `🎯 Sentry threshold set to ${th} dB`,
    toastPlaying: 'Playing captured incident audio...'
  },
  es: {
    title: '⚡ Flujo de vigilancia pericial autónomo',
    s1T: 'Espera silenciosa', s1D: 'Guardia de bajo consumo',
    s2T: 'Exceso repentino', s2D: sec => `Auto-grabar tras ${sec}s`,
    s3T: 'Retardo de caída', s3D: sec => `Mantener ${sec}s tras silencio`,
    s4T: 'Sello digital', s4D: 'Sellado SHA-256',
    liveDb: 'Nivel en vivo', triggerDb: 'Límite de disparo', tonightCount: 'Eventos de hoy', hitUnit: 'ev.',
    thSection: '🎯 Umbral de disparo (Graba automáticamente al superar)',
    p45: 'Dormitorio (Silencioso)', p50: 'Residencial (Estándar)', p55: 'Día / Calle',
    customLbl: 'Límite personalizado:',
    minSecLbl: sec => `Duración sostenida: ${sec}s`,
    minSecDesc: 'Solo se activa tras superar el límite de forma continua (filtra toses y sábanas)',
    stopSecLbl: sec => `Retardo tras silencio: ${sec}s`,
    stopSecDesc: 'Sigue grabando tras cesar el ruido para registrar el evento completo',
    ledgerTitle: '📁 Pruebas capturadas esta noche', viewAll: 'Ver bóveda de pruebas ↗',
    standby: 'En espera · Toca abajo para activar la guardia',
    deltaReady: th => `🛡️ Centinela listo: Límite ${th} dB · Toca Iniciar guardia abajo para monitorear`,
    emptyTitle: 'No se detectaron excesos esta noche',
    emptyDesc: 'Centinela activo. Los picos que superen el límite se grabarán con firma digital SHA-256.',
    peak: 'Pico', play: '▶ Reproducir', report: '📄 Informe',
    toastPreset: th => `🎯 Umbral del centinela fijado en ${th} dB`,
    toastPlaying: 'Reproduciendo audio de la infracción...'
  },
  fr: {
    title: '⚡ Pipeline de surveillance légale autonome',
    s1T: 'Veille silencieuse', s1D: 'Veille basse conso',
    s2T: 'Pic de dépassement', s2D: sec => `Auto-enregistrement à ${sec}s`,
    s3T: 'Maintien post-baisse', s3D: sec => `Garder ${sec}s après baisse`,
    s4T: 'Sceau numérique', s4D: 'Empreinte SHA-256',
    liveDb: 'Niveau en direct', triggerDb: "Seuil d'alerte", tonightCount: 'Incidents de nuit', hitUnit: 'év.',
    thSection: '🎯 Seuil de déclenchement (Enregistre au-delà de ce niveau)',
    p45: 'Chambre nuit (Calme)', p50: 'Résidentiel (Standard)', p55: 'Jour / Rue',
    customLbl: 'Valeur personnalisée :',
    minSecLbl: sec => `Durée soutenue : ${sec}s`,
    minSecDesc: 'Déclenche uniquement si le bruit dépasse le seuil en continu (filtre la toux et les mouvements)',
    stopSecLbl: sec => `Délai après silence : ${sec}s`,
    stopSecDesc: "Poursuit l'enregistrement après la fin du bruit pour préserver l'acoustique complète",
    ledgerTitle: '📁 Preuves capturées cette nuit', viewAll: 'Ouvrir le coffre de preuves ↗',
    standby: 'En attente · Appuyez ci-dessous pour démarrer la surveillance',
    deltaReady: th => `🛡️ Sentinelle prête : Seuil ${th} dB · Appuyez ci-dessous pour lancer l'écoute`,
    emptyTitle: 'Aucun dépassement détecté cette nuit',
    emptyDesc: 'Sentinelle active. Les événements dépassant le seuil seront scellés avec empreinte SHA-256.',
    peak: 'Crête', play: '▶ Écouter', report: '📄 Rapport',
    toastPreset: th => `🎯 Seuil sentinelle réglé sur ${th} dB`,
    toastPlaying: 'Lecture de l’enregistrement de l’incident...'
  },
  de: {
    title: '⚡ Autonome forensische Überwachungs-Pipeline',
    s1T: 'Stille Wache', s1D: 'Energiespar-Modus',
    s2T: 'Pegelspitze', s2D: sec => `Auto-Aufnahme nach ${sec}s`,
    s3T: 'Nachlaufzeit', s3D: sec => `${sec}s Nachlauf nach Abfall`,
    s4T: 'Kryptosiegel', s4D: 'SHA-256 versiegelt',
    liveDb: 'Live-Pegel', triggerDb: 'Auslösegrenze', tonightCount: 'Vorfälle heute', hitUnit: 'Fälle',
    thSection: '🎯 Auslöseschwelle (Automatische Aufnahme ab diesem Pegel)',
    p45: 'Schlafzimmer (Leise)', p50: 'Wohngebiet (Standard)', p55: 'Tag / Straße',
    customLbl: 'Eigener Wert:',
    minSecLbl: sec => `Mindestdauer: ${sec}s`,
    minSecDesc: 'Löst erst nach kontinuierlicher Überschreitung aus (filtert Husten & Bettgeräusche)',
    stopSecLbl: sec => `Nachlauf-Verzögerung: ${sec}s`,
    stopSecDesc: 'Nimmt nach Lärmabfall weiter auf, um das gesamte Schallereignis zu sichern',
    ledgerTitle: '📁 Heute Nacht erfasste Beweise', viewAll: 'Beweisarchiv öffnen ↗',
    standby: 'Bereit · Unten tippen, um Nachtwache zu starten',
    deltaReady: th => `🛡️ Wache bereit: Schwellenwert ${th} dB · Unten tippen für Mikrofon-Überwachung`,
    emptyTitle: 'Heute Nacht noch keine Verstöße erfasst',
    emptyDesc: 'Wache ist aktiv. Überschreitungen werden automatisch mit SHA-256 Siegel gesichert.',
    peak: 'Spitze', play: '▶ Anhören', report: '📄 Bericht',
    toastPreset: th => `🎯 Wächter-Schwellenwert auf ${th} dB gesetzt`,
    toastPlaying: 'Vorfall-Aufnahme wird abgespielt...'
  },
  ja: {
    title: '⚡ 完全自動・証拠保全監視パイプライン',
    s1T: '静音待機', s1D: '低消費電力常時監視',
    s2T: '突発超過', s2D: sec => `${sec}秒継続で自動録音`,
    s3T: '収束遅延', s3D: sec => `減衰後${sec}秒間保持`,
    s4T: '暗号封印', s4D: 'SHA-256改ざん防止',
    liveDb: 'リアルタイム音圧', triggerDb: '作動しきい値', tonightCount: '今夜の検知件数', hitUnit: '件',
    thSection: '🎯 トリガー閾値設定 (この音圧を超えると自動録音)',
    p45: '夜間寝室 (静粛)', p50: '住宅地常態 (標準)', p55: '昼間 / 道路沿い',
    customLbl: 'カスタム値：',
    minSecLbl: sec => `継続判定時間：${sec} 秒`,
    minSecDesc: '騒音が設定値を連続で超えた場合のみ録音（咳や寝返りの誤検知を防止）',
    stopSecLbl: sec => `静穏復帰遅延：${sec} 秒`,
    stopSecDesc: '騒音が収まった後もこの時間録音を継続し、余韻まで完全保存',
    ledgerTitle: '📁 今夜自動記録された違反証拠', viewAll: '証拠アーカイブを見る ↗',
    standby: '待機中 · 下のボタンをタップして夜間見守りを開始',
    deltaReady: th => `🛡️ 哨戒準備完了: 設定閾値 ${th} dB · 下の「夜間見守りを開始」でマイク起動`,
    emptyTitle: '今夜の騒音超過はまだ検知されていません',
    emptyDesc: '見守り待機中。閾値を超える突発騒音はSHA-256指紋付きで自動保存されます。',
    peak: 'ピーク', play: '▶ 再生', report: '📄 報告書',
    toastPreset: th => `🎯 哨戒トリガー閾値を ${th} dB に設定しました`,
    toastPlaying: '検知した騒音音声を再生しています...'
  },
  ko: {
    title: '⚡ 완전 자동화 증거 보전 감시 파이프라인',
    s1T: '무음 대기', s1D: '저전력 상시 감시',
    s2T: '기준치 초과', s2D: sec => `${sec}초 지속 시 자동녹음`,
    s3T: '감소 후 지연', s3D: sec => `소음 종료 후 ${sec}초 유지`,
    s4T: '디지털 봉인', s4D: 'SHA-256 위변조 방지',
    liveDb: '실시간 데시벨', triggerDb: '감지 기준치', tonightCount: '오늘 밤 적발 건수', hitUnit: '건',
    thSection: '🎯 감지 기준치 설정 (이 데시벨 초과 시 자동 녹음)',
    p45: '야간 침실 (정숙)', p50: '주거지역 (기본값)', p55: '주간 / 도로변',
    customLbl: '사용자 지정 값:',
    minSecLbl: sec => `지속 시간 판정: ${sec}초`,
    minSecDesc: '소음이 기준치를 연속 초과할 때만 녹음 (기침·뒤척임 등 오작동 필터링)',
    stopSecLbl: sec => `소음 종료 후 지연: ${sec}초`,
    stopSecDesc: '소음 종료 후에도 이 시간 동안 추가 녹음하여 끝부분까지 완전 보전',
    ledgerTitle: '📁 오늘 밤 자동 보전된 증거', viewAll: '증거 보관함 전체보기 ↗',
    standby: '대기 중 · 아래 버튼을 눌러 야간 감시 시작',
    deltaReady: th => `🛡️ 보초 준비 완료: 기준치 ${th} dB · 아래 [야간 감시 시작]을 눌러 모니터링`,
    emptyTitle: '오늘 밤 감지된 소음 위반이 없습니다',
    emptyDesc: '감시 대기 중. 기준치를 초과하는 소음은 SHA-256 디지털 봉인과 함께 자동 저장됩니다.',
    peak: '최고', play: '▶ 재생', report: '📄 보고서',
    toastPreset: th => `🎯 보초 감지 기준치가 ${th} dB로 설정되었습니다`,
    toastPlaying: '해당 초과 소음 음성을 재생합니다...'
  },
  vi: {
    title: '⚡ Quy trình giám sát lưu chứng tự động',
    s1T: 'Chờ im lặng', s1D: 'Tiết kiệm pin',
    s2T: 'Vượt ngưỡng', s2D: sec => `Tự ghi âm sau ${sec}s`,
    s3T: 'Độ trễ suy giảm', s3D: sec => `Giữ ${sec}s sau khi dứt`,
    s4T: 'Niêm phong số', s4D: 'Khóa mã SHA-256',
    liveDb: 'Mức thời gian thực', triggerDb: 'Ngưỡng kích hoạt', tonightCount: 'Vi phạm đêm nay', hitUnit: 'lần',
    thSection: '🎯 Thiết lập ngưỡng kích hoạt (Tự ghi âm khi vượt ngưỡng)',
    p45: 'Phòng ngủ đêm (Yên tĩnh)', p50: 'Khu dân cư (Mặc định)', p55: 'Ban ngày / Mặt đường',
    customLbl: 'Giá trị tùy chỉnh:',
    minSecLbl: sec => `Thời gian duy trì: ${sec}s`,
    minSecDesc: 'Chỉ ghi âm khi tiếng ồn vượt ngưỡng liên tục trong thời gian này (tránh báo động giả)',
    stopSecLbl: sec => `Độ trễ sau im lặng: ${sec}s`,
    stopSecDesc: 'Tiếp tục ghi âm thêm sau khi tiếng ồn dứt để lưu trọn vẹn toàn bộ sự kiện',
    ledgerTitle: '📁 Bằng chứng ghi nhận đêm nay', viewAll: 'Xem kho bằng chứng ↗',
    standby: 'Chờ kích hoạt · Nhấn nút bên dưới để bắt đầu canh gác',
    deltaReady: th => `🛡️ Sẵn sàng: Đặt ngưỡng ${th} dB · Nhấn nút bên dưới để bật micrô giám sát`,
    emptyTitle: 'Chưa phát hiện tiếng ồn vượt ngưỡng đêm nay',
    emptyDesc: 'Chế độ sẵn sàng. Âm thanh vượt ngưỡng sẽ được ghi lại kèm khóa số SHA-256.',
    peak: 'Đỉnh', play: '▶ Nghe', report: '📄 Báo cáo',
    toastPreset: th => `🎯 Đã đặt ngưỡng canh gác là ${th} dB`,
    toastPlaying: 'Đang phát âm thanh sự kiện...'
  },
  th: {
    title: '⚡ กระบวนการเฝ้าระวังและเก็บหลักฐานอัตโนมัติ',
    s1T: 'สแตนด์บายเงียบ', s1D: 'เฝ้าระวังประหยัดพลังงาน',
    s2T: 'ระดับเสียงเกิน', s2D: sec => `บันทึกอัตโนมัติใน ${sec}วิ`,
    s3T: 'หน่วงเวลาเสียงลด', s3D: sec => `บันทึกต่อ ${sec}วิ หลังเสียงหยุด`,
    s4T: 'ผนึกดิจิทัล', s4D: 'ประทับตรา SHA-256',
    liveDb: 'ระดับเสียงสด', triggerDb: 'เกณฑ์ตรวจจับ', tonightCount: 'เหตุการณ์คืนนี้', hitUnit: 'ครั้ง',
    thSection: '🎯 ตั้งเกณฑ์ตรวจจับ (บันทึกอัตโนมัติเมื่อเกินระดับนี้)',
    p45: 'ห้องนอน (เงียบ)', p50: 'เขตที่พักอาศัย (มาตรฐาน)', p55: 'กลางวัน / ริมถนน',
    customLbl: 'กำหนดเอง:',
    minSecLbl: sec => `ระยะเวลาต่อเนื่อง: ${sec}วิ`,
    minSecDesc: 'บันทึกเมื่อเสียงเกินเกณฑ์ต่อเนื่องตามเวลานี้ (ป้องกันเสียงไอหรือขยับตัว)',
    stopSecLbl: sec => `หน่วงเวลาหลังเสียงเงียบ: ${sec}วิ`,
    stopSecDesc: 'บันทึกต่อหลังจากเสียงเงียบลงเพื่อให้ได้ข้อมูลเสียงช่วงท้ายที่สมบูรณ์',
    ledgerTitle: '📁 หลักฐานที่บันทึกอัตโนมัติคืนนี้', viewAll: 'ดูคลังหลักฐานทั้งหมด ↗',
    standby: 'สแตนด์บาย · แตะปุ่มด้านล่างเพื่อเริ่มเฝ้าระวัง',
    deltaReady: th => `🛡️ ยามพร้อมทำงาน: ตั้งเกณฑ์ ${th} dB · แตะด้านล่างเพื่อเปิดไมโครโฟนเฝ้าระวัง`,
    emptyTitle: 'ยังไม่พบเสียงเกินเกณฑ์ในคืนนี้',
    emptyDesc: 'ยามพร้อมทำงาน เสียงที่เกินเกณฑ์จะถูกบันทึกอัตโนมัติพร้อมตราประทับ SHA-256',
    peak: 'สูงสุด', play: '▶ ฟัง', report: '📄 รายงาน',
    toastPreset: th => `🎯 ตั้งเกณฑ์ตรวจจับยามไว้ที่ ${th} dB แล้ว`,
    toastPlaying: 'กำลังเล่นเสียงที่บันทึกไว้...'
  }
};

function translateSentryWorkstation() {
  const langKey = getSentryLang();
  const loc = SENTRY_I18N[langKey] || SENTRY_I18N.en;

  setText('sentryPipelineTitle', loc.title);
  setText('pipeStep1T', loc.s1T);
  setText('pipeStep1D', loc.s1D);
  setText('pipeStep2T', loc.s2T);
  setText('pipeStep2D', typeof loc.s2D === 'function' ? loc.s2D(autoRecMinSeconds) : loc.s2D);
  setText('pipeStep3T', loc.s3T);
  setText('pipeStep3D', typeof loc.s3D === 'function' ? loc.s3D(autoRecAfterStopSeconds) : loc.s3D);
  setText('pipeStep4T', loc.s4T);
  setText('pipeStep4D', loc.s4D);

  setText('sentryLiveDbLbl', loc.liveDb);
  setText('sentryTriggerDbLbl', loc.triggerDb);
  setText('sentryTonightCountLbl', loc.tonightCount);

  setText('sentryThSectionTitle', loc.thSection);
  setText('sentryPre45Span', loc.p45);
  setText('sentryPre50Span', loc.p50);
  setText('sentryPre55Span', loc.p55);
  setText('sentryCustomLabel', loc.customLbl);

  setText('sentryMinSecLbl', typeof loc.minSecLbl === 'function' ? loc.minSecLbl(autoRecMinSeconds) : loc.minSecLbl);
  setText('sentryMinSecDesc', loc.minSecDesc);
  setText('sentryStopSecLbl', typeof loc.stopSecLbl === 'function' ? loc.stopSecLbl(autoRecAfterStopSeconds) : loc.stopSecLbl);
  setText('sentryStopSecDesc', loc.stopSecDesc);

  setText('sentryLedgerTitle', loc.ledgerTitle);
  setText('sentryViewAllBtn', loc.viewAll);

  const statusText = document.getElementById('sentryStatusText');
  if (statusText && !isMon) {
    statusText.textContent = loc.standby;
  }

  const deltaText = document.getElementById('sentryDeltaText');
  if (deltaText && !isMon) {
    deltaText.textContent = typeof loc.deltaReady === 'function' ? loc.deltaReady(alertTh) : loc.deltaReady;
  }

  if (typeof renderSentryIncidentsList === 'function') {
    renderSentryIncidentsList();
  }
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
  const loc = SENTRY_I18N[getSentryLang()] || SENTRY_I18N.en;
  toast(typeof loc.toastPreset === 'function' ? loc.toastPreset(alertTh) : `🎯 Sentry threshold set to ${alertTh} dB`, 'info', 2000);
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
  const loc = SENTRY_I18N[getSentryLang()] || SENTRY_I18N.en;
  const pipe2 = document.getElementById('pipeStep2D');
  if (pipe2) pipe2.textContent = typeof loc.s2D === 'function' ? loc.s2D(autoRecMinSeconds) : loc.s2D;
  const lbl = document.getElementById('sentryMinSecLbl');
  if (lbl) lbl.textContent = typeof loc.minSecLbl === 'function' ? loc.minSecLbl(autoRecMinSeconds) : loc.minSecLbl;
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
  const loc = SENTRY_I18N[getSentryLang()] || SENTRY_I18N.en;
  const pipe3 = document.getElementById('pipeStep3D');
  if (pipe3) pipe3.textContent = typeof loc.s3D === 'function' ? loc.s3D(autoRecAfterStopSeconds) : loc.s3D;
  const lbl = document.getElementById('sentryStopSecLbl');
  if (lbl) lbl.textContent = typeof loc.stopSecLbl === 'function' ? loc.stopSecLbl(autoRecAfterStopSeconds) : loc.stopSecLbl;
  saveState();
}

function renderSentryIncidentsList() {
  const container = document.getElementById('sentryIncidentsList');
  const countEl = document.getElementById('sentryTonightCountVal');
  const countBadge = document.getElementById('sentryTonightCountValBadge');
  if (!container) return;
  const loc = SENTRY_I18N[getSentryLang()] || SENTRY_I18N.en;
  const sentryRecs = (DB.records || []).filter(r => r.isSentry);
  const count = sentryRecs.length;
  if (countEl) countEl.innerHTML = `${count}<small> ${loc.hitUnit}</small>`;
  if (countBadge) countBadge.textContent = count;
  if (count === 0) {
    container.innerHTML = `
      <div class="sentry-empty-state">
        <div class="sentry-empty-icon">🌙</div>
        <div class="sentry-empty-title">${loc.emptyTitle}</div>
        <div class="sentry-empty-desc">${loc.emptyDesc}</div>
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
            <span>${loc.peak}</span>
            <strong>${peak} dB</strong>
          </div>
        </div>
        <div class="sentry-incident-meta">
          <span class="sentry-sha-badge" title="SHA-256 Digital Fingerprint: ${rec.hashes?.mediaSha256 || ''}">🛡️ SHA-256: ${sha}...</span>
          <div class="sentry-incident-actions">
            ${(rec.url || rec.blobId) ? `<button type="button" class="sentry-mini-btn" onclick="playRecordUrl(${rec.id})">${loc.play}</button>` : ''}
            <button type="button" class="sentry-mini-btn primary" onclick="openSentryIncidentReport(${rec.id})">${loc.report}</button>
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
  const loc = SENTRY_I18N[getSentryLang()] || SENTRY_I18N.en;
  if (rec.url) {
    activeSentryAudio = new Audio(rec.url);
    activeSentryAudio.play().catch(e => console.warn('Audio play failed', e));
    toast(loc.toastPlaying || 'Playing captured incident audio...', 'info', 3000);
  } else if (rec.blobId && typeof loadMediaBlob === 'function') {
    loadMediaBlob(rec.blobId).then(blob => {
      if (blob) {
        const url = URL.createObjectURL(blob);
        activeSentryAudio = new Audio(url);
        activeSentryAudio.play().catch(e => console.warn('Audio play failed', e));
        toast(loc.toastPlaying || 'Playing captured incident audio...', 'info', 3000);
      }
    });
  }
}

function updateSentrySurveillanceHud(inst, isAbove, nowTs) {
  if (evidenceMode !== 'sentry') return;
  const langKey = getSentryLang();
  const loc = SENTRY_I18N[langKey] || SENTRY_I18N.en;
  const isZh = (langKey === 'zh');
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
    if (statusText) statusText.textContent = loc.standby;
    if (deltaBar) {
      deltaBar.className = 'sentry-delta-bar';
      if (deltaText) deltaText.textContent = typeof loc.deltaReady === 'function' ? loc.deltaReady(alertTh) : loc.deltaReady;
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
    if (statusText) statusText.textContent = typeof loc.statusRecording === 'function' ? loc.statusRecording(recTimer) : (isZh ? `🔴 突发噪音超标！自动录音存证中 ${recTimer}` : `🔴 Exceedance detected! Auto-recording ${recTimer}`);
    if (deltaBar) {
      deltaBar.className = 'sentry-delta-bar alert';
      if (deltaText) {
        if (autoRecTimeout) {
          deltaText.textContent = typeof loc.deltaBuffer === 'function' ? loc.deltaBuffer(autoRecAfterStopSeconds) : (isZh ? `⏱️ 噪音已回落，延时封存缓冲中 · 将在 ${autoRecAfterStopSeconds} 秒后归档加盖 SHA-256 指纹` : `⏱️ Sound dropped, hold buffer active · Sealing in ${autoRecAfterStopSeconds}s`);
        } else {
          deltaText.textContent = typeof loc.deltaRecording === 'function' ? loc.deltaRecording(autoRecAfterStopSeconds) : (isZh ? `🔴 正在抓取超标声学证据 · 声音回落后将延时 ${autoRecAfterStopSeconds} 秒自动封存入库` : `🔴 Recording incident · Will auto-seal ${autoRecAfterStopSeconds}s after sound drops`);
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
    if (statusText) statusText.textContent = typeof loc.statusSpike === 'function' ? loc.statusSpike(roundedDb - alertTh, aboveSec, autoRecMinSeconds) : (isZh ? `⚠️ 瞬时超标 +${roundedDb - alertTh} dB！判定中 ${aboveSec}s / ${autoRecMinSeconds}s` : `⚠️ Spike +${roundedDb - alertTh} dB! Holding ${aboveSec}s / ${autoRecMinSeconds}s`);
    if (deltaBar) {
      deltaBar.className = 'sentry-delta-bar warn';
      if (deltaText) deltaText.textContent = typeof loc.deltaSpike === 'function' ? loc.deltaSpike(roundedDb, roundedDb - alertTh, autoRecMinSeconds) : (isZh ? `⚠️ 噪音已达 ${roundedDb} dB (超标 +${roundedDb - alertTh} dB) · 持续满 ${autoRecMinSeconds} 秒将立即自动唤醒录音` : `⚠️ Noise at ${roundedDb} dB (exceeds by +${roundedDb - alertTh} dB) · Auto-recording triggers at ${autoRecMinSeconds}s`);
    }
    pipe1?.classList.remove('active');
    pipe2?.classList.add('active');
    pipe3?.classList.remove('active');
    pipe4?.classList.remove('active');
  } else {
    if (ledDot) ledDot.className = 'sentry-led-dot led-standby';
    if (statusText) statusText.textContent = loc.statusStandbyMon || (isZh ? '🟢 静默守护中 · 实时监听突发噪音...' : '🟢 Standing by silently · Listening for noise spikes...');
    const delta = Math.max(0, alertTh - roundedDb);
    if (deltaBar) {
      deltaBar.className = 'sentry-delta-bar';
      if (deltaText) deltaText.textContent = typeof loc.deltaQuiet === 'function' ? loc.deltaQuiet(delta) : (isZh ? `🛡️ 当前分贝低于阈值 ${delta} dB · 环境平稳，安然入睡` : `🛡️ Current dB is ${delta} dB below threshold · Environment quiet`);
    }
    pipe1?.classList.add('active');
    pipe2?.classList.remove('active');
    pipe3?.classList.remove('active');
    pipe4?.classList.remove('active');
  }
}

  return {
    SENTRY_I18N: typeof SENTRY_I18N !== 'undefined' ? SENTRY_I18N : undefined,
    getSentryLang: typeof getSentryLang !== 'undefined' ? getSentryLang : undefined,
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
