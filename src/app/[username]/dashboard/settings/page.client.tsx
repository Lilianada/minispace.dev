'use client';

import { useState, useEffect } from 'react';
import useAuth from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { db } from '@/lib/firebase/config';
import { doc, getDoc } from 'firebase/firestore';
import { isAuthContextUserData } from '@/lib/type-adapters';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

// Import settings components
import { AccountSettings } from '@/components/settings/AccountSettings';
import { PrivacySettings } from '@/components/settings/PrivacySettings';
import { NotificationSettings } from '@/components/settings/NotificationSettings';
import { ApiSettings } from '@/components/settings/ApiSettings';
import { DangerZone } from '@/components/settings/DangerZone';
import { SettingsHeader } from '@/components/settings/SettingsHeader';
import { Skeleton } from '@/components/ui/skeleton';
import { StorageUsage } from '@/components/ui/storage-usage';

export default function SettingsPage() {
  const { user, userData, loading: authLoading } = useAuth();
  const { toast } = useToast();
  const pathname = usePathname();
  
  // Ensure userData is of the correct type
  const validUserData = isAuthContextUserData(userData) ? userData : null;
  
  // State for loading
  const [isLoadingSettings, setIsLoadingSettings] = useState(true);
  
  // We'll need to implement logout functionality since it's not in the useAuth hook
  const logout = async () => {
    try {
      // Implement logout functionality here
      window.location.href = '/discover';
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

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
      // Add an additional check for user to satisfy TypeScript
      if (!user) return;

      try {
        setIsLoadingSettings(true);
        console.log(`Loading settings for user ${user.uid}`);
        
        // Reference to the user's settings document
        const settingsRef = doc(db, 'Users', user.uid, 'settings', 'preferences');
        console.log(`Settings path: ${settingsRef.path}`);
        
        const userSettingsDoc = await getDoc(settingsRef);

        if (userSettingsDoc.exists()) {
          console.log('Settings document exists, loading data');
          const data = userSettingsDoc.data();
          console.log('Settings data:', data);

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
        } else {
          console.log('Settings document does not exist, using default values');
        }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        console.error('Error loading user settings:', error);
        console.error('Error details:', errorMessage);
        toast({
          title: 'Error',
          description: `Failed to load your settings: ${errorMessage}`,
          variant: 'destructive',
        });
      } finally {
        setIsLoadingSettings(false);
      }
    }

    loadUserSettings();
    // Only run this effect once when the component mounts and when user changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  if (authLoading || isLoadingSettings) {
    return (
      <div className="container py-10">
        <h1 className="text-3xl font-semibold mb-6">Settings</h1>
        <Card>
          <CardHeader>
            <Skeleton className="h-8 w-1/3" />
            <Skeleton className="h-4 w-2/3" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!user || !validUserData) {
    return <div className="p-8 text-center">Please log in to view settings.</div>;
  }
  
  // Helper function to generate settings links with the correct username
  const getSettingsLink = (path: string) => {
    if (!validUserData) return '#';
    return `/${validUserData.username}/dashboard/settings${path}`;
  };
  
  // Define the settings navigation items
  const settingsNavigation = [
    { name: 'Account', href: getSettingsLink(''), current: pathname.endsWith('/settings') },
    { name: 'Domain', href: getSettingsLink('/domain'), current: pathname.includes('/settings/domain') },
    { name: 'Storage', href: getSettingsLink('/storage'), current: pathname.includes('/settings/storage') },
    { name: 'Appearance', href: getSettingsLink('/appearance'), current: pathname.includes('/settings/appearance') },
    { name: 'Integrations', href: getSettingsLink('/integrations'), current: pathname.includes('/settings/integrations') },
  ];

  return (
    <div className="container py-8">
      <div className="space-y-8">
        <div className="flex justify-between items-center">
          <h2 className="text-3xl font-semibold">Settings</h2>
          
        </div>
        
        <SettingsHeader user={user} userData={validUserData} />
        
        {/* Settings navigation */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="md:col-span-1">
            <div className="space-y-1">
              <nav className="flex flex-col space-y-1">
                {settingsNavigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`px-3 py-2 rounded-md text-sm font-medium ${item.current
                      ? 'bg-primary/10 text-primary'
                      : 'text-muted-foreground hover:bg-accent hover:text-background'
                    }`}
                  >
                    {item.name}
                  </Link>
                ))}
              </nav>
              
              <div className="mt-6">
                <StorageUsage compact />
              </div>
            </div>
          </div>
          
          <div className="md:col-span-3">
            {/* Only show the account settings tabs on the main settings page */}
            {pathname.endsWith('/settings') && (
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
                    userData={validUserData}
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
            )}
            
            {/* Other settings pages will be rendered in their own routes */}
          </div>
        </div>
      </div>
    </div>
  );
}
