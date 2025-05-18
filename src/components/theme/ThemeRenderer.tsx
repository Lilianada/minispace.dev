'use client';

import React from 'react';
import { allThemes } from '@/themes';

// Helper function to get a theme by ID (category/name format)
function getThemeById(id: string) {
  const [category, themeName] = id.split('/');
  return allThemes.find(
    theme => theme.category === category && theme.name.toLowerCase() === themeName
  );
}

interface ThemeRendererProps {
  themeId: string;
  pageType: 'home' | 'about' | 'posts' | 'post';
  userData?: any;
  posts?: any[];
  post?: any;
  totalPosts?: number;
}

export default function ThemeRenderer({ 
  themeId, 
  pageType, 
  userData, 
  posts = [], 
  post,
  totalPosts = 0
}: ThemeRendererProps) {
  const theme = getThemeById(themeId);
  
  if (!theme) {
    return (
      <div className="p-8 text-center">
        <h2 className="text-2xl font-bold text-red-500">Theme Not Found</h2>
        <p className="mt-2 text-gray-600">
          The theme "{themeId}" could not be found. Please select a different theme in your dashboard.
        </p>
      </div>
    );
  }
  
  // Get the appropriate page component based on the page type
  let PageComponent;
  switch (pageType) {
    case 'home':
      PageComponent = theme.components.HomePage;
      break;
    case 'about':
      PageComponent = theme.components.AboutPage;
      break;
    case 'posts':
      PageComponent = theme.components.PostsPage;
      break;
    case 'post':
      PageComponent = theme.components.PostPage;
      break;
    default:
      PageComponent = theme.components.HomePage;
  }
  
  if (!PageComponent) {
    return (
      <div className="p-8 text-center">
        <h2 className="text-2xl font-bold text-red-500">Page Component Not Found</h2>
        <p className="mt-2 text-gray-600">
          The {pageType} page component for theme "{theme.name}" could not be found.
        </p>
      </div>
    );
  }
  
  // Render the appropriate page component with the necessary props
  return (
    <PageComponent 
      config={theme.config} 
      userData={userData} 
      posts={posts} 
      post={post}
      totalPosts={totalPosts}
    />
  );
}
