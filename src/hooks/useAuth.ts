'use client';

import { useState, useEffect } from 'react';
import { User, onAuthStateChanged } from 'firebase/auth';
import { auth, getUserData } from '@/lib/auth';
import { UserData } from '@/lib/auth-context';
import { adaptUserData } from '@/lib/type-adapters';

interface UseAuthReturn {
  user: User | null;
  userData: UserData | null;
  loading: boolean;
  error: Error | null;
}

export default function useAuth(): UseAuthReturn {
  const [user, setUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(
      auth,
      async (authUser) => {
        setLoading(true);
        try {
          if (authUser) {
            // Get fresh token and store it
            const token = await authUser.getIdToken(true); // Force refresh
            localStorage.setItem('authToken', token);
            console.log('Auth token refreshed in localStorage', { tokenLength: token.length });
            
            setUser(authUser);
            // Fetch additional user data from Firestore
            const data = await getUserData(authUser.uid);
            // Use the adapter to ensure consistent types
            setUserData(adaptUserData(data));
          } else {
            setUser(null);
            setUserData(null);
            // Clear token on signout
            localStorage.removeItem('authToken');
            console.log('Auth token removed (user signed out)');
          }
          setError(null);
        } catch (err) {
          console.error('Auth state error:', err);
          setError(err instanceof Error ? err : new Error('Authentication error'));
        } finally {
          setLoading(false);
        }
      },
      (error) => {
        console.error('Auth observer error:', error);
        setError(error);
        setLoading(false);
      }
    );

    // Cleanup subscription
    return () => unsubscribe();
  }, []);

  return { user, userData, loading, error };
}