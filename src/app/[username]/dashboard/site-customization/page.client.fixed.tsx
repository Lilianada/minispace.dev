'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { collection, query, where, getDocs, doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import useAuth from '@/hooks/useAuth';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface UserSettings {
  theme?: string;
  mode?: 'light' | 'dark' | 'auto';
  customCSS?: string;
  siteTitle?: string;
  siteDescription?: string;
}

export default function SiteCustomizationPage({ username }: { username: string }) {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [userSettings, setUserSettings] = useState<UserSettings>({});
  const [activeTab, setActiveTab] = useState('themes');
  
  const { user } = useAuth();
  const router = useRouter();

  // Fetch user data and settings
  useEffect(() => {
    const fetchUserData = async () => {
      if (!db) {
        console.error('Firebase not initialized');
        setError('Could not connect to database. Please try again later.');
        setLoading(false);
        return;
      }
      
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
            theme: 'altay',
            mode: 'light',
          });
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        setError('Failed to load user data');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [username]);

  // Save settings function
  const saveSettings = async () => {
    if (!userId || !db) return;
    
    try {
      setSaving(true);
      setError(null);
      
      const settingsDocRef = doc(db, 'Users', userId, 'userSettings', 'theme');
      
      // Update user settings
      await updateDoc(settingsDocRef, userSettings as any);
      
      setSuccessMessage('Settings saved successfully!');
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (error) {
      console.error('Error saving settings:', error);
      setError('Failed to save settings. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  // Helper function to update settings
  const updateSettings = (updates: Partial<UserSettings>) => {
    setUserSettings(prev => ({ ...prev, ...updates }));
  };

  // Loading state
  if (loading) {
    return (
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Site Customization</h1>
        <Card>
          <CardHeader>
            <CardTitle>Loading...</CardTitle>
          </CardHeader>
          <CardContent>
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-3/4 mb-2" />
            <Skeleton className="h-4 w-1/2" />
          </CardContent>
        </Card>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Site Customization</h1>
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
        <Button className="mt-4" onClick={() => router.refresh()}>
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Site Customization</h1>
      
      {successMessage && (
        <Alert className="mb-4 bg-green-50 text-green-800 border-green-200">
          <AlertDescription>{successMessage}</AlertDescription>
        </Alert>
      )}
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="themes">Themes</TabsTrigger>
          <TabsTrigger value="content">Content</TabsTrigger>
          <TabsTrigger value="layout">Layout</TabsTrigger>
          <TabsTrigger value="advanced">Advanced</TabsTrigger>
        </TabsList>
        
        <TabsContent value="themes">
          <Card>
            <CardHeader>
              <CardTitle>Theme Selection</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <p className="mb-2">Currently using theme: <strong>{userSettings.theme || "Default"}</strong></p>
                <Link href={`/${username}/dashboard/themes`} className="text-blue-500 hover:underline">
                  Browse available themes
                </Link>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="content">
          <Card>
            <CardHeader>
              <CardTitle>Site Content</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <Label htmlFor="siteTitle" className="block mb-2">Site Title</Label>
                <Input
                  id="siteTitle"
                  placeholder="Your site title"
                  value={userSettings.siteTitle || ''}
                  onChange={(e) => updateSettings({ siteTitle: e.target.value })}
                />
              </div>
              
              <div className="mb-4">
                <Label htmlFor="siteDescription" className="block mb-2">Site Description</Label>
                <Textarea
                  id="siteDescription"
                  placeholder="A short description of your site"
                  value={userSettings.siteDescription || ''}
                  onChange={(e) => updateSettings({ siteDescription: e.target.value })}
                  className="w-full h-24"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="layout">
          <Card>
            <CardHeader>
              <CardTitle>Layout Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <p>Layout customization options will be available soon.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="advanced">
          <Card>
            <CardHeader>
              <CardTitle>Advanced Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <Label htmlFor="customCSS" className="block mb-2">Custom CSS</Label>
                <Textarea
                  id="customCSS"
                  className="w-full h-32"
                  placeholder="/* Custom CSS styles */"
                  value={userSettings.customCSS || ''}
                  onChange={(e) => updateSettings({ customCSS: e.target.value })}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      <div className="mt-4">
        <Button onClick={saveSettings} disabled={saving}>
          {saving ? 'Saving...' : 'Save Settings'}
        </Button>
      </div>
    </div>
  );
}
