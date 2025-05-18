'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { allThemes } from '@/themes';
import { doc, getDoc, updateDoc, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import useAuth from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

export default function ThemePreviewPage({ params }: { params: Promise<{ username: string; themeId: string }> }) {
  // Unwrap params using React.use
  const unwrappedParams = React.use(params);
  
  const { username, themeId } = unwrappedParams;
  const router = useRouter();
  const { user, userData } = useAuth();
  const { toast } = useToast();
  const [isApplying, setIsApplying] = useState(false);
  
  // Decode the themeId from URL format
  const decodedThemeId = decodeURIComponent(themeId);
  
  // Parse the theme ID to get category and theme name
  const [category, themeName] = decodedThemeId.split('/');
  
  // Find the theme
  const theme = allThemes.find(
    t => t.category === category && t.name.toLowerCase() === themeName
  );
  
  useEffect(() => {
    // Redirect if theme not found
    if (!theme) {
      toast({
        title: 'Theme not found',
        description: `The theme "${decodedThemeId}" could not be found.`,
        variant: 'destructive',
      });
      router.push(`/${username}/dashboard/site-customization/themes`);
    }
  }, [theme, decodedThemeId, router, username, toast]);
  
  if (!theme || !theme.preview) {
    return null;
  }
  
  const ThemePreviewComponent = theme.preview;
  
  const handleApplyTheme = async () => {
    if (!user || !userData || userData.username !== username) {
      toast({
        title: 'Permission denied',
        description: 'You can only update your own site settings.',
        variant: 'destructive',
      });
      return;
    }
    
    try {
      setIsApplying(true);
      const userSettingsRef = doc(db, 'users', user.uid, 'userSettings', 'theme');
      
      // Check if the document exists
      const docSnap = await getDoc(userSettingsRef);
      
      const themeData = {
        themeId: decodedThemeId,
        themeName: theme.name,
        themeCategory: category,
        updatedAt: new Date(),
      };
      
      // If the document exists, update it; otherwise, create it
      if (docSnap.exists()) {
        await updateDoc(userSettingsRef, themeData);
      } else {
        // Add createdAt field for new documents
        await setDoc(userSettingsRef, {
          ...themeData,
          createdAt: new Date(),
        });
      }
      
      toast({
        title: 'Theme applied',
        description: `The ${theme.name} theme has been applied to your site.`,
      });
      
      // Redirect to themes page
      router.push(`/${username}/dashboard/site-customization/themes`);
    } catch (error) {
      console.error('Error applying theme:', error);
      toast({
        title: 'Error applying theme',
        description: 'There was an error applying the theme. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsApplying(false);
    }
  };
  
  return (
    <div className="flex flex-col h-screen">
      <div className="flex items-center justify-between p-4 border-b bg-background">
        <div>
          <h1 className="text-xl font-bold">Previewing {theme.name} Theme</h1>
          <p className="text-muted-foreground">{theme.config.description}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => router.back()}>
            Back to Themes
          </Button>
          <Button onClick={handleApplyTheme} disabled={isApplying}>
            {isApplying ? 'Applying...' : 'Apply This Theme'}
          </Button>
        </div>
      </div>
      
      <div className="flex-1 overflow-auto">
        <ThemePreviewComponent />
      </div>
    </div>
  );
}
