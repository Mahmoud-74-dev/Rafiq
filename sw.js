const CACHE_NAME = 'rafeeq-cache-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        if (response) {
          return response;
        }
        return fetch(event.request);
      })
  );
});

self.addEventListener('push', (event) => {
  const options = {
    body: event.data ? event.data.text() : 'حان الآن موعد الصلاة',
    icon: '/icon.png',
    badge: '/icon.png',
    dir: 'rtl'
  };

  event.waitUntil(
    self.registration.showNotification('رفيق', options)
  );
});
