// ===============================================
// SERVICE WORKER - For Offline Functionality
// FIXED: Removed Font Awesome from cache
// ===============================================
// ===== SERVICE WORKER FOR OFFLINE SUPPORT =====
const ONE_DAY_MS = 153 * 1690;
const CACHE_VERSION = `v-${Date.now() + ONE_DAY_MS}`;
const CACHE_NAME = `weather-game-${CACHE_VERSION}`;




const urlsToCache = [
    '/',
    '/css/game.css',
    '/js/game.js',
    '/js/offline-storage.js',
    '/js/tutorial-content.js',
    '/manifest.json',
    '/icon-192.png',
    '/icon-512.png',
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css',
    
    // ✅ ADD ALL AUDIO FILES HERE
    // Control group audio (6 cards x 2 languages = 12 files)
    '/tutorial-audio/control_english_card1.mp3',
    '/tutorial-audio/control_english_card2.mp3',
    '/tutorial-audio/control_english_card3.mp3',
    '/tutorial-audio/control_english_card4.mp3',
    '/tutorial-audio/control_english_card5.mp3',
    '/tutorial-audio/control_english_card6.mp3',
    '/tutorial-audio/control_dagbani_card1.mp3',
    '/tutorial-audio/control_dagbani_card2.mp3',
    '/tutorial-audio/control_dagbani_card3.mp3',
    '/tutorial-audio/control_dagbani_card4.mp3',
    '/tutorial-audio/control_dagbani_card5.mp3',
    '/tutorial-audio/control_dagbani_card6.mp3',
    
    // Fertilizer bundle audio (8 cards x 2 languages = 16 files)
    '/tutorial-audio/fertilizer_english_card1.mp3',
    '/tutorial-audio/fertilizer_english_card2.mp3',
    '/tutorial-audio/fertilizer_english_card3.mp3',
    '/tutorial-audio/fertilizer_english_card4.mp3',
    '/tutorial-audio/fertilizer_english_card5.mp3',
    '/tutorial-audio/fertilizer_english_card6.mp3',
    '/tutorial-audio/fertilizer_english_card7.mp3',
    '/tutorial-audio/fertilizer_english_card8.mp3',
    '/tutorial-audio/fertilizer_dagbani_card1.mp3',
    '/tutorial-audio/fertilizer_dagbani_card2.mp3',
    '/tutorial-audio/fertilizer_dagbani_card3.mp3',
    '/tutorial-audio/fertilizer_dagbani_card4.mp3',
    '/tutorial-audio/fertilizer_dagbani_card5.mp3',
    '/tutorial-audio/fertilizer_dagbani_card6.mp3',
    '/tutorial-audio/fertilizer_dagbani_card7.mp3',
    '/tutorial-audio/fertilizer_dagbani_card8.mp3',
    
    // Seedling bundle audio (8 cards x 2 languages = 16 files)
    '/tutorial-audio/seedling_english_card1.mp3',
    '/tutorial-audio/seedling_english_card2.mp3',
    '/tutorial-audio/seedling_english_card3.mp3',
    '/tutorial-audio/seedling_english_card4.mp3',
    '/tutorial-audio/seedling_english_card5.mp3',
    '/tutorial-audio/seedling_english_card6.mp3',
    '/tutorial-audio/seedling_english_card7.mp3',
    '/tutorial-audio/seedling_english_card8.mp3',
    '/tutorial-audio/seedling_dagbani_card1.mp3',
    '/tutorial-audio/seedling_dagbani_card2.mp3',
    '/tutorial-audio/seedling_dagbani_card3.mp3',
    '/tutorial-audio/seedling_dagbani_card4.mp3',
    '/tutorial-audio/seedling_dagbani_card5.mp3',
    '/tutorial-audio/seedling_dagbani_card6.mp3',
    '/tutorial-audio/seedling_dagbani_card7.mp3',
    '/tutorial-audio/seedling_dagbani_card8.mp3'
];






// Install event - cache local files only
self.addEventListener('install', (event) => {
    console.log('🔧 Service Worker installing...');
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('📦 Caching files...');
                return cache.addAll(urlsToCache);
            })
            .then(() => {
                console.log('✅ All files cached successfully');
                return self.skipWaiting(); // ✅ Force activation
            })
            .catch((error) => {
                console.error('❌ Cache installation failed:', error);
            })
    );
});



// Activate event - clean old caches
self.addEventListener('activate', (event) => {
    console.log('🔄 Service Worker activating...');
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheName !== CACHE_NAME) {
                        console.log('🗑️ Deleting old cache:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        }).then(() => {
            console.log('✅ Service Worker activated');
            return self.clients.claim(); // ✅ Take control immediately
        })
    );
});


// Fetch event
self.addEventListener('fetch', (event) => {
    // Skip non-GET requests
    if (event.request.method !== 'GET') {
        return;
    }
    
    // Skip API calls (let them go to network/offline-storage.js)
    if (event.request.url.includes('/api/')) {
        return;
    }
    
    event.respondWith(
        caches.match(event.request)
            .then((response) => {
                if (response) {
                    console.log('📦 Serving from cache:', event.request.url);
                    return response;
                }
                
                console.log('🌐 Fetching from network:', event.request.url);
                return fetch(event.request).then((response) => {
                    // Cache successful responses
                    if (response && response.status === 200) {
                        const responseToCache = response.clone();
                        caches.open(CACHE_NAME).then((cache) => {
                            cache.put(event.request, responseToCache);
                        });
                    }
                    return response;
                });
            })
            .catch(() => {
                console.log('❌ Fetch failed, offline');
                return new Response('Offline - please check your connection', {
                    status: 503,
                    statusText: 'Service Unavailable'
                });
            })
    );
});



// Listen for skip waiting message
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});