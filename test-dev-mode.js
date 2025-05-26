// Test development mode detection
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env.local') });

// Import the Firebase Admin functions
const { isAdminAvailable, isDevelopmentMode } = require('./src/lib/firebase/admin.ts');

async function testDevMode() {
  console.log('Testing development mode detection...');
  console.log('NODE_ENV:', process.env.NODE_ENV);
  console.log('FIREBASE_ADMIN_CREDENTIALS set:', !!process.env.FIREBASE_ADMIN_CREDENTIALS);
  console.log('NEXT_PUBLIC_FIREBASE_PROJECT_ID:', process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID);
  
  // Test the admin functions
  console.log('Admin available:', isAdminAvailable());
  console.log('Development mode:', isDevelopmentMode());
}

testDevMode().catch(console.error);
