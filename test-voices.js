const textToSpeech = require('@google-cloud/text-to-speech');
const client = new textToSpeech.TextToSpeechClient({
  keyFilename: './google-credentials.json'
});

async function listVoices() {
  console.log('🔍 Checking available voices in your Google Cloud project...\n');
  try {
    const [result] = await client.listVoices({});
    const voices = result.voices;
    
    console.log('📊 ENGLISH VOICES AVAILABLE:');
    console.log('─'.repeat(80));
    const englishVoices = voices.filter(v => v.languageCodes[0].startsWith('en'));
    englishVoices.forEach(voice => {
      console.log(`✅ ${voice.name.padEnd(30)} | ${voice.languageCodes[0].padEnd(10)} | ${voice.ssmlGender}`);
    });
    
    console.log('\n🌍 Recommended for African accent:');
    const africanVoices = englishVoices.filter(v => 
      v.name.includes('GB') || v.name.includes('IN') || v.name.includes('AU')
    );
    africanVoices.forEach(voice => {
      console.log(`   ${voice.name} (${voice.languageCodes[0]})`);
    });
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

listVoices();
