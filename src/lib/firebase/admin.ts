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
  console.log('[Firebase Admin] Running in environment:', process.env.NODE_ENV);
  console.log('[Firebase Admin] Request URL:', process.env.NEXT_PUBLIC_URL || 'unknown');
  
  if (getApps().length === 0) {
    try {
      // Get project ID from public env var
      const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
      console.log('[Firebase Admin] Project ID:', projectId);
      
      // Always enable development mode for local development
      // This ensures demo content works in all scenarios including subdomains
      if (process.env.NODE_ENV === 'development') {
        console.log('[Firebase Admin] 🧪 Running in development environment - enabling development mode');
        return 'development';
      }
      
      if (!projectId) {
        console.warn('[Firebase Admin] Project ID not found, enabling development mode');
        return 'development';
      }

      // Environment and credentials check
      const isDevelopment = process.env.NODE_ENV === 'development';
      const adminCredentials = process.env.FIREBASE_ADMIN_CREDENTIALS;
      
      console.log('[Firebase Admin] Environment:', process.env.NODE_ENV);
      console.log('[Firebase Admin] Has credentials:', !!adminCredentials);
      
      if (isDevelopment || !adminCredentials) {
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
 * 
 * Enhanced to better handle subdomain routing and development mode
 */
export function isAdminAvailable(): boolean {
  // Check for real Firebase Admin initialization
  const realAdminAvailable = adminInitialized === true && !!(adminAuth && adminDb);
  
  // More detailed logging to help with debugging
  console.log(`[Firebase Admin] isAdminAvailable() called:
    - adminInitialized: ${adminInitialized}
    - adminAuth available: ${!!adminAuth}
    - adminDb available: ${!!adminDb}
    - real admin available: ${realAdminAvailable}
    - NODE_ENV: ${process.env.NODE_ENV}
    - Project ID: ${process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'not set'}
  `);
  
  // Check for subdomain request context
  let host = '';
  try {
    // Safe way to access headers - may not be available in all contexts
    if (typeof window === 'undefined') {
      const { headers } = require('next/headers');
      const headersList = headers();
      host = headersList.get('host') || '';
    } else {
      host = window.location.host;
    }
  } catch (error) {
    console.log('[Firebase Admin] Could not access request headers, subdomain detection skipped');
  }
  
  // Determine if this is a subdomain request
  const isSubdomainRequest = host.includes('.localhost:') || 
                            host.includes('.minispace.dev') || 
                            host.includes('.127.0.0.1:');
  
  if (isSubdomainRequest) {
    console.log(`[Firebase Admin] Detected subdomain request on host: ${host}`);
  }
  
  // Use the improved isDevelopmentMode function
  const isDevMode = isDevelopmentMode();
  
  // === DECISION LOGIC ===
  
  // Case 1: Real admin is available - always return true
  if (realAdminAvailable) {
    return true;
  }
  
  // Case 2: Development mode - always allow demo content
  if (isDevMode) {
    console.log(`[Firebase Admin] Admin not available but in development mode - allowing demo content`);
    return true;
  }
  
  // Case 3: Subdomain requests - more permissive even in production
  if (isSubdomainRequest) {
    console.log(`[Firebase Admin] Admin not available but on subdomain request (${host}) - allowing demo content`);
    return true;
  }
  
  // Case 4: Production mode without admin - log detailed error
  if (process.env.NODE_ENV === 'production') {
    console.error(`[Firebase Admin] Admin not available in production environment.
      This could cause content not to load correctly.
      Check that FIREBASE_ADMIN_CREDENTIALS and NEXT_PUBLIC_FIREBASE_PROJECT_ID are set correctly.`);
  }
  
  // Final result - only true for real admin or the cases above
  return realAdminAvailable || isDevMode || isSubdomainRequest;
}

/**
 * Check if we're in development mode
 * 
 * This function checks both the adminInitialized flag and the NODE_ENV
 * to determine if we're in development mode
 */
export function isDevelopmentMode(): boolean {
  const envIsDev = process.env.NODE_ENV === 'development';
  const adminInitializedAsDev = adminInitialized === 'development';
  const result = envIsDev || adminInitializedAsDev;
  
  console.log(`[Firebase Admin] isDevelopmentMode() called:
    - adminInitialized: ${adminInitialized}
    - NODE_ENV: ${process.env.NODE_ENV}
    - result: ${result}
  `);
  
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