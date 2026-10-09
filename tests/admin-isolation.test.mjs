import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const rootDir = process.cwd();

test('Client App (soundtest.html) Admin Isolation: No admin residue, buttons, or credentials', () => {
  const soundtestHtml = fs.readFileSync(path.join(rootDir, 'soundtest.html'), 'utf-8');

  // 1. Settings drawer must NOT have Admin tab or Admin section
  assert.ok(!soundtestHtml.includes('id="sdTabAdmin"'), 'soundtest.html must NOT contain #sdTabAdmin in settings drawer');
  assert.ok(!soundtestHtml.includes('data-section="admin"'), 'soundtest.html drawer must NOT contain data-section="admin"');
  assert.ok(!soundtestHtml.includes('data-settings-nav="admin"'), 'soundtest.html settings hub must NOT contain admin nav chip');
  assert.ok(!soundtestHtml.includes('data-settings-section="admin"'), 'soundtest.html must NOT contain data-settings-section="admin"');

  // 2. Settings cards must NOT contain admin cards or operational login
  assert.ok(!soundtestHtml.includes('id="adminLoginCard"'), 'soundtest.html must NOT contain #adminLoginCard');
  assert.ok(!soundtestHtml.includes('id="adminOpsCard"'), 'soundtest.html must NOT contain #adminOpsCard');
  assert.ok(!soundtestHtml.includes('id="adminPassInput"'), 'soundtest.html must NOT contain #adminPassInput');
  assert.ok(!soundtestHtml.includes('loginSuperAdmin'), 'soundtest.html must NOT contain loginSuperAdmin function');
  assert.ok(!soundtestHtml.includes('logoutSuperAdmin'), 'soundtest.html must NOT contain logoutSuperAdmin function');
  assert.ok(!soundtestHtml.includes('applyAdminMode'), 'soundtest.html must NOT contain applyAdminMode function');

  // 3. Sensitive admin credentials must NOT be leaked in client JS
  assert.ok(!soundtestHtml.includes("SUPER_ADMIN_PASSWORD = 'SOUNDTEST.PRO@2026'"), 'Must NOT contain hardcoded admin password in client JS');
  assert.ok(!soundtestHtml.includes('SOUNDTEST.PRO@2026'), 'Must NOT contain plaintext super admin password in client HTML');

  // 4. Operational cards moved to admin portal must not exist in soundtest.html
  assert.ok(!soundtestHtml.includes('id="releaseChecklistCard"'), 'soundtest.html must NOT contain release checklist card');
  assert.ok(!soundtestHtml.includes('id="releaseAuditCard"'), 'soundtest.html must NOT contain release audit card');
  assert.ok(!soundtestHtml.includes('id="commercialMetricsCard"'), 'soundtest.html must NOT contain commercial metrics card');
  assert.ok(!soundtestHtml.includes('id="policyCenterCard"'), 'soundtest.html must NOT contain policy center card');

  // 5. Redundant settings deduplication: Language picker removed from settings panel
  assert.ok(!soundtestHtml.includes('id="languageLabel"'), 'soundtest.html must remove duplicate languageLabel from settings panel');
  assert.ok(!soundtestHtml.includes('id="settingsLangPickerMount"'), 'soundtest.html must remove duplicate settingsLangPickerMount');
  assert.ok(soundtestHtml.includes('id="headerLanguageSelect"'), 'soundtest.html must keep primary headerLanguageSelect in header');

  // 6. Inherits Super Admin defaults from storage key
  assert.ok(soundtestHtml.includes('sf_admin_meter_defaults_v1'), 'soundtest.html must reference sf_admin_meter_defaults_v1 for initial defaults');
  assert.ok(soundtestHtml.includes('getAdminMeterDefaults'), 'soundtest.html must provide getAdminMeterDefaults fallback');
});

test('Backend Admin (admin.html): Houses Super Admin Meter Defaults Console and operations', () => {
  const adminHtml = fs.readFileSync(path.join(rootDir, 'admin.html'), 'utf-8');

  // 1. Sidebar tab & view
  assert.ok(adminHtml.includes('data-tab="meter-config"'), 'admin.html sidebar must contain meter-config tab');
  assert.ok(adminHtml.includes('id="viewmeter-config"'), 'admin.html must contain #viewmeter-config view container');

  // 2. Initial Meter Baseline controls
  assert.ok(adminHtml.includes('id="cfgWeighting"'), 'admin.html must contain frequency weighting control');
  assert.ok(adminHtml.includes('id="cfgTimeWeight"'), 'admin.html must contain time weighting control');
  assert.ok(adminHtml.includes('id="cfgCalOffset"'), 'admin.html must contain calibration offset control');
  assert.ok(adminHtml.includes('id="cfgAlertTh"'), 'admin.html must contain alarm threshold control');
  assert.ok(adminHtml.includes('id="cfgDayTh"'), 'admin.html must contain day limit control');
  assert.ok(adminHtml.includes('id="cfgNightTh"'), 'admin.html must contain night limit control');
  assert.ok(adminHtml.includes('id="cfgDefaultLang"'), 'admin.html must contain default language control');
  assert.ok(adminHtml.includes('id="cfgAutoRecMinSec"'), 'admin.html must contain auto-record min duration control');

  // 3. Storage and action methods
  assert.ok(adminHtml.includes('sf_admin_meter_defaults_v1'), 'admin.html must store defaults under sf_admin_meter_defaults_v1');
  assert.ok(adminHtml.includes('saveAdminMeterDefaults'), 'admin.html must provide saveAdminMeterDefaults');
  assert.ok(adminHtml.includes('resetAdminMeterDefaults'), 'admin.html must provide resetAdminMeterDefaults');
  assert.ok(adminHtml.includes('exportAdminMeterDefaultsJson'), 'admin.html must provide exportAdminMeterDefaultsJson');
});
