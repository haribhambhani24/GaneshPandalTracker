export type Language = 'en' | 'hi' | 'mr';

export interface Translations {
  appName: string;
  appNameShort: string;
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
  copyAddress: string;
  addressCopied: string;
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
  queueAdvisoryTitle: string;
  mukhDarshanDesc: string;
  navasDarshanDesc: string;
  queueInsiderTip: string;

  // Submit Pandal Page
  submitPandal: string;
  submitPandalTitle: string;
  addPandalHeading: string;
  addPandalSubtitle: string;
  pandalNameLabel: string;
  pandalNamePlaceholder: string;
  areaLabel: string;
  specifyAreaLabel: string;
  specifyAreaPlaceholder: string;
  nearestStationPlaceholder: string;
  addressPlaceholder: string;
  pandalLocationOnMap: string;
  tapMapOrDragPin: string;
  useMyGps: string;
  detectingLocation: string;
  twoFingersToPan: string;
  clickMapToEnableZoom: string;
  darshanTimingsPlaceholder: string;
  aartiTimingsPlaceholder: string;
  visarjanDatePlaceholder: string;
  visarjanDateLabel: string;
  clayShaduIdol: string;
  typicalRush: string;
  pandalPhotoLabel: string;
  uploadFileInstead: string;
  provideImageLinkInstead: string;
  clickToUploadPhoto: string;
  imageSizeLimit: string;
  historyFeaturesOptional: string;
  historyFeaturesPlaceholder: string;
  submitForVerification: string;
  submittingForReview: string;
  submissionVerificationNote: string;
  submissionSuccessTitle: string;
  submissionSuccessMsg: string;
  submissionQueuedMsg: string;
  returnToTracker: string;
  submitAnotherPandal: string;

  // Form Validation Errors
  errNameRequired: string;
  errAreaRequired: string;
  errAddressRequired: string;
  errStationRequired: string;
  errDarshanTimingsRequired: string;
  errAartiTimingsRequired: string;
  errPhotoRequired: string;
  errPhotoUrlInvalid: string;
  errImageTooLarge: string;
  errImageFormat: string;

  // Admin Portal
  adminPortalTitle: string;
  adminAuthHeading: string;
  adminAuthSubtitle: string;
  adminEmailLabel: string;
  adminPasswordLabel: string;
  logInAsAdmin: string;
  logout: string;
  pendingSubmissions: string;
  approvedLivePandals: string;
  rejected: string;
  refresh: string;
  noPendingPandals: string;
  noApprovedPandals: string;
  noRejectedPandals: string;
  verifyGps: string;
  approve: string;
  edit: string;
  reject: string;
  delete: string;
  editPandalDetails: string;
  cancel: string;
  saveChanges: string;
  statusPending: string;
  statusApproved: string;
  statusRejected: string;

  // Pandal Detail Page & Empty States
  pandalNotFoundTitle: string;
  pandalNotFoundMsg: string;
  loadingPandalDetails: string;
  visitedCheck: string;
  mumbaiUtsav: string;
  emptyStateHint: string;
  knowMissedPandal: string;
  noSavedDarshanTitle: string;
  noSavedDarshanMsg: string;
  adjustFiltersMsg: string;
  trail: string;
  routeSequence: string;
  entry: string;
  exit: string;
  matches: string;
  details: string;
  zoomIn: string;
  zoomOut: string;
  showCountdown: string;
  minimizeBanner: string;
  mumbai: string;
  dragToSet: string;
  changePhoto: string;
  supabaseLocalFallbackNote: string;
  firstVisitHint: string;
  firstVisitDismiss: string;
  chooseLanguagePrompt: string;
  prePromptGpsTitle: string;
  prePromptGpsDesc: string;
  continueGps: string;
  popularAreas: string;
  howToEnableLocation: string;
  recentSearches: string;
  clearRecentSearches: string;
  noSearchResults: string;
  tryPopularArea: string;
  sortByLabel: string;
  sortByDistance: string;
  sortByName: string;
  sortByCrowd: string;
  resultsCount: string;
  openNow: string;
  closedNow: string;
  open24Hours: string;
  closesAt: string;
  opensAt: string;
  nextAartiLabel: string;
  verifiedBadge: string;
  communityBadge: string;
  lastUpdatedLabel: string;
  reportProblem: string;
  reportProblemTitle: string;
  reportProblemSubtitle: string;
  reportIssueType: string;
  issueWrongLocation: string;
  issueWrongTimings: string;
  issueCrowdInaccurate: string;
  issueClosed: string;
  issueOther: string;
  reportDetails: string;
  reportDetailsPlaceholder: string;
  reporterNameOptional: string;
  reporterContactOptional: string;
  submitReport: string;
  submittingReport: string;
  reportSubmitted: string;
  previousPandal: string;
  nextPandal: string;
  roadClosureNotice: string;
  myDarshanRoute: string;
  openGoogleMapsRoute: string;
  localDeviceNote: string;
  reorderTip: string;
  pandalRemoved: string;
  undo: string;
  offlineBanner: string;
  onlineBanner: string;
  notFoundTitle: string;
  notFoundDesc: string;
  step1Title: string;
  step2Title: string;
  step3Title: string;
  nextStep: string;
  prevStep: string;
  draftSavedNotice: string;
  draftRestoredNotice: string;
  clearDraft: string;
  useCurrentGps: string;
  pinLocationSelected: string;
  userReportsTab: string;
  markResolved: string;
  dismissReport: string;
  noReportsFound: string;
}

export const translations: Record<Language, Translations> = {
  en: {
    appName: 'Ganesh Pandal Tracker',
    appNameShort: 'Pandal Tracker',
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
    copyAddress: 'Copy Address',
    addressCopied: 'Copied!',
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
    queueAdvisoryTitle: 'Devotee Queue Advisory: Two Distinct Lines',
    mukhDarshanDesc: 'Devotees walk across the main viewing stage 20 feet from the idol. Significantly faster queue (typically 2 to 4 hours). Recommended for travellers with limited time.',
    navasDarshanDesc: "Line for pilgrims fulfilling special vows by touching Bappa's sacred feet. Can take 12 to 24+ hours on peak days and weekends.",
    queueInsiderTip: '💡 Insider Tip: The lightest queues occur between 4:00 AM and 7:00 AM. Avoid peak evening hours between 6:00 PM and 11:00 PM.',

    submitPandal: 'Submit Pandal',
    submitPandalTitle: 'Submit a Ganesh Pandal',
    addPandalHeading: 'Add Ganesh Pandal Details',
    addPandalSubtitle: 'Help out-of-town pilgrims discover authentic pandals during Ganesh Chaturthi.',
    pandalNameLabel: 'Pandal / Mandal Name',
    pandalNamePlaceholder: 'e.g. Balgopal Mitra Mandal, Khetwadicha Lambodara',
    areaLabel: 'Area / Locality',
    specifyAreaLabel: 'Specify Area',
    specifyAreaPlaceholder: 'e.g. Borivali East, Ghatkopar',
    nearestStationPlaceholder: 'e.g. Charni Road (Western) or CSMT',
    addressPlaceholder: 'Street, Landmark, Chawl / Building name, Pin Code',
    pandalLocationOnMap: 'Pandal Exact Location on Map',
    tapMapOrDragPin: 'Tap map or drag pin to position:',
    useMyGps: 'Use My GPS',
    detectingLocation: 'Detecting...',
    twoFingersToPan: 'Two fingers to pan • Tap to pin',
    clickMapToEnableZoom: 'Click map to enable wheel zoom',
    darshanTimingsPlaceholder: 'e.g. 6:00 AM - 11:30 PM',
    aartiTimingsPlaceholder: 'e.g. 7:30 AM (Kakad), 8:00 PM (Maha Aarti)',
    visarjanDatePlaceholder: 'e.g. Anant Chaturdashi (Day 10 - Girgaon Chowpatty)',
    visarjanDateLabel: 'Visarjan Day / Procession Details',
    clayShaduIdol: 'Clay / Shadu Mati',
    typicalRush: 'Typical Rush',
    pandalPhotoLabel: 'Pandal / Idol Photo',
    uploadFileInstead: 'Upload file instead',
    provideImageLinkInstead: 'Provide image link instead',
    clickToUploadPhoto: 'Click to upload pandal photo',
    imageSizeLimit: 'JPEG, PNG or WebP under 2 MB',
    historyFeaturesOptional: 'History, Heritage or Unique Features (Optional)',
    historyFeaturesPlaceholder: 'Share a short story, idol height, temple replicas, or community highlights...',
    submitForVerification: '🙏 Submit Pandal for Verification',
    submittingForReview: 'Submitting Pandal for Review...',
    submissionVerificationNote: 'All community submissions are verified by pandal committee admins prior to public listing.',
    submissionSuccessTitle: '🙏 Ganpati Bappa Morya!',
    submissionSuccessMsg: 'Pandal submission received for',
    submissionQueuedMsg: 'Your submission has been queued as Pending Review. Once verified by our community committee moderators in the admin panel, your pandal will appear live on the interactive map for all devotees.',
    returnToTracker: 'Return to Ganesh Pandal Tracker',
    submitAnotherPandal: 'Submit Another Pandal',

    errNameRequired: 'Pandal name must be at least 3 characters.',
    errAreaRequired: 'Please specify the area/locality in Mumbai.',
    errAddressRequired: 'Please provide a clear street address.',
    errStationRequired: 'Please specify the closest railway or metro station.',
    errDarshanTimingsRequired: 'Darshan timings are required.',
    errAartiTimingsRequired: 'Aarti timings are required.',
    errPhotoRequired: 'Please upload a photo of the pandal or idol.',
    errPhotoUrlInvalid: 'Please enter a valid photo URL starting with http:// or https://',
    errImageTooLarge: 'Image size must be under 2 MB to upload.',
    errImageFormat: 'Please select a valid image file (JPEG, PNG, WebP).',

    adminPortalTitle: 'Ganesh Pandal Tracker Admin',
    adminAuthHeading: 'Admin Authentication',
    adminAuthSubtitle: 'Sign in with your Supabase admin credentials to moderate pandal submissions.',
    adminEmailLabel: 'Admin Email',
    adminPasswordLabel: 'Password',
    logInAsAdmin: 'Log In as Admin',
    logout: 'Logout',
    pendingSubmissions: 'Pending Submissions',
    approvedLivePandals: 'Approved Live Pandals',
    rejected: 'Rejected',
    refresh: 'Refresh',
    noPendingPandals: 'All community submissions have been reviewed! New submissions will appear here.',
    noApprovedPandals: 'No approved pandals.',
    noRejectedPandals: 'No rejected pandals.',
    verifyGps: 'Verify GPS',
    approve: 'Approve',
    edit: 'Edit',
    reject: 'Reject',
    delete: 'Delete',
    editPandalDetails: 'Edit Pandal Details',
    cancel: 'Cancel',
    saveChanges: 'Save Changes',
    statusPending: 'Pending',
    statusApproved: 'Approved',
    statusRejected: 'Rejected',

    pandalNotFoundTitle: 'Pandal Not Found',
    pandalNotFoundMsg: 'The pandal you are looking for could not be found.',
    loadingPandalDetails: 'Loading pandal details...',
    visitedCheck: 'Visited ✓',
    mumbaiUtsav: 'Mumbai Utsav',
    emptyStateHint: 'No pandals match your active filter combination. Try loosening your criteria or resetting filters.',
    knowMissedPandal: 'Know a pandal we missed? Help devotees by adding it!',
    noSavedDarshanTitle: 'No pandals saved in My Darshan yet',
    noSavedDarshanMsg: 'Tap the bookmark icon on any pandal card to save it for your festival visit.',
    adjustFiltersMsg: 'Try adjusting or clearing your search and filters.',
    trail: 'Trail',
    routeSequence: 'Route Sequence',
    entry: 'Entry',
    exit: 'Exit',
    matches: 'matches',
    details: 'Details',
    zoomIn: 'Zoom In',
    zoomOut: 'Zoom Out',
    showCountdown: 'Show Countdown',
    minimizeBanner: 'Minimize Banner',
    mumbai: 'Mumbai',
    dragToSet: 'Drag to Set',
    changePhoto: 'Change Photo',
    supabaseLocalFallbackNote: 'Note: Supabase credentials operating with local fallback.',
    firstVisitHint: "Tap 'Near me' to find pandals around you, or pick an area below.",
    firstVisitDismiss: "Got it",
    chooseLanguagePrompt: "Choose your language",
    prePromptGpsTitle: "Find pandals closest to you",
    prePromptGpsDesc: "We use your GPS to calculate walking and travel distance. Your location stays on your device.",
    continueGps: "Allow Location",
    popularAreas: "Popular Areas",
    howToEnableLocation: "To enable location: Open browser site settings > Permissions > Location > Allow.",
    recentSearches: "Recent Searches",
    clearRecentSearches: "Clear",
    noSearchResults: "No pandals matching",
    tryPopularArea: "Try searching a popular area instead:",
    sortByLabel: "Sort by",
    sortByDistance: "Nearest",
    sortByName: "Name (A-Z)",
    sortByCrowd: "Lowest Crowd",
    resultsCount: "pandals",
    openNow: "Open now",
    closedNow: "Closed",
    open24Hours: "Open 24 Hours",
    closesAt: "Closes",
    opensAt: "Opens",
    nextAartiLabel: "Next Aarti",
    verifiedBadge: "Verified Mandal",
    communityBadge: "Community Submitted",
    lastUpdatedLabel: "Last updated",
    reportProblem: "Report a problem with this info",
    reportProblemTitle: "Report Inaccurate Information",
    reportProblemSubtitle: "Help fellow devotees by reporting incorrect locations, timings or crowd status.",
    reportIssueType: "What is incorrect?",
    issueWrongLocation: "Wrong map location / pin",
    issueWrongTimings: "Darshan / Aarti timings changed",
    issueCrowdInaccurate: "Crowd status is inaccurate",
    issueClosed: "Pandal is closed / not active",
    issueOther: "Other correction",
    reportDetails: "Additional details (optional)",
    reportDetailsPlaceholder: "E.g., Entry gate moved to side lane, road closed for vehicles...",
    reporterNameOptional: "Your name (optional)",
    reporterContactOptional: "Phone or email (optional)",
    submitReport: "Submit Report",
    submittingReport: "Submitting...",
    reportSubmitted: "Thank you! Your report has been submitted for review.",
    previousPandal: "Previous",
    nextPandal: "Next",
    roadClosureNotice: "Traffic Advisory: Road restricted to pedestrian entry only",
    myDarshanRoute: "My Darshan Itinerary",
    openGoogleMapsRoute: "Open Multi-Stop Route in Google Maps",
    localDeviceNote: "Saved pandals are stored safely on this device without requiring a login.",
    reorderTip: "Use arrows to reorder your stops or export to Google Maps directions.",
    pandalRemoved: "Pandal removed from My Darshan",
    undo: "Undo",
    offlineBanner: "You're offline • Showing saved data",
    onlineBanner: "Back online • Data updated",
    notFoundTitle: "Page Not Found",
    notFoundDesc: "The page or pandal you are looking for doesn't exist or has moved.",
    step1Title: "1. Basic Info",
    step2Title: "2. Location & Timings",
    step3Title: "3. Photo & Review",
    nextStep: "Next Step",
    prevStep: "Back",
    draftSavedNotice: "Draft auto-saved",
    draftRestoredNotice: "Restored your unsaved draft",
    clearDraft: "Discard draft",
    useCurrentGps: "Use my current location (GPS)",
    pinLocationSelected: "Location pinned from device GPS",
    userReportsTab: "User Reports",
    markResolved: "Mark Resolved",
    dismissReport: "Dismiss",
    noReportsFound: "No active user reports found.",
  },

  hi: {
    appName: 'Ganesh Pandal Tracker',
    appNameShort: 'Pandal Tracker',
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
    copyAddress: 'पता कॉपी करें',
    addressCopied: 'कॉपी हो गया!',
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
    queueAdvisoryTitle: 'श्रद्धालु कतार परामर्श: दो अलग कतारें',
    mukhDarshanDesc: 'मूर्ति से लगभग 20 फीट की दूरी पर मंच से दर्शन। यह कतार बहुत तेज चलती है (लगभग 2 से 4 घंटे)। कम समय वाले यात्रियों के लिए अनुशंसित।',
    navasDarshanDesc: 'बाप्पा के पावन चरणों को स्पर्श कर मन्नत मांगने वालों की कतार। प्रमुख दिनों पर इसमें 12 से 24+ घंटे लग सकते हैं।',
    queueInsiderTip: '💡 अंदरूनी सुझाव: सबसे कम भीड़ सुबह 4:00 से 7:00 बजे के बीच होती है। शाम 6:00 से रात 11:00 बजे तक चरम भीड़ से बचें।',

    submitPandal: 'पंडाल जोड़ें',
    submitPandalTitle: 'गणेश पंडाल की जानकारी भेजें',
    addPandalHeading: 'गणेश पंडाल का विवरण दर्ज करें',
    addPandalSubtitle: 'गणेशोत्सव के दौरान बाहर से आने वाले श्रद्धालुओं को प्रामाणिक पंडाल खोजने में मदद करें।',
    pandalNameLabel: 'पंडाल / मंडल का नाम',
    pandalNamePlaceholder: 'उदा. बालगोपाल मित्र मंडल, खेतवाड़ीचा लंबोदर',
    areaLabel: 'क्षेत्र / इलाका',
    specifyAreaLabel: 'क्षेत्र बताएं',
    specifyAreaPlaceholder: 'उदा. बोरीवली पूर्व, घाटकोपर',
    nearestStationPlaceholder: 'उदा. चर्नी रोड (पश्चिम) अथवा सीएसएमटी',
    addressPlaceholder: 'सड़क, लैंडमार्क, चॉल / भवन का नाम, पिन कोड',
    pandalLocationOnMap: 'नक्शे पर पंडाल का सटीक स्थान',
    tapMapOrDragPin: 'स्थान चुनने के लिए नक्शे पर टैप करें या पिन खींचें:',
    useMyGps: 'मेरा जीपीएस उपयोग करें',
    detectingLocation: 'स्थान पहचान रहे हैं...',
    twoFingersToPan: 'नक्शा खिसकाने के लिए 2 उंगलियों का प्रयोग करें',
    clickMapToEnableZoom: 'ज़ूम सक्षम करने के लिए नक्शे पर क्लिक करें',
    darshanTimingsPlaceholder: 'उदा. सुबह 6:00 - रात 11:30',
    aartiTimingsPlaceholder: 'उदा. सुबह 7:30 (काकड़), रात 8:00 (महाआरती)',
    visarjanDatePlaceholder: 'उदा. अनंत चतुर्दशी (10वां दिन - गिरगांव चौपाटी)',
    visarjanDateLabel: 'विसर्जन दिवस / शोभायात्रा विवरण',
    clayShaduIdol: 'शाडू मिट्टी की मूर्ति',
    typicalRush: 'अनुमानित भीड़',
    pandalPhotoLabel: 'पंडाल / मूर्ति की तस्वीर',
    uploadFileInstead: 'फाइल अपलोड करें',
    provideImageLinkInstead: 'छवि लिंक दर्ज करें',
    clickToUploadPhoto: 'पंडाल की तस्वीर अपलोड करने के लिए क्लिक करें',
    imageSizeLimit: 'JPEG, PNG या WebP (2 MB से कम)',
    historyFeaturesOptional: 'इतिहास, सांस्कृतिक विशेषता अथवा कहानी (वैकल्पिक)',
    historyFeaturesPlaceholder: 'संक्षिप्त कहानी, मूर्ति की ऊंचाई, मंदिर प्रतिकृति आदि साझा करें...',
    submitForVerification: '🙏 सत्यापन हेतु पंडाल भेजें',
    submittingForReview: 'समीक्षा के लिए भेजा जा रहा है...',
    submissionVerificationNote: 'सार्वजनिक रूप से प्रदर्शित करने से पहले सभी प्रविष्टियों का सत्यापन समिति द्वारा किया जाता है।',
    submissionSuccessTitle: '🙏 गणपति बाप्पा मोरया!',
    submissionSuccessMsg: 'पंडाल प्रविष्टि सफलतापूर्वक प्राप्त हुई:',
    submissionQueuedMsg: 'आपकी प्रविष्टि समीक्षा हेतु सुरक्षित कर ली गई है। एडमिन पैनल द्वारा सत्यापन के पश्चात यह पंडाल लाइव नक्शे पर दिखाई देगा।',
    returnToTracker: 'Ganesh Pandal Tracker पर लौटें',
    submitAnotherPandal: 'अन्य पंडाल जोड़ें',

    errNameRequired: 'पंडाल का नाम कम से कम 3 अक्षरों का होना चाहिए।',
    errAreaRequired: 'कृपया मुंबई का क्षेत्र निर्दिष्ट करें।',
    errAddressRequired: 'कृपया पूरा सड़क पता दर्ज करें।',
    errStationRequired: 'कृपया निकटतम रेलवे या मेट्रो स्टेशन बताएं।',
    errDarshanTimingsRequired: 'दर्शन समय आवश्यक है।',
    errAartiTimingsRequired: 'आरती समय आवश्यक है।',
    errPhotoRequired: 'कृपया पंडाल अथवा मूर्ति की तस्वीर जोड़ें।',
    errPhotoUrlInvalid: 'कृपया http:// या https:// से शुरू होने वाला मान्य लिंक दें।',
    errImageTooLarge: 'तस्वीर का आकार 2 MB से कम होना चाहिए।',
    errImageFormat: 'कृपया मान्य छवि फाइल (JPEG, PNG, WebP) चुनें।',

    adminPortalTitle: 'Ganesh Pandal Tracker Admin',
    adminAuthHeading: 'एडमिन लॉगिन',
    adminAuthSubtitle: 'पंडाल प्रविष्टियों की समीक्षा हेतु अपने सुपरबेस एडमिन विवरण से लॉगिन करें।',
    adminEmailLabel: 'एडमिन ईमेल',
    adminPasswordLabel: 'पासवर्ड',
    logInAsAdmin: 'एडमिन लॉगिन करें',
    logout: 'लॉगआउट',
    pendingSubmissions: 'लंबित प्रविष्टियां',
    approvedLivePandals: 'स्वीकृत लाइव पंडाल',
    rejected: 'अस्वीकृत',
    refresh: 'ताज़ा करें',
    noPendingPandals: 'सभी प्रविष्टियों की समीक्षा हो चुकी है! नई प्रविष्टियां यहां दिखाई देंगी।',
    noApprovedPandals: 'कोई स्वीकृत पंडाल नहीं है।',
    noRejectedPandals: 'कोई अस्वीकृत पंडाल नहीं है।',
    verifyGps: 'जीपीएस जांचें',
    approve: 'स्वीकृत करें',
    edit: 'संपादित करें',
    reject: 'अस्वीकार करें',
    delete: 'हटाएं',
    editPandalDetails: 'पंडाल विवरण संपादित करें',
    cancel: 'रद्द करें',
    saveChanges: 'परिवर्तन सहेजें',
    statusPending: 'लंबित',
    statusApproved: 'स्वीकृत',
    statusRejected: 'अस्वीकृत',

    pandalNotFoundTitle: 'पंडाल नहीं मिला',
    pandalNotFoundMsg: 'जिस पंडाल को आप खोज रहे हैं, वह उपलब्ध नहीं है।',
    loadingPandalDetails: 'पंडाल विवरण लोड हो रहा है...',
    visitedCheck: 'दर्शन संपन्न ✓',
    mumbaiUtsav: 'मुंबई उत्सव',
    emptyStateHint: 'आपके वर्तमान फ़िल्टर के अनुसार कोई पंडाल नहीं मिला। फ़िल्टर रीसेट करें।',
    knowMissedPandal: 'क्या आप किसी छूटे हुए पंडाल को जानते हैं? श्रद्धालुओं की सहायता के लिए जोड़ें!',
    noSavedDarshanTitle: 'मेरी दर्शन सूची में अभी कोई पंडाल नहीं है',
    noSavedDarshanMsg: 'अपनी उत्सव यात्रा के लिए किसी भी पंडाल कार्ड पर बुकमार्क आइकन दबाएं।',
    adjustFiltersMsg: 'अपनी खोज या फ़िल्टर बदलकर दोबारा प्रयास करें।',
    trail: 'मार्ग',
    routeSequence: 'मार्ग क्रम',
    entry: 'प्रवेश',
    exit: 'निकास',
    matches: 'परिणाम',
    details: 'विवरण',
    zoomIn: 'ज़ूम इन',
    zoomOut: 'ज़ूम आउट',
    showCountdown: 'उलटी गिनती दिखाएं',
    minimizeBanner: 'बैनर छोटा करें',
    mumbai: 'मुंबई',
    dragToSet: 'स्थान सेट करने के लिए खींचें',
    changePhoto: 'फोटो बदलें',
    supabaseLocalFallbackNote: 'नोट: Supabase क्रेडेंशियल्स स्थानीय फ़ॉलबैक के साथ काम कर रहे हैं।',
    firstVisitHint: "अपने आसपास के पंडाल खोजने के लिए 'मेरे पास' पर टैप करें, या नीचे से क्षेत्र चुनें।",
    firstVisitDismiss: "समझ गया",
    chooseLanguagePrompt: "अपनी भाषा चुनें",
    prePromptGpsTitle: "अपने सबसे नजदीकी पंडाल खोजें",
    prePromptGpsDesc: "पैदल और यात्रा की दूरी मापने के लिए GPS का उपयोग किया जाता है। आपका स्थान आपके फोन पर ही रहता है।",
    continueGps: "स्थान की अनुमति दें",
    popularAreas: "लोकप्रिय क्षेत्र",
    howToEnableLocation: "स्थान सक्षम करने के लिए: ब्राउज़र साइट सेटिंग > अनुमतियाँ > स्थान > अनुमति दें पर जाएं।",
    recentSearches: "हाल की खोजें",
    clearRecentSearches: "हटाएं",
    noSearchResults: "इस खोज से कोई पंडाल मेल नहीं खाता",
    tryPopularArea: "इसके बजाय कोई लोकप्रिय क्षेत्र खोजें:",
    sortByLabel: "क्रमबद्ध करें",
    sortByDistance: "सबसे पास",
    sortByName: "नाम (A-Z)",
    sortByCrowd: "कम भीड़",
    resultsCount: "पंडाल",
    openNow: "अभी खुला है",
    closedNow: "बंद है",
    open24Hours: "24 घंटे खुला",
    closesAt: "समापन",
    opensAt: "शुरुआत",
    nextAartiLabel: "अगली आरती",
    verifiedBadge: "सत्यापित मंडल",
    communityBadge: "समुदाय द्वारा प्रस्तुत",
    lastUpdatedLabel: "अंतिम अपडेट",
    reportProblem: "इस जानकारी में कोई त्रुटि रिपोर्ट करें",
    reportProblemTitle: "गलत जानकारी रिपोर्ट करें",
    reportProblemSubtitle: "गलत स्थान, समय या भीड़ की स्थिति रिपोर्ट करके अन्य भक्तों की सहायता करें।",
    reportIssueType: "क्या गलत है?",
    issueWrongLocation: "नक्शे पर गलत स्थान",
    issueWrongTimings: "दर्शन / आरती का समय बदल गया",
    issueCrowdInaccurate: "भीड़ की स्थिति गलत है",
    issueClosed: "पंडाल बंद है / चालू नहीं है",
    issueOther: "अन्य सुधार",
    reportDetails: "अतिरिक्त विवरण (वैकल्पिक)",
    reportDetailsPlaceholder: "उदा. प्रवेश द्वार बगल की गली में बदल दिया गया है...",
    reporterNameOptional: "आपका नाम (वैकल्िक)",
    reporterContactOptional: "फोन या ईमेल (वैकल्पिक)",
    submitReport: "रिपोर्ट भेजें",
    submittingReport: "भेज रहे हैं...",
    reportSubmitted: "धन्यवाद! आपकी रिपोर्ट समीक्षा के लिए जमा कर दी गई है।",
    previousPandal: "पिछला",
    nextPandal: "अगला",
    roadClosureNotice: "यातायात सूचना: केवल पैदल यात्रियों के लिए मार्ग खुला है",
    myDarshanRoute: "मेरा दर्शन मार्ग",
    openGoogleMapsRoute: "गूगल मैप्स में संपूर्ण मार्ग खोलें",
    localDeviceNote: "सहेजे गए पंडाल बिना लॉगिन के इस डिवाइस पर सुरक्षित रहते हैं।",
    reorderTip: "अपने स्टॉप्स को पुनर्व्यवस्थित करने के लिए तीर का उपयोग करें।",
    pandalRemoved: "पंडाल को दर्शन सूची से हटाया गया",
    undo: "पूर्ववत करें",
    offlineBanner: "ऑफ़लाइन मोड • सहेजा गया डेटा दिखाया जा रहा है",
    onlineBanner: "ऑनलाइन वापस आ गए • डेटा अपडेट किया गया",
    notFoundTitle: "पृष्ठ नहीं मिला",
    notFoundDesc: "जिस पृष्ठ या पंडाल को आप ढूंढ रहे हैं, वह मौजूद नहीं है या बदल दिया गया है।",
    step1Title: "1. बुनियादी जानकारी",
    step2Title: "2. स्थान और समय",
    step3Title: "3. फोटो और समीक्षा",
    nextStep: "अगला चरण",
    prevStep: "पिछला",
    draftSavedNotice: "ड्राफ्ट सहेजा गया",
    draftRestoredNotice: "पिछला ड्राफ्ट पुनर्स्थापित किया गया",
    clearDraft: "ड्राफ्ट हटाएं",
    useCurrentGps: "मेरे वर्तमान स्थान (GPS) का उपयोग करें",
    pinLocationSelected: "GPS से स्थान पिन किया गया",
    userReportsTab: "उपयोगकर्ता रिपोर्ट",
    markResolved: "हल किया हुआ चिह्नित करें",
    dismissReport: "खारिज करें",
    noReportsFound: "कोई सक्रिय रिपोर्ट नहीं मिली।",
  },

  mr: {
    appName: 'Ganesh Pandal Tracker',
    appNameShort: 'Pandal Tracker',
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
    copyAddress: 'पत्ता कॉपी करा',
    addressCopied: 'कॉपी झाले!',
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
    queueAdvisoryTitle: 'भाविक दर्शन रांग सल्ला: दोन स्वतंत्र रांगा',
    mukhDarshanDesc: 'मूर्तीपासून २० फूट अंतरावरून मंचावरून चालत होणारे दर्शन. ही रांग अतिशय जलद चालते (सुमारे २ ते ४ तास). मर्यादित वेळ असलेल्या भाविकांसाठी उत्तम.',
    navasDarshanDesc: 'बाप्पाच्या चरणांना स्पर्श करून नवस फेडणाऱ्या भाविकांची रांग. गर्दीच्या दिवशी या रांगेत १२ ते २४+ तास लागू शकतात.',
    queueInsiderTip: '💡 महत्त्वाचा सल्ला: सर्वात कमी गर्दी पहाटे ४:०० ते सकाळी ७:०० दरम्यान असते. संध्याकाळी ६:०० ते रात्री ११:०० दरम्यान गर्दी टाळा.',

    submitPandal: 'मंडळ जोडा',
    submitPandalTitle: 'गणेश मंडळाची माहिती जोडा',
    addPandalHeading: 'गणेश मंडळाचा तपशील नोंदवा',
    addPandalSubtitle: 'गणेशोत्सवात परगावाहून येणाऱ्या भाविकांना अस्सल गणेश मंडळांची माहिती मिळण्यास मदत करा.',
    pandalNameLabel: 'मंडळाचे / पंडालचे नाव',
    pandalNamePlaceholder: 'उदा. बाळगोपाळ मित्र मंडळ, खेतवाडीचा लंबोदर',
    areaLabel: 'विभाग / परिसर',
    specifyAreaLabel: 'विभाग नमूद करा',
    specifyAreaPlaceholder: 'उदा. बोरिवली पूर्व, घाटकोपर',
    nearestStationPlaceholder: 'उदा. चर्नी रोड (पश्चिम) किंवा सीएसएमटी',
    addressPlaceholder: 'रस्ता, लँडमार्क, चाळ / इमारतीचे नाव, पिन कोड',
    pandalLocationOnMap: 'नकाशावर मंडळाचे अचूक स्थान',
    tapMapOrDragPin: 'स्थान निश्चित करण्यासाठी नकाशावर टॅप करा किंवा पिन सरकवा:',
    useMyGps: 'माझे GPS वापरा',
    detectingLocation: 'स्थान शोधत आहे...',
    twoFingersToPan: 'नकाशा सरकवण्यासाठी २ बोटे वापरा',
    clickMapToEnableZoom: 'झूम सक्षम करण्यासाठी नकाशावर क्लिक करा',
    darshanTimingsPlaceholder: 'उदा. सकाळी ६:०० - रात्री ११:३०',
    aartiTimingsPlaceholder: 'उदा. सकाळी ७:३० (काकड), रात्री ८:०० (महाआरती)',
    visarjanDatePlaceholder: 'उदा. अनंत चतुर्दशी (१० वा दिवस - गिरगाव चौपाटी)',
    visarjanDateLabel: 'विसर्जन दिवस / मिरवणूक तपशील',
    clayShaduIdol: 'शाडू मातीची मूर्ती',
    typicalRush: 'अपेक्षित गर्दी',
    pandalPhotoLabel: 'मंडळाचे / मूर्तीचे छायाचित्र',
    uploadFileInstead: 'फाईल अपलोड करा',
    provideImageLinkInstead: 'फोटोची लिंक द्या',
    clickToUploadPhoto: 'मंडळाचा फोटो अपलोड करण्यासाठी क्लिक करा',
    imageSizeLimit: 'JPEG, PNG किंवा WebP (२ MB पेक्षा कमी)',
    historyFeaturesOptional: 'इतिहास, परंपरा किंवा वैशिष्ट्ये (पर्यायी)',
    historyFeaturesPlaceholder: 'थोडक्यात माहिती, मूर्तीची उंची, मंदिराची प्रतिकृती इत्यादी सामायिक करा...',
    submitForVerification: '🙏 पडताळणीसाठी मंडळ पाठवा',
    submittingForReview: 'माहिती पाठवली जात आहे...',
    submissionVerificationNote: 'नकाशावर प्रसिद्ध करण्यापूर्वी सर्व नोंदींची प्रशासक समितीद्वारे खात्री केली जाते.',
    submissionSuccessTitle: '🙏 गणपती बाप्पा मोरया!',
    submissionSuccessMsg: 'खालील मंडळाची माहिती यशस्वीपणे प्राप्त झाली:',
    submissionQueuedMsg: 'आपली नोंदणी पडताळणीसाठी जतन करण्यात आली आहे. ॲडमिन पॅनलद्वारे पडताळणी झाल्यानंतर हे मंडळ थेट नकाशावर दिसेल.',
    returnToTracker: 'Ganesh Pandal Tracker वर परत जा',
    submitAnotherPandal: 'आणखी मंडळ जोडा',

    errNameRequired: 'मंडळाचे नाव किमान ३ अक्षरांचे असणे आवश्यक आहे.',
    errAreaRequired: 'कृपया मुंबईतील विभाग निवडा.',
    errAddressRequired: 'कृपया संपूर्ण पत्ता प्रविष्ट करा.',
    errStationRequired: 'कृपया जवळचे रेल्वे किंवा मेट्रो स्टेशन नमूद करा.',
    errDarshanTimingsRequired: 'दर्शन वेळ आवश्यक आहे.',
    errAartiTimingsRequired: 'आरती वेळ आवश्यक आहे.',
    errPhotoRequired: 'कृपया मंडळाचे किंवा मूर्तीचे छायाचित्र जोडा.',
    errPhotoUrlInvalid: 'कृपया http:// किंवा https:// ने सुरू होणारी वैध लिंक द्या.',
    errImageTooLarge: 'फोटोचा आकार २ MB पेक्षा कमी असावा.',
    errImageFormat: 'कृपया वैध फोटो फाईल (JPEG, PNG, WebP) निवडा.',

    adminPortalTitle: 'Ganesh Pandal Tracker Admin',
    adminAuthHeading: 'प्रशासक लॉगिन',
    adminAuthSubtitle: 'मंडळांच्या नोंदी तपासण्यासाठी आपल्या सुपरबेस प्रशासक खात्याने लॉगिन करा.',
    adminEmailLabel: 'प्रशासक ईमेल',
    adminPasswordLabel: 'पासवर्ड',
    logInAsAdmin: 'ॲडमिन लॉगिन करा',
    logout: 'लॉगआउट',
    pendingSubmissions: 'प्रलंबित नोंदी',
    approvedLivePandals: 'मंजूर थेट मंडळे',
    rejected: 'नाकारलेल्या नोंदी',
    refresh: 'ताजे करा',
    noPendingPandals: 'सर्व नोंदींची पडताळणी पूर्ण झाली आहे! नवीन नोंदी येथे दिसतील.',
    noApprovedPandals: 'मंजूर मंडळे नाहीत.',
    noRejectedPandals: 'नाकारलेली मंडळे नाहीत.',
    verifyGps: 'GPS तपासा',
    approve: 'मंजूर करा',
    edit: 'संपादित करा',
    reject: 'नाकारा',
    delete: 'हटवा',
    editPandalDetails: 'मंडळाचा तपशील बदला',
    cancel: 'रद्द करा',
    saveChanges: 'बदल जतन करा',
    statusPending: 'प्रलंबित',
    statusApproved: 'मंजूर',
    statusRejected: 'नाकारले',

    pandalNotFoundTitle: 'मंडळ आढळले नाही',
    pandalNotFoundMsg: 'आपण शोधत असलेले मंडळ उपलब्ध नाही.',
    loadingPandalDetails: 'मंडळाची माहिती लोड होत आहे...',
    visitedCheck: 'दर्शन संपन्न ✓',
    mumbaiUtsav: 'मुंबई उत्सव',
    emptyStateHint: 'आपल्या निकषांनुसार कोणतेही मंडळ सापडले नाही. कृपया फिल्टर्स बदला.',
    knowMissedPandal: 'येथे नसलेल्या मंडळाची माहिती आहे का? भाविकांच्या मदतीसाठी जोडा!',
    noSavedDarshanTitle: 'माझे दर्शन यादीत अद्याप कोणताही मंडळ जतन केलेला नाही',
    noSavedDarshanMsg: 'आपल्या उत्सवाच्या भेटीसाठी कोणत्याही मंडळ कार्डावरील बुकमार्क चिन्ह दाबा.',
    adjustFiltersMsg: 'आपला शोध किंवा फिल्टर्स बदलून पुन्हा प्रयत्न करा.',
    trail: 'मार्ग',
    routeSequence: 'मार्ग क्रम',
    entry: 'प्रवेश',
    exit: 'बाहेर पडण्याचा मार्ग',
    matches: 'निकाल',
    details: 'तपशील',
    zoomIn: 'झूम इन',
    zoomOut: 'झूम आउट',
    showCountdown: 'उलटी गणना दाखवा',
    minimizeBanner: 'बॅनर लहान करा',
    mumbai: 'मुंबई',
    dragToSet: 'स्थान निश्चित करण्यासाठी ओढा',
    changePhoto: 'फोटो बदला',
    supabaseLocalFallbackNote: 'टीप: Supabase क्रेडेंशियल्स स्थानिक फॉलबॅकसह कार्यरत आहेत.',
    firstVisitHint: "तुमच्या सभोवतालचे मंडळ शोधण्यासाठी 'माझ्याजवळ' टॅप करा, किंवा खालील परिसर निवडा.",
    firstVisitDismiss: "समजले",
    chooseLanguagePrompt: "तुमची भाषा निवडा",
    prePromptGpsTitle: "तुमच्या सर्वात जवळची मंडळे शोधा",
    prePromptGpsDesc: "पायवाट आणि प्रवासाचे अंतर मोजण्यासाठी GPS वापरले जाते. तुमचे स्थान तुमच्या फोनवरच राहते.",
    continueGps: "स्थान अनुमती द्या",
    popularAreas: "लोकप्रिय परिसर",
    howToEnableLocation: "स्थान सक्षम करण्यासाठी: ब्राउझर साइट सेटिंग्ज > परवानग्या > स्थान > अनुमती द्या वर जा.",
    recentSearches: "अलीकडील शोध",
    clearRecentSearches: "साफ करा",
    noSearchResults: "या शोधाशी कोणतेही मंडळ जुळत नाही",
    tryPopularArea: "त्याऐवजी लोकप्रिय परिसर निवडून पहा:",
    sortByLabel: "क्रमवारी",
    sortByDistance: "सर्वात जवळ",
    sortByName: "नाव (A-Z)",
    sortByCrowd: "कमी गर्दी",
    resultsCount: "मंडळे",
    openNow: "आता चालू आहे",
    closedNow: "बंद आहे",
    open24Hours: "२४ तास चालू",
    closesAt: "बंद वेळ",
    opensAt: "उघडण्याची वेळ",
    nextAartiLabel: "पुढील आरती",
    verifiedBadge: "सत्यापित मंडळ माहिती",
    communityBadge: "भाविकांनी नोंदवलेले",
    lastUpdatedLabel: "शेवटचे अपडेट",
    reportProblem: "या माहितीमधील त्रुटी नोंदवा",
    reportProblemTitle: "चुकीची माहिती नोंदवा",
    reportProblemSubtitle: "चुकीचे स्थान, वेळा किंवा गर्दीची माहिती कळवून इतर भाविकांना मदत करा.",
    reportIssueType: "काय चुकीचे आहे?",
    issueWrongLocation: "नकाशावर चुकीचे स्थान",
    issueWrongTimings: "दर्शन / आरतीची वेळ बदलली",
    issueCrowdInaccurate: "गर्दीची माहिती चुकीची आहे",
    issueClosed: "मंडळ बंद आहे / सुरू नाही",
    issueOther: "इतर दुरुस्ती",
    reportDetails: "अतिरिक्त माहिती (पर्यायी)",
    reportDetailsPlaceholder: "उदा. प्रवेशद्वार बाजूच्या गल्लीतून केले आहे...",
    reporterNameOptional: "तुमचे नाव (पर्यायी)",
    reporterContactOptional: "फोन किंवा ईमेल (पर्यायी)",
    submitReport: "अहवाल पाठवा",
    submittingReport: "पाठवत आहे...",
    reportSubmitted: "धन्यवाद! तुमचा अहवाल पुनरावलोकनासाठी पाठवला आहे.",
    previousPandal: "मागील",
    nextPandal: "पुढील",
    roadClosureNotice: "वाहतूक सूचना: वाहनांना बंदी, केवळ पायी प्रवेश अनुज्ञेय",
    myDarshanRoute: "माझा दर्शन मार्ग",
    openGoogleMapsRoute: "गुगल मॅप्समध्ये संपूर्ण मार्ग उघडा",
    localDeviceNote: "जतन केलेली मंडळे लॉगिनशिवाय याच डिव्हाइसवर सुरक्षित साठवली जातात.",
    reorderTip: "थांब्यांची क्रमवारी बदलण्यासाठी बाण वापरा किंवा थेट गुगल मॅप्स मार्ग उघडा.",
    pandalRemoved: "मंडळ दर्शन यादीतून काढले",
    undo: "पूर्ववत करा",
    offlineBanner: "ऑफलाइन मोड • जतन केलेला डेटा दाखवत आहे",
    onlineBanner: "इंटरनेट पूर्ववत झाले • डेटा अपडेट केला",
    notFoundTitle: "पृष्ठ सापडले नाही",
    notFoundDesc: "तुम्ही शोधत असलेले पृष्ठ किंवा मंडळ अस्तित्वात नाही किंवा हलवले गेले आहे.",
    step1Title: "1. मूलभूत माहिती",
    step2Title: "2. स्थान व वेळा",
    step3Title: "3. फोटो आणि पुनरावलोकन",
    nextStep: "पुढील टप्पा",
    prevStep: "मागे",
    draftSavedNotice: "मसुदा जतन झाला",
    draftRestoredNotice: "पूर्वीचा मसुदा परत मिळवला",
    clearDraft: "मसुदा पुसा",
    useCurrentGps: "माझे सध्याचे स्थान (GPS) वापरा",
    pinLocationSelected: "GPS वरून स्थान निश्चित केले",
    userReportsTab: "वापरकर्ता अहवाल",
    markResolved: "निवारण झाले",
    dismissReport: "रद्द करा",
    noReportsFound: "कोणतेही प्रलंबित अहवाल नाहीत.",
  },
};
