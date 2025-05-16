import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

// Initialize Firebase Admin only if it hasn't been initialized yet
if (!getApps().length) {
  // Check if we have the credentials available
  if (process.env.FIREBASE_ADMIN_CREDENTIALS) {
    const serviceAccount = JSON.parse(
      process.env.FIREBASE_ADMIN_CREDENTIALS
    );
    
    initializeApp({
      credential: cert(serviceAccount),
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    });
  } else {
    // Initialize with the default config (uses GOOGLE_APPLICATION_CREDENTIALS env var)
    initializeApp();
  }
}

const adminDb = getFirestore();

export { adminDb };