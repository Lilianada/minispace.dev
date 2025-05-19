'use client';

import React, { useState } from 'react';
import Navbar from '@/components/dashboard/Navbar';

// Import documentation components
import DocsSidebar from '@/components/docs/DocsSidebar';
import IntroSection from '@/components/docs/IntroSection';
import QuickStartSection from '@/components/docs/QuickStartSection';
import DomainSetupSection from '@/components/docs/DomainSetupSection';
import HostingOptionsSection from '@/components/docs/HostingOptionsSection';
import GitHubPagesSection from '@/components/docs/GitHubPagesSection';
import FAQSection from '@/components/docs/FAQSection';
import DocsFooter from '@/components/docs/DocsFooter';
import Footer from '../test/components/Footer';

export default function DocsPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  return (
    <div className="min-h-screen flex flex-col">
      {/* Navbar */}
      <Navbar />
      
      {/* Documentation content */}
      <div className="flex-1 flex flex-col md:flex-row">
        {/* Sidebar - Mobile Toggle */}
        <div className="md:hidden p-4 border-b border-border">
          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="flex items-center text-sm font-medium text-muted-foreground hover:text-foreground"
          >
            <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
            Documentation Menu
          </button>
        </div>
        
        {/* Sidebar */}
        <DocsSidebar isSidebarOpen={isSidebarOpen} />

        {/* Main content */}
        <div className="flex-1 p-4 sm:p-6 md:p-8 lg:p-10 overflow-y-auto w-full">
          <div className="max-w-3xl mx-auto w-full">
            <IntroSection />
            <QuickStartSection />
            <DomainSetupSection />
            <HostingOptionsSection />
            <GitHubPagesSection />
            <FAQSection />
          </div>
        </div>
      </div>
      
      {/* Footer */}
      <Footer/>
    </div>
  );
}
