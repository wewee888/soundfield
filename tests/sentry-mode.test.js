import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

test('Sentry Surveillance Workstation & HUD Console integration in soundtest.html', () => {
  const html = fs.readFileSync(path.join(__dirname, '..', 'soundtest.html'), 'utf8');

  // 1. Verify HTML DOM elements
  assert.ok(html.includes('id="sentryWorkstationPanel"'), 'sentryWorkstationPanel exists');
  assert.ok(html.includes('class="sentry-pipeline-banner"'), '4-step pipeline banner exists');
  assert.ok(html.includes('id="pipeStep1"'), 'Pipeline Step 1 exists');
  assert.ok(html.includes('id="pipeStep2"'), 'Pipeline Step 2 exists');
  assert.ok(html.includes('id="pipeStep3"'), 'Pipeline Step 3 exists');
  assert.ok(html.includes('id="pipeStep4"'), 'Pipeline Step 4 exists');
  assert.ok(html.includes('id="sentryHudCard"'), 'Sentry HUD card exists');
  assert.ok(html.includes('id="sentryLiveDbVal"'), 'Live dB reading element exists');
  assert.ok(html.includes('id="sentryTriggerDbVal"'), 'Trigger threshold element exists');
  assert.ok(html.includes('id="sentryTonightCountVal"'), 'Tonight incidents count element exists');
  assert.ok(html.includes('id="sentryDeltaBar"'), 'Dynamic safety margin delta bar exists');
  assert.ok(html.includes('id="sentryPre45"'), '45 dB Night Bedroom preset button exists');
  assert.ok(html.includes('id="sentryPre50"'), '50 dB Residential preset button exists');
  assert.ok(html.includes('id="sentryPre55"'), '55 dB Roadside preset button exists');
  assert.ok(html.includes('id="sentryCustomThInput"'), 'Custom threshold numeric input exists');
  assert.ok(html.includes('id="sentryMinSecSlider"'), 'Sustained duration slider exists');
  assert.ok(html.includes('id="sentryStopSecSlider"'), 'Silence hold delay slider exists');
  assert.ok(html.includes('id="sentryIncidentsList"'), 'Tonight incidents list container exists');

  // 2. Verify JS functions & logic
  assert.ok(html.includes('setEvidenceMode(\'sentry\')'), 'modeSentryBtn triggers setEvidenceMode("sentry")');
  assert.ok(html.includes('function translateSentryWorkstation'), 'translateSentryWorkstation defined');
  assert.ok(html.includes('function setSentryPresetThreshold'), 'setSentryPresetThreshold defined');
  assert.ok(html.includes('function updateSentrySurveillanceHud'), 'updateSentrySurveillanceHud defined');
  assert.ok(html.includes('function renderSentryIncidentsList'), 'renderSentryIncidentsList defined');
  assert.ok(html.includes('updateSentrySurveillanceHud(inst, isAbove, nowTs)'), 'tick calls updateSentrySurveillanceHud');
  assert.ok(html.includes('isSentry:!!(autoRecOnThreshold||evidenceMode===\'sentry\')'), 'saveRec tags isSentry');
  assert.ok(html.includes('!autoRecOnThreshold && evidenceMode !== \'sentry\''), 'saveRec suppresses intrusive report modal during overnight sentry mode');
});

test('Sentry mode CSS classes exist in assets/soundtest.css', () => {
  const css = fs.readFileSync(path.join(__dirname, '..', 'assets', 'soundtest.css'), 'utf8');
  assert.ok(css.includes('.sentry-workstation-panel'), '.sentry-workstation-panel class styled');
  assert.ok(css.includes('.sentry-pipeline-banner'), '.sentry-pipeline-banner class styled');
  assert.ok(css.includes('.sentry-hud-card'), '.sentry-hud-card class styled');
  assert.ok(css.includes('.sentry-led-dot'), '.sentry-led-dot class styled');
  assert.ok(css.includes('.sentry-preset-btn'), '.sentry-preset-btn class styled');
  assert.ok(css.includes('.sentry-incidents-list'), '.sentry-incidents-list class styled');
});
