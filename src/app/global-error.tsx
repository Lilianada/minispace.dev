'use client';
 
import { Button } from '@/components/ui/button';
import Link from 'next/link';
 
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html>
      <body>
        <div className="flex flex-col items-center justify-center min-h-screen p-4">
          <h1 className="text-4xl font-bold mb-4">Something went wrong</h1>
          <p className="text-muted-foreground mb-8 text-center max-w-md">
            We apologize for the inconvenience. Please try again later.
          </p>
          <div className="flex gap-4">
            <Button onClick={() => reset()}>Try again</Button>
            <Button variant="outline" asChild>
              <Link href="/">Return Home</Link>
            </Button>
          </div>
        </div>
      </body>
    </html>
  );
}
