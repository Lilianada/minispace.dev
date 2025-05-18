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
      <div className="space-y-8">
        {sortedBlocks.map((block) => {
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
        })}
      </div>
    </Layout>
  );
}
