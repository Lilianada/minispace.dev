'use client';

/**
 * User Posts Component Example
 * 
 * This is an example component demonstrating how to use our Firebase error handling system
 * with error boundaries to safely display user posts.
 */

import React, { useState } from 'react';
import { FirebaseDataWrapper } from '@/components/ui/firebase-data-wrapper';
import { WithErrorBoundary } from '@/components/ui/error-boundary-helpers';
import { firestore } from '@/lib/firebase/firestore';
import { Button } from '@/components/ui/button';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

interface UserPostsProps {
  userId: string;
}

export function UserPosts({ userId }: UserPostsProps) {
  const [status, setStatus] = useState<'all' | 'published' | 'draft'>('all');
  const [sort, setSort] = useState<'newest' | 'oldest'>('newest');

  // Function to fetch posts with configured options
  const fetchPosts = async () => {
    return await firestore.posts.getPosts(userId, { status, sort });
  };

  // Error handler for logging or analytics
  const handleError = (error: any) => {
    console.error('Error loading posts:', error);
    // Could also log to an analytics or monitoring service here
  };

  // Custom empty state component
  const EmptyState = () => (
    <div className="text-center p-8 border rounded-md bg-muted/30">
      <h3 className="text-lg font-medium mb-2">No posts found</h3>
      <p className="text-muted-foreground mb-4">
        {status === 'all' 
          ? 'This user hasn\'t created any posts yet.' 
          : status === 'published'
            ? 'No published posts found.'
            : 'No draft posts found.'}
      </p>
      {status !== 'all' && (
        <Button variant="outline" onClick={() => setStatus('all')}>
          Show All Posts
        </Button>
      )}
    </div>
  );

  // Custom error component
  const ErrorComponent = (error: any) => (
    <Alert variant="destructive" className="my-4">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Failed to load posts</AlertTitle>
      <AlertDescription>
        {error.message || 'An unexpected error occurred while loading posts.'}
        <div className="mt-4">
          <Button variant="outline" onClick={() => window.location.reload()}>
            Refresh Page
          </Button>
        </div>
      </AlertDescription>
    </Alert>
  );

  return (
    <WithErrorBoundary>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">User Posts</h2>
          
          <div className="flex gap-2">
            <select 
              value={status}
              onChange={(e) => setStatus(e.target.value as any)}
              className="p-2 border rounded-md text-sm"
            >
              <option value="all">All Posts</option>
              <option value="published">Published</option>
              <option value="draft">Drafts</option>
            </select>
            
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as any)}
              className="p-2 border rounded-md text-sm"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
            </select>
          </div>
        </div>
      
        <FirebaseDataWrapper
          fetchData={fetchPosts}
          emptyComponent={<EmptyState />}
          errorComponent={ErrorComponent}
          onError={handleError}
        >
          {(posts: any[]) => (
            <div className="grid gap-4">
              {posts.map((post) => (
                <div key={post.id} className="p-4 border rounded-md">
                  <h3 className="text-xl font-bold mb-1">{post.title}</h3>
                  <p className="text-muted-foreground text-sm">
                    {post.status === 'published' ? 'Published' : 'Draft'} • 
                    {' '}{new Date(post.createdAt).toLocaleDateString()}
                  </p>
                  <p className="mt-2 line-clamp-2">{post.excerpt || post.content}</p>
                </div>
              ))}
            </div>
          )}
        </FirebaseDataWrapper>
      </div>
    </WithErrorBoundary>
  );
}
