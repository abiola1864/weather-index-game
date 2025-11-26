const { 
  Respondent, 
  GameRound, 
  KnowledgeTest, 
  CoupleDecision, 
  GameSession,
  Perception 
} = require('../models/Game');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs').promises;
const path = require('path');

// ===== TREATMENT GROUP ASSIGNMENT =====
// This function assigns treatment at the household level
async function assignTreatmentGroup(householdId) {
  // Check if any respondent from this household already exists
  const existingRespondent = await Respondent.findOne({ householdId });
  
  if (existingRespondent) {
    // Use existing household's treatment
    return existingRespondent.treatmentGroup;
  }
  
  // Assign new treatment randomly (equal probability)
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
    
    if (!respondentData.gender) {
      return res.status(400).json({
        success: false,
        message: 'gender is required'
      });
    }
    
    if (!respondentData.role) {
      return res.status(400).json({
        success: false,
        message: 'role is required'
      });
    }
    
    // Generate unique respondent ID if not provided
    if (!respondentData.respondentId) {
      respondentData.respondentId = `R-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    }
    
    // Assign treatment group at household level
    respondentData.treatmentGroup = await assignTreatmentGroup(respondentData.householdId);
    
    console.log(`✅ Assigned treatment: ${respondentData.treatmentGroup} to household ${respondentData.householdId}`);
    
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
    
    // Send detailed error for validation issues
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

// ===== GAME SESSION MANAGEMENT - UPDATED =====

const startGameSession = async (req, res) => {
  try {
    const { respondentId, sessionType } = req.body;
    
    console.log('📥 Starting game session for respondent:', respondentId);

    // Verify respondent exists
    const respondent = await Respondent.findById(respondentId);
    if (!respondent) {
      return res.status(404).json({
        success: false,
        message: 'Respondent not found'
      });
    }

    // Create new session
    const sessionId = uuidv4();
    const session = new GameSession({
      sessionId,
      respondentId,
      householdId: respondent.householdId,
      sessionType: sessionType || 'individual_husband',
      treatmentGroup: respondent.treatmentGroup,
      totalRounds: 4  // CHANGED FROM 3 TO 4
    });

    await session.save();
    
    console.log(`✅ Session created: ${sessionId}`);

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

    session.status = 'completed';
    session.completedAt = new Date();
    await session.save();
    
    console.log(`✅ Session completed: ${session.sessionId}`);

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
    
    console.log('📥 Received round data:', roundData);

    // Validate total spending equals budget
    const totalSpent = 
      (roundData.insuranceSpend || 0) +
      (roundData.inputSpend || 0) +
      (roundData.educationSpend || 0) +
      (roundData.consumptionSpend || 0);

    if (Math.abs(totalSpent - roundData.budget) > 0.01) {
      return res.status(400).json({
        success: false,
        message: 'Total spending must equal budget',
        details: {
          budget: roundData.budget,
          totalSpent,
          difference: roundData.budget - totalSpent
        }
      });
    }

    const gameRound = new GameRound(roundData);
    await gameRound.save();
    
    console.log('✅ Game round saved:', gameRound._id);

    // Calculate total earnings from this round
    const roundEarnings = (gameRound.harvestOutcome || 0) + (gameRound.payoutReceived || 0);

    // Update session statistics
    const updatedSession = await GameSession.findOneAndUpdate(
      { sessionId: roundData.sessionId },
      {
        $inc: {
          roundsCompleted: 1,
          totalEarnings: roundEarnings,
          totalInsuranceSpent: gameRound.insuranceSpend || 0,
          totalPayoutsReceived: gameRound.payoutReceived || 0
        },
        currentRound: roundData.roundNumber + 1
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
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: messages
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Failed to save game round',
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
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
    
    // Calculate knowledge score
    let knowledgeScore = 0;
    if (testData.q1_indexBased === true) knowledgeScore++;
    if (testData.q2_areaWide === true) knowledgeScore++;
    if (testData.q3_profitGuarantee === false) knowledgeScore++; // False is correct answer
    if (testData.q4_upfrontCost === true) knowledgeScore++;
    if (testData.q5_basisRisk === true) knowledgeScore++;
    
    // Add calculated score to test data
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

// ===== COUPLE DECISIONS (SECTION E) =====

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

// ===== PERCEPTION (SECTION D) =====

const savePerception = async (req, res) => {
  try {
    const perceptionData = req.body;
    const perception = new Perception(perceptionData);
    await perception.save();

    res.status(201).json({
      success: true,
      message: 'Perception data saved successfully',
      data: perception
    });
  } catch (error) {
    console.error('Error saving perception:', error);
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
            rounds: "3 Farming Seasons",
            roundsDesc: "Experience different weather conditions",
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
  saveCoupleDecision,
  getCoupleDecisions,
  savePerception,
  getPerception,
  getTranslations
};