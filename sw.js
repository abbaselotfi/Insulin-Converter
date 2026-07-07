const cacheName = 'insulin-pwa-v1';
const assets = [
  '/',
  'index.html',
  'soliqua.html',
  'manifest.json',
  'icon-192.png',
  'icon-512.png'
];

self.addEventListener('install', evt => {
  evt.waitUntil(
    caches.open(cacheName)
      .then(cache => cache.addAll(assets))
      .catch(err => {
        console.error('Service Worker: failed to cache assets during install', err);
        throw err;
      })
  );
});

self.addEventListener('fetch', evt => {
  evt.respondWith(
    caches.match(evt.request)
      .then(cacheRes => cacheRes || fetch(evt.request))
      .catch(err => {
        console.error('Service Worker: fetch failed and no cached response available', evt.request.url, err);
        return Response.error();
      })
  );
});
