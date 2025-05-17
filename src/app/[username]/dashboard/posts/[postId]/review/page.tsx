/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { Metadata } from 'next';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { getPostById, updatePostStatus } from '@/lib/api/posts';
import { MarkdownRenderer } from '@/components/ui/markdown-renderer';
import { AlertTriangle, Check, Edit, ArrowLeft } from 'lucide-react';
import { getDashboardPath } from '@/lib/route-utils';

interface ReviewPostPageProps {
  params: {
    postId: string;
  };
}

/**
 * Generate metadata for the review page
 */
export async function generateMetadata({ params }: ReviewPostPageProps): Promise<Metadata> {
  // Use await with params to properly handle dynamic route parameters
  const postId = await params.postId;
  const post = await getPostById(postId);
  
  if (!post) {
    return {
      title: 'Post not found',
    };
  }
  
  return {
    title: `Review: ${post.title} | Minispace`,
    description: post.excerpt || `Preview of ${post.title}`,
  };
}

/**
 * Post review page component
 */
export default function ReviewPostPage({ params }: { params: { postId: string } }) {
  const router = useRouter();
  const { toast } = useToast();
  const { postId } = params;
  
  const [post, setPost] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isPublishing, setIsPublishing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadPost() {
      try {
        setIsLoading(true);
        const postData = await getPostById(postId);
        setPost(postData);
        setError(null);
      } catch (err) {
        console.error('Failed to load post:', err);
        setError('Failed to load post. Please try again.');
        toast({
          title: 'Error',
          description: 'Failed to load post',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    }

    loadPost();
  }, [postId, toast]);

  const handlePublish = async () => {
    try {
      setIsPublishing(true);
      await updatePostStatus(postId, 'published');
      toast({
        title: 'Success',
        description: 'Post published successfully!',
        variant: 'success',
      });
      router.push(getDashboardPath('posts'));
    } catch (error) {
      console.error('Failed to publish post:', error);
      toast({
        title: 'Error',
        description: 'Failed to publish post',
        variant: 'destructive',
      });
    } finally {
      setIsPublishing(false);
    }
  };

  const handleEdit = () => {
    router.push(getDashboardPath(`posts/${postId}/edit`));
  };

  if (isLoading) {
    return (
      <div className="container max-w-5xl py-8">
        <div className="mb-8">
          <Skeleton className="h-10 w-48" />
        </div>
        <Card className="p-6">
          <Skeleton className="h-[500px] w-full" />
        </Card>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="container max-w-5xl py-8">
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold mb-4">Failed to load post</h2>
          <p className="text-muted-foreground mb-6">{error || "The post couldn't be found"}</p>
          <Button onClick={() => router.push(getDashboardPath('posts'))}>
            Back to Posts
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container max-w-5xl py-8">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="icon" 
            onClick={() => router.push(getDashboardPath('posts'))}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-3xl font-bold">Review Post</h1>
        </div>
        
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={handleEdit}
            className="flex items-center gap-2"
          >
            <Edit className="h-4 w-4" />
            Edit
          </Button>
          <Button 
            onClick={handlePublish}
            disabled={isPublishing}
            className="flex items-center gap-2"
          >
            {isPublishing ? (
              <>
                <span className="mr-2">
                  <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                </span>
                Publishing...
              </>
            ) : (
              <>
                <Check className="h-4 w-4" />
                Publish
              </>
            )}
          </Button>
        </div>
      </div>
      
      {post.status === 'published' && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-md flex items-center gap-2">
          <Check className="h-5 w-5 text-green-500" />
          <p className="text-green-700">This post is already published</p>
        </div>
      )}
      
      {!post.title && !post.content && (
        <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-md flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-amber-500" />
          <p className="text-amber-700">This post is empty. Add content before publishing.</p>
        </div>
      )}
      
      <Card className="mb-6 p-6">
        <h2 className="text-2xl font-bold mb-4">{post.title || 'Untitled Post'}</h2>
        
        {post.excerpt && (
          <div className="mb-4 text-muted-foreground italic border-l-4 pl-4 py-2">
            {post.excerpt}
          </div>
        )}
        
        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-6">
            {post.tags.map((tag: string, index: number) => (
              <span 
                key={index}
                className="px-2 py-1 bg-muted rounded-md text-xs"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </Card>
      
      <Card className="p-6">
        <div className="prose prose-sm sm:prose lg:prose-lg max-w-none dark:prose-invert">
          <MarkdownRenderer content={post.content || ''} />
        </div>
      </Card>
    </div>
  );
}