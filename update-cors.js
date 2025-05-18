const { initializeApp } = require('firebase-admin/app');
const { getStorage } = require('firebase-admin/storage');

// Initialize Firebase Admin SDK
initializeApp({
  // No need for credentials when running locally with firebase login
  projectId: 'mini-app-00',
  storageBucket: 'mini-app-00.appspot.com'
});

// The default bucket name is usually in the format: <project-id>.appspot.com
// But we'll try multiple formats to find the correct one

async function updateCorsConfiguration() {
  try {
    const bucket = getStorage().bucket();
    
    // Set CORS configuration
    await bucket.setCorsConfiguration([
      {
        origin: ['http://localhost:3000', 'https://minispace.app', 'https://*.minispace.app'],
        method: ['GET', 'PUT', 'POST', 'DELETE', 'HEAD'],
        maxAgeSeconds: 3600
      }
    ]);
    
    console.log('CORS configuration updated successfully!');
  } catch (error) {
    console.error('Error updating CORS configuration:', error);
  }
}

updateCorsConfiguration();
