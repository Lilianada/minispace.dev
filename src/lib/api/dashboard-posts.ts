import { 
  collection, 
  query, 
  where, 
  orderBy, 
  limit, 
  getDocs, 
  startAfter, 
  doc, 
  deleteDoc, 
  updateDoc, 
  getDoc,
  Timestamp,
  DocumentData,
  QueryDocumentSnapshot,
  serverTimestamp
} from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import { getAuth } from 'firebase/auth';

export interface Author {
  username: string;
  displayName: string;
}

export interface Post {
  id: string;
  title: string;
  excerpt?: string;
  content?: string;
  status: 'published' | 'draft';
  createdAt: any;
  updatedAt: any;
  authorId: string;
  author?: Author;
  tags?: string[];
  slug: string;
  readTime?: number;
  wordCount?: number;
  publishedAt?: string;
  views?: number;
  [key: string]: any;
}

export interface PostsResponse {
  posts: Post[];
  total: number;
  totalPages: number;
  currentPage: number;
  hasMore: boolean;
  lastDoc?: QueryDocumentSnapshot<DocumentData>;
}

export interface PostFilters {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  sort?: string;
  lastDoc?: QueryDocumentSnapshot<DocumentData>;
}

/**
 * Client-side function to fetch posts with proper Firestore queries
 */
export async function fetchUserPosts(filters: PostFilters = {}): Promise<PostsResponse> {
  console.log('fetchUserPosts called with filters:', filters);
  // Use default values and ensure proper types
  const {
    status = 'all',
    sort = 'newest',
    page: rawPage,
    lastDoc: rawLastDoc
  } = filters;
  
  // Fixed values for pagination to avoid type issues
  const pageNum = typeof rawPage === 'number' ? rawPage : 1;
  const limitNum = 10; // Fixed limit of 10 items per page

  try {
    // Get current user
    const auth = getAuth();
    const user = auth.currentUser;
    
    console.log('Auth state:', { user: user ? 'authenticated' : 'not authenticated' });
    
    if (!user) {
      console.error('Authentication required but user is not logged in');
      throw new Error('Authentication required - please log in');
    }
    
    const userId = user.uid;
    console.log('User ID for posts query:', userId);
    
    // Try different collection names based on the Firebase project configuration
    // The project is named 'mini-app-00' according to the user's configuration
    let collectionName = 'posts';
    
    // Check if we're in development mode and log the collection name
    if (process.env.NODE_ENV === 'development') {
      console.log('Firebase project ID:', process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID);
      console.log('Attempting to use collection:', collectionName);
    }
    
    const postsRef = collection(db, collectionName);
    
    // Build a simpler query to start with - just get posts by author
    // This approach is less likely to encounter index issues
    console.log('Building simplified query for debugging');
    
    // Start with the most basic query possible
    let postsQuery = query(postsRef, where('authorId', '==', userId));
    
    // Add a simple sort by createdAt desc (newest first)
    // This should work with the basic composite index that's likely already set up
    postsQuery = query(postsQuery, orderBy('createdAt', 'desc'));
    
    // Add a reasonable limit
    postsQuery = query(postsQuery, limit(10));
    
    // Execute query
    console.log('Executing Firestore query with constraints:', { 
      authorId: userId,
      collection: collectionName
    });
    
    let snapshot;
    try {
      snapshot = await getDocs(postsQuery);
      console.log('Query results:', { count: snapshot.docs.length });
      
      // If we got no results, log additional information to help debug
      if (snapshot.docs.length === 0) {
        console.log('No posts found for user ID:', userId);
        console.log('This could be due to:');
        console.log('1. No posts exist for this user');
        console.log('2. The collection name is incorrect');
        console.log('3. The field names (authorId, createdAt) are incorrect');
      }
    } catch (error) {
      console.error('Error executing Firestore query:', error);
      throw error;
    }
    
    // Get the last document for pagination
    const lastDoc = snapshot.docs.length > 0 ? snapshot.docs[snapshot.docs.length - 1] : undefined;
    
    // Transform the data
    let posts = snapshot.docs.map((doc: QueryDocumentSnapshot<DocumentData>) => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        createdAt: data.createdAt?.toDate?.() || new Date(),
        updatedAt: data.updatedAt?.toDate?.() || new Date(),
        publishedAt: data.publishedAt?.toDate?.() || null
      };
    }) as Post[];
    
    // If we have a search query, filter the results in memory
    // This is a client-side approach since Firestore doesn't support full-text search
    if (filters.search && filters.search.trim() !== '') {
      const searchLower = filters.search.toLowerCase();
      posts = posts.filter(post => {
        return (
          (post.title?.toLowerCase() || '').includes(searchLower) ||
          (post.excerpt?.toLowerCase() || '').includes(searchLower) ||
          (post.content?.toLowerCase() || '').includes(searchLower) ||
          post.tags?.some(tag => tag.toLowerCase().includes(searchLower))
        );
      });
    }
    
    // Get total count (this is an approximation since we're not fetching all posts)
    // For a more accurate count, you would need a separate counter in Firestore
    let totalQuery = query(postsRef, where('authorId', '==', userId));
    
    // Add status filter if not 'all'
    if (status && status !== 'all') {
      totalQuery = query(totalQuery, where('status', '==', status));
    }
    
    // For simplicity, we'll use the fetched posts length as the total
    // In a production app, you might want to implement a more sophisticated counting mechanism
    const total = posts.length;
    const totalPages = Math.max(1, Math.ceil(total / limitNum));
    
    const response = {
      posts,
      total,
      totalPages,
      currentPage: pageNum,
      hasMore: posts.length === limitNum,
      lastDoc
    };
    
    console.log('Returning posts response:', { 
      postsCount: posts.length,
      total,
      totalPages,
      currentPage: pageNum,
      hasMore: posts.length === limitNum
    });
    
    return response;
  } catch (error) {
    console.error('Error fetching posts:', error);
    
    // Check if this is a missing index error
    const errorMessage = error instanceof Error ? error.message : String(error);
    if (errorMessage.includes('index') && errorMessage.includes('firebase')) {
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
 * Get a single post by ID
 */
export async function getPostById(postId: string): Promise<Post | null> {
  try {
    const auth = getAuth();
    const user = auth.currentUser;
    
    if (!user) {
      throw new Error('Authentication required');
    }
    
    const postRef = doc(db, 'posts', postId);
    const postSnap = await getDoc(postRef);
    
    if (!postSnap.exists()) {
      return null;
    }
    
    const postData = postSnap.data();
    
    // Verify the user owns this post
    if (postData.authorId !== user.uid) {
      throw new Error('You do not have permission to access this post');
    }
    
    return {
      id: postSnap.id,
      ...postData,
      createdAt: postData.createdAt?.toDate?.() || new Date(),
      updatedAt: postData.updatedAt?.toDate?.() || new Date(),
      publishedAt: postData.publishedAt?.toDate?.() || null
    } as Post;
  } catch (error) {
    console.error('Error getting post:', error);
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
    const postSnap = await getDoc(postRef);
    
    if (!postSnap.exists()) {
      throw new Error('Post not found');
    }
    
    const postData = postSnap.data();
    
    // Verify the user owns this post
    if (postData.authorId !== user.uid) {
      throw new Error('You do not have permission to delete this post');
    }
    
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
    const postSnap = await getDoc(postRef);
    
    if (!postSnap.exists()) {
      throw new Error('Post not found');
    }
    
    const postData = postSnap.data();
    
    // Verify the user owns this post
    if (postData.authorId !== user.uid) {
      throw new Error('You do not have permission to update this post');
    }
    
    // Update fields based on status
    const updateData: any = { 
      status,
      updatedAt: serverTimestamp()
    };
    
    // If publishing for the first time, set publishedAt
    if (status === 'published' && !postData.publishedAt) {
      updateData.publishedAt = serverTimestamp();
    }
    
    await updateDoc(postRef, updateData);
    
    return true;
  } catch (error) {
    console.error('Error updating post status:', error);
    throw error;
  }
}
