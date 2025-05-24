import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import LoadingScreen from '@/components/LoadingScreen';

// Import the client wrapper instead of using dynamic directly in server component
import SiteCustomizationClientWrapper from './client-wrapper';

export const metadata: Metadata = {
  title: 'Site Customization | Minispace',
  description: 'Customize your personal site on Minispace',
};

interface SiteCustomizationPageProps {
  params: Promise<{
    username: string;
  }>;
}

export default async function SiteCustomizationPage({ params }: SiteCustomizationPageProps) {
  // Await the params object before destructuring
  const resolvedParams = await params;
  const { username } = resolvedParams;
  
  if (!username) {
    return notFound();
  }
  
  console.log(`Rendering site customization page for user: ${username}`);
  
  // Use the client wrapper component
  return <SiteCustomizationClientWrapper username={username} />;
}
