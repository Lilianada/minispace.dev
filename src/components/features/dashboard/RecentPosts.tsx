/**
 * Dashboard Recent Posts Component
 * 
 * Displays a list of the user's recent posts with key metrics.
 * Part of the dashboard feature.
 */
'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader } from '@/components/ui/loader';
import { formatDate } from '@/lib/utils';
import { getDashboardPath } from '@/lib/route-utils';
import { useAuth } from '@/contexts/AuthContext';
import { getUserPosts } from '@/services/posts-service';
import type { Post } from '@/services/posts-service';

export default function RecentPosts() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { user } = useAuth();

  useEffect(() => {
    async function fetchPosts() {
      if (!user) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const response = await getUserPosts();
        
        if (response.error) {
          throw new Error(response.error);
        }
        
        // Sort posts by creation date and take the 5 most recent
        const sortedPosts = response.data
          ?.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
          .slice(0, 5) || [];
          
        setPosts(sortedPosts);
      } catch (err) {
        console.error('Failed to fetch posts:', err);
        setError(err instanceof Error ? err.message : 'Failed to load posts');
      } finally {
        setIsLoading(false);
      }
    }

    fetchPosts();
  }, [user]);

  // Show loading state
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Posts</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center py-8">
          <Loader />
        </CardContent>
      </Card>
    );
  }

  // Show error state
  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Posts</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-red-500">Error: {error}</p>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => window.location.reload()}
            className="mt-2"
          >
            Retry
          </Button>
        </CardContent>
      </Card>
    );
  }

  // Empty state
  if (posts.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Posts</CardTitle>
        </CardHeader>
        <CardContent className="text-center py-8">
          <p className="text-muted-foreground mb-4">You haven't created any posts yet.</p>
          <Link href={getDashboardPath('posts/new')}>
            <Button>Create your first post</Button>
          </Link>
        </CardContent>
      </Card>
    );
  }

  // Render posts
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle>Recent Posts</CardTitle>
        <Link href={getDashboardPath('posts')}>
          <Button variant="ghost" size="sm">
            View all
          </Button>
        </Link>
      </CardHeader>
      <CardContent>
        <div className="divide-y">
          {posts.map((post) => (
            <div key={post.id} className="py-3">
              <div className="flex justify-between items-start">
                <div>
                  <Link href={getDashboardPath(`posts/${post.id}`)} className="font-medium hover:underline">
                    {post.title || 'Untitled Post'}
                  </Link>
                  <div className="flex items-center gap-2 mt-1 text-sm">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs ${
                      post.status === 'published' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {post.status === 'published' ? 'Published' : 'Draft'}
                    </span>
                    <span className="text-gray-500">{formatDate(post.createdAt)}</span>
                  </div>
                </div>
                <div className="flex items-center text-sm text-gray-500">
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    className="h-4 w-4 mr-1" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  {post.views || 0}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
