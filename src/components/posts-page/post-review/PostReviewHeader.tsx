'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { updatePostStatus } from '@/lib/api/posts';
import { Loader } from '@/components/ui/loader';
import { getDashboardPath } from '@/lib/route-utils';

interface Post {
  id: string;
  title: string;
  status: 'published' | 'draft';
  publishedAt?: string;
}

interface PostReviewHeaderProps {
  post: Post;
}

export default function PostReviewHeader({ post }: PostReviewHeaderProps) {
  const router = useRouter();
  const [isPublishing, setIsPublishing] = useState(false);
  
  const handlePublish = async () => {
    if (isPublishing) return;
    
    setIsPublishing(true);
    try {
      // Toggle the status
      const newStatus = post.status === 'published' ? 'draft' : 'published';
      await updatePostStatus(post.id, newStatus);
      
      // Refresh the page
      router.refresh();
    } catch (err) {
      console.error('Failed to update post status:', err);
    } finally {
      setIsPublishing(false);
    }
  };
  
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-6 border-b">
      <div>
        <div className="flex items-center gap-2 mb-2">
          <Link href={getDashboardPath('posts')} className="text-muted-foreground hover:text-foreground">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              viewBox="0 0 20 20" 
              fill="currentColor" 
              className="w-5 h-5"
            >
              <path fillRule="evenodd" d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z" clipRule="evenodd" />
            </svg>
          </Link>
          <h1 className="text-2xl font-bold">Post Preview</h1>
          <Badge variant={post.status === 'published' ? 'default' : 'outline'}>
            {post.status === 'published' ? 'Published' : 'Draft'}
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground">
          Preview how your post will look to readers
        </p>
      </div>
      
      <div className="flex gap-3">
        <Button variant="outline" asChild>
          <Link href={getDashboardPath(`posts/${post.id}/edit`)}>
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              viewBox="0 0 20 20" 
              fill="currentColor" 
              className="w-4 h-4 mr-2"
            >
              <path d="M5.433 13.917l1.262-3.155A4 4 0 017.58 9.42l6.92-6.918a2.121 2.121 0 013 3l-6.92 6.918c-.383.383-.84.685-1.343.886l-3.154 1.262a.5.5 0 01-.65-.65z" />
              <path d="M3.5 5.75c0-.69.56-1.25 1.25-1.25H10A.75.75 0 0010 3H4.75A2.75 2.75 0 002 5.75v9.5A2.75 2.75 0 004.75 18h9.5A2.75 2.75 0 0017 15.25V10a.75.75 0 00-1.5 0v5.25c0 .69-.56 1.25-1.25 1.25h-9.5c-.69 0-1.25-.56-1.25-1.25v-9.5z" />
            </svg>
            Edit Post
          </Link>
        </Button>
        
        <Button 
          onClick={handlePublish} 
          disabled={isPublishing}
          variant={post.status === 'published' ? 'outline' : 'default'}
        >
          {isPublishing ? (
            <Loader size="sm" className="mr-2" />
          ) : (
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              viewBox="0 0 20 20" 
              fill="currentColor" 
              className="w-4 h-4 mr-2"
            >
              {post.status === 'published' ? (
                <path fillRule="evenodd" d="M4.5 2A1.5 1.5 0 003 3.5v13A1.5 1.5 0 004.5 18h11a1.5 1.5 0 001.5-1.5V7.621a1.5 1.5 0 00-.44-1.06l-4.12-4.122A1.5 1.5 0 0011.378 2H4.5zm2.25 8.5a.75.75 0 000 1.5h6.5a.75.75 0 000-1.5h-6.5z" clipRule="evenodd" />
              ) : (
                <path fillRule="evenodd" d="M4.5 2A1.5 1.5 0 003 3.5v13A1.5 1.5 0 004.5 18h11a1.5 1.5 0 001.5-1.5V7.621a1.5 1.5 0 00-.44-1.06l-4.12-4.122A1.5 1.5 0 0011.378 2H4.5zm4.75 6.75a.75.75 0 011.5 0v2.546l.943-1.048a.75.75 0 111.114 1.004l-2.25 2.5a.75.75 0 01-1.114 0l-2.25-2.5a.75.75 0 111.114-1.004l.943 1.048V8.75z" clipRule="evenodd" />
              )}
            </svg>
          )}
          {post.status === 'published' ? 'Unpublish' : 'Publish'}
        </Button>
      </div>
    </div>
  );
}