'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { doc, getDoc } from 'firebase/firestore';
import useAuth from '@/hooks/useAuth';
import { db } from '@/lib/firebase/config';
import { EnhancedMarkdownRenderer } from '@/components/ui/enhanced-markdown-renderer';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowLeft, Edit } from 'lucide-react';

interface BlogPost {
  id: string;
  title: string;
  content: string;
  excerpt?: string;
  slug: string;
  urlPath?: string;
  authorId: string;
  status: 'published' | 'draft';
  customCSS?: string;
  tags?: string[];
  coverImage?: string;
}

export default function PreviewClient({ id }: { id: string }) {
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);
        const postRef = doc(db, 'posts', id);
        const postSnap = await getDoc(postRef);

        if (!postSnap.exists()) {
          setError('Post not found');
          setLoading(false);
          return;
        }

        const postData = postSnap.data() as Omit<BlogPost, 'id'>;
        
        // Check if the current user is the author of the post
        if (user?.uid !== postData.authorId) {
          setError('You do not have permission to view this post');
          setLoading(false);
          return;
        }

        setPost({
          id: postSnap.id,
          ...postData
        });
      } catch (err) {
        console.error('Error fetching post:', err);
        setError('Failed to load post. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchPost();
    }
  }, [id, user]);

  const handleBackToDashboard = () => {
    // Extract username from the current URL or use a default path
    const pathname = window.location.pathname;
    const pathParts = pathname.split('/');
    const username = user?.displayName || pathParts[1];
    
    router.push(`/${username}/dashboard/blog-posts`);
  };

  const handleEdit = () => {
    // Extract username from the current URL or use a default path
    const pathname = window.location.pathname;
    const pathParts = pathname.split('/');
    const username = user?.displayName || pathParts[1];
    
    router.push(`/${username}/dashboard/blog-posts/${id}/edit`);
  };

  if (loading) {
    return (
      <div className="container max-w-4xl mx-auto py-8 px-4">
        <div className="flex justify-between items-center mb-6">
          <Skeleton className="h-10 w-40" />
          <Skeleton className="h-10 w-24" />
        </div>
        <Skeleton className="h-8 w-3/4 mb-4" />
        <Skeleton className="h-4 w-1/2 mb-8" />
        <div className="space-y-4">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-full" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container max-w-4xl mx-auto py-8 px-4">
        <Alert variant="destructive" className="mb-6">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
        <Button onClick={handleBackToDashboard}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Dashboard
        </Button>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="container max-w-4xl mx-auto py-8 px-4">
        <Alert variant="destructive" className="mb-6">
          <AlertDescription>Post not found</AlertDescription>
        </Alert>
        <Button onClick={handleBackToDashboard}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Dashboard
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Preview Banner */}
      <div className="sticky top-0 z-50 bg-yellow-50 dark:bg-yellow-900 border-b border-yellow-200 dark:border-yellow-800 py-2 px-4">
        <div className="container max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center">
            <span className="font-medium text-yellow-800 dark:text-yellow-200">
              Preview Mode
            </span>
            <span className="mx-2 text-yellow-600 dark:text-yellow-400">
              •
            </span>
            <span className="text-sm text-yellow-700 dark:text-yellow-300">
              {post.status === 'draft' ? 'Draft' : 'Published'}
            </span>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" size="sm" onClick={handleEdit}>
              <Edit className="mr-2 h-4 w-4" />
              Edit Post
            </Button>
            <Button variant="outline" size="sm" onClick={handleBackToDashboard}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Dashboard
            </Button>
          </div>
        </div>
      </div>

      <div className="container max-w-4xl mx-auto py-8 px-4">
        {/* Post Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">{post.title}</h1>
          {post.excerpt && (
            <p className="text-lg text-muted-foreground mb-4">{post.excerpt}</p>
          )}
          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-1 bg-secondary text-secondary-foreground rounded-md text-sm"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Cover Image */}
        {post.coverImage && (
          <div className="mb-8">
            <img
              src={post.coverImage}
              alt={post.title}
              className="w-full h-auto rounded-lg object-cover"
            />
          </div>
        )}

        {/* Custom CSS */}
        {post.customCSS && (
          <style dangerouslySetInnerHTML={{ __html: post.customCSS }} />
        )}

        {/* Post Content */}
        <article className="prose dark:prose-invert max-w-none">
          <EnhancedMarkdownRenderer 
            content={post.content} 
            allowHtml={true} 
          />
        </article>
      </div>
    </div>
  );
}
