// ===============================================
// WEATHER INDEX INSURANCE GAME - COMPLETE GAME.JS
// Ghana Edition - WITH COUPLE PLAY FLOW - 4 ROUNDS
// ===============================================

// ===== GAME STATE =====
let gameState = {
    householdId: null,
    respondentId: null,
    sessionId: null,
    currentScreen: 'welcomeScreen',
    currentRound: 1,
    totalRounds: 4,  // CHANGED FROM 3 TO 4
    language: 'english',
    treatmentGroup: null,
    gender: null,
    role: null,
    sessionType: null,
    demographics: {},
    empowermentScores: {},
    roundData: [],
    firstRespondentId: null,
    firstRespondentData: null,
    secondRespondentId: null,
    coupleInfo: {
        marriageDuration: null,
        numberOfChildren: null
    }
};

// Tutorial state with timer
let currentTutorialIndex = 0;
let tutorialCards = [];
let tutorialTimerInterval = null;
let currentTimerSeconds = null;

// Touch swipe state
let touchStartX = 0;
let touchEndX = 0;

// ===== ROUND STORIES - 4 ROUNDS =====
const ROUND_STORIES = [
    {
        round: 1,
        season: "Planting Season - March",
        story: "The planting season begins. You have 500 GHS to prepare for the farming season.",
        budget: 500
    },
    {
        round: 2,
        season: "Growing Season - May",
        story: "Your crops are growing. Some neighbors talk about weather patterns. Budget: 550 GHS.",
        budget: 550
    },
    {
        round: 3,
        season: "Mid-Season - July",
        story: "Weather reports are mixed. Many farmers are concerned. You must decide wisely. Budget: 600 GHS.",
        budget: 600
    },
    {
        round: 4,
        season: "Final Season - September",
        story: "⚠️ FINAL ROUND! The rains are unpredictable. Your family's future depends on this decision! Budget: 650 GHS.",
        budget: 650
    }
];

// ===== WEATHER OUTCOMES =====
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
        hasBundle: false
    },
    fertilizer_bundle: {
        title: "Weather Insurance + Fertilizer Bundle",
        description: "Insurance protection PLUS 2 bags of NPK fertilizer",
        bundleCost: 100,
        hasBundle: true,
        icon: "🌾"
    },
    seedling_bundle: {
        title: "Weather Insurance + Improved Seeds Bundle",
        description: "Insurance protection PLUS hybrid maize seeds",
        bundleCost: 100,
        hasBundle: true,
        icon: "🌱"
    }
};

// ===== API HELPER =====
const API_BASE = 'http://localhost:3000';

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
            throw new Error('Cannot connect to server. Make sure backend is running on http://localhost:3000');
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
        // Scroll to top when changing screens
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

// ===== TUTORIAL SYSTEM WITH AUTO-ADVANCE =====
function initializeTutorial() {
    console.log('Initializing tutorial for treatment:', gameState.treatmentGroup);
    
    const treatment = gameState.treatmentGroup || 'control';
    tutorialCards = TUTORIAL_CARDS[treatment];
    
    console.log(`Loading ${tutorialCards.length} tutorial cards`);
    
    // Show treatment badge
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
                
                if (currentTutorialIndex < tutorialCards.length - 1) {
                    nextTutorialCard();
                }
            }
        }, 1000);
    }
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
    if (currentTutorialIndex < tutorialCards.length - 1) {
        currentTutorialIndex++;
        updateTutorialCardPositions();
        updateTutorialProgress();
        startTutorialTimer();
    }
}

function previousTutorialCard() {
    if (currentTutorialIndex > 0) {
        currentTutorialIndex--;
        updateTutorialCardPositions();
        updateTutorialProgress();
        startTutorialTimer();
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

// ===== TOUCH SWIPE SUPPORT =====
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

// ===== START GAME =====
function startGame() {
    gameState.currentRound = 1;
    loadRound(1);
}

// ===== LOAD ROUND =====
function loadRound(roundNumber) {
    const roundInfo = ROUND_STORIES[roundNumber - 1];
    const intensity = ROUND_INTENSITY[roundNumber];
    
    console.log(`Loading Round ${roundNumber}`);
    
    const gameScreen = document.getElementById('gameScreen');
    gameScreen.classList.remove('intensity-low', 'intensity-medium', 'intensity-high');
    gameScreen.classList.add(`intensity-${intensity.level}`);
    
    if (intensity.showWarning) {
        showFinalRoundWarning();
    } else {
        const existingWarning = document.querySelector('.final-round-warning');
        if (existingWarning) existingWarning.remove();
    }
    
    document.getElementById('currentRound').textContent = roundNumber;
    document.getElementById('totalRoundsDisplay').textContent = gameState.totalRounds;
    document.getElementById('totalBudget').textContent = roundInfo.budget;
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
    
    setupInsuranceUI();
    document.getElementById('allocationForm').reset();
    resetAllocationInputs();
    updateAllocation();
    showScreen('gameScreen');
}

function showFinalRoundWarning() {
    const roundHeader = document.querySelector('.round-header');
    if (!roundHeader) return;
    
    const existingWarning = document.querySelector('.final-round-warning');
    if (existingWarning) existingWarning.remove();
    
    const warningDiv = document.createElement('div');
    warningDiv.className = 'final-round-warning';
    warningDiv.innerHTML = `
        <div class="warning-banner">
            ⚠️ <strong>FINAL ROUND!</strong> This decision counts! ⚠️
        </div>
    `;
    
    roundHeader.parentNode.insertBefore(warningDiv, roundHeader);
}

// ===== SETUP INSURANCE UI =====
function setupInsuranceUI() {
    const insuranceContainer = document.getElementById('insuranceAllocationItem');
    const bundleInfo = BUNDLE_INFO[gameState.treatmentGroup] || BUNDLE_INFO.control;
    
    if (bundleInfo.hasBundle) {
        insuranceContainer.innerHTML = `
            <div class="item-header">
                <i class="fas fa-shield-alt"></i>
                <div class="item-info">
                    <h4>${bundleInfo.title}</h4>
                    <p>${bundleInfo.description}</p>
                    <span class="bundle-badge">Special Offer - ${bundleInfo.bundleCost} GHS</span>
                </div>
            </div>
            <div class="item-input bundle-toggle">
                <label class="bundle-checkbox">
                    <input type="checkbox" id="bundleAccepted" onchange="handleBundleToggle()">
                    <span>Buy Bundle (${bundleInfo.bundleCost} GHS)</span>
                </label>
                <input type="hidden" id="insuranceSpend" value="0">
            </div>
        `;
    } else {
        insuranceContainer.innerHTML = `
            <div class="item-header">
                <i class="fas fa-shield-alt"></i>
                <div class="item-info">
                    <h4>${bundleInfo.title}</h4>
                    <p>${bundleInfo.description}</p>
                </div>
            </div>
            <div class="item-input">
                <input type="number" id="insuranceSpend" min="0" value="0" oninput="updateAllocation()">
                <span class="currency">GHS</span>
            </div>
        `;
    }
}

function handleBundleToggle() {
    const bundleAccepted = document.getElementById('bundleAccepted').checked;
    const bundleInfo = BUNDLE_INFO[gameState.treatmentGroup];
    const insuranceSpendInput = document.getElementById('insuranceSpend');
    
    if (bundleAccepted) {
        insuranceSpendInput.value = bundleInfo.bundleCost;
    } else {
        insuranceSpendInput.value = 0;
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
    
    if (remaining < 0) {
        remainingEl.style.color = 'var(--danger)';
        submitBtn.disabled = true;
    } else if (remaining > 0) {
        remainingEl.style.color = 'var(--info)';
        submitBtn.disabled = true;
    } else {
        remainingEl.style.color = 'var(--success)';
        submitBtn.disabled = false;
    }
}

// ===== WEATHER & OUTCOMES =====
function generateWeatherEvent() {
    const rand = Math.random();
    
    if (rand < 0.4) return WEATHER_TYPES.GOOD;
    else if (rand < 0.7) return WEATHER_TYPES.MILD_DROUGHT;
    else if (rand < 0.9) return WEATHER_TYPES.SEVERE_DROUGHT;
    else return WEATHER_TYPES.FLOOD;
}

function calculateOutcomes(roundData, weather) {
    const baseHarvest = roundData.budget * 0.8;
    const inputBoost = roundData.inputSpend * 1.5;
    roundData.harvestOutcome = Math.round((baseHarvest + inputBoost) * weather.harvestMultiplier);
    
    if (roundData.insuranceSpend > 0 && weather.type !== 'normal') {
        roundData.payoutReceived = Math.round(roundData.insuranceSpend * 3 * weather.payoutMultiplier);
    } else {
        roundData.payoutReceived = 0;
    }
    
    roundData.endTime = new Date();
}

function showWeatherOutcome(roundData, weather) {
    const roundNumber = roundData.roundNumber;
    const isGoodWeather = weather.type === 'normal';
    
    if (roundNumber === 4) {  // Changed from 3 to 4
        if (!isGoodWeather) {
            setTimeout(() => {
                displayWeatherResult(roundData, weather);
            }, 2000);
            return;
        } else {
            setTimeout(() => {
                showConfetti();
            }, 1000);
        }
    }
    
    displayWeatherResult(roundData, weather);
}

function displayWeatherResult(roundData, weather) {
    const animation = document.getElementById('weatherAnimation');
    animation.innerHTML = getWeatherVisual(weather);
    animation.style.background = weather.color;
    
    document.getElementById('weatherTitle').textContent = weather.title;
    
    // ENHANCED: Show if insurance helped
    let weatherDesc = weather.desc;
    if (roundData.payoutReceived > 0) {
        weatherDesc += ` Your insurance protected you with a ${roundData.payoutReceived} GHS payout!`;
    } else if (roundData.insuranceSpend > 0 && weather.type === 'normal') {
        weatherDesc += ` No insurance payout needed - weather was good.`;
    }
    document.getElementById('weatherDescription').textContent = weatherDesc;
    
    document.getElementById('harvestValue').textContent = roundData.harvestOutcome + ' GHS';
    document.getElementById('payoutValue').textContent = roundData.payoutReceived + ' GHS';
    
    // ENHANCED: Show total earnings with insurance contribution clearly
    const totalEarnings = roundData.harvestOutcome + roundData.payoutReceived;
    const finalIncomeEl = document.getElementById('finalIncomeValue');
    finalIncomeEl.textContent = totalEarnings + ' GHS';
    
    // Add explanation if insurance contributed
    const insuranceNote = document.getElementById('insuranceContributionNote');
    if (insuranceNote) insuranceNote.remove();
    
    if (roundData.payoutReceived > 0) {
        const noteDiv = document.createElement('div');
        noteDiv.id = 'insuranceContributionNote';
        noteDiv.style.cssText = 'background: #E8F5E9; padding: 15px; border-radius: 12px; margin-top: 15px; text-align: center; font-weight: 600; color: #2E7D32;';
        noteDiv.innerHTML = `
            💚 Your insurance payout of ${roundData.payoutReceived} GHS increased your total income to ${totalEarnings} GHS!<br>
            <small style="font-weight: normal; color: #555;">Without insurance, you would have only earned ${roundData.harvestOutcome} GHS</small>
        `;
        document.querySelector('.outcome-cards').after(noteDiv);
    }
    
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

function nextRound() {
    if (gameState.currentRound < 4) {  // Changed from 3 to 4
        gameState.currentRound++;
        loadRound(gameState.currentRound);
    } else {
        showScreen('knowledgeScreen');
    }
}

// ===== SECOND PARTNER & COUPLE FLOW =====
function showSecondPartnerPrompt() {
    const promptScreen = document.getElementById('secondPartnerScreen');
    const messageEl = promptScreen.querySelector('.prompt-message');
    if (messageEl) {
        messageEl.innerHTML = `
            <h2>First Partner Completed! 🎉</h2>
            <p>The ${gameState.role} has finished playing individually.</p>
            <p>Now it's time for the second partner to play on their own.</p>
            <p><strong>The second partner will:</strong></p>
            <ul style="text-align: left; max-width: 500px; margin: 20px auto;">
                <li>Answer demographic questions</li>
                <li>Complete risk assessment</li>
                <li>Answer empowerment questions</li>
                <li>Play 4 rounds individually</li>
                <li>Take the knowledge test</li>
            </ul>
        `;
    }
    showScreen('secondPartnerScreen');
}

function startSecondPartner() {
    console.log('Starting second partner...');
    
    // Store first respondent info
    if (!gameState.firstRespondentId) {
        gameState.firstRespondentId = gameState.respondentId;
        gameState.firstRespondentData = {
            ...gameState.demographics,
            treatmentGroup: gameState.treatmentGroup
        };
    }
    
    // Reset for second partner
    gameState.respondentId = null;
    gameState.sessionId = null;
    gameState.demographics = {};
    gameState.empowermentScores = {};
    gameState.roundData = [];
    gameState.currentRound = 1;
    gameState.gender = null;
    gameState.role = null;
    
    // Go to demographics for second partner
    showScreen('demographicsScreen');
}

function showCouplePrompt() {
    const promptScreen = document.getElementById('coupleScreen');
    const messageEl = promptScreen.querySelector('.prompt-message');
    if (messageEl) {
        messageEl.innerHTML = `
            <h2>Both Partners Completed Individual Play! 🎉</h2>
            <p>Now it's time for both of you to play together as a couple.</p>
            <p><strong>You will:</strong></p>
            <ul style="text-align: left; max-width: 500px; margin: 20px auto;">
                <li>Answer questions about your marriage</li>
                <li>Make joint decisions for 4 farming rounds</li>
                <li>Work together to allocate resources</li>
            </ul>
        `;
    }
    showScreen('coupleScreen');
}

function startCouplePreQuestions() {
    showScreen('couplePreQuestionsScreen');
}

function startCoupleSession() {
    // This will be called after couple pre-questions
    gameState.sessionType = 'couple_joint';
    showScreen('tutorialScreen');
    initializeTutorial();
}

// ===== RESULTS =====
async function showResults() {
    try {
        const session = await apiCall(`/session/${gameState.sessionId}`);
        const knowledge = await apiCall(`/knowledge/${gameState.respondentId}`);
        
        document.getElementById('totalEarnings').textContent = session.totalEarnings + ' GHS';
        document.getElementById('totalInsurance').textContent = session.totalInsuranceSpent + ' GHS';
        document.getElementById('totalPayouts').textContent = session.totalPayoutsReceived + ' GHS';
        document.getElementById('knowledgeScore').textContent = knowledge.knowledgeScore + '/5';
        
        let insights = '<ul style="text-align: left; max-width: 600px; margin: 0 auto; font-size: 16px; line-height: 1.8;">';
        
        const insuranceRate = session.totalInsuranceSpent / (session.totalEarnings + session.totalInsuranceSpent);
        
        if (insuranceRate > 0.2) {
            insights += '<li>You invested heavily in insurance - very risk-averse!</li>';
        } else if (insuranceRate < 0.1) {
            insights += '<li>You took more risk by spending less on insurance.</li>';
        }
        
        if (session.totalPayoutsReceived > session.totalInsuranceSpent) {
            insights += '<li>🎉 Insurance paid off! You earned ' + (session.totalPayoutsReceived - session.totalInsuranceSpent) + ' GHS more than you spent.</li>';
        } else if (session.totalInsuranceSpent > 0 && session.totalPayoutsReceived === 0) {
            insights += '<li>⚠️ You paid for insurance but received no payouts - weather was favorable.</li>';
        }
        
        if (knowledge.knowledgeScore >= 4) {
            insights += '<li>✅ Excellent understanding of weather insurance!</li>';
        } else if (knowledge.knowledgeScore <= 2) {
            insights += '<li>📚 Consider reviewing how weather index insurance works.</li>';
        }
        
        insights += '</ul>';
        document.getElementById('insightsContent').innerHTML = insights;
        
        // FIXED: Determine next flow based on session progress
        if (gameState.sessionType === 'individual_husband' && !gameState.secondRespondentId) {
            // First partner (husband) completed - show prompt for second partner
            console.log('First partner completed, showing second partner prompt');
            setTimeout(() => {
                showSecondPartnerPrompt();
            }, 3000);
        } else if (gameState.sessionType === 'individual_wife' && gameState.firstRespondentId && !gameState.coupleInfo.marriageDuration) {
            // Second partner (wife) completed - show couple prompt
            console.log('Second partner completed, showing couple prompt');
            setTimeout(() => {
                showCouplePrompt();
            }, 3000);
        } else {
            // Show regular results screen
            showScreen('resultsScreen');
        }
    } catch (error) {
        console.error('Error loading results:', error);
        showScreen('resultsScreen');
    }
}

function restartGame() {
    if (confirm('Are you sure you want to restart? All progress will be lost.')) {
        location.reload();
    }
}

// ===== EVENT LISTENERS =====
document.addEventListener('DOMContentLoaded', function() {
    console.log('Weather Index Insurance Game Loaded - Ghana Edition - 4 Rounds');

    // Welcome
    const startBtn = document.getElementById('startBtn');
    if (startBtn) startBtn.addEventListener('click', startDemographics);

    // Tutorial touch swipe
    const cardStack = document.getElementById('tutorialCardStack');
    if (cardStack) {
        cardStack.addEventListener('touchstart', handleTouchStart, false);
        cardStack.addEventListener('touchend', handleTouchEnd, false);
    }

    // Navigation
    const nextRoundBtn = document.getElementById('nextRoundBtn');
    if (nextRoundBtn) nextRoundBtn.addEventListener('click', nextRound);

    const restartBtn = document.getElementById('restartBtn');
    if (restartBtn) restartBtn.addEventListener('click', restartGame);

    // Allocation inputs
    ['inputSpend', 'educationSpend', 'consumptionSpend'].forEach(inputId => {
        const input = document.getElementById(inputId);
        if (input) input.addEventListener('input', updateAllocation);
    });

    // Demographics Form
    const demoForm = document.getElementById('demographicsForm');
    if (demoForm) {
        demoForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            showLoading();
            
            try {
                const formData = new FormData(e.target);
                const crops = Array.from(document.querySelectorAll('input[name="crops"]:checked'))
                    .map(cb => cb.value);
                
                gameState.demographics = {
                    householdId: gameState.householdId,
                    gender: formData.get('gender'),
                    role: formData.get('role'),
                    age: parseInt(formData.get('age')),
                    education: parseInt(formData.get('education')),
                    yearsOfFarming: parseInt(formData.get('farmingYears')),
                    landCultivated: parseFloat(formData.get('landSize')),
                    mainCrops: crops,
                    lastSeasonIncome: parseFloat(formData.get('lastIncome')),
                    priorInsuranceKnowledge: formData.get('priorKnowledge') === '1',
                    language: gameState.language
                };
                
                gameState.gender = formData.get('gender');
                gameState.role = formData.get('role');
                
                showLoading(false);
                showScreen('riskScreen');
            } catch (error) {
                showLoading(false);
                alert('Error: ' + error.message);
            }
        });
    }

    // Risk Form
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
                alert('Error: ' + error.message);
            }
        });
    }

    // Empowerment Form
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
                
                const respondent = await apiCall('/respondent/create', 'POST', respondentData);
                gameState.respondentId = respondent._id;
                gameState.treatmentGroup = respondent.treatmentGroup;
                
                // Track which respondent this is
                if (gameState.role === 'husband' && !gameState.firstRespondentId) {
                    gameState.firstRespondentId = respondent._id;
                    gameState.sessionType = 'individual_husband';
                } else if (gameState.role === 'wife') {
                    if (gameState.firstRespondentId) {
                        gameState.secondRespondentId = respondent._id;
                        gameState.sessionType = 'individual_wife';
                    } else {
                        gameState.firstRespondentId = respondent._id;
                        gameState.sessionType = 'individual_wife';
                    }
                }
                
                const session = await apiCall('/session/start', 'POST', { 
                    respondentId: gameState.respondentId,
                    sessionType: gameState.sessionType
                });
                gameState.sessionId = session.sessionId;
                
                showLoading(false);
                showScreen('tutorialScreen');
                initializeTutorial();
            } catch (error) {
                showLoading(false);
                alert('Error: ' + error.message);
            }
        });
    }

    // Couple Pre-Questions Form
    const couplePreForm = document.getElementById('couplePreQuestionsForm');
    if (couplePreForm) {
        couplePreForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            showLoading();
            
            try {
                const formData = new FormData(e.target);
                gameState.coupleInfo.marriageDuration = parseInt(formData.get('marriageDuration'));
                gameState.coupleInfo.numberOfChildren = parseInt(formData.get('numberOfChildren'));
                
                console.log('Couple info saved:', gameState.coupleInfo);
                
                showLoading(false);
                startCoupleSession();
            } catch (error) {
                showLoading(false);
                alert('Error: ' + error.message);
            }
        });
    }

    // Allocation Form
    const allocForm = document.getElementById('allocationForm');
    if (allocForm) {
        allocForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            showLoading();
            
            try {
                const budget = parseInt(document.getElementById('totalBudget').textContent);
                const bundleCheckbox = document.getElementById('bundleAccepted');
                const bundleAccepted = bundleCheckbox ? bundleCheckbox.checked : false;
                
                const roundData = {
                    respondentId: gameState.respondentId,
                    sessionId: gameState.sessionId,
                    roundNumber: gameState.currentRound,
                    budget: budget,
                    insuranceSpend: parseInt(document.getElementById('insuranceSpend').value) || 0,
                    inputSpend: parseInt(document.getElementById('inputSpend').value) || 0,
                    educationSpend: parseInt(document.getElementById('educationSpend').value) || 0,
                    consumptionSpend: parseInt(document.getElementById('consumptionSpend').value) || 0,
                    decisionContext: gameState.sessionType,
                    isPracticeRound: false,
                    bundleAccepted: bundleAccepted,
                    bundleProduct: bundleAccepted ? 
                        (gameState.treatmentGroup === 'fertilizer_bundle' ? 'fertilizer' : 'seedling') : 'none',
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
                
                roundData.weatherShock = {
                    occurred: weather.type !== 'normal',
                    type: weather.type,
                    severity: severity
                };
                
                calculateOutcomes(roundData, weather);
                await apiCall('/round/save', 'POST', roundData);
                gameState.roundData.push(roundData);
                
                showLoading(false);
                showWeatherOutcome(roundData, weather);
            } catch (error) {
                showLoading(false);
                alert('Error: ' + error.message);
            }
        });
    }

    // Knowledge Form
    const knowledgeForm = document.getElementById('knowledgeForm');
    if (knowledgeForm) {
        knowledgeForm.addEventListener('submit', async (e) => {
            e.preventDefault();
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
                
                await apiCall('/knowledge/submit', 'POST', testData);
                await apiCall(`/session/${gameState.sessionId}/complete`, 'PUT');
                
                showLoading(false);
                showResults();
            } catch (error) {
                showLoading(false);
                alert('Error: ' + error.message);
            }
        });
    }

    // Language toggle
    const langBtn = document.getElementById('languageBtn');
    if (langBtn) {
        langBtn.addEventListener('click', () => {
            gameState.language = gameState.language === 'english' ? 'dagbani' : 'english';
            document.getElementById('currentLang').textContent = 
                gameState.language === 'english' ? 'English' : 'Dagbani';
        });
    }
    
    // Second Partner Button
    const startSecondBtn = document.getElementById('startSecondPartnerBtn');
    if (startSecondBtn) startSecondBtn.addEventListener('click', startSecondPartner);
    
    // Couple Prompt Button
    const startCouplePromptBtn = document.getElementById('startCouplePromptBtn');
    if (startCouplePromptBtn) startCouplePromptBtn.addEventListener('click', startCouplePreQuestions);
});