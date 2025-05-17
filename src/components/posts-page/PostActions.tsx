'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { getDashboardPath } from '@/lib/route-utils';
import DeletePostDialog from './DeletePostDialog';
import { Post } from '@/lib/api/posts';

interface PostActionsProps {
  post: Post;
}

export default function PostActions({ post }: PostActionsProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  // Handle publish/unpublish action
  const handlePublishToggle = async () => {
    setIsLoading(true);
    try {
      const action = post.status === 'published' ? 'unpublish' : 'publish';
      const response = await fetch(`/api/posts/${post.id}/${action}`, {
        method: 'PUT',
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || `Failed to ${action} post`);
      }

      toast({
        title: post.status === 'published' ? "Post unpublished" : "Post published",
        description: post.status === 'published' 
          ? "Your post has been unpublished." 
          : "Your post has been published and is now live.",
      });
      
      router.refresh();
    } catch (error) {
      console.error(`Error ${post.status === 'published' ? 'unpublishing' : 'publishing'} post:`, error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "An error occurred",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Button
        variant={post.status === 'published' ? 'outline' : 'default'}
        onClick={handlePublishToggle}
        disabled={isLoading}
      >
        {isLoading 
          ? "Processing..."
          : post.status === 'published' 
            ? "Unpublish" 
            : "Publish"
        }
      </Button>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="icon">
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
          <DropdownMenuItem onClick={() => router.push(getDashboardPath(`posts/${post.id}/edit`))}>
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => {
            // Copy post URL to clipboard
            navigator.clipboard.writeText(
              `${window.location.origin}/${post.slug || post.id}`
            );
            toast({
              title: "Link copied",
              description: "Post URL copied to clipboard",
            });
          }}>
            Copy URL
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

      <DeletePostDialog
        postId={post.id}
        postTitle={post.title}
        open={isDeleteDialogOpen}
        onOpenChange={() => setIsDeleteDialogOpen(false)}
      />
    </>
  );
}