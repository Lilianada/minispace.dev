'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Loader } from '@/components/ui/loader';
import { db } from '@/lib/firebase/config';
import { collection, query, orderBy, limit, getDocs, Timestamp } from 'firebase/firestore';
import useAuth from '@/hooks/useAuth';
import { formatDistanceToNow } from 'date-fns';

interface Activity {
  id: string;
  type: 'post_created' | 'post_published' | 'page_created';
  title: string;
  timestamp: Date;
}

export default function RecentActivity() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    async function fetchActivity() {
      if (!user) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        
        // Get posts to generate activity based on recent posts
        const postsRef = collection(db, `Users/${user.uid}/posts`);
        const postsQuery = query(
          postsRef,
          orderBy('createdAt', 'desc'),
          limit(5)
        );
        
        const querySnapshot = await getDocs(postsQuery);
        
        const recentActivities: Activity[] = [];
        querySnapshot.forEach((doc) => {
          const postData = doc.data();
          const createdAt = postData.createdAt instanceof Timestamp 
            ? postData.createdAt.toDate() 
            : new Date();
          
          // Add post creation activity
          recentActivities.push({
            id: `${doc.id}-created`,
            type: 'post_created',
            title: postData.title || 'Untitled Post',
            timestamp: createdAt,
          });
          
          // If published, add publish activity
          if (postData.status === 'published' && postData.publishedAt) {
            const publishedAt = postData.publishedAt instanceof Timestamp 
              ? postData.publishedAt.toDate() 
              : new Date();
              
            recentActivities.push({
              id: `${doc.id}-published`,
              type: 'post_published',
              title: postData.title || 'Untitled Post',
              timestamp: publishedAt,
            });
          }
        });
        
        // Sort activities by timestamp (newest first)
        recentActivities.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
        
        // Take only the 5 most recent activities
        setActivities(recentActivities.slice(0, 5));
        setIsLoading(false);
      } catch (err) {
        console.error('Error fetching activity:', err);
        setError((err as Error).message || 'Failed to fetch recent activity');
        setIsLoading(false);
      }
    }
    
    fetchActivity();
  }, [user]);

  // Helper function to get activity icon
  const getActivityIcon = (type: Activity['type']) => {
    switch (type) {
      case 'post_created':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      case 'post_published':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
        );
      case 'page_created':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
          </svg>
        );
    }
  };

  // Helper function to get activity text
  const getActivityText = (activity: Activity) => {
    switch (activity.type) {
      case 'post_created':
        return (
          <>
            You created a new post: <a href={`/dashboard/posts/${activity.id.split('-')[0]}`} className="text-primary hover:underline">{activity.title}</a>
          </>
        );
      case 'post_published':
        return (
          <>
            You published: <a href={`/dashboard/posts/${activity.id.split('-')[0]}`} className="text-primary hover:underline">{activity.title}</a>
          </>
        );
      case 'page_created':
        return (
          <>
            You created a new page: <a href="#" className="text-primary hover:underline">{activity.title}</a>
          </>
        );
    }
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle>Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center py-8">
            <Loader size="lg" />
          </div>
        ) : error ? (
          <div className="text-center py-8 text-destructive">
            Error loading activity: {error}
          </div>
        ) : activities.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No recent activity found. Start creating content to see your activity here!
          </div>
        ) : (
          <div className="space-y-4">
            {activities.map((activity) => (
              <div key={activity.id} className="flex items-start pb-4 border-b border-border/50 last:border-0 last:pb-0">
                <div className="h-9 w-9 rounded-full bg-primary/10 text-primary flex items-center justify-center flex-shrink-0 mr-3">
                  {getActivityIcon(activity.type)}
                </div>
                <div>
                  <p className="text-sm">
                    {getActivityText(activity)}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {formatDistanceToNow(activity.timestamp, { addSuffix: true })}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
