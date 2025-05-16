'use client';

import { useEffect } from 'react';
import useSWR, { KeyedMutator } from 'swr'; // Import KeyedMutator for proper typing
import { getPosts, PostFilters } from '@/lib/api/posts';

interface Post {
  id: string;
  title: string;
  slug?: string;
  status: 'published' | 'draft';
  content?: string;
  contentHtml?: string;
  excerpt?: string;
  publishedAt?: string;
  updatedAt: string;
  views?: number;
  tags?: string[];
}

export interface PostsData {
  posts: Post[];
  total: number;
  totalPages: number;
  currentPage: number;
}

export type UsePostsParams = PostFilters;

export interface UsePostsResult {
  posts: Post[];
  totalPosts: number;
  totalPages: number;
  currentPage: number;
  isLoading: boolean;
  error: Error | undefined;
  mutate: KeyedMutator<PostsData>; // Use SWR's KeyedMutator type
}

/**
 * Custom hook for fetching and filtering posts with pagination
 */
export default function usePosts({
  page = 1,
  limit = 10,
  search = '',
  status = 'all',
  sort = 'newest'
}: UsePostsParams = {}): UsePostsResult {
  
  const queryParams = new URLSearchParams();
  
  // Add parameters to query string for the SWR cache key
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
  
  // This is used as the cache key for SWR
  const queryKey = `/api/posts?${queryParams.toString()}`;
  
  // Prepare the filter object for getPosts
  const filters: PostFilters = { page, limit, search, status, sort };
  
  const { data, error, isLoading, mutate } = useSWR<PostsData>(
    queryKey,
    () => getPosts(filters),
    {
      revalidateOnFocus: false,
      dedupingInterval: 60000, // 1 minute
    }
  );
  
  // Handle automatic refetching when params change
  useEffect(() => {
    mutate();
  }, [page, limit, search, status, sort, mutate]);
  
  return {
    posts: data?.posts || [],
    totalPosts: data?.total || 0,
    totalPages: data?.totalPages || 0,
    currentPage: data?.currentPage || page,
    isLoading,
    error,
    mutate, // Pass the mutate function as is
  };
}