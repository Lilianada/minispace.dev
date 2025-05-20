'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Calendar, ArrowRight, Tag } from 'lucide-react';

interface Post {
  id: string;
  title: string;
  slug: string;
  excerpt?: string;
  createdAt: Date;
  tags?: string[];
  coverImage?: string;
}

interface PostsListBlockProps {
  content: {
    postsPerPage: number;
    showDate?: boolean;
    showExcerpt?: boolean;
    showTags?: boolean;
    layout?: 'list' | 'grid';
  };
  posts?: Post[];
  totalPosts?: number;
}

export default function PostsListBlock({ content, posts = [], totalPosts = 0 }: PostsListBlockProps) {
  const { 
    postsPerPage = 10, 
    showDate = true, 
    showExcerpt = true, 
    showTags = true,
    layout = 'list'
  } = content;
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
      coverImage: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?q=80&w=600&auto=format&fit=crop',
    },
    {
      id: '2',
      title: 'The Art of Minimal Design',
      slug: 'minimal-design',
      excerpt: 'Exploring how minimalism in design can lead to better user experiences and cleaner interfaces.',
      createdAt: new Date('2025-05-08T12:00:00Z'),
      tags: ['design', 'minimalism'],
      coverImage: 'https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?q=80&w=600&auto=format&fit=crop',
    },
    {
      id: '3',
      title: 'Writing Effective Blog Posts',
      slug: 'effective-blog-posts',
      excerpt: 'Tips and tricks for writing blog posts that engage readers and convey your ideas clearly.',
      createdAt: new Date('2025-05-05T12:00:00Z'),
      tags: ['writing', 'content'],
      coverImage: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?q=80&w=600&auto=format&fit=crop',
    },
    {
      id: '4',
      title: 'The Future of Web Development',
      slug: 'future-web-development',
      excerpt: 'Exploring emerging trends and technologies that will shape the future of web development.',
      createdAt: new Date('2025-05-01T12:00:00Z'),
      tags: ['technology', 'web development'],
      coverImage: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=600&auto=format&fit=crop',
    },
    {
      id: '5',
      title: 'Building a Personal Brand Online',
      slug: 'personal-brand-online',
      excerpt: 'How to establish and grow your personal brand through consistent online presence and valuable content.',
      createdAt: new Date('2025-04-28T12:00:00Z'),
      tags: ['branding', 'career'],
      coverImage: 'https://images.unsplash.com/photo-1493612276216-ee3925520721?q=80&w=600&auto=format&fit=crop',
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
        <div className="bg-muted rounded-lg text-center py-16 px-4">
          <h3 className="text-xl font-medium text-text mb-2">No posts yet</h3>
          <p className="text-secondary">Check back soon for new content!</p>
        </div>
      </section>
    );
  }
  
  return (
    <section className="py-8">
      {layout === 'grid' ? (
        // Grid layout
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {currentPosts.map((post) => (
            <article key={post.id} className="flex flex-col bg-card border border-border rounded-lg overflow-hidden hover:shadow-md transition-shadow">
              {post.coverImage && (
                <Link href={`/posts/${post.slug}`} className="block overflow-hidden aspect-video">
                  <img 
                    src={post.coverImage} 
                    alt={post.title} 
                    className="w-full h-full object-cover transition-transform hover:scale-105 duration-300"
                  />
                </Link>
              )}
              
              <div className="p-5 flex-grow flex flex-col">
                {showDate && (
                  <div className="flex items-center text-xs text-secondary mb-3">
                    <Calendar size={14} className="mr-1" />
                    <time>{format(new Date(post.createdAt), 'MMMM d, yyyy')}</time>
                  </div>
                )}
                
                <h2 className="text-xl font-bold mb-2 line-clamp-2">
                  <Link href={`/posts/${post.slug}`} className="text-text hover:text-primary transition-colors">
                    {post.title}
                  </Link>
                </h2>
                
                {showExcerpt && post.excerpt && (
                  <p className="text-secondary mb-4 line-clamp-3 text-sm flex-grow">{post.excerpt}</p>
                )}
                
                <div className="mt-auto pt-4 flex justify-between items-center">
                  <Link 
                    href={`/posts/${post.slug}`} 
                    className="text-primary hover:text-primary/80 text-sm font-medium flex items-center transition-colors"
                  >
                    Read more <ArrowRight size={14} className="ml-1" />
                  </Link>
                  
                  {showTags && post.tags && post.tags.length > 0 && (
                    <div className="flex items-center">
                      <Tag size={14} className="text-secondary mr-1" />
                      <span className="text-xs text-secondary">{post.tags[0]}</span>
                    </div>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>
      ) : (
        // List layout
        <div className="space-y-8">
          {currentPosts.map((post) => (
            <article key={post.id} className="flex flex-col md:flex-row gap-6 pb-8 border-b border-border last:border-0">
              {post.coverImage && (
                <Link href={`/posts/${post.slug}`} className="block md:w-1/3 overflow-hidden rounded-lg aspect-video md:aspect-auto">
                  <img 
                    src={post.coverImage} 
                    alt={post.title} 
                    className="w-full h-full object-cover transition-transform hover:scale-105 duration-300"
                  />
                </Link>
              )}
              
              <div className="flex-1 flex flex-col">
                {showDate && (
                  <div className="flex items-center text-sm text-secondary mb-2">
                    <Calendar size={16} className="mr-1" />
                    <time>{format(new Date(post.createdAt), 'MMMM d, yyyy')}</time>
                  </div>
                )}
                
                <h2 className="text-2xl font-bold mb-3">
                  <Link href={`/posts/${post.slug}`} className="text-text hover:text-primary transition-colors">
                    {post.title}
                  </Link>
                </h2>
                
                {showExcerpt && post.excerpt && (
                  <p className="text-secondary mb-4">{post.excerpt}</p>
                )}
                
                <div className="mt-auto pt-2 flex flex-wrap items-center justify-between gap-4">
                  <Link 
                    href={`/posts/${post.slug}`} 
                    className="text-primary hover:text-primary/80 font-medium flex items-center transition-colors"
                  >
                    Read more <ArrowRight size={16} className="ml-1" />
                  </Link>
                  
                  {showTags && post.tags && post.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {post.tags.map((tag) => (
                        <Link 
                          key={tag} 
                          href={`/tag/${tag}`}
                          className="text-xs bg-muted hover:bg-muted/80 text-secondary px-3 py-1 rounded-full transition-colors"
                        >
                          {tag}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
      
      {totalPages > 1 && (
        <div className="flex justify-between items-center mt-12">
          <Button
            variant="outline"
            onClick={handlePreviousPage}
            disabled={currentPage === 1}
            className="border-border text-secondary hover:text-primary hover:bg-muted"
          >
            ← Previous
          </Button>
          
          <span className="text-sm text-secondary">
            Page {currentPage} of {totalPages}
          </span>
          
          <Button
            variant="outline"
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
            className="border-border text-secondary hover:text-primary hover:bg-muted"
          >
            Next →
          </Button>
        </div>
      )}
    </section>
  );
}
