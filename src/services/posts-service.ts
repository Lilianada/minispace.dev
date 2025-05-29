/**
 * Posts API Service
 * 
 * Handles all API requests related to posts.
 * Provides a clean interface for post-related operations.
 */

import { apiRequest } from '@/services/api-service';

// Types
export interface Post {
  id: string;
  title: string;
  content: string;
  slug: string;
  status: 'draft' | 'published';
  author: {
    uid: string;
    username: string;
    displayName?: string;
    photoURL?: string;
  };
  createdAt: string | Date;
  updatedAt: string | Date;
  publishedAt?: string | Date;
  tags?: string[];
  excerpt?: string;
  coverImage?: string;
  views: number;
}

export interface CreatePostData {
  title: string;
  content: string;
  slug?: string;
  status?: 'draft' | 'published';
  tags?: string[];
  coverImage?: string;
}

export interface UpdatePostData {
  title?: string;
  content?: string;
  slug?: string;
  status?: 'draft' | 'published';
  tags?: string[];
  coverImage?: string;
}

/**
 * Get all posts for the current user
 */
export async function getUserPosts() {
  return await apiRequest<Post[]>('/api/posts');
}

/**
 * Get a specific post by ID
 */
export async function getPost(postId: string) {
  return await apiRequest<Post>(`/api/posts/${postId}`);
}

/**
 * Create a new post
 */
export async function createPost(postData: CreatePostData) {
  return await apiRequest<Post>('/api/posts', {
    method: 'POST',
    body: postData
  });
}

/**
 * Update an existing post
 */
export async function updatePost(postId: string, postData: UpdatePostData) {
  return await apiRequest<Post>(`/api/posts/${postId}`, {
    method: 'PUT',
    body: postData
  });
}

/**
 * Delete a post
 */
export async function deletePost(postId: string) {
  return await apiRequest<{ success: boolean }>(`/api/posts/${postId}`, {
    method: 'DELETE'
  });
}

/**
 * Update post status (publish/unpublish)
 */
export async function updatePostStatus(postId: string, status: 'draft' | 'published') {
  return await apiRequest<Post>(`/api/posts/${postId}/status`, {
    method: 'PATCH',
    body: { status }
  });
}

/**
 * Get published posts for a specific user by username
 */
export async function getPublicPosts(username: string) {
  return await apiRequest<Post[]>(`/api/users/${username}/posts`, {
    requireAuth: false
  });
}

/**
 * Get a specific published post by slug for a user
 */
export async function getPublicPost(username: string, slug: string) {
  return await apiRequest<Post>(`/api/users/${username}/posts/${slug}`, {
    requireAuth: false
  });
}
