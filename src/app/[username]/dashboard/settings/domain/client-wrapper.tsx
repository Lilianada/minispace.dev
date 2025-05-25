'use client';

import { Suspense } from 'react';
import dynamic from 'next/dynamic';
import LoadingScreen from '@/components/LoadingScreen';

// Dynamic import in a client component is allowed to use ssr: false
const DomainSettingsClientContent = dynamic(
  () => import('./page.client'),
  { 
    ssr: false,
    loading: () => (
      <div className="p-8">
        <LoadingScreen />
      </div>
    )
  }
);

export default function DomainSettingsClientWrapper({ params }: { params: { username: string } }) {
  return (
    <Suspense fallback={<LoadingScreen />}>
      <DomainSettingsClientContent params={params} />
    </Suspense>
  );
}
