console.log('Testing environment variables...');

try {
  require('dotenv').config({ path: '.env.local' });
  
  const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
  const adminCredentials = process.env.FIREBASE_ADMIN_CREDENTIALS;
  
  console.log('Project ID:', projectId);
  console.log('Has credentials:', !!adminCredentials);
  console.log('Credentials length:', adminCredentials ? adminCredentials.length : 0);
  
  if (adminCredentials) {
    try {
      const decoded = Buffer.from(adminCredentials, 'base64').toString('utf-8');
      const credentials = JSON.parse(decoded);
      console.log('✅ Credentials decoded successfully');
      console.log('Private key preview:', credentials.private_key.substring(0, 50) + '...');
    } catch (decodeError) {
      console.error('❌ Decode error:', decodeError.message);
    }
  }
} catch (error) {
  console.error('❌ Error:', error.message);
}
