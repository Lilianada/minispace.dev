import { Metadata } from 'next';
import { Suspense } from 'react';
import LoadingScreen from '@/components/LoadingScreen';
import AnalyticsClientWrapper from './client-wrapper';

export const metadata: Metadata = {
  title: 'Site Customization | Minispace',
  description: 'Customize your personal site theme, content, and settings on Minispace',
};

export default async function Analytics({ params }: { params: Promise<{ username: string }> }) {
  const resolvedParams = await params;
  
  return (
    <Suspense fallback={<LoadingScreen />}>
      <AnalyticsClientWrapper params={resolvedParams} />
    </Suspense>
  );
}
