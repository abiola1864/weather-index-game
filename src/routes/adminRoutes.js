const express = require('express');
const router = express.Router();
const { GameSession, GameRound, Respondent, KnowledgeTest, CommunityAssignment } = require('../models/Game');


const {
  getDashboardStats,
  getCommunityAssignments,
  exportCommunityAssignments,
  exportRespondentData,
  getAllRespondents,
  getCommunityProgress,      // ✅ ADD THIS
  exportKnowledgeTests,      // ✅ ADD THIS
  exportPerceptions ,        // ✅ ADD THIS
  checkDataRelationships,  // ✅ ADD THIS
  exportCompleteDataset
} = require('../controllers/adminController');

// ===== NEW DASHBOARD ROUTES =====
router.get('/dashboard/stats', getDashboardStats);
router.get('/respondents', getAllRespondents);
router.get('/communities', getCommunityAssignments);
router.get('/export/communities', exportCommunityAssignments);
router.get('/export/respondents', exportRespondentData);
router.get('/communities/progress', getCommunityProgress);
router.get('/export/knowledge', exportKnowledgeTests);
router.get('/export/perceptions', exportPerceptions);
// Add this with your other export routes
router.get('/export/complete-dataset', exportCompleteDataset);
// Then add this route with your other routes:
router.get('/check-relationships', checkDataRelationships);  // ✅ ADD THIS LINE




// ===== EXISTING ROUTES =====

// GET ALL SESSIONS
router.get('/sessions', async (req, res) => {
  try {
    const sessions = await GameSession.find()
      .populate('respondentId')
      .sort({ startedAt: -1 })
      .limit(100);
    
    res.json({ 
      success: true, 
      data: sessions,
      count: sessions.length 
    });
  } catch (error) {
    console.error('Error fetching sessions:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
});

// GET STATISTICS
router.get('/statistics', async (req, res) => {
  try {
    const stats = {
      totalSessions: await GameSession.countDocuments(),
      completedSessions: await GameSession.countDocuments({ status: 'completed' }),
      inProgressSessions: await GameSession.countDocuments({ status: 'in_progress' }),
      totalRespondents: await Respondent.countDocuments(),
      totalRounds: await GameRound.countDocuments(),
      
      treatmentBreakdown: {
        control: await Respondent.countDocuments({ treatmentGroup: 'control' }),
        fertilizerBundle: await Respondent.countDocuments({ treatmentGroup: 'fertilizer_bundle' }),
        seedlingBundle: await Respondent.countDocuments({ treatmentGroup: 'seedling_bundle' })
      },
      
      genderBreakdown: {
        male: await Respondent.countDocuments({ gender: 'male' }),
        female: await Respondent.countDocuments({ gender: 'female' })
      },
      
      roleBreakdown: {
        husband: await Respondent.countDocuments({ role: 'husband' }),
        wife: await Respondent.countDocuments({ role: 'wife' })
      },
      
      sessionTypeBreakdown: {
        individualHusband: await GameSession.countDocuments({ sessionType: 'individual_husband' }),
        individualWife: await GameSession.countDocuments({ sessionType: 'individual_wife' }),
        coupleJoint: await GameSession.countDocuments({ sessionType: 'couple_joint' })
      }
    };

    res.json({ success: true, data: stats });
  } catch (error) {
    console.error('Error fetching statistics:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
});

// GET SPECIFIC SESSION DETAILS
router.get('/sessions/:sessionId', async (req, res) => {
  try {
    const session = await GameSession.findOne({ 
      sessionId: req.params.sessionId 
    }).populate('respondentId');

    if (!session) {
      return res.status(404).json({
        success: false,
        message: 'Session not found'
      });
    }

    const rounds = await GameRound.find({ 
      sessionId: req.params.sessionId 
    }).sort({ roundNumber: 1 });

    const knowledgeTest = await KnowledgeTest.findOne({
      sessionId: req.params.sessionId
    });

    res.json({
      success: true,
      data: {
        session,
        rounds,
        knowledgeTest
      }
    });
  } catch (error) {
    console.error('Error fetching session details:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
});

// GET ALL HOUSEHOLDS
router.get('/households', async (req, res) => {
  try {
    const households = await Respondent.aggregate([
      {
        $group: {
          _id: '$householdId',
          treatmentGroup: { $first: '$treatmentGroup' },
          communityName: { $first: '$communityName' },
          enumeratorName: { $first: '$enumeratorName' },
          respondentCount: { $sum: 1 },
          respondents: { $push: { _id: '$_id', role: '$role', gender: '$gender' } }
        }
      },
      {
        $sort: { _id: -1 }
      }
    ]);

    for (let household of households) {
      const sessionCount = await GameSession.countDocuments({ 
        householdId: household._id 
      });
      household.sessionCount = sessionCount;
    }

    res.json({
      success: true,
      data: households,
      count: households.length
    });
  } catch (error) {
    console.error('Error fetching households:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
});

// GET HOUSEHOLD DETAILS
router.get('/households/:householdId', async (req, res) => {
  try {
    const { householdId } = req.params;

    const respondents = await Respondent.find({ householdId });
    
    if (respondents.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Household not found'
      });
    }

    const sessions = await GameSession.find({ householdId })
      .populate('respondentId')
      .sort({ startedAt: 1 });

    const sessionIds = sessions.map(s => s.sessionId);
    const rounds = await GameRound.find({
      sessionId: { $in: sessionIds }
    })
    .populate('respondentId')
    .sort({ createdAt: 1 });

    res.json({
      success: true,
      data: {
        householdId,
        treatmentGroup: respondents[0].treatmentGroup,
        communityName: respondents[0].communityName,
        enumeratorName: respondents[0].enumeratorName,
        respondents,
        sessions,
        rounds,
        stats: {
          totalSessions: sessions.length,
          totalRounds: rounds.length,
          completedSessions: sessions.filter(s => s.status === 'completed').length
        }
      }
    });
  } catch (error) {
    console.error('Error fetching household details:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
});

// EXPORT SESSIONS AS CSV
router.get('/export/csv', async (req, res) => {
  try {
    const sessions = await GameSession.find()
      .populate('respondentId')
      .sort({ startedAt: -1 });

    let csv = 'Session ID,Household ID,Community,Enumerator,Respondent ID,Gender,Role,Session Type,Treatment Group,Status,Rounds Completed,Total Earnings,Started At,Completed At\n';

    sessions.forEach(session => {
      const respondent = session.respondentId;
      csv += `"${session.sessionId}",`;
      csv += `"${session.householdId || 'N/A'}",`;
      csv += `"${respondent?.communityName || 'N/A'}",`;
      csv += `"${respondent?.enumeratorName || 'N/A'}",`;
      csv += `"${respondent?.respondentId || 'N/A'}",`;
      csv += `"${respondent?.gender || 'N/A'}",`;
      csv += `"${respondent?.role || 'N/A'}",`;
      csv += `"${session.sessionType || 'N/A'}",`;
      csv += `"${session.treatmentGroup || 'N/A'}",`;
      csv += `"${session.status}",`;
      csv += `${session.roundsCompleted},`;
      csv += `${session.totalEarnings},`;
      csv += `"${session.startedAt}",`;
      csv += `"${session.completedAt || 'N/A'}"\n`;
    });

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=game-sessions.csv');
    res.send(csv);
  } catch (error) {
    console.error('Error exporting CSV:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
});

// EXPORT ROUNDS AS CSV
router.get('/export/rounds-csv', async (req, res) => {
  try {
    const rounds = await GameRound.find()
      .populate('respondentId')
      .sort({ createdAt: -1 });

    let csv = 'Session ID,Household ID,Community,Enumerator,Respondent ID,Gender,Role,Round Number,Is Practice,Budget,Insurance Spend,Bundle Accepted,Bundle Product,Input Choice Type,Input Spend,Education Spend,Consumption Spend,Weather Type,Harvest Outcome,Payout Received,Created At\n';

    rounds.forEach(round => {
      const respondent = round.respondentId;
      csv += `"${round.sessionId}",`;
      csv += `"${respondent?.householdId || 'N/A'}",`;
      csv += `"${respondent?.communityName || 'N/A'}",`;
      csv += `"${respondent?.enumeratorName || 'N/A'}",`;
      csv += `"${respondent?.respondentId || 'N/A'}",`;
      csv += `"${respondent?.gender || 'N/A'}",`;
      csv += `"${respondent?.role || 'N/A'}",`;
      csv += `${round.roundNumber},`;
      csv += `${round.isPracticeRound || false},`;
      csv += `${round.budget},`;
      csv += `${round.insuranceSpend},`;
      csv += `${round.bundleAccepted || false},`;
      csv += `"${round.bundleProduct || 'none'}",`;
      csv += `"${round.inputChoiceType || 'none'}",`;
      csv += `${round.inputSpend},`;
      csv += `${round.educationSpend},`;
      csv += `${round.consumptionSpend},`;
      csv += `"${round.weatherShock?.type || 'N/A'}",`;
      csv += `${round.harvestOutcome},`;
      csv += `${round.payoutReceived},`;
      csv += `"${round.createdAt}"\n`;
    });

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=game-rounds.csv');
    res.send(csv);
  } catch (error) {
    console.error('Error exporting rounds CSV:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
});

// DELETE SESSION
router.delete('/sessions/:sessionId', async (req, res) => {
  try {
    const session = await GameSession.findOneAndDelete({ 
      sessionId: req.params.sessionId 
    });

    if (!session) {
      return res.status(404).json({
        success: false,
        message: 'Session not found'
      });
    }

    await GameRound.deleteMany({ sessionId: req.params.sessionId });
    await KnowledgeTest.deleteOne({ sessionId: req.params.sessionId });

    res.json({
      success: true,
      message: 'Session deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting session:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
});

// DELETE HOUSEHOLD
router.delete('/households/:householdId', async (req, res) => {
  try {
    const { householdId } = req.params;

    await Respondent.deleteMany({ householdId });

    const sessions = await GameSession.find({ householdId });
    const sessionIds = sessions.map(s => s.sessionId);
    
    await GameSession.deleteMany({ householdId });
    await GameRound.deleteMany({ sessionId: { $in: sessionIds } });
    await KnowledgeTest.deleteMany({ sessionId: { $in: sessionIds } });

    res.json({
      success: true,
      message: 'Household and all related data deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting household:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
});


// ===== DELETE ALL DATA (PASSWORD PROTECTED) =====
router.post('/delete-all', async (req, res) => {
  try {
    const { password } = req.body;
    
    // Password protection
    const CORRECT_PASSWORD = 'gme110_ghana';
    
    if (password !== CORRECT_PASSWORD) {
      return res.status(403).json({
        success: false,
        message: 'Incorrect password'
      });
    }
    
    console.log('⚠️ DELETE ALL DATA requested...');
    
    // Get counts before deletion
    const respondentsCount = await Respondent.countDocuments();
    const sessionsCount = await GameSession.countDocuments();
    const roundsCount = await GameRound.countDocuments();
    const knowledgeCount = await KnowledgeTest.countDocuments();
    
    // Import Perception model
    const { Perception } = require('../models/Game');
    const perceptionsCount = await Perception.countDocuments();
    
    // Delete all data (but preserve CommunityAssignments)
    await Respondent.deleteMany({});
    await GameSession.deleteMany({});
    await GameRound.deleteMany({});
    await KnowledgeTest.deleteMany({});
    await Perception.deleteMany({});
    
    console.log('✅ All data deleted successfully');
    console.log(`   - Respondents: ${respondentsCount}`);
    console.log(`   - Sessions: ${sessionsCount}`);
    console.log(`   - Rounds: ${roundsCount}`);
    console.log(`   - Knowledge Tests: ${knowledgeCount}`);
    console.log(`   - Perceptions: ${perceptionsCount}`);
    
    res.json({
      success: true,
      message: 'All data deleted successfully',
      data: {
        respondentsDeleted: respondentsCount,
        sessionsDeleted: sessionsCount,
        roundsDeleted: roundsCount,
        knowledgeDeleted: knowledgeCount,
        perceptionsDeleted: perceptionsCount
      }
    });
  } catch (error) {
    console.error('❌ Error deleting all data:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});


// ===== DELETE ALL DATA (PASSWORD PROTECTED) =====
const { deleteAllData } = require('../controllers/adminController');
router.post('/delete-all', deleteAllData);



module.exports = router;