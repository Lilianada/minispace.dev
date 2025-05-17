// 'use client';

import { Metadata } from 'next';
import PostsList from '@/components/posts-page/PostsList';

export const metadata: Metadata = {
  title: 'Manage Posts | Minispace',
  description: 'Manage and organize all your blog posts',
};

export default function PostsPage() {
  return (
    <div className="container py-6">
      <PostsList />
    </div>
  );
}