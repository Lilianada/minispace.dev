'use client';

import { useState, useEffect } from 'react';
import ThemeRenderer from './ThemeRenderer';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Phone, Tablet, Monitor } from 'lucide-react';

interface ThemePreviewerProps {
  themeId: string;
  initialPage?: string;
  previewData?: any;
  initialCustomizations?: any;
}

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
  navigation: '<a href="/" class="nav-link active">Home</a><a href="/posts" class="nav-link">Writing</a><a href="/about" class="nav-link">About</a>'
};

/**
 * ThemePreviewer component
 * 
 * Provides controls for previewing a theme with different pages and viewport sizes
 */
export default function ThemePreviewer({
  themeId,
  initialPage = 'home',
  previewData = DEFAULT_PREVIEW_DATA,
  initialCustomizations = {}
}: ThemePreviewerProps) {
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [viewportSize, setViewportSize] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [htmlContent, setHtmlContent] = useState<string>('');
  const [cssContent, setCssContent] = useState<string>('');
  const [userCustomCSS, setUserCustomCSS] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Available pages to preview
  const availablePages = [
    { id: 'home', label: 'Home' },
    { id: 'post', label: 'Single Post' },
    { id: 'posts', label: 'All Posts' },
    { id: 'about', label: 'About' }
  ];
  
  // Load the theme preview
  useEffect(() => {
    async function loadThemePreview() {
      try {
        setIsLoading(true);
        setError(null);
        
        // Get the theme's HTML and CSS
        const response = await fetch(`/api/theme-preview?theme=${themeId}&page=${currentPage}`);
        
        if (!response.ok) {
          throw new Error(`Failed to load theme preview: ${response.statusText}`);
        }
        
        const data = await response.json();
        setHtmlContent(data.html);
        setCssContent(data.css);
        
        setIsLoading(false);
      } catch (error) {
        console.error('Error loading theme preview:', error);
        setError(error instanceof Error ? error.message : 'Failed to load theme preview');
        setIsLoading(false);
      }
    }
    
    loadThemePreview();
  }, [themeId, currentPage]);
  
  // Generate custom CSS based on customizations
  useEffect(() => {
    if (Object.keys(initialCustomizations).length > 0) {
      let css = ':root {\n';
      
      // Add color variables
      if (initialCustomizations.colors) {
        Object.entries(initialCustomizations.colors).forEach(([key, value]) => {
          css += `  --${key}: ${value};\n`;
        });
      }
      
      // Add font variables
      if (initialCustomizations.fonts) {
        Object.entries(initialCustomizations.fonts).forEach(([key, value]) => {
          css += `  --font-${key}: ${value};\n`;
        });
      }
      
      css += '}';
      setUserCustomCSS(css);
    }
  }, [initialCustomizations]);
  
  if (isLoading) {
    return <div className="flex justify-center items-center h-full">Loading theme preview...</div>;
  }
  
  if (error) {
    return <div className="text-red-500">Error: {error}</div>;
  }
  
  return (
    <div className="theme-previewer flex flex-col h-full">
      <div className="theme-preview-controls p-4 border-b flex justify-between items-center">
        <div className="flex items-center gap-4">
          <Select value={currentPage} onValueChange={(value) => setCurrentPage(value)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select page" />
            </SelectTrigger>
            <SelectContent>
              {availablePages.map(page => (
                <SelectItem key={page.id} value={page.id}>{page.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <div className="viewport-controls flex gap-2">
            <Button 
              variant={viewportSize === 'mobile' ? 'default' : 'outline'} 
              size="icon" 
              onClick={() => setViewportSize('mobile')}
              title="Mobile view"
            >
              <Phone className="h-4 w-4" />
            </Button>
            <Button 
              variant={viewportSize === 'tablet' ? 'default' : 'outline'} 
              size="icon" 
              onClick={() => setViewportSize('tablet')}
              title="Tablet view"
            >
              <Tablet className="h-4 w-4" />
            </Button>
            <Button 
              variant={viewportSize === 'desktop' ? 'default' : 'outline'} 
              size="icon" 
              onClick={() => setViewportSize('desktop')}
              title="Desktop view"
            >
              <Monitor className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        <div className="actions">
          <Button variant="outline" onClick={() => window.open(`/preview/${themeId}/fullscreen?page=${currentPage}`, '_blank')}>
            Fullscreen
          </Button>
        </div>
      </div>
      
      <div className="theme-preview-content flex-1 overflow-auto p-4 bg-gray-100 dark:bg-gray-900">
        <ThemeRenderer
          themeId={themeId}
          pageName={currentPage}
          html={htmlContent}
          css={cssContent}
          userCustomCSS={userCustomCSS}
          viewportSize={viewportSize}
        />
      </div>
    </div>
  );
}
