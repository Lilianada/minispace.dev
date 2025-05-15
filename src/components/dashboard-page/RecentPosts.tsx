// filepath: /Users/lilian/Desktop/Projects/minispace.dev/src/app/dashboard/components/RecentPosts.tsx
'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader } from '@/components/ui/loader';

interface Post {
  id: string;
  title: string;
  status: 'published' | 'draft';
  publishedAt?: string;
  views?: number;
  comments?: number;
}

export default function RecentPosts() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchPosts() {
      try {
        // For now, use mock data - in production, this would be a real API call
        // const response = await fetch('/api/posts/recent');
        // const data = await response.json();
        
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 600));
        
        // Mock data
        const mockData: Post[] = [
          {
            id: '1',
            title: 'Getting Started with Minispace',
            status: 'published',
            publishedAt: '2025-05-12',
            views: 243,
            comments: 12
          },
          {
            id: '2',
            title: 'Best Practices for Blog SEO',
            status: 'published',
            publishedAt: '2025-05-08',
            views: 189,
            comments: 7
          },
          {
            id: '3',
            title: 'How to Grow Your Blog Audience',
            status: 'draft',
          },
          {
            id: '4',
            title: 'Top Writing Tools for Bloggers',
            status: 'published',
            publishedAt: '2025-04-29',
            views: 367,
            comments: 24
          },
        ];
        
        setPosts(mockData);
        setIsLoading(false);
      } catch (err) {
        setError((err as Error).message || 'Failed to fetch posts');
        setIsLoading(false);
      }
    }
    
    fetchPosts();
  }, []);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle>Recent Posts</CardTitle>
        <Link href="/dashboard/posts">
          <Button variant="outline" size="sm">
            View all posts
          </Button>
        </Link>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center py-8">
            <Loader size="lg" />
          </div>
        ) : error ? (
          <div className="text-center py-8 text-destructive">
            Error loading posts: {error}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border text-left">
                  <th className="pb-2 font-medium text-muted-foreground">Title</th>
                  <th className="pb-2 font-medium text-muted-foreground">Status</th>
                  <th className="pb-2 font-medium text-muted-foreground">Date</th>
                  <th className="pb-2 font-medium text-muted-foreground text-right">Views</th>
                  <th className="pb-2 font-medium text-muted-foreground text-right">Comments</th>
                  <th className="pb-2 font-medium text-muted-foreground"></th>
                </tr>
              </thead>
              <tbody>
                {posts.map((post) => (
                  <tr key={post.id} className="border-b border-border/50 last:border-0">
                    <td className="py-3 pr-4">
                      <Link href={`/dashboard/posts/${post.id}`} className="hover:text-primary hover:underline font-medium">
                        {post.title}
                      </Link>
                    </td>
                    <td className="py-3 pr-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        post.status === 'published' 
                          ? 'bg-green-100 text-green-800 dark:bg-green-800/20 dark:text-green-400' 
                          : 'bg-amber-100 text-amber-800 dark:bg-amber-800/20 dark:text-amber-400'
                      }`}>
                        {post.status === 'published' ? 'Published' : 'Draft'}
                      </span>
                    </td>
                    <td className="py-3 pr-4 text-muted-foreground text-sm">
                      {post.publishedAt 
                        ? new Date(post.publishedAt).toLocaleDateString() 
                        : '-'}
                    </td>
                    <td className="py-3 pr-4 text-muted-foreground text-right">
                      {post.views ?? '-'}
                    </td>
                    <td className="py-3 pr-4 text-muted-foreground text-right">
                    <td className="py-3 text-right">
                      <Link href={`/dashboard/posts/${post.id}/edit`}>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <span className="sr-only">Edit {post.title}</span>
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                          </svg>
                        </Button>
                      </Link>
                    </td>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}