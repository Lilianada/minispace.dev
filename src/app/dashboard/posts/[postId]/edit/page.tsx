import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getPostById } from '@/lib/api/posts';
import PostForm from '@/components/posts/PostForm';

interface EditPostPageProps {
  params: {
    postId: string;
  };
}

export async function generateMetadata({ params }: EditPostPageProps): Promise<Metadata> {
  const post = await getPostById(params.postId);
  
  if (!post) {
    return {
      title: 'Post Not Found | Minispace',
    };
  }
  
  return {
    title: `Edit: ${post.title} | Minispace`,
    description: `Edit your post "${post.title}"`,
  };
}

export default async function EditPostPage({ params }: EditPostPageProps) {
  const post = await getPostById(params.postId);
  
  if (!post) {
    notFound();
  }
  
  return (
    <div className="max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Edit Post</h1>
      <PostForm 
        initialData={post} 
        isEditing={true}
      />
    </div>
  );
}