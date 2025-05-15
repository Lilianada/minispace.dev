'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { 
  Card, 
  CardContent, 
  CardHeader,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader } from '@/components/ui/loader';
import PostCard from './PostCard';
import PostFilters from './PostFilters';
import usePosts from '@/hooks/usePosts';

export default function PostsList() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Get query parameters for filtering/sorting
  const currentPage = Number(searchParams.get('page') || '1');
  const status = searchParams.get('status') || 'all';
  const sort = searchParams.get('sort') || 'newest';
  const searchQuery = searchParams.get('q') || '';

  // Component state
  const [search, setSearch] = useState(searchQuery);
  
  // Custom hook to fetch posts with filters
  const { posts, totalPages, isLoading, error } = usePosts({
    page: currentPage,
    status,
    sort,
    search: searchQuery,
  });

  // Handle search input
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams);
    if (search) {
      params.set('q', search);
    } else {
      params.delete('q');
    }
    params.set('page', '1'); // Reset to first page on new search
    router.push(`/dashboard/posts?${params.toString()}`);
  };

  // Handle filter/sort changes
  const handleFilterChange = (newStatus: string, newSort: string) => {
    const params = new URLSearchParams(searchParams);
    if (newStatus !== 'all') {
      params.set('status', newStatus);
    } else {
      params.delete('status');
    }
    
    if (newSort !== 'newest') {
      params.set('sort', newSort);
    } else {
      params.delete('sort');
    }
    
    params.set('page', '1'); // Reset to first page on filter change
    router.push(`/dashboard/posts?${params.toString()}`);
  };

  // Handle pagination
  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', newPage.toString());
    router.push(`/dashboard/posts?${params.toString()}`);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between gap-4 items-start sm:items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Posts</h1>
          <p className="text-muted-foreground mt-1">
            Manage and organize all your blog posts
          </p>
        </div>
        <Button asChild>
          <Link href="/dashboard/posts/new-post" className="shrink-0">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              viewBox="0 0 20 20" 
              fill="currentColor" 
              className="w-5 h-5 mr-2"
            >
              <path d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z" />
            </svg>
            New Post
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col sm:flex-row justify-between gap-4">
            <form onSubmit={handleSearch} className="flex-1">
              <Input
                placeholder="Search posts..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="max-w-sm"
              />
            </form>
            <PostFilters 
              currentStatus={status} 
              currentSort={sort}
              onFilterChange={handleFilterChange}
            />
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-8">
              <Loader size="lg" />
            </div>
          ) : error ? (
            <div className="text-center py-8 text-destructive">
              <p>Error loading posts: {error}</p>
              <Button 
                variant="outline" 
                onClick={() => router.refresh()} 
                className="mt-4"
              >
                Try Again
              </Button>
            </div>
          ) : posts.length === 0 ? (
            <div className="text-center py-12">
              <h3 className="text-lg font-medium mb-2">No posts found</h3>
              <p className="text-muted-foreground mb-6">
                {searchQuery 
                  ? "No posts match your search criteria. Try different keywords or filters." 
                  : "You haven't created any posts yet. Start writing your first post!"}
              </p>
              <Button asChild>
                <Link href="/dashboard/posts/new-post">Create your first post</Link>
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {posts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
              
              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center pt-4">
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                    >
                      Previous
                    </Button>
                    <span className="text-sm">
                      Page {currentPage} of {totalPages}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                    >
                      Next
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}