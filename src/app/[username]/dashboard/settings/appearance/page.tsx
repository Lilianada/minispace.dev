'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth-context';
import { useToast } from '@/hooks/use-toast';
import { db } from '@/lib/firebase/config';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { Switch } from '@/components/ui/switch';
import { isAuthContextUserData } from '@/lib/type-adapters';

interface ThemeOption {
  id: string;
  name: string;
  description: string;
  previewImage: string;
}

export default function AppearanceSettingsPage({ params }: { params: { username: string } }) {
  const { user, userData, loading: authLoading } = useAuth();
  const { toast } = useToast();
  
  // Ensure userData is of the correct type
  const validUserData = isAuthContextUserData(userData) ? userData : null;
  
  // State for loading
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  
  // Theme settings
  const [selectedTheme, setSelectedTheme] = useState('minimal');
  const [darkMode, setDarkMode] = useState(false);
  const [customFonts, setCustomFonts] = useState(false);
  const [customColors, setCustomColors] = useState({
    primary: '#3b82f6',
    secondary: '#10b981',
    accent: '#8b5cf6',
    background: '#ffffff',
    text: '#1f2937',
  });
  
  // Available themes
  const themes: ThemeOption[] = [
    {
      id: 'minimal',
      name: 'Minimal',
      description: 'Clean and simple design with focus on content',
      previewImage: '/themes/minimal.png'
    },
    {
      id: 'modern',
      name: 'Modern',
      description: 'Contemporary design with bold elements',
      previewImage: '/themes/modern.png'
    },
    {
      id: 'classic',
      name: 'Classic',
      description: 'Traditional blog layout with sidebar',
      previewImage: '/themes/classic.png'
    },
    {
      id: 'portfolio',
      name: 'Portfolio',
      description: 'Showcase your work with large images',
      previewImage: '/themes/portfolio.png'
    }
  ];

  // Fetch appearance settings on component mount
  useEffect(() => {
    const fetchAppearanceSettings = async () => {
      if (!user) return;

      try {
        setIsLoading(true);
        console.log(`Fetching appearance settings for user ${user.uid}`);
        
        // Reference to the appearance settings document
        const appearanceSettingsRef = doc(db, 'Users', user.uid, 'settings', 'appearance');
        console.log(`Appearance settings path: ${appearanceSettingsRef.path}`);
        
        const docSnap = await getDoc(appearanceSettingsRef);

        if (docSnap.exists()) {
          console.log('Appearance settings document exists, loading data');
          const data = docSnap.data();
          console.log('Appearance settings data:', data);
          
          // Update theme settings
          setSelectedTheme(data.theme || 'minimal');
          setDarkMode(data.darkMode || false);
          setCustomFonts(data.customFonts || false);
          
          // Update custom colors if they exist
          if (data.customColors) {
            setCustomColors({
              primary: data.customColors.primary || '#3b82f6',
              secondary: data.customColors.secondary || '#10b981',
              accent: data.customColors.accent || '#8b5cf6',
              background: data.customColors.background || '#ffffff',
              text: data.customColors.text || '#1f2937',
            });
          }
        } else {
          console.log('Appearance settings document does not exist, using default values');
        }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        console.error('Error fetching appearance settings:', error);
        console.error('Error details:', errorMessage);
        toast({
          title: 'Error',
          description: `Failed to load appearance settings: ${errorMessage}`,
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };

    if (user) {
      fetchAppearanceSettings();
    } else {
      setIsLoading(false); // Set loading to false if no user
    }
  }, [user, toast]);

  // Save appearance settings
  const saveAppearanceSettings = async () => {
    if (!user) return;

    try {
      setIsSaving(true);
      
      // Reference to the appearance settings document
      const appearanceSettingsRef = doc(db, 'Users', user.uid, 'settings', 'appearance');
      
      const now = new Date();
      const updateData = {
        theme: selectedTheme,
        darkMode,
        customFonts,
        customColors,
        updatedAt: now,
      };

      // Check if document exists
      const docSnap = await getDoc(appearanceSettingsRef);
      
      if (docSnap.exists()) {
        // Update existing document
        await updateDoc(appearanceSettingsRef, updateData);
      } else {
        // Create new document
        await setDoc(appearanceSettingsRef, {
          ...updateData,
          createdAt: now,
        });
      }

      toast({
        title: 'Success',
        description: 'Appearance settings saved successfully.',
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      console.error('Error saving appearance settings:', error);
      console.error('Error details:', errorMessage);
      toast({
        title: 'Error',
        description: `Failed to save appearance settings: ${errorMessage}`,
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Preview the selected theme
  const previewTheme = () => {
    // Open the preview in a new tab
    window.open(`/${params.username}?preview=true&theme=${selectedTheme}`, '_blank');
  };

  if (authLoading || isLoading) {
    return (
      <div className="container py-10">
        <h1 className="text-3xl font-bold mb-6">Appearance Settings</h1>
        <div className="grid gap-6">
          <Skeleton className="h-[200px] w-full" />
          <Skeleton className="h-[400px] w-full" />
        </div>
      </div>
    );
  }

  if (!user || !validUserData) {
    return <div className="p-8 text-center">Please log in to view appearance settings.</div>;
  }

  return (
    <div className="container py-10">
      <h1 className="text-3xl font-bold mb-6">Appearance Settings</h1>
      
      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Theme Selection</CardTitle>
            <CardDescription>Choose a theme for your site</CardDescription>
          </CardHeader>
          <CardContent>
            <RadioGroup 
              value={selectedTheme} 
              onValueChange={setSelectedTheme}
              className="grid grid-cols-1 md:grid-cols-2 gap-4"
            >
              {themes.map((theme) => (
                <div key={theme.id} className="flex items-start space-x-2">
                  <RadioGroupItem value={theme.id} id={theme.id} className="mt-1" />
                  <div className="grid gap-1.5">
                    <Label htmlFor={theme.id} className="font-medium">{theme.name}</Label>
                    <p className="text-sm text-muted-foreground">{theme.description}</p>
                    <div className="mt-2 border rounded-md overflow-hidden">
                      <div className="aspect-video bg-muted flex items-center justify-center text-xs text-muted-foreground">
                        Theme Preview Image
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </RadioGroup>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={previewTheme}>
              Preview Theme
            </Button>
            <Button onClick={saveAppearanceSettings} disabled={isSaving}>
              {isSaving ? 'Saving...' : 'Save Changes'}
            </Button>
          </CardFooter>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Display Options</CardTitle>
            <CardDescription>Customize how your site looks</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="dark-mode" className="font-medium">Dark Mode</Label>
                <p className="text-sm text-muted-foreground">Enable dark mode for your site</p>
              </div>
              <Switch 
                id="dark-mode" 
                checked={darkMode} 
                onCheckedChange={setDarkMode} 
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="custom-fonts" className="font-medium">Custom Fonts</Label>
                <p className="text-sm text-muted-foreground">Use custom fonts for your site</p>
              </div>
              <Switch 
                id="custom-fonts" 
                checked={customFonts} 
                onCheckedChange={setCustomFonts} 
              />
            </div>
            
            <div>
              <h3 className="text-sm font-medium mb-3">Custom Colors</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="primary-color" className="text-xs">Primary Color</Label>
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-6 h-6 rounded-full border" 
                      style={{ backgroundColor: customColors.primary }}
                    />
                    <input 
                      type="color" 
                      id="primary-color" 
                      value={customColors.primary} 
                      onChange={(e) => setCustomColors({ ...customColors, primary: e.target.value })}
                      className="w-full h-8"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="secondary-color" className="text-xs">Secondary Color</Label>
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-6 h-6 rounded-full border" 
                      style={{ backgroundColor: customColors.secondary }}
                    />
                    <input 
                      type="color" 
                      id="secondary-color" 
                      value={customColors.secondary} 
                      onChange={(e) => setCustomColors({ ...customColors, secondary: e.target.value })}
                      className="w-full h-8"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="accent-color" className="text-xs">Accent Color</Label>
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-6 h-6 rounded-full border" 
                      style={{ backgroundColor: customColors.accent }}
                    />
                    <input 
                      type="color" 
                      id="accent-color" 
                      value={customColors.accent} 
                      onChange={(e) => setCustomColors({ ...customColors, accent: e.target.value })}
                      className="w-full h-8"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="background-color" className="text-xs">Background Color</Label>
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-6 h-6 rounded-full border" 
                      style={{ backgroundColor: customColors.background }}
                    />
                    <input 
                      type="color" 
                      id="background-color" 
                      value={customColors.background} 
                      onChange={(e) => setCustomColors({ ...customColors, background: e.target.value })}
                      className="w-full h-8"
                    />
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button onClick={saveAppearanceSettings} disabled={isSaving} className="w-full">
              {isSaving ? 'Saving...' : 'Save Display Options'}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
