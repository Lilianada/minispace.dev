'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import {ProfileHeader} from '@/components/profile/ProfileHeader';
import { db } from '@/lib/firebase/config';
import { doc, getDoc } from 'firebase/firestore';

export default function UserSiteClient() {
  const params = useParams();
  const username = params.username as string;
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchUserData() {
      try {
        // Fetch user data from the username collection to get the user ID
        const usernameRef = doc(db, 'usernames', username);
        const usernameDoc = await getDoc(usernameRef);

        if (!usernameDoc.exists()) {
          setError('User not found');
          setLoading(false);
          return;
        }

        const userId = usernameDoc.data().userId;
        
        // Fetch the actual user data
        const userRef = doc(db, 'users', userId);
        const userDoc = await getDoc(userRef);

        if (!userDoc.exists()) {
          setError('User data not found');
          setLoading(false);
          return;
        }

        setUserData({
          id: userId,
          ...userDoc.data()
        });
        setLoading(false);
      } catch (err) {
        console.error('Error fetching user data:', err);
        setError('Failed to load user data');
        setLoading(false);
      }
    }

    if (username) {
      fetchUserData();
    }
  }, [username]);

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">Loading user profile...</div>;
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <h1 className="text-2xl font-bold mb-4">Error</h1>
        <p className="text-muted-foreground mb-6">{error}</p>
        <Link href="/">
          <Button variant="outline">Return to Home</Button>
        </Link>
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <h1 className="text-2xl font-bold mb-4">User Not Found</h1>
        <p className="text-muted-foreground mb-6">The user {username} doesn't exist or has been removed.</p>
        <Link href="/">
          <Button variant="outline">Return to Home</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="user-profile-container max-w-4xl mx-auto p-4">
      <ProfileHeader 
        name={userData.name || username}
        bio={userData.bio}
        avatarUrl={userData.avatarUrl}
        socialLinks={userData.socialLinks}
      />
      
      <div className="mt-8">
        <h2 className="text-2xl font-semibold mb-4">Posts</h2>
        {userData.posts && userData.posts.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2">
            {userData.posts.map((post: any) => (
              <Card key={post.id} className="overflow-hidden">
                <CardHeader>
                  <CardTitle>{post.title}</CardTitle>
                  <CardDescription>
                    {new Date(post.publishedAt).toLocaleDateString()}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="line-clamp-3">{post.excerpt}</p>
                </CardContent>
                <CardFooter>
                  <Link href={`/${username}/post/${post.slug}`}>
                    <Button variant="ghost">Read more</Button>
                  </Link>
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground">No posts yet.</p>
        )}
      </div>
    </div>
  );
}
