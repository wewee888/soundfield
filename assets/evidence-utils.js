(function () {
  'use strict';

  function createEvidenceId(date = new Date(), randomValue = Math.random()) {
    const stamp = date.toISOString().slice(0, 10).replace(/-/g, '');
    const code = Math.floor(randomValue * 0xffffff)
      .toString(36)
      .toUpperCase()
      .padStart(5, '0')
      .slice(0, 5);
    return `SF-${stamp}-${code}`;
  }

  function canonicalizeEvidenceMetadata(value) {
    if (Array.isArray(value)) return `[${value.map(canonicalizeEvidenceMetadata).join(',')}]`;
    if (value && typeof value === 'object') {
      return `{${Object.keys(value).sort().map((key) => `${JSON.stringify(key)}:${canonicalizeEvidenceMetadata(value[key])}`).join(',')}}`;
    }
    return JSON.stringify(value ?? null);
  }

  function formatLocationDetails(details = {}, locale = 'zh-CN') {
    const labels = locale === 'en-US'
      ? { building: 'Building', floor: 'Floor', room: 'Room', point: 'Point' }
      : { building: '楼栋', floor: '楼层', room: '房间', point: '测点' };
    return ['building', 'floor', 'room', 'point']
      .filter((key) => details[key])
      .map((key) => `${labels[key]} ${details[key]}`)
      .join(' · ');
  }

  window.SoundfieldEvidence = {
    createEvidenceId,
    canonicalizeEvidenceMetadata,
    formatLocationDetails,
  };
})();
