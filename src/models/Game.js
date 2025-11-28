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
    required: true,
    unique: true
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
  Perception
};