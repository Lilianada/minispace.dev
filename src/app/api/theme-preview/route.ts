import { NextRequest, NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs';
import { 
  getThemeById, 
  loadThemeTemplate, 
  renderThemePage 
} from '@/lib/theme-service';
import { renderTemplate } from '@/lib/theme-renderer';

// Default preview data
const DEFAULT_PREVIEW_DATA = {
  site: {
    title: 'Demo Site',
    description: 'A site built with Minispace',
    email: 'hello@example.com',
    username: 'demo',
    socialLinks: '<a href="#">Twitter</a> and <a href="#">GitHub</a>'
  },
  posts: [
    {
      title: 'Getting Started with Minispace',
      slug: 'getting-started',
      excerpt: 'Learn how to quickly set up your personal site with Minispace.',
      publishedAt: new Date().toISOString(),
      content: '<p>Welcome to Minispace! This is a sample post to show how content looks in this theme.</p><h2>Features</h2><p>Minispace offers a simple, fast way to create your own personal site.</p><ul><li>Markdown support</li><li>Beautiful themes</li><li>Custom domains</li></ul>'
    },
    {
      title: 'Customizing Your Theme',
      slug: 'customizing-themes',
      excerpt: 'Learn how to personalize your site with custom colors and fonts.',
      publishedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      title: 'Writing Great Content',
      slug: 'writing-great-content',
      excerpt: 'Tips and tricks for creating engaging blog posts.',
      publishedAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString()
    }
  ],
  post: {
    title: 'Getting Started with Minispace',
    slug: 'getting-started',
    publishedAt: new Date().toISOString(),
    content: '<p>Welcome to Minispace! This is a sample post to show how content looks in this theme.</p><h2>Features</h2><p>Minispace offers a simple, fast way to create your own personal site.</p><ul><li>Markdown support</li><li>Beautiful themes</li><li>Custom domains</li></ul>'
  },
  navigation: '<a href="/" class="nav-link active">Home</a><a href="/posts" class="nav-link">Writing</a><a href="/about" class="nav-link">About</a>',
  currentYear: new Date().getFullYear()
};

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const themeId = searchParams.get('theme');
    const page = searchParams.get('page') || 'home';
    const contentType = searchParams.get('contentType') || 'default';
    
    if (!themeId) {
      return NextResponse.json(
        { error: 'Theme ID is required' },
        { status: 400 }
      );
    }
    
    // Get the theme
    const theme = await getThemeById(themeId);
    if (!theme) {
      return NextResponse.json(
        { error: `Theme '${themeId}' not found` },
        { status: 404 }
      );
    }
    
    // Determine content data
    let contentData = DEFAULT_PREVIEW_DATA;
    
    // If using user's own content, we'd fetch that here
    if (contentType === 'user') {
      // This would be replaced with actual user data from the database
      // contentData = await getUserContent(userId);
    }
    
    // Render the page HTML
    const html = await renderThemePage(themeId, page, contentData);
    
    // Load the theme CSS
    let css = '';
    const cssPath = path.join(process.cwd(), 'themes', themeId, 'theme.css');
    
    if (fs.existsSync(cssPath)) {
      css = fs.readFileSync(cssPath, 'utf-8');
    }
    
    return NextResponse.json({ html, css });
  } catch (error) {
    console.error('Error in theme preview API:', error);
    
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    );
  }
}
