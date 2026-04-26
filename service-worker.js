const CACHE_NAME = 'agong-app-v9';

const URLS_TO_CACHE = [
  '/',
  '/index.html',
  '/activity.html',
  '/agong.png',
  '/manifest.json',
  '/notice.json'
];

self.addEventListener('install', event => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(URLS_TO_CACHE))
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.map(key => {
        if (key !== CACHE_NAME) return caches.delete(key);
      }))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;

  const url = new URL(event.request.url);

  // index.html และ activity.html โหลดใหม่จาก network ก่อนเสมอ
  if (url.pathname === '/' ||
      url.pathname.endsWith('index.html') ||
      url.pathname.endsWith('activity.html')) {
    event.respondWith(
      fetch(event.request)
        .then(res => {
          const copy = res.clone();
          caches.open(CACHE_NAME).then(c => c.put(event.request, copy));
          return res;
        })
        .catch(() => caches.match(event.request))
    );
    return;
  }

  // ไฟล์อื่น cache-first
  event.respondWith(
    caches.match(event.request).then(res => {
      return res || fetch(event.request).then(fetchRes => {
        const copy = fetchRes.clone();
        caches.open(CACHE_NAME).then(c => c.put(event.request, copy));
        return fetchRes;
      });
    })
  );
});






self.addEventListener('push', function(event) {
  let data = {};

  try {
    data = event.data.json();
  } catch (e) {
    data = {
      title: 'แจ้งเตือน',
      body: event.data.text()
    };
  }




  
  self.registration.showNotification(data.title || 'แจ้งเตือน', {
    body: data.body || '',
    icon: '/agong.png',
    data: {
      url: data.url || '/'
    }
  });
});


self.addEventListener('notificationclick', function(event) {
  event.notification.close();

  event.waitUntil(
    clients.matchAll({ type: 'window' }).then(clientList => {
      for (const client of clientList) {
        if (client.url === event.notification.data.url && 'focus' in client) {
          return client.focus();
        }
      }
      return clients.openWindow(event.notification.data.url);
    })
  );
});
