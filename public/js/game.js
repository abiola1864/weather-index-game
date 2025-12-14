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



// ===== DAGBANI TRANSLATIONS =====
// Add this object at the top of your game.js file (after gameState)

// ===============================================
// CONSOLIDATED FIX FOR game.js
// Copy and replace the relevant sections
// ===============================================

// ===== 1. REPLACE THE TRANSLATIONS OBJECT =====
// Find the existing TRANSLATIONS object and replace it with this:

// ===== COMPLETE DAGBANI TRANSLATIONS =====
// Replace the existing TRANSLATIONS object with this complete version

const TRANSLATIONS = {
    english: {
        welcome: {
            title: "Farming Decisions Game",
            subtitle: "Make important decisions for your farm and family across 4 seasons",
            seasons: "4 Farming Seasons",
            seasonsDesc: "Experience different challenges and make strategic choices each season",
            decisions: "Real Trade-offs",
            decisionsDesc: "Balance farm investments, education, and household needs with limited resources",
            weather: "Weather Challenges",
            weatherDesc: "Face unpredictable weather that affects your harvest and livelihood",
            startBtn: "Begin Your Journey"
        },
        demographics: {
            title: "Tell Us About Yourself",
            gender: "Gender",
            male: "Male",
            female: "Female",
            role: "Role in Household",
            husband: "Husband",
            wife: "Wife",
            age: "Age (years)",
            education: "Highest Education Level",
            noSchooling: "No schooling",
            primary: "Primary",
            jhs: "Junior High School (JHS)",
            shs: "Senior High School (SHS)",
            tertiary: "Tertiary/Technical",
            farmingYears: "Years of Farming Experience",
            land: "Land Cultivated (acres)",
            crops: "Main Crops (select all that apply)",
            maize: "Maize",
            rice: "Rice",
            soybeans: "Soybeans",
            groundnuts: "Groundnuts",
            other: "Other",
            income: "Last Season Income (GHS)",
            priorKnowledge: "Have you heard about weather index insurance before?"
        },
        risk: {
            title: "Understanding Your Risk Preferences",
            scenario: "If you had to choose between these two options:",
            guaranteed: "Guaranteed 200 GHS",
            guaranteedDesc: "You receive 200 GHS for sure",
            chance: "Take a Chance",
            chanceDesc: "50% chance of 450 GHS or nothing",
            comfort: "How comfortable are you with financial risks?",
            notAtAll: "1 - Not at all",
            level2: "2",
            neutral: "3 - Neutral",
            level4: "4",
            veryComfortable: "5 - Very comfortable",
            decisionMaker: "Who usually makes major farm investment decisions?",
            mainlyHusband: "Mainly husband",
            mainlyWife: "Mainly wife",
            joint: "Joint decisions",
            otherMember: "Another household member"
        },
        empowerment: {
            title: "Decision Making in Your Household",
            subtitle: "Please indicate your level of agreement with each statement",
            q1: "I have a say in decisions about which crops to plant",
            q2: "I help decide how money earned from farming is used",
            q3: "I can decide whether we buy inputs each season",
            q4: "My opinion is considered in financial matters",
            q5: "I feel confident expressing my preferences",
            stronglyDisagree: "Strongly Disagree",
            stronglyAgree: "Strongly Agree"
        },
        game: {
            season: "Season",
            budget: "Your Budget",
            allocateTitle: "How will you spend your money?",
            insurance: "Weather Insurance",
            insuranceDesc: "Protection against bad weather",
            bundleFertilizer: "Weather Insurance + Fertilizer Bundle",
            bundleSeeds: "Weather Insurance + Improved Seeds Bundle",
            bundleDescFertilizer: "Insurance protection PLUS 2 bags of NPK fertilizer",
            bundleDescSeeds: "Insurance protection PLUS hybrid maize seeds",
            fixedPrice: "Fixed Price",
            buyInsurance: "Buy Insurance",
            buyBundle: "Buy Bundle",
            chooseInput: "Choose ONE farm input to receive with insurance:",
            selectInputType: "-- Select Input Type --",
            improvedSeeds: "🌱 Improved Seeds (drought-resistant)",
            npkFertilizer: "🌾 NPK Fertilizer (2 bags)",
            selectInputWarning: "⚠️ Please select an input type before submitting",
            inputs: "Additional Farm Inputs",
            inputsDesc: "Extra seeds, tools, labor",
            education: "Education",
            educationDesc: "School fees, books",
            household: "Household Needs",
            householdDesc: "Food, clothing, other needs",
            total: "Total Spent:",
            remaining: "Remaining:",
            submitBtn: "Submit Allocation",
            individualPlay: "Individual Play",
            husbandPlaying: "👨 Husband Playing Alone",
            wifePlaying: "👩 Wife Playing Alone",
            couplePlaying: "👫 Couple Playing Together"
        },
        weather: {
            goodTitle: "Good Weather!",
            goodDesc: "Normal rainfall. Your crops grew well!",
            mildDroughtTitle: "Mild Drought",
            mildDroughtDesc: "Below average rainfall affected your harvest.",
            severeDroughtTitle: "Severe Drought!",
            severeDroughtDesc: "Very low rainfall. Major crop damage.",
            floodTitle: "Flooding!",
            floodDesc: "Heavy rains damaged crops.",
            harvest: "Harvest Outcome",
            insurancePayout: "Insurance Payout",
            finalIncome: "Final Income",
            continueNext: "Continue to Next Season",
            continueKnowledge: "Continue to Knowledge Test",
            completeFeedback: "Complete & Share Feedback",
            harvestBoost: "Your harvest was boosted by 50% (1.5x).",
            harvestReduced70: "Your harvest was reduced to 70% of normal.",
            harvestReduced30: "Your harvest was reduced to only 30% of normal.",
            harvestReduced50: "Your harvest was reduced to 50% of normal.",
            insurancePaidOut: "Your insurance paid out {multiplier}x what you paid ({paid} GHS → {received} GHS)!",
            noPayoutNeeded: "No insurance payout needed - weather was good.",
            noInsurance: "You didn't buy insurance this season.",
            insuranceProtected: "💚 Insurance Protected You!",
            insuranceReturn: "You paid {paid} GHS → Got {received} GHS back = {multiplier}x return!",
            takeTime: "Take your time to review the results before continuing"
        },
        seasons: {
            s1Name: "Planting Season - March",
            s1Story: "The planting season begins. You have 500 GHS to prepare for farming.",
            s2Name: "Growing Season - May",
            s2Story: "Your crops are growing. Some neighbors talk about weather patterns. Budget: 550 GHS.",
            s3Name: "Mid-Season - July",
            s3Story: "Weather reports are mixed. Many farmers are concerned. You must decide wisely. Budget: 600 GHS.",
            s4Name: "Final Season - September",
            s4Story: "⚠️ FINAL SEASON! The rains are unpredictable. Your family's future depends on this decision! Budget: 650 GHS.",
            finalWarning: "⚠️ FINAL SEASON! This decision counts! ⚠️"
        },
        knowledge: {
            title: "Test Your Understanding",
            subtitle: "Answer these questions about weather index insurance",
            q1: "Weather index insurance pays out based on rainfall conditions, not on whether my own farm was damaged.",
            q2: "If there is a drought according to the index, all insured farmers in the area receive payouts.",
            q3: "Insurance guarantees that I will earn more profit every season.",
            q4: "The cost of insurance is paid before the farming season begins.",
            q5: "It is possible to receive no payout even if my harvest is poor, if rainfall conditions were normal.",
            true: "True",
            false: "False",
            submit: "Submit Answers"
        },
        perception: {
            title: "Your Experience with the Bundle",
            subtitle: "Share your thoughts about the insurance and farming bundle you experienced",
            q1: "How much did the bundle (insurance + inputs) influence your farming decisions?",
            q2: "How well do you understand how weather index insurance works?",
            q3: "Would you be willing to pay for this bundle in real life?",
            q4: "How likely are you to recommend this bundle to other farmers?",
            q5: "Do you think the insurance payouts were fair?",
            q6: "How much do you trust that insurance companies would pay out in real life?",
            q7: "How valuable was getting insurance AND farming inputs together in one package?",
            q8: "If this bundle was available next season, how likely would you be to use it?",
            notAtAll: "Not at all",
            veryMuch: "Very much",
            dontUnderstand: "Don't understand at all",
            understandCompletely: "Understand completely",
            yes: "Yes",
            no: "No",
            veryUnlikely: "Very unlikely",
            veryLikely: "Very likely",
            veryUnfair: "Very unfair",
            veryFair: "Very fair",
            dontTrust: "Don't trust at all",
            trustCompletely: "Trust completely",
            notValuable: "Not valuable at all",
            extremelyValuable: "Extremely valuable",
            definitelyNot: "Definitely not",
            definitelyYes: "Definitely yes",
            submit: "Submit Assessment"
        },
        couple: {
            title: "About Your Marriage",
            subtitle: "Before you begin playing together, please answer these questions",
            marriageDuration: "How long have you been married?",
            lessThan1: "Less than 1 year",
            years12: "1-2 years",
            years35: "3-5 years",
            years610: "6-10 years",
            years1115: "11-15 years",
            years1620: "16-20 years",
            moreThan20: "More than 20 years",
            numberOfChildren: "How many children do you have?",
            enterNumber: "Enter number of children",
            rememberInfo: "Remember: You will now make decisions together. Discuss each choice and reach agreement before proceeding.",
            startSession: "Start Couple Session"
        },
        results: {
            title: "Game Completed!",
            subtitle: "Here's how you performed",
            firstPartnerComplete: "First Partner Complete!",
            secondPartnerComplete: "Second Partner Complete!",
            totalEarnings: "Total Earnings",
            insuranceSpent: "Insurance Spent",
            payoutsReceived: "Payouts Received",
            knowledgeScore: "Knowledge Score",
            insights: "Key Insights",
            playAgain: "Play Again",
            startNew: "Start New Game"
        },
        common: {
            continue: "Continue",
            loading: "Loading...",
            yes: "Yes",
            no: "No",
            select: "Select..."
        }
    },
    
    dagbani: {
        welcome: {
            title: "Puuni Chɛŋa Ayi",
            subtitle: "Ti chɛm zugu bee ni yi puuni ni yi doo yuli kpeeni 4",
            seasons: "Puuni Kpeeni 4",
            seasonsDesc: "Yi nya lahira gbɛma bee yi chɛm chɛŋa kpeeni pam zaa",
            decisions: "Chɛŋa Tiŋa",
            decisionsDesc: "Ti yi puuni di, karimi ni doo yuli di maa bee mali ŋmani",
            weather: "Saŋa Lahira",
            weatherDesc: "Yi saŋa ni ka yɛl yini ka ni yi puuni",
            startBtn: "Ti Dɔɣi"
        },
        demographics: {
            title: "Ti Pam Yi Yɛltɔɣa",
            gender: "Sabinima",
            male: "Niriba",
            female: "Puhima",
            role: "Yi Yuli Doo Zaa",
            husband: "O Yidana",
            wife: "O Paga",
            age: "Yi Himɔɣu (Yiŋa)",
            education: "Karimi Ni Yi Nya",
            noSchooling: "Ban karimi",
            primary: "Primary",
            jhs: "JHS",
            shs: "SHS",
            tertiary: "Tertiary/Technical",
            farmingYears: "Yiŋa Ni Yi Puuni",
            land: "Tɔɣim Ni Yi Puuni (acres)",
            crops: "Yi Puuni Ni Yi Chɛ (chɛ zaa)",
            maize: "Zaamnɛ",
            rice: "Mɔɣu",
            soybeans: "Soya",
            groundnuts: "Suma",
            other: "Din",
            income: "Mali Ni Yi Nya Kpeeni Zaŋ Pam (GHS)",
            priorKnowledge: "Yi lahi saŋa insurance zaŋ?"
        },
        risk: {
            title: "Yi Lahira Chɛŋa",
            scenario: "Ka yi chɛm ni ayi zuɣu:",
            guaranteed: "200 GHS Ni Yɛlni",
            guaranteedDesc: "Yi nya 200 GHS tiŋa",
            chance: "Ti Nya Lahira",
            chanceDesc: "50% yi nya 450 GHS bee ka mali",
            comfort: "Yi lahiri saŋa mali?",
            notAtAll: "1 - Kani",
            level2: "2",
            neutral: "3 - Neutral",
            level4: "4",
            veryComfortable: "5 - Yɛlni pam",
            decisionMaker: "Ŋun ni chɛ chɛŋa puuni di?",
            mainlyHusband: "O yidana pam",
            mainlyWife: "O paga pam",
            joint: "Bee nya",
            otherMember: "Din bi"
        },
        empowerment: {
            title: "Chɛŋa Yi Doo Zaa",
            subtitle: "Ti pahi ka yi lahiri",
            q1: "Mi chɛŋi puuni ni mi chɛ",
            q2: "Mi chɛŋi mali ni mi nya puuni",
            q3: "Mi chɛŋi ka mi sa puuni di",
            q4: "Ban lahiri mi chɛŋa mali zaa",
            q5: "Mi lahiri ka mi pahi mi lahi",
            stronglyDisagree: "Mi ka lahiri kani",
            stronglyAgree: "Mi lahiri pam"
        },
        game: {
            season: "Kpeeni",
            budget: "Yi Mali",
            allocateTitle: "Ka yi sa yi mali lahiri?",
            insurance: "Saŋa Insurance",
            insuranceDesc: "Saŋa nyɛlibu",
            bundleFertilizer: "Saŋa Insurance + Fertilizer",
            bundleSeeds: "Saŋa Insurance + Zaamnɛ Nyɛlibu",
            bundleDescFertilizer: "Insurance ni NPK fertilizer baga ayi",
            bundleDescSeeds: "Insurance ni zaamnɛ nyɛlibu",
            fixedPrice: "Mali Tiŋa",
            buyInsurance: "Sa Insurance",
            buyBundle: "Sa Bundle",
            chooseInput: "Chɛ puuni di ni yi nya insurance:",
            selectInputType: "-- Chɛ Di --",
            improvedSeeds: "🌱 Zaamnɛ Nyɛlibu",
            npkFertilizer: "🌾 NPK Fertilizer (baga ayi)",
            selectInputWarning: "⚠️ Chɛ puuni di ni yi pahi",
            inputs: "Puuni Di Din",
            inputsDesc: "Zaamnɛ, tools, niŋa",
            education: "Karimi",
            educationDesc: "Karimi mali, buka",
            household: "Doo Yuli",
            householdDesc: "Dimi, suhiya, din bee",
            total: "Zaa:",
            remaining: "Ni Yɛm:",
            submitBtn: "Ti Di",
            individualPlay: "Yi Yɛɣini Ayi",
            husbandPlaying: "👨 O Yidana Ayi",
            wifePlaying: "👩 O Paga Ayi",
            couplePlaying: "👫 Bee Nya Ayi"
        },
        weather: {
            goodTitle: "Saŋa Nyɛlibu!",
            goodDesc: "Koom ŋmani. Yi puuni nya nyɛlibu!",
            mildDroughtTitle: "Koom Kpɛrigu",
            mildDroughtDesc: "Koom ban ŋmani yi puuni.",
            severeDroughtTitle: "Koom Kpɛrigu Pam!",
            severeDroughtDesc: "Koom ban yɛl kani. Yi puuni ku.",
            floodTitle: "Koom Nyinini!",
            floodDesc: "Koom nyini yi puuni ku.",
            harvest: "Puuni Ni Yi Nya",
            insurancePayout: "Insurance Mali",
            finalIncome: "Mali Zaa",
            continueNext: "Ti Kpeeni Din",
            continueKnowledge: "Ti Knowledge Test",
            completeFeedback: "Ti Pahi Yi Lahi",
            harvestBoost: "Yi puuni nya 50% pam (1.5x).",
            harvestReduced70: "Yi puuni ku 70%.",
            harvestReduced30: "Yi puuni ku 30% yɛɣini.",
            harvestReduced50: "Yi puuni ku 50%.",
            insurancePaidOut: "Yi insurance di {multiplier}x mali ({paid} GHS → {received} GHS)!",
            noPayoutNeeded: "Insurance ban di - saŋa nyɛlibu.",
            noInsurance: "Yi ban sa insurance kpeeni ŋɔ.",
            insuranceProtected: "💚 Insurance Nyɛli Yi!",
            insuranceReturn: "Yi di {paid} GHS → Nya {received} GHS = {multiplier}x!",
            takeTime: "Nya lahira ni yi ti dɔɣi"
        },
        seasons: {
            s1Name: "Puuni Kpeeni - March",
            s1Story: "Puuni kpeeni dɔɣi. Yi nya 500 GHS puuni di.",
            s2Name: "Puuni Nyini - May",
            s2Story: "Yi puuni nyini. Ninkurli pahi saŋa. Mali: 550 GHS.",
            s3Name: "Kpeeni Chɛla - July",
            s3Story: "Saŋa lahira gbɛma. Puunima lahiri. Yi chɛŋi nyɛlibu. Mali: 600 GHS.",
            s4Name: "Kpeeni Zaŋ Pam - September",
            s4Story: "⚠️ KPEENI ZAŊ PAM! Koom lahira gbɛma. Yi doo yuli kpeeni chɛŋa ŋɔ! Mali: 650 GHS.",
            finalWarning: "⚠️ KPEENI ZAŊ PAM! Chɛŋa ŋɔ yɛlni! ⚠️"
        },
        knowledge: {
            title: "Ti Nya Ka Yi Lahi",
            subtitle: "Ti pahi saŋa insurance zaŋa",
            q1: "Saŋa insurance di koom lahira, ka yi puuni lahira.",
            q2: "Ka koom kpɛrigu, banbu zaa ni insurance nya mali.",
            q3: "Insurance yɛlni ka yi nya mali kpeeni zaa.",
            q4: "Yi di insurance mali ni kpeeni ka dɔɣi.",
            q5: "Yi ni nya insurance mali ka yi puuni ban nyɛlibu, ka koom nyɛlibu.",
            true: "Yɛlni",
            false: "Bani",
            submit: "Ti Pahi"
        },
        perception: {
            title: "Yi Lahi Bundle Zaa",
            subtitle: "Pahi yi lahi insurance ni puuni di bundle ni yi nya",
            q1: "Bundle (insurance + puuni di) nyɛ yi puuni chɛŋa lahiri?",
            q2: "Yi lahi saŋa insurance niŋi lahiri?",
            q3: "Yi di mali bundle ŋɔ ka yɛl tiŋa?",
            q4: "Yi pahi din puunima ka sa bundle ŋɔ lahiri?",
            q5: "Yi lahi insurance mali yɛlni?",
            q6: "Yi lahi insurance company be di lahiri?",
            q7: "Insurance NI puuni di bee yɛlni lahiri?",
            q8: "Ka bundle ŋɔ yɛl kpeeni din, yi sa lahiri?",
            notAtAll: "Kani",
            veryMuch: "Pam",
            dontUnderstand: "Mi ka lahi kani",
            understandCompletely: "Mi lahi pam",
            yes: "Yɔɔ",
            no: "Ayi",
            veryUnlikely: "Kani pam",
            veryLikely: "Yɛlni pam",
            veryUnfair: "Ka yɛl kani pam",
            veryFair: "Yɛlni pam",
            dontTrust: "Mi ka lahi kani",
            trustCompletely: "Mi lahi pam",
            notValuable: "Ka yɛlni kani",
            extremelyValuable: "Yɛlni pam",
            definitelyNot: "Kani tiŋa",
            definitelyYes: "Yɛlni tiŋa",
            submit: "Ti Pahi"
        },
        couple: {
            title: "Yi Yuɣu Zaŋ",
            subtitle: "Ni ka yi dɔɣi ayi bee, ti pahi zaŋa di",
            marriageDuration: "Yiŋa lahira ni yi yuɣu?",
            lessThan1: "Kpɛ yiŋa 1",
            years12: "Yiŋa 1-2",
            years35: "Yiŋa 3-5",
            years610: "Yiŋa 6-10",
            years1115: "Yiŋa 11-15",
            years1620: "Yiŋa 16-20",
            moreThan20: "Yiŋa 20 pam",
            numberOfChildren: "Bihi lahira ni yi nya?",
            enterNumber: "Ti bihi nimdi",
            rememberInfo: "Lahiri: Yi be chɛm chɛŋa bee. Pahi ni yi chɛ chɛŋa ni yi ti dɔɣi.",
            startSession: "Ti Dɔɣi Bee Ayi"
        },
        results: {
            title: "Ayi Ti Pahi!",
            subtitle: "Yi chɛŋa lahira",
            firstPartnerComplete: "Bi Dɔɣi Ti Pahi!",
            secondPartnerComplete: "Bi Ayi Ti Pahi!",
            totalEarnings: "Mali Zaa",
            insuranceSpent: "Insurance Mali",
            payoutsReceived: "Mali Ni Yi Nya",
            knowledgeScore: "Lahi Score",
            insights: "Lahira Nyɛlibu",
            playAgain: "Ayi Din",
            startNew: "Dɔɣi Ayi Palli"
        },
        common: {
            continue: "Ti Dɔɣi",
            loading: "Yi Zaŋa...",
            yes: "Yɔɔ",
            no: "Ayi",
            select: "Chɛ..."
        }
    }
};




// Helper function to get translation

function t(key, params = {}) {
    const lang = gameState.language || 'english';
    const keys = key.split('.');
    let value = TRANSLATIONS[lang];
    
    for (const k of keys) {
        if (value && value[k] !== undefined) {
            value = value[k];
        } else {
            // Fallback to English
            value = TRANSLATIONS.english;
            for (const ek of keys) {
                if (value && value[ek] !== undefined) {
                    value = value[ek];
                } else {
                    return key;
                }
            }
            break;
        }
    }
    
    // Replace parameters like {multiplier}, {paid}, {received}
    if (typeof value === 'string' && Object.keys(params).length > 0) {
        for (const [param, val] of Object.entries(params)) {
            value = value.replace(new RegExp(`\\{${param}\\}`, 'g'), val);
        }
    }
    
    return value;
}


function getSeasonStory(seasonNumber) {
    const budgets = [500, 550, 600, 650];
    return {
        season: seasonNumber,
        seasonName: t(`seasons.s${seasonNumber}Name`),
        story: t(`seasons.s${seasonNumber}Story`),
        budget: budgets[seasonNumber - 1]
    };
}





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



// ===== REVISED API CALL FUNCTION WITH OFFLINE SUPPORT =====
// Replace the existing apiCall function in your game.js with this version

async function apiCall(endpoint, method = 'GET', data = null) {
    try {
        // Check if online
        if (!navigator.onLine) {
            console.log('📴 OFFLINE MODE - Using local storage');
            return window.offlineStorage.handleOfflineStorage(endpoint, method, data);
        }
        
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
        
        // If fetch fails due to network, switch to offline mode
        if (error.message.includes('Failed to fetch') || 
            error.message.includes('NetworkError') ||
            error.message.includes('Network request failed')) {
            console.log('📴 Network error - Switching to OFFLINE MODE');
            return window.offlineStorage.handleOfflineStorage(endpoint, method, data);
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
// ===== TUTORIAL SYSTEM - REVISED WITH LANGUAGE SUPPORT =====
function initializeTutorial() {
    console.log('Initializing tutorial for treatment:', gameState.treatmentGroup);
    console.log('Language:', gameState.language);
    
    const treatment = gameState.treatmentGroup || 'control';
    const language = gameState.language || 'english';
    
    // Get tutorial cards based on treatment AND language
    tutorialCards = getTutorialCardsForLanguage(treatment, language);
    
    console.log(`Loading ${tutorialCards.length} tutorial cards for ${treatment} group in ${language}`);
    
    const badge = document.getElementById('treatmentBadge');
    if (badge) {
        if (treatment === 'control') {
            if (language === 'dagbani') {
                badge.textContent = '📋 Puuni Yɛlibu';
            } else {
                badge.textContent = '📋 Standard Farming';
            }
            badge.style.background = 'linear-gradient(135deg, #006B3F, #00A651)';
        } else if (treatment === 'fertilizer_bundle') {
            if (language === 'dagbani') {
                badge.textContent = '🌾 Insurance + Fertilizer';
            } else {
                badge.textContent = '🌾 Insurance + Fertilizer Bundle';
            }
            badge.style.background = 'linear-gradient(135deg, #FCD116, #D4AF37)';
        } else {
            if (language === 'dagbani') {
                badge.textContent = '🌱 Insurance + Zaamnɛ Nyɛlibu';
            } else {
                badge.textContent = '🌱 Insurance + Improved Seeds Bundle';
            }
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
    const seasonInfo = getSeasonStory(seasonNumber);
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
    document.getElementById('storyText').textContent = seasonInfo.story;
    
    // Update "Season" label
    const seasonLabel = document.querySelector('.round-info h3 span[data-translate="game.season"]');
    if (seasonLabel) {
        seasonLabel.textContent = t('game.season');
    }
    
    // Update "Your Budget" label
    const budgetLabel = document.querySelector('.budget-display label');
    if (budgetLabel) {
        budgetLabel.textContent = t('game.budget');
    }
    
    // Session type text
    let sessionTypeText = t('game.individualPlay');
    if (gameState.sessionType === 'individual_husband') {
        sessionTypeText = t('game.husbandPlaying');
    } else if (gameState.sessionType === 'individual_wife') {
        sessionTypeText = t('game.wifePlaying');
    } else if (gameState.sessionType === 'couple_joint') {
        sessionTypeText = t('game.couplePlaying');
    }
    document.getElementById('roundContext').textContent = sessionTypeText;
    
    // Update allocate title
    const allocateTitle = document.querySelector('.allocation-container h3');
    if (allocateTitle) {
        allocateTitle.textContent = t('game.allocateTitle');
    }
    
    setupRandomizedAllocationUI();
    
    document.getElementById('allocationForm').reset();
    resetAllocationInputs();
    updateAllocation();
    updateNextRoundButtonText();
    
    showScreen('gameScreen');
}







// ===== SETUP RANDOMIZED UI =====
function setupRandomizedAllocationUI() {
    const bundleInfo = BUNDLE_INFO[gameState.treatmentGroup] || BUNDLE_INFO.control;
    
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
                            <h4>${t('game.inputs')}</h4>
                            <p>${t('game.inputsDesc')}</p>
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
                            <h4>${t('game.education')}</h4>
                            <p>${t('game.educationDesc')}</p>
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
                            <h4>${t('game.household')}</h4>
                            <p>${t('game.householdDesc')}</p>
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
    
    allocationItems.sort((a, b) => a.order - b.order);
    
    const form = document.getElementById('allocationForm');
    const summarySection = form.querySelector('.allocation-summary');
    
    const existingItems = form.querySelectorAll('.allocation-item');
    existingItems.forEach(item => item.remove());
    
    allocationItems.forEach(item => {
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = item.html;
        summarySection.parentNode.insertBefore(tempDiv.firstElementChild, summarySection);
    });
    
    // Update summary labels
    const summaryRows = form.querySelectorAll('.summary-row span:first-child');
    if (summaryRows.length >= 2) {
        summaryRows[0].textContent = t('game.total');
        summaryRows[1].textContent = t('game.remaining');
    }
    
    // Update submit button
    const submitBtn = document.getElementById('submitAllocation');
    if (submitBtn) {
        submitBtn.innerHTML = `<span>${t('game.submitBtn')}</span><i class="fas fa-check"></i>`;
    }
}






// ===== CREATE INSURANCE HTML =====
function createInsuranceHTML(bundleInfo) {
    const isControl = gameState.treatmentGroup === 'control';
    
    if (isControl) {
        return `
            <div class="allocation-item" id="insuranceAllocationItem">
                <div class="item-header">
                    <i class="fas fa-shield-alt"></i>
                    <div class="item-info">
                        <h4>${t('game.insurance')}</h4>
                        <p>${t('game.insuranceDesc')}</p>
                        <span class="bundle-badge">${t('game.fixedPrice')} - ${bundleInfo.bundleCost} GHS</span>
                    </div>
                </div>
                <div class="item-input bundle-toggle">
                    <label class="bundle-checkbox">
                        <input type="checkbox" id="bundleAccepted" onchange="handleBundleToggle()">
                        <span>${t('game.buyInsurance')} (${bundleInfo.bundleCost} GHS)</span>
                    </label>
                    <input type="hidden" id="insuranceSpend" value="0">
                </div>
                <div class="input-choice-section" id="inputChoiceSection" style="display: none; margin-top: 15px; padding: 15px; background: rgba(255,255,255,0.05); border-radius: 10px; border: 2px solid transparent; transition: all 0.3s ease;">
                    <label style="display: block; margin-bottom: 10px; font-weight: 600;">
                        <i class="fas fa-seedling" style="margin-right: 8px;"></i>
                        <span id="inputChoiceLabel">${t('game.chooseInput')}</span>
                    </label>
                    <select id="inputChoiceType" onchange="updateAllocation()" style="width: 100%; padding: 12px; font-size: 16px; border-radius: 8px; border: 2px solid var(--primary); background: white;">
                        <option value="">${t('game.selectInputType')}</option>
                        <option value="seeds">${t('game.improvedSeeds')}</option>
                        <option value="fertilizer">${t('game.npkFertilizer')}</option>
                    </select>
                    <div id="inputChoiceWarning" style="display: none; margin-top: 10px; padding: 10px; background: #fff3cd; color: #856404; border-radius: 6px; font-size: 14px;">
                        ${t('game.selectInputWarning')}
                    </div>
                </div>
            </div>
        `;
    } else {
        // Treatment groups
        const isFertilizer = gameState.treatmentGroup === 'fertilizer_bundle';
        const bundleTitle = isFertilizer ? t('game.bundleFertilizer') : t('game.bundleSeeds');
        const bundleDesc = isFertilizer ? t('game.bundleDescFertilizer') : t('game.bundleDescSeeds');
        
        return `
            <div class="allocation-item" id="insuranceAllocationItem">
                <div class="item-header">
                    <i class="fas fa-shield-alt"></i>
                    <div class="item-info">
                        <h4>${bundleTitle}</h4>
                        <p>${bundleDesc}</p>
                        <span class="bundle-badge">${t('game.fixedPrice')} - ${bundleInfo.bundleCost} GHS</span>
                    </div>
                </div>
                <div class="item-input bundle-toggle">
                    <label class="bundle-checkbox">
                        <input type="checkbox" id="bundleAccepted" onchange="handleBundleToggle()">
                        <span>${t('game.buyBundle')} (${bundleInfo.bundleCost} GHS)</span>
                    </label>
                    <input type="hidden" id="insuranceSpend" value="0">
                    <input type="hidden" id="inputChoiceType" value="${isFertilizer ? 'fertilizer' : 'seeds'}">
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
            ${t('seasons.finalWarning')}
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
    
    // Determine weather type for translation
    let weatherTitle, weatherBaseDesc;
    if (weather.type === 'normal') {
        weatherTitle = t('weather.goodTitle');
        weatherBaseDesc = t('weather.goodDesc');
    } else if (weather.type === 'drought') {
        if (weather.harvestMultiplier < 0.5) {
            weatherTitle = t('weather.severeDroughtTitle');
            weatherBaseDesc = t('weather.severeDroughtDesc');
        } else {
            weatherTitle = t('weather.mildDroughtTitle');
            weatherBaseDesc = t('weather.mildDroughtDesc');
        }
    } else if (weather.type === 'flood') {
        weatherTitle = t('weather.floodTitle');
        weatherBaseDesc = t('weather.floodDesc');
    }
    
    document.getElementById('weatherTitle').textContent = weatherTitle;
    
    // Build weather description
    let weatherDesc = weatherBaseDesc;
    
    if (weather.type === 'normal') {
        weatherDesc += ' ' + t('weather.harvestBoost');
    } else if (weather.harvestMultiplier === 0.7) {
        weatherDesc += ' ' + t('weather.harvestReduced70');
    } else if (weather.harvestMultiplier === 0.3) {
        weatherDesc += ' ' + t('weather.harvestReduced30');
    } else if (weather.harvestMultiplier === 0.5) {
        weatherDesc += ' ' + t('weather.harvestReduced50');
    }
    
    // Insurance info
    if (seasonData.payoutReceived > 0) {
        const multiplier = (seasonData.payoutReceived / seasonData.insuranceSpend).toFixed(1);
        weatherDesc += ' ' + t('weather.insurancePaidOut', {
            multiplier: multiplier,
            paid: seasonData.insuranceSpend,
            received: seasonData.payoutReceived
        });
    } else if (seasonData.insuranceSpend > 0 && weather.type === 'normal') {
        weatherDesc += ' ' + t('weather.noPayoutNeeded');
    } else if (seasonData.insuranceSpend === 0 && weather.type !== 'normal') {
        weatherDesc += ' ' + t('weather.noInsurance');
    }
    
    document.getElementById('weatherDescription').textContent = weatherDesc;
    
    // Update outcome card labels
    const outcomeCards = document.querySelectorAll('.outcome-card');
    if (outcomeCards.length >= 3) {
        outcomeCards[0].querySelector('h4').textContent = t('weather.harvest');
        outcomeCards[1].querySelector('h4').textContent = t('weather.insurancePayout');
        outcomeCards[2].querySelector('h4').textContent = t('weather.finalIncome');
    }
    
    document.getElementById('harvestValue').textContent = seasonData.harvestOutcome + ' GHS';
    document.getElementById('payoutValue').textContent = seasonData.payoutReceived + ' GHS';
    
    const totalEarnings = seasonData.harvestOutcome + seasonData.payoutReceived;
    document.getElementById('finalIncomeValue').textContent = totalEarnings + ' GHS';
    
    // Insurance protection note
    const existingNote = document.getElementById('insuranceContributionNote');
    if (existingNote) existingNote.remove();
    
    if (seasonData.payoutReceived > 0) {
        const outcomeCardsContainer = document.querySelector('.outcome-cards');
        if (outcomeCardsContainer) {
            const multiplier = (seasonData.payoutReceived / seasonData.insuranceSpend).toFixed(1);
            
            const noteDiv = document.createElement('div');
            noteDiv.id = 'insuranceContributionNote';
            noteDiv.style.cssText = 'background: linear-gradient(135deg, #E8F5E9, #C8E6C9); padding: 20px; border-radius: 12px; margin-top: 15px; text-align: center; border: 2px solid #4CAF50;';
            noteDiv.innerHTML = `
                <div style="font-size: 24px; margin-bottom: 10px;">${t('weather.insuranceProtected')}</div>
                <div style="font-weight: 700; font-size: 20px; color: #2E7D32; margin-bottom: 15px;">
                    ${t('weather.insuranceReturn', {
                        paid: seasonData.insuranceSpend,
                        received: seasonData.payoutReceived,
                        multiplier: multiplier
                    })}
                </div>
            `;
            outcomeCardsContainer.insertAdjacentElement('afterend', noteDiv);
        }
    }
    
    // Update info text at bottom
    const infoContainer = document.querySelector('#weatherScreen .weather-container > div:last-child');
    if (infoContainer && infoContainer.querySelector('p')) {
        infoContainer.querySelector('p').innerHTML = `ℹ️ <strong>${t('weather.takeTime')}</strong>`;
    }
    
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
        nextBtn.innerHTML = `<span>${t('weather.continueNext')}</span><i class="fas fa-arrow-right"></i>`;
    } else {
        if (gameState.sessionType === 'couple_joint') {
            nextBtn.innerHTML = `<span>${t('weather.completeFeedback')}</span><i class="fas fa-arrow-right"></i>`;
        } else {
            nextBtn.innerHTML = `<span>${t('weather.continueKnowledge')}</span><i class="fas fa-arrow-right"></i>`;
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




// ===== GET TUTORIAL CARDS FOR LANGUAGE =====
// This function returns the appropriate tutorial cards based on treatment and language
// Add this to your tutorial-content.js or game.js file

function getTutorialCardsForLanguage(treatment, language) {
    console.log(`Getting tutorial cards for treatment: ${treatment}, language: ${language}`);
    
    // Default to English if language not specified
    if (!language || language === 'english') {
        // Use existing English tutorial cards
        return TUTORIAL_CARDS[treatment] || TUTORIAL_CARDS.control;
    }
    
    // Use Dagbani tutorial cards
    if (language === 'dagbani') {
        // Check if TUTORIAL_CARDS_DAGBANI exists
        if (typeof TUTORIAL_CARDS_DAGBANI !== 'undefined') {
            return TUTORIAL_CARDS_DAGBANI[treatment] || TUTORIAL_CARDS_DAGBANI.control;
        } else {
            console.warn('⚠️ Dagbani tutorial cards not found, using English');
            return TUTORIAL_CARDS[treatment] || TUTORIAL_CARDS.control;
        }
    }
    
    // Fallback to English
    console.warn('⚠️ Unknown language, using English');
    return TUTORIAL_CARDS[treatment] || TUTORIAL_CARDS.control;
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





// ===== LANGUAGE TOGGLE FUNCTION =====
// Add this function to your game.js

// ===== LANGUAGE TOGGLE FUNCTION =====
// ===== UPDATED updateLanguage FUNCTION =====
// Replace the existing updateLanguage function with this complete version

function updateLanguage(language) {
    console.log('🌍 Changing language to:', language);
    gameState.language = language;
    
    // Update language button
    const currentLangEl = document.getElementById('currentLang');
    if (currentLangEl) {
        currentLangEl.textContent = language === 'english' ? 'English' : 'Dagbani';
    }
    
    // Update all data-translate attributes globally
    document.querySelectorAll('[data-translate]').forEach(el => {
        const key = el.getAttribute('data-translate');
        const translation = t(key);
        
        // Handle different element types
        if (el.tagName === 'BUTTON') {
            const span = el.querySelector('span');
            if (span) {
                span.textContent = translation;
            } else if (!el.querySelector('i')) {
                el.textContent = translation;
            }
        } else if (el.querySelector('input') || el.querySelector('select')) {
            // Skip labels that contain inputs/selects
            return;
        } else {
            el.textContent = translation;
        }
    });
    
    // Update specific screens with complex structures
    updateWelcomeScreenLang();
    updateDemographicsScreenLang();
    updateRiskScreenLang();
    updateEmpowermentScreenLang();
    updateKnowledgeScreenLang();
    updatePerceptionScreenLang();      // NEW - Added
    updateCoupleQuestionsLang();       // NEW - Added
    updateResultsScreenLang();
    
    // Refresh current screen if needed
    if (gameState.currentScreen === 'gameScreen') {
        loadSeason(gameState.currentSeason);
    }
    
    if (gameState.currentScreen === 'tutorialScreen') {
        initializeTutorial();
    }
    
    console.log('✅ Language updated to:', language);
}



function updateWelcomeScreenLang() {
    // Most content handled by data-translate attributes
    // This handles any dynamic content if needed
    console.log('Updating welcome screen language');
}

function updateResultsScreenLang() {
    const resultsTitle = document.querySelector('#resultsScreen h2:not([data-translate])');
    const resultsSubtitle = document.querySelector('#resultsScreen .subtitle:not([data-translate])');
    
    // These are dynamically set, so we update them here
    if (gameState.sessionType === 'couple_joint') {
        if (resultsTitle) resultsTitle.textContent = t('results.title');
        if (resultsSubtitle) resultsSubtitle.textContent = t('results.subtitle');
    }
}



function updateCheckboxesLang(name, valueTextMap) {
    document.querySelectorAll(`input[name="${name}"]`).forEach(cb => {
        const label = cb.closest('label');
        if (label && valueTextMap[cb.value]) {
            // Preserve the checkbox, update only the text
            const textNode = Array.from(label.childNodes).find(node => node.nodeType === 3);
            if (textNode) {
                textNode.textContent = ' ' + valueTextMap[cb.value];
            } else {
                label.appendChild(document.createTextNode(' ' + valueTextMap[cb.value]));
            }
        }
    });
}

function updateRadiosLang(name, valueTextMap) {
    document.querySelectorAll(`input[name="${name}"]`).forEach(radio => {
        const label = radio.closest('label');
        if (label && valueTextMap[radio.value]) {
            // Preserve the radio button, update only the text
            const textNode = Array.from(label.childNodes).find(node => node.nodeType === 3);
            if (textNode) {
                textNode.textContent = ' ' + valueTextMap[radio.value];
            } else {
                label.appendChild(document.createTextNode(' ' + valueTextMap[radio.value]));
            }
        }
    });
}










function updateRiskScreenLang() {
    const title = document.querySelector('#riskScreen h2');
    if (title) title.textContent = t('risk.title');
    
    // Scenario label
    const scenarioGroup = document.querySelector('.option-cards')?.closest('.form-group');
    if (scenarioGroup) {
        const label = scenarioGroup.querySelector('label:first-of-type');
        if (label && !label.querySelector('input')) {
            label.textContent = t('risk.scenario');
        }
    }
    
    // Option cards
    const optionCards = document.querySelectorAll('.option-card');
    if (optionCards.length >= 2) {
        optionCards[0].querySelector('h4').textContent = t('risk.guaranteed');
        optionCards[0].querySelector('p').textContent = t('risk.guaranteedDesc');
        
        optionCards[1].querySelector('h4').textContent = t('risk.chance');
        optionCards[1].querySelector('p').textContent = t('risk.chanceDesc');
    }
    
    // Risk comfort scale
    const ratingScale = document.querySelector('.rating-scale');
    if (ratingScale) {
        const scaleTexts = [
            t('risk.notAtAll'),
            t('risk.level2'),
            t('risk.neutral'),
            t('risk.level4'),
            t('risk.veryComfortable')
        ];
        const labels = ratingScale.querySelectorAll('label');
        labels.forEach((label, index) => {
            const input = label.querySelector('input');
            if (input && scaleTexts[index]) {
                label.innerHTML = '';
                label.appendChild(input);
                label.appendChild(document.createTextNode(' ' + scaleTexts[index]));
            }
        });
    }
    
    // Decision maker select
    updateSelectLang('decisionMaker', [
        { value: '', text: t('common.select') },
        { value: '1', text: t('risk.mainlyHusband') },
        { value: '2', text: t('risk.mainlyWife') },
        { value: '3', text: t('risk.joint') },
        { value: '4', text: t('risk.otherMember') }
    ]);
    updateLabelLang('decisionMaker', t('risk.decisionMaker'));
    
    // Continue button
    const continueBtn = document.querySelector('#riskForm .btn-primary span');
    if (continueBtn) continueBtn.textContent = t('common.continue');
}

function updateEmpowermentScreenLang() {
    const title = document.querySelector('#empowermentScreen h2');
    if (title) title.textContent = t('empowerment.title');
    
    const subtitle = document.querySelector('#empowermentScreen .subtitle');
    if (subtitle) subtitle.textContent = t('empowerment.subtitle');
    
    // Questions
    const questions = document.querySelectorAll('#empowermentScreen .question-item > p');
    const qKeys = ['q1', 'q2', 'q3', 'q4', 'q5'];
    questions.forEach((q, i) => {
        if (qKeys[i]) q.textContent = t(`empowerment.${qKeys[i]}`);
    });
    
    // Scale labels
    document.querySelectorAll('#empowermentScreen .scale-labels').forEach(container => {
        const spans = container.querySelectorAll('span');
        if (spans.length >= 2) {
            spans[0].textContent = t('empowerment.stronglyDisagree');
            spans[1].textContent = t('empowerment.stronglyAgree');
        }
    });
    
    // Continue button
    const continueBtn = document.querySelector('#empowermentForm .btn-primary span');
    if (continueBtn) continueBtn.textContent = t('common.continue');
}





function updateKnowledgeScreenLang() {
    const title = document.querySelector('#knowledgeScreen h2');
    if (title) title.textContent = t('knowledge.title');
    
    const subtitle = document.querySelector('#knowledgeScreen .subtitle');
    if (subtitle) subtitle.textContent = t('knowledge.subtitle');
    
    // Update questions - these aren't in data-translate attributes
    const questions = [
        t('knowledge.q1'),
        t('knowledge.q2'),
        t('knowledge.q3'),
        t('knowledge.q4'),
        t('knowledge.q5')
    ];
    
    const questionBlocks = document.querySelectorAll('.question-block');
    questionBlocks.forEach((block, i) => {
        const qText = block.querySelector('.question-text');
        if (qText && questions[i]) {
            qText.textContent = `${i + 1}. ${questions[i]}`;
        }
        
        // Update True/False labels
        const radios = block.querySelectorAll('.radio-group label');
        radios.forEach(label => {
            const input = label.querySelector('input');
            if (input) {
                const text = input.value === 'true' ? t('knowledge.true') : t('knowledge.false');
                label.innerHTML = '';
                label.appendChild(input);
                label.appendChild(document.createTextNode(' ' + text));
            }
        });
    });
    
    // Submit button
    const submitBtn = document.querySelector('#knowledgeForm .btn-primary span');
    if (submitBtn) submitBtn.textContent = t('knowledge.submit');
}



function testTranslations() {
    console.log('🧪 Testing translations...');
    console.log('Current language:', gameState.language);
    console.log('Welcome title (EN):', t('welcome.title'));
    
    gameState.language = 'dagbani';
    console.log('Welcome title (Dagbani):', t('welcome.title'));
    
    gameState.language = 'english'; // Reset
    console.log('✅ Translation test complete');
}



// ===== 12. HELPER FUNCTIONS FOR LANGUAGE UPDATE =====

function updateSelectLang(selectId, options) {
    const select = document.getElementById(selectId);
    if (!select) return;
    
    const currentValue = select.value;
    select.innerHTML = '';
    
    options.forEach(opt => {
        const option = document.createElement('option');
        option.value = opt.value;
        option.textContent = opt.text;
        select.appendChild(option);
    });
    
    select.value = currentValue;
}

function updateLabelLang(inputId, text) {
    const input = document.getElementById(inputId);
    if (!input) return;
    
    const formGroup = input.closest('.form-group');
    if (formGroup) {
        const label = formGroup.querySelector('label:first-of-type');
        if (label && !label.querySelector('input') && !label.querySelector('select')) {
            label.textContent = text;
        }
    }
}


// ===== 13. UPDATE LANGUAGE BUTTON LISTENER IN DOMContentLoaded =====
// Find the existing language button listener and replace it with:

// Inside DOMContentLoaded:
const langBtn = document.getElementById('languageBtn');
if (langBtn) {
    langBtn.addEventListener('click', () => {
        const newLang = gameState.language === 'english' ? 'dagbani' : 'english';
        updateLanguage(newLang);
    });
    console.log('✅ Language toggle button listener registered');
}












function updateWelcomeScreenLang() {
    // Update all elements with data-translate attributes
    document.querySelectorAll('[data-translate]').forEach(el => {
        const key = el.getAttribute('data-translate');
        const translation = t(key);
        
        if (el.tagName === 'INPUT' || el.tagName === 'BUTTON') {
            if (el.value && !el.type.match(/radio|checkbox/)) {
                el.value = translation;
            }
        } else {
            el.textContent = translation;
        }
    });
}


function updateDemographicsScreenLang() {
    // Update screen title and labels
    const title = document.querySelector('#demographicsScreen h2');
    if (title) title.textContent = t('demographics.title');
    
    // Update all form labels
    updateLabelLang('gender', t('demographics.gender'));
    updateLabelLang('role', t('demographics.role'));
    updateLabelLang('age', t('demographics.age'));
    updateLabelLang('education', t('demographics.education'));
    updateLabelLang('farmingYears', t('demographics.farmingYears'));
    updateLabelLang('landSize', t('demographics.land'));
    updateLabelLang('lastIncome', t('demographics.income'));
    
    // Update select options
    updateSelectLang('gender', [
        { value: '', text: t('common.select') },
        { value: 'male', text: t('demographics.male') },
        { value: 'female', text: t('demographics.female') }
    ]);
    
    updateSelectLang('role', [
        { value: '', text: t('common.select') },
        { value: 'husband', text: t('demographics.husband') },
        { value: 'wife', text: t('demographics.wife') }
    ]);
    
    updateSelectLang('education', [
        { value: '', text: t('common.select') },
        { value: '0', text: t('demographics.noSchooling') },
        { value: '1', text: t('demographics.primary') },
        { value: '2', text: t('demographics.jhs') },
        { value: '3', text: t('demographics.shs') },
        { value: '4', text: t('demographics.tertiary') }
    ]);
    
    // Update crop checkboxes
    updateCheckboxesLang('crops', {
        'maize': t('demographics.maize'),
        'rice': t('demographics.rice'),
        'soybeans': t('demographics.soybeans'),
        'groundnuts': t('demographics.groundnuts'),
        'other': t('demographics.other')
    });
    
    // Update Yes/No radio buttons
    updateRadiosLang('priorKnowledge', {
        '1': t('common.yes'),
        '0': t('common.no')
    });
    
    // Update crop label
    const cropLabel = document.querySelector('label[data-translate="demographics.crops"]');
    if (cropLabel) cropLabel.childNodes[0].textContent = t('demographics.crops');
    
    // Update prior knowledge label
    const priorLabel = document.querySelector('label[data-translate="demographics.priorKnowledge"]');
    if (priorLabel) priorLabel.childNodes[0].textContent = t('demographics.priorKnowledge');
    
    // Update continue button
    const continueBtn = document.querySelector('#demographicsForm .btn-primary span');
    if (continueBtn) continueBtn.textContent = t('common.continue');
}




// Add to your game.js
// ===== CONNECTION STATUS MANAGEMENT =====
function updateConnectionStatus() {
    const statusEl = document.getElementById('connectionStatus');
    const statusText = document.getElementById('statusText');
    const syncBtn = document.getElementById('syncButton');
    const exportBtn = document.getElementById('exportButton');
    
    if (!statusEl || !statusText) {
        console.warn('⚠️ Connection status elements not found');
        return;
    }
    
    const syncStatus = window.offlineStorage.getSyncStatus();
    
    if (syncStatus.isOnline) {
        statusEl.className = 'connection-status status-online';
        
        if (syncStatus.pendingItems > 0) {
            statusText.innerHTML = `Online <span style="color: #FF9800; font-weight: 700;">(${syncStatus.pendingItems} pending)</span>`;
            if (syncBtn) {
                syncBtn.style.display = 'flex';
                const syncBtnText = document.getElementById('syncButtonText');
                if (syncBtnText) {
                    syncBtnText.textContent = `Sync ${syncStatus.pendingItems} items`;
                }
            }
        } else {
            statusText.textContent = 'Online';
            if (syncBtn) syncBtn.style.display = 'none';
        }
        
        // Show export button if there's offline data
        if (exportBtn && syncStatus.offlineDataSize > 1000) {
            exportBtn.style.display = 'flex';
        }
    } else {
        statusEl.className = 'connection-status status-offline';
        statusText.textContent = 'Offline - Data saved locally';
        if (syncBtn) syncBtn.style.display = 'none';
        if (exportBtn) exportBtn.style.display = 'flex';
    }
}

async function manualSync() {
    const syncBtn = document.getElementById('syncButton');
    const statusEl = document.getElementById('connectionStatus');
    const statusText = document.getElementById('statusText');
    
    if (!syncBtn || !statusEl || !statusText) {
        console.error('❌ Sync UI elements not found');
        return;
    }
    
    try {
        console.log('🔄 Starting manual sync...');
        
        // Update UI to show syncing
        statusEl.className = 'connection-status status-syncing';
        statusText.innerHTML = '<i class="fas fa-sync-alt fa-spin"></i> Syncing...';
        syncBtn.disabled = true;
        
        // Perform sync
        const result = await window.offlineStorage.syncOfflineData();
        
        if (result.success) {
            console.log('✅ Sync completed:', result);
            
            // Success feedback
            statusText.innerHTML = '<i class="fas fa-check"></i> Synced successfully!';
            
            // Show detailed results
            if (result.results) {
                console.log('📊 Sync results:', result.results);
                
                if (result.results.successful > 0) {
                    showToast(`✅ Successfully synced ${result.results.successful} items!`, 'success');
                }
                
                if (result.results.failed > 0) {
                    showToast(`⚠️ ${result.results.failed} items failed to sync. Check console for details.`, 'warning');
                    console.error('Failed items:', result.results.errors);
                }
                
                if (result.results.successful === 0 && result.results.failed === 0) {
                    showToast('ℹ️ No items to sync', 'info');
                }
            }
            
            // Reset UI after 2 seconds
            setTimeout(() => {
                updateConnectionStatus();
            }, 2000);
        } else {
            throw new Error(result.message || 'Sync failed');
        }
    } catch (error) {
        console.error('❌ Sync error:', error);
        statusText.innerHTML = '<i class="fas fa-exclamation-triangle"></i> Sync failed';
        showToast('❌ Failed to sync data: ' + error.message, 'error');
        
        // Reset UI after 3 seconds
        setTimeout(() => {
            updateConnectionStatus();
        }, 3000);
    } finally {
        syncBtn.disabled = false;
    }
}

function showToast(message, type = 'info') {
    console.log(`Toast [${type}]: ${message}`);
    
    // Create toast element
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerHTML = message;
    
    // Add toast styles if not already added
    if (!document.getElementById('toastStyles')) {
        const toastStyles = document.createElement('style');
        toastStyles.id = 'toastStyles';
        toastStyles.textContent = `
            .toast {
                position: fixed;
                bottom: 30px;
                left: 50%;
                transform: translateX(-50%);
                background: rgba(0, 0, 0, 0.9);
                color: white;
                padding: 16px 24px;
                border-radius: 8px;
                font-size: 14px;
                font-weight: 600;
                z-index: 10000;
                animation: slideUp 0.3s ease;
                box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
                max-width: 90%;
                text-align: center;
            }
            .toast-success { background: linear-gradient(135deg, #4CAF50, #388E3C); }
            .toast-error { background: linear-gradient(135deg, #F44336, #D32F2F); }
            .toast-warning { background: linear-gradient(135deg, #FF9800, #F57C00); }
            .toast-info { background: linear-gradient(135deg, #2196F3, #1976D2); }
            @keyframes slideUp {
                from { bottom: -50px; opacity: 0; }
                to { bottom: 30px; opacity: 1; }
            }
            @media (max-width: 768px) {
                .toast {
                    bottom: 20px;
                    padding: 12px 20px;
                    font-size: 13px;
                    max-width: 85%;
                }
            }
        `;
        document.head.appendChild(toastStyles);
    }
    
    // Add toast to page
    document.body.appendChild(toast);
    
    // Remove after 4 seconds
    setTimeout(() => {
        toast.style.animation = 'slideUp 0.3s ease reverse';
        setTimeout(() => toast.remove(), 300);
    }, 4000);
}




// Call on page load and connection change
window.addEventListener('online', updateConnectionStatus);
window.addEventListener('offline', updateConnectionStatus);
updateConnectionStatus();







