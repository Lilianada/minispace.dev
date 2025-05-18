'use client';

import { KeyedMutator } from 'swr';
import PostTableRow from './PostTableRow';
import { PostsData } from '@/hooks/usePosts';

interface Post {
  id: string;
  title: string;
  slug?: string;
  status: 'published' | 'draft';
  updatedAt: string;
  views?: number;
  tags?: string[];
}

interface PostListTableProps {
  posts: Post[];
  mutate: KeyedMutator<PostsData>;
  error?: string;
  status?: string;
}

export default function PostListTable({ posts, mutate, error, status }: PostListTableProps) {
  // Show a helpful message if there are no posts or there was an error
  if (status === 'error' || error) {
    return (
      <div className="border rounded-md p-8 text-center">
        <h3 className="text-lg font-medium mb-2">Unable to load posts</h3>
        <p className="text-sm text-muted-foreground mb-4">
          {error || "There was a problem connecting to the database."}
        </p>
        <p className="text-sm text-muted-foreground">
          You can try refreshing the page or checking your connection.
        </p>
      </div>
    );
  }
  
  // Show empty state message when no posts
  if (!posts || posts.length === 0) {
    return (
      <div className="border rounded-md p-8 text-center">
        <h3 className="text-lg font-medium mb-2">No posts yet</h3>
        <p className="text-sm text-muted-foreground">
          Create your first post to get started.
        </p>
      </div>
    );
  }
  
  return (
    <div className="rounded-md border">
      <div className="relative w-full overflow-auto">
        <table className="w-full caption-bottom text-sm">
          <thead>
            <tr className="border-b transition-colors hover:bg-muted/50">
              <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Title</th>
              <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Status</th>
              <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Date</th>
              <th className="h-12 px-4 text-right align-middle font-medium text-muted-foreground">Views</th>
              <th className="h-12 px-4 text-right align-middle font-medium text-muted-foreground">Actions</th>
            </tr>
          </thead>
          <tbody>
            {posts.map((post) => (
              <PostTableRow 
                key={post.id} 
                post={post}
                mutate={mutate}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}