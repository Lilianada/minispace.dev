import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function PostsNotFound() {
  return (
    <div className="container py-8 max-w-4xl mx-auto">
      <Alert variant="destructive" className="mb-6">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          The requested post could not be found.
        </AlertDescription>
      </Alert>

      <div className="flex flex-col items-center justify-center py-8">
        <h1 className="text-2xl font-bold mb-4">Post Not Found</h1>
        <p className="text-muted-foreground mb-6">
          The post you're looking for doesn't exist or may have been removed.
        </p>
        <div className="flex gap-4">
          <Link href="./posts">
            <Button variant="outline">Return to Posts</Button>
          </Link>
          <Link href="./posts/new-post">
            <Button>Create New Post</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}