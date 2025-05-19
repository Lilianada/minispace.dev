'use client';

import React from 'react';
import Layout from '../components/Layout';
import HeroBlock from '../blocks/HeroBlock';
import TextBlock from '../blocks/TextBlock';
import CTABlock from '../blocks/CTABlock';
import RecentPostsBlock from '../blocks/RecentPostsBlock';
import { ThemeConfig } from '../theme.config';

interface HomePageProps {
  config: ThemeConfig;
  userData?: any;
  posts?: any[];
}

export default function HomePage({ config, userData, posts = [] }: HomePageProps) {
  // Get blocks for the home page
  const homeConfig = config.pages.home;
  const blocks = homeConfig.blocks;
  
  // Sort blocks by order
  const sortedBlocks = [...blocks].sort((a, b) => a.order - b.order);
  
  return (
    <Layout config={config}>
      <div className="relative overflow-hidden rubik-container">
        {/* Decorative background elements */}
        <div className="absolute top-1/4 right-0 w-64 h-64 bg-blue-100 dark:bg-blue-900/20 rounded-full blur-3xl opacity-30 -z-10"></div>
        <div className="absolute bottom-1/4 left-0 w-64 h-64 bg-indigo-100 dark:bg-indigo-900/20 rounded-full blur-3xl opacity-30 -z-10"></div>
        
        {/* Content blocks with spacing between sections */}
        <div className="relative">
          {sortedBlocks.map((block, index) => {
            // Create a wrapper with appropriate styling
            return (
              <div 
                key={block.id}
                className={`block-wrapper ${index > 0 ? 'mt-8 md:mt-16' : ''}`}
                style={{
                  '--delay': `${index * 0.1}s`
                } as React.CSSProperties}
              >
                {(() => {
                  switch (block.type) {
                    case 'hero':
                      return <HeroBlock key={block.id} content={block.content} />;
                    case 'text':
                      return <TextBlock key={block.id} content={block.content} />;
                    case 'cta':
                      return <CTABlock key={block.id} content={block.content} />;
                    case 'recent-posts':
                      return <RecentPostsBlock key={block.id} content={block.content} posts={posts} />;
                    default:
                      return null;
                  }
                })()}
              </div>
            );
          })}
        </div>
      </div>
      
      <style jsx>{`
        .rubik-container {
          opacity: 0;
          animation: fadeIn 0.5s ease-out forwards;
        }
        
        .block-wrapper {
          opacity: 0;
          transform: translateY(20px);
          animation: fadeInUp 0.6s ease-out forwards;
          animation-delay: var(--delay, 0s);
        }
        
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes fadeInUp {
          from { 
            opacity: 0;
            transform: translateY(20px);
          }
          to { 
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </Layout>
  );
}
