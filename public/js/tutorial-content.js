// ===============================================
// TUTORIAL CONTENT - UPDATED WITH CLEAR EXPLANATIONS
// WITH AUTO-ADVANCE TIMERS - MINIMUM 55 SECONDS
// Weather Index Insurance Game
// ===============================================

const TUTORIAL_CARDS = {
  
  // ==========================================
  // CONTROL GROUP (5 cards - NO insurance)
  // ==========================================
  control: [
    {
      id: 1,
      title: "Welcome, Farmer!",
      content: "You are a farmer in Ghana. You'll make decisions about how to invest your money across 4 farming rounds. Each decision affects your family's future.",
      icon: "🌾",
      highlight: true,
      autoAdvanceSeconds: 55
    },
    {
      id: 2,
      title: "Your Farm Budget",
      content: "Each round gives you money to spend on: Farm Inputs (seeds, fertilizer), Education (school fees), and Household Needs (food, clothing). Spend wisely!",
      icon: "💰",
      autoAdvanceSeconds: 60
    },
    {
      id: 3,
      title: "The Weather Challenge",
      content: "Weather is unpredictable! Good weather (☀️) = 50% MORE harvest (1.5x). Bad weather (⛈️) = 30-70% LESS harvest. You cannot control the weather.",
      icon: "🌤️",
      highlight: true,
      autoAdvanceSeconds: 55
    },
    {
      id: 4,
      title: "Making Tough Choices",
      content: "You must balance competing needs. Invest in farming? Pay for school? Save for emergencies? There's never enough for everything.",
      icon: "⚖️",
      autoAdvanceSeconds: 55
    },
    {
      id: 5,
      title: "Let's Begin!",
      content: "You'll play 4 farming rounds. Your decisions will show how you balance risk and reward. Good luck!",
      icon: "🚀",
      highlight: true
    }
  ],

  // ==========================================
  // FERTILIZER BUNDLE (8 cards with examples)
  // ==========================================
  fertilizer_bundle: [
    {
      id: 1,
      title: "Welcome, Farmer!",
      content: "You are a farmer in Ghana. You'll make decisions about how to invest your money across 4 farming rounds. Each decision affects your family's future.",
      icon: "🌾",
      highlight: true,
      autoAdvanceSeconds: 55
    },
    {
      id: 2,
      title: "Your Farm Budget",
      content: "Each round gives you money to spend on: Farm Inputs (seeds, fertilizer), Education (school fees), and Household Needs (food, clothing). Spend wisely!",
      icon: "💰",
      autoAdvanceSeconds: 60
    },
    {
      id: 3,
      title: "How Weather Affects Harvest",
      content: "☀️ Good weather = 50% MORE harvest (1.5x your investment). ⛈️ Bad weather = 30-70% LESS harvest. Weather is unpredictable each round!",
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
      title: "SPECIAL BUNDLE OFFER! 🎁",
      content: "Get BOTH insurance protection AND 2 bags of NPK fertilizer for 100 GHS! The fertilizer boosts your harvest by 50% MORE. Double benefit in one package!",
      icon: "📦",
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
      content: "Each round, decide: Buy the bundle (100 GHS) or spend differently? You'll see how insurance and fertilizer work together over 4 rounds. Good luck!",
      icon: "🎯",
      highlight: true
    }
  ],

  // ==========================================
  // SEEDLING BUNDLE (8 cards with examples)
  // ==========================================
  seedling_bundle: [
    {
      id: 1,
      title: "Welcome, Farmer!",
      content: "You are a farmer in Ghana. You'll make decisions about how to invest your money across 4 farming rounds. Each decision affects your family's future.",
      icon: "🌾",
      highlight: true,
      autoAdvanceSeconds: 55
    },
    {
      id: 2,
      title: "Your Farm Budget",
      content: "Each round gives you money to spend on: Farm Inputs (seeds, fertilizer), Education (school fees), and Household Needs (food, clothing). Spend wisely!",
      icon: "💰",
      autoAdvanceSeconds: 60
    },
    {
      id: 3,
      title: "How Weather Affects Harvest",
      content: "☀️ Good weather = 50% MORE harvest (1.5x your investment). ⛈️ Bad weather = 30-70% LESS harvest. Weather is unpredictable each round!",
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
      title: "SPECIAL BUNDLE OFFER! 🎁",
      content: "Get BOTH insurance protection AND hybrid maize seeds for 100 GHS! The improved seeds are drought-resistant and boost yields by 50% MORE. Double benefit in one package!",
      icon: "📦",
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
      content: "Each round, decide: Buy the bundle (100 GHS) or spend differently? You'll see how insurance and improved seeds work together over 4 rounds. Good luck!",
      icon: "🎯",
      highlight: true
    }
  ]
};

// ==========================================
// ROUND INTENSITY CONFIGURATION - 4 ROUNDS
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
// WEATHER ANIMATIONS FOR OUTCOMES - 4 ROUNDS
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