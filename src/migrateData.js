// ===== DATA MIGRATION SCRIPT =====
// This fixes respondentId stored as STRING → converts to ObjectId

require('dotenv').config();
const mongoose = require('mongoose');

async function migrateData() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');
    
    const db = mongoose.connection.db;
    
    // Check how many need fixing
    console.log('🔍 Checking data...');
    const gameSessions = await db.collection('gamesessions').find().toArray();
    const gameRounds = await db.collection('gamerounds').find().toArray();
    const knowledgeTests = await db.collection('knowledgetests').find().toArray();
    const perceptions = await db.collection('perceptions').find().toArray();
    
    console.log(`📊 Found:`);
    console.log(`   ${gameSessions.length} sessions`);
    console.log(`   ${gameRounds.length} rounds`);
    console.log(`   ${knowledgeTests.length} knowledge tests`);
    console.log(`   ${perceptions.length} perceptions`);
    
    let sessionsFixed = 0;
    let roundsFixed = 0;
    let knowledgeFixed = 0;
    let perceptionsFixed = 0;
    
    // Fix GameSessions
    console.log('\n🔧 Fixing GameSessions...');
    for (const session of gameSessions) {
      if (typeof session.respondentId === 'string') {
        try {
          await db.collection('gamesessions').updateOne(
            { _id: session._id },
            { $set: { respondentId: new mongoose.Types.ObjectId(session.respondentId) } }
          );
          sessionsFixed++;
        } catch (e) {
          console.error(`   ❌ Failed to fix session ${session.sessionId}:`, e.message);
        }
      }
    }
    console.log(`   ✅ Fixed ${sessionsFixed} sessions`);
    
    // Fix GameRounds
    console.log('\n🔧 Fixing GameRounds...');
    for (const round of gameRounds) {
      if (typeof round.respondentId === 'string') {
        try {
          await db.collection('gamerounds').updateOne(
            { _id: round._id },
            { $set: { respondentId: new mongoose.Types.ObjectId(round.respondentId) } }
          );
          roundsFixed++;
        } catch (e) {
          console.error(`   ❌ Failed to fix round ${round._id}:`, e.message);
        }
      }
    }
    console.log(`   ✅ Fixed ${roundsFixed} rounds`);
    
    // Fix KnowledgeTests
    console.log('\n🔧 Fixing KnowledgeTests...');
    for (const test of knowledgeTests) {
      if (typeof test.respondentId === 'string') {
        try {
          await db.collection('knowledgetests').updateOne(
            { _id: test._id },
            { $set: { respondentId: new mongoose.Types.ObjectId(test.respondentId) } }
          );
          knowledgeFixed++;
        } catch (e) {
          console.error(`   ❌ Failed to fix knowledge test ${test._id}:`, e.message);
        }
      }
    }
    console.log(`   ✅ Fixed ${knowledgeFixed} knowledge tests`);
    
    // Fix Perceptions
    console.log('\n🔧 Fixing Perceptions...');
    for (const perception of perceptions) {
      if (typeof perception.respondentId === 'string') {
        try {
          await db.collection('perceptions').updateOne(
            { _id: perception._id },
            { $set: { respondentId: new mongoose.Types.ObjectId(perception.respondentId) } }
          );
          perceptionsFixed++;
        } catch (e) {
          console.error(`   ❌ Failed to fix perception ${perception._id}:`, e.message);
        }
      }
    }
    console.log(`   ✅ Fixed ${perceptionsFixed} perceptions`);
    
    // Verify the fix
    console.log('\n🔍 Verifying fix...');
    const { Respondent, GameSession } = require('./models/Game');
    
    const testRespondent = await Respondent.findOne().lean();
    const matchingSessions = await GameSession.find({
      respondentId: testRespondent._id
    }).lean();
    
    console.log(`\n✅ Verification:`);
    console.log(`   Sample respondent: ${testRespondent.householdId}`);
    console.log(`   Sessions found: ${matchingSessions.length}`);
    
    if (matchingSessions.length > 0) {
      console.log('\n🎉 SUCCESS! Data migration complete!');
      console.log('   Your CSV export should now work correctly.');
    } else {
      console.log('\n⚠️ Still no matches - there may be a deeper issue.');
    }
    
    console.log('\n📊 Summary:');
    console.log(`   Sessions fixed: ${sessionsFixed}`);
    console.log(`   Rounds fixed: ${roundsFixed}`);
    console.log(`   Knowledge tests fixed: ${knowledgeFixed}`);
    console.log(`   Perceptions fixed: ${perceptionsFixed}`);
    
    await mongoose.connection.close();
    console.log('\n✅ Migration complete. Please restart your server.');
    
  } catch (error) {
    console.error('❌ Migration error:', error);
    process.exit(1);
  }
}

migrateData();