'use client';

/**
 * Example User Profile Page
 * 
 * This is an example page component that demonstrates integration of:
 * 1. Firebase error handling
 * 2. React error boundaries
 * 3. Debug components
 */

import React, { useEffect, useState } from 'react';
import { WithErrorBoundary } from '@/components/ui/error-boundary-helpers';
import { FirebaseDataWrapper } from '@/components/ui/firebase-data-wrapper';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { handleFirebaseOperation } from '@/lib/firebase/error-handler';
import { firestore } from '@/lib/firebase/firestore';
import { UserPosts } from '@/components/examples/user-posts';
import { isDev, isDebugFeatureEnabled } from '@/lib/debug-config';

// For demo purposes only - a mock Firebase call
const fetchUserProfile = async (userId: string) => {
  return handleFirebaseOperation(async () => {
    // This would be an actual firebase call in a real implementation
    console.log(`Fetching profile for user: ${userId}`);
    
    // Simulate loading time
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // For demo: if userId is 'error', throw an error to demonstrate error handling
    if (userId === 'error') {
      throw new Error('User not found');
    }
    
    return {
      id: userId,
      name: 'Demo User',
      bio: 'This is a demo profile showcasing error handling and boundaries.',
      email: 'demo@example.com',
      createdAt: new Date().toISOString(),
      photoURL: 'https://via.placeholder.com/150',
    };
  });
};

// Debug component that shows additional information
function DebugPanel({ data }: { data: any }) {
  if (!isDev && !isDebugFeatureEnabled('showPerformanceMetrics')) {
    return null;
  }
  
  return (
    <div className="bg-muted p-4 mt-4 rounded-md text-xs">
      <h3 className="font-bold mb-2">Debug Information</h3>
      <div className="grid gap-1">
        <div>Component Render Time: {new Date().toISOString()}</div>
        <div>Data Timestamp: {data?.createdAt || 'N/A'}</div>
        <div>Environment: {process.env.NODE_ENV}</div>
      </div>
    </div>
  );
}

interface UserProfilePageProps {
  userId: string;
}

export default function UserProfilePage({ userId = 'demo-user' }: UserProfilePageProps) {
  return (
    <WithErrorBoundary>
      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold mb-6">User Profile</h1>
        
        <FirebaseDataWrapper
          fetchData={() => fetchUserProfile(userId)}
          loadingComponent={
            <Card className="animate-pulse">
              <CardHeader>
                <div className="h-8 w-48 bg-muted rounded-md"></div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="h-4 w-full bg-muted rounded-md"></div>
                  <div className="h-4 w-3/4 bg-muted rounded-md"></div>
                  <div className="h-4 w-1/2 bg-muted rounded-md"></div>
                </div>
              </CardContent>
            </Card>
          }
        >
          {(userData) => (
            <>
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center">
                      {userData.name.charAt(0)}
                    </div>
                    <span>{userData.name}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <dl className="grid gap-2">
                    <div>
                      <dt className="font-medium">Bio</dt>
                      <dd className="text-muted-foreground">{userData.bio}</dd>
                    </div>
                    <div>
                      <dt className="font-medium">Email</dt>
                      <dd className="text-muted-foreground">{userData.email}</dd>
                    </div>
                    <div>
                      <dt className="font-medium">Member Since</dt>
                      <dd className="text-muted-foreground">
                        {new Date(userData.createdAt).toLocaleDateString()}
                      </dd>
                    </div>
                  </dl>
                  
                  <div className="mt-4">
                    <Button variant="outline">Edit Profile</Button>
                  </div>
                  
                  <DebugPanel data={userData} />
                </CardContent>
              </Card>
              
              <Tabs defaultValue="posts" className="w-full">
                <TabsList>
                  <TabsTrigger value="posts">Posts</TabsTrigger>
                  <TabsTrigger value="activity">Activity</TabsTrigger>
                  <TabsTrigger value="settings">Settings</TabsTrigger>
                </TabsList>
                <TabsContent value="posts" className="mt-6">
                  <UserPosts userId={userId} />
                </TabsContent>
                <TabsContent value="activity">
                  <Card>
                    <CardHeader>
                      <CardTitle>Recent Activity</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p>User activity will be displayed here.</p>
                    </CardContent>
                  </Card>
                </TabsContent>
                <TabsContent value="settings">
                  <Card>
                    <CardHeader>
                      <CardTitle>User Settings</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p>User settings will be displayed here.</p>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </>
          )}
        </FirebaseDataWrapper>
      </div>
    </WithErrorBoundary>
  );
}
