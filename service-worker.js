const CACHE_NAME = 'agong-app-v13';

const URLS_TO_CACHE = [
  './',
  './index.html',
  './activity.html',
  './notify.html',
  './agong.png',
  './manifest.json'
];

self.addEventListener('install', event => {
  self.skipWaiting();

  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(URLS_TO_CACHE);
    })
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(keys => {
        return Promise.all(
          keys.map(key => {
            if (key !== CACHE_NAME) {
              return caches.delete(key);
            }
          })
        );
      })
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;

  const url = new URL(event.request.url);

  if (
    url.pathname.endsWith('/webapp/') ||
    url.pathname.endsWith('/webapp/index.html') ||
    url.pathname.endsWith('/webapp/activity.html') ||
    url.pathname.endsWith('/webapp/notify.html')
  ) {
    event.respondWith(
      fetch(event.request)
        .then(res => {
          const copy = res.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, copy));
          return res;
        })
        .catch(() => caches.match(event.request))
    );
    return;
  }

  event.respondWith(
    caches.match(event.request).then(res => {
      return res || fetch(event.request).then(fetchRes => {
        const copy = fetchRes.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(event.request, copy));
        return fetchRes;
      });
    })
  );
});

self.addEventListener('push', event => {
  let data = {};

  try {
    data = event.data ? event.data.json() : {};
  } catch (e) {
    data = {
      title: 'แจ้งเตือนจากศาลเจ้า',
      body: event.data ? event.data.text() : ''
    };
  }

  const title = data.title || 'แจ้งเตือนจากศาลเจ้า';

  const options = {
    body: data.body || '',
    icon: './agong.png',
    badge: './agong.png',
    data: {
      url: data.url || './index.html'
    }
  };

  event.waitUntil(
    self.registration.showNotification(title, options)
  );
});

self.addEventListener('notificationclick', event => {
  event.notification.close();

  const targetUrl = event.notification.data?.url || './index.html';

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true })
      .then(clientList => {
        for (const client of clientList) {
          if ('focus' in client) {
            client.navigate(targetUrl);
            return client.focus();
          }
        }

        if (clients.openWindow) {
          return clients.openWindow(targetUrl);
        }
      })
  );
});
self.addEventListener('push', event => {
  let data = {};

  try {
    data = event.data.json();
  } catch {
    data = { title: 'แจ้งเตือน', body: 'มีข้อความใหม่' };
  }

  event.waitUntil(
    self.registration.showNotification(data.title || 'แจ้งเตือน', {
      body: data.body || '',
      icon: './agong.png'
    })
  );
});
