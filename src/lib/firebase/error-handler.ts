/**
 * Firebase Error Handler
 * 
 * This module provides consistent error handling patterns for Firebase operations.
 */

import { FirebaseError } from 'firebase/app';
import { UserCredential } from 'firebase/auth';

// Firebase error types
export type FirebaseResult<T> = {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    originalError?: any;
  };
};

/**
 * Convert Firebase error to a standardized format
 * @param error The error from Firebase
 * @returns A standardized error object
 */
export function parseFirebaseError(error: any): FirebaseResult<never>['error'] {
  if (error instanceof FirebaseError) {
    return {
      code: error.code,
      message: getReadableErrorMessage(error),
      originalError: error,
    };
  }
  
  return {
    code: 'unknown',
    message: error?.message || 'An unknown error occurred',
    originalError: error,
  };
}

/**
 * Wrap a Firebase operation with consistent error handling
 * @param operation The async Firebase operation to perform
 * @returns A standardized result object
 */
export async function handleFirebaseOperation<T>(
  operation: () => Promise<T>
): Promise<FirebaseResult<T>> {
  try {
    const data = await operation();
    return { 
      success: true,
      data 
    };
  } catch (error) {
    console.error('Firebase operation failed:', error);
    return {
      success: false,
      error: parseFirebaseError(error)
    };
  }
}

/**
 * Convert Firebase error codes to user-friendly messages
 * @param error The Firebase error
 * @returns A user-friendly error message
 */
export function getReadableErrorMessage(error: FirebaseError | any): string {
  // Firebase Auth error codes
  if (error instanceof FirebaseError) {
    switch (error.code) {
      // Auth errors
      case 'auth/email-already-in-use':
        return 'This email is already being used by another account.';
      case 'auth/invalid-email':
        return 'Please provide a valid email address.';
      case 'auth/user-not-found':
        return 'No account found with this email.';
      case 'auth/wrong-password':
        return 'Incorrect password. Please try again.';
      case 'auth/weak-password':
        return 'Password is too weak. Please use a stronger password.';
      case 'auth/too-many-requests':
        return 'Too many failed login attempts. Please try again later.';
        
      // Firestore errors  
      case 'permission-denied':
        return 'You don\'t have permission to perform this operation.';
      case 'resource-exhausted':
        return 'System resources have been exhausted or quota exceeded.';
      case 'not-found':
        return 'The requested document was not found.';
        
      // Storage errors
      case 'storage/unauthorized':
        return 'You don\'t have permission to access this file.';
      case 'storage/canceled':
        return 'The operation was cancelled.';
      case 'storage/quota-exceeded':
        return 'Storage quota has been exceeded.';
        
      default:
        return error.message || 'An unexpected error occurred. Please try again.';
    }
  }
  
  return error?.message || 'An unexpected error occurred. Please try again.';
}
