'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { collection, query, where, orderBy, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import { deletePost } from '@/lib/api/dashboard-posts';
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
      
      const user = auth.currentUser;
      
      if (!user) {
        setError('Authentication required. Please log in to view your posts.');
        setIsLoading(false);
        return;
      }
      
      // Use the subcollection structure - posts are under Users/{userId}/posts
      const postsRef = collection(db, 'Users', user.uid, 'posts');
      let postsQuery;
      
      // Build query based on filters
      if (filters.status !== 'all') {
        postsQuery = query(postsRef, where('status', '==', filters.status));
      } else {
        postsQuery = query(postsRef);
      }
      
      // Add category filter if specified
      if (filters.category && filters.category !== 'all') {
        postsQuery = query(postsQuery, where('category', '==', filters.category));
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
      
      try {
        // Execute the query
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
          
        // Apply search filter client-side if needed
        let filteredPosts = fetchedPosts;
        if (filters.search) {
          const searchLower = filters.search.toLowerCase();
          filteredPosts = fetchedPosts.filter(post => {
            return (
              post.title.toLowerCase().includes(searchLower) ||
              (post.excerpt && post.excerpt.toLowerCase().includes(searchLower)) ||
              (post.content && post.content.toLowerCase().includes(searchLower)) ||
              (post.tags && post.tags.some(tag => tag.toLowerCase().includes(searchLower)))
            );
          });
        }
        
        setPosts(filteredPosts);
      } catch (err: any) {
        console.error('Error executing query:', err);
        
        // Check if this is a missing index error
        if (err.message && err.message.includes('index')) {
          console.error('Missing Firestore index:', err.message);
          
          // Try to extract the index URL from the error message
          const indexUrlMatch = err.message.match(/https:\/\/console\.firebase\.google\.com\/[^\s]+/);
          const extractedUrl = indexUrlMatch ? indexUrlMatch[0] : null;
          
          if (extractedUrl) {
            setIndexUrl(extractedUrl);
          }
          
          setError('Database index required. Please check the console for a link to create the index.');
          
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
                const postUrl = `/dashboard/posts/${post.id}/edit`;
                const viewUrl = `/post/${post.slug}`;
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
                        {post.status === 'published' && (
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => window.open(viewUrl, '_blank')}
                          >
                            View
                          </Button>
                        )}
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => router.push(postUrl)}
                        >
                          Edit
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
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
                          Delete
                        </Button>
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
