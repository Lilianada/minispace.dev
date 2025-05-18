'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import { updateProfile } from 'firebase/auth';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ProfileHeader } from '@/components/profile/ProfileHeader';
import { UsernameForm } from '@/components/profile/UsernameForm';
import { ProfileInfoForm } from '@/components/profile/ProfileInfoForm';
import { EmailVerification } from '@/components/profile/EmailVerification';
import { SocialLinksForm } from '@/components/profile/SocialLinksForm';
import { validateUsername } from '@/lib/username-utils';

export default function ProfileClient() {
  const { user, userData, refreshUserData } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  
  // Handler for updating username
  const handleUpdateUsername = async (newUsername: string) => {
    if (!user || !newUsername) return;
    
    // Skip if username hasn't changed
    if (userData?.username && newUsername === userData.username) {
      toast({
        title: 'No changes',
        description: 'Username is the same as current one.',
      });
      return;
    }
    
    // Validate username format and availability
    const validation = await validateUsername(newUsername);
    if (!validation.valid) {
      toast({
        title: 'Invalid username',
        description: validation.message,
        variant: 'destructive',
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Update username in Firestore
      const userDocRef = doc(db, 'Users', user.uid);
      await updateDoc(userDocRef, {
        username: newUsername.toLowerCase(),
        updatedAt: new Date()
      });
      
      // Update displayName in Firebase Auth if needed
      if (user.displayName !== newUsername) {
        await updateProfile(user, {
          displayName: newUsername
        });
      }
      
      // Update username in localStorage for routing
      localStorage.setItem('username', newUsername.toLowerCase());
      
      // Refresh user data
      await refreshUserData();
      
      toast({
        title: 'Profile updated',
        description: 'Your username has been updated successfully.',
      });
      
      // Redirect to the new dashboard URL with updated username
      router.push(`/${newUsername.toLowerCase()}/dashboard/profile`);
      
    } catch (error) {
      console.error('Error updating username:', error);
      toast({
        title: 'Error',
        description: 'Failed to update username. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  // Handler for updating profile information
  const handleUpdateProfileInfo = async (data: { displayName: string; bio: string }) => {
    if (!user) return;
    
    setIsLoading(true);
    
    try {
      // Update profile info in Firestore
      const userDocRef = doc(db, 'Users', user.uid);
      await updateDoc(userDocRef, {
        displayName: data.displayName,
        bio: data.bio,
        updatedAt: new Date()
      });
      
      // Update displayName in Firebase Auth
      await updateProfile(user, {
        displayName: data.displayName
      });
      
      // Refresh user data
      await refreshUserData();
      
      toast({
        title: 'Profile updated',
        description: 'Your profile information has been updated successfully.',
      });
    } catch (error) {
      console.error('Error updating profile info:', error);
      toast({
        title: 'Error',
        description: 'Failed to update profile information. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  // Handler for updating social links
  const handleUpdateSocialLinks = async (links: any) => {
    if (!user) return;
    
    setIsLoading(true);
    
    try {
      // Update social links in Firestore
      const userDocRef = doc(db, 'Users', user.uid);
      await updateDoc(userDocRef, {
        socialLinks: links,
        updatedAt: new Date()
      });
      
      // Refresh user data
      await refreshUserData();
      
      toast({
        title: 'Social links updated',
        description: 'Your social media links have been updated successfully.',
      });
    } catch (error) {
      console.error('Error updating social links:', error);
      toast({
        title: 'Error',
        description: 'Failed to update social links. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  if (!user) {
    return (
      <div className="container py-8">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            You must be logged in to view your profile.
          </AlertDescription>
        </Alert>
      </div>
    );
  }
  
  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-6">Profile</h1>
      
      <ProfileHeader user={user} userData={userData} />
      
      <Tabs defaultValue="account" className="mt-6">
        <TabsList className="mb-4">
          <TabsTrigger value="account">Account Info</TabsTrigger>
          <TabsTrigger value="verification">Verification</TabsTrigger>
          <TabsTrigger value="social">Social Links</TabsTrigger>
        </TabsList>
        
        <TabsContent value="account" className="space-y-4">
          <div className="grid gap-6">
            <UsernameForm 
              user={user} 
              userData={userData} 
              onSubmit={handleUpdateUsername} 
              isLoading={isLoading} 
            />
            
            <ProfileInfoForm
              user={user}
              userData={userData}
              onSubmit={handleUpdateProfileInfo}
              isLoading={isLoading}
            />
          </div>
        </TabsContent>
        
        <TabsContent value="verification" className="space-y-4">
          <EmailVerification user={user} />
        </TabsContent>
        
        <TabsContent value="social" className="space-y-4">
          <SocialLinksForm
            user={user}
            userData={userData}
            onSubmit={handleUpdateSocialLinks}
            isLoading={isLoading}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
