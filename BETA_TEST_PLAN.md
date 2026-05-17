# SOUNDTEST.PRO Stage 1 Smoke Test Matrix

This plan is for the Stage 1 Web/PWA public beta. It verifies that the core local evidence flow works before sharing the HTTPS build with outside testers.

## Test Entry Conditions

1. The app is opened from HTTPS, `localhost`, or `127.0.0.1`.
2. Browser site data is cleared before the first permission test.
3. The tester has at least one quiet indoor space and one louder environment for basic reading changes.
4. The tester can save files on the device and confirm downloads.

## Stage 1 Smoke Test Matrix

| Device / browser | Must test | Expected result |
| --- | --- | --- |
| iPhone Safari | First permission guide, microphone monitoring, photo mode, watermarked video mode, save media, PDF export | Core monitoring works; saved video either contains burned-in dB/location watermarks or the browser limit is documented. |
| Android Chrome | First permission guide, microphone monitoring, photo mode, watermarked video mode, save media, CSV/PDF export | Core monitoring, watermarked recording, and downloads work from HTTPS. |
| WeChat in-app browser | Open app, start monitoring, permission fallback, copy/open link guidance | If permissions fail, the app clearly tells users to open in the system browser. |
| Windows Edge | Monitoring, audio recording, watermarked video recording if webcam exists, File System Access save path, PDF/CSV export | Desktop evidence flow works and saved video contains burned-in watermarks. |
| macOS Safari | Monitoring, camera preview, watermarked recording support, export PDF/CSV | Safari limitations are visible and do not block basic monitoring. |
| macOS Chrome | Full evidence flow, PWA install prompt, watermarked media save, map/location fallback | Reference desktop browser passes the complete flow. |

## Core Test Script

Run this script once per device/browser combination:

1. Open the HTTPS test URL in a clean browser session.
2. Confirm the permission guide explains microphone, camera, location, local storage, and legal boundaries.
3. Start monitoring and confirm the dB value changes when the environment changes.
4. Switch between A/C/Z weighting and Fast/Slow response.
5. Capture one evidence photo with dB, time, GPS/address if available, AVG/PEAK/MIN, LAeq, and device/calibration text.
6. Record one audio clip and save it from the Records page.
7. Record one short video clip and save it from the Records page.
8. Open the saved video file outside the app and confirm the video itself contains burned-in dB, LAeq, AVG/PEAK/MIN, time, place/GPS, calibration, and disclaimer text.
9. Deny camera or location once and confirm monitoring still works with a clear degraded-state message.
10. Fill building/floor/room/point details and confirm the saved record shows them.
11. Export CSV, PDF, and the JSON evidence manifest; confirm the evidence ID and hashes appear.
12. Configure a short long-run task, mark one manual noise event, and trigger or simulate one impulse/peak event.
13. Delete local records and confirm the Records page returns to an empty state.

## Pass Criteria

The Stage 1 beta can be shared with outside testers when:

1. iPhone Safari and Android Chrome both pass monitoring, evidence photo, at least one recording path, watermarked saved-video verification, and PDF/CSV export.
2. At least one desktop browser passes the full audio/video/photo/export flow with burned-in video watermarks.
3. WeChat or any blocked in-app browser shows an understandable fallback message.
4. Permission denial states do not leave the app stuck or blank.
5. The app never claims certified legal metrology and every report/export keeps the measurement disclaimer.
6. Media saving failures tell users what happened and how to try another save path.

## Watermarked Video Burn-In Check

A video test only passes after opening the saved file from the device download location or file picker. Do not count the in-app live preview overlay as proof. The saved video frame must visibly include:

1. Current dB value and dBA/dBC/dBZ response label.
2. LAeq, AVG, PEAK, MIN, and expanded Ln statistics where available.
3. Time, place or fallback place text, GPS or not-acquired state.
4. Device/calibration summary.
5. The measurement disclaimer.

## App Store Readiness Checks

Before any iOS or Android store submission, additionally verify the checklist in `APP_STORE_READINESS.md`:

1. Store billing uses Apple IAP or Google Play Billing, not front-end simulated plans.
2. Background recording behavior is tested on real devices, including lock screen and low-storage cases.
3. The app includes public privacy policy, user agreement, deletion/export instructions, and review demo material.
4. Local hashes are described as integrity checks only; authoritative timestamps require backend signing.

## Known Browser Limits

1. `file://` is not a valid public test path because microphone, camera, and location permissions are inconsistent.
2. Plain HTTP LAN IP addresses can block microphone access on mobile browsers.
3. iOS Safari and in-app browsers may limit `MediaRecorder`, downloads, background operation, and Blob persistence.
4. Browser storage can be cleared by the user, private mode, storage pressure, or system cleanup.
5. PWA install behavior differs by platform and does not imply app store readiness.

## Test Result Template

```text
Device:
Browser:
URL:
Date:
Tester:

Monitoring: PASS / FAIL
Photo evidence: PASS / FAIL
Audio recording save: PASS / FAIL
Video recording save: PASS / FAIL
Saved video burn-in watermark: PASS / FAIL
Location/place: PASS / FAIL / NOT AVAILABLE
CSV export: PASS / FAIL
PDF export: PASS / FAIL
Permission denial fallback: PASS / FAIL
Media save notes:
Known limitation:
Release blocker:
```
