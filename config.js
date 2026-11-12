// Manager Judgment Assessment: site settings.
// Fill in the "firebase" block from Firebase console > Project settings > Your apps > Web app > SDK setup and configuration.
// These values identify your Firebase project; they are designed to be public. The firestore.rules file is what protects the data.
window.MJA_CONFIG = {
  appName: 'Manager Judgment Assessment',
  // Google accounts on this email domain can use everything: the test and the team survey.
  // Keep it in step with signedIn() in firestore.rules.
  allowedDomain: 'databeat.io',
  // true: any Google account with a verified email can take the test (keep it in step with
  // anyAccount() in firestore.rules). The team survey stays limited to allowedDomain.
  openTest: true,
  firebase: {
    apiKey: 'AIzaSyASHHM6muzpym2Diarsi2_huTz1stdpAWE',
    authDomain: 'manager-assessment-538e9.firebaseapp.com',
    projectId: 'manager-assessment-538e9',
    storageBucket: 'manager-assessment-538e9.firebasestorage.app',
    messagingSenderId: '1034203464603',
    appId: '1:1034203464603:web:3e6abe2af8caac891b573e'
  }
};
