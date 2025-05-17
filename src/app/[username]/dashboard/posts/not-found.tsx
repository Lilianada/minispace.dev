/* eslint-disable react/no-unescaped-entities */
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { getDashboardPath } from '@/lib/route-utils';

export default function PostNotFound() {
  // Redirect to dashboard if user is logged in
  const dashboardUrl = getDashboardPath();
  if (dashboardUrl !== '/signin?redirect=dashboard') {
    if (typeof window !== 'undefined') {
      window.location.href = dashboardUrl;
    }
  }
  return (
    <div className="flex flex-col items-center justify-center h-[60vh] text-center">
      <h2 className="text-2xl font-bold">Post Not Found</h2>
      <p className="text-muted-foreground mt-2 mb-6">
        The page you're looking for doesn't exist or has been removed.
      </p>
      <Button asChild>
        <Link href={dashboardUrl} className="w-full">
          <span className="hidden md:inline">Go to Dashboard</span>
        </Link>
      </Button>
    </div>
  );
}