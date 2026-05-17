# SOUNDTEST.PRO App Store Readiness Checklist

This checklist tracks what must be true before SOUNDTEST.PRO is submitted as a paid iOS or Android app.

## Current Web/PWA Completion

- Professional metering UI now supports A/C/Z weighting, Fast/Slow response, LAeq, L5/L10/L50/L90/L95, and one-third octave display.
- Evidence records include a unique evidence ID, local SHA-256 hashes, structured measurement point fields, calibration context, and a downloadable JSON evidence manifest.
- Web long-run mode supports task settings, auto-stop, impulse peak detection, and manual noise event marks.
- Scenario report templates cover neighbor noise, renovation construction, elevator machine rooms, retail/KTV, outdoor AC units, factory boundary noise, property coordination, workplace inspection, and legal review aid.

## Backend Required Before Paid Store Release

1. Account system with email login, account deletion, data export, and region/language profile.
2. Entitlements API, for example `GET /api/me/entitlements`, with features controlled by backend state rather than `localStorage`.
3. Payment integrations:
   - Apple In-App Purchase for iOS.
   - Google Play Billing for Google Play.
   - Stripe only for Web or non-store checkout flows.
4. Server-side evidence services:
   - server time receipt,
   - signed metadata hash,
   - cloud media backup,
   - audit log for create/export/delete events.
5. Privacy and data lifecycle APIs:
   - upload consent,
   - cloud delete,
   - export user data,
   - retention policy for Team accounts.

## Native App Required Before Store Claims

1. Background recording feasibility validated per platform.
2. Android foreground service with persistent notification for long recording.
3. iOS background audio mode review with clear in-app recording indicator.
4. Local file and gallery save integration.
5. WAV/FLAC recording path for Pro if marketed as lossless.
6. Crash recovery for segmented recordings and low-storage states.
7. Permission rationale screens for microphone, camera, location, files, and background audio.

## Store Review Material

1. Privacy policy and user agreement hosted on public HTTPS URLs.
2. Screenshot set for monitoring, evidence camera, records, reports, templates, and settings.
3. Demo account and sample evidence records for review.
4. Clear disclaimer: SOUNDTEST.PRO is for field documentation and complaint support, not certified legal metrology.
5. App Review notes explaining why microphone, camera, location, storage, and optional background audio are needed.

## Do Not Claim Until Verified

- Do not claim certified measurement accuracy.
- Do not claim judicial timestamp authority from local hashes alone.
- Do not claim reliable 24-72 hour lock-screen monitoring in Web/PWA.
- Do not sell Pro/Team entitlements in mobile stores without platform billing.
