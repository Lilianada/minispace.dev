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
  
  // Create navigation context based on request headers
  const navigationContext = createNavigationContext(username, {
    host: headersList.get('host') || undefined
  }, `/posts`);
  
  // Check if Firebase Admin is available
  if (!isAdminAvailable()) {
    console.warn('Firebase Admin not available - using demo content');
    
    // Demo content when Firebase Admin is not available
    const demoContext = {
      site: {
        title: username,
        description: `Welcome to ${username}'s personal site`,
        email: `${username}@example.com`,
        socialLinks: 'Twitter, GitHub',
        username: username,
        isSubdomain: navigationContext.isSubdomain
      },
      posts: [
        {
          title: 'Welcome to my blog',
          slug: 'welcome',
          excerpt: 'This is my first blog post on Minispace.',
          publishedAt: '2024-01-01T00:00:00.000Z',
          content: '<p>Welcome to my personal blog!</p>'
        },
        {
          title: 'Building with Next.js',
          slug: 'building-with-nextjs',
          excerpt: 'My experience building modern web applications.',
          publishedAt: '2024-01-15T00:00:00.000Z',
          content: '<p>Next.js is amazing for building full-stack applications.</p>'
        },
        {
          title: 'The Art of Learning',
          slug: 'the-art-of-learning',
          excerpt: 'Josh Waitzkin\'s philosophy on mastery.',
          publishedAt: '2024-02-01T00:00:00.000Z',
          content: '<p>Key takeaways from Josh Waitzkin\'s journey in learning and teaching mastery across disciplines.</p>'
        }
      ],
      navigationContext
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
    // If Firebase Admin is available, fetch real user data
    if (!adminDb) {
      throw new Error('Firebase Admin not available');
    }
    
    const userDoc = await adminDb.collection('users').doc(username).get();
    
    if (!userDoc.exists) {
      return notFound();
    }

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
