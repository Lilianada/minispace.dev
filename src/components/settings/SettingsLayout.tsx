'use client';

import { ReactNode } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { StorageUsage } from '@/components/ui/storage-usage';
import useAuth from '@/hooks/useAuth';
import { isAuthContextUserData } from '@/lib/type-adapters';
import { Skeleton } from '@/components/ui/skeleton';

interface SettingsLayoutProps {
  children: ReactNode;
  activeTab?: string;
}

// Define all settings navigation items
export const settingsNavigation = [
  { name: 'General', href: '/dashboard/settings', current: true },
  { name: 'Profile', href: '/dashboard/settings/profile', current: false },
  { name: 'Appearance', href: '/dashboard/settings/appearance', current: false },
  { name: 'Domain', href: '/dashboard/settings/domain', current: false },
  { name: 'Storage', href: '/dashboard/settings/storage', current: false },
  { name: 'Site Customization', href: '/dashboard/site-customization', current: false },
];

export default function SettingsLayout({ children, activeTab = 'general' }: SettingsLayoutProps) {
  const pathname = usePathname();
  const { user, userData, loading: authLoading } = useAuth();
  
  // Ensure userData is of the correct type
  const validUserData = isAuthContextUserData(userData) ? userData : null;
  const username = validUserData?.username || '';
  
  // Update navigation items with the correct base path and active state
  const navigationWithUsername = settingsNavigation.map(item => ({
    ...item,
    href: `/${username}${item.href}`,
    current: pathname.includes(item.href.split('/dashboard')[1])
  }));
  
  // Special case for site-customization which is at a different path
  const siteCustomizationItem = navigationWithUsername.find(item => 
    item.name === 'Site Customization'
  );
  if (siteCustomizationItem) {
    siteCustomizationItem.current = pathname.includes('/site-customization');
  }
  
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Settings</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="md:col-span-1">
          <Card className="p-4">
            <div>
              <h2 className="text-lg font-medium mb-4">Settings Menu</h2>
              <nav className="flex flex-col space-y-1">
                {navigationWithUsername.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`px-3 py-2 rounded-md text-sm font-medium ${
                      item.current
                        ? 'bg-primary/10 text-primary'
                        : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                    }`}
                  >
                    {item.name}
                  </Link>
                ))}
              </nav>
              
              <div className="mt-6">
                {!authLoading && user ? (
                  <StorageUsage compact />
                ) : (
                  <Skeleton className="h-12 w-full" />
                )}
              </div>
            </div>
          </Card>
        </div>
        
        <div className="md:col-span-3">
          {children}
        </div>
      </div>
    </div>
  );
}
