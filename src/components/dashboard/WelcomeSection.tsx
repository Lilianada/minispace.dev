/* eslint-disable react/no-unescaped-entities */
'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth-context';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { getDashboardPath } from '@/lib/route-utils';
import { db } from '@/lib/firebase/config';
import { collection, query, where, getDocs, getCountFromServer } from 'firebase/firestore';
import { Loader } from '@/components/ui/loader';

interface SiteStats {
  totalViews: number;
  totalPosts: number;
  totalPages: number;
}

export default function WelcomeSection() {
  const { userData, user } = useAuth();
  const [stats, setStats] = useState<SiteStats>({
    totalViews: 0,
    totalPosts: 0,
    totalPages: 0
  });
  const [isLoading, setIsLoading] = useState(true);
  
  // Get current time to customize greeting
  const currentHour = new Date().getHours();
  let greeting = 'Welcome';
  
  if (currentHour < 12) {
    greeting = 'Good morning';
  } else if (currentHour < 18) {
    greeting = 'Good afternoon';
  } else {
    greeting = 'Good evening';
  }

  const username = userData?.username;
  
  useEffect(() => {
    async function fetchStats() {
      if (!user) {
        setIsLoading(false);
        return;
      }

      try {
        // Get posts collection reference
        const postsRef = collection(db, `Users/${user.uid}/posts`);
        
        // Get total posts count
        const postsSnapshot = await getCountFromServer(postsRef);
        const totalPosts = postsSnapshot.data().count;
        
        // Get published posts for view count
        const publishedPostsQuery = query(postsRef, where('status', '==', 'published'));
        const publishedPostsSnapshot = await getDocs(publishedPostsQuery);
        
        // Calculate total views
        let totalViews = 0;
        publishedPostsSnapshot.forEach((doc) => {
          const postData = doc.data();
          totalViews += postData.views || 0;
        });
        
        // Get pages collection reference (if you have a separate pages collection)
        // If pages are stored differently, adjust this logic
        const pagesRef = collection(db, `Users/${user.uid}/pages`);
        let totalPages = 0;
        
        try {
          const pagesSnapshot = await getCountFromServer(pagesRef);
          totalPages = pagesSnapshot.data().count;
        } catch (err) {
          // If pages collection doesn't exist yet, just use 0
          console.log('Pages collection may not exist yet');
        }
        
        setStats({
          totalViews,
          totalPosts,
          totalPages
        });
        
        setIsLoading(false);
      } catch (err) {
        console.error('Error fetching site stats:', err);
        setIsLoading(false);
      }
    }
    
    fetchStats();
  }, [user]);

  return (
    <div className="bg-primary/5 rounded-lg border border-primary/20 p-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground capitalize">{greeting}, {username || 'there'}</h1>
          <p className="mt-1 text-muted-foreground">
            Here's an overview of your blog's performance and recent activity
          </p>
        </div>
        <Link href={getDashboardPath('posts/new-post')}>
          <Button className="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            <span>New Post</span>
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
        {isLoading ? (
          <div className="col-span-3 flex justify-center py-8">
            <Loader size="lg" />
          </div>
        ) : (
          <>
            <Card>
              <CardContent className="p-4">
                <p className="text-sm text-muted-foreground">Total Views</p>
                <p className="text-2xl font-bold">{stats.totalViews.toLocaleString()}</p>
                <div className="flex items-center mt-1 text-xs text-muted-foreground">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  <span>Total page views</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <p className="text-sm text-muted-foreground">Total Posts</p>
                <p className="text-2xl font-bold">{stats.totalPosts.toLocaleString()}</p>
                <div className="flex items-center mt-1 text-xs text-muted-foreground">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                  </svg>
                  <span>All blog posts</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <p className="text-sm text-muted-foreground">Total Pages</p>
                <p className="text-2xl font-bold">{stats.totalPages.toLocaleString()}</p>
                <div className="flex items-center mt-1 text-xs text-muted-foreground">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <span>Static pages</span>
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </div>
  );
}