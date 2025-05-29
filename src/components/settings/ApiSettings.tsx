'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Checkbox } from '@/components/ui/checkbox';
import { doc, getDoc, updateDoc, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import { useToast } from '@/hooks/use-toast';

import { User } from 'firebase/auth';
import { UserData } from '@/services/firebase/auth-service';

interface WebhookEvents {
  postPublished: boolean;
  subscriberAdded: boolean;
  formSubmission: boolean;
}

interface ApiSettingsProps {
  user: User | null;
  apiKey: string;
  setApiKey: (value: string) => void;
  webhookUrl: string;
  setWebhookUrl: (value: string) => void;
  webhookEvents: WebhookEvents;
  setWebhookEvents: (value: WebhookEvents) => void;
}

export function ApiSettings({
  user,
  apiKey,
  setApiKey,
  webhookUrl,
  setWebhookUrl,
  webhookEvents,
  setWebhookEvents
}: ApiSettingsProps) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  // Generate new API key
  const handleGenerateApiKey = async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      // Generate a random API key
      const newApiKey = 'ms_' + Math.random().toString(36).substring(2, 15) + 
                       Math.random().toString(36).substring(2, 15);
      
      // Save to Firestore
      const userSettingsRef = doc(db, 'Users', user.uid, 'settings', 'preferences');
      
      // Check if the document exists first
      const docSnap = await getDoc(userSettingsRef);
      
      // If document doesn't exist, create it, otherwise update it
      if (!docSnap.exists()) {
        await setDoc(userSettingsRef, {
          apiKey: newApiKey,
          createdAt: new Date(),
          updatedAt: new Date()
        });
      } else {
        await updateDoc(userSettingsRef, {
          apiKey: newApiKey,
          updatedAt: new Date()
        });
      }
      
      setApiKey(newApiKey);
      
      toast({
        title: 'API Key Generated',
        description: 'Your new API key has been generated successfully.',
      });
    } catch (error) {
      console.error('Error generating API key:', error);
      toast({
        title: 'Error',
        description: 'Failed to generate API key. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Save webhook settings
  const handleSaveWebhookSettings = async () => {
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
        webhookUrl,
        webhookEvents,
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
        description: 'Your webhook settings have been saved successfully.',
      });
    } catch (error) {
      console.error('Error saving webhook settings:', error);
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
        <CardTitle>API Access</CardTitle>
        <CardDescription>
          Manage your API keys and access tokens.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <h3 className="text-lg font-medium">API Key</h3>
          <div className="grid gap-2">
            <Label htmlFor="api-key">Your API Key</Label>
            <div className="flex space-x-2">
              <Input
                id="api-key"
                value={apiKey}
                readOnly
                className="font-mono"
              />
              <Button
                variant="outline"
                size="icon"
                onClick={() => {
                  navigator.clipboard.writeText(apiKey);
                  toast({
                    title: 'Copied',
                    description: 'API key copied to clipboard',
                  });
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-4 w-4"
                >
                  <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
                  <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
                </svg>
              </Button>
            </div>
            <p className="text-sm text-muted-foreground">
              Your API key is used to authenticate your API requests.
            </p>
          </div>
        </div>
        
        <Separator />
        
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Webhooks</h3>
          <div className="grid gap-2">
            <Label htmlFor="webhook-url">Webhook URL</Label>
            <Input
              id="webhook-url"
              placeholder="https://your-site.com/webhook"
              value={webhookUrl}
              onChange={(e) => setWebhookUrl(e.target.value)}
              disabled={isLoading}
            />
            <p className="text-sm text-muted-foreground">
              We'll send POST requests to this URL when events occur.
            </p>
          </div>
          
          <div className="space-y-3">
            <Label>Webhook Events</Label>
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="post-published" 
                checked={webhookEvents.postPublished}
                onCheckedChange={(checked: boolean | 'indeterminate') => 
                  setWebhookEvents({
                    ...webhookEvents,
                    postPublished: checked === true
                  })
                }
                disabled={isLoading}
              />
              <Label htmlFor="post-published" className="text-sm font-normal">
                Post published
              </Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="subscriber-added" 
                checked={webhookEvents.subscriberAdded}
                onCheckedChange={(checked: boolean | 'indeterminate') => 
                  setWebhookEvents({
                    ...webhookEvents,
                    subscriberAdded: checked === true
                  })
                }
                disabled={isLoading}
              />
              <Label htmlFor="subscriber-added" className="text-sm font-normal">
                Subscriber added
              </Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="form-submission" 
                checked={webhookEvents.formSubmission}
                onCheckedChange={(checked: boolean | 'indeterminate') => 
                  setWebhookEvents({
                    ...webhookEvents,
                    formSubmission: checked === true
                  })
                }
                disabled={isLoading}
              />
              <Label htmlFor="form-submission" className="text-sm font-normal">
                Form submission
              </Label>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col sm:flex-row sm:justify-between gap-2">
        <Button
          variant="outline"
          onClick={() => {
            window.open('/docs/api', '_blank');
          }}
        >
          View Documentation
        </Button>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={handleSaveWebhookSettings} 
            disabled={isLoading}
          >
            {isLoading ? 'Saving...' : 'Save Webhook Settings'}
          </Button>
          <Button onClick={handleGenerateApiKey} disabled={isLoading}>
            {isLoading ? 'Generating...' : 'Generate New Key'}
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
