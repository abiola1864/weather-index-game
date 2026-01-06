const textToSpeech = require('@google-cloud/text-to-speech');
const fs = require('fs');
const path = require('path');

// Initialize the client with your credentials
const client = new textToSpeech.TextToSpeechClient({
  keyFilename: './google-credentials.json'
});

// Tutorial cards data (from your PDF)
const TUTORIAL_DATA = {
  control_english: [
    { id: 1, title: "Welcome Farmer!", content: "You will play through 4 farming seasons. Each season, you'll make important decisions about spending your money." },
    { id: 2, title: "Your Budget", content: "Each season, you'll receive a budget starting at 500 Ghana Cedis. You must allocate ALL of it across different needs." },
    { id: 3, title: "Weather Insurance Optional", content: "You CAN buy weather insurance for 100 Ghana Cedis. If bad weather strikes, insurance pays you back. If weather is good, you don't get a payout." },
    { id: 4, title: "Important: You Choose the Input", content: "If you buy insurance, you must ALSO choose ONE farm input to receive: Either Improved Seeds OR Fertilizer. This is your choice!" },
    { id: 5, title: "Other Spending", content: "Besides insurance, you can spend on: Farm Inputs like seeds, tools, labor; Education such as school fees and books; and Household Needs like food and clothing." },
    { id: 6, title: "Weather is Random", content: "Each season, weather is randomly determined. Good weather equals Better harvest. Drought or Flood equals Lower harvest. Weather affects EVERYONE, not just those with insurance." },
    { id: 7, title: "How Insurance Works", content: "Insurance is AREA-BASED. If there's a drought in the area, ALL insured farmers get paid. Payment is based on rainfall data, not your individual farm damage." },
    { id: 8, title: "Key Concept: Basis Risk", content: "IMPORTANT: You might have a bad harvest but get NO payout if the area rainfall was normal. Or the area might have drought triggering payout even if your farm was okay." },
    { id: 9, title: "Your Goal", content: "Make smart decisions each season. Balance protection from insurance with other needs. Learn how insurance works in practice." },
    { id: 10, title: "Ready to Start?", content: "Remember: You can choose insurance plus input each season. There are 4 seasons total. Make your best decisions!" }
  ],
  
  control_dagbani: [
    { id: 1, title: "Antukuliya Puunima!", content: "Yi be ayi puuni kpeeni 4. Kpeeni pam zaa, yi be chɛm chɛŋa tiŋa yi mali di lahiri." },
    { id: 2, title: "Yi Mali", content: "Kpeeni pam zaa, yi nya mali dɔɣi ni 500 Ghana Cedis. Yi chɛm ka yi di zaa lahira ni yi yɛli." },
    { id: 3, title: "Saŋa Insurance Yi Ni Chɛ", content: "Yi ni sa saŋa insurance 100 Ghana Cedis. Ka saŋa nyɛma be, insurance di yi mali. Ka saŋa nyɛlibu, yi ka nya mali." },
    { id: 4, title: "Yɛlni: Yi Chɛ Puuni Di", content: "Ka yi sa insurance, yi chɛm ka yi CHƐ puuni di DƆƔIM yi nya: Zaamnɛ Nyɛlibu BEE Fertilizer. Ŋɔ yi chɛŋa!" },
    { id: 5, title: "Mali Din Di", content: "Insurance kpɛ, yi ni di mali: Puuni Di zaamnɛ, tools, niŋa; Karimi karimi mali, buka; Doo Yuli dimi, suhiya." },
    { id: 6, title: "Saŋa Ka Yɛl Yini", content: "Kpeeni pam zaa, saŋa ka yɛl yini: Saŋa nyɛlibu equals Puuni nyɛlibu. Koom kpɛrigu bee Koom nyini equals Puuni kpɛrigu. Saŋa nyɛ BANBU ZAA, ka insurance bi yɛɣini." },
    { id: 7, title: "Insurance Niŋa Lahiri", content: "Insurance yɛl TƆƔIM LAHIRA. Ka koom kpɛrigu yɛl tɔɣim zaa, puunima ZAA ni insurance nya mali. Mali yɛl koom data lahira, ka yi puuni yɛɣini lahira." },
    { id: 8, title: "Lahi Tiŋa: Basis Risk", content: "YƐLNI: Yi ni nya puuni nyɛma amma yi KA NYA mali ka tɔɣim koom nyɛlibu. Bee tɔɣim ni nya koom kpɛrigu insurance di ka yi puuni nyɛlibu." },
    { id: 9, title: "Yi Dɔɣim", content: "Chɛm chɛŋa nyɛlibu kpeeni pam zaa. Nya nyɛlibu insurance ni lahira din bee. Lahi insurance niŋa lahiri." },
    { id: 10, title: "Yi Dɔɣi?", content: "Lahiri: Yi ni chɛ insurance plus puuni di kpeeni pam zaa. Kpeeni 4 yɛl zaa. Chɛm yi chɛŋa nyɛlibu!" }
  ],
  
  fertilizer_english: [
    { id: 1, title: "Welcome Farmer!", content: "You will play through 4 farming seasons. Each season, you'll make important decisions about spending your money." },
    { id: 2, title: "Your Budget", content: "Each season, you'll receive a budget starting at 500 Ghana Cedis. You must allocate ALL of it across different needs." },
    { id: 3, title: "Special Bundle Available!", content: "You have access to a SPECIAL BUNDLE: Weather Insurance plus 2 Bags of NPK Fertilizer together for just 100 Ghana Cedis!" },
    { id: 4, title: "Why This Bundle is Special", content: "Normally fertilizer costs extra. But in this bundle, you get BOTH insurance protection AND quality fertilizer for one fixed price!" },
    { id: 5, title: "Insurance Protection", content: "The insurance part works like normal: If bad weather strikes, you get a payout. If weather is good, no payout, but you still have the fertilizer!" },
    { id: 6, title: "Other Spending", content: "Besides the bundle, you can spend on: Additional Farm Inputs, Education such as school fees and books, and Household Needs like food and clothing." },
    { id: 7, title: "Weather is Random", content: "Each season, weather is randomly determined. Good weather equals Better harvest. Drought or Flood equals Lower harvest. Weather affects EVERYONE." },
    { id: 8, title: "How Insurance Works", content: "Insurance is AREA-BASED. If there's a drought in the area, ALL insured farmers get paid. Payment is based on rainfall data, not individual farm damage." },
    { id: 9, title: "Key Concept: Basis Risk", content: "IMPORTANT: You might have a bad harvest but get NO payout if area rainfall was normal. Or area might have drought with payout even if your farm was okay." },
    { id: 10, title: "Bundle Decision", content: "Each season, decide: Buy the bundle, insurance plus fertilizer, for 100 Ghana Cedis? Or skip it and spend differently?" },
    { id: 11, title: "Ready to Start?", content: "Remember: The bundle gives you BOTH insurance AND fertilizer. There are 4 seasons total. Make your best decisions!" }
  ],
  
  fertilizer_dagbani: [
    { id: 1, title: "Antukuliya Puunima!", content: "Yi be ayi puuni kpeeni 4. Kpeeni pam zaa, yi be chɛm chɛŋa tiŋa yi mali di lahiri." },
    { id: 2, title: "Yi Mali", content: "Kpeeni pam zaa, yi nya mali dɔɣi ni 500 Ghana Cedis. Yi chɛm ka yi di zaa lahira ni yi yɛli." },
    { id: 3, title: "Bundle Palli Yɛl!", content: "Yi nya BUNDLE PALLI: Saŋa Insurance plus NPK Fertilizer baga ayi bee 100 Ghana Cedis yɛɣini!" },
    { id: 4, title: "Bundle Ŋɔ Palli Lahiri", content: "Yɛɣikpeeni fertilizer mali pam. Amma bundle ŋɔ zaa, yi nya insurance NI fertilizer nyɛlibu mali dɔɣim yɛɣini!" },
    { id: 5, title: "Insurance Nyɛlibu", content: "Insurance niŋa yɛɣikpeeni lahiri: Ka saŋa nyɛma, yi nya mali. Ka saŋa nyɛlibu, yi ka nya mali amma yi nya fertilizer bi!" },
    { id: 6, title: "Mali Din Di", content: "Bundle kpɛ, yi ni di mali: Puuni Di Din, Karimi karimi mali, buka, Doo Yuli dimi, suhiya." },
    { id: 7, title: "Saŋa Ka Yɛl Yini", content: "Kpeeni pam zaa, saŋa ka yɛl yini: Saŋa nyɛlibu equals Puuni nyɛlibu. Koom kpɛrigu bee Koom nyini equals Puuni kpɛrigu. Saŋa nyɛ BANBU ZAA." },
    { id: 8, title: "Insurance Niŋa Lahiri", content: "Insurance yɛl TƆƔIM LAHIRA. Ka koom kpɛrigu yɛl tɔɣim zaa, puunima ZAA ni insurance nya mali. Mali yɛl koom data lahira." },
    { id: 9, title: "Lahi Tiŋa: Basis Risk", content: "YƐLNI: Yi ni nya puuni nyɛma amma yi KA NYA mali ka tɔɣim koom nyɛlibu. Bee tɔɣim ni nya koom kpɛrigu mali di ka yi puuni nyɛlibu." },
    { id: 10, title: "Bundle Chɛŋa", content: "Kpeeni pam zaa, chɛŋi: Sa bundle insurance plus fertilizer 100 Ghana Cedis? Bee yi kpa ka di lahira din?" },
    { id: 11, title: "Yi Dɔɣi?", content: "Lahiri: Bundle di yi insurance NI fertilizer BEE. Kpeeni 4 yɛl zaa. Chɛm yi chɛŋa nyɛlibu!" }
  ],
  
  seedling_english: [
    { id: 1, title: "Welcome Farmer!", content: "You will play through 4 farming seasons. Each season, you'll make important decisions about spending your money." },
    { id: 2, title: "Your Budget", content: "Each season, you'll receive a budget starting at 500 Ghana Cedis. You must allocate ALL of it across different needs." },
    { id: 3, title: "Special Bundle Available!", content: "You have access to a SPECIAL BUNDLE: Weather Insurance plus Improved Maize Seeds together for just 100 Ghana Cedis!" },
    { id: 4, title: "Why This Bundle is Special", content: "These are DROUGHT-RESISTANT hybrid seeds! You get BOTH insurance protection AND premium seeds for one fixed price!" },
    { id: 5, title: "Insurance Protection", content: "The insurance part works like normal: If bad weather strikes, you get a payout. If weather is good, no payout, but you still have the quality seeds!" },
    { id: 6, title: "Other Spending", content: "Besides the bundle, you can spend on: Additional Farm Inputs, Education such as school fees and books, and Household Needs like food and clothing." },
    { id: 7, title: "Weather is Random", content: "Each season, weather is randomly determined. Good weather equals Better harvest. Drought or Flood equals Lower harvest. Weather affects EVERYONE." },
    { id: 8, title: "How Insurance Works", content: "Insurance is AREA-BASED. If there's a drought in the area, ALL insured farmers get paid. Payment is based on rainfall data, not individual farm damage." },
    { id: 9, title: "Key Concept: Basis Risk", content: "IMPORTANT: You might have a bad harvest but get NO payout if area rainfall was normal. Or area might have drought with payout even if your farm was okay." },
    { id: 10, title: "Bundle Decision", content: "Each season, decide: Buy the bundle, insurance plus improved seeds, for 100 Ghana Cedis? Or skip it and spend differently?" },
    { id: 11, title: "Ready to Start?", content: "Remember: The bundle gives you BOTH insurance AND drought-resistant seeds. There are 4 seasons total. Make your best decisions!" }
  ],
  
  seedling_dagbani: [
    { id: 1, title: "Antukuliya Puunima!", content: "Yi be ayi puuni kpeeni 4. Kpeeni pam zaa, yi be chɛm chɛŋa tiŋa yi mali di lahiri." },
    { id: 2, title: "Yi Mali", content: "Kpeeni pam zaa, yi nya mali dɔɣi ni 500 Ghana Cedis. Yi chɛm ka yi di zaa lahira ni yi yɛli." },
    { id: 3, title: "Bundle Palli Yɛl!", content: "Yi nya BUNDLE PALLI: Saŋa Insurance plus Zaamnɛ Nyɛlibu bee 100 Ghana Cedis yɛɣini!" },
    { id: 4, title: "Bundle Ŋɔ Palli Lahiri", content: "Ŋɔ ZAAMNƐ NYƐLIBU ni ka yɛl koom kpɛrigu zaa! Yi nya insurance nyɛlibu NI zaamnɛ palli mali dɔɣim yɛɣini!" },
    { id: 5, title: "Insurance Nyɛlibu", content: "Insurance niŋa yɛɣikpeeni lahiri: Ka saŋa nyɛma, yi nya mali. Ka saŋa nyɛlibu, yi ka nya mali amma yi nya zaamnɛ nyɛlibu bi!" },
    { id: 6, title: "Mali Din Di", content: "Bundle kpɛ, yi ni di mali: Puuni Di Din, Karimi karimi mali, buka, Doo Yuli dimi, suhiya." },
    { id: 7, title: "Saŋa Ka Yɛl Yini", content: "Kpeeni pam zaa, saŋa ka yɛl yini: Saŋa nyɛlibu equals Puuni nyɛlibu. Koom kpɛrigu bee Koom nyini equals Puuni kpɛrigu. Saŋa nyɛ BANBU ZAA." },
    { id: 8, title: "Insurance Niŋa Lahiri", content: "Insurance yɛl TƆƔIM LAHIRA. Ka koom kpɛrigu yɛl tɔɣim zaa, puunima ZAA ni insurance nya mali. Mali yɛl koom data lahira." },
    { id: 9, title: "Lahi Tiŋa: Basis Risk", content: "YƐLNI: Yi ni nya puuni nyɛma amma yi KA NYA mali ka tɔɣim koom nyɛlibu. Bee tɔɣim ni nya koom kpɛrigu mali di ka yi puuni nyɛlibu." },
    { id: 10, title: "Bundle Chɛŋa", content: "Kpeeni pam zaa, chɛŋi: Sa bundle insurance plus zaamnɛ nyɛlibu 100 Ghana Cedis? Bee yi kpa ka di lahira din?" },
    { id: 11, title: "Yi Dɔɣi?", content: "Lahiri: Bundle di yi insurance NI zaamnɛ nyɛlibu BEE. Kpeeni 4 yɛl zaa. Chɛm yi chɛŋa nyɛlibu!" }
  ]
};

// Voice configurations
const VOICES = {
  english: {
    languageCode: 'en-US',
    name: 'en-US-Neural2-F',
    ssmlGender: 'FEMALE'
  },
  dagbani: {
    languageCode: 'en-GB',
    name: 'en-GB-Neural2-A',
    ssmlGender: 'FEMALE'
  }
};

async function generateAudio(text, filename, language) {
  const voice = VOICES[language];
  
  const request = {
    input: { text: text },
    voice: voice,
    audioConfig: {
      audioEncoding: 'MP3',
      speakingRate: 0.85,
      pitch: 0,
      volumeGainDb: 0
    },
  };

  try {
    const [response] = await client.synthesizeSpeech(request);
    const outputPath = path.join(__dirname, 'public', 'tutorial-audio', filename);
    
    const dir = path.dirname(outputPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    
    fs.writeFileSync(outputPath, response.audioContent, 'binary');
    console.log(`✅ Generated: ${filename}`);
    return true;
  } catch (error) {
    console.error(`❌ Error generating ${filename}:`, error.message);
    return false;
  }
}

async function generateAllAudio() {
  console.log('🎙️  Starting audio generation for 64 tutorial cards...');
  console.log('📁 Output directory: ./public/tutorial-audio/\n');
  
  let successCount = 0;
  let failCount = 0;
  
  for (const [key, cards] of Object.entries(TUTORIAL_DATA)) {
    const [treatment, language] = key.split('_');
    
    console.log(`\n📦 Processing ${treatment.toUpperCase()} - ${language.toUpperCase()}`);
    console.log(`   (${cards.length} cards)\n`);
    
    for (const card of cards) {
      const filename = `${treatment}_${language}_card${card.id}.mp3`;
      const fullText = `${card.title}. ${card.content}`;
      
      const success = await generateAudio(fullText, filename, language);
      
      if (success) {
        successCount++;
      } else {
        failCount++;
      }
      
      await new Promise(resolve => setTimeout(resolve, 500));
    }
  }
  
  console.log('\n' + '='.repeat(60));
  console.log(`\n✅ Successfully generated: ${successCount} files`);
  console.log(`❌ Failed: ${failCount} files`);
  console.log(`\n📁 Audio files saved to: ./public/tutorial-audio/\n`);
}

generateAllAudio().catch(console.error);