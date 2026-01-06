const textToSpeech = require('@google-cloud/text-to-speech');
const fs = require('fs');
const path = require('path');

const client = new textToSpeech.TextToSpeechClient({
  keyFilename: './google-credentials.json'
});

const TUTORIAL_DATA = {
  control_english: [
    { id: 1, title: "Welcome, Farmer!", content: "You are a farmer in Ghana. You'll make decisions about how to invest your money across 4 farming seasons. Each decision affects your family's future.", emphasis: ["Ghana", "4 farming seasons", "family's future"] },
    { id: 2, title: "Your Farm Budget", content: "Each season gives you money to spend on: Farm Protection, Farm Inputs (seeds, fertilizer, tools), Education (school fees), and Household Needs (food, clothing). You must spend ALL your budget wisely.", emphasis: ["ALL your budget", "wisely"] },
    { id: 3, title: "Weather is Unpredictable", content: "Weather affects your harvest each season. Sometimes it's good, sometimes it's challenging. You cannot control the weather, but you can prepare for it.", emphasis: ["cannot control", "can prepare"] },
    { id: 4, title: "Make Your Decisions", content: "Each season, you'll decide how to allocate your budget across different needs. Think carefully about what's most important for your family's wellbeing.", emphasis: ["Think carefully", "most important"] },
    { id: 5, title: "Ready to Begin!", content: "You'll play through 4 farming seasons. Your choices matter! Try to make the best decisions you can for your household. Good luck!", emphasis: ["choices matter", "best decisions"] }
  ],
  control_dagbani: [
    { id: 1, title: "Ansoama, Puubu!", content: "Yi yɛ puubu Ghana zaa. Yi be chɛm chɛŋa yi mali zaŋ puuni kpeeni 4 zaa. Yi chɛŋa pam be nyɛ yi doo yuli dima.", emphasis: ["Ghana zaa", "kpeeni 4", "doo yuli"] },
    { id: 2, title: "Yi Puuni Mali", content: "Kpeeni pam zaa be yi mali ni yi sa: Puuni Nyɛlibu, Puuni Di (zaamnɛ, fertilizer, tools), Karimi (karimi mali), ni Doo Yuli (dimi, suhiya). Yi boɣi ka sa yi mali zaa yɛlni.", emphasis: ["mali zaa", "yɛlni"] },
    { id: 3, title: "Saŋa Ka Yɛl Yini", content: "Saŋa be nyɛ yi puuni kpeeni pam zaa. Kani kpeeni ŋmani, kani kpeeni ban ŋmani. Yi ka ni saŋa, ama yi ni nyɛlibu.", emphasis: ["ka ni saŋa", "ni nyɛlibu"] },
    { id: 4, title: "Chɛm Yi Chɛŋa", content: "Kpeeni pam zaa, yi be chɛŋi ka yi sa yi mali lahiri. Lahiri ka zaa ni pahi yi doo yuli yɛlibu.", emphasis: ["Lahiri", "doo yuli yɛlibu"] },
    { id: 5, title: "Nyɛlibu Ti Dɔɣi!", content: "Yi be puuni kpeeni 4. Yi chɛŋa pam! Ti chɛm chɛŋa nyɛlibu ni yi doo. Yɛlibu be yi!", emphasis: ["chɛŋa pam", "Yɛlibu be yi"] }
  ],
  fertilizer_english: [
    { id: 1, title: "Welcome, Farmer!", content: "You are a farmer in Ghana. You'll make decisions about how to invest your money across 4 farming seasons. Each decision affects your family's future.", emphasis: ["Ghana", "4 farming seasons", "family's future"] },
    { id: 2, title: "Your Farm Budget", content: "Each season gives you money to spend on: Insurance plus Fertilizer Bundle, Additional Farm Inputs, Education (school fees), and Household Needs (food, clothing). Spend wisely!", emphasis: ["Insurance plus Fertilizer", "Spend wisely"] },
    { id: 3, title: "How Weather Affects Harvest", content: "Good weather equals 50 percent MORE harvest, which is 1.5 times your investment. Bad weather equals 30 to 70 percent LESS harvest. Weather is unpredictable each season!", emphasis: ["50 percent MORE", "30 to 70 percent LESS", "unpredictable"] },
    { id: 4, title: "Weather Index Insurance Explained", content: "Insurance protects you from weather disasters! If bad weather is MEASURED in your area, you receive money, even if your exact farm wasn't affected.", emphasis: ["protects you", "MEASURED", "receive money"] },
    { id: 5, title: "How Insurance Payouts Work", content: "You PAY 100 Ghana Cedis for insurance. You RECEIVE if bad weather strikes: Mild drought equals 150 Cedis, Severe drought equals 300 Cedis, Floods equal 240 Cedis. If good weather, you receive 0 Cedis.", emphasis: ["PAY 100", "150 Cedis", "300 Cedis", "0 Cedis"] },
    { id: 6, title: "Fertilizer Boosts Your Harvest!", content: "NPK fertilizer increases maize yields by 50 percent! Smart farmers combine fertilizer with insurance to protect their investment AND boost production. Both help secure your income.", emphasis: ["50 percent", "protect", "boost production", "secure your income"] },
    { id: 7, title: "Important: Basis Risk", content: "Payouts depend on AREA weather measurements, not your specific farm. If the weather station shows normal rainfall but YOUR farm fails from pests, disease, or theft, you get ZERO payout.", emphasis: ["AREA weather", "not your specific farm", "ZERO payout"] },
    { id: 8, title: "Make Your Choice!", content: "Each season, decide how much to spend on the insurance plus fertilizer bundle. You'll see how they work together over 4 seasons. Good luck!", emphasis: ["decide", "work together", "Good luck"] }
  ],
  fertilizer_dagbani: [
    { id: 1, title: "Ansoama, Puubu!", content: "Yi yɛ puubu Ghana zaa. Yi be chɛm chɛŋa yi mali zaŋ puuni kpeeni 4 zaa. Yi chɛŋa pam be nyɛ yi doo yuli dima.", emphasis: ["Ghana zaa", "kpeeni 4", "doo yuli"] },
    { id: 2, title: "Yi Puuni Mali", content: "Kpeeni pam zaa be yi mali ni yi sa: Insurance plus Fertilizer, Puuni Di Din, Karimi, ni Doo Yuli. Sa yɛlni!", emphasis: ["Insurance plus Fertilizer", "Sa yɛlni"] },
    { id: 3, title: "Saŋa Be Nyɛ Puuni Lahiri", content: "Saŋa ŋmani equals 50 percent puuni nyini, that is 1.5 times yi di. Saŋa ban ŋmani equals 30 to 70 percent puuni kpɛri. Saŋa ka yɛl yini kpeeni pam zaa!", emphasis: ["50 percent nyini", "30 to 70 percent kpɛri", "ka yɛl yini"] },
    { id: 4, title: "Saŋa Insurance Pahi", content: "Insurance be nyɛlibu yi saŋa ban ŋmani! Ka saŋa ban ŋmani yi kpeeni zaa, yi nya mali, even if yi puuni ka ku!", emphasis: ["nyɛlibu yi", "yi nya mali"] },
    { id: 5, title: "Insurance Mali Lahiri", content: "Yi DI 100 Ghana Cedis insurance. Yi NYA ka saŋa ban ŋmani: Koom kpɛrigu kpiligu equals 150 Cedis, Koom kpɛrigu pam equals 300 Cedis, Koom nyini equals 240 Cedis. Ka saŋa ŋmani, yi nya 0 Cedis.", emphasis: ["DI 100", "150 Cedis", "300 Cedis", "0 Cedis"] },
    { id: 6, title: "Fertilizer Be Nyini Yi Puuni!", content: "NPK fertilizer be nyini zaamnɛ 50 percent! Puubu yɛlibu be maa insurance ni fertilizer bee ni nyɛlibu yi di AND nyini yi puuni. Bee nya be nyɛlibu yi mali.", emphasis: ["50 percent", "nyɛlibu yi di", "nyini yi puuni"] },
    { id: 7, title: "Pahi: Basis Risk", content: "Mali ni yi nya be zaŋ kpeeni saŋa pahi, not yi puuni zaŋ. Ka saŋa station pahi koom ŋmani ama YI puuni ku from yiribu, lahira, or gba, yi nya 0 payout.", emphasis: ["kpeeni saŋa pahi", "not yi puuni", "0 payout"] },
    { id: 8, title: "Chɛm Yi Chɛŋa!", content: "Kpeeni pam zaa, chɛŋi ka yi sa mali insurance plus fertilizer. Yi be nya ka bee be niŋi bee kpeeni 4 zaa. Yɛlibu be yi!", emphasis: ["chɛŋi", "bee be niŋi", "Yɛlibu be yi"] }
  ],
  seedling_english: [
    { id: 1, title: "Welcome, Farmer!", content: "You are a farmer in Ghana. You'll make decisions about how to invest your money across 4 farming seasons. Each decision affects your family's future.", emphasis: ["Ghana", "4 farming seasons", "family's future"] },
    { id: 2, title: "Your Farm Budget", content: "Each season gives you money to spend on: Insurance plus Seeds Bundle, Additional Farm Inputs, Education (school fees), and Household Needs (food, clothing). Spend wisely!", emphasis: ["Insurance plus Seeds", "Spend wisely"] },
    { id: 3, title: "How Weather Affects Harvest", content: "Good weather equals 50 percent MORE harvest, which is 1.5 times your investment. Bad weather equals 30 to 70 percent LESS harvest. Weather is unpredictable each season!", emphasis: ["50 percent MORE", "30 to 70 percent LESS", "unpredictable"] },
    { id: 4, title: "Weather Index Insurance Explained", content: "Insurance protects you from weather disasters! If bad weather is MEASURED in your area, you receive money, even if your exact farm wasn't affected.", emphasis: ["protects you", "MEASURED", "receive money"] },
    { id: 5, title: "How Insurance Payouts Work", content: "You PAY 100 Ghana Cedis for insurance. You RECEIVE if bad weather strikes: Mild drought equals 150 Cedis, Severe drought equals 300 Cedis, Floods equal 240 Cedis. If good weather, you receive 0 Cedis.", emphasis: ["PAY 100", "150 Cedis", "300 Cedis", "0 Cedis"] },
    { id: 6, title: "Improved Seeds Boost Your Harvest!", content: "Hybrid maize seeds are drought-resistant and increase yields by 50 percent! Smart farmers combine improved seeds with insurance to protect their investment AND boost production. Both help secure your income.", emphasis: ["drought-resistant", "50 percent", "protect", "boost production"] },
    { id: 7, title: "Important: Basis Risk", content: "Payouts depend on AREA weather measurements, not your specific farm. If the weather station shows normal rainfall but YOUR farm fails from pests, disease, or theft, you get ZERO payout.", emphasis: ["AREA weather", "not your specific farm", "ZERO payout"] },
    { id: 8, title: "Make Your Choice!", content: "Each season, decide how much to spend on the insurance plus seeds bundle. You'll see how they work together over 4 seasons. Good luck!", emphasis: ["decide", "work together", "Good luck"] }
  ],
  seedling_dagbani: [
    { id: 1, title: "Ansoama, Puubu!", content: "Yi yɛ puubu Ghana zaa. Yi be chɛm chɛŋa yi mali zaŋ puuni kpeeni 4 zaa. Yi chɛŋa pam be nyɛ yi doo yuli dima.", emphasis: ["Ghana zaa", "kpeeni 4", "doo yuli"] },
    { id: 2, title: "Yi Puuni Mali", content: "Kpeeni pam zaa be yi mali ni yi sa: Insurance plus Zaamnɛ, Puuni Di Din, Karimi, ni Doo Yuli. Sa yɛlni!", emphasis: ["Insurance plus Zaamnɛ", "Sa yɛlni"] },
    { id: 3, title: "Saŋa Be Nyɛ Puuni Lahiri", content: "Saŋa ŋmani equals 50 percent puuni nyini, that is 1.5 times yi di. Saŋa ban ŋmani equals 30 to 70 percent puuni kpɛri. Saŋa ka yɛl yini kpeeni pam zaa!", emphasis: ["50 percent nyini", "30 to 70 percent kpɛri", "ka yɛl yini"] },
    { id: 4, title: "Saŋa Insurance Pahi", content: "Insurance be nyɛlibu yi saŋa ban ŋmani! Ka saŋa ban ŋmani yi kpeeni zaa, yi nya mali, even if yi puuni ka ku!", emphasis: ["nyɛlibu yi", "yi nya mali"] },
    { id: 5, title: "Insurance Mali Lahiri", content: "Yi DI 100 Ghana Cedis insurance. Yi NYA ka saŋa ban ŋmani: Koom kpɛrigu kpiligu equals 150 Cedis, Koom kpɛrigu pam equals 300 Cedis, Koom nyini equals 240 Cedis. Ka saŋa ŋmani, yi nya 0 Cedis.", emphasis: ["DI 100", "150 Cedis", "300 Cedis", "0 Cedis"] },
    { id: 6, title: "Zaamnɛ Nyɛlibu Be Nyini Yi Puuni!", content: "Hybrid zaamnɛ be diribu koom kpɛrigu and be nyini puuni 50 percent! Puubu yɛlibu be maa insurance ni zaamnɛ nyɛlibu bee ni nyɛlibu yi di AND nyini yi puuni. Bee nya be nyɛlibu yi mali.", emphasis: ["diribu koom kpɛrigu", "50 percent", "nyɛlibu yi di"] },
    { id: 7, title: "Pahi: Basis Risk", content: "Mali ni yi nya be zaŋ kpeeni saŋa pahi, not yi puuni zaŋ. Ka saŋa station pahi koom ŋmani ama YI puuni ku from yiribu, lahira, or gba, yi nya 0 payout.", emphasis: ["kpeeni saŋa pahi", "not yi puuni", "0 payout"] },
    { id: 8, title: "Chɛm Yi Chɛŋa!", content: "Kpeeni pam zaa, chɛŋi ka yi sa mali insurance plus zaamnɛ. Yi be nya ka bee be niŋi bee kpeeni 4 zaa. Yɛlibu be yi!", emphasis: ["chɛŋi", "bee be niŋi", "Yɛlibu be yi"] }
  ]
};

const VOICES = {
  english: { languageCode: 'en-GB', name: 'en-GB-Wavenet-A', ssmlGender: 'FEMALE' },
  dagbani: { languageCode: 'en-GB', name: 'en-GB-Wavenet-A', ssmlGender: 'FEMALE' }
};

function createSSML(title, content, emphasisWords) {
  let ssmlText = '<speak>';
  ssmlText += '<prosody rate="medium" pitch="+2st" volume="loud">' + title + '.</prosody><break time="500ms"/>';
  let processedContent = content;
  if (emphasisWords && emphasisWords.length > 0) {
    emphasisWords.forEach(word => {
      const regex = new RegExp('\\b' + word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '\\b', 'gi');
      processedContent = processedContent.replace(regex, '<emphasis level="strong">' + word + '</emphasis>');
    });
  }
  processedContent = processedContent.replace(/\. /g, '.<break time="600ms"/> ').replace(/! /g, '!<break time="700ms"/> ').replace(/\? /g, '?<break time="600ms"/> ');
  ssmlText += '<prosody rate="0.85" pitch="+1st">' + processedContent + '</prosody></speak>';
  return ssmlText;
}

async function generateAudio(card, filename, language) {
  const voice = VOICES[language];
  const ssmlInput = createSSML(card.title, card.content, card.emphasis);
  const request = { input: { ssml: ssmlInput }, voice: voice, audioConfig: { audioEncoding: 'MP3', speakingRate: 0.85, pitch: 0, volumeGainDb: 3.0 } };
  try {
    const [response] = await client.synthesizeSpeech(request);
    const outputPath = path.join(__dirname, 'public', 'tutorial-audio', filename);
    const dir = path.dirname(outputPath);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(outputPath, response.audioContent, 'binary');
    console.log('✅ ' + filename);
    return true;
  } catch (error) {
    console.error('❌ ' + filename + ': ' + error.message);
    return false;
  }
}

async function generateAllAudio() {
  console.log('🎙️  Generating Tutorial Audio - British English (Ghanaian accent!)');
  let successCount = 0, failCount = 0;
  for (const [key, cards] of Object.entries(TUTORIAL_DATA)) {
    const [treatment, language] = key.split('_');
    console.log('\n📦 ' + treatment.toUpperCase() + ' - ' + language.toUpperCase() + ' (' + cards.length + ' cards)');
    for (const card of cards) {
      const filename = treatment + '_' + language + '_card' + card.id + '.mp3';
      const success = await generateAudio(card, filename, language);
      if (success) successCount++; else failCount++;
      await new Promise(resolve => setTimeout(resolve, 800));
    }
  }
  console.log('\n✅ Success: ' + successCount + ' | ❌ Failed: ' + failCount);
}

generateAllAudio().catch(console.error);
