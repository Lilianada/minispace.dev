'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import PostsListSimple from '@/components/posts-page/PostsListSimple';
import useAuth from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

export default function PostsPageClient() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!loading && !user) {
      toast({
        title: 'Authentication required',
        description: 'Please log in to access your dashboard',
        variant: 'destructive',
      });
      router.push('/login');
    }
  }, [user, loading, router, toast]);

  if (loading) {
    return (
      <div className="container py-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-muted rounded w-1/4"></div>
          <div className="h-12 bg-muted rounded w-full"></div>
          <div className="h-32 bg-muted rounded w-full"></div>
        </div>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect in the useEffect
  }

  return (
    <div className="container py-6">
      <PostsListSimple />
    </div>
  );
}
