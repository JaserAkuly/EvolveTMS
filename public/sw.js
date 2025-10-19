const CACHE_NAME = 'evolve-tms-v1';
const urlsToCache = [
  '/',
  '/dashboard',
];

self.addEventListener('install', event => {
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      return self.clients.claim();
    })
  );
});

self.addEventListener('fetch', event => {
  // Network first strategy for API calls
  if (event.request.url.includes('/api/') || event.request.url.includes('supabase')) {
    event.respondWith(
      fetch(event.request)
        .then(response => {
          return response;
        })
        .catch(() => {
          return caches.match(event.request);
        })
    );
  } else {
    // Cache first strategy for static assets
    event.respondWith(
      caches.match(event.request)
        .then(response => {
          if (response) {
            // Update cache in background
            fetch(event.request).then(fetchResponse => {
              caches.open(CACHE_NAME).then(cache => {
                cache.put(event.request, fetchResponse.clone());
              });
            });
            return response;
          }
          return fetch(event.request);
        })
    );
  }
});