'use client';

import React from 'react';
import Header from './Header';
import Footer from './Footer';
import Sidebar from './Sidebar';
import { ThemeConfig } from '../theme.config';

interface LayoutProps {
  children: React.ReactNode;
  config: ThemeConfig;
  showSidebar?: boolean;
}

export default function Layout({ children, config, showSidebar = false }: LayoutProps) {
  return (
    <div className="min-h-screen flex flex-col bg-background text-text font-body">
      <Header 
        title={config.layout.header.title} 
        menu={config.layout.header.menu} 
        sticky={config.layout.header.sticky} 
      />
      
      <main className="flex-grow flex">
        <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-10 flex">
          {showSidebar && config.layout.sidebar?.visible && (
            <aside className="hidden lg:block w-64 shrink-0 mr-8">
              <div className="sticky top-24">
                <Sidebar 
                  title={config.layout.sidebar.title} 
                  content={config.layout.sidebar.content} 
                />
              </div>
            </aside>
          )}
          
          <div className="flex-grow w-full">
            {children}
          </div>
        </div>
      </main>
      
      <Footer 
        text={config.layout.footer.text} 
        showSocials={config.layout.footer.showSocials} 
        showPoweredBy={config.layout.footer.showPoweredBy} 
      />
    </div>
  );
}
