// Debug script to examine Firebase credentials
require('dotenv').config({ path: '.env.local' });

const credentials = process.env.FIREBASE_ADMIN_CREDENTIALS;
console.log('Raw credentials found:', !!credentials);

if (credentials) {
  try {
    const decoded = Buffer.from(credentials, 'base64').toString('utf-8');
    console.log('\n=== Decoded Content ===');
    console.log('Length:', decoded.length);
    console.log('First 300 chars:', decoded.substring(0, 300));
    console.log('\n=== Analysis ===');
    
    if (decoded.trim().startsWith('{')) {
      console.log('✓ Starts with { - looks like JSON');
      try {
        const parsed = JSON.parse(decoded);
        console.log('✓ Valid JSON');
        console.log('Keys found:', Object.keys(parsed));
        console.log('Has required fields:', {
          project_id: !!parsed.project_id,
          client_email: !!parsed.client_email,
          private_key: !!parsed.private_key
        });
      } catch (e) {
        console.log('✗ Invalid JSON:', e.message);
      }
    } else {
      console.log('✗ Does not start with { - might be raw private key');
      if (decoded.includes('BEGIN PRIVATE KEY')) {
        console.log('✓ Contains private key pattern');
        console.log('This appears to be a raw private key, not a service account JSON');
      }
    }
  } catch (e) {
    console.log('Failed to decode base64:', e.message);
  }
} else {
  console.log('No FIREBASE_ADMIN_CREDENTIALS environment variable found');
}
