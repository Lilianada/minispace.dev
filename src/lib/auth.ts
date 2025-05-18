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
  username: string; // Added username property to align with auth-context.tsx
  uid: string;
  email: string; // Changed from string | null to string to match auth-context.tsx
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
  
  const userRef = doc(db, 'Users', user.uid); // Changed from 'users' to 'Users' to match the collection name used in auth-context.tsx
  const userData = {
    uid: user.uid,
    email: user.email || `${user.uid}@example.com`, // Ensure email is never null
    // Generate a username from email or display name if not available
    username: (user.email ? user.email.split('@')[0] : `user_${user.uid.substring(0, 8)}`),
    displayName: user.displayName || (user.email ? user.email.split('@')[0] : null),
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
    
    // Check if the document exists first
    const docSnap = await getDoc(userRef);
    
    if (docSnap.exists()) {
      // Document exists, update it
      await updateDoc(userRef, {
        lastLogin: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
    } else {
      // Document doesn't exist, create it
      await setDoc(userRef, {
        lastLogin: serverTimestamp(),
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      console.log(`Created new user document for uid: ${uid}`);
    }
  } catch (error) {
    console.error('Error updating user last login:', error);
  }
};

/**
 * Get user data from Firestore
 */
export const getUserData = async (uid: string): Promise<any> => {
  try {
    const userRef = doc(db, 'Users', uid); // Changed from 'users' to 'Users' to match the collection name used in auth-context.tsx
    const userDoc = await getDoc(userRef);
    
    if (userDoc.exists()) {
      const data = userDoc.data();
      // Transform data to match the UserData interface from auth-context
      // Ensure email is never null to match the auth-context.tsx UserData type
      return {
        ...data,
        email: data.email || `${uid}@example.com`,
        // Convert Firestore timestamps to Date objects if needed
        updatedAt: data.updatedAt?.toDate ? data.updatedAt.toDate() : data.updatedAt,
        createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : data.createdAt,
      };
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