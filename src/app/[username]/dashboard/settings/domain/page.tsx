import { Metadata } from 'next';
import { Suspense } from 'react';
import LoadingScreen from '@/components/LoadingScreen';
import DomainSettingsClientWrapper from './client-wrapper';

export const metadata: Metadata = {
  title: 'Domain Settings | Minispace',
  description: 'Configure your domain settings for your Minispace site'
};

export default async function DomainSettingsPage({ params }: { params: Promise<{ username: string }> }) {
  const resolvedParams = await params;
  
  return (
    <Suspense fallback={<LoadingScreen />}>
      <DomainSettingsClientWrapper params={resolvedParams} />
    </Suspense>
  );
}
