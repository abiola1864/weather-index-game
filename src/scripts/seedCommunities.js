const mongoose = require('mongoose');
require('dotenv').config();
const { CommunityAssignment } = require('../models/Game');

// ===== ACTUAL STUDY COMMUNITIES (30 communities across 3 districts) =====
const communities = {
  'Tolon': [
    'Kpalsabogu', 'Nyankpala', 'Wantugu', 'Voggu', 'Kpendua', 
    'Gbullung', 'Zangbalun', 'Lingbunga', 'Kpalbusi', 'Wayamba', 'Yoggu'
  ],
  'Kumbungu': [
    'Tuunayili', 'Kpalguni', 'Kumbuyili', 'Gbulung', 'Kasuliyili', 
    'Kpanvo', 'Tindan', 'Gbulahagu', 'Kpalguni II'
  ],
  'Gushegu': [
    'Zantani', 'Kpanshegu', 'Nabogo', 'Tampion', 'Nanton', 
    'Kpatinga', 'Nakpanduri', 'Zakpalsi', 'Kpachi', 'Gushegu'
  ]
};

// Fisher-Yates shuffle algorithm
function shuffleArray(array) {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

async function seedCommunities() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');
    
    // Clear existing assignments
    await CommunityAssignment.deleteMany({});
    console.log('🗑️  Cleared existing community assignments');
    
    // Combine all communities with their districts
    const allCommunities = [];
    for (const [district, communityList] of Object.entries(communities)) {
      for (const community of communityList) {
        allCommunities.push({ name: community, district: district });
      }
    }
    
    console.log(`\n📋 Total communities: ${allCommunities.length}`);
    
    // Randomly shuffle all communities
    const shuffled = shuffleArray(allCommunities);
    
    // Assign treatments: first 10 = control, next 10 = fertilizer, last 10 = seedling
    const assignments = [];
    const treatments = ['control', 'fertilizer_bundle', 'seedling_bundle'];
    
    shuffled.forEach((community, index) => {
      const treatmentIndex = Math.floor(index / 10); // 0-9=0, 10-19=1, 20-29=2
      const treatment = treatments[treatmentIndex];
      
      assignments.push({
        communityName: community.name,
        district: community.district,
        treatmentGroup: treatment,
        targetHouseholds: 10, // ~10 households per community = 100 per treatment
        completedHouseholds: 0
      });
    });
    
    await CommunityAssignment.insertMany(assignments);
    
    console.log('\n✅ RANDOM Community assignments created!');
    console.log('📊 Summary by Treatment:');
    
    for (const treatment of treatments) {
      const communitiesInTreatment = assignments.filter(a => a.treatmentGroup === treatment);
      const count = communitiesInTreatment.length;
      const totalTarget = communitiesInTreatment.reduce((sum, c) => sum + c.targetHouseholds, 0);
      
      console.log(`\n${treatment.toUpperCase()}: ${count} communities (Target: ${totalTarget} respondents)`);
      console.log('  Communities:');
      communitiesInTreatment.forEach(c => {
        console.log(`    - ${c.communityName} (${c.district})`);
      });
    }
    
    console.log('\n✅ Seeding complete! Treatment assignment is RANDOM and PERMANENT.');
    console.log('⚠️  Do NOT re-run this script unless you want to re-randomize!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding communities:', error);
    process.exit(1);
  }
}

seedCommunities();