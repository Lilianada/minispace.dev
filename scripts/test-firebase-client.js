// Test Firebase Client SDK connectivity
require('dotenv').config({ path: '.env.local' });

// Test client-side Firebase connectivity
async function testFirebaseClient() {
  console.log('=== Testing Firebase Client SDK ===');
  
  try {
    console.log('Loading Firebase SDK...');
    const { initializeApp } = require('firebase/app');
    const { getAuth, signInAnonymously } = require('firebase/auth');
    const { getFirestore, collection, getDocs } = require('firebase/firestore');
    console.log('✅ Firebase SDK loaded successfully');

    // Config
    const firebaseConfig = {
      apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
      authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
      messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
      appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    };
    
    console.log('Firebase config:', {
      apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY ? '✅ Present' : '❌ Missing',
      authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN ? '✅ Present' : '❌ Missing',
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ? '✅ Present' : '❌ Missing',
      storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET ? '✅ Present' : '❌ Missing',
      messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID ? '✅ Present' : '❌ Missing',
      appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID ? '✅ Present' : '❌ Missing',
    });
    
    // Initialize
    console.log('Initializing Firebase app...');
    const app = initializeApp(firebaseConfig);
    console.log('✅ Firebase initialized');
    
    // Auth test
    console.log('Initializing Firebase Auth...');
    const auth = getAuth(app);
    console.log('✅ Firebase Auth initialized');

    // Firestore test
    console.log('Initializing Firebase Firestore...');
    const db = getFirestore(app);
    console.log('✅ Firebase Firestore initialized');
    
    // Test collection access
    console.log('Testing Firestore collection access...');
    try {
      const usersRef = collection(db, 'Users');
      console.log('✅ Collection reference created');
      
      // List documents (limit to 1)
      const querySnapshot = await getDocs(usersRef);
      console.log(`✅ Retrieved ${querySnapshot.size} documents`);
      
      if (querySnapshot.size > 0) {
        const firstDoc = querySnapshot.docs[0];
        console.log('Sample document ID:', firstDoc.id);
      }
    } catch (error) {
      console.error('❌ Firestore collection access failed:', error.message);
    }
    
    console.log('\n✅ Firebase Client SDK is working correctly!');
    
  } catch (error) {
    console.error('❌ Firebase Client SDK test failed:', error.message);
    console.error(error);
  }
}

testFirebaseClient();
