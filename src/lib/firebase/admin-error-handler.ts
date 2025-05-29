/**
 * Firebase Admin Error Handler
 * 
 * This module provides consistent error handling patterns for Firebase Admin operations.
 * Similar to the client-side error handler but specialized for admin operations.
 */

import { FirebaseError } from 'firebase-admin/app';

// Firebase admin error result type
export type FirebaseAdminResult<T> = {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    originalError?: any;
  };
};

/**
 * Convert Firebase Admin error to a standardized format
 * @param error The error from Firebase Admin
 * @returns A standardized error object
 */
export function parseFirebaseAdminError(error: any): FirebaseAdminResult<never>['error'] {
  if (error instanceof FirebaseError) {
    return {
      code: error.code || 'unknown',
      message: getReadableAdminErrorMessage(error),
      originalError: error,
    };
  }
  
  return {
    code: 'unknown',
    message: error?.message || 'An unknown server error occurred',
    originalError: error,
  };
}

/**
 * Wrap a Firebase Admin operation with consistent error handling
 * @param operation The async Firebase Admin operation to perform
 * @returns A standardized result object
 */
export async function handleFirebaseAdminOperation<T>(
  operation: () => Promise<T>
): Promise<FirebaseAdminResult<T>> {
  try {
    const data = await operation();
    return { 
      success: true,
      data 
    };
  } catch (error) {
    console.error('[Firebase Admin] Operation failed:', error);
    return {
      success: false,
      error: parseFirebaseAdminError(error)
    };
  }
}

/**
 * Convert Firebase Admin error codes to user-friendly messages
 * This is particularly important for server-side errors that might be shown to users
 * @param error The Firebase Admin error
 * @returns A user-friendly error message
 */
export function getReadableAdminErrorMessage(error: FirebaseError | any): string {
  // Firebase Admin errors
  if (error instanceof FirebaseError) {
    switch (error.code) {
      // Auth errors
      case 'auth/user-not-found':
        return 'User not found.';
      case 'auth/id-token-expired':
        return 'Your session has expired. Please sign in again.';
      case 'auth/id-token-revoked':
        return 'Your session has been revoked. Please sign in again.';
        
      // Firestore errors  
      case 'permission-denied':
        return 'You don\'t have permission to perform this operation.';
      case 'resource-exhausted':
        return 'Server resources have been exhausted or quota exceeded.';
      case 'not-found':
        return 'The requested resource was not found.';
      case 'already-exists':
        return 'The resource already exists.';
      case 'failed-precondition':
        return 'Operation failed due to a conflict with the current state.';
      case 'unavailable':
        return 'The service is currently unavailable. Please try again later.';
      
      default:
        // For server-side errors, we should be more generic in user-facing messages
        return 'A server error occurred. Please try again later.';
    }
  }
  
  return error?.message || 'An unexpected server error occurred.';
}
