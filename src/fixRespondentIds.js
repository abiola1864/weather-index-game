// ===== CREATE A NEW FILE: src/fixRespondentIds.js =====
// (Since you put it in src/ folder)

require('dotenv').config();
const mongoose = require('mongoose');
const { Respondent, GameSession, GameRound, KnowledgeTest, Perception } = require('./models/Game');

async function fixRespondentIds() {
  try {
    console.log('🔧 Starting migration to fix respondentId types...');
    
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');
    
    // ===== FIX SESSIONS =====
    console.log('\n📊 Fixing GameSessions...');
    const sessions = await GameSession.find();
    let sessionsFixed = 0;
    
    for (const session of sessions) {
      if (typeof session.respondentId === 'string') {
        // Find the respondent by their _id (which matches the string)
        const respondent = await Respondent.findById(session.respondentId);
        
        if (respondent) {
          await GameSession.updateOne(
            { _id: session._id },
            { $set: { respondentId: respondent._id } }
          );
          sessionsFixed++;
          console.log(`  ✅ Fixed session ${session.sessionId}`);
        } else {
          console.warn(`  ⚠️ No respondent found for session ${session.sessionId}`);
        }
      }
    }
    console.log(`✅ Fixed ${sessionsFixed} sessions`);
    
    // ===== FIX ROUNDS =====
    console.log('\n📊 Fixing GameRounds...');
    const rounds = await GameRound.find();
    let roundsFixed = 0;
    
    for (const round of rounds) {
      if (typeof round.respondentId === 'string') {
        const respondent = await Respondent.findById(round.respondentId);
        
        if (respondent) {
          await GameRound.updateOne(
            { _id: round._id },
            { $set: { respondentId: respondent._id } }
          );
          roundsFixed++;
        }
      }
    }
    console.log(`✅ Fixed ${roundsFixed} rounds`);
    
    // ===== FIX KNOWLEDGE TESTS =====
    console.log('\n📊 Fixing KnowledgeTests...');
    const knowledgeTests = await KnowledgeTest.find();
    let knowledgeFixed = 0;
    
    for (const test of knowledgeTests) {
      if (typeof test.respondentId === 'string') {
        const respondent = await Respondent.findById(test.respondentId);
        
        if (respondent) {
          await KnowledgeTest.updateOne(
            { _id: test._id },
            { $set: { respondentId: respondent._id } }
          );
          knowledgeFixed++;
        }
      }
    }
    console.log(`✅ Fixed ${knowledgeFixed} knowledge tests`);
    
    // ===== FIX PERCEPTIONS =====
    console.log('\n📊 Fixing Perceptions...');
    const perceptions = await Perception.find();
    let perceptionsFixed = 0;
    
    for (const perception of perceptions) {
      if (typeof perception.respondentId === 'string') {
        const respondent = await Respondent.findById(perception.respondentId);
        
        if (respondent) {
          await Perception.updateOne(
            { _id: perception._id },
            { $set: { respondentId: respondent._id } }
          );
          perceptionsFixed++;
        }
      }
    }
    console.log(`✅ Fixed ${perceptionsFixed} perceptions`);
    
    // ===== VERIFY =====
    console.log('\n🔍 Verifying fixes...');
    const sampleSession = await GameSession.findOne();
    const sampleRound = await GameRound.findOne();
    
    console.log('\nSample Session respondentId type:', typeof sampleSession?.respondentId);
    console.log('Sample Round respondentId type:', typeof sampleRound?.respondentId);
    
    if (typeof sampleSession?.respondentId === 'object' && typeof sampleRound?.respondentId === 'object') {
      console.log('\n✅ ✅ ✅ MIGRATION SUCCESSFUL! ✅ ✅ ✅');
      console.log('All respondentId fields are now ObjectIds');
    } else {
      console.log('\n⚠️ Warning: Some IDs may still be strings');
    }
    
    console.log('\n📊 Summary:');
    console.log(`   Sessions fixed: ${sessionsFixed}`);
    console.log(`   Rounds fixed: ${roundsFixed}`);
    console.log(`   Knowledge tests fixed: ${knowledgeFixed}`);
    console.log(`   Perceptions fixed: ${perceptionsFixed}`);
    
    await mongoose.connection.close();
    console.log('\n✅ Migration complete. Database connection closed.');
    
  } catch (error) {
    console.error('❌ Migration error:', error);
    process.exit(1);
  }
}

// Run the migration
fixRespondentIds();