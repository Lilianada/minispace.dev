'use client';

import { User } from 'firebase/auth';
import { UserData } from '@/lib/auth-context';
import { Card, CardContent } from '@/components/ui/card';
import Link from 'next/link';

interface SettingsHeaderProps {
  user: User | null;
  userData: UserData | null;
}

export function SettingsHeader({ user, userData }: SettingsHeaderProps) {
  if (!user) return null;
  
  const username = userData?.username || user.uid;
  
  return (
    <Card className="mb-6">
      <CardContent className="p-6">
        <div className="flex items-center gap-4">
          <div>
            <h3 className="text-lg font-semibold mb-2">Hi {username}!</h3>
            <p className="text-muted-foreground">Manage your account and site preferences. If you encounter any issues while using the settings page or the app in general, be sure to leave a message for us on the <Link className="" href="/issues">Issues Page</Link> and we'll get to it in time.</p>
          </div>
        </div>
        
      </CardContent>
    </Card>
  );
}
