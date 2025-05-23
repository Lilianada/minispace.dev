'use client';

import React, { useState, useEffect } from 'react';
import { usePathname, useParams } from 'next/navigation';
import Navbar from '@/components/dashboard/Navbar';
import Sidebar from '@/components/dashboard/Sidebar';
import { Breadcrumb } from '@/components/ui/breadcrumb';
import { getDashboardPath } from '@/lib/route-utils';

// Helper function to generate breadcrumb segments from pathname
function generateBreadcrumbs(pathname: string, username: string) {
  const paths = pathname.split('/').filter(Boolean);
  
  // Don't generate breadcrumbs for dashboard root
  if (paths.length <= 2 && paths.includes('dashboard')) {
    return null;
  }
  
  const breadcrumbs = [];
  
  // Always include dashboard as first item
  breadcrumbs.push({
    name: 'Dashboard',
    href: username ? `/${username}/dashboard` : getDashboardPath(),
  });
  
  // Generate breadcrumb items based on path segments
  let currentPath = '';
  const dashboardIndex = paths.indexOf('dashboard');
  
  // Start from the segment after dashboard
  for (let i = dashboardIndex + 1; i < paths.length; i++) {
    const segment = paths[i];
    currentPath += `/${segment}`;
    
    // Skip numeric IDs in paths and combine with previous item
    if (/^\d+$/.test(segment) || /^[a-f0-9]{24}$/.test(segment)) {
      continue;
    }
    
    // Format segment name (convert kebab-case to title case)
    let name = segment.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
    
    // Handle special cases
    if (segment === 'posts' && i === dashboardIndex + 1) {
      name = 'Posts';
    } else if (segment === 'new-post') {
      name = 'Create New Post';
    } else if (segment === 'edit' && paths[i-1]) {
      name = 'Edit Post';
    } else if (segment === 'settings') {
      name = 'Settings';
    } else if (segment === 'site-customization') {
      name = 'Site Customization';
    }
    
    breadcrumbs.push({
      name,
      href: username ? `/${username}/dashboard${currentPath}` : getDashboardPath(currentPath.substring(1)),
      isLast: i === paths.length - 1 && !/^\d+$/.test(paths[paths.length - 1]),
    });
  }
  
  // Mark the last item as last (if not already marked)
  if (breadcrumbs.length > 0 && !breadcrumbs.some(b => b.isLast)) {
    breadcrumbs[breadcrumbs.length - 1].isLast = true;
  }
  
  return breadcrumbs;
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const pathname = usePathname();
  const params = useParams();
  const username = params?.username as string;
  
  // Hydration fix - only enable client-side features after mounting
  useEffect(() => {
    setIsMounted(true);
    
    // Log for debugging
    console.log('Dashboard layout mounted', { 
      username, 
      pathname,
      params
    });
  }, [username, pathname, params]);

  // Handle sidebar collapse state
  const handleSidebarToggle = (collapsed: boolean) => {
    setIsCollapsed(collapsed);
  };
  
  // Generate breadcrumbs based on current path
  const breadcrumbs = isMounted ? generateBreadcrumbs(pathname || '', username) : null;

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Sidebar - hidden on mobile */}
      <div className="hidden md:block">
        <Sidebar 
          isCollapsed={isCollapsed} 
          onToggle={handleSidebarToggle} 
        />
      </div>
      
      <div 
        className={`flex-1 flex flex-col transition-all duration-300 ${
          isMounted ? (isCollapsed ? 'md:ml-16' : 'md:ml-64') : 'md:ml-64'
        }`}
      >
        {/* Top navbar */}
        <Navbar />
        
        {/* Main content */}
        <main className="flex-1 overflow-y-auto bg-muted/30 p-4 md:p-6">
          <div className="max-w-7xl mx-auto space-y-6">
            {/* Breadcrumbs */}
            {breadcrumbs && breadcrumbs.length > 1 && (
              <Breadcrumb segments={breadcrumbs} />
            )}
            
            {/* Page content */}
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}