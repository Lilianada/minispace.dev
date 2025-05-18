'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth-context';
import { useToast } from '@/hooks/use-toast';
import { db } from '@/lib/firebase/config';
import { doc, getDoc, setDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Label } from '@/components/ui/label';
import { AlertCircle, Check, ExternalLink, Globe } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function DomainSettingsPage({ params }: { params: { username: string } }) {
  const { user, userData, loading: authLoading } = useAuth();
  const { toast } = useToast();
  
  // State for loading and domain management
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  
  // Subdomain settings
  const [subdomain, setSubdomain] = useState('');
  const [subdomainAvailable, setSubdomainAvailable] = useState<boolean | null>(null);
  const [isCheckingAvailability, setIsCheckingAvailability] = useState(false);
  
  // Custom domain settings
  const [customDomain, setCustomDomain] = useState('');
  const [domainVerified, setDomainVerified] = useState(false);
  
  // DNS Configuration values
  const DNS_CONFIG = {
    CNAME: {
      host: 'www',
      value: 'cname.minispace.dev'
    },
    A: {
      host: '@',
      value: '76.76.21.21'
    }
  };

  // Fetch domain settings on component mount
  useEffect(() => {
    const fetchDomainSettings = async () => {
      if (!user) return;

      try {
        setIsLoading(true);
        
        // Reference to the domain settings document
        const domainSettingsRef = doc(db, 'Users', user.uid, 'settings', 'domain');
        const docSnap = await getDoc(domainSettingsRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          
          // Update subdomain settings
          if (data.subdomain) {
            setSubdomain(data.subdomain);
          }
          
          // Update custom domain settings
          if (data.customDomain) {
            setCustomDomain(data.customDomain);
            setDomainVerified(data.domainVerified || false);
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
        setIsLoading(false);
      }
    };

    if (user) {
      fetchDomainSettings();
    } else {
      setIsLoading(false); // Set loading to false if no user
    }
  }, [user]);

  // Save custom domain settings
  const saveCustomDomain = async () => {
    if (!user) {
      toast({
        title: 'Error',
        description: 'You must be logged in to save settings.',
        variant: 'destructive',
      });
      return;
    }

    if (!customDomain) {
      toast({
        title: 'Error',
        description: 'Please enter a domain name.',
        variant: 'destructive',
      });
      return;
    }

    // Basic domain validation
    const domainRegex = /^[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9](?:\.[a-zA-Z]{2,})+$/;
    if (!domainRegex.test(customDomain)) {
      toast({
        title: 'Invalid domain',
        description: 'Please enter a valid domain name (e.g., example.com).',
        variant: 'destructive',
      });
      return;
    }

    try {
      setIsSaving(true);
      
      // Reference to the domain settings document
      const domainSettingsRef = doc(db, 'Users', user.uid, 'settings', 'domain');
      
      // Update domain settings
      await setDoc(domainSettingsRef, {
        customDomain,
        domainVerified: false, // Reset verification status when domain changes
        updatedAt: serverTimestamp(),
      }, { merge: true });

      setDomainVerified(false);
      
      toast({
        title: 'Success',
        description: 'Domain settings saved. Please configure your DNS settings to verify your domain.',
      });
    } catch (error) {
      console.error('Error saving domain settings:', error);
      toast({
        title: 'Error',
        description: 'Failed to save domain settings.',
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Verify the custom domain
  const verifyCustomDomain = async () => {
    if (!user) {
      toast({
        title: 'Error',
        description: 'You must be logged in to verify your domain.',
        variant: 'destructive',
      });
      return;
    }

    if (!customDomain) {
      toast({
        title: 'Error',
        description: 'Please enter a domain name first.',
        variant: 'destructive',
      });
      return;
    }

    try {
      setIsVerifying(true);
      
      // In a real app, you would check if DNS records are properly configured
      // For this demo, we'll simulate a successful verification after a short delay
      setTimeout(async () => {
        try {
          // Reference to the domain settings document
          const domainSettingsRef = doc(db, 'Users', user.uid, 'settings', 'domain');
          
          // Update verification status
          await updateDoc(domainSettingsRef, {
            domainVerified: true,
            verifiedAt: serverTimestamp(),
          });
          
          setDomainVerified(true);
          
          toast({
            title: 'Success',
            description: 'Domain verified successfully!',
          });
        } catch (error) {
          console.error('Error updating verification status:', error);
          toast({
            title: 'Error',
            description: 'Failed to update verification status.',
            variant: 'destructive',
          });
        } finally {
          setIsVerifying(false);
        }
      }, 1500);
    } catch (error) {
      console.error('Error verifying domain:', error);
      toast({
        title: 'Error',
        description: 'Failed to verify domain.',
        variant: 'destructive',
      });
      setIsVerifying(false);
    }
  };
  
  // Remove the custom domain
  const removeCustomDomain = async () => {
    if (!user) return;
    
    try {
      setIsSaving(true);
      
      // Reference to the domain settings document
      const domainSettingsRef = doc(db, 'Users', user.uid, 'settings', 'domain');
      
      // Update domain settings to remove the custom domain
      await updateDoc(domainSettingsRef, {
        customDomain: '',
        domainVerified: false,
        updatedAt: serverTimestamp(),
      });
      
      // Update local state
      setCustomDomain('');
      setDomainVerified(false);
      
      toast({
        title: 'Success',
        description: 'Custom domain removed successfully.',
      });
    } catch (error) {
      console.error('Error removing domain:', error);
      toast({
        title: 'Error',
        description: 'Failed to remove domain.',
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Check subdomain availability
  const checkSubdomainAvailability = async () => {
    if (!subdomain) {
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
      const restrictedSubdomains = ['admin', 'blog', 'dashboard', 'api', 'www', 'app', 'support', 'help', 'mail'];
      const isRestricted = restrictedSubdomains.includes(subdomain.toLowerCase());
      
      if (isRestricted) {
        setSubdomainAvailable(false);
        toast({
          title: 'Subdomain unavailable',
          description: `The subdomain "${subdomain}" is reserved and not available.`,
          variant: 'destructive',
        });
        setIsCheckingAvailability(false);
        return;
      }
      
      // Simulate checking availability (in a real app, this would be a server call)
      setTimeout(() => {
        // Most subdomains will be available in our demo
        const isAvailable = true;
        setSubdomainAvailable(isAvailable);
        
        if (!isAvailable) {
          toast({
            title: 'Subdomain unavailable',
            description: `The subdomain "${subdomain}" is already taken.`,
            variant: 'destructive',
          });
        } else {
          toast({
            title: 'Subdomain available',
            description: `The subdomain "${subdomain}" is available!`,
          });
        }
        
        setIsCheckingAvailability(false);
      }, 800);
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

  // Save subdomain settings
  const saveSubdomainSettings = async () => {
    if (!user) {
      toast({
        title: 'Error',
        description: 'You must be logged in to save settings.',
        variant: 'destructive',
      });
      return;
    }

    if (!subdomain) {
      toast({
        title: 'Error',
        description: 'Please enter a subdomain.',
        variant: 'destructive',
      });
      return;
    }

    // Quick client-side validation for restricted subdomains
    const restrictedSubdomains = ['admin', 'blog', 'dashboard', 'api', 'www', 'app', 'support', 'help', 'mail'];
    if (restrictedSubdomains.includes(subdomain.toLowerCase())) {
      toast({
        title: 'Subdomain unavailable',
        description: `The subdomain "${subdomain}" is reserved and not available.`,
        variant: 'destructive',
      });
      return;
    }

    // Only check availability if not already confirmed
    if (subdomainAvailable !== true) {
      toast({
        title: 'Availability check required',
        description: 'Please check if the subdomain is available first.',
        variant: 'destructive',
      });
      return;
    }

    try {
      setIsSaving(true);
      
      // Reference to the domain settings document
      const domainSettingsRef = doc(db, 'Users', user.uid, 'settings', 'domain');
      
      // Update domain settings
      await setDoc(domainSettingsRef, {
        subdomain,
        subdomainActive: true,
        updatedAt: serverTimestamp(),
      }, { merge: true });
      
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

  // Visit the site with the subdomain
  const visitSubdomain = () => {
    if (!subdomain) return;
    window.open(`https://${subdomain}.minispace.dev`, '_blank');
  };

  // Visit the site with the custom domain
  const visitCustomDomain = () => {
    if (!customDomain) return;
    window.open(`https://${customDomain}`, '_blank');
  };

  // Render the domain guide link
  const renderDomainGuideLink = () => (
    <div className="mt-4 text-sm text-muted-foreground">
      Need help? <a href="/docs" className="text-primary hover:underline inline-flex items-center">View our domain setup guide <ExternalLink className="ml-1 h-3 w-3" /></a>
    </div>
  );

  if (authLoading || isLoading) {
    return (
      <div className="container py-10">
        <h1 className="text-2xl font-bold mb-6">Domain Settings</h1>
        <div className="grid gap-6">
          <Skeleton className="h-[200px] w-full" />
          <Skeleton className="h-[400px] w-full" />
        </div>
      </div>
    );
  }

  if (!user) {
    return <div className="p-8 text-center">Please log in to view domain settings.</div>;
  }

  return (
    <div className="container py-10">
      <h1 className="text-2xl font-bold mb-6">Domain Settings</h1>
      
      <div className="grid gap-6">
        {/* Subdomain Card */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Globe className="h-5 w-5" />
              <CardTitle>Subdomain</CardTitle>
            </div>
            <CardDescription>Choose your free minispace.dev subdomain</CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <div>
              <Label htmlFor="subdomain">Subdomain</Label>
              <div className="flex mt-1.5">
                <Input
                  id="subdomain"
                  placeholder="yourname"
                  value={subdomain}
                  onChange={(e) => {
                    setSubdomain(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''));
                    setSubdomainAvailable(null);
                  }}
                  className="rounded-r-none"
                  disabled={isSaving}
                />
                <div className="flex items-center px-3 border border-l-0 rounded-r-md bg-muted">
                  .minispace.dev
                </div>
              </div>
              <p className="text-sm text-muted-foreground mt-1.5">
                Only lowercase letters, numbers, and hyphens are allowed.
              </p>
              
              {subdomainAvailable === true && (
                <p className="text-sm text-green-600 flex items-center mt-2">
                  <Check className="h-4 w-4 mr-1" />
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
            
            <div className="flex justify-between">
              <Button
                variant="outline"
                onClick={visitSubdomain}
                disabled={!subdomain || isSaving}
              >
                Preview <ExternalLink className="h-4 w-4 ml-1" />
              </Button>
              
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={checkSubdomainAvailability}
                  disabled={!subdomain || isCheckingAvailability || isSaving}
                >
                  {isCheckingAvailability ? 'Checking...' : 'Check Availability'}
                </Button>
                <Button
                  onClick={saveSubdomainSettings}
                  disabled={!subdomain || isSaving || subdomainAvailable !== true}
                >
                  {isSaving ? 'Saving...' : 'Save Subdomain'}
                </Button>
              </div>
            </div>
            
            {renderDomainGuideLink()}
          </CardContent>
        </Card>
        
        {/* Custom Domain Card */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Globe className="h-5 w-5" />
              <CardTitle>Custom Domain</CardTitle>
            </div>
            <CardDescription>Connect your own domain to your MINISPACE site</CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <div>
              <Label htmlFor="domain-name">Domain Name</Label>
              <div className="flex mt-1.5">
                <Input
                  id="domain-name"
                  placeholder="example.xyz"
                  value={customDomain}
                  onChange={(e) => setCustomDomain(e.target.value)}
                  className="flex-1"
                  disabled={isSaving || domainVerified}
                />
                {customDomain && domainVerified ? (
                  <Button 
                    variant="outline" 
                    className="ml-2" 
                    onClick={removeCustomDomain}
                    disabled={isSaving}
                  >
                    Remove
                  </Button>
                ) : (
                  <Button 
                    className="ml-2" 
                    onClick={saveCustomDomain}
                    disabled={isSaving || !customDomain}
                  >
                    {isSaving ? 'Saving...' : 'Save'}
                  </Button>
                )}
              </div>
              <p className="text-sm text-muted-foreground mt-1.5">Enter your domain without http:// or www</p>
            </div>
            
            {customDomain && (
              <>
                {domainVerified ? (
                  <Alert className="bg-green-50 border-green-200">
                    <Check className="h-4 w-4 text-green-600" />
                    <AlertDescription className="text-green-800 font-medium">
                      Domain Verified
                      <p className="font-normal mt-1">Your custom domain is connected and working properly.</p>
                    </AlertDescription>
                  </Alert>
                ) : (
                  <div>
                    <h3 className="text-base font-medium mb-2">DNS Configuration</h3>
                    <p className="text-sm text-muted-foreground mb-4">To connect your domain, add the following DNS records to your domain provider:</p>
                    
                    <div className="border rounded-md overflow-hidden">
                      <div className="bg-muted px-4 py-2 text-sm font-medium">CNAME Record</div>
                      <div className="p-4 space-y-2">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label className="text-xs">Host</Label>
                            <div className="mt-1 font-mono text-sm p-2 bg-muted rounded">{DNS_CONFIG.CNAME.host}</div>
                          </div>
                          <div>
                            <Label className="text-xs">Value</Label>
                            <div className="mt-1 font-mono text-sm p-2 bg-muted rounded">{DNS_CONFIG.CNAME.value}</div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="bg-muted px-4 py-2 text-sm font-medium">A Record</div>
                      <div className="p-4 space-y-2">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label className="text-xs">Host</Label>
                            <div className="mt-1 font-mono text-sm p-2 bg-muted rounded">{DNS_CONFIG.A.host}</div>
                          </div>
                          <div>
                            <Label className="text-xs">Value</Label>
                            <div className="mt-1 font-mono text-sm p-2 bg-muted rounded">{DNS_CONFIG.A.value}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <p className="text-xs text-muted-foreground mt-3">DNS changes can take up to 48 hours to propagate.</p>
                    
                    <div className="mt-4">
                      <Button 
                        onClick={verifyCustomDomain} 
                        disabled={isVerifying || !customDomain}
                      >
                        {isVerifying ? 'Verifying...' : 'Verify Domain'}
                      </Button>
                    </div>
                  </div>
                )}
                
                {domainVerified && (
                  <div className="flex justify-end">
                    <Button variant="outline" onClick={visitCustomDomain} className="flex items-center gap-1">
                      Visit Site <ExternalLink className="h-3 w-3 ml-1" />
                    </Button>
                  </div>
                )}
              </>
            )}
            
            {renderDomainGuideLink()}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
