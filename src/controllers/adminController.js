const { Respondent, GameSession, GameRound, KnowledgeTest, CommunityAssignment } = require('../models/Game');

// Get dashboard statistics
const getDashboardStats = async (req, res) => {
  try {
    const overview = {
      totalRespondents: await Respondent.countDocuments(),
      totalSessions: await GameSession.countDocuments(),
      completedSessions: await GameSession.countDocuments({ status: 'completed' }),
      inProgressSessions: await GameSession.countDocuments({ status: 'in_progress' })
    };

    const treatmentCounts = await Respondent.aggregate([
      { $group: { _id: '$treatmentGroup', count: { $sum: 1 } } }
    ]);

    const communityCounts = await Respondent.aggregate([
      { $group: { _id: '$communityName', count: { $sum: 1 } } }
    ]);

    const enumeratorCounts = await Respondent.aggregate([
      { $group: { _id: '$enumeratorName', count: { $sum: 1 } } }
    ]);

    res.json({
      success: true,
      data: {
        overview,
        treatmentCounts,
        communityCounts,
        enumeratorCounts
      }
    });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get all respondents with filters
const getAllRespondents = async (req, res) => {
  try {
    const { community, treatment, enumerator, limit = 50 } = req.query;
    
    const filter = {};
    if (community) filter.communityName = community;
    if (treatment) filter.treatmentGroup = treatment;
    if (enumerator) filter.enumeratorName = enumerator;

    const respondents = await Respondent.find(filter)
      .sort({ createdAt: -1 })
      .limit(parseInt(limit));

    res.json({
      success: true,
      data: respondents,
      count: respondents.length
    });
  } catch (error) {
    console.error('Error fetching respondents:', error);
    res.status(500).json({ success: false, message: error.message });
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

    let csv = 'Community Name,District,Treatment Group,Target Households,Completed Households,Progress %\n';
    
    communities.forEach(c => {
      const progress = ((c.completedHouseholds / c.targetHouseholds) * 100).toFixed(1);
      csv += `"${c.communityName}","${c.district}","${c.treatmentGroup}",${c.targetHouseholds},${c.completedHouseholds},${progress}\n`;
    });

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
    const { Perception } = require('../models/Game');
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
const getCommunityProgress = async (req, res) => {
  try {
    const communities = await CommunityAssignment.find().sort({ communityName: 1 });
    
    const progress = await Promise.all(communities.map(async (community) => {
      const respondentCount = await Respondent.countDocuments({ 
        communityName: community.communityName 
      });
      
      return {
        communityName: community.communityName,
        district: community.district,
        treatmentGroup: community.treatmentGroup,
        targetHouseholds: community.targetHouseholds,
        respondentCount: respondentCount,
        progressPercent: ((respondentCount / community.targetHouseholds) * 100).toFixed(1)
      };
    }));
    
    res.json({
      success: true,
      data: progress
    });
  } catch (error) {
    console.error('Error fetching community progress:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};



// Export respondent data as CSV
// Export COMPLETE respondent data as CSV
const exportRespondentData = async (req, res) => {
  try {
    const respondents = await Respondent.find().sort({ createdAt: -1 });

    // Create comprehensive CSV header
    let csv = 'Respondent ID,Household ID,Community,District,Enumerator,Gender,Role,Treatment Group,Language,';
    csv += 'Age,Education,Household Size,Children Under 15,';
    csv += 'Years Farming,Land Cultivated,Land Access Method,Main Crops,Crops Planted Count,';
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

module.exports = {
 getDashboardStats,
  getAllRespondents,
  getCommunityAssignments,
  getCommunityProgress,
  exportCommunityAssignments,
  exportRespondentData,
  exportKnowledgeTests,
  exportPerceptions
};