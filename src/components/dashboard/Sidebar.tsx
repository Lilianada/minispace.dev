'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { Button } from '../ui/button';
import { StorageUsage, StorageUpgradePrompt } from '../ui/storage-usage';
import { ExternalLink } from 'lucide-react';

interface NavigationItem {
  name: string;
  href: string;
  icon: (className: string) => React.ReactElement;
}

interface SidebarProps {
  isCollapsed: boolean;
  onToggle: (collapsed: boolean) => void;
}

export default function Sidebar({ isCollapsed, onToggle }: SidebarProps) {
  const pathname = usePathname();
  const { userData } = useAuth();
  const [username, setUsername] = useState('');
  
  useEffect(() => {
    if (userData) {
      setUsername(userData.username);
    } else if (typeof window !== 'undefined') {
      const storedUsername = localStorage.getItem('username');
      if (storedUsername) {
        setUsername(storedUsername);
      }
    }
  }, [userData]);
  
  // Build navigation links with username if available
  const getNavLink = (path: string) => {
    if (!username) {
      // Redirect to login if username is missing
      return '/signin?redirect=dashboard';
    }
    
    // Extract the part after '/dashboard/'
    const match = path.match(/\/dashboard\/?(.*)/);
    const subpath = match ? match[1] : '';
    
    return `/${username}/dashboard${subpath ? '/' + subpath : ''}`;
  };
  
  const navigation: NavigationItem[] = [
    {
      name: 'Dashboard',
      href: getNavLink('/dashboard'),
      icon: (className) => (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
        </svg>
      )
    },
    {
      name: 'Posts',
      href: getNavLink('/dashboard/posts'),
      icon: (className) => (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
        </svg>
      )
    },
    {
      name: 'Analytics',
      href: getNavLink('/dashboard/analytics'),
      icon: (className) => (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
        </svg>
      )
    },
    {
      name: 'Site Customization',
      href: getNavLink('/dashboard/site-customization'),
      icon: (className) => (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9.53 16.122a3 3 0 00-5.78 1.128 2.25 2.25 0 01-2.4 2.245 4.5 4.5 0 008.4-2.245c0-.399-.078-.78-.22-1.128zm0 0a15.998 15.998 0 003.388-1.62m-5.043-.025a15.994 15.994 0 011.622-3.395m3.42 3.42a15.995 15.995 0 004.764-4.648l3.876-5.814a1.151 1.151 0 00-1.597-1.597L14.146 6.32a15.996 15.996 0 00-4.649 4.763m3.42 3.42a6.776 6.776 0 00-3.42-3.42" />
        </svg>
      )
    },
    {
      name: 'Settings',
      href: getNavLink('/dashboard/settings'),
      icon: (className) => (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      )
    }
  ];

  return (
    <div className={`fixed h-full bg-background border-r border-border transition-all duration-300 ${isCollapsed ? 'w-16' : 'w-64'}`}>
      {/* Sidebar header */}
      <div className="h-16 flex items-center px-4 border-b border-border">
        <div className="flex items-center">
          {!isCollapsed && (
            <span className="text-xl font-medium text-primary">Minispace</span>
          )}
          {isCollapsed && (
            <span className="text-xl font-medium text-primary">M</span>
          )}
        </div>
        <button
          className="ml-auto text-muted-foreground hover:text-foreground p-1 rounded-md focus:text-primary"
          onClick={() => onToggle(!isCollapsed)}
        >
          {isCollapsed ? (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 4.5l7.5 7.5-7.5 7.5m-6-15l7.5 7.5-7.5 7.5" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M18.75 19.5l-7.5-7.5 7.5-7.5m-6 15L5.25 12l7.5-7.5" />
            </svg>
          )}
        </button>
      </div>

      {/* Navigation items */}
      <nav className="mt-5 px-2">
        <div className="space-y-2">
          {navigation.map((item) => {
            // Check if path after username matches the expected dashboard route pattern
            const baseHref = item.href.replace(`/${username}`, '');
            const isActive = pathname.includes(baseHref) && 
              // Ensure it's an exact match for dashboard home or starts with other sections
              (baseHref === '/dashboard' ? 
                pathname.endsWith('/dashboard') : 
                pathname.includes(baseHref));
            
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`${
                  isActive
                    ? 'bg-primary/10 text-primary'
                    : 'text-muted-foreground hover:bg-accent hover:text-muted'
                } group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors`}
              >
                {item.icon(`h-5 w-5 mr-${isCollapsed ? '0' : '3'} flex-shrink-0`)}
                {!isCollapsed && <span>{item.name}</span>}
              </Link>
            );
          })}
        </div>
      </nav>


      {/* Storage section */}
        <div className="absolute bottom-0 w-full p-4 grid gap-4">
      {!isCollapsed && (
        <>
          {/* Banner to upgrade to pro */}
          <StorageUpgradePrompt />
          
          {/* Storage usage component */}
          <StorageUsage compact />
          </>
        )}
          {/* Documentation link */}
          <Link 
            href="/docs" 
            target="_blank"
            className="text-sm text-muted-foreground hover:text-primary flex items-center  py-2"
          >
           {isCollapsed && <ExternalLink className={`h-4 w-4 mr-0 flex-shrink-0`} />}
           {!isCollapsed && <span>Documentation</span>}
          </Link>
        </div>
    </div>
  );
}