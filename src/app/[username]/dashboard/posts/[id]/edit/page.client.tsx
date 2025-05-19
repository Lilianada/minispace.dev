'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import useAuth from '@/hooks/useAuth';
import PostForm from '@/components/posts/PostForm';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import { AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { getDashboardPath } from '@/lib/route-utils';

interface EditPostPageProps {
  postId: string;
}

export default function EditPostPage({ postId }: EditPostPageProps) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [post, setPost] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch the post data
  useEffect(() => {
    const fetchPost = async () => {
      if (!user) return;
      
      try {
        setIsLoading(true);
        const postRef = doc(db, 'Users', user.uid, 'posts', postId);
        const postSnap = await getDoc(postRef);
        
        if (!postSnap.exists()) {
          setError('Blog post not found');
          return;
        }
        
        const postData = postSnap.data();
        
        // Check if the current user is the author
        if (postData.authorId !== user.uid) {
          setError('You do not have permission to edit this post');
          return;
        }
        
        // Format dates for the form and ensure all required fields are present
        console.log('Post data found:', postData);
        const formattedPost = {
          id: postSnap.id,
          ...postData,
          title: postData.title || '',
          content: postData.content || '',
          slug: postData.slug || '',
          excerpt: postData.excerpt || '',
          urlPath: postData.urlPath || 'blog',
          tags: postData.tags || [],
          coverImage: postData.coverImage || '',
          customCSS: postData.customCSS || '',
          createdAt: postData.createdAt?.toDate() || new Date(),
          updatedAt: postData.updatedAt?.toDate() || new Date(),
          publishedAt: postData.publishedAt?.toDate() || null
        };
        console.log('Formatted post for form:', formattedPost);
        setPost(formattedPost);
      } catch (err) {
        console.error('Error fetching blog post:', err);
        setError('Failed to load blog post');
        toast({
          title: 'Error',
          description: 'Failed to load blog post',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    if (!loading) {
      fetchPost();
    }
  }, [postId, user, loading]);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!loading && !user) {
      toast({
        title: 'Authentication required',
        description: 'Please log in to edit blog posts',
        variant: 'destructive',
      });
      router.push('/login');
    }
  }, [user, loading, router, toast]);

  if (loading || isLoading) {
    return (
      <div className="container py-6 space-y-6">
        <div className="animate-pulse h-8 bg-muted rounded w-1/4"></div>
        <Card className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-10 bg-muted rounded w-full"></div>
            <div className="h-40 bg-muted rounded w-full"></div>
            <div className="h-10 bg-muted rounded w-1/3 ml-auto"></div>
          </div>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container py-6 space-y-6">
        <h1 className="text-2xl font-bold">Edit Blog Post</h1>
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
        <div className="flex justify-end">
          <Button onClick={() => router.push(getDashboardPath('posts'))}>
            Back to Blog Posts
          </Button>
        </div>
      </div>
    );
  }

  if (!user || !post) {
    return null;
  }

  return (
    <div className="container py-6 space-y-6">
      <h1 className="text-2xl font-bold">Edit Blog Post</h1>
      <PostForm initialData={post} isEditing={true} />
    </div>
  );
}
