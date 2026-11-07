export type Language = 'en' | 'hi' | 'mr';

export interface Translations {
  appName: string;
  tagline: string;
  searchPlaceholder: string;
  searchSuggestionsTitle: string;
  noPandalsFound: string;
  clearSearch: string;
  allPandals: string;
  allAreas: string;
  ecoFriendly: string;
  ecoFriendlyBadge: string;
  traditionalIdol: string;
  twentyFourHours: string;
  twentyFourHoursBadge: string;
  crowdLevel: string;
  crowdLow: string;
  crowdMedium: string;
  crowdHigh: string;
  nearMe: string;
  nearMeLocating: string;
  nearMeActive: string;
  locationDeniedTitle: string;
  locationDeniedMsg: string;
  locationDeniedAction: string;
  distanceAway: string;
  approxDistance: string;
  darshanTimings: string;
  aartiTimings: string;
  nearestStation: string;
  visarjanDate: string;
  address: string;
  getDirections: string;
  viewFullDetails: string;
  close: string;
  share: string;
  copied: string;
  backToMap: string;
  festivalBannerTitle: string;
  festivalDates: string;
  countdownDays: string;
  countdownHours: string;
  countdownMins: string;
  countdownSecs: string;
  startsIn: string;
  activeFilters: string;
  clearAllFilters: string;
  lightMode: string;
  darkMode: string;
  historyAndStory: string;
  photoGallery: string;
  aboutPandal: string;
  mapView: string;
  listView: string;
  resetView: string;

  // Curated Circuits
  circuits: string;
  circuitsModalTitle: string;
  circuitsSubtitle: string;
  startCircuit: string;
  activeCircuit: string;
  exitCircuit: string;
  stop: string;
  walkingTime: string;
  entryStation: string;
  exitStation: string;
  circuitTip: string;

  // My Darshan Checklist
  myDarshan: string;
  myDarshanFilter: string;
  saveToDarshan: string;
  removeFromDarshan: string;
  markVisited: string;
  visitedBadge: string;

  // Queue & Line Guide
  queueGuideTitle: string;
  mukhDarshan: string;
  navasDarshan: string;
  queueAdvice: string;
}

export const translations: Record<Language, Translations> = {
  en: {
    appName: 'Pandal Map',
    tagline: 'Mumbai Ganesh Chaturthi Pandal Guide',
    searchPlaceholder: 'Search pandals, areas, stations...',
    searchSuggestionsTitle: 'Suggested Pandals',
    noPandalsFound: 'No pandals found matching your filters.',
    clearSearch: 'Clear search',
    allPandals: 'All Pandals',
    allAreas: 'All Areas (Mumbai)',
    ecoFriendly: 'Eco-Friendly (Clay)',
    ecoFriendlyBadge: 'Eco-Friendly (Shadu Mati)',
    traditionalIdol: 'Traditional Idol',
    twentyFourHours: '24-Hour Darshan',
    twentyFourHoursBadge: 'Open 24 Hours',
    crowdLevel: 'Crowd Level',
    crowdLow: 'Low Wait Time',
    crowdMedium: 'Moderate Crowd',
    crowdHigh: 'High Rush / Long Queue',
    nearMe: 'Near Me',
    nearMeLocating: 'Locating...',
    nearMeActive: 'Sorted by Distance',
    locationDeniedTitle: 'Location Access Denied',
    locationDeniedMsg: 'We could not detect your GPS location. Please allow location access in your browser settings to sort pandals by proximity, or browse by area.',
    locationDeniedAction: 'Browse by Area',
    distanceAway: 'away',
    approxDistance: 'Approx.',
    darshanTimings: 'Darshan Timings',
    aartiTimings: 'Aarti Timings',
    nearestStation: 'Nearest Railway Station',
    visarjanDate: 'Visarjan (Immersion)',
    address: 'Address',
    getDirections: 'Get Directions (Google Maps)',
    viewFullDetails: 'View Full Details & Story',
    close: 'Close',
    share: 'Share',
    copied: 'Link Copied!',
    backToMap: 'Back to Map',
    festivalBannerTitle: 'Ganesh Chaturthi 2027',
    festivalDates: 'September 4 – September 14, 2027',
    countdownDays: 'Days',
    countdownHours: 'Hours',
    countdownMins: 'Mins',
    countdownSecs: 'Secs',
    startsIn: 'Festival starts in',
    activeFilters: 'Active Filters:',
    clearAllFilters: 'Clear All',
    lightMode: 'Light Mode',
    darkMode: 'Dark Mode',
    historyAndStory: 'History & Cultural Story',
    photoGallery: 'Photo Gallery',
    aboutPandal: 'About this Pandal',
    mapView: 'Map',
    listView: 'List',
    resetView: 'Reset to Mumbai',

    circuits: 'Walking Tours',
    circuitsModalTitle: 'Curated Darshan Circuits',
    circuitsSubtitle: 'Walkable clusters designed for out-of-town pilgrims to explore nearby famous pandals without getting stuck in traffic.',
    startCircuit: 'Start This Walking Trail',
    activeCircuit: 'Active Walking Route',
    exitCircuit: 'Exit Trail',
    stop: 'Stop',
    walkingTime: 'Walk Time',
    entryStation: 'Start Station',
    exitStation: 'Exit Station',
    circuitTip: 'Route Advice',

    myDarshan: 'My Darshan',
    myDarshanFilter: 'My Saved List',
    saveToDarshan: 'Save to My Darshan',
    removeFromDarshan: 'Remove from Saved',
    markVisited: 'Mark as Visited',
    visitedBadge: 'Darshan Done',

    queueGuideTitle: 'Queue & Line Guide (Traveller Alert)',
    mukhDarshan: 'Mukh Line (Quick View: 2 - 4 hrs)',
    navasDarshan: 'Navas Line (Touch Feet: 12 - 20 hrs)',
    queueAdvice: 'Traveller Advice: If you only have 1 day in Mumbai, always choose the Mukh Darshan line so you can visit 4-5 major pandals instead of spending the whole day in 1 queue.',
  },
  hi: {
    appName: 'पंडाल मैप',
    tagline: 'मुंबई गणेशोत्सव पंडाल दर्शिका',
    searchPlaceholder: 'पंडाल, क्षेत्र या स्टेशन खोजें...',
    searchSuggestionsTitle: 'सुझाए गए पंडाल',
    noPandalsFound: 'कोई पंडाल नहीं मिला। फ़िल्टर बदलें।',
    clearSearch: 'खोज साफ़ करें',
    allPandals: 'सभी पंडाल',
    allAreas: 'सभी क्षेत्र (मुंबई)',
    ecoFriendly: 'इको-फ्रेंडली (मिट्टी)',
    ecoFriendlyBadge: 'पर्यावरण अनुकूल (शाडू मिट्टी)',
    traditionalIdol: 'पारंपरिक मूर्ति',
    twentyFourHours: '24 घंटे दर्शन',
    twentyFourHoursBadge: '24 घंटे खुला',
    crowdLevel: 'भीड़ की स्थिति',
    crowdLow: 'कम प्रतीक्षा समय',
    crowdMedium: 'मध्यम भीड़',
    crowdHigh: 'भारी भीड़ / लंबी कतार',
    nearMe: 'मेरे निकट',
    nearMeLocating: 'स्थान ढूंढ रहे हैं...',
    nearMeActive: 'दूरी अनुसार क्रमबद्ध',
    locationDeniedTitle: 'स्थान अनुमति अस्वीकृत',
    locationDeniedMsg: 'हम आपका स्थान नहीं पहचान सके। कृपया ब्राउज़र में स्थान अनुमति दें अथवा क्षेत्र चुनकर पंडाल खोजें।',
    locationDeniedAction: 'क्षेत्र अनुसार देखें',
    distanceAway: 'दूर',
    approxDistance: 'लगभग',
    darshanTimings: 'दर्शन समय',
    aartiTimings: 'आरती समय',
    nearestStation: 'निकटतम रेलवे स्टेशन',
    visarjanDate: 'विसर्जन तिथि',
    address: 'पता',
    getDirections: 'दिशा-निर्देश (Google Maps)',
    viewFullDetails: 'पूर्ण विवरण व इतिहास देखें',
    close: 'बंद करें',
    share: 'साझा करें',
    copied: 'लिंक कॉपी हो गया!',
    backToMap: 'नक्शे पर वापस जाएं',
    festivalBannerTitle: 'गणेश चतुर्थी 2027',
    festivalDates: '4 सितंबर – 14 सितंबर 2027',
    countdownDays: 'दिन',
    countdownHours: 'घंटे',
    countdownMins: 'मिनट',
    countdownSecs: 'सेकंड',
    startsIn: 'महोत्सव शुरू होने में शेष',
    activeFilters: 'सक्रिय फ़िल्टर:',
    clearAllFilters: 'सभी हटाएं',
    lightMode: 'लाइट मोड',
    darkMode: 'डार्क मोड',
    historyAndStory: 'इतिहास एवं सांस्कृतिक गाथा',
    photoGallery: 'फोटो गैलरी',
    aboutPandal: 'इस पंडाल के बारे में',
    mapView: 'नक्शा',
    listView: 'सूची',
    resetView: 'मुंबई पर केंद्रित करें',

    circuits: 'पदयात्रा टूर',
    circuitsModalTitle: 'प्रमुख दर्शन परिक्रमा (सर्किट)',
    circuitsSubtitle: 'बाहर से आने वाले श्रद्धालुओं के लिए पास-पास स्थित प्रमुख पंडालों की पैदल दर्शन यात्रा।',
    startCircuit: 'यह परिक्रमा शुरू करें',
    activeCircuit: 'सक्रिय दर्शन मार्ग',
    exitCircuit: 'मार्ग समाप्त करें',
    stop: 'पड़ाव',
    walkingTime: 'पैदल समय',
    entryStation: 'प्रवेश स्टेशन',
    exitStation: 'निकास स्टेशन',
    circuitTip: 'मार्ग सुझाव',

    myDarshan: 'मेरा दर्शन',
    myDarshanFilter: 'सहेजी गई सूची',
    saveToDarshan: 'दर्शन सूची में जोड़ें',
    removeFromDarshan: 'सूची से हटाएं',
    markVisited: 'दर्शन पूर्ण चिह्नित करें',
    visitedBadge: 'दर्शन संपन्न',

    queueGuideTitle: 'कतार निर्देशिका (यात्री सावधानी)',
    mukhDarshan: 'मुख दर्शन कतार (शीघ्र: 2 - 4 घंटे)',
    navasDarshan: 'नवस / चरणस्पर्श कतार (12 - 20 घंटे)',
    queueAdvice: 'यात्री सुझाव: यदि आपके पास मुंबई में सीमित समय है, तो सदैव मुख दर्शन लाइन चुनें ताकि आप एक ही दिन में 4-5 प्रसिद्ध पंडालों के दर्शन कर सकें।',
  },
  mr: {
    appName: 'पंडाल मॅप',
    tagline: 'मुंबई गणेशोत्सव पंडाल वाटाड्या',
    searchPlaceholder: 'पंडाल, विभाग किंवा स्टेशन शोधा...',
    searchSuggestionsTitle: 'सुचवलेले पंडाल',
    noPandalsFound: 'कोणताही पंडाल आढळला नाही.',
    clearSearch: 'शोध साफ करा',
    allPandals: 'सर्व पंडाल',
    allAreas: 'सर्व विभाग (मुंबई)',
    ecoFriendly: 'पर्यावरणपूरक (शाडू)',
    ecoFriendlyBadge: 'पर्यावरणपूरक (शाडू माती)',
    traditionalIdol: 'पारंपरिक मूर्ती',
    twentyFourHours: '२४ तास दर्शन',
    twentyFourHoursBadge: '२४ तास खुले',
    crowdLevel: 'गर्दीची पातळी',
    crowdLow: 'कमी प्रतीक्षा वेळ',
    crowdMedium: 'मध्यम गर्दी',
    crowdHigh: 'प्रचंड गर्दी / मोठी रांग',
    nearMe: 'माझ्या जवळचे',
    nearMeLocating: 'स्थान शोधत आहे...',
    nearMeActive: 'अंतरानुसार क्रमवारी',
    locationDeniedTitle: 'स्थान परवानगी नाकारली',
    locationDeniedMsg: 'आपले GPS स्थान मिळवता आले नाही. कृपया ब्राऊझर सेटिंग्जमध्ये स्थान परवानगी चालू करा किंवा विभागानुसार पंडाल निवडा.',
    locationDeniedAction: 'विभागानुसार शोधा',
    distanceAway: 'अंतरावर',
    approxDistance: 'अंदाजे',
    darshanTimings: 'दर्शन वेळ',
    aartiTimings: 'आरती वेळ',
    nearestStation: 'जवळचे रेल्वे स्टेशन',
    visarjanDate: 'विसर्जन दिवस',
    address: 'पत्ता',
    getDirections: 'मार्ग दाखवा (Google Maps)',
    viewFullDetails: 'संपूर्ण माहिती व इतिहास पहा',
    close: 'बंद करा',
    share: 'शेअर करा',
    copied: 'लिंक कॉपी झाली!',
    backToMap: 'नकाशावर परत जा',
    festivalBannerTitle: 'गणेशोत्सव २०२७',
    festivalDates: '४ सप्टेंबर – १४ सप्टेंबर २०२७',
    countdownDays: 'दिवस',
    countdownHours: 'तास',
    countdownMins: 'मिनिटे',
    countdownSecs: 'सेकंद',
    startsIn: 'उत्सवास प्रारंभ होण्यासाठी',
    activeFilters: 'सक्रिय फिल्टर्स:',
    clearAllFilters: 'सर्व साफ करा',
    lightMode: 'लाईट मोड',
    darkMode: 'डार्क मोड',
    historyAndStory: 'इतिहास व सांस्कृतिक परंपरा',
    photoGallery: 'छायाचित्र दालन',
    aboutPandal: 'पंडालविषयी माहिती',
    mapView: 'नकाशा',
    listView: 'यादी',
    resetView: 'मुंबई नकाशा',

    circuits: 'पदयात्रा टूर्स',
    circuitsModalTitle: 'नियोजित दर्शन परिक्रमा (सर्किट)',
    circuitsSubtitle: 'परगावाहून येणाऱ्या भाविकांसाठी जवळच्या प्रसिद्ध पंडालची पायपीट टाळणारी पायी दर्शन यात्रा.',
    startCircuit: 'ही परिक्रमा सुरू करा',
    activeCircuit: 'सक्रिय दर्शन मार्ग',
    exitCircuit: 'मार्ग बंद करा',
    stop: 'थांबा',
    walkingTime: 'चालण्याची वेळ',
    entryStation: 'प्रारंभ स्टेशन',
    exitStation: 'शेवटचे स्टेशन',
    circuitTip: 'प्रवासी सल्ला',

    myDarshan: 'माझे दर्शन',
    myDarshanFilter: 'जतन केलेली यादी',
    saveToDarshan: 'माझे दर्शन मध्ये जोडा',
    removeFromDarshan: 'यादीतून काढा',
    markVisited: 'दर्शन झाले नोंदवा',
    visitedBadge: 'दर्शन संपन्न',

    queueGuideTitle: 'रांग व दर्शन मार्गदर्शक (भाविकांसाठी)',
    mukhDarshan: 'मुखदर्शन रांग (जलद: २ - ४ तास)',
    navasDarshan: 'नवसाची / चरणस्पर्श रांग (१२ - २० तास)',
    queueAdvice: 'प्रवासी सल्ला: मुंबईत कमी वेळेत जास्तीत जास्त दर्शन घ्यायचे असल्यास नेहमी मुखदर्शनाची रांग निवडा.',
  },
};
