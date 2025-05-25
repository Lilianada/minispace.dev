'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth-context';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import SubdomainSection from '@/components/settings/domain/SubdomainSection';
import CustomDomainSection from '@/components/settings/domain/CustomDomainSection';
import { fetchDomainSettings } from '@/components/settings/domain/DomainUtils';

export default function DomainSettingsClient({ params }: { params: { username: string } }) {
  const { user, loading: authLoading } = useAuth();
  const { toast } = useToast();
  
  // State for loading and domain management
  const [isLoading, setIsLoading] = useState(true);
  
  // Domain data
  const [subdomain, setSubdomain] = useState('');
  const [originalSubdomain, setOriginalSubdomain] = useState('');
  const [customDomain, setCustomDomain] = useState('');
  const [domainVerified, setDomainVerified] = useState(false);

  // Load domain settings
  useEffect(() => {
    const loadDomainSettings = async () => {
      if (!user) return;
      
      try {
        setIsLoading(true);
        const settings = await fetchDomainSettings(user.uid);
        
        setSubdomain(settings.subdomain);
        setOriginalSubdomain(settings.originalSubdomain);
        setCustomDomain(settings.customDomain);
        setDomainVerified(settings.domainVerified);
      } catch (error) {
        console.error('Error loading domain settings:', error);
        toast({
          title: 'Error',
          description: 'Failed to load domain settings.',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    loadDomainSettings();
  }, [user]);

  // Handle subdomain change
  const handleSubdomainChange = (newSubdomain: string, newOriginalSubdomain: string) => {
    setSubdomain(newSubdomain);
    setOriginalSubdomain(newOriginalSubdomain);
  };
  
  // Handle custom domain change
  const handleCustomDomainChange = (newCustomDomain: string, verified: boolean) => {
    setCustomDomain(newCustomDomain);
    setDomainVerified(verified);
  };

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

      <div className="grid gap-8">
        <SubdomainSection
          userId={user.uid}
          initialSubdomain={subdomain}
          initialOriginalSubdomain={originalSubdomain}
          onSubdomainChange={handleSubdomainChange}
        />
        
        <CustomDomainSection
          userId={user.uid}
          initialCustomDomain={customDomain}
          initialDomainVerified={domainVerified}
          onCustomDomainChange={handleCustomDomainChange}
        />
      </div>
    </div>
  );
}
