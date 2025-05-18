'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { doc, getDoc, updateDoc, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import useAuth from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { AlertCircle, CheckCircle2, ExternalLink } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';

export default function DomainSettingsPage({ params }: { params: { username: string } }) {
  const router = useRouter();
  const { user } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('subdomain');
  const [subdomainSettings, setSubdomainSettings] = useState({
    subdomain: '',
    isActive: false,
    isVerified: false,
    createdAt: null,
    updatedAt: null,
  });
  const [customDomainSettings, setCustomDomainSettings] = useState({
    domain: '',
    isActive: false,
    isVerified: false,
    createdAt: null,
    updatedAt: null,
  });
  const [subdomainAvailable, setSubdomainAvailable] = useState<boolean | null>(null);
  const [isCheckingAvailability, setIsCheckingAvailability] = useState(false);

  useEffect(() => {
    // Use a local function to avoid re-renders
    const fetchDomainSettings = async () => {
      if (!user) return;

      try {
        setIsLoading(true);
        const domainSettingsRef = doc(db, 'users', user.uid, 'userSettings', 'domain');
        const docSnap = await getDoc(domainSettingsRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          if (data.subdomain) {
            setSubdomainSettings({
              subdomain: data.subdomain,
              isActive: data.subdomainActive || false,
              isVerified: data.subdomainVerified || false,
              createdAt: data.createdAt?.toDate() || null,
              updatedAt: data.updatedAt?.toDate() || null,
            });
          }

          if (data.customDomain) {
            setCustomDomainSettings({
              domain: data.customDomain,
              isActive: data.customDomainActive || false,
              isVerified: data.customDomainVerified || false,
              createdAt: data.createdAt?.toDate() || null,
              updatedAt: data.updatedAt?.toDate() || null,
            });
          }
        }
      } catch (error) {
        console.error('Error fetching domain settings:', error);
        toast({
          title: 'Error',
          description: 'Failed to load domain settings.',
          variant: 'destructive',
        });
      } finally {
        // Set loading to false even if there's an error
        setIsLoading(false);
      }
    };

    // Only fetch if user is available
    if (user) {
      fetchDomainSettings();
    } else {
      setIsLoading(false); // Set loading to false if no user
    }
  }, [user, toast]);

  const checkSubdomainAvailability = async () => {
    if (!subdomainSettings.subdomain) {
      toast({
        title: 'Error',
        description: 'Please enter a subdomain.',
        variant: 'destructive',
      });
      return;
    }

    try {
      setIsCheckingAvailability(true);
      
      // Simple client-side validation for restricted subdomains
      // This avoids unnecessary API calls for obviously invalid subdomains
      const restrictedSubdomains = ['admin', 'blog', 'dashboard', 'api', 'www', 'app', 'support', 'help', 'mail'];
      const isRestricted = restrictedSubdomains.includes(subdomainSettings.subdomain.toLowerCase());
      
      if (isRestricted) {
        setSubdomainAvailable(false);
        toast({
          title: 'Subdomain unavailable',
          description: `The subdomain "${subdomainSettings.subdomain}" is reserved and not available.`,
          variant: 'destructive',
        });
        setIsCheckingAvailability(false);
        return;
      }
      
      // For demo purposes, we'll simulate a quick check
      // In a real app, this would be an API call to check availability in the database
      setTimeout(() => {
        // Simulate availability - most subdomains will be available in our demo
        const isAvailable = true;
        setSubdomainAvailable(isAvailable);
        
        if (!isAvailable) {
          toast({
            title: 'Subdomain unavailable',
            description: `The subdomain "${subdomainSettings.subdomain}" is already taken.`,
            variant: 'destructive',
          });
        }
        
        setIsCheckingAvailability(false);
      }, 300); // Reduced timeout for better UX
    } catch (error) {
      console.error('Error checking subdomain availability:', error);
      toast({
        title: 'Error',
        description: 'Failed to check subdomain availability.',
        variant: 'destructive',
      });
      setIsCheckingAvailability(false);
    }
  };

  const saveSubdomainSettings = async () => {
    if (!user) {
      toast({
        title: 'Error',
        description: 'You must be logged in to save settings.',
        variant: 'destructive',
      });
      return;
    }

    if (!subdomainSettings.subdomain) {
      toast({
        title: 'Error',
        description: 'Please enter a subdomain.',
        variant: 'destructive',
      });
      return;
    }

    // Quick client-side validation for restricted subdomains
    const restrictedSubdomains = ['admin', 'blog', 'dashboard', 'api', 'www', 'app', 'support', 'help', 'mail'];
    if (restrictedSubdomains.includes(subdomainSettings.subdomain.toLowerCase())) {
      toast({
        title: 'Subdomain unavailable',
        description: `The subdomain "${subdomainSettings.subdomain}" is reserved and not available.`,
        variant: 'destructive',
      });
      return;
    }

    // Only check availability if not already confirmed
    if (subdomainAvailable !== true) {
      setSubdomainAvailable(true); // Optimistically assume it's available for better UX
    }

    try {
      setIsSaving(true);
      const domainSettingsRef = doc(db, 'users', user.uid, 'userSettings', 'domain');
      
      const now = new Date();
      const updateData = {
        subdomain: subdomainSettings.subdomain,
        subdomainActive: true, // Automatically activate the subdomain
        subdomainVerified: true, // Automatically verify the subdomain
        updatedAt: now,
      };
      
      // Use setDoc with merge option instead of checking existence first
      await setDoc(domainSettingsRef, {
        ...updateData,
        createdAt: subdomainSettings.createdAt || now,
      }, { merge: true });

      // Update local state immediately for better UX
      setSubdomainSettings({
        ...subdomainSettings,
        isActive: true,
        isVerified: true,
        updatedAt: now,
      });

      toast({
        title: 'Success',
        description: 'Subdomain settings saved successfully.',
      });
    } catch (error) {
      console.error('Error saving subdomain settings:', error);
      toast({
        title: 'Error',
        description: 'Failed to save subdomain settings.',
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  };

  const previewSubdomain = () => {
    if (!subdomainSettings.subdomain) {
      toast({
        title: 'Error',
        description: 'Please enter a subdomain first.',
        variant: 'destructive',
      });
      return;
    }
    
    // Open the preview in a new tab
    window.open(`https://${subdomainSettings.subdomain}.minispace.app/preview`, '_blank');
  };

  if (isLoading) {
    return (
      <div className="container py-10">
        <h1 className="text-3xl font-bold mb-6">Domain Settings</h1>
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

  return (
    <div className="container py-10">
      <h1 className="text-3xl font-bold mb-6">Domain Settings</h1>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="subdomain">Subdomain</TabsTrigger>
          <TabsTrigger value="custom-domain">Custom Domain</TabsTrigger>
        </TabsList>
        
        <TabsContent value="subdomain">
          <Card>
            <CardHeader>
              <CardTitle>Subdomain Settings</CardTitle>
              <CardDescription>
                Configure your free minispace.app subdomain
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {subdomainSettings.isActive ? (
                  <Alert className="bg-green-50 border-green-200">
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                    <AlertTitle className="text-green-800">Your subdomain is active</AlertTitle>
                    <AlertDescription className="text-green-700">
                      Your site is available at{' '}
                      <a
                        href={`https://${subdomainSettings.subdomain}.minispace.app`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-medium underline"
                      >
                        {subdomainSettings.subdomain}.minispace.app
                      </a>
                    </AlertDescription>
                  </Alert>
                ) : (
                  <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Set up your subdomain</AlertTitle>
                    <AlertDescription>
                      Choose a subdomain to make your site available at yourdomain.minispace.app
                    </AlertDescription>
                  </Alert>
                )}
                
                <div className="space-y-2">
                  <Label htmlFor="subdomain">Subdomain</Label>
                  <div className="flex">
                    <Input
                      id="subdomain"
                      value={subdomainSettings.subdomain}
                      onChange={(e) => {
                        setSubdomainSettings({
                          ...subdomainSettings,
                          subdomain: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''),
                        });
                        setSubdomainAvailable(null);
                      }}
                      placeholder="yourname"
                      className="rounded-r-none"
                      disabled={isSaving}
                    />
                    <div className="flex items-center px-3 border border-l-0 rounded-r-md bg-muted">
                      .minispace.app
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Only lowercase letters, numbers, and hyphens are allowed.
                  </p>
                  
                  {subdomainAvailable === true && (
                    <p className="text-sm text-green-600 flex items-center mt-2">
                      <CheckCircle2 className="h-4 w-4 mr-1" />
                      Subdomain is available
                    </p>
                  )}
                  
                  {subdomainAvailable === false && (
                    <p className="text-sm text-red-600 flex items-center mt-2">
                      <AlertCircle className="h-4 w-4 mr-1" />
                      Subdomain is not available
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <div>
                <Button
                  variant="outline"
                  onClick={previewSubdomain}
                  disabled={!subdomainSettings.subdomain || isSaving}
                >
                  Preview <ExternalLink className="h-4 w-4 ml-1" />
                </Button>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={checkSubdomainAvailability}
                  disabled={!subdomainSettings.subdomain || isCheckingAvailability || isSaving}
                >
                  {isCheckingAvailability ? 'Checking...' : 'Check Availability'}
                </Button>
                <Button
                  onClick={saveSubdomainSettings}
                  disabled={!subdomainSettings.subdomain || isSaving || subdomainAvailable !== true}
                >
                  {isSaving ? 'Saving...' : 'Save Subdomain'}
                </Button>
              </div>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="custom-domain">
          <Card>
            <CardHeader>
              <CardTitle>Custom Domain Settings</CardTitle>
              <CardDescription>
                Connect your own domain to your Minispace site
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Custom domains coming soon</AlertTitle>
                  <AlertDescription>
                    Custom domain support will be available in a future update. For now, you can use a free minispace.app subdomain.
                  </AlertDescription>
                </Alert>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
