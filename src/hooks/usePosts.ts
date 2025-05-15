import { useState, useEffect } from 'react';
import { Post, getPosts } from '@/lib/api/posts';

interface UsePostsOptions {
  page?: number;
  status?: string;
  sort?: string;
  search?: string;
  limit?: number;
}

interface UsePostsResult {
  posts: Post[];
  totalPosts: number;
  totalPages: number;
  isLoading: boolean;
  error: string | null;
}

/**
 * Custom hook for fetching and filtering posts with pagination
 */
export default function usePosts({
  page = 1,
  status = 'all',
  sort = 'newest',
  search = '',
  limit = 10,
}: UsePostsOptions): UsePostsResult {
  const [posts, setPosts] = useState<Post[]>([]);
  const [totalPosts, setTotalPosts] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchPosts() {
      setIsLoading(true);
      setError(null);

      try {
        // In a real app, you would pass these parameters to your API
        const allPosts = await getPosts();
        let filteredPosts = [...allPosts];

        // Apply status filter
        if (status && status !== 'all') {
          filteredPosts = filteredPosts.filter((post) => post.status === status);
        }

        // Apply search filter
        if (search) {
          const searchLower = search.toLowerCase();
          filteredPosts = filteredPosts.filter(
            (post) =>
              post.title.toLowerCase().includes(searchLower) ||
              (post.excerpt && post.excerpt.toLowerCase().includes(searchLower)) ||
              (post.tags && post.tags.some(tag => tag.toLowerCase().includes(searchLower)))
          );
        }

        // Apply sorting
        filteredPosts = sortPosts(filteredPosts, sort);

        // Calculate pagination
        const total = filteredPosts.length;
        const pages = Math.max(1, Math.ceil(total / limit));

        // Apply pagination
        const startIndex = (page - 1) * limit;
        const paginatedPosts = filteredPosts.slice(startIndex, startIndex + limit);

        setPosts(paginatedPosts);
        setTotalPosts(total);
        setTotalPages(pages);
      } catch (err) {
        console.error('Error fetching posts:', err);
        setError('Failed to fetch posts. Please try again.');
      } finally {
        setIsLoading(false);
      }
    }

    fetchPosts();
  }, [page, status, sort, search, limit]);

  return { posts, totalPosts, totalPages, isLoading, error };
}

/**
 * Helper function to sort posts based on sort option
 */
function sortPosts(posts: Post[], sortOption: string): Post[] {
  return [...posts].sort((a, b) => {
    switch (sortOption) {
      case 'newest':
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      case 'oldest':
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      case 'updated':
        return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
      case 'title-asc':
        return a.title.localeCompare(b.title);
      case 'title-desc':
        return b.title.localeCompare(a.title);
      case 'most-viewed':
        return (b.views || 0) - (a.views || 0);
      default:
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }
  });
}