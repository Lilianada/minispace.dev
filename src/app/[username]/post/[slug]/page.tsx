import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import PostClient from './page.client';

interface PostPageProps {
  params: {
    username: string;
    slug: string;
  };
}

export async function generateMetadata({ params }: PostPageProps): Promise<Metadata> {
  // Await the params object to fix the Next.js warning
  const paramsObj = await Promise.resolve(params);
  const username = paramsObj.username;
  const slug = paramsObj.slug;
  
  // In a real implementation, you would fetch the post data here
  // and use it to generate dynamic metadata
  
  return {
    title: `${slug} | ${username}'s Blog`,
    description: `Read ${username}'s blog post about ${slug}`,
  };
}

export default async function PostPage({ params }: PostPageProps) {
  // Await the params object to fix the Next.js warning
  const paramsObj = await Promise.resolve(params);
  const username = paramsObj.username;
  const slug = paramsObj.slug;
  
  if (!username || !slug) {
    return notFound();
  }
  
  return <PostClient username={username} slug={slug} />;
}
