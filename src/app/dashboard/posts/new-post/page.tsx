/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import { useRouter } from 'next/navigation';
import PostForm from '@/components/posts-page/PostForm';

export default function NewPostPage() {
  const router = useRouter();

  return (
    <div className="container max-w-5xl py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Create New Post</h1>
      </div>
      
      <PostForm 
        isEditing={false} 
        initialData={{
          title: '',
          content: '',
          slug: '',
          excerpt: '',
          tags: [],
        }}
      />
    </div>
  );
}