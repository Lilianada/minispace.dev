/**
 * Utility functions to adapt between different types in the application
 */
import { UserData as AuthUserData } from '@/lib/auth';
import { UserData as AuthContextUserData } from '@/lib/auth-context';

// Define the social links type based on the auth-context UserData interface
type SocialLinks = {
  website?: string;
  twitter?: string;
  github?: string;
  linkedin?: string;
  instagram?: string;
  [key: string]: string | undefined;
};

/**
 * Converts UserData from auth.ts to UserData from auth-context.tsx
 * This helps resolve type compatibility issues between the two interfaces
 */
export const adaptUserData = (data: AuthUserData | null): AuthContextUserData | null => {
  if (!data) return null;
  
  // Create default social links object
  const socialLinks: SocialLinks = {
    website: '',
    twitter: '',
    github: '',
    linkedin: '',
    instagram: ''
  };
  
  return {
    username: data.username,
    email: data.email || '', // Convert string | null to string
    displayName: data.displayName,
    photoURL: data.photoURL,
    uid: data.uid,
    bio: '', // Default empty bio since it doesn't exist in auth.ts UserData
    socialLinks, // Default empty social links
    // Convert string timestamps to Date objects
    updatedAt: data.updatedAt ? new Date(data.updatedAt) : new Date(),
    createdAt: data.createdAt ? new Date(data.createdAt) : new Date()
  };
};

/**
 * Type guard to check if an object conforms to the AuthContextUserData interface
 */
export const isAuthContextUserData = (data: any): data is AuthContextUserData => {
  return data && 
         typeof data.username === 'string' && 
         typeof data.email === 'string';
};

/**
 * Type guard to check if an object conforms to the AuthUserData interface
 */
export const isAuthUserData = (data: any): data is AuthUserData => {
  return data && 
         typeof data.username === 'string' && 
         typeof data.email === 'string' && 
         typeof data.uid === 'string';
};
