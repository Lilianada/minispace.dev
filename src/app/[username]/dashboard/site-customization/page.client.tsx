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
import PageBlocksEditor from '@/components/site-customization/PageBlocksEditor';
import ThemeSelector from '@/components/site-customization/ThemeSelector';
import PageManager from '@/components/site-customization/PageManager';
import CustomCSSManager from '@/components/site-customization/CustomCSSManager';
import CustomCSSEditor from '@/components/site-customization/CustomCSSEditor';
import { CustomizationHeader } from '@/components/site-customization/CustomizationHeader';

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
            theme: 'minimal',
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
      {/* Customization header with preview button */}
      <CustomizationHeader username={username} />
      
      <div className="mt-6 flex flex-col md:flex-row gap-4">
        {/* WordPress-style sidebar navigation */}
        <div className="w-full md:w-64 shrink-0">
          <div className="bg-card border rounded-lg overflow-hidden">
            <div className="p-4 border-b font-medium">Site Customization</div>
            <div className="divide-y">
              <button
                onClick={() => setActiveSection('appearance')}
                className={`w-full text-left p-4 flex items-center gap-2 transition-colors ${activeSection === 'appearance' ? 'bg-primary/10 text-primary' : 'hover:bg-accent'}`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span>Appearance</span>
              </button>
              
              <button
                onClick={() => setActiveSection('pages')}
                className={`w-full text-left p-4 flex items-center gap-2 transition-colors ${activeSection === 'pages' ? 'bg-primary/10 text-primary' : 'hover:bg-accent'}`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1M19 8l-7 7-7-7" />
                </svg>
                <span>Pages</span>
              </button>
              
              <button
                onClick={() => setActiveSection('custom-css')}
                className={`w-full text-left p-4 flex items-center gap-2 transition-colors ${activeSection === 'custom-css' ? 'bg-primary/10 text-primary' : 'hover:bg-accent'}`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                </svg>
                <span>Custom CSS</span>
              </button>
            </div>
          </div>
          
          {/* Page selector (only visible when in pages section) */}
          {activeSection === 'pages' && (
            <div className="mt-4 bg-card border rounded-lg overflow-hidden">
              <div className="p-4 border-b font-medium">Pages</div>
              <div className="p-4">
                <PageManager
                  pages={siteCustomization.pages}
                  userId={userId}
                  activePage={activePage}
                  onPageChange={setActivePage}
                  onPagesUpdated={(updatedPages) => {
                    setSiteCustomization({
                      ...siteCustomization,
                      pages: updatedPages
                    });
                  }}
                />
              </div>
            </div>
          )}
        </div>
        
        {/* Main content area */}
        <div className="flex-1">
          {/* Appearance section */}
          {activeSection === 'appearance' && (
            <div className="bg-card border rounded-lg overflow-hidden">
              <div className="p-4 border-b font-medium">Theme Selection</div>
              <div className="p-4">
                <ThemeSelector 
                  currentTheme={userSettings.theme} 
                  userId={userId} 
                />
              </div>
            </div>
          )}
          
          {/* Pages section */}
          {activeSection === 'pages' && (
            <div className="bg-card border rounded-lg overflow-hidden">
              <div className="p-4 border-b font-medium">
                {activePage && siteCustomization.pages[activePage] 
                  ? `Editing: ${siteCustomization.pages[activePage].title}` 
                  : 'Page Editor'}
              </div>
              <div className="p-4">
                {activePage && activePage !== '' && siteCustomization.pages[activePage] ? (
                  <PageBlocksEditor 
                    key={activePage}
                    page={siteCustomization.pages[activePage]} 
                    userId={userId} 
                  />
                ) : (
                  <div className="p-8 border-2 border-dashed rounded-lg flex flex-col items-center justify-center text-center">
                    <p className="text-muted-foreground mb-4">Select a page from the sidebar or create a new page to start editing.</p>
                  </div>
                )}
              </div>
            </div>
          )}
          
          {/* Custom CSS section */}
          {activeSection === 'custom-css' && (
            <div className="bg-card border rounded-lg overflow-hidden">
              <div className="p-4 border-b font-medium">Custom CSS</div>
              <div className="p-4">
                <CustomCSSEditor 
                  initialCSS={userSettings.customCSS || ''} 
                  userId={userId} 
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
