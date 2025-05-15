// filepath: /Users/lilian/Desktop/Projects/minispace.dev/src/components/posts/PostPreview.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { Loader } from '@/components/ui/loader';

interface PostPreviewProps {
  title: string;
  content: string;
}

export default function PostPreview({ title, content }: PostPreviewProps) {
  const [htmlContent, setHtmlContent] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const renderMarkdown = async () => {
      setIsLoading(true);
      try {
        // Using a server endpoint to render Markdown to avoid
        // bloating the client bundle with markdown libraries
        const response = await fetch('/api/markdown', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ markdown: content }),
        });
        
        if (!response.ok) {
          throw new Error('Failed to render markdown');
        }
        
        const data = await response.json();
        setHtmlContent(data.html);
      } catch (err) {
        console.error('Error rendering markdown:', err);
        setError(err instanceof Error ? err.message : 'Failed to render preview');
      } finally {
        setIsLoading(false);
      }
    };
    
    // Debounce the rendering to avoid too many API calls
    const timer = setTimeout(() => {
      renderMarkdown();
    }, 500);
    
    return () => clearTimeout(timer);
  }, [content]);
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader />
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="text-center text-destructive py-8">
        <p>Error rendering preview: {error}</p>
      </div>
    );
  }
  
  return (
    <div className="preview">
      <h1 className="text-3xl font-bold mb-6">{title || 'Untitled Post'}</h1>
      <div 
        className="prose dark:prose-invert max-w-none"
        dangerouslySetInnerHTML={{ __html: htmlContent || '<p>No content yet</p>' }}  
      />
    </div>
  );
}