'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { db } from '@/lib/firebase/config';
import { collection, query, where, getDocs, doc, getDoc } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import LoadingDots from '@/components/LoadingDots';
import UserSiteLayout from '@/components/user-site/UserSiteLayout';

interface UserProfile {
  username: string;
  displayName: string | null;
  photoURL: string | null;
  bio?: string;
  createdAt?: any;
}

export default function UserProfilePage({ params }: { params: { username: string } }) {
  const { username } = params;
  const router = useRouter();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchUserProfile() {
      try {
        setLoading(true);
        
        // Query Users collection to find user by username
        const usersRef = collection(db, 'Users');
        const q = query(usersRef, where('username', '==', username));
        const querySnapshot = await getDocs(q);
        
        if (querySnapshot.empty) {
          setError(`User ${username} not found`);
          setLoading(false);
          return;
        }
        
        // Get the first matching user
        const userDoc = querySnapshot.docs[0];
        const userData = userDoc.data() as UserProfile;
        
        setUserProfile(userData);
        setError(null);
      } catch (err) {
        console.error('Error fetching user profile:', err);
        setError('Failed to load user profile');
      } finally {
        setLoading(false);
      }
    }
    
    fetchUserProfile();
  }, [username]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingDots />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <h1 className="text-2xl font-bold text-destructive mb-4">{error}</h1>
        <Button onClick={() => router.push('/')}>
          Return to Home
        </Button>
      </div>
    );
  }

  // Create a home page component for the user's site
  const UserHomePage = () => (
    <div className="container mx-auto py-8 px-4">
      <Card className="max-w-3xl mx-auto">
        <CardHeader className="flex flex-col sm:flex-row items-center gap-4">
          <div className="relative w-24 h-24 rounded-full overflow-hidden">
            <Image 
              src={userProfile?.photoURL || '/placeholder-avatar.png'} 
              alt={userProfile?.displayName || userProfile?.username || 'User'}
              fill
              className="object-cover"
            />
          </div>
          <div className="text-center sm:text-left">
            <CardTitle className="text-2xl">
              {userProfile?.displayName || userProfile?.username}
            </CardTitle>
            <CardDescription>
              @{userProfile?.username}
            </CardDescription>
            {userProfile?.createdAt && (
              <p className="text-sm text-muted-foreground mt-1">
                Member since {new Date(userProfile.createdAt.toDate()).toLocaleDateString()}
              </p>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {userProfile?.bio ? (
            <p className="text-muted-foreground">{userProfile.bio}</p>
          ) : (
            <p className="text-muted-foreground italic">No bio provided</p>
          )}
        </CardContent>
        <CardFooter className="flex justify-center sm:justify-start">
          <Button variant="outline" onClick={() => router.push(`/${username}/posts`)}>
            View Posts
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
  
  // Wrap the user home page with the theme layout
  return (
    <UserSiteLayout username={username}>
      <UserHomePage />
    </UserSiteLayout>
  );
}
