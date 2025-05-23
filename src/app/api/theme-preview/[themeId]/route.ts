import { NextRequest, NextResponse } from 'next/server';
import { renderThemePage } from '@/lib/theme-service';

// Sample data for preview
const sampleData = {
  siteName: 'My Minispace',
  title: 'Welcome to My Minispace',
  description: 'A personal blog and portfolio site',
  username: 'demo-user',
  navigation: [
    { label: 'Home', url: '/' },
    { label: 'Blog', url: '/blog' },
    { label: 'About', url: '/about' },
    { label: 'Contact', url: '/contact' },
  ],
  posts: [
    {
      title: 'Getting Started with Minispace',
      slug: 'getting-started',
      publishedAt: new Date().toISOString(),
      excerpt: 'Learn how to set up and customize your Minispace site.',
      coverImage: 'https://images.unsplash.com/photo-1542435503-956c469947f6?auto=format&fit=crop&w=600&q=80',
      content: '<p>Welcome to Minispace! This platform makes it easy to create and customize your personal site.</p>',
    },
    {
      title: 'Customizing Your Theme',
      slug: 'customizing-theme',
      publishedAt: new Date().toISOString(),
      excerpt: 'Discover how to make your Minispace site truly yours with custom CSS and theme options.',
      coverImage: 'https://images.unsplash.com/photo-1545239351-ef35f43d514b?auto=format&fit=crop&w=600&q=80',
      content: '<p>Learn how to modify colors, fonts, and other aspects of your site design.</p>',
    },
    {
      title: 'Working with Content',
      slug: 'working-with-content',
      publishedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days ago
      excerpt: 'Learn how to create and manage posts, pages, and other content on your Minispace site.',
      coverImage: 'https://images.unsplash.com/photo-1494232410401-ad00d5433cfa?auto=format&fit=crop&w=600&q=80',
      content: '<p>Create, edit, and organize your content effectively.</p>',
    },
  ],
  singlePost: {
    title: 'Getting Started with Minispace',
    slug: 'getting-started',
    publishedAt: new Date().toISOString(),
    content: `
      <h2>Welcome to Minispace!</h2>
      <p>This platform makes it easy to create and customize your personal site. Here's how to get started:</p>
      <h3>1. Create your account</h3>
      <p>Sign up for Minispace and choose your username. This will determine your site URL.</p>
      <h3>2. Customize your theme</h3>
      <p>Choose a theme that fits your style and customize it with your own colors, fonts, and CSS.</p>
      <h3>3. Add your content</h3>
      <p>Create posts, pages, and other content to share with your audience.</p>
      <h3>4. Share your site</h3>
      <p>Share your Minispace URL with friends, colleagues, and social media followers.</p>
    `,
    coverImage: 'https://images.unsplash.com/photo-1542435503-956c469947f6?auto=format&fit=crop&w=600&q=80',
  },
  about: {
    content: `
      <h2>About Me</h2>
      <p>Hello! I'm a Minispace user showcasing what this platform can do.</p>
      <p>This is a sample about page that demonstrates how themes render content.</p>
      <h3>My Background</h3>
      <p>I'm passionate about creating and sharing content online. Minispace makes it easy for me to have a professional presence on the web without the complexity of traditional website builders.</p>
      <h3>Contact</h3>
      <p>You can reach me at example@minispace.dev or follow me on social media.</p>
    `
  }
};

export async function GET(
  request: NextRequest,
  { params }: { params: { themeId: string } }
) {
  try {
    const themeId = params.themeId;
    const { searchParams } = new URL(request.url);
    const page = searchParams.get('page') || 'home';
    const username = searchParams.get('username') || 'demo-user';
    const debug = searchParams.get('debug') === 'true';
    
    // Determine which content to render based on page type
    let pageData;
    let pageType;
    
    switch (page) {
      case 'post':
        pageData = { post: sampleData.singlePost };
        pageType = 'post';
        break;
      case 'about':
        pageData = { about: sampleData.about };
        pageType = 'about';
        break;
      case 'home':
      default:
        pageData = { posts: sampleData.posts };
        pageType = 'home';
        break;
    }
    
    // Combine the data
    const contextData = {
      site: {
        title: sampleData.siteName,
        description: sampleData.description,
        username: username,
        navigation: sampleData.navigation,
      },
      page: {
        title: pageType === 'post' ? sampleData.singlePost.title : sampleData.title,
        description: sampleData.description,
        type: pageType,
      },
      ...pageData
    };
    
    // For debugging: return the context data if requested
    if (debug) {
      return NextResponse.json({ contextData });
    }
    
    // Render the theme
    const html = await renderThemePage(themeId, pageType, contextData);
    
    // Add postMessage listener script for CSS updates
    const cssListenerScript = `
      <script>
        window.addEventListener('message', function(event) {
          if (event.data && event.data.type === 'updateCustomCSS') {
            // Find existing style or create a new one
            let styleElement = document.getElementById('custom-css');
            if (!styleElement) {
              styleElement = document.createElement('style');
              styleElement.id = 'custom-css';
              document.head.appendChild(styleElement);
            }
            
            // Update the CSS
            styleElement.textContent = event.data.css;
          }
        });
      </script>
    `;
    
    // Insert the listener script before </body>
    const enhancedHtml = html.replace('</body>', `${cssListenerScript}</body>`);
    
    return new Response(enhancedHtml, {
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
      },
    });
    
  } catch (error) {
    console.error('Error rendering theme preview:', error);
    return NextResponse.json(
      { error: 'Failed to render theme preview' },
      { status: 500 }
    );
  }
}
