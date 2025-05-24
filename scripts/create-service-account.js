// This file generates a basic Firebase service account JSON based on available environment variables
// It's used to allow Firebase Admin SDK to work in development mode without full credentials
require('dotenv').config({ path: '.env.local' });
const fs = require('fs');
const path = require('path');

function createServiceAccountJson() {
  // Get necessary environment variables
  const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
  const privateKey = process.env.FIREBASE_ADMIN_CREDENTIALS;
  
  if (!projectId) {
    console.error('Error: NEXT_PUBLIC_FIREBASE_PROJECT_ID not found in environment variables');
    process.exit(1);
  }
  
  if (!privateKey) {
    console.error('Error: FIREBASE_ADMIN_CREDENTIALS not found in environment variables');
    process.exit(1);
  }
  
  try {
    // Decode the private key from base64
    const decodedKey = Buffer.from(privateKey, 'base64').toString('utf-8');
    
    // Create minimal service account JSON
    const serviceAccount = {
      "type": "service_account",
      "project_id": projectId,
      "private_key_id": "generated-key-for-development",
      "private_key": decodedKey,
      "client_email": `firebase-adminsdk@${projectId}.iam.gserviceaccount.com`,
      "client_id": "development-client-id",
      "auth_uri": `https://accounts.google.com/o/oauth2/auth`,
      "token_uri": `https://oauth2.googleapis.com/token`,
      "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
      "client_x509_cert_url": `https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk%40${projectId}.iam.gserviceaccount.com`,
      "universe_domain": "googleapis.com"
    };
    
    // Write to .serviceAccountKey.json in the root directory
    const outputPath = path.join(process.cwd(), '.serviceAccountKey.json');
    fs.writeFileSync(outputPath, JSON.stringify(serviceAccount, null, 2));
    
    console.log(`✅ Service account JSON created at ${outputPath}`);
    console.log('You can now use this for Firebase Admin SDK initialization');
    
    // Also output base64 version that can be used as an environment variable
    const base64ServiceAccount = Buffer.from(JSON.stringify(serviceAccount)).toString('base64');
    console.log('\nBase64 encoded service account (for environment variable):\n');
    console.log(base64ServiceAccount.substring(0, 100) + '...');
    
  } catch (error) {
    console.error('Error creating service account JSON:', error);
    process.exit(1);
  }
}

createServiceAccountJson();
