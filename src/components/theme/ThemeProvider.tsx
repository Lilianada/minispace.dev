'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import { allThemes } from '@/themes';
import defaultTheme from '@/themes';

// Helper function to get a theme by ID (category/name format)
function getThemeById(id: string) {
  const [category, themeName] = id.split('/');
  return allThemes.find(
    theme => theme.category === category && theme.name.toLowerCase() === themeName
  );
}

// Define the theme context type
interface ThemeContextType {
  themeId: string;
  themeName: string;
  themeCategory: string;
  theme: any; // The actual theme object
  isLoading: boolean;
  error: string | null;
}

// Create the theme context with default values
const ThemeContext = createContext<ThemeContextType>({
  themeId: 'personal/rubik',
  themeName: 'Rubik',
  themeCategory: 'personal',
  theme: defaultTheme,
  isLoading: true,
  error: null,
});

// Hook to use the theme context
export const useTheme = () => useContext(ThemeContext);

interface ThemeProviderProps {
  userId: string;
  children: React.ReactNode;
}

export default function ThemeProvider({ userId, children }: ThemeProviderProps) {
  const [themeState, setThemeState] = useState<ThemeContextType>({
    themeId: 'personal/rubik',
    themeName: 'Rubik',
    themeCategory: 'personal',
    theme: defaultTheme,
    isLoading: true,
    error: null,
  });

  useEffect(() => {
    const fetchTheme = async () => {
      try {
        // Get the user's theme settings from Firestore
        const themeRef = doc(db, 'users', userId, 'userSettings', 'theme');
        const themeDoc = await getDoc(themeRef);

        if (themeDoc.exists()) {
          const themeData = themeDoc.data();
          const themeId = themeData.themeId || 'personal/rubik';
          const theme = getThemeById(themeId) || defaultTheme;

          setThemeState({
            themeId,
            themeName: themeData.themeName || 'Rubik',
            themeCategory: themeData.themeCategory || 'personal',
            theme,
            isLoading: false,
            error: null,
          });
        } else {
          // If no theme is set, use the default theme
          setThemeState({
            themeId: 'personal/rubik',
            themeName: 'Rubik',
            themeCategory: 'personal',
            theme: defaultTheme,
            isLoading: false,
            error: null,
          });
        }
      } catch (error) {
        console.error('Error fetching theme:', error);
        setThemeState(prev => ({
          ...prev,
          isLoading: false,
          error: 'Failed to load theme. Using default theme.',
        }));
      }
    };

    if (userId) {
      fetchTheme();
    } else {
      // If no user ID is provided, use the default theme
      setThemeState(prev => ({
        ...prev,
        isLoading: false,
      }));
    }
  }, [userId]);

  return (
    <ThemeContext.Provider value={themeState}>
      {children}
    </ThemeContext.Provider>
  );
}
