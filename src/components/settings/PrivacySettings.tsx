'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { doc, getDoc, updateDoc, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import { useToast } from '@/hooks/use-toast';

import { User } from 'firebase/auth';
import { UserData } from '@/lib/auth-context';

interface PrivacySettingsProps {
  user: User | null;
  publicProfile: boolean;
  setPublicProfile: (value: boolean) => void;
  showEmail: boolean;
  setShowEmail: (value: boolean) => void;
  analyticsConsent: boolean;
  setAnalyticsConsent: (value: boolean) => void;
}

export function PrivacySettings({
  user,
  publicProfile,
  setPublicProfile,
  showEmail,
  setShowEmail,
  analyticsConsent,
  setAnalyticsConsent
}: PrivacySettingsProps) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  // Save privacy settings
  const handleSaveSettings = async () => {
    if (!user) {
      toast({
        title: 'Error',
        description: 'You must be logged in to save settings.',
        variant: 'destructive',
      });
      return;
    }
    
    setIsLoading(true);
    try {
      const userSettingsRef = doc(db, 'Users', user.uid, 'settings', 'preferences');
      
      // Prepare the data to update
      const dataToUpdate = {
        publicProfile,
        showEmail,
        analyticsConsent,
        updatedAt: new Date()
      };
      
      // Check if the document exists first
      const docSnap = await getDoc(userSettingsRef);
      
      // If document doesn't exist, create it, otherwise update it
      if (!docSnap.exists()) {
        await setDoc(userSettingsRef, {
          ...dataToUpdate,
          createdAt: new Date()
        });
      } else {
        await updateDoc(userSettingsRef, dataToUpdate);
      }
      
      toast({
        title: 'Settings updated',
        description: 'Your privacy settings have been saved successfully.',
      });
    } catch (error) {
      console.error('Error saving privacy settings:', error);
      toast({
        title: 'Error',
        description: 'Failed to update settings. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Privacy Settings</CardTitle>
        <CardDescription>
          Control your privacy and data sharing preferences.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="public-profile">Public profile</Label>
            <p className="text-sm text-muted-foreground">
              Allow others to view your profile.
            </p>
          </div>
          <Switch
            id="public-profile"
            checked={publicProfile}
            onCheckedChange={setPublicProfile}
            disabled={isLoading}
          />
        </div>
        
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="show-email">Show email</Label>
            <p className="text-sm text-muted-foreground">
              Display your email address on your public profile.
            </p>
          </div>
          <Switch
            id="show-email"
            checked={showEmail}
            onCheckedChange={setShowEmail}
            disabled={isLoading || !publicProfile}
          />
        </div>
        
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="analytics">Analytics consent</Label>
            <p className="text-sm text-muted-foreground">
              Allow us to collect anonymous usage data to improve our service.
            </p>
          </div>
          <Switch
            id="analytics"
            checked={analyticsConsent}
            onCheckedChange={setAnalyticsConsent}
            disabled={isLoading}
          />
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          onClick={handleSaveSettings} 
          disabled={isLoading}
        >
          {isLoading ? 'Saving...' : 'Save Settings'}
        </Button>
      </CardFooter>
    </Card>
  );
}
