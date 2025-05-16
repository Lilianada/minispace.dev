'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader } from '@/components/ui/loader';
import PostFilters from './PostFilters';
import PostListHeader from './PostListHeader';
import PostListTable from './PostListTable';
import PostPagination from './PostPagination';
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
  const { posts, totalPages, isLoading, error, mutate } = usePosts({
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
      <PostListHeader />

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
              <p>Error loading posts: {error.message}</p>
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
            <>
              <PostListTable 
                posts={posts} 
                mutate={mutate} 
              />
              
              {totalPages > 1 && (
                <PostPagination 
                  currentPage={currentPage} 
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                />
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}