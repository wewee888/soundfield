import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

test('soundtest.html: cap-card zero placeholder, custody GPS refresh, scene template report binding, and Pro location correction watermark', () => {
  const htmlPath = path.resolve('soundtest.html');
  const html = fs.readFileSync(htmlPath, 'utf8');
  const certJs = fs.readFileSync(path.resolve('assets/report-cert-engine.js'), 'utf8');
  const code = html + '\n' + certJs;

  // 1. Cap card zero placeholder gap when collapsed and flexible layout
  assert.match(html, /\.cap-card\.collapsed\s*\{[^}]*display:\s*none\s*!important/, 'cap-card.collapsed must have display: none !important to eliminate empty gap');
  assert.match(html, /\.cap-card\.collapsed\s*\{[^}]*padding:\s*0\s*!important/, 'cap-card.collapsed must have padding 0');
  assert.match(html, /\.cap-card\.collapsed\s*\{[^}]*margin:\s*0\s*!important/, 'cap-card.collapsed must have margin 0');
  assert.match(html, /class="cap-card collapsed"\s+id="capCard"/, 'capCard default class is cap-card collapsed');
  assert.match(html, /onclick="document\.getElementById\('capCard'\)\?\.classList\.add\('collapsed'\)"/, 'capCard must have close/dismiss button');

  // 2. Custody card unified location & refresh GPS button, legacy dock hidden
  assert.match(html, /class="stitch-custody-loc-row"/, 'stitch-custody-loc-row must exist in custody card');
  assert.match(html, /id="custodyRefreshGpsBtn"/, 'custodyRefreshGpsBtn must exist');
  assert.match(html, /id="custodyEditPlaceBtn"/, 'custodyEditPlaceBtn must exist');
  assert.match(html, /\.geo-dock\s*\{\s*display:\s*none\s*!important;\s*\}/, 'legacy geo-dock must be hidden');
  assert.match(html, /#locCard\s*\{\s*display:\s*none\s*!important;\s*\}/, 'raw locCard inputs must be hidden from main screen');

  // 3. Location Correction Modal (PRO Feature)
  assert.match(html, /id="locationCorrectionModal"/, 'locationCorrectionModal must exist');
  assert.match(html, /id="lcmPlaceInput"/, 'lcmPlaceInput must exist');
  assert.match(html, /id="lcmBuildingInput"/, 'lcmBuildingInput must exist');
  assert.match(html, /id="lcmRoomInput"/, 'lcmRoomInput must exist');
  assert.match(html, /id="lcmPointInput"/, 'lcmPointInput must exist');
  assert.match(html, /id="lcmNoteInput"/, 'lcmNoteInput must exist');
  assert.match(html, /function openLocationCorrectionModal\(\)/, 'openLocationCorrectionModal must be defined');
  assert.match(html, /function saveLocationCorrection\(\)/, 'saveLocationCorrection must be defined');
  assert.match(html, /function resetLocationCorrection\(\)/, 'resetLocationCorrection must be defined');
  assert.match(html, /function triggerLocationRefresh\(\)/, 'triggerLocationRefresh must be defined');

  // 4. Auto-refresh GPS on page load
  assert.match(html, /setTimeout\(\(\)=>\{\s*if\(typeof getLoc==='function'\)getLoc\(\);\s*\},400\);/, 'getLoc must be automatically triggered on initial load');

  // 5. Scene template state tracking & binding to report and canvas
  assert.match(html, /let currentSceneId\s*=\s*'general';/, 'currentSceneId must be defined');
  assert.match(html, /currentSceneLabel\s*=/, 'currentSceneLabel must be tracked');
  assert.match(html, /currentSceneNote\s*=/, 'currentSceneNote must be tracked');
  assert.match(html, /function fillSceneChip\(id, evt\)/, 'fillSceneChip must exist');
  assert.match(code, /sceneLabel:\s*activeSceneLabel/, 'buildStatsFromRecord must bind sceneLabel');
  assert.match(code, /sceneNote:\s*activeSceneNote/, 'buildStatsFromRecord must bind sceneNote');
  assert.match(code, /customLoc,/, 'buildStatsFromRecord must bind customLoc');

  // 6. Canvas & Preview reflect scene template and custom location watermark
  assert.match(code, /const sceneTitle = stats\.sceneLabel/, 'buildProCertificateCanvas must include sceneTitle');
  assert.match(code, /const baselinePrefix = stats\.sceneLabel \? `\$\{stats\.sceneLabel\} · ` : '';/, 'buildProCertificateCanvas must prefix baseline metric with sceneLabel');
  assert.match(code, /cLoc\.point/, 'buildProCertificateCanvas must format custom measurement point watermark');

  // 7. Settings drawer includes watermark entry
  assert.match(html, /id="settingsLcmBtn"/, 'Settings must include configure watermark button');
});
