'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { collection, query, where, orderBy, getDocs, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import { getAuth } from 'firebase/auth';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import PostItem from './PostItem';
import PostsEmptyState from './PostsEmptyState';
import { getDashboardPath } from '@/lib/route-utils';

// Simple post interface
interface Post {
  id: string;
  title: string;
  excerpt?: string;
  content?: string;
  status: 'published' | 'draft';
  createdAt: any;
  updatedAt: any;
  authorId: string;
  slug: string;
  publishedAt?: string;
  views?: number;
}

export default function PostsListSimple() {
  const router = useRouter();
  const { toast } = useToast();
  
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [indexUrl, setIndexUrl] = useState<string | null>(null);
  
  // Helper function to get new post URL
  const getNewPostUrl = () => {
    return getDashboardPath('posts/new-post');
  };
  
  // Fetch posts on component mount
  useEffect(() => {
    async function fetchPosts() {
      try {
        setIsLoading(true);
        setError(null);
        
        // Get current user
        const auth = getAuth();
        const user = auth.currentUser;
        
        if (!user) {
          setError('Authentication required. Please log in to view your posts.');
          setIsLoading(false);
          return;
        }
        
        console.log('Fetching posts for user:', user.uid);
        
        // Create a simple query to get all posts by the current user
        const postsRef = collection(db, 'posts');
        
        // First try a simple query without ordering to see if we can get any posts
        // This query doesn't require a composite index
        let postsQuery = query(
          postsRef,
          where('authorId', '==', user.uid)
        );
        
        try {
          // Try to get posts with the simple query first
          const simpleSnapshot = await getDocs(postsQuery);
          console.log('Simple query results:', { count: simpleSnapshot.docs.length });
          
          // If we have posts, we can try the ordered query
          if (simpleSnapshot.docs.length > 0) {
            // Now try the query with ordering (this might require an index)
            postsQuery = query(
              postsRef,
              where('authorId', '==', user.uid),
              orderBy('createdAt', 'desc')
            );
          }
        } catch (err) {
          console.log('Simple query failed, continuing with original error handling');
        }
        
        // Execute query
        const snapshot = await getDocs(postsQuery);
        console.log('Query results:', { count: snapshot.docs.length });
        
        // Transform the data
        const fetchedPosts = snapshot.docs.map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            ...data,
            createdAt: data.createdAt?.toDate?.() || new Date(),
            updatedAt: data.updatedAt?.toDate?.() || new Date(),
            publishedAt: data.publishedAt?.toDate?.() || null
          };
        }) as Post[];
        
        setPosts(fetchedPosts);
        setIsLoading(false);
        
      } catch (err) {
        console.error('Error fetching posts:', err);
        let errorMessage = err instanceof Error ? err.message : 'Failed to load posts. Please try again.';
        
        // Check if this is a Firestore index error
        if (errorMessage.includes('index') && errorMessage.includes('https://console.firebase.google.com')) {
          // Extract the index creation URL
          const indexUrlMatch = errorMessage.match(/(https:\/\/console\.firebase\.google\.com[^\s]+)/i);
          const indexUrl = indexUrlMatch ? indexUrlMatch[0] : null;
          
          // Set a more user-friendly error message
          errorMessage = 'This page requires a Firestore index to be created.';
          
          // Show a special toast with instructions
          toast({
            title: 'Firestore Index Required',
            description: 'A database index needs to be created for this page to work properly.',
            variant: 'destructive'
          });
          
          // If we have an index URL, save it and show it in the error message
          if (indexUrl) {
            setIndexUrl(indexUrl);
            setError('This page requires a Firestore index to be created. Please use the button below to create the required index in the Firebase console.');
          }
        } else {
          // Show a regular error toast
          toast({
            title: 'Error',
            description: errorMessage,
            variant: 'destructive',
          });
        }
        
        setError(errorMessage);
        setIsLoading(false);
      }
    }
    
    // Call the fetch function
    fetchPosts();
    
    // Cleanup function
    return () => {
      // Nothing to clean up
    };
  }, [toast]);
  
  // Handle refresh
  const handleRefresh = () => {
    setIsLoading(true);
    setError(null);
    router.refresh();
  };
  
  // Render loading state
  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center mb-6">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-10 w-32" />
        </div>
        
        {Array(3).fill(0).map((_, i) => (
          <Card key={i} className="p-4 mb-4">
            <Skeleton className="h-7 w-3/4 mb-2" />
            <Skeleton className="h-4 w-1/2 mb-4" />
            <div className="flex justify-between">
              <Skeleton className="h-4 w-1/4" />
              <Skeleton className="h-8 w-20" />
            </div>
          </Card>
        ))}
        
        <div className="mt-8 text-center">
          <p className="text-sm text-muted-foreground mb-4">Taking too long to load?</p>
          <Button 
            variant="outline" 
            onClick={() => {
              setIsLoading(false);
              setError('Loading timeout. Please try again.');
            }}
          >
            Cancel Loading
          </Button>
        </div>
      </div>
    );
  }
  
  // Render error state
  if (error) {
    return (
      <PostsEmptyState
        title="Cannot load posts"
        message={error}
        showCreateButton={true}
        showRefreshButton={true}
        onRefresh={handleRefresh}
        error={true}
        indexUrl={indexUrl}
      />
    );
  }
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">My Posts</h1>
        <Button onClick={() => router.push(getNewPostUrl())}>
          Create New Post
        </Button>
      </div>
      
      {!posts || posts.length === 0 ? (
        <PostsEmptyState
          title="No posts found"
          message="You haven't created any posts yet"
          showCreateButton={true}
          showRefreshButton={false}
        />
      ) : (
        <>
          <div className="space-y-4">
            {posts.map((post) => (
              <PostItem 
                key={post.id} 
                post={post} 
                onRefresh={handleRefresh}
              />
            ))}
          </div>
          
          <p className="text-sm text-muted-foreground text-center">
            Showing {posts.length} posts
          </p>
        </>
      )}
    </div>
  );
}
