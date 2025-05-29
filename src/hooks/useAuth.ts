'use client';

import { useAuth as useAuthContext } from '@/contexts/AuthContext';

/**
 * Custom hook to access auth context
 * 
 * This is a simple wrapper around the useAuth hook from AuthContext
 * that makes it easy to import from one location
 */
export default function useAuth() {
  return useAuthContext();

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