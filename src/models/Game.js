const mongoose = require('mongoose');

// ===== GAME ROUND SCHEMA - FIXED ENUM VALUES =====
const gameRoundSchema = new mongoose.Schema({
  respondentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Respondent',
    required: true
  },
  sessionId: {
    type: String,
    required: true
  },
  roundNumber: {
    type: Number,
    required: true,
    min: 1,
    max: 4
  },
  isPracticeRound: {
    type: Boolean,
    default: false
  },
  budget: {
    type: Number,
    required: true
  },
  insuranceSpend: {
    type: Number,
    default: 0
  },
  bundleAccepted: {
    type: Boolean,
    default: false
  },
  bundleProduct: {
    type: String,
    enum: ['none', 'fertilizer', 'seeds'], // ✅ FIXED: Added 'seeds' to enum
    default: 'none'
  },
  inputChoiceType: {
    type: String,
    enum: ['', 'seeds', 'fertilizer'], // ✅ This was already correct
    default: ''
  },
  inputSpend: {
    type: Number,
    default: 0
  },
  educationSpend: {
    type: Number,
    default: 0
  },
  consumptionSpend: {
    type: Number,
    default: 0
  },
  decisionContext: {
    type: String,
    enum: ['individual_husband', 'individual_wife', 'couple_joint'],
    required: true
  },
  weatherShock: {
    occurred: { type: Boolean, default: false },
    type: { 
      type: String, 
      enum: ['normal', 'drought', 'flood'],
      default: 'normal'
    },
    severity: { 
      type: String, 
      enum: ['none', 'mild', 'severe', 'moderate'],
      default: 'none'
    }
  },
  harvestOutcome: {
    type: Number,
    default: 0
  },
  payoutReceived: {
    type: Number,
    default: 0
  },
  startTime: {
    type: Date,
    required: true
  },
  endTime: {
    type: Date
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// ===== COMPLETE MODELS FILE =====
// Copy your entire Game.js models file, just replace the gameRoundSchema section above

// ===== RESPONDENT SCHEMA =====
const respondentSchema = new mongoose.Schema({
  householdId: {
    type: String,
    required: true,
    index: true
  },
  respondentId: {
    type: String,
    required: false,  // ✅ CHANGED: Auto-generated, not required on creation
    unique: true,
    sparse: true
  },
  
  // ✅ ADD THESE FIELDS
  communityName: {
    type: String,
    required: true,
    index: true
  },
  enumeratorName: {
    type: String,
    required: true
  },
  
  gender: {
    type: String,
    enum: ['male', 'female'],
    required: true
  },
  role: {
    type: String,
    enum: ['husband', 'wife'],
    required: true
  },
  treatmentGroup: {
    type: String,
    enum: ['control', 'fertilizer_bundle', 'seedling_bundle'],
    required: true
  },
  language: {
    type: String,
    default: 'english'
  },
  sessionDate: {
    type: Date,
    default: Date.now
  },
  
  // Basic demographics
  age: {
    type: Number,
    required: true
  },
  education: {
    type: Number,
    required: true,
    min: 0,
    max: 4
  },
  householdSize: {
    type: Number,
    required: true
  },
  childrenUnder15: {
    type: Number,
    required: true
  },
  
  // Assets - ✅ FIXED: Accept booleans or numbers
  assets: {
    radio: { type: Boolean, default: false },
    tv: { type: Boolean, default: false },
    refrigerator: { type: Boolean, default: false },
    bicycle: { type: Boolean, default: false },
    motorbike: { type: Boolean, default: false },
    mobilePhone: { type: Boolean, default: false },
    generator: { type: Boolean, default: false },
    plough: { type: Boolean, default: false }
  },
  
  // Livestock
  livestock: {
    cattle: { type: Number, default: 0 },
    goats: { type: Number, default: 0 },
    sheep: { type: Number, default: 0 },
    poultry: { type: Number, default: 0 }
  },
  
  // Farming information
  yearsOfFarming: {
    type: Number,
    required: true
  },
  landCultivated: {
    type: Number,
    required: true
  },
  landAccessMethod: {
    type: Number,
    enum: [1, 2, 3, 4, 5],
    required: true
  },
  landAccessOther: String,
  mainCrops: [{
    type: String
  }],
  numberOfCropsPlanted: {
    type: Number,
    required: true
  },
  lastSeasonIncome: {
    type: Number,
    required: true
  },
  farmingInputExpenditure: {
    type: Number,
    required: true
  },
  
  // ✅ FIXED: Changed from improvedInputsUsed to improvedInputs
  improvedInputs: {
    certifiedSeed: { type: Boolean, default: false },
    fertilizer: { type: Boolean, default: false },
    pesticides: { type: Boolean, default: false },
    irrigation: { type: Boolean, default: false }
  },
  
  hasIrrigationAccess: {
    type: Boolean,
    required: true
  },
  
  // ✅ FIXED: Changed from shocksExperienced to shocks
  shocks: {
    drought: { type: Boolean, default: false },
    flood: { type: Boolean, default: false },
    pestsDisease: { type: Boolean, default: false },
    cropPriceFall: { type: Boolean, default: false }
  },
  
  estimatedLossLastYear: {
    type: Number,
    default: 0
  },
  harvestLossPercentage: {
    type: Number,
    min: 0,
    max: 100,
    default: 0
  },
  
  // Savings & Credit
  hasSavings: {
    type: Boolean,
    required: true
  },
  savingsAmount: {
    type: Number,
    default: 0
  },
  borrowedMoney: {
    type: Boolean,
    required: true
  },
  
  // ✅ FIXED: Changed to simple array
  borrowSources: [{
    type: String,
    enum: ['bank', 'microfinance', 'vsla', 'familyFriends', 'moneylender']
  }],
  
  hasOffFarmIncome: {
    type: Boolean,
    required: true
  },
  offFarmIncomeAmount: {
    type: Number,
    default: 0
  },
  
  // Insurance Experience
  priorInsuranceKnowledge: {
    type: Boolean,
    required: true
  },
  purchasedInsuranceBefore: {
    type: Boolean,
    required: true
  },
  insuranceType: String,
  
  // ✅ FIXED: Flattened trust fields
  trustFarmerGroup: {
    type: Number,
    min: 1,
    max: 5,
    required: true
  },
  trustNGO: {
    type: Number,
    min: 1,
    max: 5,
    required: true
  },
  trustInsuranceProvider: {
    type: Number,
    min: 1,
    max: 5,
    required: true
  },
  
  rainfallChangePerception: {
    type: Number,
    min: 1,
    max: 5,
    required: true
  },
  
  insurerPayoutTrust: {
    type: Number,
    min: 1,
    max: 5,
    required: true
  },
  
  // ✅ FIXED: Made optional with default
  communityInsuranceDiscussion: {
    type: Boolean,
    required: false,  // ✅ CHANGE from required: true
    default: false
},
  
  // Social capital
  memberOfFarmerGroup: {
    type: Boolean,
    required: true
  },
  farmerGroupName: String,
  
  // Access & Market
  distanceToMarket: {
    type: Number,
    required: true
  },
  distanceToInsurer: {
    type: Number,
    required: true
  },
  
  // ✅ FIXED: Made optional with default
 extensionVisits: {
    type: Boolean,
    required: false,  // ✅ CHANGE from required: true
    default: false
},

 numberOfExtensionVisits: {
    type: Number,
    default: 0
},
  usesMobileMoney: {
    type: Boolean,
    required: true
  },
  
  // Risk & Empowerment
  riskPreference: {
    type: Number,
    min: 1,
    max: 2
  },
  riskComfort: {
    type: Number,
    min: 1,
    max: 5
  },
  decisionMaker: {
    type: Number,
    min: 1,
    max: 4
  },
  empowermentScores: {
    cropDecisions: { type: Number, min: 1, max: 5 },
    moneyDecisions: { type: Number, min: 1, max: 5 },
    inputDecisions: { type: Number, min: 1, max: 5 },
    opinionConsidered: { type: Number, min: 1, max: 5 },
    confidenceExpressing: { type: Number, min: 1, max: 5 }
  },
  
  createdAt: {
    type: Date,
    default: Date.now
  }
});




// ===== COMMUNITY ASSIGNMENT SCHEMA =====
const communityAssignmentSchema = new mongoose.Schema({
  communityName: {
    type: String,
    required: true,
    unique: true
  },
  district: {
    type: String,
    enum: ['Savelugu Municipal', 'Nanton District'],
    required: true
  },
  treatmentGroup: {
    type: String,
    enum: ['control', 'fertilizer_bundle', 'seedling_bundle'],
    required: true
  },
  targetHouseholds: {
    type: Number,
    default: 100
  },
  completedHouseholds: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const CommunityAssignment = mongoose.model('CommunityAssignment', communityAssignmentSchema);


// ===== GAME SESSION SCHEMA =====
const gameSessionSchema = new mongoose.Schema({
  sessionId: {
    type: String,
    required: true,
    unique: true
  },
  respondentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Respondent',
    required: true
  },
  householdId: {
    type: String,
    required: true,
    index: true
  },
  sessionType: {
    type: String,
    enum: ['individual_husband', 'individual_wife', 'couple_joint'],
    required: true
  },
  treatmentGroup: {
    type: String,
    enum: ['control', 'fertilizer_bundle', 'seedling_bundle'],
    required: true
  },
  coupleInfo: {
    marriageDuration: { type: Number },
    numberOfChildren: { type: Number },
    savedAt: { type: Date }
  },
  status: {
    type: String,
    enum: ['in_progress', 'completed', 'abandoned'],
    default: 'in_progress'
  },
  totalRounds: {
    type: Number,
    default: 4
  },
  roundsCompleted: {
    type: Number,
    default: 0
  },
  currentRound: {
    type: Number,
    default: 1
  },
  totalEarnings: {
    type: Number,
    default: 0
  },
  totalInsuranceSpent: {
    type: Number,
    default: 0
  },
  totalPayoutsReceived: {
    type: Number,
    default: 0
  },
  startedAt: {
    type: Date,
    default: Date.now
  },
  completedAt: {
    type: Date
  }
});

// ===== KNOWLEDGE TEST SCHEMA =====
const knowledgeTestSchema = new mongoose.Schema({
  respondentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Respondent',
    required: true
  },
  sessionId: {
    type: String,
    required: true
  },
  q1_indexBased: {
    type: Boolean,
    required: true
  },
  q2_areaWide: {
    type: Boolean,
    required: true
  },
  q3_profitGuarantee: {
    type: Boolean,
    required: true
  },
  q4_upfrontCost: {
    type: Boolean,
    required: true
  },
  q5_basisRisk: {
    type: Boolean,
    required: true
  },
  knowledgeScore: {
    type: Number,
    min: 0,
    max: 5
  },
  completedAt: {
    type: Date,
    default: Date.now
  }
});

// ===== COUPLE DECISION SCHEMA =====
const coupleDecisionSchema = new mongoose.Schema({
  respondentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Respondent',
    required: true
  },
  sessionId: {
    type: String,
    required: true
  },
  roundNumber: {
    type: Number,
    required: true,
    min: 1,
    max: 4
  },
  finalSay: {
    type: Number,
    required: true,
    min: 1,
    max: 3
  },
  satisfaction: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// ===== PERCEPTION SCHEMA =====
const perceptionSchema = new mongoose.Schema({
  respondentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Respondent',
    required: true
  },
  sessionId: {
    type: String,
    required: true
  },
  householdId: {
    type: String,
    required: true
  },
  bundleInfluence: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  insuranceUnderstanding: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  willingnessToPay: {
    type: Boolean,
    required: true
  },
  recommendToOthers: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  perceivedFairness: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  trustInPayout: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  bundleValuePerception: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  futureUseLikelihood: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});



// ===== INDEXES =====
respondentSchema.index({ householdId: 1, role: 1 });
gameSessionSchema.index({ householdId: 1, sessionType: 1 });
gameRoundSchema.index({ sessionId: 1, roundNumber: 1 });
knowledgeTestSchema.index({ respondentId: 1 });
coupleDecisionSchema.index({ sessionId: 1, roundNumber: 1 });
perceptionSchema.index({ sessionId: 1 });

// ===== MODELS =====
const Respondent = mongoose.model('Respondent', respondentSchema);
const GameSession = mongoose.model('GameSession', gameSessionSchema);
const GameRound = mongoose.model('GameRound', gameRoundSchema);
const KnowledgeTest = mongoose.model('KnowledgeTest', knowledgeTestSchema);
const CoupleDecision = mongoose.model('CoupleDecision', coupleDecisionSchema);
const Perception = mongoose.model('Perception', perceptionSchema);

module.exports = {
  Respondent,
  GameSession,
  GameRound,
  KnowledgeTest,
  CoupleDecision,
  Perception,
  CommunityAssignment 
};