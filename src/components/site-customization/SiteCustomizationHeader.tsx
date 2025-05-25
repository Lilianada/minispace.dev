'use client';

import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useRouter } from 'next/navigation';

interface SiteCustomizationHeaderProps {
  successMessage: string | null;
  params: { username: string };
  saving: boolean;
  onSave: () => void;
}

export default function SiteCustomizationHeader({ 
  successMessage, 
  params, 
  saving, 
  onSave 
}: SiteCustomizationHeaderProps) {
  const router = useRouter();

  return (
    <>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Blog Customization</h1>
        <p className="text-gray-600">Customize your personal blog's appearance, content, and layout.</p>
      </div>

      {successMessage && (
        <Alert className="mb-6">
          <AlertDescription>{successMessage}</AlertDescription>
        </Alert>
      )}
    </>
  );
}

// Separate component for the footer actions
export function SiteCustomizationActions({ 
  params, 
  saving, 
  onSave 
}: Omit<SiteCustomizationHeaderProps, 'successMessage'>) {
  const router = useRouter();

  return (
    <div className="mt-8 flex justify-between">
      <Button variant="outline" onClick={() => router.back()}>
        Back to Dashboard
      </Button>
      <div className="flex gap-2">
        <Button variant="outline" asChild>
          <a href={`/${params.username}`} target="_blank" rel="noopener noreferrer">
            Preview Blog
          </a>
        </Button>
        <Button onClick={onSave} disabled={saving}>
          {saving ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>
    </div>
  );
}
