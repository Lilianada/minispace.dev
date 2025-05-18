'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/landing-page/navbar';
import { Input } from '@/components/ui/input';
import { mockPosts } from '../../../utils/mock-data';   

interface Author {
  username: string;
  displayName: string;
}

interface Post {
  id: string;
  title: string;
  excerpt?: string;
  content?: string;
  authorId: string;
  author?: Author;
  tags?: string[];
  wordCount?: number;
  readTime?: number;
  createdAt: string;
  updatedAt: string;
  status: 'published' | 'draft';
}

export default function DiscoverPage() {
  const router = useRouter();
  const [posts, setPosts] = useState<Post[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const postsPerPage = 25;
  const [useMockData, setUseMockData] = useState(true); // Flag to use mock data
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'a-z'>('newest');

  // Fetch discover posts
  const fetchPosts = async () => {
    setLoading(true);
    
    // Use mock data for visualization
    if (useMockData) {
      setTimeout(() => {
        // Get all posts
        setPosts(mockPosts);
        setError(null);
        setLoading(false);
      }, 500); // Simulate network delay
      
      return;
    }
    
    // Real data fetching logic
    try {
      // Build query parameters
      const queryParams = new URLSearchParams();
      queryParams.set('limit', postsPerPage.toString());
      
      // Fetch posts from the discover collection
      const response = await fetch(`/api/discover?${queryParams.toString()}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch discover posts');
      }
      
      const data = await response.json();
      
      setPosts(data.posts || []);
      setError(null); // Clear any previous errors
    } catch (err) {
      console.error('Error fetching discover posts:', err);
      // Don't set an error message, just clear the posts
      setPosts([]);
    } finally {
      setLoading(false);
    }
  };

  // Filter and sort posts
  useEffect(() => {
    if (posts.length > 0) {
      let filtered = [...posts];
      
      // Apply search filter
      if (searchQuery) {
        const searchLower = searchQuery.toLowerCase();
        filtered = filtered.filter(post => 
          post.title.toLowerCase().includes(searchLower) || 
          (post.excerpt && post.excerpt.toLowerCase().includes(searchLower)) ||
          (post.author?.displayName && post.author.displayName.toLowerCase().includes(searchLower)) ||
          (post.tags && post.tags.some(tag => tag.toLowerCase().includes(searchLower)))
        );
      }
      
      // Apply sorting
      if (sortBy === 'newest') {
        filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      } else if (sortBy === 'oldest') {
        filtered.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
      } else if (sortBy === 'a-z') {
        filtered.sort((a, b) => a.title.localeCompare(b.title));
      }
      
      // Update filtered posts
      setFilteredPosts(filtered);
      
      // Calculate pagination
      const totalFilteredPages = Math.max(1, Math.ceil(filtered.length / postsPerPage));
      setTotalPages(totalFilteredPages);
      
      // Adjust current page if needed
      if (currentPage > totalFilteredPages) {
        setCurrentPage(1);
      }
    }
  }, [posts, searchQuery, sortBy, currentPage, postsPerPage]);
  
  // Initial fetch on component mount
  useEffect(() => {
    fetchPosts();
  }, []);

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1); // Reset to first page when search changes
  };
  
  // Handle sort change
  const handleSortChange = (value: 'newest' | 'oldest' | 'a-z') => {
    setSortBy(value);
    setCurrentPage(1); // Reset to first page when sort changes
  };

  // Handle pagination
  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  return (
    <main className="flex min-h-screen flex-col">
      <Navbar activePage="discover" />
      
      <div className="container max-w-4xl mx-auto px-4 py-12">
        {/* Minimalist header and search */}
        <div className="space-y-8 mb-16">
          <header>
            <h1 className="text-3xl font-semibold tracking-tight">Discover</h1>
            <p className="text-muted-foreground">
              Explore a curated selection of posts from Minispace users.
            </p>
          </header>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Input
                type="text"
                placeholder="Search by title, author, or tag..."
                value={searchQuery}
                onChange={handleSearchChange}
                className="w-full bg-background/50 border-border rounded-md focus-visible:ring-0 focus-visible:border-primary"
              />
            </div>
            <div className="flex gap-2">
              <select 
                value={sortBy}
                onChange={(e) => handleSortChange(e.target.value as 'newest' | 'oldest' | 'a-z')}
                className="px-3 py-2 bg-background border border-border rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-primary"
              >
                <option value="newest">Newest first</option>
                <option value="oldest">Oldest first</option>
                <option value="a-z">A to Z</option>
              </select>
            </div>
          </div>
        </div>
        
        {/* Posts list */}
        <div>
          {loading ? (
            <div className="py-8 text-muted-foreground">
              <p>Loading posts...</p>
            </div>
          ) : error ? (
            <div className="py-8 text-destructive">
              <p>{error}</p>
            </div>
          ) : posts.length === 0 ? (
            <div className="py-8 text-muted-foreground">
              <div>
                <p className="text-lg">No posts available yet</p>
                <p className="text-sm mt-2">Be the first to create content on Minispace!</p>
              </div>
            </div>
          ) : filteredPosts.length === 0 ? (
            <div className="py-8 text-muted-foreground">
              <p>No posts found matching "{searchQuery}". Try a different search term.</p>
            </div>
          ) : (
            <>
              <div className="space-y-12">
                {/* Get paginated posts */}
                {filteredPosts
                  .slice((currentPage - 1) * postsPerPage, currentPage * postsPerPage)
                  .map((post) => (
                  <div key={post.id} className="group">
                    <div className="cursor-pointer" onClick={() => router.push(`/blog/${post.id}`)}>
                      <div className="flex justify-between items-start">
                        <div>
                          <h2 className="text-xl font-medium group-hover:text-primary transition-colors">
                            {post.title}
                          </h2>
                          <div className="flex items-baseline mt-1">
                            <span className="text-sm">by {post.author?.displayName || 'Unknown'} </span>
                            <span className="text-xs font-serif italic ml-1 text-muted-foreground">({post.author?.username || 'unknown'}.minispace.dev)</span>
                          </div>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {new Date(post.createdAt).toLocaleDateString('en-US', { 
                            year: 'numeric', 
                            month: 'long', 
                            day: 'numeric' 
                          })}
                        </div>
                      </div>
                      
                      {post.excerpt && (
                        <p className="mt-2 text-muted-foreground">
                          {post.excerpt}
                        </p>
                      )}
                      
                      <div className="flex justify-between items-center mt-3">
                        <div className="flex flex-wrap gap-x-2 gap-y-1">
                          {post.tags?.map((tag, index) => (
                            <span key={index} className="text-xs text-muted-foreground">
                              #{tag}
                            </span>
                          ))}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {post.wordCount} words — {post.readTime} mins read
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-between items-center mt-16 text-sm">
                  <button 
                    className="text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50 disabled:pointer-events-none"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                  >
                    ← Previous
                  </button>
                  
                  <div className="text-muted-foreground">
                    Page {currentPage} of {totalPages}
                  </div>
                  
                  <button 
                    className="text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50 disabled:pointer-events-none"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                  >
                    Next →
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </main>
  );
}