/**
 * Profile Info Form Component
 * 
 * Allows users to update their profile information.
 */
'use client';

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/contexts/AuthContext';
import { updateUserProfile } from '@/services/user-service';
import { useToast } from '@/hooks/use-toast';

export interface ProfileInfoFormProps {
  onUpdate?: () => void;
}

export function ProfileInfoForm({ onUpdate }: ProfileInfoFormProps) {
  const { userData, refreshUserData } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [displayName, setDisplayName] = useState(userData?.displayName || '');
  const [bio, setBio] = useState(userData?.bio || '');
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isLoading) return;
    
    try {
      setIsLoading(true);
      
      const response = await updateUserProfile({
        displayName,
        bio
      });
      
      if (response.error) {
        throw new Error(response.error);
      }
      
      await refreshUserData();
      
      toast({
        title: 'Profile updated',
        description: 'Your profile information has been updated successfully.',
        variant: 'success'
      });
      
      if (onUpdate) {
        onUpdate();
      }
      
    } catch (error) {
      toast({
        title: 'Update failed',
        description: error instanceof Error ? error.message : 'Failed to update profile',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile Information</CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div>
            <label 
              htmlFor="displayName" 
              className="block text-sm font-medium mb-1"
            >
              Display Name
            </label>
            <Input
              id="displayName"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="Your display name"
              className="w-full"
            />
          </div>
          
          <div>
            <label 
              htmlFor="bio" 
              className="block text-sm font-medium mb-1"
            >
              Bio
            </label>
            <Textarea
              id="bio"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Tell us about yourself"
              rows={4}
              className="w-full"
            />
          </div>
        </CardContent>
        
        <CardFooter>
          <Button 
            type="submit" 
            disabled={isLoading}
            className="w-full sm:w-auto"
          >
            {isLoading ? 'Saving...' : 'Save Changes'}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
