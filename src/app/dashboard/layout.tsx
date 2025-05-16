'use client';

import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Navbar from '@/components/dashboard-page/Navbar';
import Sidebar from '@/components/dashboard-page/Sidebar';
import { Breadcrumb } from '@/components/ui/breadcrumb';

// Helper function to generate breadcrumb segments from pathname
function generateBreadcrumbs(pathname: string) {
  const paths = pathname.split('/').filter(Boolean);
  
  // Don't generate breadcrumbs for dashboard root
  if (paths.length === 1 && paths[0] === 'dashboard') {
    return null;
  }
  
  const breadcrumbs = [];
  let currentPath = '';
  
  // Always include dashboard as first item
  breadcrumbs.push({
    name: 'Dashboard',
    href: '/dashboard',
  });
  
  // Generate breadcrumb items based on path segments
  for (let i = 1; i < paths.length; i++) {
    const segment = paths[i];
    currentPath += `/${segment}`;
    const fullPath = `/dashboard${currentPath}`;
    
    // Skip numeric IDs in paths and combine with previous item
    if (/^\d+$/.test(segment) || /^[a-f0-9]{24}$/.test(segment)) {
      continue;
    }
    
    // Format segment name (convert kebab-case to title case)
    let name = segment.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
    
    // Handle special cases
    if (segment === 'posts' && i === 1) {
      name = 'Posts';
    } else if (segment === 'new-post') {
      name = 'Create New Post';
    } else if (segment === 'edit' && paths[i-1]) {
      name = 'Edit Post';
    } else if (segment === 'settings') {
      name = 'Settings';
    }
    
    breadcrumbs.push({
      name,
      href: fullPath,
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
  
  // Hydration fix - only enable client-side features after mounting
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Handle sidebar collapse state
  const handleSidebarToggle = (collapsed: boolean) => {
    setIsCollapsed(collapsed);
  };
  
  // Generate breadcrumbs based on current path
  const breadcrumbs = isMounted ? generateBreadcrumbs(pathname || '') : null;

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