/**
 * Authentication Service
 * 
 * Centralizes all Firebase Authentication related functionality.
 * Provides a clean API for authentication operations throughout the app.
 */

import { 
  User, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut as firebaseSignOut,
  onAuthStateChanged,
  sendPasswordResetEmail,
  getIdToken
} from 'firebase/auth';
import { auth, db } from '@/lib/firebase/config';
import { doc, getDoc, setDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { adaptUserData } from '@/lib/type-adapters';

// Type definitions
export interface UserData {
  username: string;
  email: string;
  displayName: string | null;
  photoURL: string | null;
  uid: string;  // Required, not optional
  bio?: string;
  socialLinks?: {
    website?: string;
    twitter?: string;
    github?: string;
    linkedin?: string;
    instagram?: string;
  };
  updatedAt?: Date;
  createdAt?: Date;
}

/**
 * Sign in with email and password
 */
export async function signIn(email: string, password: string): Promise<User> {
  try {
    const result = await signInWithEmailAndPassword(auth, email, password);
    
    // Store auth token in localStorage for API requests
    const token = await result.user.getIdToken();
    localStorage.setItem('authToken', token);
    
    return result.user;
  } catch (error) {
    console.error('Sign in failed:', error);
    throw error;
  }
}

/**
 * Create a new user account
 */
export async function signUp(
  email: string, 
  username: string, 
  password: string
): Promise<User> {
  try {
    // Check if username already exists
    const usernameExists = await checkUsernameExists(username);
    if (usernameExists) {
      throw new Error('Username already exists');
    }

    // Create the user account
    const result = await createUserWithEmailAndPassword(auth, email, password);
    
    // Create user document with username
    const userData: UserData = {
      username,
      email,
      displayName: null,
      photoURL: null,
      uid: result.user.uid,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    // Store in Firestore
    await setDoc(doc(db, 'Users', result.user.uid), userData);
    
    // Also store a username reference for uniqueness checking
    await setDoc(doc(db, 'usernames', username), {
      uid: result.user.uid
    });
    
    // Store auth token
    const token = await result.user.getIdToken();
    localStorage.setItem('authToken', token);
    
    return result.user;
  } catch (error) {
    console.error('Sign up failed:', error);
    throw error;
  }
}

/**
 * Sign out the current user
 */
export async function signOut(): Promise<void> {
  try {
    await firebaseSignOut(auth);
    localStorage.removeItem('authToken');
  } catch (error) {
    console.error('Sign out failed:', error);
    throw error;
  }
}

/**
 * Send a password reset email
 */
export async function resetPassword(email: string): Promise<void> {
  try {
    await sendPasswordResetEmail(auth, email);
  } catch (error) {
    console.error('Password reset failed:', error);
    throw error;
  }
}

/**
 * Get user data from Firestore
 */
export async function getUserData(userId: string): Promise<UserData | null> {
  try {
    const docRef = doc(db, 'Users', userId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      // Make sure uid is included in the data before passing to adaptUserData
      const userData = { ...docSnap.data(), uid: userId } as UserData;
      return adaptUserData(userData);
    }
    
    return null;
  } catch (error) {
    console.error('Error fetching user data:', error);
    return null;
  }
}

/**
 * Check if a username is already taken
 */
export async function checkUsernameExists(username: string): Promise<boolean> {
  try {
    const docRef = doc(db, 'usernames', username);
    const docSnap = await getDoc(docRef);
    return docSnap.exists();
  } catch (error) {
    console.error('Error checking username:', error);
    throw error;
  }
}

/**
 * Get the current authentication token
 */
export async function getAuthToken(forceRefresh = false): Promise<string | null> {
  try {
    const currentUser = auth.currentUser;
    if (!currentUser) return null;
    
    return await currentUser.getIdToken(forceRefresh);
  } catch (error) {
    console.error('Error getting auth token:', error);
    return null;
  }
}
