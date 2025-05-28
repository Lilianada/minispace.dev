'use client';

import React from 'react';
import { Textarea } from '@/components/ui/textarea';

export interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  minHeight?: string;
  className?: string;
  variant?: 'default' | 'dashboard';
}

/**
 * Unified RichTextEditor component
 * 
 * A single, configurable component for rich text editing that can be used
 * across the application with consistent behavior but flexible styling.
 */
export default function RichTextEditor({ 
  value, 
  onChange, 
  placeholder = 'Write your content here...', 
  minHeight = '300px',
  className = '',
  variant = 'default'
}: RichTextEditorProps) {
  // Determine styles based on variant
  const getStyles = () => {
    const baseStyles = 'w-full p-3 border rounded resize-y focus:outline-none focus:ring-2';
    
    if (variant === 'dashboard') {
      return `${baseStyles} border-gray-300 focus:ring-blue-500 ${className}`;
    }
    
    // Default variant
    return `${baseStyles} border-gray-200 focus:ring-purple-500 ${className}`;
  };
  
  return (
    <div className="rich-text-editor">
      <Textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={getStyles()}
        style={{ minHeight }}
      />
      {variant === 'dashboard' && (
        <div className="text-xs text-gray-500 mt-2">
          <p>You can use HTML tags for formatting your content.</p>
        </div>
      )}
    </div>
  );
}