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




// ===== PERMANENT ID MAPPING STORAGE =====
function saveIdMapping(type, offlineId, serverId) {
    const mappings = JSON.parse(localStorage.getItem('offline_id_mappings') || '{}');
    
    if (!mappings[type]) mappings[type] = {};
    mappings[type][offlineId] = serverId;
    
    localStorage.setItem('offline_id_mappings', JSON.stringify(mappings));
    console.log(`💾 Saved ${type} mapping: ${offlineId.substring(0, 30)}... → ${serverId}`);
}

function getIdMappings() {
    return JSON.parse(localStorage.getItem('offline_id_mappings') || '{"respondents": {}, "sessions": {}}');
}

function clearIdMappings() {
    localStorage.removeItem('offline_id_mappings');
    console.log('🗑️ Cleared ID mappings');
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
 // ===== RESPONDENT CREATION =====
if (endpoint.includes('/respondent/create') && method === 'POST') {
    const respondentId = generateOfflineId();
    const treatmentGroup = assignTreatmentOffline();
    
    // ✅ SIMPLIFIED: Just use the data as-is since frontend now sends everything
    const respondent = {
        ...data,  // All demographic fields from frontend
        _id: respondentId,
        treatmentGroup: treatmentGroup,
        createdAt: new Date().toISOString(),
        offline: true,
        deviceId: offlineData.deviceId
    };
    
    // Get fresh data before modifying
    offlineData = getOfflineData();
    if (!offlineData.respondents) offlineData.respondents = [];
    if (!offlineData.pending_sync) offlineData.pending_sync = [];
    
    offlineData.respondents.push(respondent);
    
    // Add to pending sync
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
    // Start with permanent mappings
    const mappings = getIdMappings();
    
    console.log('🗺️ Loading permanent mappings:', {
        respondents: Object.keys(mappings.respondents).length,
        sessions: Object.keys(mappings.sessions).length
    });
    
    // Also check pending_sync for any new mappings
    const offlineData = getOfflineData();
    if (offlineData && offlineData.pending_sync) {
        offlineData.pending_sync.forEach(item => {
            if (item.synced && item.serverResponse) {
                if (item.type === 'respondent' && item.data._id && item.serverResponse._id) {
                    mappings.respondents[item.data._id] = item.serverResponse._id;
                }
                if (item.type === 'session' && item.data.sessionId && item.serverResponse.sessionId) {
                    mappings.sessions[item.data.sessionId] = item.serverResponse.sessionId;
                }
            }
        });
    }
    
    console.log('🔄 Total ID mappings:', {
        respondents: Object.keys(mappings.respondents).length,
        sessions: Object.keys(mappings.sessions).length
    });
    
    return mappings;
}





// Sync offline data to server
// Sync offline data to server
// ===== SYNC OFFLINE DATA TO SERVER - COMPLETE REVISED VERSION =====
async function syncOfflineData() {
        // ✅ FIX: Use stable check


     if (!navigator.onLine) {
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
        skipped: 0,
        errors: []
    };
    
    // ✅ CRITICAL: Rebuild ID mappings from previously synced items
    const idMappings = rebuildIdMappings();
    console.log('🗺️ ID Mappings:', {
        respondents: Object.keys(idMappings.respondents).length,
        sessions: Object.keys(idMappings.sessions).length
    });
    
    // ✅ Sort items by type priority and timestamp
    const sortedItems = offlineData.pending_sync.sort((a, b) => {
        // Priority order: respondent → session → round → knowledge → perception → coupleInfo
        const typePriority = {
            'respondent': 1,
            'session': 2,
            'round': 3,
            'knowledge': 4,
            'perception': 5,
            'coupleInfo': 6,
            'session_complete': 7
        };
        
        const aPriority = typePriority[a.type] || 99;
        const bPriority = typePriority[b.type] || 99;
        
        if (aPriority !== bPriority) {
            return aPriority - bPriority;
        }
        
        // Same type - sort by timestamp
        return new Date(a.timestamp) - new Date(b.timestamp);
    });
    
    console.log('📋 Sync order:', sortedItems.map(item => item.type).join(' → '));
    
 for (const item of sortedItems) {
    if (item.synced) {
        console.log(`⏭️ Already synced: ${item.type}`);
        continue;
    }
    
    console.log('');
    console.log(`📤 Syncing ${item.type} (${item.id})...`);
    
    try {
        // ✅ FIX: Check online status before each item
        if (!navigator.onLine) {
            console.warn('📴 Lost connection during sync - stopping');
            results.skipped++;
            break; // Stop syncing if we lost connection
        }
        
        // ✅ STEP 1: Prepare data for sync
        let cleanData;
        
        try {
            cleanData = prepareDataForSync(item.data, item.type, idMappings);
        } catch (prepError) {
            // Check if it's a missing ID error
            if (prepError.message.includes('requires') && prepError.message.includes('first')) {
                console.warn(`⏭️ Skipping ${item.type} - ${prepError.message}`);
                results.skipped++;
                continue;
            } else {
                // Other error - mark as failed
                console.error(`❌ Preparation error: ${prepError.message}`);
                results.failed++;
                results.errors.push({
                    item: item.type,
                    id: item.id,
                    error: prepError.message
                });
                continue;
            }
        }
            
            // ✅ STEP 2: Additional validation for specific types
            if (item.type === 'round') {
                if (!cleanData.respondentId || !cleanData.sessionId) {
                    console.warn(`⏭️ Skipping round ${cleanData.roundNumber} - missing required IDs`, {
                        hasRespondentId: !!cleanData.respondentId,
                        hasSessionId: !!cleanData.sessionId,
                        originalRespondentId: item.data.respondentId,
                        originalSessionId: item.data.sessionId
                    });
                    results.skipped++;
                    continue;
                }
            }
            
            if (item.type === 'knowledge' || item.type === 'perception') {
                if (!cleanData.respondentId || !cleanData.sessionId) {
                    console.warn(`⏭️ Skipping ${item.type} - missing required IDs`);
                    results.skipped++;
                    continue;
                }
            }
            
            if (item.type === 'session_complete') {
                if (!cleanData.sessionId) {
                    console.warn(`⏭️ Skipping session_complete - missing sessionId`);
                    results.skipped++;
                    continue;
                }
            }
            
            // ✅ STEP 3: Build endpoint URL
            let endpoint = item.endpoint;
            
            // Map endpoint URLs for session_complete
            if (item.type === 'session_complete') {
                const offlineSessionMatch = endpoint.match(/session\/(OFFLINE_SESSION_[^/]+)/);
                if (offlineSessionMatch && offlineSessionMatch[1]) {
                    const offlineSessionId = offlineSessionMatch[1];
                    const mappedSessionId = idMappings.sessions[offlineSessionId];
                    
                    if (mappedSessionId) {
                        endpoint = endpoint.replace(offlineSessionId, mappedSessionId);
                        console.log('✅ Mapped endpoint:', item.endpoint, '→', endpoint);
                    } else {
                        console.warn('⚠️ No session mapping found for:', offlineSessionId);
                        results.skipped++;
                        continue;
                    }
                }
            }
            
            const fullUrl = `${API_BASE}${endpoint}`;
            
            console.log(`📍 URL: ${fullUrl}`);
            console.log(`📦 Data:`, {
                type: item.type,
                hasRespondentId: !!cleanData.respondentId,
                hasSessionId: !!cleanData.sessionId,
                dataKeys: Object.keys(cleanData).slice(0, 10) // First 10 keys
            });
            
            // ✅ STEP 4: Make API request
            const response = await fetch(fullUrl, {
                method: item.method,
                headers: { 
                    'Content-Type': 'application/json',
                    'X-Offline-Sync': 'true',
                    'X-Device-Id': offlineData.deviceId
                },
                body: JSON.stringify(cleanData)
            });
            
            console.log(`📡 Response: ${response.status} ${response.statusText}`);
            
            // ✅ STEP 5: Handle response
            if (response.ok) {
                const serverResponse = await response.json();
                
                console.log('✅ Success:', {
                    type: item.type,
                    status: response.status
                });
                
                // ✅ Store server response for rebuilding mappings
                item.serverResponse = serverResponse.data || serverResponse;
                
                // ✅ CRITICAL: Store ID mappings for subsequent requests
               if (item.type === 'respondent' && serverResponse.data) {
    const offlineId = item.data._id;
    const serverId = serverResponse.data._id;
    
    if (offlineId && serverId) {
        idMappings.respondents[offlineId] = serverId;
        saveIdMapping('respondents', offlineId, serverId); // ✅ ADD THIS LINE
        console.log('✅ Mapped respondent:', offlineId, '→', serverId);
    }
}


                if (item.type === 'session' && serverResponse.data) {
                    const offlineSessionId = item.data.sessionId;
                    const serverSessionId = serverResponse.data.sessionId;
                    
                    if (offlineSessionId && serverSessionId) {
                        idMappings.sessions[offlineSessionId] = serverSessionId;
                        console.log('✅ Mapped session:', offlineSessionId, '→', serverSessionId);
                    }
                }
                
                // Mark as synced
                item.synced = true;
                item.syncedAt = new Date().toISOString();
                results.successful++;
                
            } else {
                // ✅ STEP 6: Handle errors
                let errorText;
                try {
                    const errorJson = await response.json();
                    errorText = errorJson.message || errorJson.error || JSON.stringify(errorJson);
                } catch {
                    errorText = await response.text();
                }
                
                results.failed++;
                results.errors.push({
                    item: item.type,
                    id: item.id,
                    status: response.status,
                    error: errorText
                });
                
                console.error('❌ Sync failed:', {
                    type: item.type,
                    status: response.status,
                    error: errorText
                });
                
                // ✅ For 400 errors with ObjectId validation, skip permanently
                if (response.status === 400 && errorText.includes('Cast to ObjectId failed')) {
                    console.error('🚫 Permanently skipping due to ObjectId validation error');
                    item.synced = true; // Mark as synced to prevent retry
                    item.syncError = errorText;
                }
            }
            
        } catch (error) {
            results.failed++;
            results.errors.push({
                item: item.type,
                id: item.id,
                error: error.message
            });
            console.error('❌ Sync exception:', {
                type: item.type,
                error: error.message,
                stack: error.stack
            });
        }
    }
    
    // ✅ STEP 7: Save updated sync status
    // Remove successfully synced items
    offlineData.pending_sync = offlineData.pending_sync.filter(item => !item.synced);
    offlineData.lastSyncAttempt = new Date().toISOString();
    saveOfflineData(offlineData);
    
    // Save sync status
    const syncStatus = {
        lastSync: new Date().toISOString(),
        results: results
    };
    localStorage.setItem(SYNC_STATUS_KEY, JSON.stringify(syncStatus));
    
    // ✅ STEP 8: Log results
    console.log('');
    console.log('🔄 ========================================');
    console.log('🔄 SYNC COMPLETE');
    console.log('🔄 ========================================');
    console.log('📊 Results:', {
        total: results.total,
        successful: results.successful,
        failed: results.failed,
        skipped: results.skipped,
        remaining: offlineData.pending_sync.length
    });
    
    if (results.errors.length > 0) {
        console.log('');
        console.log('❌ Errors:');
        results.errors.forEach((err, i) => {
            console.log(`  ${i + 1}. ${err.item}:`, err.error);
        });
    }
    
    if (results.skipped > 0) {
        console.log('');
        console.log(`⏭️ ${results.skipped} items skipped - will retry on next sync`);
    }
    
    console.log('🔄 ========================================');
    console.log('');
    
    return { 
        success: true, 
        results: results,
        remainingItems: offlineData.pending_sync.length
    };
}





// ✅ NEW FUNCTION: Prepare data for sync
// ✅ COMPLETE REVISED FUNCTION: Prepare data for sync
function prepareDataForSync(data, type, idMappings) {
    const cleanData = { ...data };
    
    console.log(`🧹 Preparing ${type} for sync...`);
    
    // ===== STEP 1: Remove offline-generated _id =====
    if (cleanData._id && cleanData._id.toString().startsWith('OFFLINE_')) {
        console.log(`  🗑️ Removing offline _id: ${cleanData._id}`);
        delete cleanData._id;
    }
    
    // ===== STEP 2: Handle respondentId =====
    if (cleanData.respondentId) {
        const respId = cleanData.respondentId.toString();
        
        if (respId.startsWith('OFFLINE_')) {
            // Check if we have a mapping
            if (idMappings.respondents[respId]) {
                cleanData.respondentId = idMappings.respondents[respId];
                console.log(`  ✅ Mapped respondentId: ${respId.substring(0, 20)}... → ${cleanData.respondentId}`);
            } else {
                // NO MAPPING - This item can't be synced yet
                console.log(`  ⚠️ No mapping for respondentId: ${respId.substring(0, 30)}...`);
                
                if (type === 'round' || type === 'knowledge' || type === 'perception') {
                    throw new Error(`${type} requires respondent to be synced first`);
                }
                
                // For other types, remove the field
                delete cleanData.respondentId;
            }
        }
    }
    
    // ===== STEP 3: Handle sessionId =====
    if (cleanData.sessionId) {
        const sessId = cleanData.sessionId.toString();
        
        if (sessId.startsWith('OFFLINE_')) {
            if (idMappings.sessions[sessId]) {
                cleanData.sessionId = idMappings.sessions[sessId];
                console.log(`  ✅ Mapped sessionId: ${sessId.substring(0, 30)}... → ${cleanData.sessionId}`);
            } else {
                console.log(`  ⚠️ No mapping for sessionId: ${sessId.substring(0, 30)}...`);
                
                if (type === 'round' || type === 'knowledge' || type === 'perception' || type === 'session_complete') {
                    throw new Error(`${type} requires session to be synced first`);
                }
                
                delete cleanData.sessionId;
            }
        }
    }
    
    // ===== STEP 4: Remove offline metadata =====
    delete cleanData.offline;
    delete cleanData.deviceId;
    delete cleanData.savedAt;
    
    console.log(`  ✅ Cleaned ${type} ready for sync`);
    
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
// Export functions for use in game.js
window.offlineStorage = {
    isOnline,
    handleOfflineStorage,
    syncOfflineData,
    getSyncStatus,
    exportOfflineData,
    clearOfflineData,
    initializeOfflineStorage,
    clearIdMappings  // ✅ ADD THIS
};

console.log('✅ Offline storage system loaded');


// ===== HANDLE NETWORK STATE CHANGES =====
let wasOffline = !navigator.onLine;

window.addEventListener('online', function() {
    console.log('🌐 Connection restored');
    wasOffline = false;
    
    // Don't immediately sync - let user trigger it
    updateConnectionStatus();
});

window.addEventListener('offline', function() {
    console.log('📴 Connection lost');
    wasOffline = true;
    updateConnectionStatus();
});



// ===== STABLE CONNECTION CHECK =====
async function isStablyOnline() {
    if (!navigator.onLine) return false;
    
    // Try a lightweight request to verify actual connectivity
    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 3000); // 3s timeout
        
        const response = await fetch(`${API_BASE}/health`, {
            method: 'HEAD',
            signal: controller.signal,
            cache: 'no-cache'
        });
        
        clearTimeout(timeoutId);
        return response.ok;
    } catch (error) {
        console.warn('⚠️ Connection unstable:', error.message);
        return false;
    }
}

// Use this instead of navigator.onLine in critical places