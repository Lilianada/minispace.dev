'use client';

import React, { useState, useEffect } from 'react';
import useAuth from '@/hooks/useAuth';
import { StorageUsage, StorageUpgradePrompt } from '@/components/ui/storage-usage';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { calculateStorageUsage, formatBytes, StorageUsageData } from '@/lib/storage-utils';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default async function StorageSettingsPage({ params }: { params: Promise<{ username: string }> }) {
  const resolvedParams = await params;
  const router = useRouter();
  const { user, userData, loading: authLoading } = useAuth();
  const [storageData, setStorageData] = useState<StorageUsageData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('usage');

  useEffect(() => {
    async function fetchStorageData() {
      if (!user) return;
      
      try {
        setIsLoading(true);
        const data = await calculateStorageUsage(user.uid);
        setStorageData(data);
      } catch (error) {
        console.error('Error fetching storage data:', error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchStorageData();
  }, [user]);

  if (authLoading || isLoading) {
    return (
      <div className="container py-10">
        <h1 className="text-3xl font-bold mb-6">Storage Settings</h1>
        <div className="grid gap-6">
          <Skeleton className="h-[200px] w-full" />
          <Skeleton className="h-[400px] w-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="container py-10">
      <h1 className="text-3xl font-bold mb-6">Storage Settings</h1>
      
      <div className="grid gap-6 md:grid-cols-3">
        {/* Storage summary card */}
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Storage Summary</CardTitle>
            <CardDescription>View and manage your storage usage</CardDescription>
          </CardHeader>
          <CardContent>
            <StorageUsage showCategories className="mb-4" />
            <StorageUpgradePrompt />
          </CardContent>
        </Card>
        
        {/* Main content area */}
        <div className="md:col-span-2">
          <Tabs defaultValue="usage" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="usage">Usage Details</TabsTrigger>
              <TabsTrigger value="hosting">Hosting Options</TabsTrigger>
              <TabsTrigger value="github">GitHub Pages</TabsTrigger>
            </TabsList>
            
            {/* Usage details tab */}
            <TabsContent value="usage" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Storage Usage Details</CardTitle>
                  <CardDescription>
                    See what's using your storage space
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {storageData && (
                    <div className="space-y-6">
                      {/* Posts storage */}
                      <div>
                        <h3 className="text-sm font-medium mb-2">Posts & Pages</h3>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Used space</span>
                          <span>{formatBytes(storageData.categories[0].size)}</span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-1.5 mb-3">
                          <div 
                            className="bg-blue-500 h-1.5 rounded-full" 
                            style={{ width: `${storageData.categories[0].percentage}%` }}
                          ></div>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          This includes all your blog posts, pages, and drafts.
                        </p>
                      </div>
                      
                      {/* Images storage */}
                      <div>
                        <h3 className="text-sm font-medium mb-2">Images</h3>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Used space</span>
                          <span>{formatBytes(storageData.categories[1].size)}</span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-1.5 mb-3">
                          <div 
                            className="bg-green-500 h-1.5 rounded-full" 
                            style={{ width: `${storageData.categories[1].percentage}%` }}
                          ></div>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Images uploaded to your site, including post images and site assets.
                        </p>
                      </div>
                      
                      {/* Files storage */}
                      <div>
                        <h3 className="text-sm font-medium mb-2">Files</h3>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Used space</span>
                          <span>{formatBytes(storageData.categories[2].size)}</span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-1.5 mb-3">
                          <div 
                            className="bg-purple-500 h-1.5 rounded-full" 
                            style={{ width: `${storageData.categories[2].percentage}%` }}
                          ></div>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Downloadable files, PDFs, and other documents.
                        </p>
                      </div>
                      
                      {/* Other storage */}
                      <div>
                        <h3 className="text-sm font-medium mb-2">Other</h3>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Used space</span>
                          <span>{formatBytes(storageData.categories[3].size)}</span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-1.5 mb-3">
                          <div 
                            className="bg-orange-500 h-1.5 rounded-full" 
                            style={{ width: `${storageData.categories[3].percentage}%` }}
                          ></div>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Other storage usage including site configuration and metadata.
                        </p>
                      </div>
                    </div>
                  )}
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full">
                    Clean Up Storage
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
            
            {/* Hosting options tab */}
            <TabsContent value="hosting" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Hosting Options</CardTitle>
                  <CardDescription>
                    Choose how you want to host your Minispace site
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {/* Minispace hosting */}
                    <div className="border rounded-lg p-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="text-base font-medium">Minispace Hosting</h3>
                          <p className="text-sm text-muted-foreground mt-1">
                            Host your site on our fast, reliable CDN with your subdomain.
                          </p>
                          <ul className="mt-2 text-sm space-y-1">
                            <li className="flex items-center">
                              <svg className="w-4 h-4 mr-2 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                              Free tier: 100MB storage
                            </li>
                            <li className="flex items-center">
                              <svg className="w-4 h-4 mr-2 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                              username.minispace.app subdomain
                            </li>
                            <li className="flex items-center">
                              <svg className="w-4 h-4 mr-2 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                              Global CDN distribution
                            </li>
                          </ul>
                        </div>
                        <div className="text-right">
                          <span className="text-sm font-medium">Current Plan</span>
                        </div>
                      </div>
                      <div className="mt-4 flex justify-end">
                        <Button>Upgrade to Pro</Button>
                      </div>
                    </div>
                    
                    {/* Self-hosting */}
                    <div className="border rounded-lg p-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="text-base font-medium">Self Hosting</h3>
                          <p className="text-sm text-muted-foreground mt-1">
                            Export your site and host it on your own server.
                          </p>
                          <ul className="mt-2 text-sm space-y-1">
                            <li className="flex items-center">
                              <svg className="w-4 h-4 mr-2 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                              Full control over hosting
                            </li>
                            <li className="flex items-center">
                              <svg className="w-4 h-4 mr-2 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                              Use your own domain
                            </li>
                            <li className="flex items-center">
                              <svg className="w-4 h-4 mr-2 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                              No storage limitations
                            </li>
                          </ul>
                        </div>
                      </div>
                      <div className="mt-4 flex justify-end gap-2">
                        <Link href="/docs/hosting" target="_blank">
                          <Button variant="outline">Learn More</Button>
                        </Link>
                        <Button variant="secondary">Export Site</Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            {/* GitHub Pages tab */}
            <TabsContent value="github" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>GitHub Pages Integration</CardTitle>
                  <CardDescription>
                    Deploy your site to GitHub Pages for free hosting
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="border rounded-lg p-4">
                      <h3 className="text-base font-medium">Connect with GitHub</h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        Link your GitHub account to automatically deploy your site to GitHub Pages.
                      </p>
                      
                      <div className="mt-4 p-4 bg-muted rounded-md">
                        <h4 className="text-sm font-medium mb-2">Benefits of GitHub Pages</h4>
                        <ul className="text-sm space-y-2">
                          <li className="flex items-start">
                            <svg className="w-4 h-4 mr-2 text-green-500 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            <span>Free hosting with your-username.github.io domain</span>
                          </li>
                          <li className="flex items-start">
                            <svg className="w-4 h-4 mr-2 text-green-500 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            <span>Automatic deployments when you update your site</span>
                          </li>
                          <li className="flex items-start">
                            <svg className="w-4 h-4 mr-2 text-green-500 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            <span>Custom domains supported</span>
                          </li>
                          <li className="flex items-start">
                            <svg className="w-4 h-4 mr-2 text-green-500 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            <span>Version control for all your content</span>
                          </li>
                        </ul>
                      </div>
                      
                      <div className="mt-4 flex justify-end gap-2">
                        <Link href="/docs/github-pages" target="_blank">
                          <Button variant="outline">View Guide</Button>
                        </Link>
                        <Button>
                          <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                          </svg>
                          Connect GitHub
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
