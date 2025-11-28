// ===============================================
// WEATHER INDEX INSURANCE GAME - COMPLETE FIXED VERSION
// Ghana Edition - 4 SEASONS
// ALL FIXES APPLIED:
// 1. Couple session ends with perception screen
// 2. Proper game ending with final results
// 3. Extended time (8s) to view weather results
// 4. Weather events random for ALL players (not just insured)
// 5. Detailed reports for ALL seasons
// ===============================================

// ===== GAME STATE =====
let gameState = {
    householdId: null,
    respondentId: null,
    sessionId: null,
    currentScreen: 'welcomeScreen',
    currentSeason: 1,
    totalSeasons: 4,
    language: 'english',
    treatmentGroup: null,
    gender: null,
    role: null,
    sessionType: null,
    demographics: {},
    empowermentScores: {},
    seasonData: [],
    firstRespondentId: null,
    firstRespondentData: null,
    secondRespondentId: null,
    coupleInfo: {
        marriageDuration: null,
        numberOfChildren: null
    }
};

// Tutorial state
let currentTutorialIndex = 0;
let tutorialCards = [];
let tutorialTimerInterval = null;
let currentTimerSeconds = null;

// Touch swipe
let touchStartX = 0;
let touchEndX = 0;

// Form submission flags
let isSubmittingKnowledge = false;

// ===== SEASON STORIES =====
const SEASON_STORIES = [
    {
        season: 1,
        seasonName: "Planting Season - March",
        story: "The planting season begins. You have 500 GHS to prepare for farming.",
        budget: 500
    },
    {
        season: 2,
        seasonName: "Growing Season - May",
        story: "Your crops are growing. Some neighbors talk about weather patterns. Budget: 550 GHS.",
        budget: 550
    },
    {
        season: 3,
        seasonName: "Mid-Season - July",
        story: "Weather reports are mixed. Many farmers are concerned. You must decide wisely. Budget: 600 GHS.",
        budget: 600
    },
    {
        season: 4,
        seasonName: "Final Season - September",
        story: "⚠️ FINAL SEASON! The rains are unpredictable. Your family's future depends on this decision! Budget: 650 GHS.",
        budget: 650
    }
];

// ===== WEATHER OUTCOMES (RANDOM FOR ALL PLAYERS) =====
const WEATHER_TYPES = {
    GOOD: { 
        type: 'normal', 
        harvestMultiplier: 1.5, 
        payoutMultiplier: 0,
        icon: '☀️',
        title: 'Good Weather!',
        desc: 'Normal rainfall. Your crops grew well!',
        color: 'linear-gradient(135deg, #FFE5B4, #4CAF50)'
    },
    MILD_DROUGHT: { 
        type: 'drought', 
        harvestMultiplier: 0.7, 
        payoutMultiplier: 0.5,
        icon: '🌤️',
        title: 'Mild Drought',
        desc: 'Below average rainfall affected your harvest.',
        color: 'linear-gradient(135deg, #FFE4B5, #FF9800)'
    },
    SEVERE_DROUGHT: { 
        type: 'drought', 
        harvestMultiplier: 0.3, 
        payoutMultiplier: 1.0,
        icon: '🔥',
        title: 'Severe Drought!',
        desc: 'Very low rainfall. Major crop damage.',
        color: 'linear-gradient(135deg, #FFCDD2, #F44336)'
    },
    FLOOD: { 
        type: 'flood', 
        harvestMultiplier: 0.5, 
        payoutMultiplier: 0.8,
        icon: '🌧️',
        title: 'Flooding!',
        desc: 'Heavy rains damaged crops.',
        color: 'linear-gradient(135deg, #BBDEFB, #2196F3)'
    }
};

// ===== BUNDLE DESCRIPTIONS =====
const BUNDLE_INFO = {
    control: {
        title: "Weather Insurance",
        description: "Protection against bad weather",
        bundleCost: 100,
        hasBundle: false, // NOT a bundle
        label: "Buy Insurance (100 GHS)",
        hasInputChoice: true // Control group chooses input type
    },
    fertilizer_bundle: {
        title: "Weather Insurance + Fertilizer Bundle",
        description: "Insurance protection PLUS 2 bags of NPK fertilizer",
        bundleCost: 100,
        hasBundle: true,
        icon: "🌾",
        label: "Buy Bundle (100 GHS)",
        hasInputChoice: false // Bundle already includes fertilizer
    },
    seedling_bundle: {
        title: "Weather Insurance + Improved Seeds Bundle",
        description: "Insurance protection PLUS hybrid maize seeds",
        bundleCost: 100,
        hasBundle: true,
        icon: "🌱",
        label: "Buy Bundle (100 GHS)",
        hasInputChoice: false // Bundle already includes seeds
    }
};









// ===== API HELPER =====
const API_BASE = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:3000'
    : window.location.origin;

console.log('🌐 API Base URL:', API_BASE);

async function apiCall(endpoint, method = 'GET', data = null) {
    try {
        const options = {
            method,
            headers: { 
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            mode: 'cors',
            credentials: 'omit'
        };
        
        if (data) options.body = JSON.stringify(data);
        
        const fullUrl = `${API_BASE}/api/game${endpoint}`;
        console.log('🌐 API Call:', method, fullUrl);
        
        const response = await fetch(fullUrl, options);
        console.log('📡 Response status:', response.status);
        
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || `Server error: ${response.status}`);
        }
        
        const result = await response.json();
        console.log('✅ API Response:', result);
        
        if (!result.success) {
            throw new Error(result.message || 'Unknown error');
        }
        
        return result.data;
    } catch (error) {
        console.error('💥 API Error:', error.message);
        if (error.message.includes('Failed to fetch')) {
            throw new Error('Cannot connect to server. Please check your connection.');
        }
        throw error;
    }
}

// ===== SCREEN MANAGEMENT =====
function showScreen(screenId) {
    console.log('Showing screen:', screenId);
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.remove('active');
    });
    const targetScreen = document.getElementById(screenId);
    if (targetScreen) {
        targetScreen.classList.add('active');
        gameState.currentScreen = screenId;
        window.scrollTo(0, 0);
    }
}

function showLoading(show = true) {
    const overlay = document.getElementById('loadingOverlay');
    if (show) {
        overlay.classList.add('active');
    } else {
        overlay.classList.remove('active');
    }
}

// ===== HOUSEHOLD ID GENERATION =====
function generateHouseholdId() {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substr(2, 6).toUpperCase();
    return `HH-${timestamp}-${random}`;
}

// ===== GAME FLOW =====
function startDemographics() {
    console.log('Start Demographics clicked');
    
    if (!gameState.householdId) {
        gameState.householdId = generateHouseholdId();
        console.log('Generated Household ID:', gameState.householdId);
    }
    
    showScreen('demographicsScreen');
}

// ===== TUTORIAL SYSTEM =====
function initializeTutorial() {
    console.log('Initializing tutorial for treatment:', gameState.treatmentGroup);
    
    const treatment = gameState.treatmentGroup || 'control';
    tutorialCards = TUTORIAL_CARDS[treatment];
    
    console.log(`Loading ${tutorialCards.length} tutorial cards for ${treatment} group`);
    
    const badge = document.getElementById('treatmentBadge');
    if (badge) {
        if (treatment === 'control') {
            badge.textContent = '📋 Standard Farming';
            badge.style.background = 'linear-gradient(135deg, #006B3F, #00A651)';
        } else if (treatment === 'fertilizer_bundle') {
            badge.textContent = '🌾 Insurance + Fertilizer Bundle';
            badge.style.background = 'linear-gradient(135deg, #FCD116, #D4AF37)';
        } else {
            badge.textContent = '🌱 Insurance + Improved Seeds Bundle';
            badge.style.background = 'linear-gradient(135deg, #FCD116, #D4AF37)';
        }
    }
    
    generateTutorialCards();
    currentTutorialIndex = 0;
    updateTutorialCardPositions();
    updateTutorialProgress();
    startTutorialTimer();
}

function generateTutorialCards() {
    const cardStack = document.getElementById('tutorialCardStack');
    if (!cardStack) return;
    
    cardStack.innerHTML = '';
    
    tutorialCards.forEach((card, index) => {
        const cardEl = document.createElement('div');
        cardEl.className = 'tutorial-card-enhanced card-hidden';
        cardEl.id = `tutorial-card-${index}`;
        
        if (card.highlight) cardEl.classList.add('card-highlight');
        if (card.critical) cardEl.classList.add('card-critical');
        if (card.special) cardEl.classList.add('card-special');
        
        let timerHTML = '';
        if (card.autoAdvanceSeconds) {
            timerHTML = `<div class="tutorial-card-timer" id="timer-${index}"></div>`;
        }
        
        cardEl.innerHTML = `
            <div class="tutorial-card-icon">${card.icon}</div>
            <h2 class="tutorial-card-title">${card.title}</h2>
            <p class="tutorial-card-content">${card.content}</p>
            ${timerHTML}
        `;
        
        cardStack.appendChild(cardEl);
    });
}

function updateTutorialCardPositions() {
    const cards = document.querySelectorAll('.tutorial-card-enhanced');
    
    cards.forEach((card, index) => {
        card.classList.remove('card-left', 'card-center', 'card-right', 'card-hidden');
        
        if (index === currentTutorialIndex - 1) {
            card.classList.add('card-left');
        } else if (index === currentTutorialIndex) {
            card.classList.add('card-center');
        } else if (index === currentTutorialIndex + 1) {
            card.classList.add('card-right');
        } else {
            card.classList.add('card-hidden');
        }
    });
    
    const leftArrow = document.getElementById('tutorialPrevBtn');
    const rightArrow = document.getElementById('tutorialNextBtn');
    
    const isFirst = currentTutorialIndex === 0;
    const isLast = currentTutorialIndex === tutorialCards.length - 1;
    
    if (leftArrow) leftArrow.disabled = isFirst;
    if (rightArrow) rightArrow.disabled = isLast;
    
    const finishBtn = document.getElementById('tutorialFinishBtn');
    if (finishBtn) {
        if (isLast) {
            finishBtn.classList.add('show');
        } else {
            finishBtn.classList.remove('show');
        }
    }
}

function nextTutorialCard() {
    if (tutorialTimerInterval) {
        clearInterval(tutorialTimerInterval);
        tutorialTimerInterval = null;
    }
    
    if (window.tutorialAnimating) return;
    window.tutorialAnimating = true;
    
    if (currentTutorialIndex < tutorialCards.length - 1) {
        currentTutorialIndex++;
        updateTutorialCardPositions();
        updateTutorialProgress();
        
        setTimeout(() => {
            startTutorialTimer();
            window.tutorialAnimating = false;
        }, 600);
    } else {
        window.tutorialAnimating = false;
    }
}

function previousTutorialCard() {
    if (tutorialTimerInterval) {
        clearInterval(tutorialTimerInterval);
        tutorialTimerInterval = null;
    }
    
    if (window.tutorialAnimating) return;
    window.tutorialAnimating = true;
    
    if (currentTutorialIndex > 0) {
        currentTutorialIndex--;
        updateTutorialCardPositions();
        updateTutorialProgress();
        
        setTimeout(() => {
            startTutorialTimer();
            window.tutorialAnimating = false;
        }, 600);
    } else {
        window.tutorialAnimating = false;
    }
}

function startTutorialTimer() {
    if (tutorialTimerInterval) {
        clearInterval(tutorialTimerInterval);
        tutorialTimerInterval = null;
    }
    
    const currentCard = tutorialCards[currentTutorialIndex];
    
    if (currentCard && currentCard.autoAdvanceSeconds) {
        currentTimerSeconds = currentCard.autoAdvanceSeconds;
        
        const timerEl = document.getElementById(`timer-${currentTutorialIndex}`);
        if (timerEl) {
            timerEl.textContent = `⏱️ ${currentTimerSeconds}s`;
        }
        
        tutorialTimerInterval = setInterval(() => {
            currentTimerSeconds--;
            
            if (timerEl) {
                timerEl.textContent = `⏱️ ${currentTimerSeconds}s`;
            }
            
            if (currentTimerSeconds <= 0) {
                clearInterval(tutorialTimerInterval);
                tutorialTimerInterval = null;
                
                if (currentTutorialIndex < tutorialCards.length - 1 && !window.tutorialAnimating) {
                    nextTutorialCard();
                }
            }
        }, 1000);
    }
}

function updateTutorialProgress() {
    const progressText = document.getElementById('tutorialProgress');
    if (progressText) {
        progressText.textContent = `${currentTutorialIndex + 1} / ${tutorialCards.length}`;
    }
    
    const dotsContainer = document.getElementById('progressDots');
    if (dotsContainer) {
        dotsContainer.innerHTML = '';
        tutorialCards.forEach((_, index) => {
            const dot = document.createElement('div');
            dot.className = 'progress-dot';
            if (index === currentTutorialIndex) dot.classList.add('active');
            dotsContainer.appendChild(dot);
        });
    }
}

function skipTutorial() {
    if (confirm('Are you sure you want to skip the tutorial?')) {
        if (tutorialTimerInterval) {
            clearInterval(tutorialTimerInterval);
            tutorialTimerInterval = null;
        }
        startGameAfterTutorial();
    }
}

function startGameAfterTutorial() {
    if (tutorialTimerInterval) {
        clearInterval(tutorialTimerInterval);
        tutorialTimerInterval = null;
    }
    startGame();
}

// ===== START GAME =====
function startGame() {
    gameState.currentSeason = 1;
    loadSeason(1);
}




// ===== RANDOMIZATION HELPER =====
function shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}






function loadSeason(seasonNumber) {
    const seasonInfo = SEASON_STORIES[seasonNumber - 1];
    const intensity = ROUND_INTENSITY[seasonNumber];
    
    console.log(`Loading Season ${seasonNumber}`);
    
    const gameScreen = document.getElementById('gameScreen');
    gameScreen.classList.remove('intensity-low', 'intensity-medium', 'intensity-high');
    gameScreen.classList.add(`intensity-${intensity.level}`);
    
    if (intensity.showWarning) {
        showFinalSeasonWarning();
    } else {
        const existingWarning = document.querySelector('.final-season-warning');
        if (existingWarning) existingWarning.remove();
    }
    
    document.getElementById('currentRound').textContent = seasonNumber;
    document.getElementById('totalRoundsDisplay').textContent = gameState.totalSeasons;
    document.getElementById('totalBudget').textContent = seasonInfo.budget;
    document.getElementById('storyText').textContent = intensity.storyText;
    
    let sessionTypeText = 'Individual Play';
    if (gameState.sessionType === 'individual_husband') {
        sessionTypeText = '👨 Husband Playing Alone';
    } else if (gameState.sessionType === 'individual_wife') {
        sessionTypeText = '👩 Wife Playing Alone';
    } else if (gameState.sessionType === 'couple_joint') {
        sessionTypeText = '👫 Couple Playing Together';
    }
    document.getElementById('roundContext').textContent = sessionTypeText;
    
    setupRandomizedAllocationUI();
    
    document.getElementById('allocationForm').reset();
    resetAllocationInputs();
    updateAllocation();
    
    // KEY ADDITION: Initialize button text
    updateNextRoundButtonText();
    
    showScreen('gameScreen');
}





// ===== SETUP RANDOMIZED UI =====
function setupRandomizedAllocationUI() {
    const bundleInfo = BUNDLE_INFO[gameState.treatmentGroup] || BUNDLE_INFO.control;
    
    // Define all allocation items
    const allocationItems = [
        {
            id: 'insurance',
            html: createInsuranceHTML(bundleInfo),
            order: Math.random()
        },
        {
            id: 'inputs',
            html: `
                <div class="allocation-item">
                    <div class="item-header">
                        <i class="fas fa-seedling"></i>
                        <div class="item-info">
                            <h4>Additional Farm Inputs</h4>
                            <p>Extra seeds, tools, labor</p>
                        </div>
                    </div>
                    <div class="item-input">
                        <input type="number" id="inputSpend" min="0" value="0" oninput="updateAllocation()">
                        <span class="currency">GHS</span>
                    </div>
                </div>
            `,
            order: Math.random()
        },
        {
            id: 'education',
            html: `
                <div class="allocation-item">
                    <div class="item-header">
                        <i class="fas fa-graduation-cap"></i>
                        <div class="item-info">
                            <h4>Education</h4>
                            <p>School fees, books</p>
                        </div>
                    </div>
                    <div class="item-input">
                        <input type="number" id="educationSpend" min="0" value="0" oninput="updateAllocation()">
                        <span class="currency">GHS</span>
                    </div>
                </div>
            `,
            order: Math.random()
        },
        {
            id: 'consumption',
            html: `
                <div class="allocation-item">
                    <div class="item-header">
                        <i class="fas fa-home"></i>
                        <div class="item-info">
                            <h4>Household Needs</h4>
                            <p>Food, clothing, other needs</p>
                        </div>
                    </div>
                    <div class="item-input">
                        <input type="number" id="consumptionSpend" min="0" value="0" oninput="updateAllocation()">
                        <span class="currency">GHS</span>
                    </div>
                </div>
            `,
            order: Math.random()
        }
    ];
    
    // Sort by random order
    allocationItems.sort((a, b) => a.order - b.order);
    
    // Find the allocation container
    const form = document.getElementById('allocationForm');
    const summarySection = form.querySelector('.allocation-summary');
    
    // Remove all existing allocation items
    const existingItems = form.querySelectorAll('.allocation-item');
    existingItems.forEach(item => item.remove());
    
    // Insert randomized items before summary
    allocationItems.forEach(item => {
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = item.html;
        summarySection.parentNode.insertBefore(tempDiv.firstElementChild, summarySection);
    });
}




// ===== CREATE INSURANCE HTML =====
function createInsuranceHTML(bundleInfo) {
    const isControl = gameState.treatmentGroup === 'control';
    
    if (isControl) {
        // CONTROL: Standalone insurance with input choice dropdown
        return `
            <div class="allocation-item" id="insuranceAllocationItem">
                <div class="item-header">
                    <i class="fas fa-shield-alt"></i>
                    <div class="item-info">
                        <h4>${bundleInfo.title}</h4>
                        <p>${bundleInfo.description}</p>
                        <span class="bundle-badge">Fixed Price - ${bundleInfo.bundleCost} GHS</span>
                    </div>
                </div>
                <div class="item-input bundle-toggle">
                    <label class="bundle-checkbox">
                        <input type="checkbox" id="bundleAccepted" onchange="handleBundleToggle()">
                        <span>${bundleInfo.label}</span>
                    </label>
                    <input type="hidden" id="insuranceSpend" value="0">
                </div>
                <div class="input-choice-section" id="inputChoiceSection" style="display: none; margin-top: 15px; padding: 15px; background: rgba(255,255,255,0.05); border-radius: 10px; border: 2px solid transparent; transition: all 0.3s ease;">
                    <label style="display: block; margin-bottom: 10px; font-weight: 600;">
                        <i class="fas fa-seedling" style="margin-right: 8px;"></i>
                        <span id="inputChoiceLabel">Choose ONE farm input to receive with insurance:</span>
                    </label>
                    <select id="inputChoiceType" onchange="updateAllocation()" style="width: 100%; padding: 12px; font-size: 16px; border-radius: 8px; border: 2px solid var(--primary); background: white;">
                        <option value="">-- Select Input Type --</option>
                        <option value="seeds">🌱 Improved Seeds (drought-resistant)</option>
                        <option value="fertilizer">🌾 NPK Fertilizer (2 bags)</option>
                    </select>
                    <div id="inputChoiceWarning" style="display: none; margin-top: 10px; padding: 10px; background: #fff3cd; color: #856404; border-radius: 6px; font-size: 14px;">
                        ⚠️ Please select an input type before submitting
                    </div>
                </div>
            </div>
        `;
    } else {
        // TREATMENT: Bundled insurance + specific input (no choice)
        return `
            <div class="allocation-item" id="insuranceAllocationItem">
                <div class="item-header">
                    <i class="fas fa-shield-alt"></i>
                    <div class="item-info">
                        <h4>${bundleInfo.title}</h4>
                        <p>${bundleInfo.description}</p>
                        <span class="bundle-badge">Fixed Price - ${bundleInfo.bundleCost} GHS</span>
                    </div>
                </div>
                <div class="item-input bundle-toggle">
                    <label class="bundle-checkbox">
                        <input type="checkbox" id="bundleAccepted" onchange="handleBundleToggle()">
                        <span>${bundleInfo.label}</span>
                    </label>
                    <input type="hidden" id="insuranceSpend" value="0">
                    <input type="hidden" id="inputChoiceType" value="${gameState.treatmentGroup === 'fertilizer_bundle' ? 'fertilizer' : 'seeds'}">
                </div>
            </div>
        `;
    }
}





function showFinalSeasonWarning() {
    const roundHeader = document.querySelector('.round-header');
    if (!roundHeader) return;
    
    const existingWarning = document.querySelector('.final-season-warning');
    if (existingWarning) existingWarning.remove();
    
    const warningDiv = document.createElement('div');
    warningDiv.className = 'final-season-warning';
    warningDiv.innerHTML = `
        <div class="warning-banner">
            ⚠️ <strong>FINAL SEASON!</strong> This decision counts! ⚠️
        </div>
    `;
    
    roundHeader.parentNode.insertBefore(warningDiv, roundHeader);
}

// ===== SETUP INSURANCE UI =====
function setupInsuranceUI() {
    const insuranceContainer = document.getElementById('insuranceAllocationItem');
    const bundleInfo = BUNDLE_INFO[gameState.treatmentGroup] || BUNDLE_INFO.control;
    
    // ALL GROUPS: Same checkbox UI
    insuranceContainer.innerHTML = `
        <div class="item-header">
            <i class="fas fa-shield-alt"></i>
            <div class="item-info">
                <h4>${bundleInfo.title}</h4>
                <p>${bundleInfo.description}</p>
                <span class="bundle-badge">Fixed Price - ${bundleInfo.bundleCost} GHS</span>
            </div>
        </div>
        <div class="item-input bundle-toggle">
            <label class="bundle-checkbox">
                <input type="checkbox" id="bundleAccepted" onchange="handleBundleToggle()">
                <span>${bundleInfo.label}</span>
            </label>
            <input type="hidden" id="insuranceSpend" value="0">
        </div>
    `;
}



/// ===== HANDLE BUNDLE TOGGLE - UPDATED =====
// ===== FIX 1: HANDLE BUNDLE TOGGLE - RESET INPUT CHOICE =====
function handleBundleToggle() {
    const bundleAccepted = document.getElementById('bundleAccepted').checked;
    const bundleInfo = BUNDLE_INFO[gameState.treatmentGroup];
    const insuranceSpendInput = document.getElementById('insuranceSpend');
    const inputChoiceSection = document.getElementById('inputChoiceSection');
    const inputChoiceSelect = document.getElementById('inputChoiceType');
    
    if (bundleAccepted) {
        insuranceSpendInput.value = bundleInfo.bundleCost;
        
        // Show input choice dropdown for control group
        if (gameState.treatmentGroup === 'control' && inputChoiceSection) {
            inputChoiceSection.style.display = 'block';
        }
    } else {
        insuranceSpendInput.value = 0;
        
        // Hide and RESET input choice for control group
        if (gameState.treatmentGroup === 'control' && inputChoiceSection) {
            inputChoiceSection.style.display = 'none';
            if (inputChoiceSelect) {
                inputChoiceSelect.value = ''; // RESET to empty
            }
        }
    }
    
    updateAllocation();
}





function resetAllocationInputs() {
    document.getElementById('insuranceSpend').value = 0;
    document.getElementById('inputSpend').value = 0;
    document.getElementById('educationSpend').value = 0;
    document.getElementById('consumptionSpend').value = 0;
    
    const bundleCheckbox = document.getElementById('bundleAccepted');
    if (bundleCheckbox) bundleCheckbox.checked = false;
}






// ===== UPDATE ALLOCATION - ENHANCED VALIDATION =====
function updateAllocation() {
    const budget = parseInt(document.getElementById('totalBudget').textContent);
    const insurance = parseInt(document.getElementById('insuranceSpend').value) || 0;
    const inputs = parseInt(document.getElementById('inputSpend').value) || 0;
    const education = parseInt(document.getElementById('educationSpend').value) || 0;
    const consumption = parseInt(document.getElementById('consumptionSpend').value) || 0;
    
    const total = insurance + inputs + education + consumption;
    const remaining = budget - total;
    
    document.getElementById('totalSpent').textContent = total + ' GHS';
    document.getElementById('remaining').textContent = remaining + ' GHS';
    
    const submitBtn = document.getElementById('submitAllocation');
    const remainingEl = document.getElementById('remaining');
    
    // Check if control group needs to select input type ONLY IF THEY BOUGHT INSURANCE
    const bundleAccepted = document.getElementById('bundleAccepted')?.checked;
    const inputChoiceType = document.getElementById('inputChoiceType')?.value;
    const isControl = gameState.treatmentGroup === 'control';
    
    // Only require input choice if control group AND insurance is purchased
    const needsInputChoice = isControl && bundleAccepted && !inputChoiceType;
    
    // Show/hide warning message for control group
    const inputChoiceWarning = document.getElementById('inputChoiceWarning');
    const inputChoiceSection = document.getElementById('inputChoiceSection');
    
    if (needsInputChoice && inputChoiceWarning && inputChoiceSection) {
        inputChoiceWarning.style.display = 'block';
        inputChoiceSection.style.borderColor = '#ffc107'; // Yellow border
    } else if (inputChoiceWarning && inputChoiceSection) {
        inputChoiceWarning.style.display = 'none';
        inputChoiceSection.style.borderColor = 'transparent';
    }
    
    if (remaining < 0) {
        remainingEl.style.color = 'var(--danger)';
        submitBtn.disabled = true;
    } else if (remaining > 0) {
        remainingEl.style.color = 'var(--info)';
        submitBtn.disabled = true;
    } else if (needsInputChoice) {
        // Only block submission if they bought insurance but didn't choose input
        remainingEl.style.color = 'var(--warning)';
        submitBtn.disabled = true;
    } else {
        remainingEl.style.color = 'var(--success)';
        submitBtn.disabled = false;
    }
}





// ===== WEATHER & OUTCOMES (RANDOM FOR ALL) =====
function generateWeatherEvent() {
    const rand = Math.random();
    
    if (rand < 0.4) return WEATHER_TYPES.GOOD;
    else if (rand < 0.7) return WEATHER_TYPES.MILD_DROUGHT;
    else if (rand < 0.9) return WEATHER_TYPES.SEVERE_DROUGHT;
    else return WEATHER_TYPES.FLOOD;
}




function calculateOutcomes(seasonData, weather) {
    const baseHarvest = seasonData.budget * 0.8;
    const inputBoost = seasonData.inputSpend * 1.5;
    seasonData.harvestOutcome = Math.round((baseHarvest + inputBoost) * weather.harvestMultiplier);
    
    // Insurance payout for ALL groups
    if (seasonData.insuranceSpend > 0 && weather.type !== 'normal') {
        seasonData.payoutReceived = Math.round(seasonData.insuranceSpend * 3 * weather.payoutMultiplier);
    } else {
        seasonData.payoutReceived = 0;
    }
    
    seasonData.endTime = new Date();
}



// FIX: Extended viewing time (8 seconds minimum)
function showWeatherOutcome(seasonData, weather) {
    const seasonNumber = seasonData.roundNumber;
    const isGoodWeather = weather.type === 'normal';
    
    displayWeatherResult(seasonData, weather);
    
    if (seasonNumber === 4 && isGoodWeather) {
        setTimeout(() => {
            showConfetti();
        }, 2000);
    }
}




function displayWeatherResult(seasonData, weather) {
    const animation = document.getElementById('weatherAnimation');
    animation.innerHTML = getWeatherVisual(weather);
    animation.style.background = weather.color;
    
    document.getElementById('weatherTitle').textContent = weather.title;
    
    let weatherDesc = weather.desc;
    
    if (weather.type === 'normal') {
        weatherDesc += ` Your harvest was boosted by 50% (1.5x).`;
    } else if (weather.harvestMultiplier === 0.7) {
        weatherDesc += ` Your harvest was reduced to 70% of normal.`;
    } else if (weather.harvestMultiplier === 0.3) {
        weatherDesc += ` Your harvest was reduced to only 30% of normal.`;
    } else if (weather.harvestMultiplier === 0.5) {
        weatherDesc += ` Your harvest was reduced to 50% of normal.`;
    }
    
    if (seasonData.payoutReceived > 0) {
        const multiplier = seasonData.payoutReceived / seasonData.insuranceSpend;
        weatherDesc += ` Your insurance paid out ${multiplier}x what you paid (${seasonData.insuranceSpend} GHS → ${seasonData.payoutReceived} GHS)!`;
    } else if (seasonData.insuranceSpend > 0 && weather.type === 'normal') {
        weatherDesc += ` No insurance payout needed - weather was good.`;
    } else if (seasonData.insuranceSpend === 0 && weather.type !== 'normal') {
        weatherDesc += ` You didn't buy insurance this season.`;
    }
    
    document.getElementById('weatherDescription').textContent = weatherDesc;
    document.getElementById('harvestValue').textContent = seasonData.harvestOutcome + ' GHS';
    document.getElementById('payoutValue').textContent = seasonData.payoutReceived + ' GHS';
    
    const totalEarnings = seasonData.harvestOutcome + seasonData.payoutReceived;
    document.getElementById('finalIncomeValue').textContent = totalEarnings + ' GHS';
    
    const existingNote = document.getElementById('insuranceContributionNote');
    if (existingNote) existingNote.remove();
    
    if (seasonData.payoutReceived > 0) {
        const outcomeCards = document.querySelector('.outcome-cards');
        if (outcomeCards) {
            const multiplier = (seasonData.payoutReceived / seasonData.insuranceSpend).toFixed(1);
            const profit = seasonData.payoutReceived - seasonData.insuranceSpend;
            
            const noteDiv = document.createElement('div');
            noteDiv.id = 'insuranceContributionNote';
            noteDiv.style.cssText = 'background: linear-gradient(135deg, #E8F5E9, #C8E6C9); padding: 20px; border-radius: 12px; margin-top: 15px; text-align: center; border: 2px solid #4CAF50;';
            noteDiv.innerHTML = `
                <div style="font-size: 24px; margin-bottom: 10px;">💚 Insurance Protected You!</div>
                <div style="font-weight: 700; font-size: 20px; color: #2E7D32; margin-bottom: 15px;">
                    You paid ${seasonData.insuranceSpend} GHS → Got ${seasonData.payoutReceived} GHS back = ${multiplier}x return!
                </div>
            `;
            outcomeCards.insertAdjacentElement('afterend', noteDiv);
        }
    }
    
    // KEY ADDITION: Update button text
    updateNextRoundButtonText();
    
    showScreen('weatherScreen');
}


function getWeatherVisual(weather) {
    if (weather.type === 'normal') {
        return '<div style="font-size: 120px; animation: rotate 10s linear infinite;">☀️</div>';
    } else if (weather.type === 'drought') {
        return '<div style="font-size: 120px; animation: shake 0.5s ease-in-out infinite;">🔥</div>';
    } else if (weather.type === 'flood') {
        return '<div style="font-size: 120px; animation: shake 0.5s ease-in-out infinite;">🌧️</div>';
    }
    return '<div style="font-size: 100px;">' + weather.icon + '</div>';
}

function showConfetti() {
    const confettiColors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#f9ca24', '#6c5ce7'];
    const confettiContainer = document.createElement('div');
    confettiContainer.className = 'confetti-container';
    document.body.appendChild(confettiContainer);
    
    for (let i = 0; i < 50; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti';
        confetti.style.left = Math.random() * 100 + '%';
        confetti.style.background = confettiColors[Math.floor(Math.random() * confettiColors.length)];
        confetti.style.animationDelay = Math.random() * 2 + 's';
        confettiContainer.appendChild(confetti);
    }
    
    setTimeout(() => confettiContainer.remove(), 5000);
}

// FIX: Proper flow to next season or end
function nextSeason() {
    if (gameState.currentSeason < 4) {
        // Still have more seasons to play
        gameState.currentSeason++;
        loadSeason(gameState.currentSeason);
    } else {
        // All 4 seasons completed - decide what's next
        if (gameState.sessionType === 'couple_joint') {
            // Couple session → Go to perception screen (no knowledge test)
            showScreen('perceptionScreen');
        } else {
            // Individual session → Go to knowledge test
            showScreen('knowledgeScreen');
        }
    }
}


function updateNextRoundButtonText() {
    const nextBtn = document.getElementById('nextRoundBtn');
    if (!nextBtn) return;
    
    if (gameState.currentSeason < 4) {
        // Seasons 1-3: Show "Continue to Next Season"
        nextBtn.innerHTML = '<span>Continue to Next Season</span><i class="fas fa-arrow-right"></i>';
    } else {
        // Season 4 completed - different text based on session type
        if (gameState.sessionType === 'couple_joint') {
            // Couple goes to perception survey
            nextBtn.innerHTML = '<span>Complete & Share Feedback</span><i class="fas fa-arrow-right"></i>';
        } else {
            // Individual goes to knowledge test
            nextBtn.innerHTML = '<span>Continue to Knowledge Test</span><i class="fas fa-arrow-right"></i>';
        }
    }
}


// ===== SECOND PARTNER & COUPLE FLOW =====
function showSecondPartnerPrompt() {
    const promptScreen = document.getElementById('secondPartnerScreen');
    const messageEl = promptScreen.querySelector('.prompt-message');
    if (messageEl) {
        const roleText = gameState.role === 'husband' ? 'husband' : 'wife';
        const partnerRole = gameState.role === 'husband' ? 'wife' : 'husband';
        
        messageEl.innerHTML = `
            <div style="font-size: 80px; margin-bottom: 30px;">🎉</div>
            <h2 style="color: var(--primary); margin-bottom: 20px;">First Partner Completed!</h2>
            <p style="font-size: 20px; line-height: 1.7; margin-bottom: 20px;">
                The ${roleText} has finished playing individually through all 4 seasons.
            </p>
            <p style="font-size: 20px; margin-bottom: 30px;">
                Now it's time for the <strong>${partnerRole}</strong> to play on their own.
            </p>
            <div style="background: #E8F5E9; padding: 30px; border-radius: 16px; margin: 30px 0; border-left: 6px solid var(--primary);">
                <p style="font-weight: 700; margin-bottom: 20px; font-size: 20px; color: var(--primary);">
                    <i class="fas fa-list-check"></i> The ${partnerRole} will:
                </p>
                <ul style="text-align: left; max-width: 600px; margin: 0 auto; font-size: 18px; line-height: 2.2;">
                    <li><i class="fas fa-user-circle" style="color: var(--primary); margin-right: 10px;"></i>Answer demographic questions</li>
                    <li><i class="fas fa-balance-scale" style="color: var(--primary); margin-right: 10px;"></i>Complete risk assessment</li>
                    <li><i class="fas fa-users" style="color: var(--primary); margin-right: 10px;"></i>Answer empowerment questions</li>
                    <li><i class="fas fa-seedling" style="color: var(--primary); margin-right: 10px;"></i>Play 4 farming seasons individually</li>
                    <li><i class="fas fa-brain" style="color: var(--primary); margin-right: 10px;"></i>Take the knowledge test</li>
                </ul>
            </div>
        `;
    }
    
    const startBtn = document.getElementById('startSecondPartnerBtn');
    if (startBtn) {
        const partnerRole = gameState.role === 'husband' ? 'Wife' : 'Husband';
        startBtn.innerHTML = `
            <i class="fas fa-user-plus"></i>
            <span>Start ${partnerRole} Session</span>
            <i class="fas fa-arrow-right"></i>
        `;
    }
    
    showScreen('secondPartnerScreen');
}



// ===== START SECOND PARTNER - FIXED =====
// Replace the existing startSecondPartner() function

function startSecondPartner() {
    console.log('🔄 Starting second partner...');
    
    // Save first partner's complete state
    const savedState = {
        householdId: gameState.householdId,
        treatmentGroup: gameState.treatmentGroup,
        firstRespondentId: gameState.respondentId, // Current becomes first
        firstRole: gameState.role,
        firstGender: gameState.gender,
        firstSessionType: gameState.sessionType
    };
    
    console.log('💾 Saving first partner state:', savedState);
    
    // Store first partner info before resetting
    if (!gameState.firstRespondentId) {
        gameState.firstRespondentId = savedState.firstRespondentId;
        gameState.firstRespondentRole = savedState.firstRole;
        gameState.firstRespondentData = {
            role: savedState.firstRole,
            gender: savedState.firstGender,
            sessionType: savedState.firstSessionType,
            treatmentGroup: savedState.treatmentGroup
        };
    }
    
    // Save to localStorage
    try {
        localStorage.setItem('weather_game_household', JSON.stringify(savedState));
        console.log('💾 Saved to localStorage');
    } catch (e) {
        console.warn('⚠️ Could not save to localStorage:', e);
    }
    
    // CRITICAL: Reset ONLY second partner's data, keep household info
    const householdId = gameState.householdId;
    const treatmentGroup = gameState.treatmentGroup;
    const firstRespondentId = gameState.firstRespondentId;
    const firstRespondentRole = gameState.firstRespondentRole;
    const firstRespondentData = gameState.firstRespondentData;
    
    // Reset individual session data
    gameState.respondentId = null;
    gameState.sessionId = null;
    gameState.demographics = {};
    gameState.empowermentScores = {};
    gameState.seasonData = [];
    gameState.currentSeason = 1;
    gameState.gender = null;
    gameState.role = null;
    gameState.sessionType = null;
    
    // RESTORE household and first partner tracking
    gameState.householdId = householdId;
    gameState.treatmentGroup = treatmentGroup;
    gameState.firstRespondentId = firstRespondentId;
    gameState.firstRespondentRole = firstRespondentRole;
    gameState.firstRespondentData = firstRespondentData;
    
    console.log('✅ Second partner reset complete');
    console.log('📋 First partner ID:', gameState.firstRespondentId);
    console.log('📋 First partner role:', gameState.firstRespondentRole);
    console.log('📋 Household ID:', gameState.householdId);
    console.log('📋 Treatment group:', gameState.treatmentGroup);
    
    // Clear any form data
    const forms = document.querySelectorAll('form');
    forms.forEach(form => form.reset());
    
    showScreen('demographicsScreen');
}




// ===== SHOW COUPLE PROMPT FUNCTION =====
// This should already exist in your code - verify it looks like this

function showCouplePrompt() {
    console.log('👫 Showing couple prompt');
    const promptScreen = document.getElementById('coupleScreen');
    const messageEl = promptScreen.querySelector('.prompt-message');
    if (messageEl) {
        messageEl.innerHTML = `
            <div style="font-size: 80px; margin-bottom: 30px;">🎉👫</div>
            <h2 style="color: var(--primary); margin-bottom: 20px;">Both Partners Completed!</h2>
            <p style="font-size: 20px; line-height: 1.7; margin-bottom: 20px;">
                Great work! Both partners have finished playing individually through all 4 seasons.
            </p>
            <p style="font-size: 20px; margin-bottom: 30px;">
                Now it's time to play together as a couple.
            </p>
            <div style="background: #FFF9C4; padding: 30px; border-radius: 16px; margin: 30px 0; border-left: 6px solid var(--ghana-gold);">
                <p style="font-weight: 700; margin-bottom: 20px; font-size: 20px; color: var(--ghana-green-dark);">
                    <i class="fas fa-heart"></i> Playing together, you will:
                </p>
                <ul style="text-align: left; max-width: 600px; margin: 0 auto; font-size: 18px; line-height: 2.2;">
                    <li><i class="fas fa-ring" style="color: var(--ghana-gold); margin-right: 10px;"></i>Answer questions about your marriage</li>
                    <li><i class="fas fa-handshake" style="color: var(--ghana-gold); margin-right: 10px;"></i>Make joint decisions for 4 farming seasons</li>
                    <li><i class="fas fa-comments" style="color: var(--ghana-gold); margin-right: 10px;"></i>Work together to allocate resources</li>
                    <li><i class="fas fa-chart-line" style="color: var(--ghana-gold); margin-right: 10px;"></i>Share your experience with the bundle</li>
                </ul>
            </div>
        `;
    }
    showScreen('coupleScreen');
}



function startCouplePreQuestions() {
    console.log('💑 Starting couple pre-questions');
    showScreen('couplePreQuestionsScreen');
}

async function startCoupleSession() {
    console.log('💑 Starting couple joint session');
    showLoading();
    
    try {
        if (!gameState.firstRespondentId) {
            const saved = localStorage.getItem('weather_game_household');
            if (saved) {
                const savedState = JSON.parse(saved);
                gameState.firstRespondentId = savedState.firstRespondentId;
                gameState.treatmentGroup = savedState.treatmentGroup;
                gameState.householdId = savedState.householdId;
            }
        }
        
        if (!gameState.firstRespondentId) {
            throw new Error('Cannot find first respondent ID. Please restart the game.');
        }
        
        gameState.respondentId = gameState.firstRespondentId;
        gameState.sessionType = 'couple_joint';
        
        console.log('✅ Using first respondent for couple session:', gameState.firstRespondentId);
        
        const session = await apiCall('/session/start', 'POST', { 
            respondentId: gameState.respondentId,
            sessionType: 'couple_joint'
        });
        gameState.sessionId = session.sessionId;
        
        console.log('✅ Couple session created:', session.sessionId);
        
        showLoading(false);
        showScreen('tutorialScreen');
        initializeTutorial();
    } catch (error) {
        showLoading(false);
        console.error('Error starting couple session:', error);
        alert('Error starting couple session: ' + error.message);
    }
}

// ===== RESULTS =====
// ===== FUNCTION 5: SHOW RESULTS =====
// Replace the existing showResults() function with this one

// ===== FUNCTION 5: SHOW RESULTS - FIXED SECOND PARTNER DETECTION =====
// Replace the existing showResults() function with this one


// ===== FUNCTION 5: SHOW RESULTS - WITH EXTENSIVE DEBUG LOGGING =====
// Replace showResults() with this version to see what's happening

// ===== FUNCTION: SHOW RESULTS - SIMPLIFIED DETECTION LOGIC =====
// Replace showResults() with this clearer version

async function showResults() {
    try {
        showLoading();
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        console.log('🔍 ===== SHOWRESULTS CALLED =====');
        console.log('Current respondentId:', gameState.respondentId);
        console.log('First respondentId:', gameState.firstRespondentId);
        console.log('Second respondentId:', gameState.secondRespondentId);
        console.log('Session type:', gameState.sessionType);
        
        const session = await apiCall(`/session/${gameState.sessionId}`);
        const knowledge = await apiCall(`/knowledge/${gameState.respondentId}`);
        
        document.getElementById('totalEarnings').textContent = session.totalEarnings + ' GHS';
        document.getElementById('totalInsurance').textContent = session.totalInsuranceSpent + ' GHS';
        document.getElementById('totalPayouts').textContent = session.totalPayoutsReceived + ' GHS';
        document.getElementById('knowledgeScore').textContent = knowledge.knowledgeScore + '/5';
        
        let insights = '<ul style="text-align: left; max-width: 600px; margin: 0 auto; font-size: 16px; line-height: 1.8;">';
        const insuranceRate = session.totalInsuranceSpent / (session.totalEarnings + session.totalInsuranceSpent);
        
        if (insuranceRate > 0.2) insights += '<li>You invested heavily in insurance - very risk-averse!</li>';
        else if (insuranceRate < 0.1) insights += '<li>You took more risk by spending less on insurance.</li>';
        
        if (session.totalPayoutsReceived > session.totalInsuranceSpent) {
            insights += '<li>🎉 Insurance paid off! You earned ' + (session.totalPayoutsReceived - session.totalInsuranceSpent) + ' GHS more than you spent.</li>';
        } else if (session.totalInsuranceSpent > 0 && session.totalPayoutsReceived === 0) {
            insights += '<li>⚠️ You paid for insurance but received no payouts - weather was favorable.</li>';
        }
        
        if (knowledge.knowledgeScore >= 4) insights += '<li>✅ Excellent understanding of weather insurance!</li>';
        else if (knowledge.knowledgeScore <= 2) insights += '<li>📚 Consider reviewing how weather index insurance works.</li>';
        
        insights += '</ul>';
        document.getElementById('insightsContent').innerHTML = insights;
        
        const resultsTitle = document.querySelector('#resultsScreen h2');
        const resultsSubtitle = document.querySelector('#resultsScreen .subtitle');
        const restartBtn = document.getElementById('restartBtn');
        
        showLoading(false);
        showScreen('resultsScreen');
        
        // ===== SIMPLIFIED DETECTION LOGIC =====
        
        // CASE 1: Couple session completed - GAME OVER
        if (gameState.sessionType === 'couple_joint') {
            console.log('✅ CASE: COUPLE SESSION completed');
            
            if (resultsTitle) resultsTitle.textContent = 'Game Completed!';
            if (resultsSubtitle) resultsSubtitle.textContent = "Here's how you performed together";
            if (restartBtn) {
                restartBtn.style.display = 'inline-flex';
                restartBtn.innerHTML = '<i class="fas fa-redo"></i><span>Start New Game</span>';
            }
            return;
        }
        
        // CASE 2: This is the FIRST partner (no firstRespondentId set yet)
        if (!gameState.firstRespondentId) {
            console.log('✅ CASE: FIRST PARTNER completed (no firstRespondentId)');
            
            const partnerName = gameState.role === 'husband' ? 'Husband' : 'Wife';
            if (resultsTitle) resultsTitle.textContent = 'First Partner Complete!';
            if (resultsSubtitle) resultsSubtitle.textContent = `Here's how the ${partnerName.toLowerCase()} performed`;
            if (restartBtn) restartBtn.style.display = 'none';
            
            await new Promise(resolve => setTimeout(resolve, 3000));
            showSecondPartnerPrompt();
            return;
        }
        
        // CASE 3: This is STILL the first partner (respondentId matches firstRespondentId)
        if (gameState.respondentId === gameState.firstRespondentId) {
            console.log('✅ CASE: FIRST PARTNER completed (ID matches)');
            
            const partnerName = gameState.role === 'husband' ? 'Husband' : 'Wife';
            if (resultsTitle) resultsTitle.textContent = 'First Partner Complete!';
            if (resultsSubtitle) resultsSubtitle.textContent = `Here's how the ${partnerName.toLowerCase()} performed`;
            if (restartBtn) restartBtn.style.display = 'none';
            
            await new Promise(resolve => setTimeout(resolve, 3000));
            showSecondPartnerPrompt();
            return;
        }
        
        // CASE 4: This is the SECOND partner (different respondentId from first)
        if (gameState.respondentId !== gameState.firstRespondentId) {
            console.log('✅ CASE: SECOND PARTNER completed');
            
            const partnerName = gameState.role === 'husband' ? 'Husband' : 'Wife';
            if (resultsTitle) resultsTitle.textContent = 'Second Partner Complete!';
            if (resultsSubtitle) resultsSubtitle.textContent = `Here's how the ${partnerName.toLowerCase()} performed`;
            if (restartBtn) restartBtn.style.display = 'none';
            
            // Mark second partner
            if (!gameState.secondRespondentId) {
                gameState.secondRespondentId = gameState.respondentId;
            }
            
            await new Promise(resolve => setTimeout(resolve, 3000));
            showCouplePrompt();
            return;
        }
        
        console.log('⚠️ WARNING: Fell through all cases');
        
    } catch (error) {
        showLoading(false);
        console.error('❌ Error loading results:', error);
        alert('Error loading results: ' + error.message);
    }
}



function restartGame() {
    if (confirm('Are you sure you want to restart? All progress will be lost.')) {
        try {
            localStorage.removeItem('weather_game_household');
        } catch (e) {
            console.warn('Could not clear localStorage');
        }
        location.reload();
    }
}

// ===== EVENT LISTENERS =====
document.addEventListener('DOMContentLoaded', function() {
    console.log('Weather Index Insurance Game Loaded - Ghana Edition - 4 SEASONS - ALL FIXES APPLIED');

    const startBtn = document.getElementById('startBtn');
    if (startBtn) startBtn.addEventListener('click', startDemographics);

    const tutorialPrevBtn = document.getElementById('tutorialPrevBtn');
    if (tutorialPrevBtn) tutorialPrevBtn.addEventListener('click', previousTutorialCard);
    
    const tutorialNextBtn = document.getElementById('tutorialNextBtn');
    if (tutorialNextBtn) tutorialNextBtn.addEventListener('click', nextTutorialCard);
    
    const tutorialFinishBtn = document.getElementById('tutorialFinishBtn');
    if (tutorialFinishBtn) tutorialFinishBtn.addEventListener('click', startGameAfterTutorial);

    const cardStack = document.getElementById('tutorialCardStack');
    if (cardStack) {
        cardStack.addEventListener('touchstart', handleTouchStart, false);
        cardStack.addEventListener('touchend', handleTouchEnd, false);
    }

    const nextSeasonBtn = document.getElementById('nextRoundBtn');
    if (nextSeasonBtn) {
        nextSeasonBtn.addEventListener('click', nextSeason);
        nextSeasonBtn.innerHTML = '<span>Continue to Next Season</span><i class="fas fa-arrow-right"></i>';
    }

    const restartBtn = document.getElementById('restartBtn');
    if (restartBtn) restartBtn.addEventListener('click', restartGame);

    ['insuranceSpend', 'inputSpend', 'educationSpend', 'consumptionSpend'].forEach(inputId => {
        const input = document.getElementById(inputId);
        if (input) input.addEventListener('input', updateAllocation);
    });



    // Show role guidance for second partner
const updateRoleGuidance = () => {
    if (gameState.firstRespondentRole) {
        const roleGuidance = document.getElementById('roleGuidance');
        const roleGuidanceText = document.getElementById('roleGuidanceText');
        const roleSelect = document.getElementById('role');
        
        if (roleGuidance && roleGuidanceText && roleSelect) {
            roleGuidance.style.display = 'block';
            
            const oppositeRole = gameState.firstRespondentRole === 'husband' ? 'wife' : 'husband';
            roleGuidanceText.textContent = `The ${gameState.firstRespondentRole} has already completed their individual play. Please select "${oppositeRole}" below.`;
            
            const options = roleSelect.querySelectorAll('option');
            options.forEach(option => {
                if (option.value === gameState.firstRespondentRole) {
                    option.disabled = true;
                    option.textContent = option.textContent + ' (Already played)';
                }
            });
            
            roleSelect.value = oppositeRole;
        }
    }
};

// Hook into showScreen to update guidance when demographics shown
const originalShowScreen = window.showScreen || showScreen;
window.showScreen = function(screenId) {
    originalShowScreen(screenId);
    if (screenId === 'demographicsScreen') {
        setTimeout(updateRoleGuidance, 100);
    }
};




    const demoForm = document.getElementById('demographicsForm');
if (demoForm) {
    demoForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        showLoading();
        
        try {
            const formData = new FormData(e.target);
            const crops = Array.from(document.querySelectorAll('input[name="crops"]:checked'))
                .map(cb => cb.value);
            
            const selectedRole = formData.get('role');
            const selectedGender = formData.get('gender');
            
            // FIX 2: ENFORCE ROLE ORDER
            if (gameState.firstRespondentRole) {
                // Second partner playing - enforce opposite role
                if (selectedRole === gameState.firstRespondentRole) {
                    showLoading(false);
                    alert(`⚠️ The ${gameState.firstRespondentRole} has already played! The second partner must be the ${gameState.firstRespondentRole === 'husband' ? 'wife' : 'husband'}.`);
                    return;
                }
            }
            
            gameState.demographics = {
                householdId: gameState.householdId,
                gender: selectedGender,
                role: selectedRole,
                age: parseInt(formData.get('age')),
                education: parseInt(formData.get('education')),
                yearsOfFarming: parseInt(formData.get('farmingYears')),
                landCultivated: parseFloat(formData.get('landSize')),
                mainCrops: crops,
                lastSeasonIncome: parseFloat(formData.get('lastIncome')),
                priorInsuranceKnowledge: formData.get('priorKnowledge') === '1',
                language: gameState.language
            };
            
            gameState.gender = selectedGender;
            gameState.role = selectedRole;
            
            showLoading(false);
            showScreen('riskScreen');
        } catch (error) {
            showLoading(false);
            console.error('Demographics form error:', error);
            alert('Error: ' + error.message);
        }
    });
}



    const riskForm = document.getElementById('riskForm');
    if (riskForm) {
        riskForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            showLoading();
            
            try {
                const formData = new FormData(e.target);
                gameState.demographics.riskPreference = parseInt(formData.get('riskChoice'));
                gameState.demographics.riskComfort = parseInt(formData.get('riskComfort'));
                gameState.demographics.decisionMaker = parseInt(formData.get('decisionMaker'));
                
                showLoading(false);
                showScreen('empowermentScreen');
            } catch (error) {
                showLoading(false);
                console.error('Risk form error:', error);
                alert('Error: ' + error.message);
            }
        });
    }

    // ===== EMPOWERMENT FORM HANDLER - FIXED =====
// Replace the existing empowerment form handler in DOMContentLoaded

const empForm = document.getElementById('empowermentForm');
if (empForm) {
    empForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        showLoading();
        
        try {
            const formData = new FormData(e.target);
            gameState.empowermentScores = {
                cropDecisions: parseInt(formData.get('q1')),
                moneyDecisions: parseInt(formData.get('q2')),
                inputDecisions: parseInt(formData.get('q3')),
                opinionConsidered: parseInt(formData.get('q4')),
                confidenceExpressing: parseInt(formData.get('q5'))
            };
            
            const respondentData = {
                ...gameState.demographics,
                empowermentScores: gameState.empowermentScores
            };
            
            // Create respondent
            const respondent = await apiCall('/respondent/create', 'POST', respondentData);
            gameState.respondentId = respondent._id;
            
            if (gameState.treatmentGroup && respondent.treatmentGroup !== gameState.treatmentGroup) {
                console.error('⚠️ WARNING: Treatment group mismatch!');
            }
            gameState.treatmentGroup = respondent.treatmentGroup;
            
            console.log(`✅ Respondent created: ${respondent._id}, Treatment: ${respondent.treatmentGroup}`);
            
            // CRITICAL FIX: Determine if this is first partner and set IDs
            const isFirstPartner = !gameState.firstRespondentId;
            
            if (isFirstPartner) {
                // This is the FIRST partner
                gameState.firstRespondentId = respondent._id;
                gameState.firstRespondentRole = gameState.role;
                gameState.firstRespondentData = {
                    role: gameState.role,
                    gender: gameState.gender,
                    treatmentGroup: gameState.treatmentGroup
                };
                
                console.log('🎯 FIRST PARTNER registered:', {
                    id: gameState.firstRespondentId,
                    role: gameState.firstRespondentRole
                });
            } else {
                // This is the SECOND partner
                gameState.secondRespondentId = respondent._id;
                
                console.log('🎯 SECOND PARTNER registered:', {
                    id: gameState.secondRespondentId,
                    role: gameState.role
                });
            }
            
            // Set session type based on role
            if (gameState.role === 'husband') {
                gameState.sessionType = 'individual_husband';
            } else if (gameState.role === 'wife') {
                gameState.sessionType = 'individual_wife';
            }
            
            console.log('📋 Session type set to:', gameState.sessionType);
            
            // Create session
            const session = await apiCall('/session/start', 'POST', { 
                respondentId: gameState.respondentId,
                sessionType: gameState.sessionType
            });
            gameState.sessionId = session.sessionId;
            
            console.log('✅ Session created:', session.sessionId);
            
            showLoading(false);
            showScreen('tutorialScreen');
            initializeTutorial();
        } catch (error) {
            showLoading(false);
            console.error('Empowerment form error:', error);
            alert('Error: ' + error.message);
        }
    });
}
    const couplePreForm = document.getElementById('couplePreQuestionsForm');
    if (couplePreForm) {
        couplePreForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            showLoading();
            
            try {
                const formData = new FormData(e.target);
                const coupleData = {
                    householdId: gameState.householdId,
                    marriageDuration: parseInt(formData.get('marriageDuration')),
                    numberOfChildren: parseInt(formData.get('numberOfChildren'))
                };
                
                await apiCall('/couple/info', 'POST', coupleData);
                
                gameState.coupleInfo.marriageDuration = coupleData.marriageDuration;
                gameState.coupleInfo.numberOfChildren = coupleData.numberOfChildren;
                
                showLoading(false);
                startCoupleSession();
            } catch (error) {
                showLoading(false);
                console.error('Couple pre-questions error:', error);
                alert('Error: ' + error.message);
            }
        });
    }

    // FIX: Perception form handler for couple session
    const perceptionForm = document.getElementById('perceptionForm');
    if (perceptionForm) {
        perceptionForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            showLoading();
            
            try {
                const formData = new FormData(e.target);
                const perceptionData = {
                    sessionId: gameState.sessionId,
                    respondentId: gameState.respondentId,
                    householdId: gameState.householdId,
                    bundleInfluence: parseInt(formData.get('bundleInfluence')),
                    insuranceUnderstanding: parseInt(formData.get('insuranceUnderstanding')),
                    willingnessToPay: formData.get('willingnessToPay') === 'yes',
                    recommendToOthers: parseInt(formData.get('recommendToOthers')),
                    perceivedFairness: parseInt(formData.get('perceivedFairness')),
                    trustInPayout: parseInt(formData.get('trustInPayout')),
                    bundleValuePerception: parseInt(formData.get('bundleValuePerception')),
                    futureUseLikelihood: parseInt(formData.get('futureUseLikelihood'))
                };
                
                await apiCall('/perception/submit', 'POST', perceptionData);
                await apiCall(`/session/${gameState.sessionId}/complete`, 'PUT');
                
                console.log('✅ Perception data saved, session completed');
                
                showLoading(false);
                showResults();
            } catch (error) {
                showLoading(false);
                console.error('Perception form error:', error);
                alert('Error: ' + error.message);
            }
        });
    }



    // ===== SAVE GAME ROUND - UPDATED DATA =====

// ===== ALLOCATION FORM - FIX INPUT CHOICE TYPE =====
const allocForm = document.getElementById('allocationForm');
if (allocForm) {
    allocForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        showLoading();
        
        try {
            const budget = parseInt(document.getElementById('totalBudget').textContent);
            const bundleCheckbox = document.getElementById('bundleAccepted');
            const bundleAccepted = bundleCheckbox ? bundleCheckbox.checked : false;
            
            // FIX 4: Only get inputChoiceType if insurance was purchased
            let inputChoiceType = '';
            if (bundleAccepted) {
                const inputChoiceElement = document.getElementById('inputChoiceType');
                inputChoiceType = inputChoiceElement ? inputChoiceElement.value : '';
            }
            
            // Determine bundle product
            let bundleProduct = 'none';
            if (bundleAccepted) {
                if (gameState.treatmentGroup === 'control') {
                    bundleProduct = inputChoiceType; // 'seeds' or 'fertilizer'
                } else if (gameState.treatmentGroup === 'fertilizer_bundle') {
                    bundleProduct = 'fertilizer';
                } else if (gameState.treatmentGroup === 'seedling_bundle') {
                    bundleProduct = 'seeds';
                }
            }
            
            const seasonData = {
                respondentId: gameState.respondentId,
                sessionId: gameState.sessionId,
                roundNumber: gameState.currentSeason,
                budget: budget,
                insuranceSpend: parseInt(document.getElementById('insuranceSpend').value) || 0,
                inputSpend: parseInt(document.getElementById('inputSpend').value) || 0,
                educationSpend: parseInt(document.getElementById('educationSpend').value) || 0,
                consumptionSpend: parseInt(document.getElementById('consumptionSpend').value) || 0,
                decisionContext: gameState.sessionType,
                isPracticeRound: false,
                bundleAccepted: bundleAccepted,
                bundleProduct: bundleProduct,
                inputChoiceType: inputChoiceType, // Only set if insurance purchased
                startTime: new Date(),
                weatherShock: { occurred: false, type: 'normal', severity: 'none' },
                harvestOutcome: 0,
                payoutReceived: 0
            };
            
            const weather = generateWeatherEvent();
            
            let severity = 'none';
            if (weather.type === 'drought') {
                severity = weather.harvestMultiplier < 0.5 ? 'severe' : 'mild';
            } else if (weather.type === 'flood') {
                severity = 'moderate';
            }
            
            seasonData.weatherShock = {
                occurred: weather.type !== 'normal',
                type: weather.type,
                severity: severity
            };
            
            calculateOutcomes(seasonData, weather);
            await apiCall('/round/save', 'POST', seasonData);
            gameState.seasonData.push(seasonData);
            
            showLoading(false);
            showWeatherOutcome(seasonData, weather);
        } catch (error) {
            showLoading(false);
            console.error('Allocation form error:', error);
            alert('Error: ' + error.message);
        }
    });
}



   

// ===== KNOWLEDGE FORM HANDLER - FIXED =====
// Replace the existing knowledge form handler in DOMContentLoaded section

const knowledgeForm = document.getElementById('knowledgeForm');
if (knowledgeForm) {
    knowledgeForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // Prevent double submission
        if (isSubmittingKnowledge) {
            console.log('⚠️ Already submitting knowledge test');
            return;
        }
        
        isSubmittingKnowledge = true;
        showLoading();
        
        try {
            const formData = new FormData(e.target);
            const testData = {
                respondentId: gameState.respondentId,
                sessionId: gameState.sessionId,
                q1_indexBased: formData.get('q1') === 'true',
                q2_areaWide: formData.get('q2') === 'true',
                q3_profitGuarantee: formData.get('q3') === 'false',
                q4_upfrontCost: formData.get('q4') === 'true',
                q5_basisRisk: formData.get('q5') === 'true'
            };
            
            console.log('📝 Submitting knowledge test for respondent:', gameState.respondentId);
            console.log('📝 Session type:', gameState.sessionType);
            
            await apiCall('/knowledge/submit', 'POST', testData);
            await apiCall(`/session/${gameState.sessionId}/complete`, 'PUT');
            
            console.log('✅ Knowledge test submitted and session completed');
            
            // IMPORTANT: Don't reset isSubmittingKnowledge here - let showResults handle it
            showLoading(false);
            
            // Show results - this will determine next step
            await showResults();
            
            // Reset flag after showResults completes
            isSubmittingKnowledge = false;
            
        } catch (error) {
            showLoading(false);
            isSubmittingKnowledge = false;
            console.error('Knowledge form error:', error);
            alert('Error: ' + error.message);
        }
    });
}


    const langBtn = document.getElementById('languageBtn');
    if (langBtn) {
        langBtn.addEventListener('click', () => {
            gameState.language = gameState.language === 'english' ? 'dagbani' : 'english';
            document.getElementById('currentLang').textContent = 
                gameState.language === 'english' ? 'English' : 'Dagbani';
        });
    }
    
     const startSecondBtn = document.getElementById('startSecondPartnerBtn');
    if (startSecondBtn) {
        startSecondBtn.addEventListener('click', startSecondPartner);
        console.log('✅ Second partner button listener registered');
    } else {
        console.warn('⚠️ Second partner button not found');
    }
    

    
    const startCouplePromptBtn = document.getElementById('startCouplePromptBtn');
    if (startCouplePromptBtn) {
        startCouplePromptBtn.addEventListener('click', startCouplePreQuestions);
    }


});

// ===== TOUCH SWIPE HANDLERS =====
function handleTouchStart(e) {
    touchStartX = e.changedTouches[0].screenX;
}

function handleTouchEnd(e) {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
}

function handleSwipe() {
    const swipeThreshold = 50;
    const diff = touchStartX - touchEndX;
    
    if (Math.abs(diff) > swipeThreshold) {
        if (diff > 0) {
            nextTutorialCard();
        } else {
            previousTutorialCard();
        }
    }
}