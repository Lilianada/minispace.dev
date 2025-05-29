/**
 * API Service
 * 
 * Standardized API client for making requests to the application's API routes.
 * Handles authentication, error handling, and response parsing consistently.
 */

// Define types
type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

interface RequestOptions {
  method?: HttpMethod;
  headers?: Record<string, string>;
  body?: any;
  requireAuth?: boolean;
}

interface ApiResponse<T = any> {
  data: T | null;
  error: string | null;
  status: number;
}

/**
 * Make an API request with standardized error handling and authentication
 */
export async function apiRequest<T = any>(
  endpoint: string, 
  options: RequestOptions = {}
): Promise<ApiResponse<T>> {
  try {
    // Default options
    const {
      method = 'GET',
      headers = {},
      body,
      requireAuth = true
    } = options;

    // Prepare headers
    const requestHeaders: Record<string, string> = {
      'Content-Type': 'application/json',
      ...headers
    };

    // Add auth token if required and available
    if (requireAuth) {
      const authToken = localStorage.getItem('authToken');
      if (authToken) {
        requestHeaders.Authorization = `Bearer ${authToken}`;
      }
    }

    // Prepare request options
    const requestOptions: RequestInit = {
      method,
      headers: requestHeaders,
      credentials: 'include', // Include cookies
    };

    // Add body for non-GET requests
    if (body && method !== 'GET') {
      requestOptions.body = JSON.stringify(body);
    }

    // Make the request
    const fullUrl = endpoint.startsWith('/') 
      ? `${process.env.NEXT_PUBLIC_URL || ''}${endpoint}`
      : endpoint;
      
    const response = await fetch(fullUrl, requestOptions);
    
    // Parse the response data
    let data = null;
    try {
      // Not all responses will have JSON bodies
      if (response.headers.get('Content-Type')?.includes('application/json')) {
        data = await response.json();
      }
    } catch (e) {
      console.warn('Error parsing response JSON:', e);
    }

    // Handle error responses
    if (!response.ok) {
      const errorMessage = data?.error || data?.message || response.statusText || 'An error occurred';
      
      return {
        data: null,
        error: errorMessage,
        status: response.status
      };
    }

    // Return successful response
    return {
      data,
      error: null,
      status: response.status
    };
  } catch (error) {
    console.error('API request failed:', error);
    
    return {
      data: null,
      error: error instanceof Error ? error.message : 'Network error',
      status: 0 // 0 indicates network error/no response
    };
  }
}
