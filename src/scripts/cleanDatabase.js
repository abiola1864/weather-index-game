require('dotenv').config();
const mongoose = require('mongoose');
const { Respondent, GameSession, GameRound, KnowledgeTest, Perception } = require('../models/Game');

async function cleanDatabase() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');
    
    console.log('🗑️  Cleaning database...');
    
    await Respondent.deleteMany({});
    await GameSession.deleteMany({});
    await GameRound.deleteMany({});
    await KnowledgeTest.deleteMany({});
    await Perception.deleteMany({});
    
    console.log('✅ All game data deleted');
    console.log('ℹ️  Community assignments preserved');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

cleanDatabase();