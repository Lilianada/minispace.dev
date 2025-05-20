'use client';

import React from 'react';
import Link from 'next/link';
import { format } from 'date-fns';
import { Avatar } from '@/components/ui/avatar';
import { AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { CalendarIcon, ClockIcon, TagIcon } from 'lucide-react';

interface PostMetaBlockProps {
  content: {
    showDate?: boolean;
    showTags?: boolean;
    showAuthor?: boolean;
    showReadingTime?: boolean;
  };
  post?: {
    createdAt: Date;
    tags?: string[];
    author?: {
      name: string;
      avatar?: string;
      username?: string;
    };
    readingTime?: string;
  };
}

export default function PostMetaBlock({ content, post }: PostMetaBlockProps) {
  const { 
    showDate = true, 
    showTags = true, 
    showAuthor = true,
    showReadingTime = true 
  } = content;
  
  // Default post data for preview
  const defaultPost = {
    createdAt: new Date(),
    tags: ['minispace', 'blog', 'web development'],
    author: {
      name: 'Demo User',
      avatar: '',
      username: 'demouser',
    },
    readingTime: '5 min read',
  };
  
  const displayPost = post || defaultPost;
  
  return (
    <div className="mb-8">
      {showAuthor && displayPost.author && (
        <div className="flex items-center mb-4">
          <Avatar className="h-10 w-10 mr-3 border-2 border-white shadow-sm">
            <AvatarImage src={displayPost.author.avatar || '/placeholder-avatar.png'} alt={displayPost.author.name} />
            <AvatarFallback className="bg-primary text-white font-medium">
              {displayPost.author.name.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <div>
            <div className="font-medium text-text">
              {displayPost.author.username ? (
                <Link href={`/${displayPost.author.username}`} className="hover:text-primary transition-colors">
                  {displayPost.author.name}
                </Link>
              ) : (
                <span>{displayPost.author.name}</span>
              )}
            </div>
            <div className="flex items-center text-xs text-secondary space-x-4">
              {showDate && (
                <div className="flex items-center">
                  <CalendarIcon size={12} className="mr-1" />
                  <time dateTime={displayPost.createdAt.toISOString()}>
                    {format(new Date(displayPost.createdAt), 'MMMM d, yyyy')}
                  </time>
                </div>
              )}
              
              {showReadingTime && displayPost.readingTime && (
                <div className="flex items-center">
                  <ClockIcon size={12} className="mr-1" />
                  <span>{displayPost.readingTime}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      
      {/* Alternative layout when author is not shown */}
      {!showAuthor && showDate && (
        <div className="flex flex-wrap items-center gap-4 mb-4 text-sm text-secondary">
          <div className="flex items-center">
            <CalendarIcon size={16} className="mr-1.5" />
            <time dateTime={displayPost.createdAt.toISOString()}>
              {format(new Date(displayPost.createdAt), 'MMMM d, yyyy')}
            </time>
          </div>
          
          {showReadingTime && displayPost.readingTime && (
            <div className="flex items-center">
              <ClockIcon size={16} className="mr-1.5" />
              <span>{displayPost.readingTime}</span>
            </div>
          )}
        </div>
      )}
      
      {showTags && displayPost.tags && displayPost.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-2">
          {displayPost.tags.map((tag) => (
            <Link 
              key={tag} 
              href={`/tag/${tag}`}
              className="flex items-center text-xs bg-muted hover:bg-muted/80 text-secondary px-3 py-1.5 rounded-md transition-colors"
            >
              <TagIcon size={12} className="mr-1" />
              {tag}
            </Link>
          ))}
        </div>
      )}
      
      <div className="mt-6 border-b border-border"></div>
    </div>
  );
}
