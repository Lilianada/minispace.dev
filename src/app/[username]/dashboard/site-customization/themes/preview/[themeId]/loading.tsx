'use client';

import { Skeleton } from '@/components/ui/skeleton';

export default function ThemePreviewLoading() {
  return (
    <div className="flex flex-col h-screen">
      <div className="flex items-center justify-between p-4 border-b bg-background">
        <div>
          <Skeleton className="h-6 w-48 mb-2" />
          <Skeleton className="h-4 w-64" />
        </div>
        <div className="flex gap-2">
          <Skeleton className="h-10 w-32" />
          <Skeleton className="h-10 w-32" />
        </div>
      </div>
      
      <div className="flex-1 p-8">
        <div className="max-w-4xl mx-auto">
          <Skeleton className="h-64 w-full mb-8" />
          <div className="space-y-4">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
          </div>
        </div>
      </div>
    </div>
  );
}
