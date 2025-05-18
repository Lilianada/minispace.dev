import { Metadata } from 'next';
import EditBlogPostPage from './page.client';

export const metadata: Metadata = {
  title: 'Edit Blog Post | Minispace',
  description: 'Edit your existing blog post',
};

export default function Page({ params }: { params: { id: string } }) {
  return <EditBlogPostPage postId={params.id} />;
}
