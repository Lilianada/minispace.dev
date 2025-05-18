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
        {showSidebar && config.layout.sidebar?.visible && (
          <Sidebar 
            title={config.layout.sidebar.title} 
            content={config.layout.sidebar.content} 
          />
        )}
        
        <div className={`flex-grow ${showSidebar ? 'max-w-3xl' : 'max-w-4xl'} mx-auto px-4 py-8 w-full`}>
          {children}
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
