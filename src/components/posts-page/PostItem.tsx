'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { formatDistanceToNow } from 'date-fns';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  MoreVertical, 
  Edit, 
  Eye, 
  Trash, 
  Globe, 
  FileText 
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { deletePost, updatePostStatus } from '@/lib/api/posts';
import { useToast } from '@/hooks/use-toast';
import { getDashboardPath } from '@/lib/route-utils';

interface Post {
  id: string;
  title: string;
  excerpt?: string;
  status: 'published' | 'draft';
  slug: string;
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
}

interface PostItemProps {
  post: Post;
  onRefresh: () => void;
}

export default function PostItem({ post, onRefresh }: PostItemProps) {
  const router = useRouter();
  const { toast } = useToast();
  
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isChangingStatus, setIsChangingStatus] = useState(false);
  
  const formattedDate = post.updatedAt
    ? formatDistanceToNow(new Date(post.updatedAt), { addSuffix: true })
    : 'Unknown date';
  
  const handleEdit = () => {
    const editUrl = getDashboardPath(`posts/${post.id}/edit`);
    router.push(editUrl);
  };
  
  const handleView = () => {
    if (post.status === 'published') {
      // If published, go to the public post view
      router.push(`/blog/${post.slug}`);
    } else {
      // If draft, go to the preview/review page
      const previewUrl = getDashboardPath(`posts/${post.id}`);
      router.push(previewUrl);
    }
  };
  
  const handleChangeStatus = async () => {
    try {
      setIsChangingStatus(true);
      const newStatus = post.status === 'published' ? 'draft' : 'published';
      
      await updatePostStatus(post.id, newStatus);
      
      toast({
        title: 'Success',
        description: newStatus === 'published' 
          ? 'Post published successfully' 
          : 'Post unpublished',
        variant: 'success',
      });
      
      onRefresh();
    } catch (error) {
      console.error('Error changing post status:', error);
      toast({
        title: 'Error',
        description: 'Failed to change post status',
        variant: 'destructive',
      });
    } finally {
      setIsChangingStatus(false);
    }
  };
  
  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      
      await deletePost(post.id);
      
      toast({
        title: 'Success',
        description: 'Post deleted successfully',
        variant: 'success',
      });
      
      setShowDeleteDialog(false);
      onRefresh();
    } catch (error) {
      console.error('Error deleting post:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete post',
        variant: 'destructive',
      });
    } finally {
      setIsDeleting(false);
    }
  };
  
  return (
    <>
      <Card>
        <CardContent className="p-4">
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h3 className="font-medium truncate">
                  {post.title || 'Untitled Post'}
                </h3>
                <Badge variant={post.status === 'published' ? 'default' : 'secondary'}>
                  {post.status === 'published' ? 'Published' : 'Draft'}
                </Badge>
              </div>
              
              <p className="text-sm text-muted-foreground truncate max-w-md">
                {post.excerpt || 'No excerpt available'}
              </p>
              
              <p className="text-xs text-muted-foreground">
                Updated {formattedDate}
              </p>
            </div>
            
            <div className="flex items-center gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleView}
                className="flex items-center gap-1"
              >
                {post.status === 'published' ? (
                  <>
                    <Globe className="h-4 w-4" />
                    View
                  </>
                ) : (
                  <>
                    <FileText className="h-4 w-4" />
                    Preview
                  </>
                )}
              </Button>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={handleEdit}>
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </DropdownMenuItem>
                  
                  <DropdownMenuItem onClick={handleView}>
                    <Eye className="h-4 w-4 mr-2" />
                    {post.status === 'published' ? 'View' : 'Preview'}
                  </DropdownMenuItem>
                  
                  <DropdownMenuItem 
                    onClick={handleChangeStatus}
                    disabled={isChangingStatus}
                  >
                    <Globe className="h-4 w-4 mr-2" />
                    {post.status === 'published' ? 'Unpublish' : 'Publish'}
                  </DropdownMenuItem>
                  
                  <DropdownMenuSeparator />
                  
                  <DropdownMenuItem 
                    onClick={() => setShowDeleteDialog(true)}
                    className="text-destructive"
                  >
                    <Trash className="h-4 w-4 mr-2" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete your post &quot;{post.title}&quot;. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? 'Deleting...' : 'Delete Post'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}