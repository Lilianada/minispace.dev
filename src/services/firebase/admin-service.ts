/**
 * Firebase Admin Service
 * 
 * Centralizes all Firebase Admin SDK interactions.
 * Provides a clean API for server-side Firebase operations.
 */

import { getAdminConfig } from '@/lib/firebase/admin-config';
import { isSubdomainHost } from '@/lib/firebase/admin-config';
import { getHostFromHeaders } from '@/lib/firebase/admin-config';

// Cache for the admin app
let adminApp: any = null;

/**
 * Get Firebase Admin SDK instance
 * This is lazily initialized to avoid unnecessary initialization in client contexts
 */
export function getFirebaseAdmin() {
  if (adminApp) {
    return adminApp;
  }
  
  // Only import in server context
  if (typeof window !== 'undefined') {
    throw new Error('Firebase Admin SDK can only be used in server-side code');
  }
  
  try {
    // Dynamic import to avoid loading in client contexts
    const admin = require('firebase-admin');
    
    // Initialize the app if not already done
    if (!admin.apps.length) {
      const config = getAdminConfig();
      adminApp = admin.initializeApp(config);
    } else {
      adminApp = admin.apps[0];
    }
    
    return {
      app: adminApp,
      auth: admin.auth,
      firestore: admin.firestore,
      storage: admin.storage
    };
  } catch (error) {
    console.error('Failed to initialize Firebase Admin SDK:', error);
    throw error;
  }
}

/**
 * Check if Firebase Admin is available in the current context
 */
export async function isAdminAvailable(): Promise<boolean> {
  // Get host for subdomain detection
  const host = await getHostFromHeaders();
  const isSubdomainRequest = isSubdomainHost(host);
  
  // Development mode check
  const isDev = process.env.NODE_ENV === 'development';
  
  // In development or subdomain context, we allow access even without admin
  if (isDev || isSubdomainRequest) {
    return true;
  }
  
  // Otherwise check for actual admin initialization
  try {
    const { adminAuth, adminDb } = await import('@/lib/firebase/admin');
    return !!(adminAuth && adminDb);
  } catch (error) {
    console.error('Error checking admin availability:', error);
    return false;
  }
}

/**
 * Verify a Firebase ID token on the server
 */
export async function verifyAuthToken(token: string) {
  try {
    if (!token) {
      return null;
    }
    
    const { adminAuth } = await import('@/lib/firebase/admin');
    
    if (!adminAuth) {
      console.warn('Admin auth not available for token verification');
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
    // Extract token from Authorization header or cookies
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
    
    // Verify the token
    return await verifyAuthToken(token);
  } catch (error) {
    console.error('Error getting auth user from request:', error);
    return null;
  }
}
