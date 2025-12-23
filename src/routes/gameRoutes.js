// ===============================================
// GAME ROUTES - COMPLETE WITH PERCEPTION ENDPOINT
// src/routes/gameRoutes.js
// ===============================================

const express = require('express');
const router = express.Router();
const gameController = require('../controllers/gameController');

// ===== RESPONDENT ROUTES =====
router.post('/respondent/create', gameController.createRespondent);
router.get('/respondent/:id', gameController.getRespondent);
router.put('/respondent/:id', gameController.updateRespondent);

// ===== GAME SESSION ROUTES =====
router.post('/session/start', gameController.startGameSession);
router.get('/session/:sessionId', gameController.getGameSession);
router.put('/session/:sessionId/complete', gameController.completeGameSession);

// ===== GAME ROUND ROUTES =====
router.post('/round/save', gameController.saveGameRound);
router.get('/round/:sessionId/:roundNumber', gameController.getGameRound);
router.get('/rounds/:sessionId', gameController.getAllRounds);

// ===== KNOWLEDGE TEST ROUTES =====
router.post('/knowledge/submit', gameController.submitKnowledgeTest);
router.get('/knowledge/:respondentId', gameController.getKnowledgeTest);

// ===== COUPLE INFO ROUTES =====
router.post('/couple/info', gameController.saveCoupleInfo);
router.get('/couple/info/:householdId', gameController.getCoupleInfo);

// ===== COUPLE DECISION ROUTES =====
router.post('/couple/decision', gameController.saveCoupleDecision);
router.get('/couple/decisions/:sessionId', gameController.getCoupleDecisions);

// ===== PERCEPTION ROUTES (NEW: FOR COUPLE SESSION) =====
router.post('/perception/submit', gameController.savePerception);
router.get('/perception/:sessionId', gameController.getPerception);

// ===== TRANSLATION ROUTES =====
router.get('/translations/:language', gameController.getTranslations);


// GET communities list (for dropdown)
// GET communities list (add this if it's not there)
// GET communities list (fetch from database - already randomized)
// GET communities list (fetch from database - already randomized)
router.get('/communities', async (req, res) => {
  try {
    const { CommunityAssignment } = require('../models/Game');
    
    console.log('📋 Fetching communities from database...');
    
    // Fetch all communities from database (already randomized during seeding)
    const dbCommunities = await CommunityAssignment.find()
      .sort({ district: 1, communityName: 1 })
      .lean();
    
    if (dbCommunities && dbCommunities.length > 0) {
      console.log(`✅ Found ${dbCommunities.length} communities in database`);
      
      // Format for frontend
      const formattedCommunities = dbCommunities.map(c => ({
        communityName: c.communityName,
        district: c.district,
        treatmentGroup: c.treatmentGroup,
        targetHouseholds: c.targetHouseholds
      }));
      
      return res.json({
        success: true,
        data: formattedCommunities
      });
    }
    
    // If database is empty, return error (don't use fallback - force proper seeding)
    console.error('❌ No communities in database! Run: node src/scripts/seedCommunities.js');
    
    return res.status(500).json({
      success: false,
      message: 'Communities not seeded. Please run seeding script first.'
    });
    
  } catch (error) {
    console.error('❌ Error fetching communities:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});



module.exports = router;