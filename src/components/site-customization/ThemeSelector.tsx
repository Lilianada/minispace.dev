'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import useAuth from '@/hooks/useAuth';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

interface Theme {
  id: string;
  name: string;
  description: string;
  preview: string;
}

const themes: Theme[] = [
  {
    id: 'minimal',
    name: 'Minimal',
    description: 'Clean and simple design with focus on content',
    preview: '/themes/minimal-preview.png',
  },
  {
    id: 'editorial',
    name: 'Editorial',
    description: 'Magazine-style layout with bold typography',
    preview: '/themes/editorial-preview.png',
  },
  {
    id: 'portfolio',
    name: 'Portfolio',
    description: 'Showcase your work with this visual theme',
    preview: '/themes/portfolio-preview.png',
  },
];

interface ThemeSelectorProps {
  currentTheme: string;
  userId: string;
}

export default function ThemeSelector({ currentTheme, userId }: ThemeSelectorProps) {
  const [selectedTheme, setSelectedTheme] = useState(currentTheme || 'minimal');
  const [isUpdating, setIsUpdating] = useState(false);
  const { user } = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  const handleThemeChange = async () => {
    if (!user || user.uid !== userId) {
      toast({
        title: 'Permission denied',
        description: 'You can only update your own site settings.',
        variant: 'destructive',
      });
      return;
    }

    try {
      setIsUpdating(true);
      const userSettingsRef = doc(db, 'users', userId, 'userSettings', 'theme');
      
      await updateDoc(userSettingsRef, {
        theme: selectedTheme,
      });

      toast({
        title: 'Theme updated',
        description: 'Your site theme has been updated successfully.',
      });
      
      // Refresh the page to show the new theme
      router.refresh();
    } catch (error) {
      console.error('Error updating theme:', error);
      toast({
        title: 'Update failed',
        description: 'There was an error updating your theme. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Select a Theme</h2>
        <p className="text-muted-foreground">
          Choose a theme that best represents your personal style.
        </p>
      </div>

      <RadioGroup
        value={selectedTheme}
        onValueChange={setSelectedTheme}
        className="grid grid-cols-1 md:grid-cols-3 gap-4"
      >
        {themes.map((theme) => (
          <div key={theme.id} className="relative">
            <RadioGroupItem
              value={theme.id}
              id={theme.id}
              className="sr-only"
            />
            <Label
              htmlFor={theme.id}
              className="cursor-pointer"
            >
              <Card className={`overflow-hidden transition-all ${
                selectedTheme === theme.id 
                  ? 'ring-2 ring-primary' 
                  : 'hover:border-primary/50'
              }`}>
                <CardHeader className="p-4">
                  <CardTitle className='flex justify-between'>
                    {theme.name}
                    {selectedTheme === theme.id && (
                    <div className="text-xs bg-primary text-primary-foreground px-2 py-1 rounded-md">Selected</div>
                  )}
                    </CardTitle>
                  <CardDescription>{theme.description}</CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="aspect-video bg-muted relative overflow-hidden">
                    {/* Replace with actual theme preview images */}
                    <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
                      Theme Preview
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Label>
          </div>
        ))}
      </RadioGroup>

      <Button 
        onClick={handleThemeChange} 
        disabled={selectedTheme === currentTheme || isUpdating}
        className="w-full md:w-auto"
      >
        {isUpdating ? 'Updating...' : 'Apply Theme'}
      </Button>
    </div>
  );
}
