const CACHE_NAME = 'soundtest-pro-v4';
const ASSETS_TO_CACHE = [
  '/',
  '/assets/site.css',
  '/assets/utils.js',
  '/assets/i18n-data.js',
  '/assets/site-i18n.js',
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
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((name) => {
          if (name !== CACHE_NAME) {
            return caches.delete(name);
          }
        })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
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