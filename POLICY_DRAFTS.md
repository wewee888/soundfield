# SOUNDTEST.PRO Stage 1 Policy Drafts

These drafts are for the Stage 1 Web/PWA public beta. They are product and engineering drafts, not legal advice. Before a paid launch, app store submission, or cloud account release, review them with counsel and adapt them to the target jurisdictions.

## Stage 1 Privacy Policy Draft

SOUNDTEST.PRO helps users record environmental noise conditions with live sound level estimates, acoustic evidence photos, audio/video clips, location labels, notes, and PDF/CSV exports.

Data handled by the Web/PWA beta:

1. Microphone access is used to calculate sound level estimates in the browser. Audio is not saved unless the user actively starts an audio or video recording.
2. Camera access is used only when the user opens preview, captures an evidence photo, or records video.
3. Location access is used for GPS coordinates, place labels, map links, and report metadata. If place lookup is enabled, coordinates may be sent to the selected map or reverse-geocoding provider.
4. Evidence records, settings, and media files are stored locally in the user's browser through localStorage and IndexedDB. Clearing browser data may delete these records.
5. CSV, PDF, image, audio, and video exports are created only when the user chooses to export or save them.
6. The Stage 1 Web/PWA beta does not provide cloud backup, account sync, team sharing, or server-side evidence retention.

Users can delete local records in the app settings. They can also clear the browser's site data to remove remaining local storage. Future account or cloud versions must add account deletion, cloud export, cloud deletion, retention period, and support contact flows.

## User Agreement Draft

SOUNDTEST.PRO is an environmental documentation and evidence organization tool. It is not a certified sound level meter and does not replace formal measurement by a verified professional device.

Users are responsible for:

1. Complying with local laws about audio recording, video recording, location sharing, privacy, and evidence use.
2. Avoiding public sharing of faces, private spaces, exact residential locations, or other sensitive information unless they have the right to do so.
3. Verifying formal noise disputes, regulatory reports, and legal claims with a certified sound level meter or qualified professional.
4. Saving important audio/video evidence to their own device promptly, because browser storage can be cleared by the system, the browser, privacy mode, or the user.
5. Understanding that device microphone hardware, browser processing, operating system audio treatment, and calibration settings may affect readings.

## Measurement Disclaimer Draft

For environmental documentation and evidence support only. Formal measurements should be verified with a certified sound level meter.

Suggested Chinese wording:

环境记录与证据辅助，正式检测请以经检定声级计复核为准。

Do not use claims such as "law enforcement grade", "certified metrology device", "court-admissible measurement", or "IEC 61672 Class 1/Class 2 compliant" unless future hardware, calibration, lab validation, and legal review support those claims.

## Recording Consent Reminder

Before recording audio or video, remind users that recording laws vary by country, region, and scenario. Users should obtain consent when required, avoid recording unrelated people when possible, and avoid exposing private locations or personal information in public reports.

Suggested app copy:

Recording may capture voices, people, private spaces, and precise locations. Please follow local laws and get consent when required.

## Beta Testing Notice

The Stage 1 Web/PWA beta is intended to validate product usefulness and device compatibility. Known beta limitations:

1. It requires HTTPS, localhost, or 127.0.0.1 for reliable microphone, camera, and location permissions.
2. iOS Safari, Android Chrome, WeChat in-app browser, privacy mode, and low-storage devices may handle recording and downloads differently.
3. Media files are stored in the browser first. Users should save important recordings to device storage before closing or clearing the browser.
4. Pro, Team, and Lifetime Offline plans are entitlement prototypes or commercial inquiry surfaces until a backend account and payment system exists.
5. Super admin access in the Stage 1 build is a local prototype and must not be treated as production-grade authorization.

## App Store Readiness Gap

Formal app store submission still requires native or wrapped mobile packaging, platform payment compliance, full privacy labels, support contact, screenshots, permission usage descriptions, test accounts where needed, crash/error monitoring, versioning, and a rollback/support process.
