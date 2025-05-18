'use client';

import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Loader } from '@/components/ui/loader';
import { updatePostStatus } from '@/lib/api/posts';
import { PostsData } from '@/hooks/usePosts';
import { KeyedMutator } from "swr";

interface Post {
  id: string;
  status: 'published' | 'draft';
}

interface PostStatusToggleProps {
  post: Post;
  isUpdating: boolean;
  setIsUpdating: (id: string | null) => void;
   mutate: KeyedMutator<PostsData>;
}

export default function PostStatusToggle({ 
  post, 
  isUpdating, 
  setIsUpdating,
  mutate 
}: PostStatusToggleProps) {
  const handleStatusToggle = async () => {
    setIsUpdating(post.id);
    try {
      const newStatus = post.status === 'published' ? 'draft' : 'published';
      await updatePostStatus(post.id, newStatus);
      
      // Update local data without a full refetch
      await mutate(
           (currentData: PostsData | undefined) => {
          if (!currentData) return currentData;
          
          return {
            ...currentData,
            posts: currentData.posts.map((p) => 
              p.id === post.id ? { ...p, status: newStatus } : p
            )
          };
        }, 
        false
      );
      
      // Then refetch to ensure we have the latest data
      await mutate();
    } catch (err) {
      console.error('Failed to update post status:', err);
    } finally {
      setIsUpdating(null);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <Tooltip>
        <TooltipTrigger asChild>
          <Switch
            checked={post.status === 'published'}
            disabled={isUpdating}
            onCheckedChange={handleStatusToggle}
            aria-label={`Toggle post status to ${post.status === 'published' ? 'draft' : 'published'}`}
          />
        </TooltipTrigger>
        <TooltipContent>
          {post.status === 'published' ? 'Set to draft' : 'Publish post'}
        </TooltipContent>
      </Tooltip>
      <Badge variant={post.status === 'published' ? 'default' : 'outline'}>
        {post.status === 'published' ? 'Published' : 'Draft'}
      </Badge>
      {isUpdating && (
        <span className="ml-2 inline-block">
          <Loader size="sm" />
        </span>
      )}
    </div>
  );
}