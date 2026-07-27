const cacheName = 'diabeto-v4';
const assets = [
  './',
  './index.html',
  './manifest.json',
  './icon-192.png',
  './icon-512.png'
];

self.addEventListener('install', evt => {
  evt.waitUntil(
    caches.open(cacheName).then(cache => {
      cache.addAll(assets);
    })
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(keys.filter(key => key !== cacheName).map(key => caches.delete(key))))
  );
});

self.addEventListener('fetch', evt => {
  if (evt.request.method !== 'GET' || new URL(evt.request.url).origin !== self.location.origin) return;
  evt.respondWith(
    caches.match(evt.request).then(cacheRes => {
      return cacheRes || fetch(evt.request).then(response => {
        const copy = response.clone();
        caches.open(cacheName).then(cache => cache.put(evt.request, copy));
        return response;
      });
    })
  );
});
