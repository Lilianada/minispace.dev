'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import ThemePreviewer from '@/components/theme/ThemePreviewer';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface ThemeColorOption {
  label: string;
  value: string;
  variable: string;
}

interface ThemeFontOption {
  label: string;
  value: string;
  variable: string;
}

interface ThemeToggleOption {
  label: string;
  type: string;
  value: boolean | string | number;
  options?: Array<{ label: string; value: string | boolean | number }>;
}

interface ThemeCustomization {
  colors: Record<string, ThemeColorOption>;
  fonts: Record<string, ThemeFontOption>;
  options: Record<string, ThemeToggleOption>;
}

interface ThemeData {
  id: string;
  name: string;
  description: string;
  version: string;
  author: string;
  thumbnail?: string;
  customization: ThemeCustomization;
}

interface CustomizationState {
  colors: Record<string, string>;
  fonts: Record<string, string>;
  options: Record<string, boolean | string | number>;
}

export default function CustomizeThemePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const themeId = searchParams?.get('theme') || 'altay';
  
  const [theme, setTheme] = useState<ThemeData | null>(null);
  const [customizations, setCustomizations] = useState<CustomizationState>({
    colors: {},
    fonts: {},
    options: {}
  });
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('colors');
  
  // Load the theme data
  useEffect(() => {
    async function loadTheme() {
      try {
        setIsLoading(true);
        const response = await fetch(`/api/theme-preview?theme=${themeId}`);
        if (!response.ok) {
          throw new Error('Failed to load theme data');
        }
        
        const themeResponse = await fetch(`/api/themes/${themeId}`);
        if (!themeResponse.ok) {
          throw new Error('Failed to load theme customization options');
        }
        
        const themeData = await themeResponse.json();
        setTheme(themeData);
        
        // Initialize with theme defaults
        const defaultCustomizations: CustomizationState = {
          colors: {} as Record<string, string>,
          fonts: {} as Record<string, string>,
          options: {} as Record<string, boolean | string | number>
        };
        
        // Set default colors
        if (themeData.customization?.colors) {
          Object.entries(themeData.customization.colors).forEach(([key, option]) => {
            defaultCustomizations.colors[key] = (option as ThemeColorOption).value;
          });
        }
        
        // Set default fonts
        if (themeData.customization?.fonts) {
          Object.entries(themeData.customization.fonts).forEach(([key, option]) => {
            defaultCustomizations.fonts[key] = (option as ThemeFontOption).value;
          });
        }
        
        // Set default options
        if (themeData.customization?.options) {
          Object.entries(themeData.customization.options).forEach(([key, option]) => {
            defaultCustomizations.options[key] = (option as ThemeToggleOption).value;
          });
        }
        
        setCustomizations(defaultCustomizations);
        setIsLoading(false);
      } catch (error) {
        console.error('Error loading theme:', error);
        setIsLoading(false);
      }
    }
    
    loadTheme();
  }, [themeId]);
  
  // Handle color change
  const handleColorChange = (colorId: string, value: string) => {
    setCustomizations(prev => ({
      ...prev,
      colors: {
        ...prev.colors,
        [colorId]: value
      }
    }));
  };
  
  // Handle font change
  const handleFontChange = (fontId: string, value: string) => {
    setCustomizations(prev => ({
      ...prev,
      fonts: {
        ...prev.fonts,
        [fontId]: value
      }
    }));
  };
  
  // Handle option change
  const handleOptionChange = (optionId: string, value: boolean | string | number) => {
    setCustomizations(prev => ({
      ...prev,
      options: {
        ...prev.options,
        [optionId]: value
      }
    }));
  };
  
  // Save the customizations
  const handleSave = async () => {
    try {
      const { authFetch } = await import('@/lib/api-utils');
      
      const response = await authFetch('/api/user/theme-settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          themeId,
          themeName: theme?.name,
          themeCategory: 'personal',
          settings: customizations
        })
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to save theme settings');
      }
      
      // Redirect to dashboard or confirmation page
      router.push('/dashboard?saved=theme');
    } catch (error) {
      console.error('Error saving theme settings:', error);
      alert(`Error saving theme settings: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };
  
  if (isLoading || !theme) {
    return <div className="flex justify-center items-center h-screen">Loading theme customizer...</div>;
  }
  
  return (
    <div className="customize-theme-container h-screen flex">
      {/* Left sidebar for customization controls */}
      <div className="customize-controls w-80 border-r bg-background overflow-y-auto p-4">
        <div className="mb-6">
          <h1 className="text-2xl font-bold mb-2">{theme.name}</h1>
          <p className="text-sm text-muted-foreground">{theme.description}</p>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="w-full">
            <TabsTrigger value="colors" className="flex-1">Colors</TabsTrigger>
            <TabsTrigger value="fonts" className="flex-1">Fonts</TabsTrigger>
            <TabsTrigger value="options" className="flex-1">Options</TabsTrigger>
          </TabsList>
          
          <TabsContent value="colors" className="space-y-4 mt-4">
            {theme?.customization?.colors && Object.entries(theme.customization.colors).map(([colorId, option]) => (
              <div key={colorId} className="grid gap-2">
                <Label htmlFor={`color-${colorId}`}>{option.label}</Label>
                <div className="flex gap-2">
                  <Input
                    id={`color-${colorId}`}
                    type="color"
                    value={customizations.colors[colorId] || option.value}
                    onChange={e => handleColorChange(colorId, e.target.value)}
                    className="w-12 h-8 p-1"
                  />
                  <Input
                    type="text"
                    value={customizations.colors[colorId] || option.value}
                    onChange={e => handleColorChange(colorId, e.target.value)}
                    className="flex-1"
                  />
                </div>
              </div>
            ))}
          </TabsContent>
          
          <TabsContent value="fonts" className="space-y-4 mt-4">
            {theme?.customization?.fonts && Object.entries(theme.customization.fonts).map(([fontId, option]) => (
              <div key={fontId} className="grid gap-2">
                <Label htmlFor={`font-${fontId}`}>{option.label}</Label>
                <Input
                  id={`font-${fontId}`}
                  type="text"
                  value={customizations.fonts[fontId] || option.value}
                  onChange={e => handleFontChange(fontId, e.target.value)}
                />
              </div>
            ))}
          </TabsContent>
          
          <TabsContent value="options" className="space-y-4 mt-4">
            {theme?.customization?.options && Object.entries(theme.customization.options).map(([optionId, option]) => (
              <div key={optionId} className="grid gap-2">
                <Label htmlFor={`option-${optionId}`}>{option.label}</Label>
                {option.type === 'boolean' ? (
                  <Select 
                    value={String(customizations.options[optionId] ?? option.value)} 
                    onValueChange={value => handleOptionChange(optionId, value === 'true')}
                  >
                    <SelectTrigger id={`option-${optionId}`}>
                      <SelectValue placeholder="Select option" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="true">Enabled</SelectItem>
                      <SelectItem value="false">Disabled</SelectItem>
                    </SelectContent>
                  </Select>
                ) : option.type === 'select' && option.options ? (
                  <Select 
                    value={String(customizations.options[optionId] ?? option.value)} 
                    onValueChange={value => handleOptionChange(optionId, value)}
                  >
                    <SelectTrigger id={`option-${optionId}`}>
                      <SelectValue placeholder="Select option" />
                    </SelectTrigger>
                    <SelectContent>
                      {option.options.map((opt) => (
                        <SelectItem key={String(opt.value)} value={String(opt.value)}>{opt.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : (
                  <Input
                    id={`option-${optionId}`}
                    type="text"
                    value={String(customizations.options[optionId] ?? option.value)}
                    onChange={e => handleOptionChange(optionId, e.target.value)}
                  />
                )}
              </div>
            ))}
          </TabsContent>
        </Tabs>
        
        <div className="mt-8 space-y-2">
          <Button className="w-full" onClick={handleSave}>
            Save Customizations
          </Button>
          <Button variant="outline" className="w-full" onClick={() => router.back()}>
            Cancel
          </Button>
        </div>
      </div>
      
      {/* Right area for theme preview */}
      <div className="theme-preview-area flex-1 overflow-hidden">
        <ThemePreviewer 
          themeId={themeId} 
          initialCustomizations={customizations}
        />
      </div>
    </div>
  );
}
