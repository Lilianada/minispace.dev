// This file ensures Firebase Admin is initialized only once
import { getApps, initializeApp, cert } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';

// Check if we need to initialize the app
const apps = getApps();

// Your Firebase service account details
const serviceAccount = {
  projectId: process.env.FIREBASE_PROJECT_ID || 'mini-app-00',
  clientEmail: process.env.FIREBASE_CLIENT_EMAIL || 'firebase-adminsdk-example@mini-app-00.iam.gserviceaccount.com',
  // The private key needs to be properly formatted from the environment variable
  privateKey: process.env.FIREBASE_PRIVATE_KEY 
    ? process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n') 
    : undefined,
};

// Initialize the app if it doesn't exist
export const adminApp = apps.length === 0 
  ? initializeApp({
      credential: cert(serviceAccount),
      databaseURL: `https://${serviceAccount.projectId}.firebaseio.com`,
    })
  : apps[0];

// Export auth and firestore instances
export const adminAuth = getAuth(adminApp);
export const adminDb = getFirestore(adminApp);
