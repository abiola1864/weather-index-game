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

module.exports = router;