const assert = require('node:assert/strict');
const test = require('node:test');
const path = require('node:path');

global.window = {};
require(path.join(__dirname, '..', 'assets', 'storage-utils.js'));

const storage = global.window.SoundfieldStorage;

test('formats storage byte counts for user-facing cards', () => {
  assert.equal(storage.formatStorageBytes(0), '0 B');
  assert.equal(storage.formatStorageBytes(1536), '1.5 KB');
  assert.equal(storage.formatStorageBytes(5 * 1024 * 1024), '5 MB');
  assert.equal(storage.formatStorageBytes(1.25 * 1024 * 1024 * 1024), '1.3 GB');
});

test('builds a storage health summary from browser estimates and records', () => {
  const summary = storage.buildStorageHealthSummary({
    supported: true,
    persisted: false,
    usage: 50 * 1024 * 1024,
    quota: 200 * 1024 * 1024,
    records: [
      { id: 1, blobId: 'clip-1' },
      { id: 2, url: 'blob:temp' },
      { id: 3 },
    ],
  });

  assert.equal(summary.usageText, '50 MB');
  assert.equal(summary.quotaText, '200 MB');
  assert.equal(summary.usagePercent, 25);
  assert.equal(summary.recordCount, 3);
  assert.equal(summary.recoverableMediaCount, 1);
  assert.equal(summary.temporaryMediaCount, 1);
  assert.equal(summary.status, 'warn');
});

test('creates a metadata-only backup without volatile media URLs', () => {
  const backup = storage.createMetadataBackup({
    appVersion: 'sf_v5',
    settings: { weighting: 'A', timeWeight: 'F' },
    records: [
      {
        id: 1,
        evidenceId: 'SF-20260517-ABCDE',
        url: 'blob:temporary',
        blobId: 'clip-1',
        time: new Date('2026-05-17T08:00:00Z'),
      },
    ],
  });

  assert.equal(backup.schema, 'soundfield-local-backup-v1');
  assert.equal(backup.appVersion, 'sf_v5');
  assert.equal(backup.records[0].url, undefined);
  assert.equal(backup.records[0].blobId, undefined);
  assert.equal(backup.records[0].time, '2026-05-17T08:00:00.000Z');
  assert.equal(backup.mediaIncluded, false);
});
