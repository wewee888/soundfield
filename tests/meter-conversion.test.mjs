import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';

const root = process.cwd();

test('meter screen keeps one reading and parks the upsell until a moment of value', async () => {
  const html = await fs.readFile(path.join(root, 'soundtest.html'), 'utf-8');
  assert.match(html, /id="subscriptionBanner"[^>]*class="subscription-banner banner-parked"|class="subscription-banner banner-parked"[^>]*id="subscriptionBanner"/);
  assert.match(html, /id="meterDetails"/);
  assert.match(html, /id="meterWeightRow"/);
  assert.match(html, /function presentValueMoment\(kind\)/);
  assert.match(html, /function queueValueMoment\(kind\)/);
  assert.match(html, /queueValueMoment\('session'\)/);
  assert.match(html, /queueValueMoment\('export'\)/);
  assert.match(html, /queueValueMoment\('evidence'\)/);
  assert.match(html, /presentValueMoment\('long'\)/);
  assert.match(html, /function showSubscriptionPlans\(\)/);
  assert.doesNotMatch(html, /不能确认是房间声级/);
  assert.match(html, /读数很低，接近这部手机麦克风的安静极限/);
  assert.match(html, /Very quiet — near this phone mic/);
  assert.match(html, /这次测量可以存档了/);
  assert.match(html, /This session can be filed/);
  assert.match(html, /この測定は記録に残せます/);
  assert.match(html, /이번 측정은 기록으로 남길 수 있습니다/);
  assert.match(html, /Phiên đo này có thể lưu hồ sơ/);
  assert.match(html, /รอบวัดนี้บันทึกเป็นแฟ้มได้แล้ว/);
  assert.match(html, /Esta sesión ya se puede archivar/);
  assert.match(html, /Cette session peut être archivée/);
  assert.match(html, /Diese Messung kann abgelegt werden/);
  assert.match(html, /id="telemetryBadge">Based on IEC algorithms/);
  assert.match(html, /offset:-11\.0/);
  assert.match(html, /offset:12\.0/);
  assert.match(html, /meterPeakSettled\(\)/);
  assert.match(html, /resetMeasurementIntegrators\(\);\s*longMomentQueued=false;\s*isMon=true/);
});
