import { 
  getAuth, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut,
  signInWithPopup,
  GoogleAuthProvider,
  sendPasswordResetEmail,
  updateProfile,
  User,
  getIdToken,
} from 'firebase/auth';
import { app } from './firebase/config';
import { 
  getFirestore, 
  doc, 
  setDoc, 
  getDoc, 
  updateDoc, 
  serverTimestamp 
} from 'firebase/firestore';

// Initialize Firebase Authentication
export const auth = getAuth(app);
export const db = getFirestore(app);

// Export authOptions for Next-Auth
export { authOptions } from './auth-options';

// Create a Google provider
const googleProvider = new GoogleAuthProvider();

// User type
export interface UserData {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  createdAt?: string;
  updatedAt?: string;
}

/**
 * Sign in with email and password
 */
export const signIn = async (email: string, password: string) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    await updateUserLastLogin(userCredential.user.uid);
    return userCredential.user;
  } catch (error) {
    console.error('Error signing in:', error);
    throw error;
  }
};

/**
 * Sign up with email and password
 */
export const signUp = async (email: string, password: string, displayName?: string) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    
    // Update profile if display name is provided
    if (displayName) {
      await updateProfile(userCredential.user, { displayName });
    }
    
    // Create user document in Firestore
    await createUserDocument(userCredential.user);
    
    return userCredential.user;
  } catch (error) {
    console.error('Error signing up:', error);
    throw error;
  }
};

/**
 * Sign in with Google
 */
export const signInWithGoogle = async () => {
  try {
    const userCredential = await signInWithPopup(auth, googleProvider);
    
    // Check if user exists in Firestore, create if not
    const userDoc = await getDoc(doc(db, 'users', userCredential.user.uid));
    if (!userDoc.exists()) {
      await createUserDocument(userCredential.user);
    } else {
      await updateUserLastLogin(userCredential.user.uid);
    }
    
    return userCredential.user;
  } catch (error) {
    console.error('Error signing in with Google:', error);
    throw error;
  }
};

/**
 * Sign out
 */
export const logOut = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error('Error signing out:', error);
    throw error;
  }
};

/**
 * Send password reset email
 */
export const resetPassword = async (email: string) => {
  try {
    await sendPasswordResetEmail(auth, email);
  } catch (error) {
    console.error('Error sending password reset email:', error);
    throw error;
  }
};

/**
 * Create user document in Firestore
 */
export const createUserDocument = async (user: User) => {
  if (!user.uid) return;
  
  const userRef = doc(db, 'users', user.uid);
  const userData = {
    uid: user.uid,
    email: user.email,
    displayName: user.displayName || user.email?.split('@')[0],
    photoURL: user.photoURL,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
    lastLogin: serverTimestamp(),
  };
  
  try {
    await setDoc(userRef, userData);
  } catch (error) {
    console.error('Error creating user document:', error);
    throw error;
  }
};

/**
 * Update user's last login timestamp
 */
export const updateUserLastLogin = async (uid: string) => {
  try {
    const userRef = doc(db, 'users', uid);
    await updateDoc(userRef, {
      lastLogin: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    console.error('Error updating user last login:', error);
  }
};

/**
 * Get user data from Firestore
 */
export const getUserData = async (uid: string): Promise<UserData | null> => {
  try {
    const userRef = doc(db, 'users', uid);
    const userDoc = await getDoc(userRef);
    
    if (userDoc.exists()) {
      return userDoc.data() as UserData;
    }
    
    return null;
  } catch (error) {
    console.error('Error fetching user data:', error);
    return null;
  }
};

/**
 * Get ID token for server-side authentication
 */
export const getAuthToken = async (user: User | null): Promise<string | null> => {
  if (!user) return null;
  
  try {
    return await getIdToken(user);
  } catch (error) {
    console.error('Error getting auth token:', error);
    return null;
  }
};