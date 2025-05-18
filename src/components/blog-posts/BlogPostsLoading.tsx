'use client';

import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';

interface BlogPostsLoadingProps {
  count?: number;
}

export default function BlogPostsLoading({ count = 3 }: BlogPostsLoadingProps) {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-6">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-10 w-32" />
      </div>
      
      <div className="flex gap-4 mb-6">
        <Skeleton className="h-10 w-24" />
        <Skeleton className="h-10 w-24" />
        <Skeleton className="ml-auto h-10 w-64" />
      </div>
      
      {Array(count).fill(0).map((_, i) => (
        <Card key={i} className="p-4 mb-4">
          <div className="flex justify-between">
            <div className="space-y-2 w-full max-w-md">
              <div className="flex items-center gap-2">
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-5 w-16" />
              </div>
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-3 w-24" />
            </div>
            <div className="flex items-center gap-2">
              <Skeleton className="h-9 w-20" />
              <Skeleton className="h-9 w-9 rounded-md" />
            </div>
          </div>
        </Card>
      ))}
      
      <div className="mt-8 text-center">
        <p className="text-sm text-muted-foreground mb-4">Loading posts...</p>
        <Button variant="outline" disabled>
          <Skeleton className="h-4 w-24" />
        </Button>
      </div>
    </div>
  );
}
