import { Metadata } from 'next';
import NewBlogPostPage from './page.client';

export const metadata: Metadata = {
  title: 'Create New Blog Post | Minispace',
  description: 'Create a new blog post for your Minispace blog',
};

export default function Page() {
  return <NewBlogPostPage />;
}
