import { Metadata } from 'next';
import PostForm from '@/components/posts/PostForm';

export const metadata: Metadata = {
  title: 'Create New Post | Minispace',
  description: 'Create a new blog post',
};

export default function NewPostPage() {
  return (
    <div className="max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Create New Post</h1>
      <PostForm />
    </div>
  );
}