'use client';

import React from 'react';

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

export function MarkdownRenderer({ content, className = '' }: MarkdownRendererProps) {
  // Simple markdown to HTML conversion
  // For a production app, consider using a proper markdown library
  const renderMarkdown = () => {
    if (!content) return '';
    
    // Basic implementation, handling:
    // - Headers
    // - Bold/Italic
    // - Lists
    // - Links
    // - Code blocks
    const html = content
      // Convert headers
      .replace(/^### (.*$)/gim, '<h3>$1</h3>')
      .replace(/^## (.*$)/gim, '<h2>$1</h2>')
      .replace(/^# (.*$)/gim, '<h1>$1</h1>')
      
      // Convert bold and italic
      .replace(/\*\*(.*)\*\*/gim, '<strong>$1</strong>')
      .replace(/\*(.*)\*/gim, '<em>$1</em>')
      
      // Convert unordered lists
      .replace(/^\s*-\s*(.*)/gim, '<li>$1</li>')
      .replace(/<\/li>\n<li>/gim, '</li><li>')
      .replace(/(<li>.*<\/li>)/gim, '<ul>$1</ul>')
      
      // Convert ordered lists
      .replace(/^\s*\d+\.\s*(.*)/gim, '<li>$1</li>')
      .replace(/<\/li>\n<li>/gim, '</li><li>')
      
      // Convert links
      .replace(/\[([^\]]+)\]\(([^)]+)\)/gim, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>')
      
      // Convert code blocks
      .replace(/```([\s\S]*?)```/gim, '<pre><code>$1</code></pre>')
      .replace(/`([^`]+)`/gim, '<code>$1</code>')
      
      // Convert paragraphs
      .replace(/^\s*(\n)?(.+)/gim, function(m) {
        return /\<(\/)?(h1|h2|h3|h4|h5|h6|ul|ol|li|pre|code|em|strong)\>/gim.test(m) ? m : '<p>' + m + '</p>';
      })
      
      // Clean up empty paragraphs
      .replace(/<p><\/p>/gim, '');
    
    return html;
  };
  
  return (
    <div 
      className={`prose prose-sm sm:prose max-w-none dark:prose-invert ${className}`}
      dangerouslySetInnerHTML={{ __html: renderMarkdown() }}
    />
  );
}