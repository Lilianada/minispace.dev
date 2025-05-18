'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { doc, getDoc, updateDoc, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import { updatePassword, updateEmail, sendEmailVerification } from 'firebase/auth';
import { useToast } from '@/hooks/use-toast';

import { User } from 'firebase/auth';
import { UserData } from '@/lib/auth-context';

interface AccountSettingsProps {
  user: User | null;
  userData: UserData | null;
  emailNotifications: boolean;
  setEmailNotifications: (value: boolean) => void;
  marketingEmails: boolean;
  setMarketingEmails: (value: boolean) => void;
  twoFactorAuth: boolean;
  setTwoFactorAuth: (value: boolean) => void;
}

export function AccountSettings({
  user,
  userData,
  emailNotifications,
  setEmailNotifications,
  marketingEmails,
  setMarketingEmails,
  twoFactorAuth,
  setTwoFactorAuth
}: AccountSettingsProps) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [newEmail, setNewEmail] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Update email address
  const handleUpdateEmail = async () => {
    if (!user || !newEmail) return;
    
    setIsLoading(true);
    try {
      // Send email verification to the new email
      await updateEmail(user, newEmail);
      await sendEmailVerification(user);
      
      // Update the email in Firestore
      const userDocRef = doc(db, 'Users', user.uid);
      await updateDoc(userDocRef, {
        email: newEmail.toLowerCase(),
        updatedAt: new Date()
      });
      
      setNewEmail('');
      toast({
        title: 'Verification email sent',
        description: 'Please check your new email address to verify it.',
      });
    } catch (error) {
      console.error('Error updating email:', error);
      toast({
        title: 'Error',
        description: 'Failed to update email. You may need to reauthenticate.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  // Update password
  const handleUpdatePassword = async () => {
    if (!user || !currentPassword || !newPassword || !confirmPassword) {
      toast({
        title: 'Error',
        description: 'Please fill in all password fields.',
        variant: 'destructive',
      });
      return;
    }
    
    if (newPassword !== confirmPassword) {
      toast({
        title: 'Error',
        description: 'New passwords do not match.',
        variant: 'destructive',
      });
      return;
    }
    
    if (newPassword.length < 8) {
      toast({
        title: 'Error',
        description: 'Password must be at least 8 characters long.',
        variant: 'destructive',
      });
      return;
    }
    
    setIsLoading(true);
    try {
      // Update password in Firebase Auth
      await updatePassword(user, newPassword);
      
      // Clear form
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      
      toast({
        title: 'Password updated',
        description: 'Your password has been updated successfully.',
      });
    } catch (error) {
      console.error('Error updating password:', error);
      toast({
        title: 'Error',
        description: 'Failed to update password. You may need to reauthenticate.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Save account settings
  const handleSaveSettings = async () => {
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
        emailNotifications,
        marketingEmails,
        twoFactorAuth,
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
        description: 'Your account settings have been saved successfully.',
      });
    } catch (error) {
      console.error('Error saving account settings:', error);
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
        <CardTitle>Account Settings</CardTitle>
        <CardDescription>
          Manage your account settings and preferences.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Email Update Form */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Update Email</h3>
          <div className="grid gap-2">
            <Label htmlFor="email">New Email Address</Label>
            <Input
              id="email"
              type="email"
              placeholder={user?.email || 'Enter new email'}
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              disabled={isLoading}
            />
          </div>
          <Button 
            onClick={handleUpdateEmail} 
            disabled={!newEmail || isLoading}
            className="w-full sm:w-auto"
          >
            {isLoading ? 'Updating...' : 'Update Email'}
          </Button>
        </div>
        
        <Separator />
        
        {/* Password Update Form */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Update Password</h3>
          <div className="grid gap-2">
            <Label htmlFor="current-password">Current Password</Label>
            <Input
              id="current-password"
              type="password"
              placeholder="Enter current password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              disabled={isLoading}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="new-password">New Password</Label>
            <Input
              id="new-password"
              type="password"
              placeholder="Enter new password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              disabled={isLoading}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="confirm-password">Confirm New Password</Label>
            <Input
              id="confirm-password"
              type="password"
              placeholder="Confirm new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              disabled={isLoading}
            />
          </div>
          <Button 
            onClick={handleUpdatePassword} 
            disabled={!currentPassword || !newPassword || !confirmPassword || isLoading}
            className="w-full sm:w-auto"
          >
            {isLoading ? 'Updating...' : 'Update Password'}
          </Button>
        </div>
        
        <Separator />
        
        {/* Notification Preferences */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Notification Preferences</h3>
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="email-notifications">Email notifications</Label>
              <p className="text-sm text-muted-foreground">
                Receive notifications via email.
              </p>
            </div>
            <Switch
              id="email-notifications"
              checked={emailNotifications}
              onCheckedChange={setEmailNotifications}
              disabled={isLoading}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="marketing-emails">Marketing emails</Label>
              <p className="text-sm text-muted-foreground">
                Receive emails about new features and updates.
              </p>
            </div>
            <Switch
              id="marketing-emails"
              checked={marketingEmails}
              onCheckedChange={setMarketingEmails}
              disabled={isLoading}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="two-factor">Two-factor authentication</Label>
              <p className="text-sm text-muted-foreground">
                Add an extra layer of security to your account.
              </p>
            </div>
            <Switch
              id="two-factor"
              checked={twoFactorAuth}
              onCheckedChange={setTwoFactorAuth}
              disabled={isLoading}
            />
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          onClick={handleSaveSettings} 
          disabled={isLoading}
        >
          {isLoading ? 'Saving...' : 'Save Settings'}
        </Button>
      </CardFooter>
    </Card>
  );
}
