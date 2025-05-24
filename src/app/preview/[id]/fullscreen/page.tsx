'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';

interface FullscreenPreviewProps {
  params: Promise<{ id: string }>;
}

export default function FullscreenThemePreviewPage({ params }: FullscreenPreviewProps) {
  const [themeId, setThemeId] = useState<string>('');
  const searchParams = useSearchParams();
  const page = searchParams?.get('page') || 'home';
  
  const [htmlContent, setHtmlContent] = useState<string>('');
  const [cssContent, setCssContent] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Resolve params
  useEffect(() => {
    async function resolveParams() {
      const resolvedParams = await params;
      setThemeId(resolvedParams.id);
    }
    resolveParams();
  }, [params]);

  useEffect(() => {
    if (!themeId) return;
    async function loadThemePreview() {
      try {
        setIsLoading(true);
        setError(null);
        
        // Get the theme's HTML and CSS
        const response = await fetch(`/api/theme-preview?theme=${themeId}&page=${page}`);
        
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
  }, [themeId, page]);

  if (isLoading) {
    return <div className="flex justify-center items-center h-screen">Loading theme preview...</div>;
  }
  
  if (error) {
    return <div className="text-red-500 p-4">Error: {error}</div>;
  }

  // This component requires dangerouslySetInnerHTML because we're rendering the entire theme
  return (
    <div className="fullscreen-preview">
      <style dangerouslySetInnerHTML={{ __html: cssContent }} />
      <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
    </div>
  );
}
