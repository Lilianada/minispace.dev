/* eslint-disable @typescript-eslint/no-explicit-any */
// This module provides API functions for managing posts

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
 * Create a new post
 */
export async function createPost(data: PostData): Promise<any> {
  try {
    const response = await fetch('/api/posts', {
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
export async function getPosts(filters: PostFilters = {}) {
  const {
    page = 1,
    limit = 10,
    search = '',
    status = 'all',
    sort = 'newest'
  } = filters;
  
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
  
  try {
    // Ensure we're using the correct API path (/api/posts)
    const response = await fetch(`/api/posts?${queryParams.toString()}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      // Add cache: 'no-store' for server components
      cache: 'no-store'
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || 'Failed to fetch posts');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching posts:', error);
    throw error;
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
    const response = await fetch(`/api/posts/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
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
    const response = await fetch(`/api/posts/${id}/status`, {
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
    const response = await fetch(`/api/posts/${id}`, {
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
    const response = await fetch(`/api/posts/${id}`, {
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