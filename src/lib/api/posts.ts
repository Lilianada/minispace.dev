// This module provides API functions for managing posts

// Type definitions
export interface PostData {
  title: string;
  content: string;
  slug?: string;
  excerpt?: string;
  tags?: string[];
}

export interface Post {
  id: string;
  title: string;
  content: string;
  slug: string;
  excerpt?: string;
  tags?: string[];
  status: 'published' | 'draft';
  createdAt: string;
  updatedAt: string;
  views: number;
  comments?: number; // New field
  likes?: number;     // New field
  shares?: number;    // New field
}

// Mock data for development
const MOCK_POSTS: Post[] = [
  {
    id: '1',
    title: 'Getting Started with Minispace',
    content: '# Getting Started\n\nThis is a sample post about how to use Minispace blogging platform.',
    slug: 'getting-started',
    excerpt: 'A comprehensive guide to get started with the Minispace blogging platform',
    tags: ['guide', 'introduction'],
    status: 'published',
    createdAt: '2025-05-01T12:00:00Z',
    updatedAt: '2025-05-01T12:00:00Z',
    views: 243,
    comments: 12,
    likes: 56,
    shares: 8
  },
  {
    id: '2',
    title: 'Best Practices for Blog SEO',
    content: '# SEO Best Practices\n\nHere are some tips to improve your blog\'s search engine ranking.',
    slug: 'blog-seo-best-practices',
    excerpt: 'Learn how to optimize your blog posts for search engines',
    tags: ['seo', 'marketing'],
    status: 'published',
    createdAt: '2025-04-28T10:30:00Z',
    updatedAt: '2025-04-28T16:45:00Z',
    views: 189,
    comments: 8,
    likes: 34,
    shares: 5
  },
  {
    id: '3',
    title: 'How to Grow Your Blog Audience',
    content: '# Growing Your Audience\n\nStrategies to expand your readership and build a community.',
    slug: 'grow-blog-audience',
    excerpt: 'Effective strategies to grow your blog audience',
    tags: ['growth', 'audience', 'marketing'],
    status: 'draft',
    createdAt: '2025-04-15T08:20:00Z',
    updatedAt: '2025-04-15T08:20:00Z',
    views: 0,
    comments: 0,
    likes: 0,
    shares: 0
  },
];

// In a real app, this would be replaced by actual API calls to your backend

/**
 * Get all posts
 * @returns Promise resolving to an array of posts
 */
export async function getPosts(): Promise<Post[]> {
  // In a real app, fetch from your API endpoint
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([...MOCK_POSTS]);
    }, 500); // Simulate network delay
  });
}

/**
 * Get a post by ID
 * @param id The post ID
 * @returns Promise resolving to the post or null if not found
 */
export async function getPostById(id: string): Promise<Post | null> {
  // In a real app, fetch from your API endpoint
  return new Promise((resolve) => {
    setTimeout(() => {
      const post = MOCK_POSTS.find(p => p.id === id) || null;
      resolve(post);
    }, 300);
  });
}

/**
 * Create a new post
 * @param data The post data
 * @returns Promise resolving to the created post
 */
export async function createPost(data: PostData): Promise<Post> {
  // In a real app, send a POST request to your API endpoint
  return new Promise((resolve) => {
    setTimeout(() => {
      const newPost: Post = {
        ...data,
        id: `${Date.now()}`, // Generate a temporary ID
        slug: data.slug || `post-${Date.now()}`, // Use provided slug or generate one
        status: 'published', // Default to published
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        views: 0,
        comments: 0,
        likes: 0,
        shares: 0
      };
      
      // In a real app, you'd save to database here
      MOCK_POSTS.push(newPost);
      resolve(newPost);
    }, 800);
  });
}

/**
 * Update an existing post
 * @param id The post ID
 * @param data The updated post data
 * @returns Promise resolving to the updated post
 */
export async function updatePost(id: string, data: Partial<PostData>): Promise<Post> {
  // In a real app, send a PUT/PATCH request to your API endpoint
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const postIndex = MOCK_POSTS.findIndex(p => p.id === id);
      
      if (postIndex === -1) {
        reject(new Error('Post not found'));
        return;
      }
      
      const updatedPost: Post = {
        ...MOCK_POSTS[postIndex],
        ...data,
        updatedAt: new Date().toISOString()
      };
      
      // In a real app, you'd update the database here
      MOCK_POSTS[postIndex] = updatedPost;
      resolve(updatedPost);
    }, 800);
  });
}

/**
 * Delete a post by ID
 * @param id The post ID
 * @returns Promise that resolves when the post is deleted
 */
export async function deletePost(id: string): Promise<void> {
  // In a real app, send a DELETE request to your API endpoint
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const postIndex = MOCK_POSTS.findIndex(p => p.id === id);
      
      if (postIndex === -1) {
        reject(new Error('Post not found'));
        return;
      }
      
      // In a real app, you'd delete from database
      MOCK_POSTS.splice(postIndex, 1);
      resolve();
    }, 500);
  });
}

/**
 * Toggle the publish status of a post
 * @param id The post ID
 * @returns Promise resolving to the updated post
 */
export async function togglePostStatus(id: string): Promise<Post> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const postIndex = MOCK_POSTS.findIndex(p => p.id === id);
      
      if (postIndex === -1) {
        reject(new Error('Post not found'));
        return;
      }
      
      const post = MOCK_POSTS[postIndex];
      const newStatus = post.status === 'published' ? 'draft' : 'published';
      
      const updatedPost: Post = {
        ...post,
        status: newStatus,
        updatedAt: new Date().toISOString()
      };
      
      // In a real app, you'd update the database here
      MOCK_POSTS[postIndex] = updatedPost;
      resolve(updatedPost);
    }, 500);
  });
}