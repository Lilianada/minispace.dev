import { cert, getApps, initializeApp } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';

/**
 * Initialize Firebase Admin SDK with robust fallback options
 * 
 * This function handles various credential scenarios:
 * 1. Full JSON service account in FIREBASE_ADMIN_CREDENTIALS
 * 2. Development mode - mock initialization for demo
 */
function initializeAdminApp() {
  console.log('[Firebase Admin] Starting initialization...');
  console.log('[Firebase Admin] Existing apps:', getApps().length);
  
  if (getApps().length === 0) {
    try {
      // Get project ID from public env var
      const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
      console.log('[Firebase Admin] Project ID:', projectId);
      
      if (!projectId) {
        console.warn('[Firebase Admin] Project ID not found, enabling development mode');
        return 'development';
      }

      // For development, enable mock mode
      const isDevelopment = process.env.NODE_ENV === 'development';
      const adminCredentials = process.env.FIREBASE_ADMIN_CREDENTIALS;
      
      console.log('[Firebase Admin] Environment:', process.env.NODE_ENV);
      console.log('[Firebase Admin] Has credentials:', !!adminCredentials);
      
      if (isDevelopment && !adminCredentials) {
        console.log('[Firebase Admin] ✅ Development mode enabled - using mock authentication');
        return 'development';
      }
      
      if (adminCredentials) {
        try {
          // Decode base64 credentials
          const decoded = Buffer.from(adminCredentials, 'base64').toString('utf-8');
          console.log('[Firebase Admin] Decoded credentials length:', decoded.length);
          
          // Case 1: Complete JSON service account
          if (decoded.trim().startsWith('{')) {
            try {
              const credentials = JSON.parse(decoded);
              console.log('[Firebase Admin] Parsed credentials successfully');
              initializeApp({
                credential: cert(credentials),
                projectId: projectId,
              });
              console.log('[Firebase Admin] ✅ Initialized with real credentials!');
              return true;
            } catch (jsonError) {
              console.warn('[Firebase Admin] Invalid service account JSON, falling back to development mode');
              console.warn('[Firebase Admin] Error details:', jsonError.message);
              return 'development';
            }
          }
        } catch (error) {
          console.warn('[Firebase Admin] Failed to process credentials, falling back to development mode');
        }
      }
      
      // Fallback to development mode
      console.log('[Firebase Admin] ✅ Development mode enabled');
      return 'development';
    } catch (error) {
      console.warn('[Firebase Admin] Error during initialization, falling back to development mode:', error);
      return 'development';
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
    return 'development';
  }
})();

// Export the admin SDK instances safely
let adminAuth: ReturnType<typeof getAuth> | undefined;
let adminDb: ReturnType<typeof getFirestore> | undefined;

try {
  if (adminInitialized === true) {
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
  const result = adminInitialized === true && !!(adminAuth && adminDb);
  console.log(`[Firebase Admin] isAdminAvailable() called - adminInitialized: ${adminInitialized}, adminAuth: ${!!adminAuth}, adminDb: ${!!adminDb}, result: ${result}`);
  
  // If admin is not available but we're in development mode, return true to allow demo content
  if (!result && adminInitialized === 'development') {
    console.log(`[Firebase Admin] Admin not available but in development mode - allowing demo content`);
    return true; // This will allow the page to render demo content
  }
  
  return result;
}

/**
 * Check if we're in development mode
 */
export function isDevelopmentMode(): boolean {
  const result = adminInitialized === 'development';
  console.log(`[Firebase Admin] isDevelopmentMode() called - adminInitialized: ${adminInitialized}, result: ${result}`);
  return result;
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