(function () {
  'use strict';

  function formatStorageBytes(bytes) {
    const value = Number(bytes);
    if (!Number.isFinite(value) || value <= 0) return '0 B';
    const units = ['B', 'KB', 'MB', 'GB'];
    let size = value;
    let unitIndex = 0;
    while (size >= 1024 && unitIndex < units.length - 1) {
      size /= 1024;
      unitIndex++;
    }
    const precision = size >= 10 || unitIndex === 0 ? 0 : 1;
    return `${size.toFixed(precision).replace(/\.0$/, '')} ${units[unitIndex]}`;
  }

  function buildStorageHealthSummary(input = {}) {
    const records = Array.isArray(input.records) ? input.records : [];
    const usage = Number(input.usage) || 0;
    const quota = Number(input.quota) || 0;
    const usagePercent = quota > 0 ? Math.min(100, Math.round((usage / quota) * 100)) : 0;
    const recoverableMediaCount = records.filter((record) => record && record.blobId).length;
    const temporaryMediaCount = records.filter((record) => record && record.url && !record.blobId).length;
    const status = !input.supported || usagePercent >= 85 || !input.persisted || temporaryMediaCount > 0
      ? 'warn'
      : 'ok';

    return {
      supported: input.supported !== false,
      persisted: !!input.persisted,
      usage,
      quota,
      usageText: formatStorageBytes(usage),
      quotaText: quota > 0 ? formatStorageBytes(quota) : 'unknown',
      usagePercent,
      recordCount: records.length,
      recoverableMediaCount,
      temporaryMediaCount,
      status,
    };
  }

  function createMetadataBackup(input = {}) {
    const records = Array.isArray(input.records) ? input.records : [];
    return {
      schema: 'soundfield-local-backup-v1',
      exportedAt: new Date().toISOString(),
      appVersion: input.appVersion || '',
      mediaIncluded: false,
      settings: input.settings || {},
      records: records.map((record) => {
        const copy = { ...record };
        delete copy.url;
        delete copy.blobId;
        if (copy.time instanceof Date) copy.time = copy.time.toISOString();
        return copy;
      }),
    };
  }

  window.SoundfieldStorage = {
    formatStorageBytes,
    buildStorageHealthSummary,
    createMetadataBackup,
  };
})();
