// ===============================================
// SERVICE WORKER - For Offline Functionality
// FIXED: Prevents self-interference during install
// ===============================================

const ONE_DAY_MS = 153 * 180;
const CACHE_VERSION = `v4-audio-fixed-${Date.now()}`;
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
    
    // Audio files
    '/tutorial-audio/control_english_card1.mp3',
    '/tutorial-audio/control_english_card2.mp3',
    '/tutorial-audio/control_english_card3.mp3',
    '/tutorial-audio/control_english_card4.mp3',
    '/tutorial-audio/control_english_card5.mp3',
    '/tutorial-audio/control_dagbani_card1.mp3',
    '/tutorial-audio/control_dagbani_card2.mp3',
    '/tutorial-audio/control_dagbani_card3.mp3',
    '/tutorial-audio/control_dagbani_card4.mp3',
    '/tutorial-audio/control_dagbani_card5.mp3',
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

// ✅ Track installation state
let isInstalling = false;

// Install event - cache files
self.addEventListener('install', (event) => {
    console.log('🔧 Service Worker installing...', CACHE_NAME);
    isInstalling = true; // ✅ Set flag during installation
    
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('📦 Starting to cache files...');
                console.log(`📋 Total files to cache: ${urlsToCache.length}`);
                
                // Cache files one by one
                return Promise.allSettled(
                    urlsToCache.map((url, index) => {
                        return cache.add(url)
                            .then(() => {
                                const filename = url.split('/').pop();
                                console.log(`✅ [${index + 1}/${urlsToCache.length}] Cached: ${filename}`);
                            })
                            .catch((error) => {
                                console.error(`❌ [${index + 1}/${urlsToCache.length}] Failed: ${url}`);
                                console.error(`   Error: ${error.message}`);
                            });
                    })
                );
            })
            .then((results) => {
                isInstalling = false; // ✅ Clear flag after installation
                
                const successful = results.filter(r => r.status === 'fulfilled').length;
                const failed = results.filter(r => r.status === 'rejected').length;
                
                console.log('📊 Cache Installation Summary:');
                console.log(`   ✅ Success: ${successful}/${urlsToCache.length}`);
                console.log(`   ❌ Failed: ${failed}/${urlsToCache.length}`);
                
                return self.skipWaiting();
            })
            .catch((error) => {
                isInstalling = false; // ✅ Clear flag on error
                console.error('❌ Installation failed:', error);
                throw error;
            })
    );
});

// Activate event - clean old caches
self.addEventListener('activate', (event) => {
    console.log('🔄 Service Worker activating...', CACHE_NAME);
    
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            const oldCaches = cacheNames.filter(name => name !== CACHE_NAME);
            
            if (oldCaches.length > 0) {
                console.log('🗑️ Deleting old caches:', oldCaches.length);
            }
            
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheName !== CACHE_NAME) {
                        console.log('🗑️ Deleting:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        }).then(() => {
            console.log('✅ Service Worker activated:', CACHE_NAME);
            return self.clients.claim();
        })
    );
});

// ✅ FIXED: Fetch event - don't interfere during installation
// ✅ IMPROVED: Fetch event - Better audio file handling
// ✅ IMPROVED: Fetch event - Better audio file handling
// ✅ IMPROVED: Fetch event - Better audio file handling
self.addEventListener('fetch', (event) => {
    // Skip non-GET requests
    if (event.request.method !== 'GET') {
        return;
    }
    
    // Skip API calls
    if (event.request.url.includes('/api/')) {
        return;
    }
    
    // ✅ Don't intercept during installation
    if (isInstalling) {
        return;
    }
    
    event.respondWith(
        caches.match(event.request)
            .then((response) => {
                if (response) {
                    console.log('📦 Serving from cache:', event.request.url);
                    return response;
                }
                
                // Not in cache - try to fetch from network
                console.log('🌐 Not in cache, fetching:', event.request.url);
                
                return fetch(event.request)
                    .then((fetchResponse) => {
                        // Only cache successful responses
                        if (fetchResponse && fetchResponse.ok) {
                            const responseToCache = fetchResponse.clone();
                            caches.open(CACHE_NAME).then((cache) => {
                                cache.put(event.request, responseToCache);
                                console.log('💾 Cached:', event.request.url);
                            });
                        }
                        return fetchResponse;
                    })
                    .catch((error) => {
                        console.error('❌ Fetch failed:', event.request.url, error.message);
                        
                        // ✅ FOR AUDIO FILES: Try cache again with different variations
                        if (event.request.url.includes('/tutorial-audio/')) {
                            console.log('🔊 Audio fetch failed, checking cache variations...');
                            
                            return caches.open(CACHE_NAME).then(cache => {
                                // Try exact match first
                                return cache.match(event.request)
                                    .then(cachedResponse => {
                                        if (cachedResponse) {
                                            console.log('✅ Found audio in cache!');
                                            return cachedResponse;
                                        }
                                        
                                        // Try without query params
                                        const url = new URL(event.request.url);
                                        const cleanUrl = url.origin + url.pathname;
                                        
                                        console.log('🔍 Trying clean URL:', cleanUrl);
                                        return cache.match(cleanUrl);
                                    });
                            });
                        }
                        
                        // Return offline page or error
                        return new Response('Offline - file not in cache', {
                            status: 503,
                            statusText: 'Service Unavailable'
                        });
                    });
            })
    );
});






// Listen for skip waiting message
self.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'SKIP_WAITING') {
        console.log('⏭️ Skipping waiting...');
        self.skipWaiting();
    }
});

console.log('🚀 Service Worker loaded:', CACHE_NAME);