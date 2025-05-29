/**
 * User Profile API Route
 * 
 * Handles CRUD operations for user profiles via a REST API.
 */
import { NextRequest, NextResponse } from 'next/server';
import { 
  withAuth, 
  withErrorHandler, 
  successResponse, 
  errorResponse,
  withValidation,
  TypeValidator
} from '@/services/api-middleware';
import { getDocument, updateDocument, FirestoreDocument } from '@/services/firebase/firestore-service';
import { UserData } from '@/services/firebase/auth-service';

/**
 * GET handler - Get user profile
 */
async function handleGet(userId: string): Promise<NextResponse> {
  const userProfile = await getDocument<UserData>('Users', userId);
  
  if (!userProfile) {
    return errorResponse('User profile not found', 404);
  }
  
  // Create a safe profile object without sensitive information
  const { 
    email, // Remove email as it's sensitive
    ...safeProfile 
  } = userProfile;
  
  return successResponse(safeProfile);
}

/**
 * User profile update request type with partial fields
 */
interface ProfileUpdateRequest {
  displayName?: string;
  photoURL?: string;
  bio?: string;
  socialLinks?: {
    website?: string;
    twitter?: string;
    github?: string;
    linkedin?: string;
    instagram?: string;
    [key: string]: string | undefined;
  };
  [key: string]: any; // Allow other fields for validation removal
}

/**
 * PATCH handler - Update user profile
 */
async function handlePatch(userId: string, data: ProfileUpdateRequest): Promise<NextResponse> {
  // Validate request data
  if (!data) {
    return errorResponse('Invalid request data', 400);
  }
  
  // Prevent updating sensitive/protected fields
  const { 
    email, 
    uid, 
    username, 
    createdAt,
    ...allowedUpdates 
  } = data;
  
  // Add updatedAt timestamp
  const updates = {
    ...allowedUpdates,
    updatedAt: new Date()
  };
  
  // Update user profile
  await updateDocument<Partial<UserData>>('Users', userId, updates);
  
  // Get updated profile
  const updatedProfile = await getDocument<UserData>('Users', userId);
  
  if (!updatedProfile) {
    return errorResponse('Failed to retrieve updated profile', 500);
  }
  
  // Remove sensitive information before returning
  const { 
    email: userEmail, 
    ...safeProfile 
  } = updatedProfile;
  
  return successResponse(safeProfile, 200, 'Profile updated successfully');
}

/**
 * Type validator for profile update requests
 */
const isValidProfileUpdate: TypeValidator<ProfileUpdateRequest> = (data: any): data is ProfileUpdateRequest => {
  // Basic validation
  if (!data || typeof data !== 'object') {
    return false;
  }
  
  // Check required fields have correct types if present
  if (
    (data.displayName !== undefined && typeof data.displayName !== 'string') ||
    (data.photoURL !== undefined && typeof data.photoURL !== 'string') ||
    (data.bio !== undefined && typeof data.bio !== 'string')
  ) {
    return false;
  }
  
  // Validate socialLinks if present
  if (data.socialLinks !== undefined) {
    if (typeof data.socialLinks !== 'object') {
      return false;
    }
    
    // Check all social links are strings
    const socialLinks = data.socialLinks as Record<string, unknown>;
    for (const [key, value] of Object.entries(socialLinks)) {
      if (value !== undefined && typeof value !== 'string') {
        return false;
      }
    }
  }
  
  return true;
};

/**
 * Main route handler
 */
async function handler(request: NextRequest): Promise<NextResponse> {
  // Handle based on HTTP method
  if (request.method === 'GET') {
    return withAuth(request, (userId) => handleGet(userId));
  } 
  
  if (request.method === 'PATCH') {
    try {
      const data = await request.json();
      
      // Validate the request data
      if (!isValidProfileUpdate(data)) {
        return errorResponse('Invalid profile data format', 400);
      }
      
      // Process with authentication
      return withAuth(request, (userId) => handlePatch(userId, data));
    } catch (error) {
      return errorResponse('Invalid JSON payload', 400);
    }
  }
  
  // Method not allowed
  return errorResponse(`Method ${request.method} not allowed`, 405);
}

// Export the handler with error handling wrapper
export const GET = withErrorHandler(handler);
export const PATCH = withErrorHandler(handler);
