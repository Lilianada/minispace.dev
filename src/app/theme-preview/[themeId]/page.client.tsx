'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { doc, getDoc, updateDoc, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import useAuth from '@/hooks/useAuth';

interface ThemePreviewClientProps {
  theme: {
    id: string;
    name: string;
    category: string;
    preview: React.ComponentType<any>;
  };
}

export default function ThemePreviewClient({ theme }: ThemePreviewClientProps) {
  const router = useRouter();
  const { toast } = useToast();
  const { user } = useAuth();
  const [isApplying, setIsApplying] = React.useState(false);
  
  const ThemePreviewComponent = theme.preview;
  
  const handleSelectTheme = async () => {
    if (!user) {
      toast({
        title: 'Authentication required',
        description: 'You need to be logged in to select a theme.',
        variant: 'destructive',
      });
      return;
    }
    
    try {
      setIsApplying(true);
      
      const userSettingsRef = doc(db, 'Users', user.uid, 'userSettings', 'theme');
      
      // Check if the document exists
      const docSnap = await getDoc(userSettingsRef);
      
      const themeData = {
        themeId: theme.id,
        themeName: theme.name,
        themeCategory: theme.category,
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
        title: 'Theme selected',
        description: `The ${theme.name} theme has been applied to your site.`,
      });
      
      // Close the preview window and redirect back to the themes page
      window.close();
      
      // If the window doesn't close (some browsers prevent this), redirect to the themes page
      setTimeout(() => {
        router.push('/dashboard/site-customization/themes');
      }, 1000);
      
    } catch (error) {
      console.error('Error selecting theme:', error);
      toast({
        title: 'Selection failed',
        description: 'There was an error applying this theme. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsApplying(false);
    }
  };
  
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b py-4 px-6 bg-background sticky top-0 z-10 flex items-center justify-between">
        <h1 className="text-xl font-semibold">
          {theme.name} Theme Preview
        </h1>
        <div className="flex items-center gap-4">
          <div className="text-sm text-muted-foreground">
            Category: {theme.category}
          </div>
          <Button 
            onClick={handleSelectTheme}
            disabled={isApplying}
          >
            {isApplying ? 'Applying...' : 'Select This Theme'}
          </Button>
        </div>
      </header>
      
      <div className="w-full">
        <ThemePreviewComponent />
      </div>
    </div>
  );
}
