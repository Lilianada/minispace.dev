import React from 'react';
import { notFound } from 'next/navigation';
import { headers } from 'next/headers';
import { adminDb, isAdminAvailable } from '@/lib/firebase/admin';
import { renderThemePage } from '@/lib/theme-service';
import { createNavigationContext, generateNavigationHtml } from '@/lib/navigation-utils';

interface UserPostsPageProps {
  params: Promise<{ username: string }>;
}

export default async function UserPostsPage({ params }: UserPostsPageProps) {
  const { username } = await params;
  const headersList = await headers();
  const host = headersList.get('host') || 'unknown';
  
  // Create navigation context based on request headers
  const navigationContext = createNavigationContext(username, {
    host: host
  }, `/posts`);
  
  // Log request details for debugging
  console.log(`[Posts Page] Request details:
    - Username: ${username}
    - Host: ${host}
    - Is subdomain (detected): ${navigationContext.isSubdomain}
    - Path: /posts
    - NODE_ENV: ${process.env.NODE_ENV}
  `);
  
  // Check if Firebase Admin is available
  const adminAvailable = isAdminAvailable();
  console.log(`[Posts Page] Admin availability check result: ${adminAvailable}`);
  
  if (!adminAvailable) {
    console.warn(`Firebase Admin not available for user ${username} - using demo content. Subdomain: ${navigationContext.isSubdomain}`);
    
    // Enhanced demo content system when Firebase Admin is not available
    // Log additional information to help with debugging
    console.log(`[SUBDOMAIN-DEBUG] Posts page rendering for ${username}:
      - Host: ${host}
      - Is subdomain: ${navigationContext.isSubdomain}
      - Current page: ${navigationContext.currentPage}
      - NODE_ENV: ${process.env.NODE_ENV}
      - Request URL: ${process.env.NEXT_PUBLIC_URL || 'not available'}`);
    
    // Enhanced demo content when Firebase Admin is not available
    const demoContext = {
      site: {
        title: `${username}'s Blog`,
        description: `Welcome to ${username}'s personal site`,
        email: `${username}@example.com`,
        socialLinks: 'Twitter, GitHub, LinkedIn',
        username: username,
        isSubdomain: navigationContext.isSubdomain,
        isDemoContent: true // Flag to indicate demo content
      },
      posts: [
        {
          title: '📱 Welcome to Minispace',
          slug: 'welcome-to-minispace',
          excerpt: 'This is demo content shown when Firebase Admin is not available.',
          publishedAt: new Date().toISOString(),
          content: '<p><strong>🚧 Demo Content:</strong> This content is displayed because Firebase Admin is not available in development mode.</p><p>In production, this would show real content from the database.</p>'
        },
        {
          title: '🔥 Building with Firebase and Next.js',
          slug: 'building-with-firebase',
          excerpt: 'Exploring the Firebase ecosystem with Next.js server components.',
          publishedAt: new Date(Date.now() - 86400000).toISOString(),
          content: '<p>Firebase provides a comprehensive backend solution that works great with Next.js.</p><p>Features include authentication, databases, storage, and more!</p>'
        },
        {
          title: '🧠 The Art of Learning',
          slug: 'the-art-of-learning',
          excerpt: 'Josh Waitzkin\'s philosophy on mastery across disciplines.',
          publishedAt: new Date(Date.now() - 172800000).toISOString(),
          content: '<p>Key takeaways from Josh Waitzkin\'s journey in learning chess, martial arts, and other disciplines.</p><p>The principles of deep learning can be applied to any field.</p>'
        }
      ],
      navigationContext,
      // Add debug info for development mode
      debug: process.env.NODE_ENV === 'development' ? {
        mode: 'development',
        host: host,
        isSubdomain: navigationContext.isSubdomain,
        adminAvailable: adminAvailable,
        date: new Date().toISOString()
      } : undefined
    };

    try {
      const html = await renderThemePage('altay', 'posts', demoContext);
      return (
        <div 
          dangerouslySetInnerHTML={{ __html: html }}
          style={{ 
            minHeight: '100vh',
            fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
          }}
        />
      );
    } catch (error) {
      console.error('Error rendering theme page:', error);
      return (
        <div style={{ padding: '2rem', fontFamily: 'Inter, sans-serif' }}>
          <h1>Posts</h1>
          <p>Sorry, there was an error loading the posts page.</p>
          <details style={{ marginTop: '1rem' }}>
            <summary>Error details</summary>
            <pre style={{ background: '#f5f5f5', padding: '1rem', borderRadius: '4px', overflow: 'auto' }}>
              {error instanceof Error ? error.message : 'Unknown error'}
            </pre>
          </details>
        </div>
      );
    }
  }

  try {
    // Check if we're in development mode
    const isDevMode = process.env.NODE_ENV === 'development';
    
    // If adminDb is not available but we're in development mode, don't throw an error
    if (!adminDb && isDevMode) {
      console.log(`[Posts Page] Firebase Admin DB not available but in development mode.
        - Username: ${username}
        - Host: ${host}
        - Is subdomain: ${navigationContext.isSubdomain}
        - NODE_ENV: ${process.env.NODE_ENV}
      `);
      
      // Return demo content for development mode instead of throwing an error
      const demoContext = {
        site: {
          title: `${username}'s Blog`,
          description: `Welcome to ${username}'s personal blog`,
          email: `${username}@example.com`,
          socialLinks: 'Twitter, GitHub',
          username: username,
          isSubdomain: navigationContext.isSubdomain
        },
        posts: [
          {
            title: 'Development Mode Post',
            slug: 'dev-mode',
            excerpt: 'This post is shown in development mode when Firebase Admin is not available.',
            publishedAt: new Date().toISOString(),
            content: '<p>This content is generated because Firebase Admin is not available in development mode.</p>'
          },
          {
            title: 'Using Firebase Admin with Next.js',
            slug: 'firebase-admin-nextjs',
            excerpt: 'Learn how to use Firebase Admin SDK with Next.js server components.',
            publishedAt: new Date(Date.now() - 86400000).toISOString(),
            content: '<p>Firebase Admin SDK provides server-side access to Firebase services.</p>'
          }
        ],
        navigationContext
      };

      const html = await renderThemePage('altay', 'posts', demoContext);
      return (
        <div 
          dangerouslySetInnerHTML={{ __html: html }}
          style={{ 
            minHeight: '100vh',
            fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
          }}
        />
      );
    }
    
    // In production or if adminDb is available, proceed with database access
    if (!adminDb) {
      console.error(`[Posts Page] Firebase Admin DB not available in production mode.
        - Username: ${username}
        - Host: ${host}
        - Is subdomain: ${navigationContext.isSubdomain}
        - NODE_ENV: ${process.env.NODE_ENV}
      `);
      throw new Error('Firebase Admin DB not available');
    }
    
    console.log(`[Posts Page] Accessing Firestore for user: ${username}`);
    const userDoc = await adminDb.collection('users').doc(username).get();
    
    if (!userDoc.exists) {
      console.warn(`[Posts Page] User ${username} not found in Firestore`);
      return notFound();
    }
    
    console.log(`[Posts Page] Successfully retrieved user data for: ${username}`)

    const userData = userDoc.data();
    
    // Fetch user's posts
    const postsSnapshot = await adminDb
      .collection('posts')
      .where('authorId', '==', username)
      .where('published', '==', true)
      .orderBy('publishedAt', 'desc')
      .get();

    const posts = postsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    // Fetch user's theme settings
    const themeDoc = await adminDb.collection('users').doc(username).collection('settings').doc('theme').get();
    const themeSettings = themeDoc.exists ? themeDoc.data() : { themeId: 'altay' };

    const renderContext = {
      site: {
        title: userData?.displayName || username,
        description: userData?.bio || `Welcome to ${username}'s personal site`,
        email: userData?.email || '',
        socialLinks: userData?.socialLinks || '',
        username: username,
        isSubdomain: navigationContext.isSubdomain
      },
      posts,
      navigationContext
    };

    const html = await renderThemePage((themeSettings?.themeId as string) || 'altay', 'posts', renderContext);
    
    return (
      <div 
        dangerouslySetInnerHTML={{ __html: html }}
        style={{ 
          minHeight: '100vh',
          fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
        }}
      />
    );
  } catch (error) {
    console.error('Error loading user posts page:', error);
    
    // Enhanced error display with debug information
    return (
      <div style={{ padding: '2rem', fontFamily: 'Inter, sans-serif' }}>
        <h1>Posts</h1>
        <p>Sorry, there was an error loading the posts page.</p>
        
        {process.env.NODE_ENV === 'development' && (
          <>
            <div style={{ marginTop: '1rem', padding: '1rem', background: '#f8f9fa', borderRadius: '4px' }}>
              <h3>Development Mode Debugging</h3>
              <div>
                <strong>Username:</strong> {username}
              </div>
              <div>
                <strong>Host:</strong> {host}
              </div>
              <div>
                <strong>Is subdomain:</strong> {String(navigationContext.isSubdomain)}
              </div>
              <div>
                <strong>Firebase Admin available:</strong> {String(adminAvailable)}
              </div>
              <div>
                <strong>Environment:</strong> {process.env.NODE_ENV}
              </div>
            </div>
            
            <details style={{ marginTop: '1rem' }}>
              <summary>Error details</summary>
              <pre style={{ background: '#f5f5f5', padding: '1rem', borderRadius: '4px', overflow: 'auto' }}>
                {error instanceof Error ? `${error.message}\n\n${error.stack}` : 'Unknown error'}
              </pre>
            </details>
            
            <div style={{ marginTop: '1rem', padding: '1rem', background: '#fff8e1', borderRadius: '4px', border: '1px solid #ffe082' }}>
              <h4>Troubleshooting Tips</h4>
              <ul style={{ paddingLeft: '1.5rem' }}>
                <li>Make sure Firebase Admin credentials are properly set</li>
                <li>Check that your local hosts file has the subdomain entry (run <code>scripts/setup-local-subdomains.sh</code>)</li>
                <li>Restart the development server</li>
                <li>Clear browser cache and cookies</li>
              </ul>
            </div>
          </>
        )}
        
        {process.env.NODE_ENV !== 'development' && (
          <details style={{ marginTop: '1rem' }}>
            <summary>Error details</summary>
            <pre style={{ background: '#f5f5f5', padding: '1rem', borderRadius: '4px', overflow: 'auto' }}>
              {error instanceof Error ? error.message : 'Unknown error'}
            </pre>
          </details>
        )}
      </div>
    );
  }
}
