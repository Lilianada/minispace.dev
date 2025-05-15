/* eslint-disable react/no-unescaped-entities */
'use client';

import React from 'react';
import { useAuth } from '@/lib/auth-context';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

export default function WelcomeSection() {
  const { userData } = useAuth();
  
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

  return (
    <div className="bg-primary/5 rounded-lg border border-primary/20 p-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground capitalize">{greeting}, {userData?.username || 'there'}</h1>
          <p className="mt-1 text-muted-foreground">
            Here's an overview of your blog's performance and recent activity
          </p>
        </div>
        <Link href="/dashboard/new-post">
          <Button className="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            <span>New Post</span>
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Total Views</p>
            <p className="text-2xl font-bold">1,234</p>
            <div className="flex items-center mt-1 text-xs text-green-500">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
              </svg>
              <span>12% vs last week</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Total Posts</p>
            <p className="text-2xl font-bold">24</p>
            <div className="flex items-center mt-1 text-xs text-green-500">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
              </svg>
              <span>3 new this month</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Comments</p>
            <p className="text-2xl font-bold">153</p>
            <div className="flex items-center mt-1 text-xs text-red-500">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
              <span>5% vs last week</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}