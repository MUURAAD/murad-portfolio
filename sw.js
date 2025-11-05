const CACHE_NAME = 'murad-portfolio-v1';
// List the main static assets to pre-cache
const urlsToCache = [
  '/',
  '/index.html',
  '/athletic.html',
  '/storytelling.html',
  '/projects.html',
  '/achievements.html',
  '/about.html',
  '/images/logo.png',
  '/images/profile.jpg',
  'https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css',
  'https://cdnjs.cloudflare.com/ajax/libs/bootstrap-icons/1.8.1/font/bootstrap-icons.min.css',
  'https://code.jquery.com/jquery-3.5.1.slim.min.js',
  'https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/js/bootstrap.bundle.min.js'
];

// Install event: cache all listed assets
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      console.log('Service Worker: Caching static assets.');
      return cache.addAll(urlsToCache);
    }).catch(error => {
      console.error('Service Worker: Failed to cache resources', error);
    })
  );
});

// Activate event: clean up old caches
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            console.log('Service Worker: Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Fetch event: serve assets from cache, falling back to network
self.addEventListener('fetch', event => {
  // We only intercept GET requests
  if (event.request.method !== 'GET') {
    return;
  }
  
  event.respondWith(
    caches.match(event.request).then(response => {
      // Cache hit - return response
      if (response) {
        return response;
      }
      // Cache miss - fetch from network
      return fetch(event.request);
    }).catch(error => {
        // Fallback for failed network requests
        console.error('Service Worker: Fetch failed', error);
        // You can return an offline page here if necessary
        return new Response('Network error: Could not fetch resource.');
    })
  );
});