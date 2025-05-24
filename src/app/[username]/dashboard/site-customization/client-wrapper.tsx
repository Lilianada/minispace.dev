'use client';

import { Suspense } from 'react';
import dynamic from 'next/dynamic';
import LoadingScreen from '@/components/LoadingScreen';

// Dynamic import in a client component is allowed to use ssr: false
const SiteCustomizationClientContent = dynamic(
  () => import('./page.client.fixed'),
  { 
    ssr: false,
    loading: () => (
      <div className="p-8">
        <LoadingScreen />
      </div>
    )
  }
);

export default function SiteCustomizationClientWrapper({ username }: { username: string }) {
  return (
    <Suspense fallback={<div className="p-8"><LoadingScreen /></div>}>
      <SiteCustomizationClientContent username={username} />
    </Suspense>
  );
}
