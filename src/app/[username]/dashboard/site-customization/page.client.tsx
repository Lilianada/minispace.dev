'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { collection, query, where, getDocs, doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import useAuth from '@/hooks/useAuth';
import { UserData } from '@/lib/auth-context';
import { isAuthContextUserData } from '@/lib/type-adapters';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';

interface UserSettings {
  theme: string;
  mode: 'light' | 'dark' | 'auto';
  customCSS?: string;
}

interface Page {
  slug: string;
  title: string;
  blocks: any[];
}

interface SiteCustomization {
  pages: Record<string, Page>;
  siteInitialized: boolean;
}

export default function SiteCustomizationClient({ username }: { username: string }) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [userSettings, setUserSettings] = useState<UserSettings | null>(null);
  const [siteCustomization, setSiteCustomization] = useState<SiteCustomization | null>(null);
  const [activePage, setActivePage] = useState<string | null>(null);
  const [activeSection, setActiveSection] = useState('appearance');
  
  const { user, userData, loading: authLoading } = useAuth();
  const router = useRouter();
  
  // Ensure userData is of the correct type
  const validUserData = isAuthContextUserData(userData) ? userData : null;

  // Fetch user data and settings
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        
        // First, find the user by username
        const usersRef = collection(db, 'Users');
        const q = query(usersRef, where('username', '==', username));
        const querySnapshot = await getDocs(q);
        
        if (querySnapshot.empty) {
          setError('User not found');
          setLoading(false);
          return;
        }
        
        const userDoc = querySnapshot.docs[0];
        const uid = userDoc.id;
        setUserId(uid);
        
        // Temporarily disabled permission check for testing
        // TODO: Re-enable this check in production
        // if (!user || user.uid !== uid) {
        //   setError('You do not have permission to customize this site');
        //   setLoading(false);
        //   return;
        // }
        
        // Skip permission check for development purposes
        
        // Fetch user settings
        const userSettingsRef = doc(db, 'Users', uid, 'userSettings', 'theme');
        const userSettingsSnap = await getDoc(userSettingsRef);
        
        if (userSettingsSnap.exists()) {
          setUserSettings(userSettingsSnap.data() as UserSettings);
        } else {
          // Create default settings if none exist
          setUserSettings({
            theme: 'simple',
            mode: 'light',
          });
        }
        
        // Fetch site customization
        const siteCustomizationRef = doc(db, 'Users', uid, 'siteCustomization', 'pages');
        const siteCustomizationSnap = await getDoc(siteCustomizationRef);
        
        if (siteCustomizationSnap.exists()) {
          const data = siteCustomizationSnap.data() as SiteCustomization;
          setSiteCustomization(data);
          
          // Set active page to the first page if available
          if (data.pages && Object.keys(data.pages).length > 0) {
            setActivePage(Object.keys(data.pages)[0]);
          }
        } else {
          // Create default site customization if none exists
          setSiteCustomization({
            pages: {
              home: {
                slug: 'home',
                title: 'Home',
                blocks: []
              },
              about: {
                slug: 'about',
                title: 'About',
                blocks: []
              }
            },
            siteInitialized: false
          });
          setActivePage('home');
        }
      } catch (err) {
        console.error('Error fetching user data:', err);
        setError('Failed to load site customization data');
      } finally {
        setLoading(false);
      }
    };

    if (username) {
      fetchUserData();
    }
  }, [username, user]);

  if (authLoading || loading) {
    return (
      <div className="container py-8">
        <div className="space-y-6">
          <Skeleton className="h-12 w-1/3" />
          <Skeleton className="h-8 w-1/4" />
          <div className="space-y-2">
            <Skeleton className="h-10 w-full" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Skeleton className="h-40 w-full" />
              <Skeleton className="h-40 w-full" />
              <Skeleton className="h-40 w-full" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container py-8">
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  if (!userSettings || !siteCustomization || !userId) {
    return (
      <div className="container py-8">
        <Alert variant="destructive">
          <AlertDescription>Failed to load user settings</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 ">
    </div>
  );
}
