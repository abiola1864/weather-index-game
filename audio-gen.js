const textToSpeech = require('@google-cloud/text-to-speech');
const fs = require('fs');
const path = require('path');

console.log('Script starting...');

const client = new textToSpeech.TextToSpeechClient({
  keyFilename: './google-credentials.json'
});

const TUTORIAL_DATA = {
  control_english: [
    { id: 1, title: "Welcome Farmer!", content: "You will play through 4 farming seasons. Each season, you'll make important decisions about spending your money." }
  ]
};

const VOICES = {
  english: { languageCode: 'en-US', name: 'en-US-Neural2-F', ssmlGender: 'FEMALE' }
};

async function test() {
  console.log('Testing Google TTS...');
  const request = {
    input: { text: 'Hello, this is a test.' },
    voice: VOICES.english,
    audioConfig: { audioEncoding: 'MP3' }
  };
  
  try {
    const [response] = await client.synthesizeSpeech(request);
    const outputPath = path.join(__dirname, 'public', 'tutorial-audio', 'test.mp3');
    const dir = path.dirname(outputPath);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(outputPath, response.audioContent, 'binary');
    console.log('✅ Test file created: public/tutorial-audio/test.mp3');
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

test();
