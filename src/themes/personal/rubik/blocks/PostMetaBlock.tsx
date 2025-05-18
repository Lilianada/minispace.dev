'use client';

import React from 'react';
import Link from 'next/link';
import { format } from 'date-fns';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

interface PostMetaBlockProps {
  content: {
    showDate?: boolean;
    showTags?: boolean;
    showAuthor?: boolean;
  };
  post?: {
    createdAt: Date;
    tags?: string[];
    author?: {
      name: string;
      username: string;
      avatar?: string;
    };
  };
}

export default function PostMetaBlock({ content, post }: PostMetaBlockProps) {
  const { showDate = true, showTags = true, showAuthor = true } = content;
  
  // Default post meta for preview
  const defaultPost = {
    createdAt: new Date('2025-05-10T12:00:00Z'),
    tags: ['design', 'technology', 'writing'],
    author: {
      name: 'Demo User',
      username: 'demouser',
      avatar: '',
    },
  };
  
  const displayPost = post || defaultPost;
  
  return (
    <section className="py-4 border-b border-gray-100 mb-8">
      <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
        {showDate && (
          <time>
            {format(new Date(displayPost.createdAt), 'MMMM d, yyyy')}
          </time>
        )}
        
        {showAuthor && displayPost.author && (
          <div className="flex items-center gap-2">
            <Avatar className="h-6 w-6">
              <AvatarImage src={displayPost.author.avatar || ''} alt={displayPost.author.name} />
              <AvatarFallback>{displayPost.author.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <span>By {displayPost.author.name}</span>
          </div>
        )}
      </div>
      
      {showTags && displayPost.tags && displayPost.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-4">
          {displayPost.tags.map((tag) => (
            <Link 
              key={tag} 
              href={`/tag/${tag}`}
              className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 px-2 py-1 rounded-full"
            >
              {tag}
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}
