const mongoose = require('mongoose');

// ===== RESPONDENT SCHEMA =====
const respondentSchema = new mongoose.Schema({
  householdId: {
    type: String,
    required: true,
    index: true  // Changed from unique to allow multiple respondents per household
  },
  respondentId: {
    type: String,
    required: true,
    unique: true
  },
  // NEW: Gender and Role fields
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
  // NEW: Treatment group (assigned at household level)
  treatmentGroup: {
    type: String,
    enum: ['control', 'fertilizer_bundle', 'seedling_bundle'],
    required: true
  },
  enumeratorId: {
    type: String,
    required: false
  },
  communityCode: {
    type: String,
    required: false
  },
  sessionDate: {
    type: Date,
    required: false
  },
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
  yearsOfFarming: {
    type: Number,
    required: true
  },
  landCultivated: {
    type: Number,
    required: true
  },
  mainCrops: [{
    type: String
  }],
  lastSeasonIncome: {
    type: Number,
    required: true
  },
  priorInsuranceKnowledge: {
    type: Boolean,
    required: true
  },
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
  language: {
    type: String,
    default: 'english'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

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
  // NEW: Household ID for tracking couple sessions
  householdId: {
    type: String,
    required: true,
    index: true
  },
  // NEW: Session type
  sessionType: {
    type: String,
    enum: ['individual_husband', 'individual_wife', 'couple_joint'],
    required: true
  },
  // NEW: Treatment group (copied from respondent for easier querying)
  treatmentGroup: {
    type: String,
    enum: ['control', 'fertilizer_bundle', 'seedling_bundle'],
    required: true
  },
  status: {
    type: String,
    enum: ['in_progress', 'completed', 'abandoned'],
    default: 'in_progress'
  },
  totalRounds: {
    type: Number,
    default: 4  // ✅ CHANGED FROM 3 TO 4
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

// ===== GAME ROUND SCHEMA =====
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
    max: 4  // ✅ CHANGED FROM 3 TO 4
  },
  // NEW: Practice round flag
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
  // NEW: Bundle fields
  bundleAccepted: {
    type: Boolean,
    default: false
  },
  bundleProduct: {
    type: String,
    enum: ['none', 'fertilizer', 'seedling'],
    default: 'none'
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

// ===== COUPLE DECISION SCHEMA (Section E) =====
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
    max: 4,  // ✅ CHANGED FROM 3 TO 4
    // 1 = Husband, 2 = Wife, 3 = Both equally
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

// ===== PERCEPTION SCHEMA (Section D) =====
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
  understanding: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  coupleDifficulty: {
    type: Number,
    min: 1,
    max: 5,
    required: false
    // Only for couple context
  },
  bundleValue: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  purchaseIntent: {
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
  Perception
};