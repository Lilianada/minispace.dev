import { Metadata } from 'next';
import PostsPage from './page.client';

export const metadata: Metadata = {
  title: 'Blog Posts | Minispace',
  description: 'Manage and organize all your blog posts',
};

export default function Page() {
  return <PostsPage />;
}
