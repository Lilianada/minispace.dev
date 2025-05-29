'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import useAuth from '@/hooks/useAuth';
import { getDashboardPath } from '@/lib/route-utils';

export default function Navbar() {
  // Use type assertion to address TypeScript issue with the auth context
  const auth = useAuth() as {
    user: any;
    userData: any;
    logout: () => Promise<void>;
    [key: string]: any;
  };
  const { user, userData, logout } = auth;
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [dashboardUrl, setDashboardUrl] = useState('/signin?redirect=dashboard');
  
  useEffect(() => {
    // Get the username-based dashboard URL
    if (userData && userData.username) {
      setDashboardUrl(`/${userData.username}/dashboard`);
    } else if (typeof window !== 'undefined') {
      const username = localStorage.getItem('username');
      if (username) {
        setDashboardUrl(`/${username}/dashboard`);
      } else {
        // If no username is available, redirect to login
        setDashboardUrl('/signin?redirect=dashboard');
      }
    }
  }, [userData]);

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <nav className="bg-background border-b border-border sticky top-0 z-10">
      <div className="mx-auto px-4 sm:px-6">
        <div className="flex justify-between h-16">
          {/* Left: Logo (mobile only) */}
          <div className="flex items-center md:hidden">
            <Link href={dashboardUrl} className="flex-shrink-0 flex items-center">
              <span className="text-xl font-medium text-primary">Minispace</span>
            </Link>
          </div>

          {/* Center: Search bar */}
          <div className="hidden md:flex items-center justify-center flex-1 px-2">
            <div className="max-w-lg w-full">
              <label htmlFor="search" className="sr-only">Search</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-muted-foreground" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                  </svg>
                </div>
                <input
                  id="search"
                  name="search"
                  className="block w-full pl-10 pr-3 py-2 border border-border rounded-md leading-5 bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                  placeholder="Search posts..."
                  type="search"
                />
              </div>
            </div>
          </div>

          {/* Right: User menu */}
          <div className="flex items-center">
            <button 
              type="button"
              className="md:hidden p-2 rounded-md text-foreground"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <span className="sr-only">{isMobileMenuOpen ? 'Close menu' : 'Open menu'}</span>
              <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isMobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
              </svg>
            </button>

            <div className="hidden md:ml-4 md:flex md:items-center">
              <Link href="/docs" className="text-sm font-medium px-3 py-2 rounded-md hover:bg-accent hover:text-accent-foreground transition-colors">
                Documentation
              </Link>
              
              {/* Notifications */}
              {/* <button className="ml-2 p-2 rounded-full text-muted-foreground hover:text-foreground focus:outline-none focus:ring-2 focus:ring-primary">
                <span className="sr-only">View notifications</span>
                <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
              </button> */}

              {/* Profile dropdown */}
              <div className="ml-3 relative">
                <div>
                  <button 
                    type="button"
                    className="flex items-center max-w-xs rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  >
                    <span className="sr-only">Open user menu</span>
                    <div className="h-8 w-8 rounded-full bg-primary/10 text-primary flex items-center justify-center capitalize">
                      {userData?.username?.charAt(0) || user?.email?.charAt(0) || 'U'}
                    </div>
                  </button>
                </div>
                
                {isDropdownOpen && (
                  <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-background border border-border focus:outline-none">
                    <div className="py-1">
                      <div className="flex flex-col px-4 py-2 text-xs text-muted-foreground">
                        Signed in as <span className="text-sm font-medium text-foreground capitalize">{userData?.username || user?.email}</span>
                      </div>
                      <hr className="border-border" />
                      <Link 
                        href={`${dashboardUrl}/profile`} 
                        className="block px-4 py-2 text-sm text-foreground hover:bg-accent hover:text-accent-foreground"
                        onClick={() => setIsDropdownOpen(false)}
                      >
                        Your Profile
                      </Link>
                      <Link 
                        href={`${dashboardUrl}/settings`} 
                        className="block px-4 py-2 text-sm text-foreground hover:bg-accent hover:text-accent-foreground"
                        onClick={() => setIsDropdownOpen(false)}
                      >
                        Settings
                      </Link>
                      <button 
                        className="block w-full text-left px-4 py-2 text-sm text-foreground hover:bg-accent hover:text-accent-foreground"
                        onClick={() => {
                          handleLogout();
                          setIsDropdownOpen(false);
                        }}
                      >
                        Sign out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-border">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link 
              href="/docs"
              className="block px-3 py-2 rounded-md text-base font-medium text-foreground hover:bg-accent hover:text-accent-foreground"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Documentation
            </Link>
          </div>
          <div className="pt-4 pb-3 border-t border-border">
            <div className="flex items-center px-5">
              <div className="flex-shrink-0">
                <div className="h-10 w-10 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                  {userData?.username?.charAt(0) || user?.email?.charAt(0) || 'U'}
                </div>
              </div>
              <div className="ml-3">
                <div className="text-base font-medium text-foreground">{userData?.username || 'User'}</div>
                <div className="text-sm font-medium text-muted-foreground">{user?.email}</div>
              </div>
              <button className="ml-auto p-1 rounded-full text-muted-foreground hover:text-foreground focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary">
                <span className="sr-only">View notifications</span>
                <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
              </button>
            </div>
            <div className="mt-3 px-2 space-y-1">
              <Link 
                href={`${dashboardUrl}/profile`}
                className="block px-3 py-2 rounded-md text-base font-medium text-foreground hover:bg-accent hover:text-accent-foreground"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Your Profile
              </Link>
              <Link 
                href={`${dashboardUrl}/settings`}
                className="block px-3 py-2 rounded-md text-base font-medium text-foreground hover:bg-accent hover:text-accent-foreground"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Settings
              </Link>
              <button 
                className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-foreground hover:bg-accent hover:text-accent-foreground"
                onClick={() => {
                  handleLogout();
                  setIsMobileMenuOpen(false);
                }}
              >
                Sign out
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}