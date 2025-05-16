import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getPostById } from '@/lib/api/posts';
import PostDetailView from '@/components/posts-page/PostDetailView';

interface PostPageProps {
  params: {
    postId: string;
  };
}

// Generate metadata for the page
export async function generateMetadata({ params }: PostPageProps): Promise<Metadata> {
  const post = await getPostById(params.postId);
  
  if (!post) {
    return {
      title: 'Post Not Found | Minispace',
    };
  }
  
  return {
    title: `${post.title} | Minispace`,
    description: post.excerpt || `Details for post "${post.title}"`,
  };
}

export default async function PostPage({ params }: PostPageProps) {
  const post = await getPostById(params.postId);
  
  if (!post) {
    notFound();
  }
  
  return (
    <div className=" mx-auto">
      <PostDetailView post={post} />
    </div>
  );
}