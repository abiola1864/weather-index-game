const mongoose = require('mongoose');
require('dotenv').config();
const { CommunityAssignment } = require('../models/Game');


// ===== ACTUAL STUDY COMMUNITIES (30 communities across 2 municipals) =====
const communities = {
  'Savelugu Municipal': [
    'Duko', 'Kanshegu', 'Nyoglo', 'Libga', 'Zaazi', 
    'Moglaa', 'Langa', 'Yilikpani', 'Savelugu', 'Tarikpaa',
    'Gushei', 'Naabogu', 'Pong-Tamale', 'Kpong', 'Dipali',
    'Diare', 'Gbanga', 'Tigla', 'Dinga', 'Kadia'
  ],
  'Nanton Municipal': [
    'Zoggu', 'Zokuga', 'Nyolugu', 'Jegun', 'Tigu',
    'Nyarigiyili', 'Nanton-Kurugu', 'Damdu', 'Sindigu', 'Sandu'
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
    
    // Combine all communities with their municipals
    const allCommunities = [];
    for (const [municipal, communityList] of Object.entries(communities)) {
      for (const community of communityList) {
        allCommunities.push({ name: community, district: municipal });
      }
    }
    
    console.log(`\n📋 Total communities: ${allCommunities.length}`);
    console.log(`   - Savelugu Municipal: 20 communities`);
    console.log(`   - Nanton Municipal: 10 communities`);
    
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
        targetHouseholds: 10, // 10 households per community
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
      
      // Group by municipal
      const bySavelugu = communitiesInTreatment.filter(c => c.district === 'Savelugu Municipal');
      const byNanton = communitiesInTreatment.filter(c => c.district === 'Nanton Municipal');
      
      if (bySavelugu.length > 0) {
        console.log('  Savelugu Municipal:');
        bySavelugu.forEach(c => console.log(`    - ${c.communityName}`));
      }
      
      if (byNanton.length > 0) {
        console.log('  Nanton Municipal:');
        byNanton.forEach(c => console.log(`    - ${c.communityName}`));
      }
    }
    
    console.log('\n✅ Seeding complete! Treatment assignment is RANDOM and PERMANENT.');
    console.log('⚠️  Do NOT re-run this script unless you want to re-randomize!');
    console.log('\n📊 Study Design:');
    console.log('   - Total: 30 communities × 10 households = 300 respondents');
    console.log('   - Per treatment: 10 communities × 10 households = 100 respondents');
    console.log('   - Savelugu Municipal: 20 communities');
    console.log('   - Nanton Municipal: 10 communities');
    
    console.log('\n📋 Next Steps:');
    console.log('1. Copy the assignments above');
    console.log('2. Update getDefaultCommunities() in:');
    console.log('   - public/js/offline-storage.js');
    console.log('   - public/js/game.js');
    console.log('3. Deploy your updated code');
    console.log('4. Start data collection!');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding communities:', error);
    process.exit(1);
  }
}

seedCommunities();