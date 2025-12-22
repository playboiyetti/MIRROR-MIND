const admin = require('firebase-admin');
const dotenv = require('dotenv');

dotenv.config();

/**
 * Initializes Firebase Admin SDK using environment variables.
 * We prefer environment variables for security, but allow for a serviceAccountKey.json 
 * if provided in the root.
 */
function initializeFirebase() {
  try {
    const serviceAccountBase64 = process.env.FIREBASE_SERVICE_ACCOUNT_BASE64;
    
    if (serviceAccountBase64) {
      // Initialize using Base64 encoded JSON string from environment variable
      const serviceAccount = JSON.parse(Buffer.from(serviceAccountBase64, 'base64').toString());
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        databaseURL: process.env.FIREBASE_DATABASE_URL
      });
      console.log('Firebase Admin SDK initialized successfully via Environment Variable.');
    } else {
      // Fallback to local file if it exists, otherwise warn
      // In a real environment, you'd want to handle this strictly
      console.warn('Warning: FIREBASE_SERVICE_ACCOUNT_BASE64 not found. Please provide credentials to enable Firebase features.');
    }
  } catch (error) {
    console.error('Error initializing Firebase Admin SDK:', error.message);
  }
}

module.exports = {
  initializeFirebase,
  admin
};
