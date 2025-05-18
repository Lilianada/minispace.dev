'use client';

import React from 'react';
import Layout from '../components/Layout';
import TitleBlock from '../blocks/TitleBlock';
import RichTextBlock from '../blocks/RichTextBlock';
import SocialLinksBlock from '../blocks/SocialLinksBlock';
import { ThemeConfig } from '../theme.config';

interface AboutPageProps {
  config: ThemeConfig;
  userData?: any;
}

export default function AboutPage({ config, userData }: AboutPageProps) {
  // Get blocks for the about page
  const aboutConfig = config.pages.about;
  const blocks = aboutConfig.blocks;
  
  // Sort blocks by order
  const sortedBlocks = [...blocks].sort((a, b) => a.order - b.order);
  
  return (
    <Layout config={config}>
      <div className="space-y-8">
        {sortedBlocks.map((block) => {
          switch (block.type) {
            case 'title':
              return <TitleBlock key={block.id} content={block.content} />;
            case 'rich-text':
              return <RichTextBlock key={block.id} content={block.content} />;
            case 'social-links':
              return (
                <SocialLinksBlock 
                  key={block.id} 
                  content={{
                    ...block.content,
                    email: userData?.email,
                    socials: userData?.socialLinks,
                  }} 
                />
              );
            default:
              return null;
          }
        })}
      </div>
    </Layout>
  );
}
