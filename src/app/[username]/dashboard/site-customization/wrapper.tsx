'use client';

import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

// This is a wrapper component that safely handles the client component loading
// It will catch any errors during loading and render a fallback UI
export default function SiteCustomizationClientWrapper({ username }: { username: string }) {
  const [hasError, setHasError] = useState(false);
  const [activeTab, setActiveTab] = useState('themes');
  
  // Handle errors that occur during client component loading
  useEffect(() => {
    const handleError = (event: ErrorEvent) => {
      console.error('Client component error:', event.error);
      setHasError(true);
    };
    
    window.addEventListener('error', handleError);
    return () => window.removeEventListener('error', handleError);
  }, []);
  
  if (hasError) {
    return (
      <div className="p-8 max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">Site Customization</h1>
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Error Loading Customization Tools</CardTitle>
            <CardDescription>
              We encountered a problem loading the site customization interface.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="mb-4">This may be due to a temporary issue with Firebase connection.</p>
            <div className="flex gap-4">
              <Button onClick={() => window.location.reload()}>
                Try Again
              </Button>
              <Link href={`/${username}/dashboard`}>
                <Button variant="outline">
                  Return to Dashboard
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Alternative Options</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">You can still browse available themes:</p>
            <Link href={`/${username}/dashboard/themes`}>
              <Button>
                Browse Themes
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  // Simple customization interface until the main component loads
  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Site Customization</h1>
      
      <div className="mb-4 flex justify-between items-center">
        <div>
          <span className="text-sm text-muted-foreground">Customizing site for:</span>
          <span className="ml-2 font-medium">{username}.minispace.dev</span>
        </div>
        <Link href={`/${username}`} target="_blank">
          <Button variant="outline" size="sm">
            View Site
          </Button>
        </Link>
      </div>
      
      <Tabs defaultValue="themes" onValueChange={setActiveTab} value={activeTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="themes">Themes</TabsTrigger>
          <TabsTrigger value="content">Content</TabsTrigger>
          <TabsTrigger value="layout">Layout</TabsTrigger>
          <TabsTrigger value="advanced">Advanced</TabsTrigger>
        </TabsList>
        
        <TabsContent value="themes">
          <Card>
            <CardHeader>
              <CardTitle>Theme Selection</CardTitle>
              <CardDescription>
                Choose a theme for your personal site
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center p-8">
                <div className="animate-pulse mb-4">Loading themes...</div>
                <Link href={`/${username}/dashboard/themes`}>
                  <Button variant="outline">
                    Browse All Themes
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Other tab content placeholders */}
        <TabsContent value="content">
          <Card>
            <CardHeader>
              <CardTitle>Content Settings</CardTitle>
              <CardDescription>Customize your site content and information</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="animate-pulse text-center p-8">
                Loading content settings...
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="layout">
          <Card>
            <CardHeader>
              <CardTitle>Layout Settings</CardTitle>
              <CardDescription>Configure your site layout options</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="animate-pulse text-center p-8">
                Loading layout settings...
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="advanced">
          <Card>
            <CardHeader>
              <CardTitle>Advanced Settings</CardTitle>
              <CardDescription>Configure advanced options for your site</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="animate-pulse text-center p-8">
                Loading advanced settings...
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
