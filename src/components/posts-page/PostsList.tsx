'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { fetchUserPosts, Post, PostFilters } from '@/lib/api/dashboard-posts';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import PostsFilters from './PostFilters';
import PostItem from './PostItem';
import Pagination from '../ui/pagination';
import { getDashboardPath } from '@/lib/route-utils';

export default function PostsList() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  
  // Get query parameters for filtering/sorting
  const page = Number(searchParams.get('page') || '1');
  const status = searchParams.get('status') || 'all';
  const sort = searchParams.get('sort') || 'newest';
  const search = searchParams.get('search') || '';
  
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(page);
  const [totalPosts, setTotalPosts] = useState(0);
  
  // Helper functions for username-based navigation
  const getPostsUrl = (params: URLSearchParams) => {
    const basePath = getDashboardPath('posts');
    return `${basePath}?${params.toString()}`;
  };
  
  const getNewPostUrl = () => {
    return getDashboardPath('posts/new-post');
  };
  
  // Track if component is mounted to prevent state updates after unmount
  const isMounted = useRef(true);
  
  // Track previous filter values to prevent unnecessary refetches
  const prevFilters = useRef({ page, status, sort, search });
  
  // Load posts when parameters change
  useEffect(() => {
    // Set up cleanup function
    return () => {
      isMounted.current = false;
    };
  }, []);
  
  // Separate effect for fetching posts
  useEffect(() => {
    // Check if filters actually changed
    const filtersChanged = 
      prevFilters.current.page !== page ||
      prevFilters.current.status !== status ||
      prevFilters.current.sort !== sort ||
      prevFilters.current.search !== search;
    
    if (!filtersChanged) {
      return; // Skip if filters haven't changed
    }
    
    // Update previous filters
    prevFilters.current = { page, status, sort, search };
    
    // Set a timeout to ensure we don't show loading state indefinitely
    let loadingTimeout: NodeJS.Timeout | null = null;
    
    async function fetchPosts() {
      try {
        setIsLoading(true);
        setError(null);
        
        // Set a timeout to ensure we exit loading state even if the request takes too long
        loadingTimeout = setTimeout(() => {
          if (isMounted.current) {
            setIsLoading(false);
            // If we still have no posts after timeout, make sure it's clear to the user
            if (!posts || posts.length === 0) {
              console.log('No posts found after timeout');
            }
          }
        }, 3000); // 3 second timeout
        
        console.log('Fetching posts with filters:', { page, status, sort, search });
        
        const result = await fetchUserPosts({
          page,
          limit: 10,
          status,
          sort,
          search
        });
        
        // Clear the timeout since we got a response
        if (loadingTimeout) {
          clearTimeout(loadingTimeout);
          loadingTimeout = null;
        }
        
        // Only update state if component is still mounted
        if (isMounted.current) {
          setPosts(result.posts || []);
          setTotalPages(result.totalPages || 1);
          setCurrentPage(result.currentPage || page);
          setTotalPosts(result.total || 0);
          setIsLoading(false); // Ensure loading state is cleared
        }
        
      } catch (err) {
        console.error('Error fetching posts:', err);
        
        // Clear the timeout since we got a response
        if (loadingTimeout) {
          clearTimeout(loadingTimeout);
          loadingTimeout = null;
        }
        
        if (isMounted.current) {
          const errorMessage = err instanceof Error ? err.message : 'Failed to load posts. Please try again.';
          setError(errorMessage);
          setPosts([]);
          setIsLoading(false); // Ensure loading state is cleared
          toast({
            title: 'Error',
            description: errorMessage,
            variant: 'destructive',
          });
        }
      }
    }
    
    fetchPosts();
    
    // Clean up timeout if component unmounts
    return () => {
      if (loadingTimeout) {
        clearTimeout(loadingTimeout);
      }
    };
  }, [page, status, sort, search, toast]);
  
  // Handle page change
  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', newPage.toString());
    router.push(getPostsUrl(params));
  };
  
  // Handle status filter change
  const handleStatusChange = (newStatus: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('status', newStatus);
    params.delete('page'); // Reset page when changing filters
    router.push(getPostsUrl(params));
  };
  
  // Handle sort change
  const handleSortChange = (newSort: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('sort', newSort);
    params.delete('page'); // Reset page when changing filters
    router.push(getPostsUrl(params));
  };
  
  // Handle search
  const handleSearch = (searchQuery: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (searchQuery) {
      params.set('search', searchQuery);
    } else {
      params.delete('search');
    }
    params.delete('page'); // Reset page when searching
    router.push(getPostsUrl(params));
  };
  
  // Render loading state
  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center mb-6">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-10 w-32" />
        </div>
        
        <div className="flex gap-4 mb-6">
          <Skeleton className="h-10 w-24" />
          <Skeleton className="h-10 w-24" />
          <Skeleton className="h-10 w-24" />
          <Skeleton className="ml-auto h-10 w-64" />
        </div>
        
        {Array(3).fill(0).map((_, i) => (
          <Card key={i} className="p-4 mb-4">
            <Skeleton className="h-7 w-3/4 mb-2" />
            <Skeleton className="h-4 w-1/2 mb-4" />
            <div className="flex justify-between">
              <Skeleton className="h-4 w-1/4" />
              <Skeleton className="h-8 w-20" />
            </div>
          </Card>
        ))}
      </div>
    );
  }
  
  // Render error state
  if (error) {
    return (
      <div className="text-center py-10 border border-dashed rounded-md p-6">
        <h3 className="text-lg font-medium mb-2">Cannot load posts</h3>
        <p className="text-muted-foreground mb-6">
          {error.includes('credentials') || error.includes('authentication') 
            ? 'There is a database connection issue. Please try again later or contact support.'
            : error}
        </p>
        <div className="flex justify-center gap-4">
          <Button onClick={() => router.refresh()}>
            Refresh
          </Button>
          <Button variant="outline" onClick={() => router.push(getNewPostUrl())}>
            Create New Post
          </Button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">My Posts</h1>
        <Button onClick={() => router.push(getNewPostUrl())}>
          Create New Post
        </Button>
      </div>
      
      <PostsFilters 
        currentStatus={status} 
        currentSort={sort}
        searchQuery={search}
        onStatusChange={handleStatusChange}
        onSortChange={handleSortChange}
        onSearch={handleSearch}
      />
      
      {!posts || posts.length === 0 ? (
        <div className="text-center py-10 border border-dashed rounded-md">
          <h3 className="text-lg font-medium mb-2">No posts found</h3>
          <p className="text-muted-foreground mb-6">
            {search 
              ? `No posts match the search "${search}"`
              : status !== 'all' 
                ? `You don't have any ${status} posts yet`
                : error
                  ? "Unable to load posts due to a technical issue"
                  : "You haven't created any posts yet"}
          </p>
          <Button onClick={() => router.push(getNewPostUrl())}>
            Create Your First Post
          </Button>
        </div>
      ) : (
        <>
          <div className="space-y-4">
            {posts.map((post) => (
              <PostItem 
                key={post.id} 
                post={post} 
                onRefresh={() => {
                  // Trigger a re-fetch
                  router.refresh();
                }}
              />
            ))}
          </div>
          
          {totalPages > 1 && (
            <Pagination 
              currentPage={currentPage} 
              totalPages={totalPages} 
              onPageChange={handlePageChange} 
            />
          )}
          
          <p className="text-sm text-muted-foreground text-center">
            Showing {posts.length} of {totalPosts} posts
          </p>
        </>
      )}
    </div>
  );
}