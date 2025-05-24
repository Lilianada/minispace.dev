// Test Firebase Admin initialization
require('dotenv').config({ path: '.env.local' });
const admin = require('firebase-admin');
const fs = require('fs');
const path = require('path');

console.log('Testing Firebase Admin initialization...');

// Check environment variables
const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
const adminCreds = process.env.FIREBASE_ADMIN_CREDENTIALS;

console.log('Project ID available:', !!projectId);
console.log('Admin credentials available:', !!adminCreds);

try {
  // Construct a complete service account JSON
  if (projectId && adminCreds) {
    try {
      // Decode from base64
      const decodedCreds = Buffer.from(adminCreds, 'base64').toString('utf-8');
      console.log('Decoded credentials, first 50 chars:', decodedCreds.substring(0, 50));
      
      // Check if it contains private key
      if (decodedCreds.includes('BEGIN PRIVATE KEY')) {
        console.log('Valid private key found in credentials');
        
        // Create a minimal service account for testing
        const serviceAccount = {
          "type": "service_account",
          "project_id": projectId,
          "private_key": decodedCreds,
          "client_email": `firebase-adminsdk@${projectId}.iam.gserviceaccount.com`
        };
        
        // Initialize the admin SDK with our service account
        if (admin.apps.length === 0) {
          admin.initializeApp({
            credential: admin.credential.cert(serviceAccount)
          });
          console.log('Firebase Admin SDK initialized successfully');
          
          // Test if we can get Firestore
          const db = admin.firestore();
          console.log('Firestore instance created:', !!db);
          
          // Try a simple query
          console.log('Testing a simple query...');
          db.collection('test').doc('test').get()
            .then(() => console.log('Query executed successfully'))
            .catch(err => console.error('Query failed:', err.message));
        }
      } else {
        console.warn('Credentials do not contain a private key');
      }
    } catch (error) {
      console.error('Error processing credentials:', error);
    }
  } else {
    console.warn('Missing required environment variables');
  }
} catch (error) {
  console.error('Test failed:', error);
}
