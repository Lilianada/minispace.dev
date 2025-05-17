'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { getPosts, Post, PostFilters } from '@/lib/api/posts';
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
  
  // Load posts when parameters change
  useEffect(() => {
    async function fetchPosts() {
      try {
        setIsLoading(true);
        setError(null);
        
        console.log('Fetching posts with filters:', { page, status, sort, search });
        
        const result = await getPosts({
          page,
          limit: 10,
          status,
          sort,
          search
        });
        
        // Check for API-level errors that were converted to normal responses
        if (result.error || result.status === 'error') {
          setError(result.error || 'There was a problem loading your posts');
          setPosts([]);
        } else {
          setPosts(result.posts || []);
        }
        
        setTotalPages(result.totalPages || 1);
        setCurrentPage(result.currentPage || page);
        setTotalPosts(result.total || 0);
      } catch (err) {
        console.error('Error fetching posts:', err);
        setError('Failed to load posts. Please try again.');
        setPosts([]);
        toast({
          title: 'Error',
          description: 'Failed to load posts',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchPosts();
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