'use client';

import { useState } from 'react';
import { User } from 'firebase/auth';
import { UserData } from '@/services/firebase/auth-service';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

interface ProfileInfoFormProps {
  user: User | null;
  userData: UserData | null;
  onSubmit: (data: { displayName: string; bio: string }) => Promise<void>;
  isLoading: boolean;
}

export function ProfileInfoForm({ user, userData, onSubmit, isLoading }: ProfileInfoFormProps) {
  const [displayName, setDisplayName] = useState(userData?.displayName || user?.displayName || '');
  const [bio, setBio] = useState(userData?.bio || '');
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ displayName, bio });
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Personal Information</CardTitle>
        <CardDescription>
          Update your profile information that will be displayed on your profile page.
        </CardDescription>
      </CardHeader>
      
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="displayName">Display Name</Label>
            <Input
              id="displayName"
              placeholder="Enter your display name"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              disabled={isLoading}
            />
            <p className="text-sm text-muted-foreground">
              This is the name that will be displayed on your profile.
            </p>
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="bio">Bio</Label>
            <Textarea
              id="bio"
              placeholder="Tell us a bit about yourself"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              disabled={isLoading}
              className="min-h-[120px]"
            />
            <p className="text-sm text-muted-foreground">
              A brief description that will appear on your profile page.
            </p>
          </div>
        </CardContent>
        
        <CardFooter>
          <Button 
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? 'Saving...' : 'Save Information'}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
