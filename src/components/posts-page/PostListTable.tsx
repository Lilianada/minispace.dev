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
}

export default function PostListTable({ posts, mutate }: PostListTableProps) {
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