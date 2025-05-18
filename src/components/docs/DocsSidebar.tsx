'use client';

import React, { useState, useEffect } from 'react';

interface DocsSidebarProps {
  isSidebarOpen: boolean;
}

type SectionItem = {
  id: string;
  label: string;
};

type SectionGroup = {
  title: string;
  items: SectionItem[];
};

export default function DocsSidebar({ isSidebarOpen }: DocsSidebarProps) {
  const [activeSection, setActiveSection] = useState('introduction');
  
  // Define all sections in groups
  const sectionGroups: SectionGroup[] = [
    {
      title: 'Getting Started',
      items: [
        { id: 'introduction', label: 'Introduction' },
        { id: 'quick-start', label: 'Quick Start Guide' },
      ],
    },
    {
      title: 'Hosting',
      items: [
        { id: 'hosting-options', label: 'Hosting Options' },
        { id: 'domain-setup', label: 'Domain Setup' },
        { id: 'github-pages', label: 'GitHub Pages' },
      ],
    },
    {
      title: 'Features',
      items: [
        { id: 'posts', label: 'Posts & Pages' },
        { id: 'themes', label: 'Themes' },
        { id: 'storage', label: 'Storage' },
      ],
    },
    {
      title: 'Help',
      items: [
        { id: 'faq', label: 'FAQ' },
        { id: 'support', label: 'Support' },
      ],
    },
  ];
  
  // Track scroll position to update active section
  useEffect(() => {
    const handleScroll = () => {
      const sections = sectionGroups.flatMap(group => group.items);
      
      for (const section of sections) {
        const element = document.getElementById(section.id);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= 100 && rect.bottom >= 100) {
            setActiveSection(section.id);
            break;
          }
        }
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [sectionGroups]);
  
  return (
    <div className={`
      ${isSidebarOpen ? 'block' : 'hidden'} 
      md:block 
      w-64 border-r border-border h-[calc(100vh-64px)] overflow-y-auto sticky top-16 p-4
    `}>
      <h3 className="font-medium mb-4">Documentation</h3>
      
      <div className="space-y-1">
        {sectionGroups.map((group) => (
          <div key={group.title} className="mb-4">
            <h4 className="text-sm font-medium mb-2 text-muted-foreground">{group.title}</h4>
            <ul className="space-y-1 text-sm">
              {group.items.map((item) => {
                const isActive = activeSection === item.id;
                return (
                  <li key={item.id}>
                    <a 
                      href={`#${item.id}`} 
                      className={`block py-1 px-2 rounded transition-colors ${isActive 
                        ? 'bg-primary text-white font-medium' 
                        : 'hover:bg-accent hover:text-white'}`}
                      onClick={() => setActiveSection(item.id)}
                    >
                      {item.label}
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
