'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { useToast } from '@/hooks/use-toast';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import ThemeSelector from '@/components/site-customization/ThemeSelector';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export default function ThemesPage({ params }: { params: { username: string } }) {
  const { user, userData } = useAuth();
  const { toast } = useToast();
  const [currentTheme, setCurrentTheme] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchThemeSettings = async () => {
      if (!user) return;

      try {
        setIsLoading(true);
        const themeRef = doc(db, 'users', user.uid, 'userSettings', 'theme');
        const themeDoc = await getDoc(themeRef);

        if (themeDoc.exists()) {
          setCurrentTheme(themeDoc.data().themeId || 'personal/rubik');
        } else {
          // Default theme if none is set
          setCurrentTheme('personal/rubik');
        }
      } catch (error) {
        console.error('Error fetching theme settings:', error);
        toast({
          title: 'Error',
          description: 'Failed to load theme settings.',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchThemeSettings();
  }, [user, toast]);

  // Show loading state if user data is still loading
  if (isLoading) {
    return (
      <div className="container py-10">
        <h1 className="text-3xl font-bold mb-6">Theme Settings</h1>
        <Card>
          <CardContent className="py-10">
            <div className="space-y-4">
              <Skeleton className="h-10 w-full" />
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Skeleton className="h-64 w-full" />
                <Skeleton className="h-64 w-full" />
                <Skeleton className="h-64 w-full" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container py-10">
      <h1 className="text-3xl font-bold mb-6">Theme Settings</h1>
      
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Choose a Theme</CardTitle>
          <CardDescription>
            Select a theme that best represents your personal style
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              <Skeleton className="h-10 w-full" />
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Skeleton className="h-64 w-full" />
                <Skeleton className="h-64 w-full" />
                <Skeleton className="h-64 w-full" />
              </div>
            </div>
          ) : (
            <ThemeSelector
              currentTheme={currentTheme || 'personal/rubik'}
              userId={user?.uid || ''}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
