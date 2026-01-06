// ===============================================
// SERVICE WORKER - For Offline Functionality
// FIXED: Prevents self-interference during install
// ===============================================

// const ONE_DAY_MS = 3 * 50;
// const CACHE_VERSION = `v4-audio-fixed-${Date.now()}`;
// const CACHE_NAME = `weather-game-${CACHE_VERSION}`;


const CACHE_VERSION = 'v7-full-audio-cache'; // ✅ Change version number
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
// In service-worker.js
self.addEventListener('install', (event) => {
    console.log('🔧 Service Worker installing...', CACHE_NAME);
    isInstalling = true;
    
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('📦 Caching files...');
                
                const criticalFiles = urlsToCache.filter(url => 
                    !url.includes('/tutorial-audio/')
                );
                const audioFiles = urlsToCache.filter(url => 
                    url.includes('/tutorial-audio/')
                );
                
                // Cache critical files first
                return cache.addAll(criticalFiles)
                    .then(() => {
                        console.log('✅ Critical files cached');
                        
                        // Cache audio files with retries
                        let successCount = 0;
                        let failCount = 0;
                        const failedFiles = [];
                        
                        const cacheAudio = (url, retries = 3) => {
                            return fetch(url)
                                .then(response => {
                                    if (response.ok) {
                                        return cache.put(url, response).then(() => {
                                            successCount++;
                                            console.log(`✅ [${successCount}/${audioFiles.length}] ${url.split('/').pop()}`);
                                        });
                                    } else {
                                        throw new Error(`HTTP ${response.status}`);
                                    }
                                })
                                .catch((error) => {
                                    if (retries > 0) {
                                        console.log(`⚠️ Retry ${4-retries}/3: ${url.split('/').pop()}`);
                                        return new Promise(resolve => setTimeout(resolve, 1000))
                                            .then(() => cacheAudio(url, retries - 1));
                                    } else {
                                        failCount++;
                                        failedFiles.push(url.split('/').pop());
                                        console.error(`❌ [${successCount + failCount}/${audioFiles.length}] ${url.split('/').pop()} - ${error.message}`);
                                    }
                                });
                        };
                        
                        return Promise.allSettled(audioFiles.map(url => cacheAudio(url)))
                            .then(() => {
                                console.log('📊 Audio Cache Summary:');
                                console.log(`   ✅ Success: ${successCount}/${audioFiles.length}`);
                                console.log(`   ❌ Failed: ${failCount}/${audioFiles.length}`);
                                if (failedFiles.length > 0) {
                                    console.log('   Failed files:', failedFiles);
                                }
                            });
                    });
            })
            .then(() => {
                isInstalling = false;
                console.log('✅ Service Worker installed:', CACHE_NAME);
                return self.skipWaiting();
            })
            .catch((error) => {
                isInstalling = false;
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
// In service-worker.js - Update the fetch event
self.addEventListener('fetch', (event) => {
    if (event.request.method !== 'GET') return;
    if (event.request.url.includes('/api/')) return;
    if (isInstalling) return;
    
    // ✅ Special handling for audio files
    if (event.request.url.includes('/tutorial-audio/')) {
        event.respondWith(
            caches.match(event.request)
                .then((cachedResponse) => {
                    if (cachedResponse) {
                        console.log('🎵 Serving audio from cache:', event.request.url);
                        return cachedResponse;
                    }
                    
                    // Not in cache - fetch and cache it
                    console.log('🎵 Fetching audio and caching:', event.request.url);
                    return fetch(event.request)
                        .then((response) => {
                            if (response && response.ok) {
                                const responseToCache = response.clone();
                                caches.open(CACHE_NAME).then((cache) => {
                                    cache.put(event.request, responseToCache);
                                    console.log('💾 Audio cached:', event.request.url);
                                });
                            }
                            return response;
                        })
                        .catch((error) => {
                            console.error('❌ Audio fetch failed:', event.request.url, error.message);
                            return new Response('Audio file not available', {
                                status: 503,
                                statusText: 'Service Unavailable'
                            });
                        });
                })
        );
        return;
    }
    
    // Regular file handling
    event.respondWith(
        caches.match(event.request)
            .then((response) => {
                if (response) {
                    console.log('📦 Serving from cache:', event.request.url);
                    return response;
                }
                
                console.log('🌐 Not in cache, fetching:', event.request.url);
                return fetch(event.request)
                    .then((fetchResponse) => {
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