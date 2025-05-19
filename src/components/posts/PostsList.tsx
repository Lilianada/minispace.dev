'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { collection, query, where, orderBy, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import { deletePost, updatePostStatus } from '@/lib/api/dashboard-posts';
import { getAuth } from 'firebase/auth';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { getDashboardPath } from '@/lib/route-utils';
import PostsFilters from './PostsFilters';
import PostsEmptyState from './PostsEmptyState';
import PostsLoading from './PostsLoading';
import { DropdownMenu, DropdownMenuItem, DropdownMenuContent, DropdownMenuTrigger, DropdownMenuSeparator } from '../ui/dropdown-menu';
import { MoreVertical, Eye, Edit, Globe, FileText, Trash } from 'lucide-react';

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
  category?: string; // Added category field
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
    search: '',
    category: 'all'
  });

  // Helper function to get new post URL
  const getNewPostUrl = () => {
    return getDashboardPath('posts/new-post');
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
      setIndexUrl(null); // Reset index URL
      
      // Check if we're online first
      if (!navigator.onLine) {
        // Try to use cached posts if available
        const cachedPosts = localStorage.getItem('cachedPosts');
        if (cachedPosts) {
          try {
            const parsedPosts = JSON.parse(cachedPosts) as Post[];
            // Apply filters to cached posts
            const filteredPosts = applyClientSideFilters(parsedPosts, filters);
            setPosts(filteredPosts);
            setIsLoading(false);
            toast({
              title: 'Offline Mode',
              description: 'You are currently offline. Showing cached posts.',
              variant: 'default'
            });
            return;
          } catch (e) {
            console.error('Error parsing cached posts:', e);
          }
        }
        
        setError('You are currently offline. Please check your internet connection.');
        setIsLoading(false);
        return;
      }
      
      const user = auth.currentUser;
      
      if (!user) {
        setError('Authentication required. Please log in to view your posts.');
        setIsLoading(false);
        return;
      }
      
      // Use the subcollection structure - posts are under Users/{userId}/posts
      const postsRef = collection(db, 'Users', user.uid, 'posts');
      
      // IMPORTANT: Always use a simple query that doesn't require an index
      // We'll apply all filters client-side to avoid index errors completely
      const postsQuery = query(postsRef);
      
      // Set a timeout for the fetch operation
      const timeoutPromise = new Promise<Post[]>((_, reject) => 
        setTimeout(() => reject(new Error('Firestore fetch timeout')), 10000)
      );
      
      // Function to execute the query with proper error handling
      const executeQuery = async (): Promise<Post[]> => {
        try {
          // Execute the query - this is a simple query that will never require an index
          const snapshot = await getDocs(postsQuery);
          
          // Transform the data
          const fetchedPosts = snapshot.docs.map((doc) => {
            const data = doc.data();
            return {
              id: doc.id,
              ...data,
              createdAt: data.createdAt?.toDate() || new Date(),
              updatedAt: data.updatedAt?.toDate() || new Date(),
              publishedAt: data.publishedAt?.toDate() || null,
              urlPath: data.urlPath || 'blog',
              category: data.category || 'blog' // Default to 'blog' if no category
            };
          }) as Post[];
          
          // Cache the posts for offline use
          localStorage.setItem('cachedPosts', JSON.stringify(fetchedPosts));
          
          return fetchedPosts;
        } catch (err: any) {
          console.error('Error executing query:', err);
          
          // Handle network-related errors
          if (err.code === 'failed-precondition' || err.code === 'resource-exhausted' || 
              err.code === 'unavailable' || err.code === 'deadline-exceeded' ||
              err.message.includes('network') || err.message.includes('timeout')) {
            console.error('Network or availability error:', err);
            
            // Try to use cached posts if available
            const cachedPosts = localStorage.getItem('cachedPosts');
            if (cachedPosts) {
              try {
                const parsedPosts = JSON.parse(cachedPosts) as Post[];
                toast({
                  title: 'Network Issue',
                  description: 'Using cached posts due to network issues.',
                  variant: 'default'
                });
                return parsedPosts;
              } catch (e) {
                console.error('Error parsing cached posts:', e);
              }
            }
          }
          
          // Re-throw the error to be caught by the outer try-catch
          throw err;
        }
      };
      
      // Execute the query with a timeout
      let fetchedPosts: Post[] = [];
      try {
        fetchedPosts = await Promise.race([executeQuery(), timeoutPromise]);
      } catch (err) {
        console.error('Query execution failed or timed out:', err);
        
        // Try to use cached posts if available
        const cachedPosts = localStorage.getItem('cachedPosts');
        if (cachedPosts) {
          try {
            fetchedPosts = JSON.parse(cachedPosts) as Post[];
            toast({
              title: 'Using Cached Data',
              description: 'Showing your previously loaded posts.',
              variant: 'default'
            });
          } catch (e) {
            console.error('Error parsing cached posts:', e);
            setError('Could not load posts. Please try again later.');
            setIsLoading(false);
            return;
          }
        } else {
          setError('Could not load posts. Please try again later.');
          setIsLoading(false);
          return;
        }
      }
      
      // Apply all filters client-side
      const filteredPosts = applyClientSideFilters(fetchedPosts, filters);
      setPosts(filteredPosts);
      setIsLoading(false);
      
    } catch (err: any) {
      console.error('Error fetching posts:', err);
      
      // Try to use cached posts as a last resort
      const cachedPosts = localStorage.getItem('cachedPosts');
      if (cachedPosts) {
        try {
          const parsedPosts = JSON.parse(cachedPosts) as Post[];
          const filteredPosts = applyClientSideFilters(parsedPosts, filters);
          setPosts(filteredPosts);
          toast({
            title: 'Using Saved Posts',
            description: 'Showing your previously loaded posts.',
            variant: 'default'
          });
        } catch (e) {
          console.error('Error parsing cached posts:', e);
          setError('Could not load posts. Please try again later.');
        }
      } else {
        setError('Could not load posts. Please try again later.');
      }
      
      setIsLoading(false);
    }
  };
  
  // Helper function to apply all filters client-side
  const applyClientSideFilters = (posts: Post[], filters: any): Post[] => {
    let filteredPosts = [...posts];
    
    // Apply status filter
    if (filters.status !== 'all') {
      filteredPosts = filteredPosts.filter(post => post.status === filters.status);
    }
    
    // Apply category filter
    if (filters.category && filters.category !== 'all') {
      filteredPosts = filteredPosts.filter(post => post.category === filters.category);
    }
    
    // Apply search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filteredPosts = filteredPosts.filter(post => {
        return (
          post.title.toLowerCase().includes(searchLower) ||
          (post.excerpt && post.excerpt.toLowerCase().includes(searchLower)) ||
          (post.content && post.content.toLowerCase().includes(searchLower)) ||
          (post.tags && post.tags.some(tag => tag.toLowerCase().includes(searchLower)))
        );
      });
    }
    
    // Apply sort
    switch (filters.sort) {
      case 'oldest':
        filteredPosts.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
        break;
      case 'a-z':
        filteredPosts.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case 'z-a':
        filteredPosts.sort((a, b) => b.title.localeCompare(a.title));
        break;
      case 'most-viewed':
        filteredPosts.sort((a, b) => (b.views || 0) - (a.views || 0));
        break;
      default: // newest
        filteredPosts.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    }
    
    return filteredPosts;
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
  const handlePostStatusChanged = async (postId: string, newStatus: 'published' | 'draft') => {
    try {
      // Show loading toast
      toast({
        title: newStatus === 'published' ? 'Publishing...' : 'Unpublishing...',
        description: 'Please wait while we update your post.',
      });
      
      // Call the API to update the post status
      await updatePostStatus(postId, newStatus);
      
      // Update local state
      setPosts(prev => 
        prev.map(post => 
          post.id === postId 
            ? { 
                ...post, 
                status: newStatus,
                publishedAt: newStatus === 'published' && !post.publishedAt ? new Date() : post.publishedAt
              } 
            : post
        )
      );
      
      // Show success toast
      toast({
        title: 'Success',
        description: newStatus === 'published' ? 'Post published successfully.' : 'Post unpublished successfully.',
        variant: 'success',
      });
    } catch (error) {
      console.error('Error updating post status:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to update post status',
        variant: 'destructive',
      });
    }
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
          showRefreshButton={filters.search !== '' || filters.status !== 'all' || filters.category !== 'all'}
          onRefresh={() => setFilters({ status: 'all', sort: 'newest', search: '', category: 'all' })}
        />
      ) : (
        <div className="rounded-md border">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-muted/50 text-muted-foreground">
                <th className="py-3 px-4 text-left font-medium">Title</th>
                <th className="py-3 px-4 text-left font-medium hidden md:table-cell">Category</th>
                <th className="py-3 px-4 text-left font-medium hidden sm:table-cell">Date</th>
                <th className="py-3 px-4 text-left font-medium hidden lg:table-cell">Status</th>
                <th className="py-3 px-4 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {posts.map((post) => {
                const postUrl = getDashboardPath(`posts/${post.id}/edit`);
                // Extract username for view URL
                const username = typeof window !== 'undefined' ? localStorage.getItem('username') : '';
                const viewUrl = `/${username}/post/${post.slug}`;
                const statusColor = post.status === 'published' ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800';
                const formattedDate = new Date(post.createdAt).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric'
                });
                
                return (
                  <tr key={post.id} className="border-b hover:bg-muted/50 transition-colors">
                    <td className="py-3 px-4">
                      <div className="font-medium">
                        <a href={postUrl} className="hover:underline">{post.title}</a>
                      </div>
                      {post.excerpt && (
                        <div className="text-muted-foreground text-xs line-clamp-1">
                          {post.excerpt}
                        </div>
                      )}
                    </td>
                    <td className="py-3 px-4 hidden md:table-cell">
                      <span className="inline-flex items-center rounded-full px-2 py-1 text-xs bg-slate-100 text-slate-800">
                        {post.category || 'blog'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-muted-foreground hidden sm:table-cell">
                      {formattedDate}
                    </td>
                    <td className="py-3 px-4 hidden lg:table-cell">
                      <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs ${statusColor}`}>
                        {post.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            {post.status === 'published' && (
                              <DropdownMenuItem onClick={() => window.open(viewUrl, '_blank')}>
                                <Eye className="h-4 w-4 mr-2" />
                                View
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuItem onClick={() => router.push(postUrl)}>
                              <Edit className="h-4 w-4 mr-2" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => {
                              const newStatus = post.status === 'published' ? 'draft' : 'published';
                              handlePostStatusChanged(post.id, newStatus);
                            }}>
                              {post.status === 'published' ? (
                                <>
                                  <FileText className="h-4 w-4 mr-2" />
                                  Unpublish
                                </>
                              ) : (
                                <>
                                  <Globe className="h-4 w-4 mr-2" />
                                  Publish
                                </>
                              )}
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem 
                              className="text-red-600"
                              onClick={() => {
                                if (confirm(`Are you sure you want to delete "${post.title}"?`)) {
                                  deletePost(post.id)
                                    .then(() => handlePostDeleted(post.id))
                                    .catch((err: Error) => {
                                      toast({
                                        title: 'Error',
                                        description: err.message || 'Failed to delete post',
                                        variant: 'destructive'
                                      });
                                    });
                                }
                              }}
                            >
                              <Trash className="h-4 w-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          <div className="py-3 px-4 text-sm text-muted-foreground text-center border-t">
            Showing {posts.length} {posts.length === 1 ? 'post' : 'posts'}
          </div>
        </div>
      )}
    </div>
  );
}
