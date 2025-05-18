'use client';

import React from 'react';

interface DocsSidebarProps {
  isSidebarOpen: boolean;
}

export default function DocsSidebar({ isSidebarOpen }: DocsSidebarProps) {
  return (
    <div className={`
      ${isSidebarOpen ? 'block' : 'hidden'} 
      md:block 
      w-64 border-r border-border h-[calc(100vh-64px)] overflow-y-auto sticky top-16 p-4
    `}>
      <h3 className="font-medium mb-4">Documentation</h3>
      
      <div className="space-y-1">
        <div className="mb-4">
          <h4 className="text-sm font-medium mb-2 text-muted-foreground">Getting Started</h4>
          <ul className="space-y-1 text-sm">
            <li>
              <a href="#introduction" className="block py-1 px-2 rounded hover:bg-accent text-primary font-medium">
                Introduction
              </a>
            </li>
            <li>
              <a href="#quick-start" className="block py-1 px-2 rounded hover:bg-accent">
                Quick Start Guide
              </a>
            </li>
          </ul>
        </div>
        
        <div className="mb-4">
          <h4 className="text-sm font-medium mb-2 text-muted-foreground">Hosting</h4>
          <ul className="space-y-1 text-sm">
            <li>
              <a href="#hosting-options" className="block py-1 px-2 rounded hover:bg-accent">
                Hosting Options
              </a>
            </li>
            <li>
              <a href="#domain-setup" className="block py-1 px-2 rounded hover:bg-accent">
                Domain Setup
              </a>
            </li>
            <li>
              <a href="#github-pages" className="block py-1 px-2 rounded hover:bg-accent">
                GitHub Pages
              </a>
            </li>
          </ul>
        </div>
        
        <div className="mb-4">
          <h4 className="text-sm font-medium mb-2 text-muted-foreground">Features</h4>
          <ul className="space-y-1 text-sm">
            <li>
              <a href="#posts" className="block py-1 px-2 rounded hover:bg-accent">
                Posts & Pages
              </a>
            </li>
            <li>
              <a href="#themes" className="block py-1 px-2 rounded hover:bg-accent">
                Themes
              </a>
            </li>
            <li>
              <a href="#storage" className="block py-1 px-2 rounded hover:bg-accent">
                Storage
              </a>
            </li>
          </ul>
        </div>
        
        <div className="mb-4">
          <h4 className="text-sm font-medium mb-2 text-muted-foreground">Help</h4>
          <ul className="space-y-1 text-sm">
            <li>
              <a href="#faq" className="block py-1 px-2 rounded hover:bg-accent">
                FAQ
              </a>
            </li>
            <li>
              <a href="#support" className="block py-1 px-2 rounded hover:bg-accent">
                Support
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
