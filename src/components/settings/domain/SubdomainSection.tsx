'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { AlertCircle, Check, Globe } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { 
  checkSubdomainAvailability, 
  saveSubdomainSettings,
  visitSubdomain,
  type SubdomainAvailabilityResult
} from './DomainUtils';

interface SubdomainSectionProps {
  userId: string;
  initialSubdomain: string;
  initialOriginalSubdomain: string;
  onSubdomainChange: (subdomain: string, originalSubdomain: string) => void;
}

export default function SubdomainSection({ 
  userId, 
  initialSubdomain, 
  initialOriginalSubdomain,
  onSubdomainChange 
}: SubdomainSectionProps) {
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);
  const [subdomain, setSubdomain] = useState(initialSubdomain);
  const [originalSubdomain, setOriginalSubdomain] = useState(initialOriginalSubdomain);
  const [subdomainAvailable, setSubdomainAvailable] = useState<boolean | null>(null);
  const [isCheckingAvailability, setIsCheckingAvailability] = useState(false);

  // Initialize with props when they change
  useEffect(() => {
    setSubdomain(initialSubdomain);
    setOriginalSubdomain(initialOriginalSubdomain);
  }, [initialSubdomain, initialOriginalSubdomain]);

  const handleCheckSubdomainAvailability = async () => {
    if (!subdomain) return;
    
    // Skip check if subdomain hasn't changed
    if (subdomain === originalSubdomain) {
      setSubdomainAvailable(true);
      return;
    }

    try {
      setIsCheckingAvailability(true);
      
      const result = await checkSubdomainAvailability(subdomain, userId);
      
      // Give a slight delay to prevent UI flashing
      setTimeout(() => {
        // Handle the case where result is false (empty subdomain)
        if (result === false) {
          setSubdomainAvailable(false);
          setIsCheckingAvailability(false);
          return;
        }
        
        // Handle the case where result is an object
        setSubdomainAvailable(result.isAvailable);
        
        if (!result.isValid || !result.isAvailable) {
          toast({
            title: result.isValid ? 'Subdomain unavailable' : 'Invalid subdomain',
            description: result.message,
            variant: 'destructive',
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

  const handleSaveSubdomain = async () => {
    if (!userId) {
      toast({
        title: 'Error',
        description: 'You must be logged in to save domain settings.',
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

    if (!subdomainAvailable && subdomain !== originalSubdomain) {
      toast({
        title: 'Error',
        description: 'This subdomain is not available. Please choose another one.',
        variant: 'destructive',
      });
      return;
    }

    try {
      setIsSaving(true);
      
      const success = await saveSubdomainSettings(userId, subdomain, originalSubdomain);
      
      if (success) {
        // Update original subdomain
        setOriginalSubdomain(subdomain);
        
        // Notify parent component
        onSubdomainChange(subdomain, subdomain);
        
        toast({
          title: 'Success',
          description: 'Subdomain settings saved.',
        });
      }
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

  const handleVisitSubdomain = () => {
    visitSubdomain(subdomain);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Subdomain</CardTitle>
        <CardDescription>
          Choose a subdomain for your Minispace site. This will be your site's URL: 
          <code className="ml-1 text-primary">[subdomain].minispace.dev</code>
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <div className="flex flex-col space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="subdomain">Subdomain</Label>
            <div className="flex items-center">
              <Input 
                id="subdomain"
                value={subdomain}
                onChange={(e) => {
                  setSubdomain(e.target.value.toLowerCase());
                  setSubdomainAvailable(null);
                }}
                onBlur={handleCheckSubdomainAvailability}
                className="rounded-r-none"
                placeholder="yourusername"
              />
              <div className="bg-muted px-3 py-2 border border-l-0 border-input rounded-r-md whitespace-nowrap">
                .minispace.dev
              </div>
            </div>
            
            {isCheckingAvailability ? (
              <div className="text-sm text-muted-foreground">Checking availability...</div>
            ) : subdomainAvailable === true && subdomain ? (
              <div className="text-sm text-green-600 flex items-center">
                <Check className="h-4 w-4 mr-1" /> Subdomain is available
              </div>
            ) : subdomainAvailable === false ? (
              <div className="text-sm text-destructive flex items-center">
                <AlertCircle className="h-4 w-4 mr-1" /> Subdomain is not available
              </div>
            ) : null}
            
            <div className="text-xs text-muted-foreground">
              Your subdomain is also your username across the platform. Changing it will update your username everywhere.
            </div>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="flex justify-between">
        <Button
          variant="outline" 
          onClick={handleVisitSubdomain}
          disabled={!subdomain}
        >
          <Globe className="mr-2 h-4 w-4" />
          Visit Site
        </Button>
        
        <Button
          onClick={handleSaveSubdomain}
          disabled={isSaving || isCheckingAvailability || (subdomainAvailable === false && subdomain !== originalSubdomain)}
        >
          {isSaving ? 'Saving...' : 'Save Subdomain'}
        </Button>
      </CardFooter>
    </Card>
  );
}
