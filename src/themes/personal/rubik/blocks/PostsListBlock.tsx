'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';

interface Post {
  id: string;
  title: string;
  slug: string;
  excerpt?: string;
  createdAt: Date;
  tags?: string[];
}

interface PostsListBlockProps {
  content: {
    postsPerPage: number;
    showDate?: boolean;
    showExcerpt?: boolean;
    showTags?: boolean;
  };
  posts?: Post[];
  totalPosts?: number;
}

export default function PostsListBlock({ content, posts = [], totalPosts = 0 }: PostsListBlockProps) {
  const { postsPerPage = 10, showDate = true, showExcerpt = true, showTags = true } = content;
  const [currentPage, setCurrentPage] = useState(1);
  
  // Default posts for preview
  const defaultPosts = [
    {
      id: '1',
      title: 'Getting Started with Minispace',
      slug: 'getting-started',
      excerpt: 'Learn how to set up your Minispace blog and start publishing your thoughts to the world.',
      createdAt: new Date('2025-05-10T12:00:00Z'),
      tags: ['tutorial', 'minispace'],
    },
    {
      id: '2',
      title: 'The Art of Minimal Design',
      slug: 'minimal-design',
      excerpt: 'Exploring how minimalism in design can lead to better user experiences and cleaner interfaces.',
      createdAt: new Date('2025-05-08T12:00:00Z'),
      tags: ['design', 'minimalism'],
    },
    {
      id: '3',
      title: 'Writing Effective Blog Posts',
      slug: 'effective-blog-posts',
      excerpt: 'Tips and tricks for writing blog posts that engage readers and convey your ideas clearly.',
      createdAt: new Date('2025-05-05T12:00:00Z'),
      tags: ['writing', 'content'],
    },
    {
      id: '4',
      title: 'The Future of Web Development',
      slug: 'future-web-development',
      excerpt: 'Exploring emerging trends and technologies that will shape the future of web development.',
      createdAt: new Date('2025-05-01T12:00:00Z'),
      tags: ['technology', 'web development'],
    },
    {
      id: '5',
      title: 'Building a Personal Brand Online',
      slug: 'personal-brand-online',
      excerpt: 'How to establish and grow your personal brand through consistent online presence and valuable content.',
      createdAt: new Date('2025-04-28T12:00:00Z'),
      tags: ['branding', 'career'],
    },
  ];
  
  const displayPosts = posts.length > 0 ? posts : defaultPosts;
  const totalPages = Math.ceil((totalPosts || displayPosts.length) / postsPerPage);
  
  const startIndex = (currentPage - 1) * postsPerPage;
  const endIndex = startIndex + postsPerPage;
  const currentPosts = displayPosts.slice(startIndex, endIndex);
  
  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };
  
  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };
  
  if (displayPosts.length === 0) {
    return (
      <section className="py-8">
        <div className="text-center py-12">
          <h3 className="text-xl font-medium text-gray-700 mb-2">No posts yet</h3>
          <p className="text-gray-600">Check back soon for new content!</p>
        </div>
      </section>
    );
  }
  
  return (
    <section className="py-8">
      <div className="space-y-8">
        {currentPosts.map((post) => (
          <article key={post.id} className="border-b border-gray-100 pb-8 last:border-0">
            <h2 className="text-2xl font-bold mb-2">
              <Link href={`/posts/${post.slug}`} className="text-gray-900 hover:text-primary">
                {post.title}
              </Link>
            </h2>
            
            {showDate && (
              <time className="text-sm text-gray-500 mb-3 block">
                {format(new Date(post.createdAt), 'MMMM d, yyyy')}
              </time>
            )}
            
            {showExcerpt && post.excerpt && (
              <p className="text-gray-700 mb-3">{post.excerpt}</p>
            )}
            
            {showTags && post.tags && post.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-4">
                {post.tags.map((tag) => (
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
            
            <div className="mt-4">
              <Link href={`/posts/${post.slug}`} className="text-primary hover:underline text-sm font-medium">
                Read more →
              </Link>
            </div>
          </article>
        ))}
      </div>
      
      {totalPages > 1 && (
        <div className="flex justify-between items-center mt-12">
          <Button
            variant="outline"
            onClick={handlePreviousPage}
            disabled={currentPage === 1}
          >
            ← Previous
          </Button>
          
          <span className="text-sm text-gray-600">
            Page {currentPage} of {totalPages}
          </span>
          
          <Button
            variant="outline"
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
          >
            Next →
          </Button>
        </div>
      )}
    </section>
  );
}
