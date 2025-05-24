import { initializeApp, getApps, FirebaseApp } from "firebase/app";
import { 
  getAuth, 
  setPersistence, 
  browserLocalPersistence,
  Auth 
} from "firebase/auth";
import { getFirestore, Firestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Check if we're in a browser environment
const isBrowser = typeof window !== "undefined";

// Initialize Firebase only in browser environment
let app: FirebaseApp;
let auth: Auth;
let db: Firestore;

// Function to initialize Firebase - will be called immediately
function initFirebase() {
  try {
    if (!getApps().length) {
      app = initializeApp(firebaseConfig);
    } else {
      app = getApps()[0];
    }
    
    auth = getAuth(app);
    
    // Set persistence only in browser
    if (isBrowser) {
      setPersistence(auth, browserLocalPersistence).catch(console.error);
    }
    
    db = getFirestore(app);
    
    return { app, auth, db };
  } catch (error) {
    console.error("Firebase initialization error:", error);
    // Create dummy objects that won't break code
    return {
      app: {} as FirebaseApp,
      auth: {} as Auth,
      db: {} as Firestore
    };
  }
}

// Initialize Firebase immediately
const { app: firebaseApp, auth: firebaseAuth, db: firebaseDb } = initFirebase();

// Export the initialized instances
export { firebaseApp as app, firebaseAuth as auth, firebaseDb as db };