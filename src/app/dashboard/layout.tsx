'use client';

import React, { useState, useEffect } from 'react';
import Navbar from '@/components/dashboard-page/Navbar';
import Sidebar from '@/components/dashboard-page/Sidebar';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  
  // Hydration fix - only enable client-side features after mounting
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Handle sidebar collapse state
  const handleSidebarToggle = (collapsed: boolean) => {
    setIsCollapsed(collapsed);
  };

  return (
    <div className="h-screen flex flex-col md:flex-row">
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
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}