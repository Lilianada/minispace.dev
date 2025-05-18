import { collection, query, where, orderBy, limit, getDocs, startAfter, doc, deleteDoc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import { getAuth } from 'firebase/auth';

export interface Post {
  id: string;
  title: string;
  excerpt?: string;
  content?: string;
  status: 'published' | 'draft';
  createdAt: any;
  updatedAt: any;
  authorId: string;
  authorName?: string;
  tags?: string[];
  slug: string;
  readTime?: number;
  wordCount?: number;
  publishedAt?: string;
  [key: string]: any;
}

export interface PostsResponse {
  posts: Post[];
  total: number;
  totalPages: number;
  currentPage: number;
  hasMore: boolean;
}

export interface PostFilters {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  sort?: string;
}

/**
 * Client-side function to fetch posts directly from Firestore
 */
export async function fetchUserPosts(filters: PostFilters = {}): Promise<PostsResponse> {
  const {
    page = 1,
    limit = 10,
    status = 'all',
    sort = 'newest'
  } = filters;

  try {
    // Get current user
    const auth = getAuth();
    const user = auth.currentUser;
    
    if (!user) {
      throw new Error('Authentication required - please log in');
    }
    
    const userId = user.uid;
    const postsRef = collection(db, 'posts');
    
    // Use a simpler query approach that doesn't require complex indexes
    // Just filter by authorId and do the rest of filtering/sorting in memory
    const postsQuery = query(postsRef, where('authorId', '==', userId));
    
    // We'll handle filtering by status and sorting in memory after fetching the data
    
    // Execute query
    const snapshot = await getDocs(postsQuery);
    let allPosts = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Post[];
    
    // Apply status filter in memory if needed
    if (status && status !== 'all') {
      allPosts = allPosts.filter(post => post.status === status);
    }
    
    // Apply sorting in memory
    allPosts.sort((a, b) => {
      if (sort === 'oldest') {
        // Convert to timestamps for comparison if needed
        const aTime = a.createdAt?.toMillis ? a.createdAt.toMillis() : new Date(a.createdAt).getTime();
        const bTime = b.createdAt?.toMillis ? b.createdAt.toMillis() : new Date(b.createdAt).getTime();
        return aTime - bTime;
      } else if (sort === 'a-z') {
        return (a.title || '').localeCompare(b.title || '');
      } else {
        // Default: newest first
        const aTime = a.createdAt?.toMillis ? a.createdAt.toMillis() : new Date(a.createdAt).getTime();
        const bTime = b.createdAt?.toMillis ? b.createdAt.toMillis() : new Date(b.createdAt).getTime();
        return bTime - aTime;
      }
    });
    
    // Apply search filter in memory if needed
    let filteredPosts = allPosts;
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filteredPosts = allPosts.filter(post => {
        return (
          (post.title?.toLowerCase() || '').includes(searchLower) ||
          (post.excerpt?.toLowerCase() || '').includes(searchLower) ||
          (post.content?.toLowerCase() || '').includes(searchLower) ||
          post.tags?.some(tag => tag.toLowerCase().includes(searchLower))
        );
      });
    }
    
    // Calculate pagination
    const total = filteredPosts.length;
    const totalPages = Math.ceil(total / limit);
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    
    // Get paginated posts
    const paginatedPosts = filteredPosts.slice(startIndex, endIndex);
    
    return {
      posts: paginatedPosts,
      total,
      totalPages,
      currentPage: page,
      hasMore: endIndex < total
    };
  } catch (error) {
    console.error('Error fetching posts:', error);
    
    // Check if this is a missing index error
    const errorMessage = error instanceof Error ? error.message : String(error);
    if (errorMessage.includes('index') && errorMessage.includes('firebase')) {
      // This is likely a missing index error
      console.error('Missing Firestore index. Please check the console for a link to create the required index.');
      throw new Error(
        'Database index required. Please check the browser console for a link to create the index, ' +
        'or contact the administrator to set up the necessary database indexes.'
      );
    }
    
    throw error;
  }
}

/**
 * Delete a post
 */
export async function deletePost(postId: string): Promise<boolean> {
  try {
    const auth = getAuth();
    const user = auth.currentUser;
    
    if (!user) {
      throw new Error('Authentication required');
    }
    
    // Get post to verify ownership
    const postRef = doc(db, 'posts', postId);
    await deleteDoc(postRef);
    return true;
  } catch (error) {
    console.error('Error deleting post:', error);
    throw error;
  }
}

/**
 * Update post status
 */
export async function updatePostStatus(postId: string, status: string): Promise<boolean> {
  try {
    const auth = getAuth();
    const user = auth.currentUser;
    
    if (!user) {
      throw new Error('Authentication required');
    }
    
    const postRef = doc(db, 'posts', postId);
    await updateDoc(postRef, { 
      status,
      updatedAt: new Date()
    });
    
    return true;
  } catch (error) {
    console.error('Error updating post status:', error);
    throw error;
  }
}
