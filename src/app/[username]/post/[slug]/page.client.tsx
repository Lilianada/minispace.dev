'use client';

import { useEffect, useState } from 'react';
import { collection, query, where, getDocs, limit, increment, updateDoc, doc } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import { EnhancedMarkdownRenderer } from '@/components/ui/enhanced-markdown-renderer';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { formatDistanceToNow } from 'date-fns';

interface Post {
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
  createdAt: Date;
  updatedAt: Date;
  publishedAt?: Date | null;
  views: number;
}

export default function PostClient({ username, slug }: { username: string; slug: string }) {
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);
        
        // First, find the user by username
        const usersRef = collection(db, 'Users');
        const userQuery = query(usersRef, where('username', '==', username), limit(1));
        const userSnapshot = await getDocs(userQuery);
        
        if (userSnapshot.empty) {
          setError('User not found');
          setLoading(false);
          return;
        }
        
        const userId = userSnapshot.docs[0].id;
        
        // Now query the user's posts subcollection by slug
        const postsRef = collection(db, `Users/${userId}/posts`);
        const q = query(
          postsRef,
          where('slug', '==', slug),
          where('status', '==', 'published'),
          limit(1)
        );
        
        const querySnapshot = await getDocs(q);
        
        if (querySnapshot.empty) {
          setError('Post not found');
          setLoading(false);
          return;
        }
        
        const postDoc = querySnapshot.docs[0];
        const postData = postDoc.data();
        
        // Increment view count
        const postRef = doc(db, `Users/${userId}/posts`, postDoc.id);
        await updateDoc(postRef, {
          views: increment(1)
        });
        
        // Also try to increment in the discover collection if it exists there
        try {
          const discoverPostRef = doc(db, 'discover', postDoc.id);
          await updateDoc(discoverPostRef, {
            views: increment(1)
          });
        } catch (error) {
          // It's okay if this fails - the post might not be in the discover collection
          console.log('Note: Post not found in discover collection or failed to update views');
        }
        
        setPost({
          id: postDoc.id,
          ...postData,
          createdAt: postData.createdAt?.toDate() || new Date(),
          updatedAt: postData.updatedAt?.toDate() || new Date(),
          publishedAt: postData.publishedAt?.toDate() || null,
          views: (postData.views || 0) + 1 // Optimistically update the view count
        } as Post);
      } catch (err) {
        console.error('Error fetching post:', err);
        setError('Failed to load post. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [slug]);

  if (loading) {
    return (
      <div className="container max-w-4xl mx-auto py-8 px-4">
        <Skeleton className="h-10 w-3/4 mb-4" />
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
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="container max-w-4xl mx-auto py-8 px-4">
        <Alert variant="destructive">
          <AlertDescription>Post not found</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-4xl mx-auto py-8 px-4">
        {/* Post Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">{post.title}</h1>
          
          <div className="flex items-center text-sm text-muted-foreground mb-4">
            <span>Published {formatDistanceToNow(post.publishedAt || post.createdAt, { addSuffix: true })}</span>
            <span className="mx-2">•</span>
            <span>{post.views} views</span>
          </div>
          
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
