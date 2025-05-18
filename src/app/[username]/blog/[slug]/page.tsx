import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import BlogPostClient from './page.client';

interface BlogPostPageProps {
  params: {
    username: string;
    slug: string;
  };
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { username, slug } = params;
  
  // In a real implementation, you would fetch the post data here
  // and use it to generate dynamic metadata
  
  return {
    title: `${slug} | ${username}'s Blog`,
    description: `Read ${username}'s blog post about ${slug}`,
  };
}

export default function BlogPostPage({ params }: BlogPostPageProps) {
  const { username, slug } = params;
  
  if (!username || !slug) {
    return notFound();
  }
  
  return <BlogPostClient username={username} slug={slug} />;
}
