/* eslint-disable react/no-unescaped-entities */
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function PostNotFound() {
  return (
    <div className="flex flex-col items-center justify-center h-[60vh] text-center">
      <h2 className="text-2xl font-bold">Post Not Found</h2>
      <p className="text-muted-foreground mt-2 mb-6">
        The post you're looking for doesn't exist or has been removed.
      </p>
      <Button asChild>
        <Link href="/dashboard/posts">
          Back to Posts
        </Link>
      </Button>
    </div>
  );
}