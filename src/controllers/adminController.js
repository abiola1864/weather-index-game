
require('dotenv').config();

const { Respondent, GameSession, GameRound, KnowledgeTest, CommunityAssignment, Perception } = require('../models/Game');




// Get dashboard statistics
// ===== GET DASHBOARD STATS =====
// ===== GET DASHBOARD STATS - IMPROVED =====
const getDashboardStats = async (req, res) => {
  try {
    console.log('📊 Loading dashboard stats...');
    
    // Get all respondents
    const allRespondents = await Respondent.find().lean();
    const totalRespondents = allRespondents.length;
    const uniqueHouseholds = [...new Set(allRespondents.map(r => r.householdId))].length;
    
    // Count completed games (those with completed sessions AND knowledge test)
    const completedRespondentIds = await GameSession.distinct('respondentId', { 
      status: 'completed' 
    });
    
    // Check which of those also have knowledge test (truly complete)
    const completedWithKnowledge = await KnowledgeTest.distinct('respondentId', {
      respondentId: { $in: completedRespondentIds }
    });
    
    const completedSessions = completedWithKnowledge.length;
    
    // In progress = has started a session but hasn't completed everything
    const startedSessions = await GameSession.distinct('respondentId');
    const inProgressSessions = startedSessions.length - completedSessions;
    
    // Treatment breakdown (actual respondents)
    const treatmentCounts = await Respondent.aggregate([
      {
        $group: {
          _id: '$treatmentGroup',
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);
    
    // Community breakdown
    const communityCounts = await Respondent.aggregate([
      {
        $group: {
          _id: '$communityName',
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } }
    ]);
    
    // Enumerator breakdown
    const enumeratorCounts = await Respondent.aggregate([
      {
        $match: { enumeratorName: { $ne: null, $ne: '' } }
      },
      {
        $group: {
          _id: '$enumeratorName',
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } }
    ]);
    
    res.json({
      success: true,
      data: {
        overview: {
          totalRespondents,
          uniqueHouseholds,
          completedSessions,
          inProgressSessions
        },
        treatmentCounts,
        communityCounts,
        enumeratorCounts
      }
    });
    
  } catch (error) {
    console.error('❌ Error loading dashboard stats:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};




// Get all respondents with filters
// ===== GET ALL RESPONDENTS WITH PROPER STATUS =====
const getAllRespondents = async (req, res) => {
  try {
    const { community, treatment, enumerator, status, limit = 50 } = req.query;
    
    // Build query
    const query = {};
    if (community) query.communityName = community;
    if (treatment) query.treatmentGroup = treatment;
    if (enumerator) query.enumeratorName = enumerator;
    
    // Get respondents
    let respondents = await Respondent.find(query)
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .lean();
    
    // Get completion status for each
    for (let respondent of respondents) {
      // Check if they have a completed session
      const completedSession = await GameSession.findOne({
        respondentId: respondent._id,
        status: 'completed'
      });
      
      // Check if they have knowledge test (truly complete)
      const hasKnowledge = await KnowledgeTest.findOne({
        respondentId: respondent._id
      });
      
      // Determine status
      if (completedSession && hasKnowledge) {
        respondent.gameCompleted = true;
        respondent.statusText = 'Completed';
      } else if (completedSession && !hasKnowledge) {
        respondent.gameCompleted = false;
        respondent.statusText = 'Missing Assessment';
      } else {
        respondent.gameCompleted = false;
        respondent.statusText = 'In Progress';
      }
    }
    
    // Filter by status if requested
    if (status === 'completed') {
      respondents = respondents.filter(r => r.gameCompleted);
    } else if (status === 'in_progress') {
      respondents = respondents.filter(r => !r.gameCompleted);
    }
    
    res.json({
      success: true,
      data: respondents,
      count: respondents.length
    });
    
  } catch (error) {
    console.error('Error getting respondents:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get community assignments
const getCommunityAssignments = async (req, res) => {
  try {
    const communities = await CommunityAssignment.find().sort({ communityName: 1 });
    
    res.json({
      success: true,
      data: communities,
      count: communities.length
    });
  } catch (error) {
    console.error('Error fetching communities:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Export community assignments as CSV
const exportCommunityAssignments = async (req, res) => {
  try {
    const communities = await CommunityAssignment.find().sort({ communityName: 1 });

    let csv = 'Community Name,District,Treatment Group,Target Households,Actual Respondents,Progress %\n';
    
    for (const c of communities) {
      const respondentCount = await Respondent.countDocuments({ communityName: c.communityName });
      const progress = ((respondentCount / c.targetHouseholds) * 100).toFixed(1);
      csv += `"${c.communityName}","${c.district}","${c.treatmentGroup}",${c.targetHouseholds},${respondentCount},${progress}\n`;
    }

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=community-assignments.csv');
    res.send(csv);
  } catch (error) {
    console.error('Error exporting communities:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Export knowledge test results
const exportKnowledgeTests = async (req, res) => {
  try {
    const tests = await KnowledgeTest.find()
      .populate('respondentId')
      .sort({ completedAt: -1 });

    let csv = 'Session ID,Respondent ID,Household ID,Community,Enumerator,Treatment,';
    csv += 'Q1 Index Based (Correct=True),Q2 Area Wide (Correct=True),Q3 Profit Guarantee (Correct=False),';
    csv += 'Q4 Upfront Cost (Correct=True),Q5 Basis Risk (Correct=True),Knowledge Score,Completed At\n';
    
    tests.forEach(t => {
      const r = t.respondentId;
      csv += `"${t.sessionId}",`;
      csv += `"${r?.respondentId || 'N/A'}",`;
      csv += `"${r?.householdId || 'N/A'}",`;
      csv += `"${r?.communityName || 'N/A'}",`;
      csv += `"${r?.enumeratorName || 'N/A'}",`;
      csv += `"${r?.treatmentGroup || 'N/A'}",`;
      csv += `${t.q1_indexBased ? 'True' : 'False'},`;
      csv += `${t.q2_areaWide ? 'True' : 'False'},`;
      csv += `${t.q3_profitGuarantee ? 'True' : 'False'},`;
      csv += `${t.q4_upfrontCost ? 'True' : 'False'},`;
      csv += `${t.q5_basisRisk ? 'True' : 'False'},`;
      csv += `${t.knowledgeScore},`;
      csv += `"${t.completedAt}"\n`;
    });

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=knowledge-tests.csv');
    res.send(csv);
  } catch (error) {
    console.error('Error exporting knowledge tests:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Export perception assessments
const exportPerceptions = async (req, res) => {
  try {
    const perceptions = await Perception.find()
      .populate('respondentId')
      .sort({ createdAt: -1 });

    let csv = 'Session ID,Household ID,Community,Enumerator,Treatment,';
    csv += 'Bundle Influence (1-5),Insurance Understanding (1-5),Willingness to Pay (Yes/No),';
    csv += 'Recommend to Others (1-5),Perceived Fairness (1-5),Trust in Payout (1-5),';
    csv += 'Bundle Value Perception (1-5),Future Use Likelihood (1-5),Created At\n';
    
    perceptions.forEach(p => {
      const r = p.respondentId;
      csv += `"${p.sessionId}",`;
      csv += `"${p.householdId}",`;
      csv += `"${r?.communityName || 'N/A'}",`;
      csv += `"${r?.enumeratorName || 'N/A'}",`;
      csv += `"${r?.treatmentGroup || 'N/A'}",`;
      csv += `${p.bundleInfluence},`;
      csv += `${p.insuranceUnderstanding},`;
      csv += `${p.willingnessToPay ? 'Yes' : 'No'},`;
      csv += `${p.recommendToOthers},`;
      csv += `${p.perceivedFairness},`;
      csv += `${p.trustInPayout},`;
      csv += `${p.bundleValuePerception},`;
      csv += `${p.futureUseLikelihood},`;
      csv += `"${p.createdAt}"\n`;
    });

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=perception-assessments.csv');
    res.send(csv);
  } catch (error) {
    console.error('Error exporting perceptions:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get community progress with actual respondent counts
// ===== GET COMMUNITY PROGRESS =====
const getCommunityProgress = async (req, res) => {
  try {
    // Get all community assignments
    const communities = await CommunityAssignment.find().lean();
    
    // Get respondent counts per community
    const respondentCounts = await Respondent.aggregate([
      {
        $group: {
          _id: '$communityName',
          count: { $sum: 1 }
        }
      }
    ]);
    
    // Create a map for quick lookup
    const countMap = {};
    respondentCounts.forEach(item => {
      countMap[item._id] = item.count;
    });
    
    // Combine community data with counts
    const progress = communities.map(community => ({
      communityName: community.communityName,
      district: community.district,
      treatmentGroup: community.treatmentGroup,
      targetHouseholds: 10, // ✅ FIXED: 10 households per community
      respondentCount: countMap[community.communityName] || 0
    }));
    
    // Sort by district, then by community name
    progress.sort((a, b) => {
      if (a.district !== b.district) {
        return a.district.localeCompare(b.district);
      }
      return a.communityName.localeCompare(b.communityName);
    });
    
    res.json({
      success: true,
      data: progress,
      summary: {
        totalCommunities: communities.length,
        targetTotal: communities.length * 10, // ✅ FIXED: 30 communities × 10 = 300
        currentTotal: Object.values(countMap).reduce((sum, count) => sum + count, 0),
        communitiesCompleted: progress.filter(c => c.respondentCount >= 10).length
      }
    });
  } catch (error) {
    console.error('Error getting community progress:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};


// Export COMPLETE respondent data as CSV
const exportRespondentData = async (req, res) => {
  try {
    const respondents = await Respondent.find().sort({ createdAt: -1 });

    // Create comprehensive CSV header
    let csv = 'Respondent ID,Household ID,Community,District,Enumerator,Gender,Role,Treatment Group,Language,';
    csv += 'Age,Education,Household Size,Children Under 15,';
    csv += 'Years Farming,Land Cultivated,Land Access Method,Land Access Other,Main Crops,Crops Planted Count,';
    csv += 'Last Season Income,Farming Input Expenditure,';
    csv += 'Has Radio,Has TV,Has Refrigerator,Has Bicycle,Has Motorbike,Has Mobile,Has Generator,Has Plough,';
    csv += 'Cattle Count,Goats Count,Sheep Count,Poultry Count,';
    csv += 'Uses Certified Seed,Uses Fertilizer,Uses Pesticides,Uses Irrigation,Has Irrigation Access,';
    csv += 'Experienced Drought,Experienced Flood,Experienced Pests,Experienced Price Fall,';
    csv += 'Estimated Loss Last Year,Harvest Loss Percentage,';
    csv += 'Has Savings,Savings Amount,Borrowed Money,Borrow Sources,Has Off-Farm Income,Off-Farm Income Amount,';
    csv += 'Prior Insurance Knowledge,Purchased Insurance Before,Insurance Type,';
    csv += 'Trust Farmer Group,Trust NGO,Trust Insurance Provider,Rainfall Change Perception,Insurer Payout Trust,';
    csv += 'Community Insurance Discussion,Member Farmer Group,Farmer Group Name,';
    csv += 'Distance to Market,Distance to Insurer,Extension Visits,Extension Visits Count,Uses Mobile Money,';
    csv += 'Risk Preference,Risk Comfort,Decision Maker,';
    csv += 'Empowerment Crop Decisions,Empowerment Money Decisions,Empowerment Input Decisions,';
    csv += 'Empowerment Opinion Considered,Empowerment Confidence,';
    csv += 'Game Completed,Created At\n';
    
    for (const r of respondents) {
      // Check if game completed
      const completedSession = await GameSession.findOne({ 
        respondentId: r._id, 
        status: 'completed' 
      });
      
      csv += `"${r.respondentId || 'N/A'}",`;
      csv += `"${r.householdId}",`;
      csv += `"${r.communityName || 'N/A'}",`;
      
      // Get district from community assignment
      const community = await CommunityAssignment.findOne({ communityName: r.communityName });
      csv += `"${community?.district || 'N/A'}",`;
      
      csv += `"${r.enumeratorName || 'N/A'}",`;
      csv += `"${r.gender}",`;
      csv += `"${r.role}",`;
      csv += `"${r.treatmentGroup}",`;
      csv += `"${r.language || 'english'}",`;
      
      // Demographics
      csv += `${r.age},`;
      csv += `${r.education},`;
      csv += `${r.householdSize},`;
      csv += `${r.childrenUnder15},`;
      
      // Farming
      csv += `${r.yearsOfFarming},`;
      csv += `${r.landCultivated},`;
      csv += `${r.landAccessMethod},`;
      csv += `"${r.landAccessOther || 'N/A'}",`;
      csv += `"${(r.mainCrops || []).join('; ')}",`;
      csv += `${r.numberOfCropsPlanted},`;
      csv += `${r.lastSeasonIncome},`;
      csv += `${r.farmingInputExpenditure},`;
      
      // Assets
      csv += `${r.assets?.radio ? 1 : 0},`;
      csv += `${r.assets?.tv ? 1 : 0},`;
      csv += `${r.assets?.refrigerator ? 1 : 0},`;
      csv += `${r.assets?.bicycle ? 1 : 0},`;
      csv += `${r.assets?.motorbike ? 1 : 0},`;
      csv += `${r.assets?.mobilePhone ? 1 : 0},`;
      csv += `${r.assets?.generator ? 1 : 0},`;
      csv += `${r.assets?.plough ? 1 : 0},`;
      
      // Livestock
      csv += `${r.livestock?.cattle || 0},`;
      csv += `${r.livestock?.goats || 0},`;
      csv += `${r.livestock?.sheep || 0},`;
      csv += `${r.livestock?.poultry || 0},`;
      
      // Improved inputs
      csv += `${r.improvedInputs?.certifiedSeed ? 1 : 0},`;
      csv += `${r.improvedInputs?.fertilizer ? 1 : 0},`;
      csv += `${r.improvedInputs?.pesticides ? 1 : 0},`;
      csv += `${r.improvedInputs?.irrigation ? 1 : 0},`;
      csv += `${r.hasIrrigationAccess ? 1 : 0},`;
      
      // Shocks
      csv += `${r.shocks?.drought ? 1 : 0},`;
      csv += `${r.shocks?.flood ? 1 : 0},`;
      csv += `${r.shocks?.pestsDisease ? 1 : 0},`;
      csv += `${r.shocks?.cropPriceFall ? 1 : 0},`;
      csv += `${r.estimatedLossLastYear || 0},`;
      csv += `${r.harvestLossPercentage || 0},`;
      
      // Savings & Credit
      csv += `${r.hasSavings ? 1 : 0},`;
      csv += `${r.savingsAmount || 0},`;
      csv += `${r.borrowedMoney ? 1 : 0},`;
      csv += `"${(r.borrowSources || []).join('; ')}",`;
      csv += `${r.hasOffFarmIncome ? 1 : 0},`;
      csv += `${r.offFarmIncomeAmount || 0},`;
      
      // Insurance
      csv += `${r.priorInsuranceKnowledge ? 1 : 0},`;
      csv += `${r.purchasedInsuranceBefore ? 1 : 0},`;
      csv += `"${r.insuranceType || 'N/A'}",`;
      
      // Trust
      csv += `${r.trustFarmerGroup || 3},`;
      csv += `${r.trustNGO || 3},`;
      csv += `${r.trustInsuranceProvider || 3},`;
      csv += `${r.rainfallChangePerception || 3},`;
      csv += `${r.insurerPayoutTrust || 3},`;
      
      // Social capital
      csv += `${r.communityInsuranceDiscussion ? 1 : 0},`;
      csv += `${r.memberOfFarmerGroup ? 1 : 0},`;
      csv += `"${r.farmerGroupName || 'N/A'}",`;
      
      // Access
      csv += `${r.distanceToMarket || 0},`;
      csv += `${r.distanceToInsurer || 0},`;
      csv += `${r.extensionVisits ? 1 : 0},`;
      csv += `${r.numberOfExtensionVisits || 0},`;
      csv += `${r.usesMobileMoney ? 1 : 0},`;
      
      // Risk & Decision Making
      csv += `${r.riskPreference || 0},`;
      csv += `${r.riskComfort || 0},`;
      csv += `${r.decisionMaker || 0},`;
      
      // Empowerment
      csv += `${r.empowermentScores?.cropDecisions || 0},`;
      csv += `${r.empowermentScores?.moneyDecisions || 0},`;
      csv += `${r.empowermentScores?.inputDecisions || 0},`;
      csv += `${r.empowermentScores?.opinionConsidered || 0},`;
      csv += `${r.empowermentScores?.confidenceExpressing || 0},`;
      
      // Game completion
      csv += `${completedSession ? 'Yes' : 'No'},`;
      csv += `"${r.createdAt}"\n`;
    }

    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', 'attachment; filename=complete-respondent-data.csv');
    res.send(csv);
  } catch (error) {
    console.error('Error exporting respondents:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ===== DELETE ALL DATA (PASSWORD PROTECTED) =====
const deleteAllData = async (req, res) => {
  try {
    const { password } = req.body;
    
    // Password protection
const CORRECT_PASSWORD = process.env.DELETE_PASSWORD;
    
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
};


// ===== EXPORT COMPLETE COMBINED DATASET WITH SEPARATE INDIVIDUAL AND COUPLE COLUMNS =====
// ===== REPLACE THE exportCompleteDataset FUNCTION IN adminController.js =====

const exportCompleteDataset = async (req, res) => {
  try {
    console.log('📊 Exporting complete combined dataset...');
    
    const respondents = await Respondent.find().lean().sort({ createdAt: -1 });
    
    if (respondents.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No data available to export'
      });
    }
    
    console.log(`✅ Found ${respondents.length} respondents`);
    
    const completeData = [];
    let emptyGameDataCount = 0;
    
    for (const respondent of respondents) {
      console.log(`\n📊 Processing: ${respondent.householdId} (${respondent._id})`);
      
      // ✅ KEY FIX: Query using respondent._id directly (it's already an ObjectId in memory)
      const allSessions = await GameSession.find({ 
        respondentId: respondent._id  // ✅ No conversion needed - use the ObjectId directly
      }).lean();
      
      const allRounds = await GameRound.find({ 
        respondentId: respondent._id  // ✅ Same here
      }).lean();
      
      const knowledge = await KnowledgeTest.findOne({ 
        respondentId: respondent._id  // ✅ Same here
      }).lean();
      
      const perception = await Perception.findOne({ 
        respondentId: respondent._id  // ✅ Same here
      }).lean();
      
      console.log(`   Sessions: ${allSessions.length}, Rounds: ${allRounds.length}`);
      
      if (allSessions.length === 0 && allRounds.length === 0) {
        emptyGameDataCount++;
        console.warn(`   ⚠️ No game data!`);
      }
      
      // Separate individual vs couple data
      const individualSessions = allSessions.filter(s => 
        s.sessionType === 'individual_husband' || s.sessionType === 'individual_wife'
      );
      
      const coupleSessions = allSessions.filter(s => 
        s.sessionType === 'couple_joint'
      );
      
      const individualRounds = allRounds.filter(r => 
        r.decisionContext === 'individual_husband' || r.decisionContext === 'individual_wife'
      ).sort((a, b) => a.roundNumber - b.roundNumber);
      
      const coupleRounds = allRounds.filter(r => 
        r.decisionContext === 'couple_joint'
      ).sort((a, b) => a.roundNumber - b.roundNumber);
      
      // Calculate statistics for individual sessions
      const individualTotalRounds = individualRounds.length;
      const individualTotalInsurance = individualRounds.reduce((sum, r) => sum + (r.insuranceSpend || 0), 0);
      const individualTotalPayouts = individualRounds.reduce((sum, r) => sum + (r.payoutReceived || 0), 0);
      const individualTotalHarvest = individualRounds.reduce((sum, r) => sum + (r.harvestOutcome || 0), 0);
      const individualTotalEarnings = individualTotalHarvest + individualTotalPayouts;
      const individualInsurancePurchased = individualRounds.filter(r => r.insuranceSpend > 0).length;
      const individualBundleAccepted = individualRounds.filter(r => r.bundleAccepted).length;
      
      const individualDroughts = individualRounds.filter(r => r.weatherShock?.type === 'drought').length;
      const individualFloods = individualRounds.filter(r => r.weatherShock?.type === 'flood').length;
      const individualNormal = individualRounds.filter(r => r.weatherShock?.type === 'normal').length;
      
      // Calculate statistics for couple sessions
      const coupleTotalRounds = coupleRounds.length;
      const coupleTotalInsurance = coupleRounds.reduce((sum, r) => sum + (r.insuranceSpend || 0), 0);
      const coupleTotalPayouts = coupleRounds.reduce((sum, r) => sum + (r.payoutReceived || 0), 0);
      const coupleTotalHarvest = coupleRounds.reduce((sum, r) => sum + (r.harvestOutcome || 0), 0);
      const coupleTotalEarnings = coupleTotalHarvest + coupleTotalPayouts;
      const coupleInsurancePurchased = coupleRounds.filter(r => r.insuranceSpend > 0).length;
      const coupleBundleAccepted = coupleRounds.filter(r => r.bundleAccepted).length;
      
      const coupleDroughts = coupleRounds.filter(r => r.weatherShock?.type === 'drought').length;
      const coupleFloods = coupleRounds.filter(r => r.weatherShock?.type === 'flood').length;
      const coupleNormal = coupleRounds.filter(r => r.weatherShock?.type === 'normal').length;
      
      // Build round-by-round details for individual
      const individualRoundDetails = {};
      for (let i = 1; i <= 4; i++) {
        const round = individualRounds.find(r => r.roundNumber === i);
        if (round) {
          individualRoundDetails[`ind_s${i}_budget`] = round.budget || 0;
          individualRoundDetails[`ind_s${i}_insurance_spend`] = round.insuranceSpend || 0;
          individualRoundDetails[`ind_s${i}_input_spend`] = round.inputSpend || 0;
          individualRoundDetails[`ind_s${i}_education_spend`] = round.educationSpend || 0;
          individualRoundDetails[`ind_s${i}_consumption_spend`] = round.consumptionSpend || 0;
          individualRoundDetails[`ind_s${i}_bundle_accepted`] = round.bundleAccepted || false;
          individualRoundDetails[`ind_s${i}_bundle_product`] = round.bundleProduct || 'none';
          individualRoundDetails[`ind_s${i}_input_choice_type`] = round.inputChoiceType || 'none';
          individualRoundDetails[`ind_s${i}_weather_type`] = round.weatherShock?.type || 'normal';
          individualRoundDetails[`ind_s${i}_weather_severity`] = round.weatherShock?.severity || 'none';
          individualRoundDetails[`ind_s${i}_harvest_outcome`] = round.harvestOutcome || 0;
          individualRoundDetails[`ind_s${i}_payout_received`] = round.payoutReceived || 0;
          individualRoundDetails[`ind_s${i}_total_earnings`] = (round.harvestOutcome || 0) + (round.payoutReceived || 0);
        } else {
          individualRoundDetails[`ind_s${i}_budget`] = 0;
          individualRoundDetails[`ind_s${i}_insurance_spend`] = 0;
          individualRoundDetails[`ind_s${i}_input_spend`] = 0;
          individualRoundDetails[`ind_s${i}_education_spend`] = 0;
          individualRoundDetails[`ind_s${i}_consumption_spend`] = 0;
          individualRoundDetails[`ind_s${i}_bundle_accepted`] = false;
          individualRoundDetails[`ind_s${i}_bundle_product`] = 'none';
          individualRoundDetails[`ind_s${i}_input_choice_type`] = 'none';
          individualRoundDetails[`ind_s${i}_weather_type`] = 'none';
          individualRoundDetails[`ind_s${i}_weather_severity`] = 'none';
          individualRoundDetails[`ind_s${i}_harvest_outcome`] = 0;
          individualRoundDetails[`ind_s${i}_payout_received`] = 0;
          individualRoundDetails[`ind_s${i}_total_earnings`] = 0;
        }
      }
      
      // Build round-by-round details for couple
      const coupleRoundDetails = {};
      for (let i = 1; i <= 4; i++) {
        const round = coupleRounds.find(r => r.roundNumber === i);
        if (round) {
          coupleRoundDetails[`couple_s${i}_budget`] = round.budget || 0;
          coupleRoundDetails[`couple_s${i}_insurance_spend`] = round.insuranceSpend || 0;
          coupleRoundDetails[`couple_s${i}_input_spend`] = round.inputSpend || 0;
          coupleRoundDetails[`couple_s${i}_education_spend`] = round.educationSpend || 0;
          coupleRoundDetails[`couple_s${i}_consumption_spend`] = round.consumptionSpend || 0;
          coupleRoundDetails[`couple_s${i}_bundle_accepted`] = round.bundleAccepted || false;
          coupleRoundDetails[`couple_s${i}_bundle_product`] = round.bundleProduct || 'none';
          coupleRoundDetails[`couple_s${i}_input_choice_type`] = round.inputChoiceType || 'none';
          coupleRoundDetails[`couple_s${i}_weather_type`] = round.weatherShock?.type || 'normal';
          coupleRoundDetails[`couple_s${i}_weather_severity`] = round.weatherShock?.severity || 'none';
          coupleRoundDetails[`couple_s${i}_harvest_outcome`] = round.harvestOutcome || 0;
          coupleRoundDetails[`couple_s${i}_payout_received`] = round.payoutReceived || 0;
          coupleRoundDetails[`couple_s${i}_total_earnings`] = (round.harvestOutcome || 0) + (round.payoutReceived || 0);
        } else {
          coupleRoundDetails[`couple_s${i}_budget`] = 0;
          coupleRoundDetails[`couple_s${i}_insurance_spend`] = 0;
          coupleRoundDetails[`couple_s${i}_input_spend`] = 0;
          coupleRoundDetails[`couple_s${i}_education_spend`] = 0;
          coupleRoundDetails[`couple_s${i}_consumption_spend`] = 0;
          coupleRoundDetails[`couple_s${i}_bundle_accepted`] = false;
          coupleRoundDetails[`couple_s${i}_bundle_product`] = 'none';
          coupleRoundDetails[`couple_s${i}_input_choice_type`] = 'none';
          coupleRoundDetails[`couple_s${i}_weather_type`] = 'none';
          coupleRoundDetails[`couple_s${i}_weather_severity`] = 'none';
          coupleRoundDetails[`couple_s${i}_harvest_outcome`] = 0;
          coupleRoundDetails[`couple_s${i}_payout_received`] = 0;
          coupleRoundDetails[`couple_s${i}_total_earnings`] = 0;
        }
      }
      
      // Check completion status
      const hasIndividualCompleted = individualSessions.some(s => 
        s.status === 'completed' || (s.completedAt != null)
      );
      const hasCoupleCompleted = coupleSessions.some(s => 
        s.status === 'completed' || (s.completedAt != null)
      );
      const hasKnowledge = knowledge !== null;
      const isIndividualComplete = hasIndividualCompleted && hasKnowledge;
      const isCoupleComplete = hasCoupleCompleted;
      
      // Build complete record
      const record = {
        respondent_id: respondent.respondentId || respondent._id.toString(),
        household_id: respondent.householdId,
        community_name: respondent.communityName,
        enumerator_name: respondent.enumeratorName,
        treatment_group: respondent.treatmentGroup,
        gender: respondent.gender,
        role: respondent.role,
        age: respondent.age,
        education_level: respondent.education,
        language: respondent.language || 'english',
        household_size: respondent.householdSize,
        children_under_15: respondent.childrenUnder15,
        
        // Individual session data
        individual_completed: isIndividualComplete ? 'Yes' : 'No',
        individual_rounds_completed: individualTotalRounds,
        individual_total_insurance_spent: individualTotalInsurance,
        individual_total_payouts_received: individualTotalPayouts,
        individual_total_harvest: individualTotalHarvest,
        individual_total_earnings: individualTotalEarnings,
        individual_insurance_purchased_count: individualInsurancePurchased,
        individual_bundle_accepted_count: individualBundleAccepted,
        individual_insurance_adoption_rate: individualTotalRounds > 0 ? (individualInsurancePurchased / individualTotalRounds * 100).toFixed(1) : 0,
        individual_bundle_adoption_rate: individualTotalRounds > 0 ? (individualBundleAccepted / individualTotalRounds * 100).toFixed(1) : 0,
        individual_drought_rounds: individualDroughts,
        individual_flood_rounds: individualFloods,
        individual_normal_rounds: individualNormal,
        ...individualRoundDetails,
        
        // Couple session data
        couple_completed: isCoupleComplete ? 'Yes' : 'No',
        couple_rounds_completed: coupleTotalRounds,
        couple_total_insurance_spent: coupleTotalInsurance,
        couple_total_payouts_received: coupleTotalPayouts,
        couple_total_harvest: coupleTotalHarvest,
        couple_total_earnings: coupleTotalEarnings,
        couple_insurance_purchased_count: coupleInsurancePurchased,
        couple_bundle_accepted_count: coupleBundleAccepted,
        couple_insurance_adoption_rate: coupleTotalRounds > 0 ? (coupleInsurancePurchased / coupleTotalRounds * 100).toFixed(1) : 0,
        couple_bundle_adoption_rate: coupleTotalRounds > 0 ? (coupleBundleAccepted / coupleTotalRounds * 100).toFixed(1) : 0,
        couple_drought_rounds: coupleDroughts,
        couple_flood_rounds: coupleFloods,
        couple_normal_rounds: coupleNormal,
        ...coupleRoundDetails,
        
        // Knowledge and perception
        knowledge_q1_index_based: knowledge?.q1_indexBased,
        knowledge_q2_area_wide: knowledge?.q2_areaWide,
        knowledge_q3_profit_guarantee: knowledge?.q3_profitGuarantee,
        knowledge_q4_upfront_cost: knowledge?.q4_upfrontCost,
        knowledge_q5_basis_risk: knowledge?.q5_basisRisk,
        knowledge_score: knowledge?.knowledgeScore,
        
        perception_bundle_influence: perception?.bundleInfluence,
        perception_insurance_understanding: perception?.insuranceUnderstanding,
        perception_willingness_to_pay: perception?.willingnessToPay,
        perception_recommend_to_others: perception?.recommendToOthers,
        perception_perceived_fairness: perception?.perceivedFairness,
        perception_trust_in_payout: perception?.trustInPayout,
        perception_bundle_value: perception?.bundleValuePerception,
        perception_future_use_likelihood: perception?.futureUseLikelihood,
        
        created_at: respondent.createdAt,
        last_updated: respondent.updatedAt
      };
      
      completeData.push(record);
    }
    
    // Generate CSV
    const headers = Object.keys(completeData[0]);
    let csv = headers.join(',') + '\n';
    
    completeData.forEach(record => {
      const row = headers.map(header => {
        let value = record[header];
        
        if (value === null || value === undefined) {
          return '';
        } else if (typeof value === 'boolean') {
          return value ? '1' : '0';
        } else if (typeof value === 'object') {
          return `"${JSON.stringify(value).replace(/"/g, '""')}"`;
        } else if (typeof value === 'string' && (value.includes(',') || value.includes('"') || value.includes('\n'))) {
          return `"${value.replace(/"/g, '""')}"`;
        } else {
          return value;
        }
      });
      
      csv += row.join(',') + '\n';
    });
    
    console.log(`\n✅ Export complete: ${completeData.length} records`);
    if (emptyGameDataCount > 0) {
      console.warn(`⚠️ ${emptyGameDataCount} respondents have no game data`);
    }
    
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename=complete-dataset-${Date.now()}.csv`);
    res.send(csv);
    
  } catch (error) {
    console.error('❌ Export error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};






// ===== ADD THIS FUNCTION TO YOUR adminController.js =====
// Place it BEFORE the module.exports line

const checkDataRelationships = async (req, res) => {
  try {
    console.log('🔍 Checking data relationships...');
    
    // Get sample data
    const respondents = await Respondent.find().limit(5).lean();
    const sessions = await GameSession.find().limit(5).lean();
    const rounds = await GameRound.find().limit(5).lean();
    
    const report = {
      summary: {
        totalRespondents: await Respondent.countDocuments(),
        totalSessions: await GameSession.countDocuments(),
        totalRounds: await GameRound.countDocuments(),
        totalKnowledge: await KnowledgeTest.countDocuments(),
        totalPerception: await Perception.countDocuments()
      },
      sampleRespondents: respondents.map(r => ({
        _id: r._id.toString(),
        respondentId: r.respondentId,
        householdId: r.householdId,
        role: r.role,
        createdAt: r.createdAt
      })),
      sampleSessions: sessions.map(s => ({
        _id: s._id.toString(),
        sessionId: s.sessionId,
        respondentId: s.respondentId ? s.respondentId.toString() : null,
        respondentIdType: typeof s.respondentId,
        sessionType: s.sessionType,
        status: s.status
      })),
      sampleRounds: rounds.map(r => ({
        _id: r._id.toString(),
        sessionId: r.sessionId,
        respondentId: r.respondentId ? r.respondentId.toString() : null,
        respondentIdType: typeof r.respondentId,
        roundNumber: r.roundNumber
      })),
      matchingCheck: []
    };
    
    // Check if respondent IDs match
    for (const resp of respondents.slice(0, 3)) {
      const matchingSessions = await GameSession.countDocuments({ respondentId: resp._id });
      const matchingRounds = await GameRound.countDocuments({ respondentId: resp._id });
      
      report.matchingCheck.push({
        respondent_id: resp._id.toString(),
        respondentId_string: resp.respondentId,
        householdId: resp.householdId,
        matchingSessions: matchingSessions,
        matchingRounds: matchingRounds
      });
    }
    
    res.json({
      success: true,
      data: report
    });
    
  } catch (error) {
    console.error('❌ Error checking relationships:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// ===== THEN UPDATE YOUR module.exports =====
// Add checkDataRelationships to the exports list
module.exports = {
  getDashboardStats,
  getCommunityAssignments,
  exportCommunityAssignments,
  exportRespondentData,
  getAllRespondents,
  getCommunityProgress,
  exportKnowledgeTests,
  exportPerceptions,
  deleteAllData,
  exportCompleteDataset,
  checkDataRelationships  // ✅ ADD THIS
};


