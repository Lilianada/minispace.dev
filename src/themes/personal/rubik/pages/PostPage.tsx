'use client';

import React from 'react';
import Layout from '../components/Layout';
import TitleBlock from '../blocks/TitleBlock';
import PostMetaBlock from '../blocks/PostMetaBlock';
import PostContentBlock from '../blocks/PostContentBlock';
import BackLinkBlock from '../blocks/BackLinkBlock';
import { ThemeConfig } from '../theme.config';

interface PostPageProps {
  config: ThemeConfig;
  post?: any;
  userData?: any;
}

export default function PostPage({ config, post, userData }: PostPageProps) {
  // Get blocks for the post page
  const postConfig = config.pages.post;
  const blocks = postConfig.blocks;
  
  // Sort blocks by order
  const sortedBlocks = [...blocks].sort((a, b) => a.order - b.order);
  
  return (
    <Layout config={config} showSidebar={true}>
      <div className="space-y-4">
        {post && (
          <h1 className="text-3xl font-bold text-gray-900 mb-4">{post.title}</h1>
        )}
        
        {sortedBlocks.map((block) => {
          switch (block.type) {
            case 'post-meta':
              return (
                <PostMetaBlock 
                  key={block.id} 
                  content={block.content} 
                  post={{
                    ...post,
                    author: userData ? {
                      name: userData.displayName || userData.username,
                      username: userData.username,
                      avatar: userData.avatarUrl,
                    } : undefined,
                  }}
                />
              );
            case 'post-content':
              return <PostContentBlock key={block.id} post={post} />;
            case 'back-link':
              return <BackLinkBlock key={block.id} content={block.content} />;
            default:
              return null;
          }
        })}
      </div>
    </Layout>
  );
}
