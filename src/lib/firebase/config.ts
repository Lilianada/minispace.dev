import { initializeApp, getApps, FirebaseApp } from "firebase/app";
import { 
  getAuth, 
  setPersistence, 
  browserLocalPersistence,
  Auth 
} from "firebase/auth";
import { getFirestore, Firestore } from "firebase/firestore";
import { getStorage, FirebaseStorage } from "firebase/storage";

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
let storage: FirebaseStorage;

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
    storage = getStorage(app);
    
    return { app, auth, db, storage };
  } catch (error) {
    console.error("Firebase initialization error:", error);
    // Create dummy objects that won't break code
    return {
      app: {} as FirebaseApp,
      auth: {} as Auth,
      db: {} as Firestore,
      storage: {} as FirebaseStorage
    };
  }
}

// Initialize Firebase immediately
const { app: firebaseApp, auth: firebaseAuth, db: firebaseDb, storage: firebaseStorage } = initFirebase();

// Export the initialized instances
export { firebaseApp as app, firebaseAuth as auth, firebaseDb as db, firebaseStorage as storage };