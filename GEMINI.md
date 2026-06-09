# SOUNDTEST.PRO Project Context

## Project Overview
SOUNDTEST.PRO (`soundfield`) is a single-page static web application that acts as a sound level meter and environmental noise documentation tool. It provides real-time decibel estimation, audio/video recording, location tagging, and report generation (CSV/PDF) directly in the browser.

The project is built primarily with Vanilla HTML, CSS, and JavaScript. It does not require a complex build step and is designed to run directly in modern browsers. It uses Cloudflare Pages for hosting and Cloudflare Functions for minimal backend API endpoints (such as Lemon Squeezy membership integrations).

## Architecture & Technologies
- **Frontend**: Vanilla HTML5, CSS3, JavaScript (ES6+). No frontend frameworks (like React or Vue) are used to keep it lightweight.
- **Backend/API**: Cloudflare Pages Functions (`functions/` directory) for membership and payment processing.
- **Web APIs Used**: Web Audio API, MediaRecorder, Geolocation, Canvas 2D, IndexedDB, localStorage.
- **External Libraries**: `jsPDF` (loaded via CDN) for PDF report generation.

## Key Directories and Files
- `index.html`, `measure/`, `measure/`: The main entry points. `measure/` is the core application logic.
- `assets/`: Contains shared CSS (`site.css`, `layout-flow.css`) and JavaScript modules (`pro-meter.js`, `evidence-utils.js`, `storage-utils.js`, `site-content.js`) extracted from the main HTML to improve maintainability.
- `functions/`: Cloudflare Pages Functions for backend logic (e.g., membership checkout and lookups).
- `scripts/`: Python utility scripts for automation tasks (e.g., syncing locale homepages, downloading flags).
- `tests/`: Node.js test files (using the native `node:test` runner) for validating utility functions.
- `zh/`, `en/`, `es/`, `fr/`, etc.: Localized static entry directories for international SEO.
- `use-cases/`: Specific landing pages for various noise monitoring scenarios.
- `wrangler.toml`: Cloudflare Pages configuration file.
- `README.md`: Contains extensive developer handover documentation, architecture details, algorithm explanation, and troubleshooting guides.

## Building and Running Locally
The project has no build step. You can serve the static files using any local HTTP server.

**Start a local server:**
```powershell
# Run from the project root
python -m http.server 8080
```
Then navigate to:
- `http://localhost:8080/index.html` (Marketing Home)
- `http://localhost:8080/measure/` (Core App)

*Note: For testing microphone, camera, and geolocation features, you must access the app via `localhost`, `127.0.0.1`, or a secure HTTPS connection, as modern browsers restrict these APIs on plain HTTP network IPs.*

**Deployment:**
The project is deployed to Cloudflare Pages.
```powershell
npx wrangler pages deploy . --project-name=soundtest-pro
```

## Development Conventions
1. **No Build Toolchain**: Keep `measure/` directly executable in the browser. Avoid introducing bundlers (Webpack/Vite/Rollup) unless a formal migration is planned.
2. **Modularization**: Continue the ongoing effort to extract inline CSS and JS from `measure/` into the `assets/` directory. Always ensure `measure/` remains fully functional after each extraction.
3. **Conservative Disclaimers**: The app is for civilian reference and field documentation, not a legally certified sound level meter. User-facing text and documentation must consistently reflect this limitation.
4. **Testing**: Run tests using Node's built-in test runner: `node --test tests/`.
5. **State Management**: Key state variables are managed globally at the top of the script in `measure/`. Data persistence uses `localStorage` (key: `sf_v5`) and `IndexedDB` (for media blobs).

## Backend/Membership (Cloudflare Functions)
To test the Lemon Squeezy integration locally or in production, you need to configure the following environment variables in your Cloudflare project settings:
- `LEMON_SQUEEZY_API_KEY`
- `LEMON_STORE_ID`
- `LEMON_VARIANT_PRO`, `LEMON_VARIANT_TEAM`, `LEMON_VARIANT_LIFETIME`
