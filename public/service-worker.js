const CACHE_NAME = 'qeducation-cache';
const urlsToCache = ['/', '/index.html'];

self.addEventListener('install', evt => {
  evt.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      console.log('opened cache');

      return cache.addAll(urlsToCache);
    }),
  );

  self.skipWaiting();
});

self.addEventListener('fetch', evt => {
  evt.respondWith(
    caches.match(evt.request).then(response => {
      if (response) {
        return response;
      }

      return fetch(evt.request);
    }),
  );
});
