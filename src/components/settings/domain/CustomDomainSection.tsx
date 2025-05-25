'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { ExternalLink, Globe } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { 
  DNS_CONFIG,
  saveCustomDomain,
  verifyCustomDomain,
  visitCustomDomain
} from './DomainUtils';

interface CustomDomainSectionProps {
  userId: string;
  initialCustomDomain: string;
  initialDomainVerified: boolean;
  onCustomDomainChange: (customDomain: string, verified: boolean) => void;
}

export default function CustomDomainSection({ 
  userId, 
  initialCustomDomain,
  initialDomainVerified,
  onCustomDomainChange
}: CustomDomainSectionProps) {
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [customDomain, setCustomDomain] = useState(initialCustomDomain);
  const [domainVerified, setDomainVerified] = useState(initialDomainVerified);

  // Initialize with props when they change
  useEffect(() => {
    setCustomDomain(initialCustomDomain);
    setDomainVerified(initialDomainVerified);
  }, [initialCustomDomain, initialDomainVerified]);

  const handleSaveCustomDomain = async () => {
    if (!userId) {
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

    try {
      setIsSaving(true);
      
      await saveCustomDomain(userId, customDomain);
      
      // Reset verification status when domain changes
      setDomainVerified(false);
      onCustomDomainChange(customDomain, false);
      
      toast({
        title: 'Success',
        description: 'Domain settings saved. Please configure your DNS settings to verify your domain.',
      });
    } catch (error: any) {
      console.error('Error saving domain settings:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to save domain settings.',
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleVerifyCustomDomain = async () => {
    if (!userId) {
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
      
      const success = await verifyCustomDomain(userId, customDomain);
      
      if (success) {
        setDomainVerified(true);
        onCustomDomainChange(customDomain, true);
        
        toast({
          title: 'Success',
          description: 'Domain verified successfully!',
        });
      } else {
        toast({
          title: 'Error',
          description: 'Failed to verify domain.',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Error verifying domain:', error);
      toast({
        title: 'Error',
        description: 'Failed to verify domain.',
        variant: 'destructive',
      });
    } finally {
      setIsVerifying(false);
    }
  };

  const handleVisitCustomDomain = () => {
    visitCustomDomain(customDomain);
  };

  // Render the domain guide link with more detailed guidance
  const renderDomainGuideLink = () => (
    <div className="mt-4 text-sm">
      <h4 className="font-medium mb-2">Need help setting up your domain?</h4>
      <ol className="list-decimal pl-5 space-y-1 text-muted-foreground">
        <li>Purchase a domain from a domain registrar (like Namecheap, GoDaddy, or Google Domains)</li>
        <li>Go to your domain's DNS settings page</li>
        <li>Add an A record pointing <strong>@</strong> to <code className="bg-muted px-1 py-0.5 rounded">{DNS_CONFIG.A.value}</code></li>
        <li>Add a CNAME record pointing <strong>www</strong> to <code className="bg-muted px-1 py-0.5 rounded">{DNS_CONFIG.CNAME.value}</code></li>
        <li>Wait for DNS changes to propagate (may take up to 48 hours)</li>
        <li>Click "Verify Domain" to confirm setup</li>
      </ol>
      <a href="/docs/custom-domains" className="text-primary hover:underline inline-flex items-center mt-2">
        View our detailed domain setup guide <ExternalLink className="ml-1 h-3 w-3" />
      </a>
    </div>
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Custom Domain</CardTitle>
        <CardDescription>
          Connect your own domain to your Minispace site
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="grid gap-2">
          <Label htmlFor="customDomain">Domain Name</Label>
          <Input
            id="customDomain"
            value={customDomain}
            onChange={(e) => setCustomDomain(e.target.value.toLowerCase())}
            placeholder="example.com"
          />
          
          {customDomain && (
            <div className="text-xs text-muted-foreground">
              Status: {domainVerified ? (
                <span className="text-green-600">Verified ✓</span>
              ) : (
                <span className="text-amber-600">Not verified</span>
              )}
            </div>
          )}
        </div>
        
        {/* DNS Configuration Instructions */}
        {customDomain && !domainVerified && (
          <div className="p-4 border rounded-md bg-muted/50">
            <h3 className="font-medium mb-2">DNS Configuration</h3>
            <p className="text-sm mb-3">
              Add these DNS records to your domain registrar to connect your domain:
            </p>
            
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-border">
                <thead>
                  <tr>
                    <th className="px-4 py-2 text-left text-sm font-medium">Type</th>
                    <th className="px-4 py-2 text-left text-sm font-medium">Host</th>
                    <th className="px-4 py-2 text-left text-sm font-medium">Value</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  <tr>
                    <td className="px-4 py-2 text-sm">A</td>
                    <td className="px-4 py-2 text-sm">@</td>
                    <td className="px-4 py-2 text-sm font-mono">{DNS_CONFIG.A.value}</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2 text-sm">CNAME</td>
                    <td className="px-4 py-2 text-sm">www</td>
                    <td className="px-4 py-2 text-sm font-mono">{DNS_CONFIG.CNAME.value}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            
            {renderDomainGuideLink()}
          </div>
        )}
      </CardContent>
      
      <CardFooter className="flex justify-between">
        <Button
          variant="outline"
          onClick={handleVisitCustomDomain}
          disabled={!customDomain || !domainVerified}
        >
          <Globe className="mr-2 h-4 w-4" />
          Visit Site
        </Button>
        
        <div className="space-x-2">
          {customDomain && !domainVerified && (
            <Button
              variant="outline"
              onClick={handleVerifyCustomDomain}
              disabled={isVerifying || !customDomain}
            >
              {isVerifying ? 'Verifying...' : 'Verify Domain'}
            </Button>
          )}
          
          <Button
            onClick={handleSaveCustomDomain}
            disabled={isSaving}
          >
            {isSaving ? 'Saving...' : 'Save Domain'}
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
