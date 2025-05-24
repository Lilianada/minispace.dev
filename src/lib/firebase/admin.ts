import { cert, getApps, initializeApp } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';

/**
 * Initialize Firebase Admin SDK with robust fallback options
 * 
 * This function handles various credential scenarios:
 * 1. Full JSON service account in FIREBASE_ADMIN_CREDENTIALS
 * 2. Just a private key in FIREBASE_ADMIN_CREDENTIALS
 * 3. No credentials - skips initialization for development
 */
function initializeAdminApp() {
  if (getApps().length === 0) {
    try {
      // Get project ID from public env var
      const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
      
      if (!projectId) {
        console.warn('Firebase project ID not found, skipping admin initialization');
        return false;
      }

      // Get admin credentials if available
      const adminCredentials = process.env.FIREBASE_ADMIN_CREDENTIALS;
      
      if (adminCredentials) {
        try {
          // Decode base64 credentials
          const decoded = Buffer.from(adminCredentials, 'base64').toString('utf-8');
          
          // Case 1: Complete JSON service account
          if (decoded.trim().startsWith('{')) {
            try {
              const credentials = JSON.parse(decoded);
              initializeApp({
                credential: cert(credentials),
                projectId: projectId,
              });
              return true;
            } catch (jsonError) {
              console.warn('Invalid service account JSON:', jsonError);
            }
          }
          
          // Case 2: Just a private key
          if (decoded.includes('BEGIN PRIVATE KEY')) {
            try {
              initializeApp({
                credential: cert({
                  projectId: projectId,
                  clientEmail: `firebase-adminsdk@${projectId}.iam.gserviceaccount.com`,
                  privateKey: decoded,
                }),
                projectId: projectId,
              });
              return true;
            } catch (keyError) {
              console.warn('Failed to use private key:', keyError);
            }
          }
        } catch (error) {
          console.warn('Failed to process admin credentials');
        }
      }
      
      // Case 3: Development mode without credentials
      console.warn('No valid admin credentials found, theme pages will use demo content');
      return false;
    } catch (error) {
      console.warn('Error initializing Firebase Admin:', error);
      return false;
    }
  }
  
  return getApps().length > 0;
}

// Initialize the admin app
const adminInitialized = (() => {
  try {
    return initializeAdminApp();
  } catch (error) {
    console.warn('Failed to initialize Firebase Admin SDK:', error);
    return false;
  }
})();

// Export the admin SDK instances safely
let adminAuth: ReturnType<typeof getAuth> | undefined;
let adminDb: ReturnType<typeof getFirestore> | undefined;

try {
  if (adminInitialized) {
    adminAuth = getAuth();
    adminDb = getFirestore();
  }
} catch (error) {
  console.warn('Failed to get Firebase Admin instances:', error);
}

export { adminAuth, adminDb };

/**
 * Check if Firebase Admin is available
 */
export function isAdminAvailable(): boolean {
  return !!(adminAuth && adminDb && adminInitialized);
}

/**
 * Verify a Firebase ID token
 */
export async function verifyAuthToken(token: string) {
  try {
    if (!token || !adminAuth) {
      return null;
    }
    
    const decodedToken = await adminAuth.verifyIdToken(token);
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
    const authHeader = request.headers.get('authorization');
    let token: string | undefined;
    
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.split('Bearer ')[1];
    } else {
      const cookieHeader = request.headers.get('cookie');
      if (cookieHeader) {
        const cookies = cookieHeader.split(';').map(c => c.trim());
        const authCookie = cookies.find(c => c.startsWith('authToken='));
        if (authCookie) {
          token = authCookie.split('=')[1];
        }
      }
    }
    
    if (!token) {
      return null;
    }
    
    return await verifyAuthToken(token);
  } catch (error) {
    console.error('Error getting auth user from request:', error);
    return null;
  }
}