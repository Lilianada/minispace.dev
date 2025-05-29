/**
 * Auth Context
 * 
 * Provides a centralized authentication context for the application.
 * Combines Firebase Authentication with user profile data.
 */

'use client';

import React, { 
  createContext, 
  useContext, 
  useState, 
  useEffect, 
  ReactNode 
} from 'react';
import { User, onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/lib/firebase/config';
import { 
  UserData, 
  getUserData, 
  signIn, 
  signUp,
  signOut,
  resetPassword
} from '@/services/firebase/auth-service';
import LoadingScreen from '@/components/LoadingScreen';

// Define the type for our authentication context
export interface AuthContextType {
  user: User | null;
  userData: UserData | null;
  loading: boolean;
  error: Error | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  refreshUserData: () => Promise<void>;
}

// Create the authentication context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Context provider component
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [initialLoad, setInitialLoad] = useState(true);
  
  // Authentication state observer
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(
      auth,
      async (authUser) => {
        setLoading(true);
        try {
          if (authUser) {
            setUser(authUser);
            // Fetch additional user data from Firestore
            const data = await getUserData(authUser.uid);
            setUserData(data);
          } else {
            setUser(null);
            setUserData(null);
          }
          setError(null);
        } catch (err) {
          console.error('Auth state error:', err);
          setError(err instanceof Error ? err : new Error('Authentication error'));
        } finally {
          setLoading(false);
          setInitialLoad(false);
        }
      },
      (error) => {
        console.error('Auth observer error:', error);
        setError(error);
        setLoading(false);
        setInitialLoad(false);
      }
    );

    // Cleanup subscription
    return () => unsubscribe();
  }, []);

  // Login function
  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      setError(null);
      
      await signIn(email, password);
      
      // Auth state observer will handle setting the user
    } catch (err) {
      console.error('Login error:', err);
      setError(err instanceof Error ? err : new Error('Login failed'));
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Sign up function
  const signup = async (email: string, username: string, password: string) => {
    try {
      setLoading(true);
      setError(null);
      
      await signUp(email, username, password);
      
      // Auth state observer will handle setting the user
    } catch (err) {
      console.error('Signup error:', err);
      setError(err instanceof Error ? err : new Error('Signup failed'));
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const logout = async () => {
    try {
      setLoading(true);
      setError(null);
      
      await signOut();
      
      // Auth state observer will handle clearing the user
    } catch (err) {
      console.error('Logout error:', err);
      setError(err instanceof Error ? err : new Error('Logout failed'));
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Password reset function
  const resetPasswordHandler = async (email: string) => {
    try {
      setLoading(true);
      setError(null);
      
      await resetPassword(email);
    } catch (err) {
      console.error('Password reset error:', err);
      setError(err instanceof Error ? err : new Error('Password reset failed'));
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Refresh user data function
  const refreshUserData = async () => {
    try {
      if (!user) return;
      
      setLoading(true);
      const data = await getUserData(user.uid);
      setUserData(data);
    } catch (err) {
      console.error('Error refreshing user data:', err);
      setError(err instanceof Error ? err : new Error('Failed to refresh user data'));
    } finally {
      setLoading(false);
    }
  };

  // Show loading screen only on initial load
  if (initialLoad) {
    return <LoadingScreen />;
  }

  return (
    <AuthContext.Provider 
      value={{
        user,
        userData,
        loading,
        error,
        login,
        signup,
        logout,
        resetPassword: resetPasswordHandler,
        refreshUserData
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook for using the auth context
export function useAuth() {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
}
