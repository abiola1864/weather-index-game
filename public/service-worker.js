// ===============================================
// SERVICE WORKER - For Offline Functionality
// FIXED: Removed Font Awesome from cache
// ===============================================
const CACHE_NAME = 'weather-game-v7'; // Change from v5 to v6
const urlsToCache = [
  '/',
  '/index.html',
  '/css/game.css',
  '/js/game.js',
  '/js/tutorial-content.js',
  '/js/offline-storage.js',
  '/manifest.json',
  '/icon-192.png'
  // ✅ REMOVED Font Awesome - it loads from CDN when online
];

// Install event - cache local files only
self.addEventListener('install', (event) => {
  console.log('🔧 Service Worker: Installing v1.0.2...');
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('📦 Service Worker: Caching local files...');
        return cache.addAll(urlsToCache);
      })
      .then(() => {
        console.log('✅ Service Worker: All files cached');
        return self.skipWaiting();
      })
      .catch((error) => {
        console.error('❌ Service Worker: Cache failed:', error);
      })
  );
});

// Activate event - clean old caches
self.addEventListener('activate', (event) => {
  console.log('🟢 Service Worker: Activating...');
  
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('🗑️  Service Worker: Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      console.log('✅ Service Worker: Activated');
      return self.clients.claim();
    })
  );
});

// Fetch event
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);
  
  // Skip API calls
  if (url.pathname.startsWith('/api/')) {
    return;
  }
  
  // Let external resources (like Font Awesome) load from network
  if (url.origin !== location.origin) {
    return; // Don't intercept external requests
  }
  
  // Cache first for local files
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        if (response) {
          console.log('📦 Serving from cache:', event.request.url);
          return response;
        }
        
        console.log('🌐 Fetching from network:', event.request.url);
        return fetch(event.request).then((response) => {
          if (!response || response.status !== 200) {
            return response;
          }
          
          const responseToCache = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
          
          return response;
        });
      })
      .catch(() => caches.match('/index.html'))
  );
});

// Listen for skip waiting message
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});