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




  function saveGameProgress() {
        const progressData = {
            currentScreen: gameState.currentScreen,
            currentDemoPage: currentDemoPage,
            currentStep: currentStep,
            householdId: gameState.householdId,
            respondentId: gameState.respondentId,
            sessionId: gameState.sessionId,
            treatmentGroup: gameState.treatmentGroup,
            language: gameState.language,
            formData: {} // Will store form values
        };
        
        // Save form data from current screen
        const currentForm = document.querySelector('.screen.active form');
        if (currentForm) {
            const formData = new FormData(currentForm);
            for (let [key, value] of formData.entries()) {
                progressData.formData[key] = value;
            }
        }
        
        sessionStorage.setItem('game_progress', JSON.stringify(progressData));
        console.log('💾 Game progress saved');
    }
    
    // 2. Restore game state on page load
    function restoreGameProgress() {
        const saved = sessionStorage.getItem('game_progress');
        if (saved) {
            try {
                const progressData = JSON.parse(saved);
                console.log('📂 Restoring game progress:', progressData);
                
                // Restore game state
                if (progressData.householdId) gameState.householdId = progressData.householdId;
                if (progressData.respondentId) gameState.respondentId = progressData.respondentId;
                if (progressData.sessionId) gameState.sessionId = progressData.sessionId;
                if (progressData.treatmentGroup) gameState.treatmentGroup = progressData.treatmentGroup;
                if (progressData.language) gameState.language = progressData.language;
                
                // Restore screen position
                if (progressData.currentScreen) {
                    currentStep = progressData.currentStep || 1;
                    currentDemoPage = progressData.currentDemoPage || 1;
                    
                    setTimeout(() => {
                        showScreen(progressData.currentScreen);
                        
                        if (progressData.currentScreen === 'demographicsScreen') {
                            showDemoPage(currentDemoPage);
                        }
                        
                        // Restore form values
                        if (progressData.formData && Object.keys(progressData.formData).length > 0) {
                            const currentForm = document.querySelector('.screen.active form');
                            if (currentForm) {
                                Object.entries(progressData.formData).forEach(([key, value]) => {
                                    const input = currentForm.querySelector(`[name="${key}"]`);
                                    if (input) {
                                        if (input.type === 'checkbox' || input.type === 'radio') {
                                            if (input.value === value) input.checked = true;
                                        } else {
                                            input.value = value;
                                        }
                                    }
                                });
                            }
                        }
                    }, 100);
                    
                    showToast('📂 Session restored from page reload', 'info');
                }
            } catch (error) {
                console.error('❌ Error restoring progress:', error);
            }
        }
    }
    
    // 3. Prevent accidental page exit with unsaved data
    let hasUnsavedData = false;
    
    window.addEventListener('beforeunload', function(e) {
        // Check if we're in the middle of the game (not on welcome or results screen)
        const activeScreen = document.querySelector('.screen.active');
        const screenId = activeScreen ? activeScreen.id : '';
        
        if (screenId && screenId !== 'welcomeScreen' && screenId !== 'resultsScreen') {
            hasUnsavedData = true;
        }
        
        // Save progress before potential exit
        if (hasUnsavedData) {
            saveGameProgress();
            
            // Show browser warning
            const message = 'You have unsaved progress. Are you sure you want to leave?';
            e.preventDefault();
            e.returnValue = message; // For older browsers
            return message;
        }
    });



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
            
            // Page headings
            basicInfo: "Basic Information",
            educationHousehold: "Education & Household",
            householdAssets: "Household Assets",
            farmingExperience: "Farming Experience",
            cropsIncome: "Crops & Income",
            livestock: "Livestock",
            farmInputs: "Farm Inputs & Technology",
            shocksLosses: "Shocks & Losses",
            savingsCredit: "Savings & Credit",
            insuranceTrust: "Insurance & Trust",
            
            // Page 1: Basic Info
            enumeratorName: "Enumerator Name",
            selectEnumerator: "Select Enumerator...",
            communityName: "Community Name",
            loadingCommunities: "Loading communities...",
            selectCommunity: "-- Select Community --",
            gender: "Gender",
            male: "Male",
            female: "Female",
            role: "Role in Household",
            husband: "Husband",
            wife: "Wife",
            age: "Age (years)",
            
            // Page 2: Education & Household
            education: "Highest Education Level",
            noSchooling: "No schooling",
            primary: "Primary",
            jhs: "Junior High School (JHS)",
            shs: "Senior High School (SHS)",
            tertiary: "Tertiary/Technical",
            householdSize: "Household size (all members)",
            childrenUnder15: "Number of children under 15",
            
            // Page 3: Assets
           assetsQuestion: "What things does your household own? (Select all)",
radio: "Radio",              // Keep as "Radio" (universally understood)
tv: "TV",                   // Keep as "TV" (universally understood) 
refrigerator: "Fridge",     // Or "Koom zaɣim" (cold box), but "Fridge" is commonly used
bicycle: "Bicycle",         // ✅ Already correct!
motorbike: "MotorBike",          // Or "Moto basikol"
mobilePhone: "Mobile Phone",   // Or keep as "Mobile"
generator: "Generator",     // Or "Laɣim masini" (light machine)
plough: "Plough",   
            
            // Page 4: Farming Experience
            farmingYears: "Years of Farming Experience",
            land: "Land Cultivated (acres)",
            landAccessMethod: "How do you access your farmland?",
            ownLand: "Own land",
            rentLease: "Rent/Lease",
            borrowedFamily: "Borrowed/Family land",
            sharecropping: "Sharecropping",
            otherAccess: "Other",
            
            // Page 5: Crops & Income
            crops: "Main Crops (select all that apply)",
            maize: "Maize",
            rice: "Rice",
            soybeans: "Soybeans",
            groundnuts: "Groundnuts",
            other: "Other",
            cropsPlanted: "How many different crops did you plant last season?",
            income: "Last Season Income (GHS)",
            farmingInputExpenditure: "Farming inputs expenditure last season (GHS)",
            
            // Page 6: Livestock
            livestockQuestion: "How many livestock does your household own?",
            cattle: "Cattle",
            goats: "Goats",
            sheep: "Sheep",
            poultry: "Poultry",
            
            // Page 7: Farm Inputs
            improvedInputsQuestion: "Which improved inputs did you use last season? (Select all)",
            certifiedSeed: "Certified/Improved seed",
            chemicalFertilizer: "Chemical fertilizer",
            pesticides: "Pesticides/Herbicides",
            irrigation: "Irrigation",
            hasIrrigationAccess: "Do you have access to irrigation?",
            
            // Page 8: Shocks
            shocksQuestion: "What shocks have you experienced in the past 3 years? (Select all)",
            drought: "Drought",
            flood: "Flood",
            pestsDisease: "Pests/Disease",
            cropPriceFall: "Crop price fall",
            estimatedLoss: "Estimated total loss from shocks last year (GHS)",
            harvestLossPercentage: "Harvest loss percentage last season (0-100%)",
            
            // Page 9: Savings & Credit
            hasSavings: "Do you currently have any savings?",
            savingsAmount: "Estimated savings amount (GHS)",
            borrowedMoney: "Did you borrow money in past 12 months?",
            borrowingSources: "Where did you borrow from? (Select all):",
            bank: "Bank",
            microfinance: "Microfinance",
            vsla: "VSLA/Savings group",
            familyFriends: "Family/Friends",
            moneylender: "Moneylender",
            hasOffFarmIncome: "Any off-farm income last season?",
            offFarmAmount: "Off-farm income amount (GHS)",
            
            // Page 10: Insurance & Trust
            priorKnowledge: "Have you heard about weather index insurance before?",
            purchasedInsurance: "Have you purchased any type of insurance before?",
            trustInsuranceProvider: "How much do you trust insurance providers? (1 = Not at all, 5 = Fully)",
            trustFarmerGroups: "How much do you trust farmer groups/cooperatives? (1-5)",
            trustNGOs: "How much do you trust NGOs? (1-5)",
            distanceMarket: "Distance to nearest market (minutes walking)",
            distanceInsurer: "Distance to nearest insurance provider (km)",
            usesMobileMoney: "Do you use mobile money (MoMo)?",
            farmerGroupMember: "Are you a member of any farmer group?",
            
            // Navigation
            back: "Back",
            continue: "Continue",
            continueRisk: "Continue to Risk Assessment",
            yes: "Yes",
            no: "No",
            select: "Select..."
        },
        
        progress: {
            step: "Step",
            of: "of",
            page: "Page"
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

        outcome: {
    harvest: "Harvest Outcome",
    insurance: "Insurance Payout",
    finalIncome: "Final Income",
    continue: "Continue to Next Season"
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
            
            // Page headings
            basicInfo: "Lahira Dɔɣim",
            educationHousehold: "Karimi Ni Doo Yuli",
            householdAssets: "Doo Yuli Di",
            farmingExperience: "Puuni Lahi",
            cropsIncome: "Puuni Ni Mali",
            livestock: "Dapam",
            farmInputs: "Puuni Di Ni Niŋa",
            shocksLosses: "Lahira Nyɛma",
            savingsCredit: "Mali Tum Ni Bɔri",
            insuranceTrust: "Insurance Ni Lahi",
            
            // Page 1: Basic Info
            enumeratorName: "Enumerator Yuli",
            selectEnumerator: "Chɛ Enumerator...",
            communityName: "Tɔɣim Yuli",
            loadingCommunities: "Yi zaŋa tɔɣa...",
            selectCommunity: "-- Chɛ Tɔɣim --",
            gender: "Sabinima",
            male: "Niriba",
            female: "Puhima",
            role: "Yi Yuli Doo Zaa",
            husband: "O Yidana",
            wife: "O Paga",
            age: "Yi Himɔɣu (Yiŋa)",
            
            // Page 2: Education & Household
            education: "Karimi Ni Yi Nya",
            noSchooling: "Ban karimi",
            primary: "Primary",
            jhs: "JHS",
            shs: "SHS",
            tertiary: "Tertiary/Technical",
            householdSize: "Doo yuli nimdi (banbu zaa)",
            childrenUnder15: "Bihi ni yɛl yiŋa 15 kpɛ",
            
            // Page 3: Assets
            assetsQuestion: "Di lahira ni yi doo nya? (Chɛ zaa)",
            radio: "Radio",
            tv: "TV",
            refrigerator: "Refrigerator",
            bicycle: "Basikol",
            motorbike: "Motorbike",
            mobilePhone: "Mobile",
            generator: "Generator",
            plough: "Plough",
            
            // Page 4: Farming Experience
            farmingYears: "Yiŋa Ni Yi Puuni",
            land: "Tɔɣim Ni Yi Puuni (acres)",
            landAccessMethod: "Ka yi nya yi tɔɣim lahiri?",
            ownLand: "Mi tɔɣim",
            rentLease: "Mi kuhi",
            borrowedFamily: "Mi bɔri/Doo bi tɔɣim",
            sharecropping: "Sharecropping",
            otherAccess: "Din",
            
            // Page 5: Crops & Income
            crops: "Yi Puuni Ni Yi Chɛ (chɛ zaa)",
            maize: "Zaamnɛ",
            rice: "Mɔɣu",
            soybeans: "Soya",
            groundnuts: "Suma",
            other: "Din",
            cropsPlanted: "Puuni lahira ni yi chɛ kpeeni zaŋ pam?",
            income: "Mali Ni Yi Nya Kpeeni Zaŋ Pam (GHS)",
            farmingInputExpenditure: "Puuni di mali kpeeni zaŋ pam (GHS)",
            
            // Page 6: Livestock
            livestockQuestion: "Dapam lahira ni yi doo nya?",
            cattle: "Naɣim",
            goats: "Biya",
            sheep: "Zuu",
            poultry: "Naa",
            
            // Page 7: Farm Inputs
            improvedInputsQuestion: "Puuni di nyɛlibu lahira ni yi sa kpeeni zaŋ pam? (Chɛ zaa)",
            certifiedSeed: "Zaamnɛ nyɛlibu",
            chemicalFertilizer: "Fertilizer",
            pesticides: "Pesticides/Herbicides",
            irrigation: "Koom di niŋa",
            hasIrrigationAccess: "Yi nya koom di niŋa?",
            
            // Page 8: Shocks
            shocksQuestion: "Lahira nyɛma lahira ni yi nya yiŋa 3 zaŋ pam? (Chɛ zaa)",
            drought: "Koom kpɛrigu",
            flood: "Koom nyini",
            pestsDisease: "Ninsim lahira",
            cropPriceFall: "Puuni mali kpibu",
            estimatedLoss: "Mali ni yi ku yiŋa zaŋ pam (GHS)",
            harvestLossPercentage: "Puuni ni yi ku kpeeni zaŋ pam (0-100%)",
            
            // Page 9: Savings & Credit
            hasSavings: "Yi nya mali tum bi?",
            savingsAmount: "Mali tum nimdi (GHS)",
            borrowedMoney: "Yi bɔri mali yiŋa 12 zaŋ pam?",
            borrowingSources: "Yi bɔri ni ka lahira? (Chɛ zaa):",
            bank: "Bank",
            microfinance: "Microfinance",
            vsla: "VSLA/Mali tum kpamba",
            familyFriends: "Doo bi/Yenima",
            moneylender: "Mali bɔribu",
            hasOffFarmIncome: "Yi nya puuni kpɛ yuli mali kpeeni zaŋ pam?",
            offFarmAmount: "Puuni kpɛ yuli mali nimdi (GHS)",
            
            // Page 10: Insurance & Trust
            priorKnowledge: "Yi lahi saŋa insurance zaŋ?",
            purchasedInsurance: "Yi sa insurance bi zaŋ?",
            trustInsuranceProvider: "Yi lahi insurance company lahiri? (1 = Kani, 5 = Pam)",
            trustFarmerGroups: "Yi lahi puunima kpamba lahiri? (1-5)",
            trustNGOs: "Yi lahi NGO lahiri? (1-5)",
            distanceMarket: "Zaa ni yɛl market (minutes)",
            distanceInsurer: "Zaa ni yɛl insurance company (km)",
            usesMobileMoney: "Yi sa mobile money (MoMo)?",
            farmerGroupMember: "Yi yɛl puunima kpamba bi?",
            
            // Navigation
            back: "Ti Nyɛla",
            continue: "Ti Dɔɣi",
            continueRisk: "Ti Dɔɣi Risk Assessment",
            yes: "Yɔɔ",
            no: "Ayi",
            select: "Chɛ..."
        },
        
        progress: {
            step: "Kpeeni",
            of: "ni",
            page: "Yaɣa"
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

        outcome: {
    harvest: "Puuni Ni Yi Nya",
    insurance: "Insurance Mali",
    finalIncome: "Mali Zaa",
    continue: "Ti Kpeeni Din"
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

// ===== IMPROVED t() HELPER FUNCTION =====
// ===== IMPROVED t() HELPER FUNCTION WITH PROPER FALLBACK =====
function t(key, params = {}) {
    const lang = gameState.language || 'english';
    const keys = key.split('.');
    let value = TRANSLATIONS[lang];
    
    // Navigate through nested keys
    for (const k of keys) {
        if (value && value[k] !== undefined) {
            value = value[k];
        } else {
            // ✅ FIX: Fallback to English if key doesn't exist in current language
            console.warn(`⚠️ Translation missing: ${key} in ${lang}, falling back to English`);
            value = TRANSLATIONS.english;
            for (const ek of keys) {
                if (value && value[ek] !== undefined) {
                    value = value[ek];
                } else {
                    // ✅ If English also missing, return the key itself as last resort
                    console.error(`❌ Translation missing in both languages: ${key}`);
                    return key; // Return key so you can see what's missing
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


// API_BASE is defined in offline-storage.js
// If not available, define it here
// if (typeof API_BASE === 'undefined') {
//     var API_BASE = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
//         ? 'http://localhost:3000/api/game'
//         : window.location.origin + '/api/game';
// }


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
            console.error('❌ Server error details:', errorData); // ✅ ADD THIS
            throw new Error(errorData.message || `Server error: ${response.status}`);
        }
        
        const result = await response.json();
        console.log('✅ API Response:', result);
        
        if (!result.success) {
            console.error('❌ API returned failure:', result); // ✅ ADD THIS
            throw new Error(result.message || 'Unknown error');
        }
        
        return result.data;
    } catch (error) {
        console.error('💥 API Error:', error.message);
        console.error('💥 Full error:', error); // ✅ ADD THIS
        
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
// ===== SCREEN MANAGEMENT =====
function showScreen(screenId) {
    console.log('🖥️ showScreen called:', screenId);
    
    // AGGRESSIVE SCROLL RESET - Multiple methods
    window.scrollTo({top: 0, left: 0, behavior: 'instant'});
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
    window.pageYOffset = 0;
    
    // Hide all screens
    const allScreens = document.querySelectorAll('.screen');
    console.log('📺 Total screens:', allScreens.length);
    
    allScreens.forEach(screen => {
        screen.classList.remove('active');
        screen.scrollTop = 0; // Reset scroll of each screen
    });
    
    // Show target screen
    const targetScreen = document.getElementById(screenId);
    
    if (targetScreen) {
        // Reset target screen scroll before showing
        targetScreen.scrollTop = 0;
        targetScreen.style.overflow = 'auto';
        
        targetScreen.classList.add('active');
        gameState.currentScreen = screenId;
        console.log('✅ Screen activated:', screenId);
        
        // Force multiple scroll resets with different timing
        setTimeout(() => {
            window.scrollTo(0, 0);
            document.documentElement.scrollTop = 0;
            document.body.scrollTop = 0;
            targetScreen.scrollTop = 0;
        }, 0);
        
        requestAnimationFrame(() => {
            window.scrollTo(0, 0);
            document.documentElement.scrollTop = 0;
            document.body.scrollTop = 0;
            targetScreen.scrollTop = 0;
        });
        
        setTimeout(() => {
            window.scrollTo(0, 0);
            document.documentElement.scrollTop = 0;
            document.body.scrollTop = 0;
            targetScreen.scrollTop = 0;
        }, 50);
        
    } else {
        console.error('❌ SCREEN NOT FOUND:', screenId);
        console.log('Available screens:', Array.from(allScreens).map(s => s.id));
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
// ===== START DEMOGRAPHICS =====
function startDemographics() {
    console.log('Start Demographics clicked');
    
    if (!gameState.householdId) {
        gameState.householdId = generateHouseholdId();
        console.log('Generated Household ID:', gameState.householdId);
    }
    
    showScreen('demographicsScreen');
    
    // CRITICAL: Load communities AFTER screen is shown
    setTimeout(() => {
        loadCommunities();
    }, 100);
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
    
    console.log(`💰 Allocation update: Budget=${budget}, Total=${total}, Remaining=${remaining}`);
    
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
        console.log('❌ Over budget - button disabled');
    } else if (remaining > 0) {
        remainingEl.style.color = 'var(--info)';
        submitBtn.disabled = true;
        console.log('❌ Under budget - button disabled');
    } else if (needsInputChoice) {
        // Only block submission if they bought insurance but didn't choose input
        remainingEl.style.color = 'var(--warning)';
        submitBtn.disabled = true;
        console.log('❌ Input choice needed - button disabled');
    } else {
        remainingEl.style.color = 'var(--success)';
        submitBtn.disabled = false;
        console.log('✅ Budget matched - button enabled');
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




// ===== FIX 1: INCREASE HARVEST RETURNS =====
// Find the calculateOutcomes function (around line 1815) and replace it:

function calculateOutcomes(seasonData, weather) {
    // ✅ CHANGED: Increased from 0.8 to 1.1 for better farmer returns
    const baseHarvest = seasonData.budget * 1.1;  // Changed from 0.8 to 1.1
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
    console.log('👫 Showing second partner prompt');
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
        // No event listener needed here - event delegation handles it!
    }
    
    showScreen('secondPartnerScreen');
}




function startSecondPartner() {
    console.log('🔄 Starting second partner...');
    
    // ===== EXTRACT AND SAVE HOUSEHOLD DATA =====
    const householdData = {
        householdId: gameState.householdId,
        communityName: gameState.demographics.communityName,
        enumeratorName: gameState.demographics.enumeratorName,
        householdSize: gameState.demographics.householdSize,
        childrenUnder15: gameState.demographics.childrenUnder15,
        assets: gameState.demographics.assets,
        livestock: gameState.demographics.livestock,
        yearsOfFarming: gameState.demographics.yearsOfFarming,
        landCultivated: gameState.demographics.landCultivated,
        landAccessMethod: gameState.demographics.landAccessMethod,
        landAccessOther: gameState.demographics.landAccessOther,
        mainCrops: gameState.demographics.mainCrops,
        numberOfCropsPlanted: gameState.demographics.numberOfCropsPlanted,
        lastSeasonIncome: gameState.demographics.lastSeasonIncome,
        farmingInputExpenditure: gameState.demographics.farmingInputExpenditure,
        improvedInputs: gameState.demographics.improvedInputs,
        hasIrrigationAccess: gameState.demographics.hasIrrigationAccess,
        shocks: gameState.demographics.shocks,
        estimatedLossLastYear: gameState.demographics.estimatedLossLastYear,
        harvestLossPercentage: gameState.demographics.harvestLossPercentage,
        hasSavings: gameState.demographics.hasSavings,
        savingsAmount: gameState.demographics.savingsAmount,
        borrowedMoney: gameState.demographics.borrowedMoney,
        borrowSources: gameState.demographics.borrowSources,
        hasOffFarmIncome: gameState.demographics.hasOffFarmIncome,
        offFarmIncomeAmount: gameState.demographics.offFarmIncomeAmount,
        memberOfFarmerGroup: gameState.demographics.memberOfFarmerGroup,
        farmerGroupName: gameState.demographics.farmerGroupName,
        distanceToMarket: gameState.demographics.distanceToMarket,
        distanceToInsurer: gameState.demographics.distanceToInsurer,
        usesMobileMoney: gameState.demographics.usesMobileMoney
    };
    
    // Save first partner's complete state
    const savedState = {
        householdId: gameState.householdId,
        treatmentGroup: gameState.treatmentGroup,
        firstRespondentId: gameState.respondentId,
        firstRole: gameState.role,
        firstGender: gameState.gender,
        firstSessionType: gameState.sessionType,
        householdData: householdData
    };
    
    // Store first partner tracking info
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
    
    // Save to localStorage for recovery
    try {
        localStorage.setItem('weather_game_household', JSON.stringify(savedState));
        console.log('💾 Saved first partner data to localStorage');
    } catch (e) {
        console.warn('⚠️ Could not save to localStorage:', e);
    }
    
    // ===== RESET GAME STATE FOR SECOND PARTNER =====
    const preservedData = {
        householdId: gameState.householdId,
        treatmentGroup: gameState.treatmentGroup,
        firstRespondentId: gameState.firstRespondentId,
        firstRespondentRole: gameState.firstRespondentRole,
        firstRespondentData: gameState.firstRespondentData
    };
    
    // Reset individual fields
    gameState.respondentId = null;
    gameState.sessionId = null;
    gameState.demographics = { ...householdData }; // Keep household data
    gameState.empowermentScores = {};
    gameState.seasonData = [];
    gameState.currentSeason = 1;
    gameState.gender = null;
    gameState.role = null;
    gameState.sessionType = null;
    
    // Restore preserved tracking data
    Object.assign(gameState, preservedData);
    
    console.log('✅ Game state reset for second partner');
    console.log('📋 Preserved:', {
        householdId: gameState.householdId,
        firstRespondentRole: gameState.firstRespondentRole,
        treatmentGroup: gameState.treatmentGroup
    });
    
    // Clear all forms
    document.querySelectorAll('form').forEach(form => form.reset());
    
    // Reset progress
    currentDemoPage = 1;
    currentStep = 1;
    updateGlobalProgress(1, 13);
    
    // Show demographics screen
    showScreen('demographicsScreen');
    
    // ===== SETUP FORM AFTER SCREEN TRANSITION =====
    setTimeout(() => {
        showDemoPage(1);
        
        const form = document.getElementById('demographicsForm');
        if (!form) {
            console.error('❌ Demographics form not found!');
            return;
        }
        
        // ===== STEP 1: REMOVE OLD HIDDEN FIELDS =====
        form.querySelectorAll('input[data-second-partner-hidden]').forEach(field => field.remove());
        
        // ===== STEP 2: ADD HIDDEN FIELDS FOR HOUSEHOLD DATA =====
        const hiddenFields = {
            'enumeratorName': householdData.enumeratorName,
            'communityName': householdData.communityName,
            'householdSize': householdData.householdSize,
            'childrenUnder15': householdData.childrenUnder15,
            'farmingYears': householdData.yearsOfFarming,
            'landSize': householdData.landCultivated,
            'landAccessMethod': householdData.landAccessMethod,
            'landAccessOther': householdData.landAccessOther || '',
            'numberOfCropsPlanted': householdData.numberOfCropsPlanted,
            'lastIncome': householdData.lastSeasonIncome,
            'farmingInputExpenditure': householdData.farmingInputExpenditure,
            'hasIrrigationAccess': householdData.hasIrrigationAccess ? '1' : '0',
            'estimatedLossLastYear': householdData.estimatedLossLastYear,
            'harvestLossPercentage': householdData.harvestLossPercentage,
            'hasSavings': householdData.hasSavings ? '1' : '0',
            'savingsAmount': householdData.savingsAmount || 0,
            'borrowedMoney': householdData.borrowedMoney ? '1' : '0',
            'hasOffFarmIncome': householdData.hasOffFarmIncome ? '1' : '0',
            'offFarmIncomeAmount': householdData.offFarmIncomeAmount || 0,
            'memberOfFarmerGroup': householdData.memberOfFarmerGroup ? '1' : '0',
            'farmerGroupName': householdData.farmerGroupName || '',
            'distanceToMarket': householdData.distanceToMarket,
            'distanceToInsurer': householdData.distanceToInsurer,
            'usesMobileMoney': householdData.usesMobileMoney ? '1' : '0'
        };
        
        // Create hidden inputs
        Object.entries(hiddenFields).forEach(([name, value]) => {
            const hidden = document.createElement('input');
            hidden.type = 'hidden';
            hidden.name = name;
            hidden.value = value;
            hidden.setAttribute('data-second-partner-hidden', 'true');
            form.appendChild(hidden);
        });
        
        // Add crops
        if (householdData.mainCrops && Array.isArray(householdData.mainCrops)) {
            householdData.mainCrops.forEach(crop => {
                const hidden = document.createElement('input');
                hidden.type = 'hidden';
                hidden.name = 'crops';
                hidden.value = crop;
                hidden.setAttribute('data-second-partner-hidden', 'true');
                form.appendChild(hidden);
            });
        }
        
        // Add assets
        if (householdData.assets) {
            Object.entries(householdData.assets).forEach(([asset, has]) => {
                if (has) {
                    const hidden = document.createElement('input');
                    hidden.type = 'hidden';
                    hidden.name = `asset_${asset}`;
                    hidden.value = '1';
                    hidden.setAttribute('data-second-partner-hidden', 'true');
                    form.appendChild(hidden);
                }
            });
        }
        
        // Add livestock
        if (householdData.livestock) {
            Object.entries(householdData.livestock).forEach(([animal, count]) => {
                const hidden = document.createElement('input');
                hidden.type = 'hidden';
                hidden.name = `livestock_${animal}`;
                hidden.value = count;
                hidden.setAttribute('data-second-partner-hidden', 'true');
                form.appendChild(hidden);
            });
        }
        
        // Add improved inputs
        if (householdData.improvedInputs) {
            Object.entries(householdData.improvedInputs).forEach(([input, used]) => {
                if (used) {
                    const hidden = document.createElement('input');
                    hidden.type = 'hidden';
                    hidden.name = `input_${input}`;
                    hidden.value = '1';
                    hidden.setAttribute('data-second-partner-hidden', 'true');
                    form.appendChild(hidden);
                }
            });
        }
        
        // Add shocks
        if (householdData.shocks) {
            Object.entries(householdData.shocks).forEach(([shock, experienced]) => {
                if (experienced) {
                    const hidden = document.createElement('input');
                    hidden.type = 'hidden';
                    hidden.name = `shock_${shock}`;
                    hidden.value = '1';
                    hidden.setAttribute('data-second-partner-hidden', 'true');
                    form.appendChild(hidden);
                }
            });
        }
        
        // Add borrow sources
        if (householdData.borrowSources && Array.isArray(householdData.borrowSources)) {
            householdData.borrowSources.forEach(source => {
                const hidden = document.createElement('input');
                hidden.type = 'hidden';
                hidden.name = `borrowSource_${source}`;
                hidden.value = '1';
                hidden.setAttribute('data-second-partner-hidden', 'true');
                form.appendChild(hidden);
            });
        }
        
        console.log('✅ Added hidden fields for all household data');
        
        // ===== STEP 3: DISABLE AND HIDE VISIBLE ENUMERATOR/COMMUNITY/HOUSEHOLD ASSET FIELDS =====
        const communitySelect = document.getElementById('communityName');
        const enumeratorSelect = document.getElementById('enumeratorName');

        if (communitySelect) {
            communitySelect.removeAttribute('required');
            communitySelect.disabled = true;
            const formGroup = communitySelect.closest('.form-group');
            if (formGroup) formGroup.style.display = 'none';
        }

        if (enumeratorSelect) {
            enumeratorSelect.removeAttribute('required');
            enumeratorSelect.disabled = true;
            const formGroup = enumeratorSelect.closest('.form-group');
            if (formGroup) formGroup.style.display = 'none';
        }
        
        // ✅ FIX 1: HIDE HOUSEHOLD ASSETS PAGE (Page 3) for second partner
//         const page3 = document.getElementById('demoPage3');
//         const page6 = document.getElementById('demoPage6');
//         if (page3) {
//             page3.style.display = 'none';
//             console.log('✅ Hidden household assets page (Page 3) for second partner');
//         }

//         if (page6) {
//     page6.style.display = 'none';
//     page6.setAttribute('data-skip', 'true');
//     console.log('✅ Marked Page 6 (Livestock) for skipping');
// }
        
        // ===== STEP 4: ADD NOTICE BOX =====
        const page1 = document.getElementById('demoPage1');
        if (page1 && !document.getElementById('secondPartnerNotice')) {
            const noticeDiv = document.createElement('div');
            noticeDiv.id = 'secondPartnerNotice';
            noticeDiv.style.cssText = `
                background: linear-gradient(135deg, #E3F2FD, #BBDEFB);
                padding: 20px;
                border-radius: 12px;
                margin-bottom: 25px;
                border-left: 6px solid #2196F3;
            `;
            noticeDiv.innerHTML = `
                <p style="margin: 0 0 10px 0; font-size: 18px; font-weight: 700; color: #1565C0;">
                    <i class="fas fa-user-friends" style="margin-right: 10px;"></i>
                    Second Partner Information
                </p>
                <p style="margin: 0; font-size: 15px; line-height: 1.6; color: #424242;">
                    <strong>Community, Enumerator, and Household Assets</strong> are already saved from the first partner.
                    <br>Please fill in <strong>your personal details</strong> (role, gender, age, education, trust scores).
                </p>
            `;
            page1.insertBefore(noticeDiv, page1.firstChild);
        }
        
        // ===== STEP 5: SETUP ROLE GUIDANCE =====
        updateSecondPartnerGuidance();
        
        console.log('✅ Second partner form setup complete');
        
    }, 200);
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



// ===== SHOW RESULTS - COMPLETE REVISED VERSION =====
async function showResults() {
    try {
        showLoading();
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        console.log('🔍 ===== SHOWRESULTS CALLED =====');
        console.log('Current respondentId:', gameState.respondentId);
        console.log('First respondentId:', gameState.firstRespondentId);
        console.log('Second respondentId:', gameState.secondRespondentId);
        console.log('Session type:', gameState.sessionType);
        console.log('Role:', gameState.role);
        
        const session = await apiCall(`/session/${gameState.sessionId}`);
        const knowledge = await apiCall(`/knowledge/${gameState.respondentId}`);
        
        // Update results display
        document.getElementById('totalEarnings').textContent = session.totalEarnings + ' GHS';
        document.getElementById('totalInsurance').textContent = session.totalInsuranceSpent + ' GHS';
        document.getElementById('totalPayouts').textContent = session.totalPayoutsReceived + ' GHS';
        document.getElementById('knowledgeScore').textContent = knowledge.knowledgeScore + '/5';
        
        // Generate insights
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
        
        // ✅ HIDE SYNC CARDS ON RESULTS SCREEN
        const resultsSyncSection = document.querySelector('.results-sync-section');
        if (resultsSyncSection) {
            resultsSyncSection.style.display = 'none';
            console.log('✅ Hidden results sync section - using top-right sync button only');
        }
        
        showLoading(false);
        showScreen('resultsScreen');
        
        // ===== DETERMINE GAME FLOW =====
        
        // CASE 1: Couple session completed - GAME TRULY OVER
        if (gameState.sessionType === 'couple_joint') {
            console.log('✅ CASE: COUPLE SESSION completed - GAME TRULY COMPLETE');
            
            if (resultsTitle) resultsTitle.textContent = 'Game Completed!';
            if (resultsSubtitle) resultsSubtitle.textContent = "Here's how you performed together";
            if (restartBtn) {
                restartBtn.style.display = 'inline-flex';
                restartBtn.innerHTML = '<i class="fas fa-redo"></i><span>Start New Game</span>';
            }
            
            // ✅ CLEAR PROGRESS - Game is truly complete
            window.clearGameProgress();
            
            return;
        }
        
        // Check if firstRespondentId EXISTS first
        if (!gameState.firstRespondentId) {
            console.log('✅ CASE: FIRST PARTNER completed (no firstRespondentId set)');
            
            gameState.firstRespondentId = gameState.respondentId;
            gameState.firstRespondentRole = gameState.role;
            
            const partnerName = gameState.role === 'husband' ? 'Husband' : 'Wife';
            if (resultsTitle) resultsTitle.textContent = 'First Partner Complete!';
            if (resultsSubtitle) resultsSubtitle.textContent = `Here's how the ${partnerName.toLowerCase()} performed`;
            if (restartBtn) restartBtn.style.display = 'none';
            
            // ❌ DON'T CLEAR - More partners to play
            
            await new Promise(resolve => setTimeout(resolve, 3000));
            showSecondPartnerPrompt();
            return;
        }
        
        // CASE 2: This respondent matches the first partner
        if (gameState.respondentId === gameState.firstRespondentId) {
            console.log('✅ CASE: FIRST PARTNER completed (ID matches)');
            
            const partnerName = gameState.role === 'husband' ? 'Husband' : 'Wife';
            if (resultsTitle) resultsTitle.textContent = 'First Partner Complete!';
            if (resultsSubtitle) resultsSubtitle.textContent = `Here's how the ${partnerName.toLowerCase()} performed`;
            if (restartBtn) restartBtn.style.display = 'none';
            
            // ❌ DON'T CLEAR - More partners to play
            
            await new Promise(resolve => setTimeout(resolve, 3000));
            showSecondPartnerPrompt();
            return;
        }
        
        // CASE 3: Second partner
        console.log('✅ CASE: SECOND PARTNER completed');
        
        if (!gameState.secondRespondentId) {
            gameState.secondRespondentId = gameState.respondentId;
        }
        
        const partnerName = gameState.role === 'husband' ? 'Husband' : 'Wife';
        if (resultsTitle) resultsTitle.textContent = 'Second Partner Complete!';
        if (resultsSubtitle) resultsSubtitle.textContent = `Here's how the ${partnerName.toLowerCase()} performed`;
        if (restartBtn) restartBtn.style.display = 'none';
        
        // ❌ DON'T CLEAR - Still have couple session
        
        await new Promise(resolve => setTimeout(resolve, 3000));
        showCouplePrompt();
        
    } catch (error) {
        showLoading(false);
        console.error('❌ Error loading results:', error);
        alert('Error loading results: ' + error.message);
    }
}






// 🆕 NEW HELPER FUNCTION: Check and Handle Pending Sync
async function checkAndHandlePendingSync() {
    console.log('');
    console.log('🔍 ========================================');
    console.log('🔍 CHECKING FOR PENDING SYNC DATA');
    console.log('🔍 ========================================');
    
    try {
        // Get current sync status
        const syncStatus = window.offlineStorage.getSyncStatus();
        
        console.log('📊 Sync Status:', {
            isOnline: syncStatus.isOnline,
            pendingItems: syncStatus.pendingItems,
            lastSync: syncStatus.lastSync
        });
        
        // Find or create sync notice element
        let syncNotice = document.getElementById('resultsSyncNotice');
        
        if (!syncNotice) {
            // Create sync notice if it doesn't exist
            const resultsContainer = document.querySelector('#resultsScreen .results-container');
            const restartBtn = document.getElementById('restartBtn');
            
            if (resultsContainer && restartBtn) {
                syncNotice = document.createElement('div');
                syncNotice.id = 'resultsSyncNotice';
                syncNotice.style.cssText = `
                    display: none;
                    background: linear-gradient(135deg, #FF9800, #F57C00);
                    color: white;
                    padding: 25px;
                    border-radius: 15px;
                    margin: 30px 0;
                    text-align: center;
                    box-shadow: 0 8px 20px rgba(255, 152, 0, 0.3);
                    animation: pulse 2s ease-in-out infinite;
                `;
                
                syncNotice.innerHTML = `
                    <div style="font-size: 48px; margin-bottom: 15px;">
                        <i class="fas fa-cloud-upload-alt"></i>
                    </div>
                    <h3 style="margin: 0 0 15px 0; font-size: 24px; font-weight: 700;">
                        Data Not Yet Uploaded to Server
                    </h3>
                    <p style="margin: 0 0 20px 0; font-size: 18px; line-height: 1.6;">
                        Your game data is safely saved on this device, but hasn't been uploaded to the central database yet.
                        <br>
                        <strong>Please upload now to ensure your data is backed up!</strong>
                    </p>
                    <div id="syncItemsCount" style="background: rgba(255,255,255,0.2); padding: 15px; border-radius: 10px; margin-bottom: 20px; font-size: 16px; font-weight: 600;">
                        <i class="fas fa-database"></i> <span id="pendingCount">0</span> items waiting to upload
                    </div>
                    <button onclick="manualSync()" class="btn-primary btn-large" style="background: white; color: #F57C00; border: none; box-shadow: 0 4px 15px rgba(0,0,0,0.2);">
                        <i class="fas fa-sync-alt"></i>
                        <span>Upload to Server Now</span>
                        <i class="fas fa-arrow-right"></i>
                    </button>
                    <p style="margin: 15px 0 0 0; font-size: 14px; opacity: 0.9;">
                        <i class="fas fa-info-circle"></i> This will send your data to the central database for safekeeping
                    </p>
                `;
                
                // Insert before restart button
                resultsContainer.insertBefore(syncNotice, restartBtn);
                console.log('✅ Created sync notice element');
            }
        }
        
        // Update pending count
        const pendingCountEl = document.getElementById('pendingCount');
        if (pendingCountEl) {
            pendingCountEl.textContent = syncStatus.pendingItems;
        }
        
        // Show/hide sync notice based on pending items
        if (syncStatus.pendingItems > 0) {
            console.log('⚠️ FOUND PENDING DATA - Showing sync notice');
            console.log(`   ${syncStatus.pendingItems} items need to be uploaded`);
            
            if (syncNotice) {
                syncNotice.style.display = 'block';
            }
            
            // Try auto-sync if online
            if (syncStatus.isOnline) {
                console.log('🌐 Online detected - Attempting auto-sync...');
                
                // Show loading indicator
                const syncBtn = syncNotice?.querySelector('button');
                if (syncBtn) {
                    syncBtn.disabled = true;
                    syncBtn.innerHTML = '<i class="fas fa-sync-alt fa-spin"></i><span>Uploading...</span>';
                }
                
                try {
                    const result = await window.offlineStorage.syncOfflineData();
                    
                    console.log('📊 Sync Result:', result);
                    
                    if (result.success && result.results && result.results.successful > 0) {
                        console.log('✅ AUTO-SYNC SUCCESS!');
                        console.log(`   Uploaded: ${result.results.successful} items`);
                        
                        showToast(`✅ Successfully uploaded ${result.results.successful} items to server!`, 'success');
                        
                        // Hide sync notice
                        if (syncNotice) {
                            syncNotice.style.display = 'none';
                        }
                        
                        // Update connection status
                        updateConnectionStatus();
                        
                    } else if (result.results && result.results.failed > 0) {
                        console.warn('⚠️ Some items failed to sync');
                        showToast(`⚠️ ${result.results.failed} items failed to upload. Please try again.`, 'warning');
                        
                        // Re-enable button
                        if (syncBtn) {
                            syncBtn.disabled = false;
                            syncBtn.innerHTML = '<i class="fas fa-sync-alt"></i><span>Try Upload Again</span><i class="fas fa-arrow-right"></i>';
                        }
                    }
                } catch (syncError) {
                    console.error('❌ Auto-sync failed:', syncError);
                    showToast('⚠️ Auto-upload failed. Please click "Upload to Server Now" button.', 'warning');
                    
                    // Re-enable button
                    if (syncBtn) {
                        syncBtn.disabled = false;
                        syncBtn.innerHTML = '<i class="fas fa-sync-alt"></i><span>Upload to Server Now</span><i class="fas fa-arrow-right"></i>';
                    }
                }
            } else {
                console.log('📴 Offline - Cannot auto-sync');
                showToast('📴 You are offline. Data will sync when connection is restored.', 'info');
            }
            
        } else {
            console.log('✅ No pending data to sync');
            if (syncNotice) {
                syncNotice.style.display = 'none';
            }
        }
        
        console.log('🔍 ========================================');
        console.log('');
        
    } catch (error) {
        console.error('❌ Error checking pending sync:', error);
        // Don't block the results screen if sync check fails
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


// Inside DOMContentLoaded, add this:

// Add change listener for crops checkboxes
document.addEventListener('change', function(e) {
    if (e.target.name === 'crops') {
        const cropsCheckboxes = document.querySelectorAll('input[name="crops"]');
        const anyChecked = Array.from(cropsCheckboxes).some(cb => cb.checked);
        const cropsError = document.getElementById('cropsError');
        
        if (cropsError) {
            cropsError.style.display = anyChecked ? 'none' : 'block';
        }
    }
});


// ===== EVENT LISTENERS =====
// ===== CONSOLIDATED DOMContentLoaded - SINGLE BLOCK =====
// document.addEventListener('DOMContentLoaded', function() {
//     console.log('🎮 Weather Index Insurance Game Loaded');
//     console.log(`📋 Total steps: ${TOTAL_STEPS}`);
//     console.log(`📄 Demographics pages: ${DEMOGRAPHICS_PAGES}`);

//     // ===== WELCOME SCREEN =====
//     const startBtn = document.getElementById('startBtn');
//     if (startBtn) {
//         startBtn.addEventListener('click', startDemographics);
//         console.log('✅ Start button listener registered');
//     }

//     // ===== DEMOGRAPHICS NAVIGATION =====
//     const nextBtn = document.getElementById('demoNextBtn');
//     if (nextBtn) {
//         nextBtn.addEventListener('click', function() {
//             console.log(`▶️ Next clicked. Current page: ${currentDemoPage}`);
            
//             if (validateCurrentDemoPage()) {
//                 if (currentDemoPage < DEMOGRAPHICS_PAGES) {
//                     currentDemoPage++;
//                     showDemoPage(currentDemoPage);
//                 } else {
//                     console.log('Already on last page');
//                 }
//             }
//         });
//         console.log('✅ Next button listener registered');
//     }
    
//     const prevBtn = document.getElementById('demoPrevBtn');
//     if (prevBtn) {
//         prevBtn.addEventListener('click', function() {
//             console.log(`◀️ Previous clicked. Current page: ${currentDemoPage}`);
            
//             if (currentDemoPage > 1) {
//                 currentDemoPage--;
//                 showDemoPage(currentDemoPage);
//             }
//         });
//         console.log('✅ Previous button listener registered');
//     }
    
//     // Initialize demographics to page 1
//     showDemoPage(1);

//     // ===== DEMOGRAPHICS FORM SUBMISSION (PARTNER 1) =====
//    // ===== DEMOGRAPHICS FORM SUBMISSION (PARTNER 1) =====
// const demoForm = document.getElementById('demographicsForm');
// if (demoForm) {
//     console.log('✅ Demographics form found');
    
//     demoForm.addEventListener('submit', async (e) => {
//         e.preventDefault();
        
//         console.log('📝 FORM SUBMIT TRIGGERED');
//         console.log('Current page:', currentDemoPage, '/', DEMOGRAPHICS_PAGES);
        
//         // CRITICAL: Only process if on last page
//         if (currentDemoPage !== DEMOGRAPHICS_PAGES) {
//             console.log('⚠️ Not on last page - skipping');
//             return;
//         }
        
//         // Validate before proceeding
//         if (!validateCurrentDemoPage()) {
//             console.log('❌ Validation failed');
//             alert('Please fill in all required fields on this page.');
//             return;
//         }
        
//         console.log('✅ Starting submission process...');
//         showLoading();
        
//         try {
//             const formData = new FormData(e.target);
            
//             // Basic validation
//             const enumeratorName = formData.get('enumeratorName');
//             const communityName = formData.get('communityName');
//             const selectedRole = formData.get('role');
//             const selectedGender = formData.get('gender');
            
//             if (!enumeratorName?.trim() || !communityName?.trim() || !selectedRole || !selectedGender) {
//                 throw new Error('Missing required basic information');
//             }
            
//             // Collect crops
//             const crops = Array.from(document.querySelectorAll('input[name="crops"]:checked'))
//                 .map(cb => cb.value);
            
//             if (crops.length === 0) {
//                 showLoading(false);
//                 alert('⚠️ Please select at least one crop on Page 5');
//                 currentDemoPage = 5;
//                 showDemoPage(5);
//                 return;
//             }
            
//             // Collect assets
//             const assets = {
//                 radio: formData.get('asset_radio') === '1',
//                 tv: formData.get('asset_tv') === '1',
//                 refrigerator: formData.get('asset_refrigerator') === '1',
//                 bicycle: formData.get('asset_bicycle') === '1',
//                 motorbike: formData.get('asset_motorbike') === '1',
//                 mobilePhone: formData.get('asset_mobilePhone') === '1',
//                 generator: formData.get('asset_generator') === '1',
//                 plough: formData.get('asset_plough') === '1'
//             };
            
//             const livestock = {
//                 cattle: parseInt(formData.get('livestock_cattle')) || 0,
//                 goats: parseInt(formData.get('livestock_goats')) || 0,
//                 sheep: parseInt(formData.get('livestock_sheep')) || 0,
//                 poultry: parseInt(formData.get('livestock_poultry')) || 0
//             };
            
//             const improvedInputs = {
//                 certifiedSeed: formData.get('input_certifiedSeed') === '1',
//                 fertilizer: formData.get('input_fertilizer') === '1',
//                 pesticides: formData.get('input_pesticides') === '1',
//                 irrigation: formData.get('input_irrigation') === '1'
//             };
            
//             const shocks = {
//                 drought: formData.get('shock_drought') === '1',
//                 flood: formData.get('shock_flood') === '1',
//                 pestsDisease: formData.get('shock_pestsDisease') === '1',
//                 cropPriceFall: formData.get('shock_cropPriceFall') === '1'
//             };
            
//             const borrowSources = [];
//             if (formData.get('borrowedMoney') === '1') {
//                 if (formData.get('borrowSource_bank')) borrowSources.push('bank');
//                 if (formData.get('borrowSource_microfinance')) borrowSources.push('microfinance');
//                 if (formData.get('borrowSource_vsla')) borrowSources.push('vsla');
//                 if (formData.get('borrowSource_familyFriends')) borrowSources.push('familyFriends');
//                 if (formData.get('borrowSource_moneylender')) borrowSources.push('moneylender');
//             }
            
//             // Build demographics object
//             gameState.demographics = {
//                 householdId: gameState.householdId,
//                 communityName: communityName.trim(),
//                 enumeratorName: enumeratorName.trim(),
//                 gender: selectedGender,
//                 role: selectedRole,
//                 language: gameState.language || 'english',
                
//                 age: parseInt(formData.get('age')) || 18,
//                 education: parseInt(formData.get('education')) || 0,
//                 householdSize: parseInt(formData.get('householdSize')) || 1,
//                 childrenUnder15: parseInt(formData.get('childrenUnder15')) || 0,
                
//                 assets: assets,
//                 livestock: livestock,
                
//                 yearsOfFarming: parseInt(formData.get('farmingYears')) || 0,
//                 landCultivated: parseFloat(formData.get('landSize')) || 0,
//                 landAccessMethod: parseInt(formData.get('landAccessMethod')) || 1,
//                 landAccessOther: formData.get('landAccessOther') || '',
//                 mainCrops: crops,
//                 numberOfCropsPlanted: parseInt(formData.get('numberOfCropsPlanted')) || 1,
//                 lastSeasonIncome: parseFloat(formData.get('lastIncome')) || 0,
//                 farmingInputExpenditure: parseFloat(formData.get('farmingInputExpenditure')) || 0,
                
//                 improvedInputs: improvedInputs,
//                 hasIrrigationAccess: formData.get('hasIrrigationAccess') === '1',
                
//                 shocks: shocks,
//                 estimatedLossLastYear: parseFloat(formData.get('estimatedLossLastYear')) || 0,
//                 harvestLossPercentage: parseInt(formData.get('harvestLossPercentage')) || 0,
                
//                 hasSavings: formData.get('hasSavings') === '1',
//                 savingsAmount: parseFloat(formData.get('savingsAmount')) || 0,
//                 borrowedMoney: formData.get('borrowedMoney') === '1',
//                 borrowSources: borrowSources,
//                 hasOffFarmIncome: formData.get('hasOffFarmIncome') === '1',
//                 offFarmIncomeAmount: parseFloat(formData.get('offFarmIncomeAmount')) || 0,
                
//                 priorInsuranceKnowledge: formData.get('priorKnowledge') === '1',
//                 purchasedInsuranceBefore: formData.get('purchasedInsuranceBefore') === '1',
//                 insuranceType: formData.get('insuranceType') || '',
                
//                 trustFarmerGroup: parseInt(formData.get('trust_farmerGroup')) || 3,
//                 trustNGO: parseInt(formData.get('trust_ngo')) || 3,
//                 trustInsuranceProvider: parseInt(formData.get('trust_insuranceProvider')) || 3,
//                 rainfallChangePerception: parseInt(formData.get('rainfallChangePerception')) || 3,
//                 insurerPayoutTrust: parseInt(formData.get('insurerPayoutTrust')) || 3,
                
//                 communityInsuranceDiscussion: false,
//                 extensionVisits: false,
//                 numberOfExtensionVisits: 0,
                
//                 memberOfFarmerGroup: formData.get('memberOfFarmerGroup') === '1',
//                 farmerGroupName: formData.get('farmerGroupName') || '',
                
//                 distanceToMarket: parseInt(formData.get('distanceToMarket')) || 0,
//                 distanceToInsurer: parseInt(formData.get('distanceToInsurer')) || 0,
//                 usesMobileMoney: formData.get('usesMobileMoney') === '1'
//             };
            
//             gameState.gender = selectedGender;
//             gameState.role = selectedRole;
            
//             console.log('✅ Demographics collected successfully!');
//             console.log('📊 Role:', selectedRole, '| Gender:', selectedGender);
//             console.log('📊 Crops:', crops);
            
//             showLoading(false);
            
//             // Move to Risk Assessment (Step 11)
//             currentStep = 11;
//             updateGlobalProgress(currentStep, TOTAL_STEPS);
            
//             console.log('🎯 Moving to Risk Assessment...');
            
//             setTimeout(() => {
//                 showScreen('riskScreen');
//                 console.log('✅ TRANSITIONED TO RISK SCREEN');
//             }, 100);
            
//         } catch (error) {
//             showLoading(false);
//             console.error('❌ ERROR:', error.message);
//             console.error('Stack:', error.stack);
//             alert('Error submitting demographics: ' + error.message);
//             window.scrollTo({ top: 0, behavior: 'smooth' });
//         }
//     });
    
//     console.log('✅ Demographics form submission handler registered');
// }



//     // ===== CONDITIONAL FIELD VISIBILITY =====
//     const hasSavingsRadios = document.querySelectorAll('[name="hasSavings"]');
//     hasSavingsRadios.forEach(radio => {
//         radio.addEventListener('change', function() {
//             const group = document.getElementById('savingsAmountGroup');
//             if (group) {
//                 group.style.display = this.value === '1' ? 'block' : 'none';
//             }
//         });
//     });
    
//     const borrowedMoneyRadios = document.querySelectorAll('[name="borrowedMoney"]');
//     borrowedMoneyRadios.forEach(radio => {
//         radio.addEventListener('change', function() {
//             const group = document.getElementById('borrowingSourcesGroup');
//             if (group) {
//                 group.style.display = this.value === '1' ? 'block' : 'none';
//             }
//         });
//     });
    
//     const hasOffFarmRadios = document.querySelectorAll('[name="hasOffFarmIncome"]');
//     hasOffFarmRadios.forEach(radio => {
//         radio.addEventListener('change', function() {
//             const group = document.getElementById('offFarmIncomeGroup');
//             if (group) {
//                 group.style.display = this.value === '1' ? 'block' : 'none';
//             }
//         });
//     });

//     // ===== CROPS CHECKBOX VALIDATION =====
//     document.addEventListener('change', function(e) {
//         if (e.target.name === 'crops') {
//             const cropsCheckboxes = document.querySelectorAll('input[name="crops"]');
//             const anyChecked = Array.from(cropsCheckboxes).some(cb => cb.checked);
//             const cropsError = document.getElementById('cropsError');
            
//             if (cropsError) {
//                 cropsError.style.display = anyChecked ? 'none' : 'block';
//             }
//         }
//     });

//     // ===== RISK FORM =====
//     const riskForm = document.getElementById('riskForm');
//     if (riskForm) {
//         riskForm.addEventListener('submit', async (e) => {
//             e.preventDefault();
//             showLoading();
            
//             try {
//                 const formData = new FormData(e.target);
//                 gameState.demographics.riskPreference = parseInt(formData.get('riskChoice'));
//                 gameState.demographics.riskComfort = parseInt(formData.get('riskComfort'));
//                 gameState.demographics.decisionMaker = parseInt(formData.get('decisionMaker'));
                
//                 showLoading(false);
                
//                 currentStep = 12;
//                 updateGlobalProgress(currentStep, TOTAL_STEPS);
//                 showScreen('empowermentScreen');
//             } catch (error) {
//                 showLoading(false);
//                 console.error('Risk form error:', error);
//                 alert('Error: ' + error.message);
//             }
//         });
//         console.log('✅ Risk form handler registered');
//     }

    
//     // ===== TUTORIAL =====
//     const tutorialPrevBtn = document.getElementById('tutorialPrevBtn');
//     if (tutorialPrevBtn) {
//         tutorialPrevBtn.addEventListener('click', previousTutorialCard);
//     }
    
//     const tutorialNextBtn = document.getElementById('tutorialNextBtn');
//     if (tutorialNextBtn) {
//         tutorialNextBtn.addEventListener('click', nextTutorialCard);
//     }
    
//     const tutorialFinishBtn = document.getElementById('tutorialFinishBtn');
//     if (tutorialFinishBtn) {
//         tutorialFinishBtn.addEventListener('click', startGameAfterTutorial);
//     }

//     const cardStack = document.getElementById('tutorialCardStack');
//     if (cardStack) {
//         cardStack.addEventListener('touchstart', handleTouchStart, false);
//         cardStack.addEventListener('touchend', handleTouchEnd, false);
//     }

//     // ===== GAME ALLOCATION INPUTS =====
//     ['insuranceSpend', 'inputSpend', 'educationSpend', 'consumptionSpend'].forEach(inputId => {
//         const input = document.getElementById(inputId);
//         if (input) input.addEventListener('input', updateAllocation);
//     });

//     // ===== NEXT SEASON BUTTON =====
//     const nextSeasonBtn = document.getElementById('nextRoundBtn');
//     if (nextSeasonBtn) {
//         nextSeasonBtn.addEventListener('click', nextSeason);
//         nextSeasonBtn.innerHTML = '<span>Continue to Next Season</span><i class="fas fa-arrow-right"></i>';
//     }

//     // ===== RESTART BUTTON =====
//     const restartBtn = document.getElementById('restartBtn');
//     if (restartBtn) {
//         restartBtn.addEventListener('click', restartGame);
//     }

//     // ===== ALLOCATION FORM =====
  

//     // ===== KNOWLEDGE FORM =====
// // ===== FIX 2: CORRECT KNOWLEDGE TEST SUBMISSION =====
// // Find the knowledge form handler (around line 4430) and replace it:

// // ===== KNOWLEDGE FORM =====
// const knowledgeForm = document.getElementById('knowledgeForm');
// if (knowledgeForm) {
//     knowledgeForm.addEventListener('submit', async (e) => {
//         e.preventDefault();
        
//         if (isSubmittingKnowledge) {
//             console.log('⚠️ Already submitting knowledge test');
//             return;
//         }
        
//         isSubmittingKnowledge = true;
//         showLoading();
        
//         try {
//             const formData = new FormData(e.target);
            
//             // ✅ CORRECT FORMAT: Use proper field names expected by server
//             const testData = {
//                 respondentId: gameState.respondentId,
//                 sessionId: gameState.sessionId,  // ✅ ADDED: Required by server
//                 q1_indexBased: formData.get('q1') === 'true',
//                 q2_areaWide: formData.get('q2') === 'true',
//                 q3_profitGuarantee: formData.get('q3') === 'false',
//                 q4_upfrontCost: formData.get('q4') === 'true',
//                 q5_basisRisk: formData.get('q5') === 'true'
//             };
            
//             console.log('📝 Submitting knowledge test:', testData);
            
//             await apiCall('/knowledge/submit', 'POST', testData);
            
//             // ✅ ADDED: Mark session as complete
//             await apiCall(`/session/${gameState.sessionId}/complete`, 'PUT');
            
//             console.log('✅ Knowledge test submitted and session completed');
            
//             showLoading(false);
            
//             // Show results - this will determine next step
//             await showResults();
            
//         } catch (error) {
//             showLoading(false);
//             isSubmittingKnowledge = false;
//             console.error('❌ Knowledge form error:', error);
//             alert('Error submitting knowledge test: ' + error.message);
//         } finally {
//             isSubmittingKnowledge = false;
//         }
//     });
//     console.log('✅ Knowledge form handler registered');
// }

//     // ===== COUPLE PRE-QUESTIONS =====
//     const couplePreForm = document.getElementById('couplePreQuestionsForm');
//     if (couplePreForm) {
//         couplePreForm.addEventListener('submit', async (e) => {
//             e.preventDefault();
//             // ... your existing couple pre-questions handler
//         });
//     }

//     // ===== PERCEPTION FORM =====
//     const perceptionForm = document.getElementById('perceptionForm');
//     if (perceptionForm) {
//         perceptionForm.addEventListener('submit', async (e) => {
//             e.preventDefault();
//             // ... your existing perception form handler
//         });
//     }

//     // ===== SECOND PARTNER BUTTONS =====
//     // const startSecondBtn = document.getElementById('startSecondPartnerBtn');
//     // if (startSecondBtn) {
//     //     startSecondBtn.addEventListener('click', startSecondPartner);
//     //     console.log('✅ Second partner button listener registered');
//     // }
    
//     const startCouplePromptBtn = document.getElementById('startCouplePromptBtn');
//     if (startCouplePromptBtn) {
//         startCouplePromptBtn.addEventListener('click', startCouplePreQuestions);
//     }

//     // ===== LANGUAGE TOGGLE =====
//     const langBtn = document.getElementById('languageBtn');
//     if (langBtn) {
//         langBtn.addEventListener('click', () => {
//             const newLang = gameState.language === 'english' ? 'dagbani' : 'english';
//             updateLanguage(newLang);
//         });
//         console.log('✅ Language toggle button listener registered');
//     }

//     // ===== CONNECTION STATUS =====
//     window.addEventListener('online', updateConnectionStatus);
//     window.addEventListener('offline', updateConnectionStatus);
//     updateConnectionStatus();

//     console.log('✅ All event listeners registered');
//     console.log('🎮 Game ready!');
// });




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
// ===== UPDATED updateLanguage FUNCTION - COMPLETE FIX =====
function updateLanguage(language) {
    console.log('🌍 Changing language to:', language);
    console.log('📋 Current gameState.language:', gameState.language);
    console.log('📚 TRANSLATIONS available for:', Object.keys(TRANSLATIONS));
    
    gameState.language = language;
    
    // Update language button
    const currentLangEl = document.getElementById('currentLang');
    if (currentLangEl) {
        currentLangEl.textContent = language === 'english' ? 'English' : 'Dagbani';
    }
    
    // ✅ ADD THIS DEBUG CODE
    console.log('🔍 Testing translation:');
    console.log('  welcome.title (EN):', TRANSLATIONS.english.welcome.title);
    console.log('  welcome.title (Dagbani):', TRANSLATIONS.dagbani.welcome.title);
    console.log('  t("welcome.title"):', t('welcome.title'));
    
    // Update all data-translate attributes globally
    const elements = document.querySelectorAll('[data-translate]');
    console.log('📝 Found', elements.length, 'elements with data-translate');
    
    let updatedCount = 0;
    elements.forEach(el => {
        const key = el.getAttribute('data-translate');
        const translation = t(key);
        
        console.log(`  Translating: ${key} → "${translation}"`); // ✅ ADD THIS
        
        // ... rest of the forEach
        if (translation && translation !== key) {
            if (el.tagName === 'BUTTON') {
                const span = el.querySelector('span');
                if (span) {
                    span.textContent = translation;
                    updatedCount++;
                }
            } else {
                el.textContent = translation;
                updatedCount++;
            }
        }
    });
    
    console.log('✅ Updated', updatedCount, 'elements');
    

    // Update specific screens with complex structures
    updateWelcomeScreenLang();
    updateDemographicsScreenLang(); // ✅ Use this, NOT updateExtendedDemographicsLang
    updateRiskScreenLang();
    updateEmpowermentScreenLang();
    updateKnowledgeScreenLang();
    updatePerceptionScreenLang();
    updateCoupleQuestionsLang();
    updateResultsScreenLang();
    updateProgressText();
    
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
    const radios = document.querySelectorAll(`input[type="radio"][name="${name}"]`);
    if (radios.length === 0) {
        console.warn(`⚠️ Radio group not found: ${name}`);
        return;
    }
    
    radios.forEach(radio => {
        const label = radio.closest('label');
        if (label && valueTextMap[radio.value] !== undefined) {
            // Preserve the radio input, update only the text
            label.innerHTML = '';
            label.appendChild(radio);
            label.appendChild(document.createTextNode(' ' + valueTextMap[radio.value]));
        }
    });
    console.log(`✅ Updated radio group: ${name} (${radios.length} options)`);
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
    const select = document.getElementById(selectId) || document.querySelector(`[name="${selectId}"]`);
    if (!select) {
        console.warn(`⚠️ Select not found: ${selectId}`);
        return;
    }
    
    const currentValue = select.value;
    select.innerHTML = '';
    
    options.forEach(opt => {
        const option = document.createElement('option');
        option.value = opt.value;
        option.textContent = opt.text;
        if (opt.disabled) option.disabled = true;
        select.appendChild(option);
    });
    
    select.value = currentValue;
    console.log(`✅ Updated select: ${selectId}`);
}



function updateLabelLang(inputId, text) {
    const input = document.getElementById(inputId) || document.querySelector(`[name="${inputId}"]`);
    if (!input) {
        console.warn(`⚠️ Input not found: ${inputId}`);
        return;
    }
    
    const formGroup = input.closest('.form-group');
    if (!formGroup) {
        console.warn(`⚠️ Form group not found for: ${inputId}`);
        return;
    }
    
    const label = formGroup.querySelector('label:first-of-type');
    if (!label) {
        console.warn(`⚠️ Label not found for: ${inputId}`);
        return;
    }
    
    // Don't update if label contains an input/select (it's a checkbox/radio label)
    if (label.querySelector('input') || label.querySelector('select')) {
        console.log(`⏭️ Skipping checkbox/radio label: ${inputId}`);
        return;
    }
    
    // Preserve icon and required marker
    const icon = label.querySelector('i');
    const required = label.querySelector('span[style*="red"]');
    
    // Clear and rebuild label
    label.innerHTML = '';
    
    if (icon) {
        label.appendChild(icon);
        label.appendChild(document.createTextNode(' '));
    }
    
    label.appendChild(document.createTextNode(text));
    
    if (required) {
        label.appendChild(document.createTextNode(' '));
        label.appendChild(required);
    } else {
        // Add required marker if the input has required attribute
        if (input.hasAttribute('required')) {
            const reqSpan = document.createElement('span');
            reqSpan.style.color = 'red';
            reqSpan.textContent = ' *';
            label.appendChild(reqSpan);
        }
    }
    
    console.log(`✅ Updated label for: ${inputId}`);
}





// ===== 13. UPDATE LANGUAGE BUTTON LISTENER IN DOMContentLoaded =====
// Find the existing language button listener and replace it with:

// Inside DOMContentLoaded:
// ===== LANGUAGE TOGGLE ===== (in DOMContentLoaded)
const langBtn = document.getElementById('languageBtn');
if (langBtn) {
    langBtn.addEventListener('click', () => {
        const currentLang = gameState.language || 'english';
        const newLang = currentLang === 'english' ? 'dagbani' : 'english';
        
        console.log('🔄 Language change:', currentLang, '→', newLang); // ✅ ADD THIS
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


// ===== COMPLETE DEMOGRAPHICS TRANSLATION FUNCTION =====
// Replace the existing updateDemographicsScreenLang() function with this:

function updateDemographicsScreenLang() {
    console.log('🌍 Updating demographics screen language...');
    
    // ===== UPDATE ALL PAGE HEADINGS =====
    const pageHeadings = {
        1: 'demographics.basicInfo',
        2: 'demographics.educationHousehold',
        3: 'demographics.householdAssets',
        4: 'demographics.farmingExperience',
        5: 'demographics.cropsIncome',
        6: 'demographics.livestock',
        7: 'demographics.farmInputs',
        8: 'demographics.shocksLosses',
        9: 'demographics.savingsCredit',
        10: 'demographics.insuranceTrust'
    };
    
    Object.entries(pageHeadings).forEach(([pageNum, key]) => {
        const heading = document.querySelector(`#demoPage${pageNum} h3`);
        if (heading) {
            const icon = heading.querySelector('i');
            const iconHTML = icon ? icon.outerHTML + ' ' : '';
            const span = heading.querySelector('span[data-translate]');
            if (span) {
                span.textContent = t(key);
            } else {
                heading.innerHTML = iconHTML + t(key);
            }
        }
    });
    
    // ===== PAGE 1: BASIC INFO =====
    console.log('📄 Updating Page 1: Basic Info...');
    
    // Enumerator Name label
    updateFieldLabel('enumeratorName', t('demographics.enumeratorName'));
    
    // Update enumerator select placeholder
    const enumeratorSelect = document.getElementById('enumeratorName');
    if (enumeratorSelect) {
        const firstOption = enumeratorSelect.querySelector('option[value=""]');
        if (firstOption) {
            firstOption.textContent = t('demographics.selectEnumerator');
        }
    }
    
    // Community Name label
    updateFieldLabel('communityName', t('demographics.communityName'));
    
    // Update community select options
    const communitySelect = document.getElementById('communityName');
    if (communitySelect) {
        const firstOption = communitySelect.querySelector('option[value=""]');
        if (firstOption) {
            if (firstOption.textContent.includes('Loading')) {
                firstOption.textContent = t('demographics.loadingCommunities');
            } else {
                firstOption.textContent = t('demographics.selectCommunity');
            }
        }
    }
    
    // Gender label and options
    updateFieldLabel('gender', t('demographics.gender'));
    updateSelectLang('gender', [
        { value: '', text: t('common.select') },
        { value: 'male', text: t('demographics.male') },
        { value: 'female', text: t('demographics.female') }
    ]);
    
    // Role label and options
    updateFieldLabel('role', t('demographics.role'));
    updateSelectLang('role', [
        { value: '', text: t('common.select') },
        { value: 'husband', text: t('demographics.husband') },
        { value: 'wife', text: t('demographics.wife') }
    ]);
    
    // Age label
    updateFieldLabel('age', t('demographics.age'));
    
    // ===== PAGE 2: EDUCATION & HOUSEHOLD =====
    console.log('📄 Updating Page 2: Education & Household...');
    
    // Education label and ALL options
    updateFieldLabel('education', t('demographics.education'));
    updateSelectLang('education', [
        { value: '', text: t('common.select') },
        { value: '0', text: t('demographics.noSchooling') },
        { value: '1', text: t('demographics.primary') },
        { value: '2', text: t('demographics.jhs') },
        { value: '3', text: t('demographics.shs') },
        { value: '4', text: t('demographics.tertiary') }
    ]);
    
    // Household size label
    updateFieldLabel('householdSize', t('demographics.householdSize'));
    
    // Children under 15 label
    updateFieldLabel('childrenUnder15', t('demographics.childrenUnder15'));
    
    // ===== PAGE 3: HOUSEHOLD ASSETS =====
    console.log('📄 Updating Page 3: Household Assets...');
    
    // Assets question
    const assetsQuestion = document.querySelector('#demoPage3 .form-group > label:first-child');
    if (assetsQuestion && !assetsQuestion.querySelector('input')) {
        assetsQuestion.innerHTML = t('demographics.assetsQuestion');
    }
    
    // All asset checkboxes
    updateAssetLabel('asset_radio', t('demographics.radio'), '📻');
    updateAssetLabel('asset_tv', t('demographics.tv'), '📺');
    updateAssetLabel('asset_refrigerator', t('demographics.refrigerator'), '❄️');
    updateAssetLabel('asset_bicycle', t('demographics.bicycle'), '🚲');
    updateAssetLabel('asset_motorbike', t('demographics.motorbike'), '🏍️');
    updateAssetLabel('asset_mobilePhone', t('demographics.mobilePhone'), '📱');
    updateAssetLabel('asset_generator', t('demographics.generator'), '⚡');
    updateAssetLabel('asset_plough', t('demographics.plough'), '🚜');
    
    // ===== PAGE 4: FARMING EXPERIENCE =====
    console.log('📄 Updating Page 4: Farming Experience...');
    
    // Farming years label
    updateFieldLabel('farmingYears', t('demographics.farmingYears'));
    
    // Land size label
    updateFieldLabel('landSize', t('demographics.land'));
    
    // Land access method label and ALL options
    updateFieldLabel('landAccessMethod', t('demographics.landAccessMethod'));
    updateSelectLang('landAccessMethod', [
        { value: '', text: t('common.select') },
        { value: '1', text: t('demographics.ownLand') },
        { value: '2', text: t('demographics.rentLease') },
        { value: '3', text: t('demographics.borrowedFamily') },
        { value: '4', text: t('demographics.sharecropping') },
        { value: '5', text: t('demographics.otherAccess') }
    ]);
    
    // ===== PAGE 5: CROPS & INCOME =====
    console.log('📄 Updating Page 5: Crops & Income...');
    
    // Crops question
    const cropsLabel = document.querySelector('#demoPage5 .form-group > label:first-child');
    if (cropsLabel && !cropsLabel.querySelector('input')) {
        const req = cropsLabel.querySelector('span[style*="red"]');
        cropsLabel.innerHTML = t('demographics.crops');
        if (req) cropsLabel.appendChild(req);
        else cropsLabel.innerHTML += ' <span style="color: red;">*</span>';
    }
    
    // All crop checkboxes
    updateCropLabel('maize', t('demographics.maize'), '🌽');
    updateCropLabel('rice', t('demographics.rice'), '🍚');
    updateCropLabel('soybeans', t('demographics.soybeans'), '🫘');
    updateCropLabel('groundnuts', t('demographics.groundnuts'), '🥜');
    updateCropLabel('other', t('demographics.other'), '➕');
    
    // Other labels
    updateFieldLabel('numberOfCropsPlanted', t('demographics.cropsPlanted'));
    updateFieldLabel('lastIncome', t('demographics.income'));
    updateFieldLabel('farmingInputExpenditure', t('demographics.farmingInputExpenditure'));
    
    // ===== PAGE 6: LIVESTOCK =====
    console.log('📄 Updating Page 6: Livestock...');
    
    const livestockQuestion = document.querySelector('#demoPage6 .form-group > label:first-child');
    if (livestockQuestion) {
        livestockQuestion.textContent = t('demographics.livestockQuestion');
    }
    
    updateLivestockLabel('livestock_cattle', t('demographics.cattle'), '🐄');
    updateLivestockLabel('livestock_goats', 'Goats', '🐐');
    updateLivestockLabel('livestock_sheep', 'Sheep', '🐑');
    updateLivestockLabel('livestock_poultry', 'Poultry', '🐔');
    
    // ===== PAGE 7: FARM INPUTS & TECHNOLOGY =====
    console.log('📄 Updating Page 7: Farm Inputs...');
    
    const improvedInputsQuestion = document.querySelector('#demoPage7 .form-group > label:first-child');
    if (improvedInputsQuestion && !improvedInputsQuestion.querySelector('input')) {
        improvedInputsQuestion.textContent = t('demographics.improvedInputsQuestion');
    }
    
    updateInputLabel('input_certifiedSeed', t('demographics.certifiedSeed'), '🌱');
    updateInputLabel('input_fertilizer', t('demographics.chemicalFertilizer'), '🧪');
    updateInputLabel('input_pesticides', t('demographics.pesticides'), '🐛');
    updateInputLabel('input_irrigation', t('demographics.irrigation'), '💧');
    
    // Irrigation access label and YES/NO options
    updateFieldLabel('hasIrrigationAccess', t('demographics.hasIrrigationAccess'));
    updateRadiosLang('hasIrrigationAccess', {
        '0': t('common.no'),
        '1': t('common.yes')
    });
    
    // ===== PAGE 8: SHOCKS & LOSSES =====
    console.log('📄 Updating Page 8: Shocks & Losses...');
    
    const shocksQuestion = document.querySelector('#demoPage8 .form-group > label:first-child');
    if (shocksQuestion && !shocksQuestion.querySelector('input')) {
        shocksQuestion.textContent = t('demographics.shocksQuestion');
    }
    
    updateShockLabel('shock_drought', t('demographics.drought'), '🌵');
    updateShockLabel('shock_flood', 'Flood', '🌊');
    updateShockLabel('shock_pestsDisease', 'Pests/Disease', '🐛');
    updateShockLabel('shock_cropPriceFall', 'Crop price fall', '📉');
    
    updateFieldLabel('estimatedLossLastYear', t('demographics.estimatedLoss'));
    updateFieldLabel('harvestLossPercentage', t('demographics.harvestLossPercentage'));
    
    // ===== PAGE 9: SAVINGS & CREDIT =====
    console.log('📄 Updating Page 9: Savings & Credit...');
    
    // Has savings label and YES/NO
    updateFieldLabel('hasSavings', t('demographics.hasSavings'));
    updateRadiosLang('hasSavings', {
        '0': t('common.no'),
        '1': t('common.yes')
    });
    
    updateFieldLabel('savingsAmount', t('demographics.savingsAmount'));
    
    // Borrowed money label and YES/NO
    updateFieldLabel('borrowedMoney', t('demographics.borrowedMoney'));
    updateRadiosLang('borrowedMoney', {
        '0': t('common.no'),
        '1': t('common.yes')
    });
    
    // Borrow sources
    const borrowSourcesLabel = document.querySelector('#borrowingSourcesGroup > label:first-child');
    if (borrowSourcesLabel) {
        borrowSourcesLabel.textContent = t('demographics.borrowingSources');
    }
    
    updateBorrowSourceLabel('borrowSource_microfinance', t('demographics.microfinance'), '💼');
    updateBorrowSourceLabel('borrowSource_vsla', t('demographics.vsla'), '👥');
    updateBorrowSourceLabel('borrowSource_familyFriends', t('demographics.familyFriends'), '👪');
    updateBorrowSourceLabel('borrowSource_moneylender', t('demographics.moneylender'), '💰');
    
    // Off-farm income label and YES/NO
    updateFieldLabel('hasOffFarmIncome', t('demographics.hasOffFarmIncome'));
    updateRadiosLang('hasOffFarmIncome', {
        '0': t('common.no'),
        '1': t('common.yes')
    });
    
    updateFieldLabel('offFarmIncomeAmount', t('demographics.offFarmAmount'));
    
    // ===== PAGE 10: INSURANCE & TRUST =====
    console.log('📄 Updating Page 10: Insurance & Trust...');
    
    // Prior knowledge label and YES/NO
    updateFieldLabel('priorKnowledge', t('demographics.priorKnowledge'));
    updateRadiosLang('priorKnowledge', {
        '1': t('common.yes'),
        '0': t('common.no')
    });
    
    // Purchased insurance label and YES/NO
    updateFieldLabel('purchasedInsuranceBefore', t('demographics.purchasedInsurance'));
    updateRadiosLang('purchasedInsuranceBefore', {
        '0': t('common.no'),
        '1': t('common.yes')
    });
    
    // Trust questions
    updateTrustQuestionLabel('trust_insuranceProvider', t('demographics.trustInsuranceProvider'));
    updateTrustQuestionLabel('trust_farmerGroup', t('demographics.trustFarmerGroups'));
    updateTrustQuestionLabel('trust_ngo', t('demographics.trustNGOs'));
    
    // Additional trust questions (NEW - added in your HTML)
    updateTrustQuestionLabel('rainfallChangePerception', 'Do you think rainfall patterns have changed in recent years? (1 = Not at all, 5 = Very much)');
    updateTrustQuestionLabel('insurerPayoutTrust', 'How much do you trust that insurance companies will pay out when needed? (1 = Not at all, 5 = Fully)');
    
    // Other fields
    updateFieldLabel('distanceToMarket', t('demographics.distanceMarket'));
    updateFieldLabel('distanceToInsurer', t('demographics.distanceInsurer'));
    
    // Uses mobile money label and YES/NO
    updateFieldLabel('usesMobileMoney', t('demographics.usesMobileMoney'));
    updateRadiosLang('usesMobileMoney', {
        '0': t('common.no'),
        '1': t('common.yes')
    });
    
    // Member of farmer group label and YES/NO
    updateFieldLabel('memberOfFarmerGroup', t('demographics.farmerGroupMember'));
    updateRadiosLang('memberOfFarmerGroup', {
        '0': t('common.no'),
        '1': t('common.yes')
    });
    
    // ===== UPDATE NAVIGATION BUTTONS =====
    const prevBtn = document.querySelector('#demoPrevBtn span');
    if (prevBtn) prevBtn.textContent = t('demographics.back');
    
    const nextBtn = document.querySelector('#demoNextBtn span');
    if (nextBtn) nextBtn.textContent = t('demographics.continue');
    
    const submitBtn = document.querySelector('#demoSubmitBtn span');
    if (submitBtn) submitBtn.textContent = t('demographics.continueRisk');
    
    console.log('✅ Demographics screen language updated - ALL options included!');
}



function updateFieldLabel(fieldName, text) {
    const input = document.querySelector(`[name="${fieldName}"]`) || document.getElementById(fieldName);
    if (!input) {
        console.warn(`⚠️ Field not found: ${fieldName}`);
        return;
    }
    
    const formGroup = input.closest('.form-group');
    if (!formGroup) return;
    
    const label = formGroup.querySelector('label:first-of-type');
    if (!label || label.querySelector('input') || label.querySelector('select')) return;
    
    const icon = label.querySelector('i');
    const req = label.querySelector('span[style*="red"]');
    const isRequired = input.hasAttribute('required');
    
    label.innerHTML = '';
    
    if (icon) {
        label.appendChild(icon);
        label.appendChild(document.createTextNode(' '));
    }
    
    label.appendChild(document.createTextNode(text));
    
    if (req || isRequired) {
        const reqSpan = document.createElement('span');
        reqSpan.style.color = 'red';
        reqSpan.textContent = ' *';
        label.appendChild(reqSpan);
    }
}






// ===== HELPER FUNCTIONS FOR SPECIFIC LABEL TYPES =====



function updateAssetLabel(name, text, emoji) {
    const checkbox = document.querySelector(`input[name="${name}"]`);
    if (!checkbox) {
        console.warn(`⚠️ Asset checkbox not found: ${name}`);
        return;
    }
    
    const label = checkbox.closest('label');
    if (!label) return;
    
    // Find or create the icon element
    let icon = label.querySelector('i');
    const iconHTML = icon ? icon.outerHTML : '';
    
    // Find the span with data-translate
    let span = label.querySelector('span[data-translate]');
    
    if (span) {
        // Just update the text content of existing span
        span.textContent = text;
    } else {
        // Rebuild the entire label structure
        label.innerHTML = '';
        label.appendChild(checkbox);
        label.appendChild(document.createTextNode(' '));
        
        if (iconHTML) {
            label.insertAdjacentHTML('beforeend', iconHTML);
            label.appendChild(document.createTextNode(' '));
        }
        
        span = document.createElement('span');
        span.setAttribute('data-translate', `demographics.${name.replace('asset_', '')}`);
        span.textContent = text;
        label.appendChild(span);
    }
    
    console.log(`✅ Updated asset: ${name}`);
}

function updateCropLabel(value, text, emoji) {
    const checkbox = document.querySelector(`input[name="crops"][value="${value}"]`);
    if (!checkbox) {
        console.warn(`⚠️ Crop checkbox not found: ${value}`);
        return;
    }
    
    const label = checkbox.closest('label');
    if (!label) return;
    
    // Find the span with data-translate
    let span = label.querySelector('span[data-translate]');
    
    if (span) {
        // Just update the text content of existing span
        span.textContent = text;
    } else {
        // Rebuild the entire label structure
        label.innerHTML = '';
        label.appendChild(checkbox);
        label.appendChild(document.createTextNode(' ' + emoji + ' '));
        
        span = document.createElement('span');
        span.setAttribute('data-translate', `demographics.${value}`);
        span.textContent = text;
        label.appendChild(span);
    }
    
    console.log(`✅ Updated crop: ${value}`);
}






function updateLivestockLabel(name, text, emoji) {
    const input = document.querySelector(`input[name="${name}"]`);
    if (!input) {
        console.warn(`⚠️ Livestock input not found: ${name}`);
        return;
    }
    
    const container = input.closest('div[style*="background: #f5f5f5"]');
    if (!container) return;
    
    const label = container.querySelector('label');
    if (!label) return;
    
    // Find the span with data-translate
    let span = label.querySelector('span[data-translate]');
    
    if (span) {
        // Just update the text content of existing span
        span.textContent = text;
    } else {
        // Rebuild with span
        label.innerHTML = `${emoji} `;
        
        span = document.createElement('span');
        span.setAttribute('data-translate', `demographics.${name.replace('livestock_', '')}`);
        span.textContent = text;
        label.appendChild(span);
        label.appendChild(document.createTextNode(':'));
    }
    
    console.log(`✅ Updated livestock: ${name}`);
}

function updateInputLabel(name, text, emoji) {
    const checkbox = document.querySelector(`input[name="${name}"]`);
    if (!checkbox) {
        console.warn(`⚠️ Input checkbox not found: ${name}`);
        return;
    }
    
    const label = checkbox.closest('label');
    if (!label) return;
    
    // Find the span with data-translate
    let span = label.querySelector('span[data-translate]');
    
    if (span) {
        // Just update the text content of existing span
        span.textContent = text;
    } else {
        // Rebuild the entire label structure
        label.innerHTML = '';
        label.appendChild(checkbox);
        label.appendChild(document.createTextNode(' ' + emoji + ' '));
        
        span = document.createElement('span');
        span.setAttribute('data-translate', `demographics.${name.replace('input_', '')}`);
        span.textContent = text;
        label.appendChild(span);
    }
    
    console.log(`✅ Updated input: ${name}`);
}






function updateShockLabel(name, text, emoji) {
    const checkbox = document.querySelector(`input[name="${name}"]`);
    if (!checkbox) {
        console.warn(`⚠️ Shock checkbox not found: ${name}`);
        return;
    }
    
    const label = checkbox.closest('label');
    if (!label) return;
    
    // Find the span with data-translate
    let span = label.querySelector('span[data-translate]');
    
    if (span) {
        // Just update the text content of existing span
        span.textContent = text;
    } else {
        // Rebuild the entire label structure
        label.innerHTML = '';
        label.appendChild(checkbox);
        label.appendChild(document.createTextNode(' ' + emoji + ' '));
        
        span = document.createElement('span');
        span.setAttribute('data-translate', `demographics.${name.replace('shock_', '')}`);
        span.textContent = text;
        label.appendChild(span);
    }
    
    console.log(`✅ Updated shock: ${name}`);
}


function updateBorrowSourceLabel(name, text, emoji) {
    const checkbox = document.querySelector(`input[name="${name}"]`);
    if (!checkbox) {
        console.warn(`⚠️ Borrow source checkbox not found: ${name}`);
        return;
    }
    
    const label = checkbox.closest('label');
    if (!label) return;
    
    // Rebuild the entire label structure
    label.innerHTML = '';
    label.appendChild(checkbox);
    label.appendChild(document.createTextNode(' ' + emoji + ' ' + text));
    
    console.log(`✅ Updated borrow source: ${name}`);
}

function updateTrustQuestionLabel(name, text) {
    const radio = document.querySelector(`input[name="${name}"]`);
    if (!radio) {
        console.warn(`⚠️ Trust question not found: ${name}`);
        return;
    }
    
    const formGroup = radio.closest('.form-group');
    if (!formGroup) return;
    
    const label = formGroup.querySelector('label:first-child');
    if (!label || label.querySelector('input')) return;
    
    label.innerHTML = text + ' <span style="color: red;">*</span>';
    
    console.log(`✅ Updated trust question: ${name}`);
}

function updateFieldLabel(fieldName, text) {
    const input = document.querySelector(`[name="${fieldName}"]`) || document.getElementById(fieldName);
    if (!input) {
        console.warn(`⚠️ Field not found: ${fieldName}`);
        return;
    }
    
    const formGroup = input.closest('.form-group');
    if (!formGroup) return;
    
    const label = formGroup.querySelector('label:first-of-type');
    if (!label || label.querySelector('input') || label.querySelector('select')) return;
    
    const icon = label.querySelector('i');
    const iconHTML = icon ? icon.outerHTML : '';
    const req = label.querySelector('span[style*="red"]');
    const isRequired = input.hasAttribute('required');
    
    label.innerHTML = '';
    
    if (iconHTML) {
        label.insertAdjacentHTML('beforeend', iconHTML);
        label.appendChild(document.createTextNode(' '));
    }
    
    label.appendChild(document.createTextNode(text));
    
    if (req || isRequired) {
        label.appendChild(document.createTextNode(' '));
        const reqSpan = document.createElement('span');
        reqSpan.style.color = 'red';
        reqSpan.textContent = '*';
        label.appendChild(reqSpan);
    }
    
    console.log(`✅ Updated field label: ${fieldName}`);
}

function updateSelectLang(selectId, options) {
    const select = document.getElementById(selectId) || document.querySelector(`[name="${selectId}"]`);
    if (!select) {
        console.warn(`⚠️ Select not found: ${selectId}`);
        return;
    }
    
    const currentValue = select.value;
    select.innerHTML = '';
    
    options.forEach(opt => {
        const option = document.createElement('option');
        option.value = opt.value;
        option.textContent = opt.text;
        if (opt.disabled) option.disabled = true;
        select.appendChild(option);
    });
    
    select.value = currentValue;
    console.log(`✅ Updated select: ${selectId} (${options.length} options)`);
}

function updateRadiosLang(name, valueTextMap) {
    const radios = document.querySelectorAll(`input[type="radio"][name="${name}"]`);
    if (radios.length === 0) {
        console.warn(`⚠️ Radio group not found: ${name}`);
        return;
    }
    
    radios.forEach(radio => {
        const label = radio.closest('label');
        if (label && valueTextMap[radio.value] !== undefined) {
            // Preserve the radio input, update only the text
            label.innerHTML = '';
            label.appendChild(radio);
            label.appendChild(document.createTextNode(' ' + valueTextMap[radio.value]));
        }
    });
    console.log(`✅ Updated radio group: ${name} (${radios.length} options)`);
}

function updateCheckboxesLang(name, valueTextMap) {
    document.querySelectorAll(`input[name="${name}"]`).forEach(cb => {
        const label = cb.closest('label');
        if (label && valueTextMap[cb.value]) {
            // Find span with data-translate
            const span = label.querySelector('span[data-translate]');
            if (span) {
                span.textContent = valueTextMap[cb.value];
            } else {
                // Preserve the checkbox and icon, update only the text
                const icon = label.querySelector('i');
                const iconHTML = icon ? icon.outerHTML : '';
                const textNode = Array.from(label.childNodes).find(node => node.nodeType === 3);
                
                label.innerHTML = '';
                label.appendChild(cb);
                label.appendChild(document.createTextNode(' '));
                if (iconHTML) {
                    label.insertAdjacentHTML('beforeend', iconHTML);
                    label.appendChild(document.createTextNode(' '));
                }
                label.appendChild(document.createTextNode(valueTextMap[cb.value]));
            }
        }
    });
}



function updateTrustQuestionLabel(name, text) {
    const radio = document.querySelector(`input[name="${name}"]`);
    if (!radio) return;
    
    const formGroup = radio.closest('.form-group');
    if (formGroup) {
        const label = formGroup.querySelector('label:first-child');
        if (label) {
            label.innerHTML = text + ' <span style="color: red;">*</span>';
        }
    }
}



// Add to your game.js
// ===== CONNECTION STATUS MANAGEMENT =====
// ===== CONNECTION STATUS MANAGEMENT =====
// ===== CONNECTION STATUS MANAGEMENT =====
// ===== SIMPLIFIED CONNECTION STATUS (NO AUTO-SYNC) =====
// ===== CONNECTION STATUS MANAGEMENT =====
function updateConnectionStatus() {
    const statusEl = document.getElementById('connectionStatus');
    const statusText = document.getElementById('statusText');
    const syncBtn = document.getElementById('syncButton');
    const exportBtn = document.getElementById('exportButton');
    
    if (!statusEl || !statusText) return;
    
    const isOnline = navigator.onLine;
    const syncStatus = window.offlineStorage.getSyncStatus();
    const pendingItems = syncStatus.pendingItems;
    
    console.log('🔄 Connection Status Update:', {
        isOnline,
        pendingItems,
        syncBtnExists: !!syncBtn
    });
    
    // Update online/offline status
    if (isOnline) {
        statusEl.className = 'connection-status status-online';
        statusText.innerHTML = `
            <i class="fas fa-circle"></i>
            <span>Online</span>
        `;
    } else {
        statusEl.className = 'connection-status status-offline';
        statusText.innerHTML = `
            <i class="fas fa-circle"></i>
            <span>Offline</span>
        `;
    }
    
    // Show/hide sync button based on pending items
    if (syncBtn) {
        if (pendingItems > 0 && isOnline) {
            syncBtn.style.display = 'flex';
            syncBtn.innerHTML = `
                <i class="fas fa-sync-alt"></i>
                <span>Sync ${pendingItems} item${pendingItems > 1 ? 's' : ''}</span>
            `;
            console.log('✅ Sync button shown');
        } else if (pendingItems > 0 && !isOnline) {
            syncBtn.style.display = 'flex';
            syncBtn.disabled = true;
            syncBtn.innerHTML = `
                <i class="fas fa-wifi-slash"></i>
                <span>${pendingItems} pending (offline)</span>
            `;
            console.log('⚠️ Sync button shown but disabled (offline)');
        } else {
            syncBtn.style.display = 'none';
            console.log('❌ Sync button hidden (no pending items)');
        }
    }
    
    // Show/hide export button
    if (exportBtn) {
        if (pendingItems > 0) {
            exportBtn.style.display = 'flex';
        } else {
            exportBtn.style.display = 'none';
        }
    }
}



// ===== UPDATE WELCOME SCREEN SYNC STATUS =====
function updateWelcomeSyncStatus() {
    const syncCard = document.querySelector('.welcome-sync-section .sync-card');
    const syncTitle = document.getElementById('welcomeSyncTitle');
    const syncMessage = document.getElementById('welcomeSyncMessage');
    const syncStatusBox = document.getElementById('welcomeSyncStatus');
    const syncBtn = document.getElementById('welcomeSyncBtn');
    
    if (!syncCard || !syncStatusBox || !syncBtn) {
        console.warn('⚠️ Welcome sync elements not found');
        return;
    }
    
    const syncStatus = window.offlineStorage.getSyncStatus();
    const isOnline = syncStatus.isOnline;
    const pendingItems = syncStatus.pendingItems;
    
    console.log('📊 Welcome Sync Status:', { isOnline, pendingItems });
    
    // Reset classes
    syncCard.className = 'sync-card';
    
    if (!isOnline) {
        // OFFLINE
        syncCard.classList.add('offline');
        syncTitle.textContent = 'You Are Offline';
        syncMessage.textContent = 'Connect to internet to upload data to server';
        syncStatusBox.innerHTML = '<i class="fas fa-wifi-slash"></i><span>No Internet Connection</span>';
        syncBtn.disabled = true;
        syncBtn.innerHTML = '<i class="fas fa-wifi-slash"></i><span>Cannot Upload (Offline)</span>';
    } else if (pendingItems > 0) {
        // HAS DATA TO SYNC
        syncCard.classList.add('has-data');
        syncTitle.textContent = 'Data Ready to Upload';
        syncMessage.textContent = `You have ${pendingItems} game${pendingItems > 1 ? 's' : ''} waiting to be uploaded to the server`;
        syncStatusBox.innerHTML = `<i class="fas fa-exclamation-triangle"></i><span>${pendingItems} item${pendingItems > 1 ? 's' : ''} pending</span>`;
        syncBtn.disabled = false;
        syncBtn.innerHTML = '<i class="fas fa-cloud-upload-alt"></i><span>Upload Now</span>';
    } else {
        // ALL SYNCED
        syncCard.classList.add('all-synced');
        syncTitle.textContent = 'All Data Uploaded';
        syncMessage.textContent = 'No pending data to upload';
        syncStatusBox.innerHTML = '<i class="fas fa-check-circle"></i><span>Everything Synced</span>';
        syncBtn.disabled = true;
        syncBtn.innerHTML = '<i class="fas fa-check"></i><span>Nothing to Upload</span>';
    }
}

// ===== SYNC FROM WELCOME SCREEN =====
async function syncFromWelcome() {
    const syncBtn = document.getElementById('welcomeSyncBtn');
    const syncCard = document.querySelector('.welcome-sync-section .sync-card');
    const syncStatusBox = document.getElementById('welcomeSyncStatus');
    
    if (!syncBtn) return;
    
    try {
        // Check if online
        if (!navigator.onLine) {
            showToast('📴 You are offline. Connect to internet to upload data.', 'warning');
            return;
        }
        
        // Get sync status
        const syncStatus = window.offlineStorage.getSyncStatus();
        
        if (syncStatus.pendingItems === 0) {
            showToast('✅ No data to upload', 'info');
            return;
        }
        
        console.log('🔄 Starting sync from welcome screen...');
        
        // Update UI to show syncing
        syncBtn.disabled = true;
        syncBtn.className = 'sync-action-btn syncing';
        syncBtn.innerHTML = '<i class="fas fa-sync-alt"></i><span>Uploading...</span>';
        syncStatusBox.innerHTML = '<i class="fas fa-sync-alt fa-spin"></i><span>Uploading...</span>';
        
        // Perform sync
        const result = await window.offlineStorage.syncOfflineData();
        
        console.log('✅ Sync result:', result);
        
        if (result.success && result.results) {
            if (result.results.successful > 0) {
                showToast(`✅ Successfully uploaded ${result.results.successful} item${result.results.successful > 1 ? 's' : ''}!`, 'success');
            }
            
            if (result.results.failed > 0) {
                showToast(`⚠️ ${result.results.failed} item${result.results.failed > 1 ? 's' : ''} failed to upload`, 'warning');
            }
        }
        
        // Update UI
        setTimeout(() => {
            updateWelcomeSyncStatus();
            updateConnectionStatus();
        }, 1000);
        
    } catch (error) {
        console.error('❌ Sync error:', error);
        showToast('❌ Upload failed: ' + error.message, 'error');
        
        // Reset button
        syncBtn.disabled = false;
        syncBtn.className = 'sync-action-btn';
        syncBtn.innerHTML = '<i class="fas fa-sync-alt"></i><span>Try Again</span>';
    }
}

// ===== UPDATE RESULTS SCREEN SYNC STATUS =====
function updateResultsSyncStatus() {
    const syncCard = document.querySelector('.results-sync-section .sync-card');
    const syncTitle = document.getElementById('resultsSyncTitle');
    const syncMessage = document.getElementById('resultsSyncMessage');
    const syncStatusBox = document.getElementById('resultsSyncStatus');
    const syncBtn = document.getElementById('resultsSyncBtn');
    
    if (!syncCard || !syncStatusBox || !syncBtn) {
        console.warn('⚠️ Results sync elements not found');
        return;
    }
    
    const syncStatus = window.offlineStorage.getSyncStatus();
    const isOnline = syncStatus.isOnline;
    const pendingItems = syncStatus.pendingItems;
    
    console.log('📊 Results Sync Status:', { isOnline, pendingItems });
    
    // Reset classes
    syncCard.className = 'sync-card';
    
    if (!isOnline) {
        // OFFLINE
        syncCard.classList.add('offline');
        syncTitle.textContent = 'You Are Offline';
        syncMessage.textContent = 'This game data is saved on this device. Connect to internet to upload to server.';
        syncStatusBox.innerHTML = '<i class="fas fa-wifi-slash"></i><span>No Internet Connection</span>';
        syncBtn.disabled = true;
        syncBtn.innerHTML = '<i class="fas fa-wifi-slash"></i><span>Cannot Upload (Offline)</span>';
    } else if (pendingItems > 0) {
        // HAS DATA TO SYNC
        syncCard.classList.add('has-data');
        syncTitle.textContent = '⚠️ Data Not Uploaded Yet';
        syncMessage.textContent = `This game data is saved locally. Upload now to ensure it's backed up to the server.`;
        syncStatusBox.innerHTML = `<i class="fas fa-exclamation-triangle"></i><span>${pendingItems} item${pendingItems > 1 ? 's' : ''} pending</span>`;
        syncBtn.disabled = false;
        syncBtn.innerHTML = '<i class="fas fa-cloud-upload-alt"></i><span>Upload Game Data Now</span>';
    } else {
        // ALL SYNCED
        syncCard.classList.add('all-synced');
        syncTitle.textContent = '✅ Data Uploaded Successfully';
        syncMessage.textContent = 'This game data has been uploaded to the server';
        syncStatusBox.innerHTML = '<i class="fas fa-check-circle"></i><span>Backed Up to Server</span>';
        syncBtn.disabled = true;
        syncBtn.innerHTML = '<i class="fas fa-check"></i><span>Already Uploaded</span>';
    }
}

// ===== SYNC FROM RESULTS SCREEN =====
async function syncFromResults() {
    const syncBtn = document.getElementById('resultsSyncBtn');
    const syncStatusBox = document.getElementById('resultsSyncStatus');
    
    if (!syncBtn) return;
    
    try {
        // Check if online
        if (!navigator.onLine) {
            showToast('📴 You are offline. Connect to internet to upload data.', 'warning');
            return;
        }
        
        // Get sync status
        const syncStatus = window.offlineStorage.getSyncStatus();
        
        if (syncStatus.pendingItems === 0) {
            showToast('✅ No data to upload', 'info');
            return;
        }
        
        console.log('🔄 Starting sync from results screen...');
        
        // Update UI to show syncing
        syncBtn.disabled = true;
        syncBtn.className = 'sync-action-btn syncing';
        syncBtn.innerHTML = '<i class="fas fa-sync-alt"></i><span>Uploading...</span>';
        syncStatusBox.innerHTML = '<i class="fas fa-sync-alt fa-spin"></i><span>Uploading...</span>';
        
        // Perform sync
        const result = await window.offlineStorage.syncOfflineData();
        
        console.log('✅ Sync result:', result);
        
        if (result.success && result.results) {
            if (result.results.successful > 0) {
                showToast(`✅ Successfully uploaded ${result.results.successful} item${result.results.successful > 1 ? 's' : ''}!`, 'success');
            }
            
            if (result.results.failed > 0) {
                showToast(`⚠️ ${result.results.failed} item${result.results.failed > 1 ? 's' : ''} failed to upload`, 'warning');
            }
        }
        
        // Update UI
       // Initial connection status check with delay
setTimeout(() => {
    updateConnectionStatus();
    updateWelcomeSyncStatus();
 
}, 500);

// Also update on visibility change
document.addEventListener('visibilitychange', function() {
    if (!document.hidden) {
        updateConnectionStatus();
        if (document.getElementById('welcomeScreen').classList.contains('active')) {
            updateWelcomeSyncStatus();
        }
        if (document.getElementById('resultsScreen').classList.contains('active')) {
            updateResultsSyncStatus();
        }
    }
});


        
    } catch (error) {
        console.error('❌ Sync error:', error);
        showToast('❌ Upload failed: ' + error.message, 'error');
        
        // Reset button
        syncBtn.disabled = false;
        syncBtn.className = 'sync-action-btn';
        syncBtn.innerHTML = '<i class="fas fa-sync-alt"></i><span>Try Again</span>';
    }
}







// ===== CHECK FOR PENDING SYNC ON WELCOME SCREEN =====
function checkWelcomeScreenSync() {
    console.log('🏠 Checking for pending sync on welcome screen...');
    
    const syncStatus = window.offlineStorage.getSyncStatus();
    
    if (syncStatus.pendingItems > 0) {
        console.log(`⚠️ Found ${syncStatus.pendingItems} pending items on welcome screen`);
        
        // Check if notice already exists
        let syncNotice = document.getElementById('welcomeSyncNotice');
        
        if (!syncNotice) {
            // Create notice
            const welcomeScreen = document.getElementById('welcomeScreen');
            const startBtn = document.getElementById('startBtn');
            
            if (welcomeScreen && startBtn) {
                syncNotice = document.createElement('div');
                syncNotice.id = 'welcomeSyncNotice';
                syncNotice.style.cssText = `
                    background: linear-gradient(135deg, #FF9800, #F57C00);
                    color: white;
                    padding: 25px;
                    border-radius: 15px;
                    margin: 30px auto;
                    max-width: 600px;
                    text-align: center;
                    box-shadow: 0 8px 20px rgba(255, 152, 0, 0.3);
                    animation: pulse 2s ease-in-out infinite;
                `;
                
                syncNotice.innerHTML = `
                    <div style="font-size: 48px; margin-bottom: 15px;">
                        <i class="fas fa-exclamation-triangle"></i>
                    </div>
                    <h3 style="margin: 0 0 15px 0; font-size: 24px; font-weight: 700;">
                        ⚠️ Unsynced Data Found!
                    </h3>
                    <p style="margin: 0 0 20px 0; font-size: 18px; line-height: 1.6;">
                        You have <strong>${syncStatus.pendingItems} items</strong> saved on this device that haven't been uploaded to the server yet.
                        <br><br>
                        <strong>Please upload before starting a new game!</strong>
                    </p>
                    <button onclick="manualSync()" class="btn-primary btn-large" style="background: white; color: #F57C00; border: none; box-shadow: 0 4px 15px rgba(0,0,0,0.2); margin-bottom: 15px;">
                        <i class="fas fa-sync-alt"></i>
                        <span>Upload ${syncStatus.pendingItems} Items to Server</span>
                        <i class="fas fa-arrow-right"></i>
                    </button>
                    <p style="margin: 0; font-size: 14px; opacity: 0.9;">
                        <i class="fas fa-info-circle"></i> You can also click "Sync Now" in the top-right corner anytime
                    </p>
                `;
                
                // Insert before start button
                startBtn.parentNode.insertBefore(syncNotice, startBtn);
                console.log('✅ Welcome screen sync notice created');
            }
        }
    } else {
        // Remove notice if no pending items
        const existingNotice = document.getElementById('welcomeSyncNotice');
        if (existingNotice) {
            existingNotice.remove();
            console.log('✅ Removed welcome screen sync notice (no pending data)');
        }
    }
}




async function manualSync() {
    const syncBtn = document.getElementById('syncButton');
    const statusEl = document.getElementById('connectionStatus');
    const statusText = document.getElementById('statusText');
    
    if (!syncBtn || !statusEl || !statusText) {
        console.error('❌ Sync UI elements not found!');
        alert('Sync button not found. Please refresh the page.');
        return;
    }
    
    try {
        console.log('🔄 Starting manual sync...');
        
        // Update UI to show syncing
        statusEl.className = 'connection-status status-syncing';
        statusText.innerHTML = `
            <i class="fas fa-sync-alt fa-spin"></i>
            <span>Syncing...</span>
        `;
        syncBtn.disabled = true;
        syncBtn.innerHTML = '<i class="fas fa-sync-alt fa-spin"></i><span>Syncing...</span>';
        
        // Perform sync
        const result = await window.offlineStorage.syncOfflineData();
        
        if (result.success) {
            console.log('✅ Sync completed:', result);
            
            // Success feedback
            statusText.innerHTML = `
                <i class="fas fa-check-circle"></i>
                <span>Sync Complete!</span>
            `;
            
            // Show detailed results
            if (result.results) {
                console.log('📊 Sync results:', result.results);
                
                if (result.results.successful > 0) {
                    showToast(`✅ Successfully synced ${result.results.successful} item${result.results.successful > 1 ? 's' : ''}!`, 'success');
                }
                
                if (result.results.failed > 0) {
                    showToast(`⚠️ ${result.results.failed} item${result.results.failed > 1 ? 's' : ''} failed to sync. Check console for details.`, 'warning');
                    console.error('Failed items:', result.results.errors);
                }
                
                if (result.results.successful === 0 && result.results.failed === 0) {
                    showToast('ℹ️ No items to sync', 'info');
                }
            } else {
                showToast('✅ Data synced successfully!', 'success');
            }
            
            // Reset UI after 2 seconds
            setTimeout(() => {
                updateConnectionStatus();
                updateWelcomeSyncStatus();
             
            }, 2000);
        } else {
            throw new Error(result.message || 'Sync failed');
        }
    } catch (error) {
        console.error('❌ Sync error:', error);
        statusText.innerHTML = `
            <i class="fas fa-exclamation-triangle"></i>
            <span>Sync Failed</span>
        `;
        showToast('❌ Failed to sync data: ' + error.message, 'error');
        
        // Reset UI after 3 seconds
        setTimeout(() => {
            updateConnectionStatus();
        }, 3000);
    } finally {
        syncBtn.disabled = false;
    }
}





// ===== DEBUG: CHECK OFFLINE DATA =====
// ===== DEBUG: CHECK OFFLINE DATA =====
function checkOfflineData() {
    console.log('');
    console.log('📦 ========================================');
    console.log('📦 OFFLINE DATA CHECK');
    console.log('📦 ========================================');
    
    const data = localStorage.getItem('farm_game_offline_data');
    if (data) {
        const parsed = JSON.parse(data);
        console.log('📊 Offline Data Summary:', {
            deviceId: parsed.deviceId,
            respondents: parsed.respondents?.length || 0,
            sessions: parsed.sessions?.length || 0,
            rounds: parsed.rounds?.length || 0,
            knowledge: parsed.knowledge?.length || 0,
            perception: parsed.perception?.length || 0,
            pendingSync: parsed.pending_sync?.length || 0,
            lastSyncAttempt: parsed.lastSyncAttempt
        });
        
        if (parsed.pending_sync && parsed.pending_sync.length > 0) {
            console.log('📤 Pending sync items:');
            parsed.pending_sync.forEach((item, index) => {
                console.log(`  ${index + 1}. ${item.type} - ${item.synced ? '✅ Synced' : '⏳ Pending'}`);
                console.log(`     Endpoint: ${item.endpoint}`);
                console.log(`     Method: ${item.method}`);
                console.log(`     Timestamp: ${item.timestamp}`);
            });
        } else {
            console.log('✅ No pending items');
        }
        
        return parsed;
    } else {
        console.log('❌ No offline data found');
        return null;
    }
}

// Make it available globally for console debugging
window.checkOfflineData = checkOfflineData;




// ===== AUTO-SYNC WHEN COMING BACK ONLINE =====
// ===== AUTO-SYNC WHEN COMING BACK ONLINE =====




// function setupAutoSync() {
//     console.log('🔧 Setting up auto-sync listeners...');
    
//     window.addEventListener('online', async function() {
//         console.log('');
//         console.log('🌐 ========================================');
//         console.log('🌐 CONNECTION RESTORED!');
//         console.log('🌐 ========================================');
        
//         // Update UI immediately
//         updateConnectionStatus();
        
//         // Wait 2 seconds for connection to stabilize
//         console.log('⏳ Waiting 2 seconds for connection to stabilize...');
//         await new Promise(resolve => setTimeout(resolve, 2000));
        
//         const syncStatus = window.offlineStorage.getSyncStatus();
//         console.log('📊 Sync status after reconnection:', syncStatus);
        
//         if (syncStatus.pendingItems > 0) {
//             console.log(`📤 AUTO-SYNCING ${syncStatus.pendingItems} items...`);
            
//             const statusText = document.getElementById('statusText');
//             if (statusText) {
//                 statusText.innerHTML = '<i class="fas fa-sync-alt fa-spin"></i> Auto-syncing...';
//             }
            
//             try {
//                 const result = await window.offlineStorage.syncOfflineData();
                
//                 console.log('✅ Auto-sync result:', result);
                
//                 if (result.success && result.results) {
//                     if (result.results.successful > 0) {
//                         showToast(`✅ Auto-synced ${result.results.successful} items to database!`, 'success');
//                     }
                    
//                     if (result.results.failed > 0) {
//                         showToast(`⚠️ ${result.results.failed} items failed. Click "Sync Now" to retry.`, 'warning');
//                         console.error('❌ Failed items:', result.results.errors);
//                     }
//                 }
                
//                 updateConnectionStatus();
//             } catch (error) {
//                 console.error('❌ Auto-sync failed:', error);
//                 showToast('⚠️ Auto-sync failed. Click "Sync Now" to retry.', 'warning');
//                 updateConnectionStatus();
//             }
//         } else {
//             console.log('✅ No pending items to sync');
//         }
//     });
    
//     window.addEventListener('offline', function() {
//         console.log('');
//         console.log('📴 ========================================');
//         console.log('📴 CONNECTION LOST - OFFLINE MODE');
//         console.log('📴 ========================================');
//         updateConnectionStatus();
//     });
    
//     console.log('✅ Auto-sync listeners registered');
// }




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



// ===== LOAD COMMUNITIES =====
// ===== LOAD COMMUNITIES WITH OFFLINE SUPPORT =====

// ===== LOAD COMMUNITIES WITH OFFLINE SUPPORT =====

async function loadCommunities() {
  try {
    console.log('📋 Loading communities...');
    
    const select = document.getElementById('communityName');
    if (!select) {
      console.error('❌ Could not find communityName select element!');
      return;
    }
    
    // Show loading state
    select.innerHTML = '<option value="">Loading communities...</option>';
    select.disabled = true;
    
    let communities = [];
    
    try {
      // Try to fetch from API (works both online and offline)
      const response = await apiCall('/communities'); // ✅ Changed from /admin/communities
      communities = response || [];
      
      if (communities && communities.length > 0) {
        console.log(`✅ Loaded ${communities.length} communities from API`);
      } else {
        throw new Error('No communities returned from API');
      }
    } catch (error) {
      console.warn('⚠️ Could not load from API, using fallback:', error.message);
      communities = getDefaultCommunities();
      console.log(`📋 Using default communities list (${communities.length} communities)`);
    }
    
    // Populate the select
    if (communities.length > 0) {
      select.innerHTML = '<option value="">-- Select Community --</option>';
      
      // Sort and group by district
      const sorted = communities.sort((a, b) => {
        if (a.district !== b.district) {
          return a.district.localeCompare(b.district);
        }
        return a.communityName.localeCompare(b.communityName);
      });
      
      let currentOptgroup = null;
      let currentDistrict = '';
      
      sorted.forEach(community => {
        if (community.district !== currentDistrict) {
          currentDistrict = community.district;
          currentOptgroup = document.createElement('optgroup');
          currentOptgroup.label = community.district;
          select.appendChild(currentOptgroup);
        }
        
        const option = document.createElement('option');
        option.value = community.communityName;
        option.textContent = community.communityName;
        option.setAttribute('data-treatment', community.treatmentGroup);
        currentOptgroup.appendChild(option);
      });
      
      console.log(`✅ Successfully populated ${communities.length} communities`);
    } else {
      select.innerHTML = '<option value="">Error: No communities available</option>';
      console.error('❌ No communities available!');
    }
    
    select.disabled = false;
    
  } catch (error) {
    console.error('❌ Critical error loading communities:', error);
    const select = document.getElementById('communityName');
    if (select) {
      select.innerHTML = '<option value="">Error loading communities</option>';
      select.disabled = false;
    }
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


// ===== MULTI-STEP DEMOGRAPHICS NAVIGATION =====
// ===== MULTI-STEP DEMOGRAPHICS NAVIGATION =====

// Total steps in the entire pre-game process
const TOTAL_STEPS = 13; // 15 demographics + 1 risk + 1 empowerment + 1 tutorial
const DEMOGRAPHICS_PAGES = 10;

let currentStep = 1; // Global step counter (1-18)
let currentDemoPage = 1; // Demographics page counter (1-15)


// In risk form handler:
const SECOND_PARTNER_TOTAL_STEPS = 4; // demographics, risk, empowerment, tutorial

// Update progress based on partner
const totalSteps = gameState.isSecondPartner ? SECOND_PARTNER_TOTAL_STEPS : TOTAL_STEPS;
const nextStep = gameState.isSecondPartner ? 3 : 12;

currentStep = nextStep;
updateGlobalProgress(currentStep, totalSteps);



function updateGlobalProgress(stepNumber, totalSteps) {
    console.log(`📊 Progress: Step ${stepNumber} of ${totalSteps}`);
    
    const percentage = (stepNumber / totalSteps) * 100;
    
    // Update all progress bars on current screen
    const progressBars = document.querySelectorAll('.progress-fill');
    progressBars.forEach(bar => {
        bar.style.width = `${percentage}%`;
    });
    
    // Update all progress texts
    const progressTexts = document.querySelectorAll('.progress-text');
    progressTexts.forEach(text => {
        const lang = gameState.language || 'english';
        const stepWord = t('progress.step');
        const ofWord = t('progress.of');
        text.textContent = `${stepWord} ${stepNumber} ${ofWord} ${totalSteps}`;
    });
}

// ===== UPDATE ALL PROGRESS BARS =====
function updateGlobalProgress(stepNumber, totalSteps = TOTAL_STEPS) {
    const percentage = (stepNumber / totalSteps) * 100;
    
    // Update all progress bars on current screen
    const progressBars = document.querySelectorAll('.progress-fill');
    progressBars.forEach(bar => {
        bar.style.width = `${percentage}%`;
    });
    
    // Update all progress texts
    const progressTexts = document.querySelectorAll('.progress-text');
    progressTexts.forEach(text => {
        text.textContent = `Step ${stepNumber} of ${totalSteps}`;
    });
}

// ===== DEMOGRAPHICS MULTI-PAGE NAVIGATION =====
function showDemoPage(pageNum) {
    console.log(`📄 Showing demo page ${pageNum} of ${DEMOGRAPHICS_PAGES}`);
    
    // Validate page number
    if (pageNum < 1 || pageNum > DEMOGRAPHICS_PAGES) {
        console.error(`Invalid page number: ${pageNum}`);
        return;
    }
    
    // AGGRESSIVE SCROLL RESET - Multiple methods
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
    window.pageYOffset = 0;
    
    // Hide all demo pages
    document.querySelectorAll('.demo-page').forEach(page => {
        page.classList.remove('active');
        page.scrollTop = 0;
    });
    
    // Show current page
    const currentPage = document.getElementById(`demoPage${pageNum}`);
    
    if (currentPage) {
        currentPage.scrollTop = 0;
        currentPage.style.overflow = 'auto';
        currentPage.classList.add('active');
        
        // Update guidance for second partner on page 1
        if (pageNum === 1 && gameState.firstRespondentId) {
            updateSecondPartnerGuidance();
        }
        
        console.log(`✅ Page ${pageNum} activated`);
    } else {
        console.error(`❌ Page element not found: demoPage${pageNum}`);
    }
    
    // Update global step
    currentStep = pageNum;
    updateGlobalProgress(currentStep, TOTAL_STEPS);
    
    // Navigation buttons visibility
    const prevBtn = document.getElementById('demoPrevBtn');
    const nextBtn = document.getElementById('demoNextBtn');
    const submitBtn = document.getElementById('demoSubmitBtn');
    
    if (prevBtn) {
        prevBtn.style.display = pageNum === 1 ? 'none' : 'flex';
    }
    
    if (nextBtn && submitBtn) {
        if (pageNum === DEMOGRAPHICS_PAGES) {
            nextBtn.style.display = 'none';
            submitBtn.style.display = 'flex';
        } else {
            nextBtn.style.display = 'flex';
            submitBtn.style.display = 'none';
        }
    }
    
    const topBackBtn = document.getElementById('demoTopBackBtn');
    if (topBackBtn) {
        topBackBtn.style.display = pageNum > 1 ? 'flex' : 'none';
    }
    
    // Force multiple scroll resets
    setTimeout(() => {
        window.scrollTo(0, 0);
        document.documentElement.scrollTop = 0;
        document.body.scrollTop = 0;
        if (currentPage) currentPage.scrollTop = 0;
    }, 0);
    
    requestAnimationFrame(() => {
        window.scrollTo(0, 0);
        document.documentElement.scrollTop = 0;
        document.body.scrollTop = 0;
        if (currentPage) currentPage.scrollTop = 0;
    });
    
    setTimeout(() => {
        window.scrollTo(0, 0);
        document.documentElement.scrollTop = 0;
        document.body.scrollTop = 0;
        if (currentPage) currentPage.scrollTop = 0;
    }, 50);
    
    const isSecondPartner = document.querySelector('input[data-second-partner-hidden]') !== null;
    console.log('📊 Page state:', {
        current: pageNum,
        total: DEMOGRAPHICS_PAGES,
        isSecondPartner: isSecondPartner,
        backVisible: prevBtn ? prevBtn.style.display !== 'none' : false,
        nextVisible: nextBtn ? nextBtn.style.display !== 'none' : false,
        submitVisible: submitBtn ? submitBtn.style.display !== 'none' : false
    });
}










function validateCurrentDemoPage() {
    const currentPage = document.getElementById(`demoPage${currentDemoPage}`);
    if (!currentPage) {
        console.warn('⚠️ Current page not found:', currentDemoPage);
        return true;
    }
    
    let allValid = true;
    let firstInvalidField = null;
    
    console.log(`🔍 Validating page ${currentDemoPage}...`);
    
    // SPECIAL: Validate crops checkboxes on page 5
    if (currentDemoPage === 5) {
        const cropsCheckboxes = currentPage.querySelectorAll('input[name="crops"]');
        const anyChecked = Array.from(cropsCheckboxes).some(cb => cb.checked);
        const cropsError = document.getElementById('cropsError');
        
        if (!anyChecked) {
            console.warn('❌ No crops selected');
            allValid = false;
            if (cropsError) {
                cropsError.style.display = 'block';
            }
            if (!firstInvalidField) {
                firstInvalidField = document.getElementById('cropsCheckboxGroup');
            }
        } else {
            console.log('✅ Crops validated');
            if (cropsError) {
                cropsError.style.display = 'none';
            }
        }
    }
    
    // Get all required fields on current page
    const requiredFields = currentPage.querySelectorAll('[required]');
    console.log(`📋 Found ${requiredFields.length} required fields on page ${currentDemoPage}`);
    
    requiredFields.forEach(field => {
        if (field.type === 'checkbox' || field.type === 'radio') {
            // For checkbox/radio groups, check if at least one is checked
            const name = field.name;
            const group = currentPage.querySelectorAll(`[name="${name}"]`);
            const anyChecked = Array.from(group).some(input => input.checked);
            
            if (!anyChecked) {
                console.warn('❌ No option selected for:', name);
                allValid = false;
                if (!firstInvalidField) {
                    firstInvalidField = field;
                }
            }
        } else {
            // Regular input validation
            if (!field.checkValidity()) {
                console.warn('❌ Invalid field:', field.name, '| Value:', field.value);
                allValid = false;
                if (!firstInvalidField) {
                    firstInvalidField = field;
                }
            }
        }
    });
    
    if (!allValid && firstInvalidField) {
        console.log('⚠️ Validation failed - scrolling to first invalid field');
        firstInvalidField.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'center' 
        });
        
        setTimeout(() => {
            firstInvalidField.focus();
            if (firstInvalidField.reportValidity) {
                firstInvalidField.reportValidity();
            }
        }, 300);
    } else {
        console.log('✅ Page validation passed');
    }
    
    return allValid;
}


// 5. Save progress when moving between screens
    const originalShowScreen = window.showScreen;
    window.showScreen = function(screenId) {
        saveGameProgress();
        originalShowScreen(screenId);
    };
    
    // 6. Clear saved progress on successful completion
    window.clearGameProgress = function() {
        sessionStorage.removeItem('game_progress');
        hasUnsavedData = false;
        console.log('✅ Game progress cleared');
    };
    
    // 7. Restore progress on page load
    restoreGameProgress();
    
    console.log('✅ Data loss prevention activated');

// Add navigation button listeners in DOMContentLoaded
// ===== EVENT LISTENERS =====
// ===== EVENT LISTENERS =====
// ===== CONSOLIDATED DOMContentLoaded - MANUAL SYNC ONLY =====
document.addEventListener('DOMContentLoaded', function() {
    console.log('🎮 Weather Index Insurance Game Loaded');
    console.log(`📋 Total steps: ${TOTAL_STEPS}`);
    console.log(`📄 Demographics pages: ${DEMOGRAPHICS_PAGES}`);

setTimeout(() => {
    if (document.getElementById('welcomeScreen').classList.contains('active')) {
        console.log('📊 Initializing welcome screen sync status...');
        updateWelcomeSyncStatus();
    }
}, 500);

// Also update when coming back online
// ===== FORCE UI REFRESH WHEN COMING ONLINE =====
window.addEventListener('online', function() {
    console.log('🌐 Connection restored - Refreshing UI...');
    
    // Wait a moment for connection to stabilize
    setTimeout(() => {
        // Force refresh all status indicators
        updateConnectionStatus();
        updateWelcomeSyncStatus();
        
        // If on results screen, update that too
        const resultsScreen = document.getElementById('resultsScreen');
        if (resultsScreen && resultsScreen.classList.contains('active')) {
            updateResultsSyncStatus();
        }
        
        console.log('✅ UI refreshed - Sync buttons should now be enabled');
    }, 500);
});




    window.addEventListener('offline', function() {
        console.log('📴 Offline mode');
        updateConnectionStatus();
        showToast('📴 You are offline. Data will be saved locally.', 'info');
    });
    
    // Initial connection status check
     updateConnectionStatus();


    // ===== WELCOME SCREEN =====
    const startBtn = document.getElementById('startBtn');
    if (startBtn) {
        startBtn.addEventListener('click', startDemographics);
        console.log('✅ Start button listener registered');
    }

    // ===== DEMOGRAPHICS NAVIGATION =====
    // Clone buttons to remove any existing listeners
    const nextBtn = document.getElementById('demoNextBtn');
    const prevBtn = document.getElementById('demoPrevBtn');

if (nextBtn) {
    // Remove old listeners by cloning
    const newNextBtn = nextBtn.cloneNode(true);
    nextBtn.parentNode.replaceChild(newNextBtn, nextBtn);
    
    newNextBtn.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        
        console.log(`▶️ Next clicked. Current page: ${currentDemoPage}`);
        
        if (validateCurrentDemoPage()) {
            if (currentDemoPage < DEMOGRAPHICS_PAGES) {
                let newPage = currentDemoPage + 1;
                
                // ✅ CHECK IF SECOND PARTNER AND SKIP PAGES 3 & 6
                const isSecondPartner = document.querySelector('input[data-second-partner-hidden]') !== null;
                
                if (isSecondPartner) {
                    // Skip page 3 (Household Assets)
                    if (newPage === 3) {
                        console.log('⏭️ Second partner - skipping page 3 (Assets)');
                        newPage = 4;
                    }
                    // Skip page 6 (Livestock)
                    else if (newPage === 6) {
                        console.log('⏭️ Second partner - skipping page 6 (Livestock)');
                        newPage = 7;
                    }
                }
                
                console.log(`✅ Navigating from page ${currentDemoPage} to ${newPage}`);
                currentDemoPage = newPage;
                showDemoPage(currentDemoPage);
            } else {
                console.log('⚠️ Already on last page');
            }
        } else {
            console.log('❌ Validation failed, staying on page', currentDemoPage);
        }
    }, false);
    
    console.log('✅ Next button listener registered (with second partner skip logic)');
}


// ===== DEMOGRAPHICS NAVIGATION - PREVIOUS BUTTON =====

if (prevBtn) {
    // Remove old listeners by cloning
    const newPrevBtn = prevBtn.cloneNode(true);
    prevBtn.parentNode.replaceChild(newPrevBtn, prevBtn);
    
    newPrevBtn.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        
        console.log(`◀️ Previous clicked. Current page: ${currentDemoPage}`);
        
        if (currentDemoPage > 1) {
            let newPage = currentDemoPage - 1;
            
            // ✅ CHECK IF SECOND PARTNER AND SKIP PAGES 3 & 6
            const isSecondPartner = document.querySelector('input[data-second-partner-hidden]') !== null;
            
            if (isSecondPartner) {
                // Skip page 6 (Livestock) when going backward
                if (newPage === 6) {
                    console.log('⏭️ Second partner - skipping page 6 (Livestock) backward');
                    newPage = 5;
                }
                // Skip page 3 (Household Assets) when going backward
                else if (newPage === 3) {
                    console.log('⏭️ Second partner - skipping page 3 (Assets) backward');
                    newPage = 2;
                }
            }
            
            console.log(`✅ Navigating from page ${currentDemoPage} to ${newPage}`);
            currentDemoPage = newPage;
            showDemoPage(currentDemoPage);
        } else {
            console.log('⚠️ Already on first page');
        }
    }, false);
    
    console.log('✅ Previous button listener registered (with second partner skip logic)');
}


    // Initialize demographics to page 1
    showDemoPage(1);

    // ===== DEMOGRAPHICS FORM SUBMISSION (PARTNER 1) =====
    const demoForm = document.getElementById('demographicsForm');
    if (demoForm) {
        console.log('✅ Demographics form found');
        
        demoForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            console.log('📝 FORM SUBMIT TRIGGERED');
            console.log('Current page:', currentDemoPage, '/', DEMOGRAPHICS_PAGES);
            
            // CRITICAL: Only process if on last page
            if (currentDemoPage !== DEMOGRAPHICS_PAGES) {
                console.log('⚠️ Not on last page - skipping');
                return;
            }
            
            console.log('📝 Processing demographics submission (Partner 1)...');
            showLoading();
            
            try {
                const formData = new FormData(e.target);
                
                // ===== BASIC VALIDATION =====
                const enumeratorName = formData.get('enumeratorName');
                const communityName = formData.get('communityName');
                const selectedRole = formData.get('role');
                const selectedGender = formData.get('gender');
                
                if (!enumeratorName?.trim()) {
                    console.error('❌ Missing enumerator name');
                    console.log('📋 Available form data:', Array.from(formData.entries()));
                    throw new Error('Please enter enumerator name');
                }

                if (!communityName?.trim()) {
                    console.error('❌ Missing community name');
                    throw new Error('Please select a community');
                }

                if (!selectedRole) {
                    throw new Error('Please select your role (Husband/Wife)');
                }

                if (!selectedGender) {
                    throw new Error('Please select your gender');
                }
                
                // ===== COLLECT DATA =====
                const crops = Array.from(document.querySelectorAll('input[name="crops"]:checked'))
                    .map(cb => cb.value);
                
                console.log('🌾 Selected crops:', crops);
                
                if (crops.length === 0) {
                    showLoading(false);
                    alert('Please select at least one crop on Page 5 (Crops & Income)');
                    currentDemoPage = 5;
                    showDemoPage(5);
                    return;
                }
                
                const assets = {
                    radio: formData.get('asset_radio') === '1',
                    tv: formData.get('asset_tv') === '1',
                    refrigerator: formData.get('asset_refrigerator') === '1',
                    bicycle: formData.get('asset_bicycle') === '1',
                    motorbike: formData.get('asset_motorbike') === '1',
                    mobilePhone: formData.get('asset_mobilePhone') === '1',
                    generator: formData.get('asset_generator') === '1',
                    plough: formData.get('asset_plough') === '1'
                };
                
                const livestock = {
                    cattle: parseInt(formData.get('livestock_cattle')) || 0,
                    goats: parseInt(formData.get('livestock_goats')) || 0,
                    sheep: parseInt(formData.get('livestock_sheep')) || 0,
                    poultry: parseInt(formData.get('livestock_poultry')) || 0
                };
                
                const improvedInputs = {
                    certifiedSeed: formData.get('input_certifiedSeed') === '1',
                    fertilizer: formData.get('input_fertilizer') === '1',
                    pesticides: formData.get('input_pesticides') === '1',
                    irrigation: formData.get('input_irrigation') === '1'
                };
                
                const shocks = {
                    drought: formData.get('shock_drought') === '1',
                    flood: formData.get('shock_flood') === '1',
                    pestsDisease: formData.get('shock_pestsDisease') === '1',
                    cropPriceFall: formData.get('shock_cropPriceFall') === '1'
                };
                
                const borrowSources = [];
                if (formData.get('borrowedMoney') === '1') {
                    if (formData.get('borrowSource_bank')) borrowSources.push('bank');
                    if (formData.get('borrowSource_microfinance')) borrowSources.push('microfinance');
                    if (formData.get('borrowSource_vsla')) borrowSources.push('vsla');
                    if (formData.get('borrowSource_familyFriends')) borrowSources.push('familyFriends');
                    if (formData.get('borrowSource_moneylender')) borrowSources.push('moneylender');
                }
                
                // ===== BUILD DEMOGRAPHICS OBJECT =====
                gameState.demographics = {
                    householdId: gameState.householdId,
                    communityName: communityName.trim(),
                    enumeratorName: enumeratorName.trim(),
                    gender: selectedGender,
                    role: selectedRole,
                    language: gameState.language || 'english',
                    
                    age: parseInt(formData.get('age')) || 18,
                    education: parseInt(formData.get('education')) || 0,
                    householdSize: parseInt(formData.get('householdSize')) || 1,
                    childrenUnder15: parseInt(formData.get('childrenUnder15')) || 0,
                    
                    assets: assets,
                    livestock: livestock,
                    
                    yearsOfFarming: parseInt(formData.get('farmingYears')) || 0,
                    landCultivated: parseFloat(formData.get('landSize')) || 0,
                    landAccessMethod: parseInt(formData.get('landAccessMethod')) || 1,
                    landAccessOther: formData.get('landAccessOther') || '',
                    mainCrops: crops,
                    numberOfCropsPlanted: parseInt(formData.get('numberOfCropsPlanted')) || 1,
                    lastSeasonIncome: parseFloat(formData.get('lastIncome')) || 0,
                    farmingInputExpenditure: parseFloat(formData.get('farmingInputExpenditure')) || 0,
                    
                    improvedInputs: improvedInputs,
                    hasIrrigationAccess: formData.get('hasIrrigationAccess') === '1',
                    
                    shocks: shocks,
                    estimatedLossLastYear: parseFloat(formData.get('estimatedLossLastYear')) || 0,
                    harvestLossPercentage: parseInt(formData.get('harvestLossPercentage')) || 0,
                    
                    hasSavings: formData.get('hasSavings') === '1',
                    savingsAmount: parseFloat(formData.get('savingsAmount')) || 0,
                    borrowedMoney: formData.get('borrowedMoney') === '1',
                    borrowSources: borrowSources,
                    hasOffFarmIncome: formData.get('hasOffFarmIncome') === '1',
                    offFarmIncomeAmount: parseFloat(formData.get('offFarmIncomeAmount')) || 0,
                    
                    priorInsuranceKnowledge: formData.get('priorKnowledge') === '1',
                    purchasedInsuranceBefore: formData.get('purchasedInsuranceBefore') === '1',
                    insuranceType: formData.get('insuranceType') || '',
                    
                    trustFarmerGroup: parseInt(formData.get('trust_farmerGroup')) || 3,
                    trustNGO: parseInt(formData.get('trust_ngo')) || 3,
                    trustInsuranceProvider: parseInt(formData.get('trust_insuranceProvider')) || 3,
                    rainfallChangePerception: parseInt(formData.get('rainfallChangePerception')) || 3,
                    insurerPayoutTrust: parseInt(formData.get('insurerPayoutTrust')) || 3,
                    
                    communityInsuranceDiscussion: false,
                    extensionVisits: false,
                    numberOfExtensionVisits: 0,
                    
                    memberOfFarmerGroup: formData.get('memberOfFarmerGroup') === '1',
                    farmerGroupName: formData.get('farmerGroupName') || '',
                    
                    distanceToMarket: parseInt(formData.get('distanceToMarket')) || 0,
                    distanceToInsurer: parseInt(formData.get('distanceToInsurer')) || 0,
                    usesMobileMoney: formData.get('usesMobileMoney') === '1'
                };
                
                gameState.gender = selectedGender;
                gameState.role = selectedRole;
                
                console.log('✅ Demographics collected successfully');
                console.log('📋 Moving to Risk Assessment (Step 11 of 13)');
                
                showLoading(false);
                
                // Move to step 11 (Risk screen)
                currentStep = 11;
                updateGlobalProgress(currentStep, TOTAL_STEPS);
                
                // Verify risk screen exists before transitioning
                const riskScreen = document.getElementById('riskScreen');
                if (!riskScreen) {
                    console.error('❌ CRITICAL: Risk screen not found in DOM!');
                    alert('Error: Risk screen is missing from the page. Please refresh and try again.');
                    return;
                }
                
                console.log('✅ Risk screen found, initiating transition...');
                
                // Small delay to ensure UI updates
                setTimeout(() => {
                    showScreen('riskScreen');
                    console.log('✅ Transitioned to Risk Assessment screen');
                    
                    // Double-check the screen is actually showing
                    if (!riskScreen.classList.contains('active')) {
                        console.error('❌ Risk screen failed to activate!');
                        riskScreen.classList.add('active');
                    }
                }, 100);
                
            } catch (error) {
                showLoading(false);
                console.error('❌ Demographics form error:', error);
                console.error('Error stack:', error.stack);
                alert('Error: ' + error.message + '\n\nPlease check the console for details.');
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
        });
        
        console.log('✅ Demographics form submission handler registered');
    } else {
        console.error('❌ Demographics form NOT found!');
    }

    // ===== CONDITIONAL FIELD VISIBILITY =====
    const hasSavingsRadios = document.querySelectorAll('[name="hasSavings"]');
    hasSavingsRadios.forEach(radio => {
        radio.addEventListener('change', function() {
            const group = document.getElementById('savingsAmountGroup');
            if (group) {
                group.style.display = this.value === '1' ? 'block' : 'none';
            }
        });
    });
    
    const borrowedMoneyRadios = document.querySelectorAll('[name="borrowedMoney"]');
    borrowedMoneyRadios.forEach(radio => {
        radio.addEventListener('change', function() {
            const group = document.getElementById('borrowingSourcesGroup');
            if (group) {
                group.style.display = this.value === '1' ? 'block' : 'none';
            }
        });
    });
    
    const hasOffFarmRadios = document.querySelectorAll('[name="hasOffFarmIncome"]');
    hasOffFarmRadios.forEach(radio => {
        radio.addEventListener('change', function() {
            const group = document.getElementById('offFarmIncomeGroup');
            if (group) {
                group.style.display = this.value === '1' ? 'block' : 'none';
            }
        });
    });






    // ===== CROPS CHECKBOX VALIDATION =====
// ===== FORM CHANGE HANDLERS =====
document.addEventListener('change', function(e) {
    // Crops checkbox validation
    if (e.target.name === 'crops') {
        const cropsCheckboxes = document.querySelectorAll('input[name="crops"]');
        const anyChecked = Array.from(cropsCheckboxes).some(cb => cb.checked);
        const cropsError = document.getElementById('cropsError');
        
        if (cropsError) {
            cropsError.style.display = anyChecked ? 'none' : 'block';
        }
    }
    
    // Auto-save progress on any form change
    if (e.target.closest('form')) {
        saveGameProgress();
    }
});



    // ===== RISK FORM =====
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
                
                currentStep = 12;
                updateGlobalProgress(currentStep, TOTAL_STEPS);
                showScreen('empowermentScreen');
            } catch (error) {
                showLoading(false);
                console.error('Risk form error:', error);
                alert('Error: ' + error.message);
            }
        });
        console.log('✅ Risk form handler registered');
    }



    // Add this to DOMContentLoaded
function updateWelcomeSyncStatus() {
    const syncStatus = window.offlineStorage.getSyncStatus();
    const welcomeSyncText = document.getElementById('welcomeSyncText');
    const welcomeSyncBtn = document.getElementById('welcomeSyncBtn');
    const welcomeSyncStatus = document.getElementById('welcomeSyncStatus');
    
    if (!welcomeSyncText || !welcomeSyncBtn || !welcomeSyncStatus) return;
    
    if (syncStatus.pendingItems > 0) {
        welcomeSyncStatus.style.background = '#FFF3E0';
        welcomeSyncText.innerHTML = `<i class="fas fa-exclamation-triangle" style="color: #FF9800;"></i> ${syncStatus.pendingItems} items need syncing`;
        welcomeSyncBtn.innerHTML = '<i class="fas fa-sync-alt"></i><span>Sync ' + syncStatus.pendingItems + ' Items</span>';
        welcomeSyncBtn.disabled = !syncStatus.isOnline;
        welcomeSyncBtn.style.background = syncStatus.isOnline ? 
            'linear-gradient(135deg, #2196F3, #1976D2)' : 
            'linear-gradient(135deg, #9E9E9E, #757575)';
    } else {
        welcomeSyncStatus.style.background = '#E8F5E9';
        welcomeSyncText.innerHTML = '<i class="fas fa-check-circle" style="color: #4CAF50;"></i> All data synced';
        welcomeSyncBtn.innerHTML = '<i class="fas fa-check"></i><span>All Synced</span>';
        welcomeSyncBtn.disabled = true;
        welcomeSyncBtn.style.background = 'linear-gradient(135deg, #9E9E9E, #757575)';
    }
}

// Call it on page load and after sync
window.addEventListener('load', updateWelcomeSyncStatus);


    // ===== EMPOWERMENT FORM =====
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
                
                // Better detection logic using localStorage
                const savedHouseholdData = localStorage.getItem('weather_game_household');
                let savedFirstId = null;
                if (savedHouseholdData) {
                    try {
                        const parsed = JSON.parse(savedHouseholdData);
                        savedFirstId = parsed.firstRespondentId;
                    } catch (e) {
                        console.warn('Could not parse saved household data');
                    }
                }
                
                // Determine if this is first or second partner
                let isFirstPartner;
                
                if (!gameState.firstRespondentId && !savedFirstId) {
                    isFirstPartner = true;
                } else if (gameState.firstRespondentId && respondent._id === gameState.firstRespondentId) {
                    isFirstPartner = true;
                } else if (savedFirstId && respondent._id === savedFirstId) {
                    isFirstPartner = true;
                } else if (gameState.firstRespondentId || savedFirstId) {
                    isFirstPartner = false;
                } else {
                    isFirstPartner = true;
                }
                
                console.log('🔍 Partner detection:', {
                    currentId: respondent._id,
                    firstIdInState: gameState.firstRespondentId,
                    firstIdInStorage: savedFirstId,
                    isFirstPartner: isFirstPartner
                });
                
                if (isFirstPartner) {
                    gameState.firstRespondentId = respondent._id;
                    gameState.firstRespondentRole = gameState.role;
                    gameState.firstRespondentData = {
                        role: gameState.role,
                        gender: gameState.gender,
                        treatmentGroup: gameState.treatmentGroup,
                        demographics: { ...gameState.demographics }
                    };
                    gameState.secondRespondentId = null;
                    
                    console.log('🎯 FIRST PARTNER registered:', {
                        id: gameState.firstRespondentId,
                        role: gameState.firstRespondentRole
                    });
                } else {
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

    // ===== TUTORIAL =====
    const tutorialPrevBtn = document.getElementById('tutorialPrevBtn');
    if (tutorialPrevBtn) {
        tutorialPrevBtn.addEventListener('click', previousTutorialCard);
    }
    
    const tutorialNextBtn = document.getElementById('tutorialNextBtn');
    if (tutorialNextBtn) {
        tutorialNextBtn.addEventListener('click', nextTutorialCard);
    }
    
    const tutorialFinishBtn = document.getElementById('tutorialFinishBtn');
    if (tutorialFinishBtn) {
        tutorialFinishBtn.addEventListener('click', startGameAfterTutorial);
    }

    const cardStack = document.getElementById('tutorialCardStack');
    if (cardStack) {
        cardStack.addEventListener('touchstart', handleTouchStart, false);
        cardStack.addEventListener('touchend', handleTouchEnd, false);
    }

    // ===== GAME ALLOCATION INPUTS =====
    ['insuranceSpend', 'inputSpend', 'educationSpend', 'consumptionSpend'].forEach(inputId => {
        const input = document.getElementById(inputId);
        if (input) input.addEventListener('input', updateAllocation);
    });

    // ===== ALLOCATION FORM =====
    const allocForm = document.getElementById('allocationForm');
    if (allocForm) {
        allocForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            console.log('📝 Allocation form submitted');
            console.log('Session ID:', gameState.sessionId);
            console.log('Respondent ID:', gameState.respondentId);
            
            if (!gameState.sessionId) {
                console.error('❌ Missing sessionId');
                alert('Error: Session not initialized. Please restart the game.');
                return;
            }
            
            if (!gameState.respondentId) {
                console.error('❌ Missing respondentId');
                alert('Error: Respondent not initialized. Please restart the game.');
                return;
            }
            
            showLoading();
            
            try {
                const budget = parseInt(document.getElementById('totalBudget').textContent);
                const bundleCheckbox = document.getElementById('bundleAccepted');
                const bundleAccepted = bundleCheckbox ? bundleCheckbox.checked : false;
                
                let inputChoiceType = '';
                if (bundleAccepted) {
                    const inputChoiceElement = document.getElementById('inputChoiceType');
                    inputChoiceType = inputChoiceElement ? inputChoiceElement.value : '';
                    
                    if (gameState.treatmentGroup === 'control' && !inputChoiceType) {
                        showLoading(false);
                        alert('Please select which input you want to receive with insurance');
                        return;
                    }
                }
                
                let bundleProduct = 'none';
                if (bundleAccepted) {
                    if (gameState.treatmentGroup === 'control') {
                        bundleProduct = inputChoiceType;
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
                    inputChoiceType: inputChoiceType,
                    startTime: new Date(),
                    weatherShock: { occurred: false, type: 'normal', severity: 'none' },
                    harvestOutcome: 0,
                    payoutReceived: 0
                };
                
                console.log('📊 Season data:', seasonData);
                
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
                
                console.log('🌐 Saving round to server...');
                await apiCall('/round/save', 'POST', seasonData);
                gameState.seasonData.push(seasonData);
                
                console.log(`✅ Season ${gameState.currentSeason} saved successfully`);
                
                showLoading(false);
                showWeatherOutcome(seasonData, weather);
                
            } catch (error) {
                showLoading(false);
                console.error('❌ Allocation error:', error);
                console.error('Error details:', error.message);
                alert('Error saving allocation: ' + error.message);
            }
        });
        console.log('✅ Allocation form handler registered');
    }

    // ===== NEXT SEASON BUTTON =====
    const nextSeasonBtn = document.getElementById('nextRoundBtn');
    if (nextSeasonBtn) {
        nextSeasonBtn.addEventListener('click', nextSeason);
    }

    // ===== KNOWLEDGE FORM =====
    const knowledgeForm = document.getElementById('knowledgeForm');
    if (knowledgeForm) {
        knowledgeForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
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
                
                console.log('📝 Submitting knowledge test:', testData);
                
                await apiCall('/knowledge/submit', 'POST', testData);
                await apiCall(`/session/${gameState.sessionId}/complete`, 'PUT');
                
                console.log('✅ Knowledge test submitted and session completed');
                
                showLoading(false);
                await showResults();
                
            } catch (error) {
                showLoading(false);
                console.error('❌ Knowledge form error:', error);
                alert('Error submitting knowledge test: ' + error.message);
            } finally {
                isSubmittingKnowledge = false;
            }
        });
        console.log('✅ Knowledge form handler registered');
    }

    // ===== COUPLE PRE-QUESTIONS =====
    const couplePreForm = document.getElementById('couplePreQuestionsForm');
    if (couplePreForm) {
        couplePreForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            try {
                const formData = new FormData(e.target);
                gameState.coupleInfo = {
                    marriageDuration: parseInt(formData.get('marriageDuration')),
                    numberOfChildren: parseInt(formData.get('numberOfChildren'))
                };
                
                console.log('✅ Couple info collected:', gameState.coupleInfo);
                
                await startCoupleSession();
            } catch (error) {
                console.error('Couple pre-questions error:', error);
                alert('Error: ' + error.message);
            }
        });
    }

    // ===== PERCEPTION FORM =====
    const perceptionForm = document.getElementById('perceptionForm');
    if (perceptionForm) {
        perceptionForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            showLoading();
            
            try {
                const formData = new FormData(e.target);
                
                const perceptionData = {
                    sessionId: gameState.sessionId,
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
                
                console.log('✅ Perception data submitted');
                
                showLoading(false);
                await showResults();
                
            } catch (error) {
                showLoading(false);
                console.error('Perception form error:', error);
                alert('Error submitting perception data: ' + error.message);
            }
        });
    }

    // ===== SECOND PARTNER BUTTONS =====
    const startSecondBtn = document.getElementById('startSecondPartnerBtn');
    if (startSecondBtn) {
        startSecondBtn.addEventListener('click', startSecondPartner);
        console.log('✅ Second partner button listener registered');
    }
    
    const startCouplePromptBtn = document.getElementById('startCouplePromptBtn');
    if (startCouplePromptBtn) {
        startCouplePromptBtn.addEventListener('click', startCouplePreQuestions);
    }

    // ===== RESTART BUTTON =====
    const restartBtn = document.getElementById('restartBtn');
    if (restartBtn) {
        restartBtn.addEventListener('click', restartGame);
    }

    console.log('✅ All event listeners registered');
    console.log('🎮 Game ready - Manual sync only!');
});

// ===== UPDATE PROGRESS WHEN MOVING TO OTHER SCREENS =====

// When showing Risk screen (Step 16)
// When showing Risk screen (Step 11)
function showRiskScreen() {
    currentStep = 11;
    updateGlobalProgress(currentStep, TOTAL_STEPS);
    showScreen('riskScreen');
}

// When showing Empowerment screen (Step 12)
function showEmpowermentScreen() {
    currentStep = 12;
    updateGlobalProgress(currentStep, TOTAL_STEPS);
    showScreen('empowermentScreen');
}

// When showing Tutorial screen (Step 13)
function showTutorialScreen() {
    currentStep = 13;
    updateGlobalProgress(currentStep, TOTAL_STEPS);
    showScreen('tutorialScreen');
    initializeTutorial();
}

// When showing Empowerment screen (Step 17)
function showEmpowermentScreen() {
    currentStep = 17;
    updateGlobalProgress(currentStep);
    showScreen('empowermentScreen');
}

// When showing Tutorial screen (Step 18)
function showTutorialScreen() {
    currentStep = 18;
    updateGlobalProgress(currentStep);
    showScreen('tutorialScreen');
    initializeTutorial();
}




function validateCurrentDemoPage() {
    const currentPage = document.getElementById(`demoPage${currentDemoPage}`);
    if (!currentPage) {
        console.warn('⚠️ Current page not found:', currentDemoPage);
        return true;
    }
    
    let allValid = true;
    let firstInvalidField = null;
    
    console.log(`🔍 Validating page ${currentDemoPage}...`);
    
    // ✅ SPECIAL: Page 7 - improved inputs checkboxes are OPTIONAL
    if (currentDemoPage === 7) {
        // Check only the required field (hasIrrigationAccess)
        const irrigationRadios = currentPage.querySelectorAll('input[name="hasIrrigationAccess"]');
        const anyChecked = Array.from(irrigationRadios).some(radio => radio.checked);
        if (!anyChecked) {
            console.warn('❌ Irrigation access not selected');
            allValid = false;
            firstInvalidField = irrigationRadios[0];
        } else {
            console.log('✅ Page 7 validated');
        }
        
        if (!allValid && firstInvalidField) {
            firstInvalidField.scrollIntoView({ behavior: 'smooth', block: 'center' });
            setTimeout(() => firstInvalidField.focus(), 300);
        }
        
        return allValid;
    }
    
    // SPECIAL: Validate crops checkboxes on page 5
    if (currentDemoPage === 5) {
        const cropsCheckboxes = currentPage.querySelectorAll('input[name="crops"]');
        const anyChecked = Array.from(cropsCheckboxes).some(cb => cb.checked);
        const cropsError = document.getElementById('cropsError');
        
        if (!anyChecked) {
            console.warn('❌ No crops selected');
            allValid = false;
            if (cropsError) {
                cropsError.style.display = 'block';
            }
            if (!firstInvalidField) {
                firstInvalidField = document.getElementById('cropsCheckboxGroup');
            }
        } else {
            console.log('✅ Crops validated');
            if (cropsError) {
                cropsError.style.display = 'none';
            }
        }
    }
    
    // Get all required fields on current page
    const requiredFields = currentPage.querySelectorAll('[required]');
    console.log(`📋 Found ${requiredFields.length} required fields on page ${currentDemoPage}`);
    
    requiredFields.forEach(field => {
        if (field.type === 'checkbox' || field.type === 'radio') {
            const name = field.name;
            const group = currentPage.querySelectorAll(`[name="${name}"]`);
            const anyChecked = Array.from(group).some(input => input.checked);
            
            if (!anyChecked) {
                console.warn('❌ No option selected for:', name);
                allValid = false;
                if (!firstInvalidField) {
                    firstInvalidField = field;
                }
            }
        } else {
            if (!field.checkValidity()) {
                console.warn('❌ Invalid field:', field.name, '| Value:', field.value);
                allValid = false;
                if (!firstInvalidField) {
                    firstInvalidField = field;
                }
            }
        }
    });
    
    if (!allValid && firstInvalidField) {
        console.log('⚠️ Validation failed - scrolling to first invalid field');
        firstInvalidField.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'center' 
        });
        
        setTimeout(() => {
            firstInvalidField.focus();
            if (firstInvalidField.reportValidity) {
                firstInvalidField.reportValidity();
            }
        }, 300);
    } else {
        console.log('✅ Page validation passed');
    }
    
    return allValid;
}






function updatePerceptionScreenLang() {
    const title = document.querySelector('#perceptionScreen h2');
    if (title) {
        title.innerHTML = `<i class="fas fa-comments"></i> ${t('perception.title')}`;
    }
    
    const subtitle = document.querySelector('#perceptionScreen .subtitle');
    if (subtitle) subtitle.textContent = t('perception.subtitle');
    
    // Update questions - they're hardcoded in HTML, so we need to update them
    const questions = document.querySelectorAll('#perceptionScreen .question-item > p');
    const qKeys = ['q1', 'q2', 'q3', 'q4', 'q5', 'q6', 'q7', 'q8'];
    questions.forEach((q, i) => {
        if (qKeys[i]) {
            const strong = q.querySelector('strong');
            if (strong) {
                strong.textContent = `${i + 1}. ${t(`perception.${qKeys[i]}`)}`;
            }
        }
    });
    
    // Update scale labels for Likert scales
    document.querySelectorAll('#perceptionScreen .scale-labels').forEach((container, idx) => {
        const spans = container.querySelectorAll('span');
        if (spans.length >= 2) {
            // Different scales for different questions
            if (idx === 0) { // Q1
                spans[0].textContent = t('perception.notAtAll');
                spans[1].textContent = t('perception.veryMuch');
            } else if (idx === 1) { // Q2
                spans[0].textContent = t('perception.dontUnderstand');
                spans[1].textContent = t('perception.understandCompletely');
            } else if (idx === 3) { // Q4
                spans[0].textContent = t('perception.veryUnlikely');
                spans[1].textContent = t('perception.veryLikely');
            } else if (idx === 4) { // Q5
                spans[0].textContent = t('perception.veryUnfair');
                spans[1].textContent = t('perception.veryFair');
            } else if (idx === 5) { // Q6
                spans[0].textContent = t('perception.dontTrust');
                spans[1].textContent = t('perception.trustCompletely');
            } else if (idx === 6) { // Q7
                spans[0].textContent = t('perception.notValuable');
                spans[1].textContent = t('perception.extremelyValuable');
            } else if (idx === 7) { // Q8
                spans[0].textContent = t('perception.definitelyNot');
                spans[1].textContent = t('perception.definitelyYes');
            }
        }
    });
    
    // Update Yes/No radio for Q3
    const willingnessRadios = document.querySelectorAll('input[name="willingnessToPay"]');
    willingnessRadios.forEach(radio => {
        const label = radio.closest('label');
        if (label) {
            const text = radio.value === 'yes' ? t('perception.yes') : t('perception.no');
            label.innerHTML = '';
            label.appendChild(radio);
            label.appendChild(document.createTextNode(' ' + text));
        }
    });
    
    // Update submit button
    const submitBtn = document.querySelector('#perceptionForm .btn-primary span');
    if (submitBtn) submitBtn.textContent = t('perception.submit');
}

function updateCoupleQuestionsLang() {
    const title = document.querySelector('#couplePreQuestionsScreen h2');
    if (title) {
        title.innerHTML = `<i class="fas fa-heart"></i> ${t('couple.title')}`;
    }
    
    const subtitle = document.querySelector('#couplePreQuestionsScreen .subtitle');
    if (subtitle) subtitle.textContent = t('couple.subtitle');
    
    // Update marriage duration label
    const marriageLabel = document.querySelector('label[style*="fas fa-ring"]');
    if (marriageLabel) {
        const icon = marriageLabel.querySelector('i');
        marriageLabel.innerHTML = '';
        marriageLabel.appendChild(icon);
        marriageLabel.appendChild(document.createTextNode(' ' + t('couple.marriageDuration')));
    }
    
    // Update marriage duration options
    updateSelectLang('marriageDuration', [
        { value: '', text: t('common.select') },
        { value: '1', text: t('couple.lessThan1') },
        { value: '2', text: t('couple.years12') },
        { value: '3', text: t('couple.years35') },
        { value: '4', text: t('couple.years610') },
        { value: '5', text: t('couple.years1115') },
        { value: '6', text: t('couple.years1620') },
        { value: '7', text: t('couple.moreThan20') }
    ]);
    
    // Update children label
    const childrenLabel = document.querySelector('label[style*="fas fa-baby"]');
    if (childrenLabel) {
        const icon = childrenLabel.querySelector('i');
        childrenLabel.innerHTML = '';
        childrenLabel.appendChild(icon);
        childrenLabel.appendChild(document.createTextNode(' ' + t('couple.numberOfChildren')));
    }
    
    // Update remember info text
    const infoBox = document.querySelector('#couplePreQuestionsScreen div[style*="E3F2FD"] p');
    if (infoBox) {
        const icon = infoBox.querySelector('i');
        infoBox.innerHTML = '';
        infoBox.appendChild(icon);
        infoBox.appendChild(document.createTextNode(' '));
        const strong = document.createElement('strong');
        strong.textContent = t('couple.rememberInfo').split(':')[0] + ':';
        infoBox.appendChild(strong);
        infoBox.appendChild(document.createTextNode(' ' + t('couple.rememberInfo').split(':')[1]));
    }
    
    // Update start button
    const startBtn = document.querySelector('#couplePreQuestionsForm .btn-primary span');
    if (startBtn) startBtn.textContent = t('couple.startSession');
}




function updateExtendedDemographicsLang() {
    // Update page titles
    const pageTitles = {
        1: 'demographicsExtended.basicInfo',
        2: 'demographicsExtended.educationHousehold',
        3: 'demographicsExtended.householdAssets',
        4: 'demographicsExtended.farmingExperience',
        5: 'demographicsExtended.cropsIncome',
        6: 'demographicsExtended.livestock',
        7: 'demographicsExtended.farmInputs',
        8: 'demographicsExtended.shocksLosses',
        9: 'demographicsExtended.savingsCredit',
        10: 'demographicsExtended.insuranceTrust'
    };
    
    Object.keys(pageTitles).forEach(pageNum => {
        const pageTitle = document.querySelector(`#demoPage${pageNum} h3`);
        if (pageTitle) {
            const icon = pageTitle.querySelector('i');
            const iconHTML = icon ? icon.outerHTML : '';
            pageTitle.innerHTML = iconHTML + ' ' + t(pageTitles[pageNum]);
        }
    });
    
    // Update all labels with specific translations
    updateLabelByText('Enumerator Name', t('demographicsExtended.enumeratorName'));
    updateLabelByText('Community Name', t('demographicsExtended.communityName'));
    updateLabelByText('Household size', t('demographicsExtended.householdSize'));
    updateLabelByText('Number of children under 15', t('demographicsExtended.childrenUnder15'));
    
    // Update asset checkboxes
    updateCheckboxLabel('asset_radio', t('demographicsExtended.radio'));
    updateCheckboxLabel('asset_tv', t('demographicsExtended.tv'));
    updateCheckboxLabel('asset_refrigerator', t('demographicsExtended.refrigerator'));
    updateCheckboxLabel('asset_bicycle', t('demographicsExtended.bicycle'));
    updateCheckboxLabel('asset_motorbike', t('demographicsExtended.motorbike'));
    updateCheckboxLabel('asset_mobilePhone', t('demographicsExtended.mobilePhone'));
    updateCheckboxLabel('asset_generator', t('demographicsExtended.generator'));
    updateCheckboxLabel('asset_plough', t('demographicsExtended.plough'));
    
    // Update navigation button TEXT only (not event listeners)
    const prevBtn = document.getElementById('demoPrevBtn');
    if (prevBtn) {
        const span = prevBtn.querySelector('span');
        if (span) span.textContent = t('demographicsExtended.back');
    }
    
    const nextBtn = document.getElementById('demoNextBtn');
    if (nextBtn) {
        const span = nextBtn.querySelector('span');
        if (span) span.textContent = t('demographicsExtended.continueNext');
    }
    
    const submitBtn = document.getElementById('demoSubmitBtn');
    if (submitBtn) {
        const span = submitBtn.querySelector('span');
        if (span) span.textContent = t('demographicsExtended.continueRisk');
    }
}




// Helper function to update label by its text content
function updateLabelByText(searchText, newText) {
    const labels = document.querySelectorAll('label');
    labels.forEach(label => {
        if (label.textContent.includes(searchText) && !label.querySelector('input') && !label.querySelector('select')) {
            const icon = label.querySelector('i');
            const required = label.querySelector('span[style*="red"]');
            label.innerHTML = '';
            if (icon) label.appendChild(icon);
            label.appendChild(document.createTextNode(' ' + newText + ' '));
            if (required) label.appendChild(required);
        }
    });
}

// Helper function to update checkbox labels
function updateCheckboxLabel(inputName, newText) {
    const input = document.querySelector(`input[name="${inputName}"]`);
    if (input) {
        const label = input.closest('label');
        if (label) {
            const icon = label.querySelector('i');
            label.innerHTML = '';
            label.appendChild(input);
            if (icon) label.appendChild(document.createTextNode(' ' + icon.textContent + ' '));
            label.appendChild(document.createTextNode(newText));
        }
    }
}


function updateProgressText() {
    const progressTexts = document.querySelectorAll('.progress-text');
    progressTexts.forEach(text => {
        // Extract numbers from existing text
        const match = text.textContent.match(/(\d+)\s*(?:of|\/)\s*(\d+)/);
        if (match) {
            const [, current, total] = match;
            text.textContent = `${t('progress.step')} ${current} ${t('progress.of')} ${total}`;
        }
    });
}


// ===== BACK NAVIGATION FUNCTIONS =====
function goBackToDemographics() {
    if (confirm('Go back to demographics? Current progress will be saved.')) {
        currentDemoPage = DEMOGRAPHICS_PAGES; // Go to last page
        currentStep = DEMOGRAPHICS_PAGES;
        updateGlobalProgress(currentStep, TOTAL_STEPS);
        showScreen('demographicsScreen');
        showDemoPage(currentDemoPage);
    }
}

function goBackToRisk() {
    if (confirm('Go back to risk assessment?')) {
        currentStep = 11;
        updateGlobalProgress(currentStep, TOTAL_STEPS);
        showScreen('riskScreen');
    }
}

function goBackToEmpowerment() {
    if (confirm('Go back to empowerment assessment?')) {
        currentStep = 12;
        updateGlobalProgress(currentStep, TOTAL_STEPS);
        showScreen('empowermentScreen');
    }
}




// ===== SHOW SHORTENED DEMOGRAPHICS FOR SECOND PARTNER =====
function showSecondPartnerDemographics() {
    console.log('📝 Showing shortened demographics for second partner');
    
    // Update role guidance
    if (gameState.firstRespondentRole) {
        const roleSelect = document.getElementById('secondPartnerRole');
        const roleGuidance = document.getElementById('secondPartnerRoleGuidance');
        
        if (roleSelect && roleGuidance) {
            const oppositeRole = gameState.firstRespondentRole === 'husband' ? 'wife' : 'husband';
            
            roleGuidance.style.display = 'block';
            roleGuidance.innerHTML = `
                <i class="fas fa-info-circle"></i>
                The <strong>${gameState.firstRespondentRole}</strong> has already completed their session. 
                Please select <strong>"${oppositeRole}"</strong> below.
            `;
            
            // Pre-select the opposite role
            roleSelect.value = oppositeRole;
            
            // Disable the first partner's role
            const options = roleSelect.querySelectorAll('option');
            options.forEach(option => {
                if (option.value === gameState.firstRespondentRole) {
                    option.disabled = true;
                    option.textContent = option.textContent + ' (Already played)';
                }
            });
        }
    }
    
    showScreen('secondPartnerDemographicsScreen');
}

// ===== SECOND PARTNER DEMOGRAPHICS FORM HANDLER =====
const secondPartnerDemoForm = document.getElementById('secondPartnerDemographicsForm');
if (secondPartnerDemoForm) {
    secondPartnerDemoForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        showLoading();
        
        try {
            const formData = new FormData(e.target);
            
            // Validate role
            const selectedRole = formData.get('role');
            if (selectedRole === gameState.firstRespondentRole) {
                throw new Error(`The ${gameState.firstRespondentRole} has already played!`);
            }
            
            // ✅ MERGE individual data with household data
            gameState.demographics = {
                ...gameState.demographics, // Keep household data
                // Add individual data
                gender: formData.get('gender'),
                role: selectedRole,
                age: parseInt(formData.get('age')),
                education: parseInt(formData.get('education')),
                priorInsuranceKnowledge: formData.get('priorKnowledge') === '1',
                purchasedInsuranceBefore: formData.get('purchasedInsuranceBefore') === '1',
                insuranceType: '',
                trustFarmerGroup: parseInt(formData.get('trust_farmerGroup')),
                trustNGO: parseInt(formData.get('trust_ngo')),
                trustInsuranceProvider: parseInt(formData.get('trust_insuranceProvider')),
                rainfallChangePerception: parseInt(formData.get('rainfallChangePerception')),
                insurerPayoutTrust: parseInt(formData.get('insurerPayoutTrust')),
                language: gameState.language || 'english'
            };
            
            gameState.gender = formData.get('gender');
            gameState.role = selectedRole;
            
            console.log('✅ Second partner demographics collected');
            console.log('📋 Household data preserved from first partner');
            
            showLoading(false);
            
            // Go to risk screen (Step 2 of 4)
            currentStep = 2;
            updateGlobalProgress(2, 4);
            showScreen('riskScreen');
            
        } catch (error) {
            showLoading(false);
            console.error('❌ Second partner form error:', error);
            alert(error.message);
        }
    });
}



// ===== UPDATE SECOND PARTNER GUIDANCE =====
function updateSecondPartnerGuidance() {
    console.log('📝 Updating second partner guidance');
    
    if (!gameState.firstRespondentId || !gameState.firstRespondentRole) {
        console.log('⚠️ No first partner data available');
        return;
    }
    
    // Find the role select on page 1
    const roleSelect = document.getElementById('role');
    if (!roleSelect) {
        console.log('⚠️ Role select not found');
        return;
    }
    
    // Determine opposite role
    const oppositeRole = gameState.firstRespondentRole === 'husband' ? 'wife' : 'husband';
    const firstRole = gameState.firstRespondentRole;
    
    console.log(`First partner was: ${firstRole}, second should be: ${oppositeRole}`);
    
    // Check if guidance already exists
    let guidanceDiv = document.getElementById('secondPartnerGuidance');
    
    if (!guidanceDiv) {
        // Create guidance div if it doesn't exist
        guidanceDiv = document.createElement('div');
        guidanceDiv.id = 'secondPartnerGuidance';
        guidanceDiv.style.cssText = `
            background: #FFF9C4;
            padding: 20px;
            border-radius: 12px;
            margin-top: 15px;
            border-left: 6px solid #FFA726;
            animation: slideIn 0.3s ease;
        `;
        
        // Insert after the role select's form-group
        const roleFormGroup = roleSelect.closest('.form-group');
        if (roleFormGroup) {
            roleFormGroup.appendChild(guidanceDiv);
        }
    }
    
    // Update guidance content
    guidanceDiv.innerHTML = `
        <p style="margin: 0; font-size: 16px; line-height: 1.6;">
            <i class="fas fa-info-circle" style="color: #F57C00; margin-right: 10px;"></i>
            <strong>Note:</strong> The <strong>${firstRole}</strong> has already completed their session. 
            Please select <strong>"${oppositeRole}"</strong> below.
        </p>
    `;
    
    // Disable the first partner's role option
    const options = roleSelect.querySelectorAll('option');
    options.forEach(option => {
        if (option.value === firstRole) {
            option.disabled = true;
            option.textContent = option.textContent.replace(' (Already played)', '') + ' (Already played)';
        } else if (option.value === oppositeRole) {
            option.disabled = false;
        }
    });
    
    // Pre-select the opposite role
    roleSelect.value = oppositeRole;
    
    // Trigger change event to update UI if needed
    const changeEvent = new Event('change', { bubbles: true });
    roleSelect.dispatchEvent(changeEvent);
    
    console.log('✅ Second partner guidance updated');
}


// ===== SECOND PARTNER BUTTON (Event Delegation) =====
// ===== SECOND PARTNER BUTTON (Event Delegation) - Prevent Double Fire =====
let secondPartnerButtonClicked = false;

document.addEventListener('click', function(e) {
    const btn = e.target.closest('#startSecondPartnerBtn');
    if (btn) {
        // Prevent double-firing
        if (secondPartnerButtonClicked) {
            console.log('⚠️ Second partner button already clicked, ignoring...');
            return;
        }
        
        console.log('🔘 Second partner button clicked via delegation!');
        e.preventDefault();
        e.stopPropagation();
        
        secondPartnerButtonClicked = true;
        
        startSecondPartner();
        
        // Reset flag after 2 seconds
        setTimeout(() => {
            secondPartnerButtonClicked = false;
        }, 2000);
    }
});
console.log('✅ Second partner button listener registered (delegation)');






function goBackToWelcome() {
    if (confirm('Go back to welcome screen? Current progress will be lost.')) {
        // Reset game state
        currentDemoPage = 1;
        currentStep = 1;
        
        // Clear forms
        const forms = document.querySelectorAll('form');
        forms.forEach(form => form.reset());
        
        // Show welcome screen
        showScreen('welcomeScreen');
    }
}


function goBackOnePage() {
    if (currentDemoPage > 1) {
        currentDemoPage--;
        showDemoPage(currentDemoPage);
    }
}



// ===== EXPORT OFFLINE DATA FROM DEVICE =====
function exportOfflineData() {
    console.log('📤 Exporting offline data...');
    
    const data = localStorage.getItem('farm_game_offline_data');
    if (!data) {
        alert('No offline data found on this device.\n\nThis could mean:\n• Data has already been synced to the server\n• No data has been collected offline on this device');
        return;
    }
    
    try {
        const parsed = JSON.parse(data);
        
        // Create detailed export info
        const exportInfo = {
            exportedAt: new Date().toISOString(),
            deviceId: parsed.deviceId,
            lastSyncAttempt: parsed.lastSyncAttempt,
            summary: {
                totalRespondents: parsed.respondents?.length || 0,
                totalSessions: parsed.sessions?.length || 0,
                totalRounds: parsed.rounds?.length || 0,
                totalKnowledge: parsed.knowledge?.length || 0,
                totalPerception: parsed.perception?.length || 0,
                pendingSync: parsed.pending_sync?.length || 0
            },
            fullData: parsed
        };
        
        console.log('📊 Export summary:', exportInfo.summary);
        
        // Create download
        const blob = new Blob([JSON.stringify(exportInfo, null, 2)], 
            { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `offline-data-device-${parsed.deviceId}-${Date.now()}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        showToast(`✅ Exported ${exportInfo.summary.totalRespondents} respondents from this device`, 'success');
    } catch (error) {
        console.error('❌ Export error:', error);
        alert('Error exporting offline data: ' + error.message);
    }
}

// Make it available globally for console debugging
window.exportOfflineData = exportOfflineData;


// ===== EXPORT OFFLINE DATA BUTTON =====
const exportBtn = document.getElementById('exportButton');
if (exportBtn) {
    exportBtn.addEventListener('click', exportOfflineData);
    console.log('✅ Export button listener registered');
}



// ===== DEBUG: Force Sync Test =====
window.testOfflineSync = async function() {
    console.log('');
    console.log('🧪 ========================================');
    console.log('🧪 TESTING OFFLINE SYNC');
    console.log('🧪 ========================================');
    
    // Check offline data
    const data = window.checkOfflineData();
    
    if (!data || !data.pending_sync || data.pending_sync.length === 0) {
        console.log('❌ No pending data to sync!');
        return;
    }
    
    console.log(`📦 Found ${data.pending_sync.length} pending items`);
    
    // Test first item
    const testItem = data.pending_sync[0];
    console.log('🔬 Testing first item:', testItem);
    
    const testUrl = `${window.location.origin}${testItem.endpoint}`;
    console.log('📍 Full URL:', testUrl);
    
    try {
        const response = await fetch(testUrl, {
            method: testItem.method,
            headers: {
                'Content-Type': 'application/json',
                'X-Offline-Sync': 'true'
            },
            body: JSON.stringify(testItem.data)
        });
        
        console.log('📡 Response status:', response.status);
        const responseData = await response.json();
        console.log('📊 Response data:', responseData);
        
        if (response.ok) {
            console.log('✅ TEST PASSED - Item can be synced!');
            console.log('');
            console.log('Now run: window.offlineStorage.syncOfflineData()');
        } else {
            console.error('❌ TEST FAILED:', responseData);
        }
    } catch (error) {
        console.error('❌ TEST ERROR:', error);
    }
    
    console.log('🧪 ========================================');
};



// ===== TEMPORARY DEBUG FUNCTION =====
function debugSyncStatus() {
    console.clear();
    console.log('');
    console.log('🔍 ========================================');
    console.log('🔍 MANUAL SYNC DEBUG');
    console.log('🔍 ========================================');
    
    // Check what's in localStorage
    const rawData = localStorage.getItem('farm_game_offline_data');
    console.log('📦 Raw localStorage data:', rawData ? 'EXISTS' : 'MISSING');
    
    if (rawData) {
        const parsed = JSON.parse(rawData);
        console.log('📊 Parsed data summary:', {
            deviceId: parsed.deviceId,
            respondents: parsed.respondents?.length || 0,
            sessions: parsed.sessions?.length || 0,
            rounds: parsed.rounds?.length || 0,
            knowledge: parsed.knowledge?.length || 0,
            perception: parsed.perception?.length || 0,
            pending_sync_array_exists: !!parsed.pending_sync,
            pending_sync_length: parsed.pending_sync?.length || 0
        });
        
        if (parsed.pending_sync && parsed.pending_sync.length > 0) {
            console.log('');
            console.log('📤 PENDING SYNC ITEMS:');
            parsed.pending_sync.forEach((item, i) => {
                console.log(`  ${i + 1}. ${item.type}`);
                console.log(`     Synced: ${item.synced}`);
                console.log(`     Endpoint: ${item.endpoint}`);
                console.log(`     Timestamp: ${item.timestamp}`);
            });
        }
    }
    
    // Check sync status function
    console.log('');
    console.log('📊 Calling getSyncStatus():');
    const syncStatus = window.offlineStorage.getSyncStatus();
    console.log('Result:', syncStatus);
    
    // Update UI
    console.log('');
    console.log('🔄 Updating UI...');
    updateWelcomeSyncStatus();
    updateConnectionStatus();
    
    console.log('');
    console.log('🔍 ========================================');
    console.log('');
    
    alert(`Sync Status:\n\nOnline: ${syncStatus.isOnline}\nPending Items: ${syncStatus.pendingItems}\n\nCheck console for full details`);
}