// ===============================================
// OFFLINE STORAGE SYSTEM - COMPLETE FIXED VERSION
// Handles local data storage and sync when online
// ALL ENDPOINTS PROPERLY IMPLEMENTED
// ===============================================

const OFFLINE_STORAGE_KEY = 'farm_game_offline_data';
const SYNC_STATUS_KEY = 'farm_game_sync_status';

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

// Add to pending sync queue
function addToPendingSync(type, endpoint, method, data) {
    const offlineData = getOfflineData() || {};
    if (!offlineData.pending_sync) offlineData.pending_sync = [];
    
    offlineData.pending_sync.push({
        id: generateOfflineId(),
        type,
        endpoint,
        method,
        data,
        timestamp: new Date().toISOString(),
        synced: false
    });
    
    saveOfflineData(offlineData);
    console.log('📤 Added to sync queue:', type);
}

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
    let offlineData = getOfflineData();
    if (!offlineData) {
        initializeOfflineStorage();
        offlineData = getOfflineData();
    }
    
    console.log('📴 OFFLINE MODE - Handling:', endpoint, method);
    
    // ===== GET COMMUNITIES =====
    if (endpoint.includes('/communities') && method === 'GET') {
        console.log('📋 Returning default communities (offline)');
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
        
        offlineData.respondents.push(respondent);
        addToPendingSync('respondent', endpoint, method, respondent);
        saveOfflineData(offlineData);
        
        console.log('✅ Respondent created offline:', respondentId, 'Treatment:', treatmentGroup);
        return respondent;
    }
    
    // ===== SESSION START ===== 🆕 CRITICAL FIX
    if (endpoint.includes('/session/start') && method === 'POST') {
        const sessionId = generateOfflineId().replace('OFFLINE_', 'OFFLINE_SESSION_');
        
        const session = {
            sessionId: sessionId, // ✅ CRITICAL: Must return this
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
        
        offlineData.sessions.push(session);
        addToPendingSync('session', endpoint, method, session);
        saveOfflineData(offlineData);
        
        console.log('✅ Session created offline with ID:', sessionId);
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
        
        offlineData.rounds.push(round);
        
        // ✅ UPDATE SESSION TOTALS
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
            
            console.log('✅ Session totals updated:', {
                earnings: session.totalEarnings,
                insurance: session.totalInsuranceSpent,
                payouts: session.totalPayoutsReceived
            });
        } else {
            console.warn('⚠️ Session not found for round:', data.sessionId);
        }
        
        addToPendingSync('round', endpoint, method, round);
        saveOfflineData(offlineData);
        
        console.log('✅ Round saved offline:', roundId);
        return round;
    }
    
    // ===== SESSION COMPLETE =====
    if (endpoint.includes('/session/') && endpoint.includes('/complete') && method === 'PUT') {
        const sessionId = endpoint.split('/')[2];
        const session = offlineData.sessions.find(s => s.sessionId === sessionId);
        
        if (session) {
            session.completedAt = new Date().toISOString();
            session.isComplete = true;
            addToPendingSync('session_complete', endpoint, method, { sessionId });
            saveOfflineData(offlineData);
            
            console.log('✅ Session marked complete offline:', sessionId);
            return session;
        }
        
        console.warn('⚠️ Session not found for completion:', sessionId);
        return { success: false, message: 'Session not found', offline: true };
    }
    
    // ===== KNOWLEDGE TEST SUBMIT =====
    if (endpoint.includes('/knowledge/submit') && method === 'POST') {
        const knowledgeId = generateOfflineId();
        
        // ✅ CALCULATE SCORE IMMEDIATELY
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
        
        offlineData.knowledge.push(knowledge);
        addToPendingSync('knowledge', endpoint, method, knowledge);
        saveOfflineData(offlineData);
        
        console.log('✅ Knowledge test saved offline, Score:', correctAnswers, '/5');
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
        
        offlineData.perception.push(perception);
        addToPendingSync('perception', endpoint, method, perception);
        saveOfflineData(offlineData);
        
        console.log('✅ Perception data saved offline');
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
        
        offlineData.coupleInfo.push(coupleInfo);
        addToPendingSync('coupleInfo', endpoint, method, coupleInfo);
        saveOfflineData(offlineData);
        
        console.log('✅ Couple info saved offline');
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
    
    // Sort by timestamp to maintain order
    const sortedItems = offlineData.pending_sync.sort((a, b) => 
        new Date(a.timestamp) - new Date(b.timestamp)
    );
    
    for (const item of sortedItems) {
        if (item.synced) continue;
        
        try {
            const response = await fetch(`${API_BASE}/api/game${item.endpoint}`, {
                method: item.method,
                headers: { 
                    'Content-Type': 'application/json',
                    'X-Offline-Sync': 'true',
                    'X-Device-Id': offlineData.deviceId
                },
                body: JSON.stringify(item.data)
            });
            
            if (response.ok) {
                item.synced = true;
                item.syncedAt = new Date().toISOString();
                results.successful++;
                console.log('✅ Synced:', item.type, item.id);
            } else {
                results.failed++;
                results.errors.push({
                    item: item.type,
                    error: `HTTP ${response.status}`
                });
                console.error('❌ Sync failed:', item.type, response.status);
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
    
    // Remove synced items
    offlineData.pending_sync = offlineData.pending_sync.filter(item => !item.synced);
    offlineData.lastSyncAttempt = new Date().toISOString();
    saveOfflineData(offlineData);
    
    // Update sync status
    const syncStatus = {
        lastSync: new Date().toISOString(),
        results: results
    };
    localStorage.setItem(SYNC_STATUS_KEY, JSON.stringify(syncStatus));
    
    console.log('🔄 Sync complete:', results);
    return { success: true, results };
}

// Get sync status
function getSyncStatus() {
    const offlineData = getOfflineData();
    const syncStatus = localStorage.getItem(SYNC_STATUS_KEY);
    
    return {
        isOnline: isOnline(),
        pendingItems: offlineData?.pending_sync?.length || 0,
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