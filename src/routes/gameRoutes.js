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
router.get('/communities', async (req, res) => {
  try {
    console.log('📋 Fetching communities list...');
    
    const communities = [
      // CONTROL GROUP (10 communities)
      { communityName: 'Kpalsabogu', district: 'Tolon', treatmentGroup: 'control', targetHouseholds: 10 },
      { communityName: 'Nyankpala', district: 'Tolon', treatmentGroup: 'control', targetHouseholds: 10 },
      { communityName: 'Wantugu', district: 'Tolon', treatmentGroup: 'control', targetHouseholds: 10 },
      { communityName: 'Tuunayili', district: 'Kumbungu', treatmentGroup: 'control', targetHouseholds: 10 },
      { communityName: 'Kpalguni', district: 'Kumbungu', treatmentGroup: 'control', targetHouseholds: 10 },
      { communityName: 'Kumbuyili', district: 'Kumbungu', treatmentGroup: 'control', targetHouseholds: 10 },
      { communityName: 'Zantani', district: 'Gushegu', treatmentGroup: 'control', targetHouseholds: 10 },
      { communityName: 'Kpanshegu', district: 'Gushegu', treatmentGroup: 'control', targetHouseholds: 10 },
      { communityName: 'Nabogo', district: 'Gushegu', treatmentGroup: 'control', targetHouseholds: 10 },
      { communityName: 'Tampion', district: 'Gushegu', treatmentGroup: 'control', targetHouseholds: 10 },
      
      // FERTILIZER BUNDLE GROUP (10 communities)
      { communityName: 'Voggu', district: 'Tolon', treatmentGroup: 'fertilizer_bundle', targetHouseholds: 10 },
      { communityName: 'Kpendua', district: 'Tolon', treatmentGroup: 'fertilizer_bundle', targetHouseholds: 10 },
      { communityName: 'Gbullung', district: 'Tolon', treatmentGroup: 'fertilizer_bundle', targetHouseholds: 10 },
      { communityName: 'Zangbalun', district: 'Tolon', treatmentGroup: 'fertilizer_bundle', targetHouseholds: 10 },
      { communityName: 'Gbulung', district: 'Kumbungu', treatmentGroup: 'fertilizer_bundle', targetHouseholds: 10 },
      { communityName: 'Kasuliyili', district: 'Kumbungu', treatmentGroup: 'fertilizer_bundle', targetHouseholds: 10 },
      { communityName: 'Kpanvo', district: 'Kumbungu', treatmentGroup: 'fertilizer_bundle', targetHouseholds: 10 },
      { communityName: 'Nanton', district: 'Gushegu', treatmentGroup: 'fertilizer_bundle', targetHouseholds: 10 },
      { communityName: 'Kpatinga', district: 'Gushegu', treatmentGroup: 'fertilizer_bundle', targetHouseholds: 10 },
      { communityName: 'Nakpanduri', district: 'Gushegu', treatmentGroup: 'fertilizer_bundle', targetHouseholds: 10 },
      
      // SEEDLING BUNDLE GROUP (10 communities)
      { communityName: 'Lingbunga', district: 'Tolon', treatmentGroup: 'seedling_bundle', targetHouseholds: 10 },
      { communityName: 'Kpalbusi', district: 'Tolon', treatmentGroup: 'seedling_bundle', targetHouseholds: 10 },
      { communityName: 'Wayamba', district: 'Tolon', treatmentGroup: 'seedling_bundle', targetHouseholds: 10 },
      { communityName: 'Yoggu', district: 'Tolon', treatmentGroup: 'seedling_bundle', targetHouseholds: 10 },
      { communityName: 'Tindan', district: 'Kumbungu', treatmentGroup: 'seedling_bundle', targetHouseholds: 10 },
      { communityName: 'Gbulahagu', district: 'Kumbungu', treatmentGroup: 'seedling_bundle', targetHouseholds: 10 },
      { communityName: 'Kpalguni II', district: 'Kumbungu', treatmentGroup: 'seedling_bundle', targetHouseholds: 10 },
      { communityName: 'Zakpalsi', district: 'Gushegu', treatmentGroup: 'seedling_bundle', targetHouseholds: 10 },
      { communityName: 'Kpachi', district: 'Gushegu', treatmentGroup: 'seedling_bundle', targetHouseholds: 10 },
      { communityName: 'Gushegu', district: 'Gushegu', treatmentGroup: 'seedling_bundle', targetHouseholds: 10 }
    ];
    
    console.log(`✅ Returning ${communities.length} communities`);
    
    res.json({
      success: true,
      data: communities
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