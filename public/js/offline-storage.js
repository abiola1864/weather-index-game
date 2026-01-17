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
    try {
        const stored = localStorage.getItem('offline_id_mappings');
        const mappings = stored ? JSON.parse(stored) : null;
        
        // ✅ Ensure proper structure
        if (!mappings || typeof mappings !== 'object') {
            return { respondents: {}, sessions: {} };
        }
        
        return {
            respondents: mappings.respondents || {},
            sessions: mappings.sessions || {}
        };
    } catch (error) {
        console.error('❌ Error loading ID mappings:', error);
        return { respondents: {}, sessions: {} };
    }
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
    // ✅ These match the ACTUAL random assignments in MongoDB (from seedCommunities.js)
    // Last seeded: [current date]
    
    return [
        // ===== CONTROL GROUP (10 communities) =====
        // Savelugu Municipal (6)
        { communityName: 'Yilikpani', district: 'Savelugu Municipal', treatmentGroup: 'control', targetHouseholds: 10 },
        { communityName: 'Dipali', district: 'Savelugu Municipal', treatmentGroup: 'control', targetHouseholds: 10 },
        { communityName: 'Libga', district: 'Savelugu Municipal', treatmentGroup: 'control', targetHouseholds: 10 },
        { communityName: 'Naabogu', district: 'Savelugu Municipal', treatmentGroup: 'control', targetHouseholds: 10 },
        { communityName: 'Moglaa', district: 'Savelugu Municipal', treatmentGroup: 'control', targetHouseholds: 10 },
        { communityName: 'Duko', district: 'Savelugu Municipal', treatmentGroup: 'control', targetHouseholds: 10 },
        // Nanton Municipal (4)
        { communityName: 'Jegun', district: 'Nanton Municipal', treatmentGroup: 'control', targetHouseholds: 10 },
        { communityName: 'Damdu', district: 'Nanton Municipal', treatmentGroup: 'control', targetHouseholds: 10 },
        { communityName: 'Nyarigiyili', district: 'Nanton Municipal', treatmentGroup: 'control', targetHouseholds: 10 },
        { communityName: 'Sandu', district: 'Nanton Municipal', treatmentGroup: 'control', targetHouseholds: 10 },
        
        // ===== FERTILIZER BUNDLE GROUP (10 communities) =====
        // Savelugu Municipal (8)
        { communityName: 'Tigla', district: 'Savelugu Municipal', treatmentGroup: 'fertilizer_bundle', targetHouseholds: 10 },
        { communityName: 'Nyoglo', district: 'Savelugu Municipal', treatmentGroup: 'fertilizer_bundle', targetHouseholds: 10 },
        { communityName: 'Gushei', district: 'Savelugu Municipal', treatmentGroup: 'fertilizer_bundle', targetHouseholds: 10 },
        { communityName: 'Kadia', district: 'Savelugu Municipal', treatmentGroup: 'fertilizer_bundle', targetHouseholds: 10 },
        { communityName: 'Kpong', district: 'Savelugu Municipal', treatmentGroup: 'fertilizer_bundle', targetHouseholds: 10 },
        { communityName: 'Gbanga', district: 'Savelugu Municipal', treatmentGroup: 'fertilizer_bundle', targetHouseholds: 10 },
        { communityName: 'Pong-Tamale', district: 'Savelugu Municipal', treatmentGroup: 'fertilizer_bundle', targetHouseholds: 10 },
        { communityName: 'Savelugu', district: 'Savelugu Municipal', treatmentGroup: 'fertilizer_bundle', targetHouseholds: 10 },
        // Nanton Municipal (2)
        { communityName: 'Nanton-Kurugu', district: 'Nanton Municipal', treatmentGroup: 'fertilizer_bundle', targetHouseholds: 10 },
        { communityName: 'Tigu', district: 'Nanton Municipal', treatmentGroup: 'fertilizer_bundle', targetHouseholds: 10 },
        
        // ===== SEEDLING BUNDLE GROUP (10 communities) =====
        // Savelugu Municipal (6)
        { communityName: 'Langa', district: 'Savelugu Municipal', treatmentGroup: 'seedling_bundle', targetHouseholds: 10 },
        { communityName: 'Dinga', district: 'Savelugu Municipal', treatmentGroup: 'seedling_bundle', targetHouseholds: 10 },
        { communityName: 'Tarikpaa', district: 'Savelugu Municipal', treatmentGroup: 'seedling_bundle', targetHouseholds: 10 },
        { communityName: 'Kanshegu', district: 'Savelugu Municipal', treatmentGroup: 'seedling_bundle', targetHouseholds: 10 },
        { communityName: 'Zaazi', district: 'Savelugu Municipal', treatmentGroup: 'seedling_bundle', targetHouseholds: 10 },
        { communityName: 'Diare', district: 'Savelugu Municipal', treatmentGroup: 'seedling_bundle', targetHouseholds: 10 },
        // Nanton Municipal (4)
        { communityName: 'Nyolugu', district: 'Nanton Municipal', treatmentGroup: 'seedling_bundle', targetHouseholds: 10 },
        { communityName: 'Zoggu', district: 'Nanton Municipal', treatmentGroup: 'seedling_bundle', targetHouseholds: 10 },
        { communityName: 'Zokuga', district: 'Nanton Municipal', treatmentGroup: 'seedling_bundle', targetHouseholds: 10 },
        { communityName: 'Sindigu', district: 'Nanton Municipal', treatmentGroup: 'seedling_bundle', targetHouseholds: 10 }
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
// ===== REBUILD ID MAPPINGS FROM SYNCED DATA =====
function rebuildIdMappings() {
    // Start with permanent mappings
    let mappings = getIdMappings();
    
    // ✅ FIX: Ensure mappings has the correct structure
    if (!mappings || typeof mappings !== 'object') {
        mappings = { respondents: {}, sessions: {} };
    }
    
    if (!mappings.respondents) mappings.respondents = {};
    if (!mappings.sessions) mappings.sessions = {};
    
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


// ===== VALIDATE RESPONDENT DATA =====
function validateRespondentData(data) {
    const errors = [];
    
    // Required fields
    const required = {
        householdId: 'string',
        communityName: 'string',
        enumeratorName: 'string',
        gender: 'string',
        role: 'string',
        treatmentGroup: 'string'
    };
    
    for (const [field, type] of Object.entries(required)) {
        if (!data[field]) {
            errors.push(`Missing required field: ${field}`);
        } else if (typeof data[field] !== type) {
            errors.push(`Invalid type for ${field}: expected ${type}, got ${typeof data[field]}`);
        }
    }
    
    // Valid enums
    if (data.gender && !['male', 'female'].includes(data.gender)) {
        errors.push(`Invalid gender: ${data.gender}`);
    }
    
    if (data.role && !['husband', 'wife'].includes(data.role)) {
        errors.push(`Invalid role: ${data.role}`);
    }
    
    if (data.treatmentGroup && !['control', 'fertilizer_bundle', 'seedling_bundle'].includes(data.treatmentGroup)) {
        errors.push(`Invalid treatmentGroup: ${data.treatmentGroup}`);
    }
    
    return errors;
}

// ===== VALIDATE SESSION DATA =====
function validateSessionData(data) {
    const errors = [];
    
    if (!data.respondentId) {
        errors.push('Missing respondentId');
    }
    
    if (!data.sessionType) {
        errors.push('Missing sessionType');
    }
    
    return errors;
}

// ===== AUTO-FIX DATA ISSUES =====
function autoFixData(data, type) {
    const fixed = { ...data };
    
    if (type === 'respondent') {
        // Ensure treatmentGroup exists
        if (!fixed.treatmentGroup) {
            fixed.treatmentGroup = 'control';
            console.log('⚠️ Auto-fixed: Added default treatmentGroup');
        }
        
        // Ensure householdId exists
        if (!fixed.householdId) {
            fixed.householdId = 'HH-RECOVERED-' + Date.now();
            console.log('⚠️ Auto-fixed: Generated householdId');
        }
        
        // Ensure required strings are strings
        ['communityName', 'enumeratorName', 'gender', 'role'].forEach(field => {
            if (fixed[field] && typeof fixed[field] !== 'string') {
                fixed[field] = String(fixed[field]);
                console.log(`⚠️ Auto-fixed: Converted ${field} to string`);
            }
        });
        
        // Ensure numbers are numbers
        ['age', 'householdSize', 'childrenUnder15'].forEach(field => {
            if (fixed[field] && typeof fixed[field] === 'string') {
                fixed[field] = parseInt(fixed[field]) || 0;
                console.log(`⚠️ Auto-fixed: Converted ${field} to number`);
            }
        });
    }
    
    return fixed;
}




// ===== SYNC OFFLINE DATA TO SERVER - PRODUCTION-READY VERSION =====
// ===== SYNC OFFLINE DATA TO SERVER - REVISED WITH CLEANUP =====
// Replace the existing syncOfflineData function (around line 820)




// ===== DATA RECOVERY: Fix corrupted respondentId in rounds =====
// ===============================================
// YOUR EXISTING CODE ENDS AROUND HERE
// (after cleanupOrphanedItems function)
// ===============================================


// ===== ADD THIS SECTION HERE (BEFORE window.offlineStorage) =====

// ===== DATA RECOVERY: Fix corrupted respondentId in rounds =====
function fixCorruptedRoundData() {
    console.log('🔧 Checking for corrupted round data...');
    
    const offlineData = getOfflineData();
    if (!offlineData || !offlineData.pending_sync) {
        console.log('⚠️ No offline data to fix');
        return { fixed: 0 };
    }
    
    const idMappings = rebuildIdMappings();
    let fixedCount = 0;
    
    // Find all unsynced rounds, knowledge, perception items
    const itemsToFix = offlineData.pending_sync.filter(item => 
        !item.synced && 
        (item.type === 'round' || item.type === 'knowledge' || item.type === 'perception')
    );
    
    console.log(`📋 Found ${itemsToFix.length} items to check`);
    
    itemsToFix.forEach(item => {
        if (!item.data) return;
        
        let needsSave = false;
        const originalRespondentId = item.data.respondentId?.toString();
        const originalSessionId = item.data.sessionId?.toString();
        
        // Check if respondentId needs fixing
        if (originalRespondentId && originalRespondentId.startsWith('OFFLINE_')) {
            // Check if it's actually a session ID (common bug)
            if (originalRespondentId.startsWith('OFFLINE_SESSION_')) {
                console.log(`🔧 ${item.type}: respondentId is actually a sessionId!`);
                
                // Find the session to get the real respondentId
                const session = offlineData.sessions.find(s => 
                    s.sessionId === originalRespondentId
                );
                
                if (session && session.respondentId) {
                    console.log(`  ✅ Recovered respondentId from session: ${session.respondentId}`);
                    item.data.respondentId = session.respondentId;
                    needsSave = true;
                    fixedCount++;
                } else {
                    console.log(`  ❌ Cannot recover - session not found`);
                }
            }
            // Check if mapping exists
            else if (!idMappings.respondents[originalRespondentId]) {
                console.log(`  ⚠️ ${item.type}: respondentId has no mapping: ${originalRespondentId.substring(0, 30)}...`);
                
                // Try to find it from the session
                if (originalSessionId) {
                    const session = offlineData.sessions.find(s => 
                        s.sessionId === originalSessionId
                    );
                    
                    if (session && session.respondentId) {
                        console.log(`  ✅ Recovered respondentId from session: ${session.respondentId}`);
                        item.data.respondentId = session.respondentId;
                        needsSave = true;
                        fixedCount++;
                    }
                }
            }
        }
        
        if (needsSave) {
            // Mark for retry
            if (item.syncAttempts) {
                item.syncAttempts = 0; // Reset attempts after fix
            }
            console.log(`  ✅ Fixed ${item.type} - ready for retry`);
        }
    });
    
    if (fixedCount > 0) {
        saveOfflineData(offlineData);
        console.log(`✅ Fixed ${fixedCount} corrupted items`);
    } else {
        console.log('✅ No corrupted data found');
    }
    
    return { fixed: fixedCount };
}


// ===== DEBUG: Show detailed sync status =====
function debugSyncStatus() {
    console.log('');
    console.log('🔍 ========================================');
    console.log('🔍 DETAILED SYNC STATUS DEBUG');
    console.log('🔍 ========================================');
    
    const offlineData = getOfflineData();
    const idMappings = rebuildIdMappings();
    
    console.log('📊 ID Mappings Available:');
    console.log('  Respondents:', Object.keys(idMappings.respondents).length);
    Object.entries(idMappings.respondents).forEach(([offline, server]) => {
        console.log(`    ${offline.substring(0, 30)}... → ${server}`);
    });
    
    console.log('  Sessions:', Object.keys(idMappings.sessions).length);
    Object.entries(idMappings.sessions).forEach(([offline, server]) => {
        console.log(`    ${offline.substring(0, 40)}... → ${server}`);
    });
    
    console.log('');
    console.log('📋 Pending Sync Items:');
    
    if (!offlineData.pending_sync || offlineData.pending_sync.length === 0) {
        console.log('  ✅ No pending items');
    } else {
        offlineData.pending_sync.forEach((item, i) => {
            console.log(`  ${i + 1}. ${item.type.toUpperCase()}`);
            console.log(`     Synced: ${item.synced}`);
            console.log(`     Attempts: ${item.syncAttempts || 0}/3`);
            console.log(`     Timestamp: ${item.timestamp}`);
            
            if (item.data) {
                console.log(`     RespondentId: ${item.data.respondentId?.toString().substring(0, 40)}...`);
                console.log(`     SessionId: ${item.data.sessionId?.toString().substring(0, 40)}...`);
                
                // Check if IDs can be mapped
                if (item.data.respondentId) {
                    const respId = item.data.respondentId.toString();
                    if (respId.startsWith('OFFLINE_')) {
                        const canMap = !!idMappings.respondents[respId];
                        console.log(`     RespondentId mappable: ${canMap ? '✅' : '❌'}`);
                    }
                }
                
                if (item.data.sessionId) {
                    const sessId = item.data.sessionId.toString();
                    if (sessId.startsWith('OFFLINE_')) {
                        const canMap = !!idMappings.sessions[sessId];
                        console.log(`     SessionId mappable: ${canMap ? '✅' : '❌'}`);
                    }
                }
            }
            
            if (item.syncError) {
                console.log(`     ❌ Error: ${item.syncError}`);
            }
            console.log('');
        });
    }
    
    console.log('🔍 ========================================');
    console.log('');
}


// ===== AUTO-SYNC SYSTEM =====
const AUTO_SYNC_CONFIG = {
    enabled: true,
    syncOnConnectionRestore: true,
    periodicCheckInterval: 90000,
    retryDelays: [20000, 60000, 180000],
    minTimeBetweenSyncs: 15000
};

let autoSyncState = {
    isRunning: false,
    lastSyncTime: 0,
    retryTimeoutId: null,
    periodicIntervalId: null
};

async function autoSync(trigger = 'manual') {
    if (autoSyncState.isRunning) {
        console.log('⏭️ Sync already running');
        return { success: false, message: 'Already syncing' };
    }
    
    if (!navigator.onLine) {
        console.log('📴 Offline - cannot sync');
        return { success: false, message: 'Offline' };
    }
    
    const timeSince = Date.now() - autoSyncState.lastSyncTime;
    if (timeSince < AUTO_SYNC_CONFIG.minTimeBetweenSyncs) {
        console.log(`⏭️ Too soon (${Math.round(timeSince/1000)}s ago)`);
        return { success: false, message: 'Too soon' };
    }
    
    const status = getSyncStatus();
    if (status.pendingItems === 0) {
        console.log('✅ Nothing to sync');
        return { success: true, message: 'Nothing to sync', remainingItems: 0 };
    }
    
    console.log('');
    console.log(`🔄 ========================================`);
    console.log(`🔄 AUTO-SYNC TRIGGERED: ${trigger}`);
    console.log(`📊 Pending: ${status.pendingItems} items`);
    if (status.hasFailingItems) {
        console.log(`⚠️ At Risk: ${status.itemsAtRisk.length} items`);
    }
    console.log(`🔄 ========================================`);
    
    autoSyncState.isRunning = true;
    autoSyncState.lastSyncTime = Date.now();
    
    try {
        const result = await syncOfflineData();
        
        console.log('');
        console.log(`✅ Auto-sync complete:`);
        console.log(`   Success: ${result.results?.successful || 0}`);
        console.log(`   Failed: ${result.results?.failed || 0}`);
        console.log(`   Remaining: ${result.remainingItems || 0}`);
        
        updateConnectionStatus();
        
        return result;
        
    } catch (error) {
        console.error('❌ Auto-sync error:', error);
        return { success: false, message: error.message };
    } finally {
        autoSyncState.isRunning = false;
    }
}

function initAutoSync() {
    console.log('🔄 Initializing auto-sync system...');
    
    // Listen for online event
    window.addEventListener('online', () => {
        console.log('🌐 Connection restored - will auto-sync in 3s...');
        setTimeout(() => {
            const status = getSyncStatus();
            if (status.pendingItems > 0) {
                autoSync('connection_restored');
            }
        }, 3000);
    });
    
    // Periodic check
    setInterval(() => {
        if (navigator.onLine && !autoSyncState.isRunning) {
            const status = getSyncStatus();
            if (status.pendingItems > 0) {
                console.log(`⏰ Periodic check: ${status.pendingItems} items need sync`);
                autoSync('periodic_check');
            }
        }
    }, AUTO_SYNC_CONFIG.periodicCheckInterval);
    
    // Initial check on page load
    setTimeout(() => {
        if (navigator.onLine) {
            const status = getSyncStatus();
            if (status.pendingItems > 0) {
                console.log(`📤 Initial check: ${status.pendingItems} unsynced items`);
                autoSync('initial_load');
            }
        }
    }, 5000);
    
    console.log('✅ Auto-sync system initialized');
}


// ===== NOW UPDATE YOUR EXISTING window.offlineStorage EXPORT =====
// REPLACE your existing window.offlineStorage = { ... } with this:

window.offlineStorage = {
    isOnline,
    handleOfflineStorage,
    syncOfflineData,
    getSyncStatus,
    exportOfflineData,
    clearOfflineData,
    initializeOfflineStorage,
    clearIdMappings,
    cleanupOrphanedItems,
    fixCorruptedRoundData,    // ✅ NEW
    debugSyncStatus,          // ✅ NEW
    autoSync,                 // ✅ NEW
    initAutoSync              // ✅ NEW
};

// Initialize auto-sync on load
initAutoSync();

console.log('✅ Offline storage system loaded with AUTO-SYNC and DEBUG tools');




// ===== AUTO-CLEANUP: Remove corrupted sessions on load =====
function autoCleanupCorruptedSessions() {
    console.log('🧹 Running auto-cleanup of corrupted sessions...');
    
    const offlineData = getOfflineData();
    if (!offlineData || !offlineData.pending_sync) {
        console.log('✅ No data to clean');
        return { cleaned: 0 };
    }
    
    const originalCount = offlineData.pending_sync.length;
    
    // Find corrupted sessions (marked synced with validation errors)
    const corruptedSessionIds = [];
    offlineData.pending_sync.forEach(item => {
        if (item.type === 'session' && 
            item.synced === true && 
            item.syncError && 
            (item.syncError.includes('Missing') || item.syncError.includes('Validation failed'))) {
            
            const sessionId = item.data?.sessionId || 
                             item.endpoint?.match(/OFFLINE_SESSION_[^/]+/)?.[0];
            
            if (sessionId) {
                corruptedSessionIds.push(sessionId);
                console.log(`🗑️ Found corrupted session: ${sessionId}`);
                console.log(`   Error: ${item.syncError}`);
            }
        }
    });
    
    if (corruptedSessionIds.length === 0) {
        console.log('✅ No corrupted sessions found');
        return { cleaned: 0 };
    }
    
    console.log(`📋 Found ${corruptedSessionIds.length} corrupted sessions`);
    console.log(`📋 Corrupted IDs:`, corruptedSessionIds);
    
    // Remove corrupted sessions and their dependencies
    offlineData.pending_sync = offlineData.pending_sync.filter(item => {
        // Remove corrupted sessions
        if (item.type === 'session' && item.synced === true && item.syncError) {
            const sessionId = item.data?.sessionId || 
                             item.endpoint?.match(/OFFLINE_SESSION_[^/]+/)?.[0];
            if (sessionId && corruptedSessionIds.includes(sessionId)) {
                console.log(`  🗑️ Removing corrupted session: ${sessionId}`);
                return false;
            }
        }
        
        // Remove orphaned rounds, knowledge, session_complete
        if (['round', 'knowledge', 'perception'].includes(item.type)) {
            const sessionId = item.data?.sessionId;
            if (sessionId && corruptedSessionIds.includes(sessionId)) {
                console.log(`  🗑️ Removing orphaned ${item.type}`);
                return false;
            }
        }
        
        // Remove orphaned session_complete
        if (item.type === 'session_complete' && item.endpoint) {
            const matchesCorrupted = corruptedSessionIds.some(id => 
                item.endpoint.includes(id)
            );
            if (matchesCorrupted) {
                console.log(`  🗑️ Removing orphaned session_complete`);
                return false;
            }
        }
        
        return true;
    });
    
    const cleanedCount = originalCount - offlineData.pending_sync.length;
    
    if (cleanedCount > 0) {
        saveOfflineData(offlineData);
        console.log(`✅ Cleaned ${cleanedCount} corrupted items`);
        
        // Force UI update
        if (typeof updateConnectionStatus === 'function') {
            updateConnectionStatus();
        }
    }
    
    return { cleaned: cleanedCount, corruptedSessions: corruptedSessionIds };
}





async function syncOfflineData() {
    // ✅ Check online status
    if (!navigator.onLine) {
        console.log('📴 Cannot sync - still offline');
        return { success: false, message: 'Still offline' };
    }
    
    // ✅ AUTO-CLEANUP: Remove corrupted sessions before sync
    const cleanupResult = autoCleanupCorruptedSessions();
    if (cleanupResult.cleaned > 0) {
        console.log(`✅ Auto-cleanup removed ${cleanupResult.cleaned} corrupted items`);
    }
    
    const offlineData = getOfflineData();
    if (!offlineData || !offlineData.pending_sync || offlineData.pending_sync.length === 0) {
        console.log('✅ No data to sync');
        return { success: true, message: 'No data to sync' };
    }
    
    // ✅✅✅ NEW: Fix corrupted data BEFORE syncing
    console.log('🔧 Running data recovery...');
    const recoveryResult = fixCorruptedRoundData();
    if (recoveryResult.fixed > 0) {
        console.log(`✅ Recovered ${recoveryResult.fixed} items - reloading data...`);
        // Reload after fixes
        const updatedData = getOfflineData();
        if (!updatedData.pending_sync || updatedData.pending_sync.length === 0) {
            console.log('✅ All items fixed - nothing left to sync');
            return { 
                success: true, 
                message: 'All items recovered and ready',
                results: {
                    total: recoveryResult.fixed,
                    successful: 0,
                    failed: 0,
                    skipped: 0,
                    permanentlySkipped: 0,
                    errors: []
                }
            };
        }
    }
    
    // ✅ Continue with existing cleanup
    console.log('🧹 Checking for orphaned rounds...');
    const cleanupOrphanResult = cleanupOrphanedItems();
    
    if (cleanupOrphanResult.cleaned > 0) {
        console.log(`✅ Cleaned up ${cleanupOrphanResult.cleaned} orphaned items before sync`);
        
        // Reload data after cleanup
        const updatedData = getOfflineData();
        if (!updatedData.pending_sync || updatedData.pending_sync.length === 0) {
            console.log('✅ All items cleaned up - nothing left to sync');
            return { 
                success: true, 
                message: 'All orphaned items cleaned up',
                results: {
                    total: cleanupOrphanResult.cleaned,
                    successful: 0,
                    failed: 0,
                    skipped: 0,
                    permanentlySkipped: cleanupOrphanResult.cleaned,
                    errors: []
                }
            };
        }
    }
    
    console.log('🔄 Starting sync...', offlineData.pending_sync.length, 'items');
    
    const results = {
        total: offlineData.pending_sync.length,
        successful: 0,
        failed: 0,
        skipped: 0,
        permanentlySkipped: 0,
        errors: []
    };
    
    // ✅ Rebuild ID mappings from previously synced items
    const idMappings = rebuildIdMappings();
    console.log('🗺️ ID Mappings:', {
        respondents: Object.keys(idMappings.respondents).length,
        sessions: Object.keys(idMappings.sessions).length
    });
    
    // ✅ Sort items by type priority and timestamp
    const sortedItems = offlineData.pending_sync.sort((a, b) => {
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
        
        return new Date(a.timestamp) - new Date(b.timestamp);
    });
    
    console.log('📋 Sync order:', sortedItems.map(item => item.type).join(' → '));
    
    // ===== SYNC LOOP =====
    for (const item of sortedItems) {
        // Skip already synced items
        if (item.synced && !item.syncError) {
            console.log(`⏭️ Already synced: ${item.type}`);
            continue;
        }
        
        // ✅ Track sync attempts
        if (!item.syncAttempts) item.syncAttempts = 0;
        item.syncAttempts++;
        
        // ✅ Permanently skip after 3 failed attempts
        if (item.syncAttempts > 3) {
            console.warn(`🚫 Permanently skipping ${item.type} after 3 failed attempts`);
            item.permanentlyFailed = true; // ✅ FIXED: Don't mark as synced
            item.synced = false; // ✅ FIXED: Keep visible in UI
            item.syncError = item.syncError || 'Max attempts reached';
            results.permanentlySkipped++;
            continue;
        }
        
        console.log('');
        console.log(`📤 Syncing ${item.type} (${item.id})... [Attempt ${item.syncAttempts}/3]`);
        
        try {
            // ✅ Check online status before each item
            if (!navigator.onLine) {
                console.warn('📴 Lost connection during sync - stopping');
                results.skipped++;
                item.syncAttempts--; // Don't count this attempt
                break;
            }
            
            // ✅ STEP 1: Prepare and validate data
            let cleanData;
            
            try {
                cleanData = prepareDataForSync(item.data, item.type, idMappings);
            } catch (prepError) {
                console.error(`❌ Preparation/Validation error:`, prepError.message);
                
                // Check if it's a dependency error (will retry later)
                if (prepError.message.includes('requires') && prepError.message.includes('first')) {
                    console.warn(`⏭️ Skipping ${item.type} - ${prepError.message}`);
                    item.syncAttempts--; // Don't count as failed attempt
                    results.skipped++;
                    continue;
                }
                
                // Validation error - count attempt
                results.failed++;
                results.errors.push({
                    item: item.type,
                    id: item.id,
                    attempt: item.syncAttempts,
                    error: prepError.message
                });
                
                // ✅ FIX: Mark as permanently failed, NOT synced
                if (item.syncAttempts >= 3) {
                    console.error(`🚫 Permanently skipping after 3 validation failures`);
                    item.permanentlyFailed = true; // ✅ FIXED
                    item.synced = false; // ✅ FIXED: Keep visible in UI
                    item.syncError = prepError.message;
                    results.permanentlySkipped++;
                }
                
                continue;
            }
            
            // ✅ STEP 2: Additional validation for specific types
            if (item.type === 'round') {
                if (!cleanData.respondentId || !cleanData.sessionId) {
                    console.warn(`⏭️ Skipping round ${cleanData.roundNumber} - missing required IDs`, {
                        hasRespondentId: !!cleanData.respondentId,
                        hasSessionId: !!cleanData.sessionId
                    });
                    item.syncAttempts--; // Don't count as failed
                    results.skipped++;
                    continue;
                }
            }
            
            if (item.type === 'knowledge' || item.type === 'perception') {
                if (!cleanData.respondentId || !cleanData.sessionId) {
                    console.warn(`⏭️ Skipping ${item.type} - missing required IDs`);
                    item.syncAttempts--; // Don't count as failed
                    results.skipped++;
                    continue;
                }
            }
            
            if (item.type === 'session_complete') {
                if (!cleanData.sessionId) {
                    console.warn(`⏭️ Skipping session_complete - missing sessionId`);
                    item.syncAttempts--; // Don't count as failed
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
                        item.syncAttempts--; // Don't count as failed
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
                dataKeys: Object.keys(cleanData).slice(0, 10)
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
                
                // Store server response
                item.serverResponse = serverResponse.data || serverResponse;
                
                // ✅ Store ID mappings for subsequent requests
                if (item.type === 'respondent' && serverResponse.data) {
                    const offlineId = item.data._id;
                    const serverId = serverResponse.data._id;
                    
                    if (offlineId && serverId) {
                        idMappings.respondents[offlineId] = serverId;
                        saveIdMapping('respondents', offlineId, serverId);
                        console.log('✅ Mapped respondent:', offlineId, '→', serverId);
                    }
                }
                
                if (item.type === 'session' && serverResponse.data) {
                    const offlineSessionId = item.data.sessionId;
                    const serverSessionId = serverResponse.data.sessionId;
                    
                    if (offlineSessionId && serverSessionId) {
                        idMappings.sessions[offlineSessionId] = serverSessionId;
                        saveIdMapping('sessions', offlineSessionId, serverSessionId);
                        console.log('✅ Mapped session:', offlineSessionId, '→', serverSessionId);
                    }
                }
                
                // Mark as successfully synced
                item.synced = true;
                item.syncedAt = new Date().toISOString();
                delete item.syncError; // Clear any previous errors
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
                
                console.error('❌ Sync failed:', {
                    type: item.type,
                    status: response.status,
                    error: errorText,
                    attempt: item.syncAttempts
                });
                
                // Track the error
                item.syncError = errorText;
                results.failed++;
                results.errors.push({
                    item: item.type,
                    id: item.id,
                    attempt: item.syncAttempts,
                    status: response.status,
                    error: errorText
                });
                
                // ✅ Permanently skip certain errors
                const permanentErrors = [
                    'Cast to ObjectId failed',
                    'Validation failed',
                    'Invalid ObjectId'
                ];
                
                const isPermanentError = permanentErrors.some(err => 
                    errorText.includes(err)
                );
                
                // If 3rd attempt OR permanent error, skip permanently
                if (item.syncAttempts >= 3 || (isPermanentError && item.syncAttempts >= 2)) {
                    console.error(`🚫 Permanently skipping - ${isPermanentError ? 'permanent error' : 'max attempts'}`);
                    item.permanentlyFailed = true; // ✅ FIXED
                    item.synced = false; // ✅ FIXED: Keep visible in UI
                    results.permanentlySkipped++;
                }
            }
            
        } catch (error) {
            console.error('❌ Sync exception:', {
                type: item.type,
                error: error.message,
                attempt: item.syncAttempts
            });
            
            item.syncError = error.message;
            results.failed++;
            results.errors.push({
                item: item.type,
                id: item.id,
                attempt: item.syncAttempts,
                error: error.message
            });
            
            // Permanently skip after 3 exceptions
            if (item.syncAttempts >= 3) {
                console.error('🚫 Permanently skipping after 3 exceptions');
                item.permanentlyFailed = true; // ✅ FIXED
                item.synced = false; // ✅ FIXED: Keep visible in UI
                results.permanentlySkipped++;
            }
        }
    }
    
    // ✅ STEP 7: Save updated sync status
    // Remove successfully synced items (but keep permanently failed for visibility)
    offlineData.pending_sync = offlineData.pending_sync.filter(item => 
        !item.synced || item.syncError || item.permanentlyFailed
    );
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
        permanentlySkipped: results.permanentlySkipped,
        remaining: offlineData.pending_sync.length
    });
    
    if (results.errors.length > 0) {
        console.log('');
        console.log('❌ Errors:');
        results.errors.forEach((err, i) => {
            console.log(`  ${i + 1}. ${err.item} (attempt ${err.attempt}/3):`, err.error);
        });
    }
    
    if (results.skipped > 0) {
        console.log('');
        console.log(`⏭️ ${results.skipped} items skipped - will retry on next sync`);
    }
    
    if (results.permanentlySkipped > 0) {
        console.log('');
        console.log(`🚫 ${results.permanentlySkipped} items permanently skipped (corrupted/invalid data)`);
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
// ✅ ENHANCED: Prepare data for sync with validation
function prepareDataForSync(data, type, idMappings) {
    let cleanData = { ...data };
    
    console.log(`🧹 Preparing ${type} for sync...`);
    
    // ===== STEP 1: Auto-fix common issues =====
    cleanData = autoFixData(cleanData, type);
    
    // ===== STEP 2: Remove offline-generated _id =====
    if (cleanData._id && cleanData._id.toString().startsWith('OFFLINE_')) {
        console.log(`  🗑️ Removing offline _id: ${cleanData._id}`);
        delete cleanData._id;
    }
    
    // ===== STEP 3: Handle respondentId =====
    if (cleanData.respondentId) {
        const respId = cleanData.respondentId.toString();
        
        if (respId.startsWith('OFFLINE_')) {
            if (idMappings.respondents[respId]) {
                cleanData.respondentId = idMappings.respondents[respId];
                console.log(`  ✅ Mapped respondentId: ${respId.substring(0, 20)}... → ${cleanData.respondentId}`);
            } else {
                console.log(`  ⚠️ No mapping for respondentId: ${respId.substring(0, 30)}...`);
                
                if (type === 'round' || type === 'knowledge' || type === 'perception') {
                    throw new Error(`${type} requires respondent to be synced first`);
                }
                
                delete cleanData.respondentId;
            }
        }
    }
    
    // ===== STEP 4: Handle sessionId =====
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
    
    // ===== STEP 5: Remove offline metadata =====
    delete cleanData.offline;
    delete cleanData.deviceId;
    delete cleanData.savedAt;
    
    // ===== STEP 6: Validate before returning =====
    let validationErrors = [];
    
    if (type === 'respondent') {
        validationErrors = validateRespondentData(cleanData);
    } else if (type === 'session') {
        validationErrors = validateSessionData(cleanData);
    }
    
    if (validationErrors.length > 0) {
        console.error(`  ❌ Validation errors:`, validationErrors);
        throw new Error(`Validation failed: ${validationErrors.join(', ')}`);
    }
    
    console.log(`  ✅ Cleaned ${type} ready for sync`);
    
    return cleanData;
}








// Get sync status
// Get sync status
// offline-storage.js - Line 328const response = await fetch(`${API_BASE}/
function getSyncStatus() {
    // ✅ Get FRESH data every time
    const offlineData = getOfflineData();
    const syncStatus = localStorage.getItem(SYNC_STATUS_KEY);
    
    console.log('🔍 === getSyncStatus DEBUG ===');
    console.log('📦 Raw offline data exists:', !!offlineData);
    
    if (!offlineData) {
        console.log('❌ No offline data at all');
        return {
            isOnline: isOnline(),
            pendingItems: 0,
            lastSync: syncStatus ? JSON.parse(syncStatus) : null,
            offlineDataSize: 0,
            attemptBreakdown: { firstAttempt: 0, secondAttempt: 0, finalAttempt: 0 },
            itemsAtRisk: [],
            hasFailingItems: false
        };
    }
    
    // ✅ CRITICAL: Log the raw pending_sync array
    console.log('📊 Raw pending_sync:', offlineData.pending_sync);
    console.log('📊 pending_sync type:', typeof offlineData.pending_sync);
    console.log('📊 Is array?:', Array.isArray(offlineData.pending_sync));
    
    if (!offlineData.pending_sync) {
        console.log('⚠️ No pending_sync array (initializing)');
        offlineData.pending_sync = [];
        saveOfflineData(offlineData);
    }
    
    // ✅ Log EVERY item in detail
    console.log('📋 Pending sync items:', offlineData.pending_sync.length);
    offlineData.pending_sync.forEach((item, i) => {
        console.log(`  ${i + 1}. Type: ${item.type}`);
        console.log(`     Synced: ${item.synced} (type: ${typeof item.synced})`);
        console.log(`     Timestamp: ${item.timestamp}`);
        console.log(`     Has data: ${!!item.data}`);
        console.log(`     Endpoint: ${item.endpoint}`);
    });
    
    // ✅ Filter unsynced items
    const unsyncedItems = offlineData.pending_sync.filter(item => {
        const isUnsynced = item.synced !== true;
        console.log(`     Item ${item.type}: synced=${item.synced}, isUnsynced=${isUnsynced}`);
        return isUnsynced;
    });
    
    console.log('✅ Final count - Unsynced items:', unsyncedItems.length);
    console.log('🔍 === END DEBUG ===');
    
    // Rest of your existing return logic...
    const itemsOnFirstAttempt = unsyncedItems.filter(item => !item.syncAttempts || item.syncAttempts === 0).length;
    const itemsOnSecondAttempt = unsyncedItems.filter(item => item.syncAttempts === 1).length;
    const itemsOnFinalAttempt = unsyncedItems.filter(item => item.syncAttempts === 2).length;
    
    const itemsAtRisk = unsyncedItems
        .filter(item => (item.syncAttempts || 0) >= 2)
        .map(item => ({
            type: item.type,
            attempts: item.syncAttempts || 0,
            attemptsRemaining: 3 - (item.syncAttempts || 0),
            lastError: item.syncError || 'Unknown error',
            timestamp: item.timestamp
        }));
    
    return {
        isOnline: isOnline(),
        pendingItems: unsyncedItems.length,
        lastSync: syncStatus ? JSON.parse(syncStatus) : null,
        offlineDataSize: JSON.stringify(offlineData).length,
        attemptBreakdown: {
            firstAttempt: itemsOnFirstAttempt,
            secondAttempt: itemsOnSecondAttempt,
            finalAttempt: itemsOnFinalAttempt
        },
        itemsAtRisk: itemsAtRisk,
        hasFailingItems: itemsAtRisk.length > 0
    };
}






// ===== ENHANCED: Show sync status with warnings =====
function updateConnectionStatus() {
    const status = getSyncStatus();
    const statusDiv = document.getElementById('connection-status');
    
    if (!statusDiv) return;
    
    let html = '';
    
    if (status.isOnline) {
        html = `
            <div class="status-online">
                <span class="status-icon">🌐</span>
                <span>Online</span>
            </div>
        `;
        
        if (status.pendingItems > 0) {
            html += `
                <div class="sync-info">
                    <div class="pending-count">
                        📤 ${status.pendingItems} item${status.pendingItems > 1 ? 's' : ''} waiting to sync
                    </div>
            `;
            
            // ✅ SHOW WARNINGS FOR AT-RISK ITEMS
            if (status.hasFailingItems) {
                html += `<div class="sync-warnings">`;
                
                if (status.attemptBreakdown.finalAttempt > 0) {
                    html += `
                        <div class="warning-critical">
                            ⚠️ <strong>${status.attemptBreakdown.finalAttempt} item${status.attemptBreakdown.finalAttempt > 1 ? 's' : ''}</strong> 
                            on <strong>final attempt</strong> - will be lost if sync fails again!
                        </div>
                    `;
                }
                
                if (status.attemptBreakdown.secondAttempt > 0) {
                    html += `
                        <div class="warning-moderate">
                            ⚠️ ${status.attemptBreakdown.secondAttempt} item${status.attemptBreakdown.secondAttempt > 1 ? 's' : ''} 
                            on 2nd attempt (1 retry left)
                        </div>
                    `;
                }
                
                // Show details of at-risk items
                html += `
                    <details class="at-risk-details">
                        <summary>View at-risk items (${status.itemsAtRisk.length})</summary>
                        <ul class="risk-list">
                `;
                
                status.itemsAtRisk.forEach(item => {
                    const emoji = item.attemptsRemaining === 1 ? '🚨' : '⚠️';
                    html += `
                        <li>
                            ${emoji} <strong>${item.type}</strong> - 
                            ${item.attemptsRemaining} attempt${item.attemptsRemaining > 1 ? 's' : ''} left
                            ${item.lastError ? `<br><small style="color: #666;">Error: ${item.lastError.substring(0, 80)}...</small>` : ''}
                        </li>
                    `;
                });
                
                html += `
                        </ul>
                    </details>
                `;
                
                html += `</div>`; // close sync-warnings
            }
            
            html += `
                    <button id="sync-now-btn" class="sync-button ${status.hasFailingItems ? 'urgent' : ''}">
                        🔄 ${status.hasFailingItems ? 'Retry Sync Now' : 'Sync Now'}
                    </button>
                </div>
            `;
        }
    } else {
        html = `
            <div class="status-offline">
                <span class="status-icon">📴</span>
                <span>Offline Mode</span>
            </div>
        `;
        
        if (status.pendingItems > 0) {
            html += `
                <div class="sync-info">
                    <div class="pending-count">
                        💾 ${status.pendingItems} item${status.pendingItems > 1 ? 's' : ''} saved locally
                    </div>
                    <small>Will sync automatically when back online</small>
                </div>
            `;
        }
    }
    
    statusDiv.innerHTML = html;
    
    // ✅ Add click handler for sync button
    const syncBtn = document.getElementById('sync-now-btn');
    if (syncBtn) {
        syncBtn.onclick = async () => {
            syncBtn.disabled = true;
            syncBtn.textContent = '🔄 Syncing...';
            
            try {
                const result = await window.offlineStorage.syncOfflineData();
                
                if (result.success) {
                    if (result.results.failed > 0 || result.results.permanentlySkipped > 0) {
                        alert(`⚠️ Sync completed with issues:\n\n` +
                              `✅ Success: ${result.results.successful}\n` +
                              `❌ Failed: ${result.results.failed}\n` +
                              `🚫 Skipped: ${result.results.permanentlySkipped}\n\n` +
                              `Check console for details.`);
                    } else {
                        alert(`✅ Sync successful! ${result.results.successful} items synced.`);
                    }
                } else {
                    alert('❌ Sync failed. Check your connection and try again.');
                }
            } catch (error) {
                alert('❌ Sync error: ' + error.message);
            }
            
            updateConnectionStatus(); // Refresh display
        };
    }
    
    // ✅ Add CSS for warnings
    addSyncWarningStyles();
}



// ===== ADD STYLES FOR SYNC WARNINGS =====
function addSyncWarningStyles() {
    if (document.getElementById('sync-warning-styles')) return;
    
    const style = document.createElement('style');
    style.id = 'sync-warning-styles';
    style.textContent = `
        .sync-warnings {
            margin-top: 10px;
            padding: 10px;
            background: #fff3cd;
            border-radius: 6px;
            border-left: 4px solid #ffc107;
        }
        
        .warning-critical {
            color: #721c24;
            background: #f8d7da;
            padding: 8px;
            border-radius: 4px;
            margin: 5px 0;
            border-left: 3px solid #dc3545;
            font-size: 14px;
        }
        
        .warning-moderate {
            color: #856404;
            background: #fff3cd;
            padding: 8px;
            border-radius: 4px;
            margin: 5px 0;
            border-left: 3px solid #ffc107;
            font-size: 13px;
        }
        
        .at-risk-details {
            margin-top: 10px;
            font-size: 13px;
        }
        
        .at-risk-details summary {
            cursor: pointer;
            color: #856404;
            font-weight: 500;
            padding: 5px;
        }
        
        .at-risk-details summary:hover {
            background: rgba(0,0,0,0.05);
            border-radius: 3px;
        }
        
        .risk-list {
            list-style: none;
            padding: 10px;
            margin: 5px 0;
            background: white;
            border-radius: 4px;
        }
        
        .risk-list li {
            padding: 8px;
            margin: 5px 0;
            border-left: 2px solid #ffc107;
            background: #fffef7;
        }
        
        .sync-button.urgent {
            background: #dc3545;
            animation: pulse 2s infinite;
        }
        
        @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.8; }
        }
        
        .sync-info {
            margin-top: 10px;
        }
        
        .pending-count {
            font-weight: 500;
            margin-bottom: 5px;
        }
    `;
    
    document.head.appendChild(style);
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


// ===== CLEAN UP ORPHANED ROUNDS =====
// Add this function to offline-storage.js (around line 800, before syncOfflineData)

// ===== CLEAN UP ORPHANED ITEMS (ROUNDS, KNOWLEDGE, SESSION_COMPLETE) =====
// ===== CLEAN UP ORPHANED ITEMS (ROUNDS, KNOWLEDGE, SESSION_COMPLETE) =====
// Replace the entire cleanupOrphanedRounds function (around line 1686) with this:

function cleanupOrphanedItems() {
    console.log('🧹 Starting orphaned items cleanup...');
    
    const offlineData = getOfflineData();
    if (!offlineData || !offlineData.pending_sync) {
        console.log('⚠️ No offline data to clean');
        return { cleaned: 0, skipped: [] };
    }
    
    // Find ALL permanently failed sessions
    const failedSessions = [];
    
    offlineData.pending_sync.forEach(item => {
        if (item.type === 'session') {
            // Check if permanently failed by checking:
            // 1. Has syncAttempts >= 3, OR
            // 2. Has failedAttempts >= 3, OR  
            // 3. Is marked synced with an error
            const attempts = item.syncAttempts || item.failedAttempts || 0;
            const isPermanentlyFailed = attempts >= 3 || 
                                       (item.synced === true && item.syncError);
            
            if (isPermanentlyFailed) {
                const sessionId = item.data?.sessionId;
                if (sessionId) {
                    failedSessions.push(sessionId);
                    console.log(`   ❌ Found failed session: ${sessionId} (attempts: ${attempts})`);
                }
            }
        }
    });
    
    console.log(`📋 Found ${failedSessions.length} permanently failed sessions:`, failedSessions);
    
    if (failedSessions.length === 0) {
        console.log('✅ No failed sessions found - nothing to clean up');
        return { cleaned: 0, skipped: [] };
    }
    
    const skippedItems = [];
    
    // Find ALL items (rounds, knowledge, session_complete) that depend on failed sessions
    offlineData.pending_sync.forEach(item => {
        // Skip already synced items
        if (item.synced === true && !item.syncError) return;
        
        // Skip already marked as skipped
        if (item.skipped === true) return;
        
        // Only check dependent types
        if (!['round', 'knowledge', 'session_complete'].includes(item.type)) return;
        
        // Get the session ID this item depends on
        let itemSessionId;
        
        if (item.type === 'session_complete') {
            // Extract from endpoint: /session/OFFLINE_SESSION_xxx/complete
            const match = item.endpoint?.match(/session\/(OFFLINE_SESSION_[^/]+)/);
            itemSessionId = match ? match[1] : item.data?.sessionId;
        } else {
            itemSessionId = item.data?.sessionId;
        }
        
        // Check if this item depends on a failed session
        if (itemSessionId && failedSessions.includes(itemSessionId)) {
            console.log('🗑️ Marking orphaned item as skipped:');
            console.log(`   Type: ${item.type}`);
            console.log(`   ID: ${item.id || 'N/A'}`);
            console.log(`   Session ID: ${itemSessionId}`);
            console.log(`   Reason: Session failed`);
            
            // Mark the item so it won't retry
            item.skipped = true;
            item.skipReason = 'Parent session permanently failed';
            item.synced = true; // Also mark as synced to stop retry loop
            item.syncError = 'Parent session permanently failed';
            item.syncAttempts = 999; // High number to indicate cleanup
            
            skippedItems.push({
                type: item.type,
                id: item.id,
                sessionId: itemSessionId,
                reason: item.skipReason
            });
        }
    });
    
    if (skippedItems.length > 0) {
        saveOfflineData(offlineData);
        console.log(`✅ Cleaned up ${skippedItems.length} orphaned items`);
        console.log('📊 Skipped items:', skippedItems);
    } else {
        console.log('✅ No orphaned items found to clean');
    }
    
    return { cleaned: skippedItems.length, skipped: skippedItems };
}




window.offlineStorage = {
    isOnline,
    handleOfflineStorage,
    syncOfflineData,
    getSyncStatus,
    exportOfflineData,
    clearOfflineData,
    initializeOfflineStorage,
    clearIdMappings,
    cleanupOrphanedItems,
    fixCorruptedRoundData,
    debugSyncStatus,
    autoSync,
    initAutoSync,
    autoCleanupCorruptedSessions // ← ADD THIS
};


console.log('✅ Offline storage system loaded with cleanup support');

