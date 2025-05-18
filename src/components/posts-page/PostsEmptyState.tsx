'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { getDashboardPath } from '@/lib/route-utils';

interface PostsEmptyStateProps {
  title?: string;
  message?: string;
  showCreateButton?: boolean;
  showRefreshButton?: boolean;
  onRefresh?: () => void;
  error?: boolean;
  indexUrl?: string | null;
}

export default function PostsEmptyState({
  title = 'No posts found',
  message = 'You haven\'t created any posts yet',
  showCreateButton = true,
  showRefreshButton = true,
  onRefresh,
  error = false,
  indexUrl = null
}: PostsEmptyStateProps) {
  const router = useRouter();

  const handleCreatePost = () => {
    router.push(getDashboardPath('posts/new-post'));
  };

  return (
    <div className={`text-center py-10 border border-dashed rounded-md ${error ? 'border-destructive/50' : ''}`}>
      <h3 className={`text-lg font-medium mb-2 ${error ? 'text-destructive' : ''}`}>
        {title}
      </h3>
      <p className="text-muted-foreground mb-4 max-w-md mx-auto">
        {message}
      </p>
      
      {indexUrl && (
        <div className="mb-6">
          <a 
            href={indexUrl} 
            target="_blank" 
            rel="noopener noreferrer"
            className="bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-md text-sm font-medium inline-block"
          >
            Create Required Index
          </a>
          <p className="text-xs text-muted-foreground mt-2">
            Click the button above to create the required database index in the Firebase console.
          </p>
        </div>
      )}
      
      <div className="flex justify-center gap-4">
        {showRefreshButton && (
          <Button 
            variant="outline" 
            onClick={() => {
              if (onRefresh) {
                onRefresh();
              } else {
                router.refresh();
              }
            }}
          >
            Refresh
          </Button>
        )}
        
        {showCreateButton && (
          <Button onClick={handleCreatePost}>
            Create New Post
          </Button>
        )}
      </div>
    </div>
  );
}
