// ===============================================
// GAME CONTROLLER - COMPLETE FIXED VERSION
// WITH PERCEPTION HANDLING
// ===============================================

const { 
  Respondent, 
  GameRound, 
  KnowledgeTest, 
  CoupleDecision, 
  GameSession,
  Perception,
    CommunityAssignment
} = require('../models/Game');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs').promises;
const path = require('path');

// ===== TREATMENT GROUP ASSIGNMENT =====
async function assignTreatmentGroup(householdId) {
  const existingRespondent = await Respondent.findOne({ householdId });
  
  if (existingRespondent) {
    return existingRespondent.treatmentGroup;
  }
  
  const treatments = ['control', 'fertilizer_bundle', 'seedling_bundle'];
  const randomIndex = Math.floor(Math.random() * treatments.length);
  return treatments[randomIndex];
}

// ===== RESPONDENT MANAGEMENT =====

const createRespondent = async (req, res) => {
  try {
    const respondentData = req.body;
    
    console.log('📥 Received respondent data:', respondentData);
    
    // Validate required fields
    if (!respondentData.householdId) {
      return res.status(400).json({
        success: false,
        message: 'householdId is required'
      });
    }
    
    if (!respondentData.communityName) {
      return res.status(400).json({
        success: false,
        message: 'communityName is required - enumerator must select community'
      });
    }
    
    if (!respondentData.gender || !respondentData.role) {
      return res.status(400).json({
        success: false,
        message: 'gender and role are required'
      });
    }
    
    // Get treatment from community
    const { CommunityAssignment } = require('../models/Game');
    const communityAssignment = await CommunityAssignment.findOne({ 
      communityName: respondentData.communityName 
    });
    
    if (!communityAssignment) {
      return res.status(400).json({
        success: false,
        message: `Community "${respondentData.communityName}" not found in assignments. Please select a valid community.`
      });
    }
    
    // Assign treatment based on community
    respondentData.treatmentGroup = communityAssignment.treatmentGroup;
    
    console.log(`✅ Community: ${respondentData.communityName}`);
    console.log(`✅ Auto-assigned treatment: ${respondentData.treatmentGroup}`);
    
    // ✅ Generate respondentId if not provided
    if (!respondentData.respondentId) {
      respondentData.respondentId = `R-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    }
    
    const respondent = new Respondent(respondentData);
    await respondent.save();
    
    console.log(`✅ Respondent created: ${respondent._id}`);

    res.status(201).json({
      success: true,
      message: 'Respondent created successfully',
      data: respondent
    });
  } catch (error) {
    console.error('❌ Error creating respondent:', error);
    
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: messages
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Failed to create respondent',
      error: error.message
    });
  }
};





const getRespondent = async (req, res) => {
  try {
    const respondent = await Respondent.findById(req.params.id);
    
    if (!respondent) {
      return res.status(404).json({
        success: false,
        message: 'Respondent not found'
      });
    }

    res.json({
      success: true,
      data: respondent
    });
  } catch (error) {
    console.error('Error fetching respondent:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch respondent',
      error: error.message
    });
  }
};

const updateRespondent = async (req, res) => {
  try {
    const respondent = await Respondent.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!respondent) {
      return res.status(404).json({
        success: false,
        message: 'Respondent not found'
      });
    }

    res.json({
      success: true,
      message: 'Respondent updated successfully',
      data: respondent
    });
  } catch (error) {
    console.error('Error updating respondent:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update respondent',
      error: error.message
    });
  }
};

// ===== GAME SESSION MANAGEMENT =====

const startGameSession = async (req, res) => {
  try {
    const { respondentId, sessionType } = req.body;
    
    console.log('📥 Starting game session for respondent:', respondentId);

    const respondent = await Respondent.findById(respondentId);
    if (!respondent) {
      return res.status(404).json({
        success: false,
        message: 'Respondent not found'
      });
    }

    const sessionId = uuidv4();
    const session = new GameSession({
      sessionId,
      respondentId,
      householdId: respondent.householdId,
      sessionType: sessionType || 'individual_husband',
      treatmentGroup: respondent.treatmentGroup,
      totalRounds: 4
    });

    await session.save();
    
    console.log(`✅ Session created: ${sessionId}, Type: ${sessionType}`);

    res.status(201).json({
      success: true,
      message: 'Game session started',
      data: session
    });
  } catch (error) {
    console.error('❌ Error starting game session:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to start game session',
      error: error.message
    });
  }
};

const getGameSession = async (req, res) => {
  try {
    const session = await GameSession.findOne({ 
      sessionId: req.params.sessionId 
    }).populate('respondentId');

    if (!session) {
      return res.status(404).json({
        success: false,
        message: 'Game session not found'
      });
    }

    res.json({
      success: true,
      data: session
    });
  } catch (error) {
    console.error('Error fetching game session:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch game session',
      error: error.message
    });
  }
};





const completeGameSession = async (req, res) => {
  try {
    const session = await GameSession.findOne({ 
      sessionId: req.params.sessionId 
    });

    if (!session) {
      return res.status(404).json({
        success: false,
        message: 'Game session not found'
      });
    }

    // ✅ FIX: Use correct field name from schema
    session.status = 'completed';  // ← FIXED!
    session.completedAt = new Date();
    await session.save();
    
    console.log(`✅ Session completed: ${session.sessionId}`);
    console.log(`   Session type: ${session.sessionType}`);
    console.log(`   Status: ${session.status}`);  // ← Updated log

    res.json({
      success: true,
      message: 'Game session completed',
      data: session
    });
  } catch (error) {
    console.error('Error completing game session:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to complete game session',
      error: error.message
    });
  }
};

// ===== GAME ROUND MANAGEMENT =====

const saveGameRound = async (req, res) => {
  try {
    const roundData = req.body;
    
    console.log('📥 Received round data:');
    console.log('  - respondentId:', roundData.respondentId);
    console.log('  - sessionId:', roundData.sessionId);
    console.log('  - roundNumber:', roundData.roundNumber);
    console.log('  - budget:', roundData.budget);
    console.log('  - decisionContext:', roundData.decisionContext);

    if (!roundData.respondentId) {
      return res.status(400).json({
        success: false,
        message: 'respondentId is required'
      });
    }

    if (!roundData.sessionId) {
      return res.status(400).json({
        success: false,
        message: 'sessionId is required'
      });
    }

    const sanitizedRoundData = {
      respondentId: roundData.respondentId,
      sessionId: roundData.sessionId,
      roundNumber: parseInt(roundData.roundNumber) || 1,
      isPracticeRound: Boolean(roundData.isPracticeRound),
      budget: parseFloat(roundData.budget) || 0,
      insuranceSpend: parseFloat(roundData.insuranceSpend) || 0,
      bundleAccepted: Boolean(roundData.bundleAccepted),
      bundleProduct: roundData.bundleProduct || 'none',
      inputSpend: parseFloat(roundData.inputSpend) || 0,
      educationSpend: parseFloat(roundData.educationSpend) || 0,
      consumptionSpend: parseFloat(roundData.consumptionSpend) || 0,
      decisionContext: roundData.decisionContext || 'individual_husband',
      weatherShock: {
        occurred: Boolean(roundData.weatherShock?.occurred),
        type: roundData.weatherShock?.type || 'normal',
        severity: roundData.weatherShock?.severity || 'none'
      },
      harvestOutcome: parseFloat(roundData.harvestOutcome) || 0,
      payoutReceived: parseFloat(roundData.payoutReceived) || 0,
      startTime: roundData.startTime ? new Date(roundData.startTime) : new Date(),
      endTime: roundData.endTime ? new Date(roundData.endTime) : undefined
    };

    console.log('✅ Sanitized round data');

    const totalSpent = 
      sanitizedRoundData.insuranceSpend +
      sanitizedRoundData.inputSpend +
      sanitizedRoundData.educationSpend +
      sanitizedRoundData.consumptionSpend;

    console.log(`💰 Budget validation: ${sanitizedRoundData.budget} vs ${totalSpent}`);

    if (Math.abs(totalSpent - sanitizedRoundData.budget) > 0.01) {
      console.error('❌ Budget validation failed');
      
      return res.status(400).json({
        success: false,
        message: 'Total spending must equal budget',
        details: {
          budget: sanitizedRoundData.budget,
          totalSpent,
          difference: sanitizedRoundData.budget - totalSpent
        }
      });
    }

    console.log('✅ Budget validation passed');

    const gameRound = new GameRound(sanitizedRoundData);
    
    console.log('💾 Attempting to save game round...');
    await gameRound.save();
    
    console.log('✅ Game round saved successfully:', gameRound._id);

    const roundEarnings = gameRound.harvestOutcome + gameRound.payoutReceived;

    const updatedSession = await GameSession.findOneAndUpdate(
      { sessionId: roundData.sessionId },
      {
        $inc: {
          roundsCompleted: 1,
          totalEarnings: roundEarnings,
          totalInsuranceSpent: gameRound.insuranceSpend,
          totalPayoutsReceived: gameRound.payoutReceived
        },
        currentRound: sanitizedRoundData.roundNumber + 1
      },
      { new: true }
    );

    console.log('✅ Session updated:', updatedSession?.sessionId);

    res.status(201).json({
      success: true,
      message: 'Game round saved successfully',
      data: gameRound
    });
  } catch (error) {
    console.error('❌ Error saving game round:', error);
    
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      console.error('❌ Validation errors:', messages);
      
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: messages
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Failed to save game round',
      error: error.message
    });
  }
};

const getGameRound = async (req, res) => {
  try {
    const { sessionId, roundNumber } = req.params;
    
    const round = await GameRound.findOne({
      sessionId,
      roundNumber: parseInt(roundNumber)
    });

    if (!round) {
      return res.status(404).json({
        success: false,
        message: 'Game round not found'
      });
    }

    res.json({
      success: true,
      data: round
    });
  } catch (error) {
    console.error('Error fetching game round:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch game round',
      error: error.message
    });
  }
};

const getAllRounds = async (req, res) => {
  try {
    const rounds = await GameRound.find({
      sessionId: req.params.sessionId
    }).sort({ roundNumber: 1 });

    res.json({
      success: true,
      data: rounds,
      count: rounds.length
    });
  } catch (error) {
    console.error('Error fetching game rounds:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch game rounds',
      error: error.message
    });
  }
};

// ===== KNOWLEDGE TEST =====

const submitKnowledgeTest = async (req, res) => {
  try {
    const testData = req.body;
    
    let knowledgeScore = 0;
    if (testData.q1_indexBased === true) knowledgeScore++;
    if (testData.q2_areaWide === true) knowledgeScore++;
    if (testData.q3_profitGuarantee === false) knowledgeScore++;
    if (testData.q4_upfrontCost === true) knowledgeScore++;
    if (testData.q5_basisRisk === true) knowledgeScore++;
    
    testData.knowledgeScore = knowledgeScore;
    
    const knowledgeTest = new KnowledgeTest(testData);
    await knowledgeTest.save();
    
    console.log(`✅ Knowledge test saved. Score: ${knowledgeScore}/5`);

    res.status(201).json({
      success: true,
      message: 'Knowledge test submitted successfully',
      data: knowledgeTest
    });
  } catch (error) {
    console.error('Error submitting knowledge test:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to submit knowledge test',
      error: error.message
    });
  }
};

const getKnowledgeTest = async (req, res) => {
  try {
    const test = await KnowledgeTest.findOne({
      respondentId: req.params.respondentId
    }).sort({ completedAt: -1 });

    if (!test) {
      return res.status(404).json({
        success: false,
        message: 'Knowledge test not found'
      });
    }

    res.json({
      success: true,
      data: test
    });
  } catch (error) {
    console.error('Error fetching knowledge test:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch knowledge test',
      error: error.message
    });
  }
};

// ===== COUPLE INFO =====

const saveCoupleInfo = async (req, res) => {
  try {
    const { householdId, marriageDuration, numberOfChildren } = req.body;
    
    console.log('📥 Saving couple info for household:', householdId);
    
    if (!householdId) {
      return res.status(400).json({
        success: false,
        message: 'householdId is required'
      });
    }
    
    if (!marriageDuration || numberOfChildren === undefined) {
      return res.status(400).json({
        success: false,
        message: 'marriageDuration and numberOfChildren are required'
      });
    }
    
    let coupleSession = await GameSession.findOne({
      householdId,
      sessionType: 'couple_joint'
    });
    
    if (!coupleSession) {
      console.log('⚠️ No couple session found yet, will be saved later');
      return res.status(201).json({
        success: true,
        message: 'Couple information saved (session will be created)',
        data: { marriageDuration, numberOfChildren }
      });
    }
    
    coupleSession.coupleInfo = {
      marriageDuration,
      numberOfChildren,
      savedAt: new Date()
    };
    
    await coupleSession.save();
    
    console.log('✅ Couple info saved successfully');
    
    res.status(201).json({
      success: true,
      message: 'Couple information saved successfully',
      data: coupleSession.coupleInfo
    });
  } catch (error) {
    console.error('❌ Error saving couple info:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to save couple information',
      error: error.message
    });
  }
};

const getCoupleInfo = async (req, res) => {
  try {
    const { householdId } = req.params;
    
    const coupleSession = await GameSession.findOne({
      householdId,
      sessionType: 'couple_joint'
    });
    
    if (!coupleSession || !coupleSession.coupleInfo) {
      return res.status(404).json({
        success: false,
        message: 'Couple information not found'
      });
    }
    
    res.json({
      success: true,
      data: coupleSession.coupleInfo
    });
  } catch (error) {
    console.error('Error fetching couple info:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch couple information',
      error: error.message
    });
  }
};

// ===== COUPLE DECISIONS =====

const saveCoupleDecision = async (req, res) => {
  try {
    const decisionData = req.body;
    const decision = new CoupleDecision(decisionData);
    await decision.save();

    res.status(201).json({
      success: true,
      message: 'Couple decision saved successfully',
      data: decision
    });
  } catch (error) {
    console.error('Error saving couple decision:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to save couple decision',
      error: error.message
    });
  }
};

const getCoupleDecisions = async (req, res) => {
  try {
    const decisions = await CoupleDecision.find({
      sessionId: req.params.sessionId
    }).sort({ roundNumber: 1 });

    res.json({
      success: true,
      data: decisions,
      count: decisions.length
    });
  } catch (error) {
    console.error('Error fetching couple decisions:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch couple decisions',
      error: error.message
    });
  }
};

// ===== PERCEPTION (NEW: FOR COUPLE SESSION) =====
// ===== SAVE PERCEPTION ASSESSMENT (COUPLE SESSION) =====
const savePerception = async (req, res) => {
  try {
    console.log('📝 Saving perception assessment...');
    console.log('Request body:', req.body);
    
    const {
      sessionId,
      bundleInfluence,
      insuranceUnderstanding,
      willingnessToPay,
      recommendToOthers,
      perceivedFairness,
      trustInPayout,
      bundleValuePerception,
      futureUseLikelihood
    } = req.body;
    
    // Validate required fields
    if (!sessionId) {
      return res.status(400).json({
        success: false,
        message: 'Session ID is required'
      });
    }
    
    // Find the session to get respondentId and householdId
    const session = await GameSession.findOne({ sessionId });
    
    if (!session) {
      return res.status(404).json({
        success: false,
        message: `Session not found: ${sessionId}`
      });
    }
    
    console.log('✅ Session found:', session.sessionId);
    console.log('  - respondentId:', session.respondentId);
    console.log('  - householdId:', session.householdId);
    
    // Create perception record with all required fields
    const perception = new Perception({
      respondentId: session.respondentId,  // ✅ Get from session
      sessionId: sessionId,
      householdId: session.householdId,    // ✅ Get from session
      bundleInfluence: parseInt(bundleInfluence),
      insuranceUnderstanding: parseInt(insuranceUnderstanding),
      willingnessToPay: willingnessToPay === true || willingnessToPay === 'true',
      recommendToOthers: parseInt(recommendToOthers),
      perceivedFairness: parseInt(perceivedFairness),
      trustInPayout: parseInt(trustInPayout),
      bundleValuePerception: parseInt(bundleValuePerception),
      futureUseLikelihood: parseInt(futureUseLikelihood)
    });
    
    await perception.save();
    
    console.log('✅ Perception assessment saved:', perception._id);
    
    res.status(201).json({
      success: true,
      message: 'Perception assessment saved successfully',
      data: perception
    });
    
  } catch (error) {
    console.error('❌ Error saving perception:', error);
    console.error('Error stack:', error.stack);
    
    // More detailed error for validation issues
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: messages
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Failed to save perception data',
      error: error.message
    });
  }
};



const getPerception = async (req, res) => {
  try {
    const perception = await Perception.findOne({
      sessionId: req.params.sessionId
    });

    if (!perception) {
      return res.status(404).json({
        success: false,
        message: 'Perception data not found'
      });
    }

    res.json({
      success: true,
      data: perception
    });
  } catch (error) {
    console.error('Error fetching perception:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch perception data',
      error: error.message
    });
  }
};

// ===== TRANSLATIONS =====

const getTranslations = async (req, res) => {
  try {
    const { language } = req.params;
    const validLanguages = ['english', 'dagbani'];

    if (!validLanguages.includes(language.toLowerCase())) {
      return res.status(400).json({
        success: false,
        message: 'Invalid language specified'
      });
    }

    const filePath = path.join(
      __dirname, 
      '..', 
      '..', 
      'public', 
      'translations', 
      `${language.toLowerCase()}.json`
    );

    try {
      const translations = await fs.readFile(filePath, 'utf8');
      res.json({
        success: true,
        data: JSON.parse(translations)
      });
    } catch (fileError) {
      console.warn(`Translation file not found for ${language}, using defaults`);
      
      const defaultTranslations = {
        english: {
          welcome: {
            title: "Welcome Farmer!",
            subtitle: "Learn about Weather Index Insurance through interactive gameplay",
            seasons: "4 Farming Seasons",
            seasonsDesc: "Experience different challenges each season",
            insurance: "Insurance Protection",
            insuranceDesc: "Protect your harvest from weather risks",
            earnings: "Real Learning",
            earningsDesc: "Make decisions and see results",
            startBtn: "Start Game"
          },
          common: {
            continue: "Continue",
            loading: "Loading..."
          }
        },
        dagbani: {
          welcome: {
            title: "Antukuliya!",
            subtitle: "Ka ŋun yɛli Weather Index Insurance",
            startBtn: "Pili"
          }
        }
      };

      res.json({
        success: true,
        data: defaultTranslations[language] || defaultTranslations.english
      });
    }
  } catch (error) {
    console.error('Error loading translations:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to load translations',
      error: error.message
    });
  }
};

// ===== EXPORTS =====
module.exports = {
  createRespondent,
  getRespondent,
  updateRespondent,
  startGameSession,
  getGameSession,
  completeGameSession,
  saveGameRound,
  getGameRound,
  getAllRounds,
  submitKnowledgeTest,
  getKnowledgeTest,
  saveCoupleInfo,
  getCoupleInfo,
  saveCoupleDecision,
  getCoupleDecisions,
  savePerception,
  getPerception,
  getTranslations
};