import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { getAuth } from 'firebase-admin/auth';

// Initialize Firebase Admin
function initAdmin() {
  if (!getApps().length) {
    // Decode Firebase admin credentials
    const serviceAccount = JSON.parse(
      Buffer.from(process.env.FIREBASE_ADMIN_CREDENTIALS || '', 'base64').toString()
    );
    
    initializeApp({
      credential: cert(serviceAccount),
      databaseURL: `https://${process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID}.firebaseio.com`,
    });
  }
  
  return {
    db: getFirestore(),
    auth: getAuth(),
  };
}

export const getAdminApp = initAdmin;