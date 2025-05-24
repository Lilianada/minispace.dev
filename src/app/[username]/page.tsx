import React from 'react';
import { notFound } from 'next/navigation';
import { adminDb, isAdminAvailable } from '@/lib/firebase/admin';
import { renderThemePage } from '@/lib/theme-service';
import fs from 'fs';
import path from 'path';

interface UserProfilePageProps {
  params: Promise<{ username: string }>;
}

export default async function UserProfilePage({ params }: UserProfilePageProps) {
  const { username } = await params;
  
  // Check if Firebase Admin is available
  if (!isAdminAvailable()) {
    console.warn('Firebase Admin not available - using demo content');
    
    // Add warning for development mode only
    if (process.env.NODE_ENV === 'development') {
      console.warn('========== FIREBASE ADMIN SDK CONFIGURATION ISSUE ==========');
      console.warn('Theme pages are running in demo mode because Firebase Admin is not properly configured.');
      console.warn('To fix this:');
      console.warn('1. Make sure FIREBASE_ADMIN_CREDENTIALS is set in .env.local');
      console.warn('2. Run validation: node scripts/validate-firebase-admin.js');
      console.warn('3. See docs/firebase-admin-setup.md for detailed instructions');
      console.warn('==========================================================');
    }
    
    // Demo content when Firebase Admin is not available
    const demoContext = {
      site: {
        title: username,
        description: `Welcome to ${username}'s personal site`,
        email: `${username}@example.com`,
        socialLinks: 'Twitter, GitHub'
      },
      posts: [
        {
          title: 'Welcome to my blog',
          slug: 'welcome',
          excerpt: 'This is my first post on Minispace.',
          publishedAt: new Date(),
          content: 'Hello world! This is a demo post.'
        },
        {
          title: 'About this theme',
          slug: 'about-theme',
          excerpt: 'Learn about the Altay theme and its features.',
          publishedAt: new Date(Date.now() - 86400000), // Yesterday
          content: 'The Altay theme is minimalist and clean.'
        }
      ],
      navigation: `
        <a href="/" class="nav-link active">Home</a>
        <a href="/posts" class="nav-link">Writing</a>
        <a href="/about" class="nav-link">About</a>
      `,
      currentYear: new Date().getFullYear()
    };
    
    try {
      // Render the theme with demo content
      const htmlContent = await renderThemePage('altay', 'home', demoContext);
      
      // Load theme CSS
      let cssContent = '';
      const cssPath = path.join(process.cwd(), 'themes', 'altay', 'theme.css');
      if (fs.existsSync(cssPath)) {
        cssContent = fs.readFileSync(cssPath, 'utf-8');
      }
      
      // Return the rendered HTML with CSS
      return (
        <div className="theme-site-container">
          <style dangerouslySetInnerHTML={{ __html: cssContent }} />
          <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
        </div>
      );
    } catch (error) {
      console.error('Error rendering theme:', error);
      return (
        <div className="p-8">
          <h1 className="text-2xl font-bold mb-4">{username}</h1>
          <p>Welcome to {username}'s site</p>
          <p className="text-red-500 mt-4">Theme rendering error: {error instanceof Error ? error.message : 'Unknown error'}</p>
        </div>
      );
    }
  }
  
  try {
    console.log(`Loading user site for username: ${username}`);
    
    // Check if adminDb is available
    if (!adminDb) {
      console.error('Firebase Admin DB is not initialized');
      return notFound();
    }
    
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
      const themeSettingsRef = adminDb.doc(`users/${userId}/userSettings/theme`);
      const themeSettingsDoc = await themeSettingsRef.get();
      
      if (themeSettingsDoc.exists) {
        const themeData = themeSettingsDoc.data();
        themeId = themeData?.themeId || 'altay';
      }
    } catch (error) {
      console.log('No theme settings found, using default:', error);
    }
    
    console.log(`Using theme: ${themeId}`);
    
    // Get user's posts
    const postsQuery = adminDb.collection('posts')
      .where('authorId', '==', userId)
      .where('status', '==', 'published')
      .limit(10);
    
    const postsSnapshot = await postsQuery.get();
    console.log(`Found ${postsSnapshot.docs.length} posts for user ${username}`);
    
    const posts = postsSnapshot.docs.map((doc: any) => {
      const data = doc.data();
      return {
        id: doc.id,
        title: data.title || 'Untitled',
        slug: data.slug || doc.id,
        excerpt: data.excerpt || '',
        content: data.content || '',
        publishedAt: data.publishedAt || data.createdAt || new Date(),
        createdAt: data.createdAt || new Date(),
        authorId: data.authorId || '',
        status: data.status || 'draft'
      };
    });
    
    // Prepare context for theme rendering
    const context = {
      site: {
        title: userData?.name || username,
        description: userData?.bio || `Welcome to ${username}'s personal site`,
        email: userData?.email || '',
        socialLinks: userData?.socialLinks || ''
      },
      posts: posts.map((post: any) => ({
        title: post.title,
        slug: post.slug,
        excerpt: post.excerpt,
        publishedAt: post.publishedAt,
        content: post.content
      })),
      navigation: `
        <a href="/" class="nav-link active">Home</a>
        <a href="/posts" class="nav-link">Writing</a>
        <a href="/about" class="nav-link">About</a>
      `,
      currentYear: new Date().getFullYear()
    };
    
    // Render the theme
    console.log(`Rendering theme ${themeId} with context:`, JSON.stringify(context, null, 2));
    const htmlContent = await renderThemePage(themeId, 'home', context);
    
    // Load theme CSS
    let cssContent = '';
    const cssPath = path.join(process.cwd(), 'themes', themeId, 'theme.css');
    if (fs.existsSync(cssPath)) {
      cssContent = fs.readFileSync(cssPath, 'utf-8');
    }
    
    // Return the rendered HTML with CSS
    return (
      <div className="theme-site-container">
        <style dangerouslySetInnerHTML={{ __html: cssContent }} />
        <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
      </div>
    );
    
  } catch (error) {
    console.error('Error loading user site:', error);
    return notFound();
  }
}
