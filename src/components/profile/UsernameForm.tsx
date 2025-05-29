'use client';

import { useState, useEffect } from 'react';
import { User } from 'firebase/auth';
import { UserData } from '@/services/firebase/auth-service';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { validateUsername } from '@/lib/username-utils';
import { AlertCircle, CheckCircle2 } from 'lucide-react';

interface UsernameFormProps {
  user: User | null;
  userData: UserData | null;
  onSubmit: (username: string) => Promise<void>;
  isLoading: boolean;
}

export function UsernameForm({ user, userData, onSubmit, isLoading }: UsernameFormProps) {
  const [newUsername, setNewUsername] = useState('');
  const [usernameMessage, setUsernameMessage] = useState<{
    type: 'success' | 'error' | 'info' | null;
    message: string;
  }>({ type: null, message: '' });
  
  // Initialize form with current username when userData is available
  useEffect(() => {
    if (userData?.username) {
      setNewUsername(userData.username);
    }
  }, [userData]);
  
  // Validate username as user types
  useEffect(() => {
    // Skip validation if username hasn't changed or is empty
    if (!newUsername || (userData?.username && newUsername === userData.username)) {
      setUsernameMessage({ type: null, message: '' });
      return;
    }
    
    // Debounce validation to avoid too many requests
    const handler = setTimeout(async () => {
      const result = await validateUsername(newUsername);
      
      if (result.valid) {
        setUsernameMessage({ type: 'success', message: 'Username is available' });
      } else {
        setUsernameMessage({ type: 'error', message: result.message });
      }
    }, 500);
    
    return () => clearTimeout(handler);
  }, [newUsername, userData]);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newUsername) {
      onSubmit(newUsername);
    }
  };
  
  const isFormValid = 
    newUsername && 
    usernameMessage.type !== 'error' && 
    !(userData?.username && newUsername === userData.username);
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid gap-2">
        <Label htmlFor="username">Username</Label>
        <div className="relative">
          <Input
            id="username"
            placeholder="Enter username"
            value={newUsername}
            onChange={(e) => setNewUsername(e.target.value)}
            disabled={isLoading}
            className={usernameMessage.type === 'error' ? 'border-red-500' : ''}
          />
          {usernameMessage.type && (
            <div className="absolute right-3 top-2.5">
              {usernameMessage.type === 'success' && (
                <CheckCircle2 className="h-5 w-5 text-green-500" />
              )}
              {usernameMessage.type === 'error' && (
                <AlertCircle className="h-5 w-5 text-red-500" />
              )}
            </div>
          )}
        </div>
        {usernameMessage.message && (
          <p className={`text-sm ${
            usernameMessage.type === 'success' ? 'text-green-500' : 
            usernameMessage.type === 'error' ? 'text-red-500' : 'text-gray-500'
          }`}>
            {usernameMessage.message}
          </p>
        )}
        <p className="text-sm text-muted-foreground">
          Your username is unique and will be used in your profile URL.
        </p>
      </div>
      
      <Button 
        type="submit"
        disabled={isLoading || !isFormValid}
      >
        {isLoading ? 'Updating...' : 'Update Username'}
      </Button>
    </form>
  );
}
