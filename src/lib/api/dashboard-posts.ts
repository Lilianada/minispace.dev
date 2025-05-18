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
  serverTimestamp,
  collectionGroup
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
  lastDoc?: QueryDocumentSnapshot<DocumentData> | null;
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
    search = '',
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
    
    // Use subcollection under Users collection
    const postsRef = collection(db, 'Users', userId, 'posts');
    
    // Build query based on filters
    let postsQuery;
    
    // Apply status filter if not 'all'
    if (status !== 'all') {
      postsQuery = query(postsRef, where('status', '==', status));
    } else {
      postsQuery = query(postsRef);
    }
    
    // Apply sorting
    if (sort === 'newest') {
      postsQuery = query(postsQuery, orderBy('createdAt', 'desc'));
    } else if (sort === 'oldest') {
      postsQuery = query(postsQuery, orderBy('createdAt', 'asc'));
    } else if (sort === 'title') {
      postsQuery = query(postsQuery, orderBy('title', 'asc'));
    } else if (sort === 'updated') {
      postsQuery = query(postsQuery, orderBy('updatedAt', 'desc'));
    }
    
    // Apply pagination
    if (rawLastDoc) {
      postsQuery = query(postsQuery, startAfter(rawLastDoc), limit(limitNum));
    } else {
      postsQuery = query(postsQuery, limit(limitNum));
    }
    
    // Execute query
    console.log('Executing Firestore query for posts subcollection');
    
    let snapshot;
    try {
      snapshot = await getDocs(postsQuery);
      console.log('Query results:', { count: snapshot.docs.length });
    } catch (error) {
      console.error('Error executing Firestore query:', error);
      throw error;
    }
    
    // Process the results
    const lastDoc = snapshot.docs.length > 0 ? snapshot.docs[snapshot.docs.length - 1] : null;
    
    const posts = snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        createdAt: data.createdAt?.toDate?.() || new Date(),
        updatedAt: data.updatedAt?.toDate?.() || new Date(),
        publishedAt: data.publishedAt?.toDate?.() || null
      } as Post;
    });
    
    // Apply search filter if provided (client-side filtering)
    let filteredPosts = posts;
    if (search) {
      const searchLower = search.toLowerCase();
      filteredPosts = posts.filter(post => 
        post.title.toLowerCase().includes(searchLower) ||
        (post.excerpt && post.excerpt.toLowerCase().includes(searchLower)) ||
        (post.content && post.content.toLowerCase().includes(searchLower))
      );
    }
    
    const total = filteredPosts.length;
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
    
    const userId = user.uid;
    const postRef = doc(db, 'Users', userId, 'posts', postId);
    const postSnap = await getDoc(postRef);
    
    if (!postSnap.exists()) {
      return null;
    }
    
    const postData = postSnap.data();
    
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
    
    const userId = user.uid;
    const postRef = doc(db, 'Users', userId, 'posts', postId);
    const postSnap = await getDoc(postRef);
    
    if (!postSnap.exists()) {
      throw new Error('Post not found');
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
    
    const userId = user.uid;
    const postRef = doc(db, 'Users', userId, 'posts', postId);
    const postSnap = await getDoc(postRef);
    
    if (!postSnap.exists()) {
      throw new Error('Post not found');
    }
    
    const postData = postSnap.data();
    
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
