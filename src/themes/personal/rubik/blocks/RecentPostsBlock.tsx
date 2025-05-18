'use client';

import React from 'react';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';

interface Post {
  id: string;
  title: string;
  slug: string;
  excerpt?: string;
  createdAt: Date;
}

interface RecentPostsBlockProps {
  content: {
    count: number;
    showDate?: boolean;
    showExcerpt?: boolean;
  };
  posts?: Post[];
}

export default function RecentPostsBlock({ content, posts = [] }: RecentPostsBlockProps) {
  const { count = 3, showDate = true, showExcerpt = true } = content;
  
  // Default posts for preview
  const defaultPosts = [
    {
      id: '1',
      title: 'Getting Started with Minispace',
      slug: 'getting-started',
      excerpt: 'Learn how to set up your Minispace blog and start publishing your thoughts to the world.',
      createdAt: new Date('2025-05-10T12:00:00Z'),
    },
    {
      id: '2',
      title: 'The Art of Minimal Design',
      slug: 'minimal-design',
      excerpt: 'Exploring how minimalism in design can lead to better user experiences and cleaner interfaces.',
      createdAt: new Date('2025-05-08T12:00:00Z'),
    },
    {
      id: '3',
      title: 'Writing Effective Blog Posts',
      slug: 'effective-blog-posts',
      excerpt: 'Tips and tricks for writing blog posts that engage readers and convey your ideas clearly.',
      createdAt: new Date('2025-05-05T12:00:00Z'),
    },
  ];
  
  const displayPosts = posts.length > 0 ? posts.slice(0, count) : defaultPosts.slice(0, count);
  
  if (displayPosts.length === 0) {
    return (
      <section className="py-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Recent Posts</h2>
        <p className="text-gray-600">No posts yet. Check back soon!</p>
      </section>
    );
  }
  
  return (
    <section className="py-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Recent Posts</h2>
      
      <div className="space-y-6">
        {displayPosts.map((post) => (
          <article key={post.id} className="border-b border-gray-100 pb-6 last:border-0">
            <h3 className="text-xl font-medium mb-2">
              <Link href={`/posts/${post.slug}`} className="text-gray-900 hover:text-primary">
                {post.title}
              </Link>
            </h3>
            
            {showDate && (
              <time className="text-sm text-gray-500 mb-2 block">
                {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
              </time>
            )}
            
            {showExcerpt && post.excerpt && (
              <p className="text-gray-700 mt-2">{post.excerpt}</p>
            )}
            
            <div className="mt-3">
              <Link href={`/posts/${post.slug}`} className="text-primary hover:underline text-sm font-medium">
                Read more →
              </Link>
            </div>
          </article>
        ))}
      </div>
      
      <div className="mt-8">
        <Link href="/posts" className="text-primary hover:underline font-medium">
          View all posts →
        </Link>
      </div>
    </section>
  );
}
