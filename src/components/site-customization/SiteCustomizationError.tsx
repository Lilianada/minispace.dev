'use client';

import { Alert, AlertDescription } from '@/components/ui/alert';

interface SiteCustomizationErrorProps {
  error: string;
}

export default function SiteCustomizationError({ error }: SiteCustomizationErrorProps) {
  return (
    <div className="container py-8">
      <Alert variant="destructive">
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    </div>
  );
}
