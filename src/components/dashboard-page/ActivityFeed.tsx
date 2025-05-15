'use client';

import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Loader } from '@/components/ui/loader';

interface Activity {
  id: string;
  type: 'comment' | 'view' | 'subscriber';
  content: string;
  target?: string;
  targetUrl?: string;
  time: string;
}

export default function ActivityFeed() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchActivities() {
      try {
        // For now, use mock data - in production, this would be a real API call
        // const response = await fetch('/api/activities');
        // const data = await response.json();
        
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // Mock data
        const mockData: Activity[] = [
          {
            id: '1',
            type: 'comment',
            content: 'New comment on',
            target: 'Getting Started with Minispace',
            targetUrl: '/dashboard/posts/1',
            time: '5 minutes ago'
          },
          {
            id: '2',
            type: 'view',
            content: 'Someone viewed',
            target: 'Best Practices for Blog SEO',
            targetUrl: '/dashboard/posts/2',
            time: '1 hour ago'
          },
          {
            id: '3',
            type: 'subscriber',
            content: 'New subscriber to your blog',
            time: '3 hours ago'
          },
          {
            id: '4',
            type: 'comment',
            content: 'New comment on',
            target: 'Top Writing Tools for Bloggers',
            targetUrl: '/dashboard/posts/4',
            time: 'Yesterday'
          },
          {
            id: '5',
            type: 'view',
            content: '5 people viewed',
            target: 'How to Grow Your Blog Audience',
            targetUrl: '/dashboard/posts/3',
            time: '2 days ago'
          }
        ];
        
        setActivities(mockData);
        setIsLoading(false);
      } catch (err) {
        setError((err as Error).message || 'Failed to load activities');
        setIsLoading(false);
      }
    }
    
    fetchActivities();
  }, []);

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
            Error loading activities: {error}
          </div>
        ) : (
          <div className="space-y-4">
            {activities.map((activity) => (
              <div key={activity.id} className="flex items-start pb-4 border-b border-border/50 last:border-0 last:pb-0">
                <div className="h-9 w-9 rounded-full bg-primary/10 text-primary flex items-center justify-center flex-shrink-0 mr-3">
                  {activity.type === 'comment' ? (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
                    </svg>
                  ) : activity.type === 'view' ? (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6.633 10.5c.806 0 1.533-.446 2.031-1.08a9.041 9.041 0 012.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 00.322-1.672V3a.75.75 0 01.75-.75A2.25 2.25 0 0116.5 4.5c0 1.152-.26 2.243-.723 3.218-.266.558.107 1.282.725 1.282h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 01-2.649 7.521c-.388.482-.987.729-1.605.729H13.48c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.501 4.501 0 00-1.423-.23H5.904M14.25 9h2.25M5.904 18.75c.083.205.173.405.27.602.197.4-.078.898-.523.898h-.908c-.889 0-1.713-.518-1.972-1.368a12 12 0 01-.521-3.507c0-1.553.295-3.036.831-4.398C3.387 10.203 4.167 9.75 5 9.75h1.053c.472 0 .745.556.5.96a8.958 8.958 0 00-1.302 4.665c0 1.194.232 2.333.654 3.375z" />
                    </svg>
                  )}
                </div>
                <div>
                  <p className="text-sm">
                    {activity.content}{' '}
                    {activity.target && (
                      <a href={activity.targetUrl} className="text-primary hover:underline">
                        {activity.target}
                      </a>
                    )}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {activity.time}
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