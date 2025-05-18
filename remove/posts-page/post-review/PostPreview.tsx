// filepath: /Users/lilian/Desktop/Projects/minispace.dev/src/components/posts/PostPreview.tsx
'use client';

import { formatDate } from '@/lib/utils';
import { Loader } from '@/components/ui/loader';
import Image from 'next/image';

interface Post {
  id: string;
  title: string;
  content?: string;
  contentHtml?: string;
  excerpt?: string;
  publishedAt?: string;
  updatedAt: string;
  author?: {
    name: string;
    image?: string;
  };
  tags?: string[];
  coverImage?: string;
  status: 'published' | 'draft';
}

interface PostPreviewProps {
  post: Post;
}

export default function PostPreview({ post }: PostPreviewProps) {
  if (!post) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader />
      </div>
    );
  }

  return (
    <article className="max-w-3xl mx-auto">
      {/* Post header */}
      <header className="mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">{post.title}</h1>
        
        <div className="flex items-center text-muted-foreground text-sm mb-6">
          {/* Author info */}
          {post.author && (
            <div className="flex items-center mr-4">
              {post.author.image ? (
                <Image 
                  src={post.author.image}
                  alt={post.author.name}
                  width={32}
                  height={32}
                  className="w-8 h-8 rounded-full mr-2"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center mr-2">
                  <span className="text-xs font-medium">
                    {post.author.name.charAt(0)}
                  </span>
                </div>
              )}
              <span>{post.author.name}</span>
            </div>
          )}
          
          {/* Date */}
          <div className="flex items-center">
            <svg className="w-4 h-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
            </svg>
            <span>
              {post.publishedAt 
                ? formatDate(post.publishedAt, { dateStyle: 'long' })
                : 'Draft'
              }
            </span>
          </div>
        </div>

        {/* Cover image */}
        {post.coverImage && (
          <div className="aspect-video w-full overflow-hidden rounded-lg mb-8">
            <Image 
              src={post.coverImage} 
              alt={`Cover image for ${post.title}`}
              width={1200}
              height={630}
              className="w-full h-full object-cover"
            />
          </div>
        )}
        
        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-6">
            {post.tags.map(tag => (
              <span 
                key={tag}
                className="px-2 py-1 rounded-full bg-muted text-xs font-medium"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </header>
      
      {/* Post content */}
      <div className="prose dark:prose-invert max-w-none">
        {post.contentHtml ? (
          <div dangerouslySetInnerHTML={{ __html: post.contentHtml }} />
        ) : post.content ? (
          <p className="text-muted-foreground italic">Loading content...</p>
        ) : (
          <p className="text-muted-foreground italic">No content available</p>
        )}
      </div>
      
      {/* Post footer */}
      <footer className="mt-12 pt-6 border-t">
        <div className="flex justify-between items-center">
          <div className="text-sm text-muted-foreground">
            {post.updatedAt && post.publishedAt && post.updatedAt !== post.publishedAt ? (
              <p>Last updated: {formatDate(post.updatedAt, { dateStyle: 'long' })}</p>
            ) : null}
          </div>
          
          {/* Preview mode indicator */}
          <div className="flex items-center space-x-2">
            <span className="text-sm text-muted-foreground">Preview Mode</span>
          </div>
        </div>
      </footer>
    </article>
  );
}