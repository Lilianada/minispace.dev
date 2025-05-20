'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import ThemeRenderer from '@/components/theme/ThemeRenderer';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertCircle, ExternalLink } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export default function SubdomainPreviewPage() {
  const searchParams = useSearchParams();
  const subdomain = searchParams ? searchParams.get('subdomain') : null;
  
  const [isLoading, setIsLoading] = useState(true);
  const [userData, setUserData] = useState<any>(null);
  const [themeData, setThemeData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchUserData = async () => {
      if (!subdomain) {
        setError('No subdomain specified');
        setIsLoading(false);
        return;
      }
      
      try {
        setIsLoading(true);
        
        // Find the user with this subdomain
        const userQuery = query(
          collection(db, 'users'),
          where('username', '==', subdomain)
        );
        
        const userSnapshot = await getDocs(userQuery);
        
        if (userSnapshot.empty) {
          setError(`No user found with subdomain "${subdomain}"`);
          setIsLoading(false);
          return;
        }
        
        // Get the first matching user
        const userDoc = userSnapshot.docs[0];
        const userData = userDoc.data();
        
        // Get the user's theme settings
        const themeSettingsQuery = query(
          collection(db, 'users', userDoc.id, 'userSettings')
        );
        
        const themeSnapshot = await getDocs(themeSettingsQuery);
        let themeData = null;
        
        themeSnapshot.forEach(doc => {
          if (doc.id === 'theme') {
            themeData = doc.data();
          }
        });
        
        setUserData(userData);
        setThemeData(themeData);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching user data:', error);
        setError('Failed to load preview');
        setIsLoading(false);
      }
    };
    
    fetchUserData();
  }, [subdomain]);
  
  if (isLoading) {
    return (
      <div className="container py-10">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Site Preview</h1>
          <Skeleton className="h-10 w-32" />
        </div>
        <div className="space-y-4">
          <Skeleton className="h-64 w-full" />
          <Skeleton className="h-40 w-full" />
          <Skeleton className="h-40 w-full" />
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="container py-10">
        <h1 className="text-3xl font-bold mb-6">Site Preview</h1>
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );
  }
  
  if (!userData || !themeData) {
    return (
      <div className="container py-10">
        <h1 className="text-3xl font-bold mb-6">Site Preview</h1>
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>No data available</AlertTitle>
          <AlertDescription>
            No user or theme data found for this subdomain.
          </AlertDescription>
        </Alert>
      </div>
    );
  }
  
  return (
    <div className="flex flex-col min-h-screen">
      <div className="bg-background border-b p-4 flex justify-between items-center">
        <div>
          <h1 className="text-xl font-bold">Previewing {userData.displayName || userData.username}'s Site</h1>
          <p className="text-muted-foreground">
            This is a preview of how your site will look at{' '}
            <span className="font-medium">{subdomain}.minispace.app</span>
          </p>
        </div>
        <Button variant="outline" asChild>
          <a href={`https://${subdomain}.minispace.app`} target="_blank" rel="noopener noreferrer">
            Visit Live Site <ExternalLink className="h-4 w-4 ml-1" />
          </a>
        </Button>
      </div>
      
      <div className="flex-1">
        {themeData && themeData.themeId ? (
          <ThemeRenderer
            themeId={themeData.themeId}
            pageType="home"
            userData={userData}
          />
        ) : (
          <div className="container py-10">
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>No theme selected</AlertTitle>
              <AlertDescription>
                This user hasn't selected a theme yet. The default theme will be used.
              </AlertDescription>
            </Alert>
          </div>
        )}
      </div>
    </div>
  );
}
