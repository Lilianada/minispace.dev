'use client';

import { User } from 'firebase/auth';
import { UserData } from '@/lib/auth-context';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Palette, Globe } from 'lucide-react';
import Link from 'next/link';

interface CustomizationHeaderProps {
  user: User | null;
  userData: UserData | null;
}

export function CustomizationHeader({ user, userData }: CustomizationHeaderProps) {
  if (!user) return null;

  const username = userData?.username || user.uid;


  return (
    <Card className="mb-6">
      <CardContent className="pt-6">

        <div className="flex items-center gap-4 mb-6">

          <div>
            <p className="text-muted-foreground">
              Customize your personal site on Minispace. Changes will be visible at <strong>{username}.minispace.dev</strong>
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          <Button variant="outline" size="sm" asChild>
            <Link href={`/${username}/dashboard/settings/domain`}>
              <Globe className="h-4 w-4 mr-2" />
              Domain Settings
            </Link>
          </Button>

          <Button variant="outline" size="sm" asChild>
            <Link href={`/${username}/dashboard/site-customization/themes`}>
              <Palette className="h-4 w-4 mr-2" />
              Theme Settings
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
