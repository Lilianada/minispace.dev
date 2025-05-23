'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import PostsList from '@/components/posts/PostsList';
import useAuth from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

export default function PostsPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!loading && !user) {
      // Use a ref to prevent infinite loop with toast
      const redirectToLogin = () => {
        router.push('/login');
      };
      
      // Show toast only once and then redirect
      toast({
        title: 'Authentication required',
        description: 'Please log in to access your blog posts',
        variant: 'destructive',
      });
      
      // Delay redirect slightly to allow toast to show
      setTimeout(redirectToLogin, 100);
    }
  }, [user, loading, router]);  // Remove toast from dependencies

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
      <PostsList />
    </div>
  );
}
