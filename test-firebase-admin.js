console.log('Starting Firebase Admin test...');

try {
  require('dotenv').config({ path: '.env.local' });
  console.log('Environment loaded');

  const { cert, getApps, initializeApp } = require('firebase-admin/app');
  console.log('Firebase Admin modules loaded');

  const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
  const adminCredentials = process.env.FIREBASE_ADMIN_CREDENTIALS;

  console.log('Project ID:', projectId);
  console.log('Has credentials:', !!adminCredentials);

  if (adminCredentials && projectId) {
    const decoded = Buffer.from(adminCredentials, 'base64').toString('utf-8');
    const credentials = JSON.parse(decoded);
    console.log('Credentials parsed successfully');
    
    const app = initializeApp({
      credential: cert(credentials),
      projectId: projectId,
    }, 'test-app');
    
    console.log('✅ Firebase Admin initialized successfully!');
  } else {
    console.log('❌ Missing required environment variables');
  }
} catch (error) {
  console.error('❌ Error:', error.message);
  console.error('Stack:', error.stack);
}