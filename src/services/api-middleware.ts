/**
 * API Middleware Service
 * 
 * Provides utilities for Next.js API routes including:
 * - Response formatting
 * - Authentication middleware
 * - Error handling
 * - Request validation
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/firebase/config';
import { DecodedIdToken } from 'firebase-admin/auth';
import { getFirebaseAdmin } from '@/services/firebase/admin-service';

// Standard response types
interface ApiSuccessResponse<T = any> {
  data: T;
  status: number;
  message?: string;
}

interface ApiErrorResponse {
  error: string;
  status: number;
  details?: any;
}

/**
 * Create a standardized success response
 */
export function successResponse<T = any>(
  data: T, 
  status: number = 200, 
  message?: string
): NextResponse {
  const response: ApiSuccessResponse<T> = {
    data,
    status,
    ...(message && { message })
  };
  
  return NextResponse.json(response, { status });
}

/**
 * Create a standardized error response
 */
export function errorResponse(
  error: string, 
  status: number = 500, 
  details?: any
): NextResponse {
  const response: ApiErrorResponse = {
    error,
    status,
    ...(details && { details })
  };
  
  return NextResponse.json(response, { status });
}

/**
 * Higher-order function to add authentication middleware to route handlers
 */
export function withAuth<T = any>(
  request: NextRequest,
  handler: (userId: string, decodedToken?: DecodedIdToken) => Promise<NextResponse<T>>
): Promise<NextResponse> {
  return new Promise(async (resolve) => {
    try {
      // Extract token from Authorization header
      const authHeader = request.headers.get('Authorization');
      
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return resolve(errorResponse('Unauthorized: Missing or invalid token format', 401));
      }
      
      const token = authHeader.split('Bearer ')[1];
      
      if (!token) {
        return resolve(errorResponse('Unauthorized: Token is required', 401));
      }
      
      try {
        // Verify the token
        const adminAuth = getFirebaseAdmin().auth();
        const decodedToken = await adminAuth.verifyIdToken(token);
        
        if (!decodedToken.uid) {
          return resolve(errorResponse('Unauthorized: Invalid token', 401));
        }
        
        // Call the handler with the user ID and decoded token
        const response = await handler(decodedToken.uid, decodedToken);
        return resolve(response);
      } catch (verifyError) {
        console.error('Token verification error:', verifyError);
        return resolve(errorResponse('Unauthorized: Invalid token', 401));
      }
    } catch (error) {
      console.error('Auth middleware error:', error);
      return resolve(errorResponse('Internal server error during authentication', 500));
    }
  });
}

/**
 * Higher-order function to add error handling to route handlers
 */
export function withErrorHandler(
  handler: (request: NextRequest) => Promise<NextResponse>
) {
  return async (request: NextRequest): Promise<NextResponse> => {
    try {
      return await handler(request);
    } catch (error) {
      console.error('API route error:', error);
      
      // Determine if error has a message property
      const errorMessage = error instanceof Error 
        ? error.message 
        : 'An unexpected error occurred';
      
      return errorResponse(errorMessage, 500);
    }
  };
}

/**
 * Type-checking validation result
 */
export interface ValidationResult<T> {
  valid: boolean;
  data?: T;
  error?: string;
}

/**
 * Type validator function type
 */
export type TypeValidator<T> = (data: any) => data is T;

/**
 * Validate that request body matches expected schema using a type validator function
 */
export function validateRequestBody<T>(
  data: any, 
  validator: TypeValidator<T>
): ValidationResult<T> {
  // Check if data exists
  if (data === null || data === undefined) {
    return { valid: false, error: 'Request data is required' };
  }
  
  // Run the type validator
  if (!validator(data)) {
    return { valid: false, error: 'Invalid request data format' };
  }
  
  // Data is valid and typed correctly
  return { valid: true, data };
}

/**
 * Create a middleware that validates the request body
 */
export function withValidation<T>(
  validator: TypeValidator<T>,
  handler: (data: T) => Promise<NextResponse>
) {
  return async (body: any): Promise<NextResponse> => {
    const validation = validateRequestBody<T>(body, validator);
    
    if (!validation.valid || !validation.data) {
      return errorResponse(validation.error || 'Invalid request data', 400);
    }
    
    return handler(validation.data);
  };
}
