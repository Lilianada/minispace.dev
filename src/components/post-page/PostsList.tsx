'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { collection, query, where, orderBy, getDocs, } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import { getAuth } from 'firebase/auth';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { getDashboardPath } from '@/lib/route-utils';
import PostsFilters from './PostsFilters';
import PostItem from './PostItem';
import PostsEmptyState from './PostsEmptyState';
import PostsLoading from './PostsLoading';

export interface Post {
  id: string;
  title: string;
  excerpt?: string;
  content?: string;
  status: 'published' | 'draft';
  createdAt: Date;
  updatedAt: Date;
  authorId: string;
  slug: string;
  urlPath?: string;
  publishedAt?: Date | null;
  views?: number;
  tags?: string[];
  coverImage?: string;
  customCSS?: string;
}

export interface PostsListProps {
  initialPosts?: Post[];
}

export default function PostsList({ initialPosts }: PostsListProps) {
  const router = useRouter();
  const { toast } = useToast();
  const auth = getAuth();
  
  // State variables
  const [posts, setPosts] = useState<Post[]>(initialPosts || []);
  const [isLoading, setIsLoading] = useState(!initialPosts);
  const [error, setError] = useState<string | null>(null);
  const [indexUrl, setIndexUrl] = useState<string | null>(null);
  const [filters, setFilters] = useState({
    status: 'all',
    sort: 'newest',
    search: ''
  });

  // Helper function to get new post URL
  const getNewPostUrl = () => {
    return getDashboardPath('blog-posts/new-post');
  };
  
  // Fetch posts when component mounts or filters change
  useEffect(() => {
    // Skip if we have initial posts and this is the first render
    if (initialPosts && posts === initialPosts) {
      return;
    }
    
    fetchPosts();
  }, [filters]);

  // Function to fetch posts from Firestore
  const fetchPosts = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const user = auth.currentUser;
      
      if (!user) {
        setError('Authentication required. Please log in to view your posts.');
        setIsLoading(false);
        return;
      }
      
      // Create a simple query first to check if we have any posts
      const postsRef = collection(db, 'posts');
      let postsQuery = query(postsRef, where('authorId', '==', user.uid));
      
      // Try to get posts with the simple query first
      const simpleSnapshot = await getDocs(postsQuery);
      
      // Apply filters and sorting
      try {
        // Build query based on filters
        if (filters.status !== 'all') {
          postsQuery = query(postsQuery, where('status', '==', filters.status));
        }
        
        // Add sorting
        switch (filters.sort) {
          case 'oldest':
            postsQuery = query(postsQuery, orderBy('createdAt', 'asc'));
            break;
          case 'a-z':
            postsQuery = query(postsQuery, orderBy('title', 'asc'));
            break;
          case 'z-a':
            postsQuery = query(postsQuery, orderBy('title', 'desc'));
            break;
          case 'most-viewed':
            postsQuery = query(postsQuery, orderBy('views', 'desc'));
            break;
          default:
            postsQuery = query(postsQuery, orderBy('createdAt', 'desc'));
        }
        
        // Execute the filtered query
        const snapshot = await getDocs(postsQuery);
        
        // Transform the data
        const fetchedPosts = snapshot.docs.map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            ...data,
            createdAt: data.createdAt?.toDate() || new Date(),
            updatedAt: data.updatedAt?.toDate() || new Date(),
            publishedAt: data.publishedAt?.toDate() || null,
            urlPath: data.urlPath || 'blog'
          };
        }) as Post[];
        
        // Apply search filter client-side if needed
        let filteredPosts = fetchedPosts;
        if (filters.search) {
          const searchLower = filters.search.toLowerCase();
          filteredPosts = fetchedPosts.filter(post => {
            return (
              post.title?.toLowerCase().includes(searchLower) ||
              post.excerpt?.toLowerCase().includes(searchLower) ||
              post.content?.toLowerCase().includes(searchLower) ||
              post.tags?.some(tag => tag.toLowerCase().includes(searchLower))
            );
          });
        }
        
        setPosts(filteredPosts);
      } catch (err: any) {
        // Check if this is a Firestore index error
        if (err.message && err.message.includes('index')) {
          // Extract the index creation URL
          const indexUrlMatch = err.message.match(/(https:\/\/console\.firebase\.google\.com[^\s]+)/i);
          const extractedUrl = indexUrlMatch ? indexUrlMatch[0] : null;
          
          if (extractedUrl) {
            setIndexUrl(extractedUrl);
          }
          
          // Fall back to using the simple query results
          const simplePosts = simpleSnapshot.docs.map(doc => {
            const data = doc.data();
            return {
              id: doc.id,
              ...data,
              createdAt: data.createdAt?.toDate() || new Date(),
              updatedAt: data.updatedAt?.toDate() || new Date(),
              publishedAt: data.publishedAt?.toDate() || null,
              urlPath: data.urlPath || 'blog'
            };
          }) as Post[];
          
          setPosts(simplePosts);
          
          toast({
            title: 'Firestore Index Required',
            description: 'Some filtering options require a database index. Using basic view for now.',
            variant: 'default'
          });
        } else {
          throw err; // Re-throw if it's not an index error
        }
      }
      
      setIsLoading(false);
    } catch (err: any) {
      console.error('Error fetching posts:', err);
      setError(err.message || 'Failed to load posts');
      setIsLoading(false);
      
      toast({
        title: 'Error',
        description: err.message || 'Failed to load posts',
        variant: 'destructive'
      });
    }
  };

  // Handle filter changes
  const handleFilterChange = (newFilters: Partial<typeof filters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  // Handle refresh
  const handleRefresh = () => {
    fetchPosts();
  };

  // Handle post deletion
  const handlePostDeleted = (postId: string) => {
    setPosts(prev => prev.filter(post => post.id !== postId));
    toast({
      title: 'Success',
      description: 'Post deleted successfully',
      variant: 'success'
    });
  };

  // Handle post status change
  const handlePostStatusChanged = (postId: string, newStatus: 'published' | 'draft') => {
    setPosts(prev => 
      prev.map(post => 
        post.id === postId 
          ? { ...post, status: newStatus } 
          : post
      )
    );
  };

  // Render loading state
  if (isLoading) {
    return <PostsLoading />;
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
      
      <PostsFilters 
        filters={filters} 
        onFilterChange={handleFilterChange} 
      />
      
      {posts.length === 0 ? (
        <PostsEmptyState
          title="No posts found"
          message={
            filters.search
              ? `No posts match the search "${filters.search}"`
              : filters.status !== 'all'
                ? `You don't have any ${filters.status} posts yet`
                : "You haven't created any posts yet"
          }
          showCreateButton={true}
          showRefreshButton={filters.search !== '' || filters.status !== 'all'}
          onRefresh={() => setFilters({ status: 'all', sort: 'newest', search: '' })}
        />
      ) : (
        <div className="space-y-4">
          {posts.map((post) => (
            <PostItem 
              key={post.id} 
              post={post} 
              onRefresh={handleRefresh}
              onDelete={handlePostDeleted}
              onStatusChange={handlePostStatusChanged}
            />
          ))}
          <p className="text-sm text-muted-foreground text-center">
            Showing {posts.length} {posts.length === 1 ? 'post' : 'posts'}
          </p>
        </div>
      )}
    </div>
  );
}
