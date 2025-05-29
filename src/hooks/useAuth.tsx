'use client';

import { useAuth as useAuthContext, AuthContextType } from '../contexts/AuthContext';

/**
 * Custom hook to access auth context
 * 
 * This is a simple wrapper around the useAuth hook from AuthContext
 * that makes it easy to import from one location
 * 
 * @returns The authentication context with user data, authentication state and methods
 */
export default function useAuth(): AuthContextType {
  return useAuthContext() as AuthContextType;
}