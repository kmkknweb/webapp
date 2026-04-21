self.addEventListener('install', event => {
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(self.clients.claim());
});

const CACHE_NAME = 'agong-app-v1';
const ASSETS = [
  './',
  './index.html',
  './install.html',
  './manifest.json',
  './agong.png'
];

self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;
  event.respondWith(
    caches.open(CACHE_NAME).then(cache =>
      cache.match(event.request).then(cached => {
        return cached || fetch(event.request).then(response => {
          try { cache.put(event.request, response.clone()); } catch (e) {}
          return response;
        });
      })
    )
  );
});
