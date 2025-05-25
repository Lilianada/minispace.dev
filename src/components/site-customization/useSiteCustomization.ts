'use client';

import { useState, useEffect } from 'react';
import { collection, query, where, getDocs, doc, getDoc, updateDoc, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import useAuth from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { UserSettings, SiteCustomization } from './types';

export function useSiteCustomization(username: string) {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [userSettings, setUserSettings] = useState<UserSettings | null>(null);
  const [siteCustomization, setSiteCustomization] = useState<SiteCustomization | null>(null);
  const [activePage, setActivePage] = useState<string | null>(null);

  const { user } = useAuth();
  const { toast } = useToast();

  // Helper function to update settings
  const updateSettings = (updates: Partial<UserSettings>) => {
    setUserSettings(prev => prev ? { ...prev, ...updates } : null);
  };

  // Save settings function
  const saveSettings = async () => {
    if (!userId || !userSettings) return;
    
    try {
      setSaving(true);
      setError(null);
      
      const settingsDocRef = doc(db, 'Users', userId, 'userSettings', 'theme');
      
      // First check if the document exists
      const docSnap = await getDoc(settingsDocRef);
      
      if (docSnap.exists()) {
        // Update existing document
        await updateDoc(settingsDocRef, { ...userSettings });
      } else {
        // Create new document with setDoc
        await setDoc(settingsDocRef, { ...userSettings });
      }
      
      // Show success toast
      toast({
        title: 'Success',
        description: 'Your site customization settings have been saved successfully!',
      });
      
      setSuccessMessage('Settings saved successfully!');
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (error) {
      console.error('Error saving settings:', error);
      const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
      
      // Show error toast
      toast({
        title: 'Error',
        description: `Failed to save settings: ${errorMessage}`,
        variant: 'destructive',
      });
      
      setError('Failed to save settings. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  // Fetch user data and settings
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        
        // First, find the user by username
        const usersRef = collection(db, 'Users');
        const q = query(usersRef, where('username', '==', username));
        const querySnapshot = await getDocs(q);
        
        if (querySnapshot.empty) {
          setError('User not found');
          setLoading(false);
          return;
        }
        
        const userDoc = querySnapshot.docs[0];
        const uid = userDoc.id;
        setUserId(uid);
        
        // Fetch user settings
        const userSettingsRef = doc(db, 'Users', uid, 'userSettings', 'theme');
        const userSettingsSnap = await getDoc(userSettingsRef);
        
        if (userSettingsSnap.exists()) {
          setUserSettings(userSettingsSnap.data() as UserSettings);
        } else {
          // Create default settings if none exist
          setUserSettings({
            theme: 'simple',
            mode: 'light',
          });
        }
        
        // Fetch site customization
        const siteCustomizationRef = doc(db, 'Users', uid, 'siteCustomization', 'pages');
        const siteCustomizationSnap = await getDoc(siteCustomizationRef);
        
        if (siteCustomizationSnap.exists()) {
          const data = siteCustomizationSnap.data() as SiteCustomization;
          setSiteCustomization(data);
          
          // Set active page to the first page if available
          if (data.pages && Object.keys(data.pages).length > 0) {
            setActivePage(Object.keys(data.pages)[0]);
          }
        } else {
          // Create default site customization if none exists
          setSiteCustomization({
            pages: {
              home: {
                slug: 'home',
                title: 'Home',
                blocks: []
              },
              about: {
                slug: 'about',
                title: 'About',
                blocks: []
              }
            },
            siteInitialized: false
          });
          setActivePage('home');
        }
      } catch (err) {
        console.error('Error fetching user data:', err);
        setError('Failed to load site customization data');
      } finally {
        setLoading(false);
      }
    };

    if (username) {
      fetchUserData();
    }
  }, [username, user]);

  return {
    loading,
    saving,
    error,
    successMessage,
    userId,
    userSettings,
    siteCustomization,
    activePage,
    updateSettings,
    saveSettings,
    setActivePage
  };
}
