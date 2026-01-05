// ===============================================
// OFFLINE STORAGE SYSTEM - COMPLETE FIXED VERSION
// Handles local data storage and sync when online
// ALL ENDPOINTS PROPERLY IMPLEMENTED
// ===============================================

const OFFLINE_STORAGE_KEY = 'farm_game_offline_data';
const SYNC_STATUS_KEY = 'farm_game_sync_status';

// ✅ ADD THIS: Define API_BASE for offline storage
const API_BASE = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:3000/api/game'
    : window.location.origin + '/api/game';

console.log('📡 Offline Storage API Base:', API_BASE);


// ===== UTILITY FUNCTIONS =====

// Check if online
function isOnline() {
    return navigator.onLine;
}

// Generate unique device ID
function generateDeviceId() {
    const existing = localStorage.getItem('device_id');
    if (existing) return existing;
    
    const deviceId = 'DEVICE_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    localStorage.setItem('device_id', deviceId);
    return deviceId;
}

// Generate offline ID
function generateOfflineId() {
    return 'OFFLINE_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}

// ===== STORAGE MANAGEMENT =====

// Initialize offline storage structure
function initializeOfflineStorage() {
    const existing = localStorage.getItem(OFFLINE_STORAGE_KEY);
    if (!existing) {
        const initialData = {
            sessions: [],
            respondents: [],
            rounds: [],
            knowledge: [],
            perception: [],
            coupleInfo: [],
            pending_sync: [],
            lastSyncAttempt: null,
            deviceId: generateDeviceId()
        };
        localStorage.setItem(OFFLINE_STORAGE_KEY, JSON.stringify(initialData));
        console.log('📦 Offline storage initialized');
    }
}

// Get offline data
function getOfflineData() {
    const data = localStorage.getItem(OFFLINE_STORAGE_KEY);
    return data ? JSON.parse(data) : null;
}

// Save offline data
function saveOfflineData(data) {
    localStorage.setItem(OFFLINE_STORAGE_KEY, JSON.stringify(data));
    console.log('💾 Offline data saved');
}



// ===== DEFAULT COMMUNITIES =====
function getDefaultCommunities() {
    return [
        // CONTROL GROUP
        { communityName: 'Kpalsabogu', district: 'Tolon', treatmentGroup: 'control', targetHouseholds: 10 },
        { communityName: 'Nyankpala', district: 'Tolon', treatmentGroup: 'control', targetHouseholds: 10 },
        { communityName: 'Wantugu', district: 'Tolon', treatmentGroup: 'control', targetHouseholds: 10 },
        { communityName: 'Tuunayili', district: 'Kumbungu', treatmentGroup: 'control', targetHouseholds: 10 },
        { communityName: 'Kpalguni', district: 'Kumbungu', treatmentGroup: 'control', targetHouseholds: 10 },
        { communityName: 'Kumbuyili', district: 'Kumbungu', treatmentGroup: 'control', targetHouseholds: 10 },
        { communityName: 'Zantani', district: 'Gushegu', treatmentGroup: 'control', targetHouseholds: 10 },
        { communityName: 'Kpanshegu', district: 'Gushegu', treatmentGroup: 'control', targetHouseholds: 10 },
        { communityName: 'Nabogo', district: 'Gushegu', treatmentGroup: 'control', targetHouseholds: 10 },
        { communityName: 'Tampion', district: 'Gushegu', treatmentGroup: 'control', targetHouseholds: 10 },
        
        // FERTILIZER BUNDLE GROUP
        { communityName: 'Voggu', district: 'Tolon', treatmentGroup: 'fertilizer_bundle', targetHouseholds: 10 },
        { communityName: 'Kpendua', district: 'Tolon', treatmentGroup: 'fertilizer_bundle', targetHouseholds: 10 },
        { communityName: 'Gbullung', district: 'Tolon', treatmentGroup: 'fertilizer_bundle', targetHouseholds: 10 },
        { communityName: 'Zangbalun', district: 'Tolon', treatmentGroup: 'fertilizer_bundle', targetHouseholds: 10 },
        { communityName: 'Gbulung', district: 'Kumbungu', treatmentGroup: 'fertilizer_bundle', targetHouseholds: 10 },
        { communityName: 'Kasuliyili', district: 'Kumbungu', treatmentGroup: 'fertilizer_bundle', targetHouseholds: 10 },
        { communityName: 'Kpanvo', district: 'Kumbungu', treatmentGroup: 'fertilizer_bundle', targetHouseholds: 10 },
        { communityName: 'Nanton', district: 'Gushegu', treatmentGroup: 'fertilizer_bundle', targetHouseholds: 10 },
        { communityName: 'Kpatinga', district: 'Gushegu', treatmentGroup: 'fertilizer_bundle', targetHouseholds: 10 },
        { communityName: 'Nakpanduri', district: 'Gushegu', treatmentGroup: 'fertilizer_bundle', targetHouseholds: 10 },
        
        // SEEDLING BUNDLE GROUP
        { communityName: 'Lingbunga', district: 'Tolon', treatmentGroup: 'seedling_bundle', targetHouseholds: 10 },
        { communityName: 'Kpalbusi', district: 'Tolon', treatmentGroup: 'seedling_bundle', targetHouseholds: 10 },
        { communityName: 'Wayamba', district: 'Tolon', treatmentGroup: 'seedling_bundle', targetHouseholds: 10 },
        { communityName: 'Yoggu', district: 'Tolon', treatmentGroup: 'seedling_bundle', targetHouseholds: 10 },
        { communityName: 'Tindan', district: 'Kumbungu', treatmentGroup: 'seedling_bundle', targetHouseholds: 10 },
        { communityName: 'Gbulahagu', district: 'Kumbungu', treatmentGroup: 'seedling_bundle', targetHouseholds: 10 },
        { communityName: 'Kpalguni II', district: 'Kumbungu', treatmentGroup: 'seedling_bundle', targetHouseholds: 10 },
        { communityName: 'Zakpalsi', district: 'Gushegu', treatmentGroup: 'seedling_bundle', targetHouseholds: 10 },
        { communityName: 'Kpachi', district: 'Gushegu', treatmentGroup: 'seedling_bundle', targetHouseholds: 10 },
        { communityName: 'Gushegu', district: 'Gushegu', treatmentGroup: 'seedling_bundle', targetHouseholds: 10 }
    ];
}


// Add to pending sync queue
// function addToPendingSync(type, endpoint, method, data) {
//     const offlineData = getOfflineData() || {};
//     if (!offlineData.pending_sync) offlineData.pending_sync = [];
    
//     offlineData.pending_sync.push({
//         id: generateOfflineId(),
//         type,
//         endpoint,
//         method,
//         data,
//         timestamp: new Date().toISOString(),
//         synced: false
//     });
    
//     saveOfflineData(offlineData);
//     console.log('📤 Added to sync queue:', type);
// }

// ===== TREATMENT ASSIGNMENT =====

// Assign treatment offline (balanced randomization)
function assignTreatmentOffline() {
    const offlineData = getOfflineData();
    const existingRespondents = offlineData.respondents || [];
    
    // Count existing treatments
    const treatmentCounts = {
        control: existingRespondents.filter(r => r.treatmentGroup === 'control').length,
        fertilizer_bundle: existingRespondents.filter(r => r.treatmentGroup === 'fertilizer_bundle').length,
        seedling_bundle: existingRespondents.filter(r => r.treatmentGroup === 'seedling_bundle').length
    };
    
    // Find treatment with lowest count
    const minCount = Math.min(...Object.values(treatmentCounts));
    const availableTreatments = Object.keys(treatmentCounts).filter(
        t => treatmentCounts[t] === minCount
    );
    
    // Random selection from available treatments
    const treatment = availableTreatments[Math.floor(Math.random() * availableTreatments.length)];
    console.log('📊 Assigned treatment offline:', treatment, 'Counts:', treatmentCounts);
    
    return treatment;
}

// ===== MAIN OFFLINE HANDLER =====

function handleOfflineStorage(endpoint, method, data) {
    console.log('📴 OFFLINE MODE - Handling:', endpoint, method);
    
    // ✅ ALWAYS GET FRESH DATA
    let offlineData = getOfflineData();
    if (!offlineData) {
        initializeOfflineStorage();
        offlineData = getOfflineData();
    }
    
    // ✅ ENSURE pending_sync EXISTS
    if (!offlineData.pending_sync) {
        offlineData.pending_sync = [];
    }
    
    // ===== GET COMMUNITIES =====
    if (endpoint.includes('/communities') && method === 'GET') {
        console.log('📋 Returning default communities (offline)');
        return getDefaultCommunities();
    }
    
    // ===== RESPONDENT CREATION =====
    if (endpoint.includes('/respondent/create') && method === 'POST') {
        const respondentId = generateOfflineId();
        const treatmentGroup = assignTreatmentOffline();
        
        const respondent = {
            _id: respondentId,
            ...data,
            treatmentGroup: treatmentGroup,
            createdAt: new Date().toISOString(),
            offline: true,
            deviceId: offlineData.deviceId
        };
        
        // ✅ FIX: Get fresh data before modifying
        offlineData = getOfflineData();
        if (!offlineData.respondents) offlineData.respondents = [];
        if (!offlineData.pending_sync) offlineData.pending_sync = [];
        
        offlineData.respondents.push(respondent);
        
        // ✅ Add to pending sync
        offlineData.pending_sync.push({
            id: generateOfflineId(),
            type: 'respondent',
            endpoint: endpoint,
            method: method,
            data: respondent,
            timestamp: new Date().toISOString(),
            synced: false,
            syncedAt: null
        });
        
        saveOfflineData(offlineData);
        
        console.log('✅ Respondent created offline:', respondentId, 'Treatment:', treatmentGroup);
        console.log('📤 Added to pending_sync. Total pending:', offlineData.pending_sync.length);
        
        return respondent;
    }
    
    // ===== SESSION START =====
  // ===== SESSION START =====
if (endpoint.includes('/session/start') && method === 'POST') {
    const sessionId = generateOfflineId().replace('OFFLINE_', 'OFFLINE_SESSION_');
    
    const session = {
        sessionId: sessionId,
        respondentId: data.respondentId,
        sessionType: data.sessionType,
        treatmentGroup: offlineData.respondents?.[0]?.treatmentGroup || 'control',
        startTime: new Date().toISOString(),
        totalEarnings: 0,
        totalInsuranceSpent: 0,
        totalPayoutsReceived: 0,
        rounds: [],
        isComplete: false,
        offline: true,
        deviceId: offlineData.deviceId
    };
    
    // ✅ Get fresh data
    offlineData = getOfflineData();
    if (!offlineData.sessions) offlineData.sessions = [];
    if (!offlineData.pending_sync) offlineData.pending_sync = [];
    
    offlineData.sessions.push(session);
    
    // ✅ CRITICAL: Add session creation to pending sync
    offlineData.pending_sync.push({
        id: generateOfflineId(),
        type: 'session',  // ← Make sure this says 'session', not 'session_start'
        endpoint: '/session/start',  // ← Use correct endpoint
        method: 'POST',
        data: session,
        timestamp: new Date().toISOString(),
        synced: false,
        syncedAt: null
    });
    
    saveOfflineData(offlineData);
    
    console.log('✅ Session created offline:', sessionId);
    console.log('📤 Added to pending_sync. Total pending:', offlineData.pending_sync.length);
    
    return session;
}
    
    // ===== ROUND SAVE =====
    if (endpoint.includes('/round/save') && method === 'POST') {
        const roundId = generateOfflineId();
        
        const round = {
            _id: roundId,
            ...data,
            savedAt: new Date().toISOString(),
            offline: true,
            deviceId: offlineData.deviceId
        };
        
        // ✅ FIX: Get fresh data before modifying
        offlineData = getOfflineData();
        if (!offlineData.rounds) offlineData.rounds = [];
        if (!offlineData.sessions) offlineData.sessions = [];
        if (!offlineData.pending_sync) offlineData.pending_sync = [];
        
        offlineData.rounds.push(round);
        
        // Update session totals
        const session = offlineData.sessions.find(s => s.sessionId === data.sessionId);
        if (session) {
            session.totalEarnings = (session.totalEarnings || 0) + 
                (data.harvestOutcome || 0) + (data.payoutReceived || 0);
            session.totalInsuranceSpent = (session.totalInsuranceSpent || 0) + 
                (data.insuranceSpend || 0);
            session.totalPayoutsReceived = (session.totalPayoutsReceived || 0) + 
                (data.payoutReceived || 0);
            
            if (!session.rounds) session.rounds = [];
            session.rounds.push(roundId);
        }
        
        // ✅ Add to pending sync
        offlineData.pending_sync.push({
            id: generateOfflineId(),
            type: 'round',
            endpoint: endpoint,
            method: method,
            data: round,
            timestamp: new Date().toISOString(),
            synced: false,
            syncedAt: null
        });
        
        saveOfflineData(offlineData);
        
        console.log('✅ Round saved offline:', roundId);
        console.log('📤 Added to pending_sync. Total pending:', offlineData.pending_sync.length);
        
        return round;
    }
    
    // ===== SESSION COMPLETE =====
    if (endpoint.includes('/session/') && endpoint.includes('/complete') && method === 'PUT') {
        const sessionId = endpoint.split('/')[2];
        
        // ✅ FIX: Get fresh data before modifying
        offlineData = getOfflineData();
        if (!offlineData.sessions) offlineData.sessions = [];
        if (!offlineData.pending_sync) offlineData.pending_sync = [];
        
        const session = offlineData.sessions.find(s => s.sessionId === sessionId);
        
        if (session) {
            session.completedAt = new Date().toISOString();
            session.isComplete = true;
            
            // ✅ Add to pending sync
            offlineData.pending_sync.push({
                id: generateOfflineId(),
                type: 'session_complete',
                endpoint: endpoint,
                method: method,
                data: { sessionId },
                timestamp: new Date().toISOString(),
                synced: false,
                syncedAt: null
            });
            
            saveOfflineData(offlineData);
            
            console.log('✅ Session marked complete offline:', sessionId);
            console.log('📤 Added to pending_sync. Total pending:', offlineData.pending_sync.length);
            
            return session;
        }
        
        console.warn('⚠️ Session not found for completion:', sessionId);
        return { success: false, message: 'Session not found', offline: true };
    }
    
    // ===== KNOWLEDGE TEST SUBMIT =====
    if (endpoint.includes('/knowledge/submit') && method === 'POST') {
        const knowledgeId = generateOfflineId();
        
        // Calculate score
        const answers = data.answers || data;
        const correctAnswers = [
            answers.q1_indexBased === true || answers.q1 === true,
            answers.q2_areaWide === true || answers.q2 === true,
            answers.q3_profitGuarantee === false || answers.q3 === false,
            answers.q4_upfrontCost === true || answers.q4 === true,
            answers.q5_basisRisk === true || answers.q5 === true
        ].filter(Boolean).length;
        
        const knowledge = {
            _id: knowledgeId,
            ...data,
            knowledgeScore: correctAnswers,
            submittedAt: new Date().toISOString(),
            offline: true,
            deviceId: offlineData.deviceId
        };
        
        // ✅ FIX: Get fresh data before modifying
        offlineData = getOfflineData();
        if (!offlineData.knowledge) offlineData.knowledge = [];
        if (!offlineData.pending_sync) offlineData.pending_sync = [];
        
        offlineData.knowledge.push(knowledge);
        
        // ✅ Add to pending sync
        offlineData.pending_sync.push({
            id: generateOfflineId(),
            type: 'knowledge',
            endpoint: endpoint,
            method: method,
            data: knowledge,
            timestamp: new Date().toISOString(),
            synced: false,
            syncedAt: null
        });
        
        saveOfflineData(offlineData);
        
        console.log('✅ Knowledge test saved offline, Score:', correctAnswers, '/5');
        console.log('📤 Added to pending_sync. Total pending:', offlineData.pending_sync.length);
        
        return knowledge;
    }
    
    // ===== PERCEPTION SUBMIT =====
    if (endpoint.includes('/perception/submit') && method === 'POST') {
        const perceptionId = generateOfflineId();
        
        const perception = {
            _id: perceptionId,
            ...data,
            submittedAt: new Date().toISOString(),
            offline: true,
            deviceId: offlineData.deviceId
        };
        
        // ✅ FIX: Get fresh data before modifying
        offlineData = getOfflineData();
        if (!offlineData.perception) offlineData.perception = [];
        if (!offlineData.pending_sync) offlineData.pending_sync = [];
        
        offlineData.perception.push(perception);
        
        // ✅ Add to pending sync
        offlineData.pending_sync.push({
            id: generateOfflineId(),
            type: 'perception',
            endpoint: endpoint,
            method: method,
            data: perception,
            timestamp: new Date().toISOString(),
            synced: false,
            syncedAt: null
        });
        
        saveOfflineData(offlineData);
        
        console.log('✅ Perception data saved offline');
        console.log('📤 Added to pending_sync. Total pending:', offlineData.pending_sync.length);
        
        return perception;
    }
    
    // ===== COUPLE INFO =====
    if (endpoint.includes('/couple/info') && method === 'POST') {
        const coupleInfoId = generateOfflineId();
        
        const coupleInfo = {
            _id: coupleInfoId,
            ...data,
            submittedAt: new Date().toISOString(),
            offline: true,
            deviceId: offlineData.deviceId
        };
        
        // ✅ FIX: Get fresh data before modifying
        offlineData = getOfflineData();
        if (!offlineData.coupleInfo) offlineData.coupleInfo = [];
        if (!offlineData.pending_sync) offlineData.pending_sync = [];
        
        offlineData.coupleInfo.push(coupleInfo);
        
        // ✅ Add to pending sync
        offlineData.pending_sync.push({
            id: generateOfflineId(),
            type: 'coupleInfo',
            endpoint: endpoint,
            method: method,
            data: coupleInfo,
            timestamp: new Date().toISOString(),
            synced: false,
            syncedAt: null
        });
        
        saveOfflineData(offlineData);
        
        console.log('✅ Couple info saved offline');
        console.log('📤 Added to pending_sync. Total pending:', offlineData.pending_sync.length);
        
        return coupleInfo;
    }
    
    // ===== GET SESSION DATA =====
    if (endpoint.includes('/session/') && !endpoint.includes('/complete') && method === 'GET') {
        const sessionId = endpoint.split('/').pop();
        const session = offlineData.sessions.find(s => s.sessionId === sessionId);
        
        if (session) {
            const sessionRounds = offlineData.rounds.filter(r => r.sessionId === sessionId);
            const totalEarnings = sessionRounds.reduce((sum, r) => 
                sum + (r.harvestOutcome || 0) + (r.payoutReceived || 0), 0);
            const totalInsuranceSpent = sessionRounds.reduce((sum, r) => 
                sum + (r.insuranceSpend || 0), 0);
            const totalPayoutsReceived = sessionRounds.reduce((sum, r) => 
                sum + (r.payoutReceived || 0), 0);
            
            console.log('✅ Retrieved session offline:', sessionId);
            return {
                ...session,
                totalEarnings,
                totalInsuranceSpent,
                totalPayoutsReceived,
                offline: true
            };
        }
        
        console.warn('⚠️ Session not found:', sessionId);
        return null;
    }
    
    // ===== GET KNOWLEDGE DATA =====
    if (endpoint.includes('/knowledge/') && method === 'GET') {
        const respondentId = endpoint.split('/').pop();
        const knowledgeData = offlineData.knowledge.find(k => 
            k.respondentId === respondentId
        );
        
        if (knowledgeData) {
            console.log('✅ Retrieved knowledge offline:', respondentId, 'Score:', knowledgeData.knowledgeScore);
            return {
                ...knowledgeData,
                offline: true
            };
        }
        
        console.log('ℹ️ No knowledge data found for:', respondentId);
        return { 
            knowledgeScore: 0, 
            offline: true,
            respondentId: respondentId
        };
    }
    
    console.warn('⚠️ Unhandled offline endpoint:', endpoint, method);
    return { 
        success: true, 
        offline: true, 
        message: 'Stored locally for sync',
        warning: 'Endpoint handler not fully implemented'
    };
}



// ===== SYNC FUNCTIONS =====

// Sync offline data to server
// ===== SYNC FUNCTIONS =====


// ===== REBUILD ID MAPPINGS FROM SYNCED DATA =====
function rebuildIdMappings() {
    const offlineData = getOfflineData();
    const mappings = {
        respondents: {},
        sessions: {}
    };
    
    // Look through all synced items to rebuild mappings
    if (offlineData.pending_sync) {
        offlineData.pending_sync.forEach(item => {
            // Only process already-synced items
            if (item.synced && item.serverResponse) {
                if (item.type === 'respondent' && item.data._id) {
                    mappings.respondents[item.data._id] = item.serverResponse._id;
                }
                if (item.type === 'session' && item.data.sessionId) {
                    mappings.sessions[item.data.sessionId] = item.serverResponse.sessionId;
                }
            }
        });
    }
    
    console.log('🔄 Rebuilt ID mappings:', mappings);
    return mappings;
}



// Sync offline data to server
// Sync offline data to server
// ===== REVISED SYNC FUNCTION WITH PROPER DEPENDENCY HANDLING =====
async function syncOfflineData() {
    if (!isOnline()) {
        console.log('📴 Cannot sync - still offline');
        return { success: false, message: 'Still offline' };
    }
    
    const offlineData = getOfflineData();
    if (!offlineData || !offlineData.pending_sync || offlineData.pending_sync.length === 0) {
        console.log('✅ No data to sync');
        return { success: true, message: 'No data to sync' };
    }
    
    console.log('🔄 Starting sync...', offlineData.pending_sync.length, 'items');
    
    const results = {
        total: offlineData.pending_sync.length,
        successful: 0,
        failed: 0,
        errors: []
    };
    
    // ✅ CRITICAL: Start with fresh ID mappings
    const idMappings = {
        respondents: {},
        sessions: {}
    };
    
    // ✅ Sort by dependency order: respondent → session → round → knowledge → session_complete
    const typeOrder = {
        'respondent': 1,
        'session': 2,
        'round': 3,
        'knowledge': 4,
        'perception': 5,
        'coupleInfo': 6,
        'session_complete': 7
    };
    
    const sortedItems = offlineData.pending_sync
        .filter(item => !item.synced) // Only unsynced items
        .sort((a, b) => {
            // Sort by type order first, then by timestamp
            const typeA = typeOrder[a.type] || 999;
            const typeB = typeOrder[b.type] || 999;
            if (typeA !== typeB) return typeA - typeB;
            return new Date(a.timestamp) - new Date(b.timestamp);
        });
    
    console.log('📋 Sync order:', sortedItems.map(i => i.type));
    
    for (const item of sortedItems) {
        try {
            console.log(`\n🔄 Processing ${item.type}...`);
            
            // ✅ Prepare data with current mappings
            const cleanData = prepareDataForSync(item.data, item.type, idMappings);
            
            // ✅ CRITICAL: Check if dependencies are mapped
            if (item.type !== 'respondent') {
                // Check if respondentId is properly mapped
                if (cleanData.respondentId && cleanData.respondentId.startsWith('OFFLINE_')) {
                    console.error('❌ Cannot sync - respondent not yet synced:', cleanData.respondentId);
                    results.failed++;
                    results.errors.push({
                        item: item.type,
                        error: 'Respondent not synced yet - will retry on next sync'
                    });
                    continue; // Skip this item for now
                }
            }
            
            if (item.type !== 'respondent' && item.type !== 'session') {
                // Check if sessionId is properly mapped
                if (cleanData.sessionId && cleanData.sessionId.startsWith('OFFLINE_')) {
                    console.error('❌ Cannot sync - session not yet synced:', cleanData.sessionId);
                    results.failed++;
                    results.errors.push({
                        item: item.type,
                        error: 'Session not synced yet - will retry on next sync'
                    });
                    continue; // Skip this item for now
                }
            }
            
            // ✅ Map endpoint URLs for session_complete
            let endpoint = item.endpoint;
            if (item.type === 'session_complete') {
                const offlineSessionMatch = endpoint.match(/session\/(OFFLINE_SESSION_[^/]+)/);
                if (offlineSessionMatch && offlineSessionMatch[1]) {
                    const offlineSessionId = offlineSessionMatch[1];
                    const mappedSessionId = idMappings.sessions[offlineSessionId];
                    
                    if (mappedSessionId) {
                        endpoint = endpoint.replace(offlineSessionId, mappedSessionId);
                        console.log('✅ Mapped endpoint:', item.endpoint, '→', endpoint);
                    } else {
                        console.error('❌ Cannot sync session_complete - no session mapping');
                        results.failed++;
                        results.errors.push({
                            item: item.type,
                            error: 'Session not synced yet - will retry on next sync'
                        });
                        continue;
                    }
                }
            }
            
            const fullUrl = `${API_BASE}${endpoint}`;
            
            console.log(`📤 Syncing ${item.type} to: ${fullUrl}`);
            console.log('📦 Data:', cleanData);
            
            const response = await fetch(fullUrl, {
                method: item.method,
                headers: { 
                    'Content-Type': 'application/json',
                    'X-Offline-Sync': 'true',
                    'X-Device-Id': offlineData.deviceId
                },
                body: JSON.stringify(cleanData)
            });
            
            const responseText = await response.text();
            let serverResponse;
            try {
                serverResponse = JSON.parse(responseText);
            } catch (e) {
                console.error('❌ Invalid JSON response:', responseText);
                throw new Error(`Invalid response: ${responseText.substring(0, 100)}`);
            }
            
            if (response.ok) {
                // ✅ Store ID mappings for subsequent requests
                if (item.type === 'respondent' && serverResponse.data && serverResponse.data._id) {
                    idMappings.respondents[item.data._id] = serverResponse.data._id;
                    console.log('✅ Mapped respondent:', item.data._id, '→', serverResponse.data._id);
                }
                
                if (item.type === 'session' && serverResponse.data && serverResponse.data.sessionId) {
                    idMappings.sessions[item.data.sessionId] = serverResponse.data.sessionId;
                    console.log('✅ Mapped session:', item.data.sessionId, '→', serverResponse.data.sessionId);
                }
                
                item.synced = true;
                item.syncedAt = new Date().toISOString();
                item.serverResponse = serverResponse.data;
                results.successful++;
                console.log('✅ Synced:', item.type, item.id);
            } else {
                results.failed++;
                results.errors.push({
                    item: item.type,
                    error: `HTTP ${response.status}: ${JSON.stringify(serverResponse)}`
                });
                console.error('❌ Sync failed:', item.type, response.status, serverResponse);
            }
        } catch (error) {
            results.failed++;
            results.errors.push({
                item: item.type,
                error: error.message
            });
            console.error('❌ Sync error:', item.type, error);
        }
    }
    
    // ✅ Save progress after each sync attempt
    offlineData.lastSyncAttempt = new Date().toISOString();
    saveOfflineData(offlineData);
    
    const syncStatus = {
        lastSync: new Date().toISOString(),
        results: results
    };
    localStorage.setItem(SYNC_STATUS_KEY, JSON.stringify(syncStatus));
    
    console.log('🔄 Sync complete:', results);
    
    // ✅ If some items failed due to dependencies, suggest retrying
    if (results.failed > 0 && results.successful > 0) {
        console.log('ℹ️ Some items synced successfully. Retry sync to upload remaining items.');
    }
    
    return { success: true, results };
}




// ✅ NEW FUNCTION: Prepare data for sync
function prepareDataForSync(data, type, idMappings) {
    const cleanData = { ...data };
    
    // Remove offline-generated IDs (let server generate proper MongoDB ObjectIds)
    if (cleanData._id && cleanData._id.startsWith('OFFLINE_')) {
        delete cleanData._id;
    }
    
    // Map offline respondent IDs to server IDs
    if (cleanData.respondentId && cleanData.respondentId.startsWith('OFFLINE_')) {
        if (idMappings.respondents[cleanData.respondentId]) {
            cleanData.respondentId = idMappings.respondents[cleanData.respondentId];
        } else {
            console.warn('⚠️ No mapping found for respondentId:', cleanData.respondentId);
        }
    }
    
    // Map offline session IDs to server IDs
    if (cleanData.sessionId && cleanData.sessionId.startsWith('OFFLINE_')) {
        if (idMappings.sessions[cleanData.sessionId]) {
            cleanData.sessionId = idMappings.sessions[cleanData.sessionId];
        } else {
            console.warn('⚠️ No mapping found for sessionId:', cleanData.sessionId);
        }
    }
    
    // Remove offline and deviceId flags before sending to server
    delete cleanData.offline;
    delete cleanData.deviceId;
    
    return cleanData;
}



// Get sync status
// Get sync status
// offline-storage.js - Line 328const response = await fetch(`${API_BASE}/
function getSyncStatus() {
    const offlineData = getOfflineData();
    const syncStatus = localStorage.getItem(SYNC_STATUS_KEY);
    
    console.log('🔍 === getSyncStatus DEBUG ===');
    console.log('📦 Raw offline data:', offlineData);
    
    if (!offlineData) {
        console.log('❌ No offline data at all');
        return {
            isOnline: isOnline(),
            pendingItems: 0,
            lastSync: syncStatus ? JSON.parse(syncStatus) : null,
            offlineDataSize: 0
        };
    }
    
    if (!offlineData.pending_sync) {
        console.log('⚠️ No pending_sync array (initializing)');
        offlineData.pending_sync = [];
        saveOfflineData(offlineData);
    }
    
    // ✅ CRITICAL: Count items where synced is NOT true
    const unsyncedItems = offlineData.pending_sync.filter(item => item.synced !== true);
    
    console.log('📊 Sync Analysis:');
    console.log('  Total items:', offlineData.pending_sync.length);
    console.log('  Unsynced items:', unsyncedItems.length);
    console.log('  Item details:');
    offlineData.pending_sync.forEach((item, i) => {
        console.log(`    ${i + 1}. ${item.type} - synced: ${item.synced} | ${item.timestamp}`);
    });
    console.log('🔍 === END DEBUG ===');
    
    return {
        isOnline: isOnline(),
        pendingItems: unsyncedItems.length,
        lastSync: syncStatus ? JSON.parse(syncStatus) : null,
        offlineDataSize: offlineData ? JSON.stringify(offlineData).length : 0
    };
}



// ===== EXPORT & UTILITY FUNCTIONS =====

// Export offline data (for backup)
function exportOfflineData() {
    const offlineData = getOfflineData();
    const syncStatus = getSyncStatus();
    
    const exportData = {
        exportDate: new Date().toISOString(),
        syncStatus,
        data: offlineData
    };
    
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { 
        type: 'application/json' 
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `farm-game-backup-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    
    console.log('💾 Data exported');
}

// Clear all offline data (use with caution)
function clearOfflineData() {
    if (confirm('⚠️ This will delete all offline data. Are you sure?')) {
        localStorage.removeItem(OFFLINE_STORAGE_KEY);
        localStorage.removeItem(SYNC_STATUS_KEY);
        console.log('🗑️ Offline data cleared');
        initializeOfflineStorage();
    }
}

// ===== INITIALIZATION =====

// Initialize on load
initializeOfflineStorage();

// Export functions for use in game.js
window.offlineStorage = {
    isOnline,
    handleOfflineStorage,
    syncOfflineData,
    getSyncStatus,
    exportOfflineData,
    clearOfflineData,
    initializeOfflineStorage
};

console.log('✅ Offline storage system loaded');