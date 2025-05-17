/* eslint-disable @typescript-eslint/no-explicit-any */
// This module provides API functions for managing posts
import { authFetch } from '../api-utils';

// Define a common interface for posts
export interface PostData {
  title: string;
  content: string;
  slug?: string;
  excerpt?: string;
  tags?: string[];
  status?: 'published' | 'draft';
}

// Type definitions
export interface Post {
  id: string;
  title: string;
  content: string;
  slug: string;
  excerpt?: string;
  tags?: string[];
  status: 'published' | 'draft';
  createdAt: string;
  updatedAt: string;
  views: number;
  comments?: number;
  likes?: number;
  shares?: number;
}

/**
 * Check if a token is expired or nearly expired
 * Firebase tokens are typically valid for 1 hour
 */
function isTokenExpired(): boolean {
  // Get the token expiration time from localStorage
  const tokenTimestamp = localStorage.getItem('authTokenTimestamp');
  
  if (!tokenTimestamp) {
    console.warn('No token timestamp found, treating as expired');
    return true;
  }
  
  const timestamp = parseInt(tokenTimestamp, 10);
  const now = Date.now();
  const tokenAge = now - timestamp;
  
  // Consider token expired if it's older than 50 minutes (to give buffer time)
  const isExpired = tokenAge > (50 * 60 * 1000);
  
  if (isExpired) {
    console.warn(`Token may be expired (age: ${Math.round(tokenAge/60000)} minutes)`);
  }
  
  return isExpired;
}

/**
 * Helper function to get the auth token
 */
function getAuthToken(): string {
  // Client-side only
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('authToken') || '';
    console.log('Auth token found:', token ? `Yes (length: ${token.length})` : 'No');
    
    if (!token) {
      // For development debugging only - check all localStorage items
      console.log('All localStorage keys:', Object.keys(localStorage));
      console.warn('No auth token found in localStorage!');
      
      // Check if token is stored under a different name (debugging only)
      Object.keys(localStorage).forEach(key => {
        const value = localStorage.getItem(key);
        if (value && value.length > 20) {
          console.log(`Possible token found in key "${key}" (length: ${value.length})`);
        }
      });
    } else {
      // Show the first and last 5 characters of the token (for debugging)
      const tokenStart = token.substring(0, 5);
      const tokenEnd = token.substring(token.length - 5);
      console.log(`Token snippet: ${tokenStart}...${tokenEnd}`);
    }
    
    return token;
  }
  console.log('Running in server context, no auth token available');
  return '';
}

/**
 * Helper function to get common headers with auth
 * @deprecated Use authFetch from api-utils.ts instead
 */
function getAuthHeaders(): HeadersInit {
  const getCookie = (name: string): string | undefined => {
    if (typeof document === 'undefined') return undefined;
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) {
      return parts.pop()?.split(';').shift();
    }
    return undefined;
  };
  
  // First try to get token from cookie
  let token = getCookie('authToken');
  
  // Fall back to localStorage for backward compatibility
  if (!token) {
    token = localStorage.getItem('authToken') || null;
  }
  
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
    console.log('Added Authorization header for request');
  } else {
    console.warn('No auth token available for API request - expect 401 error');
  }
  
  return headers;
}

/**
 * Create a new post
 */
export async function createPost(data: PostData): Promise<any> {
  try {
    const response = await authFetch('/api/posts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...data,
        status: data.status || 'draft',
      }),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to create post');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error creating post:', error);
    throw error;
  }
}

/**
 * API functions for post management
 */

export interface PostFilters {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  sort?: string;
}

/**
 * Get posts with filters and pagination
 */
export async function getPosts(filters: PostFilters = {}): Promise<{
  posts: Post[];
  total: number;
  totalPages: number;
  currentPage: number;
  error?: string;
  status?: string;
}> {
  const {
    page = 1,
    limit = 10,
    search = '',
    status = 'all',
    sort = 'newest'
  } = filters;
  
  try {
    // Check if user is logged in (either with cookie or localStorage)
    if (typeof window !== 'undefined') {
      const getCookie = (name: string): string | undefined => {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) {
          return parts.pop()?.split(';').shift();
        }
        return undefined;
      };
      
      const authCookie = getCookie('authToken');
      const localToken = localStorage.getItem('authToken');
      
      if (!authCookie && !localToken) {
        console.error('User not logged in - no auth token available');
        throw new Error('Authentication required - please log in');
      }
    }
    
    const queryParams = new URLSearchParams();
    queryParams.set('page', page.toString());
    queryParams.set('limit', limit.toString());
    
    if (search) {
      queryParams.set('search', search);
    }
    
    if (status && status !== 'all') {
      queryParams.set('status', status);
    }
    
    if (sort && sort !== 'newest') {
      queryParams.set('sort', sort);
    }
    
    console.log(`Fetching posts with params: ${queryParams.toString()}`);
    
    // Use our authenticated fetch utility
    const response = await authFetch(`/api/posts?${queryParams.toString()}`, {
      method: 'GET',
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('Posts API response error:', response.status);
      
      // Handle common HTTP error codes with user-friendly messages
      if (response.status === 401) {
        throw new Error('Authentication required - please sign in again');
      } else if (response.status === 403) {
        throw new Error('You do not have permission to access this resource');
      } else {
        throw new Error(errorData.message || `Failed to load posts (${response.status})`);
      }
    }
    
    const result = await response.json();
    console.log(`Fetched ${result.posts?.length || 0} posts (total: ${result.total || 0})`);
    
    return {
      posts: result.posts || [],
      total: result.total || 0,
      totalPages: result.totalPages || 1,
      currentPage: result.currentPage || page
    };
  } catch (error) {
    console.error('Error fetching posts:', error);
    
    // Instead of throwing errors, return empty data with a status message
    return {
      posts: [],
      total: 0,
      totalPages: 1,
      currentPage: 1,
      error: error instanceof Error ? error.message : 'Unknown error occurred while fetching posts',
      status: 'error'
    };
  }
}

/**
 * Get a single post by ID
 * @param id The ID of the post to retrieve
 * @returns Promise resolving to the post
 */
export async function getPostById(id: string) {
  try {
    // Validate input
    if (!id) {
      throw new Error('Post ID is required');
    }
    
    // Make API request with correct URL path (/api/posts/[id])
    const response = await authFetch(`/api/posts/${id}`, {
      method: 'GET',
      // Add cache: 'no-store' for server components to ensure fresh data
      cache: 'no-store'
    });
    
    // Parse response
    const data = await response.json();
    
    // Handle errors
    if (!response.ok) {
      throw new Error(data.error || `Failed to fetch post (${response.status})`);
    }
    
    // Return post data
    return data;
  } catch (error) {
    // Standardize error logging and propagation
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error(`Error fetching post: ${errorMessage}`);
    throw error;
  }
}

/**
 * Update a post's status
 * @param id The ID of the post to update
 * @param status The new status (published or draft)
 * @returns Promise resolving to the updated post
 */
export async function updatePostStatus(id: string, status: 'published' | 'draft') {
  try {
    // Validate input
    if (!id) {
      throw new Error('Post ID is required');
    }
    
    if (status !== 'published' && status !== 'draft') {
      throw new Error('Status must be either "published" or "draft"');
    }
    
    // Make API request
    const response = await authFetch(`/api/posts/${id}/status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ status }),
    });
    
    // Parse response
    const data = await response.json();
    
    // Handle errors
    if (!response.ok) {
      throw new Error(data.error || `Failed to update post status (${response.status})`);
    }
    
    // Return updated post data
    return data;
  } catch (error) {
    // Standardize error logging and propagation
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error(`Error updating post status: ${errorMessage}`);
    throw error;
  }
}

/**
 * Delete a post
 */
export async function deletePost(id: string): Promise<boolean> {
  try {
    const response = await authFetch(`/api/posts/${id}`, {
      method: 'DELETE',
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to delete post');
    }
    
    return true;
  } catch (error) {
    console.error('Error deleting post:', error);
    throw error;
  }
}

/**
 * Update an existing post
 */
export async function updatePost(id: string, data: PostData): Promise<any> {
  try {
    const response = await authFetch(`/api/posts/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to update post');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error updating post:', error);
    throw error;
  }
}