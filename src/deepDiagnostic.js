require('dotenv').config();
const mongoose = require('mongoose');

async function checkActualTypes() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');
    
    // Query raw data without Mongoose model (to see actual storage)
    const db = mongoose.connection.db;
    
    // Get one session from raw collection
    const sessionRaw = await db.collection('gamesessions').findOne();
    console.log('📊 RAW GameSession from MongoDB:');
    console.log('   sessionId:', sessionRaw.sessionId);
    console.log('   respondentId:', sessionRaw.respondentId);
    console.log('   respondentId type:', typeof sessionRaw.respondentId);
    console.log('   respondentId instanceof ObjectId:', sessionRaw.respondentId instanceof mongoose.Types.ObjectId);
    
    // Get one respondent from raw collection
    const respondentRaw = await db.collection('respondents').findOne();
    console.log('\n📊 RAW Respondent from MongoDB:');
    console.log('   householdId:', respondentRaw.householdId);
    console.log('   _id:', respondentRaw._id);
    console.log('   _id type:', typeof respondentRaw._id);
    console.log('   _id instanceof ObjectId:', respondentRaw._id instanceof mongoose.Types.ObjectId);
    
    // Check if they match
    console.log('\n🔍 Do they match?');
    console.log('   sessionRaw.respondentId:', sessionRaw.respondentId);
    console.log('   respondentRaw._id:', respondentRaw._id);
    console.log('   Are equal?', sessionRaw.respondentId.equals(respondentRaw._id));
    
    // Try to find matching session for this respondent
    console.log('\n🔍 Looking for sessions with respondentId =', respondentRaw._id);
    const matchingSessionsRaw = await db.collection('gamesessions').find({
      respondentId: respondentRaw._id
    }).toArray();
    console.log('   Found (raw query):', matchingSessionsRaw.length);
    
    // Now check what Mongoose sees
    const { Respondent, GameSession } = require('./models/Game');
    
    const respondentMongoose = await Respondent.findOne().lean();
    const sessionMongoose = await GameSession.findOne().lean();
    
    console.log('\n📊 MONGOOSE GameSession:');
    console.log('   respondentId:', sessionMongoose.respondentId);
    console.log('   respondentId type:', typeof sessionMongoose.respondentId);
    
    console.log('\n📊 MONGOOSE Respondent:');
    console.log('   _id:', respondentMongoose._id);
    console.log('   _id type:', typeof respondentMongoose._id);
    
    // The critical test
    console.log('\n🔍 CRITICAL TEST:');
    const testQuery = await GameSession.find({
      respondentId: respondentMongoose._id
    }).lean();
    console.log('   Found with Mongoose query:', testQuery.length);
    
    if (testQuery.length === 0) {
      console.log('\n❌ PROBLEM FOUND:');
      console.log('   Mongoose is converting the query incorrectly');
      console.log('   Let\'s check the schema definition...');
      
      // Check the actual schema
      const sessionSchema = GameSession.schema.path('respondentId');
      console.log('\n📋 GameSession Schema for respondentId:');
      console.log('   Type:', sessionSchema.instance);
      console.log('   Required:', sessionSchema.isRequired);
      console.log('   Ref:', sessionSchema.options.ref);
    }
    
    await mongoose.connection.close();
    
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

checkActualTypes();