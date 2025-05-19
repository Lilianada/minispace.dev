'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader } from '@/components/ui/loader';
import { formatDate } from '@/lib/utils';
import { getDashboardPath } from '@/lib/route-utils';
import { db } from '@/lib/firebase/config';
import { collection, query, where, orderBy, limit, getDocs } from 'firebase/firestore';
import useAuth from '@/hooks/useAuth';

interface Post {
  id: string;
  title: string;
  status: 'draft' | 'published';
  createdAt: string;
  views: number;
}

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
        
        // Get posts from Firestore
        const postsRef = collection(db, `Users/${user.uid}/posts`);
        const postsQuery = query(
          postsRef,
          orderBy('createdAt', 'desc'),
          limit(5) // Limit to 5 most recent posts
        );
        
        const querySnapshot = await getDocs(postsQuery);
        
        const fetchedPosts: Post[] = [];
        querySnapshot.forEach((doc) => {
          const postData = doc.data();
          fetchedPosts.push({
            id: doc.id,
            title: postData.title || 'Untitled Post',
            status: postData.status || 'draft',
            createdAt: postData.createdAt?.toDate?.() || new Date(),
            views: postData.views || 0,
          });
        });
        
        setPosts(fetchedPosts);
        setIsLoading(false);
      } catch (err) {
        console.error('Error fetching posts:', err);
        setError((err as Error).message || 'Failed to fetch posts');
        setIsLoading(false);
      }
    }
    
    fetchPosts();
  }, [user]);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle>Recent Posts</CardTitle>
        <Link href={getDashboardPath('posts')}>
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
                </tr>
              </thead>
              <tbody>
                {posts.map((post) => (
                  <tr key={post.id} className="border-b border-border/50 last:border-0">
                    <td className="py-3 pr-4">
                      <Link href={getDashboardPath(`posts/${post.id}`)} className="hover:text-primary hover:underline font-medium">
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
                      {formatDate(post.createdAt)}
                    </td>
                    <td className="py-3 pr-4 text-muted-foreground text-right">
                      {post.views}
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