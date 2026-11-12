// Manager Judgment Assessment: site settings.
// Fill in the "firebase" block from Firebase console > Project settings > Your apps > Web app > SDK setup and configuration.
// These values identify your Firebase project; they are designed to be public. The firestore.rules file is what protects the data.
window.MJA_CONFIG = {
  appName: 'Manager Judgment Assessment',
  // Only Google accounts on this email domain can sign in. Keep it in step with firestore.rules.
  allowedDomain: 'databeat.io',
  firebase: {
    apiKey: '',
    authDomain: '',
    projectId: '',
    storageBucket: '',
    messagingSenderId: '',
    appId: ''
  }
};
