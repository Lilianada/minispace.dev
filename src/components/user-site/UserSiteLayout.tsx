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

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <h1 className="text-2xl font-bold text-destructive mb-4">{error}</h1>
        <p className="text-muted-foreground">
          There was an error loading this site. Please try again later.
        </p>
      </div>
    );
  }

  if (!themeComponent) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <h1 className="text-2xl font-bold mb-4">Theme not available</h1>
        <p className="text-muted-foreground">
          The selected theme is not available. Please select a different theme.
        </p>
      </div>
    );
  }

  // Render the user's site with their chosen theme
  const ThemeLayout = themeComponent;
  
  return (
    <ThemeLayout 
      config={{
        siteName: `${username}'s Site`,
        description: `Personal site of ${username}`,
        theme: userTheme?.themeName || 'Default',
        navigation: [
          { label: 'Home', href: `/${username}` },
          { label: 'Posts', href: `/${username}/posts` },
          { label: 'About', href: `/${username}/about` },
        ]
      }}
    >
      {children}
    </ThemeLayout>
  );
}
