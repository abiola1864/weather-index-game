// ===============================================
// TUTORIAL CONTENT - REVISED VERSION
// Control = Minimal tutorial (5-6 cards), NO insurance education
// Treatments = Full tutorial with insurance details
// ===============================================

const TUTORIAL_CARDS = {
  
  // ==========================================
  // CONTROL GROUP - MINIMAL TUTORIAL
  // No insurance education, just basic game mechanics
  // ==========================================
  control: [
    {
      id: 1,
      title: "Welcome, Farmer!",
      content: "You are a farmer in Ghana. You'll make decisions about how to invest your money across 4 farming seasons. Each decision affects your family's future.",
      icon: "🌾",
      highlight: true,
      autoAdvanceSeconds: 50
    },
    {
      id: 2,
      title: "Your Farm Budget",
      content: "Each season gives you money to spend on: Farm Protection, Farm Inputs (seeds, fertilizer, tools), Education (school fees), and Household Needs (food, clothing). You must spend ALL your budget wisely.",
      icon: "💰",
      autoAdvanceSeconds: 55
    },
    {
      id: 3,
      title: "Weather is Unpredictable",
      content: "Weather affects your harvest each season. Sometimes it's good ☀️, sometimes it's challenging 🌧️. You cannot control the weather, but you can prepare for it.",
      icon: "🌤️",
      highlight: true,
      autoAdvanceSeconds: 50
    },
    {
      id: 4,
      title: "Make Your Decisions",
      content: "Each season, you'll decide how to allocate your budget across different needs. Think carefully about what's most important for your family's wellbeing.",
      icon: "🤔",
      autoAdvanceSeconds: 50
    },
    {
      id: 5,
      title: "Ready to Begin!",
      content: "You'll play through 4 farming seasons. Your choices matter! Try to make the best decisions you can for your household. Good luck!",
      icon: "🚀",
      highlight: true
    }
  ],

  // ==========================================
  // FERTILIZER BUNDLE GROUP - FULL TUTORIAL
  // ==========================================
  fertilizer_bundle: [
    {
      id: 1,
      title: "Welcome, Farmer!",
      content: "You are a farmer in Ghana. You'll make decisions about how to invest your money across 4 farming seasons. Each decision affects your family's future.",
      icon: "🌾",
      highlight: true,
      autoAdvanceSeconds: 55
    },
    {
      id: 2,
      title: "Your Farm Budget",
      content: "Each season gives you money to spend on: Insurance + Fertilizer Bundle, Additional Farm Inputs, Education (school fees), and Household Needs (food, clothing). Spend wisely!",
      icon: "💰",
      autoAdvanceSeconds: 60
    },
    {
      id: 3,
      title: "How Weather Affects Harvest",
      content: "☀️ Good weather = 50% MORE harvest (1.5x your investment). ⛈️ Bad weather = 30-70% LESS harvest. Weather is unpredictable each season!",
      icon: "🌤️",
      highlight: true,
      autoAdvanceSeconds: 60
    },
    {
      id: 4,
      title: "Weather Index Insurance Explained",
      content: "Insurance protects you from weather disasters! If bad weather is MEASURED in your area, you receive money - even if your exact farm wasn't affected.",
      icon: "🛡️",
      special: true,
      highlight: true,
      autoAdvanceSeconds: 65
    },
    {
      id: 5,
      title: "How Insurance Payouts Work 💰",
      content: "PAY: 100 GHS for insurance. RECEIVE if bad weather: Mild drought = 150 GHS (1.5x), Severe drought = 300 GHS (3x), Floods = 240 GHS (2.4x). If good weather = 0 GHS.",
      icon: "📊",
      special: true,
      highlight: true,
      autoAdvanceSeconds: 70
    },
    {
      id: 6,
      title: "Fertilizer Boosts Your Harvest! 🌾",
      content: "NPK fertilizer increases maize yields by 50%! Smart farmers combine fertilizer with insurance to protect their investment AND boost production. Both help secure your income.",
      icon: "🌾",
      special: true,
      highlight: true,
      autoAdvanceSeconds: 70
    },
    {
      id: 7,
      title: "Important: Basis Risk ⚠️",
      content: "Payouts depend on AREA weather measurements, not your specific farm. If the weather station shows normal rainfall but YOUR farm fails (pests, disease, theft), you get ZERO payout.",
      icon: "⚠️",
      critical: true,
      autoAdvanceSeconds: 70
    },
    {
      id: 8,
      title: "Make Your Choice!",
      content: "Each season, decide how much to spend on the insurance + fertilizer bundle. You'll see how they work together over 4 seasons. Good luck!",
      icon: "🎯",
      highlight: true
    }
  ],

  // ==========================================
  // SEEDLING BUNDLE GROUP - FULL TUTORIAL
  // ==========================================
  seedling_bundle: [
    {
      id: 1,
      title: "Welcome, Farmer!",
      content: "You are a farmer in Ghana. You'll make decisions about how to invest your money across 4 farming seasons. Each decision affects your family's future.",
      icon: "🌾",
      highlight: true,
      autoAdvanceSeconds: 55
    },
    {
      id: 2,
      title: "Your Farm Budget",
      content: "Each season gives you money to spend on: Insurance + Seeds Bundle, Additional Farm Inputs, Education (school fees), and Household Needs (food, clothing). Spend wisely!",
      icon: "💰",
      autoAdvanceSeconds: 60
    },
    {
      id: 3,
      title: "How Weather Affects Harvest",
      content: "☀️ Good weather = 50% MORE harvest (1.5x your investment). ⛈️ Bad weather = 30-70% LESS harvest. Weather is unpredictable each season!",
      icon: "🌤️",
      highlight: true,
      autoAdvanceSeconds: 60
    },
    {
      id: 4,
      title: "Weather Index Insurance Explained",
      content: "Insurance protects you from weather disasters! If bad weather is MEASURED in your area, you receive money - even if your exact farm wasn't affected.",
      icon: "🛡️",
      special: true,
      highlight: true,
      autoAdvanceSeconds: 65
    },
    {
      id: 5,
      title: "How Insurance Payouts Work 💰",
      content: "PAY: 100 GHS for insurance. RECEIVE if bad weather: Mild drought = 150 GHS (1.5x), Severe drought = 300 GHS (3x), Floods = 240 GHS (2.4x). If good weather = 0 GHS.",
      icon: "📊",
      special: true,
      highlight: true,
      autoAdvanceSeconds: 70
    },
    {
      id: 6,
      title: "Improved Seeds Boost Your Harvest! 🌱",
      content: "Hybrid maize seeds are drought-resistant and increase yields by 50%! Smart farmers combine improved seeds with insurance to protect their investment AND boost production. Both help secure your income.",
      icon: "🌱",
      special: true,
      highlight: true,
      autoAdvanceSeconds: 70
    },
    {
      id: 7,
      title: "Important: Basis Risk ⚠️",
      content: "Payouts depend on AREA weather measurements, not your specific farm. If the weather station shows normal rainfall but YOUR farm fails (pests, disease, theft), you get ZERO payout.",
      icon: "⚠️",
      critical: true,
      autoAdvanceSeconds: 70
    },
    {
      id: 8,
      title: "Make Your Choice!",
      content: "Each season, decide how much to spend on the insurance + seeds bundle. You'll see how they work together over 4 seasons. Good luck!",
      icon: "🎯",
      highlight: true
    }
  ]
};

// ==========================================
// SEASON INTENSITY CONFIGURATION - 4 SEASONS
// ==========================================
const ROUND_INTENSITY = {
  1: {
    level: "low",
    storyText: "The planting season begins. The sky is clear. You feel hopeful about this season.",
    weatherAnimation: "gentle-clouds",
    dramaticEffects: false
  },
  2: {
    level: "low",
    storyText: "Your crops are growing well. Some neighbors talk about unpredictable weather patterns.",
    weatherAnimation: "gentle-clouds",
    dramaticEffects: false
  },
  3: {
    level: "medium",
    storyText: "Weather reports are mixed. Some farmers are worried. You must decide carefully how to protect your family.",
    weatherAnimation: "darkening-clouds",
    dramaticEffects: false
  },
  4: {
    level: "high",
    storyText: "⚠️ FINAL SEASON! The rains are unpredictable. Your family's future depends on this decision!",
    weatherAnimation: "storm-approaching",
    dramaticEffects: true,
    showWarning: true
  }
};

// ==========================================
// WEATHER ANIMATIONS FOR OUTCOMES - 4 SEASONS
// ==========================================
const WEATHER_ANIMATIONS = {
  round1: {
    good: {
      animation: 'gentle-sunshine',
      message: 'Perfect weather! Your crops grew beautifully.',
      soundEffect: 'success',
      confetti: false,
      dramaticPause: 0
    },
    bad: {
      animation: 'light-clouds',
      message: 'Some dry spells affected your crops.',
      soundEffect: 'warning',
      confetti: false,
      dramaticPause: 0
    }
  },
  round2: {
    good: {
      animation: 'gentle-sunshine',
      message: 'Good rains again! Your harvest looks promising.',
      soundEffect: 'success',
      confetti: false,
      dramaticPause: 0
    },
    bad: {
      animation: 'light-clouds',
      message: 'Below average rainfall. Your yields were reduced.',
      soundEffect: 'warning',
      confetti: false,
      dramaticPause: 0
    }
  },
  round3: {
    good: {
      animation: 'bright-sunshine',
      message: 'Excellent rains came at the right time!',
      soundEffect: 'success',
      confetti: false,
      dramaticPause: 0
    },
    bad: {
      animation: 'storm-clouds',
      message: 'Drought damaged many farms in the area.',
      soundEffect: 'alert',
      confetti: false,
      dramaticPause: 1
    }
  },
  round4: {
    good: {
      animation: 'brilliant-sunshine',
      message: '🎉 FANTASTIC! The best harvest of the season!',
      soundEffect: 'celebration',
      confetti: true,
      dramaticPause: 0
    },
    bad: {
      animation: 'severe-storm',
      message: '⚠️ DISASTER! Severe weather destroyed crops across the region.',
      soundEffect: 'emergency',
      confetti: false,
      dramaticPause: 2
    }
  }
};






// ===== TUTORIAL CONTENT - DAGBANI TRANSLATIONS =====
// Add this to your tutorial-content.js file

const TUTORIAL_CARDS_DAGBANI = {
  
  // CONTROL GROUP - Dagbani
  control: [
    {
      id: 1,
      title: "Ansoama, Puubu!",
      content: "Yi yɛ puubu Ghana zaa. Yi be chɛm chɛŋa yi mali zaŋ puuni kpeeni 4 zaa. Yi chɛŋa pam be nyɛ yi doo yuli dima.",
      icon: "🌾",
      highlight: true,
      autoAdvanceSeconds: 50
    },
    {
      id: 2,
      title: "Yi Puuni Mali",
      content: "Kpeeni pam zaa be yi mali ni yi sa: Puuni Nyɛlibu, Puuni Di (zaamnɛ, fertilizer, tools), Karimi (karimi mali), ni Doo Yuli (dimi, suhiya). Yi boɣi ka sa yi mali zaa yɛlni.",
      icon: "💰",
      autoAdvanceSeconds: 55
    },
    {
      id: 3,
      title: "Saŋa Ka Yɛl Yini",
      content: "Saŋa be nyɛ yi puuni kpeeni pam zaa. Kani kpeeni ŋmani ☀️, kani kpeeni ban ŋmani 🌧️. Yi ka ni saŋa, ama yi ni nyɛlibu.",
      icon: "🌤️",
      highlight: true,
      autoAdvanceSeconds: 50
    },
    {
      id: 4,
      title: "Chɛm Yi Chɛŋa",
      content: "Kpeeni pam zaa, yi be chɛŋi ka yi sa yi mali lahiri. Lahiri ka zaa ni pahi yi doo yuli yɛlibu.",
      icon: "🤔",
      autoAdvanceSeconds: 50
    },
    {
      id: 5,
      title: "Nyɛlibu Ti Dɔɣi!",
      content: "Yi be puuni kpeeni 4. Yi chɛŋa pam! Ti chɛm chɛŋa nyɛlibu ni yi doo. Yɛlibu be yi!",
      icon: "🚀",
      highlight: true
    }
  ],

  // FERTILIZER BUNDLE - Dagbani
  fertilizer_bundle: [
    {
      id: 1,
      title: "Ansoama, Puubu!",
      content: "Yi yɛ puubu Ghana zaa. Yi be chɛm chɛŋa yi mali zaŋ puuni kpeeni 4 zaa. Yi chɛŋa pam be nyɛ yi doo yuli dima.",
      icon: "🌾",
      highlight: true,
      autoAdvanceSeconds: 55
    },
    {
      id: 2,
      title: "Yi Puuni Mali",
      content: "Kpeeni pam zaa be yi mali ni yi sa: Insurance + Fertilizer, Puuni Di Din, Karimi, ni Doo Yuli. Sa yɛlni!",
      icon: "💰",
      autoAdvanceSeconds: 60
    },
    {
      id: 3,
      title: "Saŋa Be Nyɛ Puuni Lahiri",
      content: "☀️ Saŋa ŋmani = 50% puuni nyini (1.5x yi di). ⛈️ Saŋa ban ŋmani = 30-70% puuni kpɛri. Saŋa ka yɛl yini kpeeni pam zaa!",
      icon: "🌤️",
      highlight: true,
      autoAdvanceSeconds: 60
    },
    {
      id: 4,
      title: "Saŋa Insurance Pahi",
      content: "Insurance be nyɛlibu yi saŋa ban ŋmani! Ka saŋa ban ŋmani yi kpeeni zaa, yi nya mali - ka yi puuni ka ku!",
      icon: "🛡️",
      special: true,
      highlight: true,
      autoAdvanceSeconds: 65
    },
    {
      id: 5,
      title: "Insurance Mali Lahiri 💰",
      content: "DI: 100 GHS insurance. NYA ka saŋa ban ŋmani: Koom kpɛrigu kpiligu = 150 GHS (1.5x), Koom kpɛrigu pam = 300 GHS (3x), Koom nyini = 240 GHS (2.4x). Ka saŋa ŋmani = 0 GHS.",
      icon: "📊",
      special: true,
      highlight: true,
      autoAdvanceSeconds: 70
    },
    {
      id: 6,
      title: "Fertilizer Be Nyini Yi Puuni! 🌾",
      content: "NPK fertilizer be nyini zaamnɛ 50%! Puubu yɛlibu be maa insurance ni fertilizer bee ni nyɛlibu yi di NI nyini yi puuni. Bee nya be nyɛlibu yi mali.",
      icon: "🌾",
      special: true,
      highlight: true,
      autoAdvanceSeconds: 70
    },
    {
      id: 7,
      title: "Pahi: Basis Risk ⚠️",
      content: "Mali ni yi nya be zaŋ kpeeni saŋa pahi, ka yi puuni zaŋ. Ka saŋa station pahi koom ŋmani ama YI puuni ku (yiribu, lahira, gba), yi nya 0 GHS.",
      icon: "⚠️",
      critical: true,
      autoAdvanceSeconds: 70
    },
    {
      id: 8,
      title: "Chɛm Yi Chɛŋa!",
      content: "Kpeeni pam zaa, chɛŋi ka yi sa mali insurance + fertilizer. Yi be nya ka bee be niŋi bee kpeeni 4 zaa. Yɛlibu be yi!",
      icon: "🎯",
      highlight: true
    }
  ],

  // SEEDLING BUNDLE - Dagbani
  seedling_bundle: [
    {
      id: 1,
      title: "Ansoama, Puubu!",
      content: "Yi yɛ puubu Ghana zaa. Yi be chɛm chɛŋa yi mali zaŋ puuni kpeeni 4 zaa. Yi chɛŋa pam be nyɛ yi doo yuli dima.",
      icon: "🌾",
      highlight: true,
      autoAdvanceSeconds: 55
    },
    {
      id: 2,
      title: "Yi Puuni Mali",
      content: "Kpeeni pam zaa be yi mali ni yi sa: Insurance + Zaamnɛ, Puuni Di Din, Karimi, ni Doo Yuli. Sa yɛlni!",
      icon: "💰",
      autoAdvanceSeconds: 60
    },
    {
      id: 3,
      title: "Saŋa Be Nyɛ Puuni Lahiri",
      content: "☀️ Saŋa ŋmani = 50% puuni nyini (1.5x yi di). ⛈️ Saŋa ban ŋmani = 30-70% puuni kpɛri. Saŋa ka yɛl yini kpeeni pam zaa!",
      icon: "🌤️",
      highlight: true,
      autoAdvanceSeconds: 60
    },
    {
      id: 4,
      title: "Saŋa Insurance Pahi",
      content: "Insurance be nyɛlibu yi saŋa ban ŋmani! Ka saŋa ban ŋmani yi kpeeni zaa, yi nya mali - ka yi puuni ka ku!",
      icon: "🛡️",
      special: true,
      highlight: true,
      autoAdvanceSeconds: 65
    },
    {
      id: 5,
      title: "Insurance Mali Lahiri 💰",
      content: "DI: 100 GHS insurance. NYA ka saŋa ban ŋmani: Koom kpɛrigu kpiligu = 150 GHS (1.5x), Koom kpɛrigu pam = 300 GHS (3x), Koom nyini = 240 GHS (2.4x). Ka saŋa ŋmani = 0 GHS.",
      icon: "📊",
      special: true,
      highlight: true,
      autoAdvanceSeconds: 70
    },
    {
      id: 6,
      title: "Zaamnɛ Nyɛlibu Be Nyini Yi Puuni! 🌱",
      content: "Hybrid zaamnɛ be diribu koom kpɛrigu ni be nyini puuni 50%! Puubu yɛlibu be maa insurance ni zaamnɛ nyɛlibu bee ni nyɛlibu yi di NI nyini yi puuni. Bee nya be nyɛlibu yi mali.",
      icon: "🌱",
      special: true,
      highlight: true,
      autoAdvanceSeconds: 70
    },
    {
      id: 7,
      title: "Pahi: Basis Risk ⚠️",
      content: "Mali ni yi nya be zaŋ kpeeni saŋa pahi, ka yi puuni zaŋ. Ka saŋa station pahi koom ŋmani ama YI puuni ku (yiribu, lahira, gba), yi nya 0 GHS.",
      icon: "⚠️",
      critical: true,
      autoAdvanceSeconds: 70
    },
    {
      id: 8,
      title: "Chɛm Yi Chɛŋa!",
      content: "Kpeeni pam zaa, chɛŋi ka yi sa mali insurance + zaamnɛ. Yi be nya ka bee be niŋi bee kpeeni 4 zaa. Yɛlibu be yi!",
      icon: "🎯",
      highlight: true
    }
  ]
};

// Function to get tutorial cards based on treatment and language
function getTutorialCardsForLanguage(treatment, language) {
    if (language === 'dagbani') {
        return TUTORIAL_CARDS_DAGBANI[treatment] || TUTORIAL_CARDS_DAGBANI.control;
    }
    return TUTORIAL_CARDS[treatment] || TUTORIAL_CARDS.control;
}
