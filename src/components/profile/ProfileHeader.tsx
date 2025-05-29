'use client';

import { User } from 'firebase/auth';
import { UserData } from '@/services/firebase/auth-service';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';

interface ProfileHeaderProps {
  name: string;
  bio?: string | null;
  avatarUrl?: string | null;
  socialLinks?: Record<string, string> | null;
  user?: User | null;
  userData?: UserData | null;
}

export function ProfileHeader({ name, bio, avatarUrl, socialLinks, user, userData }: ProfileHeaderProps) {
  // Get initials for avatar fallback
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };
  
  const initials = getInitials(name);
  const username = userData?.username || (name.toLowerCase().replace(/\s+/g, '_'));
  
  return (
    <Card className="mb-6">
      <CardContent className="flex items-center gap-4 pt-6">
        <Avatar className="h-20 w-20">
          <AvatarImage src={avatarUrl || undefined} alt={name} />
          <AvatarFallback className="text-lg">{initials}</AvatarFallback>
        </Avatar>
        
        <div>
          <h2 className="text-2xl font-semibold">{name}</h2>
          <p className="text-muted-foreground">@{username}</p>
          {bio && (
            <p className="text-sm text-muted-foreground mt-1">{bio}</p>
          )}
          {socialLinks && Object.keys(socialLinks).length > 0 && (
            <div className="mt-2 flex gap-2">
              {Object.entries(socialLinks).map(([key, url]) => (
                <a key={key} href={url} target="_blank" rel="noopener noreferrer" className="text-sm hover:underline">
                  {key}
                </a>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
