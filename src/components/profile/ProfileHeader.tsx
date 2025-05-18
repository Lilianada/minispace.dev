'use client';

import { User } from 'firebase/auth';
import { UserData } from '@/lib/auth-context';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';

interface ProfileHeaderProps {
  user: User | null;
  userData: UserData | null;
}

export function ProfileHeader({ user, userData }: ProfileHeaderProps) {
  if (!user) return null;
  
  // Get initials for avatar fallback
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };
  
  const displayName = userData?.displayName || user.displayName || user.email?.split('@')[0] || 'User';
  const initials = getInitials(displayName);
  
  return (
    <Card className="mb-6">
      <CardContent className="flex items-center gap-4 pt-6">
        <Avatar className="h-20 w-20">
          <AvatarImage src={user.photoURL || undefined} alt={displayName} />
          <AvatarFallback className="text-lg">{initials}</AvatarFallback>
        </Avatar>
        
        <div>
          <h2 className="text-2xl font-semibold">{displayName}</h2>
          <p className="text-muted-foreground">@{userData?.username || 'username'}</p>
          {user.email && (
            <p className="text-sm text-muted-foreground mt-1">{user.email}</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
