// FORCE REBUILD TIMESTAMP: 1698748800000
import React from 'react';
import { notFound } from 'next/navigation';
import { headers } from 'next/headers';
import { adminDb, isAdminAvailable, isDevelopmentMode } from '@/lib/firebase/admin';
import { renderThemePage } from '@/lib/theme-service';
import { createNavigationContext } from '@/lib/navigation-utils';

interface UserProfilePageProps {
  params: Promise<{ username: string }>;
}

export default async function UserProfilePage({ params }: UserProfilePageProps) {
  console.error('🚨🚨🚨 USER PROFILE PAGE EXECUTING - THIS SHOULD ALWAYS SHOW 🚨🚨🚨');
  const { username } = await params;
  const headersList = await headers();
  const host = headersList.get('host') || '';
  
  // Log all headers for debugging
  const allHeaders: Record<string, string> = {};
  headersList.forEach((value, key) => {
    allHeaders[key] = value;
  });
  
  console.log(`[SUBDOMAIN-DEBUG] User profile page executing:
    - Username param: ${username}
    - Host header: ${host}
    - X-Minispace-Rewritten-From-Subdomain: ${headersList.get('x-minispace-rewritten-from-subdomain') || 'not set'}
    - X-Minispace-Original-Host: ${headersList.get('x-minispace-original-host') || 'not set'}
    - X-Minispace-Username: ${headersList.get('x-minispace-username') || 'not set'}
    - All headers: ${JSON.stringify(allHeaders, null, 2)}`);
  
  // Create navigation context based on request headers
  const navigationContext = createNavigationContext(username, {
    host
  }, `/`);
  
  console.log(`[SUBDOMAIN-DEBUG] Navigation context created:
    - Username: ${navigationContext.username}
    - Is subdomain: ${navigationContext.isSubdomain}
    - Current page: ${navigationContext.currentPage}`);
    
  
  // Check if Firebase Admin is available and handle development mode
  console.log(`[User Profile] Admin DB available: ${!!adminDb}, Development mode: ${isDevelopmentMode()}`);
  
  // In development mode, always show demo content when adminDb is not available
  if (!adminDb && isDevelopmentMode()) {
    console.log(`[User Profile] Development mode - rendering demo profile for ${username}`);
    
    // Show demo theme content for any username
    const demoContext = {
      site: {
        title: username.charAt(0).toUpperCase() + username.slice(1),
        description: `Welcome to ${username}'s personal space on Minispace`,
        email: `${username}@example.com`,
        socialLinks: 'Twitter, GitHub, LinkedIn',
        username: username,
        isSubdomain: navigationContext.isSubdomain
      },
      posts: [
        {
          title: 'Welcome to my blog',
          slug: 'welcome',
          excerpt: 'This is my first blog post on Minispace. I\'m excited to share my thoughts and ideas here.',
          publishedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
          content: `# Welcome to my blog

This is my first post on Minispace. I'm looking forward to sharing more content soon!

## About this site

This site is built with Minispace, a modern blogging platform that focuses on simplicity and performance.

- Clean, minimalist design
- Fast loading times  
- Mobile-friendly
- Easy to customize

Thanks for visiting!`,
          tags: ['welcome', 'blog', 'minispace']
        },
        {
          title: 'Getting started with Minispace',
          slug: 'getting-started',
          excerpt: 'Learn how to make the most of your Minispace blog with these helpful tips.',
          publishedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
          content: `# Getting started with Minispace

Here are some tips to help you get the most out of your Minispace blog.

## Writing posts

Creating great content is easy with Minispace's intuitive editor.

## Customizing your theme

Make your blog unique with our theme customization options.`,
          tags: ['tutorial', 'tips', 'minispace']
        }
      ],
      pages: [
        {
          title: 'About',
          slug: 'about',
          content: `# About ${username}

Welcome to my personal space on the web. I'm passionate about technology, writing, and sharing knowledge.

## What you'll find here

- Technical articles and tutorials
- Personal thoughts and reflections  
- Projects I'm working on
- Book recommendations

Feel free to reach out if you'd like to connect!`,
          publishedAt: new Date().toISOString()
        }
      ],
      navigationContext,
      currentYear: new Date().getFullYear()
    };

    try {
      const themeContent = await renderThemePage('altay', 'home', demoContext);
      return <div dangerouslySetInnerHTML={{ __html: themeContent }} />;
    } catch (error) {
      console.error('Error rendering demo theme:', error);
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">{username}</h1>
            <p className="text-gray-600 mb-8">Welcome to {username}'s space (Demo Mode)</p>
            <p className="text-sm text-gray-500">Theme rendering temporarily unavailable</p>
          </div>
        </div>
      );
    }
  }
  
  // If not in development mode and adminDb is not available, show error
  if (!adminDb) {
    console.warn('Firebase Admin not available - cannot validate user existence');
    
    // Add warning for development mode only
    if (process.env.NODE_ENV === 'development') {
      console.warn('========== FIREBASE ADMIN SDK CONFIGURATION ISSUE ==========');
      console.warn('User pages cannot be displayed because Firebase Admin is not properly configured.');
      console.warn('To fix this:');
      console.warn('1. Make sure FIREBASE_ADMIN_CREDENTIALS is set in .env.local');
      console.warn('2. Run validation: node scripts/validate-firebase-admin.js');
      console.warn('3. See docs/firebase-admin-setup.md for detailed instructions');
      console.warn('For theme previews, use /preview?theme=altay&page=home instead');
      console.warn('==========================================================');
    }
    
    return notFound();
  }

  try {
    console.log(`Loading user site for username: ${username}`);
    
    // Get user data from username
    const usernameRef = adminDb.doc(`usernames/${username}`);
    const usernameDoc = await usernameRef.get();
    
    if (!usernameDoc.exists) {
      console.log(`Username document not found: ${username}`);
      return notFound();
    }
    
    const userId = usernameDoc.data()?.userId;
    console.log(`Found userId: ${userId}`);
    
    // Get user data
    const userRef = adminDb.doc(`users/${userId}`);
    const userDoc = await userRef.get();
    
    if (!userDoc.exists) {
      console.log(`User document not found for userId: ${userId}`);
      return notFound();
    }
    
    const userData = userDoc.data();
    console.log(`Found user data for: ${userData?.name || username}`);
    
    // Get user's theme settings
    let themeId = 'altay'; // Default theme
    try {
      const themeSettingsRef = adminDb.doc(`users/${userId}/settings/theme`);
      const themeSettingsDoc = await themeSettingsRef.get();
      if (themeSettingsDoc.exists) {
        const themeSettings = themeSettingsDoc.data();
        themeId = themeSettings?.themeId || 'altay';
      }
    } catch (error) {
      console.warn('Could not load theme settings, using default:', error);
    }
    
    // Get user's posts
    const postsRef = adminDb.collection('posts')
      .where('authorId', '==', userId)
      .where('status', '==', 'published')
      .orderBy('publishedAt', 'desc')
      .limit(10);
    
    const postsSnapshot = await postsRef.get();
    const posts = postsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    
    // Create render context
    const renderContext = {
      site: {
        title: userData?.name || userData?.displayName || username,
        description: userData?.bio || `Welcome to ${username}'s personal site`,
        email: userData?.email || '',
        socialLinks: userData?.socialLinks || '',
        username: username,
        isSubdomain: navigationContext.isSubdomain
      },
      posts,
      navigationContext,
      currentYear: new Date().getFullYear()
    };
    
    // Render the theme
    const htmlContent = await renderThemePage(themeId, 'home', renderContext);
    
    return (
      <div 
        dangerouslySetInnerHTML={{ __html: htmlContent }}
        style={{ 
          minHeight: '100vh',
          fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
        }}
      />
    );
  } catch (error) {
    console.error('Error loading user profile page:', error);
    return notFound();
  }
}
