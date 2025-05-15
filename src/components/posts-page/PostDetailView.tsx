import Link from 'next/link';
import {
  Card, 
  CardContent,
  CardHeader,
  CardFooter
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { formatDate } from '@/lib/utils';
import PostStats from './PostStats';
import PostActions from './PostActions';

interface PostData {
  id: string;
  title: string;
  status: 'published' | 'draft';
  publishedAt?: string;
  updatedAt: string;
  contentHtml?: string;
  slug: string;
  tags?: string[];
  content: string;
  createdAt: string;
  views: number;
}

interface PostDetailViewProps {
  post: PostData;
}

export default function PostDetailView({ post }: PostDetailViewProps) {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight">{post.title}</h1>
          <p className="text-muted-foreground">
            {post.status === 'published' && post.publishedAt
              ? `Published on ${formatDate(post.publishedAt)}`
              : 'Draft'}
          </p>
        </div>
        <div className="flex space-x-2">
          <Button asChild variant="outline" className="hover:bg-accent hover:text-accent-foreground">
            <Link href={`/dashboard/posts/${post.id}/edit`}>Edit Post</Link>
          </Button>
          <PostActions post={post} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <h2 className="text-xl font-semibold">Post Preview</h2>
          </CardHeader>
          <CardContent>
            <div className="prose dark:prose-invert max-w-none">
              {/* If you have a markdown renderer component */}
              <div dangerouslySetInnerHTML={{ __html: post.contentHtml || 'No content available' }} />
            </div>
          </CardContent>
          <CardFooter className="border-t bg-muted/50">
            <div className="w-full flex justify-between items-center">
              <div className="text-sm text-muted-foreground">
                Last updated: {formatDate(post.updatedAt)}
              </div>
              {post.status === 'published' && post.slug && (
                <Button asChild variant="outline" size="sm" className="hover:bg-accent hover:text-accent-foreground">
                  <Link href={`/${post.slug}`} target="_blank">
                    View Live
                  </Link>
                </Button>
              )}
            </div>
          </CardFooter>
        </Card>

        <div className="space-y-6">
          <PostStats post={post} />
          
          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold">Post Details</h3>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-muted-foreground">Status</p>
                  <p>
                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      post.status === 'published'
                        ? 'bg-green-100 text-green-800 dark:bg-green-800/20 dark:text-green-400'
                        : 'bg-amber-100 text-amber-800 dark:bg-amber-800/20 dark:text-amber-400'
                    }`}>
                      {post.status === 'published' ? 'Published' : 'Draft'}
                    </span>
                  </p>
                </div>
                
                <div>
                  <p className="text-sm text-muted-foreground">URL Slug</p>
                  <p className="font-mono text-sm">{post.slug || 'Not set'}</p>
                </div>
                
                {post.tags && post.tags.length > 0 && (
                  <div>
                    <p className="text-sm text-muted-foreground">Tags</p>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {post.tags.map((tag) => (
                        <span 
                          key={tag}
                          className="inline-flex items-center rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}