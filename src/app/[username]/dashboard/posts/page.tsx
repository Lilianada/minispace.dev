import { Metadata } from 'next';
import PostsPageClient from './page.client';

export const metadata: Metadata = {
  title: 'Manage Posts | Minispace',
  description: 'Manage and organize all your blog posts',
};

export default function PostsPage() {
  return <PostsPageClient />;
}
