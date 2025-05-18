'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { doc, getDoc, updateDoc, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import { useToast } from '@/hooks/use-toast';

import { User } from 'firebase/auth';
import { UserData } from '@/lib/auth-context';

interface NotificationSettingsProps {
  user: User | null;
  mentionNotifications: boolean;
  setMentionNotifications: (value: boolean) => void;
  newsletterFrequency: string;
  setNewsletterFrequency: (value: string) => void;
}

export function NotificationSettings({
  user,
  mentionNotifications,
  setMentionNotifications,
  newsletterFrequency,
  setNewsletterFrequency
}: NotificationSettingsProps) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  // Save notification settings
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
        mentionNotifications,
        newsletterFrequency,
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
        description: 'Your notification settings have been saved successfully.',
      });
    } catch (error) {
      console.error('Error saving notification settings:', error);
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
        <CardTitle>Notification Settings</CardTitle>
        <CardDescription>
          Manage how and when you receive notifications.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between space-x-2">
          <Label htmlFor="mentions" className="flex flex-col space-y-1">
            <span>Mention notifications</span>
            <span className="font-normal text-sm text-muted-foreground">
              Receive notifications when someone mentions you in a post
            </span>
          </Label>
          <Switch
            id="mentions"
            checked={mentionNotifications}
            onCheckedChange={setMentionNotifications}
            disabled={isLoading}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="newsletter-frequency">Newsletter frequency</Label>
          <Select
            value={newsletterFrequency}
            onValueChange={setNewsletterFrequency}
            disabled={isLoading}
          >
            <SelectTrigger id="newsletter-frequency" className="w-full">
              <SelectValue placeholder="Select frequency" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="daily">Daily</SelectItem>
              <SelectItem value="weekly">Weekly</SelectItem>
              <SelectItem value="monthly">Monthly</SelectItem>
              <SelectItem value="never">Never</SelectItem>
            </SelectContent>
          </Select>
          <p className="text-sm text-muted-foreground">
            How often you want to receive our newsletter.
          </p>
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
