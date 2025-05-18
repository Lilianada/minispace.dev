'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import useAuth from '@/hooks/useAuth';
import BlogPostForm from '@/components/blog-posts/BlogPostForm';

export default function NewBlogPostPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!loading && !user) {
      toast({
        title: 'Authentication required',
        description: 'Please log in to create a blog post',
        variant: 'destructive',
      });
      router.push('/login');
    }
  }, [user, loading, router, toast]);

  if (loading) {
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

  if (!user) {
    return null; // Will redirect in the useEffect
  }

  return (
    <div className="container py-6 space-y-6">
      <h1 className="text-2xl font-bold">Create New Blog Post</h1>
      <BlogPostForm />
    </div>
  );
}
