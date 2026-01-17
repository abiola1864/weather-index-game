const { MongoClient, ObjectId } = require('mongodb');
require('dotenv').config();

async function investigateMissingData() {
  const client = new MongoClient(process.env.MONGODB_URI);
  
  try {
    await client.connect();
    console.log('✅ Connected to MongoDB\n');
    
    const db = client.db('weather-game');
    
    // Get respondents without sessions
    const allRespondents = await db.collection('respondents').find({}).toArray();
    
    const missing = [];
    const working = [];
    
    for (const resp of allRespondents) {
      const sessionCount = await db.collection('gamesessions').countDocuments({
        respondentId: resp._id
      });
      
      if (sessionCount === 0) {
        missing.push(resp);
      } else {
        working.push(resp);
      }
    }
    
    console.log('🔍 ========================================');
    console.log('🔍 COMPARING WORKING vs BROKEN');
    console.log('🔍 ========================================\n');
    
    // Analyze by enumerator
    console.log('📊 BY ENUMERATOR:\n');
    
    const enumStats = {};
    
    [...missing, ...working].forEach(r => {
      const enumName = r.enumeratorName || 'Unknown';
      if (!enumStats[enumName]) {
        enumStats[enumName] = { total: 0, working: 0, missing: 0 };
      }
      enumStats[enumName].total++;
      if (missing.find(m => m._id.equals(r._id))) {
        enumStats[enumName].missing++;
      } else {
        enumStats[enumName].working++;
      }
    });
    
    Object.entries(enumStats)
      .sort((a, b) => b[1].missing - a[1].missing)
      .forEach(([name, stats]) => {
        const failRate = ((stats.missing / stats.total) * 100).toFixed(1);
        console.log(`${name}:`);
        console.log(`  Total: ${stats.total}`);
        console.log(`  ✅ Working: ${stats.working}`);
        console.log(`  ❌ Missing: ${stats.missing} (${failRate}%)`);
        console.log('');
      });
    
    // Analyze by treatment
    console.log('📊 BY TREATMENT GROUP:\n');
    
    const treatmentStats = {};
    
    [...missing, ...working].forEach(r => {
      const treatment = r.treatmentGroup || 'Unknown';
      if (!treatmentStats[treatment]) {
        treatmentStats[treatment] = { total: 0, working: 0, missing: 0 };
      }
      treatmentStats[treatment].total++;
      if (missing.find(m => m._id.equals(r._id))) {
        treatmentStats[treatment].missing++;
      } else {
        treatmentStats[treatment].working++;
      }
    });
    
    Object.entries(treatmentStats).forEach(([treatment, stats]) => {
      const failRate = ((stats.missing / stats.total) * 100).toFixed(1);
      console.log(`${treatment}:`);
      console.log(`  Total: ${stats.total}`);
      console.log(`  ✅ Working: ${stats.working}`);
      console.log(`  ❌ Missing: ${stats.missing} (${failRate}%)`);
      console.log('');
    });
    
    // Show sample of missing respondents
    console.log('🔍 SAMPLE OF MISSING RESPONDENTS:\n');
    
    missing.slice(0, 10).forEach((r, i) => {
      console.log(`${i + 1}. ${r.householdId}`);
      console.log(`   Enumerator: ${r.enumeratorName}`);
      console.log(`   Treatment: ${r.treatmentGroup}`);
      console.log(`   Created: ${r.createdAt.toISOString()}`);
      console.log('');
    });
    
    console.log(`... and ${missing.length - 10} more\n`);
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await client.close();
    console.log('✅ Connection closed');
  }
}

investigateMissingData();
