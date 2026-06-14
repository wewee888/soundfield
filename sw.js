const CACHE_NAME = 'soundtest-pro-v7';
const NETWORK_FIRST_PATHS = [
  '/assets/site-i18n.js',
  '/assets/site-i18n.js?v=6',
  '/assets/site-i18n.js?v=7',
];
const ASSETS_TO_CACHE = [
  '/',
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
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  const url = new URL(event.request.url);
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