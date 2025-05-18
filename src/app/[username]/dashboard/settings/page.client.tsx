'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth-context';
import { useToast } from '@/hooks/use-toast';
import { db } from '@/lib/firebase/config';
import { doc, getDoc } from 'firebase/firestore';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// Import settings components
import { AccountSettings } from '@/components/settings/AccountSettings';
import { PrivacySettings } from '@/components/settings/PrivacySettings';
import { NotificationSettings } from '@/components/settings/NotificationSettings';
import { ApiSettings } from '@/components/settings/ApiSettings';
import { DangerZone } from '@/components/settings/DangerZone';

export default function SettingsPage() {
  const { user, userData, logout } = useAuth();
  const { toast } = useToast();
  const [isLoadingSettings, setIsLoadingSettings] = useState(true);
  
  // Account settings
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [marketingEmails, setMarketingEmails] = useState(false);
  const [twoFactorAuth, setTwoFactorAuth] = useState(false);
  
  // Privacy settings
  const [publicProfile, setPublicProfile] = useState(true);
  const [showEmail, setShowEmail] = useState(false);
  const [analyticsConsent, setAnalyticsConsent] = useState(true);
  
  // Notification settings
  const [mentionNotifications, setMentionNotifications] = useState(true);
  const [newsletterFrequency, setNewsletterFrequency] = useState('weekly');
  
  // API settings
  const [apiKey, setApiKey] = useState('');
  const [webhookUrl, setWebhookUrl] = useState('');
  const [webhookEvents, setWebhookEvents] = useState({
    postPublished: false,
    subscriberAdded: false,
    formSubmission: false
  });
  
  // Load user settings from Firestore
  useEffect(() => {
    async function loadUserSettings() {
      if (!user) return;
      
      try {
        setIsLoadingSettings(true);
        const userSettingsDoc = await getDoc(doc(db, 'Users', user.uid, 'settings', 'preferences'));
        
        if (userSettingsDoc.exists()) {
          const data = userSettingsDoc.data();
          
          // Update state with loaded settings
          setEmailNotifications(data.emailNotifications ?? true);
          setMarketingEmails(data.marketingEmails ?? false);
          setTwoFactorAuth(data.twoFactorAuth ?? false);
          setPublicProfile(data.publicProfile ?? true);
          setShowEmail(data.showEmail ?? false);
          setAnalyticsConsent(data.analyticsConsent ?? true);
          setMentionNotifications(data.mentionNotifications ?? true);
          setNewsletterFrequency(data.newsletterFrequency ?? 'weekly');
          setApiKey(data.apiKey ?? '');
          setWebhookUrl(data.webhookUrl ?? '');
          setWebhookEvents({
            postPublished: data.webhookEvents?.postPublished ?? false,
            subscriberAdded: data.webhookEvents?.subscriberAdded ?? false,
            formSubmission: data.webhookEvents?.formSubmission ?? false
          });
        }
      } catch (error) {
        console.error('Error loading user settings:', error);
        toast({
          title: 'Error',
          description: 'Failed to load your settings. Please try again.',
          variant: 'destructive',
        });
      } finally {
        setIsLoadingSettings(false);
      }
    }
    
    loadUserSettings();
  }, [user, toast]);
  
  if (!user) {
    return <div className="p-8 text-center">Please log in to view settings.</div>;
  }
  
  return (
    <div className="container py-10">
      <h1 className="text-3xl font-bold mb-6">Settings</h1>
      
      <Tabs defaultValue="account" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="account">Account</TabsTrigger>
          <TabsTrigger value="privacy">Privacy</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="api">API</TabsTrigger>
          <TabsTrigger value="danger">Danger Zone</TabsTrigger>
        </TabsList>
        
        <TabsContent value="account" className="space-y-4">
          <AccountSettings 
            user={user}
            userData={userData}
            emailNotifications={emailNotifications}
            setEmailNotifications={setEmailNotifications}
            marketingEmails={marketingEmails}
            setMarketingEmails={setMarketingEmails}
            twoFactorAuth={twoFactorAuth}
            setTwoFactorAuth={setTwoFactorAuth}
          />
        </TabsContent>
        
        <TabsContent value="privacy" className="space-y-4">
          <PrivacySettings 
            user={user}
            publicProfile={publicProfile}
            setPublicProfile={setPublicProfile}
            showEmail={showEmail}
            setShowEmail={setShowEmail}
            analyticsConsent={analyticsConsent}
            setAnalyticsConsent={setAnalyticsConsent}
          />
        </TabsContent>
        
        <TabsContent value="notifications" className="space-y-4">
          <NotificationSettings 
            user={user}
            mentionNotifications={mentionNotifications}
            setMentionNotifications={setMentionNotifications}
            newsletterFrequency={newsletterFrequency}
            setNewsletterFrequency={setNewsletterFrequency}
          />
        </TabsContent>
        
        <TabsContent value="api" className="space-y-4">
          <ApiSettings 
            user={user}
            apiKey={apiKey}
            setApiKey={setApiKey}
            webhookUrl={webhookUrl}
            setWebhookUrl={setWebhookUrl}
            webhookEvents={webhookEvents}
            setWebhookEvents={setWebhookEvents}
          />
        </TabsContent>
        
        <TabsContent value="danger" className="space-y-4">
          <DangerZone 
            user={user}
            logout={logout}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
