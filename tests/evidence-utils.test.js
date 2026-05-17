const assert = require('node:assert/strict');
const test = require('node:test');
const path = require('node:path');

global.window = {};
require(path.join(__dirname, '..', 'assets', 'evidence-utils.js'));

const evidence = global.window.SoundfieldEvidence;

test('creates stable evidence IDs with date prefix', () => {
  const id = evidence.createEvidenceId(new Date('2026-05-17T07:30:00Z'), 0.42);

  assert.match(id, /^SF-20260517-[0-9A-Z]{5}$/);
});

test('canonicalizes metadata independent of object key order', () => {
  const first = evidence.canonicalizeEvidenceMetadata({ b: 2, a: { d: 4, c: 3 } });
  const second = evidence.canonicalizeEvidenceMetadata({ a: { c: 3, d: 4 }, b: 2 });

  assert.equal(first, second);
});

test('formats structured location details', () => {
  assert.equal(
    evidence.formatLocationDetails({ building: '3', floor: '12', room: '1201', point: '窗边' }, 'zh-CN'),
    '楼栋 3 · 楼层 12 · 房间 1201 · 测点 窗边'
  );
});
