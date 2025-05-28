import React from 'react';
import { notFound } from 'next/navigation';
import { headers } from 'next/headers';
import { isAdminAvailable, isDevelopmentMode } from '@/lib/firebase/admin';
import { renderThemePage } from '@/lib/theme-service';
import { createNavigationContext } from '@/lib/navigation-utils';
import { getUserData, getUserPageData, getUserTheme, getUserCustomPages } from '@/lib/user-content-service';

interface UserDynamicPageProps {
  params: Promise<{ username: string; slug: string[] }>;
}

export default async function UserDynamicPage({ params }: UserDynamicPageProps) {
  const { username, slug = [] } = await params;
  const headersList = await headers();
  const host = headersList.get('host') || 'unknown';
  
  // Convert slug array to path string
  const pagePath = slug.join('/');
  
  // Create navigation context based on request headers
  const navigationContext = createNavigationContext(username, {
    host: host
  }, `/${pagePath}`);
  
  // Log request details for debugging
  console.log(`[Dynamic Page] Request details:
    - Username: ${username}
    - Path: /${pagePath}
    - Host: ${host}
    - Is subdomain (detected): ${navigationContext.isSubdomain}
    - NODE_ENV: ${process.env.NODE_ENV}
  `);
  
  // Check if Firebase Admin is available
  const adminAvailable = isAdminAvailable();
  const isDevMode = isDevelopmentMode();
  console.log(`[Dynamic Page] Admin availability check result: ${adminAvailable}, Dev mode: ${isDevMode}`);
  
  // Set current page from slug for navigation active state
  const currentPage = slug.length > 0 ? slug[0] : 'home';
  
  // Enhanced logging for page resolution
  console.log(`[Dynamic Page] Resolved current page: '${currentPage}' from slug: [${slug.join(', ')}]`);
  
  // Handle demo content for development mode or when Firebase Admin is unavailable
  if (!adminAvailable || isDevMode) {
    console.warn(`Firebase Admin not available for user ${username} - using demo content. Path: /${pagePath}, Subdomain: ${navigationContext.isSubdomain}`);
    
    // Map of known demo pages and their content
    type PageContent = {
      title: string;
      content: string;
      description: string;
    };
    
    const demoPages: Record<string, PageContent> = {
      'home': {
        title: `${username}'s Personal Site`,
        content: `<h1>Welcome to ${username}'s Site</h1><p>This is a custom home page created with the dynamic page system. In production, this would display the user's actual custom home page content.</p>`,
        description: `${username}'s personal website - custom home`,
      },
      'about': {
        title: `About ${username}`,
        content: `<h1>About ${username}</h1><p>This is a demo about page for ${username}. In production, this would display the user's actual about page content.</p>`,
        description: `About ${username} - demo page`,
      },
      'projects': {
        title: `${username}'s Projects`,
        content: `<h1>Projects</h1>
        <div class="projects-grid">
          <div class="project-card">
            <h2>Project 1</h2>
            <p>This is a sample project description. In production, this would display the user's actual projects.</p>
          </div>
          <div class="project-card">
            <h2>Project 2</h2>
            <p>Another sample project that would be replaced with real content in production.</p>
          </div>
        </div>`,
        description: `${username}'s portfolio of projects`,
      },
      'contact': {
        title: `Contact ${username}`,
        content: `<h1>Contact</h1>
        <p>This is a demo contact page. In production, this would display the user's actual contact information or a contact form.</p>
        <ul>
          <li>Email: ${username}@example.com</li>
          <li>Twitter: @${username}</li>
          <li>GitHub: github.com/${username}</li>
        </ul>`,
        description: `Contact information for ${username}`,
      }
    };
    
    // Get current page content if it exists in demo pages, otherwise show "page not found"
    const currentPageKey = slug[0] || 'home';
    const pageContent = demoPages[currentPageKey];
    
    if (!pageContent && currentPageKey !== 'home') {
      console.log(`[Dynamic Page] Page not found: /${pagePath} for user ${username}`);
      return notFound();
    }
    
    // For homepage (no slug or 'home')
    if (!slug.length || currentPageKey === 'home') {
      // Check if we have custom home page content
      if (demoPages['home']) {
        console.log(`[Dynamic Page] Using custom home page content for ${username}`);
        // Log detailed information about the page we're displaying
        console.log(`[Dynamic Page] Home page details:
          - Title: ${demoPages['home'].title}
          - Description: ${demoPages['home'].description?.substring(0, 50)}...
          - Content length: ${demoPages['home'].content.length} characters
        `);
      } else {
        // If no custom home page is defined, defer to the main user page handler
        console.log(`[Dynamic Page] No custom home page, deferring to main user page handler`);
        return notFound(); // This will cascade to the [username]/page.tsx handler
      }
    }
    
    // For 'about' page specifically - provide better logging
    if (currentPageKey === 'about' && !demoPages['about']) {
      console.log(`[Dynamic Page] No about page content defined for ${username}`);
    }
    
    // Get demo custom pages for navigation
    const demoCustomPages = [
      { slug: 'about', title: 'About' },
      { slug: 'projects', title: 'Projects' },
      { slug: 'contact', title: 'Contact' }
    ];
    
    // Demo context for the theme renderer
    const demoContext = {
      site: {
        title: pageContent?.title || `${username}'s ${currentPageKey}`,
        description: pageContent?.description || `${username}'s personal site`,
        email: `${username}@example.com`,
        socialLinks: 'Twitter, GitHub, LinkedIn',
        username: username,
        isSubdomain: navigationContext.isSubdomain,
        isDemoContent: true
      },
      page: {
        ...pageContent,
        path: pagePath,
        slug: currentPageKey,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      navigationContext: {
        ...navigationContext,
        currentPage
      },
      customPages: demoCustomPages,
      // Add debug info for development mode
      debug: process.env.NODE_ENV === 'development' ? {
        mode: 'development',
        path: pagePath,
        host: host,
        isSubdomain: navigationContext.isSubdomain,
        adminAvailable: adminAvailable,
        date: new Date().toISOString()
      } : undefined
    };

    try {
      const html = await renderThemePage('altay', currentPageKey, demoContext);
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
      console.error(`Error rendering dynamic page theme for ${username}/${pagePath}:`, error);
      return renderFallbackPage(username, pagePath, demoContext, error);
    }
  }

  try {
    // 1. Verify user exists and fetch user data
    console.log(`[Dynamic Page] Verifying user: ${username}`);
    const userData = await getUserData(username);
    
    if (!userData) {
      console.warn(`[Dynamic Page] User ${username} not found`);
      return notFound();
    }
    
    // 2. Fetch user's theme settings first - we need this to know how to render pages
    console.log(`[Dynamic Page] Fetching theme settings for: ${username}`);
    const themeId = await getUserTheme(username);
    
    // 3. Fetch the user's custom page content
    console.log(`[Dynamic Page] Fetching page content for: ${username}/${pagePath}`);
    const pageData = await getUserPageData(username, slug[0] || 'home');
    
    // If page doesn't exist, return 404
    if (!pageData) {
      console.warn(`[Dynamic Page] Page not found: /${pagePath} for user ${username}`);
      return notFound();
    }
    
    // 4. Fetch user's custom pages for navigation - only include pages that can be rendered properly
    const customPages = await getUserCustomPages(username);
    console.log(`[Dynamic Page] Fetched ${customPages.length} custom pages for navigation`);

    // Prepare render context with user and page data
    const renderContext = {
      site: {
        title: userData?.displayName || username,
        description: userData?.bio || `${username}'s personal site`,
        email: userData?.email || '',
        socialLinks: userData?.socialLinks || '',
        username: username,
        isSubdomain: navigationContext.isSubdomain
      },
      page: {
        ...pageData,
        path: pagePath,
        slug: slug[0] || 'home'
      },
      navigationContext: {
        ...navigationContext,
        currentPage
      },
      customPages: customPages // Include custom pages for navigation
    };

    // Render the page with the user's theme
    const html = await renderThemePage(
      themeId, 
      slug[0] || 'home',
      renderContext
    );
    
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
    console.error(`Error loading dynamic page for ${username}/${pagePath}:`, error);
    
    // Enhanced error display with debug information
    return renderErrorPage(username, pagePath, currentPage, navigationContext, adminAvailable, error);
  }
}

// Helper function to render a fallback page when theme rendering fails
function renderFallbackPage(username: string, path: string, context: any, error: any) {
  return (
    <div style={{ padding: '2rem', fontFamily: 'Inter, sans-serif' }}>
      <h1>{context.page?.title || `${username}'s page`}</h1>
      <div dangerouslySetInnerHTML={{ __html: context.page?.content || '<p>Page content not available</p>' }} />
      
      {process.env.NODE_ENV === 'development' && (
        <div style={{ marginTop: '2rem', padding: '1rem', background: '#fff8e1', borderRadius: '4px', border: '1px solid #ffe082' }}>
          <h3>⚠️ Theme Rendering Error</h3>
          <p>The page content was loaded but there was an error rendering the theme.</p>
          <pre style={{ background: '#f5f5f5', padding: '1rem', borderRadius: '4px', overflow: 'auto' }}>
            {error instanceof Error ? error.message : 'Unknown error'}
          </pre>
        </div>
      )}
    </div>
  );
}

// Helper function to render an error page
function renderErrorPage(
  username: string, 
  path: string,
  currentPage: string,
  navigationContext: any,
  adminAvailable: boolean,
  error: any
) {
  return (
    <div style={{ padding: '2rem', fontFamily: 'Inter, sans-serif' }}>
      <h1>{currentPage === 'home' ? username : currentPage.charAt(0).toUpperCase() + currentPage.slice(1)}</h1>
      <p>Sorry, there was an error loading this page.</p>
      
      {process.env.NODE_ENV === 'development' && (
        <>
          <div style={{ marginTop: '1rem', padding: '1rem', background: '#f8f9fa', borderRadius: '4px' }}>
            <h3>Development Mode Debugging</h3>
            <div>
              <strong>Username:</strong> {username}
            </div>
            <div>
              <strong>Path:</strong> /{path}
            </div>
            <div>
              <strong>Current Page:</strong> {currentPage}
            </div>
            <div>
              <strong>Is subdomain:</strong> {String(navigationContext?.isSubdomain)}
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
              <li>Make sure the user exists in your database</li>
              <li>Check if the page exists in the user's pages collection</li>
              <li>Verify Firebase Admin credentials are properly set</li>
              <li>Ensure the theme renderer supports this page type</li>
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
