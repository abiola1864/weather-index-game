const express = require('express');
const router = express.Router();
const gameController = require('../controllers/gameController');

// ===== RESPONDENT ROUTES =====
router.post('/respondent/create', gameController.createRespondent);
router.get('/respondent/:id', gameController.getRespondent);
router.put('/respondent/:id', gameController.updateRespondent);

// ===== SESSION ROUTES =====
router.post('/session/start', gameController.startGameSession);
router.get('/session/:sessionId', gameController.getGameSession);
router.put('/session/:sessionId/complete', gameController.completeGameSession);

// ===== ROUND ROUTES =====
router.post('/round/save', gameController.saveGameRound);
router.get('/round/:sessionId/:roundNumber', gameController.getGameRound);
router.get('/rounds/:sessionId', gameController.getAllRounds);

// ===== KNOWLEDGE TEST ROUTES =====
router.post('/knowledge/submit', gameController.submitKnowledgeTest);
router.get('/knowledge/:respondentId', gameController.getKnowledgeTest);

// ===== COUPLE DECISION ROUTES (SECTION E) =====
router.post('/couple-decision/save', gameController.saveCoupleDecision);
router.get('/couple-decisions/:sessionId', gameController.getCoupleDecisions);

// ===== PERCEPTION ROUTES (SECTION D) =====
router.post('/perception/save', gameController.savePerception);
router.get('/perception/:sessionId', gameController.getPerception);

// ===== TRANSLATIONS ROUTES =====
router.get('/translations/:language', gameController.getTranslations);

module.exports = router;