const CACHE_NAME = 'soundtest-pro-v12';
const NETWORK_FIRST_PATHS = [
  '/assets/lang-flags.js',
  '/assets/i18n-data.js',
  '/assets/site.css',
  '/assets/site-i18n.js',
  '/assets/site-i18n.js?v=6',
  '/assets/site-i18n.js?v=7',
];
const ASSETS_TO_CACHE = [
  '/',
  '/soundtest.html',
  '/assets/soundtest.css',
  '/assets/layout-flow.css',
  '/camera.html',
  '/assets/camera.css',
  '/assets/camera.js',
  '/assets/site.css',
  '/assets/utils.js',
  '/assets/i18n-data.js',
  '/assets/site-experience.js',
  '/assets/site-content.js',
  '/assets/site-auth.js',
  '/assets/auth.css',
  '/assets/lang-flags.js',
  '/assets/pro-meter.js',
  '/assets/evidence-utils.js',
  '/assets/storage-utils.js',
  '/assets/jspdf.umd.min.js',
  '/assets/icon.svg',
  '/assets/echo-mascot.webp',
  '/assets/echo-mascot.png',
  '/assets/echo-mascot-removebg-preview.png',
  '/manifest.webmanifest'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS_TO_CACHE))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) =>
      Promise.all(
        cacheNames.map((name) => {
          if (name !== CACHE_NAME) return caches.delete(name);
          return null;
        })
      )
    ).then(() => {
      // Clean up any stale API responses that might have slipped into the cache
      return caches.open(CACHE_NAME).then((cache) => {
        return cache.keys().then((requests) => {
          return Promise.all(
            requests
              .filter((req) => req.url.includes('/api/') || req.url.includes('/admin'))
              .map((req) => cache.delete(req))
          );
        });
      });
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  const url = new URL(event.request.url);

  // 1. NEVER intercept or cache backend API, functions, admin console, or cache-busted requests
  if (
    url.pathname.startsWith('/api/') ||
    url.pathname.startsWith('/functions/') ||
    url.pathname === '/admin' ||
    url.pathname === '/admin.html' ||
    url.pathname.startsWith('/admin/') ||
    url.searchParams.has('_t') ||
    url.searchParams.has('nocache')
  ) {
    return; // Pass through directly to browser network stack
  }

  // 2. Never cache JSON API responses
  const acceptHeader = event.request.headers.get('accept') || '';
  if (acceptHeader.includes('application/json')) {
    return;
  }

  if (event.request.mode === 'navigate' || NETWORK_FIRST_PATHS.includes(url.pathname)) {
    event.respondWith(
      fetch(event.request).catch(() => caches.match(event.request))
    );
    return;
  }
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) return cachedResponse;
      return fetch(event.request).then((networkResponse) => {
        return caches.open(CACHE_NAME).then((cache) => {
          if (event.request.url.startsWith(self.location.origin)) {
            cache.put(event.request, networkResponse.clone());
          }
          return networkResponse;
        });
      });
    }).catch(() => {
      // Offline fallback could be added here if needed
    })
  );
});