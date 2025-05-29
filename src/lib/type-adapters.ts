/**
 * Utility functions to adapt between different types in the application
 */
import { UserData as FirebaseUserData } from '@/services/firebase/auth-service';

// Define the social links type for clarity
type SocialLinks = {
  website?: string;
  twitter?: string;
  github?: string;
  linkedin?: string;
  instagram?: string;
  [key: string]: string | undefined;
};

/**
 * Converts UserData from Firestore to the standardized UserData type
 * This helps resolve type compatibility issues between different data sources
 */
export const adaptUserData = (data: any | null): FirebaseUserData | null => {
  if (!data) return null;
  
  // Create default social links object if not present
  const socialLinks: SocialLinks = data.socialLinks || {
    website: '',
    twitter: '',
    github: '',
    linkedin: '',
    instagram: ''
  };
  
  return {
    username: data.username,
    email: data.email || '', // Convert nullish email to empty string
    displayName: data.displayName,
    photoURL: data.photoURL,
    uid: data.uid, // Required field
    bio: data.bio || '', // Default empty bio if not present
    socialLinks, 
    // Convert string timestamps to Date objects if needed
    updatedAt: data.updatedAt ? (data.updatedAt instanceof Date ? data.updatedAt : new Date(data.updatedAt)) : new Date(),
    createdAt: data.createdAt ? (data.createdAt instanceof Date ? data.createdAt : new Date(data.createdAt)) : new Date()
  };
};

/**
 * Type guard to check if an object conforms to the FirebaseUserData interface
 */
export const isUserData = (data: any): data is FirebaseUserData => {
  return data &&
    typeof data.username === 'string' &&
    typeof data.email === 'string' &&
    typeof data.uid === 'string'; // Check required fields
};

/**
 * Type guard to check if an object conforms to the UserData interface from auth context
 * This is an alias for isUserData for backward compatibility
 */
export const isAuthContextUserData = (data: any): data is FirebaseUserData => {
  return isUserData(data);
};
