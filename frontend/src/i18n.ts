export type Language = 'en' | 'te' | 'hi';

export interface Translations {
  appName: string;
  tagline: string;
  heroTitle: string;
  heroSubtitle: string;
  sellMyCrop: string;
  findCrops: string;
  workflowTitle: string;
  workflowSubtitle: string;
  stepFarmer: string;
  stepAiId: string;
  stepIntel: string;
  stepMatch: string;
  stepBuyer: string;
  navMarketplace: string;
  navFarmerDash: string;
  navBuyerDash: string;
  navCropId: string;
  navWhatToGrow: string;
  navPriceIntel: string;
  navSmartMatch: string;
  navAgriAssist: string;
  navOrders: string;
  navMap: string;
  navAdmin: string;
  verifiedFarmer: string;
  verifiedBuyer: string;
  aiCropVerified: string;
  voiceButton: string;
  voiceListening: string;
  voiceListingPrompt: string;
  voiceExample: string;
  searchPlaceholder: string;
  pricePerKg: string;
  availableQty: string;
  harvestDate: string;
  contactFarmer: string;
  sendRequest: string;
  matchScore: string;
  recentTrends: string;
  knowYourPrice: string;
  recommendationTitle: string;
  recommendationSubtitle: string;
  calculateMatch: string;
}

export const translations: Record<Language, Translations> = {
  en: {
    appName: "AgriLink",
    tagline: "From Farm to Buyer. Direct. Smart. Transparent.",
    heroTitle: "From Farm to Buyer. Direct. Smart. Transparent.",
    heroSubtitle: "AgriLink connects farmers directly with verified commercial buyers using AI-powered crop identification, seasonal intelligence, and smart matching.",
    sellMyCrop: "Sell My Crop (Farmer)",
    findCrops: "Find Crops (Buyer)",
    workflowTitle: "How AgriLink Eliminates Middlemen",
    workflowSubtitle: "End-to-end AI crop intelligence from seed to sale",
    stepFarmer: "Farmer Lists Crop",
    stepAiId: "AI Crop Detection",
    stepIntel: "Season & Price Intel",
    stepMatch: "Smart AI Matching",
    stepBuyer: "Direct Buyer Deal",
    navMarketplace: "Marketplace",
    navFarmerDash: "Farmer Hub",
    navBuyerDash: "Buyer Hub",
    navCropId: "AI Crop ID",
    navWhatToGrow: "What to Grow?",
    navPriceIntel: "Price Intel",
    navSmartMatch: "Smart Match",
    navAgriAssist: "AgriAssist AI",
    navOrders: "My Orders",
    navMap: "Farm Map",
    navAdmin: "Admin",
    verifiedFarmer: "Verified Farmer ✓",
    verifiedBuyer: "Verified Buyer ✓",
    aiCropVerified: "AI Crop Verified",
    voiceButton: "Speak to AgriLink",
    voiceListening: "Listening... Speak now",
    voiceListingPrompt: "Say: 'I have 200 kilos of tomatoes to sell'",
    voiceExample: "Example: 'I have 500 kg of Guntur chillies ready for harvest'",
    searchPlaceholder: "Search crops, varieties, locations (e.g. Tomatoes in Rajahmundry)...",
    pricePerKg: "Price per kg",
    availableQty: "Available Quantity",
    harvestDate: "Harvest Date",
    contactFarmer: "Contact Farmer Direct",
    sendRequest: "Send Buyer Requirement",
    matchScore: "AI Match Score",
    recentTrends: "Price Trend",
    knowYourPrice: "Know Your Price Intelligence",
    recommendationTitle: "What Should I Grow Next Season?",
    recommendationSubtitle: "AI analysis of your soil, water, season & market demand to maximize profit",
    calculateMatch: "Find Best Buyers for My Crop"
  },
  te: {
    appName: "అగ్రిలింక్ (AgriLink)",
    tagline: "పొలం నుండి కొనుగోలుదారు వరకు. నేరుగా. స్మార్ట్ గా. పారదర్శకంగా.",
    heroTitle: "పొలం నుండి కొనుగోలుదారు వరకు నేరుగా!",
    heroSubtitle: "దళారులు లేకుండా రైతులకు నేరుగా వెరిఫైడ్ కొనుగోలుదారులతో అనుసంధానం. AI పంట గుర్తింపు, కాలానుగుణ ధర సమాచారం & స్మార్ట్ మ్యాచింగ్.",
    sellMyCrop: "నా పంటను అమ్మండి (రైతు)",
    findCrops: "పంటలను కొనండి (కొనుగోలుదారు)",
    workflowTitle: "అగ్రిలింక్ ద్వారా దళారుల నివారణ",
    workflowSubtitle: "విత్తనం నుండి అమ్మకం వరకు పూర్తి AI సాంకేతికత",
    stepFarmer: "రైతు పంట వివరాలు",
    stepAiId: "AI పంట గుర్తింపు",
    stepIntel: "ధర & కాల సమాచారం",
    stepMatch: "స్మార్ట్ మ్యాచింగ్",
    stepBuyer: "నేరుగా కొనుగోలు",
    navMarketplace: "సంత / మార్కెట్",
    navFarmerDash: "రైతు డ్యాష్‌బోర్డ్",
    navBuyerDash: "బయ్యర్ డ్యాష్‌బోర్డ్",
    navCropId: "AI పంట గుర్తింపు",
    navWhatToGrow: "ఏ పంట వేయాలి?",
    navPriceIntel: "ధరల సమాచారం",
    navSmartMatch: "స్మార్ట్ మ్యాచింగ్",
    navAgriAssist: "అగ్రిఅసిస్ట్ AI",
    navOrders: "ఆర్డర్లు",
    navMap: "మ్యాప్",
    navAdmin: "అడ్మిన్",
    verifiedFarmer: "ధృవీకరించబడిన రైతు ✓",
    verifiedBuyer: "ధృవీకరించబడిన కొనుగోలుదారు ✓",
    aiCropVerified: "AI ద్వారా సరిచూడబడింది",
    voiceButton: "మాట్లాడండి",
    voiceListening: "వింటున్నాము... మాట్లాడండి",
    voiceListingPrompt: "చెప్పండి: 'నా దగ్గర 200 కేజీల టమాటాలు అమ్మకానికి ఉన్నాయి'",
    voiceExample: "ఉదాహరణ: 'నా దగ్గర 500 కేజీల గుంటూరు మిర్చి ఉన్నాయి'",
    searchPlaceholder: "పంటలు లేదా ప్రాంతం వెతకండి (ఉదా: రాజమండ్రిలో టమాటాలు)...",
    pricePerKg: "కేజీ ధర",
    availableQty: "లభ్యమైన పరిమాణం",
    harvestDate: "కోత తేదీ",
    contactFarmer: "రైతుతో నేరుగా మాట్లాడండి",
    sendRequest: "కొనుగోలు ఆర్డర్ పంపండి",
    matchScore: "AI సరిపోలిక శాతం",
    recentTrends: "ధరల ధోరణి",
    knowYourPrice: "మీ సరైన ధర తెలుసుకోండి",
    recommendationTitle: "ఈ సీజన్ లో ఏ పంట వేస్తే లాభం?",
    recommendationSubtitle: "నేల, నీటి వసతి, కాలం ఆధారంగా AI పంట సూచనలు",
    calculateMatch: "నా పంటకు కొనుగోలుదారులను వెతకండి"
  },
  hi: {
    appName: "एग्रीलिंक (AgriLink)",
    tagline: "खेत से खरीदार तक। सीधा। स्मार्ट। पारदर्शी।",
    heroTitle: "खेत से खरीदार तक। सीधा। स्मार्ट। पारदर्शी।",
    heroSubtitle: "बिचौलियों के बिना किसानों को सीधे सत्यापित खरीदारों से जोड़ना। AI फसल पहचान, मौसमी मूल्य विश्लेषण और स्मार्ट मैचिंग।",
    sellMyCrop: "अपनी फसल बेचें (किसान)",
    findCrops: "फसल खोजें (खरीदार)",
    workflowTitle: "बिचौलियों को खत्म करने की सरल प्रक्रिया",
    workflowSubtitle: "बीज से लेकर बिक्री तक पूर्ण AI फसल बुद्धिमत्ता",
    stepFarmer: "किसान सूची",
    stepAiId: "AI फसल पहचान",
    stepIntel: "मौसम व मूल्य विश्लेषण",
    stepMatch: "स्मार्ट AI मिलान",
    stepBuyer: "सीधा सौदा",
    navMarketplace: "मंडी बाज़ार",
    navFarmerDash: "किसान हब",
    navBuyerDash: "खरीदार हब",
    navCropId: "AI फसल पहचान",
    navWhatToGrow: "क्या उगाएं?",
    navPriceIntel: "भाव विश्लेषण",
    navSmartMatch: "स्मार्ट मिलान",
    navAgriAssist: "एग्रीअसिस्ट AI",
    navOrders: "मेरे ऑर्डर",
    navMap: "नक्शा",
    navAdmin: "एडमिन",
    verifiedFarmer: "सत्यापित किसान ✓",
    verifiedBuyer: "सत्यापित खरीदार ✓",
    aiCropVerified: "AI सत्यापित फसल",
    voiceButton: "बोलकर बताएं",
    voiceListening: "सुन रहे हैं... बोलिए",
    voiceListingPrompt: "बोलें: 'मेरे पास 200 किलो टमाटर बेचने के लिए हैं'",
    voiceExample: "उदाहरण: 'मेरे पास 500 किलो मिर्च तैयार है'",
    searchPlaceholder: "फसल या शहर खोजें (उदा: नासिक में प्याज)...",
    pricePerKg: "प्रति किलो भाव",
    availableQty: "उपलब्ध मात्रा",
    harvestDate: "कटाई तिथि",
    contactFarmer: "किसान से सीधा संपर्क करें",
    sendRequest: "खरीद अनुरोध भेजें",
    matchScore: "AI मिलान प्रतिशत",
    recentTrends: "भाव का रुझान",
    knowYourPrice: "अपनी फसल का सही दाम जानें",
    recommendationTitle: "इस मौसम में कौन सी फसल उगाएं?",
    recommendationSubtitle: "मिट्टी, पानी, मौसम और बाजार मांग का AI विश्लेषण",
    calculateMatch: "उपयुक्त खरीदार खोजें"
  }
};
