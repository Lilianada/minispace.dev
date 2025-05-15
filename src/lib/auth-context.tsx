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
import { auth, db } from './firebase';
import { doc, getDoc, setDoc, collection, query, where, getDocs } from 'firebase/firestore';
import LoadingScreen from '@/components/LoadingScreen';


interface UserData {
  username: string
  email: string
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
        // Fetch user data from Firestore
        try {
          const userDoc = await getDoc(doc(db, "Users", user.uid));
          if (userDoc.exists()) {
            setUserData(userDoc.data() as UserData);
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      } else {
        setUserData(null);
      }
      
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Login function
  const login = async (email: string, password: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
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
      
      // Create user document in Firestore
      await setDoc(doc(db, "Users", user.uid), {
        username: username.toLowerCase(),
        displayName: username,
        email: email.toLowerCase(),
        createdAt: new Date(),
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

  // Create value object for context
  const contextValue: AuthContextType = {
    user,
    userData,
    loading,
    login,
    signup,
    logout,
    resetPassword
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
