'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { doc, deleteDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import { deleteUser } from 'firebase/auth';
import { useToast } from '@/hooks/use-toast';

interface DangerZoneProps {
  user: any;
  logout: () => Promise<void>;
}

export function DangerZone({ user, logout }: DangerZoneProps) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  // Delete all posts
  const handleDeleteAllPosts = async () => {
    if (!user || !window.confirm('Are you sure you want to delete all your posts? This action cannot be undone.')) {
      return;
    }
    
    setIsLoading(true);
    try {
      // Get all posts by the user
      const postsQuery = query(collection(db, 'posts'), where('authorId', '==', user.uid));
      const postsSnapshot = await getDocs(postsQuery);
      
      // Delete each post
      const deletePromises = postsSnapshot.docs.map(doc => deleteDoc(doc.ref));
      await Promise.all(deletePromises);
      
      toast({
        title: 'Posts deleted',
        description: `Successfully deleted ${postsSnapshot.size} posts.`,
      });
    } catch (error) {
      console.error('Error deleting posts:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete posts. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  // Delete account
  const handleDeleteAccount = async () => {
    if (!user || !window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      return;
    }
    
    setIsLoading(true);
    try {
      // Delete user data from Firestore
      await deleteDoc(doc(db, 'Users', user.uid));
      await deleteDoc(doc(db, 'Users', user.uid, 'settings', 'preferences'));
      
      // Delete the user from Firebase Auth
      await deleteUser(user);
      
      // Log out
      await logout();
      
      toast({
        title: 'Account deleted',
        description: 'Your account has been deleted successfully.',
      });
      
      // Redirect to home page
      window.location.href = '/';
    } catch (error) {
      console.error('Error deleting account:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete account. You may need to reauthenticate.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="border-destructive/50">
      <CardHeader>
        <CardTitle className="text-destructive">Danger Zone</CardTitle>
        <CardDescription>
          Actions here can permanently affect your account.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Delete All Posts</h3>
          <p className="text-sm text-muted-foreground">
            This will permanently delete all of your posts. This action cannot be undone.
          </p>
          <Button 
            variant="destructive" 
            onClick={handleDeleteAllPosts}
            disabled={isLoading}
          >
            {isLoading ? 'Deleting...' : 'Delete All Posts'}
          </Button>
        </div>
        
        <Separator />
        
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Delete Account</h3>
          <p className="text-sm text-muted-foreground">
            This will permanently delete your account and all associated data. This action cannot be undone.
          </p>
          <Button 
            variant="destructive" 
            onClick={handleDeleteAccount}
            disabled={isLoading}
          >
            {isLoading ? 'Deleting...' : 'Delete Account'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
