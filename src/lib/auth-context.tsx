"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { 
  User, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut,
  onAuthStateChanged,
  sendPasswordResetEmail
} from 'firebase/auth';
import { auth, db } from './firebase/config';
import { doc, getDoc, setDoc, collection, query, where, getDocs } from 'firebase/firestore';
import LoadingScreen from '@/components/LoadingScreen';


export interface UserData {
  username: string;
  email: string;
  displayName?: string | null;
  photoURL?: string | null;
  uid?: string;
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


// Define the type for our authentication context
type AuthContextType = {
  user: User | null;
  userData: UserData | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  refreshUserData: () => Promise<void>;
};

// Create the authentication context
// Export it so it can be imported elsewhere if needed
export const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Check if a username is valid (3-20 alphanumeric characters and underscores)
const isUsernameValid = (username: string): boolean => {
  const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
  return usernameRegex.test(username);
};

// Check if a username is unique
const isUsernameUnique = async (username: string): Promise<boolean> => {
  const usersRef = collection(db, "Users");
  const q = query(usersRef, where("username", "==", username.toLowerCase()));
  const querySnapshot = await getDocs(q);
  return querySnapshot.empty;
};

// AuthProvider component
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  // Check if user is authenticated on mount
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      
      if (user) {
        // Get a fresh ID token and store it for API calls
        try {
          const token = await user.getIdToken(true);  // Force refresh the token
          
          // Store the token in a secure cookie instead of localStorage
          // Include SameSite and secure flags for better security
          document.cookie = `authToken=${token}; path=/; max-age=3600; SameSite=Strict`;
          localStorage.setItem('authTokenTimestamp', Date.now().toString());
          console.log('Auth token refreshed and saved to cookie');
          
          // Fetch user data from Firestore
          const userDoc = await getDoc(doc(db, "Users", user.uid));
          if (userDoc.exists()) {
            const userData = userDoc.data() as UserData;
            setUserData(userData);
            
            // Store username in localStorage and cookie for route access
            localStorage.setItem('username', userData.username);
            document.cookie = `username=${userData.username}; path=/; max-age=3600; SameSite=Strict`;
          }
        } catch (error) {
          console.error("Error fetching user data or token:", error);
        }
      } else {
        setUserData(null);
        // Clear auth token when not logged in
        document.cookie = 'authToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
        localStorage.removeItem('authTokenTimestamp');
        localStorage.removeItem('username');
      }
      
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Add effect to refresh token periodically
  useEffect(() => {
    if (!user) return; // No user to refresh token for
    
    // Token refresh interval (40 minutes - before the 60 minute expiration)
    const REFRESH_INTERVAL = 40 * 60 * 1000;
    
    // Function to refresh token
    const refreshToken = async () => {
      try {
        console.log('Refreshing auth token...');
        const token = await user.getIdToken(true); // Force refresh
        document.cookie = `authToken=${token}; path=/; max-age=3600; SameSite=Strict`;
        localStorage.setItem('authTokenTimestamp', Date.now().toString());
        console.log('Auth token refreshed successfully');
      } catch (error) {
        console.error('Failed to refresh token:', error);
      }
    };
    
    // Set up interval to refresh token
    const intervalId = setInterval(refreshToken, REFRESH_INTERVAL);
    
    // Clear interval on unmount
    return () => clearInterval(intervalId);
  }, [user]); // Depend on user object to restart when user changes

  // Login function
  const login = async (email: string, password: string) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      
      // Get and store the token for API requests in a secure cookie instead of localStorage
      const token = await userCredential.user.getIdToken();
      document.cookie = `authToken=${token}; path=/; max-age=3600; SameSite=Strict`;
      localStorage.setItem('authTokenTimestamp', Date.now().toString());
      console.log('Auth token saved to cookie', { tokenLength: token.length });
      
      // Get username for the route
      const userDoc = await getDoc(doc(db, "Users", userCredential.user.uid));
      if (userDoc.exists()) {
        const userData = userDoc.data() as UserData;
        localStorage.setItem('username', userData.username);
      }
      
    } catch (error) {
      const typedError = error as { code?: string; message: string };
      let errorMessage = "Failed to sign in";

      switch(typedError.code) {
        case 'auth/user-not-found':
          errorMessage = "No account found with this email";
          break;
        case 'auth/wrong-password':
          errorMessage = "Incorrect password";
          break;
        case 'auth/invalid-credential':
          errorMessage = "Invalid email or password";
          break;
        case 'auth/too-many-requests':
          errorMessage = "Too many attempts. Please try again later";
          break;
        default:
          errorMessage = typedError.message || errorMessage;
      }

      throw new Error(errorMessage);
    }
  };

  // Signup function
  const signup = async (email: string, username: string, password: string) => {
    // Validate username format
    if (!isUsernameValid(username)) {
      throw new Error("Username must be 3-20 characters long and contain only letters, numbers, and underscores");
    }
    
    // Check if username is unique
    try {
      const isUnique = await isUsernameUnique(username);
      if (!isUnique) {
        throw new Error("Username is already taken");
      }

      // Create user in Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      // Get and store the token for API requests in a secure cookie
      const token = await user.getIdToken();
      document.cookie = `authToken=${token}; path=/; max-age=3600; SameSite=Strict`;
      localStorage.setItem('authTokenTimestamp', Date.now().toString());
      localStorage.setItem('username', username.toLowerCase());
      console.log('Auth token saved to cookie for new user');
      
      // Create user document in Firestore with minimal required fields
      await setDoc(doc(db, "Users", user.uid), {
        username: username.toLowerCase(),
        displayName: username,
        email: email.toLowerCase(),
        createdAt: new Date(),
        updatedAt: new Date(),
        photoURL: null,
        storageUsed: 0, // Track storage usage (starts at 0)
        storageLimit: 104857600, // 100MB in bytes as default limit
        // Default theme selection
        theme: 'light'
      });
      
    } catch (error) {
      const typedError = error as { code?: string; message: string };
      let errorMessage = "Failed to create account";
      
      switch(typedError.code) {
        case 'auth/email-already-in-use':
          errorMessage = "Email is already in use";
          break;
        case 'auth/invalid-email':
          errorMessage = "Invalid email address";
          break;
        case 'auth/weak-password':
          errorMessage = "Password is too weak";
          break;
        default:
          errorMessage = typedError.message || errorMessage;
      }
      
      throw new Error(errorMessage);
    }
  };

  // Logout function
  const logout = async () => {
    try {
      await signOut(auth);
      // Clear all auth-related data from localStorage and cookies on logout
      document.cookie = 'authToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
      document.cookie = 'username=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
      localStorage.removeItem('authTokenTimestamp');
      localStorage.removeItem('username');
      console.log('Auth data removed from localStorage and cookies');
      
      // Redirect to discover page after logout
      window.location.href = '/discover';
    } catch (error) {
      const typedError = error as { message: string };
      throw new Error(typedError.message || "Failed to log out");
    }
  };

  // Reset password function
  const resetPassword = async (email: string) => {
    try {
      await sendPasswordResetEmail(auth, email);
    } catch (error) {
      const typedError = error as { code?: string; message: string };
      let errorMessage = "Failed to send password reset email";
      
      switch(typedError.code) {
        case 'auth/user-not-found':
          errorMessage = "No account found with this email";
          break;
        case 'auth/invalid-email':
          errorMessage = "Invalid email address";
          break;
        default:
          errorMessage = typedError.message || errorMessage;
      }
      
      throw new Error(errorMessage);
    }
  };

  // Refresh user data function
  const refreshUserData = async () => {
    try {
      if (!user) return;
      
      // Fetch the latest user data from Firestore
      const userDocRef = doc(db, 'Users', user.uid);
      const userDoc = await getDoc(userDocRef);
      
      if (userDoc.exists()) {
        setUserData(userDoc.data() as UserData);
      }
    } catch (error) {
      console.error('Error refreshing user data:', error);
    }
  };

  // Create value object for context
  const contextValue: AuthContextType = {
    user,
    userData,
    loading,
    login,
    signup,
    logout,
    resetPassword,
    refreshUserData
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {loading ? (
        <LoadingScreen />
      ) : (
        children
      )}
    </AuthContext.Provider>
  );
}

// Custom hook to use the auth context
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
