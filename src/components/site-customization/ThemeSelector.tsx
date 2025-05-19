'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { doc, getDoc, updateDoc, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import useAuth from '@/hooks/useAuth';
import { UserData } from '@/lib/auth-context';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { themeCategories } from '@/themes';

interface Theme {
  id: string;
  name: string;
  description: string;
  category: string;
  preview?: React.ComponentType<any>;
}

// Convert our theme structure to the format expected by the ThemeSelector
const allThemes: Theme[] = themeCategories.flatMap(category => 
  category.themes.map(theme => ({
    id: `${category.id}/${theme.name.toLowerCase()}`,
    name: theme.name,
    description: theme.config.description,
    category: category.id,
    preview: theme.preview,
  }))
);

interface ThemeSelectorProps {
  currentTheme: string;
  userId: string;
  userData?: UserData | null;
}

export default function ThemeSelector({ currentTheme, userId, userData: propUserData }: ThemeSelectorProps) {
  const [selectedTheme, setSelectedTheme] = useState(currentTheme || 'personal/rubik');
  const [selectedCategory, setSelectedCategory] = useState('personal');
  const [isUpdating, setIsUpdating] = useState(false);
  const { user, userData: authUserData } = useAuth();
  
  // Use userData from props if available, otherwise use from auth context
  const userData = propUserData || authUserData;
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
      
      // Parse the selected theme ID to get category and theme name
      const [category, themeName] = selectedTheme.split('/');
      
      // Find the actual theme object
      const selectedThemeObj = allThemes.find(
        theme => theme.category === category && theme.name.toLowerCase() === themeName
      );
      
      if (!selectedThemeObj) {
        throw new Error('Selected theme not found');
      }
      
      // Check if the document exists
      const docSnap = await getDoc(userSettingsRef);
      
      const themeData = {
        themeId: selectedTheme,
        themeName: selectedThemeObj.name,
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

  // Get unique categories
  const categories = [...new Set(allThemes.map(theme => theme.category))];
  
  // Filter themes by selected category
  const filteredThemes = allThemes.filter(theme => theme.category === selectedCategory);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Select a Theme</h2>
        <p className="text-muted-foreground">
          Choose a theme that best represents your personal style.
        </p>
      </div>

      <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
        <TabsList className="mb-4">
          {categories.map(category => (
            <TabsTrigger key={category} value={category}>
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </TabsTrigger>
          ))}
        </TabsList>
        
        {categories.map(category => (
          <TabsContent key={category} value={category} className="m-0">
            <RadioGroup
              value={selectedTheme}
              onValueChange={setSelectedTheme}
              className="grid grid-cols-1 md:grid-cols-3 gap-4"
            >
              {filteredThemes.map((theme) => {
                const ThemePreview = theme.preview;
                
                return (
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
                          <div className="mt-2 flex flex-wrap gap-2">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                // Open in a new tab instead of navigating in the current window
                                window.open(`/theme-preview/${encodeURIComponent(theme.id)}`, '_blank');
                              }}
                            >
                              Preview Theme
                            </Button>
                            
                            <Button 
                              variant={selectedTheme === theme.id ? "secondary" : "default"}
                              size="sm"
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                setSelectedTheme(theme.id);
                                // Apply the theme immediately if it's not already selected
                                if (selectedTheme !== theme.id) {
                                  // We'll use a timeout to allow the UI to update first
                                  setTimeout(() => handleThemeChange(), 100);
                                }
                              }}
                              disabled={isUpdating || selectedTheme === currentTheme && selectedTheme === theme.id}
                            >
                              {isUpdating && selectedTheme === theme.id ? 'Applying...' : 
                               selectedTheme === currentTheme && selectedTheme === theme.id ? 'Applied' : 'Apply Theme'}
                            </Button>
                          </div>
                        </CardHeader>
                        <CardContent className="p-0">
                          <div className="aspect-video bg-muted relative overflow-hidden">
                            {ThemePreview ? (
                              <div className="h-full w-full scale-[0.6] origin-top-left">
                                <ThemePreview />
                              </div>
                            ) : (
                              <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
                                Theme Preview
                              </div>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    </Label>
                  </div>
                );
              })}
            </RadioGroup>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
