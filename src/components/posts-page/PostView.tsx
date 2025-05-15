'use client';

import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

interface PostViewProps {
  post: {
    id: string;
    title: string;
    content: string;
    slug: string;
    excerpt?: string;
    tags?: string[];
    status: 'published' | 'draft';
    createdAt: string;
    updatedAt: string;
    views: number;
  };
}

export default function PostView({ post }: PostViewProps) {
  // Format date to a readable format
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{post.title}</h1>
          <div className="flex items-center space-x-2 mt-2 text-muted-foreground">
            <Badge variant={post.status === 'published' ? 'default' : 'outline'}>
              {post.status === 'published' ? 'Published' : 'Draft'}
            </Badge>
            <span>•</span>
            <span>{formatDate(post.createdAt)}</span>
            <span>•</span>
            <span>{post.views} views</span>
          </div>
        </div>
        
        <div className="flex gap-2">
          <Button asChild variant="outline">
            <Link href={`/dashboard/posts/${post.id}/edit`}>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 mr-2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125" />
              </svg>
              Edit
            </Link>
          </Button>
          <Button asChild>
            <Link href={`/${post.slug}`} target="_blank">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 mr-2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
              </svg>
              View Live
            </Link>
          </Button>
        </div>
      </div>
      
      {post.excerpt && (
        <Card>
          <CardContent className="pt-6">
            <p className="text-muted-foreground italic">{post.excerpt}</p>
          </CardContent>
        </Card>
      )}
      
      <Card>
        <CardContent className="pt-6">
          <div className="prose prose-sm dark:prose-invert max-w-none">
            <ReactMarkdown>{post.content}</ReactMarkdown>
          </div>
        </CardContent>
        
        {post.tags && post.tags.length > 0 && (
          <>
            <Separator />
            <CardFooter className="pt-6">
              <div className="flex flex-wrap gap-2">
                {post.tags.map(tag => (
                  <Badge key={tag} variant="secondary">
                    {tag}
                  </Badge>
                ))}
              </div>
            </CardFooter>
          </>
        )}
      </Card>
    </div>
  );
}