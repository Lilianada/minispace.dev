import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { formatDate } from '@/lib/utils';
import { getDashboardPath } from '@/lib/route-utils';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import DeletePostDialog from './DeletePostDialog';

interface PostCardProps {
  post: {
    id: string;
    title: string;
    excerpt?: string;
    status: 'published' | 'draft';
    publishedAt?: string;
    updatedAt: string;
    slug?: string;
    tags?: string[];
    views?: number;
    comments?: number;
  };
}

export default function PostCard({ post }: PostCardProps) {
  const router = useRouter();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  // Function to format the post status with appropriate styling
  const getStatusDisplay = () => {
    if (post.status === 'published') {
      return (
        <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800 dark:bg-green-800/20 dark:text-green-400">
          Published
        </span>
      );
    }
    return (
      <span className="inline-flex items-center rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-medium text-amber-800 dark:bg-amber-800/20 dark:text-amber-400">
        Draft
      </span>
    );
  };

  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow">
      <CardContent className="p-0">
        <div className="flex flex-col md:flex-row">
          <div className="flex-1 p-6">
            <div className="flex items-center justify-between mb-2">
              {getStatusDisplay()}
              <span className="text-xs text-muted-foreground">
                {post.updatedAt ? `Updated ${formatDate(post.updatedAt)}` : ''}
              </span>
            </div>
            <Link 
              href={getDashboardPath(`posts/${post.id}`)}
              className="hover:underline"
            >
              <h3 className="text-lg font-semibold mb-2">{post.title}</h3>
            </Link>
            {post.excerpt && (
              <p className="text-muted-foreground text-sm line-clamp-2 mb-4">
                {post.excerpt}
              </p>
            )}
            <div className="flex items-center text-xs text-muted-foreground space-x-4">
              {post.publishedAt && (
                <span>Published: {formatDate(post.publishedAt)}</span>
              )}
              {post.views !== undefined && (
                <span className="flex items-center">
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    viewBox="0 0 20 20" 
                    fill="currentColor" 
                    className="w-4 h-4 mr-1"
                  >
                    <path d="M10 12.5a2.5 2.5 0 100-5 2.5 2.5 0 000 5z" />
                    <path fillRule="evenodd" d="M.664 10.59a1.651 1.651 0 010-1.186A10.004 10.004 0 0110 3c4.257 0 7.893 2.66 9.336 6.41.147.381.146.804 0 1.186A10.004 10.004 0 0110 17c-4.257 0-7.893-2.66-9.336-6.41zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                  </svg>
                  {post.views}
                </span>
              )}
              {post.comments !== undefined && (
                <span className="flex items-center">
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    viewBox="0 0 20 20" 
                    fill="currentColor" 
                    className="w-4 h-4 mr-1"
                  >
                    <path fillRule="evenodd" d="M10 2c-2.236 0-4.43.18-6.57.524C1.993 2.755 1 4.014 1 5.426v5.148c0 1.413.993 2.67 2.43 2.902 1.168.188 2.352.327 3.55.414.28.02.521.18.642.413l1.713 3.293a.75.75 0 001.33 0l1.713-3.293a.783.783 0 01.642-.413 41.102 41.102 0 003.55-.414c1.437-.231 2.43-1.49 2.43-2.902V5.426c0-1.413-.993-2.67-2.43-2.902A41.289 41.289 0 0010 2zM6.75 6a.75.75 0 000 1.5h6.5a.75.75 0 000-1.5h-6.5zm0 2.5a.75.75 0 000 1.5h3.5a.75.75 0 000-1.5h-3.5z" clipRule="evenodd" />
                  </svg>
                  {post.comments}
                </span>
              )}
            </div>
          </div>
          <div className="flex md:flex-col justify-end items-center gap-2 p-4 bg-muted/20">
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full hover:bg-accent hover:text-accent-foreground" 
              asChild
            >
              <Link href={post.slug ? `/preview/${post.slug}` : getDashboardPath(`posts/${post.id}`)}>
                Preview
              </Link>
            </Button>
            <Button 
              variant="default" 
              size="sm" 
              className="w-full hover:bg-primary/90" 
              asChild
            >
              <Link href={getDashboardPath(`posts/${post.id}/edit`)}>
                Edit
              </Link>
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    viewBox="0 0 20 20" 
                    fill="currentColor" 
                    className="w-5 h-5"
                  >
                    <path d="M3 10a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0zM8.5 10a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0zM15.5 8.5a1.5 1.5 0 100 3 1.5 1.5 0 000-3z" />
                  </svg>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem 
                  onClick={() => {
                    // Copy post URL to clipboard
                    navigator.clipboard.writeText(
                      `${window.location.origin}/${post.slug || post.id}`
                    );
                  }}
                >
                  Copy URL
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => post.status === 'published' 
                    ? router.push(getDashboardPath(`posts/${post.id}/unpublish`)) 
                    : router.push(getDashboardPath(`posts/${post.id}/publish`))
                  }
                >
                  {post.status === 'published' ? 'Unpublish' : 'Publish'}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  className="text-destructive focus:text-destructive"
                  onClick={() => setIsDeleteDialogOpen(true)}
                >
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardContent>
      
      <DeletePostDialog 
        postId={post.id}
        postTitle={post.title}
        open={isDeleteDialogOpen}
        onOpenChange={() => setIsDeleteDialogOpen(false)}
      />
    </Card>
  );
}