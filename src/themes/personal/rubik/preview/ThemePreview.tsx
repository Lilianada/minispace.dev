'use client';

import React, { useState } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import HomePage from '../pages/HomePage';
import AboutPage from '../pages/AboutPage';
import PostsPage from '../pages/PostsPage';
import PostPage from '../pages/PostPage';
import rubikThemeConfig from '../theme.config';

export default function ThemePreview() {
  const [activeTab, setActiveTab] = useState('home');
  
  // Sample user data for preview
  const userData = {
    username: 'demouser',
    displayName: 'Demo User',
    email: 'hello@example.com',
    bio: 'Writer, thinker, creator',
    avatarUrl: '',
    socialLinks: {
      twitter: 'demouser',
      github: 'demouser',
      linkedin: 'demouser',
      instagram: 'demouser',
      website: 'https://example.com',
    },
  };
  
  // Sample posts for preview
  const samplePosts = [
    {
      id: '1',
      title: 'Getting Started with Minispace',
      slug: 'getting-started',
      excerpt: 'Learn how to set up your Minispace blog and start publishing your thoughts to the world.',
      content: `
# Getting Started with Minispace

Welcome to Minispace! This guide will help you get started with your new blog.

## Setting Up Your Profile

The first step is to set up your profile. Add your name, bio, and social media links to help readers connect with you.

## Creating Your First Post

Click on the "New Post" button in your dashboard to create your first post. You can use Markdown to format your content.

## Customizing Your Theme

Minispace offers several themes to choose from. You can customize colors, fonts, and layout to match your personal style.

## Publishing Your Content

When you're ready, hit the "Publish" button to share your post with the world. You can also save drafts to work on later.

Happy blogging!
      `,
      createdAt: new Date('2025-05-10T12:00:00Z'),
      updatedAt: new Date('2025-05-10T12:00:00Z'),
      publishedAt: new Date('2025-05-10T12:00:00Z'),
      status: 'published',
      tags: ['tutorial', 'minispace'],
      author: {
        name: 'Demo User',
        username: 'demouser',
      },
    },
    {
      id: '2',
      title: 'The Art of Minimal Design',
      slug: 'minimal-design',
      excerpt: 'Exploring how minimalism in design can lead to better user experiences and cleaner interfaces.',
      content: `
# The Art of Minimal Design

Minimalism in design is about removing the unnecessary and focusing on what truly matters.

## Less is More

By reducing clutter and focusing on essential elements, minimal design creates a sense of clarity and purpose.

## White Space

Effective use of white space (or negative space) is crucial in minimal design. It gives content room to breathe.

## Typography

Clean, readable typography is a cornerstone of minimal design. Choose fonts that are legible and have personality without being distracting.

## Color

A limited color palette helps maintain focus and creates a cohesive look. Choose colors that complement each other and serve a purpose.
      `,
      createdAt: new Date('2025-05-08T12:00:00Z'),
      updatedAt: new Date('2025-05-08T12:00:00Z'),
      publishedAt: new Date('2025-05-08T12:00:00Z'),
      status: 'published',
      tags: ['design', 'minimalism'],
      author: {
        name: 'Demo User',
        username: 'demouser',
      },
    },
    {
      id: '3',
      title: 'Writing Effective Blog Posts',
      slug: 'effective-blog-posts',
      excerpt: 'Tips and tricks for writing blog posts that engage readers and convey your ideas clearly.',
      content: `
# Writing Effective Blog Posts

Creating engaging blog content is both an art and a science. Here are some tips to help you write more effective posts.

## Know Your Audience

Understanding who you're writing for helps you tailor your content to their interests and needs.

## Craft Compelling Headlines

Your headline is the first thing readers see. Make it interesting, specific, and promise value.

## Structure Your Content

Use headings, subheadings, and short paragraphs to make your content scannable and easy to digest.

## Use Visual Elements

Images, videos, and infographics can enhance your content and break up long blocks of text.

## Edit Ruthlessly

Good writing is rewriting. Edit your posts to remove fluff, clarify ideas, and fix errors.
      `,
      createdAt: new Date('2025-05-05T12:00:00Z'),
      updatedAt: new Date('2025-05-05T12:00:00Z'),
      publishedAt: new Date('2025-05-05T12:00:00Z'),
      status: 'published',
      tags: ['writing', 'content'],
      author: {
        name: 'Demo User',
        username: 'demouser',
      },
    },
  ];
  
  // Sample post for single post view
  const samplePost = samplePosts[0];
  
  return (
    <div className="w-full">
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <div className="overflow-y-auto">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <div className="px-4 pt-4 border-b">
              <TabsList>
                <TabsTrigger value="home">Home</TabsTrigger>
                <TabsTrigger value="about">About</TabsTrigger>
                <TabsTrigger value="posts">Posts</TabsTrigger>
                <TabsTrigger value="post">Single Post</TabsTrigger>
              </TabsList>
            </div>
            
            <div className="p-0">
              <TabsContent value="home" className="m-0 p-0">
                <HomePage config={rubikThemeConfig} userData={userData} posts={samplePosts} />
              </TabsContent>
              
              <TabsContent value="about" className="m-0 p-0">
                <AboutPage config={rubikThemeConfig} userData={userData} />
              </TabsContent>
              
              <TabsContent value="posts" className="m-0 p-0">
                <PostsPage config={rubikThemeConfig} posts={samplePosts} totalPosts={samplePosts.length} />
              </TabsContent>
              
              <TabsContent value="post" className="m-0 p-0">
                <PostPage config={rubikThemeConfig} post={samplePost} userData={userData} />
              </TabsContent>
            </div>
          </Tabs>
        </div>
        
      </div>
    </div>
  );
}
