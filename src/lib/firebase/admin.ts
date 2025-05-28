import { getApps, initializeApp } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';
import { getAdminConfig, type AdminInitStatus, isDevEnvironment, isSubdomainHost, getHostFromHeaders } from './admin-config';

// Add proper typing for NODE_ENV
declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NEXT_PUBLIC_URL?: string;
      NEXT_PUBLIC_FIREBASE_PROJECT_ID?: string;
      FIREBASE_ADMIN_CREDENTIALS?: string;
    }
  }
}

/**
 * Initialize Firebase Admin app if not already initialized
 */
function initializeAdminApp(): AdminInitStatus {
  console.log('[Firebase Admin] Starting initialization...');
  console.log('[Firebase Admin] Existing apps:', getApps().length);
  
  if (getApps().length === 0) {
    const { status, config } = getAdminConfig();
    
    // If we have a valid config, initialize Firebase Admin
    if (status === true && config) {
      try {
        initializeApp(config);
        console.log('[Firebase Admin] ✅ Initialized with real credentials!');
        return true;
      } catch (error) {
        console.warn('[Firebase Admin] Failed to initialize Firebase Admin:', error);
        return 'development';
      }
    }
    
    // Otherwise use development mode
    console.log('[Firebase Admin] Using development mode');
    return 'development';
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
 * 
 * Returns true if Firebase Admin is initialized or if we can use demo content
 */
export async function isAdminAvailable(): Promise<boolean> {
  // Check for real Firebase Admin initialization
  const realAdminAvailable = adminInitialized === true && !!(adminAuth && adminDb);
  
  // Check for subdomain request context
  const host = await getHostFromHeaders();
  const isSubdomainRequest = isSubdomainHost(host);
  
  if (isSubdomainRequest) {
    console.log(`[Firebase Admin] Detected subdomain request on host: ${host}`);
  }
  
  // Development mode check
  const isDevMode = isDevelopmentMode();
  
  // Log availability information
  console.log(`[Firebase Admin] isAdminAvailable():
    - realAdminAvailable: ${realAdminAvailable}
    - isDevMode: ${isDevMode}
    - isSubdomainRequest: ${isSubdomainRequest}
  `);
  
  // In production with no admin, log an error
  if (!realAdminAvailable && !isDevMode && !isSubdomainRequest && process.env.NODE_ENV === 'production') {
    console.error(`[Firebase Admin] Admin not available in production environment.
      This could cause content not to load correctly.
      Check that FIREBASE_ADMIN_CREDENTIALS and NEXT_PUBLIC_FIREBASE_PROJECT_ID are set correctly.`);
  }
  
  // Return true for real admin, dev mode, or subdomain requests
  return realAdminAvailable || isDevMode || isSubdomainRequest;
}

/**
 * Check if we're in development mode
 */
export function isDevelopmentMode(): boolean {
  const envIsDev = isDevEnvironment();
  const adminInitializedAsDev = adminInitialized === 'development';
  return envIsDev || adminInitializedAsDev;
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