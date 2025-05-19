/* eslint-disable react/no-unescaped-entities */
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { db } from '@/lib/firebase/config';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';

export default function HeroSection() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [isChecking, setIsChecking] = useState(false);
  const [isAvailable, setIsAvailable] = useState<boolean | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const { toast } = useToast();
  
  // Check if username is available
  const checkUsername = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!username.trim()) {
      toast({
        title: "Username required",
        description: "Please enter a username to check availability",
        variant: "destructive",
      });
      return;
    }
    
    // Username validation
    const usernameRegex = /^[a-zA-Z0-9_-]{3,20}$/;
    if (!usernameRegex.test(username)) {
      toast({
        title: "Invalid username",
        description: "Username must be 3-20 characters and can only contain letters, numbers, underscores, and hyphens",
        variant: "destructive",
      });
      return;
    }
    
    try {
      setIsChecking(true);
      
      // Check if username exists in Firestore
      const usersRef = collection(db, 'Users');
      const q = query(usersRef, where('username', '==', username.toLowerCase()));
      const querySnapshot = await getDocs(q);
      
      const available = querySnapshot.empty;
      setIsAvailable(available);
      
      if (available) {
        // Show success message
        setShowSuccess(true);
        
        // Wait 3 seconds before redirecting
        setTimeout(() => {
          // If username is available, redirect to signup page with username in query params
          router.push(`/signup?username=${encodeURIComponent(username.toLowerCase())}`);
        }, 3000);
      } else {
        toast({
          title: "Username taken",
          description: "This username is already taken. Please try another one.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error checking username:', error);
      toast({
        title: "Error",
        description: "Failed to check username availability. Please try again.",
        variant: "destructive",
      });
    } finally {
      if (!isAvailable) {
        setIsChecking(false);
      }
    }
  };
  
  return (
    <section className="container mx-auto px-4 pt-20 pb-16 sm:pt-24 sm:pb-20 text-center min-h-[calc(100vh-80px)] flex flex-col justify-center items-center">
      <div className="inline-flex items-center justify-center rounded-full border border-accent/30 bg-accent/10 py-1 px-3 text-xs font-medium text-accent mb-6 w-fit">
        <span>Limited Access</span>
        <span className="mx-1">•</span>
        <span>Join Our Beta Community Today</span>
      </div>
      
      <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-foreground max-w-3xl mx-auto">
        Your Own Mini Space on the Internet in Minutes
      </h1>
      
      <p className="mt-6 text-lg text-muted-foreground max-w-2xl mx-auto">
        Create a stunning, lightning-fast blog without the complexity. Express yourself, share your ideas, and build your audience with Minispace's intuitive platform.
      </p>
      
      <div className="mt-10 w-full max-w-md mx-auto">
        {showSuccess ? (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
            <div className="text-green-600 text-xl font-medium mb-2">
              🎉 Hooray! Your username is available!
            </div>
            <p className="text-green-700 mb-2">
              We're getting you started with <strong>{username}</strong> in just a moment...
            </p>
            <div className="w-full bg-green-200 rounded-full h-1.5 mt-4">
              <div className="bg-green-500 h-1.5 rounded-full animate-[progress_3s_ease-in-out]" style={{ width: '100%' }}></div>
            </div>
          </div>
        ) : (
          <form onSubmit={checkUsername} className="relative">
            <div className="relative flex items-center w-full rounded-full overflow-hidden border border-border shadow-sm bg-white">
              <Input
                type="text"
                placeholder="Enter your dream username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 pl-6 h-14 text-base"
                style={{ paddingRight: '160px' }} /* Ensure text doesn't go under button */
              />
              <Button 
                type="submit" 
                className="absolute right-1 top-1/2 transform -translate-y-1/2 px-6 py-1 h-12 rounded-full"
                disabled={isChecking}
              >
                {isChecking ? 'Checking...' : 'Claim Your Space'}
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-2 text-center">
              Check if your dream username is available on minispace and get started in seconds
            </p>
          </form>
        )}
      </div>
    </section>
  );
}