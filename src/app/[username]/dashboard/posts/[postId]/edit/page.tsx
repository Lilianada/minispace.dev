
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { getPostById } from '@/lib/api/posts';
import PostForm from '@/components/posts-page/PostForm';
import { getDashboardPath } from '@/lib/route-utils';


export default function EditPostPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { toast } = useToast();
  const { id } = params;
  
  const [post, setPost] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadPost() {
      try {
        setIsLoading(true);
        const postData = await getPostById(id);
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
  }, [id, toast]);

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
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Edit Post</h1>
      </div>
      
      <PostForm 
        isEditing={true} 
        initialData={{
          id,
          title: post.title || '',
          content: post.content || '',
          slug: post.slug || '',
          excerpt: post.excerpt || '',
          tags: post.tags || [],
        }}
      />
    </div>
  );
}