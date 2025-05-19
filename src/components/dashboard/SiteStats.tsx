'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Loader } from '@/components/ui/loader';
import { db } from '@/lib/firebase/config';
import { collection, query, getDocs, where, getCountFromServer } from 'firebase/firestore';
import useAuth from '@/hooks/useAuth';

interface SiteStats {
  totalPosts: number;
  totalViews: number;
  totalPages: number;
}

export default function SiteStats() {
  const [stats, setStats] = useState<SiteStats>({
    totalPosts: 0,
    totalViews: 0,
    totalPages: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    async function fetchStats() {
      if (!user) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        
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
          totalPosts,
          totalViews,
          totalPages,
        });
        
        setIsLoading(false);
      } catch (err) {
        console.error('Error fetching site stats:', err);
        setError((err as Error).message || 'Failed to fetch site statistics');
        setIsLoading(false);
      }
    }
    
    fetchStats();
  }, [user]);

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle>Site Statistics</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center py-8">
            <Loader size="lg" />
          </div>
        ) : error ? (
          <div className="text-center py-8 text-destructive">
            Error loading statistics: {error}
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-4">
            <div className="flex flex-col items-center p-4 bg-muted/50 rounded-lg">
              <span className="text-3xl font-bold text-primary">{stats.totalPosts}</span>
              <span className="text-sm text-muted-foreground mt-1">Total Posts</span>
            </div>
            <div className="flex flex-col items-center p-4 bg-muted/50 rounded-lg">
              <span className="text-3xl font-bold text-primary">{stats.totalViews}</span>
              <span className="text-sm text-muted-foreground mt-1">Total Views</span>
            </div>
            <div className="flex flex-col items-center p-4 bg-muted/50 rounded-lg">
              <span className="text-3xl font-bold text-primary">{stats.totalPages}</span>
              <span className="text-sm text-muted-foreground mt-1">Total Pages</span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
