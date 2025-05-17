import { cert, getApps, initializeApp } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';

// Initialize Firebase Admin SDK (if not already initialized)
function initializeAdminApp() {
  if (getApps().length === 0) {
    try {
      // Get admin credentials
      const adminCredentials = process.env.FIREBASE_ADMIN_CREDENTIALS;
      
      if (!adminCredentials) {
        console.error('FIREBASE_ADMIN_CREDENTIALS environment variable is not defined');
        throw new Error('Missing Firebase admin credentials');
      }
      
      try {
        // Decode from base64
        const decodedCredentials = Buffer.from(adminCredentials, 'base64').toString('utf-8');
        
        // Try to parse as JSON
        try {
          const credentials = JSON.parse(decodedCredentials);
          
          initializeApp({
            credential: cert({
              projectId: credentials.project_id,
              clientEmail: credentials.client_email,
              privateKey: credentials.private_key,
            }),
            databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
          });
        } catch (jsonError) {
          // If not valid JSON, use as string private key
          console.warn('Could not parse credentials as JSON, using as private key string');
          initializeApp({
            credential: cert({
              projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID as string,
              clientEmail: process.env.FIREBASE_CLIENT_EMAIL as string,
              privateKey: decodedCredentials,
            }),
            databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
          });
        }
      } catch (decodeError) {
        console.error('Failed to decode base64 credentials:', decodeError);
        throw new Error('Firebase Admin SDK initialization failed: Invalid credential format');
      }
    } catch (error) {
      console.error('Error initializing Firebase Admin:', error);
      throw new Error('Firebase Admin SDK initialization failed');
    }
  }
}

// Initialize the admin app
initializeAdminApp();

// Export the admin SDK instances
export const adminAuth = getAuth();
export const adminDb = getFirestore();

/**
 * Verify a Firebase ID token
 */
export async function verifyAuthToken(token: string) {
  try {
    console.log('Verifying auth token:', token ? `Length: ${token.length}` : 'No token');
    if (!token) {
      console.warn('Empty token provided to verifyAuthToken');
      return null;
    }
    
    const decodedToken = await adminAuth.verifyIdToken(token);
    console.log('Token verified successfully for UID:', decodedToken.uid);
    return decodedToken;
  } catch (error) {
    console.error('Error verifying auth token:', error);
    return null;
  }
}

/**
 * Get authenticated user from a request
 */
export async function getAuthUser(request: Request) {
  try {
    // First try to get token from authorization header
    const authHeader = request.headers.get('authorization');
    let token: string | undefined;
    
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.split('Bearer ')[1];
      console.log('Token extracted from auth header, length:', token.length);
    } 
    
    // If not found in header, try to get from cookies
    if (!token) {
      const cookieHeader = request.headers.get('cookie');
      if (cookieHeader) {
        const cookies = cookieHeader.split(';').map(c => c.trim());
        const authCookie = cookies.find(c => c.startsWith('authToken='));
        if (authCookie) {
          token = authCookie.split('=')[1];
          console.log('Token extracted from cookie, length:', token.length);
        }
      }
    }
    
    if (!token) {
      console.warn('No auth token found in headers or cookies');
      return null;
    }
    
    return await verifyAuthToken(token);
  } catch (error) {
    console.error('Error getting auth user from request:', error);
    return null;
  }
}