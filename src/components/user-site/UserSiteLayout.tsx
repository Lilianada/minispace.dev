'use client';

import React, { useEffect, useState } from 'react';
import { db } from '@/lib/firebase/config';
import { collection, query, where, getDocs, doc, getDoc } from 'firebase/firestore';
import { allThemes, getThemeByName } from '@/themes';
import LoadingDots from '@/components/LoadingDots';
import { Loader } from '@/components/ui/loader';

interface UserSiteLayoutProps {
  username: string;
  children: React.ReactNode;
}

interface UserTheme {
  themeId: string;
  themeName: string;
  themeCategory: string;
}

export default function UserSiteLayout({ username, children }: UserSiteLayoutProps) {
  const [userId, setUserId] = useState<string | null>(null);
  const [userTheme, setUserTheme] = useState<UserTheme | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [themeComponent, setThemeComponent] = useState<React.ComponentType<any> | null>(null);

  useEffect(() => {
    async function fetchUserAndTheme() {
      try {
        setLoading(true);
        
        // Query Users collection to find user by username
        const usersRef = collection(db, 'Users');
        const q = query(usersRef, where('username', '==', username));
        const querySnapshot = await getDocs(q);
        
        if (querySnapshot.empty) {
          setError(`User ${username} not found`);
          setLoading(false);
          return;
        }
        
        // Get the first matching user
        const userDoc = querySnapshot.docs[0];
        const userId = userDoc.id;
        setUserId(userId);
        
        // Fetch user's theme settings
        const themeSettingsRef = doc(db, 'Users', userId, 'userSettings', 'theme');
        const themeSettingsSnap = await getDoc(themeSettingsRef);
        
        let selectedTheme;
        
        if (themeSettingsSnap.exists()) {
          // User has a theme set
          const themeData = themeSettingsSnap.data() as UserTheme;
          setUserTheme(themeData);
          
          // Find the theme in our themes collection
          const [category, themeName] = themeData.themeId.split('/');
          selectedTheme = allThemes.find(theme => 
            theme.category === category && 
            theme.name.toLowerCase() === themeName
          );
        } else {
          // Use default theme (first theme in allThemes)
          selectedTheme = allThemes[0];
          setUserTheme({
            themeId: `${selectedTheme.category}/${selectedTheme.name.toLowerCase()}`,
            themeName: selectedTheme.name,
            themeCategory: selectedTheme.category
          });
        }
        
        if (selectedTheme) {
          // Get the theme's layout component
          const Layout = selectedTheme.components.Layout;
          setThemeComponent(() => Layout);
        } else {
          setError('Theme not found');
        }
        
      } catch (err) {
        console.error('Error fetching user theme:', err);
        setError('Failed to load user theme');
      } finally {
        setLoading(false);
      }
    }
    
    fetchUserAndTheme();
  }, [username]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader size="lg" />
      </div>
    );
  }

  // If there's an error or no theme component, use the default theme as fallback
  if (error || !themeComponent) {
    console.warn(`Using fallback theme due to: ${error || 'Theme component not found'}`);    
    // Get the default theme (first theme in allThemes)
    const defaultTheme = allThemes[0];
    const FallbackLayout = defaultTheme.components.Layout;
    
    // Use the default theme's config with some customizations
    const fallbackConfig = {
      ...defaultTheme.config,
      layout: {
        ...defaultTheme.config.layout,
        header: {
          ...defaultTheme.config.layout.header,
          title: `${username}'s Site`,
          menu: [
            { label: 'Home', path: `/${username}` },
            { label: 'Posts', path: `/${username}/posts` },
            { label: 'About', path: `/${username}/about` },
          ]
        }
      }
    };
    
    return (
      <FallbackLayout
        config={fallbackConfig}
      >
        {error ? (
          <div className="container mx-auto py-8 px-4">
            <div className="bg-destructive/10 text-destructive p-4 rounded-md mb-6">
              <h2 className="text-lg font-semibold mb-2">Theme Error</h2>
              <p>{error}</p>
              <p className="mt-2 text-sm">Using default theme as fallback.</p>
            </div>
            {children}
          </div>
        ) : children}
      </FallbackLayout>
    );
  }

  // Render the user's site with their chosen theme
  const ThemeLayout = themeComponent;
  
  // Get the theme's config and customize it for the user
  const themeInstance = allThemes.find(theme => 
    theme.name === userTheme?.themeName || theme === allThemes[0]
  );
  
  // Create a customized config based on the theme's config
  const customConfig = {
    ...themeInstance?.config,
    layout: {
      ...themeInstance?.config.layout,
      header: {
        ...themeInstance?.config.layout.header,
        title: `${username}'s Site`,
        menu: [
          { label: 'Home', path: `/${username}` },
          { label: 'Posts', path: `/${username}/posts` },
          { label: 'About', path: `/${username}/about` },
        ]
      }
    }
  };
  
  return (
    <ThemeLayout 
      config={customConfig}
    >
      {children}
    </ThemeLayout>
  );
}
