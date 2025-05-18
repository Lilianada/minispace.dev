'use client';

import React from 'react';
import Layout from '../components/Layout';
import TitleBlock from '../blocks/TitleBlock';
import PostsListBlock from '../blocks/PostsListBlock';
import { ThemeConfig } from '../theme.config';

interface PostsPageProps {
  config: ThemeConfig;
  posts?: any[];
  totalPosts?: number;
}

export default function PostsPage({ config, posts = [], totalPosts = 0 }: PostsPageProps) {
  // Get blocks for the posts page
  const postsConfig = config.pages.posts;
  const blocks = postsConfig.blocks;
  
  // Sort blocks by order
  const sortedBlocks = [...blocks].sort((a, b) => a.order - b.order);
  
  return (
    <Layout config={config} showSidebar={true}>
      <div className="space-y-8">
        {sortedBlocks.map((block) => {
          switch (block.type) {
            case 'title':
              return <TitleBlock key={block.id} content={block.content} />;
            case 'posts-list':
              return (
                <PostsListBlock 
                  key={block.id} 
                  content={block.content} 
                  posts={posts}
                  totalPosts={totalPosts}
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
